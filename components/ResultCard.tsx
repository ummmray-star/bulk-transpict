"use client";

import { useState } from "react";
import { TranscriptJob } from "@/app/app/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Props {
  job: TranscriptJob;
  index: number;
}

export default function ResultCard({ job, index }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!job.fullText) return;
    await navigator.clipboard.writeText(job.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (job.status === "error") {
    return (
      <div className="glass rounded-2xl p-4 border border-red-500/20">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-red-400 mb-0.5">#{index + 1} — Error</p>
            <p className="text-xs text-[#94a3b8] break-all truncate">{job.url}</p>
            <p className="text-xs text-red-300 mt-1">{job.error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (job.status !== "done" || !job.fullText) return null;

  const preview = job.fullText.slice(0, 200);

  return (
    <Collapsible>
      <div className="glass rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <div className="w-7 h-7 rounded-lg bg-[#0D9488]/15 text-[#0D9488] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">#{index + 1} — Transcript</p>
            <p className="text-xs text-[#94a3b8] truncate">{job.url}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-lg glass glass-hover text-[#94a3b8] hover:text-white transition-all duration-150 cursor-pointer"
              aria-label="Copy transcript"
              title="Copy transcript"
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              )}
            </button>

            {/* Expand toggle */}
            <CollapsibleTrigger
              className="p-2 rounded-lg glass glass-hover text-[#94a3b8] hover:text-white transition-all duration-150 cursor-pointer"
              aria-label="Expand transcript"
              title="Expand"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* Preview (always visible) */}
        <div className="px-4 pb-3">
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            {preview}{job.fullText.length > 200 ? "…" : ""}
          </p>
        </div>

        {/* Full text (expanded) */}
        <CollapsibleContent>
          <div className="px-4 pb-4 border-t border-white/5 pt-3">
            <p className="text-xs text-[#94a3b8] leading-relaxed whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
              {job.fullText}
            </p>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
