import { Position } from "../types";

export const NAME_SUGGESTIONS = [
  { name: "LetterForge", description: "Shape and build words link by link (Current Active Name)" },
  { name: "LexiChain", description: "Forge high-scoring alphabetical linkages" },
  { name: "SpellForge", description: "Cast letters together to forge lexical chains" },
  { name: "WordLink Pro", description: "Connect letters, dodge timer limits, score points" },
  { name: "AlphaChain", description: "Turn letters into consecutive multi-point words" },
  { name: "Bust-A-Word", description: "Add a letter, complete a word, and bust the board!" }
];

export const AVATARS = ["🦁", "🦊", "🐼", "🐨", "🦄", "🐯", "🐉", "🐙", "🦉", "🐸", "🐹", "🦖", "🦥", "🐱", "🐶"];

export const COLORS = [
  { name: "Teal Breeze", value: "#14b8a6", bgClass: "bg-teal-500", textClass: "text-teal-500" },
  { name: "Indigo Night", value: "#6366f1", bgClass: "bg-indigo-500", textClass: "text-indigo-500" },
  { name: "Sunset Crimson", value: "#f43f5e", bgClass: "bg-rose-500", textClass: "text-rose-500" },
  { name: "Amber Flame", value: "#f59e0b", bgClass: "bg-amber-500", textClass: "text-amber-500" },
  { name: "Violet Spark", value: "#8b5cf6", bgClass: "bg-violet-500", textClass: "text-violet-500" },
  { name: "Emerald Forest", value: "#10b981", bgClass: "bg-emerald-500", textClass: "text-emerald-500" },
  { name: "Cyan Ice", value: "#06b6d4", bgClass: "bg-cyan-500", textClass: "text-cyan-500" }
];

/**
 * Checks if the current move violates the "S Suffix Rule"
 * Rule: Adding just 'S' to the end of a previously completed valid word
 * is supported (forming the new word, e.g. makes) but does NOT score points.
 */
export function verifySSuffixRule(
  previousChain: string[],
  addedLetter: string,
  position: Position,
  previousWordWasValid: boolean
): { isViolated: boolean; message: string } {
  if (
    addedLetter.toUpperCase() === "S" &&
    position === "end" &&
    previousChain.length >= 3 &&
    previousWordWasValid
  ) {
    const previousWord = previousChain.join("").toUpperCase();
    return {
      isViolated: true,
      message: `The "S" Suffix Rule was triggered! Adding 'S' to completed word "${previousWord}" is allowed but scores 0 points to prevent cheap points.`
    };
  }
  return { isViolated: false, message: "" };
}

/**
 * Standard QWERTY keyboard structure
 */
export const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"]
];
