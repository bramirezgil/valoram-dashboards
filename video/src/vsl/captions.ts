// Caption lines timed to each narration section. Wording is derived from the
// on-screen copy (approximate); swap in the exact transcript for word-perfect
// sync by replacing the `lines` strings and/or the timings.

export type CaptionWord = { text: string; start: number; end: number };
export type CaptionLine = { words: CaptionWord[] };

type SectionDef = { start: number; end: number; lines: string[] };

// Section boundaries in frames @30fps (match SCENES in theme.ts).
const SECTIONS: SectionDef[] = [
  { start: 0, end: 345, lines: ["Thirty years filling it.", "But who did you fill it for?"] },
  { start: 345, end: 660, lines: ["Savers 58 to 67,", "facing five-figure tax bills."] },
  { start: 660, end: 930, lines: ["Your balance versus", "what you actually keep."] },
  { start: 930, end: 1410, lines: ["It isn't a savings problem.", "It's a planning problem."] },
  {
    start: 1410,
    end: 2070,
    lines: ["Meet Gregory Stevenson.", "A plan built around you —", "not the IRS default."],
  },
  { start: 2070, end: 2430, lines: ["Your free", "Tax Elimination Score."] },
  { start: 2430, end: 2655, lines: ["Income you keep for life.", "Answer a few quick questions."] },
];

const LEAD = 10;
const TAIL = 10;

export const CAPTION_LINES: CaptionLine[] = (() => {
  const out: CaptionLine[] = [];
  for (const sec of SECTIONS) {
    const winS = sec.start + LEAD;
    const winE = sec.end - TAIL;
    const wordGroups = sec.lines.map((l) => l.split(" "));
    const totalWords = wordGroups.reduce((a, w) => a + w.length, 0);
    const per = (winE - winS) / totalWords;
    let idx = 0;
    for (const group of wordGroups) {
      const words: CaptionWord[] = group.map((w) => {
        const s = Math.round(winS + idx * per);
        const e = Math.round(winS + (idx + 1) * per);
        idx++;
        return { text: w, start: s, end: e };
      });
      out.push({ words });
    }
  }
  return out;
})();

export const CAPTION_HOLD = 12;
