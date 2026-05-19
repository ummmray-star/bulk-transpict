"use client";

import { useState } from "react";
import { VideoResult } from "./ChannelSearch";

interface Props {
  channelName: string;
  videos: VideoResult[];
  selected: Set<string>;
  onToggle: (videoId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onFetch: () => void;
  fetching: boolean;
}

type Filter = "all" | "videos" | "shorts";

export default function VideoGrid({
  channelName,
  videos,
  selected,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onFetch,
  fetching,
}: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const shorts = videos.filter((v) => v.isShort);
  const longform = videos.filter((v) => !v.isShort);
  const visible = filter === "all" ? videos : filter === "shorts" ? shorts : longform;

  const allVisibleSelected = visible.length > 0 && visible.every((v) => selected.has(v.videoId));
  const someSelected = selected.size > 0;
  const selectedShorts = videos.filter((v) => v.isShort && selected.has(v.videoId));

  const handleSelectAllVisible = () => {
    if (allVisibleSelected) {
      // deselect all visible
      visible.forEach((v) => {
        if (selected.has(v.videoId)) onToggle(v.videoId);
      });
    } else {
      // select all visible that aren't already selected
      visible.forEach((v) => {
        if (!selected.has(v.videoId)) onToggle(v.videoId);
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-base truncate">{channelName}</h2>
          <p className="text-[#94a3b8] text-xs">
            {longform.length} videos · {shorts.length} shorts
          </p>
        </div>

        <button
          type="button"
          onClick={onFetch}
          disabled={!someSelected || fetching}
          className="px-4 py-2.5 bg-[#F97316] hover:bg-[#ea6c0d] disabled:bg-[#F97316]/30 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors duration-150 cursor-pointer flex items-center gap-2 shrink-0"
        >
          {fetching ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Fetching…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Fetch {selected.size > 0 ? `${selected.size} ` : ""}Transcript{selected.size !== 1 ? "s" : ""}
            </>
          )}
        </button>
      </div>

      {/* Shorts warning */}
      {selectedShorts.length > 0 && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="text-xs text-amber-300 leading-relaxed">
            <span className="font-semibold">{selectedShorts.length} Short{selectedShorts.length !== 1 ? "s" : ""} selected.</span>{" "}
            Most Shorts don't have captions enabled — they'll show a "transcript disabled" error. Uncheck them or try anyway.
          </p>
        </div>
      )}

      {/* Filter tabs + Select All row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter tabs */}
        <div className="flex gap-1 p-1 glass rounded-xl w-fit text-xs">
          {(["all", "videos", "shorts"] as Filter[]).map((f) => {
            const count = f === "all" ? videos.length : f === "videos" ? longform.length : shorts.length;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 cursor-pointer capitalize flex items-center gap-1.5 ${
                  filter === f ? "bg-[#0D9488] text-white" : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {f === "shorts" && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94v4l2.23-.93 1.2.5L8 11.28c-1.83.95-2.52 3.22-1.55 5.05.95 1.84 3.22 2.54 5.05 1.57l8.5-4.43v-4l-2.23.85zM14 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                )}
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === f ? "bg-white/20 text-white" : "bg-white/5 text-[#94a3b8]"
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Select all visible */}
        <button
          type="button"
          onClick={handleSelectAllVisible}
          className="flex items-center gap-2 px-3 py-2 glass glass-hover rounded-xl text-xs font-semibold text-white transition-all duration-150 cursor-pointer w-fit"
        >
          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors duration-150 ${
            allVisibleSelected
              ? "bg-[#0D9488] border-[#0D9488]"
              : visible.some((v) => selected.has(v.videoId))
              ? "bg-[#0D9488]/40 border-[#0D9488]"
              : "border-white/20"
          }`}>
            {allVisibleSelected && (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {!allVisibleSelected && visible.some((v) => selected.has(v.videoId)) && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            )}
          </span>
          {allVisibleSelected ? "Deselect All" : "Select All"}
          {someSelected && (
            <span className="text-[#0D9488] font-bold">({selected.size})</span>
          )}
        </button>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
        {visible.map((video) => {
          const isSelected = selected.has(video.videoId);
          return (
            <button
              key={video.videoId}
              type="button"
              onClick={() => onToggle(video.videoId)}
              className={`group text-left glass rounded-xl overflow-hidden transition-all duration-150 cursor-pointer border ${
                isSelected
                  ? "border-[#0D9488]/60 bg-[#0D9488]/10"
                  : "border-transparent hover:border-white/10"
              }`}
            >
              {/* Thumbnail */}
              <div className={`relative w-full bg-white/5 overflow-hidden ${
                video.isShort ? "aspect-[9/16] max-h-36" : "aspect-video"
              }`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Shorts badge */}
                {video.isShort && (
                  <span className="absolute top-1.5 left-1.5 bg-[#FF0000] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94v4l2.23-.93 1.2.5L8 11.28c-1.83.95-2.52 3.22-1.55 5.05.95 1.84 3.22 2.54 5.05 1.57l8.5-4.43v-4l-2.23.85zM14 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                    Shorts
                  </span>
                )}

                {/* Duration */}
                {video.duration && !video.isShort && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                )}

                {/* Selected overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[#0D9488]/25 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#0D9488] flex items-center justify-center shadow-lg">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Title row */}
              <div className="p-2.5 flex items-start gap-2">
                <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors duration-150 ${
                  isSelected ? "bg-[#0D9488] border-[#0D9488]" : "border-white/20"
                }`}>
                  {isSelected && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </span>
                <p className="text-xs text-white leading-snug line-clamp-2 flex-1">{video.title}</p>
              </div>
            </button>
          );
        })}

        {visible.length === 0 && (
          <div className="col-span-full text-center py-10 text-[#475569] text-sm">
            No {filter === "shorts" ? "Shorts" : "long-form videos"} found for this channel.
          </div>
        )}
      </div>
    </div>
  );
}
