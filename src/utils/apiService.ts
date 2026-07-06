import { DictionaryResult, HintSuggestion } from "../types";
import { getOfflineWord, FORBIDDEN_SHORT_FORMS } from "./offlineDictionary";

// Client-side caches to avoid redundant HTTP requests
const clientLookupCache = new Map<string, DictionaryResult>();
const clientHintCache = new Map<string, HintSuggestion[]>();

/**
 * Validates a word using the server-side AI dictionary API, falling back gracefully
 * to offline dictionary evaluation.
 */
export async function lookupWord(word: string): Promise<DictionaryResult> {
  const cleaned = word.trim().toLowerCase();
  
  const offlineResult = getOfflineWord(cleaned) as DictionaryResult | null;
  if (offlineResult && !offlineResult.isValid) {
    return {
      isValid: false,
      word: cleaned,
      partOfSpeech: "",
      definition: offlineResult.definition,
      reason: offlineResult.reason || "Short-forms/abbreviations are strictly disallowed."
    };
  }

  if (clientLookupCache.has(cleaned)) {
    return clientLookupCache.get(cleaned)!;
  }

  try {
    const res = await fetch("/api/dictionary/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word }),
    });
    if (res.ok) {
      const data = await res.json();
      clientLookupCache.set(cleaned, data);
      return data;
    }
    throw new Error("Local backend dictionary lookup failed.");
  } catch (error) {
    console.warn("Backend dictionary failed, attempting free public Online Dictionary API lookup...", error);
    
    try {
      const publicRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleaned}`);
      if (publicRes.ok) {
        const data = await publicRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const entry = data[0];
          const meaning = entry.meanings?.[0];
          const definitionText = meaning?.definitions?.[0]?.definition || "No definition available.";
          const pos = meaning?.partOfSpeech || "noun/verb";
          const phonetic = entry.phonetic ? ` [${entry.phonetic}]` : "";

          const result: DictionaryResult = {
            isValid: true,
            word: cleaned,
            partOfSpeech: pos,
            definition: definitionText,
            funFact: `Pronunciation:${phonetic || ' N/A'}. Validated instantly via public Online English Dictionary API.`
          };
          clientLookupCache.set(cleaned, result);
          return result;
        }
      }
    } catch (publicError) {
      console.warn("Public Online Dictionary API failed, falling back to local offline dictionary:", publicError);
    }

    // Comprehensive fallback using our shared offline dictionary definitions
    if (offlineResult) {
      const fallbackResult: DictionaryResult = {
        isValid: offlineResult.isValid,
        word: cleaned,
        partOfSpeech: offlineResult.partOfSpeech || "noun/verb",
        definition: offlineResult.definition || "Valid English word (evaluated offline).",
        funFact: offlineResult.funFact || "A popular word in the LetterForge offline dictionary archive!",
        reason: offlineResult.reason
      };
      clientLookupCache.set(cleaned, fallbackResult);
      return fallbackResult;
    }

    const fallbackResult: DictionaryResult = {
      isValid: false,
      word: cleaned,
      partOfSpeech: "",
      definition: "Word is not recognized in our offline dictionary database.",
      funFact: "Check your internet connection to access full AI dictionary definitions and origins!",
      reason: "Word was not found in the offline wordlist."
    };
    clientLookupCache.set(cleaned, fallbackResult);
    return fallbackResult;
  }
}

/**
 * Gets a computer/AI player move based on the current grid-based board.
 */
export async function fetchAIMove(
  board: (string | null)[],
  difficulty: "easy" | "medium" | "hard",
  alreadyPlayedWords: string[]
): Promise<{
  boxIdx: number;
  letter: string;
  targetWord: string;
  explanation: string;
}> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 4200);

  try {
    const res = await fetch("/api/game/ai-move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board, difficulty, alreadyPlayedWords }),
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!res.ok) {
      throw new Error("AI turn request failed.");
    }
    return await res.json();
  } catch (error) {
    clearTimeout(id);
    console.warn("Using local offline AI move generation due to timeout or error:", error);
    
    // Smarter offline AI move generator fallback
    // Find all cells that are currently occupied
    const occupiedIndices: number[] = [];
    board.forEach((val, idx) => {
      if (val !== null) occupiedIndices.push(idx);
    });

    let targetIdx = 0;
    let selectedLetter = "E";

    if (occupiedIndices.length > 0) {
      // Find empty squares adjacent to occupied squares
      const adjacentEmptyIndices = new Set<number>();
      for (const idx of occupiedIndices) {
        const row = Math.floor(idx / 40);
        const col = idx % 40;
        
        // Left
        if (col > 0 && board[idx - 1] === null) adjacentEmptyIndices.add(idx - 1);
        // Right
        if (col < 39 && board[idx + 1] === null) adjacentEmptyIndices.add(idx + 1);
        // Up
        if (row > 0 && board[idx - 40] === null) adjacentEmptyIndices.add(idx - 40);
        // Down
        if (row < 24 && board[idx + 40] === null) adjacentEmptyIndices.add(idx + 40);
      }

      if (adjacentEmptyIndices.size > 0) {
        const list = Array.from(adjacentEmptyIndices);
        targetIdx = list[Math.floor(Math.random() * list.length)];
      } else {
        const emptyIndices = board.map((val, idx) => val === null ? idx : -1).filter(idx => idx !== -1);
        targetIdx = emptyIndices.length > 0 ? emptyIndices[Math.floor(Math.random() * emptyIndices.length)] : 0;
      }

      // Pick a strategic vowel/consonant based on what's nearby
      const neighbors: string[] = [];
      const row = Math.floor(targetIdx / 40);
      const col = targetIdx % 40;
      if (col > 0 && board[targetIdx - 1] !== null) neighbors.push(board[targetIdx - 1]!);
      if (col < 39 && board[targetIdx + 1] !== null) neighbors.push(board[targetIdx + 1]!);
      if (row > 0 && board[targetIdx - 40] !== null) neighbors.push(board[targetIdx - 40]!);
      if (row < 24 && board[targetIdx + 40] !== null) neighbors.push(board[targetIdx + 40]!);

      // Choose a complimentary letter
      const commonVowels = ["E", "A", "O", "I", "U"];
      const commonConsonants = ["T", "N", "S", "R", "L", "D", "C", "M", "P"];
      const hasVowel = neighbors.some(l => commonVowels.includes(l.toUpperCase()));
      
      if (hasVowel) {
        selectedLetter = commonConsonants[Math.floor(Math.random() * commonConsonants.length)];
      } else {
        selectedLetter = commonVowels[Math.floor(Math.random() * commonVowels.length)];
      }
    } else {
      // Board is empty: place near the center
      targetIdx = 12 * 40 + 20; // Row 12, Col 20
      const starters = ["S", "T", "A", "C", "P", "M", "B"];
      selectedLetter = starters[Math.floor(Math.random() * starters.length)];
    }

    return {
      boxIdx: targetIdx,
      letter: selectedLetter,
      targetWord: selectedLetter,
      explanation: `Lexi-Bot identified strategic space adjacent to existing letters and placed '${selectedLetter}' to build connections offline!`
    };
  }
}

/**
 * Retrieves AI-suggested words based on the current board as hints.
 */
export async function fetchAIHints(board: (string | null)[]): Promise<HintSuggestion[]> {
  const boardHash = board.map(cell => cell || "-").join("");
  if (clientHintCache.has(boardHash)) {
    return clientHintCache.get(boardHash)!;
  }

  try {
    const res = await fetch("/api/game/ai-hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board }),
    });
    if (!res.ok) {
      throw new Error("AI hints request failed.");
    }
    const data = await res.json();
    clientHintCache.set(boardHash, data);
    return data;
  } catch (error) {
    console.warn("Fallback local hints triggered:", error);
    return [
      {
        suggestedWord: "OFFLINE",
        howToBuild: "Check your network for live Gemini AI suggestions",
        points: 7
      }
    ];
  }
}

/**
 * Checks the current status of the Gemini API from the backend.
 */
export async function fetchGeminiStatus(): Promise<{ isQuotaExceeded: boolean; hasApiKey: boolean }> {
  try {
    const res = await fetch("/api/game/gemini-status");
    if (!res.ok) {
      throw new Error("Failed to fetch status");
    }
    return await res.json();
  } catch (err) {
    return { isQuotaExceeded: false, hasApiKey: false };
  }
}
