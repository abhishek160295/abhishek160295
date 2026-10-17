// 100%-brain look: the brain city, Neil the neuron, the cat, first-person hands and the brain meter.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { INK } from '../max/Max';
import { Label } from '../mem/lib';
import { W, H } from '../mem/kit';
import { F, GOLD, At, rnd, DayKitchen } from '../mind/Episode';

export const DISTRICTS = [
  { k: 'see', x: 150, w: 260, h: 640, label: 'EYE TOWER', c: '#7FB8FF' },
  { k: 'mem', x: 520, w: 300, h: 460, label: 'MEMORY LIBRARY', c: GOLD },
  { k: 'alarm', x: 900, w: 240, h: 400, label: 'ALARM STATION', c: '#FF5A4E' },
  { k: 'word', x: 1220, w: 260, h: 500, label: 'WORD STREET', c: '#3DE07A' },
  { k: 'ctrl', x: 1560, w: 260, h: 580, label: 'CONTROL ROOM', c: '#F07FA8' },
] as const;
export type DistrictKey = typeof DISTRICTS[number]['k'];

/** the city inside your head. `lit` is a share of windows (0..1) or a list of fully lit districts */
export const BrainCity: React.FC<{ lit: number | DistrictKey[]; red?: boolean; black?: boolean; labels?: boolean }> = ({ lit, red, black, labels = true }) => {
  const f = F();
  const on = (k: DistrictKey, i: number) => black ? false : Array.isArray(lit) ? lit.includes(k) : rnd(i, k.length + 3) < lit;
  const share = black ? 0 : Array.isArray(lit) ? lit.length / 5 : lit;
  return (
    <g>
      <rect width={W} height={H} fill={black ? '#000' : '#140F2E'} />
      {!black && Array.from({ length: 40 }, (_, i) => <circle key={'s' + i} cx={rnd(i) * W} cy={rnd(i, 2) * 400} r={2} fill="#fff" opacity={0.4} />)}
      {/* far skyline */}
      {Array.from({ length: 26 }, (_, i) => { const h = 160 + rnd(i, 5) * 260; return <g key={'b' + i}><rect x={i * 76} y={900 - h} width={68} height={h} fill={black ? '#050508' : '#221A44'} />{Array.from({ length: 8 }, (_, k) => <rect key={k} x={i * 76 + 10 + (k % 2) * 28} y={920 - h + Math.floor(k / 2) * 40} width={14} height={18} fill={GOLD} opacity={!black && rnd(i * 9 + k, 7) < share * 0.6 ? 0.7 : 0.06} />)}</g>; })}
      {/* wires with sparks between district roofs */}
      {DISTRICTS.slice(0, -1).map((d, i) => { const n = DISTRICTS[i + 1]; const x1 = d.x + d.w / 2, y1 = 900 - d.h, x2 = n.x + n.w / 2, y2 = 900 - n.h; const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 120; const p = ((f * 0.02 + i * 0.3) % 1);
        const sx = (1 - p) ** 2 * x1 + 2 * (1 - p) * p * mx + p * p * x2, sy = (1 - p) ** 2 * y1 + 2 * (1 - p) * p * my + p * p * y2;
        return <g key={'w' + i}><path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={black ? '#111' : red ? '#FF5A4E' : '#5A4FA0'} strokeWidth={red ? 10 : 6} fill="none" />{!black && share > 0.1 && <circle cx={sx} cy={sy} r={14} fill={red ? '#FF8A1F' : GOLD} />}</g>; })}
      {/* districts */}
      {DISTRICTS.map((d, di) => (
        <g key={d.k}>
          <rect x={d.x} y={900 - d.h} width={d.w} height={d.h} fill={black ? '#08080C' : '#2B2160'} stroke={INK} strokeWidth={8} />
          {Array.from({ length: Math.floor(d.h / 70) * 3 }, (_, i) => { const lit1 = on(d.k, i + di * 50); return <rect key={i} x={d.x + 24 + (i % 3) * ((d.w - 48) / 3)} y={900 - d.h + 30 + Math.floor(i / 3) * 70} width={(d.w - 48) / 3 - 16} height={40} rx={4} fill={lit1 ? d.c : '#1A1440'} opacity={lit1 ? 0.95 : 1} />; })}
        </g>
      ))}
      <rect y={900} width={W} height={180} fill={black ? '#000' : '#1A1440'} />
      {labels && !black && DISTRICTS.map((d) => <g key={'l' + d.k}><rect x={d.x + d.w / 2 - 150} y={918} width={300} height={56} rx={10} fill="#0B0C18" opacity={0.85} /><Label x={d.x + d.w / 2} y={946} t={d.label} size={30} color={d.c} /></g>)}
      {red && <rect width={W} height={H} fill="#FF3A1F" opacity={0.12 + 0.06 * Math.sin(f / 3)} />}
    </g>
  );
};

