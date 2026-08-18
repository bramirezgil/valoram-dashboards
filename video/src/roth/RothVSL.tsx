import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "../vsl/fonts";
import { SEGMENTS, ROTH_DURATION, VO_RANGES } from "./script";
import { ROTH as C, UI } from "./theme";
import { BROLL_DIR, BROLL, BROLL_LOOP, BROLL_STILL } from "./broll";
import { ValoramLogo } from "../gmax/ValoramLogo";
import {
  TitleCard,
  SilenceHold,
  QuoteCard,
  TypedCard,
  EndCard,
  RmdLowerThird,
  CtaLowerThird,
  RothCaptions,
} from "./cards";
import { TimelineGraphic, ScorecardGraphic } from "./graphics";

export { ROTH_DURATION, ROTH_FPS } from "./script";

// Branded placeholder shown for any b-roll beat that has no clip yet. Elegant
// slate + drifting orange glow, with a small hint chip naming the shot to source.
const Placeholder: React.FC<{ hint: string; dur: number }> = ({ hint, dur }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 8;
  const drift2 = Math.cos(frame / 55) * 6;
  const glow = 0.09 + Math.sin(frame / 30) * 0.02;
  return (
    <AbsoluteFill style={{ backgroundColor: C.slate }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 55% at ${50 + drift}% ${44 + drift2}%, rgba(248,150,76,${glow}), rgba(10,10,10,0) 68%)`,
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 42%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 50% 50%, transparent 52%, rgba(0,0,0,0.7) 100%)" }} />
      {/* hint chip — names the footage to source; unobtrusive, top-center */}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: UI,
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.5)",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(248,150,76,0.25)",
            borderRadius: 999,
            padding: "8px 20px",
          }}
        >
          ▷ B-roll placeholder — {hint}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Footage: React.FC<{ beat: string; hint: string; dur: number; overlay?: "rmd" | "cta" }> = ({
  beat,
  hint,
  dur,
  overlay,
}) => {
  const frame = useCurrentFrame();
  const clip = BROLL[beat];
  const still = clip ? BROLL_STILL[clip] : undefined;
  const zoom = interpolate(frame, [0, dur], [1.05, 1.12]);
  const fade = Math.min(
    interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 12, dur - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ opacity: fade, backgroundColor: C.slate }}>
      {clip ? (
        <>
          <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
            {still && (
              <Img src={staticFile(`${BROLL_DIR}/${still}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
            <Loop durationInFrames={BROLL_LOOP[clip] ?? 300}>
              <OffthreadVideo
                src={staticFile(`${BROLL_DIR}/${clip}`)}
                muted
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Loop>
          </AbsoluteFill>
          {/* legibility grade — warm-neutral, lifted shadows per the bible */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.30) 0%, rgba(10,10,10,0.04) 26%, rgba(10,10,10,0.05) 52%, rgba(0,0,0,0.82) 100%)",
            }}
          />
        </>
      ) : (
        <Placeholder hint={hint} dur={dur} />
      )}
      {/* brand watermark top-left */}
      <div style={{ position: "absolute", left: 54, top: 46, filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.9))" }}>
        <ValoramLogo size={34} />
      </div>
      {overlay === "rmd" && <RmdLowerThird />}
      {overlay === "cta" && <CtaLowerThird />}
    </AbsoluteFill>
  );
};

const renderCard = (card: Extract<(typeof SEGMENTS)[number], { kind: "card" }>["card"], dur: number) => {
  switch (card.type) {
    case "title":
      return <TitleCard dur={dur} />;
    case "silence":
      return <SilenceHold dur={dur} />;
    case "quote":
      return <QuoteCard dur={dur} text={card.text} variant={card.variant} italic={card.italic} />;
    case "typed":
      return <TypedCard dur={dur} text={card.text} />;
    case "timeline":
      return <TimelineGraphic dur={dur} />;
    case "scorecard":
      return <ScorecardGraphic dur={dur} />;
    case "end":
      return <EndCard dur={dur} />;
  }
};

// Music bed (placeholder): gentle, ducks under the voiceover, lifts between lines.
const musicVolume = (f: number): number => {
  const base = 0.18;
  const duck = 0.06;
  const ramp = 10;
  let vol = base;
  for (const [a, b] of VO_RANGES) {
    const dip = interpolate(f, [a - ramp, a, b, b + ramp], [base, duck, duck, base], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    vol = Math.min(vol, dip);
  }
  const fade = Math.min(
    interpolate(f, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [ROTH_DURATION - 40, ROTH_DURATION - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return vol * fade;
};

export const RothVSL: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.slate }}>
      {SEGMENTS.map((s, i) => {
        const withTail = s.durFrames + 8;
        return (
          <Sequence key={i} from={s.from} durationInFrames={withTail} name={`${s.kind}-${i}`}>
            {s.kind === "broll" ? (
              <Footage beat={s.beat} hint={s.hint} dur={withTail} overlay={s.overlay} />
            ) : (
              renderCard(s.card, withTail)
            )}
          </Sequence>
        );
      })}

      <RothCaptions />

      {/* voiceover (offline neural TTS) */}
      <Audio src={staticFile("narration-roth.mp3")} />

      {/* placeholder music bed — swap public/music.mp3 for the ambient piano track */}
      <Audio src={staticFile("music.mp3")} volume={musicVolume} loop />
    </AbsoluteFill>
  );
};
