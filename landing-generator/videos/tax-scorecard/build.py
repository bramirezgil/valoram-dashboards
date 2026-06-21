#!/usr/bin/env python3
"""Build a per-tier booking VSL: TTS narration + ambient music + timed composition.
Usage: python3 build.py <tier> [voice]
  tier  in: maximum very_high high moderate moderate_low low
  voice default: am_onyx
Outputs:
  vo/<tier>_audio.wav   (narration + music bed)
  tax-scorecard.html    (materialized composition, ready to render)
"""
import sys, subprocess, pathlib, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro

TIER = sys.argv[1] if len(sys.argv) > 1 else "maximum"
VOICE = sys.argv[2] if len(sys.argv) > 2 else "am_onyx"
SPEED = 0.98
HERE = pathlib.Path(__file__).parent
VO = HERE / "vo"

# ---- tier content ------------------------------------------------------------
LABELS = {
    "maximum": "Maximum Tax Opportunity",
    "very_high": "Very High Tax Opportunity",
    "high": "High Tax Opportunity",
    "moderate": "Moderate Tax Opportunity",
    "moderate_low": "Moderate Tax Opportunity",
    "low": "Low Tax Opportunity",
}
FIGURES = {
    "maximum": "$44,000+",
    "very_high": "$25,000+",
    "high": "$10,000+",
    "moderate": "$3,000+",
    "moderate_low": "$1,500+",
}
SCENE2_LINE = {
    "maximum": "You landed in our Maximum Tax Opportunity range. For households like yours, we typically identify forty four thousand dollars or more in potential annual tax savings.",
    "very_high": "You landed in our Very High Tax Opportunity range. For households like yours, we typically identify twenty five to forty four thousand dollars in potential annual tax savings.",
    "high": "You landed in our High Tax Opportunity range. For households like yours, we typically identify ten to twenty five thousand dollars in potential annual tax savings.",
    "moderate": "You landed in our Moderate Tax Opportunity range. For households like yours, we typically identify three to ten thousand dollars in potential annual tax savings.",
    "moderate_low": "You landed in our Moderate Tax Opportunity range. For households like yours, we typically identify fifteen hundred to five thousand dollars in potential annual tax savings.",
    "low": "Your score points to a more limited immediate opportunity. But coordinated planning often uncovers savings that standard tax prep misses.",
}
COMMON = {
    1: "Your Tax Opportunity Score is in. And based on your answers, there's real money on the table.",
    3: "Most high earners don't have a tax problem. They have a planning problem. Your C P A files accurately, but rarely engineers a proactive, year round strategy.",
    4: "On your free strategy session, a Valoram specialist runs a forensic review of your actual returns, and hands you your top three highest impact moves.",
    5: "Every strategy is legal, documented, and defensible. No cost, no obligation. Just a clear plan built around your numbers.",
    6: "Spots are limited each week. Pick a time on the calendar below, and book your free review now.",
}

def scene2_inner():
    label = LABELS[TIER]
    if TIER == "low":
        return (f'<div class="kicker s2">{label}</div>\n'
                f'    <h1 class="s2">A More <span class="o">Limited</span> Opportunity</h1>\n'
                f'    <div class="sub s2">But coordinated planning often uncovers savings standard tax prep misses.</div>')
    return (f'<div class="kicker s2">{label}</div>\n'
            f'    <div class="figure">{FIGURES[TIER]}</div>\n'
            f'    <div class="fig-suffix s2">in potential annual tax savings</div>\n'
            f'    <div class="disc-chip s2">Illustrative estimate &mdash; not a guarantee</div>')

# ---- TTS ---------------------------------------------------------------------
M = "/root/.cache/hyperframes/tts/models/kokoro-v1.0.onnx"
V = "/root/.cache/hyperframes/tts/voices/voices-v1.0.bin"
k = Kokoro(M, V)
lines = [COMMON[1], SCENE2_LINE[TIER], COMMON[3], COMMON[4], COMMON[5], COMMON[6]]
SR = 24000
segs, durs = [], []
for i, ln in enumerate(lines, 1):
    s, sr = k.create(ln, voice=VOICE, speed=SPEED, lang="en-us")
    if sr != SR:  # resample defensively
        import math
        idx = (np.arange(int(len(s) * SR / sr)) * sr / SR).astype(int)
        s = s[idx]
    segs.append(s.astype(np.float32))
    durs.append(len(segs[-1]) / SR)
    print(f"s{i}: {durs[-1]:.3f}s")

# ---- assemble narration with lead/gaps/tail ---------------------------------
LEAD, GAP, TAIL = 0.5, 0.5, 0.9
sil = lambda t: np.zeros(int(t * SR), np.float32)
narr = [sil(LEAD)]
for i, seg in enumerate(segs):
    narr.append(seg)
    narr.append(sil(TAIL if i == len(segs) - 1 else GAP))
narration = np.concatenate(narr)
TOT = len(narration) / SR
print(f"total: {TOT:.3f}s")
sf.write(VO / "narration.wav", narration, SR)

# ---- ambient music bed (subtle Am pad) --------------------------------------
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

# ---- mix narration + music --------------------------------------------------
out = VO / f"{TIER}_audio.wav"
subprocess.run([
    "ffmpeg", "-y", "-i", str(VO / "narration.wav"), "-i", str(music),
    "-filter_complex",
    "[0]volume=1.0[v];[1]volume=1.0[m];[v][m]amix=inputs=2:duration=first:normalize=0[a]",
    "-map", "[a]", "-ar", str(SR), str(out)
], check=True, capture_output=True)
print("wrote", out)

# ---- compute scene windows aligned to narration -----------------------------
S, L = [], []
t = 0.0
for i, d in enumerate(durs):
    lead = LEAD if i == 0 else 0.0
    tail = TAIL if i == len(durs) - 1 else GAP
    seg_len = lead + d + tail
    S.append(round(t, 3)); L.append(round(seg_len, 3))
    t += seg_len

# ---- materialize composition ------------------------------------------------
tpl = (HERE / "tax-scorecard.template.html").read_text()
html = (tpl
        .replace("__DURATION__", f"{TOT:.3f}")
        .replace("__AUDIO_SRC__", f"vo/{TIER}_audio.wav")
        .replace("__SCENE2_INNER__", scene2_inner())
        .replace("__S_ARRAY__", str(S))
        .replace("__L_ARRAY__", str(L)))
(HERE / "index.html").write_text(html)
print("S =", S)
print("L =", L)
print("materialized tax-scorecard.html for tier:", TIER)
