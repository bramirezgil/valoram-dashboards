// B-roll wiring for the Roth VSL. One entry per b-roll beat (keys match the
// `beat` fields in script.ts). Clips are null until footage is supplied — the
// composition shows a branded placeholder (with the shot hint) for any null
// beat, so the video renders complete with just VO + text before any b-roll
// exists. Drop clips into public/broll-roth/ and set them here (+ BROLL_LOOP).

export const ROTH_BROLL_FPS = 30;

// --- fetch:begin (regeneratable) ---
export const BROLL_DIR = "broll-roth";

// beat key -> clip filename in BROLL_DIR, or null for a branded placeholder.
export const BROLL: Record<string, string | null> = {
  open_docs: null, //  financial documents on a dark desk, overhead slow pan
  hands_doc: null, //  hands placing/pointing to a document, no faces
  advisory_intro: null, //  couple seated across from an advisor, warm office
  reaction: null, //  close-up reaction — woman listening, thoughtful
  felt_that: null, //  quiet hold / statement on desk
  searching: null, //  person at laptop · couple at kitchen table · graph up
  no_solution: null, //  account growing on screen / tax exposure feel
  rmd_weight: null, //  tax document + calendar/age milestone + family table
  husband_lean: null, //  advisory scene, husband leaning forward, hesitant
  changes: null, //  advisor calm expression / roadmap on a document
  strategy: null, //  multi-year timeline graphic, CPA + advisor reviewing
  cpa: null, //  two professionals reviewing a shared document, collaborative
  shift: null, //  advisory scene, couple leaning back, tension released
  quiet_look: null, //  wife turns to look at husband, grounded moment
  scorecard_intro: null, //  clean scorecard UI on phone/tablet on a warm desk
  scorecard_detail: null, //  assessment progress / results screen
  to_camera: null, //  advisor direct-to-camera, calm and warm
};

// clip filename -> native length in frames, for a seamless <Loop>.
export const BROLL_LOOP: Record<string, number> = {};

// clip filename -> still image (in BROLL_DIR) shown behind the clip as a poster.
export const BROLL_STILL: Record<string, string> = {};
// --- fetch:end ---

export type RothBeat = keyof typeof BROLL;
