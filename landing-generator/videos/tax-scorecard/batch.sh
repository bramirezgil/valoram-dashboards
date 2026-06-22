#!/bin/bash
# Render all six tier cuts at high quality. Sequential: build.py overwrites the
# shared index.html + per-tier audio, so each tier must build then render.
set -e
cd "$(dirname "$0")"
VOICE="${1:-am_liam}"
TIERS="maximum very_high high moderate moderate_low low"
LOG=/tmp/batch_render.log
: > "$LOG"
for tier in $TIERS; do
  echo "=== BUILD $tier ===" >> "$LOG"
  python3 build.py "$tier" "$VOICE" >> "$LOG" 2>&1
  echo "=== RENDER $tier ===" >> "$LOG"
  npx hyperframes render . -o "renders/tax-$tier.mp4" -q high -f 30 --quiet >> "$LOG" 2>&1
  echo "DONE $tier" >> "$LOG"
done
echo "ALL_DONE" >> "$LOG"
