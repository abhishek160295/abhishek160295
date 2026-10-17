import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Max, Dog, EXPR, ExprName, STAND, WAVE, POINT, PANIC, FACEPALM, HOLD, HERO, runPose, MUM, DAVE, Pose, MaxProps } from './Max';

const FONT = '"Inter Display", Inter, sans-serif';

const Slot: React.FC<{ x: number; y: number; s: number; label: string; children: React.ReactNode }> = ({ x, y, s, label, children }) => (
  <g>
    <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>
    <text x={x} y={y + 44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill="#2B2B3A">{label}</text>
  </g>
);

export const ModelSheet: React.FC = () => {
  const heads = Object.keys(EXPR) as ExprName[];
  const bodies: [string, Pose, Partial<MaxProps>][] = [
    ['stand', STAND, { expr: 'happy' }],
    ['wave', WAVE(1.2), { expr: 'happy' }],
    ['point', POINT, { expr: 'smug', look: [0.8, 0] }],
    ['run', runPose(1.3), { expr: 'determined', look: [0.7, 0] }],
    ['panic', PANIC, { expr: 'panic' }],
    ['facepalm', FACEPALM, { expr: 'wince' }],
    ['book', HOLD, { expr: 'shocked', prop: 'book' }],
    ['hero', HERO, { expr: 'smug' }],
  ];
  return (
    <AbsoluteFill style={{ background: '#F3EEE4' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <text x={40} y={58} fontFamily={FONT} fontWeight={900} fontSize={40} fill="#141414">MAX · model sheet</text>
        <text x={40} y={92} fontFamily={FONT} fontWeight={600} fontSize={22} fill="#6B6B7A">expressions · poses · cast</text>
        {heads.map((k, i) => (
          <Slot key={k} x={100 + i * 172} y={400} s={0.82} label={k}>
            <g transform="translate(0 196)"><Max still headOnly expr={k} look={k === 'smug' ? [0.7, 0] : k === 'hollow' ? [0, 0.4] : [0, 0]} /></g>
          </Slot>
        ))}
        {bodies.map(([label, pose, p], i) => (
          <Slot key={label} x={100 + i * 168} y={985} s={0.72} label={label}>
            <Max still pose={pose} {...p} />
          </Slot>
        ))}
        <line x1={1430} y1={560} x2={1430} y2={1050} stroke="#CFC6B4" strokeWidth={3} />
        <Slot x={1510} y={985} s={0.72} label="Mum">
          <Max outfit={MUM} expr="smug" pose={{ ...STAND, shL: -40, elL: 110, shR: 40, elR: -110 }} look={[-0.6, 0]} />
        </Slot>
        <Slot x={1665} y={985} s={0.72} label="Dave">
          <Max outfit={DAVE} expr="blank" />
        </Slot>
        <Slot x={1830} y={985} s={0.8} label="Sir Biscuit">
          <Dog expr="offended" hat />
        </Slot>
      </svg>
    </AbsoluteFill>
  );
};
