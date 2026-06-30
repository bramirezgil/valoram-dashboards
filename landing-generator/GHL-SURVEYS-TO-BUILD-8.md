# GHL Surveys to Build — 5 Financial-Advisor Agents (Retirement Paycheck Snapshot)

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
For each survey, set **On Submit → Redirect URL** to that agent's results page:
```
https://YOUR-DOMAIN/vanessa-luceroresults.html?score={{contact.score}}
https://YOUR-DOMAIN/susan-franresults.html?score={{contact.score}}
https://YOUR-DOMAIN/sonja-huffresults.html?score={{contact.score}}
https://YOUR-DOMAIN/segg-tanresults.html?score={{contact.score}}
https://YOUR-DOMAIN/sana-lopesresults.html?score={{contact.score}}
```
(Replace `YOUR-DOMAIN` with the live host. The `{{contact.score}}` merge field passes the total automatically.)

---

## 1. Vanessa Lucero — Retirement Paycheck Snapshot

- **Survey name:** `Vanessa Lucero — Retirement Paycheck Snapshot`
- **Redirect:** `https://YOUR-DOMAIN/vanessa-luceroresults.html?score={{contact.score}}`

### Q1. If something happened to you tomorrow, do your kids have a clean, current plan (beneficiaries, guardianship, coverage)?
- Yes — beneficiaries, guardianship, and coverage are all set and current `(5)`
- Mostly — but a few things are outdated since the separation `(15)`
- It's messy — old beneficiaries, no guardianship plan, scattered accounts `(30)`
- No plan at all — they'd be left scrambling `(45)`

### Q2. Do you know your retirement paycheck number — what your savings would actually pay you each month?
- Yes — I know my monthly number and I'm building toward it `(5)`
- I have a rough idea but nothing on paper `(15)`
- Not really — I keep meaning to figure it out `(25)`
- No idea — and starting over in my 40s, that scares me `(35)`

### Q3. Since separating, have you separated and reorganized your own finances (accounts, access, emergency cash)?
- Yes — my accounts, access, and emergency fund are all in my name and clean `(5)`
- Partly — some is untangled, some is still joint or unclear `(15)`
- Barely started — most of it is still mixed or I'm locked out of pieces `(30)`
- Not at all — it's all tangled and I don't know where to begin `(45)`

### Q4. Is your family's protection (life insurance, income protection) right-sized for your life now?
- Yes — coverage is right-sized for me and the kids, beneficiaries current `(5)`
- I have some coverage but haven't reviewed it since the marriage `(15)`
- Just whatever came through work — never chosen on purpose `(30)`
- No real coverage — if I'm gone, they're on their own `(45)`

### Q5. When big money decisions hit (housing, legal fees, child expenses), how do you decide?
- I have a clear framework and know what's smart vs. fear-driven `(5)`
- I think it through but second-guess myself constantly `(15)`
- I mostly react under pressure and hope it's right `(30)`
- I freeze or make fear-driven calls I later regret `(45)`

### Q6. Do you have a backup plan if life goes sideways (job change, health scare, support payments stop)?
- Yes — clear cash buffer and a written what-if plan `(5)`
- Some savings, but no real plan for a curveball `(15)`
- One bad month would knock everything over `(25)`
- No buffer and no backup — I'm one surprise from going backward `(35)`

### Q7. Who is coordinating your protection, retirement, and decisions into one roadmap?
- One clear written roadmap I actually follow `(5)`
- A few pieces, but nobody connects them `(15)`
- Scattered advice from friends, Google, and old habits `(30)`
- Nobody — it's all in my head and I'm carrying it alone `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 2. Susan Fran — Retirement Paycheck Snapshot

- **Survey name:** `Susan Fran — Retirement Paycheck Snapshot`
- **Redirect:** `https://YOUR-DOMAIN/susan-franresults.html?score={{contact.score}}`

### Q1. You make good money — but do you actually know where your cash flow goes each month?
- Yes — I track it and know exactly where every dollar goes `(5)`
- Roughly — I have a feel for it but no real system `(15)`
- Not really — it feels tight even though income is strong `(30)`
- No — money comes in and disappears and I can't explain it `(45)`

### Q2. Is your life insurance based on your real human economic value, or just a number off a quote?
- Yes — coverage is sized to my actual income and family needs `(5)`
- I have a policy but I'm not sure the amount is right `(15)`
- Just a random policy I bought off a quick quote `(30)`
- No real coverage — if I'm gone tomorrow, the numbers don't add up `(45)`

