# Josh & Robin — Tax Strategy Recap (HyperFrames)

A personalized client recap video for **Josh & Robin** presented by **Alvin Ubaldo**,
Valoram Tax Strategy. Built with [HyperFrames](https://hyperframes.heygen.com)
(HTML → video), 1920×1080, ~3:18, 11 scenes.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The composition (master timeline, all 11 scenes) |
| `BRIEF.md` | Confirmed intent, facts, compliance guardrails, open items |
| `SCRIPT.md` | Approved narration (captions track it line-for-line) |
| `assets/qr-dropbox.png` | QR → secure Dropbox upload folder |
| `assets/qr-zoom.png` | QR → Friday onboarding Zoom meeting |
| `assets/gsap.min.js` | Vendored GSAP 3.14.2 (CDN is blocked in CI, so it's local) |

## Develop

```bash
cd josh-robin-tax-recap
npx hyperframes lint      # 0 errors
npx hyperframes check     # lint + runtime + layout + motion + contrast — passes
npm run dev               # live preview / Studio
npm run render            # render to MP4 (after presenter + audio are added)
```

## Verified

- `check` passes: 0 errors, 47/47 WCAG-AA contrast, 0 layout, 0 motion, 0 runtime.
- Friday onboarding shown as **July 24, 10:00 a.m. Eastern Time**.
- Anjali Srivastava shown as **Enrolled Agent, Tuesday, July 28** — no specific
  time displayed (per compliance).
- Dropbox and Zoom QR codes encode the exact approved URLs.

## Before final render (needs Valoram to supply)

1. **Presenter** — Alvin's recorded footage or an approved HeyGen avatar of Alvin.
   The likeness of a real person is intentionally *not* synthesized here.
2. **Voiceover** — Alvin's VO (or approved TTS) as `assets/vo.*`, wired as an
   `<audio>` clip; narration currently lives on screen as captions.
3. **Music** — a licensed optimistic corporate bed as `assets/music.*`.
4. **Logo** — swap the `VALORAM` wordmark for the official logo asset.

See `BRIEF.md` → "Open items" for detail.
