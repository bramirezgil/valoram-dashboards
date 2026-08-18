"""Generate the Roth VSL voiceover and a VO-driven timeline.

Same offline Kokoro pipeline as gen_vo_gmax.py, with the "Tax-Free Roth Wealth
System" script (see the Valoram VSL Production Bible). Outputs:
  video/public/narration-roth.mp3
  video/src/roth/vo-timing.json

The ORDER of SEG below MUST match the CONTENT array in src/roth/script.ts.

Prereqs: kokoro-onnx, espeakng-loader (bundles espeak-ng), lameenc, numpy, and
the model files kokoro-v1.0.onnx + voices-v1.0.bin in $KOKORO_DIR (defaults to
this tools dir). Run:  python video/tools/gen_vo_roth.py
"""
import json
import os

# Point kokoro's phonemizer at the pip-installed espeak-ng (no system package).
try:
    import espeakng_loader
    os.environ.setdefault("ESPEAK_DATA_PATH", espeakng_loader.get_data_path())
    os.environ.setdefault("PHONEMIZER_ESPEAK_LIBRARY", espeakng_loader.get_library_path())
except Exception:  # noqa: BLE001
    pass

import numpy as np
import lameenc
from kokoro_onnx import Kokoro

FPS = 30
SR = 24000
VOICE = "am_michael"   # warm, authoritative male — matches the advisory tone
SPEED = 1.20           # Kokoro reads calmly; nudge up to hit the ~2:43-3:00 runtime target
LEAD = 0.25
PAD_BROLL = 0.85
PAD_CARD = 1.15

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
KOKORO_DIR = os.environ.get("KOKORO_DIR", HERE)
MODEL = os.path.join(KOKORO_DIR, "kokoro-v1.0.onnx")
VOICES = os.path.join(KOKORO_DIR, "voices-v1.0.bin")
OUT_MP3 = os.path.join(REPO, "video", "public", "narration-roth.mp3")
OUT_JSON = os.path.join(REPO, "video", "src", "roth", "vo-timing.json")

