# GHL Surveys to Build — Valoram Agent Scorecards

Hand-off sheet for building five agent surveys in GoHighLevel (**Sites → Surveys**).
Theresa's is already built, so she's not included here.

---

## How to build each one (same for all five)

1. **Create the survey** with the **7 questions** listed for that agent.
2. Each question is **single-select (one answer / radio buttons)**.
3. Turn **Scoring ON** and set each answer's **points** to the number shown in `( )`.
4. Add the standard contact fields (First name, Last name, Email, Phone) on the first slide.
5. **Publish**, then set the **completion redirect** (below) so the score carries to the results page.
6. Send the published survey's **inline embed code** back to be placed on the landing page.

### How the score works
- Every answer adds its points. The 7 answers add up to a **total score from 0 to 295**.
- That total decides which result the person sees (the results page does this automatically — you don't build the tiers, just the survey + redirect):

| Total score | % of 295 | Result tier |
|---|---|---|
| 0 – 116 | 0–39% | **Strong Foundation** (optimize) |
| 117 – 205 | 40–69% | **Gaps to Close** (act soon) |
| 206 – 295 | 70–100% | **Action Needed Now** (urgent) |

*(The results page does this math automatically — it converts the 0–295 total to a percentage and picks the tier. You only build the survey + set the redirect.)*

**Worked example (Tim):** a respondent answers Q1 $200k+ (45) · Q2 CPA just files (35) · Q3 not sure (35) · Q4 mostly, a few gaps (15) · Q5 basic contributions (20) · Q6 real strain (35) · Q7 they don't talk (25) → **45+35+35+15+20+35+25 = 210** → 71% → **Action Needed Now**.

### Completion redirect per agent
Set **On Submit → Redirect URL** to the agent's results page, passing the score:
```
https://YOUR-DOMAIN/<results-page>?score={{contact.score}}
```
(Replace `YOUR-DOMAIN` with the live host once known. The `{{contact.score}}` merge field passes the total automatically.)

---

# 1) JILL ESPINO
- **Survey name:** `Jill Espino — Retirement Readiness Scorecard`
- **Results page:** `jillteachers-results` (or `jillteachersresults.html`)

**Q1. How many years until your planned retirement from teaching?**
- 15+ years `(10)`
- 8–15 years `(25)`
- 3–7 years `(35)`
- Under 3 years `(45)`

**Q2. How would you describe your current retirement income plan?**
- A clear written plan with a tax-smart income strategy `(5)`
- A general idea but nothing written down `(20)`
- I'm mostly counting on TRS and hoping it works out `(35)`
- I honestly don't know where I stand `(45)`

**Q3. Have you calculated what your TRS check will actually replace vs. your current take-home pay?**
- Yes — I know my exact monthly gap `(5)`
- I've done a rough estimate `(15)`
- Not yet, but I've been meaning to `(30)`
- No — and honestly I've been avoiding it `(45)`

**Q4. How much do you have saved across your 403(b), 457, IRA, and other accounts?**
- $600,000 or more `(5)`
- $300,000–$600,000 `(15)`
- $150,000–$300,000 `(25)`
- Under $150,000 `(35)`

**Q5. How worried are you about a market drop in the 5–10 years before or after you retire?**
- Not worried — I have a plan that doesn't depend on the market `(5)`
- Somewhat worried `(20)`
- Very worried — it's a real concern `(35)`
- It keeps me up at night thinking about bad timing `(45)`

**Q6. Do you have a tax strategy for your retirement income beyond TRS?**
- Yes — I work with someone on tax-smart income strategies `(5)`
- I know strategies exist but haven't set one up `(20)`
- I haven't thought much about taxes in retirement `(35)`
- Taxes in retirement are my biggest financial fear `(45)`

**Q7. Are your beneficiaries, estate documents, and legacy plan current and organized?**
- Yes — everything is up to date and organized `(5)`
- Some things are in order but not everything `(15)`
- It's on my list but I haven't gotten to it `(25)`
- This is a real blind spot — nothing is organized `(35)`

---

# 2) DANNA WATKINS
- **Survey name:** `Danna Watkins — Retirement Readiness Snapshot`
- **Results page:** `dannawatkins-results` (or `dannawatkinsresults.html`)

**Q1. How many years until your planned retirement from federal or military service?**
- 15+ years `(10)`
- 8–15 years `(25)`
- 3–7 years `(35)`
- Under 3 years `(45)`

**Q2. How would you describe your current retirement income plan?**
- A clear written plan with a tax-smart income strategy `(5)`
- A general idea but nothing written down `(20)`
- I'm mostly counting on my FERS pension and TSP and hoping it works out `(35)`
- I honestly don't know where I stand `(45)`

**Q3. Have you calculated what your FERS pension and Social Security will actually replace vs. your current take-home pay?**
- Yes — I know my exact monthly gap `(5)`
- I've done a rough estimate `(15)`
- Not yet, but I've been meaning to `(30)`
- No — and honestly I've been avoiding it `(45)`

**Q4. How much do you have saved across your TSP, IRA, and other accounts?**
- $600,000 or more `(5)`
- $300,000–$600,000 `(15)`
- $150,000–$300,000 `(25)`
- Under $150,000 `(35)`

**Q5. How worried are you about a market drop in the 5–10 years before or after you retire?**
- Not worried — I have a plan that doesn't depend on the market `(5)`
- Somewhat worried `(20)`
- Very worried — it's a real concern `(35)`
- It keeps me up at night thinking about bad timing `(45)`

**Q6. Do you have a tax strategy for your retirement income beyond your FERS pension and TSP?**
- Yes — I work with someone on tax-smart income strategies `(5)`
- I know strategies exist but haven't set one up `(20)`
- I haven't thought much about taxes in retirement `(35)`
- Taxes in retirement are my biggest financial fear `(45)`

**Q7. Are your beneficiaries, estate documents, and legacy plan current and organized?**
- Yes — everything is up to date and organized `(5)`
- Some things are in order but not everything `(15)`
- It's on my list but I haven't gotten to it `(25)`
- This is a real blind spot — nothing is organized `(35)`

---

# 3) DIANNE KELLEY
- **Survey name:** `Dianne Kelley — Business Value Scorecard`
- **Results page:** `dianne-kelley-results` (or `diannekelleyresults.html`)

**Q1. How soon do you plan to sell or transition out of your business?**
- 5+ years away `(10)`
- 3–5 years `(25)`
- 1–3 years `(35)`
- Under 12 months `(45)`

**Q2. How would you describe your current exit plan?**
- A written, tax-smart plan with someone quarterbacking it `(5)`
- A general idea but nothing written down `(20)`
- I plan to sell when the time feels right `(35)`
- No real exit plan yet `(45)`

**Q3. Do you know what your business is actually worth — and what you'd net after taxes and fees?**
- Yes — a defendable valuation range and my real after-tax net `(5)`
- I've done a rough estimate `(15)`
- Not yet, but I plan to `(30)`
- No — I really have no idea `(45)`

**Q4. If you went to market tomorrow, how buyer-ready is your business (financials, owner dependency, customer concentration)?**
- Diligence-ready — clean financials, runs without me `(5)`
- Mostly ready, a few items to tidy up `(15)`
- Some real gaps to close `(25)`
- Heavily dependent on me day to day `(35)`

**Q5. How much of your net worth is tied up in the business?**
- Under 30% `(5)`
- 30–50% `(20)`
- 50–70% `(35)`
- 70% or more `(45)`

**Q6. Do you have a tax strategy for the proceeds when you sell?**
- Yes — I work with a pro on deal-and-tax structure `(5)`
- I know strategies exist but haven't set one up `(20)`
- I haven't thought much about taxes on the sale `(35)`
- Taxes on the sale are my biggest worry `(45)`

**Q7. Are succession, estate, and family-fairness plans documented and current?**
- Yes — everything is organized and current `(5)`
- Some things are in order but not everything `(15)`
- It's on my list but I haven't gotten to it `(25)`
- This is a real blind spot — nothing is organized `(35)`

---

# 4) TIM THOMAS
- **Survey name:** `Tim Thomas — Protection Gap Scorecard`
- **Results page:** `timthomasresults.html`

**Q1. What's your annual combined federal + state tax bill?**
- Under $50k `(10)`
- $50k–$100k `(25)`
- $100k–$200k `(35)`
- $200k or more `(45)`

**Q2. How would you describe your current tax strategy?**
- A proactive, written plan with a tax specialist `(5)`
- A general idea with a few moves in place `(20)`
- My CPA mostly just files the return `(35)`
- No real strategy — I pay what I'm told `(45)`

**Q3. Is your entity structure and owner-pay setup optimized for your income and state?**
- Yes — recently reviewed by a specialist `(5)`
- Set up years ago, not revisited `(20)`
- Not sure / probably not `(35)`
- Still a sole prop or default setup `(45)`

**Q4. How confident are you that you capture every deduction — and could defend it?**
- Very — clean, documented, audit-ready `(5)`
- Mostly — a few gaps `(15)`
- Not confident — tracking is messy `(25)`
- No real system — it worries me `(35)`

**Q5. Are you using retirement plans as a real tax-reduction tool?**
- Yes — optimized (401(k)/profit share/cash balance) `(5)`
- Basic contributions only `(20)`
- Been meaning to set one up `(35)`
- Not using them for taxes at all `(45)`

**Q6. When tax payments hit, how much does cash flow stress you (with reimbursement delays)?**
- Not at all — timing is planned around cash flow `(5)`
- Somewhat `(20)`
- It's a real strain `(35)`
- Big checks blindside me / I scramble `(45)`

**Q7. How coordinated are your CPA, payroll, and financial advisor?**
- Fully coordinated, reviewed regularly `(5)`
- Loosely connected `(15)`
- They don't talk to each other `(25)`
- I'm the one connecting everything `(35)`

---

# 5) VICTOR ANI
- **Survey name:** `Victor Ani — Stewardship Readiness (Retirement Decision Timeline)`
- **Results page:** `victoraniresults.html`

**Q1. How long until retirement (or are you newly retired)?**
- 15+ years `(10)`
- 8–15 years `(25)`
- 3–7 years `(35)`
- Under 3 years / newly retired `(45)`

**Q2. Do you have a single, written, coordinated financial roadmap?**
- Yes — one coordinated written plan `(5)`
- A general idea `(20)`
- Pieces from different pros, not unified `(35)`
- No — it's scattered `(45)`

**Q3. How coordinated are your CPA, attorney, and advisor?**
- Fully — one person keeps it aligned `(5)`
- Loosely connected `(20)`
- They don't talk to each other `(35)`
- I'm connecting all the dots myself `(45)`

**Q4. Are your beneficiaries, titling, trust, and POA current and aligned?**
- Yes — reviewed and aligned `(5)`
- Mostly `(15)`
- Not sure / outdated `(25)`
- Missing a trust or POA `(35)`

**Q5. Is your retirement income plan stress-tested for market drops, inflation, and healthcare?**
- Yes — durable with guardrails `(5)`
- Somewhat `(20)`
- Not really `(35)`
- No — I'm worried it won't last `(45)`

**Q6. Do you have a proactive tax plan (brackets, Roth, RMDs, charitable giving)?**
- Yes — coordinated with a CPA `(5)`
- A few moves `(20)`
- Reactive — we just file `(35)`
- None — I suspect we overpay `(45)`

**Q7. Is your giving and legacy structured to match your faith and values?**
- Yes — documented and intentional `(5)`
- Partly `(15)`
- On my list `(25)`
- Not addressed yet `(35)`

---

*Every survey totals 0–295 points (five questions max out at 45, two at 35). Same scale for all five, so the same tier table above applies to each.*
