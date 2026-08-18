import React from "react";
import { COLORS, FONTS } from "../theme";
import { Headline, Panel, Stage, useSceneFade } from "../primitives";
import { FxPaths } from "../SceneFX";

const Card: React.FC<{
  mark: "x" | "check";
  title: string;
  body: string;
  delay: number;
  accent?: boolean;
}> = ({ mark, title, body, delay, accent }) => (
  <Panel delay={delay} accent={accent} style={{ flex: 1, padding: "34px 36px" }}>
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        fontWeight: 800,
        marginBottom: 20,
        color: accent ? COLORS.good : COLORS.bad,
        background: accent ? "rgba(99,190,151,0.12)" : "rgba(207,122,106,0.12)",
        border: `1px solid ${accent ? "rgba(99,190,151,0.4)" : "rgba(207,122,106,0.4)"}`,
      }}
    >
      {mark === "check" ? "✓" : "✕"}
    </div>
    <div
      style={{
        fontFamily: FONTS.display,
        fontWeight: 700,
        fontSize: 30,
        color: COLORS.ink,
        marginBottom: 12,
      }}
    >
      {title}
    </div>
    <div style={{ fontFamily: FONTS.body, fontSize: 23, color: COLORS.sub, lineHeight: 1.5 }}>
      {body}
    </div>
  </Panel>
);

export const Scene04Planning: React.FC<{ dur: number }> = ({ dur }) => {
  const fade = useSceneFade(dur);
  return (
    <Stage fade={fade} justify="center" align="center" fx={<FxPaths />}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44, width: "100%" }}>
        <Headline
          delay={6}
          size={72}
          align="center"
          segments={[
            { t: "It isn’t a " },
            { t: "savings", strike: true },
            { t: " problem.\nIt’s a " },
            { t: "planning", gold: true },
            { t: " problem." },
          ]}
        />
        <div style={{ display: "flex", gap: 30, width: "100%", maxWidth: 1120 }}>
          <Card
            mark="x"
            delay={34}
            title="The default schedule"
            body="RMDs force income out on the IRS’s timeline, at the IRS’s rate."
          />
          <Card
            mark="check"
            accent
            delay={48}
            title="A plan built around you"
            body="Sequenced withdrawals, sized conversions, a smaller pre-tax balance."
          />
        </div>
      </div>
    </Stage>
  );
};
