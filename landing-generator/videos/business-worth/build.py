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
      "First, congratulations. Your score puts you in the Investor Grade tier, and that's rare. It means your business has what makes a company genuinely valuable: it doesn't depend entirely on you, your revenue is reasonably predictable, and you've built real structure.",
      "A business this strong is one of your most important assets. Knowing exactly what it's worth gives you leverage in every decision: financing, bringing on a partner, planning your future, and yes, an eventual sale.",
      "Your scorecard shows you're in strong shape, but it isn't a valuation. At your level, small differences in margin, recurring revenue, or how the books are kept move the real number a lot, and that's worth getting right.",
      "That's the purpose of your Strategy Call. We pin down your actual number, review your score driver by driver, and show you where the value is and how to protect it.",
      "You've built something most owners never will. Let's make sure you know exactly what it's worth. Book your complimentary Business Worth Strategy Call below.",
    ],
    "scenes": [
      {"eyebrow":"Your Business Worth Results","h":"Investor <span class='o'>Grade</span>","sub":"What makes a company genuinely valuable: low owner dependency, predictable revenue, real structure."},
      {"kicker":"Why It Matters","h":"One of Your Most<br>Important <span class='o'>Assets</span>","tags":["Financing","Partnerships","Future planning"]},
      {"kicker":"Your Scorecard, Not a Valuation","h":"It Shows Where<br>You <span class='o'>Stand</span>","sub":"Your real number comes from a closer look at your books and drivers — on the call."},
      {"kicker":"Your Strategy Call","h":"We Pin Down Your<br><span class='o'>Actual Number</span>","sub":"Driver by driver — where the value is, and how to protect it."},
      {"kicker":"One Step Away","h":"Know Exactly What<br>It's <span class='o'>Worth</span>","cta":CTA_TIER,"scarcity":"Complimentary · no obligation","logo":True},
    ],
  },
  "value": {
    "narr": [
      "Your score puts you in the Value-Builder tier, a strong place to be. You've got a real, valuable business with solid fundamentals, and meaningful room to grow what it's worth.",
      "Knowing your number isn't just about selling. It shapes how you raise capital, bring on partners, plan your retirement, and decide where to invest next.",
      "Your scorecard points to where you stand. Businesses in your range can move significantly by improving a few key things: reducing how much the business depends on you, growing recurring revenue, and documenting how the work gets done.",
      "On your Strategy Call we'll calculate your real number, find which of those levers moves it the most for you, and turn it into a clear, prioritized plan.",
      "You've built the foundation. Let's build the value on top of it. Book your complimentary Strategy Call below.",
    ],
    "scenes": [
      {"eyebrow":"Your Business Worth Results","h":"Value-<span class='o'>Builder</span>","sub":"A strong position — with real room to grow what your business is worth."},
      {"kicker":"It's Not Just About Selling","h":"Your Number Shapes<br><span class='o'>Every Decision</span>","tags":["Raising capital","Partnerships","Retirement"]},
      {"kicker":"A Few Key Levers","h":"What Moves a<br><span class='o'>Valuation</span>","tags":["Owner dependency","Recurring revenue","Systems"]},
      {"kicker":"Your Strategy Call","h":"We Calculate Your<br><span class='o'>Real Number</span>","sub":"Then find the levers that move it most — turned into a prioritized plan."},
      {"kicker":"One Step Away","h":"Build the <span class='o'>Value</span> on Top","cta":CTA_TIER,"scarcity":"Complimentary · no obligation","logo":True},
    ],
  },
  "foundation": {
    "narr": [
      "Your score puts you in the Foundation Stage, and this is an important tier to understand. You've built a business with real value, but there are specific gaps quietly capping what it's worth.",
      "And what it's worth matters long before you ever sell. It affects your borrowing power, your options if a partner wants in or out, and how protected your family is if something happens to you.",
      "Your scorecard flags where you stand. The most common gap we see at this stage is customer concentration: when too much revenue rides on one or two clients, your value takes a hit.",
      "The good news is these gaps are fixable. On your Strategy Call we'll calculate your real number and build the roadmap to close them, in the order that creates the most value, fastest.",
      "This is the work that changes your number. Book your complimentary Strategy Call below.",
    ],
    "scenes": [
      {"eyebrow":"Your Business Worth Results","h":"Foundation <span class='o'>Stage</span>","sub":"Real value — with specific gaps quietly capping what your business is worth."},
      {"kicker":"Why Your Number Matters Now","h":"Long Before You<br>Ever <span class='o'>Sell</span>","tags":["Borrowing power","Partner options","Family protection"]},
      {"kicker":"The Most Common Gap","h":"Customer <span class='o'>Concentration</span>","sub":"When too much revenue rides on one or two clients, your value takes a hit."},
      {"kicker":"Your Strategy Call","h":"We Calculate It —<br>and <span class='o'>Close the Gaps</span>","sub":"The roadmap to raise your number, in the order that creates the most value, fastest."},
      {"kicker":"One Step Away","h":"The Work That Changes<br><span class='o'>Your Number</span>","cta":CTA_TIER,"scarcity":"Complimentary · no obligation","logo":True},
    ],
  },
  "early": {
    "narr": [
      "Your score puts you in the Early Stage tier, and if your first reaction is disappointment, take a breath, because this is the most valuable place to be getting this information.",
      "Knowing what your business is worth this early is a real advantage. It guides how you grow, when to reinvest, how you plan your own finances, and the decisions that compound over time.",
      "Your scorecard shows where you're starting from. Right now your business is likely valued close to its revenue, which means almost every improvement you make from here has outsized impact on its worth.",
      "You're not behind, you're early. On your Strategy Call we'll calculate where you really stand and give you the first three moves that build real value: a clear baseline, stronger profitability, and simple systems.",
      "The best time to start was years ago. The second best time is now. Book your complimentary Strategy Call below.",
    ],
    "scenes": [
      {"eyebrow":"Your Business Worth Results","h":"Early <span class='o'>Stage</span>","sub":"The most valuable place to be getting this information."},
      {"kicker":"An Early Advantage","h":"It Guides How<br>You <span class='o'>Grow</span>","tags":["When to reinvest","Personal planning","Growth"]},
      {"kicker":"Why It Matters","h":"Valued on Revenue,<br>Not <span class='o'>Profit</span> — Yet","sub":"Which means almost every improvement you make has outsized impact on your worth."},
      {"kicker":"Your First Three Moves","h":"Build Real <span class='o'>Value</span>","tags":["Baseline","Profitability","Systems"]},
      {"kicker":"One Step Away","h":"The Second-Best Time<br>Is <span class='o'>Now</span>","cta":CTA_TIER,"scarcity":"Complimentary · no obligation","logo":True},
    ],
  },
  # ───────────────── MAIN LANDING-PAGE VSL ─────────────────
  "main": {
    "narr": [
      "You've spent years building your business. But do you actually know what it's worth?",
      "Most owners don't. And your number matters for far more than selling: it shapes how you raise capital, bring on partners, plan your retirement, and protect your family.",
      "The free Business Worth Scorecard gives you a clear starting point. Eight questions, about five minutes, no financial documents required.",
      "You'll get your scorecard: your readiness score, your value tier, and the specific drivers that shape what your business is worth, like owner dependency, recurring revenue, and customer concentration.",
      "The scorecard shows you where you stand. Your actual business valuation, and the roadmap to grow it, is something we build together on a complimentary strategy call.",
      "Take the free Business Worth Scorecard below and find out what your business is really worth.",
    ],
    "scenes": [
      {"eyebrow":"Free Business Worth Scorecard","h":"What Is Your Business<br><span class='o'>Actually Worth?</span>","sub":"You've spent years building it. But do you know the number?"},
      {"kicker":"It's Not Just About Selling","h":"Your Number Shapes<br><span class='o'>Every Big Decision</span>","tags":["Raising capital","Partnerships","Retirement"]},
      {"kicker":"A Clear Starting Point","h":"The Free Business Worth<br><span class='o'>Scorecard</span>","tags":["8 questions","~5 minutes","No documents"]},
      {"kicker":"What You Get","h":"Your Scorecard &amp;<br><span class='o'>Readiness Score</span>","tags":["Owner dependency","Recurring revenue","Concentration"]},
      {"kicker":"Then Your Valuation","h":"Your Number Comes<br><span class='o'>From the Call</span>","sub":"The scorecard shows where you stand; we build your valuation together."},
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
