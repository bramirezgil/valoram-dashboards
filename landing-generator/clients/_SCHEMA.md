# Client config reference

One JSON file per client in `clients/`. The page is a **long-form sales layout**
with alternating light/dark sections, in this order:

```
hero → problem → results (+stats) → distinction → audience → offer (+how-it-works)
     → testimonials → opt-in form → FAQ → final CTA
```

**Every section is optional** — omit a block and it simply isn't rendered.
Colors come entirely from `theme`. Run `node generate.js clients/<file>.json`.

### Emphasis accent
In any **headline/title** field, wrap 2–4 words in `*asterisks*` to render them
in the accent color: `"Keep More, *Protect More*, and Have a Plan"`.

```jsonc
{
  "slug": "acme",                    // → dist/acme.html

  "business": {
    "name": "Cornerstone Life",      // required
    "logoUrl": "",                   // optional image; else a text wordmark
    "tagline": "…", "phone": "(512) 555-0142", "email": "…",
    "address": "Austin, TX", "bookingUrl": "https://…", "industry": "Insurance"
  },

  "theme": { "brandColor": "#1B3A6B", "accentColor": "#F0891A", "font": "Montserrat" },

  "hero": {                          // light
    "eyebrow": "◆ Free Review",
    "headline": "Discover How We Help *High-Earning Families* Retire on Their Terms",
    "subhead": "1–2 supporting sentences.",
    "cta": "Get My Free Review"      // button text reused on EVERY button + header
  },

  "problem": {                       // dark — "why this exists"
    "eyebrow": "Why This Exists",
    "title": "Most Families Have A *Planning* Problem",
    "items": [ { "title": "≤5 words", "body": "1–2 sentences." } ],   // numbered 01,02,03…
    "transition": "One punchy line (may use *asterisks*)."
  },

  "results": {                       // light — "what you can achieve"
    "eyebrow": "What You Can Achieve", "title": "Keep More, *Protect More*",
    "intro": "Optional intro sentence.",
    "items": [ { "icon": "💵", "title": "…", "body": "…" } ],          // icon = emoji/glyph
    "stats": [ { "num": "$1,200+", "label": "…", "desc": "…" } ]       // num = short
  },

  "distinction": {                   // dark — "us vs them" comparison
    "eyebrow": "The Core Distinction", "title": "The Biggest Myth *Families Believe*",
    "left":  { "label": "Typical Agent",      "heading": "Selling A Policy",  "points": ["…","…"] },
    "right": { "label": "Coordinated Advisor", "heading": "Building A Plan",   "points": ["…","…"] },
    "close": "1–2 sentence takeaway (may use *asterisks*)."
  },

  "audience": {                      // light — "who this is for"
    "eyebrow": "Is This Right For You?", "title": "Who This Is *Built For*",
    "items": [ { "icon": "👪", "title": "…", "body": "…" } ],
    "notFor": "One sentence on who it's NOT for."
  },

  "offer": {                         // dark — "what you get" + how-it-works
    "eyebrow": "The Free Review", "title": "What You Get When You *Book*",
    "intro": "Optional intro.",
    "tag": "Complimentary", "offerTitle": "…", "offerDesc": "…",
    "deliverables": [ { "title": "…", "desc": "…" } ],
    "stepsTitle": "How It Works",
    "steps": [ { "title": "…", "body": "…" } ]                         // numbered 1,2,3,4
  },

  "testimonials": [                  // light — omit to hide; initials auto-derived
    { "quote": "…", "name": "Maria R.", "detail": "Austin, TX" }
  ],

  "faqs": [ { "q": "…", "a": "…" } ],// dark — omit to hide

  "finalCta": {                      // dark
    "eyebrow": "One Step Away", "headline": "What May Be *Missing*",
    "subhead": "…", "scarcity": "Limited sessions available each week"
  },

  "lead": {                          // the conversion section (#optin) — always rendered
    "mode": "webhook",               // "booking" | "ghl-form" | "webhook"  (see GHL-DEPLOY.md)
    "bookingUrl": "", "ghlFormEmbed": "<iframe …>", "webhookUrl": "https://…",
    "successMessage": "…",
    "formEyebrow": "Take The First Step", "formTitle": "Book Your *Free Review*",
    "formIntro": "…",
    "includes": [ "What they get when they submit", "…" ]
  },

  "seo": { "title": "≤60 chars", "description": "≤155 chars" }
}
```

## Brief files (`*.brief.json`) — for the AI copywriter

Fill in only the facts; `ai-copy.js` writes every section above for you. Fields:
`slug`, `tone`, `serviceNames` (array of plain names), `notes`, plus `business`,
`theme`, `lead`, and optional `testimonials`. Output is a full config at
`clients/<slug>.json`.
