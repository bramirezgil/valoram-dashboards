# GHL Survey Build Runbook — Jill, Danna, Dianne

Turnkey steps to build the three scored surveys in GoHighLevel. The GHL **API
cannot create surveys** (`POST /surveys/` → `401 "route not yet supported by the
IAM Service"`), so surveys are built in the UI. This runbook uses **Duplicate**
so you inherit a working contact slide + scoring setup instead of building from
scratch.

Location: `NPH9fcfnGaTAH4Xqh2dM` · Sites → Surveys

---

## Method (do this once per agent — ~10 min each)

1. **Sites → Surveys**, click the ⋮ on any existing **Scorecard** → **Duplicate**.
   (They already have the contact slide + per-answer scoring enabled.)
2. Rename the copy (pencil by the title) to the **Survey name** below.
3. Open each question slide and overwrite the question text + the 4 answer
   options with the table below. Keep them **single-select (radio)**.
4. For each answer, set its **score** to the point value shown (Survey builder →
   question → enable *Scoring* → per-option points). Max possible = **295**.
5. **Settings → On submit / Redirect:** set the URL below (uses the live merge
   field `{{contact.score}}`).
6. **Save → Publish.** Then **Integrate → copy the inline embed code.**
7. Paste that embed into the agent's config (`clients/<slug>.json`) at
   `lead.ghlFormEmbed`, then rebuild: `node generate.js clients/<slug>.json`.

> **Redirect domain still needed:** replace `YOUR-DOMAIN` with the live host of
> the results pages (a GHL funnel/website page, or wherever `*-results.html` is
> published). Until that's known, leave the redirect pointing at the intended
> path and fix the host later.

Score tiers (results page normalizes 295→0–100): 0–39% Strong Foundation ·
40–69% Gaps to Close · 70–100% Action Needed Now.

---

## 1) Jill Espino — Texas Public School Educators

- **Survey name:** `Jill Espino — Financial Certainty (TRS)`
- **Redirect:** `https://YOUR-DOMAIN/jill-teachers-results.html?score={{contact.score}}`

| Q | Question | Answers (points) |
|---|----------|------------------|
| 1 | How many years until your planned retirement from teaching? | 15+ years (10) · 8–15 years (25) · 3–7 years (35) · Under 3 years (45) |
| 2 | How would you describe your current retirement income plan? | Clear written plan w/ tax-smart strategy (5) · General idea, nothing written (20) · Counting on TRS and hoping (35) · Don't know where I stand (45) |
| 3 | Have you calculated what your TRS check will actually replace vs. your current take-home pay? | Know exact monthly gap (5) · Rough estimate (15) · Not yet, meaning to (30) · No, avoiding it (45) |
| 4 | How much do you have saved across your 403(b), 457, IRA, and other accounts? | $600k+ (5) · $300k–$600k (15) · $150k–$300k (25) · Under $150k (35) |
| 5 | How worried are you about a market drop in the 5–10 years before or after you retire? | Not worried, plan independent of market (5) · Somewhat worried (20) · Very worried (35) · Keeps me up at night (45) |
| 6 | Do you have a tax strategy for your retirement income beyond TRS? | Yes, work with someone (5) · Know strategies, haven't set up (20) · Haven't thought about taxes (35) · Taxes are my biggest fear (45) |
| 7 | Are your beneficiaries, estate documents, and legacy plan current and organized? | Up to date and organized (5) · Some in order (15) · On my list, not done (25) · Real blind spot (35) |

---

## 2) Danna Watkins — Senior Federal Employees & Separating Military

- **Survey name:** `Danna Watkins — Retirement Readiness (FERS/TSP)`
- **Redirect:** `https://YOUR-DOMAIN/danna-watkins-results.html?score={{contact.score}}`

| Q | Question | Answers (points) |
|---|----------|------------------|
| 1 | How many years until your planned retirement from federal or military service? | 15+ years (10) · 8–15 years (25) · 3–7 years (35) · Under 3 years (45) |
| 2 | How would you describe your current retirement income plan? | Clear written plan w/ tax-smart strategy (5) · General idea, nothing written (20) · Counting on FERS pension & TSP and hoping (35) · Don't know where I stand (45) |
| 3 | Have you calculated what your FERS pension and Social Security will actually replace vs. your current take-home pay? | Know exact monthly gap (5) · Rough estimate (15) · Not yet, meaning to (30) · No, avoiding it (45) |
| 4 | How much do you have saved across your TSP, IRA, and other accounts? | $600k+ (5) · $300k–$600k (15) · $150k–$300k (25) · Under $150k (35) |
| 5 | How worried are you about a market drop in the 5–10 years before or after you retire? | Not worried, plan independent of market (5) · Somewhat worried (20) · Very worried (35) · Keeps me up at night (45) |
| 6 | Do you have a tax strategy for your retirement income beyond your FERS pension and TSP? | Yes, work with someone (5) · Know strategies, haven't set up (20) · Haven't thought about taxes (35) · Taxes are my biggest fear (45) |
| 7 | Are your beneficiaries, estate documents, and legacy plan current and organized? | Up to date and organized (5) · Some in order (15) · On my list, not done (25) · Real blind spot (35) |

---

## 3) Dianne Kelley — Established Business Owners ($3M–$10M)

- **Survey name:** `Dianne Kelley — Tax-Smart Exit (Business)`
- **Redirect:** `https://YOUR-DOMAIN/dianne-kelley-results.html?score={{contact.score}}`

| Q | Question | Answers (points) |
|---|----------|------------------|
| 1 | How soon do you plan to sell or transition out of your business? | 5+ years away (10) · 3–5 years (25) · 1–3 years (35) · Under 12 months (45) |
| 2 | How would you describe your current exit plan? | Written, tax-smart plan w/ quarterback (5) · General idea, nothing written (20) · Sell when time feels right (35) · No real exit plan (45) |
| 3 | Do you know what your business is actually worth — and what you'd net after taxes and fees? | Defendable range + after-tax net (5) · Rough estimate (15) · Not yet, plan to (30) · No idea (45) |
| 4 | If you went to market tomorrow, how buyer-ready is your business (financials, owner dependency, customer concentration)? | Diligence-ready, runs without me (5) · Mostly ready, few items (15) · Some real gaps (25) · Heavily dependent on me (35) |
| 5 | How much of your net worth is tied up in the business? | Under 30% (5) · 30–50% (20) · 50–70% (35) · 70%+ (45) |
| 6 | Do you have a tax strategy for the proceeds when you sell? | Yes, work with a pro on deal/tax structure (5) · Know strategies, haven't set up (20) · Haven't thought about taxes on sale (35) · Taxes on sale are my biggest worry (45) |
| 7 | Are succession, estate, and family-fairness plans documented and current? | Organized and current (5) · Some in order (15) · On my list, not done (25) · Real blind spot (35) |

---

*Source of truth: `dist/<slug>-survey-spec.txt` (generated). If wording changes,
regenerate the spec and update this runbook.*
