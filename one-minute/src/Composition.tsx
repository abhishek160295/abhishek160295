import React from "react";
import { AbsoluteFill, Audio, Composition, Series, staticFile } from "remotion";
import timeline from "./timeline.json";
import { SceneShell } from "./Scenes";

const FPS = 30;
const scenes = timeline as { id: string; dur: number }[];
const total = scenes.reduce((a, s) => a + Math.round(s.dur * FPS), 0);

export const OneMinute: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Series>
      {scenes.map((s) => (
        <Series.Sequence key={s.id} durationInFrames={Math.round(s.dur * FPS)} name={s.id}>
          <SceneShell id={s.id} />
        </Series.Sequence>
      ))}
    </Series>
    <Audio src={staticFile("score.wav")} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <Composition id="OneMinute" component={OneMinute} durationInFrames={total} fps={FPS} width={1920} height={1080} />
);
