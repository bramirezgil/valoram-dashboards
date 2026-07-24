import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./fonts";
import { COLORS, SCENES, OVERLAP, TOTAL_FRAMES } from "./theme";
import { Background } from "./Background";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02IsThisYou } from "./scenes/Scene02IsThisYou";
import { Scene03Balance } from "./scenes/Scene03Balance";
import { Scene04Planning } from "./scenes/Scene04Planning";
import { Scene05Meet } from "./scenes/Scene05Meet";
import { Scene06Score } from "./scenes/Scene06Score";
import { Scene07CTA } from "./scenes/Scene07CTA";

const COMPONENTS = [
  Scene01Hook,
  Scene02IsThisYou,
  Scene03Balance,
  Scene04Planning,
  Scene05Meet,
  Scene06Score,
  Scene07CTA,
];

export const VSL: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgCore }}>
      <Background />
      <Audio src={staticFile("narration.mp3")} />
      {SCENES.map((scene, i) => {
        const start = scene.start;
        const nextStart = i < SCENES.length - 1 ? SCENES[i + 1].start : TOTAL_FRAMES;
        // Extend each scene past the next start so content crossfades.
        const dur = nextStart - start + (i < SCENES.length - 1 ? OVERLAP : 0);
        const Scene = COMPONENTS[i];
        return (
          <Sequence key={scene.key} from={start} durationInFrames={dur} name={scene.key}>
            <Scene dur={dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
