import React from "react";
import { COLORS, FONTS } from "../theme";
import {
  Headline,
  Panel,
  Rise,
  Stage,
  useSceneFade,
  useEnter,
} from "../primitives";
import { Logo } from "../Logo";

const steps = [
  { n: 1, title: "Sequence withdrawals", body: "Across all three tax buckets." },
  { n: 2, title: "Size Roth conversions", body: "Fill the low-tax window." },
  { n: 3, title: "Shrink the pre-tax balance", body: "Before RMDs ever begin." },
];

const StepCard: React.FC<{ n: number; title: string; body: string; delay: number }> = ({
  n,
  title,
  body,
  delay,
}) => (
  <Panel delay={delay} style={{ flex: 1, padding: "30px 30px 34px" }}>
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTS.display,
        fontWeight: 800,
        fontSize: 23,
        color: COLORS.gold,
        background: "rgba(211,175,101,0.12)",
        border: `1px solid ${COLORS.panelBorder}`,
        marginBottom: 20,
      }}
    >
      {n}
    </div>
    <div
      style={{
        fontFamily: FONTS.display,
        fontWeight: 700,
        fontSize: 26,
        color: COLORS.ink,
        marginBottom: 9,
      }}
    >
      {title}
    </div>
    <div style={{ fontFamily: FONTS.body, fontSize: 21, color: COLORS.sub, lineHeight: 1.45 }}>
      {body}
    </div>
  </Panel>
);

export const Scene05Meet: React.FC<{ dur: number }> = ({ dur }) => {
  const fade = useSceneFade(dur);
  const badge = useEnter(40);
  return (
    <Stage fade={fade} justify="center" align="center">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          width: "100%",
          maxWidth: 1120,
        }}
      >
        <Rise delay={4}>
          <Logo size={46} />
        </Rise>
        <Headline
          delay={14}
          size={70}
          align="center"
          segments={[{ t: "Meet " }, { t: "Gregory Stevenson", gold: true }]}
        />
        <Rise delay={26}>
          <div style={{ fontFamily: FONTS.body, fontSize: 25, color: COLORS.sub }}>
            Financial strategist, Pacific Ridgeway Insurance Solutions
          </div>
        </Rise>
        <div
          style={{
            fontFamily: FONTS.body,
            fontWeight: 600,
            fontSize: 17,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: COLORS.goldBright,
            padding: "10px 22px",
            borderRadius: 999,
            border: `1px solid ${COLORS.panelBorder}`,
            background: "rgba(211,175,101,0.07)",
            opacity: badge,
            transform: `translateY(${(1 - badge) * 14}px)`,
            marginTop: 4,
          }}
        >
          A plan built around you — not the IRS default
        </div>
        <div style={{ display: "flex", gap: 26, width: "100%", marginTop: 22 }}>
          {steps.map((s, i) => (
            <StepCard key={s.n} {...s} delay={56 + i * 12} />
          ))}
        </div>
      </div>
    </Stage>
  );
};
