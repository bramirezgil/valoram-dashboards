import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { BrollShowcase } from "../Broll";
import { Logo } from "../Logo";
import { useEnter } from "../primitives";

/** Featured full-screen b-roll open, before the narration begins. */
export const IntroBroll: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const logo = useEnter(10);
  const kicker = useEnter(22);
  // Bright at first, then dims as it hands off to scene 1.
  const fieldOpacity = interpolate(frame, [0, 12, dur - 20, dur], [0, 1, 1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentFade = interpolate(frame, [dur - 22, dur - 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, [0, dur], [1.08, 1.0]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, opacity: fieldOpacity }}>
        <BrollShowcase mood="warm" />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(6,12,22,0.28)" }} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 20,
          opacity: contentFade,
        }}
      >
        <div style={{ opacity: logo, transform: `translateY(${(1 - logo) * 18}px)` }}>
          <Logo size={112} />
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: COLORS.gold,
            opacity: kicker,
            transform: `translateY(${(1 - kicker) * 14}px)`,
            marginTop: 8,
          }}
        >
          A message for savers 58–67
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
