# GHL Surveys to Build — Batch 3 (Harley · Sharon)

Hand-off sheet for building two agent surveys in GoHighLevel (**Sites → Surveys**).

---

## How to build each one (same for both)

1. **Create the survey** with the **7 questions** listed for that agent.
2. Each question is **single-select (one answer / radio buttons)**.
3. Turn **Scoring ON** and set each answer's **points** to the number in `( )`.
4. Add contact fields (First name, Last name, Email, Phone) on the first slide.
5. **Publish**, then set the **completion redirect** (below) so the score carries to the results page.
6. Send the published survey's **inline embed code** back so it can be placed on the landing page (replaces the dashed "⟶ Your GHL … Survey Embeds Here" box in the opt-in section).

### How the score works
- Every answer adds its points. The 7 answers total **0 to 295** (five questions max out at 45, two at 35).
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

---

# 1) HARLEY PALAGANAS
- **Survey name:** `Harley Palaganas — Retirement Paycheck Snapshot`
- **Results page:** `harleypalaganasresults.html`

**Q1. How many years until your planned USPS retirement?**
- 15+ years `(10)`
- 8–15 years `(25)`
- 3–7 years `(35)`
- Under 3 years `(45)`

**Q2. How would you describe your current retirement income plan?**
- A clear written plan with a tax-smart income strategy `(5)`
- A general idea, but nothing written down `(20)`
- I'm mostly counting on FERS + TSP and hoping it works out `(35)`
- I honestly don't know where I stand `(45)`

**Q3. Have you calculated what FERS, TSP, and Social Security will actually replace vs. your current take-home pay?**
- Yes — I know my exact monthly gap `(5)`
- I've done a rough estimate `(20)`
- Not yet, but I've been meaning to `(35)`
- No — and honestly I've been avoiding it `(45)`

**Q4. How much do you have in your TSP?**
- $600,000 or more `(5)`
- $300,000–$600,000 `(15)`
- $150,000–$300,000 `(25)`
- Under $150,000 `(35)`

**Q5. Have you made your survivor benefit and FEGLI-vs-private decisions?**
- Yes — both decided and right-sized `(5)`
- One decided, not the other `(20)`
- Not yet — I'm unsure which is right `(35)`
- No — and it worries me `(45)`

**Q6. Do you have a tax strategy for your TSP withdrawals and Social Security timing?**
- Yes — a tax-smart withdrawal plan `(5)`
- I know strategies exist but haven't set one up `(20)`
- I haven't thought much about taxes in retirement `(35)`
- Taxes in retirement are my biggest financial fear `(45)`

**Q7. Are your beneficiaries, survivor elections, and family protection current and organized?**
- Yes — everything is up to date `(5)`
- Some things are in order but not everything `(15)`
- It's on my list but I haven't gotten to it `(25)`
- This is a real blind spot — nothing is organized `(35)`

*Max possible: 295 (45+45+45+35+45+45+35).*

---

# 2) SHARON WEBSTER
- **Survey name:** `Sharon Webster — Financial Certainty Snapshot`
- **Results page:** `sharonwebsterresults.html`

**Q1. How soon do you want a fully coordinated plan in place (taxes, cash flow, protection)?**
- 5+ years out — no rush `(10)`
- In the next few years `(25)`
- Within the next 12 months `(35)`
- Yesterday — I feel exposed right now `(45)`

**Q2. How would you describe your current financial strategy?**
- One coordinated, written plan with a quarterback `(5)`
- A general idea, but nothing unified `(20)`
- Pieces handled by separate advisors in isolation `(35)`
- No real strategy — it's fragmented `(45)`

**Q3. Do you know your realistic after-tax retirement paycheck and the gap you must fund?**
- Yes — I know both numbers `(5)`
- I've done a rough estimate `(20)`
- Not yet, but I plan to `(35)`
- No — I really have no idea `(45)`

**Q4. If you couldn't work for 6–12 months, how much runway do you truly have?**
- 12+ months — clearly covered `(5)`
- 6–12 months `(15)`
- 3–6 months `(25)`
- Under 3 months / I'm not sure `(35)`

**Q5. How exposed are you on protection (key-person, disability, liability, continuity)?**
- Well covered and coordinated `(5)`
- Some coverage, but gaps remain `(20)`
- Thin — I know there are holes `(35)`
- Exposed — one event could break things `(45)`

**Q6. Do you have a clean, compliant tax strategy that reduces unnecessary tax drag?**
- Yes — a proactive, coordinated tax plan `(5)`
- A few moves in place `(20)`
- Mostly just what my CPA files `(35)`
- No real tax strategy — I can feel it leaking `(45)`

**Q7. Are your continuity/buy-sell, beneficiaries, and estate/legacy documents current?**
- Yes — everything is organized and current `(5)`
- Some things are in order but not everything `(15)`
- It's on my list but I haven't gotten to it `(25)`
- This is a real blind spot — nothing is organized `(35)`

*Max possible: 295 (45+45+45+35+45+45+35).*
