import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GMAX_COLORS as C, GMAX_CAPTIONS, GMAX_CAPTION_HOLD } from "./script";
import { ValoramLogo } from "./ValoramLogo";

const SERIF = "'Marcellus', Georgia, serif";
const DISPLAY = "'Poppins', system-ui, sans-serif";
const BODY = "'Inter', system-ui, sans-serif";

const useCardFade = (dur: number) => {
  const frame = useCurrentFrame();
  return Math.min(
    interpolate(frame, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 7, dur - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
};

const useRise = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.8, stiffness: 110 } });
};

const RiseIn: React.FC<{
  delay: number;
  dy?: number;
  dx?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, dy = 20, dx = 0, children, style }) => {
  const e = useRise(delay);
  return (
    <div style={{ opacity: e, transform: `translate(${(1 - e) * dx}px, ${(1 - e) * dy}px)`, ...style }}>
      {children}
    </div>
  );
};

const CardBase: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const fade = useCardFade(dur);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, opacity: fade }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(58% 55% at 50% 42%, rgba(248,150,76,0.12), rgba(10,10,12,0) 70%)` }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(120% 120% at 50% 45%, transparent 52%, rgba(3,3,4,0.72) 100%)" }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 150px" }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TextCard: React.FC<{ dur: number; lines: { t: string; accent?: boolean }[] }> = ({
  dur,
  lines,
}) => (
  <CardBase dur={dur}>
    <div style={{ textAlign: "center" }}>
      {lines.map((l, i) => (
        <RiseIn
          key={i}
          delay={6 + i * 8}
          dy={22}
          style={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: 84,
            lineHeight: 1.16,
            color: l.accent ? C.orange : C.white,
            textShadow: l.accent ? "0 0 34px rgba(248,150,76,0.32)" : "none",
          }}
        >
          {l.t}
        </RiseIn>
      ))}
    </div>
  </CardBase>
);

export const StatCard: React.FC<{ dur: number; number: string; label: string }> = ({
  dur,
  number,
  label,
}) => {
  const e = useRise(6);
  return (
    <CardBase dur={dur}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 184,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            background: `linear-gradient(180deg, ${C.orange}, ${C.orangeDeep})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: e,
            transform: `scale(${0.86 + e * 0.14})`,
            filter: "drop-shadow(0 0 46px rgba(248,150,76,0.35))",
          }}
        >
          {number}
        </div>
        <RiseIn
          delay={16}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 32,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: C.white,
            marginTop: 22,
          }}
        >
          {label}
        </RiseIn>
      </div>
    </CardBase>
  );
};

const CMP_TRAD = [
  "Benefits end the day they leave",
  "Rising premiums, no retention pull",
  "Nothing to value — they'll lose it",
  "Tenure earns them nothing",
];
const CMP_GMAX = [
  "Employees own it — it follows them",
  "Predictable cost, built for SMBs",
  "They value what they keep",
  "Rewards staying — a reason to build",
];

const CompareCol: React.FC<{
  title: string;
  items: string[];
  good?: boolean;
  baseDelay: number;
}> = ({ title, items, good, baseDelay }) => (
  <div
    style={{
      flex: 1,
      background: good ? "rgba(248,150,76,0.07)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${good ? "rgba(248,150,76,0.4)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 20,
      padding: "34px 38px",
    }}
  >
    <RiseIn
      delay={baseDelay}
      dy={14}
      style={{
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: good ? C.orange : C.dim,
        marginBottom: 22,
      }}
    >
      {title}
    </RiseIn>
    {items.map((it, i) => (
      <RiseIn
        key={i}
        delay={baseDelay + 8 + i * 6}
        dx={good ? 18 : -18}
        dy={0}
        style={{ display: "flex", alignItems: "center", gap: 16, margin: "16px 0" }}
      >
        <span
          style={{
            flex: "0 0 auto",
            width: 34,
            height: 34,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            color: good ? "#0A0A0C" : C.dim,
            background: good ? C.orange : "rgba(255,255,255,0.06)",
          }}
        >
          {good ? "✓" : "✕"}
        </span>
        <span style={{ fontFamily: BODY, fontSize: 29, color: good ? C.white : C.sub, lineHeight: 1.25 }}>
          {it}
        </span>
      </RiseIn>
    ))}
  </div>
);

