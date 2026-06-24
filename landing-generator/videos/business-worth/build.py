#!/usr/bin/env python3
"""Build a Business Worth VSL (square 1080x1080, am_liam).
Usage: python3 build.py <key> [voice]
  keys: investor | value | foundation | early | main
Outputs vo/audio.wav + index.html (ready to render).
"""
import sys, subprocess, pathlib, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro

KEY   = sys.argv[1] if len(sys.argv) > 1 else "main"
VOICE = sys.argv[2] if len(sys.argv) > 2 else "am_liam"
SPEED = 0.98
HERE  = pathlib.Path(__file__).parent
VO    = HERE / "vo"

CTA_TIER = "Book My Strategy Call"
CTA_MAIN = "Get My Valuation Score"

# Each video = parallel lists: scenes[] (visual) and narr[] (one line per scene).
VIDEOS = {
  # ───────────────── RESULTS-PAGE TIER VSLs ─────────────────
  "investor": {
    "narr": [
      "First, congratulations. Your score puts you in the Investor Grade tier, and that's rare. It means your business has what buyers pay a premium for: it doesn't depend entirely on you, your revenue is reasonably predictable, and you've built real structure.",
      "But the gap between a good exit and a great one is decided in the final stretch.",
      "At your multiple, one point of EBITDA, cleaner books, or a little more recurring revenue can swing your price by hundreds of thousands.",
      "That's the purpose of your Strategy Call. We review your score driver by driver, find where you're leaving multiple on the table, and map the cleanest path to market on your timeline.",
      "You've built something most owners never will. Let's make sure you capture every dollar. Book your complimentary Business Worth Strategy Call below.",
    ],
    "scenes": [
      {"eyebrow":"Your Business Worth Results","h":"Investor <span class='o'>Grade</span>","sub":"What buyers pay a premium for: low owner dependency, predictable revenue, real structure."},
      {"kicker":"Here's The Truth","h":"The Great Exit Is Decided<br>in the <span class='o'>Final Stretch</span>"},
      {"kicker":"At Your Multiple","figure":"+$100Ks","figsuffix":"from one point of EBITDA, cleaner books,<br>or a little more recurring revenue"},
      {"kicker":"Your Strategy Call","h":"We Map the Cleanest<br><span class='o'>Path to Market</span>","sub":"Driver by driver — where you're leaving multiple on the table."},
      {"kicker":"One Step Away","h":"Capture <span class='o'>Every Dollar</span>","cta":CTA_TIER,"scarcity":"Complimentary · no obligation","logo":True},
    ],
  },
  "value": {
    "narr": [
      "Your score puts you in the Value-Builder tier, a strong place to be. You've got a real, valuable business with solid fundamentals, and meaningful upside that hasn't been captured yet.",
      "Businesses in your range typically trade around three to five times earnings.",
      "The owners who break into premium territory almost always fix the same few things: reducing how much the business depends on them, growing recurring revenue, and documenting how the work gets done.",
      "Those aren't massive overhauls, but in the right order they can move your multiple, and your sale price, significantly. On your Strategy Call we'll find which levers move your number the most, and turn it into a prioritized plan.",
      "You've built the foundation. Let's build the value on top of it. Book your complimentary Strategy Call below.",
    ],
    "scenes": [
      {"eyebrow":"Your Business Worth Results","h":"Value-<span class='o'>Builder</span>","sub":"A strong position — with meaningful upside you haven't captured yet."},
      {"kicker":"Why It Matters","figure":"3–5x","figsuffix":"where businesses in your range typically trade today"},
      {"kicker":"Break Into Premium","h":"Owners Who Win Fix the<br><span class='o'>Same Few Things</span>","tags":["Owner dependency","Recurring revenue","Systems"]},
      {"kicker":"Your Strategy Call","h":"Find the Levers That Move<br><span class='o'>Your Number</span>","sub":"In the right order — turned into a clear, prioritized plan."},
      {"kicker":"One Step Away","h":"Build the <span class='o'>Value</span> on Top","cta":CTA_TIER,"scarcity":"Complimentary · no obligation","logo":True},
    ],
  },
  "foundation": {
    "narr": [
      "Your score puts you in the Foundation Stage, and this is the most important tier to understand. You've built a business with real value, but there are specific gaps quietly capping what it's worth.",
      "The most common one we see here is customer concentration. When too much revenue rides on one or two clients, buyers see risk, and risk lowers the price.",
      "The good news is these gaps are fixable, and fixing them is exactly what moves a business from a two-or-three-times multiple into a much stronger position.",
      "But it takes time, which is why finding out now, instead of at the closing table, is such an advantage. On your Strategy Call we'll build the roadmap to close the gaps in the order that creates the most value, fastest.",
      "This is the work that changes your number. Book your complimentary Strategy Call below.",
    ],
    "scenes": [
      {"eyebrow":"Your Business Worth Results","h":"Foundation <span class='o'>Stage</span>","sub":"Real value — with specific gaps quietly capping what it's worth."},
      {"kicker":"The Most Common Gap","h":"Customer <span class='o'>Concentration</span>","sub":"When too much revenue rides on one or two clients, buyers see risk — and risk lowers the price."},
      {"kicker":"The Good News","h":"These Gaps Are <span class='o'>Fixable</span>","sub":"Fixing them is what moves a 2–3x business into a much stronger position."},
      {"kicker":"Your Strategy Call","h":"Find Out Now —<br>Not at the <span class='o'>Closing Table</span>","sub":"We build the roadmap to close the gaps in the order that creates the most value, fastest."},
      {"kicker":"One Step Away","h":"The Work That Changes<br><span class='o'>Your Number</span>","cta":CTA_TIER,"scarcity":"Complimentary · no obligation","logo":True},
    ],
  },
  "early": {
    "narr": [
      "Your score puts you in the Early Stage tier, and if your first reaction is disappointment, take a breath, because this is the most valuable place to be getting this information.",
      "Right now your business is likely valued close to its revenue, not a healthy multiple of its profit, which means almost every improvement you make from here has outsized impact on what it's worth.",
      "You're not behind, you're early. And early is where the biggest gains are made.",
      "The owners who win from here do three things first: get a clear baseline, focus on profitability, and start building simple systems. That's what your Strategy Call is for: the first three moves that build real, sellable value, in plain English.",
      "The best time to start was years ago. The second best time is now. Book your complimentary Strategy Call below.",
    ],
    "scenes": [
      {"eyebrow":"Your Business Worth Results","h":"Early <span class='o'>Stage</span>","sub":"The most valuable place to be getting this information."},
      {"kicker":"Why","h":"Valued on Revenue,<br>Not <span class='o'>Profit</span> — Yet","sub":"Which means almost every improvement you make has outsized impact on your value."},
      {"kicker":"The Mindset","h":"You're Not Behind —<br>You're <span class='o'>Early</span>","sub":"And early is where the biggest gains are made."},
      {"kicker":"Your First Three Moves","h":"Build Real,<br><span class='o'>Sellable Value</span>","tags":["Baseline","Profitability","Systems"]},
      {"kicker":"One Step Away","h":"The Second-Best Time<br>Is <span class='o'>Now</span>","cta":CTA_TIER,"scarcity":"Complimentary · no obligation","logo":True},
    ],
  },
  # ───────────────── MAIN LANDING-PAGE VSL ─────────────────
  "main": {
    "narr": [
      "You've spent years building your business. But do you actually know what it's worth?",
      "Most owners don't. And without that number, you're negotiating your exit blind, leaving real money on the table.",
      "The free Business Worth Scorecard changes that. Eight questions, about five minutes, no financial documents required.",
      "You'll get your estimated valuation range, your exit-readiness score, and the specific drivers that move your number: owner dependency, recurring revenue, customer concentration, and more.",
      "Then a clear roadmap to build real, sellable value before you exit, on your terms.",
      "Take the free Business Worth Scorecard below and find out what your business is really worth.",
    ],
    "scenes": [
      {"eyebrow":"Free Business Worth Scorecard","h":"What Is Your Business<br><span class='o'>Actually Worth?</span>","sub":"You've spent years building it. But do you know the number?"},
      {"kicker":"The Blind Spot","h":"Most Owners Negotiate<br>Their Exit <span class='o'>Blind</span>","sub":"And leave real money on the table."},
      {"kicker":"The Fix","h":"The Free Business Worth<br><span class='o'>Scorecard</span>","tags":["8 questions","~5 minutes","No documents"]},
      {"kicker":"What You Get","h":"Your Valuation Range &amp;<br><span class='o'>Exit-Readiness Score</span>","tags":["Owner dependency","Recurring revenue","Concentration"]},
      {"kicker":"And A Roadmap","h":"Build Real, <span class='o'>Sellable</span> Value","sub":"Before you exit — on your terms."},
      {"kicker":"Start Now","h":"Find Out What It's<br><span class='o'>Really Worth</span>","cta":CTA_MAIN,"scarcity":"Free · under 5 minutes","logo":True},
    ],
  },
}

