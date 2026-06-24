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
const RESULTS_SCORED_TEMPLATE = path.join(ROOT, 'template', 'results-scored.html');
const CLIENTS = path.join(ROOT, 'clients');
const DIST = path.join(ROOT, 'dist');

// Valoram brand preset (logo + colors + font) — applied when a config sets
// "brand": "valoram". The logo is a transparent PNG data URI stored alongside.
const VALORAM_LOGO = (() => {
  try { return fs.readFileSync(path.join(ROOT, 'assets', 'valoram-logo-datauri.txt'), 'utf8').trim(); }
  catch { return ''; }
})();
const BRAND_PRESETS = {
  valoram: { brandColor: '#101820', accentColor: '#F8964C', font: 'Poppins', logo: VALORAM_LOGO }
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

  // optional results page — scored (?score=, numeric tiers) or segment (?segment=, named)
  const rp = c.resultsPage;
  if (rp && Array.isArray(rp.tiers)) {
    // scored mode: survey redirects with ?score=<n>; the page picks the tier by band
    c.hasResultsPage = true;
    rp.scored = true;
    rp.scoreParam = rp.scoreParam || 'score';
    rp.tierList = rp.tiers.map((t) => ({
      id: t.id,
      min: t.min != null ? t.min : (t.minScore != null ? t.minScore : 0),
      max: t.max != null ? t.max : (t.maxScore != null ? t.maxScore : 100),
      label: t.label || '',
      headlineHtml: markEm(t.headline || ''),
      subheadline: t.subheadline || t.subhead || '',
      interpretation: t.interpretation || '',
      urgencyMessage: t.urgencyMessage || '',
      nextSteps: t.nextSteps || [t.nextStep1, t.nextStep2, t.nextStep3].filter(Boolean),
      ctaHeadline: t.ctaHeadline || '',
      ctaSubtext: t.ctaSubtext || ''
    }));
    rp.calendarEmbed = rp.calendarEmbed || '';
    rp.calendarHeadline = rp.calendarHeadline || '';
    rp.calendarSubtext = rp.calendarSubtext || '';
    // raw survey points get normalized to 0-100 on the results page using scoreMax
    if (rp.scoreMax == null) {
      const qs = buildSurveyQuestions(c);
      rp.scoreMax = qs ? surveyScoreMax(qs) : 100;
    }
  } else if (rp && rp.segments) {
    // legacy segment mode (?segment=<name>)
    c.hasResultsPage = true;
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
  } else {
    c.hasResultsPage = false;
  }
  return c;
}

// ───────────────────────── build ─────────────────────────────────────────────
function renderTemplate(file, cfg) {
  return render(parse(tokenize(fs.readFileSync(file, 'utf8'))), [cfg]);
}

// ───────────────────────── survey framework + spec ───────────────────────────
// Each framework returns the 7 niche-rewritten questions with per-answer points.
// Categories/point logic are identical across frameworks (per the handoff); only
// the wording changes by niche. Higher total = more urgency/need.
const SURVEY_FRAMEWORKS = {
  retirement(n) {
    const sys = n.retirementSystem || 'your pension';
    const sysVs = n.retirementSystemVs || sys;
    const accts = n.accountTypes || 'your retirement accounts';
    const win = n.marketWindow || '5–10 years';
    const from = n.retireFrom ? ` from ${n.retireFrom}` : '';
    return [
      { q: `How many years until your planned retirement${from}?`,
        a: [['15+ years', 10], ['8–15 years', 25], ['3–7 years', 35], ['Under 3 years', 45]] },
      { q: 'How would you describe your current retirement income plan?',
        a: [['I have a clear written plan with a tax-smart income strategy', 5], ['I have a general idea but nothing written down', 20], [`I'm mostly counting on ${sys} and hoping it works out`, 35], ["I honestly don't know where I stand", 45]] },
      { q: `Have you calculated what ${sysVs} will actually replace vs. your current take-home pay?`,
        a: [['Yes — I know my exact monthly gap', 5], ["I've done a rough estimate", 15], ["Not yet, but I've been meaning to", 30], ["No — and honestly I've been avoiding it", 45]] },
      { q: `How much do you have saved across ${accts}?`,
        a: [['$600,000 or more', 5], ['$300,000–$600,000', 15], ['$150,000–$300,000', 25], ['Under $150,000', 35]] },
      { q: `How worried are you about a market drop in the ${win} before or after you retire?`,
        a: [["Not worried — I have a plan that doesn't depend on the market", 5], ['Somewhat worried', 20], ["Very worried — it's a real concern", 35], ['It keeps me up at night thinking about bad timing', 45]] },
      { q: `Do you have a tax strategy for your retirement income beyond ${sys}?`,
        a: [['Yes — I work with someone on tax-smart income strategies', 5], ["I know strategies exist but haven't set one up", 20], ["I haven't thought much about taxes in retirement", 35], ['Taxes in retirement are my biggest financial fear', 45]] },
      { q: 'Are your beneficiaries, estate documents, and legacy plan current and organized?',
        a: [['Yes — everything is up to date and organized', 5], ['Some things are in order but not everything', 15], ["It's on my list but I haven't gotten to it", 25], ['This is a real blind spot — nothing is organized', 35]] },
    ];
  },
  exit(n) {
    const biz = n.businessType || 'business';
    return [
      { q: `How soon do you plan to sell or transition out of your ${biz}?`,
        a: [['5+ years away', 10], ['3–5 years', 25], ['1–3 years', 35], ['Under 12 months', 45]] },
      { q: 'How would you describe your current exit plan?',
        a: [['A written, tax-smart plan with someone quarterbacking it', 5], ['A general idea but nothing written down', 20], ['I plan to sell when the time feels right', 35], ['No real exit plan yet', 45]] },
      { q: `Do you know what your ${biz} is actually worth — and what you'd net after taxes and fees?`,
        a: [['Yes — a defendable valuation range and my real after-tax net', 5], ["I've done a rough estimate", 15], ['Not yet, but I plan to', 30], ['No — I really have no idea', 45]] },
      { q: `If you went to market tomorrow, how buyer-ready is your ${biz} (financials, owner dependency, customer concentration)?`,
        a: [['Diligence-ready — clean financials, runs without me', 5], ['Mostly ready, a few items to tidy up', 15], ['Some real gaps to close', 25], ['Heavily dependent on me day to day', 35]] },
      { q: `How much of your net worth is tied up in the ${biz}?`,
        a: [['Under 30%', 5], ['30–50%', 20], ['50–70%', 35], ['70% or more', 45]] },
      { q: 'Do you have a tax strategy for the proceeds when you sell?',
        a: [['Yes — I work with a pro on deal-and-tax structure', 5], ["I know strategies exist but haven't set one up", 20], ["I haven't thought much about taxes on the sale", 35], ['Taxes on the sale are my biggest worry', 45]] },
      { q: 'Are succession, estate, and family-fairness plans documented and current?',
        a: [['Yes — everything is organized and current', 5], ['Some things are in order but not everything', 15], ["It's on my list but I haven't gotten to it", 25], ['This is a real blind spot — nothing is organized', 35]] },
    ];
  },
};

