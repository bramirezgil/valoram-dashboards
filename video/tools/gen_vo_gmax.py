"""Generate the GMAX VSL voiceover and a VO-driven timeline.

Same offline Kokoro pipeline as gen_vo.py, with the GMAX retention script.
Outputs (relative to repo root):
  video/public/narration-gmax.mp3
  video/src/gmax/vo-timing.json

The ORDER of SEG below must match the CONTENT array in src/gmax/script.ts.
Prereqs identical to gen_vo.py (kokoro-onnx, espeak-ng, model in $KOKORO_DIR).
Run:  python video/tools/gen_vo_gmax.py
"""
import json
import os
import numpy as np
import lameenc
from kokoro_onnx import Kokoro

FPS = 30
SR = 24000
VOICE = "am_michael"
SPEED = 1.0
LEAD = 0.30
PAD_BROLL = 1.30
PAD_CARD = 1.55

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
KOKORO_DIR = os.environ.get("KOKORO_DIR", HERE)
MODEL = os.path.join(KOKORO_DIR, "kokoro-v1.0.onnx")
VOICES = os.path.join(KOKORO_DIR, "voices-v1.0.bin")
OUT_MP3 = os.path.join(REPO, "video", "public", "narration-gmax.mp3")
OUT_JSON = os.path.join(REPO, "video", "src", "gmax", "vo-timing.json")

# kind, cap, min_dur_s, vo_text, tts_override
SEG = [
    ("broll", False, 4.0, None, None),  # 0 quiet open — owner at desk
    ("broll", True, 4.5, "You're not losing your best people because of pay. You're losing them to a benefits package that can't compete.", None),
    ("card", False, 5.0, "It's not a pay problem. It's a retention problem.", None),
    ("broll", True, 4.5, "Every group plan you pay for ends the moment an employee walks out the door. The big companies offer portable plans that follow the person — and your best people know it.", None),
    ("card", False, 6.0, "Replacing one employee can cost fifty to two hundred percent of their salary — and it compounds quietly.", None),
    ("broll", True, 4.5, "Turnover isn't a line item. For a small business, it's one of the largest hidden costs you carry.", None),
    ("card", False, 6.0, "On average, twenty-five to a hundred and fifty thousand dollars a year — gone to churn.", None),
    ("card", False, 6.0, "Traditional benefits are tied to the job. They end the day someone leaves. GMAX flips that.",
        "Traditional benefits are tied to the job. They end the day someone leaves. G-Max flips that."),
    ("broll", True, 4.5, "GMAX is a portable benefit your employees own — one that travels with them, and gives them a reason to stay and build.",
        "G-Max is a portable benefit your employees own — one that travels with them, and gives them a reason to stay and build."),
    ("card", False, 5.5, "It's how a small team competes with an enterprise benefits package.", None),
    ("card", False, 6.0, "Lower turnover. Enterprise-level benefits. And a retention story you can actually recruit with.", None),
    ("card", False, 5.5, "Sixty-seven percent of employees say benefits are a key reason they stay.", None),
    ("broll", True, 4.5, "GMAX is built for businesses with ten to sixty employees — small enough to move fast, big enough for real leverage.",
        "G-Max is built for businesses with ten to sixty employees — small enough to move fast, big enough for real leverage."),
    ("broll", False, 4.5, "Right below this video, take the free retention risk assessment. Ten questions, three minutes.", None),
    ("card", False, 6.0, "Find out what your retention gap is costing you.", None),
]

k = Kokoro(MODEL, VOICES)

synth = []
for kind, cap, mindur, vo, tts in SEG:
    if vo is None:
        synth.append((None, 0.0))
        continue
    samples, sr = k.create(tts or vo, voice=VOICE, speed=SPEED, lang="en-us")
    assert sr == SR
    synth.append((np.asarray(samples, dtype=np.float32), len(samples) / SR))


def chunk(words, size):
    return [words[i:i + size] for i in range(0, len(words), size)]


segments, captions = [], []
cursor_f = 0
events = []
for i, (kind, cap, mindur, vo, tts) in enumerate(SEG):
    samples, dur_s = synth[i]
    pad = PAD_CARD if kind == "card" else PAD_BROLL
    seg_s = mindur if vo is None else max(mindur, LEAD + dur_s + pad)
    seg_f = int(round(seg_s * FPS))
    from_f = cursor_f
    if vo is not None:
        vo_from_f = from_f + int(round(LEAD * FPS))
        events.append((int(round((from_f / FPS + LEAD) * SR)), samples))
        vo_dur_f = int(round(dur_s * FPS))
        vo_to_f = vo_from_f + vo_dur_f
    else:
        vo_from_f = vo_to_f = None
    segments.append({"from": from_f, "durFrames": seg_f, "voFrom": vo_from_f, "voTo": vo_to_f})
    if cap and vo is not None:
        words = vo.split()
        per = vo_dur_f / max(1, len(words))
        line = [{"text": w, "start": int(round(vo_from_f + j * per)),
                 "end": int(round(vo_from_f + (j + 1) * per))} for j, w in enumerate(words)]
        for grp in chunk(line, 4):
            captions.append({"words": grp})
    cursor_f += seg_f

total_f = cursor_f
master = np.zeros(int(round(total_f / FPS * SR)) + SR, dtype=np.float32)
for start_sample, samples in events:
    master[start_sample:start_sample + len(samples)] += samples
peak = float(np.max(np.abs(master))) or 1.0
master = master / peak * 0.72

pcm16 = np.clip(master * 32767, -32768, 32767).astype(np.int16)
enc = lameenc.Encoder()
enc.set_bit_rate(192)
enc.set_in_sample_rate(SR)
enc.set_channels(1)
enc.set_quality(2)
mp3 = enc.encode(pcm16.tobytes()) + enc.flush()
with open(OUT_MP3, "wb") as f:
    f.write(mp3)

with open(OUT_JSON, "w") as f:
    json.dump({"fps": FPS, "durationFrames": total_f, "segments": segments,
               "captions": captions, "captionHold": 10}, f, indent=2)

print(f"voice={VOICE}")
for i, s in enumerate(segments):
    print(f"{i:>3} {SEG[i][0]:>5} from {s['from']:>5} dur {s['durFrames']:>4} "
          f"({round(s['durFrames']/FPS,2)}s) vo {round(synth[i][1],2)}s")
print(f"total {total_f} frames = {round(total_f/FPS,1)}s ; captions {len(captions)} lines ; mp3 {len(mp3)//1024} KB")
