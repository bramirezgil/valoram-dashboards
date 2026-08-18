import React from "react";
import { COLORS, FONTS } from "../theme";
import {
  Eyebrow,
  GoldRule,
  Headline,
  Panel,
  Stage,
  useSceneFade,
  useEnter,
} from "../primitives";
import { FxAccumulation } from "../SceneFX";

const rows = [
  { label: "What you saved", value: "thirty years" },
  { label: "What the tax bill takes", value: "five figures" },
  { label: "The honest answer", value: "it’s the schedule", gold: true },
];

const Row: React.FC<{ label: string; value: string; gold?: boolean; delay: number }> = ({
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
        alignItems: "baseline",
        padding: "18px 4px",
        borderBottom: `1px solid ${COLORS.line}`,
        opacity: e,
        transform: `translateX(${(1 - e) * -16}px)`,
      }}
    >
      <span style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.sub }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: FONTS.body,
          fontWeight: 700,
          fontSize: 25,
          color: gold ? COLORS.gold : COLORS.inkSoft,
        }}
      >
        {value}
      </span>
    </div>
  );
};

export const Scene01Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const fade = useSceneFade(dur);
  return (
    <Stage fade={fade} justify="center" fx={<FxAccumulation />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <Eyebrow delay={4}>For savers ages 58–67</Eyebrow>
        <GoldRule delay={8} />
        <Headline
          delay={10}
          size={84}
          segments={[
            { t: "Thirty years filling it.\n" },
            { t: "But who did you fill it " },
            { t: "for", gold: true },
            { t: "?" },
          ]}
        />
        <Panel delay={26} style={{ marginTop: 18, padding: "10px 34px", maxWidth: 620 }}>
          {rows.map((r, i) => (
            <Row key={r.label} {...r} delay={32 + i * 7} />
          ))}
        </Panel>
      </div>
    </Stage>
  );
};