def scene_html(i, sc):
    p = [f'<section class="clip" id="sc{i}">']
    if sc.get("eyebrow"):
        p.append(f'<div class="eyebrow box anim">◆&nbsp; {sc["eyebrow"]}</div>')
        p.append('<div class="divider anim"></div>')
    if sc.get("kicker"):
        p.append(f'<div class="kicker anim">{sc["kicker"]}</div>')
    if sc.get("h"):
        p.append(f'<h1 class="anim">{sc["h"]}</h1>')
    if sc.get("figure"):
        p.append(f'<div class="figure pop">{sc["figure"]}</div>')
    if sc.get("figsuffix"):
        p.append(f'<div class="fig-suffix anim">{sc["figsuffix"]}</div>')
    if sc.get("sub"):
        p.append(f'<div class="sub anim">{sc["sub"]}</div>')
    if sc.get("tags"):
        tags = "".join(f'<div class="tag pop"><span class="dot">◆</span>{t}</div>' for t in sc["tags"])
        p.append(f'<div class="tag-row">{tags}</div>')
    if sc.get("cta"):
        p.append(f'<div class="cta-btn pop">{sc["cta"]}</div>')
    if sc.get("scarcity"):
        p.append(f'<div class="scarcity anim">{sc["scarcity"]}</div>')
    if sc.get("logo"):
        p.append('<div class="logo-chip pop"><img src="valoram-logo.png" alt="Valoram Solutions"></div>')
    p.append("</section>")
    return "\n  ".join(p)

if KEY not in VIDEOS:
    sys.exit(f"unknown key {KEY}; choose: {', '.join(VIDEOS)}")
cfg = VIDEOS[KEY]
LINES  = cfg["narr"]
SCENES = cfg["scenes"]
assert len(LINES) == len(SCENES), f"{KEY}: {len(LINES)} narr vs {len(SCENES)} scenes"

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

scenes_html = "\n\n".join(scene_html(i + 1, sc) for i, sc in enumerate(SCENES))
tpl = (HERE / "bw.template.html").read_text()
html = (tpl.replace("__DURATION__", f"{TOT:.3f}")
           .replace("__AUDIO_SRC__", "vo/audio.wav")
           .replace("__SCENES__", scenes_html)
           .replace("__S_ARRAY__", str(S)).replace("__L_ARRAY__", str(L)))
(HERE / "index.html").write_text(html)
print("S =", S); print("L =", L)
print(f"materialized index.html for '{KEY}' ({len(SCENES)} scenes)")
