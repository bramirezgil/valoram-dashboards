import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";
import { CaptionLine, CAPTION_HOLD } from "./captions";

// Brand highlight (gold), not the reference's orange.
const HIGHLIGHT = COLORS.gold;

/**
 * Karaoke captions like the reference: one short phrase at a time, bold words on
 * black rounded chips, the current word highlighted gold, words popping in on cue.
 * Times are absolute composition frames.
 */
export const CaptionBar: React.FC<{ lines: CaptionLine[]; bottom?: number }> = ({
  lines,
  bottom = 140,
}) => {
  const frame = useCurrentFrame();

  // Active line = the latest line whose display window contains the frame.
  let active: CaptionLine | null = null;
  for (const line of lines) {
    const s = line.words[0].start;
    const e = line.words[line.words.length - 1].end + CAPTION_HOLD;
    if (frame >= s && frame < e) active = line;
  }
  if (!active) return null;

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
        padding: "0 220px",
      }}
    >
      {active.words.map((w, i) => {
        if (frame < w.start) return null;
        const isActive = frame >= w.start && frame < w.end;
        const pop = interpolate(frame, [w.start, w.start + 5], [0.72, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: 60,
              lineHeight: 1,
              color: isActive ? HIGHLIGHT : "#FFFFFF",
              background: "rgba(0,0,0,0.72)",
              borderRadius: 10,
              padding: "8px 16px",
              transform: `scale(${pop})`,
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
