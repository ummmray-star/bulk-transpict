import { NextRequest } from "next/server";
import { YouTube } from "youtube-sr";

export const maxDuration = 30;

async function getChannelId(handle: string): Promise<string> {
  const slug = handle.startsWith("@") ? handle : `@${handle}`;
  const res = await fetch(`https://www.youtube.com/${slug}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) throw new Error(`Channel page returned ${res.status}`);
  const html = await res.text();

  // Extract channel ID from meta tag or ytInitialData
  const channelIdMatch =
    html.match(/"channelId":"(UC[a-zA-Z0-9_-]+)"/) ||
    html.match(/channel_id=(UC[a-zA-Z0-9_-]+)/) ||
    html.match(/"externalId":"(UC[a-zA-Z0-9_-]+)"/);

  if (!channelIdMatch) throw new Error("Could not find channel ID");
  return channelIdMatch[1];
}

function channelIdToUploadsPlaylist(channelId: string): string {
  // UC... → UU... (uploads playlist)
  return "UU" + channelId.slice(2);
}

export async function POST(req: NextRequest) {
  let body: { handle: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { handle } = body;
  if (!handle?.trim()) {
    return Response.json({ error: "Missing channel handle" }, { status: 400 });
  }

  try {
    const channelId = await getChannelId(handle.trim());
    const playlistId = channelIdToUploadsPlaylist(channelId);
    const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

    const playlist = await YouTube.getPlaylist(playlistUrl, { fetchAll: true });

    const videos = (playlist.videos || []).map((v) => ({
      videoId: v.id,
      title: v.title ?? "Untitled",
      url: `https://www.youtube.com/watch?v=${v.id}`,
      thumbnail: v.thumbnail?.url ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      duration: v.durationFormatted ?? "",
      isShort: Boolean((v as unknown as { shorts?: boolean }).shorts),
    }));

    return Response.json({
      channelId,
      channelName: playlist.channel?.name ?? handle,
      videoCount: videos.length,
      videos,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch channel";
    return Response.json({ error: message }, { status: 500 });
  }
}
