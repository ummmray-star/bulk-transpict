from http.server import BaseHTTPRequestHandler
import json
import re
import urllib.request


def get_channel_id(handle: str) -> str:
    slug = handle if handle.startswith("@") else f"@{handle}"
    url = f"https://www.youtube.com/{slug}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode("utf-8", errors="replace")

    for pattern in [
        r'"channelId":"(UC[a-zA-Z0-9_-]+)"',
        r'channel_id=(UC[a-zA-Z0-9_-]+)',
        r'"externalId":"(UC[a-zA-Z0-9_-]+)"',
    ]:
        m = re.search(pattern, html)
        if m:
            return m.group(1)

    raise ValueError("Could not find channel ID for: " + handle)


def get_uploads_playlist(channel_id: str) -> str:
    # UC... → UU...
    return "UU" + channel_id[2:]


def get_playlist_videos(playlist_id: str) -> list[dict]:
    url = f"https://www.youtube.com/playlist?list={playlist_id}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="replace")

    # Extract ytInitialData JSON
    m = re.search(r"var ytInitialData\s*=\s*(\{.+?\});\s*</script>", html, re.DOTALL)
    if not m:
        # Try alternate pattern
        m = re.search(r"ytInitialData\s*=\s*(\{.+?\});\s*(?:var |</script>)", html, re.DOTALL)
    if not m:
        return []

    try:
        data = json.loads(m.group(1))
    except json.JSONDecodeError:
        return []

    videos = []
    try:
        contents = (
            data["contents"]["twoColumnBrowseResultsRenderer"]["tabs"][0]
            ["tabRenderer"]["content"]["sectionListRenderer"]["contents"][0]
            ["itemSectionRenderer"]["contents"][0]
            ["playlistVideoListRenderer"]["contents"]
        )
        for item in contents:
            v = item.get("playlistVideoRenderer")
            if not v:
                continue
            video_id = v.get("videoId")
            if not video_id:
                continue
            title = (
                v.get("title", {}).get("runs", [{}])[0].get("text", "Untitled")
            )
            duration_text = (
                v.get("lengthText", {}).get("simpleText", "")
                or v.get("lengthText", {}).get("accessibility", {})
                    .get("accessibilityData", {}).get("label", "")
            )
            thumbnail_url = (
                f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
            )
            # Detect shorts: duration ≤ 60s or navigationEndpoint contains /shorts/
            is_short = False
            nav = v.get("navigationEndpoint", {})
            nav_url = (
                nav.get("commandMetadata", {})
                   .get("webCommandMetadata", {})
                   .get("url", "")
            )
            if "/shorts/" in nav_url:
                is_short = True

            videos.append({
                "videoId": video_id,
                "title": title,
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "thumbnail": thumbnail_url,
                "duration": duration_text,
                "isShort": is_short,
            })
    except (KeyError, IndexError, TypeError):
        pass

    return videos


class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        length = int(self.headers.get("content-length", 0))
        body = json.loads(self.rfile.read(length) or b"{}")
        handle = body.get("handle", "").strip()

        if not handle:
            self._respond(400, {"error": "Missing channel handle"})
            return

        try:
            channel_id = get_channel_id(handle)
            playlist_id = get_uploads_playlist(channel_id)
            videos = get_playlist_videos(playlist_id)

            self._respond(200, {
                "channelId": channel_id,
                "channelName": handle.lstrip("@"),
                "videoCount": len(videos),
                "videos": videos,
            })
        except Exception as exc:
            self._respond(500, {"error": str(exc)})

    def _respond(self, status: int, data: dict):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass
