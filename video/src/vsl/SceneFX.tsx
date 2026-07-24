import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Deterministic pseudo-random (no Math.random — frames render across processes).
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 13.7) * 43758.5453;
  return x - Math.floor(x);
};
const GOLD = "211,175,101";
const GREEN = "99,190,151";
const MUTED = "150,170,190";

/** Darkening veil so a themed FX stays behind the copy and text stays legible. */
const Veil: React.FC<{ a?: number }> = ({ a = 0.42 }) => (
  <AbsoluteFill style={{ background: `rgba(6,12,22,${a})` }} />
);

// ---------------------------------------------------------------------------
// 1) HOOK — savings accumulation bars filling up over "thirty years"
// ---------------------------------------------------------------------------
export const FxAccumulation: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 34;
  const bars = [];
  for (let i = 0; i < N; i++) {
    const target = 8 + Math.pow(i / N, 1.35) * 86 + rand(i) * 6;
    const start = i * 3.0;
    const grow = interpolate(frame, [start, start + 26], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const h = target * grow;
    bars.push(
      <div
        key={i}
        style={{
          width: `${100 / N}%`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "44%",
            height: `${h}%`,
            background: `linear-gradient(180deg, rgba(${GOLD},0.30), rgba(${GOLD},0.04))`,
            borderTop: `1px solid rgba(${GOLD},0.45)`,
            borderRadius: "2px 2px 0 0",
          }}
        />
      </div>,
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end" }}>
        <div style={{ display: "flex", alignItems: "flex-end", width: "100%", height: "54%" }}>
          {bars}
        </div>
      </AbsoluteFill>
      <Veil a={0.4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2) IS THIS YOU — retirement accounts orbiting a nest egg
// ---------------------------------------------------------------------------
export const FxAccounts: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width * 0.74;
  const cy = height * 0.5;
  const tags = ["401(k)", "IRA", "Roth", "Pension", "RMD", "HSA"];
  const items = tags.map((t, i) => {
    const ang = frame * 0.007 + (i / tags.length) * Math.PI * 2;
    const R = 200 + (i % 2) * 84;
    return { t, x: cx + Math.cos(ang) * R, y: cy + Math.sin(ang) * R * 0.66 };
  });
  const pulse = 0.5 + (Math.sin(frame / 24) + 1) * 0.18;
  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {items.map((it, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={it.x}
            y2={it.y}
            stroke={`rgba(${GOLD},0.12)`}
            strokeWidth={1}
          />
        ))}
        <circle cx={cx} cy={cy} r={74} fill={`rgba(${GOLD},0.05)`} stroke={`rgba(${GOLD},${pulse.toFixed(2)})`} strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={40} fill={`rgba(${GOLD},0.10)`} />
      </svg>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: it.x,
            top: it.y,
            transform: "translate(-50%,-50%)",
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: `rgba(${GOLD},0.85)`,
            border: `1px solid rgba(${GOLD},0.45)`,
            borderRadius: 999,
            padding: "6px 14px",
            background: "rgba(10,20,32,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          {it.t}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          transform: "translate(-50%,-50%)",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: `rgba(${GOLD},0.9)`,
        }}
      >
        Nest egg
      </div>
      <Veil a={0.34} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3) BALANCE — tax "erosion" flecks draining downward
