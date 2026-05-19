"use client";

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
  const allSelected = selected.size === videos.length && videos.length > 0;
  const someSelected = selected.size > 0;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-base truncate">{channelName}</h2>
          <p className="text-[#94a3b8] text-xs">{videos.length} videos found</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Select all / deselect all */}
          <button
            type="button"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="flex items-center gap-2 px-3 py-2 glass glass-hover rounded-xl text-xs font-semibold text-white transition-all duration-150 cursor-pointer"
          >
            <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-150 shrink-0 ${
              allSelected
                ? "bg-[#0D9488] border-[#0D9488]"
                : someSelected
                ? "bg-[#0D9488]/40 border-[#0D9488]"
                : "border-white/20"
            }`}>
              {allSelected && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {someSelected && !allSelected && (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              )}
            </span>
            {allSelected ? "Deselect All" : "Select All"}
          </button>

          {/* Fetch button */}
          <button
            type="button"
            onClick={onFetch}
            disabled={!someSelected || fetching}
            className="px-4 py-2 bg-[#F97316] hover:bg-[#ea6c0d] disabled:bg-[#F97316]/30 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors duration-150 cursor-pointer flex items-center gap-2"
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
      </div>

      {/* Selected count pill */}
      {someSelected && (
        <p className="text-xs text-[#0D9488]">
          <span className="font-bold">{selected.size}</span> of {videos.length} selected
        </p>
      )}

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[540px] overflow-y-auto pr-1">
        {videos.map((video) => {
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
              <div className="relative w-full aspect-video bg-white/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Duration badge */}
                {video.duration && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                )}
                {/* Selected overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[#0D9488]/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#0D9488] flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="p-2.5 flex items-start gap-2">
                {/* Checkbox */}
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
      </div>
    </div>
  );
}
