"""Generate the R.I.S.E. VSL voiceover and a VO-driven timeline.

Kokoro (offline neural TTS) synthesizes each line; the timeline is then laid
out so every segment lasts exactly as long as its narration needs (plus a
short lead-in and breathing pad), instead of the earlier placeholder timing
that left ~100s of dead air. Outputs (relative to the repo root):

  video/public/narration-rise.mp3   full-length mono voiceover
  video/src/rise/vo-timing.json     per-segment frames + karaoke captions

The ORDER of SEG below must match the CONTENT array in script.ts.

Prerequisites (all offline once fetched):
  pip install kokoro-onnx soundfile lameenc numpy
  apt-get install -y espeak-ng            # phonemizer backend
  # Kokoro model + voices (place in $KOKORO_DIR, default: this folder):
  #   kokoro-v1.0.onnx  voices-v1.0.bin
  #   github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)

Run:  python video/tools/gen_vo.py         # regenerates mp3 + json
Change VOICE below to re-cast (e.g. af_heart, am_adam, bm_george).
"""
import json
import os
import numpy as np
import lameenc
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))  # .../<repo>
KOKORO_DIR = os.environ.get("KOKORO_DIR", HERE)
MODEL = os.path.join(KOKORO_DIR, "kokoro-v1.0.onnx")
VOICES = os.path.join(KOKORO_DIR, "voices-v1.0.bin")
OUT_MP3 = os.path.join(REPO, "video", "public", "narration-rise.mp3")
OUT_JSON = os.path.join(REPO, "video", "src", "rise", "vo-timing.json")

FPS = 30
SR = 24000
VOICE = "am_michael"
SPEED = 1.0
LEAD = 0.30          # seconds of scene before the voice starts
PAD_BROLL = 1.30     # seconds of tail after a b-roll line
PAD_CARD = 1.55      # cards hold a touch longer so the text can breathe

# kind: "broll" | "card"; cap=True → karaoke captions (b-roll narration only).
# (kind, cap, min_dur_s, vo_text, tts_override)
SEG = [
    ("broll", False, 4.0, None, None),  # 0 quiet open — tax forms
    ("broll", True, 4.5, "If you earned a good income this year and still felt like you paid too much — you're probably right.", None),
    ("card", False, 5.0, "Most people who earn well don't have a tax problem. They have a planning problem.", None),
    ("broll", True, 4.5, "Every year, millions of Americans hand their information to a preparer, get a number back, and pay it. No questions. No strategy.", None),
    ("card", False, 5.0, "There's a difference between preparing a return and building a tax strategy.", None),
    ("broll", True, 4.5, "When we look at someone's return — really look at it — we almost never see just a tax return. We see a story.", None),
    ("broll", True, 4.5, "We see credits never claimed. Contributions not optimized. Prior years where someone overpaid — money that can still be recovered.", None),
    ("card", False, 6.0, "For the people we work with, we typically identify between fifteen and forty-four thousand dollars — or more — in potential tax savings.", None),
    ("card", False, 5.0, "That's not a loophole. That's money that was always yours.", None),
    ("card", False, 5.5, "That's exactly what we built our approach to do.", None),
    ("broll", True, 4.5, "We find what was missed. We recover what's still recoverable. And we build a forward strategy so you stop leaving money behind.", None),
    ("card", False, 5.5, "Then the work goes deeper — savings, retirement, a financial picture that reflects what you've worked for.", None),
    ("broll", True, 4.5, "It doesn't matter if you're a W-2 earner, self-employed, or running a business. If you're paying income taxes, there's more opportunity than you've been shown.",
        "It doesn't matter if you're a W2 earner, self-employed, or running a business. If you're paying income taxes, there's more opportunity than you've been shown."),
    ("broll", False, 4.5, "Right below this video, fill out the form. Let's find out what's been left on the table.", None),  # form overlay, no karaoke
    ("card", False, 6.0, "Start keeping more of what you earn.", None),  # end CTA — hold
]

