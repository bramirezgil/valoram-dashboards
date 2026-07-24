# Landing page QA suite

Browser-based QA for the three production dashboards at the repo root
(`agent-production*.html`, `manager-personal-production*.html`,
`manager-team-production*.html`).

It loads each page in real Chromium and checks: page load, title, absence of
JavaScript/console errors, presence of core UI elements, date-filter defaults,
the Configure modal open/close, search + filter interactivity, responsiveness
(no horizontal overflow at 390px), and — statically — that **no API key is
baked into the shipped source**.

The live GraphQL endpoint is intercepted and aborted, so the suite never
touches production and needs no API key or network access. External-font
requests are expected to fail when offline and are reported as warnings only.

## Running

```bash
# one-time (or have Playwright installed globally)
npm install --no-save playwright

node tests/landing-pages.qa.mjs
```

Exit code is non-zero if any hard check fails, so it works in CI.

Screenshots (desktop + mobile per page) are written to your temp dir by
default; override with `QA_SHOTS_DIR=./shots node tests/landing-pages.qa.mjs`.

## Known failing check

`No hardcoded API key in source` fails until the default AgenciesHQ API key is
removed from the pages' default config. See the project notes for remediation.
