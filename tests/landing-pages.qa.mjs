#!/usr/bin/env node
// Browser QA suite for the Valoram production dashboards.
//
// Loads each dashboard HTML file in real Chromium and checks rendering,
// interactivity, responsiveness, and (statically) that no API key is baked
// into the shipped source. No live API key or network access is required —
// the GraphQL endpoint is intercepted and aborted so tests never hit prod.
//
// Run:
//   npm install --no-save playwright   # first time (or have it installed globally)
//   node tests/landing-pages.qa.mjs
//
// Exit code is non-zero if any hard check fails (CI-friendly).

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

// ---- Resolve Playwright from local node_modules or a global install --------
async function loadChromium() {
  const candidates = [
    'playwright',
    'playwright-core',
    '/opt/node22/lib/node_modules/playwright/index.js',
  ];
  for (const c of candidates) {
    try { const m = await import(c); return (m.chromium ?? m.default?.chromium); } catch { /* try next */ }
  }
  throw new Error('Playwright not found. Install it: `npm install --no-save playwright`');
}

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = process.env.QA_SHOTS_DIR || path.join(os.tmpdir(), 'valoram-qa-shots');
fs.mkdirSync(OUT, { recursive: true });

// Match each page by filename prefix so version-number suffixes don't break the run.
const PAGE_SPECS = [
  { prefix: 'agent-production',            title: 'Agent Production — Valoram Solutions',            list: 'agentList',   dateDefault: 'currentMonth' },
  { prefix: 'manager-personal-production', title: 'Manager Personal Production — Valoram Solutions', list: 'managerList', dateDefault: 'empty' },
  { prefix: 'manager-team-production',     title: 'Team Production — Valoram Solutions',             list: 'teamList',    dateDefault: 'empty' },
];

function resolveFile(prefix) {
  const hit = fs.readdirSync(REPO).filter(f => f.startsWith(prefix) && f.endsWith('.html')).sort();
  return hit[hit.length - 1]; // newest by lexical sort of "(n)" suffix
}

// Console/network noise that is expected when running offline — not a page defect.
const ENV_NOISE = [/ERR_CONNECTION_RESET/, /Failed to load resource/, /X-Frame-Options may only be set via an HTTP header/, /net::ERR_/, /fonts\.g/];
const isEnvNoise = t => ENV_NOISE.some(re => re.test(t));

const results = [];
const rec = (page, name, pass, detail = '') => results.push({ page, name, pass, detail });

const chromium = await loadChromium();
const browser = await chromium.launch();

