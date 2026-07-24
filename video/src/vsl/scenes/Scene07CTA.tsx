import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import {
  Eyebrow,
  Headline,
  Rise,
  Stage,
  useSceneFade,
  useEnter,
} from "../primitives";
import { BrollField } from "../Broll";
import { Logo } from "../Logo";

export const Scene07CTA: React.FC<{ dur: number }> = ({ dur }) => {
  const fade = useSceneFade(dur);
  const frame = useCurrentFrame();
  const btn = useEnter(58, { damping: 200, mass: 0.8, stiffness: 120 });
  // Soft, slow pulse on the button glow.
  const pulse = (Math.sin(frame / 9) + 1) / 2;
  const glow = 28 + pulse * 26;
  // Featured full-screen b-roll bloom that opens the scene, then settles back.
  const bloom = interpolate(frame, [0, 18, 40, 66], [0, 0.9, 0.9, 0.32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage fade={fade} justify="center" align="center">
      {/* Featured full-screen b-roll bloom opening the final scene */}
      <AbsoluteFill style={{ opacity: bloom }}>
        <BrollField mood="warm" opacity={1} showCurve showRings />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(6,12,22,0.34)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Eyebrow delay={30}>One step away</Eyebrow>
        <Headline
          delay={36}
          size={88}
          align="center"
          segments={[{ t: "Income You " }, { t: "Keep for Life", gold: true }]}
        />
        <div
          style={{
            marginTop: 20,
            opacity: btn,
            transform: `translateY(${(1 - btn) * 20}px) scale(${0.96 + btn * 0.04})`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "24px 46px",
              borderRadius: 999,
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: 30,
              color: "#2A2008",
              background: `linear-gradient(180deg, ${COLORS.goldBright}, ${COLORS.gold})`,
              boxShadow: `0 0 ${glow}px ${COLORS.goldGlow}, 0 18px 46px rgba(0,0,0,0.4)`,
            }}
          >
            Answer a few quick questions
            <span style={{ fontSize: 32 }}>→</span>
          </div>
        </div>
        <Rise delay={72}>
          <div style={{ fontFamily: FONTS.body, fontSize: 23, color: COLORS.sub }}>
            Request My Strategy Session
          </div>
        </Rise>
        <Rise delay={84} style={{ marginTop: 18 }}>
          <Logo size={40} />
        </Rise>
      </div>
    </Stage>
  );
};
