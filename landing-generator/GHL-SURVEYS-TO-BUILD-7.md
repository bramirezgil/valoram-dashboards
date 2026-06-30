# GHL Surveys to Build — Batch 7 (Retirement Paycheck Snapshot + Protection Gap Scorecard)

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

## On-Submit redirect
For each survey, set **On Submit → Redirect URL** to the URL shown under that survey. Replace `YOUR-DOMAIN` with the live host. The `{{contact.score}}` merge field passes the total automatically.

---

## 1. Raj Sekhawat — Retirement Paycheck Snapshot

- **Survey name:** `Raj Sekhawat — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/raj-sekhawatresults.html?score={{contact.score}}
```

### Q1. With household income over $400K plus equity gains, how proactive is your tax strategy right now?
- I run a proactive, written, IRS-compliant tax plan updated every year `(5)`
- I have a few strategies in place but no coordinated annual plan `(15)`
- My CPA just files what I hand them — nothing proactive `(30)`
- I'm getting crushed on taxes and have no real plan at all `(45)`

### Q2. When RSUs vest, ISOs/NSOs exercise, or you sell stock, how handled is the tax hit?
- Planned in advance — withholding, AMT, and timing are mapped before the event `(5)`
- I know it's coming but mostly react after the fact `(15)`
- I get surprised by the true tax vs. what was withheld `(30)`
- A big equity year means a tax bill I never see coming `(45)`

### Q3. How is your business/income structured for entity and tax efficiency?
- Structured on purpose (right entity + tax plan + retirement contributions) `(5)`
- I have an LLC/S-corp but no real tax or retirement strategy `(15)`
- Single-member or W-2 only, no structure decisions made `(25)`
- I'm basically winging the structure and tax side `(35)`

### Q4. Beyond maxing a 401(k), do you have a real retirement income plan?
- Yes — a quantified number and a tax-smart drawdown plan `(5)`
- I max qualified accounts but have no income plan `(15)`
- Money is scattered across accounts with no coordination `(30)`
- No plan — I just hope the equity and savings work out `(45)`

### Q5. If you (or your spouse) couldn't work or something happened, is the family protected?
- Yes — life and disability are right-sized and beneficiaries are current `(5)`
- We have some coverage but haven't reviewed it in years `(15)`
- Just whatever came through work `(30)`
- No real coverage — they'd be exposed `(45)`

### Q6. Multi-state exposure (CA/NY/NJ/MA/WA or a recent relocation) — how clean is it?
- Fully documented — residency, sourcing, and records are airtight `(5)`
- I think it's fine but I've never had it reviewed `(15)`
- I moved or work across states and I'm unsure of my exposure `(25)`
- No idea — multi-state taxes are a black box and I feel exposed `(35)`

### Q7. Who is coordinating your taxes, equity, retirement, protection, and estate into one plan?
- One coordinated, written plan with my CPA and attorney aligned `(5)`
- A couple of pieces, but nobody connects them `(15)`
- Scattered — a policy here, an account there, advice everywhere `(30)`
- Nobody — it's all in my head and tax season runs me `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 2. Mich Tinsay — Retirement Paycheck Snapshot

- **Survey name:** `Mich Tinsay — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/mich-tinsayresults.html?score={{contact.score}}
```

### Q1. You're maxing the 401(k) — but do you actually know your retirement number?
- Yes — I know my number and I'm on track to hit it `(5)`
- I have a rough idea, but nothing on paper `(15)`
- Not really — I keep "maxing it" and hoping that's enough `(30)`
- No idea — I just contribute and don't ask too many questions `(45)`

### Q2. If you couldn't work for 6–12 months (injury, illness, burnout), what happens to your income?
- I have disability/income protection that would cover us `(5)`
- I have some savings that would last a few months `(15)`
- We'd get tight fast and start burning reserves `(30)`
- The income stops and the bills don't — we'd be in trouble `(45)`

### Q3. How intentional is your tax strategy across your accounts (401k, Roth, HSA, brokerage)?
- Coordinated on purpose — every account has a job and a tax label `(5)`
- I save in a few places but never planned the tax side `(15)`
- It's mostly pre-tax 401(k) and I've never thought about the order `(25)`
- I have no idea if I'm overpaying tax — it's all random `(35)`

