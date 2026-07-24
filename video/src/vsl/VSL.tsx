import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./fonts";
import {
  COLORS,
  SCENES,
  OVERLAP,
  INTRO_LEN,
  NARRATION_FRAMES,
} from "./theme";
import { Background } from "./Background";
import { IntroBroll } from "./scenes/IntroBroll";
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

      {/* Narration begins after the featured b-roll intro so nothing desyncs. */}
      <Sequence from={INTRO_LEN}>
        <Audio src={staticFile("narration.mp3")} />
      </Sequence>

      {/* Featured full-screen b-roll open */}
      <Sequence durationInFrames={INTRO_LEN + OVERLAP} name="intro">
        <IntroBroll dur={INTRO_LEN + OVERLAP} />
      </Sequence>

      {SCENES.map((scene, i) => {
        const start = INTRO_LEN + scene.start;
        const nextStart =
          i < SCENES.length - 1
            ? INTRO_LEN + SCENES[i + 1].start
            : INTRO_LEN + NARRATION_FRAMES;
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
