import React from "react";
import { COLORS, FONTS } from "../theme";
import {
  Eyebrow,
  GoldRule,
  Panel,
  Rise,
  Stage,
  useSceneFade,
  useEnter,
} from "../primitives";

const rows = [
  { label: "Your score", value: "0–220" },
  { label: "Where you stand", value: "5 tiers" },
  { label: "Your biggest exposure", value: "revealed", gold: true },
];

const ScoreRow: React.FC<{ label: string; value: string; gold?: boolean; delay: number }> = ({
  label,
  value,
  gold,
  delay,
}) => {
  const e = useEnter(delay);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 4px",
        borderBottom: `1px solid ${COLORS.line}`,
        opacity: e,
        transform: `translateX(${(1 - e) * -14}px)`,
      }}
    >
      <span style={{ fontFamily: FONTS.body, fontSize: 25, color: COLORS.sub }}>{label}</span>
      <span
        style={{
          fontFamily: FONTS.display,
          fontWeight: 700,
          fontSize: 27,
          color: gold ? COLORS.gold : COLORS.inkSoft,
        }}
      >
        {value}
      </span>
    </div>
  );
};

export const Scene06Score: React.FC<{ dur: number }> = ({ dur }) => {
  const fade = useSceneFade(dur);
  return (
    <Stage fade={fade} justify="center" align="center">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Eyebrow delay={4}>Your free Tax Elimination Score</Eyebrow>
        <GoldRule delay={8} />
        <Panel accent delay={18} style={{ width: 640, padding: "16px 40px 30px", marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 0 14px",
              borderBottom: `1px solid ${COLORS.panelBorderSoft}`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.display,
                fontWeight: 800,
                fontSize: 30,
                color: COLORS.ink,
              }}
            >
              Tax Elimination Score
            </span>
            <span
              style={{
                fontFamily: FONTS.body,
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.16em",
                color: "#2A2008",
                background: `linear-gradient(180deg, ${COLORS.goldBright}, ${COLORS.gold})`,
                padding: "6px 14px",
                borderRadius: 8,
              }}
            >
              FREE
            </span>
          </div>
          {rows.map((r, i) => (
            <ScoreRow key={r.label} {...r} delay={30 + i * 9} />
          ))}
        </Panel>
        <Rise delay={64} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.inkSoft }}>
            See where you stand — clear, on one page.
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 20, color: COLORS.subDim, marginTop: 6 }}>
            Not a personalized plan; that’s the call.
          </div>
        </Rise>
      </div>
    </Stage>
  );
};