k = Kokoro(MODEL, VOICES)

# 1) synthesize every line, remember its samples + duration
synth = []
for kind, cap, mindur, vo, tts in SEG:
    if vo is None:
        synth.append((None, 0.0))
        continue
    samples, sr = k.create(tts or vo, voice=VOICE, speed=SPEED, lang="en-us")
    assert sr == SR
    samples = np.asarray(samples, dtype=np.float32)
    synth.append((samples, len(samples) / SR))

# 2) lay out the timeline: each segment = lead + vo + pad (clamped to min)
segments = []      # {from, durFrames}
captions = []      # karaoke lines (b-roll cap=True only)
cursor_f = 0
master_events = []  # (start_sample, samples)

def chunk(words, size):
    return [words[i:i + size] for i in range(0, len(words), size)]

for i, (kind, cap, mindur, vo, tts) in enumerate(SEG):
    samples, dur_s = synth[i]
    pad = PAD_CARD if kind == "card" else PAD_BROLL
    seg_s = mindur if vo is None else max(mindur, LEAD + dur_s + pad)
    seg_f = int(round(seg_s * FPS))
    from_f = cursor_f

    if vo is not None:
        vo_from_f = from_f + int(round(LEAD * FPS))
        vo_from_sample = int(round((from_f / FPS + LEAD) * SR))
        master_events.append((vo_from_sample, samples))
        vo_dur_f = int(round(dur_s * FPS))
        vo_to_f = vo_from_f + vo_dur_f
    else:
        vo_from_f = vo_to_f = None

    segments.append({
        "from": from_f,
        "durFrames": seg_f,
        "voFrom": vo_from_f,
        "voTo": vo_to_f,
    })

    # karaoke captions: even-spread words across the real spoken window
    if cap and vo is not None:
        words = vo.split()
        per = (vo_dur_f) / max(1, len(words))
        line = []
        for j, w in enumerate(words):
            st = int(round(vo_from_f + j * per))
            en = int(round(vo_from_f + (j + 1) * per))
            line.append({"text": w, "start": st, "end": en})
        # split long lines into <=4-word visual chunks (each keeps its timing)
        for grp in chunk(line, 4):
            captions.append({"words": grp})

    cursor_f += seg_f

total_f = cursor_f

# 3) render master audio track
master = np.zeros(int(round(total_f / FPS * SR)) + SR, dtype=np.float32)
for start_sample, samples in master_events:
    master[start_sample:start_sample + len(samples)] += samples
peak = float(np.max(np.abs(master))) or 1.0
master = master / peak * 0.72  # ~ -2.8 dBFS

pcm16 = np.clip(master * 32767, -32768, 32767).astype(np.int16)
enc = lameenc.Encoder()
enc.set_bit_rate(192)
enc.set_in_sample_rate(SR)
enc.set_channels(1)
enc.set_quality(2)
mp3 = enc.encode(pcm16.tobytes()) + enc.flush()
with open(OUT_MP3, "wb") as f:
    f.write(mp3)

layout = {
    "fps": FPS,
    "durationFrames": total_f,
    "segments": segments,
    "captions": captions,
    "captionHold": 10,
}
with open(OUT_JSON, "w") as f:
    json.dump(layout, f, indent=2)

print(f"voice={VOICE} speed={SPEED}")
print(f"{'seg':>3} {'kind':>5} {'from_f':>6} {'dur_f':>5} {'dur_s':>5} {'vo_s':>5}")
for i, s in enumerate(segments):
    vo_s = round(synth[i][1], 2)
    print(f"{i:>3} {SEG[i][0]:>5} {s['from']:>6} {s['durFrames']:>5} "
          f"{round(s['durFrames']/FPS,2):>5} {vo_s:>5}")
print(f"total: {total_f} frames = {round(total_f/FPS,1)}s ; "
      f"spoken {round(sum(x[1] for x in synth),1)}s ; captions {len(captions)} lines")
print(f"mp3 {len(mp3)//1024} KB")
