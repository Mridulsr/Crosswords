import React, { useState } from "react";
import { lookupWord } from "../utils/apiService";
import { DictionaryResult } from "../types";
import { Search, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";

interface DictionaryCheckerProps {
  themeStyles?: any;
}

export default function DictionaryChecker({ themeStyles }: DictionaryCheckerProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DictionaryResult | null>(null);

  // Fallback default (cyber style) if no themeStyles prop is passed
  const s = themeStyles || {
    panel: "border-2 border-[#ff007f]/40 bg-[#150d3a]/80 shadow-[0_0_20px_rgba(255,0,127,0.2)] rounded-2xl",
    borderMuted: "border-[#ff007f]/20",
    accentText: "text-[#00f0ff]",
    secondaryText: "text-zinc-400",
    btnPrimary: "bg-[#ff007f] hover:bg-[#d00067] text-white border-none shadow-[0_0_12px_#ff007f]",
    inputBg: "bg-[#1c123c] border-[#ff007f]/30 text-white focus:ring-[#ff007f]",
    badgeText: "text-[#ff007f]",
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await lookupWord(query);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-xl h-full flex flex-col justify-between ${s.panel}`} id="dictionary-checker">
      <div>
        <div className={`flex items-center gap-2 mb-3 pb-1 border-b ${s.borderMuted}`}>
          <Search className={`w-4 h-4 ${s.accentText}`} />
          <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200">
            Dictionary Lookup
          </h3>
        </div>

        <p className={`text-[11px] font-sans ${s.secondaryText} mb-4 uppercase tracking-wider leading-relaxed`}>
          Verify word legitimacy, discover parts of speech, and view full definitions.
        </p>

        <form onSubmit={handleCheck} className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a word..."
            id="dict-search-input"
            className={`flex-1 px-3 py-1.5 border rounded-lg text-sm font-mono placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${s.inputBg}`}
          />
          <button
            type="submit"
            disabled={loading}
            id="dict-search-button"
            className={`px-4 py-1.5 hover:brightness-110 rounded-lg font-sans font-bold text-xs uppercase tracking-wider transition-colors duration-150 disabled:opacity-50 cursor-pointer ${s.btnPrimary}`}
          >
            {loading ? "Reading..." : "Verify"}
          </button>
        </form>

        {result && (
          <div className={`mt-4 p-4 border rounded-lg animate-fade-in ${s.inputBg}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className={`text-lg font-bold italic tracking-tight uppercase ${s.accentText}`}>
                {result.word.toLowerCase()}
              </span>
              {result.isValid ? (
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 shadow-sm">
                  <CheckCircle className="w-3 h-3" /> Genuine
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 shadow-sm">
                  <AlertTriangle className="w-3 h-3" /> Disallowed
                </span>
              )}
            </div>

            {result.partOfSpeech && (
              <span className={`text-[10px] font-mono uppercase ${s.secondaryText} block mb-2 italic`}>
                ({result.partOfSpeech})
              </span>
            )}

            <p className="text-xs leading-relaxed mb-3 font-sans text-zinc-100">
              {result.definition}
            </p>

            {result.reason && (
              <p className="text-xs text-rose-300 font-mono bg-rose-500/5 p-2 rounded border border-rose-500/20 mb-2">
                <strong>Disallow Reason:</strong> {result.reason}
              </p>
            )}

            {result.funFact && (
              <div className={`mt-3 pt-2 border-t ${s.borderMuted} flex items-start gap-1.5 text-[11px] ${s.secondaryText} leading-normal italic`}>
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <span>{result.funFact}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`mt-4 pt-3 border-t ${s.borderMuted} text-[10px] font-sans ${s.secondaryText} uppercase tracking-widest text-center`}>
        VICE ARCHIVE SYSTEM v6.0
      </div>
    </div>
  );
}
