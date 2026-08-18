import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Eyebrow, GoldRule, Pill, Rise, Stage, useSceneFade } from "../primitives";
import { FxErosion } from "../SceneFX";

const risks = ["Rising taxes", "Market drops", "No income floor", "Risk of outliving it"];

export const Scene03Balance: React.FC<{ dur: number }> = ({ dur }) => {
  const fade = useSceneFade(dur);
  const frame = useCurrentFrame();

  const H = 470; // bar height
  const fill = interpolate(frame, [16, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Fraction taxed away, growing in from the top after the bar fills.
  const taxed = interpolate(frame, [52, 82], [0, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const keepH = H * (1 - taxed) * fill;
  const taxedH = H * taxed * fill;

  return (
    <Stage fade={fade} justify="center" align="center" fx={<FxErosion />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Eyebrow delay={4}>Your balance vs. what you actually keep</Eyebrow>
        <GoldRule delay={8} />

        <div style={{ display: "flex", alignItems: "center", gap: 64, marginTop: 8 }}>
          {/* The meter */}
          <div
            style={{
              width: 168,
              height: H,
              borderRadius: 16,
              border: `1px solid ${COLORS.panelBorderSoft}`,
              background: "rgba(255,255,255,0.03)",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 3,
            }}
          >
            {/* Taxed away — hatched, muted, top */}
            <div
              style={{
                height: taxedH,
                borderRadius: "10px 10px 4px 4px",
                border: `1.5px dashed ${COLORS.goldDeep}`,
                background:
                  "repeating-linear-gradient(-45deg, rgba(211,175,101,0.16) 0 8px, rgba(211,175,101,0.04) 8px 16px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                opacity: taxed > 0.02 ? 1 : 0,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "0.14em",
                  color: COLORS.goldBright,
                }}
              >
                TAXED AWAY
              </span>
              <span style={{ fontFamily: FONTS.body, fontSize: 12.5, color: COLORS.sub }}>
                on the IRS’s schedule
              </span>
            </div>
            {/* You keep — solid gold, bottom, rounded data-end */}
            <div
              style={{
                height: keepH,
                borderRadius: "4px 4px 10px 10px",
                background: `linear-gradient(180deg, ${COLORS.goldBright}, ${COLORS.goldDeep})`,
                boxShadow: `0 0 30px ${COLORS.goldGlow}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 800,
                  fontSize: 20,
                  letterSpacing: "0.1em",
                  color: "#3A2C0C",
                }}
              >
                YOU KEEP
              </span>
            </div>
          </div>

          {/* Legend / caption */}
          <Rise delay={64} style={{ maxWidth: 460 }}>
            <div
              style={{
                fontFamily: FONTS.display,
                fontWeight: 800,
                fontSize: 40,
                color: COLORS.ink,
                lineHeight: 1.1,
              }}
            >
              Your pre-tax balance —{" "}
              <span style={{ color: COLORS.gold }}>100%</span>
            </div>
            <p
              style={{
                fontFamily: FONTS.body,
                fontSize: 24,
                color: COLORS.sub,
                marginTop: 12,
                lineHeight: 1.45,
              }}
            >
              A big number — but not all of it is yours. The schedule decides how
              much the IRS takes first.
            </p>
          </Rise>
        </div>

        {/* Risk pills */}
        <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
          {risks.map((r, i) => (
            <Pill key={r} delay={92 + i * 6}>
              <span style={{ color: COLORS.gold, fontWeight: 700 }}>+</span> {r}
            </Pill>
          ))}
        </div>
      </div>
    </Stage>
  );
};
