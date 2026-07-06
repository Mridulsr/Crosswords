import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  GameMode,
  Difficulty,
  Player,
  MoveLog,
  HintSuggestion,
} from "./types";
import {
  NAME_SUGGESTIONS,
  AVATARS,
  COLORS,
  KEYBOARD_ROWS,
} from "./utils/gameUtils";
import {
  lookupWord,
  fetchAIMove,
  fetchAIHints,
  fetchGeminiStatus,
} from "./utils/apiService";
import DictionaryChecker from "./components/DictionaryChecker";
import {
  Sparkles,
  Users,
  Cpu,
  RotateCcw,
  Play,
  Volume2,
  VolumeX,
  Clock,
  Check,
  AlertCircle,
  Trash2,
  User,
  Info,
  Flame,
  ArrowDownCircle,
  XCircle,
  Grid,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Keyboard,
} from "lucide-react";

const themeStyles = {
  cyber: {
    wrapper: "bg-gradient-to-br from-[#0c051e] via-[#150d3a] to-[#040108] text-white selection:bg-[#ff007f] selection:text-white",
    header: "border-b-2 border-[#ff007f]/50 bg-[#0c051e]/80 backdrop-blur-md shadow-[0_4px_20px_rgba(255,0,127,0.15)]",
    headerBadge: "bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white shadow-[0_0_8px_rgba(255,0,127,0.5)]",
    panel: "border-2 border-[#ff007f]/40 bg-[#150d3a]/80 shadow-[0_0_20px_rgba(255,0,127,0.2)] rounded-2xl",
    panelInner: "bg-[#0c051e]/85 border border-[#ff007f]/30 rounded-xl",
    btnPrimary: "bg-[#ff007f] hover:bg-[#d00067] text-white border-none shadow-[0_0_12px_#ff007f]",
    btnSecondary: "bg-[#1c123c] border border-[#ff007f]/40 text-white hover:border-[#ff007f] hover:bg-[#ff007f]/10",
    accentText: "text-[#00f0ff]",
    secondaryText: "text-zinc-400",
    boxBase: "border-zinc-800 bg-[#10072b]/80 text-[#00f0ff] hover:bg-[#200e52]",
    boxCompleted: "bg-gradient-to-br from-[#4d009a]/50 to-[#2c0066]/70 border-[#ff007f]/50 text-white",
    activeTurnGlow: "shadow-[0_0_20px_#ff007f]",
    badgeText: "text-[#ff007f]",
    title: "gradient-text-cyber font-black drop-shadow-[0_2px_8px_rgba(255,0,127,0.4)]",
    titleLobby: "gradient-text-lobby font-black",
    borderMuted: "border-[#ff007f]/20",
    inputBg: "bg-[#1c123c] border-[#ff007f]/30 text-white focus:ring-[#ff007f]"
  },
  light: {
    wrapper: "bg-gradient-to-br from-[#f8f9fa] via-[#eef2f5] to-[#e4e8ec] text-zinc-800 selection:bg-indigo-600 selection:text-white",
    header: "border-b-2 border-zinc-200 bg-white/95 backdrop-blur-md shadow-sm",
    headerBadge: "bg-indigo-600 text-white shadow-sm",
    panel: "border border-zinc-200 bg-white/95 shadow-md shadow-zinc-200/50 rounded-2xl",
    panelInner: "bg-zinc-50 border border-zinc-200 rounded-xl",
    btnPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-sm",
    btnSecondary: "bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50",
    accentText: "text-indigo-600",
    secondaryText: "text-zinc-500",
    boxBase: "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50",
    boxCompleted: "bg-indigo-50 border-indigo-200 text-indigo-900",
    activeTurnGlow: "shadow-lg shadow-indigo-200",
    badgeText: "text-indigo-600",
    title: "text-indigo-600 font-black drop-shadow-sm",
    titleLobby: "text-indigo-700 font-extrabold",
    borderMuted: "border-zinc-200",
    inputBg: "bg-white border-zinc-300 text-zinc-900 focus:ring-indigo-500"
  },
  amber: {
    wrapper: "bg-gradient-to-br from-[#0e0c0a] via-[#18130e] to-[#050403] text-[#ffb000] selection:bg-[#ffb000] selection:text-black font-mono",
    header: "border-b-2 border-[#ffb000]/40 bg-[#0e0c0a]/90 backdrop-blur-md shadow-[0_4px_15px_rgba(255,176,0,0.1)]",
    headerBadge: "bg-[#ffb000] text-black shadow-sm",
    panel: "border-2 border-[#ffb000]/30 bg-[#18130e]/95 shadow-[0_0_15px_rgba(255,176,0,0.15)] rounded-2xl",
    panelInner: "bg-[#0c0a08]/90 border border-[#ffb000]/25 rounded-xl",
    btnPrimary: "bg-[#ffb000] hover:bg-[#cc8d00] text-black border-none shadow-[0_0_8px_#ffb000]",
    btnSecondary: "bg-[#18130e] border border-[#ffb000]/30 text-[#ffb000] hover:bg-[#ffb000]/10",
    accentText: "text-[#ffb000]",
    secondaryText: "text-amber-700/80",
    boxBase: "border-amber-950 bg-[#0c0a08]/80 text-[#ffb000]/70 hover:bg-amber-950/40",
    boxCompleted: "bg-amber-950/40 border-[#ffb000]/40 text-[#ffb000]",
    activeTurnGlow: "shadow-[0_0_15px_rgba(255,176,0,0.25)]",
    badgeText: "text-[#ffb000]",
    title: "text-[#ffb000] font-mono font-black drop-shadow-[0_0_8px_#ffb000]",
    titleLobby: "text-[#ffb000] font-mono font-extrabold",
    borderMuted: "border-[#ffb000]/20",
    inputBg: "bg-[#0c0a08] border-[#ffb000]/30 text-[#ffb000] focus:ring-[#ffb000]"
  },
  forest: {
    wrapper: "bg-gradient-to-br from-[#0b1410] via-[#0d2218] to-[#040a07] text-[#e3decb] selection:bg-[#d4af37] selection:text-[#0b1410] font-sans",
    header: "border-b-2 border-emerald-800/40 bg-[#0b1410]/95 backdrop-blur-md shadow-md",
    headerBadge: "bg-[#d4af37] text-[#0b1410] shadow-sm font-bold",
    panel: "border-2 border-emerald-800/30 bg-[#0d2218]/90 shadow-[0_0_15px_rgba(212,175,55,0.15)] rounded-2xl",
    panelInner: "bg-[#040a07]/85 border border-[#d4af37]/20 rounded-xl",
    btnPrimary: "bg-[#d4af37] hover:bg-[#b8952b] text-[#0b1410] border-none shadow-sm font-bold",
    btnSecondary: "bg-[#0d2218] border border-[#d4af37]/30 text-[#e3decb] hover:bg-[#d4af37]/10",
    accentText: "text-[#d4af37]",
    secondaryText: "text-emerald-600",
    boxBase: "border-emerald-950/80 bg-[#050c08]/85 text-emerald-400 hover:bg-emerald-950/40",
    boxCompleted: "bg-emerald-900/25 border-[#d4af37]/30 text-[#e3decb]",
    activeTurnGlow: "shadow-[0_0_15px_rgba(212,175,55,0.2)]",
    badgeText: "text-[#d4af37]",
    title: "text-[#d4af37] font-serif font-black drop-shadow-sm",
    titleLobby: "text-[#d4af37] font-serif font-extrabold",
    borderMuted: "border-emerald-800/20",
    inputBg: "bg-[#040a07] border-emerald-800/30 text-[#e3decb] focus:ring-[#d4af37]"
  }
};

function checkSuffixRule(word: string, alreadyPlayed: string[]): { base: string; suffix: string } | null {
  const lowerWord = word.toLowerCase();
  const suffixes = ["ing", "est", "ly", "ed", "er", "es", "s"];
  for (const suf of suffixes) {
    if (lowerWord.endsWith(suf) && lowerWord.length > suf.length) {
      const base = lowerWord.slice(0, -suf.length);
      if (base.length >= 3 && alreadyPlayed.some(w => w.toLowerCase() === base)) {
        return { base, suffix: suf.toUpperCase() };
      }
    }
  }
  return null;
}