# kind, cap(show karaoke captions), min_dur_s, vo_text (display/captions), tts_override (spoken)
SEG = [
    ("card", False, 4.0, None, None),  # 0 TITLE — logo on black, music only
    # --- Segment 1: Hook ---
    ("broll", True, 4.0, "I was sitting across from a couple in their late sixties.", None),  # 1
    ("broll", True, 4.5, "Nice people. Careful people. They slid an IRA statement across the desk — and the husband tapped it with one finger.",
        "Nice people. Careful people. They slid an I.R.A. statement across the desk, and the husband tapped it with one finger."),  # 2
    ("broll", True, 5.0, "“We did everything right,” he said. “We saved for thirty years. We maxed out the 401(k). We rolled it to an IRA. Watched it grow.”",
        "We did everything right, he said. We saved for thirty years. We maxed out the four oh one k. We rolled it to an I.R.A. Watched it grow."),  # 3
    ("broll", False, 3.5, "Then his wife said something I've never forgotten.", None),  # 4
    ("card", False, 5.0, "“It's our biggest account,” she said. “And it feels like our biggest question mark.”",
        "It's our biggest account, she said. And it feels like our biggest question mark."),  # 5 QUOTE CARD 1
    ("card", False, 1.6, None, None),  # 6 intentional 1.5s SILENCE — hold
    # --- Segment 2: Problem ---
    ("broll", True, 4.0, "If you've ever felt that — you already know what comes next.", None),  # 7
    ("broll", True, 5.0, "You start searching for answers. Maybe you invest more aggressively. Maybe you delay withdrawals and hope tax rates stay reasonable. Maybe you take a small distribution here and there, just to feel like you're doing something.", None),  # 8
    ("broll", True, 5.0, "But none of it solves the core problem. Because that account keeps growing — and so does the tax exposure. And the legacy you want to leave your kids starts looking a little less certain.", None),  # 9
    # --- Segment 3: Pivot ---
    ("broll", True, 5.0, "Then the real weight of it lands. RMDs are coming. Tax policy is a moving target. And every dollar in that pre-tax account? The IRS still has a claim on it — whether you spend it, or your children inherit it.",
        "Then the real weight of it lands. R.M.D.s are coming. Tax policy is a moving target. And every dollar in that pre-tax account? The I.R.S. still has a claim on it, whether you spend it, or your children inherit it."),  # 10 + RMD lower-third
    ("broll", False, 4.5, "Back in that meeting, the husband leaned forward and asked the question most people are too afraid to say out loud:", None),  # 11
    ("card", False, 4.5, "“So if we convert to a Roth… we just write a big check to the IRS?”",
        "So if we convert to a Roth... we just write a big check to the I.R.S.?"),  # 12 QUOTE CARD 3
    ("broll", False, 3.9, "That's the moment everything changes.", None),  # 13 (+0.8s pause via min_dur)
    # --- Segment 4: Solution ---
    ("broll", True, 5.5, "Because here's what most people have never been shown. Roth conversion isn't a single, painful transaction. It's a coordinated, multi-year strategy — designed to be paced, planned, and built around your specific tax picture.", None),  # 14
    ("broll", True, 5.5, "You don't pay all the taxes at once. You work with a CPA team to identify the right windows, protect your Medicare premiums, and convert in controlled increments. Year by year.",
        "You don't pay all the taxes at once. You work with a C.P.A. team to identify the right windows, protect your Medicare premiums, and convert in controlled increments. Year by year."),  # 15
    ("broll", False, 5.0, "When that couple finally understood this, something shifted in the room. The IRA statement stopped looking like a trophy — and started looking like a plan.",
        "When that couple finally understood this, something shifted in the room. The I.R.A. statement stopped looking like a trophy, and started looking like a plan."),  # 16
    ("broll", False, 3.0, "The wife looked at her husband and said it quietly:", None),  # 17
    ("card", False, 5.0, "“I just want to know we're not leaving this to chance.” That's exactly the point.",
        "I just want to know we're not leaving this to chance. That's exactly the point."),  # 18 QUOTE CARD
    ("card", False, 5.0, "The goal isn't the size of the account. It's how much of it you actually get to keep.", None),  # 19 TYPED CARD 4 (+0.6s)
    # --- Segment 5: CTA ---
    ("broll", True, 5.5, "If you're a retiree or pre-retiree with most of your nest egg sitting in a 401(k) or IRA — and you've never had someone actually score your tax situation — there's a free assessment below that does exactly that.",
        "If you're a retiree or pre-retiree with most of your nest egg sitting in a four oh one k or I.R.A., and you've never had someone actually score your tax situation, there's a free assessment below that does exactly that."),  # 20
    ("broll", True, 5.5, "It takes a few minutes. It looks at your specific situation — the size of your pre-tax accounts, where you are relative to RMDs, what your heirs would actually receive — and scores your retirement tax exposure across the three risks we just covered.",
        "It takes a few minutes. It looks at your specific situation: the size of your pre-tax accounts, where you are relative to R.M.D.s, what your heirs would actually receive, and scores your retirement tax exposure across the three risks we just covered."),  # 21 + CTA lower-third
    ("broll", False, 6.0, "When you complete it, one of our senior advisors will personally review your score and reach out to walk through what a coordinated plan could look like for your situation. No pressure. No obligation. Just an honest conversation with someone who specializes in exactly this problem. Click below to score your retirement tax situation — and find out where you actually stand.", None),  # 22 + CTA lower-third
    ("card", False, 8.0, None, None),  # 23 END CARD — CTA + compliance, music only
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
os.makedirs(os.path.dirname(OUT_MP3), exist_ok=True)
with open(OUT_MP3, "wb") as f:
    f.write(mp3)

os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
with open(OUT_JSON, "w") as f:
    json.dump({"fps": FPS, "durationFrames": total_f, "segments": segments,
               "captions": captions, "captionHold": 10}, f, indent=2)

print(f"voice={VOICE} speed={SPEED}")
for i, s in enumerate(segments):
    print(f"{i:>3} {SEG[i][0]:>5} from {s['from']:>5} dur {s['durFrames']:>4} "
          f"({round(s['durFrames']/FPS,2)}s) vo {round(synth[i][1],2)}s")
print(f"total {total_f} frames = {round(total_f/FPS,1)}s ; captions {len(captions)} lines ; mp3 {len(mp3)//1024} KB")
