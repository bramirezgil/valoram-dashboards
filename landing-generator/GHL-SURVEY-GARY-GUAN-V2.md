# GHL Survey to Build — Gary Guan (First-Gen Tech Wealth)

Hand-off sheet for building Gary Guan's agent survey in GoHighLevel (**Sites → Surveys**). This **REPLACES** Gary's old RMD/Roth retiree survey.

---

## How to build it

1. **Create the survey** with the **7 questions** listed below.
2. Each question is **single-select (one answer / radio buttons)**.
3. Turn **Scoring ON** and set each answer's **points** to the number in `( )`.
4. Add contact fields (First name, Last name, Email, Phone) on the first slide.
5. **Publish**, then set the **completion redirect** (below) so the score carries to the results page.
6. Send the published survey's **inline embed code** back so it can be placed on the landing page (replaces the dashed "⟶ Your GHL … Survey Embeds Here" box in the opt-in section).

### How the score works
- Every answer adds its points. The 7 answers total **0 to 295** (five questions max out at 45, two at 35).
- Direction: **higher points = more gaps, more risk, more urgency.** The most-handled answer scores lowest (5); the most-exposed answer scores highest (45/35).
- The results page reads the raw total and picks the tier by **raw score band** (the ring still shows a 0–100 value):

| Total score | Result tier |
|---|---|
| 0 – 116 | **Strong Foundation** (optimize) |
| 117 – 205 | **Gaps to Close** (act soon) |
| 206 – 295 | **Action Needed Now** (urgent) |

### Completion redirect
Set **On Submit → Redirect URL** to Gary's results page, passing the score:
```
https://YOUR-DOMAIN/garyguanresults.html?score={{contact.score}}
```
(Replace `YOUR-DOMAIN` with the live host once known. `{{contact.score}}` passes the total automatically.)

---

# GARY GUAN
- **Survey name:** `Gary Guan — First-Gen Tech Wealth Scorecard`
- **Results page:** `garyguanresults.html`

**Q1. How is your RSU and equity compensation handled at tax time?**
- I have a proactive plan for vesting, withholding, and sell decisions `(5)`
- I cover the basics but know I'm leaving things on the table `(15)`
- My RSUs mostly catch me off guard each year `(30)`
- I have no real plan — equity taxes are a yearly surprise `(45)`

**Q2. How concentrated is your net worth in your employer's company stock?**
- Well diversified — company stock is a small, managed slice `(5)`
- Somewhat concentrated, but I'm trimming it down deliberately `(15)`
- Heavily concentrated and I haven't addressed it `(30)`
- The bulk of my wealth is one company's stock and it worries me `(45)`

**Q3. Do you have a proactive tax strategy for your high W-2 income and California taxes?**
- Yes — a coordinated, forward-looking tax plan `(5)`
- A few moves in place, but nothing comprehensive `(15)`
- Mostly just whatever my CPA files in April `(30)`
- No real strategy — I can feel the tax drag every year `(45)`

**Q4. How is your idle cash positioned?**
- It's intentionally allocated — emergency reserve plus a clear plan for the rest `(5)`
- Most of it is working, but some sits longer than it should `(15)`
- A large chunk just sits in checking/savings doing nothing `(30)`
- I have significant cash idle with no plan for it at all `(45)`

**Q5. How would you describe your overall investment plan?**
- One coordinated, written strategy aligned to my goals `(5)`
- A general idea, but nothing unified or written down `(15)`
- Scattered accounts and ad-hoc decisions with no real plan `(30)`
- No real investment plan — it's fragmented and reactive `(45)`

**Q6. If your income stopped tomorrow, how protected are you and your family?**
- Well covered — income protection and life insurance are right-sized `(5)`
- Some coverage, but I know there are gaps `(15)`
- Thin — mostly just what my employer provides `(25)`
- Exposed — one event could put my family at real risk `(35)`

**Q7. Are your estate and legacy documents in place and current?**
- Yes — will/trust, beneficiaries, and directives are current `(5)`
- Some pieces are done but not everything `(15)`
- It's on my list but I haven't gotten to it `(25)`
- This is a real blind spot — nothing is set up `(35)`

*Max possible: 295 (45+45+45+45+45+35+35).*