export const CompareCard: React.FC<{ dur: number }> = ({ dur }) => (
  <CardBase dur={dur}>
    <div style={{ width: "100%", maxWidth: 1500 }}>
      <RiseIn
        delay={2}
        dy={16}
        style={{
          fontFamily: SERIF,
          fontSize: 52,
          color: C.white,
          textAlign: "center",
          marginBottom: 34,
        }}
      >
        Tied to the job — or built to <span style={{ color: C.orange }}>follow the person</span>
      </RiseIn>
      <div style={{ display: "flex", gap: 30, alignItems: "stretch" }}>
        <CompareCol title="Traditional Benefits" items={CMP_TRAD} baseDelay={8} />
        <CompareCol title="GMAX Portable Benefit" items={CMP_GMAX} good baseDelay={16} />
      </div>
    </div>
  </CardBase>
);

export const BrandCard: React.FC<{ dur: number }> = ({ dur }) => (
  <CardBase dur={dur}>
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <RiseIn
        delay={4}
        dy={18}
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 150,
          letterSpacing: "0.04em",
          lineHeight: 1,
          background: `linear-gradient(180deg, ${C.orange}, ${C.orangeDeep})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 0 40px rgba(248,150,76,0.3))",
        }}
      >
        GMAX
      </RiseIn>
      <RiseIn
        delay={18}
        dy={16}
        style={{ fontFamily: SERIF, fontSize: 46, color: C.white, marginTop: 26 }}
      >
        A portable benefit built to <span style={{ color: C.orange }}>retain.</span>
      </RiseIn>
      <RiseIn delay={30} dy={12} style={{ marginTop: 46, opacity: 0.96 }}>
        <ValoramLogo size={44} />
      </RiseIn>
    </div>
  </CardBase>
);

export const OutcomesCard: React.FC<{ dur: number }> = ({ dur }) => {
  const items = ["Retain", "Compete", "Recruit"];
  return (
    <CardBase dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        {items.map((it, i) => (
          <React.Fragment key={it}>
            <RiseIn
              delay={6 + i * 12}
              dy={20}
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 58,
                color: i === 2 ? C.orange : C.white,
                padding: "20px 40px",
                border: `1px solid rgba(248,150,76,0.42)`,
                borderRadius: 18,
                background: "rgba(248,150,76,0.06)",
              }}
            >
              {it}
            </RiseIn>
            {i < items.length - 1 && (
              <RiseIn delay={12 + i * 12} dy={0} style={{ fontSize: 52, color: C.orange }}>
                →
              </RiseIn>
            )}
          </React.Fragment>
        ))}
      </div>
    </CardBase>
  );
};

export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = useRise(24);
  const bob = Math.sin(frame / 12) * 6;
  return (
    <CardBase dur={dur}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <RiseIn delay={4} style={{ fontFamily: SERIF, fontSize: 78, color: C.white }}>
          Score your retention risk
        </RiseIn>
        <RiseIn
          delay={14}
          dy={12}
          style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 32, color: C.orange, marginTop: 18 }}
        >
          Free in 3 minutes — get your Retention Risk Score
        </RiseIn>
        <div style={{ fontSize: 84, color: C.orange, marginTop: 20, opacity: a, transform: `translateY(${bob}px)` }}>
          ↓
        </div>
        <RiseIn delay={34} dy={10} style={{ marginTop: 30 }}>
          <ValoramLogo size={44} />
        </RiseIn>
      </div>
    </CardBase>
  );
};

export const FormOverlay: React.FC = () => {
  const e = useRise(6);
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 12) * 5;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: e,
      }}
    >
      <div style={{ fontSize: 56, color: C.orange, transform: `translateY(${bob}px)` }}>↓</div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 46,
          color: C.white,
          background: "rgba(0,0,0,0.68)",
          padding: "10px 26px",
          borderRadius: 12,
        }}
      >
        Take the free assessment below
      </div>
    </div>
  );
};

// Karaoke captions for B-roll, active word in brand orange.
export const GmaxCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  let active: (typeof GMAX_CAPTIONS)[number] | null = null;
  for (const line of GMAX_CAPTIONS) {
    const s = line.words[0].start;
    const e = line.words[line.words.length - 1].end + GMAX_CAPTION_HOLD;
    if (frame >= s && frame < e) active = line;
  }
  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 130,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 12px",
        padding: "0 220px",
      }}
    >
      {active.words.map((w, i) => {
        if (frame < w.start) return null;
        const isActive = frame >= w.start && frame < w.end;
        const pop = interpolate(frame, [w.start, w.start + 5], [0.72, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 56,
              color: isActive ? C.orange : C.white,
              background: "rgba(0,0,0,0.72)",
              borderRadius: 10,
              padding: "8px 16px",
              transform: `scale(${pop})`,
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
