# VSL Production — Handoff (make VSLs for agents that don't have one)

Produce a HyperFrames VSL (1080×1080 square, ~60–70s, voiceover) for each agent missing one, then host + embed it in the landing-page hero. Pipeline is **validated on this machine**; the **Sharon pilot is the approved template** (`videos/sharon/`).

## Status (2026-07-01)
- ✅ **VSL embedded (9):** Danna, Dianne, Theresa, Lisa, Gregory, Gary, Sharon, Cindy, Brenen — hero videos wired from GHL CDN URLs (`assets.cdn.filesafe.space/NPH9fcfnGaTAH4Xqh2dM/media/<id>.mp4`).
- **Jill** — has a local render (`videos/jill/renders/jill-vsl.mp4`) but it's NOT hosted/embedded yet (just needs host + embed).
- ⏭️ **NO VSL yet (29) — make these.** Priority first (post-ready = bio+headshot+survey done): **Jill*, Tim, Victor.** Then the rest: Joshua, Futaba, Harley, Donnis, Dawn, Dial, Ejay, Isaiah, Gley, Galia, Elmer, Elia, Josephine, Jon, Jay, Jasmine, Raj, Mich, Maricarmen, Leslie, Jennifer, Sana, Segg, Sonja, Susan, Vanessa. (*Jill = host+embed only.)

## Landing pages live in `C:\Users\TheMe\Downloads\<slug>.html` (+ `_ready-for-ghl/` copies for post-ready ones). Briefs: `Downloads/_agent-briefs/<slug>.txt`.

---
## STEP A — Make the VSL (≈5–8 min/agent). Work in `landing-generator/videos/<slug>/`
Clone assets from `videos/sharon/`: `cp ../sharon/{gsap.min.js,valoram-logo.png,vsl.html} .` then adapt.

1. **Script → `vo/lines.txt`** (7 lines → 7-scene arc: hook · audience · problem/leak · reframe · authority+system · snapshot · CTA). Pull copy from the agent's landing page + brief.
   - **TTS-safe**: NO spelled acronyms (say "accountant", not "C P A"; "the IRS" ok; spell numbers: "four-oh-one-k", "one and a half to eight million"). Bio line = **"a financial strategist with Valoram Solutions"** — NEVER "founder".
2. **TTS** per line: `npx hyperframes@0.7.22 tts "<line>" -v <voice> -o vo/sN.wav </dev/null` (the `</dev/null` is required — npx eats stdin; loop with `sed -n "${n}p" vo/lines.txt`, not `while read`). ffprobe each for duration.
   - **Voice:** female `af_heart` (Lisa/Cindy/Danna/Theresa/Dianne/Jill were female). Male agents → a male Kokoro voice (`am_adam`/`am_michael`; confirm via voices list). Not signed into HeyGen → local Kokoro.
3. **Concat → `vsl_audio.wav`**: ffmpeg concat demuxer over `vo/s1..s7.wav` (`-c copy`). Compute cumulative scene starts.
4. **Compose `vsl.html`** (from Sharon's): preserve `<style>` + `<script>` VERBATIM (GSAP timeline on `window.__timelines["main"]`, `.sN` classes). Change ONLY: scene text, `const S=[...]`/`const L=[...]` arrays + each scene `data-start`/`data-duration` (from step 3), root+audio `data-duration`. Adapt S3's middle visual to the niche.
5. `cp vsl.html index.html` (render needs an index.html entry).
6. **Render** (from project dir): `npx hyperframes@0.7.22 render . --quality draft --workers 1 --output renders/<slug>-vsl.mp4` — **`--workers 1` mandatory** (low RAM). Renders SILENT.
7. **Mux audio + web-encode** (render 404s the wav → `hasAudio:false`):
   `ffmpeg -y -i renders/<slug>-vsl.mp4 -i vsl_audio.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium -c:a aac -b:a 192k -movflags +faststart -shortest renders/<slug>-vsl-web.mp4`
8. **QA**: extract 2–3 frames (`ffmpeg -ss <t> -i ... -frames:v 1 f.png`) and VIEW them (Read the png). Check legibility, right name, no "founder".

## STEP B — Host (user/coworker does this in GHL)
Upload `<slug>-vsl-web.mp4` to the GHL Media Library (location `NPH9fcfnGaTAH4Xqh2dM`). GHL returns a CDN URL: `https://assets.cdn.filesafe.space/NPH9fcfnGaTAH4Xqh2dM/media/<id>.mp4`. Send those URLs back (one per agent).

## STEP C — Embed in the hero (exact method already used for the 9)
Insert this immediately AFTER the hero CTA `<a class="btn btn-lg" href="#optin">…</a>` (the first one; the final CTA is `btn btn-lg reveal`), in BOTH `Downloads/<slug>.html` and `Downloads/_ready-for-ghl/<slug>.html`:
```html
  <div class="hero-vsl reveal" style="margin:30px auto 0;max-width:480px;width:100%"><video controls playsinline preload="metadata" style="width:100%;aspect-ratio:1/1;border-radius:18px;box-shadow:0 18px 44px rgba(0,0,0,.28);display:block;background:#000" src="<CDN URL>"></video></div>
```
(Placement = headline → lead → CTA → video, all first-fold. To put video ABOVE the CTA instead, insert before the CTA anchor.)

---
## Gotchas (all hit already)
- **Chrome shell**: if `chrome-headless-shell.exe` missing, `npx hyperframes browser ensure`'s unzip HANGS — manually `Expand-Archive` the zip in `~/.cache/hyperframes/chrome/chrome-headless-shell/*.zip` (3s).
- **RAM**: 11.7 GB total, often <1 GB avail (stays committed). Render needs ~2–4 GB → `--quality draft --workers 1`; reboot if OOM. FFmpeg IS on PATH.
- **Custom CSS bars**: flex children with `%` heights collapse → use `flex:none` + px heights (see Sharon `.stackbar/.leakseg/.keepseg` from the S3 redesign).
- **Silent player**: if a viewer plays audio-only, it's the player — the faststart `-web.mp4` (H.264 yuv420p) plays in Chrome/VLC.
- **Preview**: script edits don't refresh the Launch preview; a tiny Edit-tool touch (e.g. `charset="UTF-8"`→`utf-8`) forces it.

Memory `valoram-hyperframes-render-setup` + the approved pilot `videos/sharon/` are the working reference. To resume: new session → *"make VSLs for the agents without one — follow videos/VSL-BATCH-HANDOFF.md."*
