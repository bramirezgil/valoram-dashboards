# Valoram Agent Funnels — Session Handoff

Pick-up doc for the next session. Covers what's built, where it lives, the standard, GHL details, and what's left.

## Project
50-agent two-page funnel system for Valoram Solutions financial advisors. Each agent = **Landing page** (survey/"scorecard" opt-in) → **Results page** (scored tiers + booking calendar).
- Repo: `bramirezgil/valoram-dashboards` · branch `claude/charming-cannon-3hxddv` · generator dir `landing-generator/`.

## Where files live
- **Agent landing/results pages = standalone HTML in `C:\Users\TheMe\Downloads`** (NOT in the repo). Naming: `<slug>.html` + `<slug>results.html`. Some older agents have ` (N)` copies — **newest mtime wins** (e.g. `jillteachers (4).html`).
- **Repo `landing-generator/`** holds: survey build docs, calendar configs (`clients/*.json`), playbook docs, the generator (`generate.js`, `ghl-calendars.js`).

## Agents built so far (38)

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
| Gary Guan | `garyguan.html` | `garyguanresults.html` | First-Gen Tech Wealth Scorecard | Discovery Call | gary-guan-consult | live§ |
| Futaba Takashima | `futabatakashima.html` | `futabatakashimaresults.html` | Retirement Paycheck Snapshot | Retirement Strategy Call | futaba-takashima | live |
| Harley Palaganas | `harleypalaganas.html` | `harleypalaganasresults.html` | Retirement Paycheck Snapshot | Retirement Confidence Review | harley-palaganas | live† |
| Sharon Webster | `sharonwebster.html` | `sharonwebsterresults.html` | Financial Certainty Snapshot | Legacy Blueprint Consultation | sharon-webster | live† |
| Donnis Hiskett | `donnis-hiskett.html` | `donnis-hiskettresults.html` | Retirement Lever Readiness Scorecard | Benefits Strategy Session | donnis-hiskett | live‡ |
| Cindy Johnson | `cindy-johnson.html` | `cindy-johnsonresults.html` | Retirement Paycheck Snapshot | (snapshot call) | cindy-johnson-consult | live‡ |
| Dawn Szugyi | `dawn-szugyi.html` | `dawn-szugyiresults.html` | Retirement Paycheck Snapshot | Faith-First Certainty Call | dawn-szugyi | live‡ |
| Dial Dace | `dial-dace.html` | `dial-daceresults.html` | Retirement Lever Readiness Scorecard | Clarity Call | dial-dace | live‡ |
| Ejay Cruz | `ejay-cruz.html` | `ejay-cruzresults.html` | Retirement Paycheck Snapshot | KP Clarity Call | ejay-cruz | live‡ |
| Brenen Riggs | `brenen-riggs.html` | `brenen-riggsresults.html` | Wheel-Down Retirement Scorecard | Discovery Call | brenen-riggs | live¶ |
| Isaiah Ellison | `isaiah-ellison.html` | `isaiah-ellisonresults.html` | Retirement Lever Readiness Scorecard | Discovery Call | isaiah-ellison | **not provisioned**◇ |
| Gley Cisneros | `gley-cisneros.html` | `gley-cisnerosresults.html` | Retirement Paycheck Snapshot | Retirement Clarity Session | gley-cisneros | live◇ |
| Galia Alonso | `galia-alonso.html` | `galia-alonsoresults.html` | Retirement Paycheck Snapshot | Discovery Call | galia-alonso | live◇ |
| Elmer Manuel | `elmer-manuel.html` | `elmer-manuelresults.html` | Retirement Paycheck Snapshot | Discovery Call | elmer-manuel | live◇ |
| Elia Juarez | `elia-juarez.html` | `elia-juarezresults.html` | Retirement Paycheck Snapshot | Discovery Call | elia-juarez | live◇ |
| Josephine Antonio | `josephine-antonio.html` | `josephine-antonioresults.html` | Retirement Paycheck Snapshot | Discovery Call | josephine-antonio | live◆4 |
| Jon Mall | `jon-mall.html` | `jon-mallresults.html` | Retirement Paycheck Snapshot | Financial Certainty Review | jon-mall | live◆4 |
| Jay Smull | `jay-smull.html` | `jay-smullresults.html` | West Texas Tax Savings Scorecard | Tax Cut Clarity Call | jay-smull | live◆4 |
| Jasmine Goodridge | `jasmine-goodridge.html` | `jasmine-goodridgeresults.html` | Retirement Lever Readiness Scorecard | Discovery Call | jasmine-goodridge | live◆4 |
| Raj Sekhawat | `raj-sekhawat.html` | `raj-sekhawatresults.html` | Retirement Paycheck Snapshot | Tax Certainty Mapping Call | raj-sekhawat | live★ |
| Mich Tinsay | `mich-tinsay.html` | `mich-tinsayresults.html` | Retirement Paycheck Snapshot | On-Purpose Retirement Clarity Call | mich-tinsay | live★ |
| Maricarmen Munoz | `maricarmen-munoz.html` | `maricarmen-munozresults.html` | Retirement Paycheck Snapshot | Financial Certainty Review | maricarmen-munoz | live★ |
| Leslie Dowtin | `leslie-dowtin.html` | `leslie-dowtinresults.html` | Retirement Paycheck Snapshot | Clarity Call | leslie-dowtin | live★ |
| Jennifer Battad | `jennifer-battad.html` | `jennifer-battadresults.html` | Protection Gap Scorecard | Discovery Call | jennifer-battad | live★ |
| Vanessa Lucero | `vanessa-lucero.html` | `vanessa-luceroresults.html` | Retirement Paycheck Snapshot | Fresh-Start Clarity Call | vanessa-lucero | **not provisioned**☆ |
| Susan Fran | `susan-fran.html` | `susan-franresults.html` | Retirement Paycheck Snapshot | Discovery Call | susan-fran | live☆ |
| Sonja Huff | `sonja-huff.html` | `sonja-huffresults.html` | Retirement Paycheck Snapshot | Legacy Clarity Call | sonja-huff | live☆ |
| Segg Tan | `segg-tan.html` | `segg-tanresults.html` | Retirement Paycheck Snapshot | Discovery Call | segg-tan | **not provisioned**☆ |
| Sana Lopes | `sana-lopes.html` | `sana-lopesresults.html` | Retirement Paycheck Snapshot | Discovery Call | sana-lopes | live☆ |