for (const spec of PAGE_SPECS) {
  const file = resolveFile(spec.prefix);
  if (!file) { rec(spec.prefix, 'File present', false, `no ${spec.prefix}*.html found`); continue; }

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const jsErrors = [], consoleErrors = [], graphqlHits = [], fontFails = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('requestfailed', r => { if (/fonts\.g/.test(r.url())) fontFails.push(r.url()); });
  await page.route('**/graphql', r => { graphqlHits.push(r.request().url()); r.abort(); });

  const url = pathToFileURL(path.join(REPO, file)).href;
  const nav = await page.goto(url, { waitUntil: 'load' }).catch(e => ({ err: e.message }));
  await page.waitForTimeout(400);
  const openClass = () => page.evaluate(() => document.getElementById('modalOverlay').classList.contains('open'));

  rec(file, 'Page loads', !nav?.err, nav?.err || '');
  rec(file, 'Title correct', (await page.title()) === spec.title, `got "${await page.title()}"`);
  rec(file, 'No JS errors on load', jsErrors.length === 0, jsErrors.join(' | '));

  const coreIds = ['searchInput', 'loadBtn', 'fFrom', 'fTo', 'fStatus', 'fProduct', 'modalOverlay', 'toast', spec.list];
  const missing = [];
  for (const id of coreIds) if ((await page.locator(`#${id}`).count()) === 0) missing.push(id);
  rec(file, 'Core UI elements present', missing.length === 0, missing.length ? `missing: ${missing.join(',')}` : `${coreIds.length} ids ok`);

  const dFrom = await page.inputValue('#fFrom'), dTo = await page.inputValue('#fTo');
  if (spec.dateDefault === 'currentMonth') {
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    const ok = iso.test(dFrom) && iso.test(dTo) && dFrom.slice(0, 7) === dTo.slice(0, 7) && dFrom.slice(8) === '01' && dFrom <= dTo;
    rec(file, 'Date range defaults to current month', ok, `${dFrom} → ${dTo}`);
  } else {
    rec(file, 'Date range starts unbounded (manager default)', dFrom === '' && dTo === '', `${dFrom || '∅'} → ${dTo || '∅'}`);
  }

  const hiddenStart = !(await openClass());
  await page.click('button.refresh-btn-cfg');
  await page.waitForTimeout(150);
  const opened = await openClass();
  await page.evaluate(() => (typeof closeCfg === 'function' ? closeCfg() : document.getElementById('modalOverlay').classList.remove('open')));
  await page.waitForTimeout(150);
  const closed = !(await openClass());
  rec(file, 'Config modal open/close', hiddenStart && opened && closed, `hidden=${hiddenStart} open=${opened} closed=${closed}`);

  let e0 = jsErrors.length;
  await page.fill('#searchInput', 'zzz-nonexistent'); await page.waitForTimeout(120); await page.fill('#searchInput', '');
  rec(file, 'Search filter runs without error', jsErrors.length === e0);

  e0 = jsErrors.length;
  await page.selectOption('#fStatus', 'sub').catch(() => {});
  await page.selectOption('#fProduct', 'life').catch(() => {});
  await page.waitForTimeout(120);
  rec(file, 'Filter selects run without error', jsErrors.length === e0);

  // SECURITY: no hardcoded API key / bearer secret in shipped source
  const src = fs.readFileSync(path.join(REPO, file), 'utf8');
  const keyMatch = src.match(/"key"\s*:\s*"([0-9a-f]{16,})"/i) || src.match(/Bearer\s+([0-9a-f]{16,})/i);
  rec(file, 'No hardcoded API key in source', !keyMatch, keyMatch ? `secret in source (${keyMatch[1].length} hex chars)` : '');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  rec(file, 'No horizontal overflow @390px', overflow <= 2, `overflow=${overflow}px`);

  const realConsole = consoleErrors.filter(t => !isEnvNoise(t));
  rec(file, 'No unexpected console errors', realConsole.length === 0, realConsole.slice(0, 2).join(' | ') || 'only offline/network noise');

  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(120);
  const base = file.replace(/[^a-z0-9]+/gi, '_');
  await page.screenshot({ path: path.join(OUT, `${base}_desktop.png`) }).catch(() => {});
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(OUT, `${base}_mobile.png`) }).catch(() => {});

  if (fontFails.length) rec(file, '(offline) External font requests', false, `${fontFails.length} font req blocked — expected offline`);
  await ctx.close();
}

await browser.close();

// ---- Report ----------------------------------------------------------------
const byPage = {};
for (const r of results) (byPage[r.page] ??= []).push(r);
let pass = 0, hardFail = 0, soft = 0;
console.log('\n==================== LANDING PAGE QA REPORT ====================\n');
for (const [pg, rs] of Object.entries(byPage)) {
  console.log(`### ${pg}`);
  for (const r of rs) {
    const env = r.name.startsWith('(offline)');
    if (r.pass) pass++; else if (env) soft++; else hardFail++;
    console.log(`  ${r.pass ? '✅ PASS' : env ? '⚠️  OFFLINE' : '❌ FAIL'}  ${r.name}${r.detail ? '  — ' + r.detail : ''}`);
  }
  console.log('');
}
console.log('---------------------------------------------------------------');
console.log(`TOTAL: ${pass} passed, ${hardFail} failed, ${soft} offline-only warnings`);
console.log('Screenshots:', OUT);
process.exit(hardFail > 0 ? 1 : 0);