export default function App() {
  // --- Audio Sound Effects (Synthesized using Web Audio API) ---
  const [soundEnabled, setSoundEnabled] = useState(true);
  const playSound = (type: "click" | "success" | "error" | "tick" | "rule") => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(900, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "tick") {
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === "rule") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  // --- Game Title ---
  const [gameTitle, setGameTitle] = useState("LetterForge");

  // --- Visual Theme selection (default is system matching prefers-color-scheme) ---
  const [theme, setTheme] = useState<"system" | "cyber" | "light" | "amber" | "forest">("system");

  // --- Core Game Config States ---
  const [gameState, setGameState] = useState<"lobby" | "playing" | "gameover">("lobby");
  const [mode, setMode] = useState<GameMode>("computer");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [timeLimitSec, setTimeLimitSec] = useState<number>(30); // 30s per turn by default
  const [boardSize, setBoardSize] = useState<number>(1000); // Default 1000 boxes empty chessboard

  // --- Players Setup ---
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "p1",
      name: "Player One",
      color: COLORS[1].value,
      avatar: "🦁",
      score: 0,
      isComputer: false,
      totalTurnTime: 0,
      movesCount: 0,
      wordsFormed: [],
    },
    {
      id: "computer",
      name: "Lexi-Bot AI",
      color: COLORS[4].value,
      avatar: "🤖",
      score: 0,
      isComputer: true,
      totalTurnTime: 0,
      movesCount: 0,
      wordsFormed: [],
    }
  ]);

  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);

  // Lobby customized player inputs
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerAvatar, setNewPlayerAvatar] = useState("🦁");
  const [newPlayerColor, setNewPlayerColor] = useState(COLORS[0].value);

  // --- Board Grid State ---
  const [board, setBoard] = useState<(string | null)[]>(Array(1000).fill(null));
  const [selectedBoxIdx, setSelectedBoxIdx] = useState<number | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [alreadyPlayedWords, setAlreadyPlayedWords] = useState<string[]>([]);

  // Word Formed Preview State (Live calculation)
  const [formedWordPreview, setFormedWordPreview] = useState<{
    horiz: { word: string; indices: number[] };
    vert: { word: string; indices: number[] };
  }>({
    horiz: { word: "", indices: [] },
    vert: { word: "", indices: [] }
  });
  const [correctedPreviewWords, setCorrectedPreviewWords] = useState<{
    horiz: string;
    vert: string;
  }>({ horiz: "", vert: "" });
  const [previewIsValid, setPreviewIsValid] = useState<boolean | null>(null);
  const [previewDefinition, setPreviewDefinition] = useState<string | null>(null);

  // --- Status & Warnings ---
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ruleAlert, setRuleAlert] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>("Select any box on the board to place your first letter!");

  // AI Hint status
  const [aiHints, setAiHints] = useState<HintSuggestion[]>([]);
  const [fetchingHints, setFetchingHints] = useState(false);
  const [geminiQuotaExceeded, setGeminiQuotaExceeded] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await fetchGeminiStatus();
        if (status.isQuotaExceeded) {
          setGeminiQuotaExceeded(true);
        }
      } catch (err) {
        console.warn("Error checking Gemini status:", err);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 25000); // Check every 25 seconds
    return () => clearInterval(interval);
  }, []);

  // AI status
  const [aiIsThinking, setAiIsThinking] = useState(false);
  const [aiThoughts, setAiThoughts] = useState<string | null>(null);

  // --- History & Logs ---
  const [moveLogs, setMoveLogs] = useState<MoveLog[]>([]);

  // --- Turn Timers with Millisecond Precision ---
  const [turnTimeLeftMs, setTurnTimeLeftMs] = useState<number>(30 * 1000);
  const [turnTimerRunning, setTurnTimerRunning] = useState<boolean>(false);
  const [turnStartTime, setTurnStartTime] = useState<number>(0);
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);

  // Track key stats
  const [elapsedSecForCurrentTurn, setElapsedSecForCurrentTurn] = useState<number>(0);

  // Ref to track elapsed interval
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const turnTimeLeftMsRef = useRef<number>(0);
  const wasTimerRunningRef = useRef<boolean>(false);

  // --- Zoom & Auto-Submit States ---
  const [zoomLevel, setZoomLevel] = useState<"fit" | "compact" | "medium" | "full">("fit");
  const [isWidescreen, setIsWidescreen] = useState<boolean>(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [isImmersiveFullscreen, setIsImmersiveFullscreen] = useState<boolean>(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState<number | null>(null);
  const autoSubmitTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Re-calculate the horizontal contiguous word containing the selected index in a 40x25 grid
  const getHorizontalBlock = (tempBoard: (string | null)[], index: number) => {
    if (index < 0 || index >= tempBoard.length || tempBoard[index] === null) {
      return { word: "", indices: [] as number[] };
    }
    const r = Math.floor(index / 40);
    const c = index % 40;

    let left = c;
    while (left > 0 && tempBoard[r * 40 + (left - 1)] !== null) {
      left--;
    }
    let right = c;
    while (right < 39 && tempBoard[r * 40 + (right + 1)] !== null) {
      right++;
    }

    const indices: number[] = [];
    const letters: string[] = [];
    for (let colIdx = left; colIdx <= right; colIdx++) {
      const cellIdx = r * 40 + colIdx;
      indices.push(cellIdx);
      letters.push(tempBoard[cellIdx]!);
    }
    return { word: letters.join("").toUpperCase(), indices };
  };

  // Re-calculate the vertical contiguous word containing the selected index in a 40x25 grid
  const getVerticalBlock = (tempBoard: (string | null)[], index: number) => {
    if (index < 0 || index >= tempBoard.length || tempBoard[index] === null) {
      return { word: "", indices: [] as number[] };
    }
    const r = Math.floor(index / 40);
    const c = index % 40;

    let up = r;
    while (up > 0 && tempBoard[(up - 1) * 40 + c] !== null) {
      up--;
    }
    let down = r;
    while (down < 24 && tempBoard[(down + 1) * 40 + c] !== null) {
      down++;
    }

    const indices: number[] = [];
    const letters: string[] = [];
    for (let rowIdx = up; rowIdx <= down; rowIdx++) {
      const cellIdx = rowIdx * 40 + c;
      indices.push(cellIdx);
      letters.push(tempBoard[cellIdx]!);
    }
    return { word: letters.join("").toUpperCase(), indices };
  };

  // Computed memo to identify which indices belong to which played words, and how many times they are highlighted
  const completedWordDetail = useMemo(() => {
    const counts = new Array(board.length).fill(0);
    const indexToWordsMap = Array.from({ length: board.length }, () => new Set<string>());

    const checkBlock = (text: string, indices: number[]) => {
      const len = text.length;
      if (len < 3) return;
      // Find all substrings of length >= 3
      for (let start = 0; start <= len - 3; start++) {
        for (let end = start + 3; end <= len; end++) {
          const sub = text.slice(start, end);
          const subRev = sub.split("").reverse().join("");
          
          // Check if this substring (or its reverse) is in alreadyPlayedWords
          const matchedWord = alreadyPlayedWords.find(w => {
            const wLower = w.toLowerCase();
            return wLower === sub.toLowerCase() || wLower === subRev.toLowerCase();
          });

          if (matchedWord) {
            // This substring corresponds to indices from index start to end-1 in the block
            for (let k = start; k < end; k++) {
              const cellIdx = indices[k];
              indexToWordsMap[cellIdx].add(matchedWord.toLowerCase());
            }
          }
        }
      }
    };

    // 1. Check all rows
    for (let r = 0; r < 25; r++) {
      let currentText = "";
      let currentIndices: number[] = [];
      for (let c = 0; c < 40; c++) {
        const idx = r * 40 + c;
        if (board[idx] !== null) {
          currentText += board[idx];
          currentIndices.push(idx);
        } else {
          if (currentText.length >= 3) {
            checkBlock(currentText, currentIndices);
          }
          currentText = "";
          currentIndices = [];
        }
      }
      if (currentText.length >= 3) {
        checkBlock(currentText, currentIndices);
      }
    }

    // 2. Check all columns
    for (let c = 0; c < 40; c++) {
      let currentText = "";
      let currentIndices: number[] = [];
      for (let r = 0; r < 25; r++) {
        const idx = r * 40 + c;
        if (board[idx] !== null) {
          currentText += board[idx];
          currentIndices.push(idx);
        } else {
          if (currentText.length >= 3) {
            checkBlock(currentText, currentIndices);
          }
          currentText = "";
          currentIndices = [];
        }
      }
      if (currentText.length >= 3) {
        checkBlock(currentText, currentIndices);
      }
    }

    // Convert sets to size (how many distinct played words contain this cell)
    const resultCounts = indexToWordsMap.map(set => set.size);
    return {
      counts: resultCounts,
      wordMap: indexToWordsMap
    };
  }, [board, alreadyPlayedWords]);

  // Keep latest refs of selected states to ensure the auto-timer interval never has stale closures
  const selectedBoxIdxRef = useRef<number | null>(null);
  const selectedLetterRef = useRef<string | null>(null);

  useEffect(() => {
    selectedBoxIdxRef.current = selectedBoxIdx;
  }, [selectedBoxIdx]);

  useEffect(() => {
    selectedLetterRef.current = selectedLetter;
  }, [selectedLetter]);

  // Automatically submit 5 seconds after choosing a letter
  useEffect(() => {
    if (autoSubmitTimerRef.current) {
      clearInterval(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }

    if (
      gameState === "playing" &&
      !isGamePaused &&
      !players[currentPlayerIdx].isComputer &&
      selectedBoxIdx !== null &&
      selectedLetter !== null
    ) {
      setAutoSubmitCountdown(5.0);
      const interval = setInterval(() => {
        setAutoSubmitCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 0.1) {
            clearInterval(interval);
            setTimeout(() => {
              if (selectedBoxIdxRef.current !== null && selectedLetterRef.current !== null) {
                executeMoveForPlayer(selectedBoxIdxRef.current, selectedLetterRef.current, false);
              }
            }, 0);
            return null;
          }
          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 100);
      autoSubmitTimerRef.current = interval;
    } else {
      setAutoSubmitCountdown(null);
    }

    return () => {
      if (autoSubmitTimerRef.current) {
        clearInterval(autoSubmitTimerRef.current);
      }
    };
  }, [selectedBoxIdx, selectedLetter, currentPlayerIdx, gameState, players, isGamePaused]);

  // Run validation on preview of the word
  useEffect(() => {
    const timer = setTimeout(() => {
      const calcPreview = async () => {
        if (selectedBoxIdx === null || !selectedLetter) {
          setFormedWordPreview({
            horiz: { word: "", indices: [] },
            vert: { word: "", indices: [] }
          });
          setCorrectedPreviewWords({ horiz: "", vert: "" });
          setPreviewIsValid(null);
          setPreviewDefinition(null);
          return;
        }

        // Simulate placing the letter
        const simulatedBoard = [...board];
        simulatedBoard[selectedBoxIdx] = selectedLetter;

        const horiz = getHorizontalBlock(simulatedBoard, selectedBoxIdx);
        const vert = getVerticalBlock(simulatedBoard, selectedBoxIdx);
        setFormedWordPreview({ horiz, vert });

        const hasHoriz = horiz.word.length >= 3;
        const hasVert = vert.word.length >= 3;

        let correctedH = horiz.word;
        let correctedV = vert.word;

        if (hasHoriz || hasVert) {
          let isValid = false;
          const defs: string[] = [];

          if (hasHoriz) {
            try {
              const res = await lookupWord(horiz.word);
              if (res.isValid) {
                isValid = true;
                defs.push(`Horizontal "${horiz.word}": ${res.definition}`);
                correctedH = horiz.word;
              } else {
                const horizRev = horiz.word.split("").reverse().join("");
                const resRev = await lookupWord(horizRev);
                if (resRev.isValid) {
                  isValid = true;
                  defs.push(`Horizontal "${horizRev}" (reversed): ${resRev.definition}`);
                  correctedH = horizRev;
                } else {
                  defs.push(`Horizontal "${horiz.word}": Not a recognized word`);
                  correctedH = horiz.word;
                }
              }
            } catch (err) {
              console.error("Error during horizontal preview validation:", err);
            }
          }

          if (hasVert) {
            try {
              const res = await lookupWord(vert.word);
              if (res.isValid) {
                isValid = true;
                defs.push(`Vertical "${vert.word}": ${res.definition}`);
                correctedV = vert.word;
              } else {
                const vertRev = vert.word.split("").reverse().join("");
                const resRev = await lookupWord(vertRev);
                if (resRev.isValid) {
                  isValid = true;
                  defs.push(`Vertical "${vertRev}" (reversed): ${resRev.definition}`);
                  correctedV = vertRev;
                } else {
                  defs.push(`Vertical "${vert.word}": Not a recognized word`);
                  correctedV = vert.word;
                }
              }
            } catch (err) {
              console.error("Error during vertical preview validation:", err);
            }
          }

          setCorrectedPreviewWords({ horiz: correctedH, vert: correctedV });
          setPreviewIsValid(isValid);
          setPreviewDefinition(defs.join(" | ") || "No valid words formed yet.");
        } else {
          setCorrectedPreviewWords({ horiz: "", vert: "" });
          setPreviewIsValid(false);
          setPreviewDefinition("No horizontal or vertical word has reached 3 letters yet.");
        }
      };
      calcPreview();
    }, 350);

    return () => clearTimeout(timer);
  }, [selectedBoxIdx, selectedLetter, board]);

  // Handle physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (players[currentPlayerIdx].isComputer) return;
      if (selectedBoxIdx === null) return;

      // Check if target is an input field to avoid overriding typing in dictionary check
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        setSelectedLetter(key);
        playSound("click");
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedBoxIdx !== null && selectedLetter) {
          executeMoveForPlayer(selectedBoxIdx, selectedLetter, false);
        }
      } else if (e.key === "Backspace" || e.key === "Delete") {
        // Clear box
        playSound("click");
        const updated = [...board];
        updated[selectedBoxIdx] = null;
        setBoard(updated);
        setSelectedLetter(null);
        setErrorMessage(null);
        setStatusMessage(`Cleared Box ${selectedBoxIdx + 1}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, selectedBoxIdx, board, currentPlayerIdx, players, selectedLetter]);

  // Initialize/Reset Game variables
  const startGame = () => {
    playSound("success");

    let initialPlayers: Player[] = [];
    if (mode === "computer") {
      initialPlayers = [
        players[0] || {
          id: "p1",
          name: "Player One",
          color: COLORS[1].value,
          avatar: "🦁",
          score: 0,
          isComputer: false,
          totalTurnTime: 0,
          movesCount: 0,
          wordsFormed: [],
        },
        {
          id: "computer",
          name: difficulty === "easy" ? "Lexi-Bot AI (Easy)" : difficulty === "medium" ? "Lexi-Bot AI (Med)" : "Lexi-Bot AI (Pro)",
          color: COLORS[4].value,
          avatar: "🤖",
          score: 0,
          isComputer: true,
          totalTurnTime: 0,
          movesCount: 0,
          wordsFormed: [],
        }
      ];
    } else if (mode === "pvp") {
      initialPlayers = [
        {
          id: "p1",
          name: players[0]?.name || "Challenger A",
          color: COLORS[0].value,
          avatar: players[0]?.avatar || "🦁",
          score: 0,
          isComputer: false,
          totalTurnTime: 0,
          movesCount: 0,
          wordsFormed: [],
        },
        {
          id: "p2",
          name: "Challenger B",
          color: COLORS[2].value,
          avatar: "🦊",
          score: 0,
          isComputer: false,
          totalTurnTime: 0,
          movesCount: 0,
          wordsFormed: [],
        }
      ];
    } else {
      const humans = players.filter(p => !p.isComputer);
      if (humans.length < 2) {
        initialPlayers = [
          { id: "p1", name: "Player 1", color: COLORS[0].value, avatar: "🦁", score: 0, isComputer: false, totalTurnTime: 0, movesCount: 0, wordsFormed: [] },
          { id: "p2", name: "Player 2", color: COLORS[1].value, avatar: "🐼", score: 0, isComputer: false, totalTurnTime: 0, movesCount: 0, wordsFormed: [] }
        ];
      } else {
        initialPlayers = humans.map(p => ({ ...p, score: 0, totalTurnTime: 0, movesCount: 0, wordsFormed: [] }));
      }
    }

    setPlayers(initialPlayers);
    setBoard(Array(boardSize).fill(null));
    setSelectedBoxIdx(null);
    setSelectedLetter(null);
    setAlreadyPlayedWords([]);
    setMoveLogs([]);
    setErrorMessage(null);
    setRuleAlert(null);
    setStatusMessage("The board is completely empty! Select any box to place your starting letter.");
    setAiThoughts(null);
    setAiHints([]);

    setCurrentPlayerIdx(0);
    setGameState("playing");

    startTurnTimer();
  };

  // Turn Timer Loop
  const startTurnTimer = (customRemainingMs?: number) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const activePlayer = players[currentPlayerIdx];
    const isComp = activePlayer?.isComputer;

    // AI always gets exactly 5 seconds to respond.
    // If it's a human player and time limit is 0, they get infinite time (timer not running).
    if (!isComp && timeLimitSec === 0) {
      setTurnTimerRunning(false);
      setTurnTimeLeftMs(0);
      return;
    }

    const currentLimitSec = isComp ? 5 : timeLimitSec;
    const totalLimitMs = customRemainingMs !== undefined ? customRemainingMs : (currentLimitSec * 1000);
    const startTime = Date.now();
    setTurnStartTime(startTime);
    setTurnTimeLeftMs(totalLimitMs);
    turnTimeLeftMsRef.current = totalLimitMs;
    setTurnTimerRunning(true);

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, totalLimitMs - elapsed);
      setTurnTimeLeftMs(remaining);
      turnTimeLeftMsRef.current = remaining;
      setElapsedSecForCurrentTurn(parseFloat((elapsed / 1000).toFixed(2)));

      if (remaining <= 0) {
        clearInterval(timerIntervalRef.current!);
        setTurnTimerRunning(false);
        handleTurnTimeout();
      }
    }, 40);
  };

  // Pause and Resume Game Progress
  const pauseGame = () => {
    if (gameState !== "playing" || isGamePaused) return;
    setIsGamePaused(true);
    playSound("click");

    // Clear turn timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
      wasTimerRunningRef.current = true;
    } else {
      wasTimerRunningRef.current = false;
    }
    setTurnTimerRunning(false);

    // Clear auto-submit timer
    if (autoSubmitTimerRef.current) {
      clearInterval(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }
    setAutoSubmitCountdown(null);
  };

  const resumeGame = () => {
    if (gameState !== "playing" || !isGamePaused) return;
    setIsGamePaused(false);
    playSound("success");

    // Resume turn timer
    const activePlayer = players[currentPlayerIdx];
    if (activePlayer) {
      if (activePlayer.isComputer) {
        // AI has its own automatic execution trigger, let it proceed
        startTurnTimer(turnTimeLeftMsRef.current);
      } else if (timeLimitSec > 0) {
        // For human, only start if time limit is enabled
        startTurnTimer(turnTimeLeftMsRef.current);
      }
    }
  };

  // Tab Visibility & Focus Event Listener to Pause and Resume Game Progress
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseGame();
      } else {
        resumeGame();
      }
    };

    const handleBlur = () => {
      pauseGame();
    };

    const handleFocus = () => {
      resumeGame();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [gameState, currentPlayerIdx, players, isGamePaused, timeLimitSec]);

  const handleTurnTimeout = () => {
    const activePlayer = players[currentPlayerIdx];
    if (selectedBoxIdxRef.current !== null && selectedLetterRef.current !== null) {
      // Auto-submit the entered letter!
      executeMoveForPlayer(selectedBoxIdxRef.current, selectedLetterRef.current, false);
    } else {
      playSound("error");
      setErrorMessage(`Time limit reached for ${activePlayer.name}! Turn has passed with no points.`);
      moveToNextPlayer();
    }
  };

  const moveToNextPlayer = () => {
    setSelectedLetter(null);
    setSelectedBoxIdx(null);
    setCurrentPlayerIdx((prev) => (prev + 1) % players.length);
  };

  // Triggered whenever current player index changes
  useEffect(() => {
    if (gameState === "playing") {
      startTurnTimer();
      setRuleAlert(null);
      setErrorMessage(null);

      const activePlayer = players[currentPlayerIdx];
      if (activePlayer.isComputer) {
        triggerComputerMove();
      } else {
        triggerLoadHints();
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [currentPlayerIdx, gameState]);

  // Load Hints from AI
  const triggerLoadHints = async () => {
    setFetchingHints(true);
    try {
      const hints = await fetchAIHints(board);
      setAiHints(hints);
    } catch (e) {
      console.error(e);
      try {
        const status = await fetchGeminiStatus();
        if (status.isQuotaExceeded) {
          setGeminiQuotaExceeded(true);
        }
      } catch (_) {}
    } finally {
      setFetchingHints(false);
    }
  };

  // Trigger AI Move
  const triggerComputerMove = async () => {
    setAiIsThinking(true);
    setAiThoughts("Scanning the board of boxes for optimal letter positions...");
    playSound("click");

    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      const decision = await fetchAIMove(board, difficulty, alreadyPlayedWords);
      const targetIdx = decision.boxIdx;
      const letter = decision.letter.toUpperCase();

      setAiThoughts(`AI Decided to place '${letter}' in Box ${targetIdx + 1}. Reason: ${decision.explanation}`);

      // Apply AI Move
      executeMoveForPlayer(targetIdx, letter, true);
    } catch (err) {
      console.error(err);
      try {
        const status = await fetchGeminiStatus();
        if (status.isQuotaExceeded) {
          setGeminiQuotaExceeded(true);
        }
      } catch (_) {}
      // Offline fallback: find first empty box and place a letter
      const emptyIdx = board.indexOf(null);
      if (emptyIdx !== -1) {
        executeMoveForPlayer(emptyIdx, "A", true);
      } else {
        moveToNextPlayer();
      }
    } finally {
      setAiIsThinking(false);
    }
  };

  // Execute actual letter placement & rule check on the 40x25 grid
  const executeMoveForPlayer = async (
    boxIndex: number,
    letter: string,
    isAI: boolean = false
  ) => {
    setErrorMessage(null);
    setRuleAlert(null);

    // Stop all active turn timers and auto-submit countdowns IMMEDIATELY to prevent timing out or double submissions during dictionary lookup
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTurnTimerRunning(false);

    if (autoSubmitTimerRef.current) {
      clearInterval(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }
    setAutoSubmitCountdown(null);

    // Clear selection states immediately to lock grid and prevent double submissions during async processing
    setSelectedBoxIdx(null);
    setSelectedLetter(null);

    const activePlayer = players[currentPlayerIdx];
    const rLabel = Math.floor(boxIndex / 40);
    const cLabel = boxIndex % 40;
    const fileLabel = cLabel < 26 ? String.fromCharCode(65 + cLabel) : "A" + String.fromCharCode(65 + (cLabel - 26));
    const rankLabel = (25 - rLabel).toString();
    const squareCoord = `${fileLabel}${rankLabel}`;

    // Build the new board
    const newBoard = [...board];
    newBoard[boxIndex] = letter;

    // Calculate words formed containing this index
    const horizBlock = getHorizontalBlock(newBoard, boxIndex);
    const vertBlock = getVerticalBlock(newBoard, boxIndex);

    const hWord = horizBlock.word;
    const vWord = vertBlock.word;

    // Helper to get contiguous slices of length >= 3 containing the placed letter's index
    const getSubwordCandidates = (indices: number[], targetIdx: number, tempBoard: (string | null)[]) => {
      const placedPos = indices.indexOf(targetIdx);
      if (placedPos === -1) return [];

      const candidates: { word: string; indices: number[] }[] = [];
      for (let start = 0; start <= placedPos; start++) {
        for (let end = placedPos; end < indices.length; end++) {
          const len = end - start + 1;
          if (len >= 3) {
            const sliceIndices = indices.slice(start, end + 1);
            const word = sliceIndices.map(idx => tempBoard[idx]!).join("").toUpperCase();
            candidates.push({ word, indices: sliceIndices });
          }
        }
      }
      return candidates;
    };

    const hCandidates = getSubwordCandidates(horizBlock.indices, boxIndex, newBoard);
    const vCandidates = getSubwordCandidates(vertBlock.indices, boxIndex, newBoard);

    const hasHoriz = hCandidates.length > 0;
    const hasVert = vCandidates.length > 0;

    // --- FORBIDDEN SHORT FORMS CHECK AND PENALTY ---
    const FORBIDDEN_SHORT_FORMS = new Set(["tia", "tiap", "lop", "onl", "nonl", "nonlp", "enonlp", "ing", "tking"]);

    let hasHorizPenalty = false;
    let horizPenaltyWord = "";
    for (const cand of hCandidates) {
      const wLower = cand.word.toLowerCase();
      const wRevLower = cand.word.split("").reverse().join("").toLowerCase();
      if (FORBIDDEN_SHORT_FORMS.has(wLower)) {
        hasHorizPenalty = true;
        horizPenaltyWord = cand.word;
        break;
      } else if (FORBIDDEN_SHORT_FORMS.has(wRevLower)) {
        hasHorizPenalty = true;
        horizPenaltyWord = cand.word.split("").reverse().join("");
        break;
      }
    }

    let hasVertPenalty = false;
    let vertPenaltyWord = "";
    for (const cand of vCandidates) {
      const wLower = cand.word.toLowerCase();
      const wRevLower = cand.word.split("").reverse().join("").toLowerCase();
      if (FORBIDDEN_SHORT_FORMS.has(wLower)) {
        hasVertPenalty = true;
        vertPenaltyWord = cand.word;
        break;
      } else if (FORBIDDEN_SHORT_FORMS.has(wRevLower)) {
        hasVertPenalty = true;
        vertPenaltyWord = cand.word.split("").reverse().join("");
        break;
      }
    }

    if (hasHorizPenalty || hasVertPenalty) {
      const penaltyWords: string[] = [];
      let totalDeduction = 0;
      if (hasHorizPenalty) {
        penaltyWords.push(horizPenaltyWord.toUpperCase());
        totalDeduction += horizPenaltyWord.length;
      }
      if (hasVertPenalty) {
        const uVert = vertPenaltyWord.toUpperCase();
        if (!penaltyWords.includes(uVert)) {
          penaltyWords.push(uVert);
          totalDeduction += vertPenaltyWord.length;
        }
      }

      playSound("error");
      setRuleAlert(`Short-form abbreviation penalty! Played forbidden word(s): ${penaltyWords.join(", ")}. -${totalDeduction} points.`);
      setErrorMessage(`Short-forms like TIA and TIAP are not allowed.`);

      setBoard(newBoard);

      const timeSpentMs = Date.now() - turnStartTime;
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIdx] = {
        ...activePlayer,
        score: activePlayer.score - totalDeduction,
        movesCount: activePlayer.movesCount + 1,
        totalTurnTime: activePlayer.totalTurnTime + timeSpentMs,
      };
      setPlayers(updatedPlayers);

      // Log the move with negative points
      const newLog: MoveLog = {
        id: Math.random().toString(36).substr(2, 9),
        player: { name: activePlayer.name, color: activePlayer.color, isComputer: activePlayer.isComputer },
        letter,
        boxIdx: boxIndex,
        boardState: newBoard,
        formedWord: penaltyWords.join(" & "),
        pointsEarned: -totalDeduction,
        timeSpentSec: parseFloat((timeSpentMs / 1000).toFixed(2)),
        ruleTriggered: `Forbidden Short-form Abbreviation Penalty (-${totalDeduction} points)`,
      };
      setMoveLogs((prev) => [newLog, ...prev]);

      setStatusMessage(`Penalty! Played forbidden short-form word(s): ${penaltyWords.join(" & ")}. Deducted ${totalDeduction} points for ${activePlayer.name}!`);
      moveToNextPlayer();
      return;
    }

    if (!hasHoriz && !hasVert) {
      // Allow placing letter but scored 0 points
      playSound("click");
      setBoard(newBoard);

      const timeSpentMs = Date.now() - turnStartTime;
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIdx] = {
        ...activePlayer,
        movesCount: activePlayer.movesCount + 1,
        totalTurnTime: activePlayer.totalTurnTime + timeSpentMs,
      };
      setPlayers(updatedPlayers);

      // Log the move
      const newLog: MoveLog = {
        id: Math.random().toString(36).substr(2, 9),
        player: { name: activePlayer.name, color: activePlayer.color, isComputer: activePlayer.isComputer },
        letter,
        boxIdx: boxIndex,
        boardState: newBoard,
        pointsEarned: 0,
        timeSpentSec: parseFloat((timeSpentMs / 1000).toFixed(2)),
      };
      setMoveLogs((prev) => [newLog, ...prev]);

      setStatusMessage(`Placed '${letter}' in Square ${squareCoord}. No 3-letter word formed yet. Turn passed!`);
      moveToNextPlayer();
      return;
    }

    // Lookup and scoring
    setStatusMessage(`Verifying newly formed words on the chessboard...`);
    
    let totalPointsEarned = 0;
    const verifiedWords: string[] = [];
    const rulesApplied: string[] = [];
    let isAnyValid = false;

    // Helper to scan candidates and verify standard English words in parallel
    const getValidSubwordsForBlock = async (candidates: { word: string; indices: number[] }[]) => {
      const results = await Promise.all(
        candidates.map(async (candidate) => {
          const forwardVerify = await lookupWord(candidate.word);
          if (forwardVerify.isValid) {
            return { matchedWord: candidate.word, isReversed: false, indices: candidate.indices };
          }
          const reversed = candidate.word.split("").reverse().join("");
          const reversedVerify = await lookupWord(reversed);
          if (reversedVerify.isValid) {
            return { matchedWord: reversed, isReversed: true, indices: candidate.indices };
          }
          return null;
        })
      );
      return results.filter((res): res is { matchedWord: string; isReversed: boolean; indices: number[] } => res !== null);
    };

    const validHSubwords = await getValidSubwordsForBlock(hCandidates);
    const validVSubwords = await getValidSubwordsForBlock(vCandidates);

    // Process horizontal sub-words
    for (const item of validHSubwords) {
      const matchedWord = item.matchedWord;
      isAnyValid = true;

      const alreadyPlayed = alreadyPlayedWords.some(w => w.toLowerCase() === matchedWord.toLowerCase());
      let points = matchedWord.length;

      if (alreadyPlayed) {
        points = 0;
        rulesApplied.push(`Already Played ("${matchedWord.toUpperCase()}" was already scored in a previous turn)`);
      } else {
        const suffixResult = checkSuffixRule(matchedWord, alreadyPlayedWords);
        if (suffixResult) {
          points = 0;
          rulesApplied.push(`Suffix Rule ("${suffixResult.suffix}" appended to "${suffixResult.base.toUpperCase()}")`);
        }
      }

      totalPointsEarned += points;
      if (!verifiedWords.includes(matchedWord.toUpperCase())) {
        verifiedWords.push(matchedWord.toUpperCase());
      }
    }

    // Process vertical sub-words
    for (const item of validVSubwords) {
      const matchedWord = item.matchedWord;
      isAnyValid = true;

      const alreadyPlayed = alreadyPlayedWords.some(w => w.toLowerCase() === matchedWord.toLowerCase());
      let points = matchedWord.length;

      if (alreadyPlayed) {
        points = 0;
        rulesApplied.push(`Already Played ("${matchedWord.toUpperCase()}" was already scored in a previous turn)`);
      } else {
        const suffixResult = checkSuffixRule(matchedWord, alreadyPlayedWords);
        if (suffixResult) {
          points = 0;
          rulesApplied.push(`Suffix Rule ("${suffixResult.suffix}" appended to "${suffixResult.base.toUpperCase()}")`);
        }
      }

      totalPointsEarned += points;
      if (!verifiedWords.includes(matchedWord.toUpperCase())) {
        verifiedWords.push(matchedWord.toUpperCase());
      }
    }

    const timeSpentMs = Date.now() - turnStartTime;

    if (isAnyValid) {
      playSound("success");

      if (rulesApplied.length > 0) {
        setRuleAlert(`Rule triggered: Adding suffix extensions (like S, ES, ED, ING, ER, EST, LY) to already completed words on the chessboard is worth 0 points.`);
        playSound("rule");
      }

      setAlreadyPlayedWords((prev) => [...prev, ...verifiedWords]);
      setBoard(newBoard);

      // Update Player stats
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIdx] = {
        ...activePlayer,
        score: activePlayer.score + totalPointsEarned,
        movesCount: activePlayer.movesCount + 1,
        totalTurnTime: activePlayer.totalTurnTime + timeSpentMs,
        wordsFormed: [...activePlayer.wordsFormed, ...verifiedWords],
      };
      setPlayers(updatedPlayers);

      // Log the move
      const newLog: MoveLog = {
        id: Math.random().toString(36).substr(2, 9),
        player: { name: activePlayer.name, color: activePlayer.color, isComputer: activePlayer.isComputer },
        letter,
        boxIdx: boxIndex,
        boardState: newBoard,
        formedWord: verifiedWords.join(" & "),
        pointsEarned: totalPointsEarned,
        timeSpentSec: parseFloat((timeSpentMs / 1000).toFixed(2)),
        ruleTriggered: rulesApplied.join(", ") || undefined,
      };
      setMoveLogs((prev) => [newLog, ...prev]);

      setStatusMessage(`Splendid! Formed "${verifiedWords.join(" & ")}" in Square ${squareCoord}. +${totalPointsEarned} points to ${activePlayer.name}!`);
      moveToNextPlayer();
    } else {
      // Checked candidate word(s) but none are valid dictionary words
      playSound("error");

      // Still place the letter to keep the grid dynamic, but 0 points
      setBoard(newBoard);

      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIdx] = {
        ...activePlayer,
        movesCount: activePlayer.movesCount + 1,
        totalTurnTime: activePlayer.totalTurnTime + timeSpentMs,
      };
      setPlayers(updatedPlayers);

      // Log the move
      const newLog: MoveLog = {
        id: Math.random().toString(36).substr(2, 9),
        player: { name: activePlayer.name, color: activePlayer.color, isComputer: activePlayer.isComputer },
        letter,
        boxIdx: boxIndex,
        boardState: newBoard,
        pointsEarned: 0,
        timeSpentSec: parseFloat((timeSpentMs / 1000).toFixed(2)),
      };
      setMoveLogs((prev) => [newLog, ...prev]);

      const attempted = [hasHoriz ? hWord : null, hasVert ? vWord : null].filter(Boolean).join(" / ");
      setErrorMessage(`"${attempted}" is not recognized yet. Placed letter in Square ${squareCoord}, but scored 0 points.`);
      setStatusMessage("Keep placing letters adjacent to form completed horizontal or vertical words!");
      moveToNextPlayer();
    }
  };

  const handleManualSubmitMove = () => {
    if (selectedBoxIdx === null || !selectedLetter) {
      playSound("error");
      setErrorMessage("Please select an empty box and choose a letter from the keyboard first!");
      return;
    }
    executeMoveForPlayer(selectedBoxIdx, selectedLetter, false);
  };

  // Lobby customizations
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    if (players.length >= 5) {
      setErrorMessage("Max 5 players allowed in group session.");
      return;
    }
    const newP: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPlayerName.trim(),
      avatar: newPlayerAvatar,
      color: newPlayerColor,
      score: 0,
      isComputer: false,
      totalTurnTime: 0,
      movesCount: 0,
      wordsFormed: [],
    };
    setPlayers([...players.filter(p => !p.isComputer), newP]);
    setNewPlayerName("");
    playSound("click");
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 2) return;
    setPlayers(players.filter((p) => p.id !== id));
    playSound("click");
  };

  const handleClearBoard = () => {
    playSound("click");
    setBoard(Array(boardSize).fill(null));
    setSelectedBoxIdx(null);
    setSelectedLetter(null);
    setErrorMessage(null);
    setRuleAlert(null);
    setStatusMessage("The board has been cleared! Start a new word anywhere.");
  };

  const terminateGame = () => {
    playSound("error");
    setGameState("gameover");
  };

  const activeTheme = theme === "system" 
    ? (typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? "light" : "cyber")
    : theme;

  const s = themeStyles[activeTheme] || themeStyles.cyber;

  return (
    <div className={`min-h-screen ${s.wrapper} font-sans flex flex-col`} id="letterforge-app">
      {geminiQuotaExceeded && (
        <div className="bg-amber-950/85 border-b-2 border-amber-500/50 text-amber-200 px-4 py-3 text-xs md:text-sm font-medium flex items-center justify-between gap-3 backdrop-blur shadow-[0_2px_15px_rgba(245,158,11,0.2)] animate-fade-in z-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold tracking-wide uppercase text-amber-400 shrink-0">
              ⚡ LOCAL OFFLINE DICTIONARY:
            </span>
            <span>
              The global Gemini Free Tier API quota (20 requests/day) has been reached. No worries! LetterForge is running fully in instant local-offline mode with our offline wordlist and smart heuristic AI bot!
            </span>
          </div>
          <button 
            onClick={() => setGeminiQuotaExceeded(false)}
            className="text-amber-400 hover:text-amber-100 text-xs font-black uppercase tracking-wider px-2 py-1 rounded border border-amber-500/40 hover:border-amber-400 bg-amber-900/30 transition shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
      {/* Dynamic Theme-Responsive Header */}
      <header className={`${s.header} py-5 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4`}>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] uppercase tracking-[0.3em] ${s.headerBadge} px-2 py-0.5 font-black font-sans`}>
              VICE GRID SYSTEM v6.0
            </span>
            <div className={`flex items-center gap-1 text-[11px] font-mono ${s.accentText} animate-pulse`}>
              <Clock className="w-3.5 h-3.5" />
              <span>ARENA GRID ONLINE</span>
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase ${s.title}`}>
            {gameTitle}
          </h1>
          <p className={`text-xs uppercase tracking-[0.25em] font-sans mt-1 ${s.secondaryText} font-extrabold`}>
            1000-CELL NEON SYNTHWAVE WORD ARENA
          </p>
        </div>

        {/* Global Controls & Title Picker */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Board Title Dropdown */}
          <div className={`${s.btnSecondary} px-4 py-1.5 flex items-center gap-3 rounded`}>
            <span className={`text-xs font-sans uppercase tracking-wider font-bold ${s.accentText}`}>
              Board Title:
            </span>
            <select
              value={gameTitle}
              onChange={(e) => {
                setGameTitle(e.target.value);
                playSound("click");
              }}
              className="bg-transparent border-none text-sm font-bold font-sans outline-none cursor-pointer focus:ring-0 text-inherit decoration-dotted underline"
            >
              {NAME_SUGGESTIONS.map((item, idx) => (
                <option key={idx} value={item.name} className={`${s.inputBg} font-sans`}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Visual Theme Dropdown */}
          <div className={`${s.btnSecondary} px-4 py-1.5 flex items-center gap-3 rounded`}>
            <span className={`text-xs font-sans uppercase tracking-wider font-bold ${s.accentText}`}>
              Theme:
            </span>
            <select
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value as any);
                playSound("click");
              }}
              className="bg-transparent border-none text-sm font-bold font-sans outline-none cursor-pointer focus:ring-0 text-inherit decoration-dotted underline"
            >
              <option value="system" className={`${s.inputBg} font-sans`}>💻 System Default</option>
              <option value="cyber" className={`${s.inputBg} font-sans`}>🌌 Cyber Neon (Dark)</option>
              <option value="light" className={`${s.inputBg} font-sans`}>☀️ Clean Light</option>
              <option value="amber" className={`${s.inputBg} font-sans`}>📟 Amber Terminal</option>
              <option value="forest" className={`${s.inputBg} font-sans`}>🌲 Forest Sage</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound("click");
            }}
            className={`p-2 border transition-all duration-150 rounded ${s.btnSecondary}`}
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className={`flex-1 w-full ${isWidescreen ? "max-w-none px-4 md:px-8" : "max-w-7xl mx-auto p-4 md:p-8"} flex flex-col gap-6`} id="game-main-container">
        
        {/* LOBBY VIEW */}
        {gameState === "lobby" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="lobby-view">
            
            {/* Setup and Rules Description */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Introduction Banner */}
              <div className="border-2 border-[#ff007f]/40 bg-[#150d3a]/60 p-6 md:p-8 rounded-xl backdrop-blur shadow-[0_0_15px_rgba(255,0,127,0.15)]">
                <h2 className="text-2xl md:text-3xl font-black mb-3 italic tracking-tight gradient-text-lobby">
                  Welcome to {gameTitle}.
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-zinc-300 mb-6 font-sans">
                  {gameTitle} is a grid-based tactile spelling game where you can place letters 
                  <strong className="text-[#00f0ff]"> anywhere on an empty board</strong> of boxes. Start a letter at any slot, 
                  then select adjacent boxes to form, extend, or merge English words! 
                </p>

                {/* Grid-based Rules Details */}
                <div className="border-t border-[#ff007f]/20 pt-4">
                  <h3 className="text-xs uppercase font-sans tracking-[0.2em] font-extrabold mb-3 text-[#ff007f] flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> Strategic Guidelines
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-2 border-[#00f0ff]/50 pl-3">
                      <h4 className="text-xs font-sans font-bold uppercase mb-1 text-[#00f0ff]">
                        1. Start Anywhere
                      </h4>
                      <p className="text-xs text-zinc-400 leading-normal">
                        Click any empty box in the grid to place your starting letter. No preset starting sequence!
                      </p>
                    </div>
                    <div className="border-l-2 border-[#00f0ff]/50 pl-3">
                      <h4 className="text-xs font-sans font-bold uppercase mb-1 text-[#00f0ff]">
                        2. Connect and Extend
                      </h4>
                      <p className="text-xs text-zinc-400 leading-normal">
                        Build words by placing letters in empty boxes. Points are awarded when contiguous non-empty letters contain a valid English word of 3+ letters.
                      </p>
                    </div>
                    <div className="border-l-2 border-[#ff007f]/50 pl-3">
                      <h4 className="text-xs font-sans font-bold uppercase mb-1 text-[#ff007f]">
                        3. Suffix Prevention Rule
                      </h4>
                      <p className="text-xs text-zinc-400 leading-normal">
                        Appending common suffixes (S, ES, ED, ING, ER, EST, LY) to an already scored completed word yields 0 points. Focus on genuine word building!
                      </p>
                    </div>
                    <div className="border-l-2 border-[#f0b90b]/50 pl-3">
                      <h4 className="text-xs font-sans font-bold uppercase mb-1 text-[#f0b90b]">
                        4. Adaptive AI Opponent
                      </h4>
                      <p className="text-xs text-zinc-400 leading-normal">
                        Our Gemini-powered AI intelligently analyzes empty boxes and places tactical characters to score points or block your paths!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Configuration */}
              <div className="border border-[#ff007f]/30 bg-[#150d3a]/50 p-6 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <h3 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-[#ff007f]/20 pb-2 mb-4 text-[#ff007f]">
                  Arena Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Select Mode */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-sans font-bold mb-2 text-zinc-300">
                      Game Mode
                    </label>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => { setMode("computer"); playSound("click"); }}
                        className={`px-3 py-2 border text-left flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider transition-all rounded ${
                          mode === "computer"
                            ? "bg-gradient-to-r from-[#ff007f] to-[#9d00ff] text-white border-transparent shadow-[0_0_8px_rgba(255,0,127,0.4)]"
                            : "bg-[#1c123c]/60 text-zinc-300 border-[#ff007f]/20 hover:border-[#ff007f]"
                        }`}
                      >
                        <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> Vs AI</span>
                        {mode === "computer" && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <button
                        onClick={() => { setMode("pvp"); playSound("click"); }}
                        className={`px-3 py-2 border text-left flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider transition-all rounded ${
                          mode === "pvp"
                            ? "bg-gradient-to-r from-[#ff007f] to-[#9d00ff] text-white border-transparent shadow-[0_0_8px_rgba(255,0,127,0.4)]"
                            : "bg-[#1c123c]/60 text-zinc-300 border-[#ff007f]/20 hover:border-[#ff007f]"
                        }`}
                      >
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> 1v1 Duel</span>
                        {mode === "pvp" && <Check className="w-3 h-3 text-white" />}
                      </button>
                    </div>
                  </div>

                  {/* Board Size selection */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-sans font-bold mb-2 text-[#ff007f]">
                      Vice Grid Edition
                    </label>
                    <div className="bg-[#1c123c]/80 text-white p-3 border border-[#ff007f]/40 rounded font-sans shadow-sm">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#00f0ff] block mb-1 animate-pulse">
                        Capacity Expanded
                      </span>
                      <p className="text-[11px] font-medium leading-snug text-zinc-300">
                        1000 Empty Squares (40x25 Grid). Build words anywhere!
                      </p>
                    </div>
                  </div>

                  {/* AI Difficulty */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-sans font-bold mb-2 text-zinc-300">
                      AI Tier
                    </label>
                    <div className="flex flex-col gap-2">
                      {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
                        <button
                          key={level}
                          disabled={mode !== "computer"}
                          onClick={() => { setDifficulty(level); playSound("click"); }}
                          className={`px-3 py-1.5 border text-left flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider transition-all rounded disabled:opacity-45 disabled:cursor-not-allowed ${
                            difficulty === level && mode === "computer"
                              ? "bg-white text-[#150d3a] border-transparent font-black"
                              : "bg-[#1c123c]/60 text-zinc-300 border-zinc-700/50 hover:border-[#ff007f]/50"
                          }`}
                        >
                          <span>{level}</span>
                          {difficulty === level && mode === "computer" && <span className="w-1.5 h-1.5 rounded-full bg-[#ff007f] shadow-[0_0_6px_#ff007f]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Turn Timer Limits */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-sans font-bold mb-2 text-zinc-300">
                      Turn Timer
                    </label>
                    <div className="flex flex-col gap-2">
                      {[15, 30, 45, 0].map((sec) => (
                        <button
                          key={sec}
                          onClick={() => { setTimeLimitSec(sec); playSound("click"); }}
                          className={`px-3 py-1.5 border text-left flex items-center justify-between text-xs font-mono font-bold transition-all rounded ${
                            timeLimitSec === sec
                              ? "bg-[#ff007f] text-white border-transparent shadow-[0_0_6px_#ff007f]"
                              : "bg-[#1c123c]/60 text-zinc-300 border-[#ff007f]/10 hover:border-[#ff007f]/30"
                          }`}
                        >
                          <span>{sec === 0 ? "Infinite" : `${sec}s`}</span>
                          {timeLimitSec === sec && <Clock className="w-3 h-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Players Registration and Match start */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="border border-[#ff007f]/30 bg-[#150d3a]/50 p-6 rounded-xl flex-1 flex flex-col justify-between shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-sans font-bold border-b border-[#ff007f]/20 pb-2 mb-4 flex items-center justify-between text-[#00f0ff]">
                    <span>Active Players ({players.length})</span>
                    <span className="text-[10px] bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/20 px-2 py-0.5 rounded font-mono uppercase font-bold">
                      Vice Edition
                    </span>
                  </h3>

                  {/* Player List */}
                  <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto pr-1">
                    {players.map((p, idx) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 border border-[#ff007f]/20 bg-[#1c123c]/60 rounded-lg relative overflow-hidden"
                      >
                        <div className="flex items-center gap-3 z-10">
                          <span className="w-8 h-8 rounded-full border border-[#ff007f]/30 bg-[#150d3a] flex items-center justify-center text-lg shadow-sm">
                            {p.avatar}
                          </span>
                          <div>
                            <span className="font-sans font-bold text-xs uppercase tracking-wider block text-white">
                              {p.name}
                            </span>
                            <span className="text-[9px] font-mono uppercase text-[#00f0ff]">
                              {p.isComputer ? "Automated AI" : `Player ${idx + 1}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 z-10">
                          <span
                            className="w-4 h-4 rounded-full border border-black/50"
                            style={{ backgroundColor: p.color }}
                          />
                          {!p.isComputer && players.length > 2 && (
                            <button
                              onClick={() => handleRemovePlayer(p.id)}
                              className="p-1 hover:bg-[#ff007f]/10 text-zinc-400 hover:text-[#ff007f] rounded transition-colors"
                              title="Delete Player"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div
                          className="absolute left-0 top-0 bottom-0 w-1"
                          style={{ backgroundColor: p.color }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={startGame}
                    className="w-full py-4 bg-gradient-to-r from-[#ff007f] via-[#9d00ff] to-[#00f0ff] hover:brightness-110 text-white font-sans font-black text-sm uppercase tracking-[0.2em] transition-all duration-200 rounded-lg shadow-[0_0_15px_rgba(255,0,127,0.45)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-white" /> Forge Board Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE PLAYING SCREEN */}
        {gameState === "playing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="playing-view">
            
            {/* Left Column: Interactive Board and Controls */}
            <div className={`${isWidescreen ? "lg:col-span-9" : "lg:col-span-8"} flex flex-col gap-6`}>
              
              {/* Dynamic Game Chain */}
              <div className="border-2 border-[#ff007f]/40 bg-[#150d3a]/80 shadow-[0_0_20px_rgba(255,0,127,0.2)] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center relative min-h-[420px]">
                {/* Header Labels */}
                <div className="absolute top-3 left-4 text-[9px] uppercase font-mono tracking-widest text-zinc-400">
                  {gameTitle} Tactical Grid Area ({board.length} squares)
                </div>
                <div className="absolute top-3 right-4 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#00f0ff] font-extrabold">
                    Dual-Direction Validated
                  </span>
                </div>

                {/* ZOOM CONTROL PRESETS */}
                <div className="mt-8 flex flex-wrap items-center gap-2 mb-4 bg-[#1c123c]/90 px-3 py-1.5 rounded-lg border border-[#ff007f]/20">
                  <span className="text-[10px] uppercase font-sans tracking-wider text-zinc-400 font-bold">GRID ZOOM:</span>
                  <button
                    onClick={() => { setZoomLevel("fit"); playSound("click"); }}
                    className={`px-2.5 py-1 text-[10px] uppercase font-mono rounded font-bold transition-all ${
                      zoomLevel === "fit"
                        ? "bg-[#ff007f] text-white shadow-[0_0_8px_#ff007f]"
                        : "bg-transparent text-zinc-400 hover:text-white"
                    }`}
                  >
                    FIT SCREEN (100% VISIBLE)
                  </button>
                  <button
                    onClick={() => { setZoomLevel("compact"); playSound("click"); }}
                    className={`px-2.5 py-1 text-[10px] uppercase font-mono rounded font-bold transition-all ${
                      zoomLevel === "compact"
                        ? "bg-[#ff007f]/80 text-white"
                        : "bg-transparent text-zinc-400 hover:text-white"
                    }`}
                  >
                    WIDE (50%)
                  </button>
                  <button
                    onClick={() => { setZoomLevel("medium"); playSound("click"); }}
                    className={`px-2.5 py-1 text-[10px] uppercase font-mono rounded font-bold transition-all ${
                      zoomLevel === "medium"
                        ? "bg-[#9d00ff] text-white"
                        : "bg-transparent text-zinc-400 hover:text-white"
                    }`}
                  >
                    RADAR (75%)
                  </button>
                  <button
                    onClick={() => { setZoomLevel("full"); playSound("click"); }}
                    className={`px-2.5 py-1 text-[10px] uppercase font-mono rounded font-bold transition-all ${
                      zoomLevel === "full"
                        ? "bg-[#00f0ff] text-zinc-950 font-black"
                        : "bg-transparent text-zinc-400 hover:text-white"
                    }`}
                  >
                    CLOSE-UP (100%)
                  </button>

                  <div className="h-4 w-[1px] bg-zinc-700 mx-1" />

                  <button
                    onClick={() => { setIsWidescreen(!isWidescreen); playSound("click"); }}
                    className={`px-2.5 py-1 text-[10px] uppercase font-mono rounded font-bold transition-all border ${
                      isWidescreen
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                        : "bg-transparent border-zinc-700 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {isWidescreen ? "Widescreen On" : "Widescreen Off"}
                  </button>

                  <div className="h-4 w-[1px] bg-zinc-700 mx-1" />

                  <button
                    onClick={() => { setIsImmersiveFullscreen(true); playSound("success"); }}
                    className="px-3 py-1 text-[10px] uppercase font-sans rounded font-black transition-all border bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)] hover:shadow-[0_0_15px_rgba(245,158,11,0.6)] hover:scale-105"
                    id="enter-fullscreen-btn"
                  >
                    🖥️ Fullscreen Arena
                  </button>

                  <div className="h-4 w-[1px] bg-zinc-700 mx-1" />

                  <button
                    onClick={() => {
                      if (isGamePaused) {
                        resumeGame();
                      } else {
                        pauseGame();
                      }
                    }}
                    className={`px-3 py-1 text-[10px] uppercase font-sans rounded font-black transition-all border flex items-center gap-1 cursor-pointer ${
                      isGamePaused
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                        : "bg-gradient-to-r from-rose-500 to-rose-600 text-white border-rose-400 hover:scale-105 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                    }`}
                    id="manual-pause-btn"
                  >
                    {isGamePaused ? "▶️ Resume Match" : "⏸️ Pause Match"}
                  </button>
                </div>

                {/* Scrollable grid viewport container */}
                <div className={`w-full overflow-auto ${zoomLevel === "fit" ? "max-h-none" : "max-h-[600px] lg:max-h-[72vh]"} bg-[#0c051e]/85 border border-[#ff007f]/30 rounded-xl p-3 scrollbar-thin scrollbar-thumb-[#ff007f] scrollbar-track-transparent`}>
                  {/* Outer flex centering block for the grid, allowing full scroll */}
                  <div className="inline-block min-w-full">
                    {/* Main Grid containing 1000 boxes */}
                    <div 
                      className="grid gap-1 bg-[#10072b]/80 p-1 rounded-lg"
                      style={{ 
                        gridTemplateColumns: `repeat(40, minmax(0, 1fr))`,
                        width: zoomLevel === "fit" ? "100%" : zoomLevel === "compact" ? "1400px" : zoomLevel === "medium" ? "1800px" : "2800px"
                      }}
                    >
                      {board.map((letter, idx) => {
                        const isSelected = selectedBoxIdx === idx;
                        const isPartOfPreview = formedWordPreview.horiz.indices.includes(idx) || formedWordPreview.vert.indices.includes(idx);
                        const completedCount = completedWordDetail.counts[idx];

                        const r = Math.floor(idx / 40);
                        const c = idx % 40;
                        const fileLabel = c < 26 ? String.fromCharCode(65 + c) : "A" + String.fromCharCode(65 + (c - 26));
                        const rankLabel = (25 - r).toString();
                        const coordinate = `${fileLabel}${rankLabel}`;

                        // Determine sizes based on zoom level (enhanced larger box options)
                        const sizeClasses = 
                          zoomLevel === "fit"
                            ? "aspect-square h-auto text-[10px] sm:text-xs md:text-sm lg:text-base font-black p-0"
                            : zoomLevel === "compact" 
                            ? "h-10 text-sm font-black p-0" 
                            : zoomLevel === "medium" 
                            ? "h-12 text-base font-black p-0" 
                            : "h-16 text-xl font-black p-0";

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedBoxIdx(idx);
                              setSelectedLetter(letter || null); // preset if filled
                              playSound("click");
                            }}
                            className={`w-full ${sizeClasses} rounded border flex items-center justify-center select-none relative transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? "bg-[#f0b90b] border-white scale-[1.08] z-10 shadow-[0_0_12px_#f0b90b] text-zinc-950 font-black"
                                : isPartOfPreview && previewIsValid
                                ? "bg-emerald-500/30 border-emerald-400 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)] font-bold"
                                : isPartOfPreview
                                ? "bg-amber-500/30 border-amber-400 text-white"
                                : completedCount >= 2
                                ? "bg-[#00f0ff]/15 border-[#00f0ff]/40 text-cyan-200 font-extrabold shadow-[0_0_8px_rgba(0,240,255,0.25)] ring-1 ring-[#00f0ff]/20"
                                : completedCount === 1
                                ? "bg-[#ff007f]/15 border-[#ff007f]/30 text-pink-200 font-bold shadow-[0_0_6px_rgba(255,0,127,0.15)]"
                                : letter !== null
                                ? "bg-[#1c123c] text-white border-[#9d00ff]/50 font-bold"
                                : "bg-[#1a113a]/40 hover:bg-[#ff007f]/10 border-[#ff007f]/10 text-[#00f0ff]/40"
                            }`}
                            style={{ minWidth: 0, minHeight: 0 }}
                          >
                            <span className="font-black tracking-tight leading-none">
                              {isSelected && selectedLetter ? selectedLetter : letter || ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Live Preview Display and Submission panel */}
                <div className="w-full max-w-xl border-t border-[#ff007f]/20 pt-4 flex flex-col items-center gap-3">
                  
                  {/* Status Alerts */}
                  {ruleAlert && (
                    <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2 text-xs font-sans rounded flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <div>
                        <strong>RULE ALERT:</strong> {ruleAlert}
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-2 text-xs font-sans rounded flex items-start gap-2">
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {statusMessage && !errorMessage && !ruleAlert && (
                    <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2 text-xs font-sans rounded text-center">
                      {statusMessage}
                    </div>
                  )}

                  {/* Auto-submit Countdown Warning Indicator */}
                  {autoSubmitCountdown !== null && (
                    <div className="w-full bg-[#ff007f]/25 border border-[#ff007f]/50 text-white px-4 py-2 text-xs font-mono flex items-center justify-between rounded animate-pulse shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#00f0ff] animate-spin" />
                        <span>AUTO-SUBMITTING IN <strong className="text-[#00f0ff]">{autoSubmitCountdown}s</strong>...</span>
                      </div>
                      <div className="w-24 h-1.5 bg-[#10072b] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#ff007f] to-[#00f0ff]" style={{ width: `${(autoSubmitCountdown / 5.0) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Active letter input options */}
                  {!players[currentPlayerIdx].isComputer ? (
                    <div className="w-full flex flex-col md:flex-row items-center gap-4 bg-[#1c123c]/80 p-4 border border-[#ff007f]/30 rounded-xl">
                      
                      {/* Box Select Indicator */}
                      <div className="w-full md:w-auto text-center md:text-left">
                        <label className="block text-[10px] uppercase font-sans tracking-widest text-[#00f0ff] mb-1.5 font-bold">
                          1. Target Square
                        </label>
                        <div className="px-3 py-2 bg-[#150d3a] border border-[#ff007f]/40 inline-block text-xs font-mono font-bold uppercase text-white rounded">
                          {selectedBoxIdx !== null 
                            ? `Square ${(() => {
                                const c = selectedBoxIdx % 40;
                                const r = Math.floor(selectedBoxIdx / 40);
                                const fileLabel = c < 26 ? String.fromCharCode(65 + c) : "A" + String.fromCharCode(65 + (c - 26));
                                return `${fileLabel}${25 - r}`;
                              })()}`
                            : "Click any square!"}
                        </div>
                      </div>

                      {/* Letter Preview Choice */}
                      <div className="flex-1 w-full text-center md:text-left">
                        <label className="block text-[10px] uppercase font-sans tracking-widest text-[#00f0ff] mb-1.5 font-bold">
                          2. Input Letter & Preview
                        </label>
                        {selectedBoxIdx !== null ? (
                          <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#ff007f] to-[#9d00ff] text-white border border-white/20 flex items-center justify-center font-mono text-xl font-black rounded-lg shadow-[0_0_8px_rgba(255,0,127,0.4)]">
                              {selectedLetter || "?"}
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-sans text-zinc-200 font-bold">
                                {formedWordPreview.horiz.word || formedWordPreview.vert.word ? (
                                  <div className="space-y-0.5">
                                    {formedWordPreview.horiz.word.length >= 2 && (
                                      <p>Horizontal: <span className="underline decoration-[#ff007f] font-mono text-[#00f0ff]">"{correctedPreviewWords.horiz || formedWordPreview.horiz.word}"</span></p>
                                    )}
                                    {formedWordPreview.vert.word.length >= 2 && (
                                      <p>Vertical: <span className="underline decoration-[#ff007f] font-mono text-[#00f0ff]">"{correctedPreviewWords.vert || formedWordPreview.vert.word}"</span></p>
                                    )}
                                  </div>
                                ) : (
                                  "Click below keyboard or type letters!"
                                )}
                              </div>
                              {(formedWordPreview.horiz.word.length >= 3 || formedWordPreview.vert.word.length >= 3) && (
                                <p className={`text-[10px] ${previewIsValid ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}`}>
                                  {previewIsValid === true ? "✅ Valid Word Formed!" : previewIsValid === false ? "❌ Not recognized in dictionary" : "Verifying..."}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-400 italic">Click an empty chessboard square above to start!</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 w-full md:w-auto">
                        {selectedBoxIdx !== null && board[selectedBoxIdx] !== null && (
                          <button
                            onClick={() => {
                              const updated = [...board];
                              updated[selectedBoxIdx] = null;
                              setBoard(updated);
                              setSelectedLetter(null);
                              playSound("click");
                            }}
                            className="px-3 py-3 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold uppercase font-sans cursor-pointer rounded transition-all"
                          >
                            Clear Square
                          </button>
                        )}
                        <button
                          onClick={handleManualSubmitMove}
                          disabled={selectedBoxIdx === null || !selectedLetter}
                          className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-[#ff007f] to-[#9d00ff] text-white hover:brightness-110 font-sans font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer rounded"
                        >
                          Submit Move
                        </button>
                      </div>

                    </div>
                  ) : (
                    /* Computer thinking state */
                    <div className="w-full bg-[#10072b]/95 border border-[#ff007f]/50 text-white rounded-xl p-5 shadow-[0_0_15px_rgba(255,0,127,0.25)] flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 text-[#00f0ff] animate-spin" />
                        <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#00f0ff]">
                          Lexi-Bot AI is processing turn...
                        </span>
                      </div>
                      <p className="text-xs font-sans text-zinc-300 max-w-md italic">
                        "{aiThoughts || "Evaluating empty slots and letter parameters..."}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestions / Hints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* AI Hint Helper */}
                <div className="border border-[#ff007f]/30 bg-[#150d3a]/60 rounded-xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#ff007f]/20">
                      <span className="text-xs font-sans font-bold uppercase tracking-widest flex items-center gap-1.5 text-zinc-200">
                        <Sparkles className="w-3.5 h-3.5 text-[#f0b90b]" /> AI Strategic Hints
                      </span>
                      {fetchingHints && (
                        <span className="text-[9px] font-mono bg-[#ff007f]/20 text-[#ff007f] px-1.5 py-0.5 rounded animate-pulse">
                          Querying Gemini...
                        </span>
                      )}
                    </div>

                    {aiHints && aiHints.length > 0 ? (
                      <div className="space-y-3">
                        {aiHints.map((hint, hidx) => (
                          <div key={hidx} className="bg-[#1c123c]/80 p-2.5 border border-[#ff007f]/20 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-mono font-bold tracking-widest text-[#00f0ff]">
                                {hint.suggestedWord}
                              </span>
                              <span className="text-[10px] uppercase font-sans bg-[#ff007f] text-white px-1.5 py-0.2 font-bold rounded">
                                {hint.points} PTS
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-tight">
                              {hint.howToBuild}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-xs text-zinc-400 font-sans italic">
                          Hints will populate based on current letter combinations!
                        </p>
                        <button
                          onClick={triggerLoadHints}
                          className="mt-3 px-3 py-1 text-[10px] uppercase font-sans border border-[#00f0ff]/40 hover:border-[#ff007f] text-[#00f0ff] hover:text-[#ff007f] bg-[#1c123c] transition-colors rounded cursor-pointer"
                        >
                          Request AI Suggestions
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 mt-4 text-center">
                    Powered by gemini-3.5-flash
                  </div>
                </div>

                {/* Reset entire board block */}
                <div className="border border-[#ff007f]/30 bg-[#150d3a]/60 rounded-xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200 mb-3 border-b border-[#ff007f]/20 pb-2 flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 text-[#00f0ff]" /> Grid Maintenance
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      Are you stuck in a lexical block? Players can clear the entire grid of boxes at any time to start a fresh sequence from scratch!
                    </p>

                    <button
                      onClick={handleClearBoard}
                      className="px-4 py-2 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white text-xs uppercase font-sans font-bold tracking-wider transition-all rounded cursor-pointer"
                    >
                      Wipe and Clear Board
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#ff007f]/10 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">
                      Action resets board empty
                    </span>
                    <button
                      onClick={terminateGame}
                      className="text-xs font-sans font-bold uppercase tracking-wider text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Forfeit Session
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Leaderboard, Timers and Logs */}
            <div className={`${isWidescreen ? "lg:col-span-3" : "lg:col-span-4"} flex flex-col gap-6`}>
              
              {/* Turn Stats / Timer */}
              <div className="border-2 border-[#ff007f]/50 bg-[#0c051e] text-white p-6 rounded-xl flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                <div className="text-[10px] uppercase font-sans tracking-[0.2em] text-zinc-400 mb-2">
                  Time Remaining
                </div>

                <div className="text-5xl md:text-6xl font-light font-mono tracking-tight tabular-nums text-white">
                  {timeLimitSec === 0 ? (
                    "∞"
                  ) : (
                    <>
                      {Math.floor(turnTimeLeftMs / 1000)}
                      <span className="text-xl text-[#ff007f]">
                        .{(turnTimeLeftMs % 1000).toString().padStart(3, "0").substring(0, 2)}s
                      </span>
                    </>
                  )}
                </div>

                {/* Active Player Tag */}
                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/15">
                  <span className="text-xs">
                    {players[currentPlayerIdx].avatar}
                  </span>
                  <span className="text-xs font-sans uppercase tracking-wider font-extrabold text-[#f0b90b]">
                    {players[currentPlayerIdx].name}'s Turn
                  </span>
                </div>

                {/* Progress bar */}
                {timeLimitSec > 0 && (
                  <div className="mt-6 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff007f] to-[#00f0ff] transition-all duration-75"
                      style={{ width: `${(turnTimeLeftMs / (timeLimitSec * 1000)) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Dedicated Point Section */}
              <div className="border border-[#ff007f]/30 bg-[#150d3a]/60 rounded-xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <h2 className="text-xs font-sans font-bold uppercase tracking-[0.15em] mb-4 border-b border-[#ff007f]/20 pb-2 flex justify-between items-center text-[#ff007f]">
                  <span>Score Table & Efficiency</span>
                  <Flame className="w-3.5 h-3.5 text-[#ff007f] animate-pulse" />
                </h2>

                <div className="space-y-4">
                  {players.map((p, idx) => {
                    const isTurn = idx === currentPlayerIdx;
                    const avgTime = p.movesCount > 0 ? (p.totalTurnTime / p.movesCount / 1000).toFixed(1) : "0";

                    return (
                      <div
                        key={p.id}
                        className={`p-3 border rounded-lg transition-all ${
                          isTurn
                            ? "border-[#ff007f] bg-[#1c123c]/90 shadow-[0_0_12px_rgba(255,0,127,0.35)] font-bold scale-[1.02]"
                            : "border-[#ff007f]/15 bg-[#150d3a]/40 opacity-70"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full border border-[#ff007f]/20 bg-[#150d3a] flex items-center justify-center text-sm shadow">
                              {p.avatar}
                            </span>
                            <span className="font-sans font-bold text-xs uppercase tracking-wider text-white">
                              {p.name} {p.isComputer && "(AI)"}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-black text-[#00f0ff]">
                            {p.score} PTS
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-zinc-400 font-mono uppercase">
                          <div>
                            <span className="block text-[8px] text-zinc-500 font-sans">Moves</span>
                            {p.movesCount}
                          </div>
                          <div>
                            <span className="block text-[8px] text-zinc-500 font-sans">Avg Speed</span>
                            {avgTime}s
                          </div>
                          <div>
                            <span className="block text-[8px] text-zinc-500 font-sans">Words</span>
                            {p.wordsFormed.length}
                          </div>
                        </div>

                        {p.wordsFormed.length > 0 && (
                          <div className="mt-2 pt-1.5 border-t border-[#ff007f]/10 flex flex-wrap gap-1">
                            {p.wordsFormed.map((w, widx) => (
                              <span
                                key={widx}
                                className="text-[9px] font-mono uppercase tracking-tight bg-[#ff007f]/10 border border-[#ff007f]/20 text-[#00f0ff] px-1.5 py-0.5 rounded"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dictionary Checker helper */}
              <div className="min-h-[300px]">
                <DictionaryChecker themeStyles={s} />
              </div>

              {/* Move Logs */}
              <div className="border border-[#ff007f]/30 bg-[#150d3a]/60 text-white p-5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] max-h-[300px] overflow-y-auto">
                <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200 mb-3 border-b border-[#ff007f]/20 pb-2">
                  Session Logbook
                </h3>
                {moveLogs.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic text-center py-4">
                    No moves documented in this chronicle yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {moveLogs.map((log) => (
                      <div key={log.id} className="text-xs border-b border-[#ff007f]/10 pb-2 last:border-0">
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className="font-bold uppercase tracking-wider text-[10px]"
                            style={{ color: log.player.color }}
                          >
                            {log.player.name}
                          </span>
                          <span className="font-mono text-[9px] text-zinc-500">
                            {log.timeSpentSec}s type
                          </span>
                        </div>
                        <p className="leading-tight text-zinc-300">
                          Placed <strong className="font-mono text-[#00f0ff]">'{log.letter}'</strong> in Square {(() => {
                            if (log.boxIdx === undefined) return "?";
                            const c = log.boxIdx % 40;
                            const r = Math.floor(log.boxIdx / 40);
                            const fileLabel = c < 26 ? String.fromCharCode(65 + c) : "A" + String.fromCharCode(65 + (c - 26));
                            return `${fileLabel}${25 - r}`;
                          })()}.
                          {log.formedWord ? (
                            <>
                              {" "}
                              Formed word: <span className="underline font-bold text-white uppercase">{log.formedWord}</span>{" "}
                              <span className="font-mono font-bold text-emerald-400 bg-emerald-400/10 px-1 py-0.2 rounded border border-emerald-400/25 ml-1">
                                +{log.pointsEarned} pts
                              </span>
                            </>
                          ) : (
                            " Scored 0 pts."
                          )}
                        </p>
                        {log.ruleTriggered && (
                          <div className="text-[9px] uppercase tracking-wide font-mono text-[#ff007f] font-bold mt-1 animate-pulse">
                            ⚠️ {log.ruleTriggered} triggered!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GAME OVER MATCH SUMMARY */}
        {gameState === "gameover" && (
          <div className="max-w-2xl mx-auto border-2 border-[#ff007f]/50 bg-[#150d3a]/80 p-8 md:p-12 shadow-[0_0_25px_rgba(255,0,127,0.3)] rounded-2xl text-center text-white" id="gameover-view">
            <span className="text-[10px] uppercase font-sans tracking-[0.4em] bg-[#ff007f] text-white px-3 py-1 font-black inline-block mb-4 shadow-[0_0_8px_#ff007f] rounded">
              CHRONICLE ENDED
            </span>
            <h2 className="text-4xl font-black italic mb-2 tracking-tight bg-gradient-to-r from-[#ff007f] via-[#f0b90b] to-[#00f0ff] bg-clip-text text-transparent">
              Match Complete.
            </h2>
            <p className="text-sm text-zinc-400 uppercase tracking-widest font-sans mb-8">
              Final Standings & Statistics
            </p>

            {/* Winner Spotlight */}
            <div className="bg-[#1c123c]/80 border border-[#ff007f]/30 p-6 mb-8 relative overflow-hidden rounded-xl">
              <div className="absolute top-2 left-2 text-[8px] font-mono uppercase text-zinc-500">
                Victor Spotlight
              </div>
              {(() => {
                const sorted = [...players].sort((a, b) => b.score - a.score);
                const winner = sorted[0];
                return (
                  <div>
                    <span className="text-5xl block mb-2">{winner.avatar}</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#00f0ff] mb-1">
                      {winner.name}
                    </h3>
                    <p className="text-lg italic text-[#ff007f] font-black">
                      {winner.score} Points Secured!
                    </p>
                    <div className="mt-4 pt-3 border-t border-[#ff007f]/15 flex justify-center gap-6 text-xs font-mono uppercase text-zinc-400">
                      <div>Moves: {winner.movesCount}</div>
                      <div>Avg Response: {winner.movesCount > 0 ? (winner.totalTurnTime / winner.movesCount / 1000).toFixed(2) : "0"}s</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Score rankings */}
            <div className="space-y-3 mb-8">
              {[...players]
                .sort((a, b) => b.score - a.score)
                .map((p, rank) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center py-2.5 px-4 border border-[#ff007f]/20 bg-[#1c123c]/60 rounded-lg text-sm font-sans uppercase tracking-wider"
                  >
                    <span className="font-bold flex items-center gap-2">
                      <span className="text-zinc-500">{rank + 1}.</span>
                      <span>{p.avatar}</span>
                      <span>{p.name}</span>
                    </span>
                    <span className="font-mono font-bold text-[#00f0ff]">{p.score} PTS</span>
                  </div>
                ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setGameState("lobby");
                  playSound("success");
                }}
                className="px-6 py-3 border border-[#ff007f]/40 hover:border-[#ff007f] bg-[#1c123c] hover:bg-[#ff007f] text-white font-sans font-bold text-xs uppercase tracking-widest transition-all rounded-lg cursor-pointer"
              >
                Change Game Settings
              </button>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-[#ff007f] to-[#9d00ff] hover:brightness-110 text-white font-sans font-bold text-xs uppercase tracking-widest transition-all rounded-lg shadow-[0_0_10px_rgba(255,0,127,0.3)] cursor-pointer"
              >
                Rematch Arena
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER & STICKY BOTTOM KEYBOARD SHELF */}
      {gameState === "playing" && (
        <>
          {/* Floating discrete keyboard trigger */}
          {!isKeyboardOpen && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
              <button
                onClick={() => {
                  setIsKeyboardOpen(true);
                  playSound("click");
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#ff007f] to-[#9d00ff] hover:brightness-110 text-white rounded-full font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,127,0.4)] cursor-pointer border border-[#00f0ff]/30 transition-all duration-150 animate-pulse"
              >
                <Keyboard className="w-4 h-4 text-[#00f0ff]" />
                <span>Open Keyboard</span>
                <ChevronUp className="w-4 h-4 text-[#00f0ff]" />
              </button>
            </div>
          )}

          {/* Collapsible Keyboard Keys Drawer */}
          {isKeyboardOpen && (
            <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c051e]/95 backdrop-blur-md border-t-2 border-[#ff007f]/50 py-3 transition-all duration-300 shadow-[0_-5px_25px_rgba(255,0,127,0.25)]">
              <div className="max-w-4xl mx-auto px-4">
                {/* Header bar of the keyboard shelf - clickable to collapse */}
                <div 
                  className="flex items-center justify-between cursor-pointer py-1 select-none border-b border-[#ff007f]/10 mb-2"
                  onClick={() => {
                    setIsKeyboardOpen(false);
                    playSound("click");
                  }}
                >
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Keyboard className="w-4 h-4 text-[#00f0ff]" />
                    <span className="text-[10px] uppercase tracking-widest font-sans font-extrabold">
                      Dedicated Input Keyboard
                    </span>
                  </div>
                  <button
                    className="p-1 hover:bg-[#ff007f]/10 text-zinc-400 hover:text-[#00f0ff] rounded-full transition-colors cursor-pointer"
                    title="Hide Keyboard"
                  >
                    <ChevronDown className="w-5 h-5 text-[#ff007f] animate-bounce" />
                  </button>
                </div>

                {/* Keyboard Keys Area */}
                <div className="animate-fade-in duration-200">
                  {/* Keyboard Keys Layout */}
                  <div className="flex flex-col gap-1.5 max-w-xl mx-auto mb-2" id="onscreen-keyboard-section">
                    {KEYBOARD_ROWS.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex justify-center gap-1">
                        {row.map((key) => {
                          const isSelected = selectedLetter === key;
                          return (
                            <button
                              key={key}
                              onClick={(e) => {
                                e.stopPropagation(); // prevent closing the shelf
                                if (selectedBoxIdx !== null) {
                                  setSelectedLetter(key);
                                  playSound("click");
                                } else {
                                  playSound("error");
                                  setErrorMessage("Please click on a box in the board grid first to target where you want to place this letter!");
                                }
                              }}
                              id={`keyboard-key-${key}`}
                              className={`
                                w-8 h-10 md:w-10 md:h-11 rounded border flex items-center justify-center font-sans font-black text-xs sm:text-sm transition-all duration-150 select-none touch-manipulation cursor-pointer
                                ${
                                  isSelected
                                    ? "bg-gradient-to-r from-[#ff007f] to-[#9d00ff] text-white border-transparent scale-95 ring-2 ring-[#00f0ff] shadow-[0_0_10px_#ff007f]"
                                    : "bg-[#1c123c] border-[#ff007f]/20 hover:border-[#ff007f] text-zinc-200 hover:text-white"
                                }
                              `}
                            >
                              {key}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] uppercase font-mono text-zinc-500 text-center">
                    Click any square on the board grid first, then type with keys or physical keyboard • Automatically submits in 5s
                  </div>
                </div>
              </div>
            </footer>
          )}
        </>
      )}

      {/* IMMERSIVE FULL SCREEN GAMEPLAY VIEW */}
      {isImmersiveFullscreen && gameState === "playing" && (
        <div className={`fixed inset-0 ${s.wrapper} z-[99999] p-4 md:p-6 flex flex-col gap-4 overflow-hidden`} id="immersive-fullscreen-arena">
          {/* Top Control HUD */}
          <header className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-3 border-b border-zinc-800">
            {/* Left side: Turn info */}
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>{players[currentPlayerIdx]?.avatar}</span>
                <span>{players[currentPlayerIdx]?.name}</span>
                {players[currentPlayerIdx]?.isComputer && <span className="text-xs bg-[#ff007f] text-white px-1.5 py-0.5 rounded animate-pulse">AI</span>}
              </span>
              <div className="h-6 w-[1px] bg-zinc-700 hidden sm:block" />
              {/* Turn Countdown Progress/Time */}
              <div className="flex items-center gap-1.5 font-mono text-sm">
                <Clock className="w-4 h-4 text-[#00f0ff] animate-spin" />
                <span className="text-[#00f0ff] font-bold">
                  {timeLimitSec === 0 && !players[currentPlayerIdx]?.isComputer ? "Unlimited Time" : `${(turnTimeLeftMs / 1000).toFixed(1)}s Left`}
                </span>
              </div>
            </div>

            {/* Middle side: Scores */}
            <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {players.map((p, idx) => {
                const isActive = idx === currentPlayerIdx;
                return (
                  <div 
                    key={p.id} 
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                      isActive 
                        ? "bg-[#ff007f]/20 border-[#ff007f] text-white shadow-[0_0_8px_#ff007f]" 
                        : "bg-[#1c123c]/40 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <span>{p.avatar}</span>
                    <span>{p.name}:</span>
                    <span className="text-[#00f0ff]">{p.score} PTS</span>
                  </div>
                );
              })}
            </div>

            {/* Right side: Exit button */}
            <div className="flex items-center gap-2">
              {/* Theme Selector inside fullscreen */}
              <select
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value as any);
                  playSound("click");
                }}
                className="bg-[#1c123c] border border-zinc-700 text-xs font-bold px-2 py-1.5 rounded outline-none text-white"
              >
                <option value="system">💻 System Default</option>
                <option value="cyber">🌌 Cyber Neon</option>
                <option value="light">☀️ Clean Light</option>
                <option value="amber">📟 Amber Terminal</option>
                <option value="forest">🌲 Forest Sage</option>
              </select>

              <button
                onClick={() => {
                  if (isGamePaused) {
                    resumeGame();
                  } else {
                    pauseGame();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                  isGamePaused
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    : "bg-rose-500/20 border-rose-400 text-rose-300 hover:scale-105 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                }`}
              >
                {isGamePaused ? "▶️ Resume" : "⏸️ Pause"}
              </button>

              <button
                onClick={() => {
                  setIsImmersiveFullscreen(false);
                  playSound("click");
                }}
                className="px-4 py-2 bg-[#ff007f] hover:bg-[#d00067] text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-[0_0_10px_#ff007f] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>✕ Exit Fullscreen</span>
              </button>
            </div>
          </header>

          {/* Center Main Arena: The giant grid taking full remaining screen height */}
          <main className="flex-1 w-full overflow-auto bg-[#0c051e]/60 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center relative">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-500 uppercase">
              Drag & scroll to inspect all 1000 boxes • Click any box to type or place a letter
            </div>

            {/* Fullscreen Zoom Slider & Indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-[#1c123c]/95 px-2.5 py-1 rounded border border-[#ff007f]/30 z-10 text-[10px] font-mono">
              <span className="text-zinc-400 font-bold">ZOOM:</span>
              <button onClick={() => setZoomLevel("fit")} className={`px-1.5 py-0.5 rounded ${zoomLevel === "fit" ? "bg-[#ff007f] text-white" : "text-zinc-400"}`}>FIT</button>
              <button onClick={() => setZoomLevel("compact")} className={`px-1.5 py-0.5 rounded ${zoomLevel === "compact" ? "bg-[#ff007f] text-white" : "text-zinc-400"}`}>WIDE</button>
              <button onClick={() => setZoomLevel("medium")} className={`px-1.5 py-0.5 rounded ${zoomLevel === "medium" ? "bg-[#ff007f] text-white" : "text-zinc-400"}`}>RADAR</button>
              <button onClick={() => setZoomLevel("full")} className={`px-1.5 py-0.5 rounded ${zoomLevel === "full" ? "bg-[#ff007f] text-white" : "text-zinc-400"}`}>CLOSE-UP</button>
            </div>

            <div className="inline-block max-w-full max-h-full overflow-auto p-2 scrollbar-thin">
              <div 
                className="grid gap-1 bg-[#10072b]/85 p-2 rounded-xl border border-zinc-800 shadow-2xl"
                style={{ 
                  gridTemplateColumns: `repeat(40, minmax(0, 1fr))`,
                  width: zoomLevel === "fit" ? "100%" : zoomLevel === "compact" ? "1400px" : zoomLevel === "medium" ? "1800px" : "2800px"
                }}
              >
                {board.map((letter, idx) => {
                  const isSelected = selectedBoxIdx === idx;
                  const isPartOfPreview = formedWordPreview.horiz.indices.includes(idx) || formedWordPreview.vert.indices.includes(idx);
                  const completedCount = completedWordDetail.counts[idx];

                  const r = Math.floor(idx / 40);
                  const c = idx % 40;
                  const fileLabel = c < 26 ? String.fromCharCode(65 + c) : "A" + String.fromCharCode(65 + (c - 26));
                  const rankLabel = (25 - r).toString();
                  const coordinate = `${fileLabel}${rankLabel}`;

                  // Large chunky boxes for immersive fullscreen gameplay!
                  const sizeClasses = 
                    zoomLevel === "fit"
                      ? "aspect-square h-auto text-[11px] sm:text-xs md:text-sm lg:text-base font-black p-0"
                      : zoomLevel === "compact" 
                      ? "h-11 text-base font-black p-0" 
                      : zoomLevel === "medium" 
                      ? "h-14 text-lg font-black p-0" 
                      : "h-20 text-2xl font-black p-0";

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedBoxIdx(idx);
                        setSelectedLetter(letter || null); // preset if filled
                        playSound("click");
                      }}
                      className={`w-full ${sizeClasses} rounded border flex items-center justify-center select-none relative transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-[#f0b90b] border-white scale-[1.08] z-10 shadow-[0_0_15px_#f0b90b] text-zinc-950 font-black"
                          : isPartOfPreview && previewIsValid
                          ? "bg-emerald-500/30 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] font-bold"
                          : isPartOfPreview
                          ? "bg-amber-500/30 border-amber-400 text-white"
                          : completedCount >= 2
                          ? "bg-gradient-to-br from-[#9d00ff]/30 to-[#4d009a]/50 border-[#9d00ff]/50 text-white font-black"
                          : completedCount === 1
                          ? "bg-[#1c123c] border-[#ff007f]/30 text-[#ff007f] font-bold hover:bg-[#2c1a5c]"
                          : "bg-[#150d3a]/40 border-zinc-800/60 text-zinc-500 hover:bg-[#201454]/40"
                      }`}
                      title={`${coordinate}: ${letter || "[Empty]"}`}
                    >
                      {letter || ""}
                      
                      {/* Subscript Coordinates indicator for active zoom levels */}
                      {zoomLevel !== "fit" && (
                        <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono text-zinc-600 tracking-tighter scale-90">
                          {coordinate}
                        </span>
                      )}

                      {/* Score dots */}
                      {completedCount > 0 && !letter && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ff007f] animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </main>

          {/* Bottom Area: Controls, previews, and keyboard */}
          <footer className="w-full flex flex-col md:flex-row gap-4 items-stretch bg-[#150d3a]/90 p-4 border border-[#ff007f]/30 rounded-xl relative">
            {/* Input Selection Indicators & Action Controls */}
            <div className="flex-1 flex flex-col gap-3 justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#00f0ff] font-bold block mb-1">
                  🎯 Selected Box Coordinates
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-white bg-[#10072b] px-3 py-1.5 rounded border border-zinc-800">
                    {selectedBoxIdx !== null ? (() => {
                      const r = Math.floor(selectedBoxIdx / 40);
                      const c = selectedBoxIdx % 40;
                      const fileLabel = c < 26 ? String.fromCharCode(65 + c) : "A" + String.fromCharCode(65 + (c - 26));
                      return `${fileLabel}${25 - r}`;
                    })() : "NONE SELECTED"}
                  </span>
                  
                  {selectedBoxIdx !== null && (
                    <span className="text-xs text-zinc-400">
                      Currently targeted. Enter a letter using physical keyboard or the layout below!
                    </span>
                  )}
                </div>
              </div>

              {/* Word Preview Banner */}
              {selectedBoxIdx !== null && selectedLetter && (
                <div className="p-3 bg-zinc-950/80 rounded border border-zinc-800 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono text-zinc-400 tracking-wider">
                      Dynamic Combined Word Formations (Length &gt;= 3)
                    </span>
                    {previewIsValid === true ? (
                      <span className="text-[9px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500 px-2 py-0.5 rounded">
                        ✓ Dictionary Approved
                      </span>
                    ) : previewIsValid === false ? (
                      <span className="text-[9px] uppercase font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded">
                        ✗ Word not recognized in dictionary
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded">
                        Verifying word...
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {formedWordPreview.horiz.word && (
                      <span className="bg-purple-950/50 text-[#ff007f] px-2 py-1 rounded border border-purple-900 font-bold font-mono">
                        Horizontal: {correctedPreviewWords.horiz || formedWordPreview.horiz.word} ({formedWordPreview.horiz.word.length} Letters)
                      </span>
                    )}
                    {formedWordPreview.vert.word && (
                      <span className="bg-purple-950/50 text-[#00f0ff] px-2 py-1 rounded border border-purple-900 font-bold font-mono">
                        Vertical: {correctedPreviewWords.vert || formedWordPreview.vert.word} ({formedWordPreview.vert.word.length} Letters)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Submit / Trigger Move Buttons */}
              <div className="flex gap-2">
                <button
                  disabled={selectedBoxIdx === null || !selectedLetter || players[currentPlayerIdx]?.isComputer}
                  onClick={() => executeMoveForPlayer(selectedBoxIdx!, selectedLetter!, false)}
                  className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-lg transition-all border cursor-pointer select-none flex items-center justify-center gap-2 ${
                    selectedBoxIdx !== null && selectedLetter && !players[currentPlayerIdx]?.isComputer
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)] hover:brightness-110"
                      : "bg-zinc-800/40 text-zinc-600 border-zinc-800/60 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-5 h-5" />
                  <span>Submit Final Word Move</span>
                </button>
              </div>
            </div>

            {/* Right side: Interactive A-Z Virtual Keyboard inside bottom tray */}
            <div className="w-full md:w-[480px] bg-[#10072b]/80 p-3 rounded-lg border border-zinc-800 flex flex-col gap-2">
              <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">
                🖮 Integrated Input Keys
              </div>
              <div className="flex flex-col gap-1">
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-1">
                    {row.map((key) => {
                      const isSelected = selectedLetter === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            if (selectedBoxIdx !== null) {
                              setSelectedLetter(key);
                              playSound("click");
                            } else {
                              playSound("error");
                              setErrorMessage("Please click on a board box first to target your placement!");
                            }
                          }}
                          className={`
                            flex-1 h-9 rounded font-sans font-black text-xs transition-all duration-150 select-none cursor-pointer
                            ${
                              isSelected
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black border-transparent scale-95 ring-2 ring-white shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                : "bg-[#1c123c] border-zinc-800 hover:border-[#ff007f] text-zinc-200 hover:text-white"
                            }
                          `}
                        >
                          {key}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="text-[8px] uppercase font-mono text-zinc-500 text-center">
                Keyboard support enabled: Type letters directly on your physical computer keyboard too!
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* GAME PAUSED OVERLAY */}
      {isGamePaused && (
        <div className="fixed inset-0 bg-[#0c051ed8] backdrop-blur-md z-[999999] flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
          <div className="max-w-md w-full bg-[#150d3a]/90 border-2 border-[#ff007f] rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(255,0,127,0.4)] flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#ff007f]/20 flex items-center justify-center border-2 border-[#ff007f] animate-pulse">
              <span className="text-4xl">⏸️</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-widest text-[#ff007f] drop-shadow-[0_0_15px_rgba(255,0,127,0.6)]">
              Match Paused
            </h2>

            <p className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed">
              The game progress is temporarily frozen. Switch tabs back or click the button below to resume your tactical moves.
            </p>

            <button
              onClick={resumeGame}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-white font-sans font-black text-sm uppercase tracking-[0.2em] transition-all duration-200 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.45)] hover:shadow-[0_0_25px_rgba(20,184,166,0.6)] hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              ▶️ Resume Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