\* Theresa's calendar is now assigned to **her own user** — `ty0aUHS0BK52SUJ5YWR7` (Theresa Sulit, Theresasulitcrm1@gmail.com), reassigned 2026-06-26 (was on default user Bryan). NOTE: her account is **agency-level** — it does NOT appear in the location `/users/?locationId=` list; fetch it directly via `/users/ty0aUHS0BK52SUJ5YWR7`. Survey built + embedded (id `tc2lbJI2cKbj5PdsHEfv`).
† Harley & Sharon (built 2026-06-25) — pages done to standard; **calendars provisioned + live** (round-robin, `isActive`). GHL user ids: Harley `w9oEXB69Hj2T56uY1MWA` (cal `J3Ibu4aE0T3G2KM6lCu6`), Sharon `J391xYDlLfQJynS0Brba` (cal `HdXumEf3oawgy2xmGm72`). Clean `harley-palaganas` / `sharon-webster` slugs (no `-consult` collision). **Still pending:** build the 2 surveys (`GHL-SURVEYS-TO-BUILD-3.md`), headshots, host. *(Note: the GHL booking-widget URL returns 404 to plain `curl` — that's expected even for live calendars; it only renders in an iframe/browser.)*

◆4 Batch 6 — Josephine / Jon / Jay / Jasmine (built 2026-06-29, parallel build agents; full QA passed). **Calendars provisioned + live**: Josephine `DhNRVzwvEiuagCmid2Bk` (user `azdknZ7jhrHpXR124VwX`), Jon `eoM6bFY7ErZhlYEvHmVj` (`TttczMtWdbvPmT7XW7ra`), Jay `aLelv3Cg3VRimq0DvjUe` (`n7QRpporu1ylmQeR1I0R`), Jasmine `CZPpadxzlyPMu7QQnL1p` (`PllGaCTsqn0FyLkgtydM`). **NAME NOTE: page/slug use "Jasmine Goodridge" (per her docx) but her GHL user is "Jasmine Goodrich"** — same person/ID; confirm preferred spelling. Surveys in `GHL-SURVEYS-TO-BUILD-6.md` (7 Q, max 295). Headshots pending. **Joey Nava NOT built** — his doc is a strength/movement-coaching offer ("Movement Paycheck"), not financial; flagged with user for direction before building.

☆ Batch 8 — Vanessa / Susan / Sonja / Segg / Sana (built 2026-06-29, parallel agents; QA passed). **Calendars provisioned + live for 3:** Susan `qCviT5G8WZnGeWQpKiaK` (`2X4u9tZ216dMqM5W9EjS`), Sonja `vIKWockiNEMATMQ5WelM` (`ZakrtIRo8ovdcULxJFi4`), Sana `M9TW4daY3gZ2wGDuTHSf` (`r6Y5sybuVl4jYIwvp5eU`). **Vanessa Lucero & Segg Tan NOT provisioned** — not in the location `/users/` list (agency-level/new); their configs have `REPLACE_WITH_GHL_USER_ID` — get ids, then provision. **Susan Fran magnet note:** her brief's free-gift said "RMD Tax Shock Scorecard" (a wrong leftover — RMD is a retiree concept); built as **Retirement Paycheck Snapshot** instead. Surveys in `GHL-SURVEYS-TO-BUILD-8.md` (7 Q, max 295). Headshots pending.

★ Batch 7 — Raj / Mich / Maricarmen / Leslie / Jennifer (built 2026-06-29, parallel agents; QA passed). **Calendars provisioned + live:** Raj `dVpIcjaGoCIBE1S6j1iC` (`yk7D7RW1gzcTQKjcwU5J`), Mich `gT9wzGHvR1k6kdyVOX0c` (`ltzhuyhSIrdh73g22INX`), Maricarmen `hfmMuz5IrawFLU5gphW1`, Leslie `4PLb4QQw9hDIvDXl1k5Q` (`BEr3I30DFBq74gjDEpST`), Jennifer `wAeLWOAVK896lQ12oMyX` (`baIocvW0kIBn4kIM60nB`). **Maricarmen — two "Munoz" GHL users:** used `i5gMSFRq80ZraEx1mg9a` (Mary Carmen Munoz, mcmunoz@valoramsolutions.com); other is `o5HgIkwSAEVY8ArzXIZV` (mcmunozcrm@gmail.com) — confirm. **Mich's** brief left the gift title blank → defaulted magnet to Retirement Paycheck Snapshot. Surveys in `GHL-SURVEYS-TO-BUILD-7.md` (7 Q, max 295). Headshots pending.

◇ Batch 5 — Isaiah / Gley / Galia / Elmer / Elia (built 2026-06-29, parallel build agents from Harley skeleton; full QA passed incl. footer-name fix on Elia). **Calendars provisioned + live** for 4: Gley `qtOUmhjtAozodWs1aFeW` (user `UOBXj5YZMUmlFFkBwptP`), Galia `VYodCk6wa6tyBMqSi9p6` (`76AnNMSOjlV5URKO7WRL`), Elmer `IbTxOcwXemCGd5fijmLJ` (`zYEag7CspMNb6vbijIpt`), Elia `LN7UrkSaqAtKCsqQGIWT` (`GXvI2aHLDCVjpxLprf9V`). **Isaiah Ellison NOT provisioned** — he's not in the location `/users/` list (agency-level like Theresa); his `clients/isaiah-ellison.json` has `ghlUserId: REPLACE_WITH_GHL_USER_ID` — get his id, then `node ghl-calendars.js --client isaiah-ellison.json --commit --write-config`. Surveys for all 5 in `GHL-SURVEYS-TO-BUILD-5.md` (each 7 Q, max 295). Headshots pending for all 5.

¶ Brenen Riggs — built 2026-06-26 (CDL-A owner-operator/trucker niche). Pages done to standard + emotional; calendar provisioned + live (round-robin, cal `bfnabqlHBXAXJyWlOmou`, clean `brenen-riggs` slug). GHL user `FuA2TOlUwfLKFmOor8K0` (briggs@valoramsolutions.com) — **NOTE two "Bren(n)en Riggs" users exist** (also `1ObRDyZv9l9HsZrx6i77` brenenriggscrm@gmail.com); used the @valoramsolutions.com one — confirm. Survey `GHL-SURVEY-BRENEN-RIGGS.md` (7 Q, max 295) — build + embed in GHL. Opt-in is the dashed placeholder; headshot pending.

§ Gary Guan — **niche pivot 2026-06-26** (decided post-IDTP call). Repositioned from RMD/Roth retirees to **First-Gen Tech Wealth** (first-gen Bay Area tech pros — RSUs/equity comp, high W-2 + CA taxes). Both pages rewritten in place (lead magnet now **First-Gen Tech Wealth Scorecard**; booking = Discovery Call; calendar slug `gary-guan-consult` unchanged + still live). New positioning saved at `Downloads/_agent-briefs/gary-guan-v2.txt`; new survey at `GHL-SURVEY-GARY-GUAN-V2.md` (7 Q, max 295) — **build it in GHL, embed it, and archive the old RMD survey `Y69UKF86bRiCMBZOQxZq`**.

‡ Batch 4 — Donnis / Cindy / Dawn / Dial / Ejay (built 2026-06-26, via parallel build agents from the Harley skeleton; full QA passed: logo md5-identical, raw-based tiers, no name-bleed, bios use "financial strategist with Valoram Solutions"). **Calendars provisioned + live** (round-robin). GHL user ids → cal ids: Donnis `1zOZmwPQpsZ9dU0YE9DA`→`Qhxs5wE9YkkBzMNEw1Ks`; Cindy `TCo08x7Ov3YwoTrGHmEx`→`2DxV9gkxtMlzZTwZiDmY`; Dawn `WStZUp1iP3p5LTIqnBvt`→`bobnXZQRs5k3RfUA7psq`; Dial `0GD38bvuQbNEJqbC1bgg`→`HnXJKMJ2NQe3xce9zqRX`; Ejay `ASZIYwpFYfIPwakf3tZC`→`cpoPHKmzMRYhonWSSrq5`. **Cindy needed a `-consult` slug** (`cindy-johnson` was reserved by her personal calendar, like Tim/Gary) — her results-page iframe uses `cindy-johnson-consult`. **Dawn has two GHL users** (`DawnSzugcrm@gmail.com` and `dszugyi@valoramsolutions.com`) — used the `@valoramsolutions.com` one (`WStZUp1iP3p5LTIqnBvt`); confirm that's correct. Surveys for all 5 in `GHL-SURVEYS-TO-BUILD-4.md` (each 7 Q, max 295). **Still pending:** build the 5 surveys, headshots, host.

## The standard / playbook (also in memory: `valoram-funnel-page-standard`)
- **Branding:** Valoram orange **`#FF7428`** + near-black **`#0B0D0D`**, white/slate neutrals. Logo from `landing-generator/assets/valoram-logo-datauri.txt` → header + **white-chip footer**. (Exception: **Dianne** still uses the alt orange `#F8964C`/`#101820` — on-brand, optionally migrate.)
- **CTA** = each agent's own lead-magnet name. **Survey-first** "How It Works." **Bios** = "a financial strategist with Valoram Solutions" (never "founder").
- **Results pages:** read `?score=` (GHL sends the **raw 0–295** total). The score **ring still displays the normalized `raw/295*100` value out of 100**, but **tier selection keys off the raw score directly**: **0–116 Strong Foundation / 117–205 Gaps to Close / 206–295 Action Needed Now** (matches `GHL-SURVEY-BUILD.md`). Missing/NaN `score` → Strong Foundation. Booking calendar embedded.
- Page section order: hero → problem(3) → results+stats → distinction(vs) → audience(4)+not-for → 7-step system → survey-first How-It-Works(4) → opt-in(survey embed) → bio → testimonials(3) → FAQ(5) → final CTA → footer.

## GHL
- Location `NPH9fcfnGaTAH4Xqh2dM`; white-label `login.valoramsolutions.com` (logged in as Bryan Ramirez).
- **Token rotation:** the Private Integration Token used this session was exposed in chat — rotate it (GHL → Settings → Private Integrations). See memory `valoram-ghl-token`.
- **Calendars** provisioned via `ghl-calendars.js` (`npm run provision` / `provision:commit`) using `clients/<slug>.json` with `business.ghlUserId`. Slug collisions: GHL reserves an agent's name for their personal calendar → Tim & Gary needed a `-consult` slug.
- **GHL API CANNOT create surveys** (`POST /surveys/` → 401). Build surveys in the UI from the build docs.
- Survey build docs: `GHL-SURVEYS-TO-BUILD.md` (Jill/Danna/Dianne/Tim/Victor), `GHL-SURVEYS-TO-BUILD-2.md` (Lisa/Joshua/Gregory/Gary/Futaba), `GHL-SURVEYS-TO-BUILD-3.md` (Harley/Sharon), `GHL-SURVEYS-TO-BUILD-4.md` (Donnis/Cindy/Dawn/Dial/Ejay). Each survey = 7 questions, 4 single-select scored answers, **max 295**.

## Outstanding tasks
1. **Surveys: built in GHL + embedded for 17 of 18 agents** (2026-06-26) — each landing page has its agent's survey iframe + `form_embed.js` (verified ID-matched). **EXCEPTION: Gary Guan** — his page was pivoted to a new niche (see §), so his old RMD survey was removed and his opt-in is back to the dashed placeholder; a NEW survey (`GHL-SURVEY-GARY-GUAN-V2.md`) must be built in GHL + embedded, and the **old RMD survey `Y69UKF86bRiCMBZOQxZq` should be archived/deleted**. **Remaining for all:** set each survey's On-Submit **redirect** to `<results-page>?score={{contact.score}}` (GHL UI; raw 0–295 total). To re-map a survey id → agent, list `GET /surveys/?locationId=…&limit=50&skip=…` (survey names are the agent names).
2. **Headshots:** replace the placeholder box in each bio with the agent's hosted image URL (Jill's `…/699cf342…svg` is the worked example).
3. **Host the pages** + finalize the redirect domain.
4. ~~**Theresa:** reassign her calendar to her own login.~~ ✅ Done 2026-06-26 (user `ty0aUHS0BK52SUJ5YWR7`).
5. ~~**Add bios to Danna & Dianne**~~ ✅ Done 2026-06-26 — added "Your Specialist" bio sections (inline-styled, self-contained, since these legacy pages lack the `.bio` CSS) between opt-in and FAQ, enriched from their docx briefs (federal/military + 2025 early-retirement story for Danna; 30+ yrs owner-operator + Value Builder System for Dianne). "Financial strategist with Valoram Solutions," she/her, no fabricated facts. Headshot placeholders pending (task 2). *Optional:* migrate Dianne to `#FF7428`/`#0B0D0D`.
6. **Commit** uncommitted repo files (calendar configs `clients/*.json` + `GHL-SURVEYS-TO-BUILD-2.md` + this handoff).

