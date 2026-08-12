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
import { SEGMENTS, GMAX_DURATION, VO_RANGES, GMAX_COLORS as C } from "./script";
import {
  TextCard,
  StatCard,
  CompareCard,
  BrandCard,
  OutcomesCard,
  EndCard,
  FormOverlay,
  GmaxCaptions,
} from "./cards";
import { ValoramLogo } from "./ValoramLogo";

export { GMAX_DURATION, GMAX_FPS } from "./script";

const LOOP: Record<string, number> = {
  "c0.mp4": 409,
  "c1.mp4": 432,
  "c2.mp4": 305,
  "c3.mp4": 222,
  "c4.mp4": 202,
  "c5.mp4": 343,
  "c6.mp4": 320,
};

const Footage: React.FC<{ clip: string; dur: number; overlay?: "form" }> = ({ clip, dur, overlay }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, dur], [1.05, 1.12]);
  const fade = Math.min(
    interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 12, dur - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ opacity: fade, backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Loop durationInFrames={LOOP[clip] ?? 300}>
          <OffthreadVideo src={staticFile(`broll/${clip}`)} muted />
        </Loop>
      </AbsoluteFill>
      {/* warm, dark legibility grade (brand-neutral, slight orange lift at base) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,6,8,0.36) 0%, rgba(6,6,8,0.04) 24%, rgba(6,6,8,0.06) 50%, rgba(4,4,6,0.86) 100%)",
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(120% 90% at 50% 42%, rgba(248,150,76,0.05), rgba(0,0,0,0) 60%)" }}
      />
      {/* brand watermark top-left */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 180 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(120% 120% at 0% 0%, rgba(4,4,6,0.62) 0%, rgba(4,4,6,0) 70%)",
          }}
        />
        <div style={{ position: "absolute", left: 54, top: 46, filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.9))" }}>
          <ValoramLogo size={40} />
        </div>
      </div>
      {overlay === "form" && <FormOverlay />}
    </AbsoluteFill>
  );
};

const renderCard = (
  card: Extract<(typeof SEGMENTS)[number], { kind: "card" }>["card"],
  dur: number,
) => {
  switch (card.type) {
    case "text":
      return <TextCard dur={dur} lines={card.lines} />;
    case "stat":
      return <StatCard dur={dur} number={card.number} label={card.label} />;
    case "compare":
      return <CompareCard dur={dur} />;
    case "brand":
      return <BrandCard dur={dur} />;
    case "outcomes":
      return <OutcomesCard dur={dur} />;
    case "end":
      return <EndCard dur={dur} />;
  }
};

// Music bed: gentle, ducks under the voiceover, lifts between lines.
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
    interpolate(f, [GMAX_DURATION - 30, GMAX_DURATION - 1], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return vol * fade;
};

export const GmaxVSL: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {SEGMENTS.map((s, i) => {
        const withTail = s.durFrames + 10; // small dissolve overlap
        return (
          <Sequence key={i} from={s.from} durationInFrames={withTail} name={`${s.kind}-${i}`}>
            {s.kind === "broll" ? (
              <Footage clip={s.clip} dur={withTail} overlay={s.overlay} />
            ) : (
              renderCard(s.card, withTail)
            )}
          </Sequence>
        );
      })}

      <GmaxCaptions />

      {/* voiceover (offline neural TTS), normalized ~ -3 dBFS */}
      <Audio src={staticFile("narration-gmax.mp3")} />

      {/* music bed — ducks under the voiceover */}
      <Audio src={staticFile("music.mp3")} volume={musicVolume} />
    </AbsoluteFill>
  );
};
