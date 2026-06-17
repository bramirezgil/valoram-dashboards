# Valoram Landing Page Generator

A **plug-and-play, config-driven** system for spinning up polished marketing
landing pages for clients — one short config (or one short brief) per client,
one command, one finished page you paste straight into **GoHighLevel**.

```
brief.json ──(ai-copy.js)──▶ client.json ──(generate.js)──▶ dist/client.html ──▶ paste into GHL
   you fill in              AI writes the copy        merge into template        Custom Code element
```

Pages are **self-contained** (HTML + CSS + a little JS in one file), fully
responsive, and themed entirely from each client's brand/accent color. They
follow a proven **long-form sales structure** with alternating light/dark
sections:

```
hero → problem ("why this exists") → results + stats → distinction (us vs them)
     → audience ("who it's for") → offer + how-it-works → testimonials
     → opt-in form → FAQ → final CTA
```

Every section is optional — omit a block in the config and it isn't rendered.
In any headline/title, wrap words in `*asterisks*` to accent them in the brand
color.

---

## Quick start

```bash
cd landing-generator

# 1. (Optional) let Claude draft the copy from a short brief
export ANTHROPIC_API_KEY=sk-ant-...
npm install                       # installs @anthropic-ai/sdk (optional)
node ai-copy.js clients/example-bright-dental.brief.json

# 2. Generate the page from a client config
node generate.js clients/example-acme-insurance.json
#    → dist/example-acme-insurance.html

# Build every client at once
node generate.js --all
```

Open the file in `dist/` to preview, then follow **[GHL-DEPLOY.md](GHL-DEPLOY.md)**
to drop it into a GoHighLevel funnel or website.

---

## Two ways to create a client

**A. Write copy yourself** — copy `clients/example-acme-insurance.json`, edit
the fields, run `generate.js`. Full control, no API key needed.

**B. Let AI draft it** — write a short `*.brief.json` (business facts + a few
service names + tone), run `ai-copy.js`. It calls Claude
(`claude-opus-4-8`) with structured outputs to produce headlines, value props,
service blurbs, FAQs and SEO, then writes a complete client config you can
tweak. No key? It still produces a working page with clearly-marked placeholder
copy.

See **[clients/_SCHEMA.md](clients/_SCHEMA.md)** for every config field.

---

## Lead capture — three modes (set `lead.mode`)

| Mode | What renders | Use when |
|---|---|---|
| `booking` | A CTA that opens your **GHL calendar** link (`business.bookingUrl`) | You want appointments booked directly |
| `ghl-form` | Your **GHL form** embedded via iframe (`lead.ghlFormEmbed`) | You already built the form in GHL and want leads native in your CRM |
| `webhook` | A styled native form that POSTs JSON to a **GHL inbound webhook** (`lead.webhookUrl`) | You want the on-page form to match the design pixel-for-pixel |

All three keep leads flowing into GoHighLevel. See GHL-DEPLOY.md for wiring each one.

---

## Theming

Set `theme.brandColor`, `theme.accentColor`, `theme.font` (any Google font, e.g.
`Montserrat`, `Poppins`, `Inter`, `Lora`). Everything — buttons, gradients,
accents, focus rings — derives from those via CSS `color-mix`, so one color
change re-skins the whole page. Add `business.logoUrl` to swap the wordmark for
an image.

---

## Files

```
landing-generator/
├─ generate.js      core renderer (zero dependencies)
├─ ai-copy.js       AI copywriter (Anthropic SDK; graceful no-key fallback)
├─ template/
│  └─ landing.html  the master template (edit once, applies to all clients)
├─ clients/
│  ├─ _SCHEMA.md                       config reference
│  ├─ example-acme-insurance.json      hand-written example (webhook form)
│  └─ example-bright-dental.brief.json brief example (AI + booking mode)
├─ dist/            generated pages (paste these into GHL)
├─ GHL-DEPLOY.md    how to deploy into GoHighLevel
└─ package.json
```

To restyle every client at once, edit `template/landing.html` and re-run
`node generate.js --all`.
