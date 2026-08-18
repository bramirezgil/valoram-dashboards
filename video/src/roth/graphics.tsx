import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ROTH as C, SERIF, UI, TEXT_SHADOW } from "./theme";

const useFade = (dur: number) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [dur - 10, dur - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
};

const Stage: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => (
  <AbsoluteFill style={{ backgroundColor: C.slate, opacity: useFade(dur) }}>
    <AbsoluteFill style={{ background: "radial-gradient(60% 60% at 50% 42%, rgba(248,150,76,0.08), rgba(10,10,10,0) 70%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

// ── Multi-year Roth conversion timeline (illustrates "coordinated, year by year") ──
export const TimelineGraphic: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const years = [
    { y: "Year 1", h: 0.42 },
    { y: "Year 2", h: 0.58 },
    { y: "Year 3", h: 0.72 },
    { y: "Year 4", h: 0.6 },
    { y: "Year 5", h: 0.48 },
  ];
  const title = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  return (
    <Stage dur={dur}>
      <div style={{ width: 1240 }}>
        <div style={{ opacity: title, transform: `translateY(${(1 - title) * 14}px)`, marginBottom: 44, textAlign: "center" }}>
          <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 16, letterSpacing: "0.18em", textTransform: "uppercase", color: C.orange }}>
            A Coordinated, Multi-Year Strategy
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 52, color: C.white, marginTop: 12, textShadow: TEXT_SHADOW }}>
            Converted in controlled increments
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 40, height: 340, padding: "0 40px", borderBottom: `2px solid rgba(255,255,255,0.14)` }}>
          {years.map((yr, i) => {
            const grow = spring({ frame: frame - (14 + i * 9), fps, config: { damping: 200, mass: 0.9 } });
            const h = yr.h * 300 * grow;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 22, color: C.orange, marginBottom: 10, opacity: grow }}>
                  {Math.round(yr.h * grow * 100)}k
                </div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 150,
                    height: h,
                    borderRadius: "10px 10px 0 0",
                    background: `linear-gradient(180deg, ${C.orange}, ${C.orangeDeep})`,
                    boxShadow: "0 0 30px rgba(248,150,76,0.25)",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, padding: "0 40px", marginTop: 16 }}>
          {years.map((yr, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontFamily: UI, fontWeight: 600, fontSize: 20, color: C.sub }}>
              {yr.y}
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// ── Scorecard result mockup (the CTA payoff — score ring + three risk rows) ──
const RISKS = [
  { label: "IRA Tax Time Bomb", sev: 0.82 },
  { label: "RMD Stack", sev: 0.66 },
  { label: "Heir Tax Haircut (20–40%)", sev: 0.74 },
];
export const ScorecardGraphic: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame: frame - 4, fps, config: { damping: 200, mass: 0.9 } });
  const sweep = interpolate(frame, [12, 46], [0, 0.68], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const score = Math.round(sweep * 100);
  const R = 92;
  const CIRC = 2 * Math.PI * R;
  return (
    <Stage dur={dur}>
      <div
        style={{
          width: 980,
          background: "linear-gradient(180deg, #161616, #0e0e0e)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 26,
          padding: "44px 56px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          opacity: card,
          transform: `translateY(${(1 - card) * 26}px) scale(${0.96 + card * 0.04})`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 15, letterSpacing: "0.16em", textTransform: "uppercase", color: C.orange }}>
            Retirement Tax Scorecard
          </div>
          <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 14, color: C.dim }}>Valoram Solutions</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 52, marginTop: 20 }}>
          {/* score ring */}
          <div style={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="16" />
              <circle
                cx="110"
                cy="110"
                r={R}
                fill="none"
                stroke={C.orange}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - sweep)}
                transform="rotate(-90 110 110)"
                style={{ filter: "drop-shadow(0 0 10px rgba(248,150,76,0.5))" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: 68, color: C.white, lineHeight: 1 }}>{score}</div>
              <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 16, color: C.sub, marginTop: 2 }}>/ 100</div>
            </div>
          </div>
          {/* risk rows */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 15, color: C.sub, marginBottom: 16 }}>Your exposure across three risks</div>
            {RISKS.map((r, i) => {
              const g = spring({ frame: frame - (26 + i * 8), fps, config: { damping: 200 } });
              return (
                <div key={i} style={{ marginBottom: 18, opacity: g }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: UI, fontWeight: 600, fontSize: 20, color: C.text, marginBottom: 7 }}>
                    <span>{r.label}</span>
                  </div>
                  <div style={{ height: 12, borderRadius: 8, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${r.sev * g * 100}%`, borderRadius: 8, background: `linear-gradient(90deg, ${C.orange}, ${C.orangeDeep})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Stage>
  );
};
