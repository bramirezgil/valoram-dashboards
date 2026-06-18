# Qualification Survey — Retirement Confidence Assessment

Build this as a **Survey** in GoHighLevel, embed it in the landing page's opt-in
section, and use its logic to redirect each prospect to the right **results-page
segment** based on intent.

```
Landing page (#optin)  →  GHL survey  →  score/route  →  results page
 lead.ghlFormEmbed                         (3 segments)   ?segment=priority|qualified|nurture
```

- **Landing page:** `dist/tedos-retirement.html`
- **Results page:** `dist/tedos-retirement-results.html`  (segments: `priority`, `qualified`, `nurture`)

---

## 1. Survey questions

Keep it short (≈2 minutes). Q1–Q7 qualify; Q8–Q10 capture contact info on the
last slide.

| # | Question | Answer options | Used for |
|---|----------|----------------|----------|
| **Q1** | When do you plan to retire? | (a) Already retired (0–5 yrs) · (b) Within 1–2 years · (c) In 3–10 years · (d) More than 10 years away | Timeline / gate |
| **Q2** | What is your age range? | Under 50 · 50–57 · 58–67 · 68+ | Fit |
| **Q3** | Roughly how much do you have in investable assets (401k/IRA, brokerage, equity comp)? | Under $1M · $1M–$2M · $2M–$5M · $5M–$10M · $10M+ | Assets / gate |
| **Q4** | Approximate household income? | Under $200k · $200k–$300k · $300k–$600k · $600k–$900k · $900k+ | Fit |
| **Q5** | Do you have a **written** retirement income plan (what to withdraw, from where, and when)? | No, just accounts · Sort of, nothing formal · Yes, a written plan | Pain / intent |
| **Q6** | Is a major financial event coming in the next 12 months? (retirement date set, severance/early-retirement offer, business sale, inheritance, large RSU/option vest) | Yes · No / not sure | Urgency |
| **Q7** | Would you move $1M+ to a fiduciary if the plan were clearly better? | Yes · Maybe · No | Intent |
| **Q8** | First & last name | text | Contact |
| **Q9** | Email | email | Contact |
| **Q10** | Mobile phone | phone | Contact |

> Optional Q: "What's your #1 concern?" (Running out of money · A market crash near
> retirement · Paying too much in taxes/fees · Leaving a legacy) — great for
> personalizing follow-up; not required for routing.

---

## 2. Routing logic (intent → segment)

Evaluate top-to-bottom; first match wins.

**→ `nurture`** (not the right fit yet) if **any** of:
- Q1 = "More than 10 years away", **or**
- Q3 = "Under $1M", **or**
- Q4 = "Under $200k"

**→ `priority`** (hottest — fast-track) if **not nurture** **and**:
- (Q1 = "Within 1–2 years" **or** Q1 = "Already retired (0–5 yrs)" **or** Q6 = "Yes")
  **and** Q3 ∈ {$2M–$5M, $5M–$10M, $10M+}
  **and** Q7 = "Yes"

**→ `qualified`** (good fit) — everyone else.

| Segment | Redirect URL (set in GHL) |
|---|---|
| priority | `https://YOUR-LANDING-DOMAIN/tedos-retirement-results?segment=priority` |
| qualified | `https://YOUR-LANDING-DOMAIN/tedos-retirement-results?segment=qualified` |
| nurture | `https://YOUR-LANDING-DOMAIN/tedos-retirement-results?segment=nurture` |

> The results page also works without a param — it falls back to the `qualified`
> view — so a single default redirect is safe if you skip branching at first.

---

## 3. Build it in GoHighLevel

1. **Sites → Surveys → + Build New** (or **Forms → Surveys**). Add Q1–Q10.
2. **Tag by answer** (recommended) so routing + automations are easy:
   - Q3 "Under $1M" → tag `assets-under-1m`; "$2M–$5M/$5M–$10M/$10M+" → tag `assets-2m-plus`
   - Q1 "More than 10 years" → tag `timeline-10yr-plus`; "Within 1–2 years"/"Already retired" → tag `timeline-near`
   - Q6 "Yes" → tag `event-12mo`; Q7 "Yes" → tag `willing-move`
3. **Redirect on submit** — GHL surveys support per-path redirects:
   - In the survey builder open **Settings / Logic → On Submit → Redirect to URL**.
   - If your plan supports **conditional/branch logic**, add rules that map the
     conditions in §2 to the three URLs above.
   - If not, do the routing in a **Workflow** instead (next step) and set the
     survey's single On-Submit redirect to the `qualified` URL as the default.
4. **Workflow (robust routing + CRM):**
   - Trigger: **Survey Submitted** (this survey).
   - Create/Update Contact (name, email, phone from Q8–Q10).
   - Add **If/Else** branches using the tags from step 2 to mirror §2, and in each
     branch either notify the team (priority gets instant SMS/notification) and/or
     set the redirect if you route here.
   - Priority branch → notify a senior specialist immediately; Qualified →
     standard booking nudge; Nurture → enroll in the education/nurture sequence.
5. **Embed on the landing page:** in the survey, **Share → Embed → Inline**, copy
   the `<iframe …>` snippet, paste it into `lead.ghlFormEmbed` in
   `clients/tedos-retirement.json`, and re-run `node generate.js`. The dashed
   "Your GHL Survey Embeds Here" placeholder is replaced by your live survey.

---

## 4. After you go live
- Point the results-page CTAs at your real GHL calendar: set
  `business.bookingUrl` (used by `priority` + `qualified`) and the `nurture`
  segment's `ctaUrl` (resource link) in the config, then re-generate.
- Both files are static — host them per **GHL-DEPLOY.md** (Custom Code page or
  hosted file). Keep the results page on the same domain so the redirect URLs in
  §2 resolve.
