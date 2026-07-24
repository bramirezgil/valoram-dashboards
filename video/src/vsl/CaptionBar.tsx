import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";

export type CaptionWord = { text: string; start: number; end: number };

// Brand highlight (gold), not the reference's orange.
const HIGHLIGHT = COLORS.gold;

/**
 * Karaoke-style caption row like the reference: bold words on black rounded
 * chips, the currently-spoken word highlighted orange, words popping in on cue.
 */
export const CaptionBar: React.FC<{ words: CaptionWord[]; bottom?: number }> = ({
  words,
  bottom = 150,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 12px",
        padding: "0 200px",
      }}
    >
      {words.map((w, i) => {
        const appeared = frame >= w.start;
        if (!appeared) return null;
        const active = frame >= w.start && frame < w.end;
        const pop = interpolate(frame, [w.start, w.start + 5], [0.7, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: 62,
              lineHeight: 1,
              color: active ? HIGHLIGHT : "#FFFFFF",
              background: "rgba(0,0,0,0.72)",
              borderRadius: 10,
              padding: "8px 16px",
              transform: `scale(${pop})`,
              textTransform: "lowercase",
              letterSpacing: "-0.01em",
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
