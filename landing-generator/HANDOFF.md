# Valoram — Session Handoff

Quick-start context so the next session can move fast. Covers what exists, how
the system works, the environment gotchas we hit, and what's still pending.

- **Repo:** `bramirezgil/valoram-dashboards`
- **Working branch:** `claude/friendly-clarke-hcz1l3` (all work is here; pushed)
- **Push access:** the Claude GitHub App must have **Contents: write** on the repo.
  It does now; if a future session 403s on push, re-check the app install.
- **Contact email used on pages:** `lubaldo@valoramsolutions.com`

---

## 1. What's in this repo

```
/ (root)                      ← original Valoram dashboards (v23) + visual polish
  executive-overview.html, agent-production.html, manager-personal-production.html,
  manager-team-production.html, policy-ledger.html

landing-generator/            ← the landing-page + video system (main focus)
  generate.js                 core renderer (zero-dep templating engine)
  ai-copy.js                  AI copywriter (Anthropic SDK, claude-opus-4-8; no-key fallback)
  template/
    landing.html              long-form sales template (all sections)
    results.html              post-survey results page (segment routing)
  assets/
    valoram-logo-datauri.txt  the Valoram logo (transparent PNG data URI) for the brand preset
  clients/                    one JSON config per client (+ *.brief.json, *.SURVEY.md)
  dist/                       generated HTML (what you paste into GHL)
  videos/jill/                HyperFrames VSL project (composition + render)
  README.md, GHL-DEPLOY.md, clients/_SCHEMA.md, HANDOFF.md (this file)

.agents/skills/               installed skill: heygen-com/hyperframes (video generation)
```

---

## 2. The landing-page generator

**Add a client two ways:**
- Hand-written: copy an existing `clients/*.json`, edit, then
  `node generate.js clients/<slug>.json` → `dist/<slug>.html`.
- AI-drafted: write `clients/<slug>.brief.json` (facts only), then
  `node ai-copy.js clients/<slug>.brief.json` → writes the full config →
  `node generate.js …`. Needs `ANTHROPIC_API_KEY` + `npm install` (graceful
  placeholder fallback without them).
- Build everything: `node generate.js --all`.

**Page structure (every section optional):** hero → problem → results+stats →
distinction (us vs them) → audience → offer + how-it-works → testimonials →
opt-in form → FAQ → final CTA. Full field reference: `clients/_SCHEMA.md`.

**Emphasis accent:** wrap words in `*asterisks*` in any headline/title → renders
in the brand accent color. (e.g. `"Keep More, *Protect More*"`)

**Lead capture (`lead.mode`):** `booking` (GHL calendar link), `ghl-form` (paste
GHL form/survey iframe into `lead.ghlFormEmbed`), or `webhook` (native form →
GHL inbound webhook). Deploy steps: `GHL-DEPLOY.md`.

**Results page:** add a `resultsPage` block with `segments` (e.g. priority /
qualified / nurture) → generator also emits `dist/<slug>-results.html`. It reads
`?segment=` from the URL (falls back to `default`). Segments can show a CTA
button or an inline `embed` (e.g. a GHL booking iframe).

---

## 3. Branding — Valoram is the default

Set `"brand": "valoram"` in a client config and it auto-applies:
- Logo (header + footer) from `assets/valoram-logo-datauri.txt`
- Colors: **orange `#FF7428`**, near-black **`#0B0D0D`** (sampled from the logo)
- Font: **Poppins**

Any explicit `theme`/`logoUrl`/color in the config overrides the preset. Rule
from the client: **brand every new page as Valoram unless told otherwise.**

Notes baked into the template:
- Footer shows the logo on a white chip (the logo is dark-on-transparent and
  would vanish on the dark footer).
- Button text auto-picks black/white for contrast against the accent
  (`--btn-ink`); on white, eyebrows/`<em>` use a darkened accent (`--accent-ink`).
- Add a compliance `business.disclaimer` for financial pages (renders in footer).

---

## 4. Video / VSL pipeline (HeyGen HyperFrames skill)

Run via `npx hyperframes …`. Project lives in `videos/jill/` (composition is a
single seekable HTML file rendered to MP4). Workflow: author → `lint` →
`validate` → `inspect` → `render`.

