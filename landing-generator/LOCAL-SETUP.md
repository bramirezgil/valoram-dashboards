# Running locally (with Claude Code on your own machine)

The cloud sandbox can't reach the GoHighLevel API (its egress proxy blocks
`leadconnectorhq.com`). **Your local machine has no such restriction**, so run
anything that touches the GHL API here. Node 18+ required (`node --version`).

## One-time setup

```bash
git checkout claude/charming-cannon-3hxddv
git pull
cd landing-generator
```

Set your GHL credentials for the session (generate a **fresh** Private
Integration Token — Settings → Private Integrations; scopes
`calendars.readonly` + `calendars.write`):

```bash
# macOS / Linux
export GHL_TOKEN='pit-xxxxxxxx'
export GHL_LOCATION_ID='NPH9fcfnGaTAH4Xqh2dM'
```
```powershell
# Windows PowerShell
$env:GHL_TOKEN='pit-xxxxxxxx'
$env:GHL_LOCATION_ID='NPH9fcfnGaTAH4Xqh2dM'
```

> Never commit the token. `GHL_LOCATION_ID` above is the Valoram location.

## Provision calendars (idempotent — re-running never duplicates)

```bash
npm run provision          # dry-run: lists existing + what WOULD be created
npm run provision:commit   # create missing calendars, write booking URLs, rebuild pages
```

`ghl-calendars.js` reads every `clients/*.json`, creates a calendar only for
agents that don't already have one (matched by name/slug), optionally writes
each booking URL back into the config, and rebuilds the pages. Owners come from
each config's `business.ghlUserId` (already set for the current agents).

## Build pages only (no network)

```bash
npm run build                       # regenerate every agent's pages + survey specs
node generate.js clients/<slug>.json  # one agent
```

Outputs land in `dist/`:
`{slug}.html` (landing) · `{slug}-results.html` (score results) ·
`{slug}-survey-spec.txt` (7 niche questions to build the GHL survey).

## The funnel, end to end

1. `npm run provision:commit` → calendars exist, booking URLs wired in.
2. Build each agent's GHL survey from `dist/{slug}-survey-spec.txt`; enable
   per-answer scoring; set completion redirect to
   `https://YOUR-DOMAIN/{slug}-results.html?score={{contact.score}}`.
3. Paste the survey's inline embed into the config's `lead.ghlFormEmbed`, the
   calendar already embeds itself on the results page.
4. `npm run build`, then upload `dist/` to GHL or any static host.

The results page reads the raw survey score, normalizes it to 0–100 (max raw
score is 295), and shows the matching tier: 70–100% = Action Needed Now,
40–69% = Gaps to Close, 0–39% = Strong Foundation.
