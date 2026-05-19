export interface TranscriptLine {
  text: string;
  duration: number;
  offset: number;
}

export interface TranscriptJob {
  url: string;
  videoId?: string;
  status: "idle" | "loading" | "done" | "error";
  lines?: TranscriptLine[];
  fullText?: string;
  error?: string;
}
