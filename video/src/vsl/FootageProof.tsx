import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate } from "remotion";
import "./fonts";
import { CaptionBar, CaptionWord } from "./CaptionBar";
import { Logo } from "./Logo";

// Hard-coded sample caption timing (frames @30fps) just to show the STYLE.
const WORDS: CaptionWord[] = [
  { text: "thirty", start: 6, end: 20 },
  { text: "years", start: 20, end: 32 },
  { text: "filling", start: 32, end: 46 },
  { text: "it", start: 46, end: 62 },
  { text: "but", start: 78, end: 88 },
  { text: "who", start: 88, end: 98 },
  { text: "did", start: 98, end: 106 },
  { text: "you", start: 106, end: 116 },
  { text: "fill", start: 116, end: 126 },
  { text: "it", start: 126, end: 134 },
  { text: "for", start: 134, end: 150 },
];

export const FootageProof: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 150], [1.05, 1.12]); // slow ken-burns
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo src={staticFile("broll/c5.mp4")} muted />
      </AbsoluteFill>
      {/* legibility grade */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,12,22,0.28) 0%, rgba(6,12,22,0) 30%, rgba(6,12,22,0) 55%, rgba(6,12,22,0.78) 100%)",
        }}
      />
      <CaptionBar words={WORDS} />
      {/* brand label bottom-left, like the reference player */}
      <div style={{ position: "absolute", left: 60, bottom: 54, opacity: 0.96 }}>
        <Logo size={40} />
      </div>
    </AbsoluteFill>
  );
};
