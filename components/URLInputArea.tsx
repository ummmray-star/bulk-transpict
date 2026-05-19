"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { parseUrlList } from "@/lib/transcript";

interface Props {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  loading: boolean;
}

export default function URLInputArea({ value, onChange, onSubmit, loading }: Props) {
  const urls = parseUrlList(value);
  const count = urls.length;
  const atMax = count >= 100;
  const canSubmit = count > 0 && !loading;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canSubmit) {
        e.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canSubmit, onSubmit]);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <label htmlFor="url-input" className="text-sm font-semibold text-white">
          YouTube URLs
        </label>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            atMax
              ? "bg-[#F97316]/20 text-[#F97316]"
              : count > 0
              ? "bg-[#0D9488]/15 text-[#0D9488]"
              : "text-[#94a3b8]"
          }`}
        >
          {count} / 100 URLs
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="url-input"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste YouTube URLs here, one per line:\nhttps://youtube.com/watch?v=dQw4w9WgXcQ\nhttps://youtu.be/9bZkp7q19f0\nhttps://youtube.com/shorts/abc123...`}
          disabled={loading}
          rows={10}
          className="w-full resize-none glass rounded-2xl px-5 py-4 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488]/30 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed font-mono"
          aria-label="Paste YouTube URLs"
        />
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={loading || count === 0}
          className="text-xs text-[#94a3b8] hover:text-white transition-colors duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Clear all
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#475569] hidden sm:block">
            Ctrl+Enter to fetch
          </span>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="px-6 py-3 bg-[#F97316] hover:bg-[#ea6c0d] disabled:bg-[#F97316]/30 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors duration-150 cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Fetching...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Fetch {count > 0 ? count : ""} Transcript{count !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
