# Resume checklist — finish the R.I.S.E. footage VSL (Pacific Ridgeway)

Branch: `claude/create-video-setup-qbknrc`. Composition: `RiseVSL` (src/rise/).

## Done
- Full R.I.S.E. production-package VSL rebuilt & rebranded to Pacific Ridgeway (no R.I.S.E./Valoram program name — replaced with a Pacific Ridgeway brand card).
- 7 b-roll clips in `public/broll/` (c0–c6, 1080p). Clips stretched to play once (no looping); long "Problem" section is a 3-clip montage.
- Brand-gold karaoke captions from the script (`src/rise/script.ts` — the `vo` fields ARE the voiceover script, in order).
- On-screen cards, bigger logos, ducked music bed (`public/music-rise.mp3`).

## To do next session: generate the voiceover with Piper (free, offline, commercial-OK)
1. **Allowlist** (env network settings) before starting the session: `huggingface.co` (+ `cdn-lfs.huggingface.co`) for the Piper voice model, and `github.com` for the piper binary if needed. (pip deps come from pypi, already allowed.)
2. Install: `pip install piper-tts` (pulls onnxruntime from pypi).
3. Voice: a warm male US voice per the doc — `en_US-ryan-high` (or `en_US-hfc_male-medium`). Download the `.onnx` + `.onnx.json` from `huggingface.co/rhasspy/piper-voices`.
4. Read the ordered `vo` lines from `src/rise/script.ts`, synthesize each (or the whole script) to WAV, concatenate with the doc's pacing (short pauses between sentences), convert to `public/narration-rise.mp3`.
5. Wire VO into `RiseVSL`: add `<Audio src={staticFile("narration-rise.mp3")} />`, and **lower the music `volume` from 0.45 to ~0.15** (bed under VO).
6. If the synthesized VO timing differs from the doc timecodes, re-fit the section boundaries in `src/rise/script.ts` `SEGMENTS` to the actual VO, then the captions auto-retime.
7. Render: `npx remotion render RiseVSL out/rise-vsl.mp4 --browser-executable=<headless_shell>`, compress to <30MiB for chat delivery.

## Also unlocked once network is open
- Pixabay auto-sourcing of clips/music (`PIXABAY_API_KEY` set; `pixabay.com`, `cdn.pixabay.com` allowlisted).
