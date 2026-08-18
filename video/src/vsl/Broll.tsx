import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Deterministic pseudo-random so every render process produces identical motion
// (never use Math.random here — Remotion renders frames across processes).
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 13.7) * 43758.5453;
  return x - Math.floor(x);
};

type Mood = "warm" | "cool";
const GOLD = "211,175,101";
const GREEN = "99,190,151";
const hueOf = (mood: Mood) => (mood === "cool" ? "120,160,210" : GOLD);

// ---------------------------------------------------------------------------
// Drifting particle field
// ---------------------------------------------------------------------------
const Particles: React.FC<{ count: number; rgb: string }> = ({ count, rgb }) => {
  const frame = useCurrentFrame();
  const dots = [];
  for (let i = 0; i < count; i++) {
    const bx = rand(i * 3 + 1);
    const by = rand(i * 3 + 2);
    const sp = 0.15 + rand(i * 3 + 3) * 0.5;
    const size = 1.5 + rand(i + 7) * 3.5;
    const phase = rand(i + 11) * Math.PI * 2;
    const y = (by - (frame * sp) / 900 + 1) % 1;
    const x = bx + Math.sin(frame / 90 + phase) * 0.02;
    const tw = 0.2 + (Math.sin(frame / 22 + phase) + 1) * 0.3;
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
    const a = 0.05 + rand(i + 9) * 0.05;
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
          background: `linear-gradient(90deg, rgba(${rgb},0), rgba(${rgb},${a.toFixed(3)}), rgba(${rgb},0))`,
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
  const dotIdx = Math.min(pts.length - 1, Math.floor(draw * (pts.length - 1)));
  const [dx, dy] = pts[dotIdx];
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gc" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={`rgba(${rgb},0.12)`} />
            <stop offset="1" stopColor={`rgba(${rgb},0.85)`} />
          </linearGradient>
          <linearGradient id="gcfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={`rgba(${rgb},0.12)`} />
            <stop offset="1" stopColor={`rgba(${rgb},0)`} />
          </linearGradient>
        </defs>
        <path d={`${d} L ${width} ${height} L 0 ${height} Z`} fill="url(#gcfill)" opacity={draw} />
        <path
          d={d}
          fill="none"
          stroke="url(#gc)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
        />
        {draw > 0.02 && <circle cx={dx} cy={dy} r={7} fill={`rgb(${rgb})`} />}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Animated candlestick / market chart along the lower band
// ---------------------------------------------------------------------------
const Candles: React.FC<{ count?: number; opacity?: number }> = ({ count = 22, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const items = [];
  for (let i = 0; i < count; i++) {
    const osc = Math.sin(frame / 24 + i * 0.7);
    const up = osc > 0;
    const rgb = up ? GREEN : GOLD;
    const bodyH = 26 + (osc * 0.5 + 0.5) * 120 + rand(i) * 40;
    const wick = 30 + rand(i + 4) * 40;
    const baseline = 30 + rand(i + 2) * 80; // px up from bottom
    items.push(
      <div
        key={i}
        style={{
          position: "relative",
          width: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: baseline,
        }}
      >
        <div style={{ width: 2, height: wick, background: `rgba(${rgb},0.5)` }} />
        <div
          style={{
            width: 10,
            height: bodyH,
            borderRadius: 2,
            background: `rgba(${rgb},0.5)`,
            boxShadow: `0 0 10px rgba(${rgb},0.25)`,
          }}
        />
        <div style={{ width: 2, height: wick * 0.6, background: `rgba(${rgb},0.5)` }} />
      </div>,
    );
  }
  return (
    <AbsoluteFill style={{ opacity, alignItems: "flex-end", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 34,
          height: "46%",
          paddingBottom: 40,
        }}
      >
        {items}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scrolling finance/tax ticker tape
// ---------------------------------------------------------------------------
const Ticker: React.FC<{ top: string; speed: number; opacity: number; reverse?: boolean }> = ({
  top,
  speed,
  opacity,
  reverse = false,
}) => {
  const frame = useCurrentFrame();
  const cells = [
    "+12.4%",
    "$1,240",
    "ROTH",
    "−3.1%",
    "401(k)",
    "RMD AHEAD",
    "+8.7%",
    "IRA",
    "TAX-FREE",
    "$24,850",
    "0% BRACKET",
    "+5.2%",
  ];
  const period = 1400;
  const raw = (frame * speed) % period;
  const shift = reverse ? -period + raw : -raw;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: "300%",
        whiteSpace: "nowrap",
        transform: `translateX(${shift}px)`,
        opacity,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 22,
        letterSpacing: "0.14em",
        color: `rgba(${GOLD},0.5)`,
      }}
    >
      {Array.from({ length: 10 }).flatMap((_, r) =>
        cells.map((c, k) => (
          <span key={`${r}-${k}`} style={{ marginRight: 46 }}>
            <span style={{ color: c.startsWith("−") ? `rgba(${GOLD},0.35)` : `rgba(${GREEN},0.55)` }}>
              {c.match(/[%$]|BRACKET/) ? "◆ " : "› "}
            </span>
            {c}
          </span>
        )),
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Connected node network (data / financial connections)
// ---------------------------------------------------------------------------
const NodeNet: React.FC<{ rgb: string; count?: number; opacity?: number }> = ({
  rgb,
  count = 16,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const bx = rand(i * 9 + 1);
    const by = rand(i * 9 + 2);
    const ph = rand(i * 9 + 3) * Math.PI * 2;
    const x = (bx + Math.sin(frame / 130 + ph) * 0.03) * width;
    const y = (by + Math.cos(frame / 150 + ph) * 0.03) * height;
    nodes.push([x, y]);
  }
  const lines = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      const dist = Math.hypot(dx, dy);
      if (dist < 360) {
        const a = (1 - dist / 360) * 0.28;
        lines.push(
          <line
            key={`${i}-${j}`}
            x1={nodes[i][0]}
            y1={nodes[i][1]}
            x2={nodes[j][0]}
            y2={nodes[j][1]}
            stroke={`rgba(${rgb},${a.toFixed(3)})`}
            strokeWidth={1}
          />,
        );
      }
    }
  }
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height}>
        {lines}
        {nodes.map(([x, y], i) => {
          const pulse = 0.4 + (Math.sin(frame / 20 + i) + 1) * 0.3;
          return <circle key={i} cx={x} cy={y} r={2.6} fill={`rgba(${rgb},${pulse.toFixed(3)})`} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Rotating HUD ring (fintech / innovation motif)
// ---------------------------------------------------------------------------
const HudRing: React.FC<{ rgb: string; opacity?: number }> = ({ rgb, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const ang = (i / 60) * 360;
    const long = i % 5 === 0;
    ticks.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 2,
          height: long ? 14 : 7,
          background: `rgba(${rgb},${long ? 0.4 : 0.2})`,
          transform: `rotate(${ang}deg) translateY(-300px)`,
          transformOrigin: "center top",
        }}
      />,
    );
  }
  return (
    <AbsoluteFill style={{ opacity, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 640, height: 640 }}>
        {[300, 380, 470].map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: r,
              height: r,
              marginLeft: -r / 2,
              marginTop: -r / 2,
              borderRadius: "50%",
              border: `1px ${i === 1 ? "dashed" : "solid"} rgba(${rgb},0.16)`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotate(${frame * 0.6}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 90,
              borderRadius: "50%",
              background: `conic-gradient(from 0deg, rgba(${rgb},0.22), rgba(${rgb},0) 70deg, rgba(${rgb},0) 360deg)`,
              maskImage: "radial-gradient(circle, transparent 58%, black 60%, black 72%, transparent 74%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 58%, black 60%, black 72%, transparent 74%)",
            }}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${-frame * 0.25}deg)` }}>
          {ticks}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Floating finance / tax glyphs and terms
// ---------------------------------------------------------------------------
const GLYPHS = ["$", "%", "▲", "＋", "◆"];
const TAGS = ["Roth", "401(k)", "IRA", "RMD", "Tax-free", "1040"];

const FinanceGlyphs: React.FC<{ count: number; rgb: string; showTags?: boolean; strength?: number }> = ({
  count,
  rgb,
  showTags = true,
  strength = 1,
}) => {
  const frame = useCurrentFrame();
  const items = [];
  for (let i = 0; i < count; i++) {
    const bx = rand(i * 7 + 1);
    const by = rand(i * 7 + 2);
    const sp = 0.18 + rand(i * 7 + 3) * 0.5;
    const y = (by - (frame * sp) / 1100 + 1) % 1;
    const x = bx + Math.sin(frame / 100 + i) * 0.014;
    const rot = Math.sin(frame / 120 + i) * 8;
    const tw = (0.08 + (Math.sin(frame / 26 + i) + 1) * 0.13) * strength;
    const isTag = showTags && i % 3 === 0;
    const label = isTag ? TAGS[i % TAGS.length] : GLYPHS[i % GLYPHS.length];
    items.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          transform: `rotate(${rot}deg)`,
          opacity: tw,
        }}
      >
        {isTag ? (
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: `rgb(${rgb})`,
              border: `1px solid rgba(${rgb},0.5)`,
              borderRadius: 999,
              padding: "5px 13px",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        ) : (
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 24 + rand(i + 2) * 22,
              fontWeight: 700,
              color: `rgb(${rgb})`,
            }}
          >
            {label}
          </span>
        )}
      </div>,
    );
  }
  return <AbsoluteFill>{items}</AbsoluteFill>;
};

// ---------------------------------------------------------------------------
// Composed fields
// ---------------------------------------------------------------------------

/** Restrained, tax/finance-themed motion for BEHIND text (kept legible). */
export const BrollSubtle: React.FC<{ mood?: Mood }> = ({ mood = "warm" }) => {
  const rgb = hueOf(mood);
  return (
    <AbsoluteFill>
      <Streaks rgb={rgb} />
      <NodeNet rgb={rgb} count={14} opacity={0.5} />
      <FinanceGlyphs count={14} rgb={rgb} strength={0.7} />
      <Ticker top="82%" speed={1.1} opacity={0.16} />
      <Particles count={30} rgb={rgb} />
    </AbsoluteFill>
  );
};

/** Full tax/finance showcase for FEATURED full-screen beats. */
export const BrollShowcase: React.FC<{ mood?: Mood }> = ({ mood = "warm" }) => {
  const rgb = hueOf(mood);
  return (
    <AbsoluteFill>
      <HudRing rgb={rgb} opacity={0.9} />
      <Candles count={22} opacity={0.85} />
      <GrowthCurve rgb={rgb} opacity={0.85} />
      <NodeNet rgb={rgb} count={18} />
      <Ticker top="16%" speed={1.6} opacity={0.4} />
      <Ticker top="86%" speed={1.2} opacity={0.4} reverse />
      <FinanceGlyphs count={22} rgb={rgb} />
      <Particles count={40} rgb={rgb} />
    </AbsoluteFill>
  );
};
