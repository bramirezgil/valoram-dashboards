# G Max hero VSL — embed for the GHL main page

The video is square (1080×1080), ~51s, am_liam voice, fully branded.

## 1. Upload the render
Upload `renders/gmax-vsl.mp4` to your GHL **Media Library**, then copy its
URL (looks like `https://assets.cdn.filesafe.space/.../media/XXXX.mp4`).

> Base64-inlining isn't practical for a multi-MB MP4, so the video has to be
> hosted. The GHL media library is the same place the tax-scorecard cuts live.

## 2. Drop this where you want the video in the hero
Paste this block into your page's Custom HTML / Code editor (typically just
under the headline, above the "Score My Retention Risk" button). Replace the
one `PASTE_GMAX_MP4_URL_HERE` placeholder with the URL from step 1.

```html
<div class="gmax-vsl" style="width:100%;max-width:520px;margin:0 auto 36px;">
  <div style="position:relative;width:100%;padding-bottom:100%;background:#0a0a0a;
              border:1px solid rgba(248,150,76,.28);border-radius:10px;overflow:hidden;
              box-shadow:0 20px 70px rgba(0,0,0,.45);">
    <video
      src="PASTE_GMAX_MP4_URL_HERE"
      controls playsinline preload="metadata"
      style="position:absolute;top:0;left:0;width:100%;height:100%;display:block;"></video>
  </div>
</div>
```

That's it — responsive 1:1 box, branded border, plays on click with sound.

## 3. (Optional) Autoplay muted
If you'd rather it autoplay silently and loop (browsers block sound-on
autoplay), swap the `<video ...>` attributes:

```html
autoplay muted loop playsinline preload="auto"
```

Keep `muted` — without it autoplay is blocked. A "Tap for sound" overlay can
be added if you want sound-on engagement.
