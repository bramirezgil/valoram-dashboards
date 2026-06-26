#!/usr/bin/env node
/**
 * Valoram Landing Page Generator — core renderer (zero dependencies)
 *
 *   node generate.js clients/example-acme-insurance.json
 *   node generate.js --all          # render every clients/*.json
 *
 * Merges a client config (JSON) into template/landing.html and writes a single
 * self-contained landing page to dist/<slug>.html — ready to paste into a
 * GoHighLevel funnel/website "Custom Code / HTML" element (see GHL-DEPLOY.md).
 *
 * The page follows a long-form sales structure (alternating light/dark sections):
 *   hero → problem → results+stats → distinction → audience → offer/how-it-works
 *   → testimonials → opt-in form → FAQ → final CTA. Every section is optional.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TEMPLATE = path.join(ROOT, 'template', 'landing.html');
const RESULTS_TEMPLATE = path.join(ROOT, 'template', 'results.html');
const NEXTSTEPS_TEMPLATE = path.join(ROOT, 'template', 'next-steps.html');
const CLIENTS = path.join(ROOT, 'clients');
const DIST = path.join(ROOT, 'dist');

// Valoram brand preset (logo + colors + font) — applied when a config sets
// "brand": "valoram". The logo is a transparent PNG data URI stored alongside.
const VALORAM_LOGO = (() => {
  try { return fs.readFileSync(path.join(ROOT, 'assets', 'valoram-logo-datauri.txt'), 'utf8').trim(); }
  catch { return ''; }
})();
const BRAND_PRESETS = {
  valoram: { brandColor: '#0B0D0D', accentColor: '#FF7428', font: 'Poppins', logo: VALORAM_LOGO }
};

// ───────────────────────── tiny mustache-ish template engine ─────────────────
// {{path}} HTML-escaped · {{{path}}} raw · {{#if path}}…{{else}}…{{/if}} ·
// {{#each path}}…{{this.field}}…{{/each}} (blocks nest; `this` = current item)

const TAG = /\{\{\{\s*([^}]+?)\s*\}\}\}|\{\{\s*([#/][a-z]+|else)?\s*([^}]*?)\s*\}\}/g;

function tokenize(tpl) {
  const out = [];
  let last = 0, m;
  TAG.lastIndex = 0;
  while ((m = TAG.exec(tpl))) {
    if (m.index > last) out.push({ t: 'text', v: tpl.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: 'raw', v: m[1].trim() });
    else {
      const ctrl = m[2], arg = (m[3] || '').trim();
      if (ctrl === '#if') out.push({ t: 'if', v: arg });
      else if (ctrl === '#each') out.push({ t: 'each', v: arg });
      else if (ctrl === 'else') out.push({ t: 'else' });
      else if (ctrl === '/if') out.push({ t: '/if' });
      else if (ctrl === '/each') out.push({ t: '/each' });
      else out.push({ t: 'var', v: arg });
    }
    last = TAG.lastIndex;
  }
  if (last < tpl.length) out.push({ t: 'text', v: tpl.slice(last) });
  return out;
}

function parse(tokens) {
  let i = 0;
  function block(stop) {
    const nodes = [];
    while (i < tokens.length) {
      const tk = tokens[i];
      if (stop && (tk.t === stop || tk.t === 'else')) return nodes;
      i++;
      if (tk.t === 'text' || tk.t === 'var' || tk.t === 'raw') nodes.push(tk);
      else if (tk.t === 'if') {
        const cons = block('/if');
        let alt = [];
        if (tokens[i] && tokens[i].t === 'else') { i++; alt = block('/if'); }
        if (tokens[i] && tokens[i].t === '/if') i++;
        nodes.push({ t: 'if', v: tk.v, cons, alt });
      } else if (tk.t === 'each') {
        const body = block('/each');
        if (tokens[i] && tokens[i].t === '/each') i++;
        nodes.push({ t: 'each', v: tk.v, body });
      }
    }
    return nodes;
  }
  return block(null);
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function resolve(pathStr, scopes) {
  if (pathStr === 'this') return scopes[scopes.length - 1];
  const parts = pathStr.split('.');
  const key = parts[0];
  const rest = key === 'this' ? parts.slice(1) : parts;
  for (let s = scopes.length - 1; s >= 0; s--) {
    let cur = scopes[s];
    if (key !== 'this' && (cur == null || !(key in cur))) continue;
    let ok = true;
    for (const p of rest) {
      if (p === 'this') continue;
      if (cur != null && p in cur) cur = cur[p];
      else { ok = false; break; }
    }
    if (ok) return cur;
  }
  return undefined;
}

function truthy(v) { return Array.isArray(v) ? v.length > 0 : !!v; }

function render(nodes, scopes) {
  let out = '';
  for (const n of nodes) {
    if (n.t === 'text') out += n.v;
    else if (n.t === 'var') out += esc(resolve(n.v, scopes));
    else if (n.t === 'raw') { const v = resolve(n.v, scopes); out += v == null ? '' : String(v); }
    else if (n.t === 'if') out += truthy(resolve(n.v, scopes)) ? render(n.cons, scopes) : render(n.alt, scopes);
    else if (n.t === 'each') {
      const list = resolve(n.v, scopes);
      if (Array.isArray(list)) for (const item of list) out += render(n.body, scopes.concat([item]));
    }
  }
  return out;
}

// emphasis: HTML-escape, then *word* → <em>word</em> (the accent style). Rendered raw.
function markEm(s) {
  if (!s) return '';
  return esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

// ───────────────────────── config normalization ──────────────────────────────
const FONT_FALLBACK = { Montserrat: 'sans-serif', Poppins: 'sans-serif', Inter: 'sans-serif',
  'DM Sans': 'sans-serif', Lora: 'serif', Fraunces: 'serif', Marcellus: 'serif', Playfair: 'serif' };

function normalize(cfg) {
  const c = JSON.parse(JSON.stringify(cfg));
  c.business = c.business || {};
  c.theme = c.theme || {};
  c.hero = c.hero || {};
  c.problem = c.problem || {};
  c.results = c.results || {};
  c.distinction = c.distinction || {};
  c.audience = c.audience || {};
  c.offer = c.offer || {};
  c.finalCta = c.finalCta || {};
  c.lead = c.lead || {};
  c.seo = c.seo || {};
  c.testimonials = c.testimonials || [];
  c.faqs = c.faqs || [];

  // brand preset (e.g. "brand":"valoram") fills colors/font/logo unless overridden
  const preset = BRAND_PRESETS[String(c.brand || '').toLowerCase()];
  if (preset) {
    c.theme.brandColor = c.theme.brandColor || preset.brandColor;
    c.theme.accentColor = c.theme.accentColor || preset.accentColor;
    c.theme.font = c.theme.font || preset.font;
    if (!c.business.logoUrl && preset.logo) c.business.logoUrl = preset.logo;
  }

  // theme
  c.theme.brandColor = c.theme.brandColor || '#101820';
  c.theme.accentColor = c.theme.accentColor || '#F0891A';
  // pick legible button-text color (dark vs white) by contrast against the accent
  const lum = (hex) => {
    let h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (h.length !== 6) return 0.5;
    const v = [0, 2, 4].map(i => { const c = parseInt(h.slice(i, i + 2), 16) / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const L = lum(c.theme.accentColor);
  c.theme.btnInk = ((L + 0.05) / 0.05) >= (1.05 / (L + 0.05)) ? '#0b0d0d' : '#ffffff';
  const font = c.theme.font || 'Montserrat';
  c.theme.font = font;
  c.theme.fontStack = `'${font}', ${FONT_FALLBACK[font] || 'sans-serif'}`;
  const famParam = encodeURIComponent(font).replace(/%20/g, '+');
  c.theme.fontLink =
    `<link rel="preconnect" href="https://fonts.googleapis.com">` +
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` +
    `<link href="https://fonts.googleapis.com/css2?family=${famParam}:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

  // business
  c.business.phoneHref = (c.business.phone || '').replace(/[^\d+]/g, '');
  c.business.hasContactBar = !!(c.business.phone || c.business.email || c.business.address);
  c.business.initial = (c.business.name || '?').trim().charAt(0).toUpperCase();

  // cta text reused on every button
  c.ctaText = c.hero.cta || 'Get Started';

  // lead modes
  const mode = c.lead.mode || (c.business.bookingUrl ? 'booking' : 'webhook');
  c.lead.isForm = mode === 'ghl-form' && !!c.lead.ghlFormEmbed;
  c.lead.isWebhook = mode === 'webhook' && !!c.lead.webhookUrl;
  c.lead.isBooking = mode === 'booking' || (!c.lead.isForm && !c.lead.isWebhook);
  c.lead.successMessage = c.lead.successMessage || "Thanks! We'll be in touch shortly.";
  c.lead.formEyebrow = c.lead.formEyebrow || 'Take the first step';
  c.lead.formTitle = c.lead.formTitle || 'Request your *free consultation*';
  c.lead.formIntro = c.lead.formIntro || 'Share a few details and a specialist will reach out shortly — no obligation.';
  c.lead.includes = c.lead.includes || [];
  c.lead.ctaUrl = c.lead.isBooking ? (c.lead.bookingUrl || c.business.bookingUrl || '#optin') : '#optin';
  c.leadWebhookJson = JSON.stringify(c.lead.webhookUrl || '');
  c.leadFormTitleHtml = markEm(c.lead.formTitle);

  // emphasis-rendered titles (*word* → <em>word</em>)
  c.hero.headlineHtml = markEm(c.hero.headline);
  c.problem.titleHtml = markEm(c.problem.title);
  c.results.titleHtml = markEm(c.results.title);
  c.distinction.titleHtml = markEm(c.distinction.title);
  c.audience.titleHtml = markEm(c.audience.title);
  c.offer.titleHtml = markEm(c.offer.title);
  c.finalCta.headlineHtml = markEm(c.finalCta.headline);

  // numbering
  (c.problem.items || []).forEach((it, i) => { it.num = String(i + 1).padStart(2, '0'); });
  (c.offer.steps || []).forEach((it, i) => { it.n = i + 1; });

  // testimonial avatars
  c.testimonials.forEach(t => {
    t.initials = (t.name || '?').split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  });

  // seo
  c.seo.title = c.seo.title || `${c.business.name || 'Welcome'}${c.business.tagline ? ' — ' + c.business.tagline : ''}`;
  c.seo.description = c.seo.description || c.hero.subhead || '';

  // optional VSL / video section (renders under the hero when video.url is set)
  c.video = c.video || {};
  c.hasVideo = !!c.video.url;
  c.video.eyebrow = c.video.eyebrow || (c.hasVideo ? 'Watch' : '');
  c.video.headingHtml = markEm(c.video.heading);

  // optional advisor bio (renders after the opt-in section)
  c.bio = c.bio || {};
  c.hasBio = !!(c.bio.text || c.bio.photo);
  c.bio.nameHtml = markEm(c.bio.name);

  // optional post-booking "next steps" page (separate page: dist/<slug>-next-steps.html)
  c.nextSteps = c.nextSteps || {};
  c.hasNextStepsPage = !!(c.nextSteps.steps && c.nextSteps.steps.length);
  if (c.hasNextStepsPage) {
    c.nextSteps.eyebrow = c.nextSteps.eyebrow || "You're Booked";
    c.nextSteps.headlineHtml = markEm(c.nextSteps.headline || 'Your Session Is *Confirmed*');
    c.nextSteps.videoEyebrow = c.nextSteps.videoEyebrow || 'Watch This First';
    c.nextSteps.hasVideo = !!c.nextSteps.videoUrl;
    c.nextSteps.noteHtml = markEm(c.nextSteps.note);
    c.nextSteps.steps.forEach((s, i) => { s.n = i + 1; });
  }

  // section flags
  c.year = new Date().getFullYear();
  c.offer.stepsTitle = c.offer.stepsTitle || 'How It Works';
  c.hasProblem = !!(c.problem.items && c.problem.items.length);
  c.hasResults = !!((c.results.items && c.results.items.length) || (c.results.stats && c.results.stats.length));
  c.hasResultCards = !!(c.results.items && c.results.items.length);
  c.hasStats = !!(c.results.stats && c.results.stats.length);
  c.hasDistinction = !!(c.distinction.left || c.distinction.right);
  c.hasAudience = !!(c.audience.items && c.audience.items.length);
  c.hasOffer = !!((c.offer.deliverables && c.offer.deliverables.length) || (c.offer.steps && c.offer.steps.length));
  c.hasDeliverables = !!(c.offer.deliverables && c.offer.deliverables.length);
  c.hasSteps = !!(c.offer.steps && c.offer.steps.length);
  c.hasTestimonials = c.testimonials.length > 0;
  c.hasFaqs = c.faqs.length > 0;

  // optional results page (post-survey redirect, branches by ?segment=)
  c.hasResultsPage = !!(c.resultsPage && c.resultsPage.segments);
  if (c.hasResultsPage) {
    const rp = c.resultsPage;
    rp.defaultKey = rp.default || Object.keys(rp.segments)[0];
    rp.segmentList = Object.entries(rp.segments).map(([key, s]) => ({
      key,
      headlineHtml: markEm(s.headline),
      eyebrow: s.eyebrow || '',
      subhead: s.subhead || '',
      points: s.points || [],
      ctaText: s.ctaText || c.ctaText,
      ctaUrl: s.ctaUrl || c.business.bookingUrl || '#',
      ctaSub: s.ctaSub || '',
      note: s.note || '',
      embed: s.embed || ''
    }));
  }
  return c;
}

// ───────────────────────── build ─────────────────────────────────────────────
function renderTemplate(file, cfg) {
  return render(parse(tokenize(fs.readFileSync(file, 'utf8'))), [cfg]);
}

function build(configPath) {
  const cfg = normalize(JSON.parse(fs.readFileSync(configPath, 'utf8')));
  const slug = cfg.slug || path.basename(configPath, '.json');
  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

  // Render the landing page only when the config actually has hero content.
  // (Results-only / next-steps-only configs skip it.)
  let landing = null;
  if (cfg.hero && cfg.hero.headline) {
    landing = path.join(DIST, `${slug}.html`);
    const html = renderTemplate(TEMPLATE, cfg);
    fs.writeFileSync(landing, html);
    console.log(`✓ ${path.relative(ROOT, landing)}  (${(html.length / 1024).toFixed(1)} KB)  ← ${path.basename(configPath)}`);
  }

  if (cfg.hasResultsPage) {
    const resultsOut = path.join(DIST, `${slug}-results.html`);
    const rhtml = renderTemplate(RESULTS_TEMPLATE, cfg);
    fs.writeFileSync(resultsOut, rhtml);
    console.log(`✓ ${path.relative(ROOT, resultsOut)}  (${(rhtml.length / 1024).toFixed(1)} KB)  ← results page`);
  }
  if (cfg.hasNextStepsPage) {
    const nsOut = path.join(DIST, `${slug}-next-steps.html`);
    const nhtml = renderTemplate(NEXTSTEPS_TEMPLATE, cfg);
    fs.writeFileSync(nsOut, nhtml);
    console.log(`✓ ${path.relative(ROOT, nsOut)}  (${(nhtml.length / 1024).toFixed(1)} KB)  ← next-steps page`);
  }
  return landing;
}

function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--all') {
    const files = fs.readdirSync(CLIENTS).filter(f => f.endsWith('.json') && !f.startsWith('_') && !f.endsWith('.brief.json'));
    if (!files.length) { console.error('No client configs in clients/'); process.exit(1); }
    files.forEach(f => build(path.join(CLIENTS, f)));
  } else if (args[0]) {
    build(path.resolve(args[0]));
  } else {
    console.error('Usage: node generate.js <clients/your-client.json> | --all');
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = { build, normalize, tokenize, parse, render, markEm };
