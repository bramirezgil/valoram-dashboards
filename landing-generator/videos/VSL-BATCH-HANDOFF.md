# VSL Batch — Handoff (pipeline validated, pilot approved)

**Goal:** produce a HyperFrames VSL (1080×1080, ~60–70s, voiceover) for each **post-ready** Valoram agent, matching the approved **Sharon pilot**.

## Status
- ✅ Pipeline works on this Windows machine. Rendered & validated: **Jill** (`videos/jill/renders/jill-vsl.mp4`) and **Sharon** (`videos/sharon/renders/sharon-vsl-web.mp4` — the APPROVED template/style).
- **Batch these 10** (already have bio+headshot+survey, in `Downloads/_ready-for-ghl/`): **Gary, Gregory, Lisa, Brenen, Cindy, Tim, Victor, Danna, Theresa, Dianne.** (Jill + Sharon done.)

## Voice per agent (Kokoro, local — not signed into HeyGen)
- Female `af_heart`: **Lisa, Cindy, Danna, Theresa, Dianne** (+ Sharon done).
- Male voice: **Gary, Gregory, Brenen, Tim, Victor** → use a male Kokoro voice (e.g. `am_adam` or `am_michael`; confirm with `npx hyperframes@0.7.22 tts --help` / voices list). Jill(f) done.

## Per-agent recipe (≈5–8 min each)
Work in `landing-generator/videos/<slug>/`. Copy `gsap.min.js` + `valoram-logo.png` from `videos/sharon/`.
1. **Script** → `vo/lines.txt`, 7 lines mapped to the 7-scene arc (hook · audience · the-problem/leak · reframe · authority+system · snapshot · CTA). Pull copy from the agent's landing page in `Downloads/` + their brief in `Downloads/_agent-briefs/<slug>.txt`.
   - **TTS-safe**: NO spelled acronyms (say "accountant", "the IRS" is fine, spell numbers: "four-oh-one-k", "one and a half to eight million"). Bio line = "a financial strategist with Valoram Solutions" — **never "founder"**.
2. **TTS** each line: `npx hyperframes@0.7.22 tts "<line>" -v <voice> -o vo/sN.wav </dev/null` (the `</dev/null` matters — npx eats stdin and breaks `while read` loops; loop with `sed -n "${n}p"`). ffprobe each for duration.
3. **Concat** → `vsl_audio.wav`: ffmpeg concat demuxer over `vo/s1..s7.wav` (`-c copy`). Compute cumulative scene starts from the durations.
4. **Compose** `vsl.html`: copy **`videos/sharon/vsl.html`** as the template (it has the S1/S3 fixes). Preserve `<style>` + `<script>` (GSAP timeline on `window.__timelines["main"]`, `.sN` classes) VERBATIM; change only scene TEXT, the `const S=[...]`/`const L=[...]` arrays + each scene's `data-start`/`data-duration` (from step 3), and root+audio `data-duration`. Adapt S3's middle visual to the niche (Sharon = leak/keep stacked bar; retirement agents = paycheck-gap, etc.).
5. **index.html**: `cp vsl.html index.html` (render needs an index.html entry point).
6. **Render**: from the project dir → `npx hyperframes@0.7.22 render . --quality draft --workers 1 --output renders/<slug>-vsl.mp4` (**`--workers 1` is mandatory** on this low-RAM box). Renders silent (~2 min).
7. **Mux + web-encode** (render can't find the wav → `hasAudio:false`, so add audio after):
   `ffmpeg -y -i renders/<slug>-vsl.mp4 -i vsl_audio.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium -c:a aac -b:a 192k -movflags +faststart -shortest renders/<slug>-vsl-web.mp4`
8. **QA**: extract 2–3 frames (`ffmpeg -ss <t> -i ... -frames:v 1 f.png`) and VIEW them (Read the png). Check S1/S3 legibility, no "founder", right name.

## Gotchas (all hit during the pilot)
- **Chrome shell**: if `chrome-headless-shell.exe` missing, the `npx hyperframes browser ensure` unzip can HANG — manually `Expand-Archive` the zip in `~/.cache/hyperframes/chrome/chrome-headless-shell/*.zip` (3s vs stuck).
- **Memory**: 11.7 GB total, often <1 GB available (stays committed). Render needs ~2–4 GB → `--workers 1 --quality draft`; reboot to reclaim RAM if a render OOMs. FFmpeg IS on PATH.
- **Custom CSS bars**: flex children with `%` heights collapse — use `flex:none` + explicit px heights (see Sharon `.stackbar/.leakseg/.keepseg`).
- **Playback**: if a viewer shows audio-only, it's the player — the faststart `-web.mp4` (H.264 yuv420p) plays in Chrome/VLC.
- Lint warns "multiple_root_compositions" (index.html+vsl.html both present) and a 1ms clip overlap — both harmless.

See memory `valoram-hyperframes-render-setup` and the approved pilot `videos/sharon/` for the working reference.
