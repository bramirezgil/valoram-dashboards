import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "./theme";

// ---------------------------------------------------------------------------
// Motion helpers
// ---------------------------------------------------------------------------

/** Scene-level opacity that fades content in at the start and out at the end. */
export const useSceneFade = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return Math.min(fadeIn, fadeOut);
};

/** Spring-driven 0..1 progress with an optional start delay. */
export const useEnter = (delay = 0, config?: Parameters<typeof spring>[0]["config"]) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: config ?? { damping: 200, mass: 0.9, stiffness: 110 },
  });
};

/** Rises children up + fades in with a spring, staggered by `delay` frames. */
export const Rise: React.FC<{
  delay?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, distance = 34, children, style }) => {
  const e = useEnter(delay);
  return (
    <div
      style={{
        opacity: e,
        transform: `translateY(${(1 - e) * distance}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Text primitives
// ---------------------------------------------------------------------------

export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const e = useEnter(delay);
  return (
    <div
      style={{
        fontFamily: FONTS.body,
        fontWeight: 600,
        fontSize: 21,
        letterSpacing: "0.34em",
        textTransform: "uppercase",
        color: COLORS.gold,
        opacity: e * 0.95,
        transform: `translateY(${(1 - e) * 14}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** A short animated gold rule used under eyebrows / headlines. */
export const GoldRule: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 84,
}) => {
  const e = useEnter(delay);
  return (
    <div
      style={{
        height: 3,
        width: e * width,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${COLORS.goldDeep}, ${COLORS.goldBright})`,
        boxShadow: `0 0 18px ${COLORS.goldGlow}`,
      }}
    />
  );
};

type Seg = { t: string; gold?: boolean; strike?: boolean };

/** Headline with per-word gold / strikethrough styling. */
export const Headline: React.FC<{
  segments: Seg[];
  size?: number;
  delay?: number;
  align?: "left" | "center";
  maxWidth?: number;
}> = ({ segments, size = 78, delay = 0, align = "left", maxWidth }) => {
  const e = useEnter(delay);
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: FONTS.display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.015em",
        color: COLORS.ink,
        textAlign: align,
        whiteSpace: "pre-line",
        maxWidth,
        opacity: e,
        transform: `translateY(${(1 - e) * 26}px)`,
      }}
    >
      {segments.map((s, i) => (
        <span
          key={i}
          style={{
            textDecoration: s.strike ? "line-through" : undefined,
            textDecorationColor: s.strike ? COLORS.subDim : undefined,
            textDecorationThickness: s.strike ? 5 : undefined,
            color: s.strike ? COLORS.subDim : s.gold ? COLORS.gold : COLORS.ink,
          }}
        >
          {s.t}
        </span>
      ))}
    </h1>
  );
};

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: boolean;
  delay?: number;
}> = ({ children, style, accent = false, delay = 0 }) => {
  const e = useEnter(delay);
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 18,
        background: accent
          ? "linear-gradient(180deg, rgba(211,175,101,0.10), rgba(211,175,101,0.03))"
          : COLORS.panel,
        border: `1px solid ${accent ? COLORS.panelBorder : COLORS.panelBorderSoft}`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        opacity: e,
        transform: `translateY(${(1 - e) * 30}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const e = useEnter(delay, { damping: 200, mass: 0.7, stiffness: 130 });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "11px 20px",
        borderRadius: 999,
        fontFamily: FONTS.body,
        fontWeight: 600,
        fontSize: 20,
        color: COLORS.inkSoft,
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${COLORS.panelBorderSoft}`,
        opacity: e,
        transform: `translateY(${(1 - e) * 18}px) scale(${0.92 + e * 0.08})`,
      }}
    >
      {children}
    </div>
  );
};

/** Full-bleed scene wrapper with consistent 120px side padding.
 *  `fx` renders a full-bleed animated layer behind the content (shares the fade). */
export const Stage: React.FC<{
  children: React.ReactNode;
  fade: number;
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  fx?: React.ReactNode;
}> = ({ children, fade, justify = "center", align = "flex-start", fx }) => (
  <AbsoluteFill
    style={{
      opacity: fade,
      padding: "0 130px",
      justifyContent: justify,
      alignItems: align,
    }}
  >
    {fx ? <AbsoluteFill style={{ padding: 0 }}>{fx}</AbsoluteFill> : null}
    {children}
  </AbsoluteFill>
);
