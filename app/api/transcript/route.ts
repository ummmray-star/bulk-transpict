import { NextRequest } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { extractVideoId } from "@/lib/transcript";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  let body: { url: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return Response.json({ error: "Missing url" }, { status: 400 });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return Response.json(
      { error: "Could not extract a valid YouTube video ID from this URL" },
      { status: 422 }
    );
  }

  try {
    const lines = await YoutubeTranscript.fetchTranscript(videoId);
    const fullText = lines.map((l) => l.text).join(" ");

    return Response.json({
      videoId,
      url,
      lines,
      fullText,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch transcript";
    return Response.json({ error: message }, { status: 500 });
  }
}