### Q4. Have you converted your savings into a real retirement income plan?
- Yes — I know the monthly income my plan will produce `(5)`
- I have balances but no income projection `(15)`
- Accounts are scattered across old jobs and apps with no plan `(30)`
- No — "contributing" is my entire plan `(45)`

### Q5. Is your family protected if something happens to you — coverage and beneficiaries?
- Yes — life insurance is right-sized and beneficiaries are current `(5)`
- I have some coverage but haven't checked it in years `(15)`
- Just the minimum my employer offers `(30)`
- No real coverage — they'd be on employer minimums and crossed fingers `(45)`

### Q6. Have you set a real retirement income target for your household (Social Security + any pension)?
- Yes — a defined number that includes Social Security and pension `(5)`
- A rough guess, nothing calculated `(15)`
- I've never sat down to figure out the target `(25)`
- No target at all — I don't know what "on track" even means for us `(35)`

### Q7. Who is coordinating your retirement, taxes, protection, and beneficiaries into one plan?
- One coordinated, written plan I actually follow `(5)`
- A couple of pieces, but nobody connects them `(15)`
- Scattered — a 401(k) portal here, a policy there `(30)`
- Nobody — it's all in my head between shifts `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 3. Maricarmen Munoz — Retirement Paycheck Snapshot

- **Survey name:** `Maricarmen Munoz — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/maricarmen-munozresults.html?score={{contact.score}}
```

### Q1. Your "free rent" disappears at retirement — do you know the paycheck you'll actually need?
- Yes — I've calculated my retirement paycheck number with housing added back `(5)`
- I have a rough idea, but nothing on paper `(15)`
- Not really — I haven't accounted for losing free rent `(30)`
- No idea — I've never run the number at all `(45)`

### Q2. If you couldn't work for 6 months (injury or illness), what would pay your bills?
- I have disability/income protection that would cover us `(5)`
- I have some savings that would last a few months `(15)`
- We'd get tight fast and start burning reserves `(30)`
- Nothing real — the income stops and we'd be in trouble `(45)`

### Q3. How are your savings set up outside the free-rent perk?
- Intentional retirement savings outside the job, growing on purpose `(5)`
- A little set aside but no real strategy `(15)`
- Old 401(k)/IRA from a prior job or spouse, untouched `(25)`
- Almost nothing saved outside the perk `(35)`

### Q4. Do you have a real retirement income plan you can count on?
- Yes — a written plan with reliable/guaranteed income mapped out `(5)`
- I have some accounts but no income plan `(15)`
- Scattered accounts with no coordination `(30)`
- No plan — I'm hoping Social Security covers it `(45)`

### Q5. Is your spouse/family protected if something happens to you?
- Yes — life insurance is right-sized and beneficiaries are current `(5)`
- I have some coverage but haven't looked at it in years `(15)`
- Just an old policy from a previous job `(30)`
- No real coverage — they'd be stuck financially `(45)`

### Q6. Have you checked whether your existing tools (annuity, policy) actually last for life?
- Yes — I've confirmed lifetime income and no hidden expiration `(5)`
- I think so, but I've never verified the fine print `(15)`
- I have an annuity/policy but don't know its payout limits `(25)`
- No idea — I could have income that only pays for a set number of years `(35)`

### Q7. Who is coordinating your retirement income, protection, and scattered accounts into one plan?
- One coordinated, written plan I actually follow `(5)`
- A couple of pieces, but nobody connects them `(15)`
- Scattered — a policy here, an old account there `(30)`
- Nobody — there's no plan, just accounts `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 4. Leslie Dowtin — Retirement Paycheck Snapshot

- **Survey name:** `Leslie Dowtin — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/leslie-dowtinresults.html?score={{contact.score}}
```

### Q1. Your business can't run forever — do you know your work-optional number?
- Yes — I know my number and my 10–15 year runway is mapped `(5)`
- I have a rough idea, but nothing on paper `(15)`
- Not really — retirement is a question mark, not a plan `(30)`
- No idea — if I keep going like this I'll still be working at 65 `(45)`

