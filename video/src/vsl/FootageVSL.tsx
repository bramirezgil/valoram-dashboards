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
import "./fonts";
import { CaptionBar } from "./CaptionBar";
import { CAPTION_LINES } from "./captions";
import { Logo } from "./Logo";

export const FOOTAGE_FRAMES = 2655;

type Section = { start: number; end: number; clip: string; loop: number };

// Section timing (matches narration) + the b-roll clip behind each.
const SECTIONS: Section[] = [
  { start: 0, end: 345, clip: "c5.mp4", loop: 343 }, // Hook — counting money
  { start: 345, end: 660, clip: "c3.mp4", loop: 222 }, // Is this you — couple + advisor
  { start: 660, end: 930, clip: "c4.mp4", loop: 202 }, // Balance — tax forms
  { start: 930, end: 1410, clip: "c3.mp4", loop: 222 }, // Planning — advisor meeting
  { start: 1410, end: 2070, clip: "c2.mp4", loop: 305 }, // Meet Gregory — businessman
  { start: 2070, end: 2430, clip: "c1.mp4", loop: 432 }, // Score — magnifying glass
  { start: 2430, end: 2655, clip: "c0.mp4", loop: 409 }, // CTA — couple at the beach
];

const OVERLAP = 12;

const SectionFootage: React.FC<{ clip: string; loop: number; dur: number }> = ({
  clip,
  loop,
  dur,
}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, dur], [1.06, 1.14]);
  const fade = Math.min(
    interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 14, dur - 2], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return (
    <AbsoluteFill style={{ opacity: fade, backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Loop durationInFrames={loop}>
          <OffthreadVideo src={staticFile(`broll/${clip}`)} muted />
        </Loop>
      </AbsoluteFill>
      {/* legibility grade */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,12,22,0.34) 0%, rgba(6,12,22,0.05) 26%, rgba(6,12,22,0.05) 52%, rgba(6,12,22,0.82) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const FootageVSL: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SECTIONS.map((s, i) => {
        const last = i === SECTIONS.length - 1;
        const dur = s.end - s.start + (last ? 0 : OVERLAP);
        return (
          <Sequence key={i} from={s.start} durationInFrames={dur} name={`sec-${i}`}>
            <SectionFootage clip={s.clip} loop={s.loop} dur={dur} />
          </Sequence>
        );
      })}

      {/* captions + persistent brand mark, timed on the absolute timeline */}
      <CaptionBar lines={CAPTION_LINES} />
      <div style={{ position: "absolute", left: 56, bottom: 46, opacity: 0.95 }}>
        <Logo size={34} />
      </div>

      {/* audio: original narration at full, music bed ducked underneath */}
      <Audio src={staticFile("narration.mp3")} />
      <Audio
        src={staticFile("music.mp3")}
        volume={(f) =>
          Math.min(
            interpolate(f, [0, 24], [0, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            interpolate(f, [FOOTAGE_FRAMES - 45, FOOTAGE_FRAMES - 5], [0.15, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          )
        }
      />
    </AbsoluteFill>
  );
};
