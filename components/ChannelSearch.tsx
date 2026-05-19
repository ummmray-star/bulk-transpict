"use client";

import { useState } from "react";

interface Props {
  onResults: (data: {
    channelName: string;
    videos: VideoResult[];
  }) => void;
}

export interface VideoResult {
  videoId: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
}

export default function ChannelSearch({ onResults }: Props) {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const q = handle.trim();
    if (!q) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch channel");
      onResults({ channelName: data.channelName, videos: data.videos });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <label htmlFor="channel-input" className="text-sm font-semibold text-white">
        YouTube Channel
      </label>

      <div className="flex gap-3">
        <div className="relative flex-1">
          {/* @ prefix */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] text-sm font-mono select-none">
            @
          </span>
          <input
            id="channel-input"
            type="text"
            value={handle.startsWith("@") ? handle.slice(1) : handle}
            onChange={(e) => setHandle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="channelname or handle"
            disabled={loading}
            className="w-full glass rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/50 disabled:opacity-50"
            aria-label="YouTube channel handle"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={!handle.trim() || loading}
          className="px-5 py-3 bg-[#0D9488] hover:bg-[#0b7a70] disabled:bg-[#0D9488]/30 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors duration-150 cursor-pointer flex items-center gap-2 shrink-0"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Loading…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
