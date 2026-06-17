# Deploying a generated page into GoHighLevel

Each file in `dist/` is a complete, self-contained web page. There are two ways
to put it live in GoHighLevel (GHL). Both take a couple of minutes.

---

## Option 1 — Paste as a Custom Code page (fastest)

Best when you want the whole generated design to *be* the page.

1. In GHL, open **Sites → Funnels** (or **Websites**) → **+ New Funnel/Website**.
2. Add a **blank step/page**.
3. In the page builder, drag in a **Custom JS/HTML** (a.k.a. **Code**) element so
   it spans the full width.
4. Open `dist/<client>.html`, **select all, copy**, and paste it into the element.
5. Save → **Preview**. Publish when it looks right.
6. Point your domain/subdomain at the funnel under **Settings → Domains**.

> Tip: because the page brings its own `<style>`, set the funnel theme to a
> plain/blank template so GHL's default styles don't fight it.

---

## Option 2 — Host the file and embed it

Best when you'd rather keep the page as a standalone asset.

1. Upload `dist/<client>.html` to any static host (GHL Media Library as an
   `.html` file, S3, Netlify, Cloudflare Pages, etc.).
2. In a GHL page, add a **full-screen iframe** element pointing at that URL, or
   simply use the hosted URL as the funnel step's redirect.

---

## Wiring lead capture into your CRM

Set `lead.mode` in the client config to match how you want leads handled.

### `mode: "booking"` — send to your GHL calendar
1. In GHL: **Calendars → your calendar → Share/Scheduling link**, copy the link.
2. Put it in the config as `business.bookingUrl`.
3. The hero CTA and all buttons open that calendar. Leads book themselves and
   land in your calendar + contacts automatically.

### `mode: "ghl-form"` — embed your GHL form
1. In GHL: **Sites → Forms**, build/choose a form → **Integrate / Embed →
   Iframe Embed**, copy the `<iframe ...></iframe>` snippet.
2. Paste it into the config as `lead.ghlFormEmbed` (keep it on one line).
3. Re-run `generate.js`. The form renders inside the hero card and submissions
   flow straight into GHL — no extra wiring, and GHL workflows/automations fire
   as normal.

### `mode: "webhook"` — native form → GHL inbound webhook
Use this when you want the on-page form to exactly match the page design.
1. In GHL: **Automation → Workflows → + New Workflow**.
2. Add the trigger **Inbound Webhook**; copy the generated webhook URL.
3. Put it in the config as `lead.webhookUrl`, re-run `generate.js`.
4. The page's form POSTs JSON like:
   ```json
   { "name": "...", "email": "...", "phone": "...", "message": "...",
     "source": "https://the-page-url", "submittedAt": "2026-..." }
   ```
5. In the workflow, add a **Create/Update Contact** action and map the fields
   (`name`, `email`, `phone`) from the inbound webhook payload. Add notify/SMS/
   email steps as desired.

> The form shows an inline success message after submitting; no redirect needed.
> For tighter validation or spam protection, add it in the workflow or switch to
> `ghl-form` mode (GHL forms include built-in protections).

---

## Updating a page later

Edit the client config (or the shared `template/landing.html` to restyle every
client), re-run `node generate.js …`, and re-paste / re-upload the new
`dist/<client>.html`. Nothing else changes.
