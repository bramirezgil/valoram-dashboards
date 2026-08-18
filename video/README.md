# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## GMAX VSL — Pixabay b-roll & music

The GMAX VSL (`src/gmax/`) is voiceover-driven with seven b-roll beats. Its
footage wiring lives in a single file, `src/gmax/broll.ts`, which ships with the
bundled `public/broll/c*.mp4` defaults so the video always renders as-is.

To refresh the footage with themed clips from Pixabay:

```console
# free key from https://pixabay.com/api/docs
PIXABAY_API_KEY=xxxx python tools/fetch_pixabay.py
```

That one command pulls a landscape **video + a matching photo** per beat into
`public/broll-gmax/`, computes the correct `<Loop>` length for each clip, and
rewrites the `fetch:begin..fetch:end` region of `src/gmax/broll.ts` for you (dir,
clip map, loop frames, poster stills). No manual editing — just re-render.

**Network:** the fetch needs egress to `pixabay.com` and `cdn.pixabay.com`. Some
managed/CI sandboxes block those hosts by policy; run it where they're reachable.

**Music:** Pixabay *Music* has no API, so it can't be fetched. Download a track
from <https://pixabay.com/music/> and save it as `public/music.mp3` (overwriting
the placeholder) before rendering. Pixabay media is royalty-free for commercial
use (Pixabay License); source page URLs are recorded in
`public/broll-gmax/sources.json`.

```console
npx remotion render GmaxVSL out/video.mp4
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
