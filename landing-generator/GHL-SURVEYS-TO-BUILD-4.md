# GHL Surveys to Build — Batch 4 (Donnis · Cindy · Dawn · Dial · Ejay)

Hand-off sheet for building five agent surveys in GoHighLevel (**Sites → Surveys**).

---

## How to build each one (same for all five)

1. **Create the survey** with the **7 questions** listed for that agent.
2. Each question is **single-select (one answer / radio buttons)** with **exactly 4 options**.
3. Turn **Scoring ON** and set each answer's **points** to the number in `( )`.
4. Add contact fields (First name, Last name, Email, Phone) on the first slide.
5. **Publish**, then set the **completion redirect** (below) so the score carries to the results page.
6. Send the published survey's **inline embed code** back so it can be placed on the landing page (replaces the dashed "⟶ Your GHL … Survey Embeds Here" box in the opt-in section).

### How the score works
- Every answer adds its points. The 7 answers total **0 to 295** (five questions max out at 45, two at 35).
- **Direction:** higher points = more gaps / risk / urgency. The most-handled (best) answer scores lowest (5); the most-exposed answer scores highest (45 or 35). A high total → "Action Needed Now".
- The results page reads the raw total and picks the tier by **raw score band** (the ring still shows a 0–100 value):

| Total score | Result tier |
|---|---|
| 0 – 116 | **Strong Foundation** (optimize) |
| 117 – 205 | **Gaps to Close** (act soon) |
| 206 – 295 | **Action Needed Now** (urgent) |

### Completion redirect per agent
Set **On Submit → Redirect URL** to the agent's results page, passing the score:
```
https://YOUR-DOMAIN/<results-page>?score={{contact.score}}
```
(Replace `YOUR-DOMAIN` with the live host once known. `{{contact.score}}` passes the total automatically.)

### Point pattern (every survey)
- **5 questions** use **45 / 30 / 15 / 5** (max 45 each).
- **2 questions** use **35 / 25 / 15 / 5** (max 35 each).
- Max total = (5 × 45) + (2 × 35) = **295**.

---

# 1) DONNIS HISKETT
- **Survey name:** `Donnis Hiskett — Retirement Lever Readiness Scorecard`
- **Results page:** `donnis-hiskettresults.html`
- **Audience:** high-earning self-employed 1099 entertainment pros (producers, directors, editors, DPs, touring creatives) with volatile income and no employer benefits.

**Q1. How would you describe your retirement setup as a 1099 entertainment pro?**
- A funded plan built for self-employment (Solo 401(k)/SEP/Cash Balance) I contribute to every year `(5)`
- An IRA or old account I fund when I remember `(15)`
- I've been meaning to set one up but haven't `(30)`
- Nothing real — my "plan" is to keep booking work `(45)`

**Q2. When a big-income year hits (new show, album, tour, contract), what happens to the tax bill?**
- I run a proactive, CPA-coordinated strategy before year-end `(5)`
- I make a few moves but know I'm leaving deductions on the table `(15)`
- I just pay whatever my CPA files in the spring `(30)`
- I write a painful check every big year and dread it `(45)`

**Q3. If work dried up tomorrow (COVID-style), how long could your household run on reserves?**
- 12+ months of runway, clearly mapped `(5)`
- 6–12 months `(15)`
- 3–6 months `(30)`
- Under 3 months / I honestly don't know `(45)`

**Q4. How is your healthcare handled without an employer plan?**
- A coverage solution I trust that fits my 1099 reality `(5)`
- A plan in place, but I'm not sure it's right or cost-effective `(15)`
- A bare-bones plan I picked in a hurry `(30)`
- I'm underinsured or gambling without real coverage `(45)`

**Q5. Do you have income/disability protection so a slow season or injury doesn't wipe out progress?**
- Yes — disability and income protection are right-sized `(5)`
- Some coverage, but I know there are gaps `(15)`
- Not yet — it's on my list `(30)`
- No — one bad break and the whole plan stops `(45)`

**Q6. How coordinated are your CPA, retirement, and insurance decisions?**
- One coordinated plan — they actually talk to each other `(5)`
- Mostly aligned, a few loose ends `(15)`
- Separate pros working in silos `(25)`
- Totally piecemeal — nobody's quarterbacking it `(35)`