/** Neil, the foreman neuron. Origin at his feet. */
export const Neil: React.FC<{ mood?: 'tired' | 'shock' | 'happy' | 'sleep'; run?: boolean; coffee?: boolean; sign?: string }> = ({ mood = 'tired', run = false, coffee = false, sign }) => {
  const f = F();
  const leg = run ? Math.sin(f / 2) * 30 : 0;
  const lid = mood === 'tired' ? 0.55 : mood === 'sleep' ? 1 : 0;
  return (
    <g>
      <path d="M0 -60 Q60 -20 120 -40 Q160 -50 190 -20" stroke="#7FB8FF" strokeWidth={14} fill="none" strokeLinecap="round" />
      <line x1={-20} y1={-40} x2={-20 - leg} y2={0} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      <line x1={20} y1={-40} x2={20 + leg} y2={0} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      {[-150, -110, -60, -20, 30, 70].map((a, i) => { const r = (a * Math.PI) / 180; return <g key={i}><line x1={Math.cos(r) * 80} y1={-130 + Math.sin(r) * 80} x2={Math.cos(r) * 130} y2={-130 + Math.sin(r) * 130} stroke="#7FB8FF" strokeWidth={12} strokeLinecap="round" /><circle cx={Math.cos(r) * 134} cy={-130 + Math.sin(r) * 134} r={10} fill="#BFE6F7" stroke={INK} strokeWidth={4} /></g>; })}
      <circle cx={0} cy={-130} r={88} fill="#7FB8FF" stroke={INK} strokeWidth={8} />
      {[-30, 30].map((x) => <g key={x}><circle cx={x} cy={-140} r={22} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={x} cy={mood === 'shock' ? -144 : -136} r={mood === 'shock' ? 7 : 10} fill={INK} />{lid > 0 && <rect x={x - 24} y={-164} width={48} height={48 * lid} fill="#7FB8FF" stroke={INK} strokeWidth={4} />}</g>)}
      <path d={mood === 'happy' ? 'M-24 -96 Q0 -76 24 -96' : mood === 'shock' ? 'M-12 -92 Q0 -70 12 -92 Q0 -100 -12 -92' : 'M-20 -92 L20 -92'} stroke={INK} strokeWidth={6} fill={mood === 'shock' ? INK : 'none'} strokeLinecap="round" />
      <path d="M-90 -196 Q0 -290 90 -196 Z" fill="#FFD21F" stroke={INK} strokeWidth={7} />
      <rect x={-110} y={-200} width={220} height={20} rx={8} fill="#FFC107" stroke={INK} strokeWidth={6} />
      {coffee && <g transform="translate(110 -110)"><rect x={-26} y={-30} width={52} height={60} rx={8} fill="#fff" stroke={INK} strokeWidth={5} /><path d="M26 -14 q18 0 18 14 q0 14 -18 14" fill="none" stroke={INK} strokeWidth={5} /></g>}
      {!coffee && !sign && <rect x={-150} y={-120} width={70} height={90} rx={6} fill="#A8743A" stroke={INK} strokeWidth={5} transform="rotate(-10 -115 -75)" />}
      {sign && <g transform="translate(140 -260)"><line x1={0} y1={0} x2={0} y2={200} stroke="#8E6845" strokeWidth={10} /><rect x={-110} y={-70} width={220} height={90} rx={8} fill="#FFF7DC" stroke={INK} strokeWidth={6} /><Label x={0} y={-25} t={sign} size={36} color="#E53935" /></g>}
      {mood === 'sleep' && <Label x={110} y={-260 - (f % 40)} t="z" size={50} color="#fff" />}
    </g>
  );
};

