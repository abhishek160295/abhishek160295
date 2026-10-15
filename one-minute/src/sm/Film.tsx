import React from "react";
import { AbsoluteFill, Audio, Composition, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import timeline from "./timeline.json";
import { SMShell } from "./Scenes";

const FPS = 30;
const XF = 8;
const scenes = timeline as { id: string; dur: number }[];
const total = scenes.reduce((a, s) => a + Math.round(s.dur * FPS), 0) - XF * (scenes.length - 1);

export const StartingMonday: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      {scenes.flatMap((s, i) => {
        const seq = (
          <TransitionSeries.Sequence key={s.id} durationInFrames={Math.round(s.dur * FPS)} name={s.id}>
            <SMShell id={s.id} />
          </TransitionSeries.Sequence>
        );
        return i === 0
          ? [seq]
          : [<TransitionSeries.Transition key={`x${s.id}`} presentation={fade()} timing={linearTiming({ durationInFrames: XF })} />, seq];
      })}
    </TransitionSeries>
    <Audio src={staticFile("sm-score.wav")} />
  </AbsoluteFill>
);

export const StartingMondayComp = () => (
  <Composition id="StartingMonday" component={StartingMonday} durationInFrames={total} fps={FPS} width={1920} height={1080} />
);
