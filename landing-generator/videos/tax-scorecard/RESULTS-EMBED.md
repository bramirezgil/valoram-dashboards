# Results-page video embed (per-tier)

The booking VSL auto-selects the cut that matches the visitor's `tierKey`
(the same variable `renderResults()` already uses to pick `tier.calAmt`).

## 1. Host the six MP4s
Upload the six renders and map each `tierKey` to its URL:

| tierKey        | file                     |
|----------------|--------------------------|
| `maximum`      | `tax-maximum.mp4`        |
| `very_high`    | `tax-very_high.mp4`      |
| `high`         | `tax-high.mp4`           |
| `moderate`     | `tax-moderate.mp4`       |
| `moderate_low` | `tax-moderate_low.mp4`   |
| `low`          | `tax-low.mp4`            |

## 2. Add a container where you want the video
Drop this just above the calendar embed inside `.calendar-inner`
(or in the hero, under the score):

```html
<div id="vslMount" style="width:100%;max-width:560px;margin:0 auto 36px;"></div>
```

## 3. Add this script (anywhere after the page's main script)

```html
<script>
  // tierKey -> hosted MP4 URL  (replace with your CDN/GHL URLs)
  const VSL_BY_TIER = {
    maximum:      "https://YOUR-CDN/tax-maximum.mp4",
    very_high:    "https://YOUR-CDN/tax-very_high.mp4",
    high:         "https://YOUR-CDN/tax-high.mp4",
    moderate:     "https://YOUR-CDN/tax-moderate.mp4",
    moderate_low: "https://YOUR-CDN/tax-moderate_low.mp4",
    low:          "https://YOUR-CDN/tax-low.mp4",
  };

  function mountVSL(tierKey) {
    const mount = document.getElementById('vslMount');
    const src = VSL_BY_TIER[tierKey] || VSL_BY_TIER.moderate;
    if (!mount || !src) return;
    mount.innerHTML =
      '<div style="position:relative;width:100%;padding-bottom:100%;background:#0a0a0a;border:1px solid rgba(248,150,76,.25);">' +
        '<video src="' + src + '" controls playsinline preload="metadata" ' +
        'style="position:absolute;top:0;left:0;width:100%;height:100%;display:block;"></video>' +
      '</div>';
  }
</script>
```

## 4. Call it once the tier is known
Inside the existing `renderResults({ score, tierKey, name })` function
(in the results page), add one line near the top:

```js
  mountVSL(tierKey);
```

That's it — each visitor sees the cut for their tier. The aspect ratio is
1:1 (square); the `padding-bottom:100%` box keeps it responsive. If you'd
rather autoplay muted, swap `controls playsinline` for
`autoplay muted loop playsinline` (browsers block sound-on autoplay).
