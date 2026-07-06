import React, { useState } from "react";
import { KEYBOARD_ROWS } from "../utils/gameUtils";
import { Keyboard, ChevronDown, ChevronUp, Anchor } from "lucide-react";

interface OnScreenKeyboardProps {
  selectedLetter: string | null;
  onSelectLetter: (letter: string) => void;
  disabled?: boolean;
}

export default function OnScreenKeyboard({
  selectedLetter,
  onSelectLetter,
  disabled = false
}: OnScreenKeyboardProps) {
  const [isDocked, setIsDocked] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const containerClasses = isDocked
    ? `fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 border-t border-zinc-800 shadow-2xl p-3 transition-transform duration-300 ${
        isCollapsed ? "translate-y-[calc(100%-48px)]" : "translate-y-0"
      }`
    : "w-full max-w-xl mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 shadow-md";

  return (
    <div className={`${isDocked ? "pb-32" : "mt-6"}`} id="keyboard-wrapper">
      <div className={containerClasses}>
        {/* Keyboard Header / Controls */}
        <div className="flex items-center justify-between mb-2 px-1 max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase">
              On-Screen Keyboard
            </span>
            {selectedLetter && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono animate-pulse">
                Selected: {selectedLetter}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Dock/Inline toggle */}
            <button
              onClick={() => setIsDocked(!isDocked)}
              title={isDocked ? "Set Inline in Page" : "Dock to Viewport Bottom"}
              className="text-xs font-mono flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <Anchor className="w-3.5 h-3.5" />
              <span>{isDocked ? "Inline" : "Pin Bottom"}</span>
            </button>

            {isDocked && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                title={isCollapsed ? "Expand Keyboard" : "Collapse Keyboard"}
              >
                {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Keyboard Keys Layout */}
        <div className={`max-w-xl mx-auto flex flex-col gap-2 ${isCollapsed && isDocked ? "h-0 overflow-hidden opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-200"}`}>
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1.5">
              {row.map((key) => {
                const isSelected = selectedLetter === key;
                return (
                  <button
                    key={key}
                    disabled={disabled}
                    onClick={() => onSelectLetter(key)}
                    id={`keyboard-key-${key}`}
                    className={`
                      h-11 sm:h-12 flex-1 max-w-[50px] flex items-center justify-center rounded-lg font-mono font-bold text-sm sm:text-base transition-all duration-150 relative overflow-hidden select-none touch-manipulation
                      ${
                        isSelected
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 scale-95 border-emerald-400 ring-2 ring-emerald-400/50"
                          : "bg-zinc-800/90 hover:bg-zinc-700/90 active:bg-zinc-900 border border-zinc-700/50 text-zinc-200 hover:text-white"
                      }
                      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95"}
                    `}
                  >
                    {key}
                    {isSelected && (
                      <span className="absolute inset-0 bg-white/20 animate-ping rounded-lg pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
