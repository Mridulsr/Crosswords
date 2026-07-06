import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

import { OFFLINE_WORDS, OFFLINE_DEFINITIONS, FORBIDDEN_SHORT_FORMS, getOfflineWord } from "./src/utils/offlineDictionary";

// In-Memory Caches to completely solve quota limits across game sessions
const lookupCache = new Map<string, any>();
const hintCache = new Map<string, any>();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
let isGeminiQuotaExceeded = false;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully in full-stack server.");
  } catch (error) {
    console.warn("Failed to initialize Gemini Client, falling back to local database:", error);
  }
} else {
  console.log("Gemini API key not found in environment. Using rich local dictionaries as fallback.");
}

// Resilient API wrapper with automatic exponential backoff retry for transient errors (like 503 UNAVAILABLE or demand spikes)
async function generateContentWithRetry(params: any, retries = 3, delayMs = 1000): Promise<any> {
  if (!ai) {
    throw new Error("Gemini AI Client is not initialized.");
  }
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent(params);
      return response;
    } catch (error: any) {
      const errStr = String(error?.message || error).toLowerCase();
      
      // Determine if it is a hard quota/limit error (do not retry, fail fast)
      const isQuota = errStr.includes("429") || errStr.includes("quota") || errStr.includes("resource_exhausted") || errStr.includes("limit: 20") || errStr.includes("exhausted");
      if (isQuota) {
        isGeminiQuotaExceeded = true;
        throw error; // Fail-fast so local fallbacks trigger instantly
      }

      const isTransient = errStr.includes("503") || errStr.includes("unavailable") || errStr.includes("service unavailable") || errStr.includes("demand") || errStr.includes("rate limit");
      if (isTransient && attempt < retries) {
        const nextDelay = delayMs * Math.pow(2, attempt - 1);
        console.warn(`[Gemini Retry] Attempt ${attempt} failed with transient error: ${error?.message || error}. Retrying in ${nextDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, nextDelay));
      } else {
        throw error;
      }
    }
  }
}

// 1. Dictionary Lookup Endpoint (Uses Gemini or standard offline lookup)
app.post("/api/dictionary/lookup", async (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== "string") {
    return res.status(400).json({ error: "Word is required and must be a string." });
  }

  const cleanedWord = word.trim().toLowerCase();

  // 0. Check forbidden short forms first
  if (FORBIDDEN_SHORT_FORMS.has(cleanedWord)) {
    const result = {
      isValid: false,
      word: cleanedWord,
      partOfSpeech: "",
      definition: "This is a forbidden short-form abbreviation.",
      reason: "Short-forms/abbreviations (like TIA, TIAP, LOP, ONL, NONL, NONLP, ENONLP) are strictly disallowed and will trigger a point penalty!"
    };
    return res.json(result);
  }

  // 1. Check in-memory Cache first to prevent redundant Gemini hits
  if (lookupCache.has(cleanedWord)) {
    return res.json(lookupCache.get(cleanedWord));
  }

  // 2. Check offline comprehensive dictionary matching first
  const offlineMatch = getOfflineWord(cleanedWord);
  if (offlineMatch) {
    lookupCache.set(cleanedWord, offlineMatch);
    return res.json(offlineMatch);
  }

  // 3. Fall back to Gemini only if not cached and not in our rich offline list
  if (ai) {
    try {
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: `Check if "${cleanedWord}" is a valid, standard English word. Produce a JSON response according to the requested schema. Proper nouns, acronyms, and slang that are not in standard dictionaries should be marked as invalid.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: {
                type: Type.BOOLEAN,
                description: "True if this is a standard English word suitable for a spelling game.",
              },
              word: {
                type: Type.STRING,
                description: "The checked word in its clean form.",
              },
              partOfSpeech: {
                type: Type.STRING,
                description: "E.g., noun, verb, adjective, adverb, or empty if invalid.",
              },
              definition: {
                type: Type.STRING,
                description: "A clear, concise dictionary definition of the word.",
              },
              funFact: {
                type: Type.STRING,
                description: "An interesting fact, etymology, or spelling trick for the word.",
              },
              reason: {
                type: Type.STRING,
                description: "If invalid, why is it invalid? (e.g., 'not a real word', 'abbreviation'). If valid, can be left empty.",
              },
            },
            required: ["isValid", "word", "definition"],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        lookupCache.set(cleanedWord, parsed);
        return res.json(parsed);
      }
    } catch (error: any) {
      const isQuota = error?.message?.includes("429") || error?.message?.includes("quota") || error?.status === "RESOURCE_EXHAUSTED";
      if (isQuota) {
        console.warn(`[Gemini Quota Exceeded] Word lookup for "${cleanedWord}" fell back gracefully to resilient local dictionary.`);
      } else {
        console.warn(`[Gemini Lookup Fallback] Word lookup for "${cleanedWord}" fell back to local dictionary. Error: ${error?.message || error}`);
      }
    }
  }

  // 4. Strict offline fallback check when Gemini is exhausted/rate-limited or offline.
  // Instead of accepting any gibberish, we only accept words verified in our rich offline list.
  const result = {
    isValid: false,
    word: cleanedWord,
    partOfSpeech: "",
    definition: "Word unrecognized in offline dictionary mode.",
    funFact: "",
    reason: `In offline mode (due to Gemini quota limits), only standard dictionary words present in our verified list are recognized. Unofficial words like "${cleanedWord}" are not permitted.`
  };

  lookupCache.set(cleanedWord, result);
  return res.json(result);
});