// ---------------------------------------------------------------------------
export const FxErosion: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 46;
  const dots = [];
  for (let i = 0; i < N; i++) {
    const bx = rand(i * 2 + 1);
    const sp = 0.4 + rand(i) * 0.8;
    const y = (rand(i * 2 + 2) + (frame * sp) / 640) % 1;
    const a = 0.05 + (Math.sin(frame / 18 + i) + 1) * 0.05;
    dots.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${bx * 100}%`,
          top: `${y * 100}%`,
          width: 3,
          height: 11,
          borderRadius: 2,
          background: `rgba(${GOLD},${a.toFixed(3)})`,
        }}
      />,
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill>{dots}</AbsoluteFill>
      <Veil a={0.36} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 4) PLANNING — two diverging routes (jagged default vs smooth plan)
// ---------------------------------------------------------------------------
const lerpPoly = (pts: number[][], t: number) => {
  const total = pts.length - 1;
  const f = Math.min(0.9999, Math.max(0, t)) * total;
  const i = Math.floor(f);
  const r = f - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
};

export const FxPaths: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const draw = interpolate(frame, [0, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const smooth = [
    [0.0, 0.74],
    [0.22, 0.72],
    [0.45, 0.6],
    [0.68, 0.44],
    [0.85, 0.34],
    [1.0, 0.26],
  ].map(([x, y]) => [x * width, y * height]);
  const jag = [
    [0.0, 0.76],
    [0.14, 0.66],
    [0.26, 0.8],
    [0.4, 0.62],
    [0.54, 0.82],
    [0.7, 0.66],
    [0.85, 0.86],
    [1.0, 0.72],
  ].map(([x, y]) => [x * width, y * height]);
  const toPath = (p: number[][]) => p.map((q, i) => `${i ? "L" : "M"} ${q[0]} ${q[1]}`).join(" ");
  const [mx, my] = lerpPoly(smooth, draw);
  const LEN = 3200;
  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <path
          d={toPath(jag)}
          fill="none"
          stroke={`rgba(${MUTED},0.22)`}
          strokeWidth={2}
          strokeDasharray="7 8"
        />
        <path
          d={toPath(smooth)}
          fill="none"
          stroke={`rgba(${GOLD},0.7)`}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={LEN}
          strokeDashoffset={LEN * (1 - draw)}
        />
        {smooth.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill={`rgba(${GOLD},0.5)`} />
        ))}
        {draw > 0.02 && (
          <circle cx={mx} cy={my} r={7} fill={`rgb(${GOLD})`}>
            <animate attributeName="opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
      <Veil a={0.4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 5) MEET — three tax buckets with conversion flow
// ---------------------------------------------------------------------------
export const FxBuckets: React.FC = () => {
  const frame = useCurrentFrame();
  const buckets = [
    { label: "Taxable", base: 0.55, rgb: MUTED },
    { label: "Tax-deferred", base: 0.72, rgb: GOLD },
    { label: "Tax-free", base: 0.3, rgb: GREEN },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
      <div style={{ display: "flex", gap: 120, alignItems: "flex-end", paddingBottom: 70 }}>
        {buckets.map((b, i) => {
          // Tax-deferred drains as tax-free fills (a Roth conversion).
          const flow = (Math.sin(frame / 40) + 1) / 2;
          let level = b.base;
          if (i === 1) level = b.base - flow * 0.22;
          if (i === 2) level = b.base + flow * 0.22;
          return (
            <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 120,
                  height: 190,
                  borderRadius: "8px 8px 14px 14px",
                  border: `1.5px solid rgba(${b.rgb},0.4)`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                  background: "rgba(10,20,32,0.35)",
                }}
              >
                <div
                  style={{
                    height: `${level * 100}%`,
                    background: `linear-gradient(180deg, rgba(${b.rgb},0.4), rgba(${b.rgb},0.14))`,
                    borderTop: `2px solid rgba(${b.rgb},0.7)`,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: `rgba(${b.rgb},0.75)`,
                }}
              >
                {b.label}
              </div>
            </div>
          );
        })}
      </div>
      <Veil a={0.5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 6) SCORE — sweeping gauge with 5 tiers
// ---------------------------------------------------------------------------
export const FxGauge: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.62;
  const R = 340;
  const sweep = interpolate(frame, [10, 70], [0, 0.66], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 5 tier arcs across a 180° gauge (pointing up)
  const arc = (a0: number, a1: number, r: number) => {
    const p = (a: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  };
  const tiers = [0, 1, 2, 3, 4];
  const needleA = Math.PI + sweep * Math.PI;
  const nx = cx + Math.cos(needleA) * (R - 24);
  const ny = cy + Math.sin(needleA) * (R - 24);
  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {tiers.map((t) => {
          const a0 = Math.PI + (t / 5) * Math.PI + 0.015;
          const a1 = Math.PI + ((t + 1) / 5) * Math.PI - 0.015;
          const op = 0.12 + t * 0.06;
          return (
            <path key={t} d={arc(a0, a1, R)} fill="none" stroke={`rgba(${GOLD},${op})`} strokeWidth={16} strokeLinecap="butt" />
          );
        })}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={`rgba(${GOLD},0.8)`} strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={9} fill={`rgb(${GOLD})`} />
      </svg>
      <Veil a={0.4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7) CTA — recurring income stream cadence
// ---------------------------------------------------------------------------
export const FxIncome: React.FC<{ veil?: number }> = ({ veil = 0.36 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const y = height * 0.5;
  const tokens = [];
  const COUNT = 7;
  const period = 150;
  for (let i = 0; i < COUNT; i++) {
    const local = (frame + i * (period / COUNT) * 1.0) % period;
    const t = local / period;
    const x = t * width;
    const a = Math.sin(t * Math.PI) * 0.5; // fade in/out along travel
    const rise = Math.sin(t * Math.PI) * 40;
    tokens.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y - rise,
          transform: "translate(-50%,-50%)",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: 30,
          color: `rgba(${GREEN},${a.toFixed(3)})`,
          textShadow: `0 0 16px rgba(${GREEN},${(a * 0.6).toFixed(3)})`,
        }}
      >
        +$
      </div>,
    );
  }
  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <line x1={0} y1={y} x2={width} y2={y} stroke={`rgba(${GOLD},0.16)`} strokeWidth={2} strokeDasharray="2 12" strokeLinecap="round" />
      </svg>
      {tokens}
      <Veil a={veil} />
    </AbsoluteFill>
  );
};
