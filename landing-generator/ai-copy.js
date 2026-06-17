#!/usr/bin/env node
/**
 * AI copywriter — drafts polished marketing copy for a client from a short brief.
 *
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   node ai-copy.js clients/cornerstone.brief.json
 *
 * Reads a brief (business facts + a few service names + tone), asks Claude to
 * write the headline, sub-headline, value props, service descriptions, about
 * section, FAQs and SEO, then writes a complete client config to
 * clients/<slug>.json. Run generate.js on that file to produce the page.
 *
 * Requires the official Anthropic SDK:  npm install @anthropic-ai/sdk
 * If the SDK or API key is missing, it falls back to sensible placeholder copy
 * so the pipeline still produces a working page (clearly marked TODO).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const MODEL = process.env.LANDING_MODEL || 'claude-opus-4-8';

// JSON schema for the structured response (no min/max items; additionalProperties:false)
const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    heroEyebrow: { type: 'string' },
    heroHeadline: { type: 'string' },
    heroSubhead: { type: 'string' },
    heroCta: { type: 'string' },
    valueProps: {
      type: 'array',
      items: { type: 'object', additionalProperties: false,
        properties: { title: { type: 'string' }, body: { type: 'string' } },
        required: ['title', 'body'] }
    },
    services: {
      type: 'array',
      items: { type: 'object', additionalProperties: false,
        properties: { icon: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' } },
        required: ['icon', 'name', 'description'] }
    },
    faqs: {
      type: 'array',
      items: { type: 'object', additionalProperties: false,
        properties: { q: { type: 'string' }, a: { type: 'string' } },
        required: ['q', 'a'] }
    },
    aboutTitle: { type: 'string' },
    aboutBody: { type: 'string' },
    finalCtaHeadline: { type: 'string' },
    finalCtaSub: { type: 'string' },
    seoTitle: { type: 'string' },
    seoDescription: { type: 'string' }
  },
  required: ['heroEyebrow', 'heroHeadline', 'heroSubhead', 'heroCta', 'valueProps',
    'services', 'faqs', 'aboutTitle', 'aboutBody', 'finalCtaHeadline', 'finalCtaSub',
    'seoTitle', 'seoDescription']
};

function buildPrompt(brief) {
  const b = brief.business || {};
  return [
    `You are a senior conversion copywriter writing a single marketing landing page for a local service business.`,
    `Write warm, concrete, benefit-led copy in plain English. No hype, no clichés, no "unlock"/"elevate"/"seamless". Short sentences. American spelling.`,
    ``,
    `BUSINESS`,
    `- Name: ${b.name || '(unnamed)'}`,
    `- Industry: ${b.industry || 'local services'}`,
    `- Location: ${b.address || 'local area'}`,
    `- Tagline (optional): ${b.tagline || '(none)'}`,
    `- Tone: ${brief.tone || 'professional, friendly, trustworthy'}`,
    brief.serviceNames && brief.serviceNames.length
      ? `- Services to feature: ${brief.serviceNames.join(', ')}`
      : `- Services: infer 4-6 typical services for this industry`,
    brief.notes ? `- Notes: ${brief.notes}` : ``,
    ``,
    `REQUIREMENTS`,
    `- heroHeadline: <= 9 words, outcome-focused, no business name.`,
    `- heroSubhead: 1-2 sentences, <= 30 words.`,
    `- heroCta: 2-4 words, action-led (e.g. "Get My Free Quote").`,
    `- valueProps: exactly 4, each title <= 4 words, body 1 sentence.`,
    `- services: 4-6 items; pick a single relevant emoji for "icon"; description 1 sentence.`,
    `- faqs: 4 genuinely useful questions a prospect would ask, with honest 1-2 sentence answers.`,
    `- aboutBody: 2-3 sentences, first-person-plural ("we").`,
    `- seoTitle: <= 60 chars, include the business name and location.`,
    `- seoDescription: <= 155 chars.`,
    `Return only the structured object.`
  ].filter(Boolean).join('\n');
}

function fallbackCopy(brief) {
  const b = brief.business || {};
  const names = (brief.serviceNames && brief.serviceNames.length ? brief.serviceNames
    : ['Consultation', 'Personalized Plans', 'Ongoing Support', 'Free Review']);
  return {
    heroEyebrow: 'TODO — review AI/placeholder copy',
    heroHeadline: `Expert ${b.industry || 'service'} you can trust`,
    heroSubhead: `${b.name || 'We'} help ${b.address ? 'people in ' + b.address : 'you'} make confident decisions — with clear advice and no pressure.`,
    heroCta: 'Get Started',
    valueProps: [
      { title: 'Personalized advice', body: 'Recommendations built around your specific goals and situation.' },
      { title: 'Clear & honest', body: 'Plain-English explanations of every option, cost, and trade-off.' },
      { title: 'Fast response', body: 'Talk to a real person quickly — usually the same day.' },
      { title: 'Long-term partner', body: 'We stay with you well beyond the first conversation.' }
    ],
    services: names.map(n => ({ icon: '★', name: n, description: `Professional ${n.toLowerCase()} tailored to your needs.` })),
    faqs: [
      { q: 'How much does it cost to get started?', a: 'Your initial consultation is free with no obligation.' },
      { q: 'How quickly can we talk?', a: 'We typically respond the same business day.' },
      { q: 'What areas do you serve?', a: `We proudly serve ${b.address || 'our local community'} and the surrounding area.` },
      { q: 'What should I bring?', a: 'Just your questions — we handle the rest.' }
    ],
    aboutTitle: 'A local team that puts you first',
    aboutBody: `${b.name || 'Our team'} was built on clear, honest guidance. We take time to understand your goals, walk you through your options, and stay with you for the long run.`,
    finalCtaHeadline: "Let's talk",
    finalCtaSub: 'Schedule a free, no-obligation consultation today.',
    seoTitle: `${b.name || 'Welcome'}${b.address ? ' — ' + b.address : ''}`,
    seoDescription: `${b.industry || 'Trusted local services'}${b.address ? ' in ' + b.address : ''}. Free consultation, honest advice, no pressure.`
  };
}

async function generateCopy(brief) {
  let Anthropic;
  try { Anthropic = require('@anthropic-ai/sdk'); }
  catch { console.warn('⚠  @anthropic-ai/sdk not installed — using placeholder copy. Run: npm install'); return fallbackCopy(brief); }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠  ANTHROPIC_API_KEY not set — using placeholder copy.');
    return fallbackCopy(brief);
  }
  const client = new Anthropic();
  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
      messages: [{ role: 'user', content: buildPrompt(brief) }]
    });
    if (resp.stop_reason === 'refusal') { console.warn('⚠  Model declined — using placeholder copy.'); return fallbackCopy(brief); }
    const text = resp.content.find(b => b.type === 'text');
    return JSON.parse(text.text);
  } catch (e) {
    console.warn('⚠  AI copy failed (' + e.message + ') — using placeholder copy.');
    return fallbackCopy(brief);
  }
}

function toConfig(brief, copy) {
  return {
    slug: brief.slug || (brief.business && brief.business.name || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    business: brief.business || {},
    theme: brief.theme || {},
    copy: {
      heroEyebrow: copy.heroEyebrow, heroHeadline: copy.heroHeadline, heroSubhead: copy.heroSubhead, heroCta: copy.heroCta,
      valueProps: copy.valueProps, aboutTitle: copy.aboutTitle, aboutBody: copy.aboutBody,
      finalCtaHeadline: copy.finalCtaHeadline, finalCtaSub: copy.finalCtaSub
    },
    services: copy.services,
    testimonials: brief.testimonials || [],
    faqs: copy.faqs,
    lead: brief.lead || { mode: 'booking' },
    seo: { title: copy.seoTitle, description: copy.seoDescription }
  };
}

async function main() {
  const briefPath = process.argv[2];
  if (!briefPath) { console.error('Usage: node ai-copy.js <clients/your-client.brief.json>'); process.exit(1); }
  const brief = JSON.parse(fs.readFileSync(path.resolve(briefPath), 'utf8'));
  console.log(`✎ Drafting copy for "${(brief.business || {}).name || briefPath}" with ${MODEL}…`);
  const copy = await generateCopy(brief);
  const config = toConfig(brief, copy);
  const out = path.join(__dirname, 'clients', `${config.slug}.json`);
  fs.writeFileSync(out, JSON.stringify(config, null, 2) + '\n');
  console.log(`✓ Wrote ${path.relative(__dirname, out)}`);
  console.log(`  Next:  node generate.js ${path.relative(process.cwd(), out)}`);
}

if (require.main === module) main();
module.exports = { generateCopy, toConfig, fallbackCopy };
