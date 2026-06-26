# GHL Surveys to Build — Batch 2 (Lisa · Joshua · Gregory · Gary · Futaba)

Hand-off sheet for building five agent surveys in GoHighLevel (**Sites → Surveys**).

---

## How to build each one (same for all five)

1. **Create the survey** with the **7 questions** listed for that agent.
2. Each question is **single-select (one answer / radio buttons)**.
3. Turn **Scoring ON** and set each answer's **points** to the number in `( )`.
4. Add contact fields (First name, Last name, Email, Phone) on the first slide.
5. **Publish**, then set the **completion redirect** (below) so the score carries to the results page.
6. Send the published survey's **inline embed code** back so it can be placed on the landing page.

### How the score works
- Every answer adds its points. The 7 answers total **0 to 295**.
- The results page converts that to a percentage automatically and picks the tier — you only build the survey + set the redirect:

| Total score | % of 295 | Result tier |
|---|---|---|
| 0 – 116 | 0–39% | **Strong Foundation** (optimize) |
| 117 – 205 | 40–69% | **Gaps to Close** (act soon) |
| 206 – 295 | 70–100% | **Action Needed Now** (urgent) |

### Completion redirect per agent
Set **On Submit → Redirect URL** to the agent's results page, passing the score:
```
https://YOUR-DOMAIN/<results-page>?score={{contact.score}}
```
(Replace `YOUR-DOMAIN` with the live host once known. `{{contact.score}}` passes the total automatically.)

---

# 1) LISA WILLIAMS
- **Survey name:** `Lisa Williams — IRS Jail Scorecard`
- **Results page:** `lisawilliamsresults.html`

**Q1. How much of your net worth is locked in pre-tax retirement accounts and RSUs (hard to access before 59½)?**
- Under 30% `(10)`
- 30–50% `(25)`
- 50–70% `(35)`
- 70% or more `(45)`

**Q2. Do you have a coordinated tax strategy — not just "max the 401(k)"?**
- Yes — a proactive, coordinated plan `(5)`
- A few moves in place `(20)`
- I'm mostly just maxing accounts `(35)`
- No real tax strategy `(45)`

**Q3. How many "tax buckets" do you have (taxable, tax-deferred, tax-free)?**
- All three, fairly balanced `(5)`
- Two of the three `(20)`
- Mostly one bucket `(35)`
- Everything in one bucket `(45)`

**Q4. If your next contract ended tomorrow, how many months of runway do you have without touching retirement accounts?**
- 12+ months `(5)`
- 6–12 months `(15)`
- 3–6 months `(25)`
- Under 3 months / I'd have to tap retirement `(35)`

**Q5. How worried are you about a market drop or bad sequence of returns 3–8 years before retirement?**
- Not worried — my plan is protected `(5)`
- Somewhat worried `(20)`
- Very worried `(35)`
- It keeps me up at night `(45)`

**Q6. Do you have a plan for your RSUs/company stock so one company's swings don't control your retirement date?**
- Yes — a clear exit plan `(5)`
- A rough idea `(20)`
- Holding and hoping `(35)`
- No plan `(45)`

**Q7. Are your family protection (insurance) and legacy/estate documents current?**
- Yes — up to date `(5)`
- Mostly `(15)`
- On my list `(25)`
- This is a blind spot `(35)`

---

# 2) JOSHUA MCREARY
- **Survey name:** `Joshua Mcreary — Retirement Paycheck Snapshot`
- **Results page:** `joshuamcrearyresults.html`

**Q1. How soon do you plan to sell or transition out of your business?**
- 5+ years away `(10)`
- 3–5 years `(25)`
- 1–3 years `(35)`
- Under 12 months `(45)`

**Q2. Do you have ONE coordinated plan across business, taxes, retirement, and estate?**
- Yes — fully coordinated `(5)`
- A general idea `(20)`
- Separate pieces that don't connect `(35)`
- No — it's scattered `(45)`

**Q3. How coordinated are your CPA, attorney, and advisor?**
- Fully — one quarterback keeps it aligned `(5)`
- Loosely connected `(20)`
- They don't talk to each other `(35)`
- I'm the one connecting everything `(45)`

**Q4. How much of your net worth is concentrated in the business and the market?**
- Under 40% `(5)`
- 40–60% `(15)`
- 60–80% `(25)`
- 80% or more `(35)`

**Q5. Does your retirement income depend on the market cooperating and the business selling at the right price?**
- No — it's protected and diversified `(5)`
- Partly `(20)`
- Mostly `(35)`
- Almost entirely `(45)`

**Q6. Is your key-employee retention structured to keep top talent without blowing up cash flow?**
- Yes — retention plans in place `(5)`
- Informal / handshake only `(20)`
- Shaky `(35)`
- No plan — talent is at risk `(45)`

**Q7. Are your estate, beneficiary, and succession documents organized and current?**
- Yes — organized and current `(5)`
- Mostly `(15)`
- On my list `(25)`
- This is a blind spot `(35)`

---

# 3) GREGORY STEVENSON
- **Survey name:** `Gregory Stevenson — Retirement Readiness Scorecard`
- **Results page:** `gregorystevensonresults.html`