/** your cat. Origin at the paws. */
export const Cat: React.FC<{ eye?: 'shut' | 'one' | 'open' }> = ({ eye = 'one' }) => (
  <g>
    <path d="M150 -40 Q240 -60 220 -150" stroke="#7B8794" strokeWidth={22} fill="none" strokeLinecap="round" />
    <ellipse cx={40} cy={-60} rx={140} ry={70} fill="#9AA3B5" stroke={INK} strokeWidth={7} />
    <circle cx={-90} cy={-110} r={70} fill="#9AA3B5" stroke={INK} strokeWidth={7} />
    <path d="M-145 -150 L-150 -215 L-105 -170 Z M-75 -170 L-30 -215 L-35 -150 Z" fill="#9AA3B5" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {eye === 'shut' ? <path d="M-130 -115 q14 10 28 0 M-80 -115 q14 10 28 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      : <g><path d="M-130 -115 q14 10 28 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /><ellipse cx={-66} cy={-116} rx={14} ry={eye === 'open' ? 14 : 8} fill="#E8C35B" stroke={INK} strokeWidth={4} /><rect x={-68} y={-124} width={4} height={16} fill={INK} /></g>}
    <path d="M-96 -92 l6 6 l6 -6" stroke={INK} strokeWidth={4} fill="#F07FA8" />
  </g>
);

/** first-person hands at the bottom of frame */
export const Hands: React.FC<{ reach?: number }> = ({ reach = 0 }) => (
  <g>
    {[-1, 1].map((s) => (
      <g key={s} transform={`translate(${960 + s * (420 - reach * 120)} ${1010 - reach * 160}) rotate(${s * -14})`}>
        <rect x={-70} y={0} width={140} height={260} rx={40} fill="#5E6A7C" stroke={INK} strokeWidth={8} />
        <ellipse cx={0} cy={-10} rx={74} ry={86} fill={INK} />
        {[-48, -16, 16, 48].map((x) => <rect key={x} x={x - 13} y={-110} width={26} height={70} rx={13} fill={INK} />)}
      </g>
    ))}
  </g>
);

/** brain meter: top-right progress bar */
export const Meter: React.FC<{ p: number }> = ({ p }) => {
  const f = F();
  const c = p >= 0.9 ? '#FF5A4E' : p >= 0.75 ? '#FF8A1F' : GOLD;
  const shake = p >= 0.9 ? Math.sin(f) * 3 : 0;
  return (
    <g transform={`translate(${1380 + shake} 50)`}>
      <rect width={480} height={90} rx={18} fill="#0B0C18" opacity={0.9} stroke={c} strokeWidth={5} />
      <Label x={70} y={45} t="BRAIN" size={34} color="#fff" />
      <rect x={140} y={26} width={230} height={38} rx={19} fill="#2B2F4A" />
      <rect x={140} y={26} width={Math.max(20, 230 * p)} height={38} rx={19} fill={c} />
      <Label x={425} y={45} t={`${Math.round(p * 100)}%`} size={40} color={c} />
    </g>
  );
};

/** style board: four test frames for approval */
export const BrainLook: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {frame === 0 && <g><BrainCity lit={['see', 'mem']} /><Meter p={0.1} /></g>}
      {frame === 1 && <g><BrainCity lit={0.8} red /><At x={960} y={860} s={1.2}><Neil run mood="shock" /></At><Meter p={0.9} /></g>}
      {frame === 2 && <g><rect width={W} height={H} fill="#1F2347" /><At x={760} y={900} s={2.2}><Neil coffee /></At><At x={1460} y={900} s={1.6}><Neil sign="OVERTIME" mood="tired" /></At></g>}
      {frame === 3 && <g><DayKitchen /><At x={1450} y={760} s={1.2}><Cat eye="one" /></At><Hands reach={0.3} /><Meter p={0.25} /></g>}
    </svg>
  </AbsoluteFill>
);

export const BrainLookComp: React.FC = () => <BrainLook frame={useCurrentFrame() % 4} />;
