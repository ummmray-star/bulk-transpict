"use client";

import { TranscriptJob } from "@/app/app/types";

interface Props {
  jobs: TranscriptJob[];
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DownloadButtons({ jobs }: Props) {
  const done = jobs.filter((j) => j.status === "done" && j.fullText);
  const total = jobs.length;
  const completedCount = done.length;
  const errorCount = jobs.filter((j) => j.status === "error").length;
  const allFinished = jobs.every((j) => j.status === "done" || j.status === "error");

  if (total === 0) return null;

  const handleCSV = () => {
    const header = "video_id,url,transcript\n";
    const rows = done.map((j) => {
      const text = (j.fullText ?? "").replace(/"/g, '""');
      return `"${j.videoId ?? ""}","${j.url}","${text}"`;
    });
    downloadFile(header + rows.join("\n"), "transcripts.csv", "text/csv;charset=utf-8");
  };

  const handleTXT = () => {
    const content = done
      .map((j, i) => {
        const header = `=== #${i + 1} | ${j.url} ===`;
        return `${header}\n\n${j.fullText ?? ""}\n`;
      })
      .join("\n" + "─".repeat(60) + "\n\n");
    downloadFile(content, "transcripts.txt", "text/plain;charset=utf-8");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="glass rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status */}
          <div className="text-sm text-[#94a3b8]">
            <span className="text-[#0D9488] font-bold text-base">{completedCount}</span>
            <span> of {total} completed</span>
            {errorCount > 0 && (
              <span className="text-red-400 ml-2">· {errorCount} failed</span>
            )}
            {!allFinished && (
              <span className="ml-2 inline-flex items-center gap-1 text-[#F97316]">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                fetching…
              </span>
            )}
          </div>

          {/* Download buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCSV}
              disabled={completedCount === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0D9488]/20 hover:bg-[#0D9488]/30 text-[#0D9488] font-semibold text-sm rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              CSV
            </button>
            <button
              type="button"
              onClick={handleTXT}
              disabled={completedCount === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-[#ea6c0d] text-white font-semibold text-sm rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              TXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
