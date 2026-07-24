import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";
import { BrollField } from "./Broll";

/**
 * Continuous, subtle background shared across every scene: a deep-navy base with
 * two slowly drifting golden glows, a fine grid, and a vignette. It never cuts,
 * so scene content can crossfade on top of a stable field.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow, looping drift (sine over the whole timeline) for the warm glows.
  const t = frame / 60;
  const gx1 = 28 + Math.sin(t * 0.5) * 8;
  const gy1 = 32 + Math.cos(t * 0.4) * 6;
  const gx2 = 74 + Math.cos(t * 0.35) * 7;
  const gy2 = 70 + Math.sin(t * 0.45) * 6;

  const glow1 = interpolate(Math.sin(t * 0.5), [-1, 1], [0.22, 0.4]);
  const glow2 = interpolate(Math.cos(t * 0.4), [-1, 1], [0.14, 0.26]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgCore, overflow: "hidden" }}>
      {/* base vertical wash */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${COLORS.bgMid} 0%, ${COLORS.bgCore} 48%, ${COLORS.bgEdge} 100%)`,
        }}
      />
      {/* warm drifting glows */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 52% at ${gx1}% ${gy1}%, rgba(211,175,101,${glow1.toFixed(
            3,
          )}) 0%, rgba(211,175,101,0) 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(42% 48% at ${gx2}% ${gy2}%, rgba(120,160,210,${glow2.toFixed(
            3,
          )}) 0%, rgba(120,160,210,0) 62%)`,
        }}
      />
      {/* fine grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(70% 70% at 50% 45%, black 0%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(70% 70% at 50% 45%, black 0%, transparent 82%)",
        }}
      />
      {/* subtle abstract b-roll motion behind everything */}
      <BrollField mood="warm" opacity={0.5} />
      {/* darken so b-roll stays behind the copy and text stays legible */}
      <AbsoluteFill style={{ background: "rgba(6,12,22,0.34)" }} />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(3,8,15,0.72) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
