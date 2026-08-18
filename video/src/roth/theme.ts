// Brand theme for the "Tax-Free Roth Wealth System" VSL.
// Anchored to the Valoram VSL Production Bible: slate stage, orange accent,
// Marcellus display serif for emotional lines, Poppins for UI/labels.

export const ROTH = {
  slate: "#0A0A0A", // background dark (bible: Slate #0A0A0A)
  slateHi: "#141414", // slightly lifted panel
  orange: "#F8964C", // brand primary
  orangeDeep: "#E8621A", // deep orange — stronger emphasis
  white: "#FFFFFF",
  text: "rgba(255,255,255,0.88)", // text on dark (bible: white 88%)
  sub: "rgba(255,255,255,0.60)",
  dim: "rgba(255,255,255,0.40)",
} as const;

export const SERIF = "'Marcellus', Georgia, serif"; // display / emotional quotes
export const UI = "'Poppins', system-ui, sans-serif"; // labels, stats, CTA

// Legibility drop shadow the bible mandates on all overlay text.
export const TEXT_SHADOW = "0px 2px 8px rgba(0,0,0,0.55)";
