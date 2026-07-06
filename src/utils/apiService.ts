import { DictionaryResult, HintSuggestion } from "../types";

// Client-side caches to avoid redundant HTTP requests
const clientLookupCache = new Map<string, DictionaryResult>();
const clientHintCache = new Map<string, HintSuggestion[]>();

// Standard English base words for fallback offline validation
const OFFLINE_WORDS = new Set([
  "bus", "bust", "busy", "make", "makes", "maker", "cat", "cats", "dog", "dogs", "play", "player", "plays", "game", "games",
  "word", "words", "star", "stars", "start", "starts", "state", "states", "stop", "stops", "step", "steps", "stone", "stones",
  "book", "books", "box", "boxes", "boy", "boys", "girl", "girls", "man", "men", "woman", "women", "child", "children",
  "car", "cars", "train", "trains", "plane", "planes", "ship", "ships", "boat", "boats", "bike", "bikes", "road", "roads",
  "street", "streets", "city", "cities", "town", "towns", "house", "houses", "home", "homes", "room", "rooms", "door", "doors",
  "window", "windows", "wall", "walls", "floor", "floors", "roof", "roofs", "garden", "gardens", "park", "parks", "tree", "trees",
  "flower", "flowers", "grass", "sun", "moon", "star", "sky", "cloud", "clouds", "rain", "snow", "wind", "fire", "water", "earth",
  "land", "sea", "river", "lake", "ocean", "fish", "bird", "birds", "animal", "animals", "apple", "banana", "orange", "grape",
  "bread", "butter", "cheese", "milk", "water", "juice", "tea", "coffee", "sugar", "salt", "pepper", "meat", "food", "eat", "drink",
  "run", "walk", "jump", "fly", "swim", "sing", "dance", "read", "write", "speak", "listen", "learn", "teach", "think", "know",
  "want", "need", "love", "like", "hate", "happy", "sad", "angry", "scared", "tired", "brave", "strong", "weak", "fast", "slow",
  "good", "bad", "hot", "cold", "warm", "cool", "new", "old", "young", "big", "small", "tall", "short", "long", "wide", "thin",
  "red", "blue", "green", "yellow", "black", "white", "gray", "brown", "pink", "purple", "orange", "gold", "silver", "one", "two",
  "three", "four", "five", "six", "seven", "eight", "nine", "ten", "time", "day", "night", "week", "month", "year", "hour", "minute",
  "friend", "family", "school", "class", "teacher", "student", "paper", "pen", "pencil", "desk", "chair", "table", "bed", "sleep",
  "wake", "work", "job", "money", "shop", "buy", "sell", "pay", "cost", "price", "free", "cheap", "rich", "poor", "hard", "easy",
  "safe", "hurt", "sick", "well", "life", "death", "love", "peace", "war", "hope", "fear", "mind", "soul", "body", "face", "eye",
  "eyes", "ear", "ears", "nose", "mouth", "hair", "head", "neck", "arm", "hand", "hands", "finger", "fingers", "leg", "foot", "feet",
  "heart", "blood", "brain", "tooth", "teeth", "voice", "song", "music", "art", "paint", "draw", "color", "photo", "film", "show",
  "line", "point", "space", "form", "shape", "size", "weight", "force", "power", "light", "dark", "sound", "voice", "word", "talk",
  "tell", "say", "ask", "hear", "see", "look", "feel", "smell", "taste", "touch", "hold", "take", "give", "keep", "find", "lose",
  "win", "lose", "play", "turn", "score", "points", "rules", "level", "mode", "time", "clock", "timer", "speed", "fast", "slow",
  "test", "try", "done", "help", "save", "back", "next", "last", "first", "best", "worst", "great", "fine", "nice", "kind", "mean",
  "true", "false", "fact", "idea", "plan", "goal", "hope", "wish", "dream", "fear", "care", "love", "hate", "mind", "self", "life",
  "zone", "line", "spot", "mark", "sign", "word", "page", "note", "letter", "name", "list", "text", "mail", "post", "news", "view",
  "hero", "villain", "king", "queen", "prince", "lord", "lady", "sir", "chief", "leader", "boss", "staff", "crew", "team", "club",
  "user", "admin", "guest", "client", "agent", "bot", "code", "data", "file", "disk", "link", "web", "site", "page", "blog", "app",
  "pant", "panto", "pants", "pantomime", "penis", "pencil", "paint", "paper", "part", "past", "path", "peak", "pear", "peel", "peer", "eed",
  "eta", "ate", "tea", "eat", "pea", "ape", "pet", "get", "got", "set", "let", "met", "net", "wet", "yet", "tap", "pat", "apt", "cap", "pac", "cat", "act", "rat", "art", "tar", "sat", "tas", "hat", "fat", "mat", "vat", "map", "pam", "amp", "sap", "pas", "asp", "rap", "par", "arp", "nap", "pan", "tan", "ant", "nat", "gap", "pag", "bag", "gab", "tab", "bat", "lab", "bal", "cab", "bac", "pad", "dad", "sad", "mad", "lad", "bad", "cad", "fad", "had", "rad", "tad", "wad", "yak", "elk", "yelk", "eye", "dye", "bye", "rye", "lye", "tie", "pie", "lie", "die", "fie", "vie", "how", "who", "why", "way", "day", "pay", "may", "say", "lay", "ray", "bay", "hay", "gay", "jay", "kay", "nay", "fay", "yaw", "jaw", "law", "raw", "saw", "paw", "cow", "bow", "sow", "row", "mow", "tow", "vow", "low", "now", "own", "won", "one", "two", "ten", "pen", "hen", "men", "den", "ken", "fen", "zen", "pin", "bin", "tin", "fin", "win", "sin", "din", "gin", "kin", "lin", "nib", "rib", "fib", "bib", "bob", "cob", "fob", "gob", "hob", "job", "lob", "mob", "rob", "sob", "tub", "rub", "sub", "pub", "hub", "cub", "dub", "bud", "mud", "cud", "dud", "rud", "sud", "hug", "mug", "dug", "bug", "tug", "rug", "jug", "pug", "gum", "hum", "sum", "rum", "bum", "mum", "dum", "sun", "run", "fun", "bun", "pun", "nun", "gun", "cup", "pup", "sup", "cut", "but", "out", "nut", "gut", "hut", "rut", "jut", "put", "dry", "cry", "try", "fry", "pry", "sly", "spy", "shy", "fly", "sky", "ski", "sea", "see", "fee", "bee", "toy", "coy", "joy", "soy", "key", "hey", "ley", "dey", "not", "hot", "lot", "pot", "rot", "dot", "cot", "jot", "tot", "bot", "sot", "wot", "god", "cod", "nod", "rod", "pod", "sod", "mod", "toe", "foe", "hoe", "roe", "woe", "oat", "era", "ear", "are", "our", "use", "sue", "due", "rue", "cue", "emu", "gnu", "owl", "awl", "eel", "oil", "ill", "all", "ell", "air", "fir", "sir", "fur", "oar", "car", "bar", "far", "jar", "war", "par", "mar", "her", "his", "him", "the", "and", "for", "nor", "yes", "too", "new", "old", "age", "ago", "fit", "bit", "hit", "sit", "lit", "kit", "pit", "wit", "tit", "zip", "rip", "tip", "lip", "sip", "dip", "hip", "pip", "nip", "gip", "lid", "kid", "rid", "did", "bid", "mid", "sid", "hid", "aid", "add", "odd", "end", "any", "its", "six", "son", "ton", "few", "ski", "van", "can", "fan", "ran", "ban", "rag", "tag", "wag", "sag", "sunny", "rainy", "cloudy", "windy", "snowy", "foggy", "muddy", "funny", "stormy", "misty", "breezy", "chilly", "icy", "warmth", "heats", "cools", "freezes", "frozen", "gales", "mild", "flames", "smokes", "woods", "stones", "clays", "muds", "sands", "dusts", "dirts", "earths", "forests", "valleys", "cliffs", "caves", "rivers", "streams", "brooks", "creeks", "lakes", "ponds", "pools", "waves", "tides", "coasts", "shores", "beaches", "islands", "worlds", "planets", "spaces", "stars", "clouds", "rains", "snows", "winds", "storms", "fogs", "mists", "hazes", "breezes", "weathers", "climates", "temps", "fires", "ashes", "coals", "grounds", "lands", "fields", "meadows", "deserts", "mounts", "hills", "canyons", "bends", "turns", "loops", "moves", "plays", "games", "words", "rules", "levels", "scores", "points", "clocks", "timers", "speeds", "tests", "tries", "helps", "saves", "backs", "nexts", "lasts", "firsts", "bests", "ideas", "plans", "goals", "hopes", "wishes", "dreams", "fears", "cares", "loves", "hates", "minds", "selves", "lives", "zones", "lines", "spots", "marks", "signs", "pages", "notes", "letters", "names", "lists", "texts", "mails", "posts", "views", "heros", "kings", "queens", "princes", "lords", "ladies", "chiefs", "leaders", "bosses", "staffs", "crews", "teams", "clubs", "users", "admins", "guests", "clients", "agents", "bots", "codes", "files", "disks", "links", "webs", "sites", "blogs", "apps", "pants", "paints", "papers", "parts", "pasts", "paths", "peaks", "pears", "peels", "peers", "gaps", "paves", "germs", "gifts", "girls", "golds", "golfs", "gongs", "goods", "goofs", "goons", "gores", "gowns", "grabs", "grads", "grams", "grans", "grays", "grids", "grins", "grips", "grits", "grows", "grubs", "gulfs", "gulls", "gulps", "gunks", "gushs", "gusts",
]);

