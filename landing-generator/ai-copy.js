#!/usr/bin/env node
/**
 * AI copywriter — drafts a full long-form landing page from a short brief.
 *
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   node ai-copy.js clients/example-bright-dental.brief.json
 *
 * Produces the complete section structure the template expects (hero, problem,
 * results+stats, distinction, audience, offer + how-it-works, FAQ, final CTA)
 * and writes clients/<slug>.json. Then run generate.js on that file.
 *
 * Requires the official Anthropic SDK:  npm install @anthropic-ai/sdk
 * Without the SDK or an API key it falls back to clearly-marked placeholder copy
 * so the pipeline still produces a complete, working page.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const MODEL = process.env.LANDING_MODEL || 'claude-opus-4-8';

const strArr = { type: 'array', items: { type: 'string' } };
const obj = (props) => ({ type: 'object', additionalProperties: false, properties: props, required: Object.keys(props) });
const objArr = (props) => ({ type: 'array', items: obj(props) });

const SCHEMA = obj({
  hero: obj({ eyebrow: { type: 'string' }, headline: { type: 'string' }, subhead: { type: 'string' }, cta: { type: 'string' } }),
  problem: obj({ eyebrow: { type: 'string' }, title: { type: 'string' },
    items: objArr({ title: { type: 'string' }, body: { type: 'string' } }), transition: { type: 'string' } }),
  results: obj({ eyebrow: { type: 'string' }, title: { type: 'string' }, intro: { type: 'string' },
    items: objArr({ icon: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' } }),
    stats: objArr({ num: { type: 'string' }, label: { type: 'string' }, desc: { type: 'string' } }) }),
  distinction: obj({ eyebrow: { type: 'string' }, title: { type: 'string' },
    left: obj({ label: { type: 'string' }, heading: { type: 'string' }, points: strArr }),
    right: obj({ label: { type: 'string' }, heading: { type: 'string' }, points: strArr }),
    close: { type: 'string' } }),
  audience: obj({ eyebrow: { type: 'string' }, title: { type: 'string' },
    items: objArr({ icon: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' } }), notFor: { type: 'string' } }),
  offer: obj({ eyebrow: { type: 'string' }, title: { type: 'string' }, intro: { type: 'string' },
    tag: { type: 'string' }, offerTitle: { type: 'string' }, offerDesc: { type: 'string' },
    deliverables: objArr({ title: { type: 'string' }, desc: { type: 'string' } }),
    steps: objArr({ title: { type: 'string' }, body: { type: 'string' } }) }),
  faqs: objArr({ q: { type: 'string' }, a: { type: 'string' } }),
  finalCta: obj({ eyebrow: { type: 'string' }, headline: { type: 'string' }, subhead: { type: 'string' }, scarcity: { type: 'string' } }),
  leadIncludes: strArr,
  seoTitle: { type: 'string' },
  seoDescription: { type: 'string' }
});

function buildPrompt(brief) {
  const b = brief.business || {};
  return [
    `You are a senior direct-response copywriter writing ONE long-form marketing landing page for a local service business. It uses a proven section structure: hero, "why this exists" (problem), "what you can achieve" (results + stats), "the core distinction" (us vs them), "who this is for" (audience), "what you get" (offer + how-it-works steps), FAQ, and a final CTA.`,
    `Voice: warm, concrete, benefit-led, plain English. No hype words ("unlock", "elevate", "seamless", "revolutionary"), no clichés, short sentences, American spelling.`,
    ``,
    `BUSINESS`,
    `- Name: ${b.name || '(unnamed)'}`,
    `- Industry: ${b.industry || 'local services'}`,
    `- Location: ${b.address || 'local area'}`,
    `- Tagline: ${b.tagline || '(none)'}`,
    `- Tone: ${brief.tone || 'professional, friendly, trustworthy'}`,
    brief.serviceNames && brief.serviceNames.length ? `- Services/offerings to draw on: ${brief.serviceNames.join(', ')}` : `- Services: infer typical offerings for this industry`,
    brief.notes ? `- Notes: ${brief.notes}` : ``,
    ``,
    `EMPHASIS CONVENTION`,
    `- In hero.headline, every *.title (problem/results/distinction/audience/offer), finalCta.headline: wrap 2-4 key words in *asterisks*. Those render as a colored accent. One emphasis span per title. Example: "Keep More, *Protect More*, and Finally Have a Plan".`,
    ``,
    `LENGTH & SHAPE`,
    `- hero.headline <= 16 words; hero.subhead 1-2 sentences; cta 2-4 words, action-led (reused on every button).`,
    `- problem.items: exactly 3 (title <= 5 words, body 1-2 sentences). problem.transition: 1 punchy line, may use *asterisks*.`,
    `- results.items: exactly 4 (pick a relevant emoji for "icon"). results.stats: exactly 3 ("num" is short like "$1,200+", "30 Min", "100%").`,
    `- distinction: left = the old/typical way (5 short points), right = the better/coordinated way (5 short points). close: 1-2 sentences, may use *asterisks*.`,
    `- audience.items: exactly 4 (emoji icons) describing who it's for. audience.notFor: 1 sentence on who it's NOT for.`,
    `- offer: tag is 1-2 words ("Complimentary"/"Free"). offerTitle names the offer. deliverables: 4 ({title,desc}). steps: exactly 4 simple ordered steps ({title,body}).`,
    `- faqs: 5 genuinely useful Q&As (honest 1-2 sentence answers).`,
    `- finalCta: headline may use *asterisks*; scarcity is 1 short line (e.g. "Limited sessions available each week").`,
    `- leadIncludes: 3-4 short bullets of what they get when they submit the form.`,
    `- seoTitle <= 60 chars incl. business name + location; seoDescription <= 155 chars. (Do NOT use asterisks in SEO fields.)`,
    `Return only the structured object.`
  ].filter(Boolean).join('\n');
}

function fallbackCopy(brief) {
  const b = brief.business || {};
  const ind = b.industry || 'service';
  const where = b.address ? ' in ' + b.address : '';
  const names = (brief.serviceNames && brief.serviceNames.length ? brief.serviceNames : ['Consultations', 'Personalized Plans', 'Ongoing Support', 'Free Reviews']);
  const icons = ['◈', '◎', '⬡', '◇', '✦'];
  return {
    hero: { eyebrow: '◆ Free Consultation', headline: `Expert *${ind}* You Can Actually Trust`, subhead: `${b.name || 'We'} help ${b.address ? 'people in ' + b.address : 'you'} make confident decisions — with clear advice and no pressure.`, cta: 'Get Started' },
    problem: { eyebrow: 'Why This Exists', title: 'Most People Have A *Planning* Problem',
      items: [
        { title: 'Set And Forgotten', body: 'Decisions get made once and never revisited, even as your needs change.' },
        { title: 'Paying Too Much', body: 'Without a comparison, most people never learn what the right structure would save them.' },
        { title: 'Nobody Connects It', body: 'The pieces operate in silos, so nobody is actively optimizing the whole picture.' }
      ], transition: 'The biggest wins happen *before* you need them — not after.' },
    results: { eyebrow: 'What You Can Achieve', title: 'Keep More And *Worry Less*', intro: 'Here is what clients consistently walk away with.',
      items: names.slice(0, 4).map((n, i) => ({ icon: icons[i] || '◆', title: n, body: `Professional ${String(n).toLowerCase()} built around your specific situation.` })),
      stats: [ { num: 'Fast', label: 'Same-Day Response', desc: 'Talk to a real person quickly.' }, { num: '100%', label: 'Personalized', desc: 'Advice built around your goals.' }, { num: 'Local', label: 'In Your Community', desc: `Proudly serving ${b.address || 'your area'}.` } ] },
    distinction: { eyebrow: 'The Core Distinction', title: 'The Old Way vs *A Real Plan*',
      left: { label: 'Typical', heading: 'One-Time Transaction', points: ['Sold once and forgotten', 'Reactive, not proactive', 'Limited options', 'Ends after the sale', 'No coordination'] },
      right: { label: 'Coordinated', heading: 'An Ongoing Plan', points: ['Reviewed proactively', 'Year-round guidance', 'Best fit for you', 'Documented and adjustable', 'Everything works together'] },
      close: 'You do not need another pitch. *You need a plan* built around your goals.' },
    audience: { eyebrow: 'Is This Right For You?', title: 'Who This Is *Built For*',
      items: [ { icon: '◈', title: 'Busy Families', body: 'People who want clear guidance without the runaround.' }, { icon: '◎', title: 'Business Owners', body: 'Owners who need strategy nobody is currently bringing them.' }, { icon: '⬡', title: 'Planners', body: 'Anyone preparing for an important decision or milestone.' }, { icon: '◇', title: 'Second Opinions', body: 'People who want an honest, unbiased review.' } ],
      notFor: 'This is not the right fit if you only want the cheapest option with no guidance.' },
    offer: { eyebrow: 'The Free Review', title: 'What You Get When You *Reach Out*', intro: 'A personalized review built around your situation.',
      tag: 'Free', offerTitle: 'Personalized Consultation', offerDesc: 'A short session that surfaces your highest-impact opportunities and gives you a clear set of next steps.',
      deliverables: names.slice(0, 4).map(n => ({ title: n, desc: `Tailored ${String(n).toLowerCase()} for your needs.` })),
      steps: [ { title: 'Share Your Details', body: 'Fill out the short form.' }, { title: 'Book Your Session', body: 'Pick a time that works.' }, { title: 'Get Your Plan', body: 'Receive personalized recommendations.' }, { title: 'Take Action', body: 'Leave with clear next steps.' } ] },
    faqs: [ { q: 'How much does it cost to get started?', a: 'Your initial consultation is free with no obligation.' }, { q: 'Is this a high-pressure sales pitch?', a: 'No. We explain your options; the decision is always yours.' }, { q: 'How quickly can we talk?', a: 'We typically respond the same business day.' }, { q: 'What areas do you serve?', a: `We proudly serve ${b.address || 'our local community'} and the surrounding area.` }, { q: 'What should I prepare?', a: 'Just your questions — we handle the rest.' } ],
    finalCta: { eyebrow: 'One Step Away', headline: 'Ready To *Get Started?*', subhead: `Reach out today for a free, no-pressure conversation${where}.`, scarcity: 'Limited consultations available each week' },
    leadIncludes: ['A personalized review of your situation', 'Your top opportunities, ranked', 'Honest, unbiased guidance', 'A clear set of next steps'],
    seoTitle: `${b.name || 'Welcome'}${b.address ? ' — ' + b.address : ''}`,
    seoDescription: `${ind}${where}. Free consultation, honest advice, no pressure.`
  };
}

async function generateCopy(brief) {
  let Anthropic;
  try { Anthropic = require('@anthropic-ai/sdk'); }
  catch { console.warn('⚠  @anthropic-ai/sdk not installed — using placeholder copy. Run: npm install'); return fallbackCopy(brief); }
  if (!process.env.ANTHROPIC_API_KEY) { console.warn('⚠  ANTHROPIC_API_KEY not set — using placeholder copy.'); return fallbackCopy(brief); }
  const client = new Anthropic();
  try {
    const resp = await client.messages.create({
      model: MODEL, max_tokens: 8000,
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

function toConfig(brief, c) {
  const lead = Object.assign({}, brief.lead || { mode: 'booking' });
  if (!lead.includes && c.leadIncludes) lead.includes = c.leadIncludes;
  return {
    slug: brief.slug || (brief.business && brief.business.name || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    business: brief.business || {},
    theme: brief.theme || {},
    hero: c.hero, problem: c.problem, results: c.results, distinction: c.distinction,
    audience: c.audience, offer: c.offer, testimonials: brief.testimonials || [],
    faqs: c.faqs, finalCta: c.finalCta, lead,
    seo: { title: c.seoTitle, description: c.seoDescription }
  };
}

async function main() {
  const briefPath = process.argv[2];
  if (!briefPath) { console.error('Usage: node ai-copy.js <clients/your-client.brief.json>'); process.exit(1); }
  const brief = JSON.parse(fs.readFileSync(path.resolve(briefPath), 'utf8'));
  console.log(`✎ Drafting full landing copy for "${(brief.business || {}).name || briefPath}" with ${MODEL}…`);
  const copy = await generateCopy(brief);
  const config = toConfig(brief, copy);
  const out = path.join(__dirname, 'clients', `${config.slug}.json`);
  fs.writeFileSync(out, JSON.stringify(config, null, 2) + '\n');
  console.log(`✓ Wrote ${path.relative(__dirname, out)}`);
  console.log(`  Next:  node generate.js ${path.relative(process.cwd(), out)}`);
}

if (require.main === module) main();
module.exports = { generateCopy, toConfig, fallbackCopy };
