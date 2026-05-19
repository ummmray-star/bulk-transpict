from http.server import BaseHTTPRequestHandler
import json
import os
import re
from urllib.parse import urlparse, parse_qs

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
)
from youtube_transcript_api.proxies import WebshareProxyConfig


def _make_api() -> YouTubeTranscriptApi:
    username = os.environ.get("WEBSHARE_PROXY_USERNAME", "")
    password = os.environ.get("WEBSHARE_PROXY_PASSWORD", "")
    if username and password:
        return YouTubeTranscriptApi(
            proxies=WebshareProxyConfig(
                proxy_username=username,
                proxy_password=password,
            )
        )
    return YouTubeTranscriptApi()


def extract_video_id(url: str) -> str | None:
    s = url.strip()
    if not s:
        return None
    if re.fullmatch(r"[a-zA-Z0-9_-]{11}", s):
        return s
    try:
        parsed = urlparse(s if "://" in s else "https://" + s)
        host = parsed.hostname or ""
        if "youtube.com" in host:
            if parsed.path == "/watch":
                vid = parse_qs(parsed.query).get("v", [None])[0]
                if vid:
                    return vid
            m = re.match(r"^/(shorts|embed|v)/([a-zA-Z0-9_-]{11})", parsed.path)
            if m:
                return m.group(2)
        if host == "youtu.be":
            vid = parsed.path.lstrip("/").split("?")[0]
            if re.fullmatch(r"[a-zA-Z0-9_-]{11}", vid):
                return vid
    except Exception:
        pass
    m = re.search(r"(?:v=|/shorts/|/embed/|youtu\.be/)([a-zA-Z0-9_-]{11})", s)
    return m.group(1) if m else None


def fetch_transcript(video_id: str) -> dict:
    api = _make_api()
    transcript_list = api.list(video_id)

    # Try English first, then any language
    fetched = None
    try:
        fetched = transcript_list.find_transcript(["en"]).fetch()
    except NoTranscriptFound:
        for t in transcript_list:
            fetched = t.fetch()
            break

    if fetched is None:
        raise NoTranscriptFound(video_id, [], [])

    snippets = [
        {"text": s.text, "start": s.start, "duration": s.duration}
        for s in fetched
    ]
    full_text = " ".join(s["text"] for s in snippets)

    return {
        "videoId": video_id,
        "lines": snippets,
        "fullText": full_text,
    }


class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        length = int(self.headers.get("content-length", 0))
        body = json.loads(self.rfile.read(length) or b"{}")
        url = body.get("url", "").strip()

        if not url:
            self._respond(400, {"error": "Missing url"})
            return

        video_id = extract_video_id(url)
        if not video_id:
            self._respond(422, {"error": "Could not extract a valid YouTube video ID"})
            return

        try:
            result = fetch_transcript(video_id)
            result["url"] = url
            self._respond(200, result)
        except TranscriptsDisabled:
            self._respond(500, {"error": "Transcripts are disabled for this video."})
        except VideoUnavailable:
            self._respond(500, {"error": "Video is unavailable (private, deleted, or geo-blocked)."})
        except NoTranscriptFound:
            self._respond(500, {"error": "No transcript found — no captions in any language."})
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
        pass  # silence access logs