export const FORBIDDEN_SHORT_FORMS = new Set(["tia", "tiap", "lop", "onl", "nonl", "nonlp", "enonlp", "ing", "tking"]);

/**
 * Checks if a word exists in our local offline base words or matches common suffixes.
 */
function checkOfflineWord(word: string): boolean {
  const clean = word.trim().toLowerCase();
  if (OFFLINE_WORDS.has(clean)) return true;
  
  // 1. Plural/Suffix "s"
  if (clean.endsWith("s") && clean.length > 2 && OFFLINE_WORDS.has(clean.slice(0, -1))) {
    return true;
  }
  // 2. Plural/Suffix "es"
  if (clean.endsWith("es") && clean.length > 3 && OFFLINE_WORDS.has(clean.slice(0, -2))) {
    return true;
  }
  // 3. Past tense "ed"
  if (clean.endsWith("ed") && clean.length > 3) {
    const base = clean.slice(0, -2);
    if (OFFLINE_WORDS.has(base) || OFFLINE_WORDS.has(base + "e")) return true;
  }
  // 4. Participle "ing"
  if (clean.endsWith("ing") && clean.length > 4) {
    const base = clean.slice(0, -3);
    if (OFFLINE_WORDS.has(base) || OFFLINE_WORDS.has(base + "e")) return true;
  }
  // 5. Comparative/agent "er"
  if (clean.endsWith("er") && clean.length > 3) {
    const withoutER = clean.slice(0, -2);
    if (OFFLINE_WORDS.has(withoutER)) return true;
    if (withoutER.endsWith("i") && OFFLINE_WORDS.has(withoutER.slice(0, -1) + "y")) return true;
    if (withoutER.length > 2 && withoutER[withoutER.length - 1] === withoutER[withoutER.length - 2] && OFFLINE_WORDS.has(withoutER.slice(0, -1))) return true;
    if (OFFLINE_WORDS.has(withoutER + "e")) return true;
  }
  // 6. Superlative "est"
  if (clean.endsWith("est") && clean.length > 4) {
    const withoutEST = clean.slice(0, -3);
    if (OFFLINE_WORDS.has(withoutEST)) return true;
    if (withoutEST.endsWith("i") && OFFLINE_WORDS.has(withoutEST.slice(0, -1) + "y")) return true;
    if (withoutEST.length > 2 && withoutEST[withoutEST.length - 1] === withoutEST[withoutEST.length - 2] && OFFLINE_WORDS.has(withoutEST.slice(0, -1))) return true;
    if (OFFLINE_WORDS.has(withoutEST + "e")) return true;
  }
  // 7. Adjective ending in "y" (e.g., sunny, cloudy, rainy, windy)
  if (clean.endsWith("y") && clean.length > 3) {
    const withoutY = clean.slice(0, -1);
    if (OFFLINE_WORDS.has(withoutY)) return true;
    if (withoutY.length > 2 && withoutY[withoutY.length - 1] === withoutY[withoutY.length - 2] && OFFLINE_WORDS.has(withoutY.slice(0, -1))) return true;
    if (OFFLINE_WORDS.has(withoutY + "e")) return true;
  }
  // 8. Adverb ending in "ly" (e.g., slowly, sadly, happily)
  if (clean.endsWith("ly") && clean.length > 4) {
    const withoutLY = clean.slice(0, -2);
    if (OFFLINE_WORDS.has(withoutLY)) return true;
    if (withoutLY.endsWith("i") && OFFLINE_WORDS.has(withoutLY.slice(0, -1) + "y")) return true;
  }
  
  return false;
}

/**
 * Validates a word using the server-side AI dictionary API, falling back gracefully
 * to offline dictionary evaluation.
 */
export async function lookupWord(word: string): Promise<DictionaryResult> {
  const cleaned = word.trim().toLowerCase();
  if (FORBIDDEN_SHORT_FORMS.has(cleaned)) {
    return {
      isValid: false,
      word: cleaned,
      partOfSpeech: "",
      definition: "This is a forbidden short-form abbreviation.",
      reason: "Short-forms/abbreviations (like TIA, TIAP, LOP, ONL, NONL, NONLP, ENONLP) are strictly disallowed and will trigger a point penalty!"
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

    // Heuristic fallback to local offline word validation
    const mockValid = checkOfflineWord(cleaned);
    const fallbackResult: DictionaryResult = {
      isValid: mockValid,
      word: cleaned,
      partOfSpeech: mockValid ? "noun/verb" : "",
      definition: mockValid
        ? "Valid English word (evaluated offline)."
        : "Word is not recognized in our offline dictionary database.",
      funFact: "Check your internet connection to access full AI dictionary definitions and origins!",
      reason: mockValid ? undefined : "Word was not found in the offline wordlist."
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