### Q3. If you couldn't work for 6–12 months, would your family's lifestyle and the business hold up?
- Yes — disability/income protection and reserves would cover us `(5)`
- We'd manage a few months on savings `(15)`
- We'd get tight fast and start burning reserves `(25)`
- The income stops and the bills don't — we'd be in real trouble `(35)`

### Q4. How predictable are your taxes — do surprises hit you at filing time?
- Predictable — I plan for taxes and rarely get surprised `(5)`
- Mostly okay but the occasional surprise bill stings `(15)`
- Unpredictable — under-withholding and estimated-tax pain are normal `(30)`
- Every April is a shock and it's draining my cash flow `(45)`

### Q5. As a business owner, do you have a tax-smart retirement strategy in place?
- Yes — a clear, funded business-owner retirement plan I understand `(5)`
- I contribute somewhere but there's no real strategy `(15)`
- The business is basically my retirement plan `(30)`
- Nothing set up — I keep pushing it to "later" `(45)`

### Q6. Do you have a plan to retain and reward key employees without creating a long-term expense trap?
- Yes — a retention/benefits structure that helps them and the business `(5)`
- Some benefits, but nothing strategic `(15)`
- I want to but I'm afraid of locking into a permanent cost `(25)`
- No plan — and I worry about losing key people `(35)`

### Q7. Are your cash flow, protection, taxes, and retirement working together as one plan?
- Yes — one clean plan where everything is coordinated `(5)`
- A few pieces connect, but most are separate `(15)`
- Scattered — different policies and accounts, no through-line `(30)`
- Nothing is connected — it's a pile of products, not a plan `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 3. Sonja Huff — Retirement Paycheck Snapshot

- **Survey name:** `Sonja Huff — Retirement Paycheck Snapshot`
- **Redirect:** `https://YOUR-DOMAIN/sonja-huffresults.html?score={{contact.score}}`

### Q1. You earn $250K+ — but is too much leaking out through taxes and weak structure?
- No — my entity and tax structure are dialed in and coordinated `(5)`
- Probably some leakage, but I'm not sure where `(15)`
- Yes — I feel the tax bite but have no real strategy `(30)`
- Yes — I'm almost certainly overpaying six figures over time `(45)`

### Q2. If something happened to you this year, would your spouse have a clear plan or a mess to sort out?
- A clear plan — they'd know exactly what to do `(5)`
- Mostly clear, but a few gaps they'd have to figure out `(15)`
- A partial mess — some pieces documented, many not `(30)`
- A full mess — accounts, businesses, and instructions all in my head `(45)`

### Q3. Is your family and business properly protected against a health event, lawsuit, or premature death?
- Yes — life, disability, liability, and key-person coverage are aligned `(5)`
- Some coverage, but I know there are gaps `(15)`
- Underinsured or improperly insured — it keeps me up at night `(25)`
- Barely covered — one event could wreck everything `(35)`

### Q4. Do you have a coordinated retirement income plan, or just a pile of accounts?
- A unified retirement paycheck plan I can follow `(5)`
- Accounts and investments, but no real income plan `(15)`
- Lots of accounts, no coordination, just hoping it works `(30)`
- No plan — I'm accumulating without a destination `(45)`

### Q5. Are your estate documents, beneficiaries, and business succession actually aligned?
- Yes — wills, trusts, beneficiaries, and titling all match my intent `(5)`
- Mostly, but some beneficiaries or titling are outdated `(15)`
- Documents exist but don't line up with the accounts `(30)`
- No trust, mismatched beneficiaries, no succession plan `(45)`

### Q6. Is your wealth plan built on a faith-aligned vision, or scattered one-off decisions?
- A clear Legacy North Star guides every financial move `(5)`
- I have values, but they don't drive the plan yet `(15)`
- Decisions are scattered with no single target `(25)`
- No vision and no plan — just reacting year to year `(35)`

### Q7. Who is coordinating your taxes, protection, investments, and legacy into one strategy?
- One coordinated plan with a quarterly review rhythm `(5)`
- A CPA, an attorney, and a "money guy" — but not aligned `(15)`
- A few professionals, none talking to each other `(30)`
- Nobody connects it — it's all on me, in my head `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 4. Segg Tan — Retirement Paycheck Snapshot

- **Survey name:** `Segg Tan — Retirement Paycheck Snapshot`
- **Redirect:** `https://YOUR-DOMAIN/segg-tanresults.html?score={{contact.score}}`

### Q1. Do you know what your CalPERS pension will actually pay you each month — a real number, not a guess?
- Yes — I've run my formula and know my net paycheck number `(5)`
- Roughly — I've seen an estimate but never confirmed it `(15)`
- Not really — I'm relying on break-room math and rumors `(30)`
- No idea — and I'm within a couple years of retiring `(45)`

