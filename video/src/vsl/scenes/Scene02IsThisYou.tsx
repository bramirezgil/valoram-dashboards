import React from "react";
import { COLORS, FONTS } from "../theme";
import {
  Eyebrow,
  GoldRule,
  Headline,
  Pill,
  Rise,
  Stage,
  useSceneFade,
} from "../primitives";

const pills = ["Pre-Retiree", "401(k)", "IRA Rollover", "RMDs Ahead"];

export const Scene02IsThisYou: React.FC<{ dur: number }> = ({ dur }) => {
  const fade = useSceneFade(dur);
  return (
    <Stage fade={fade} justify="center">
      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 1180 }}>
        <Eyebrow delay={4}>Is this you?</Eyebrow>
        <GoldRule delay={8} />
        <Headline
          delay={10}
          size={80}
          segments={[
            { t: "Savers ages " },
            { t: "58–67", gold: true },
            { t: ", facing " },
            { t: "five-figure tax bills", gold: true },
            { t: " at withdrawal." },
          ]}
        />
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          {pills.map((p, i) => (
            <Pill key={p} delay={30 + i * 6}>
              {p}
            </Pill>
          ))}
        </div>
        <Rise delay={58} style={{ marginTop: 18 }}>
          <p
            style={{
              margin: 0,
              fontFamily: FONTS.body,
              fontSize: 27,
              color: COLORS.sub,
              fontStyle: "italic",
            }}
          >
            Quietly asking:{" "}
            <span style={{ color: COLORS.inkSoft }}>
              “How much of this is actually mine?”
            </span>
          </p>
        </Rise>
      </div>
    </Stage>
  );
};