**Q7. Are your beneficiaries, family protection, and a spouse-readable view of the plan current?**
- Yes — everything is organized and my spouse can see it `(5)`
- Some things are in order but not everything `(15)`
- It's on my list but I haven't gotten to it `(25)`
- This is a real blind spot — nothing is organized `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

# 2) CINDY JOHNSON
- **Survey name:** `Cindy Johnson — Retirement Paycheck Snapshot`
- **Results page:** `cindy-johnsonresults.html`
- **Audience:** Tennessee beauty pros 30+ (salon suite owners, independent stylists/colorists) with strong-but-irregular income and physical work they can't do forever.

**Q1. What is your real plan to stop working behind the chair?**
- A written retirement income plan with a target start age `(5)`
- A rough idea, but nothing written down `(15)`
- I'm counting on selling the salon/suite or real estate someday `(30)`
- "Work a little longer" — and hope my body cooperates `(45)`

**Q2. Do you know the monthly retirement paycheck you'll actually need — and the gap after Social Security?**
- Yes — I know my number and my gap `(5)`
- I've done a rough estimate `(15)`
- Not yet, but I plan to `(30)`
- No idea — I haven't run the numbers `(45)`

**Q3. With irregular income (commission, tips, slow seasons), how do you save for retirement?**
- A baseline contribution plus "surge deposits" in busy months `(5)`
- I save consistently when I can `(15)`
- I save "whatever's left" after the month `(30)`
- Saving falls off whenever a slow month hits `(45)`

**Q4. How exposed is your retirement money to market swings and taxes?**
- I have predictable, guaranteed-income pieces built in `(5)`
- Mostly market-based, but I've thought about it `(15)`
- It's all in the market and I worry about a drop `(30)`
- I don't really know where my money is exposed `(45)`

**Q5. If your body forced you to stop early, would the income still show up?**
- Yes — my plan doesn't depend on me working `(5)`
- Partly — I'd have to cut back hard `(15)`
- Not really — income stops when I stop `(30)`
- No — I'd be in serious trouble `(45)`

**Q6. Is your family protected if life happens before retirement (beneficiaries, coverage)?**
- Yes — beneficiaries current and coverage in place `(5)`
- Some of it is set, not all `(15)`
- It's on my list but undone `(25)`
- Nothing is organized — a real blind spot `(35)`

**Q7. Do you have living benefits / protection in case of illness or injury?**
- Yes — coverage with living benefits is in place `(5)`
- Basic coverage, but probably not enough `(15)`
- Very little — I've been meaning to fix it `(25)`
- None — I'm completely exposed `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

# 3) DAWN SZUGYI
- **Survey name:** `Dawn Szugyi — Retirement Paycheck Snapshot`
- **Results page:** `dawn-szugyiresults.html`
- **Audience:** high-earning owner-operator business owners ($250k–$750k income; OR/CO/TX/AZ) with scattered accounts, painful tax bills, and lawsuit/key-person exposure.

**Q1. How coordinated is your overall financial strategy (CPA, attorney, investments)?**
- One integrated plan with a quarterback tying it together `(5)`
- Mostly aligned, but a few pieces work in isolation `(15)`
- Each pro does their own thing, nobody coordinates `(30)`
- It's a scattered "junk drawer" — nothing connects `(45)`

**Q2. When you write your tax check each year, how do you feel?**
- Confident — I run proactive, legal tax strategy year-round `(5)`
- Okay — a few moves in place, but missing some `(15)`
- Frustrated — I know I'm leaving strategies on the table `(30)`
- It's a painful six-figure check and I dread it `(45)`

**Q3. Can you confidently answer "Am I actually on track to retire, and when?"**
- Yes — I know my date and my retirement paycheck range `(5)`
- I've got a rough estimate `(15)`
- Not really — I make good money but I'm guessing `(30)`
- No — retirement is a complete moving target `(45)`

**Q4. How exposed is your business and family to a "one bad day" event (lawsuit, key-person, health)?**
- Well covered — protection is coordinated and pressure-tested `(5)`
- Some coverage, but I know there are gaps `(15)`
- Thin — one event could hit business and family at once `(30)`
- Wide open — I'm overexposed and underinsured `(45)`

**Q5. Does your business actually support your retirement and an eventual exit?**
- Yes — a business-owner retirement stack is built and funded `(5)`
- Started, but cash is trapped in the wrong places `(15)`
- Not yet — the business IS my only plan `(30)`
- No structure at all — exit and retirement are unplanned `(45)`

**Q6. How are your investments governed across all your accounts?**
- Clear rules aligned to my tax and retirement plan `(5)`
- A general approach, but not consistent `(15)`
- Money in many places with no shared rules `(25)`
- Reactive and scattered — decisions feel random `(35)`

**Q7. Are your legacy, estate documents, and business continuity/exit plan current?**
- Yes — beneficiaries, estate, and continuity all coordinated `(5)`
- Some pieces done, not all `(15)`
- On my list but unfinished `(25)`
- Nothing's in place — my family could be left with a mess `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

# 4) DIAL DACE
- **Survey name:** `Dial Dace — Retirement Lever Readiness Scorecard`
- **Results page:** `dial-daceresults.html`
- **Audience:** high-income W-2 professionals (RN leaders/CRNAs/nurse managers, engineers) 45–60, 5–15 years out, with autopilot 401(k)/403(b) and expiring term policies.

