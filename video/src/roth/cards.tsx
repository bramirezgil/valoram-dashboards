import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ROTH as C, SERIF, UI, TEXT_SHADOW } from "./theme";
import { ROTH_CAPTIONS, ROTH_CAPTION_HOLD } from "./script";
import { ValoramLogo } from "../gmax/ValoramLogo";

const useFade = (dur: number, inF = 12, outF = 10) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, inF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [dur - outF, dur - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
};

const useRise = (delay: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 200, mass: 0.8, stiffness: 110 } });
};

const RiseIn: React.FC<{
  delay: number;
  dy?: number;
  dx?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, dy = 18, dx = 0, children, style }) => {
  const e = useRise(delay);
  return (
    <div style={{ opacity: e, transform: `translate(${(1 - e) * dx}px, ${(1 - e) * dy}px)`, ...style }}>
      {children}
    </div>
  );
};

// Slate stage with a soft orange glow — the shared background for all cards.
const Stage: React.FC<{ dur: number; children: React.ReactNode; pad?: number }> = ({ dur, children, pad = 180 }) => {
  const fade = useFade(dur);
  return (
    <AbsoluteFill style={{ backgroundColor: C.slate, opacity: fade }}>
      <AbsoluteFill style={{ background: "radial-gradient(58% 52% at 50% 42%, rgba(248,150,76,0.10), rgba(10,10,10,0) 70%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.72) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: `0 ${pad}px` }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 0 — TITLE: logo fades up on near-black, music only.
export const TitleCard: React.FC<{ dur: number }> = ({ dur }) => (
  <Stage dur={dur}>
    <RiseIn delay={6} dy={10} style={{ opacity: 0.98 }}>
      <ValoramLogo size={58} />
    </RiseIn>
  </Stage>
);

// 6 — intentional 1.5s silence: hold on a quiet, graded frame.
export const SilenceHold: React.FC<{ dur: number }> = ({ dur }) => (
  <AbsoluteFill style={{ backgroundColor: C.slate, opacity: useFade(dur, 8, 8) }}>
    <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 50% 50%, rgba(248,150,76,0.05), rgba(0,0,0,0) 72%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 50% 50%, transparent 45%, rgba(0,0,0,0.85) 100%)" }} />
  </AbsoluteFill>
);

// Emotional quote — Marcellus. "pill" adds a dark rounded panel (text card 1);
// "plain" is text-only over the stage (text card 3 / the wife's line).
export const QuoteCard: React.FC<{ dur: number; text: string; variant?: "pill" | "plain"; italic?: boolean }> = ({
  dur,
  text,
  variant = "plain",
  italic,
}) => {
  const e = useRise(6);
  const inner = (
    <div
      style={{
        fontFamily: SERIF,
        fontStyle: italic ? "italic" : "normal",
        fontSize: 62,
        lineHeight: 1.28,
        color: C.text,
        textAlign: "center",
        textShadow: TEXT_SHADOW,
        maxWidth: 1250,
      }}
    >
      {text}
    </div>
  );
  return (
    <Stage dur={dur}>
      <div style={{ opacity: e, transform: `translateY(${(1 - e) * 16}px)` }}>
        {variant === "pill" ? (
          <div
            style={{
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(248,150,76,0.22)",
              borderRadius: 22,
              padding: "40px 56px",
            }}
          >
            {inner}
          </div>
        ) : (
          inner
        )}
      </div>
    </Stage>
  );
};

// 19 — anchor line typed in word-by-word over a dark panel (text card 4).
export const TypedCard: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const start = 10;
  const per = 3.2; // frames per word
  const shown = Math.max(0, Math.min(words.length, Math.floor((frame - start) / per)));
  const panel = useRise(2);
  return (
    <Stage dur={dur}>
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          borderRadius: 20,
          padding: "48px 64px",
          maxWidth: 1300,
          opacity: panel,
          transform: `scale(${0.98 + panel * 0.02})`,
        }}
      >
        <div style={{ fontFamily: SERIF, fontSize: 60, lineHeight: 1.3, color: C.text, textAlign: "center", textShadow: TEXT_SHADOW }}>
          {words.map((w, i) => (
            <span key={i} style={{ opacity: i < shown ? 1 : 0, transition: "opacity 0.1s" }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// RMD lower-third (text card 2): Poppins, orange left rule, slides in from left.
export const RmdLowerThird: React.FC = () => {
  const e = useRise(6);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        bottom: 190,
        opacity: e,
        transform: `translateX(${(1 - e) * -40}px)`,
        borderLeft: `3px solid ${C.orange}`,
        background: "rgba(10,10,10,0.72)",
        padding: "16px 24px",
        maxWidth: 720,
      }}
    >
      <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 30, color: C.white, textShadow: TEXT_SHADOW }}>
        RMDs begin at 73. The pre-RMD window is closing.
      </div>
    </div>
  );
};

// CTA lower-third (text card 5): orange headline + white subline, slides up.
export const CtaLowerThird: React.FC = () => {
  const e = useRise(6);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        bottom: 150,
        opacity: e,
        transform: `translateY(${(1 - e) * 30}px)`,
        background: "rgba(10,10,10,0.78)",
        border: "1px solid rgba(248,150,76,0.25)",
        borderRadius: 14,
        padding: "18px 26px",
        maxWidth: 900,
      }}
    >
      <div style={{ fontFamily: SERIF, fontSize: 40, color: C.orange, textShadow: TEXT_SHADOW }}>
        Score My Retirement Tax Situation
      </div>
      <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,0.72)", marginTop: 6 }}>
        A senior advisor will personally review your results.
      </div>
    </div>
  );
};

