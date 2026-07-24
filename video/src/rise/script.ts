// R.I.S.E. VSL timeline (Pacific Ridgeway rebrand of the production package).
//
// The pacing is now VO-driven: the voiceover is synthesized offline and the
// per-segment timing + karaoke caption word-timings are generated alongside it
// into `vo-timing.json` (see tools/gen_vo.py notes in the commit). This file
// keeps the authored *content* — which clip / card each beat shows and the
// narration copy — and merges the generated timing onto it.
//
// The order of CONTENT below MUST match the SEG order in the generator.

import layout from "./vo-timing.json";

export const RISE_FPS = layout.fps;
export const sec = (s: number) => Math.round(s * RISE_FPS);

export const RISE_COLORS = {
  navy: "#0D1F3C",
  navyDeep: "#081428",
  gold: "#C9A84C",
  goldBright: "#E4C976",
  white: "#FFFFFF",
  sub: "#9DB0C4",
  dim: "#6B7E92",
};

type Card =
  | { type: "text"; lines: { t: string; gold?: boolean }[] }
  | { type: "split" }
  | { type: "stat"; number: string; label: string }
  | { type: "rise" }
  | { type: "outcomes" }
  | { type: "end" };

type Content =
  | { kind: "broll"; clip: string; overlay?: "form"; vo?: string }
  | { kind: "card"; card: Card; vo?: string };

// Authored beats, in timeline order. Timing comes from vo-timing.json.
const CONTENT: Content[] = [
  { kind: "broll", clip: "c4.mp4" }, // 0 quiet open — tax forms
  {
    kind: "broll",
    clip: "c5.mp4",
    vo: "If you earned a good income this year and still felt like you paid too much — you're probably right.",
  },
  {
    kind: "card",
    vo: "Most people who earn well don't have a tax problem. They have a planning problem.",
    card: {
      type: "text",
      lines: [
        { t: "A tax problem." },
        { t: "Or a planning problem?", gold: true },
      ],
    },
  },
  {
    kind: "broll",
    clip: "c2.mp4",
    vo: "Every year, millions of Americans hand their information to a preparer, get a number back, and pay it. No questions. No strategy.",
  },
  {
    kind: "card",
    vo: "There's a difference between preparing a return and building a tax strategy.",
    card: { type: "split" },
  },
  {
    kind: "broll",
    clip: "c6.mp4",
    vo: "When we look at someone's return — really look at it — we almost never see just a tax return. We see a story.",
  },
  {
    kind: "broll",
    clip: "c1.mp4",
    vo: "We see credits never claimed. Contributions not optimized. Prior years where someone overpaid — money that can still be recovered.",
  },
  {
    kind: "card",
    vo: "For the people we work with, we typically identify between fifteen and forty-four thousand dollars — or more — in potential tax savings.",
    card: { type: "stat", number: "$15K–$44K+", label: "In Tax Savings Identified*" },
  },
  {
    kind: "card",
    vo: "That's not a loophole. That's money that was always yours.",
    card: {
      type: "text",
      lines: [
        { t: "That's not a loophole." },
        { t: "That's money that was always yours.", gold: true },
      ],
    },
  },
  {
    kind: "card",
    vo: "That's exactly what we built our approach to do.",
    card: { type: "rise" },
  },
  {
    kind: "broll",
    clip: "c3.mp4",
    vo: "We find what was missed. We recover what's still recoverable. And we build a forward strategy so you stop leaving money behind.",
  },
  {
    kind: "card",
    vo: "Then the work goes deeper — savings, retirement, a financial picture that reflects what you've worked for.",
    card: { type: "outcomes" },
  },
  {
    kind: "broll",
    clip: "c0.mp4",
    vo: "It doesn't matter if you're a W-2 earner, self-employed, or running a business. If you're paying income taxes, there's more opportunity than you've been shown.",
  },
  {
    kind: "broll",
    clip: "c6.mp4",
    overlay: "form",
    vo: "Right below this video, fill out the form. Let's find out what's been left on the table.",
  },
  {
    kind: "card",
    vo: "Start keeping more of what you earn.",
    card: { type: "end" },
  },
];

type Timing = {
  from: number; // absolute start frame
  durFrames: number;
  voFrom: number | null; // absolute frame the narration starts
  voTo: number | null;
};

export type Segment = Content & Timing;

export const SEGMENTS: Segment[] = CONTENT.map((c, i) => ({
  ...c,
  ...(layout.segments[i] as Timing),
}));

export const RISE_DURATION = layout.durationFrames;

// Frame ranges where narration is playing — used to duck the music bed.
export const VO_RANGES: [number, number][] = layout.segments
  .filter((s) => s.voFrom != null && s.voTo != null)
  .map((s) => [s.voFrom as number, s.voTo as number]);

// ---------------------------------------------------------------------------
// Karaoke captions (generated to match the actual spoken audio).
// ---------------------------------------------------------------------------
export type CaptionWord = { text: string; start: number; end: number };
export type CaptionLine = { words: CaptionWord[] };

export const RISE_CAPTIONS: CaptionLine[] = layout.captions as CaptionLine[];
export const RISE_CAPTION_HOLD = layout.captionHold;