### ⚠️ Environment setup needed each fresh container (we did all this)
1. **FFmpeg/FFprobe** missing → `apt-get install -y --no-install-recommends ffmpeg`
   (run `apt-get update` first; skip recommends — the va-driver recommends 404).
2. **Headless Chrome** missing → `npx hyperframes browser ensure` (downloads fine).
3. **GSAP + fonts must be vendored locally** — the render browser **blocks
   jsdelivr/unpkg (cert-invalid)** and offline Google Fonts. So:
   - GSAP: `npm pack gsap@3.14.2` → copy `package/dist/gsap.min.js` into the
     project, reference it locally. (curl to jsdelivr/unpkg returns 403; npm registry works.)
   - Fonts: download the Latin Poppins woff2 from `fonts.gstatic.com` (reachable)
     and embed as base64 `@font-face` in the composition.
4. **TTS (voiceover):** local **Kokoro** (no key) → `pip install kokoro-onnx soundfile`,
   then `npx hyperframes tts "..." -v af_heart -o vo.wav`. First run downloads the model.
5. **Music:** no Lyria/MusicGen key available → we synthesized a subtle ambient
   pad with FFmpeg `sine` sources and mixed it under the narration. If a
   `GEMINI_API_KEY` becomes available, `npx hyperframes bgm` gives real music.

### Composition gotchas
- Register a paused GSAP timeline on `window.__timelines["main"]`.
- With a manual timeline, **clips do NOT auto-hide** by their time window — fade
  each scene in/out via the timeline (`opacity`), or scenes overlap.
- `<audio>`/`<video>` must be a **direct child of the root** element.
- Render audio check: `ffmpeg -i out.mp4 -af volumedetect -f null /dev/null`.

---

## 5. Per-client status

### TedOS — Fiduciary Retirement (high-net-worth)
- Files: `dist/tedos-retirement.html`, `dist/tedos-retirement-results.html`,
  config `clients/tedos-retirement.json`, survey `clients/tedos-retirement.SURVEY.md`.
- Branding: Valoram. Booking calendar wired:
  `https://api.leadconnectorhq.com/widget/booking/PwP2fpbubtsvdSAe1Cf3`
  (embedded inline on results `priority` + `qualified` segments).
- Results page segments: `priority`, `qualified`, `nurture` (default qualified).
- Survey: questions + **point scoring** (159 max) + routing in the SURVEY.md.
- **PENDING:** client approval; then paste the GHL **survey** embed into
  `lead.ghlFormEmbed` and re-generate. (Opt-in section currently shows a
  placeholder slot.)

### Jill Espino — Financial Certainty for Teachers (Texas TRS)
- File: `dist/jill-teachers.html`, config `clients/jill-teachers.json`.
- Branding: Valoram. Audience: TX educators 47–58.
- **PENDING:** GHL **opt-in form** embed (`lead.ghlFormEmbed`) and a real
  `business.bookingUrl` (currently placeholder). No results/survey flow yet
  (can add the same way as TedOS if qualification is wanted).
- **VSL video:** `videos/jill/renders/jill-promo-narrated.mp4` — 18→32s, 1080×1080,
  narrated (Kokoro) + music, all 7 system steps shown. DONE.

### Demo/template examples (not clients)
- `dist/example-acme-insurance.html` (insurance, webhook form),
  `dist/example-bright-dental.html` (dental, booking) — reference builds showing
  the template with other industries/themes.

---

## 6. Open to-dos / next steps
- [ ] TedOS: drop in GHL survey embed once built; ship after approval.
- [ ] Jill: add GHL opt-in form embed + real booking URL; optional results/survey flow.
- [ ] Optional video cuts: 9:16 (Reels/Stories) and 16:9 (YouTube/ads); voice/music swaps.
- [ ] Optional: a nurses/teachers 403(b) variant was discussed (different audience from TedOS).
- [ ] If real licensed music is wanted, provide a track or a `GEMINI_API_KEY`.

---

## 7. Handy commands
```bash
cd landing-generator
node generate.js --all                         # rebuild every page
node generate.js clients/<slug>.json           # one client
node ai-copy.js clients/<slug>.brief.json      # AI draft from a brief (needs ANTHROPIC_API_KEY)
# video (after env setup in §4):
cd videos/jill && npx hyperframes lint && npx hyperframes validate \
  && npx hyperframes render . --quality high --output renders/<name>.mp4
```
