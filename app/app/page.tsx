"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import URLInputArea from "@/components/URLInputArea";
import ProgressGrid from "@/components/ProgressGrid";
import ResultCard from "@/components/ResultCard";
import DownloadButtons from "@/components/DownloadButtons";
import { parseUrlList } from "@/lib/transcript";
import { TranscriptJob } from "./types";

const CONCURRENCY = 5;

async function fetchOne(url: string): Promise<Omit<TranscriptJob, "status">> {
  const res = await fetch("/api/transcript", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { url, error: data.error ?? "Unknown error" };
  }
  return { url, videoId: data.videoId, lines: data.lines, fullText: data.fullText };
}

export default function AppPage() {
  const [urlInput, setUrlInput] = useState("");
  const [jobs, setJobs] = useState<TranscriptJob[]>([]);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");

  const updateJob = useCallback((index: number, patch: Partial<TranscriptJob>) => {
    setJobs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  const handleFetch = useCallback(async () => {
    const urls = parseUrlList(urlInput);
    if (urls.length === 0) return;

    // Initialise jobs
    const initial: TranscriptJob[] = urls.map((url) => ({ url, status: "idle" }));
    setJobs(initial);
    setPhase("running");

    // Process with limited concurrency
    let index = 0;

    async function runWorker() {
      while (true) {
        const i = index++;
        if (i >= urls.length) break;
        updateJob(i, { status: "loading" });
        try {
          const result = await fetchOne(urls[i]);
          if (result.error) {
            updateJob(i, { status: "error", error: result.error });
          } else {
            updateJob(i, { status: "done", ...result });
          }
        } catch (err) {
          updateJob(i, {
            status: "error",
            error: err instanceof Error ? err.message : "Network error",
          });
        }
      }
    }

    const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, runWorker);
    await Promise.all(workers);
    setPhase("done");
  }, [urlInput, updateJob]);

  const handleReset = () => {
    setJobs([]);
    setPhase("idle");
    setUrlInput("");
  };

  const doneJobs = jobs.filter((j) => j.status === "done" || j.status === "error");
  const isRunning = phase === "running";

  return (
    <div className="relative min-h-screen">
      <BackgroundBlobs />
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-28 pb-40">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-1">Bulk Transcript Fetcher</h1>
          <p className="text-[#94a3b8] text-sm">
            Paste up to 100 YouTube URLs below and fetch all transcripts in parallel.
          </p>
        </div>

        {/* Input (hidden while running/done) */}
        {phase === "idle" && (
          <URLInputArea
            value={urlInput}
            onChange={setUrlInput}
            onSubmit={handleFetch}
            loading={false}
          />
        )}

        {/* Progress */}
        {jobs.length > 0 && (
          <div className="mt-6 flex flex-col gap-6">
            {/* Control row */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                {phase === "running" ? "Fetching transcripts…" : "Completed"}
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#94a3b8] hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Start over
              </button>
            </div>

            <ProgressGrid jobs={jobs} />

            {/* Results */}
            {doneJobs.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-white">Results</h2>
                {jobs.map((job, i) =>
                  job.status === "done" || job.status === "error" ? (
                    <ResultCard key={job.url + i} job={job} index={i} />
                  ) : null
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading input shown while running */}
        {phase === "running" && (
          <div className="mt-6 glass rounded-2xl p-4 flex items-center gap-3">
            <svg className="w-4 h-4 animate-spin text-[#F97316]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span className="text-sm text-[#94a3b8]">
              Processing {jobs.length} URL{jobs.length !== 1 ? "s" : ""} with {CONCURRENCY} parallel workers…
            </span>
          </div>
        )}

        {/* Empty state */}
        {phase === "idle" && jobs.length === 0 && (
          <div className="mt-12 text-center text-[#475569] text-sm">
            <p>Your results will appear here after fetching.</p>
          </div>
        )}
      </main>

      {/* Sticky download bar */}
      {jobs.length > 0 && <DownloadButtons jobs={jobs} />}
    </div>
  );
}
