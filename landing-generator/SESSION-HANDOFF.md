# Valoram Agent Funnels — Session Handoff

Pick-up doc for the next session. Covers what's built, where it lives, the standard, GHL details, and what's left.

## Project
50-agent two-page funnel system for Valoram Solutions financial advisors. Each agent = **Landing page** (survey/"scorecard" opt-in) → **Results page** (scored tiers + booking calendar).
- Repo: `bramirezgil/valoram-dashboards` · branch `claude/charming-cannon-3hxddv` · generator dir `landing-generator/`.

## Where files live
- **Agent landing/results pages = standalone HTML in `C:\Users\TheMe\Downloads`** (NOT in the repo). Naming: `<slug>.html` + `<slug>results.html`. Some older agents have ` (N)` copies — **newest mtime wins** (e.g. `jillteachers (4).html`).
- **Repo `landing-generator/`** holds: survey build docs, calendar configs (`clients/*.json`), playbook docs, the generator (`generate.js`, `ghl-calendars.js`).

## Agents built so far (11)

| Agent | Landing file | Results file | Lead-magnet / CTA | Books a… | Calendar slug | Calendar |
|---|---|---|---|---|---|---|
| Jill Espino | `jillteachers (4).html` | `jillteachersresults (1).html` | Retirement Readiness Scorecard | Financial Certainty Review | jill-teachers | live |
| Danna Watkins | `dannawatkins (3).html` | `dannawatkinsresults.html` | Retirement Readiness Snapshot | (snapshot call) | danna-watkins | live |
| Dianne Kelley | `diannekelley.html` | `diannekelleyresults.html` | Business Value Scorecard | Business Value & Clarity Call | dianne-kelley | live |
| Tim Thomas | `timthomas.html` | `timthomasresults.html` | Protection Gap Scorecard | Tax Strategy Call | tim-thomas-consult | live |
| Theresa Sulit Guevarra | `theresasulitguevarra.html` | `theresasulitguevarraresults.html` | Retirement Paycheck Snapshot | Retirement Clarity Call | theresa-guevarra | live* |
| Victor Ani | `victorani.html` | `victoraniresults.html` | Retirement Decision Timeline | Clarity Call | victor-ani | live |
| Lisa Williams | `lisawilliams.html` | `lisawilliamsresults.html` | IRS Jail Exit Timeline | Wealth & Tax Strategy Call | lisa-williams | live |
| Joshua Mcreary | `joshuamcreary.html` | `joshuamcrearyresults.html` | Retirement Paycheck Snapshot | Financial Certainty Blueprint Call | joshua-mcreary | live |
| Gregory Stevenson | `gregorystevenson.html` | `gregorystevensonresults.html` | IRS Jail Exit Timeline | Retirement Strategy Call | gregory-stevenson | live |
| Gary Guan | `garyguan.html` | `garyguanresults.html` | RMD Tax Shock Scorecard | Roth Conversion Strategy Call | gary-guan-consult | live |
| Futaba Takashima | `futabatakashima.html` | `futabatakashimaresults.html` | Retirement Paycheck Snapshot | Retirement Strategy Call | futaba-takashima | live |

\* Theresa's calendar is on the **default user (Bryan)** — reassign to her when she gets a GHL login. **Theresa's survey is already built + embedded** (GHL survey id `tc2lbJI2cKbj5PdsHEfv`).

## The standard / playbook (also in memory: `valoram-funnel-page-standard`)
- **Branding:** Valoram orange **`#FF7428`** + near-black **`#0B0D0D`**, white/slate neutrals. Logo from `landing-generator/assets/valoram-logo-datauri.txt` → header + **white-chip footer**. (Exception: **Dianne** still uses the alt orange `#F8964C`/`#101820` — on-brand, optionally migrate.)
- **CTA** = each agent's own lead-magnet name. **Survey-first** "How It Works." **Bios** = "a financial strategist with Valoram Solutions" (never "founder").
- **Results pages:** read `?score=` (GHL sends the **raw 0–295** total), normalize `raw/295*100`, tier bands **0–39 Strong Foundation / 40–69 Gaps to Close / 70–100 Action Needed Now**. Booking calendar embedded.
- Page section order: hero → problem(3) → results+stats → distinction(vs) → audience(4)+not-for → 7-step system → survey-first How-It-Works(4) → opt-in(survey embed) → bio → testimonials(3) → FAQ(5) → final CTA → footer.

## GHL
- Location `NPH9fcfnGaTAH4Xqh2dM`; white-label `login.valoramsolutions.com` (logged in as Bryan Ramirez).
- **Token rotation:** the Private Integration Token used this session was exposed in chat — rotate it (GHL → Settings → Private Integrations). See memory `valoram-ghl-token`.
- **Calendars** provisioned via `ghl-calendars.js` (`npm run provision` / `provision:commit`) using `clients/<slug>.json` with `business.ghlUserId`. Slug collisions: GHL reserves an agent's name for their personal calendar → Tim & Gary needed a `-consult` slug.
- **GHL API CANNOT create surveys** (`POST /surveys/` → 401). Build surveys in the UI from the build docs.
- Survey build docs: `GHL-SURVEYS-TO-BUILD.md` (Jill/Danna/Dianne/Tim/Victor), `GHL-SURVEYS-TO-BUILD-2.md` (Lisa/Joshua/Gregory/Gary/Futaba). Each survey = 7 questions, 4 single-select scored answers, **max 295**.

## Outstanding tasks
1. **Build the surveys in GHL** (all except Theresa's) from the build docs → copy each inline embed → paste into the landing-page opt-in placeholder (replaces the dashed "⟶ Your GHL … Survey Embeds Here" box) → set the survey's On-Submit **redirect** to `<results-page>?score={{contact.score}}`.
2. **Headshots:** replace the placeholder box in each bio with the agent's hosted image URL (Jill's `…/699cf342…svg` is the worked example).
3. **Host the pages** + finalize the redirect domain.
4. **Theresa:** reassign her calendar to her own login once created.
5. **Optional:** full line-by-line copy QA across all 11 pages; migrate Dianne to `#FF7428`/`#0B0D0D`.
6. **Commit** uncommitted repo files (calendar configs `clients/*.json` + `GHL-SURVEYS-TO-BUILD-2.md` + this handoff).

## Gotchas
- **Stale preview:** logos/calendars/surveys are injected with a Python script (via Bash), which does **not** refresh the Launch preview panel — the files are correct on disk; reopen the file (or make any Edit-tool change) to refresh.
- Decode-check a page's logo if it looks missing: it's a valid 410×80 PNG identical across all pages.
