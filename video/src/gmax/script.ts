// GMAX VSL timeline (Valoram Solutions — "Category-of-One Retention System").
//
// VO-driven pacing, same approach as the R.I.S.E. piece: the voiceover is
// synthesized offline (video/tools/gen_vo_gmax.py) and the per-segment timing
// + karaoke caption word-timings are generated into `vo-timing.json`. This
// file holds the authored content and merges the generated timing onto it.
//
// The order of CONTENT MUST match the SEG order in gen_vo_gmax.py.

import layout from "./vo-timing.json";
import { BROLL } from "./broll";

export const GMAX_FPS = layout.fps;

// Same premium dark stage as the R.I.S.E. VSL (navy + accent glow), with the
// Valoram/GMAX brand orange standing in for R.I.S.E.'s gold accent.
export const GMAX_COLORS = {
  navy: "#0D1F3C",
  navyDeep: "#081428",
  orange: "#F8964C",
  orangeBright: "#F9A968",
  orangeDeep: "#E8621A",
  white: "#FFFFFF",
  sub: "#9DB0C4",
  dim: "#6B7E92",
};

type Card =
  | { type: "text"; lines: { t: string; accent?: boolean }[] }
  | { type: "stat"; number: string; label: string }
  | { type: "split" }
  | { type: "brand" }
  | { type: "outcomes" }
  | { type: "end" };

type Content =
  | { kind: "broll"; clip: string; overlay?: "form" }
  | { kind: "card"; card: Card };

// Authored beats, in timeline order. Timing comes from vo-timing.json.
const CONTENT: Content[] = [
  { kind: "broll", clip: BROLL.open }, // 0 quiet open — owner at desk
  { kind: "broll", clip: BROLL.hook }, // 1 hook — losing people
  {
    kind: "card", // 2
    card: {
      type: "text",
      lines: [{ t: "It's not a pay problem." }, { t: "It's a retention problem.", accent: true }],
    },
  },
  { kind: "broll", clip: BROLL.door }, // 3 group plan ends at the door
  { kind: "card", card: { type: "stat", number: "50–200%", label: "Of Salary To Replace One Employee" } }, // 4
  { kind: "broll", clip: BROLL.cost }, // 5 hidden cost
  { kind: "card", card: { type: "stat", number: "$25K–$150K", label: "Avg. Annual Turnover Cost Per SMB" } }, // 6
  { kind: "card", card: { type: "split" } }, // 7 group plan vs portable
  { kind: "broll", clip: BROLL.portable }, // 8 portable — follows the person
  { kind: "card", card: { type: "brand" } }, // 9 GMAX reveal
  { kind: "card", card: { type: "outcomes" } }, // 10 Retain / Compete / Recruit
  { kind: "card", card: { type: "stat", number: "67%", label: "Cite Benefits As Key To Staying" } }, // 11
  { kind: "broll", clip: BROLL.team }, // 12 built for 10–60
  { kind: "broll", clip: BROLL.cta, overlay: "form" }, // 13 CTA over b-roll
  { kind: "card", card: { type: "end" } }, // 14 end CTA
];

type Timing = { from: number; durFrames: number; voFrom: number | null; voTo: number | null };
export type Segment = Content & Timing;

export const SEGMENTS: Segment[] = CONTENT.map((c, i) => ({
  ...c,
  ...(layout.segments[i] as Timing),
}));

export const GMAX_DURATION = layout.durationFrames;

export const VO_RANGES: [number, number][] = layout.segments
  .filter((s) => s.voFrom != null && s.voTo != null)
  .map((s) => [s.voFrom as number, s.voTo as number]);

export type CaptionWord = { text: string; start: number; end: number };
export type CaptionLine = { words: CaptionWord[] };
export const GMAX_CAPTIONS: CaptionLine[] = layout.captions as CaptionLine[];
export const GMAX_CAPTION_HOLD = layout.captionHold;
