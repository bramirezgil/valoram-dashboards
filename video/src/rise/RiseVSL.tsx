import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "../vsl/fonts";
import { SEGMENTS, RISE_DURATION, VO_RANGES } from "./script";
import {
  TextCard,
  SplitCard,
  StatCard,
  RiseCard,
  OutcomesCard,
  EndCard,
  FormOverlay,
  RiseCaptions,
} from "./cards";
import { Logo } from "../vsl/Logo";

export { RISE_DURATION, RISE_FPS } from "./script";

const LOOP: Record<string, number> = {
  "c0.mp4": 409,
  "c1.mp4": 432,
  "c2.mp4": 305,
  "c3.mp4": 222,
  "c4.mp4": 202,
  "c5.mp4": 343,
  "c6.mp4": 320,
};

const Footage: React.FC<{ clip: string; dur: number; overlay?: "form" }> = ({
  clip,
  dur,
  overlay,
}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, dur], [1.05, 1.12]);
  const fade = Math.min(
    interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 12, dur - 1], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return (
    <AbsoluteFill style={{ opacity: fade, backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Loop durationInFrames={LOOP[clip] ?? 300}>
          <OffthreadVideo src={staticFile(`broll/${clip}`)} muted />
        </Loop>
      </AbsoluteFill>
      {/* warm, slightly desaturated feel + legibility grade */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(13,31,60,0.32) 0%, rgba(13,31,60,0.05) 24%, rgba(13,31,60,0.05) 52%, rgba(6,12,22,0.82) 100%)",
        }}
      />
      {/* brand watermark top-left */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 170 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 120% at 0% 0%, rgba(6,12,22,0.6) 0%, rgba(6,12,22,0) 70%)",
          }}
        />
        <div style={{ position: "absolute", left: 56, top: 46, filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.9))" }}>
          <Logo size={46} />
        </div>
      </div>
      {overlay === "form" && <FormOverlay />}
    </AbsoluteFill>
  );
};

// Music bed: sits at a gentle level and ducks under the voiceover, lifting
// back up in the beats between lines. Ramped edges keep the dip musical.
const musicVolume = (f: number): number => {
  const base = 0.3;
  const duck = 0.12;
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
    interpolate(f, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [RISE_DURATION - 30, RISE_DURATION - 1], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return vol * fade;
};

const renderCard = (
  card: Extract<(typeof SEGMENTS)[number], { kind: "card" }>["card"],
  dur: number,
) => {
  switch (card.type) {
    case "text":
      return <TextCard dur={dur} lines={card.lines} />;
    case "split":
      return <SplitCard dur={dur} />;
    case "stat":
      return <StatCard dur={dur} number={card.number} label={card.label} />;
    case "rise":
      return <RiseCard dur={dur} />;
    case "outcomes":
      return <OutcomesCard dur={dur} />;
    case "end":
      return <EndCard dur={dur} />;
  }
};

export const RiseVSL: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SEGMENTS.map((s, i) => {
        const from = s.from;
        const dur = s.durFrames;
        const withTail = dur + 10; // small dissolve overlap
        return (
          <Sequence key={i} from={from} durationInFrames={withTail} name={`${s.kind}-${i}`}>
            {s.kind === "broll" ? (
              <Footage clip={s.clip} dur={withTail} overlay={s.overlay} />
            ) : (
              renderCard(s.card, withTail)
            )}
          </Sequence>
        );
      })}

      {/* karaoke captions on the absolute timeline (B-roll only) */}
      <RiseCaptions />

      {/* voiceover (offline neural TTS), normalized ~ -3 dBFS */}
      <Audio src={staticFile("narration-rise.mp3")} />

      {/* music bed — ducks under the voiceover, lifts between lines */}
      <Audio src={staticFile("music-rise.mp3")} volume={musicVolume} />
    </AbsoluteFill>
  );
};
