# GHL Survey to Build — Brenen Riggs (Wheel-Down Retirement Scorecard)

Build this survey in the GoHighLevel UI (the API can't create surveys). Turn **Scoring ON** and set each answer's **points** to the number shown in `( )`. Publish, then set the completion redirect so the score carries to the results page.

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
Set **On Submit → Redirect URL** to:
```
https://YOUR-DOMAIN/brenen-riggsresults.html?score={{contact.score}}
```
(Replace `YOUR-DOMAIN` with the live host. The `{{contact.score}}` merge field passes the total automatically.)

---

- **Survey name:** `Brenen Riggs — Wheel-Down Retirement Scorecard`

### Q1. If you wanted to put the wheel down in the next few years, do you actually know your retirement number?
- Yes — I know my number and I'm on track to hit it `(5)`
- I have a rough idea, but nothing on paper `(15)`
- Not really — I keep meaning to figure it out `(30)`
- No idea — I just keep running loads and hope it works out `(45)`

### Q2. If you couldn't drive for 6–12 months (injury, health, DOT medical), what happens to your income?
- I have disability/income protection that would cover us `(5)`
- I have some savings that would last a few months `(15)`
- We'd get tight fast and start burning reserves `(30)`
- The income stops and the bills don't — we'd be in trouble `(45)`

### Q3. How is your trucking business set up for taxes and retirement?
- Structured on purpose (entity + tax plan + retirement contributions) `(5)`
- I have an LLC/S-corp but no real tax or retirement strategy `(15)`
- Sole proprietor, my CPA just files what I hand them `(25)`
- I'm basically winging the tax and money side `(35)`

### Q4. Where is most of your money sitting right now?
- Invested and working toward retirement on purpose `(5)`
- Split between the business and some savings, no clear plan `(15)`
- Mostly cash in the bank "just in case" `(30)`
- Tied up in the truck and equipment — little set aside `(45)`

### Q5. Is your family protected if something happens to you?
- Yes — life insurance is right-sized and beneficiaries are current `(5)`
- I have some coverage but haven't looked at it in years `(15)`
- Just whatever came with a loan or association `(30)`
- No real coverage — they'd be on their own `(45)`

### Q6. Do you have a plan for the truck, authority, and business when you stop driving?
- Yes — a clear exit/wind-down or transfer plan `(5)`
- I've thought about it but nothing is written down `(15)`
- I figure I'll just sell the truck when the time comes `(25)`
- No plan at all — I haven't pictured stopping `(35)`

### Q7. Who is coordinating your retirement, taxes, protection, and estate into one plan?
- One coordinated, written plan I actually follow `(5)`
- A couple of pieces, but nobody connects them `(15)`
- Scattered — a policy here, an account there `(30)`
- Nobody — it's all in my head and the road comes first `(45)`

*Max possible: 295 (45+45+45+45+45+35+35).*
