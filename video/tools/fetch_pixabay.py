"""Fetch themed b-roll for the GMAX VSL from the Pixabay API.

Requires (in the session that runs this):
  - Network egress allowed to pixabay.com and cdn.pixabay.com
  - PIXABAY_API_KEY in the environment (free key from pixabay.com/api/docs)

Downloads one landscape (>=16:9-ish) clip per beat into
video/public/broll-gmax/g0.mp4 ... g6.mp4 and prints the query->file map.
Pixabay content is royalty-free for commercial use (Pixabay License); no
attribution required, but the source page URLs are printed for the record.

Run:  PIXABAY_API_KEY=xxxx python video/tools/fetch_pixabay.py
Then: rewire src/gmax/script.ts CONTENT clips to the g*.mp4 set and re-render.
"""
import json
import os
import ssl
import sys
import urllib.parse
import urllib.request

API = "https://pixabay.com/api/videos/"
KEY = os.environ.get("PIXABAY_API_KEY", "").strip()
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
OUT_DIR = os.path.join(REPO, "video", "public", "broll-gmax")

# One query per GMAX beat (see the mapping table in the session notes).
QUERIES = [
    ("g0", "business owner office desk"),   # quiet open
    ("g1", "employee leaving office"),       # losing your best people
    ("g2", "office door walking out"),       # group plan ends at the door
    ("g3", "stressed business owner finance"),  # hidden cost of turnover
    ("g4", "professional walking city"),     # a benefit that follows them
    ("g5", "small team meeting office"),     # built for teams of 10-60
    ("g6", "businessman laptop working"),    # CTA
]

CA = "/root/.ccr/ca-bundle.crt"
ctx = ssl.create_default_context(cafile=CA if os.path.exists(CA) else None)
# urllib picks up HTTPS_PROXY from the environment via ProxyHandler defaults.
opener = urllib.request.build_opener(urllib.request.ProxyHandler())


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "valoram-gmax-broll/1.0"})
    return opener.open(req, timeout=40, context=ctx)


def pick(hits):
    """Best landscape clip: prefer ~1080p large/medium, 5-30s, width>=height."""
    best = None
    for h in hits:
        dur = h.get("duration", 0)
        if dur < 4 or dur > 40:
            continue
        vids = h.get("videos", {})
        for size in ("large", "medium", "small"):
            v = vids.get(size)
            if not v or not v.get("url"):
                continue
            w, ht = v.get("width", 0), v.get("height", 0)
            if w < ht or w < 960:
                continue
            score = (w >= 1920, -abs(1080 - ht), dur <= 20)
            if best is None or score > best[0]:
                best = (score, v["url"], h.get("pageURL", ""), w, ht, dur)
            break
    return best


def main():
    if not KEY:
        sys.exit("PIXABAY_API_KEY not set. Get a free key at pixabay.com/api/docs")
    os.makedirs(OUT_DIR, exist_ok=True)
    mapping = {}
    for name, q in QUERIES:
        params = urllib.parse.urlencode(
            {"key": KEY, "q": q, "per_page": 40, "video_type": "film", "safesearch": "true"}
        )
        try:
            data = json.load(get(f"{API}?{params}"))
        except Exception as e:  # noqa: BLE001
            print(f"[{name}] query failed ({q}): {e}")
            continue
        chosen = pick(data.get("hits", []))
        if not chosen:
            print(f"[{name}] no landscape clip for '{q}'")
            continue
        _, url, page, w, ht, dur = chosen
        dst = os.path.join(OUT_DIR, f"{name}.mp4")
        with get(url) as r, open(dst, "wb") as f:
            f.write(r.read())
        kb = os.path.getsize(dst) // 1024
        mapping[name] = {"query": q, "src": page, "res": f"{w}x{ht}", "dur": dur, "kb": kb}
        print(f"[{name}] {q!r:42} -> {w}x{ht} {dur}s {kb}KB  {page}")
    with open(os.path.join(OUT_DIR, "sources.json"), "w") as f:
        json.dump(mapping, f, indent=2)
    print(f"\nSaved {len(mapping)} clips to {OUT_DIR}")


if __name__ == "__main__":
    main()
