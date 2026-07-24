import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RISE_COLORS as C, RISE_CAPTIONS, RISE_CAPTION_HOLD } from "./script";
import { Logo } from "../vsl/Logo";

const DISPLAY = "'Poppins', system-ui, sans-serif";
const BODY = "'Inter', system-ui, sans-serif";

const useCardFade = (dur: number) => {
  const frame = useCurrentFrame();
  return Math.min(
    interpolate(frame, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 7, dur - 1], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
};

const useRise = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.8, stiffness: 110 } });
};

// Fades + slides a single element in (one hook per instance — safe inside maps).
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
    <AbsoluteFill style={{ backgroundColor: C.navy, opacity: fade }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 55% at 50% 42%, rgba(201,168,76,0.10), rgba(13,31,60,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(4,10,20,0.6) 100%)",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 160px" }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TextCard: React.FC<{ dur: number; lines: { t: string; gold?: boolean }[] }> = ({
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
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 78,
            lineHeight: 1.14,
            color: l.gold ? C.gold : C.white,
          }}
        >
          {l.t}
        </RiseIn>
      ))}
    </div>
  </CardBase>
);

export const SplitCard: React.FC<{ dur: number }> = ({ dur }) => (
  <CardBase dur={dur}>
    <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
      <RiseIn
        delay={6}
        dx={-26}
        dy={0}
        style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, color: C.dim }}
      >
        Preparation
      </RiseIn>
      <div style={{ fontFamily: BODY, fontSize: 34, color: C.sub }}>vs.</div>
      <RiseIn
        delay={14}
        dx={26}
        dy={0}
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 68,
          color: C.gold,
          textShadow: `0 0 30px rgba(201,168,76,0.35)`,
        }}
      >
        Strategy
      </RiseIn>
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
            fontSize: 190,
            lineHeight: 1,
            color: C.gold,
            opacity: e,
            transform: `scale(${0.86 + e * 0.14})`,
            textShadow: `0 0 50px rgba(201,168,76,0.4)`,
          }}
        >
          {number}
        </div>
        <RiseIn
          delay={16}
          style={{
            fontFamily: BODY,
            fontSize: 34,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.white,
            marginTop: 18,
          }}
        >
          {label}
        </RiseIn>
      </div>
    </CardBase>
  );
};

// Pacific Ridgeway brand reveal (replaces Valoram's R.I.S.E. name card).
export const RiseCard: React.FC<{ dur: number }> = ({ dur }) => (
  <CardBase dur={dur}>
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <RiseIn delay={4} dy={18} style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))" }}>
        <Logo size={92} />
      </RiseIn>
      <RiseIn
        delay={18}
        dy={16}
        style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, color: C.white, marginTop: 42 }}
      >
        A proactive tax strategy
      </RiseIn>
      <RiseIn
        delay={28}
        dy={16}
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 46,
          color: C.gold,
          textShadow: `0 0 30px rgba(201,168,76,0.3)`,
        }}
      >
        built around you.
      </RiseIn>
    </div>
  </CardBase>
);

export const OutcomesCard: React.FC<{ dur: number }> = ({ dur }) => {
  const items = ["Find It", "Recover It", "Build On It"];
  return (
    <CardBase dur={dur}>
      <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
        {items.map((it, i) => (
          <React.Fragment key={it}>
            <RiseIn
              delay={6 + i * 12}
              dy={20}
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 56,
                color: i === 2 ? C.gold : C.white,
                padding: "18px 34px",
                border: `1px solid rgba(201,168,76,0.4)`,
                borderRadius: 16,
                background: "rgba(201,168,76,0.06)",
              }}
            >
              {it}
            </RiseIn>
            {i < items.length - 1 && (
              <RiseIn delay={12 + i * 12} dy={0} style={{ fontSize: 50, color: C.gold }}>
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
        <RiseIn delay={4} style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 72, color: C.white }}>
          Fill out the form below
        </RiseIn>
        <RiseIn
          delay={14}
          dy={12}
          style={{ fontFamily: BODY, fontWeight: 500, fontSize: 32, color: C.gold, marginTop: 16 }}
        >
          Get Your Free Tax Elimination Scorecard
        </RiseIn>
        <div style={{ fontSize: 84, color: C.gold, marginTop: 20, opacity: a, transform: `translateY(${bob}px)` }}>
          ↓
        </div>
        <RiseIn delay={34} dy={10} style={{ marginTop: 30, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}>
          <Logo size={46} />
        </RiseIn>
      </div>
    </CardBase>
  );
};

// Lower-third "fill out the form" overlay shown over B-roll.
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
      <div style={{ fontSize: 56, color: C.gold, transform: `translateY(${bob}px)` }}>↓</div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 46,
          color: C.white,
          background: "rgba(0,0,0,0.66)",
          padding: "10px 24px",
          borderRadius: 12,
        }}
      >
        Fill out the form below
      </div>
    </div>
  );
};

// Karaoke captions for B-roll, gold active word (brand color).
export const RiseCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  let active: (typeof RISE_CAPTIONS)[number] | null = null;
  for (const line of RISE_CAPTIONS) {
    const s = line.words[0].start;
    const e = line.words[line.words.length - 1].end + RISE_CAPTION_HOLD;
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
              color: isActive ? C.gold : C.white,
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
