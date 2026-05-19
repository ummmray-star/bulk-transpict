export function extractVideoId(url: string): string | null {
  const str = url.trim();
  if (!str) return null;

  // Already just an ID (11 chars, alphanumeric + _-)
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;

  try {
    const u = new URL(str);

    // youtube.com/watch?v=ID
    if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
      return u.searchParams.get("v");
    }

    // youtube.com/shorts/ID or youtube.com/embed/ID or youtube.com/v/ID
    const pathMatch = u.pathname.match(/\/(shorts|embed|v)\/([a-zA-Z0-9_-]{11})/);
    if (pathMatch) return pathMatch[2];

    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("?")[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // not a valid URL
  }

  // Fallback: regex anywhere in string
  const match = str.match(/(?:v=|\/embed\/|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function parseUrlList(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 100);
}
