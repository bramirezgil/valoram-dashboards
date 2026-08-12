"""Fetch themed b-roll (and matching stills) for the GMAX VSL from Pixabay,
then self-wire the composition.

What it does, in one run:
  1. Pulls one landscape video clip per GMAX beat  -> public/broll-gmax/g0..g6.mp4
  2. Pulls one matching landscape photo per beat    -> public/broll-gmax/g0..g6.jpg
     (used as a poster still behind each clip; this is the "images" half.)
  3. Rewrites the `fetch:begin..fetch:end` region of src/gmax/broll.ts so the
     video renders the g*.mp4 set with correct <Loop> lengths and the g*.jpg
     posters — no manual editing, then just re-render.
  4. Writes public/broll-gmax/sources.json (query -> Pixabay page URL, res, dur).

Requires, in the session that runs this:
  - Network egress to pixabay.com and cdn.pixabay.com
  - PIXABAY_API_KEY in the environment (free key from pixabay.com/api/docs)

Pixabay content is royalty-free for commercial use (Pixabay License); no
attribution is required, but each source page URL is recorded in sources.json.

Audio note: Pixabay *Music* has no API, so it can't be fetched here. Download a
track from https://pixabay.com/music/ and save it as video/public/music.mp3
(overwriting the placeholder) before re-rendering.

Run:
  PIXABAY_API_KEY=xxxx python video/tools/fetch_pixabay.py
  cd video && npx remotion render GmaxVSL out/video.mp4
"""
import json
import os
import re
import ssl
import sys
import urllib.parse
import urllib.request

VIDEO_API = "https://pixabay.com/api/videos/"
IMAGE_API = "https://pixabay.com/api/"
KEY = os.environ.get("PIXABAY_API_KEY", "").strip()
FPS = 30  # must match GMAX_BROLL_FPS in src/gmax/broll.ts

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
OUT_DIR = os.path.join(REPO, "video", "public", "broll-gmax")
BROLL_TS = os.path.join(REPO, "video", "src", "gmax", "broll.ts")

# Queries per GMAX beat, tuned toward a finance aesthetic (documents,
# spreadsheets, calculators, magnifier, currency) while staying true to the
# beat. Each beat lists a finance-forward primary plus fallbacks, tried in order
# until one returns a usable landscape clip/photo. `beat` matches the keys of
# BROLL in src/gmax/broll.ts; `name` is the on-disk basename (g0..g6). Keep the
# beat order stable.
BEATS = [
    # quiet open — reviewing the books
    ("g0", "open", ["financial documents magnifying glass", "accounting paperwork desk", "financial spreadsheet analysis"]),
    # hook — losing your best people (the empty seat)
    ("g1", "hook", ["empty office desk", "employee leaving office", "resignation office"]),
    # the group plan ends at the door — the exit
    ("g2", "door", ["business person leaving office", "walking out office building", "office exit door"]),
    # the hidden cost of turnover — money & numbers
    ("g3", "cost", ["calculator financial charts", "money cash currency", "magnifying glass financial report"]),
    # a benefit that follows the person
    ("g4", "portable", ["businesswoman walking briefcase", "professional walking city", "business person commuting"]),
    # built for teams of 10-60 — reviewing together
    ("g5", "team", ["business team meeting documents", "small team office meeting", "financial advisor meeting"]),
    # CTA — plan and decide
    ("g6", "cta", ["financial planning laptop", "signing financial document", "business person laptop finance"]),
]

CA = "/root/.ccr/ca-bundle.crt"
ctx = ssl.create_default_context(cafile=CA if os.path.exists(CA) else None)
# urllib picks up HTTPS_PROXY from the environment via ProxyHandler defaults.
opener = urllib.request.build_opener(urllib.request.ProxyHandler())


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "valoram-gmax-broll/1.0"})
    return opener.open(req, timeout=60, context=ctx)


def api(base, params):
    q = urllib.parse.urlencode({"key": KEY, "safesearch": "true", **params})
    return json.load(get(f"{base}?{q}"))


def pick_video(hits):
    """Best landscape clip: prefer ~1080p, 4-40s, width>=height. Returns
    (url, page, w, h, dur) or None."""
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
    return best[1:] if best else None


def pick_image(hits):
    """Best landscape photo. Returns (url, page, w, h) or None."""
    best = None
    for h in hits:
        w, ht = h.get("imageWidth", 0), h.get("imageHeight", 0)
        url = h.get("largeImageURL") or h.get("webformatURL")
        if not url or w < ht:
            continue
        score = (w >= 1920, w)
        if best is None or score > best[0]:
            best = (score, url, h.get("pageURL", ""), w, ht)
    return best[1:] if best else None


def download(url, dst):
    with get(url) as r, open(dst, "wb") as f:
        f.write(r.read())
    return os.path.getsize(dst)