**Q1. How close are you to retirement (or how recently did you retire)?**
- 5+ years out `(10)`
- 2–5 years out `(25)`
- Within 2 years `(35)`
- Retired in the last 5 years `(45)`

**Q2. Do you have a written plan with a clear monthly retirement paycheck number?**
- Yes — written down `(5)`
- A rough idea `(20)`
- Counting on withdrawals and hoping `(35)`
- No clear number `(45)`

**Q3. How much guaranteed income (beyond Social Security/pension) covers your essentials?**
- Essentials fully covered `(5)`
- Mostly covered `(20)`
- A little `(35)`
- None — it's all market-dependent `(45)`

**Q4. How exposed is your savings to a bad first 1–5 years of retirement?**
- Little — principal is protected `(5)`
- Some `(15)`
- Most `(25)`
- Nearly all of it `(35)`

**Q5. Do you have a tax-smart withdrawal plan (IRMAA, RMDs, Social Security timing)?**
- Yes — a year-by-year plan `(5)`
- A rough idea `(20)`
- Not yet `(35)`
- No — and I'm worried about surprises `(45)`

**Q6. How worried are you that a market drop could permanently change your retirement?**
- Not worried — I'm protected `(5)`
- Somewhat worried `(20)`
- Very worried `(35)`
- It keeps me up at night `(45)`

**Q7. Are your beneficiaries, wills/trusts, and long-term-care/spouse protection in place?**
- Yes — all current `(5)`
- Mostly `(15)`
- On my list `(25)`
- This is a blind spot `(35)`

---

# 4) GARY GUAN
- **Survey name:** `Gary Guan — RMD Tax Shock Scorecard`
- **Results page:** `garyguanresults.html`

**Q1. How soon until your RMDs begin (or have they already started)?**
- 10+ years away `(10)`
- 5–10 years `(25)`
- Within 5 years `(35)`
- They've already started `(45)`

**Q2. How much do you have in pre-tax accounts (401(k)/IRA/403(b)/457)?**
- Under $500k `(10)`
- $500k–$1M `(25)`
- $1M–$2M `(35)`
- $2M or more `(45)`

**Q3. Do you have a multi-year Roth conversion plan?**
- Yes — a multi-year blueprint `(5)`
- Small ad-hoc conversions `(20)`
- Thinking about it `(35)`
- No plan `(45)`

**Q4. Do you know your "cost of doing nothing" — the future tax bill if you don't convert?**
- Yes — I've modeled it `(5)`
- A rough idea `(15)`
- Not really `(25)`
- No idea `(35)`

**Q5. How coordinated are your CPA, tax attorney, and advisor on conversions?**
- Fully — one coordinated team `(5)`
- Loosely connected `(20)`
- They don't talk to each other `(35)`
- I'm on my own `(45)`

**Q6. Are you watching IRMAA and Social Security taxation when you take income or convert?**
- Yes — planned around it `(5)`
- Somewhat `(20)`
- Not really `(35)`
- No — I've been surprised before `(45)`

**Q7. Is your legacy structured so your heirs don't inherit a tax bomb?**
- Yes — tax-smart and current `(5)`
- Mostly `(15)`
- On my list `(25)`
- This is a blind spot `(35)`

---

# 5) FUTABA TAKASHIMA
- **Survey name:** `Futaba Takashima — Retirement Paycheck Snapshot`
- **Results page:** `futabatakashimaresults.html`

**Q1. Do you have a clear retirement target number and timeline?**
- Yes — a specific number and date `(5)`
- A rough idea `(20)`
- A vague "someday" `(35)`
- No target at all `(45)`

**Q2. Do you have a system for how much profit to invest for retirement each month?**
- Yes — it's automatic `(5)`
- Inconsistent `(20)`
- Only whatever's left over `(35)`
- None — it stays in the business `(45)`

**Q3. Where does your business profit currently go?**
- Intentionally split, including retirement `(5)`
- Some gets saved `(20)`
- Mostly back into the gym `(35)`
- It piles up in checking `(45)`

**Q4. How much have you saved specifically for retirement (outside the business)?**
- $250k or more `(5)`
- $100k–$250k `(15)`
- $25k–$100k `(25)`
- Under $25k `(35)`

**Q5. Is your retirement plan dependent on selling the gym or a rental property?**
- No — I have an independent income plan `(5)`
- Partly `(20)`
- Mostly `(35)`
- Entirely `(45)`

**Q6. Do you have a tax-smart retirement account setup for a gym owner (Solo 401(k)/SEP/etc.)?**
- Yes — optimized for my profit `(5)`
- A basic IRA only `(20)`
- Not sure what I should use `(35)`
- Nothing set up `(45)`

**Q7. Are you protected if you're injured, burn out, or step back from coaching?**
- Yes — protection is in place `(5)`
- Some `(15)`
- Not really `(25)`
- No — my family would be exposed `(35)`

---

*Every survey totals 0–295 points (five questions max at 45, two at 35). Same scale for all five, so the same tier table applies to each. The lead-magnet name shown on each landing page (IRS Jail Exit Timeline, Retirement Paycheck Snapshot, RMD Tax Shock Scorecard) is what the prospect opts in for; the results page then shows their score and tier.*