## Changes — 2026-06-25 (QA pass + raw-based tiers)
- **QA pass on all 11 agents (22 pages).** Verified clean: scoring math (`raw/295*100`, clamp), calendar slugs (all correct incl. `-consult` + `theresa-guevarra`), no cross-agent name-bleed, lead-magnet name present per page, header+white-chip-footer logo on every page, no stray `{{ }}` tokens. "founder" only appears as the legit "Founders & CEOs" audience phrase (except the Gregory bio, fixed below).
- **Fixed Gregory's bio** — removed fabricated credentials *"the author of Indexed Annuity Secrets and founder of Annuity University"* (violated the "financial strategist with Valoram Solutions / never founder" standard; compliance risk). Re-add with proper wording **only if those credentials are real**. File: `gregorystevenson.html`.
- **Found: Danna & Dianne lack a bio section** → now Outstanding task 5.
- **Tier logic → raw-based** on all 11 results pages. Ring still shows the 0–100 value; tiers now select on raw thresholds **≤116 / 117–205 / ≥206**. Template B (9 pages) = `raw>=206/117` ternaries; Template A (Jill, Danna) = raw `data-min/max` bands + new `sval` (clamped raw) comparison. Verified boundary-exact vs the build doc; NaN→Strong Foundation.
- **Built 2 new agents — Harley Palaganas & Sharon Webster** (from their Phase-1/2 briefs). Each: landing + results page in `Downloads` (Futaba "Template B" scaffold, standard `#FF7428`/`#0B0D0D`, raw-based tiers, real 410×80 logo), `clients/*.json` calendar config (ghlUserId placeholder), and survey spec in `GHL-SURVEYS-TO-BUILD-3.md`. Bios adapted to the "financial strategist with Valoram Solutions" standard (briefs said "founder" — not used). Agent brief colors (Harley navy, Sharon purple) intentionally overridden with the Valoram standard for brand consistency. **Pending:** provision calendars (need real ghlUserIds), build the 2 surveys, headshots, host.

## Gotchas
- **Stale preview:** logos/calendars/surveys are injected with a Python script (via Bash), which does **not** refresh the Launch preview panel — the files are correct on disk; reopen the file (or make any Edit-tool change) to refresh.
- Decode-check a page's logo if it looks missing: it's a valid 410×80 PNG identical across all pages.
