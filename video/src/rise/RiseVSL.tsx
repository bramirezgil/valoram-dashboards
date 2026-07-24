import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../vsl/fonts";
import { SEGMENTS, sec, CLIP_DUR } from "./script";
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

// A single clip stretched to play exactly once across `dur` frames (no loop).
const Clip: React.FC<{ clip: string; dur: number }> = ({ clip, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clipFrames = (CLIP_DUR[clip] ?? 10) * fps;
  const rate = Math.max(0.4, Math.min(1.6, clipFrames / dur)); // stretch to fill, no repeat
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
        <OffthreadVideo src={staticFile(`broll/${clip}`)} muted playbackRate={rate} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Footage: React.FC<{ clips: string[]; dur: number; overlay?: "form" }> = ({
  clips,
  dur,
  overlay,
}) => {
  const OVL = 10; // crossfade between montage clips
  const per = dur / clips.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {clips.map((c, i) => {
        const from = Math.round(i * per);
        const last = i === clips.length - 1;
        const len = Math.round(per) + (last ? 0 : OVL);
        return (
          <Sequence key={i} from={from} durationInFrames={len} name={`clip-${c}-${i}`}>
            <Clip clip={c} dur={len} />
          </Sequence>
        );
      })}
      {/* warm, slightly desaturated feel + legibility grade */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(13,31,60,0.32) 0%, rgba(13,31,60,0.05) 24%, rgba(13,31,60,0.05) 52%, rgba(6,12,22,0.82) 100%)",
        }}
      />
      {/* brand watermark top-left */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: 210 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 120% at 0% 0%, rgba(6,12,22,0.62) 0%, rgba(6,12,22,0) 70%)",
          }}
        />
        <div style={{ position: "absolute", left: 62, top: 52, filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.9))" }}>
          <Logo size={66} />
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
        const from = sec(s.start);
        const dur = sec(s.end) - sec(s.start);
        const withTail = dur + 10; // small dissolve overlap
        return (
          <Sequence key={i} from={from} durationInFrames={withTail} name={`${s.kind}-${i}`}>
            {s.kind === "broll" ? (
              <Footage clips={s.clips} dur={withTail} overlay={s.overlay} />
            ) : (
              renderCard(s.card, withTail)
            )}
          </Sequence>
        );
      })}

      {/* karaoke captions on the absolute timeline (B-roll only) */}
      <RiseCaptions />

      {/* music bed — moderate now (no VO yet); drop to ~0.15 once a voiceover is added */}
      <Audio
        src={staticFile("music-rise.mp3")}
        volume={(f) =>
          interpolate(f, [0, 24], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
    </AbsoluteFill>
  );
};
