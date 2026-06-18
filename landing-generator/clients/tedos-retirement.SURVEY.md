# Qualification Survey — Retirement Confidence Assessment

Build this as a **Survey** in GoHighLevel, embed it in the landing page's opt-in
section, and use the **score** below to redirect each prospect to the right
**results-page segment**.

```
Landing page (#optin)  →  GHL survey  →  score + gates  →  results page
 lead.ghlFormEmbed                          (3 segments)   ?segment=priority|qualified|nurture
```

- **Landing page:** `dist/tedos-retirement.html`
- **Results page:** `dist/tedos-retirement-results.html`  (segments: `priority`, `qualified`, `nurture`)

---

## 1. Survey questions + point values

Keep it ~2 minutes. **Q1–Q8 are scored; Q9–Q11 capture contact info** on the
last slide. Points reflect intent + fit (higher = hotter).

### Q1. When do you plan to retire?
| Answer | Points |
|---|---|
| Within 1–2 years | **30** |
| Already retired (0–5 yrs) | **25** |
| In 3–10 years | **20** |
| More than 10 years away | **0**  ⛔ *gate → nurture* |

### Q2. What is your age range?
| Answer | Points |
|---|---|
| 58–67 | **15** |
| 50–57 | **12** |
| 68+ | **8** |
| Under 50 | **3** |

### Q3. Roughly how much do you have in investable assets? *(401k/IRA, brokerage, equity comp)*
| Answer | Points |
|---|---|
| $10M+ | **30** |
| $5M–$10M | **28** |
| $2M–$5M | **25** |
| $1M–$2M | **12** |
| Under $1M | **0**  ⛔ *gate → nurture* |

### Q4. Approximate household income?
| Answer | Points |
|---|---|
| $900k+ | **12** |
| $600k–$900k | **10** |
| $300k–$600k | **8** |
| $200k–$300k | **5** |
| Under $200k | **0**  ⛔ *gate → nurture* |

### Q5. Do you have a *written* retirement income plan? *(what to withdraw, from where, and when)*
| Answer | Points |
|---|---|
| No, just accounts | **15** |
| Sort of, nothing formal | **10** |
| Yes, a written plan | **3** |

### Q6. Is a major financial event coming in the next 12 months? *(retirement date set, severance/early-retirement offer, business sale, inheritance, large RSU/option vest)*
| Answer | Points |
|---|---|
| Yes | **20** |
| No / not sure | **0** |

### Q7. Would you move $1M+ to a fiduciary if the plan were clearly better?
| Answer | Points |
|---|---|
| Yes | **25** |
| Maybe | **12** |
| No | **0**  🔒 *caps segment at `qualified` (never `priority`)* |

### Q8. What is your #1 concern? *(bonus — emotional trigger)*
| Answer | Points |
|---|---|
| A market crash near retirement | **12** |
| Running out of money | **12** |
| Paying too much in taxes/fees | **8** |
| Leaving a legacy | **6** |

### Q9. First & last name — *text*
### Q10. Email — *email*
### Q11. Mobile phone — *phone*

**Maximum possible score: 159 points.**

---

## 2. Scoring → segment

Apply the gates first, then the score.

1. **Gates (force `nurture`, regardless of score):**
   Q1 = "More than 10 years away" **OR** Q3 = "Under $1M" **OR** Q4 = "Under $200k".
2. **Cap:** if Q7 = "No", the prospect can be `qualified` at most — never `priority`.
3. **Score thresholds** (sum of Q1–Q8):

| Total score | Segment | Redirect URL |
|---|---|---|
| **110–159** | `priority` | `…/tedos-retirement-results?segment=priority` |
| **60–109** | `qualified` | `…/tedos-retirement-results?segment=qualified` |
| **0–59** (or any gate) | `nurture` | `…/tedos-retirement-results?segment=nurture` |

**Worked examples**
- 1–2 yrs (30) + 58–67 (15) + $5–10M (28) + $600–900k (10) + no plan (15) + event Yes (20) + willing Yes (25) + crash (12) = **155 → priority**
- 3–10 yrs (20) + 50–57 (12) + $2–5M (25) + $300–600k (8) + sort-of plan (10) + no event (0) + Maybe (12) + taxes (8) = **95 → qualified**
- Already retired (25) + 68+ (8) + $1–2M (12) + $200–300k (5) + has plan (3) + no event (0) + No (0) + legacy (6) = **59 → nurture**

> Tuning: raise the `priority` floor to ~120 to make it more exclusive, or lower
> the `qualified` floor to ~50 to let more through. The asset gate ($1M) is the
> main lever for overall lead quality — bump to $2M if you only want larger
> households.

---

## 3. Build it in GoHighLevel

GHL surveys don't add numbers on their own, so use one of these:

### Option A — Tag-based tiers (fastest, no math)
Approximates the scoring with simple rules.
1. **Tag by answer** as people respond (Survey settings → per-answer tags):
   - Q3 "$2M–$5M/$5M–$10M/$10M+" → `assets-2m-plus`; "Under $1M" → `gate-assets`
   - Q1 "Within 1–2 years"/"Already retired" → `timeline-near`; "More than 10 years" → `gate-timeline`
   - Q4 "Under $200k" → `gate-income`
   - Q6 "Yes" → `event-12mo`; Q7 "Yes" → `willing-move`; "No" → `cap-qualified`
2. **Workflow** (Trigger: *Survey Submitted*) with If/Else:
   - **Nurture** if any of `gate-assets` / `gate-timeline` / `gate-income`.
   - **Priority** if `assets-2m-plus` AND `willing-move` AND (`timeline-near` OR `event-12mo`) AND NOT `cap-qualified`.
   - **Qualified** otherwise.
   - In each branch, set the redirect (below) and your notifications.

### Option B — True numeric scoring (matches §1 exactly)
1. Create a **custom field** `assessment_score` (number) on the contact.
2. Workflow (Trigger: *Survey Submitted*) → for each scored answer, an **If/Else**
   branch that adds the points via a **Math Operation** action into
   `assessment_score` (start from 0).
3. Apply the gates (set segment = nurture) and the Q7 cap.
4. Compare `assessment_score` to the thresholds in §2 to pick the segment.

### Redirect (both options)
Set the survey's **On Submit → Redirect to URL** per branch (or via the workflow):
- priority → `https://YOUR-DOMAIN/tedos-retirement-results?segment=priority`
- qualified → `https://YOUR-DOMAIN/tedos-retirement-results?segment=qualified`
- nurture → `https://YOUR-DOMAIN/tedos-retirement-results?segment=nurture`

> If you can't branch the redirect, set a single default to the `qualified` URL —
> the results page falls back to the `qualified` view when no `?segment=` is present.

### Embed on the landing page
Survey → **Share → Embed → Inline**, copy the `<iframe …>`, paste it into
`lead.ghlFormEmbed` in `clients/tedos-retirement.json`, and re-run
`node generate.js clients/tedos-retirement.json`. The dashed
"Your GHL Survey Embeds Here" placeholder is replaced by your live survey.

---

## 4. Before you go live
- Notifications: `priority` → instant SMS/notify a senior specialist; `qualified`
  → standard booking nudge; `nurture` → education/nurture sequence.
- Point the results CTAs at your real calendar (`business.bookingUrl`, already set
  to your GHL booking widget) and the `nurture` resource link (`ctaUrl`), then
  re-generate.
- Host the results page on the same domain so the redirect URLs resolve.
