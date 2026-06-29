# GHL Surveys to Build — 5 Financial-Advisor Agents

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
- Each survey has **7 questions × 4 single-select answers**. Five questions use `45 / 30 / 15 / 5`; two questions (Q3 and Q6) use `35 / 25 / 15 / 5`.

## On-Submit redirect (per survey)
For each survey, set **On Submit → Redirect URL** to the line shown under that survey. Replace `YOUR-DOMAIN` with the live host. The `{{contact.score}}` merge field passes the total automatically.

---

## 1. Isaiah Ellison — Retirement Lever Readiness Scorecard

- **Survey name:** `Isaiah Ellison — Retirement Lever Readiness Scorecard`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/isaiah-ellisonresults.html?score={{contact.score}}
```

### Q1. You make great money — but is it actually being turned into a plan, or just paid out?
- It's working on purpose — one integrated plan ties protection, wealth, and legacy together `(5)`
- I have accounts and policies, but nobody has connected them `(15)`
- It feels like it's leaking everywhere — taxes, lifestyle, scattered accounts `(30)`
- Honestly, I'm just earning and hoping — there's no real plan `(45)`

### Q2. If something happened to you tomorrow, would your family's lifestyle actually hold?
- Yes — coverage is right-sized and my spouse/kids would be fine `(5)`
- Probably mostly — but I haven't run the real numbers `(15)`
- Just the policy through work, and I'm not sure it's enough `(30)`
- No — they'd be exposed, and that thought keeps me up `(45)`

### Q3. How much of your money is sitting idle instead of working for the future?
- Very little — cash is positioned on purpose `(5)`
- Some — I keep a comfortable cushion but no real strategy `(15)`
- A lot — $50k–$250k+ just sitting "just in case" `(25)`
- Most of it — I have no idea what my money is even doing `(35)`

### Q4. When it comes to taxes, do you have a strategy or just a tax bill?
- A proactive, tax-aware plan I follow every year `(5)`
- My CPA files what I hand them — nothing forward-looking `(15)`
- I know I'm overpaying but haven't done anything about it `(30)`
- Taxes feel like a constant drain I can't see or control `(45)`

### Q5. Do you actually understand the financial products you own, or were you just sold them?
- I understand every piece and why I have it `(5)`
- I get the basics but couldn't explain the strategy `(15)`
- Someone sold me a product and I trusted it `(30)`
- No idea — I have policies/accounts I can't explain at all `(45)`

### Q6. Is your legacy — beneficiaries, ownership, what your spouse would need — actually handled?
- Yes — beneficiaries are current and the estate plan is clean `(5)`
- Mostly, but it's been years since I reviewed it `(15)`
- It's outdated — old beneficiaries, no clear documents `(25)`
- Nothing is set up — my family would be lost if I was gone `(35)`

### Q7. Who is quarterbacking your whole financial picture into one plan?
- One coordinated, written plan I actually follow `(5)`
- A few pieces, but nobody connects them `(15)`
- It's scattered — a policy here, an account there `(30)`
- Nobody — it's all in my head while I keep earning `(45)`

*Max possible: 295 (45+45+35+45+45+35+45).*

---

## 2. Gley Cisneros — Retirement Paycheck Snapshot

- **Survey name:** `Gley Cisneros — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/gley-cisnerosresults.html?score={{contact.score}}
```

### Q1. Do you actually know the exact date you can afford to retire from the County?
- Yes — I know my date and the monthly income behind it `(5)`
- I have a target year, but nothing confirmed on paper `(15)`
- Not really — I'm thinking "maybe next year, maybe two" `(30)`
- No idea — I keep putting it off because I'm afraid of the answer `(45)`

### Q2. Do you understand your LACERA pension options well enough to choose without regret?
- Yes — I know my timing, options, and survivor choices cold `(5)`
- I understand the basics but not the trade-offs `(15)`
- I'm relying on HR packets and what coworkers tell me `(30)`
- No — and a wrong election could quietly cost us for life `(45)`

### Q3. Have you mapped how your pension, 457/401(a), and Social Security work together?
- Yes — I have a coordinated monthly income plan `(5)`
- I've looked at each piece, but never as one plan `(15)`
- I've barely looked — they're just separate statements `(25)`
- Not at all — I don't know what actually lands each month after taxes `(35)`

### Q4. How exposed are you to a tax surprise once the pension and withdrawals start?
- I have a withdrawal-sequencing plan that manages my brackets `(5)`
- I've thought about taxes but have no real strategy `(15)`
- I assume it'll be fine and haven't checked `(30)`
- No clue — RMDs and bracket jumps could blindside us `(45)`

### Q5. Is your healthcare/Medicare transition timed and planned?
- Yes — I have a clear timeline for before 65, at 65, and beyond `(5)`
- I know it's coming but haven't mapped the dates `(15)`
- I'm worried about a coverage gap and haven't sorted it `(30)`
- No plan at all — this is a blind spot that scares me `(45)`

### Q6. If something happened to you, would your spouse be protected — not just left with paperwork?
- Yes — survivor benefits and protection are handled `(5)`
- The pension is set, but spouse protection isn't `(15)`
- I've meant to look at it but haven't `(25)`
- No — my spouse would be exposed and I know it `(35)`

### Q7. Is your estate plan — beneficiaries, accounts, documents — clean and current?
- Yes — everything is coordinated and up to date `(5)`
- Mostly, but it hasn't been reviewed in years `(15)`
- It's outdated — old beneficiaries and missing documents `(30)`
- Nothing is in place — my family would be stuck `(45)`

*Max possible: 295 (45+45+35+45+45+35+45).*

---

## 3. Galia Alonso — Retirement Paycheck Snapshot

- **Survey name:** `Galia Alonso — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/galia-alonsoresults.html?score={{contact.score}}
```

### Q1. Is your retirement a real plan, or are you betting it all on one big sale of the shop?
- I have predictable retirement income that doesn't depend on the sale `(5)`
- I have some savings, but the shop is still most of the plan `(15)`
- Honestly, "sell the shop someday" is the plan `(30)`
- No plan — I'd be forced to keep working if I couldn't sell `(45)`

### Q2. If you were gone tomorrow, could your shop keep running and your family stay protected?
- Yes — there's a written continuity plan and the cash to back it `(5)`
- Partly — people know their roles, but nothing's funded `(15)`
- Not really — my spouse would be scrambling `(30)`
- No — everything depends on me and they'd be exposed `(45)`

### Q3. Do you have a funded buy-sell agreement that actually matches your business today?
- Yes — funded, current, and matched to my entity `(5)`
- I have one, but it may be outdated or underfunded `(15)`
- It exists on paper with no cash behind it `(25)`
- I have no buy-sell — a crisis would trigger chaos or a forced sale `(35)`

### Q4. Taxes on a $250k–$900k income year — strategy, or a leak you can't plug?
- I have a coordinated tax strategy with my CPA `(5)`
- My CPA files, but we don't plan ahead `(15)`
- I know I'm overpaying but the structure's a mess `(30)`
- It feels like taxes eat the win every year and I can't stop it `(45)`

### Q5. Is most of your net worth trapped in the business and real estate?
- No — I've intentionally moved wealth into tax-smart, liquid sources `(5)`
- Some is diversified, but most is still tied up `(15)`
- Almost all of it is in the shop and property `(30)`
- All of it — if the business stumbles, my retirement stumbles `(45)`

### Q6. Can you keep your key estimators and production leaders from walking out the door?
- Yes — I have a real retention/benefits setup that locks them in `(5)`
- I pay well, but there's nothing structured to keep them `(15)`
- I worry about it but haven't built anything `(25)`
- No — losing a key person would hurt and I have no plan `(35)`

### Q7. Is there a clear plan to transfer the business and wealth to the next generation?
- Yes — succession, trusts, and beneficiaries are coordinated `(5)`
- I have ideas but nothing written or aligned `(15)`
- It's vague — and could spark family conflict `(30)`
- No plan at all — my family would be left with a mess `(45)`

*Max possible: 295 (45+45+35+45+45+35+45).*

---

## 4. Elmer Manuel — Retirement Paycheck Snapshot

- **Survey name:** `Elmer Manuel — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/elmer-manuelresults.html?score={{contact.score}}
```

### Q1. If something happened to you, would your family keep the house — or inherit the mortgage?
- They'd keep it — coverage clearly exceeds the mortgage balance `(5)`
- Probably, but I've never matched the coverage to the loan `(15)`
- I'm not sure my coverage would actually pay it off `(30)`
- They'd be forced to sell under pressure — and I know it `(45)`

### Q2. Is your life insurance actually structured around your mortgage and timeline?
- Yes — the policy is built around the loan and payoff date `(5)`
- I have a basic term policy I picked without much thought `(15)`
- Just whatever came with the loan or through work `(30)`
- I'm not sure I have anything that lines up at all `(45)`

### Q3. How do you feel about paying premiums every month as retirement gets closer?
- Handled — my funding is structured so it won't burden retirement `(5)`
- It's fine for now, but I haven't planned past my work years `(15)`
- I'm tired of it but haven't looked at alternatives `(25)`
- I dread another forever-bill and want it gone before I retire `(35)`

### Q4. Does your coverage account for income your family loses if you're gone or can't work?
- Yes — payoff plus an income bridge for my spouse is built in `(5)`
- I covered the mortgage but not lost income `(15)`
- I haven't thought about the income side at all `(30)`
- No — one health event could wipe out the whole plan `(45)`

### Q5. Will your coverage still be there when you actually need it — or does it vanish at retirement?
- It's permanent/owned and won't disappear `(5)`
- Mostly mine, but some is tied to my job `(15)`
- A lot of it is employer coverage that ends when I leave `(30)`
- I'm relying on coverage that disappears right when risk peaks `(45)`

### Q6. If you died, do you actually know how the money would reach your family?
- Yes — beneficiaries, ownership, and payout path are clean `(5)`
- I think so, but I haven't verified the details `(15)`
- It's probably outdated — I haven't checked in years `(25)`
- No idea — there could be delays, conflict, or a frozen payout `(35)`

### Q7. Does your protection plan keep up as your mortgage drops and retirement nears?
- Yes — I review and adjust it every year `(5)`
- I set it once and haven't touched it since `(15)`
- It's drifting out of sync with my real situation `(30)`
- There's no plan to maintain it — it's set-and-forget-and-hope `(45)`

*Max possible: 295 (45+45+35+45+45+35+45).*

---

## 5. Elia Juarez — Retirement Paycheck Snapshot

- **Survey name:** `Elia Juarez — Retirement Paycheck Snapshot`
- **On Submit → Redirect URL:**
```
https://YOUR-DOMAIN/elia-juarezresults.html?score={{contact.score}}
```

### Q1. With no employer behind you, do you actually have a retirement "paycheck" plan?
- Yes — I know what my retirement income will be and how it's funded `(5)`
- I'm saving something, but there's no real income plan `(15)`
- I've been winging it — accounts, but no strategy `(30)`
- No plan at all — I just hope it works out later `(45)`

### Q2. Have you built your own "benefits package" to replace what an employer never gave you?
- Yes — retirement, protection, and disability are all covered `(5)`
- I have a couple of pieces, but big gaps remain `(15)`
- Just a random IRA or policy I set up once `(30)`
- Nothing structured — I'm completely on my own and exposed `(45)`

### Q3. Does your saving plan actually survive the lean months, not just the big ones?
- Yes — I have a baseline plus a surge rule for big months `(5)`
- I save hard in good months, then stall in slow ones `(15)`
- It's inconsistent and I always feel behind `(25)`
- I have no system — saving is pure guesswork `(35)`

### Q4. How handled are your quarterly taxes — system, or constant surprise bills?
- I have a tax rhythm and dedicated buckets — no surprises `(5)`
- I set some aside, but it's loose and stressful `(15)`
- I scramble every quarter and sometimes come up short `(30)`
- Taxes blindside me and raid money I needed elsewhere `(45)`

### Q5. If you couldn't work for months, would your family's income hold?
- Yes — I have income/disability protection in place `(5)`
- I have some savings that would last a little while `(15)`
- We'd get tight fast — there's no real backup `(30)`
- The income just stops — we'd be in serious trouble `(45)`

### Q6. If something happened to you, is your family actually protected?
- Yes — life insurance is right-sized and current `(5)`
- I have some coverage but I'm not sure it's enough `(15)`
- Just a small policy I bought without understanding it `(25)`
- No real coverage — my family would be on their own `(35)`

### Q7. Is your good income actually turning into long-term wealth, or just passing through?
- Yes — a consistent system builds wealth every month `(5)`
- I invest sometimes, but there's no steady plan `(15)`
- Money comes in big and disappears — nothing to show for it `(30)`
- I make good money and have built almost nothing lasting `(45)`

*Max possible: 295 (45+45+35+45+45+35+45).*
