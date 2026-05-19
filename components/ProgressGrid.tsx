import { TranscriptJob } from "@/app/app/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  jobs: TranscriptJob[];
}

const statusColor: Record<TranscriptJob["status"], string> = {
  idle: "bg-white/10",
  loading: "bg-[#F97316] animate-pulse",
  done: "bg-[#0D9488]",
  error: "bg-red-500",
};

const statusLabel: Record<TranscriptJob["status"], string> = {
  idle: "Waiting",
  loading: "Fetching…",
  done: "Done",
  error: "Error",
};

export default function ProgressGrid({ jobs }: Props) {
  const done = jobs.filter((j) => j.status === "done").length;
  const errors = jobs.filter((j) => j.status === "error").length;
  const total = jobs.length;

  return (
    <div className="w-full glass rounded-2xl p-5 flex flex-col gap-4">
      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white font-semibold">Progress</span>
        <span className="text-[#94a3b8]">
          <span className="text-[#0D9488] font-semibold">{done}</span>
          {errors > 0 && (
            <span className="text-red-400 font-semibold"> · {errors} failed</span>
          )}
          <span> / {total}</span>
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0D9488] rounded-full transition-all duration-300"
          style={{ width: total > 0 ? `${((done + errors) / total) * 100}%` : "0%" }}
        />
      </div>

      {/* Chips grid */}
      <div className="flex flex-wrap gap-1.5" role="list" aria-label="Transcript fetch status">
        {jobs.map((job, i) => (
          <Tooltip key={job.url + i}>
            <TooltipTrigger
              role="listitem"
              aria-label={`${statusLabel[job.status]}: ${job.url}`}
              className={`w-6 h-6 rounded-md cursor-pointer transition-all duration-200 ${statusColor[job.status]}`}
            />
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs font-medium truncate">{job.url}</p>
              <p className="text-xs text-[#94a3b8]">
                {statusLabel[job.status]}
                {job.error && `: ${job.error}`}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-[#94a3b8]">
        {[
          { color: "bg-white/10", label: "Waiting" },
          { color: "bg-[#F97316]", label: "Fetching" },
          { color: "bg-[#0D9488]", label: "Done" },
          { color: "bg-red-500", label: "Error" },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${l.color}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