// 23 — END CARD: CTA + sequential fade-ins + compliance disclosure.
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  // End card holds — fade in only, no exit fade (avoids a degenerate range).
  const fade = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wipe = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.985 + Math.sin(frame / 16) * 0.015;
  return (
    <AbsoluteFill style={{ backgroundColor: C.slate, opacity: fade, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(60% 55% at 50% 40%, rgba(248,150,76,0.10), rgba(10,10,10,0) 72%)" }} />
      {/* orange top border wipe */}
      <div style={{ position: "absolute", top: 0, left: 0, height: 3, width: `${wipe * 100}%`, background: C.orange }} />
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 160px" }}>
        <RiseIn delay={9} dy={10}>
          <ValoramLogo size={40} />
        </RiseIn>
        <RiseIn
          delay={18}
          dy={12}
          style={{ fontFamily: UI, fontWeight: 700, fontSize: 17, letterSpacing: "0.16em", textTransform: "uppercase", color: C.orange, marginTop: 26 }}
        >
          Free Retirement Tax Assessment
        </RiseIn>
        <RiseIn delay={27} dy={14} style={{ fontFamily: SERIF, fontSize: 74, lineHeight: 1.1, color: C.white, marginTop: 16 }}>
          Score Your Retirement Tax Situation
        </RiseIn>
        <RiseIn
          delay={36}
          dy={12}
          style={{ fontFamily: UI, fontWeight: 400, fontSize: 24, lineHeight: 1.5, color: C.sub, marginTop: 22, maxWidth: 1000 }}
        >
          Find out where your IRA and 401(k) stand — before RMDs begin. Takes a few minutes, scored and reviewed by a senior advisor.
        </RiseIn>
        <RiseIn delay={48} dy={14} style={{ marginTop: 34 }}>
          <div
            style={{
              fontFamily: UI,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "0.02em",
              color: C.slate,
              background: C.orange,
              padding: "20px 44px",
              borderRadius: 10,
              transform: `scale(${pulse})`,
              boxShadow: "0 10px 34px rgba(248,150,76,0.32)",
            }}
          >
            Score My Retirement Tax Situation →
          </div>
        </RiseIn>
        <RiseIn delay={58} dy={10} style={{ fontFamily: UI, fontWeight: 500, fontSize: 19, color: "rgba(255,255,255,0.62)", marginTop: 18 }}>
          🔒 No obligation. Your information is private and never sold.
        </RiseIn>
        <RiseIn delay={66} dy={8} style={{ fontFamily: UI, fontWeight: 600, fontSize: 18, color: C.dim, marginTop: 12 }}>
          valoramsolutions.com · (408) 825-6726
        </RiseIn>
      </div>
      {/* compliance disclosure — always-visible tiny text, bottom 4% */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 120,
          right: 120,
          textAlign: "center",
          fontFamily: UI,
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.34)",
        }}
      >
        Valoram Solutions is a financial services and insurance agency (IMO). CA License #6005873. 1810 Gateway Dr #380, San
        Mateo, CA 94404. This video is for educational purposes only and does not constitute tax, legal, investment, or
        financial advice. Consult a qualified tax professional before implementing any strategy. Results vary. © 2026 Valoram
        Solutions.
      </div>
    </AbsoluteFill>
  );
};

// Karaoke captions over b-roll — active word in brand orange.
export const RothCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  let active: (typeof ROTH_CAPTIONS)[number] | null = null;
  for (const line of ROTH_CAPTIONS) {
    const s = line.words[0].start;
    const e = line.words[line.words.length - 1].end + ROTH_CAPTION_HOLD;
    if (frame >= s && frame < e) active = line;
  }
  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 120,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 12px",
        padding: "0 240px",
      }}
    >
      {active.words.map((w, i) => {
        if (frame < w.start) return null;
        const isActive = frame >= w.start && frame < w.end;
        const pop = interpolate(frame, [w.start, w.start + 5], [0.75, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span
            key={i}
            style={{
              fontFamily: UI,
              fontWeight: 700,
              fontSize: 44,
              color: isActive ? C.orange : C.white,
              background: "rgba(0,0,0,0.72)",
              borderRadius: 9,
              padding: "6px 14px",
              transform: `scale(${pop})`,
              boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
