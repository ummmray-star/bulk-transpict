"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import URLInputArea from "@/components/URLInputArea";
import ChannelSearch, { VideoResult } from "@/components/ChannelSearch";
import VideoGrid from "@/components/VideoGrid";
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
  if (!res.ok) return { url, error: data.error ?? "Unknown error" };
  return { url, videoId: data.videoId, lines: data.lines, fullText: data.fullText };
}

type Mode = "channel" | "urls";

export default function AppPage() {
  const [mode, setMode] = useState<Mode>("channel");

  // URL mode state
  const [urlInput, setUrlInput] = useState("");

  // Channel mode state
  const [channelName, setChannelName] = useState("");
  const [channelVideos, setChannelVideos] = useState<VideoResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Shared fetch state
  const [jobs, setJobs] = useState<TranscriptJob[]>([]);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");

  const updateJob = useCallback((index: number, patch: Partial<TranscriptJob>) => {
    setJobs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  const runFetch = useCallback(async (urls: string[]) => {
    if (urls.length === 0) return;
    const initial: TranscriptJob[] = urls.map((url) => ({ url, status: "idle" }));
    setJobs(initial);
    setPhase("running");

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

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, runWorker));
    setPhase("done");
  }, [updateJob]);

  const handleURLFetch = useCallback(() => {
    runFetch(parseUrlList(urlInput));
  }, [urlInput, runFetch]);

  const handleChannelFetch = useCallback(() => {
    const urls = channelVideos
      .filter((v) => selected.has(v.videoId))
      .map((v) => v.url);
    runFetch(urls);
  }, [channelVideos, selected, runFetch]);

  const handleReset = () => {
    setJobs([]);
    setPhase("idle");
    setUrlInput("");
    setChannelVideos([]);
    setSelected(new Set());
    setChannelName("");
  };

  const toggleVideo = (videoId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId);
      else next.add(videoId);
      return next;
    });
  };

  const doneJobs = jobs.filter((j) => j.status === "done" || j.status === "error");
  const showInput = phase === "idle";

  return (
    <div className="relative min-h-screen">
      <BackgroundBlobs />
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-28 pb-40">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white mb-1">Bulk Transcript Fetcher</h1>
          <p className="text-[#94a3b8] text-sm">
            Search a channel or paste URLs — fetch transcripts in parallel, download as CSV or TXT.
          </p>
        </div>

        {/* Mode tabs */}
        {showInput && (
          <div className="flex gap-1 p-1 glass rounded-xl w-fit mb-6">
            {(["channel", "urls"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  mode === m
                    ? "bg-[#0D9488] text-white"
                    : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {m === "channel" ? (
                  <span className="flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Channel
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    Paste URLs
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Input panels */}
        {showInput && mode === "channel" && (
          <div className="flex flex-col gap-6">
            <ChannelSearch
              onResults={({ channelName: name, videos }) => {
                setChannelName(name);
                setChannelVideos(videos);
                setSelected(new Set());
              }}
            />
            {channelVideos.length > 0 && (
              <VideoGrid
                channelName={channelName}
                videos={channelVideos}
                selected={selected}
                onToggle={toggleVideo}
                onSelectAll={() => setSelected(new Set(channelVideos.map((v) => v.videoId)))}
                onDeselectAll={() => setSelected(new Set())}
                onFetch={handleChannelFetch}
                fetching={false}
              />
            )}
          </div>
        )}

        {showInput && mode === "urls" && (
          <URLInputArea
            value={urlInput}
            onChange={setUrlInput}
            onSubmit={handleURLFetch}
            loading={false}
          />
        )}

        {/* Progress & results */}
        {jobs.length > 0 && (
          <div className="mt-6 flex flex-col gap-6">
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

            {phase === "running" && (
              <div className="glass rounded-2xl p-4 flex items-center gap-3">
                <svg className="w-4 h-4 animate-spin text-[#F97316]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span className="text-sm text-[#94a3b8]">
                  Processing {jobs.length} video{jobs.length !== 1 ? "s" : ""} with {CONCURRENCY} parallel workers…
                </span>
              </div>
            )}

            <ProgressGrid jobs={jobs} />

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

        {phase === "idle" && jobs.length === 0 && !channelVideos.length && (
          <div className="mt-12 text-center text-[#475569] text-sm">
            <p>Search a channel or paste URLs to get started.</p>
          </div>
        )}
      </main>

      {jobs.length > 0 && <DownloadButtons jobs={jobs} />}
    </div>
  );
}
