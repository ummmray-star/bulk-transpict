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
    const isDisabled =
      job.error?.toLowerCase().includes("disabled") ||
      job.error?.toLowerCase().includes("no transcript") ||
      job.error?.toLowerCase().includes("not available");

    return (
      <div className={`glass rounded-2xl p-4 border ${isDisabled ? "border-amber-500/20" : "border-red-500/20"}`}>
        <div className="flex items-start gap-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
            isDisabled ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"
          }`}>
            {isDisabled ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold mb-0.5 ${isDisabled ? "text-amber-400" : "text-red-400"}`}>
              #{index + 1} — {isDisabled ? "No Transcript Available" : "Error"}
            </p>
            <p className="text-xs text-[#94a3b8] break-all truncate">{job.url}</p>
            <p className={`text-xs mt-1 ${isDisabled ? "text-amber-300/80" : "text-red-300"}`}>
              {isDisabled
                ? "This video has transcripts disabled. This is common for Shorts and videos without captions."
                : job.error}
            </p>
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