### Q2. High income, but is it structured to keep more of what you earn at tax time?
- Yes — business and personal are aligned for tax efficiency `(5)`
- Some structure, but no real tax-saving system `(15)`
- I just trust my CPA to handle it at filing `(25)`
- I'm overpaying and tax time feels like a punishment `(35)`

### Q3. Where is your high income actually going — is it becoming wealth?
- It's systematically converted into assets and savings on purpose `(5)`
- Some saves when there's extra, but it's inconsistent `(15)`
- Money comes in fast and goes out fast with no framework `(30)`
- It disappears every year — I make great money but can't see where it goes `(45)`

### Q4. Beyond the business, do you have real retirement savings and an income plan?
- Yes — funded retirement accounts and an income plan in place `(5)`
- A little saved, but no real retirement plan `(15)`
- Scattered accounts with no coordination `(30)`
- Nothing real — the business IS my retirement plan `(45)`

### Q5. If something happened to you, are your family and business protected?
- Yes — life, disability, and continuity coverage are in place and current `(5)`
- I have some coverage but haven't reviewed it in years `(15)`
- Just a random policy I bought once `(30)`
- No real coverage — my family and business would be exposed `(45)`

### Q6. Do you have a succession or exit plan for the business when you stop?
- Yes — a clear exit/transfer plan with the value not trapped in me `(5)`
- I've thought about it but nothing is written down `(25)`
- I figure I'll just sell or wind it down when the time comes `(15)`
- No plan — the value is trapped in my body and my calendar `(35)`

### Q7. Who is coordinating your taxes, retirement, protection, and exit into one plan?
- One coordinated, written plan with my CPA and attorney aligned `(5)`
- A couple of pieces, but nobody connects them `(15)`
- Scattered — a policy here, an account there `(30)`
- Nobody — it's all in my head and the jobs come first `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 5. Jennifer Battad — Protection Gap Scorecard

- **Survey name:** `Jennifer Battad — Protection Gap Scorecard`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/jennifer-battadresults.html?score={{contact.score}}
```

### Q1. If your income stopped tomorrow (death, disability, illness), how long could your family hold the lifestyle?
- We're fully covered — income protection would keep us whole `(5)`
- We have some coverage and reserves to last a while `(15)`
- We'd get tight fast and start burning through savings `(30)`
- The income stops and the lifestyle collapses — we're exposed `(45)`

### Q2. Is your life and disability coverage right-sized for your current income and obligations?
- Yes — coverage matches our income, mortgage, and family needs `(5)`
- We have policies but haven't reviewed them against today's life `(15)`
- Mostly outdated or employer-only coverage `(30)`
- We're underinsured or unsure what we even have `(45)`

### Q3. Beyond the big risks, how ready is your retirement plan?
- On track — a clear retirement strategy is funded and in motion `(5)`
- Started, but I'm not sure we're on track `(15)`
- Accounts exist but there's no real retirement plan `(25)`
- Retirement is a vague "someday" we keep pushing off `(35)`

### Q4. If you're a business owner, is there a continuity plan if you're out of the picture?
- Yes — buy-sell/continuity is documented and funded `(5)`
- We've discussed it but nothing is in place `(15)`
- No plan — the business depends entirely on me `(30)`
- The business would stop and the family income with it `(45)`

### Q5. Is your plan structured to avoid overpaying tax and missing key strategies?
- Yes — it's coordinated and tax-efficient on purpose `(5)`
- Some pieces, but no one is optimizing the tax side `(15)`
- I assume we're fine but no one has checked `(30)`
- I'm sure we're leaving money on the table — it's all uncoordinated `(45)`

### Q6. Are your estate basics and beneficiaries current and correct?
- Yes — beneficiaries, ownership, and estate docs are all current `(5)`
- Mostly, but I haven't reviewed them after recent life changes `(15)`
- Some are outdated (job changes, new kids, a move) `(25)`
- No idea — my spouse would be left untangling a mess `(35)`

### Q7. Who is quarterbacking your protection, retirement, business, and legacy into one plan?
- One coordinated, written plan with a single advisor leading it `(5)`
- A couple of pieces, but nobody connects them `(15)`
- Scattered — old policies and random accounts, no quarterback `(30)`
- Nobody — it's a financial junk drawer and I know it `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*
