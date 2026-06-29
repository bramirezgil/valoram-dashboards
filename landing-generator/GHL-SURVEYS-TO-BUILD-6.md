# GHL Surveys to Build — Batch 6 (4 Financial-Advisor Agents)

Build each survey in the GoHighLevel UI (the API can't create surveys). Turn **Scoring ON** and set each answer's **points** to the number shown in `( )`. Publish, then set the completion redirect so the score carries to the results page.

## How the score works
- Every answer adds its points. The 7 answers total **0 to 295** (five questions max out at 45, two at 35).
- The results page converts the 0–295 total to a tier automatically — you only build the survey + set the redirect.

| Total score | % of 295 | Result tier |
|---|---|---|
| 0 – 116 | 0–39% | **Strong Foundation** (optimize) |
| 117 – 205 | 40–69% | **Gaps to Close** (act soon) |
| 206 – 295 | 70–100% | **Action Needed Now** (urgent) |

- Direction: **higher points = more gaps, more risk, more urgency.** The most-handled answer scores lowest (5); the most-exposed answer scores highest (45/35).
- Max total = (5 × 45) + (2 × 35) = **295**.

## On-Submit redirect (per survey)
For each survey, set **On Submit → Redirect URL** to the URL shown in its block. Replace `YOUR-DOMAIN` with the live host. The `{{contact.score}}` merge field passes the total automatically.

---

## 1. Josephine Antonio — Retirement Paycheck Snapshot

- **Survey name:** `Josephine Antonio — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/josephine-antonioresults.html?score={{contact.score}}
```

### Q1. You're in your peak-earning years — if you wanted to step back in 7 to 15 years, do you actually know your retirement number?
- Yes — I know my number and we're tracking to it on purpose `(5)`
- I have a rough idea, but nothing's on paper `(15)`
- Not really — I keep meaning to sit down and figure it out `(30)`
- No idea — I just keep earning and assume it'll work out `(45)`

### Q2. Your money is moving in a lot of directions — 401(k), brokerage, RSUs, old accounts. Is it tied together into one plan?
- Yes — everything's organized into one clear, written plan `(5)`
- Mostly — a couple of accounts are still floating on their own `(15)`
- Not really — it's scattered and I'm not sure what's where `(30)`
- No — it's a pile of accounts and nobody's connected them `(45)`

### Q3. If you turned your savings into a retirement paycheck today, do you know the income gap you'd need to close?
- Yes — I've run the numbers and know the gap (or surplus) `(5)`
- I have a guess, but I've never put it side by side with my spending `(15)`
- No — I haven't translated my accounts into monthly income `(30)`
- No idea — I don't even know where the income would come from `(45)`

### Q4. With a parent's health and the kids' future both on you, is your family protected if something happened to you tomorrow?
- Yes — life and disability coverage are right-sized and current `(5)`
- I have some coverage but haven't reviewed it in years `(15)`
- Just whatever came through work — never looked closely `(30)`
- No real coverage — they'd be exposed `(45)`

### Q5. Are your taxes being handled on purpose across all these account types — or are you just filing and hoping?
- We have a proactive tax strategy across taxable, pre-tax, and Roth `(5)`
- My CPA files clean returns but there's no forward-looking plan `(15)`
- I'm probably missing something — I just hand over the documents `(30)`
- No tax strategy at all — I take whatever the bill says `(45)`

### Q6. Are your beneficiaries, estate documents, and account titling current and matching what you actually want? `(35-scale)`
- Yes — beneficiaries and estate docs are reviewed and aligned `(5)`
- Mostly, but I haven't checked them since a major life change `(15)`
- Honestly not sure — they could be outdated `(25)`
- No — there are no current documents in place `(35)`

### Q7. Who is coordinating your retirement, taxes, protection, and estate into one plan you actually follow? `(35-scale)`
- One coordinated, written plan I review on a rhythm `(5)`
- A few pieces, but nobody connects them `(15)`
- Scattered — a policy here, an account there, no quarterback `(25)`
- Nobody — it all lives in my head while life stays busy `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 2. Jon Mall — Retirement Paycheck Snapshot

- **Survey name:** `Jon Mall — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/jon-mallresults.html?score={{contact.score}}
```

### Q1. You're close to retirement (or just there). Do you have a written plan that turns your accounts into a dependable paycheck?
- Yes — I have a written income plan I can explain in plain language `(5)`
- I have a rough idea, but nothing formal on paper `(15)`
- Not really — I know what I've saved but not how it becomes income `(30)`
- No — I have accounts, not a paycheck plan `(45)`

### Q2. If the market dropped hard in your first year of retirement, would your income survive without panic-selling?
- Yes — I have a buffer and a withdrawal order built for a downturn `(5)`
- Probably — I have some cash set aside, but it's untested `(15)`
- Not sure — a bad year early on would scare me into reacting `(30)`
- No — a downturn at the wrong time would wreck the plan `(45)`

### Q3. Do you know which account to pull from first — taxable, TSP/401(k)/IRA, or Roth — and in what order?
- Yes — I have a clear, tax-aware withdrawal sequence `(5)`
- I have a general idea but no written order of operations `(15)`
- Not really — I'd just start pulling and figure it out `(30)`
- No — I have no idea which account funds which stage `(45)`

### Q4. With large pre-tax balances, do you have a plan for RMDs, Roth conversions, and Medicare IRMAA before they hit?
- Yes — I have a proactive tax and IRMAA roadmap with conversion windows `(5)`
- I've heard of these but haven't planned around them `(15)`
- Not really — I'm worried about a tax surprise but haven't acted `(30)`
- No — RMDs and IRMAA aren't on my radar at all `(45)`

### Q5. Is your Social Security and pension/TSP timing coordinated with the rest of your income plan?
- Yes — claiming and pension elections are timed to the whole plan `(5)`
- Partly — I have a leaning but haven't run the tradeoffs `(15)`
- Not really — I'll just claim when it feels right `(30)`
- No — these decisions are disconnected from everything else `(45)`

### Q6. If something happened to you, would your spouse be financially clear and protected — income, beneficiaries, and a plan they understand? `(35-scale)`
- Yes — my spouse knows the plan and protection is in place `(5)`
- Mostly, but they'd struggle to run it without me `(15)`
- Not really — they'd be lost and exposed `(25)`
- No — there's no continuity plan if I'm gone `(35)`

### Q7. Who is coordinating your income, taxes, market risk, healthcare, and legacy into one living plan? `(35-scale)`
- One coordinated, written plan reviewed on a schedule `(5)`
- A couple of pieces, but no one connects them `(15)`
- Scattered advice from different sources that doesn't line up `(25)`
- Nobody — I'm making big retirement decisions in isolation `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 3. Jay Smull — West Texas Tax Savings Scorecard

- **Survey name:** `Jay Smull — West Texas Tax Savings Scorecard`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/jay-smullresults.html?score={{contact.score}}
```

### Q1. Your income's up and the tax bill keeps climbing. Has anyone actually done a forensic, line-by-line review of your return?
- Yes — my return gets a true forensic review every year `(5)`
- Sort of — my CPA answers questions but doesn't go hunting `(15)`
- No — I trust the software/standard prep to catch it `(30)`
- No idea — I just sign at the bottom and pay `(45)`

### Q2. Is your entity structure (S-corp, partnership, multiple entities, real estate) actually built to minimize tax — or just to exist?
- Yes — my structure was designed on purpose for my income mix `(5)`
- I have entities but no one has reviewed if they're optimal `(15)`
- Probably wrong — I set it up years ago and never revisited `(30)`
- No structure strategy — it's whatever got filed `(45)`

### Q3. Are you capturing the depreciation you're entitled to on equipment, vehicles, and real estate — with clean backup?
- Yes — depreciation is planned, timed, and documented `(5)`
- Some of it, but I'm sure I'm leaving deductions on the table `(15)`
- Not really — big purchases just sit there untracked `(30)`
- No — I have no depreciation strategy at all `(45)`

### Q4. The messy stuff — 1099s, per diem, travel, home office, K-1s — is it being claimed and documented, or quietly skipped?
- Yes — every category is claimed with defensible records `(5)`
- Most of it, but my documentation is spotty `(15)`
- Probably missing a lot — it's too messy to track `(30)`
- No — I don't even try to capture most of it `(45)`

### Q5. Are your taxes run proactively all year — quarterly timing, retirement plans — or only at filing time?
- Yes — I work off a quarterly tax game plan `(5)`
- Somewhat — I think about it but don't act until year-end `(15)`
- Not really — I get surprised by every estimate `(30)`
- No — taxes are a once-a-year scramble `(45)`

### Q6. If the IRS ever asked questions, could you defend your deductions with clean documentation? `(35-scale)`
- Yes — my records are organized and audit-ready `(5)`
- Mostly, but there are gaps I'd worry about `(15)`
- Not really — I'd be scrambling to find backup `(25)`
- No — I'd lose deductions because I can't prove them `(35)`

### Q7. Do you have one proactive partner quantifying your savings and handing you a written plan — or are you hoping your accountant "already caught it"? `(35-scale)`
- Yes — a clear written game plan with dollar-by-dollar savings `(5)`
- A standard CPA who files clean but never strategizes `(15)`
- Scattered — different people, no one owns the strategy `(25)`
- Nobody — I'm just hoping it's handled `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 4. Jasmine Goodridge — Retirement Lever Readiness Scorecard

- **Survey name:** `Jasmine Goodridge — Retirement Lever Readiness Scorecard`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/jasmine-goodridgeresults.html?score={{contact.score}}
```

### Q1. Your commissions swing $20k to $60k a month. Do you have a system that routes every check, or does it just hit checking?
- Yes — every check has an assignment before I spend it `(5)`
- Kind of — I have buckets but I don't follow them consistently `(15)`
- Not really — it lands in checking and I wing it `(30)`
- No system at all — money just sits and leaks `(45)`

### Q2. If you had two slow months and one zero-commission month, would your setup survive without debt or panic?
- Yes — I've stress-tested it and I'd be fine `(5)`
- Probably — I have some cash but I've never run the math `(15)`
- Not sure — a slump would get tight fast `(30)`
- No — one bad quarter would wipe me out `(45)`

### Q3. As a 1099/commission earner, do you have a clean tax set-aside system — or is tax season a surprise every year?
- Yes — I set aside taxes automatically on every check `(5)`
- Sort of — I save something but it's never quite enough `(15)`
- Not really — I scramble when the bill comes `(30)`
- No — taxes are a last-minute emergency `(45)`

### Q4. You don't have employer benefits. If an injury or illness stopped your income for months, what happens?
- I have real income/disability protection that would cover me `(5)`
- I have a little saved that would last a few months `(15)`
- I'd get tight fast and start burning everything `(30)`
- The income stops and I have nothing to catch me `(45)`

### Q5. You're "making money" — but is it actually building wealth? Do you have a retirement/investing strategy you follow?
- Yes — clear targets and a repeatable investing plan `(5)`
- I invest sometimes, but it's random and reactive `(15)`
- Not really — cash just piles up idle in the bank `(30)`
- No — I have no retirement or investing plan at all `(45)`

### Q6. Are you funding the right retirement accounts in the right order for how you're paid (Roth IRA, Solo 401(k), HSA, etc.)? `(35-scale)`
- Yes — I'm prioritizing the right buckets for my situation `(5)`
- I contribute to something, but I'm not sure it's optimal `(15)`
- Probably the wrong order — I just picked one and went `(25)`
- No — I'm not funding any retirement accounts yet `(35)`

### Q7. With a home, marriage, or kids on the horizon, do you have a funded timeline — or are you hoping a good month covers it? `(35-scale)`
- Yes — clear savings targets tied to each milestone `(5)`
- A rough plan, but nothing funded on a schedule `(15)`
- Not really — I'll figure it out when it gets closer `(25)`
- No — I'm counting on a big month to bail me out `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*
