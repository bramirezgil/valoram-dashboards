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
import { SEGMENTS, GMAX_DURATION, VO_RANGES, GMAX_COLORS as C } from "./script";
import { BROLL_DIR, BROLL_LOOP, BROLL_STILL } from "./broll";
import {
  TextCard,
  StatCard,
  SplitCard,
  BrandCard,
  OutcomesCard,
  EndCard,
  FormOverlay,
  GmaxCaptions,
} from "./cards";
import { ValoramLogo } from "./ValoramLogo";

export { GMAX_DURATION, GMAX_FPS } from "./script";

const Footage: React.FC<{ clip: string; dur: number; overlay?: "form" }> = ({ clip, dur, overlay }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, dur], [1.05, 1.12]);
  const fade = Math.min(
    interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 12, dur - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const still = BROLL_STILL[clip];
  return (
    <AbsoluteFill style={{ opacity: fade, backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {/* poster still (Pixabay photo) behind the clip — shows if the video is
            slow to decode and gives the beat a matching frame to settle on */}
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
      {/* navy legibility grade — same treatment as the R.I.S.E. footage */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(13,31,60,0.32) 0%, rgba(13,31,60,0.05) 24%, rgba(13,31,60,0.05) 52%, rgba(6,12,22,0.82) 100%)",
        }}
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
    case "split":
      return <SplitCard dur={dur} />;
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
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
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
      <Audio src={staticFile("music.mp3")} volume={musicVolume} loop />
    </AbsoluteFill>
  );
};