def first_video(queries):
    """Try each query in order; return (query, (url, page, w, h, dur)) for the
    first that yields a usable landscape clip, else (None, None)."""
    for q in queries:
        try:
            hits = api(VIDEO_API, {"q": q, "per_page": 40, "video_type": "film"}).get("hits", [])
        except Exception as e:  # noqa: BLE001
            print(f"    video query failed ({q}): {e}")
            continue
        chosen = pick_video(hits)
        if chosen:
            return q, chosen
    return None, None


def first_image(queries):
    """Try each query in order; return (query, (url, page, w, h)) for the first
    that yields a usable landscape photo, else (None, None)."""
    for q in queries:
        try:
            hits = api(IMAGE_API, {"q": q, "image_type": "photo", "orientation": "horizontal", "per_page": 30}).get("hits", [])
        except Exception as e:  # noqa: BLE001
            print(f"    image query failed ({q}): {e}")
            continue
        chosen = pick_image(hits)
        if chosen:
            return q, chosen
    return None, None


def render_region(dir_name, wiring):
    """Build the text that goes between the fetch:begin/fetch:end markers."""
    lines = [
        "export const BROLL_DIR = " + json.dumps(dir_name) + ";",
        "",
        "// Beat key -> clip filename, in timeline order.",
        "export const BROLL = {",
    ]
    for _, beat, _q, w in wiring:
        lines.append(f'  {beat}: {json.dumps(w["clip"])},')
    lines += [
        "} as const;",
        "",
        "// Clip filename -> native length in frames, for a seamless <Loop>.",
        "export const BROLL_LOOP: Record<string, number> = {",
    ]
    for _, _beat, _q, w in wiring:
        lines.append(f'  {json.dumps(w["clip"])}: {w["frames"]},')
    lines += [
        "};",
        "",
        "// Clip filename -> still image (in BROLL_DIR) shown behind the clip as a poster.",
        "export const BROLL_STILL: Record<string, string> = {",
    ]
    for _, _beat, _q, w in wiring:
        if w.get("still"):
            lines.append(f'  {json.dumps(w["clip"])}: {json.dumps(w["still"])},')
    lines.append("};")
    return "\n".join(lines)


def rewrite_broll_ts(region):
    with open(BROLL_TS, "r", encoding="utf-8") as f:
        src = f.read()
    pat = re.compile(
        r"(// --- fetch:begin[^\n]*\n).*?(\n// --- fetch:end ---)",
        re.DOTALL,
    )
    if not pat.search(src):
        sys.exit(f"Could not find fetch:begin/fetch:end markers in {BROLL_TS}")
    new = pat.sub(lambda m: m.group(1) + region + m.group(2), src)
    with open(BROLL_TS, "w", encoding="utf-8") as f:
        f.write(new)


def main():
    if not KEY:
        sys.exit("PIXABAY_API_KEY not set. Get a free key at pixabay.com/api/docs")
    os.makedirs(OUT_DIR, exist_ok=True)
    wiring, sources = [], {}

    for name, beat, queries in BEATS:
        entry = {"clip": None, "frames": None, "still": None}
        # --- video (finance-forward query, with fallbacks) ---
        vq, chosen = first_video(queries)
        if chosen:
            url, page, w, h, dur = chosen
            kb = download(url, os.path.join(OUT_DIR, f"{name}.mp4")) // 1024
            entry["clip"] = f"{name}.mp4"
            entry["frames"] = max(1, round(dur * FPS))
            sources[f"{name}.mp4"] = {"query": vq, "src": page, "res": f"{w}x{h}", "dur": dur, "kb": kb}
            print(f"[{name}] video {vq!r:38} -> {w}x{h} {dur}s {kb}KB  {page}")
        else:
            print(f"[{name}] no landscape video for {queries} — keeping default clip")

        # --- still image (the "images" half; also a poster behind the clip) ---
        iq, ipick = first_image(queries)
        if ipick and entry["clip"]:
            iurl, ipage, iw, ih = ipick
            ikb = download(iurl, os.path.join(OUT_DIR, f"{name}.jpg")) // 1024
            entry["still"] = f"{name}.jpg"
            sources[f"{name}.jpg"] = {"query": iq, "src": ipage, "res": f"{iw}x{ih}", "kb": ikb}
            print(f"[{name}] photo {iq!r:38} -> {iw}x{ih} {ikb}KB  {ipage}")

        if entry["clip"]:
            wiring.append((name, beat, vq, entry))

    if not wiring:
        sys.exit("No clips downloaded — leaving src/gmax/broll.ts untouched.")

    with open(os.path.join(OUT_DIR, "sources.json"), "w", encoding="utf-8") as f:
        json.dump(sources, f, indent=2)

    rewrite_broll_ts(render_region("broll-gmax", wiring))
    print(f"\nSaved {len(wiring)} clips to {OUT_DIR} and rewired src/gmax/broll.ts")
    print("Next: drop a Pixabay music track at video/public/music.mp3, then")
    print("      cd video && npx remotion render GmaxVSL out/video.mp4")


if __name__ == "__main__":
    main()