**Q1. How closely have you reviewed your 401(k)/403(b) fees and allocation lately?**
- Reviewed recently — fees and allocation match my timeline `(5)`
- Looked once a while back, roughly comfortable `(15)`
- It's been on autopilot for years `(30)`
- I have no idea what I'm paying or how it's invested `(45)`

**Q2. Are you taking the right amount of risk this close to retirement?**
- Yes — risk is dialed to my 5–15 year timeline `(5)`
- Probably close, but I haven't checked `(15)`
- Likely too aggressive (target-date or concentrated stock/RSUs) `(30)`
- No clue — a market drop now would gut me `(45)`

**Q3. What's the status of your term life insurance?**
- Right-sized coverage that fits my life today `(5)`
- In place, but I haven't reviewed it recently `(15)`
- A 30-year term that's expiring or premiums are jumping `(30)`
- Expiring soon with no plan — family still exposed `(45)`

**Q4. You make great money — does it feel like it's working toward retirement?**
- Yes — cash flow is directed on purpose `(5)`
- Mostly, with some leaks `(15)`
- I earn well but money slips out and I'm not sure where `(30)`
- It feels leaky and I don't feel retirement-ready at all `(45)`

**Q5. Is your plan coordinated across taxes, insurance, and investments?**
- Yes — one coordinated plan, tax-aware `(5)`
- Partly — a few pieces connect `(15)`
- No — random accounts and products, no coordination `(30)`
- I don't even know what I own or how it fits `(45)`

**Q6. Do you have a plan to protect retirement income from a market drop near the finish line?**
- Yes — a protected/safety bucket is part of my plan `(5)`
- I understand the risk but haven't acted `(15)`
- Not really — I'm fully exposed to sequence risk `(25)`
- I've never thought about it `(35)`

**Q7. Do you have a clear, written retirement roadmap that tells you the next move?**
- Yes — a step-by-step roadmap with timelines `(5)`
- A general direction, nothing written `(15)`
- Not yet — I keep meaning to build one `(25)`
- No — I'm guessing and hoping it works out `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*

---

# 5) EJAY CRUZ
- **Survey name:** `Ejay Cruz — Retirement Paycheck Snapshot`
- **Results page:** `ejay-cruzresults.html`
- **Audience:** Kaiser Permanente nurses (often charge nurse/clinical leader) in California, 52–58, 5–10 years out, with a vested KP pension + 401(k)/403(b) + Social Security and burnout pushing an exit date.

**Q1. Do you have a single clear retirement picture across pension, 401(k)/403(b), and Social Security?**
- Yes — all on one page with a target retirement date `(5)`
- A rough idea, nothing tied together `(15)`
- The pieces are in separate buckets I haven't combined `(30)`
- No real picture at all — it still feels like a guess `(45)`

**Q2. How confident are you in your Kaiser pension decisions (timing + survivor options)?**
- Confident — I understand my options and survivor tradeoffs `(5)`
- Somewhat — I get the basics `(15)`
- Unsure — the choices feel permanent and confusing `(30)`
- No idea — and a wrong pick could hurt my spouse `(45)`

**Q3. Do you know your monthly retirement paycheck after taxes and real-life expenses?**
- Yes — I know my monthly income number `(5)`
- A rough estimate `(15)`
- Not really — I've only looked at account balances `(30)`
- No — I have no idea what retirement actually pays me `(45)`

**Q4. Is your money protected against a market drop in the final stretch?**
- Yes — income sources are aligned to reduce that risk `(5)`
- Somewhat — I've thought about it but not acted `(15)`
- No — a drop right before I retire scares me `(30)`
- I'm fully exposed and don't know what to do `(45)`

**Q5. Do you have a tax-smart withdrawal plan for pension + Social Security + accounts?**
- Yes — a coordinated, tax-aware withdrawal order `(5)`
- A few ideas, nothing formal `(15)`
- No — I expect tax surprises (IRMAA, RMDs, etc.) `(30)`
- I've never considered the tax side at all `(45)`

**Q6. Have you chosen a Social Security claiming strategy that fits your pension and spouse?**
- Yes — a deliberate claiming plan coordinated with my spouse `(5)`
- I have a leaning but haven't confirmed it `(15)`
- Not yet — I'll just take it when I retire `(25)`
- No plan — I don't know how timing affects survivor benefits `(35)`

**Q7. Are your beneficiaries, insurance, and estate documents current to protect your spouse?**
- Yes — beneficiaries, coverage, and estate docs all current `(5)`
- Some are updated, not all `(15)`
- On my list but not done `(25)`
- Outdated or missing — my spouse could be exposed `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*
