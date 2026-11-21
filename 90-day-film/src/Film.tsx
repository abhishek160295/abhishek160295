import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {from, len, SceneKey, s} from './timeline';
import {Hook, Pain, Built} from './scenes/Opening';
import {Excel, Sql, Python, Stats, PowerBI, Tableau, GitHub} from './scenes/Skills';
import {Ecosystem, Finale} from './scenes/Payoff';
import {Hud} from './components/Hud';
import {Finish} from './components/fx';

const MAP: Record<SceneKey, React.FC> = {hook: Hook, pain: Pain, built: Built, excel: Excel, sql: Sql, python: Python,
  stats: Stats, powerbi: PowerBI, tableau: Tableau, github: GitHub, ecosystem: Ecosystem, finale: Finale};

export const Film: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {(Object.keys(MAP) as SceneKey[]).map((k) => {
      const Comp = MAP[k];
      return <Sequence key={k} from={from(k)} durationInFrames={len(k)} name={k}><Comp /></Sequence>;
    })}
    <Sequence from={from('excel')} durationInFrames={from('ecosystem') - from('excel')} name="hud"><Hud offset={from('excel')} /></Sequence>
    <Finish />
    <Audio src={staticFile('audio/score.wav')} volume={0.55} />
    <Audio src={staticFile('audio/vo.wav')} volume={1} />
  </AbsoluteFill>
);
export const SAFE = s(0);
