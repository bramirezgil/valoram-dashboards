// "Tax-Free Roth Wealth System" VSL timeline (Valoram Solutions).
//
// VO-driven, same approach as GMAX: the voiceover is synthesized offline
// (video/tools/gen_vo_roth.py) and the per-segment timing + karaoke caption
// word-timings are generated into `vo-timing.json`. This file holds the
// authored beats and merges the generated timing onto them.
//
// The order of CONTENT MUST match the SEG order in gen_vo_roth.py.

import layout from "./vo-timing.json";

export const ROTH_FPS = layout.fps;

type Card =
  | { type: "title" }
  | { type: "silence" }
  | { type: "quote"; text: string; variant?: "pill" | "plain"; italic?: boolean }
  | { type: "typed"; text: string }
  | { type: "end" };

type Content =
  | { kind: "broll"; beat: string; hint: string; overlay?: "rmd" | "cta" }
  | { kind: "card"; card: Card };

// Authored beats, in timeline order. `hint` describes the footage each b-roll
// beat wants (shown on the placeholder until a clip is supplied).
const CONTENT: Content[] = [
  { kind: "card", card: { type: "title" } }, // 0
  { kind: "broll", beat: "open_docs", hint: "Financial documents on a dark desk — overhead slow pan" }, // 1
  { kind: "broll", beat: "hands_doc", hint: "Hands placing / pointing to a document — no faces" }, // 2
  { kind: "broll", beat: "advisory_intro", hint: "Couple seated across from an advisor — warm office" }, // 3
  { kind: "broll", beat: "reaction", hint: "Close-up reaction — woman listening, thoughtful" }, // 4
  { kind: "card", card: { type: "quote", text: "It feels like our biggest question mark.", variant: "pill", italic: true } }, // 5
  { kind: "card", card: { type: "silence" } }, // 6
  { kind: "broll", beat: "felt_that", hint: "Quiet hold — statement on the desk" }, // 7
  { kind: "broll", beat: "searching", hint: "Person at laptop · couple at kitchen table · graph trending up" }, // 8
  { kind: "broll", beat: "no_solution", hint: "Account growing on screen — the tax-exposure feeling" }, // 9
  { kind: "broll", beat: "rmd_weight", hint: "Tax document + calendar / age milestone + family at a table", overlay: "rmd" }, // 10
  { kind: "broll", beat: "husband_lean", hint: "Advisory scene — husband leaning forward, hesitant" }, // 11
  { kind: "card", card: { type: "quote", text: "“So if we convert to a Roth… we just write a big check to the IRS?”", variant: "plain" } }, // 12
  { kind: "broll", beat: "changes", hint: "Advisor's calm expression / roadmap on a document" }, // 13
  { kind: "broll", beat: "strategy", hint: "Multi-year timeline graphic — CPA + advisor reviewing" }, // 14
  { kind: "broll", beat: "cpa", hint: "Two professionals reviewing a shared document — collaborative" }, // 15
  { kind: "broll", beat: "shift", hint: "Advisory scene — couple leaning back, tension released" }, // 16
  { kind: "broll", beat: "quiet_look", hint: "Wife turns to look at husband — grounded moment" }, // 17
  { kind: "card", card: { type: "quote", text: "“I just want to know we're not leaving this to chance.”", variant: "plain" } }, // 18
  { kind: "card", card: { type: "typed", text: "The goal isn't the size of the account. It's how much of it you actually get to keep." } }, // 19
  { kind: "broll", beat: "scorecard_intro", hint: "Clean scorecard UI on a phone/tablet on a warm desk" }, // 20
  { kind: "broll", beat: "scorecard_detail", hint: "Assessment progress / results score screen", overlay: "cta" }, // 21
  { kind: "broll", beat: "to_camera", hint: "Advisor direct-to-camera — calm and warm", overlay: "cta" }, // 22
  { kind: "card", card: { type: "end" } }, // 23
];

type Timing = { from: number; durFrames: number; voFrom: number | null; voTo: number | null };
export type Segment = Content & Timing;

export const SEGMENTS: Segment[] = CONTENT.map((c, i) => ({
  ...c,
  ...(layout.segments[i] as Timing),
}));

export const ROTH_DURATION = layout.durationFrames;

export const VO_RANGES: [number, number][] = layout.segments
  .filter((s) => s.voFrom != null && s.voTo != null)
  .map((s) => [s.voFrom as number, s.voTo as number]);

export type CaptionWord = { text: string; start: number; end: number };
export type CaptionLine = { words: CaptionWord[] };
export const ROTH_CAPTIONS: CaptionLine[] = layout.captions as CaptionLine[];
export const ROTH_CAPTION_HOLD = layout.captionHold;
