# Auto-provisioning a GHL calendar per agent

`ghl-calendars.js` creates one GoHighLevel calendar per agent — but only for
agents that **don't already have one**. It lists the calendars in your location,
matches them against `clients/*.json` by name/slug, and creates the missing ones.
Optionally it writes each booking URL back into the agent config and rebuilds.

## 1. Credentials (never commit these)

Create a **Private Integration Token** in GHL:
**Settings → Private Integrations → + New** with scopes
`calendars.readonly`, `calendars.write` (add `users.readonly` if you want owners
assigned). Then:

```bash
export GHL_TOKEN=pit-xxxxxxxxxxxx        # the Private Integration Token
export GHL_LOCATION_ID=xxxxxxxxxxxx      # Settings → Business Profile → Location ID
export GHL_DEFAULT_USER_ID=xxxxxxxx      # fallback owner for round-robin calendars
```

## 2. Preview (no writes)

```bash
node ghl-calendars.js
```

Lists existing calendars and shows exactly which agents would get a new one.

## 3. Create for real

```bash
node ghl-calendars.js --commit --write-config --rebuild
```

- `--commit`        actually creates the calendars
- `--write-config`  saves each new booking URL into `clients/<agent>.json` (`business.bookingUrl`)
- `--rebuild`       runs `generate.js --all` so pages pick up the new links

Other flags: `--client <file>` (limit to one), `--type round_robin|event|collective|class_booking|service_booking`, `--include-examples`.

## Per-agent overrides

Add to a config's `business` block:

```jsonc
"ghlUserId": "abc123",                    // calendar owner / team member
"ghlCalendar": {                          // optional fine-tuning
  "name": "Jane Doe — Strategy Call",
  "slug": "jane-doe",
  "calendarType": "round_robin",
  "slotDuration": 30,
  "description": "..."
}
```

## Notes

- **Idempotent:** re-running never duplicates — existing calendars are detected
  by name and slug and skipped.
- **round-robin/collective** calendars require at least one team member; the
  script skips (with a warning) any agent that has no `ghlUserId` and no
  `GHL_DEFAULT_USER_ID` rather than creating a broken calendar.
- On the first real run, if GHL rejects a payload the **full API error body is
  printed** so the field set can be adjusted quickly.