function buildSurveyQuestions(cfg) {
  const fw = cfg.survey && cfg.survey.framework;
  if (!fw || !SURVEY_FRAMEWORKS[fw]) return null;
  return SURVEY_FRAMEWORKS[fw](cfg.niche || {});
}

function surveyScoreMax(questions) {
  return questions.reduce((sum, q) => sum + Math.max(...q.a.map((o) => o[1])), 0);
}

function writeSurveySpec(cfg, slug) {
  const questions = buildSurveyQuestions(cfg);
  if (!questions) return null;
  const max = surveyScoreMax(questions);
  const name = (cfg.business && cfg.business.name) || slug;
  const niche = (cfg.niche && cfg.niche.label) || (cfg.business && cfg.business.industry) || '';
  const L = [];
  L.push(`=== SURVEY SPEC: ${name} ===`);
  if (niche) L.push(`Niche: ${niche}`);
  L.push('');
  L.push('Build this survey in GHL → Sites → Surveys → New Survey.');
  L.push('Enable per-answer scoring with the point values below.');
  L.push(`Set completion redirect to:  https://YOUR-DOMAIN/${slug}-results.html?score={{contact.score}}`);
  L.push(`Max possible score: ${max}  (the results page normalizes this to 0–100)`);
  L.push('');
  questions.forEach((q, i) => {
    L.push(`Q${i + 1}: ${q.q}`);
    q.a.forEach((o, j) => L.push(`  ${String.fromCharCode(65 + j)}) ${o[0]} — ${o[1]} pts`));
    L.push('');
  });
  L.push('SCORE TIERS (by % of max — high % = more urgency):');
  L.push('  0–39%:    Strong Foundation (optimization messaging)');
  L.push('  40–69%:   Gaps to Close (action messaging)');
  L.push('  70–100%:  Action Needed Now (urgency messaging)');
  L.push('');
  const out = path.join(DIST, `${slug}-survey-spec.txt`);
  fs.writeFileSync(out, L.join('\n'));
  return { out, max };
}

function build(configPath) {
  const cfg = normalize(JSON.parse(fs.readFileSync(configPath, 'utf8')));
  const slug = cfg.slug || path.basename(configPath, '.json');
  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

  const landing = path.join(DIST, `${slug}.html`);
  const html = renderTemplate(TEMPLATE, cfg);
  fs.writeFileSync(landing, html);
  console.log(`✓ ${path.relative(ROOT, landing)}  (${(html.length / 1024).toFixed(1)} KB)  ← ${path.basename(configPath)}`);

  if (cfg.hasResultsPage) {
    const resultsOut = path.join(DIST, `${slug}-results.html`);
    const tmpl = cfg.resultsPage && cfg.resultsPage.scored ? RESULTS_SCORED_TEMPLATE : RESULTS_TEMPLATE;
    const rhtml = renderTemplate(tmpl, cfg);
    fs.writeFileSync(resultsOut, rhtml);
    console.log(`✓ ${path.relative(ROOT, resultsOut)}  (${(rhtml.length / 1024).toFixed(1)} KB)  ← results page`);
  }

  const spec = writeSurveySpec(cfg, slug);
  if (spec) console.log(`✓ ${path.relative(ROOT, spec.out)}  (survey spec · max ${spec.max} pts)`);
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