// 2. AI Opponent Turn Generator Endpoint
app.post("/api/game/ai-move", async (req, res) => {
  const { board, difficulty, alreadyPlayedWords, currentSequence } = req.body;
  // board: (string | null)[] (Length 1000 representing a 40x25 grid)
  // difficulty: "easy" | "medium" | "hard"
  // alreadyPlayedWords: array of strings e.g. ["BUS"]

  const playedWordsSet = new Set((alreadyPlayedWords || []).map((w: string) => w.toLowerCase()));

  // Fallback to reconstruct board from currentSequence if board is missing
  let activeBoard: (string | null)[] = board;
  if (!activeBoard) {
    if (currentSequence && currentSequence.length > 0) {
      activeBoard = [...currentSequence];
    } else {
      activeBoard = Array(1000).fill(null);
    }
  }

  // Find non-empty characters and their contiguous chunks
  const isBoardEmpty = activeBoard.every(cell => cell === null);

  const getColLabel = (c: number) => {
    if (c < 26) return String.fromCharCode(65 + c);
    return "A" + String.fromCharCode(65 + (c - 26));
  };

  const activeCells: { index: number; coordinate: string; letter: string }[] = [];
  for (let i = 0; i < activeBoard.length; i++) {
    if (activeBoard[i] !== null) {
      const r = Math.floor(i / 40);
      const c = i % 40;
      activeCells.push({
        index: i,
        coordinate: `${getColLabel(c)}${25 - r}`,
        letter: activeBoard[i]!
      });
    }
  }

  if (ai) {
    try {
      const prompt = `
        You are playing LetterForge on a massive 40 columns x 25 rows grid (1000 squares in total, indexed 0 to 999).
        Row index r goes 0 to 24, Column index c goes 0 to 39. Flat index = r * 40 + c.
        Columns A-Z correspond to 0-25, and AA-AN correspond to 26-39. Ranks are numbered 1 to 25 (where Rank 25 is Row 0, Rank 1 is Row 24).
        
        Currently filled squares: ${JSON.stringify(activeCells)} (all other indices are empty).
        Rules:
        - A player can place exactly ONE uppercase letter (A-Z) at ANY empty cell index (0 to 999).
        - Placing a letter should form or extend a contiguous block of letters HORIZONTALLY or VERTICALLY that creates a valid standard English word (preferably 3 or more letters). Words can be spelled forwards or backwards (for example, "TAE" on the board forms "EAT" when read backwards, which is valid and scores points based on the length of "EAT").
        - Already played words in this session: [${Array.from(playedWordsSet).join(", ")}]. Avoid repeating these if possible.
        - Difficulty: ${difficulty || "medium"}.
          - Easy: Plays letters somewhat randomly, forms short 3-letter words.
          - Medium: Makes smart moves, forms words of 3-5 letters.
          - Hard: Extremely tactical. Forms long words, blocks the player, or leaves difficult letters.

        Choose exactly ONE empty cell index (0 to 999) to place exactly ONE uppercase letter (A-Z).
        Format your response as a JSON object with:
        "boxIdx" (integer representing the 0-indexed cell position from 0 to 999, MUST be an empty cell currently),
        "letter" (a single uppercase character A-Z),
        "targetWord" (the contiguous horizontal or vertical word that is formed or built towards),
        "explanation" (brief, playful description of the move).
      `;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              boxIdx: {
                type: Type.INTEGER,
                description: "The 0-based index of the empty cell (0-999) to place the letter in.",
              },
              letter: {
                type: Type.STRING,
                description: "Exactly one uppercase letter (A-Z).",
              },
              targetWord: {
                type: Type.STRING,
                description: "The word formed or completed by this placement.",
              },
              explanation: {
                type: Type.STRING,
                description: "A short explanation of why the computer chose this move.",
              },
            },
            required: ["boxIdx", "letter", "targetWord", "explanation"],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        const selectedIdx = Number(parsed.boxIdx);
        // Ensure index is valid and empty
        if (selectedIdx >= 0 && selectedIdx < activeBoard.length && activeBoard[selectedIdx] === null) {
          parsed.boxIdx = selectedIdx;
          parsed.letter = parsed.letter.toUpperCase().substring(0, 1);
          return res.json(parsed);
        }
      }
    } catch (error: any) {
      const isQuota = error?.message?.includes("429") || error?.message?.includes("quota") || error?.status === "RESOURCE_EXHAUSTED";
      if (isQuota) {
        console.warn("[Gemini Quota Exceeded] AI move fell back gracefully to resilient local strategy.");
      } else {
        console.warn(`[Gemini AI Move Fallback] fell back to local strategy. Error: ${error?.message || error}`);
      }
    }
  }

  // Fallback offline AI move generator for 40x25 grid
  const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
  let bestBoxIdx = 500; // Center-ish of 1000 grid (Row 12, Col 20)
  let bestLetter = "E";
  let targetWord = "E";
  let found = false;

  if (isBoardEmpty) {
    const starters = ["B", "C", "M", "S", "T", "P"];
    bestLetter = starters[Math.floor(Math.random() * starters.length)];
    bestBoxIdx = 500;
    targetWord = bestLetter;
  } else {
    // Try to find an empty box adjacent (Up, Down, Left, Right) to an existing letter to form a valid offline word
    for (let i = 0; i < activeBoard.length; i++) {
      if (activeBoard[i] !== null) continue; // must be empty

      const r = Math.floor(i / 40);
      const c = i % 40;

      const hasUp = r > 0 && activeBoard[(r - 1) * 40 + c] !== null;
      const hasDown = r < 24 && activeBoard[(r + 1) * 40 + c] !== null;
      const hasLeft = c > 0 && activeBoard[r * 40 + (c - 1)] !== null;
      const hasRight = c < 39 && activeBoard[r * 40 + (c + 1)] !== null;
      
      const isAdjacent = hasUp || hasDown || hasLeft || hasRight;
      if (!isAdjacent) continue;

      for (const char of alphabet) {
        const tempBoard = [...activeBoard];
        tempBoard[i] = char;

        // Check horizontal word formed around cell
        let left = c;
        while (left > 0 && tempBoard[r * 40 + (left - 1)] !== null) left--;
        let right = c;
        while (right < 39 && tempBoard[r * 40 + (right + 1)] !== null) right++;

        const hWordList = [];
        for (let colIdx = left; colIdx <= right; colIdx++) hWordList.push(tempBoard[r * 40 + colIdx]);
        const hWord = hWordList.join("").toLowerCase();

        // Check vertical word formed around cell
        let up = r;
        while (up > 0 && tempBoard[(up - 1) * 40 + c] !== null) up--;
        let down = r;
        while (down < 24 && tempBoard[(down + 1) * 40 + c] !== null) down++;

        const vWordList = [];
        for (let rowIdx = up; rowIdx <= down; rowIdx++) vWordList.push(tempBoard[rowIdx * 40 + c]);
        const vWord = vWordList.join("").toLowerCase();

        if (hWord.length >= 3 && OFFLINE_WORDS.has(hWord) && !playedWordsSet.has(hWord)) {
          bestBoxIdx = i;
          bestLetter = char;
          targetWord = hWord;
          found = true;
          break;
        }

        if (vWord.length >= 3 && OFFLINE_WORDS.has(vWord) && !playedWordsSet.has(vWord)) {
          bestBoxIdx = i;
          bestLetter = char;
          targetWord = vWord;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      for (let i = 0; i < activeBoard.length; i++) {
        if (activeBoard[i] !== null) continue;
        const r = Math.floor(i / 40);
        const c = i % 40;
        const isAdjacent = (r > 0 && activeBoard[(r - 1) * 40 + c] !== null) ||
                           (r < 24 && activeBoard[(r + 1) * 40 + c] !== null) ||
                           (c > 0 && activeBoard[r * 40 + (c - 1)] !== null) ||
                           (c < 39 && activeBoard[r * 40 + (c + 1)] !== null);
        if (isAdjacent) {
          bestBoxIdx = i;
          bestLetter = ["E", "A", "O", "T", "I", "S", "R", "N"][Math.floor(Math.random() * 8)];
          targetWord = bestLetter;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      const emptyIdx = activeBoard.indexOf(null);
      if (emptyIdx !== -1) {
        bestBoxIdx = emptyIdx;
        bestLetter = "A";
        targetWord = "A";
      }
    }
  }

  const rFinal = Math.floor(bestBoxIdx / 40);
  const cFinal = bestBoxIdx % 40;
  const squareCoordinate = `${getColLabel(cFinal)}${25 - rFinal}`;

  return res.json({
    boxIdx: bestBoxIdx,
    letter: bestLetter.toUpperCase(),
    targetWord: targetWord.toUpperCase(),
    explanation: `I placed '${bestLetter.toUpperCase()}' in Square ${squareCoordinate} (index ${bestBoxIdx}) to form or work towards "${targetWord.toUpperCase()}"!`
  });
});

// 3. AI Hint Endpoint
app.post("/api/game/ai-hint", async (req, res) => {
  const { board, alreadyPlayedWords, currentSequence } = req.body;

  let activeBoard: (string | null)[] = board;
  if (!activeBoard) {
    if (currentSequence && currentSequence.length > 0) {
      activeBoard = [...currentSequence];
    } else {
      activeBoard = Array(1000).fill(null);
    }
  }

  // Check hintCache using board layout hash
  const boardHash = activeBoard.map(cell => cell || "-").join("");
  if (hintCache.has(boardHash)) {
    return res.json(hintCache.get(boardHash));
  }

  const isBoardEmpty = activeBoard.every(cell => cell === null);

  const getColLabel = (c: number) => {
    if (c < 26) return String.fromCharCode(65 + c);
    return "A" + String.fromCharCode(65 + (c - 26));
  };

  const activeCells: { index: number; coordinate: string; letter: string }[] = [];
  for (let i = 0; i < activeBoard.length; i++) {
    if (activeBoard[i] !== null) {
      const r = Math.floor(i / 40);
      const c = i % 40;
      activeCells.push({
        index: i,
        coordinate: `${getColLabel(c)}${25 - r}`,
        letter: activeBoard[i]!
      });
    }
  }

  if (ai) {
    try {
      const prompt = `
        We are playing LetterForge on a 40 columns x 25 rows grid (1000 squares).
        Current filled squares: ${JSON.stringify(activeCells)} (all other slots are empty).
        Suggest 3 valid standard English words that can be created or extended by placing letters in the empty cells horizontally or vertically.
        Format your response as a JSON array of suggestions, each with:
        "suggestedWord" (uppercase string),
        "howToBuild" (string explaining which coordinate to target and what letter to write, e.g. 'Place T at Square E12 to make CAT'),
        "points" (integer, length of the word).
      `;

      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                suggestedWord: { type: Type.STRING },
                howToBuild: { type: Type.STRING },
                points: { type: Type.INTEGER }
              },
              required: ["suggestedWord", "howToBuild", "points"]
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text.trim());
        hintCache.set(boardHash, parsed);
        return res.json(parsed);
      }
    } catch (error: any) {
      const isQuota = error?.message?.includes("429") || error?.message?.includes("quota") || error?.status === "RESOURCE_EXHAUSTED";
      if (isQuota) {
        console.warn("[Gemini Quota Exceeded] Hint generation fell back gracefully to offline local hints.");
      } else {
        console.warn(`[Gemini Hint Fallback] Hint generation fell back to offline local hints. Error: ${error?.message || error}`);
      }
    }
  }

  // Fallback offline hints
  const suggestions = [];
  if (!isBoardEmpty && activeCells.length > 0) {
    const firstCell = activeCells[0];
    const letter = firstCell.letter.toLowerCase();
    for (const w of OFFLINE_WORDS) {
      if (w.includes(letter) && w !== letter) {
        suggestions.push({
          suggestedWord: w.toUpperCase(),
          howToBuild: `Extend existing '${letter.toUpperCase()}' at ${firstCell.coordinate} to form "${w.toUpperCase()}"`,
          points: w.length
        });
        if (suggestions.length >= 3) break;
      }
    }
  }

  if (suggestions.length === 0) {
    suggestions.push({
      suggestedWord: "START NEW WORD",
      howToBuild: "Click any square on the chessboard. E.g. start with 'B' on E12, then 'U' on E11, then 'S' on E10 to make BUS!",
      points: 3
    });
    suggestions.push({
      suggestedWord: "BUS",
      howToBuild: "Form the horizontal word 'BUS' starting from any square!",
      points: 3
    });
    suggestions.push({
      suggestedWord: "GAME",
      howToBuild: "Spell 'G-A-M-E' horizontally or vertically on the empty grid!",
      points: 4
    });
  }

  return res.json(suggestions);
});

// 4. Gemini Status Endpoint to allow the frontend to gracefully display Offline Fallback Banner
app.get("/api/game/gemini-status", (req, res) => {
  res.json({
    isQuotaExceeded: isGeminiQuotaExceeded,
    hasApiKey: !!ai,
  });
});


// Serve static files in production, integrate Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static files served from dist/ folder.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LetterForge Full-Stack Server listening on http://localhost:${PORT}`);
  });
}

startServer();
