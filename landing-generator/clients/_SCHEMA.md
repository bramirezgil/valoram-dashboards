# Client config reference

One JSON file per client in `clients/`. Only `business.name` is truly required —
everything else has sensible defaults, and any section you omit is simply not
rendered. Run `node generate.js clients/<file>.json` to build it.

```jsonc
{
  "slug": "acme-insurance",          // output filename → dist/acme-insurance.html (defaults to file name)

  "business": {
    "name": "Acme Insurance Group",  // required
    "logoUrl": "",                   // optional image URL; falls back to a text wordmark
    "tagline": "Short positioning line shown in the footer/about panel",
    "phone": "(555) 123-4567",       // shows a click-to-call button
    "email": "hello@acme.com",
    "address": "Austin, TX",
    "bookingUrl": "https://...",     // GHL calendar link (used when lead.mode = booking)
    "industry": "Life insurance"     // used by the AI copywriter
  },

  "theme": {
    "brandColor": "#1B3A6B",         // headers, panels, dark accents
    "accentColor": "#F0891A",        // buttons, highlights, focus rings
    "font": "Montserrat"             // any Google font (Montserrat, Poppins, Inter, Lora, …)
  },

  "copy": {
    "heroEyebrow": "Small label above the headline",
    "heroHeadline": "Big promise — the main H1",
    "heroSubhead": "1–2 supporting sentences.",
    "heroCta": "Get My Free Quote",  // button text used everywhere
    "valueProps": [                  // "Why choose us" — 3–4 recommended
      { "title": "Independent", "body": "One sentence of benefit." }
    ],
    "aboutTitle": "About section heading",
    "aboutBody": "2–3 sentence story.",
    "finalCtaHeadline": "Closing call-to-action heading",
    "finalCtaSub": "One supporting sentence."
  },

  "services": [                      // omit to hide the services + stats section
    { "icon": "🛡️", "name": "Term Life", "description": "One sentence." }
  ],

  "testimonials": [                  // omit to hide; avatar initials are auto-derived
    { "quote": "What the client said.", "name": "Maria R.", "detail": "Austin, TX" }
  ],

  "faqs": [                          // omit to hide
    { "q": "How much does it cost?", "a": "Honest 1–2 sentence answer." }
  ],

  "lead": {
    "mode": "webhook",               // "booking" | "ghl-form" | "webhook"  (see GHL-DEPLOY.md)
    "bookingUrl": "",                // for booking mode (or use business.bookingUrl)
    "ghlFormEmbed": "<iframe …>",    // for ghl-form mode: paste GHL iframe snippet
    "webhookUrl": "https://…",       // for webhook mode: GHL inbound webhook URL
    "successMessage": "Thanks! We'll be in touch shortly."
  },

  "seo": {
    "title": "Page <title> (defaults to name — tagline)",
    "description": "Meta description (defaults to heroSubhead)"
  }
}
```

## Brief files (`*.brief.json`) — for the AI copywriter

A brief is a *smaller* input: fill in the facts, let `ai-copy.js` write `copy`,
`services`, and `faqs` for you. Fields: `slug`, `tone`, `serviceNames` (array of
plain names), `notes`, plus the same `business`, `theme`, `lead`, and optional
`testimonials` objects as above. The output is a full config written to
`clients/<slug>.json`.
