import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Deterministic pseudo-random so every render process produces identical motion
// (never use Math.random here — Remotion renders frames across processes).
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 13.7) * 43758.5453;
  return x - Math.floor(x);
};

type Mood = "warm" | "growth" | "cool";

const hueOf = (mood: Mood) => (mood === "cool" ? "120,160,210" : "211,175,101");

// ---------------------------------------------------------------------------
// Drifting particle field
// ---------------------------------------------------------------------------
const Particles: React.FC<{ count: number; rgb: string; scale?: number }> = ({
  count,
  rgb,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const dots = [];
  for (let i = 0; i < count; i++) {
    const bx = rand(i * 3 + 1);
    const by = rand(i * 3 + 2);
    const sp = 0.15 + rand(i * 3 + 3) * 0.5;
    const size = (1.5 + rand(i + 7) * 4) * scale;
    const phase = rand(i + 11) * Math.PI * 2;
    // slow upward drift, wrapping
    const y = (by - ((frame * sp) / 900) + 1) % 1;
    const x = bx + Math.sin(frame / 90 + phase) * 0.02;
    const tw = 0.25 + (Math.sin(frame / 22 + phase) + 1) * 0.32;
    dots.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `rgba(${rgb},${tw.toFixed(3)})`,
          boxShadow: `0 0 ${size * 3}px rgba(${rgb},${(tw * 0.7).toFixed(3)})`,
        }}
      />,
    );
  }
  return <AbsoluteFill>{dots}</AbsoluteFill>;
};

// ---------------------------------------------------------------------------
// Slow diagonal light streaks
// ---------------------------------------------------------------------------
const Streaks: React.FC<{ rgb: string; count?: number }> = ({ rgb, count = 4 }) => {
  const frame = useCurrentFrame();
  const items = [];
  for (let i = 0; i < count; i++) {
    const base = rand(i * 5 + 4);
    const sp = 0.4 + rand(i * 5 + 5) * 0.8;
    const x = ((base + (frame * sp) / 1600) % 1.3) - 0.15;
    const w = 160 + rand(i + 3) * 260;
    const a = 0.05 + rand(i + 9) * 0.06;
    items.push(
      <div
        key={i}
        style={{
          position: "absolute",
          top: "-20%",
          left: `${x * 100}%`,
          width: w,
          height: "140%",
          transform: "rotate(18deg)",
          background: `linear-gradient(90deg, rgba(${rgb},0), rgba(${rgb},${a.toFixed(
            3,
          )}), rgba(${rgb},0))`,
          filter: "blur(6px)",
        }}
      />,
    );
  }
  return <AbsoluteFill style={{ overflow: "hidden" }}>{items}</AbsoluteFill>;
};

// ---------------------------------------------------------------------------
// Financial "growth curve" motif that draws on with a travelling glow dot
// ---------------------------------------------------------------------------
const GrowthCurve: React.FC<{ rgb: string; opacity?: number }> = ({ rgb, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pts = [
    [0.04, 0.86],
    [0.2, 0.8],
    [0.36, 0.68],
    [0.52, 0.58],
    [0.66, 0.4],
    [0.82, 0.26],
    [0.98, 0.12],
  ].map(([x, y]) => [x * width, y * height]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const mx = (px + cx) / 2;
    d += ` Q ${mx} ${py} ${cx} ${cy}`;
  }
  const draw = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = 2600;
  // travelling dot position (approximate along the last segment span)
  const t = Math.min(draw, 1);
  const dotIdx = Math.min(pts.length - 1, Math.floor(t * (pts.length - 1)));
  const [dx, dy] = pts[dotIdx];
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gc" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={`rgba(${rgb},0.15)`} />
            <stop offset="1" stopColor={`rgba(${rgb},0.9)`} />
          </linearGradient>
          <linearGradient id="gcfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={`rgba(${rgb},0.14)`} />
            <stop offset="1" stopColor={`rgba(${rgb},0)`} />
          </linearGradient>
        </defs>
        <path
          d={`${d} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#gcfill)"
          opacity={draw}
        />
        <path
          d={d}
          fill="none"
          stroke="url(#gc)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
        />
        {draw > 0.02 && (
          <circle cx={dx} cy={dy} r={7} fill={`rgb(${rgb})`}>
          </circle>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Expanding concentric rings, emitted on a cycle
// ---------------------------------------------------------------------------
const Rings: React.FC<{ rgb: string }> = ({ rgb }) => {
  const frame = useCurrentFrame();
  const rings = [];
  const period = 60;
  for (let k = 0; k < 4; k++) {
    const local = (frame + k * period) % (period * 4);
    const p = local / (period * 4);
    const size = 200 + p * 1400;
    const a = (1 - p) * 0.14;
    rings.push(
      <div
        key={k}
        style={{
          position: "absolute",
          left: "50%",
          top: "54%",
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: "50%",
          border: `1.5px solid rgba(${rgb},${a.toFixed(3)})`,
        }}
      />,
    );
  }
  return <AbsoluteFill>{rings}</AbsoluteFill>;
};

/**
 * A composed field of abstract "b-roll" motion in brand colors.
 * `opacity` controls how present it is; scenes use a low value behind text
 * and featured beats use full strength.
 */
export const BrollField: React.FC<{
  mood?: Mood;
  opacity?: number;
  showCurve?: boolean;
  showRings?: boolean;
}> = ({ mood = "warm", opacity = 1, showCurve = false, showRings = false }) => {
  const rgb = hueOf(mood);
  return (
    <AbsoluteFill style={{ opacity }}>
      <Streaks rgb={rgb} />
      {showCurve && <GrowthCurve rgb={rgb} opacity={0.9} />}
      {showRings && <Rings rgb={rgb} />}
      <Particles count={46} rgb={rgb} />
    </AbsoluteFill>
  );
};