### Q2. Have you decided which CalPERS pension election protects your spouse/family best?
- Yes — I've compared options and know the right one for us `(5)`
- I'm leaning one way but not confident `(15)`
- I'm confused by the survivor trade-offs `(25)`
- No — and I'm terrified of locking in a permanent mistake `(35)`

### Q3. Are you clear on what overtime does (and doesn't do) for your pension?
- Yes — I know OT doesn't raise my pension and I plan accordingly `(5)`
- I've heard that but I'm still picking up shifts to "be safe" `(15)`
- Not sure — I assume the extra work boosts my retirement `(30)`
- No — I'm grinding OT and burning out counting on it for my pension `(45)`

### Q4. Do you have a plan for the first 1–3 "gap years" after you retire?
- Yes — income timing, lost group life, and coverage gaps are mapped `(5)`
- I've thought about it but nothing is written down `(15)`
- I know there are gaps but I haven't planned for them `(30)`
- No — I'd be stepping off a cliff with no bridge `(45)`

### Q5. Do you have a tax-smart withdrawal plan for your 457(b), IRA, and brokerage?
- Yes — a withdrawal order that keeps taxes and IRMAA predictable `(5)`
- I have the accounts but no coordinated withdrawal strategy `(15)`
- I'll just "pull from the IRA" when I need it `(30)`
- No plan — I could get crushed by taxes and Medicare surcharges `(45)`

### Q6. Is your spouse protected if something happens to you after you retire?
- Yes — survivor option or pension-max strategy is decided and in place `(5)`
- Some protection, but I haven't pressure-tested it `(15)`
- I'm unsure my spouse would have enough income `(25)`
- No — if I'm gone, their income could collapse `(35)`

### Q7. Who is helping you execute these permanent decisions before the deadlines close?
- A clear plan with deadlines tracked and someone guiding me `(5)`
- I've got pieces, but I'm coordinating it all myself `(15)`
- Scattered advice from coworkers, HR, and Facebook groups `(30)`
- Nobody — and these elections can't be redone once they're filed `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

## 5. Sana Lopes — Retirement Paycheck Snapshot

- **Survey name:** `Sana Lopes — Retirement Paycheck Snapshot`
- **Redirect:** `https://YOUR-DOMAIN/sana-lopesresults.html?score={{contact.score}}`

### Q1. Do you have a real, year-round tax strategy — or just an accountant who files once a year?
- Yes — a proactive plan that lowers taxes all year `(5)`
- Some moves, but nothing strategic `(15)`
- Just a basic accountant who files what I hand them `(30)`
- No strategy — I feel crushed by taxes every single year `(45)`

### Q2. Do you know your retirement paycheck number — the monthly income your plan is on track for?
- Yes — I know my target number and I'm building toward it `(5)`
- A rough idea, but nothing concrete `(15)`
- Not really — retirement is always "later" `(25)`
- No idea — and that uncertainty scares me `(35)`

### Q3. Where is your retirement money actually sitting right now?
- In the right tax-smart accounts, working on purpose `(5)`
- Split between savings and a random brokerage, no clear plan `(15)`
- Mostly cash in checking "just in case" `(30)`
- All tied up in the business — "the business is my plan" `(45)`

### Q4. Is your business structured (entity, payroll, owner pay) to keep more of what you earn?
- Yes — entity and payroll are optimized for tax efficiency `(5)`
- It's set up, but I'm not sure it's optimized `(15)`
- Basic setup my accountant chose years ago `(30)`
- No real structure — I'm leaving money on the table `(45)`

### Q5. How predictable are your quarterly taxes and estimated payments?
- Predictable — I know what I'll owe before it's due `(5)`
- Mostly, but surprises still happen `(15)`
- Unpredictable — quarterly payments feel random `(30)`
- Every payment and every April is a stressful guess `(45)`

### Q6. Is your family protected if you get sick, injured, or can't run the business?
- Yes — coverage keeps the family and plan on track in an emergency `(5)`
- Some coverage, but I haven't reviewed it `(15)`
- Barely — my family would be exposed `(25)`
- No protection — they'd be forced to sell or scramble `(35)`

### Q7. Who is coordinating your tax strategy, retirement, and CPA into one simple plan?
- One trusted guide coordinating everything with my CPA `(5)`
- A CPA who files, but nobody building the strategy `(15)`
- Scattered tips from YouTube, friends, and one yearly meeting `(30)`
- Nobody — I'm guessing and doing it the hard way `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*
