#!/usr/bin/env python3
"""Build the generic thank-you / book-a-call VSL.
Usage: python3 build.py [voice]   (default am_liam)
Outputs vo/audio.wav + index.html (ready to render).
"""
import sys, subprocess, pathlib, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro

VOICE = sys.argv[1] if len(sys.argv) > 1 else "am_liam"
SPEED = 0.98
HERE = pathlib.Path(__file__).parent
VO = HERE / "vo"

LINES = [
    "First, thank you for taking the time to complete your survey. We really appreciate it.",
    "Your answers tell us exactly where you stand, so we can give you guidance that actually fits your situation.",
    "The best next step is a quick call. Book a time below, and we'll walk through your situation and how we can help.",
    "We're looking forward to speaking with you. Pick a time on the calendar below.",
]

M = "/root/.cache/hyperframes/tts/models/kokoro-v1.0.onnx"
V = "/root/.cache/hyperframes/tts/voices/voices-v1.0.bin"
k = Kokoro(M, V)
SR = 24000
segs, durs = [], []
for i, ln in enumerate(LINES, 1):
    s, sr = k.create(ln, voice=VOICE, speed=SPEED, lang="en-us")
    segs.append(s.astype(np.float32)); durs.append(len(s) / sr)
    print(f"s{i}: {durs[-1]:.3f}s")

LEAD, GAP, TAIL = 0.5, 0.5, 0.9
sil = lambda t: np.zeros(int(t * SR), np.float32)
narr = [sil(LEAD)]
for i, seg in enumerate(segs):
    narr.append(seg); narr.append(sil(TAIL if i == len(segs) - 1 else GAP))
narration = np.concatenate(narr)
TOT = len(narration) / SR
print(f"total: {TOT:.3f}s")
sf.write(VO / "narration.wav", narration, SR)

# subtle ambient pad
music = VO / "music.wav"
subprocess.run([
    "ffmpeg", "-y",
    "-f", "lavfi", "-i", f"sine=frequency=110:duration={TOT:.3f}",
    "-f", "lavfi", "-i", f"sine=frequency=164.81:duration={TOT:.3f}",
    "-f", "lavfi", "-i", f"sine=frequency=220:duration={TOT:.3f}",
    "-filter_complex",
    "[0][1][2]amix=inputs=3:normalize=0,volume=0.5,tremolo=f=0.10:d=0.35,"
    "lowpass=f=720,aecho=0.8:0.85:600:0.25,volume=0.09,afade=t=in:st=0:d=1.5,"
    f"afade=t=out:st={max(0,TOT-1.6):.3f}:d=1.6[a]",
    "-map", "[a]", "-ar", str(SR), str(music)
], check=True, capture_output=True)

out = VO / "audio.wav"
subprocess.run([
    "ffmpeg", "-y", "-i", str(VO / "narration.wav"), "-i", str(music),
    "-filter_complex", "[0]volume=1.0[v];[1]volume=1.0[m];[v][m]amix=inputs=2:duration=first:normalize=0[a]",
    "-map", "[a]", "-ar", str(SR), str(out)
], check=True, capture_output=True)
print("wrote", out)

S, L = [], []
t = 0.0
for i, d in enumerate(durs):
    lead = LEAD if i == 0 else 0.0
    tail = TAIL if i == len(durs) - 1 else GAP
    seg_len = lead + d + tail
    S.append(round(t, 3)); L.append(round(seg_len, 3)); t += seg_len

tpl = (HERE / "generic.template.html").read_text()
html = (tpl.replace("__DURATION__", f"{TOT:.3f}")
           .replace("__AUDIO_SRC__", "vo/audio.wav")
           .replace("__S_ARRAY__", str(S)).replace("__L_ARRAY__", str(L)))
(HERE / "index.html").write_text(html)
print("S =", S); print("L =", L)
print("materialized index.html")
