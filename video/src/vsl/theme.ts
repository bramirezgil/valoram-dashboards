// Brand design tokens for the Gregory Stevenson VSL.
// Palette sampled from the live video: deep navy + warm gold.

export const COLORS = {
  bgCore: "#0B1B2E",
  bgMid: "#0A1728",
  bgEdge: "#060F1B",
  gold: "#D3AF65",
  goldBright: "#EBCE8C",
  goldDeep: "#B4924C",
  ink: "#F3F7FB",
  inkSoft: "#D7E0EA",
  sub: "#8EA0B2",
  subDim: "#5C6E7E",
  line: "rgba(255,255,255,0.09)",
  panel: "rgba(255,255,255,0.035)",
  panelStrong: "rgba(255,255,255,0.055)",
  panelBorder: "rgba(211,175,101,0.28)",
  panelBorderSoft: "rgba(255,255,255,0.10)",
  good: "#63BE97",
  bad: "#CF7A6A",
  goldGlow: "rgba(211,175,101,0.35)",
} as const;

export const FONTS = {
  display: "'Poppins', system-ui, -apple-system, sans-serif",
  body: "'Inter', system-ui, -apple-system, sans-serif",
} as const;

// Frame at which each scene begins (30fps, total 2655 frames ≈ 88.5s).
export const FPS = 30;
export const TOTAL_FRAMES = 2655;

export const SCENES = [
  { key: "hook", start: 0 },
  { key: "isThisYou", start: 345 },
  { key: "balance", start: 660 },
  { key: "planning", start: 930 },
  { key: "meet", start: 1410 },
  { key: "score", start: 2070 },
  { key: "cta", start: 2430 },
] as const;

// Crossfade tail: each scene renders this many frames past the next scene's start.
export const OVERLAP = 16;
