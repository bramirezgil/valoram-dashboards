#!/usr/bin/env node
/**
 * GHL calendar provisioner — one calendar per agent (zero dependencies).
 *
 * Reads every agent config in clients/*.json, lists the calendars that already
 * exist in your GoHighLevel location, and creates a calendar ONLY for agents
 * that don't already have one (matched by name/slug). Optionally writes each
 * new booking URL back into the agent's config and rebuilds the page.
 *
 *   # 1. provide credentials (never commit these)
 *   export GHL_TOKEN=pit-xxxxxxxx           # Private Integration Token
 *   export GHL_LOCATION_ID=xxxxxxxx         # the sub-account (location) id
 *   export GHL_DEFAULT_USER_ID=xxxxxxxx     # fallback owner for round-robin cals
 *
 *   # 2. preview — lists existing, shows what WOULD be created (no writes)
 *   node ghl-calendars.js
 *
 *   # 3. create for real, write booking URLs back, rebuild pages
 *   node ghl-calendars.js --commit --write-config --rebuild
 *
 * Flags:
 *   --commit          actually POST new calendars (default: dry-run preview)
 *   --write-config    save each booking URL into clients/<agent>.json
 *   --rebuild         run generate.js --all after writing configs
 *   --client <file>   limit to one config (repeatable)
 *   --type <t>        calendar type: round_robin | event | collective |
 *                     class_booking | service_booking (default: round_robin)
 *   --include-examples  also process clients/example-*.json (skipped by default)
 *
 * Per-agent overrides (optional) — add to a config's "business" block:
 *   "ghlUserId": "abc123"                 owner/team member for this calendar
 *   "ghlCalendar": { "name": "...", "slug": "...", "slotDuration": 30,
 *                    "calendarType": "round_robin", "description": "..." }
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const CLIENTS = path.join(ROOT, 'clients');

const API_BASE = process.env.GHL_API_BASE || 'https://services.leadconnector.com';
const API_VERSION = process.env.GHL_API_VERSION || '2021-04-15';
const TOKEN = process.env.GHL_TOKEN || '';
const LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const DEFAULT_USER_ID = process.env.GHL_DEFAULT_USER_ID || '';
// Public booking widget base (links render as <base>/widget/booking/<slug>).
const BOOKING_BASE = process.env.GHL_BOOKING_BASE || 'https://api.leadconnector.com';

// ───────────────────────── args ─────────────────────────
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const multi = (f) => argv.reduce((a, v, i) => (argv[i - 1] === f ? a.concat(v) : a), []);
const COMMIT = has('--commit');
const WRITE_CONFIG = has('--write-config');
const REBUILD = has('--rebuild');
const INCLUDE_EXAMPLES = has('--include-examples');
const ONLY = multi('--client').map((f) => path.basename(f));
const DEFAULT_TYPE = val('--type') || 'round_robin';

// ───────────────────────── helpers ─────────────────────────
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function die(msg) { console.error(`\n✗ ${msg}\n`); process.exit(1); }

async function api(method, route, body) {
  const res = await fetch(`${API_BASE}${route}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Version: API_VERSION,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) {
    const e = new Error(`${method} ${route} → ${res.status} ${res.statusText}`);
    e.status = res.status; e.body = json; throw e;
  }
  return json;
}

function loadAgents() {
  let files = fs.readdirSync(CLIENTS)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_') && !f.endsWith('.brief.json'));
  if (!INCLUDE_EXAMPLES) files = files.filter((f) => !f.startsWith('example-'));
  if (ONLY.length) files = files.filter((f) => ONLY.includes(f));
  return files.map((f) => {
    const file = path.join(CLIENTS, f);
    const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
    const b = cfg.business || {};
    const slug = cfg.slug || path.basename(f, '.json');
    const over = b.ghlCalendar || {};
    return {
      file, slug, cfg,
      name: over.name || `${b.name || slug} — Consultation`,
      calSlug: over.slug || slug,
      userId: b.ghlUserId || DEFAULT_USER_ID || '',
      type: over.calendarType || DEFAULT_TYPE,
      slotDuration: over.slotDuration || 30,
      description: over.description || `Booking calendar for ${b.name || slug}.`,
    };
  });
}

function buildPayload(a) {
  const p = {
    locationId: LOCATION_ID,
    name: a.name,
    slug: a.calSlug,
    calendarType: a.type,
    description: a.description,
    slotDuration: a.slotDuration,
    slotDurationUnit: 'mins',
  };
  // round_robin / collective calendars require at least one team member
  if (['round_robin', 'collective'].includes(a.type)) {
    if (!a.userId) { p.__missingUser = true; return p; }
    p.teamMembers = [{ userId: a.userId, priority: 1, isPrimary: true }];
  } else if (a.userId) {
    p.teamMembers = [{ userId: a.userId, priority: 1, isPrimary: true }];
  }
  return p;
}

function bookingUrl(cal) {
  const slug = cal.slug || cal.widgetSlug || cal.id;
  return `${BOOKING_BASE}/widget/booking/${slug}`;
}

function writeBookingUrl(file, url) {
  const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
  cfg.business = cfg.business || {};
  cfg.business.bookingUrl = url;
  fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n');
}

// ───────────────────────── main ─────────────────────────
(async function main() {
  if (typeof fetch !== 'function') die('Node 18+ required (global fetch missing).');
  if (!TOKEN || !LOCATION_ID) {
    die('Set GHL_TOKEN and GHL_LOCATION_ID env vars first. ' +
        'GHL_DEFAULT_USER_ID is also recommended for round-robin calendars.');
  }

  const agents = loadAgents();
  if (!agents.length) die('No agent configs found in clients/ (examples are skipped — use --include-examples).');

  console.log(`\n${COMMIT ? '🟢 COMMIT' : '🟡 DRY-RUN'} · location ${LOCATION_ID} · ${agents.length} agent config(s)\n`);

  // 1. existing calendars
  let existing = [];
  try {
    const r = await api('GET', `/calendars/?locationId=${encodeURIComponent(LOCATION_ID)}`);
    existing = r.calendars || r.data || [];
  } catch (e) {
    console.error('Failed to list existing calendars:', e.message);
    if (e.body) console.error(JSON.stringify(e.body, null, 2));
    die('Cannot continue without the existing-calendar list (check token scope: calendars.readonly).');
  }
  const existingByName = new Map(existing.map((c) => [norm(c.name), c]));
  const existingBySlug = new Map(existing.map((c) => [norm(c.slug || c.widgetSlug), c]));
  console.log(`Found ${existing.length} existing calendar(s) in location.\n`);

  const created = [], skipped = [], failed = [];

  // 2. create the missing ones
  for (const a of agents) {
    const match = existingByName.get(norm(a.name)) || existingBySlug.get(norm(a.calSlug));
    if (match) {
      skipped.push({ a, cal: match });
      console.log(`• ${a.slug.padEnd(24)} ✓ already has calendar "${match.name}" (${match.id})`);
      continue;
    }
    const payload = buildPayload(a);
    if (payload.__missingUser) {
      failed.push({ a, reason: 'no userId (set business.ghlUserId or GHL_DEFAULT_USER_ID)' });
      console.log(`• ${a.slug.padEnd(24)} ✗ skip — ${a.type} needs a team member but no userId is set`);
      continue;
    }
    if (!COMMIT) {
      console.log(`• ${a.slug.padEnd(24)} + would create "${a.name}" [${a.type}]`);
      continue;
    }
    try {
      const r = await api('POST', '/calendars/', payload);
      const cal = r.calendar || r.data || r;
      const url = bookingUrl(cal);
      created.push({ a, cal, url });
      console.log(`• ${a.slug.padEnd(24)} ✓ created "${cal.name}" (${cal.id})  →  ${url}`);
      if (WRITE_CONFIG) { writeBookingUrl(a.file, url); console.log(`  ↳ wrote bookingUrl into ${path.basename(a.file)}`); }
    } catch (e) {
      failed.push({ a, reason: e.message, body: e.body });
      console.log(`• ${a.slug.padEnd(24)} ✗ create failed — ${e.message}`);
      if (e.body) console.log('  ' + JSON.stringify(e.body));
    }
  }

  // 3. optional rebuild
  if (REBUILD && created.length && WRITE_CONFIG) {
    console.log('\nRebuilding pages…');
    try { execFileSync('node', ['generate.js', '--all'], { cwd: ROOT, stdio: 'inherit' }); }
    catch (e) { console.error('Rebuild failed:', e.message); }
  }

  // 4. summary
  console.log(`\n──────── summary ────────`);
  console.log(`created: ${created.length}   already had one: ${skipped.length}   failed/skipped: ${failed.length}`);
  if (failed.length) { console.log('\nNeeds attention:'); failed.forEach((f) => console.log(`  - ${f.a.slug}: ${f.reason}`)); }
  if (!COMMIT) console.log('\n(dry-run — re-run with --commit --write-config --rebuild to apply)');
  console.log('');
})();
