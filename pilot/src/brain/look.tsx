// 100%-brain look: the brain city, Neil the neuron, the cat, first-person hands and the brain meter.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { INK } from '../max/Max';
import { Label } from '../mem/lib';
import { W, H } from '../mem/kit';
import { F, GOLD, At, rnd } from '../mind/Episode';

export const DISTRICTS = [
  { k: 'see', x: 120, w: 250, h: 600, label: 'EYE TOWER', c: '#6FD3FF' },
  { k: 'mem', x: 470, w: 330, h: 430, label: 'MEMORY LIBRARY', c: '#FFD45C' },
  { k: 'alarm', x: 880, w: 250, h: 380, label: 'ALARM STATION', c: '#FF5A6E' },
  { k: 'word', x: 1210, w: 270, h: 470, label: 'WORD STREET', c: '#4DF0A0' },
  { k: 'ctrl', x: 1560, w: 260, h: 560, label: 'CONTROL ROOM', c: '#FF8AD8' },
] as const;
export type DistrictKey = typeof DISTRICTS[number]['k'];
const GROUND = 880;

/** shared glow + gradient definitions; render once per frame */
export const Defs: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="18" /></filter>
    <filter id="far"><feGaussianBlur stdDeviation="2.5" /></filter>
    <radialGradient id="skyG" cx="50%" cy="38%" r="75%"><stop offset="0" stopColor="#5B2A8C" /><stop offset="0.55" stopColor="#24124F" /><stop offset="1" stopColor="#0B0620" /></radialGradient>
    <radialGradient id="skyRed" cx="50%" cy="40%" r="75%"><stop offset="0" stopColor="#B8243C" /><stop offset="0.55" stopColor="#4A0E28" /><stop offset="1" stopColor="#14040C" /></radialGradient>
    <linearGradient id="towerG" x1="0" x2="1"><stop offset="0" stopColor="#3A2C7A" /><stop offset="0.6" stopColor="#2A1F5E" /><stop offset="1" stopColor="#1A1240" /></linearGradient>
    <linearGradient id="riverG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3B1F7A" /><stop offset="1" stopColor="#0E0726" /></linearGradient>
    <radialGradient id="neilG" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#BFEAFF" /><stop offset="0.5" stopColor="#6FC0FF" /><stop offset="1" stopColor="#3C82D6" /></radialGradient>
    <radialGradient id="catG" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#C9CFDA" /><stop offset="1" stopColor="#7B8494" /></radialGradient>
    <radialGradient id="warm" cx="70%" cy="20%" r="90%"><stop offset="0" stopColor="#FFF4D6" /><stop offset="0.6" stopColor="#F3D9A4" /><stop offset="1" stopColor="#B88A55" /></radialGradient>
  </defs>
);

const Win: React.FC<{ x: number; y: number; w: number; h: number; on: boolean; c: string }> = ({ x, y, w, h, on, c }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={4} fill={on ? c : '#170F38'} filter={on ? 'url(#glow)' : undefined} opacity={on ? 0.95 : 1} />
    {on && <rect x={x + 3} y={y + 3} width={w * 0.4} height={h * 0.35} rx={2} fill="#fff" opacity={0.45} />}
  </g>
);

/** each district has its own building */
const Building: React.FC<{ d: typeof DISTRICTS[number]; on: (i: number) => boolean; dim: boolean; f: number }> = ({ d, on, dim, f }) => {
  const top = GROUND - d.h; const cx = d.x + d.w / 2; const rows = Math.floor((d.h - 80) / 64);
  const lit = on(999);
  const wins = Array.from({ length: rows * 3 }, (_, i) => <Win key={i} x={d.x + 26 + (i % 3) * ((d.w - 52) / 3)} y={top + 70 + Math.floor(i / 3) * 64} w={(d.w - 52) / 3 - 14} h={38} on={on(i)} c={d.c} />);
  return (
    <g>
      <rect x={d.x} y={top} width={d.w} height={d.h} fill="url(#towerG)" stroke={INK} strokeWidth={8} />
      <rect x={d.x + d.w - 30} y={top} width={22} height={d.h} fill="#000" opacity={0.18} />
      {d.k === 'see' && <g transform={`translate(${cx} ${top - 70})`}><ellipse rx={110} ry={62} fill="#fff" stroke={INK} strokeWidth={8} filter={lit && !dim ? 'url(#glow)' : undefined} /><circle r={44} fill={lit && !dim ? d.c : '#3A3F58'} /><circle cx={Math.sin(f / 20) * 12} r={20} fill={INK} /><circle cx={-14} cy={-14} r={9} fill="#fff" /><rect x={-14} y={56} width={28} height={30} fill="#2A1F5E" stroke={INK} strokeWidth={6} /></g>}
      {d.k === 'mem' && <g><path d={`M${d.x - 20} ${top + 8} L${cx} ${top - 90} L${d.x + d.w + 20} ${top + 8} Z`} fill="#3A2C7A" stroke={INK} strokeWidth={8} />{[0, 1, 2, 3].map((i) => <rect key={i} x={d.x + 20 + i * ((d.w - 60) / 3)} y={top + 10} width={20} height={d.h - 10} fill="#4A3A8A" opacity={0.8} />)}<circle cx={cx} cy={top - 30} r={26} fill={lit && !dim ? d.c : '#2A1F5E'} stroke={INK} strokeWidth={6} filter={lit && !dim ? 'url(#glow)' : undefined} /></g>}
      {d.k === 'alarm' && <g><rect x={cx - 30} y={top - 70} width={60} height={70} rx={10} fill="#2A1F5E" stroke={INK} strokeWidth={7} /><circle cx={cx} cy={top - 80} r={30} fill={lit && !dim ? d.c : '#4A1F2E'} stroke={INK} strokeWidth={6} filter={lit && !dim ? 'url(#glow)' : undefined} />{lit && !dim && <path d={`M${cx} ${top - 80} L${cx + Math.cos(f / 4) * 260} ${top - 80 + Math.sin(f / 4) * 60} L${cx + Math.cos(f / 4 + 0.3) * 260} ${top - 80 + Math.sin(f / 4 + 0.3) * 60} Z`} fill={d.c} opacity={0.3} />}</g>}
      {d.k === 'word' && <g>{['A', 'Z', '!'].map((t, i) => <g key={t} transform={`translate(${d.x + 50 + i * 90} ${top - 40 - (i % 2) * 30})`}><rect x={-34} y={-30} width={68} height={56} rx={14} fill={lit && !dim ? d.c : '#1E3A2E'} stroke={INK} strokeWidth={5} filter={lit && !dim ? 'url(#glow)' : undefined} /><path d="M-10 26 L-18 42 L6 26" fill={lit && !dim ? d.c : '#1E3A2E'} stroke={INK} strokeWidth={4} /><Label x={0} y={-2} t={t} size={34} color={INK} /></g>)}</g>}
      {d.k === 'ctrl' && <g><path d={`M${d.x} ${top + 4} A${d.w / 2} ${d.w / 2.4} 0 0 1 ${d.x + d.w} ${top + 4} Z`} fill="#3A2C7A" stroke={INK} strokeWidth={8} /><line x1={cx} y1={top - d.w / 2.4} x2={cx + 30} y2={top - d.w / 2.4 - 90} stroke={INK} strokeWidth={8} /><circle cx={cx + 30} cy={top - d.w / 2.4 - 96} r={14} fill={lit && !dim ? d.c : '#3A2C7A'} filter={lit && !dim ? 'url(#glow)' : undefined} /><rect x={cx - 60} y={top - 50} width={120} height={36} rx={8} fill={lit && !dim ? d.c : '#170F38'} opacity={0.85} /></g>}
      {wins}
      <rect x={cx - 44} y={GROUND - 90} width={88} height={90} rx={8} fill={lit && !dim ? d.c : '#170F38'} opacity={0.5} stroke={INK} strokeWidth={6} />
    </g>
  );
};

/** the city inside your head. `lit` is a share of windows (0..1) or a list of fully lit districts */
export const BrainCity: React.FC<{ lit: number | DistrictKey[]; red?: boolean; black?: boolean; labels?: boolean; white?: number }> = ({ lit, red, black, labels = true, white = 0 }) => {
  const f = F();
  const on = (k: DistrictKey, i: number) => black ? false : Array.isArray(lit) ? lit.includes(k) : (i === 999 ? lit > 0.3 : rnd(i, k.length + 3) < lit);
  const share = black ? 0 : Array.isArray(lit) ? lit.length / 5 : lit;
  if (black) return <g><rect width={W} height={H} fill="#000" /><Defs /></g>;
  return (
    <g>
      <Defs />
      <rect width={W} height={H} fill={red ? 'url(#skyRed)' : 'url(#skyG)'} />
      {/* skull dome: brain folds arching overhead */}
      <g opacity={0.35} stroke="#C77DFF" strokeWidth={10} fill="none" strokeLinecap="round">
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-100 + i * 320} ${120 + (i % 2) * 40} q80 -90 160 0 q80 90 160 0`} />)}
        <path d="M-60 330 Q960 -220 1980 330" strokeWidth={16} opacity={0.6} />
      </g>
      {/* drifting neurotransmitter particles */}
      {Array.from({ length: 50 }, (_, i) => <circle key={'p' + i} cx={(rnd(i) * W + f * (0.6 + rnd(i, 3))) % W} cy={(rnd(i, 2) * 700 + Math.sin(f / 30 + i) * 20)} r={2 + rnd(i, 4) * 3} fill={red ? '#FFB38A' : '#E9C8FF'} opacity={0.35 + 0.35 * share} />)}
      {/* far skyline, softly blurred */}
      <g filter="url(#far)">{Array.from({ length: 28 }, (_, i) => { const h = 180 + rnd(i, 5) * 300; return <g key={'b' + i}><rect x={i * 70} y={GROUND - h} width={62} height={h} fill={red ? '#3A1028' : '#2A1A5C'} />{Array.from({ length: 10 }, (_, k) => <rect key={k} x={i * 70 + 10 + (k % 2) * 26} y={GROUND + 20 - h + Math.floor(k / 2) * 44} width={12} height={18} fill={GOLD} opacity={rnd(i * 9 + k, 7) < share * 0.7 ? 0.8 : 0.05} />)}</g>; })}</g>
      <rect y={GROUND - 260} width={W} height={260} fill={red ? '#2A0A18' : '#1A0F40'} opacity={0.45} />
      {/* glowing axon cables with sparks */}
      {DISTRICTS.slice(0, -1).map((d, i) => { const n = DISTRICTS[i + 1]; const x1 = d.x + d.w / 2, y1 = GROUND - d.h - 20, x2 = n.x + n.w / 2, y2 = GROUND - n.h - 20; const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 150;
        const pt = (p: number) => [(1 - p) ** 2 * x1 + 2 * (1 - p) * p * mx + p * p * x2, (1 - p) ** 2 * y1 + 2 * (1 - p) * p * my + p * p * y2];
        const col = red ? '#FF6A4E' : '#B98CFF';
        return <g key={'w' + i}>
          <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={INK} strokeWidth={16} fill="none" />
          <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={col} strokeWidth={8} fill="none" strokeDasharray="40 10" filter={share > 0.1 ? 'url(#glow)' : undefined} opacity={0.5 + share * 0.5} />
          {share > 0.1 && Array.from({ length: Math.ceil(share * 4) }, (_, k) => { const p = ((f * 0.018 * (red ? 2 : 1) + i * 0.3 + k * 0.27) % 1); const [sx, sy] = pt(p); return <g key={k} filter="url(#glow)"><circle cx={sx} cy={sy} r={12} fill={red ? '#FFB347' : '#FFF2A8'} /></g>; })}
        </g>; })}
      {/* districts */}
      {DISTRICTS.map((d, di) => <Building key={d.k} d={d} f={f} dim={false} on={(i) => on(d.k, i + di * 50)} />)}
      {/* synapse river with reflections */}
      <rect y={GROUND} width={W} height={H - GROUND} fill="url(#riverG)" />
      <g opacity={0.35}>{DISTRICTS.map((d, di) => on(d.k, 999) || (!Array.isArray(lit) && lit > 0.3) ? <rect key={'r' + d.k} x={d.x + 20} y={GROUND + 8} width={d.w - 40} height={110} fill={d.c} filter="url(#soft)" opacity={0.7} /> : null)}</g>
      {Array.from({ length: 8 }, (_, i) => <rect key={'rp' + i} x={((i * 260 + f * 3) % (W + 200)) - 100} y={GROUND + 30 + (i % 3) * 40} width={120} height={4} rx={2} fill="#fff" opacity={0.15} />)}
      {labels && DISTRICTS.map((d) => <g key={'l' + d.k}><rect x={d.x + d.w / 2 - 150} y={GROUND + 100} width={300} height={54} rx={27} fill="#0B0620" opacity={0.85} stroke={d.c} strokeWidth={3} /><Label x={d.x + d.w / 2} y={GROUND + 127} t={d.label} size={28} color={d.c} /></g>)}
      {red && <rect width={W} height={H} fill="#FF3A1F" opacity={0.1 + 0.06 * Math.sin(f / 3)} />}
      {white > 0 && <rect width={W} height={H} fill="#FFFBEA" opacity={white} />}
    </g>
  );
};

/** Neil, the foreman neuron. Origin at his feet. */
export const Neil: React.FC<{ mood?: 'tired' | 'shock' | 'happy' | 'sleep'; run?: boolean; coffee?: boolean; sign?: string }> = ({ mood = 'tired', run = false, coffee = false, sign }) => {
  const f = F();
  const leg = run ? Math.sin(f / 2) * 30 : 0;
  const lid = mood === 'tired' ? 0.5 : mood === 'sleep' ? 1 : 0;
  const bob = run ? Math.abs(Math.sin(f / 2)) * -12 : Math.sin(f / 12) * 3;
  return (
    <g>
      <ellipse cx={0} cy={4} rx={90} ry={14} fill="#000" opacity={0.3} />
      <g transform={`translate(0 ${bob})`}>
        <path d="M30 -70 Q90 -30 150 -50 Q200 -64 230 -20" stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M30 -70 Q90 -30 150 -50 Q200 -64 230 -20" stroke="#6FC0FF" strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="34 8" />
        <line x1={-22} y1={-50} x2={-22 - leg} y2={0} stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <line x1={22} y1={-50} x2={22 + leg} y2={0} stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <ellipse cx={-26 - leg} cy={2} rx={22} ry={10} fill="#FFD21F" stroke={INK} strokeWidth={5} /><ellipse cx={26 + leg} cy={2} rx={22} ry={10} fill="#FFD21F" stroke={INK} strokeWidth={5} />
        {[-155, -115, -70, -25, 25, 60].map((a, i) => { const r = (a * Math.PI) / 180; const w = Math.sin(f / 9 + i) * 0.08; return <g key={i}><path d={`M${Math.cos(r) * 84} ${-140 + Math.sin(r) * 84} Q${Math.cos(r + w) * 120} ${-140 + Math.sin(r + w) * 120} ${Math.cos(r) * 140} ${-140 + Math.sin(r) * 140}`} stroke={INK} strokeWidth={18} fill="none" strokeLinecap="round" /><path d={`M${Math.cos(r) * 84} ${-140 + Math.sin(r) * 84} Q${Math.cos(r + w) * 120} ${-140 + Math.sin(r + w) * 120} ${Math.cos(r) * 140} ${-140 + Math.sin(r) * 140}`} stroke="#6FC0FF" strokeWidth={9} fill="none" strokeLinecap="round" /><circle cx={Math.cos(r) * 144} cy={-140 + Math.sin(r) * 144} r={12} fill="#FFF2A8" stroke={INK} strokeWidth={4} filter="url(#glow)" /></g>; })}
        <circle cx={0} cy={-140} r={92} fill="url(#neilG)" stroke={INK} strokeWidth={8} />
        <ellipse cx={-34} cy={-178} rx={28} ry={14} fill="#fff" opacity={0.55} transform="rotate(-25 -34 -178)" />
        <circle cx={-56} cy={-108} r={14} fill="#FF8AB0" opacity={0.5} /><circle cx={56} cy={-108} r={14} fill="#FF8AB0" opacity={0.5} />
        {[-30, 30].map((x) => <g key={x}><ellipse cx={x} cy={-146} rx={24} ry={28} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={x + (run ? 6 : 0)} cy={mood === 'shock' ? -150 : -140} r={mood === 'shock' ? 8 : 12} fill={INK} /><circle cx={x - 4 + (run ? 6 : 0)} cy={mood === 'shock' ? -154 : -145} r={4} fill="#fff" />{lid > 0 && <path d={`M${x - 26} ${-174} L${x + 26} ${-174} L${x + 26} ${-174 + 56 * lid} Q${x} ${-166 + 56 * lid} ${x - 26} ${-174 + 56 * lid} Z`} fill="#5FA8EE" stroke={INK} strokeWidth={4} />}</g>)}
        <path d={mood === 'happy' ? 'M-26 -96 Q0 -72 26 -96' : mood === 'shock' ? 'M-14 -100 Q0 -66 14 -100 Q0 -108 -14 -100' : mood === 'sleep' ? 'M-14 -94 Q0 -88 14 -94' : 'M-22 -92 Q0 -96 22 -92'} stroke={INK} strokeWidth={6} fill={mood === 'shock' ? INK : 'none'} strokeLinecap="round" />
        <path d="M-96 -212 Q0 -318 96 -212 Z" fill="#FFD21F" stroke={INK} strokeWidth={7} />
        <path d="M-60 -250 Q0 -290 60 -250" stroke="#FFF2A8" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
        <rect x={-118} y={-218} width={236} height={22} rx={10} fill="#FFC107" stroke={INK} strokeWidth={6} />
        <circle cx={0} cy={-250} r={14} fill="#FFF2A8" stroke={INK} strokeWidth={4} filter="url(#glow)" />
        {coffee && <g transform="translate(118 -112)"><rect x={-28} y={-32} width={56} height={64} rx={10} fill="#fff" stroke={INK} strokeWidth={5} /><rect x={-28} y={-8} width={56} height={14} fill="#E53935" /><path d="M28 -16 q20 0 20 16 q0 16 -20 16" fill="none" stroke={INK} strokeWidth={5} />{[0, 1].map((k) => <path key={k} d={`M${-8 + k * 16} -40 q8 -14 0 -28`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.6 + 0.4 * Math.sin(f / 6 + k)} />)}</g>}
        {!coffee && !sign && <g transform="rotate(-10 -125 -80)"><rect x={-160} y={-130} width={76} height={98} rx={8} fill="#A8743A" stroke={INK} strokeWidth={5} /><rect x={-148} y={-118} width={52} height={74} fill="#fff" />{[0, 1, 2].map((k) => <line key={k} x1={-142} y1={-104 + k * 20} x2={-104} y2={-104 + k * 20} stroke="#9AA3B5" strokeWidth={5} />)}</g>}
        {sign && <g transform="translate(150 -270)"><line x1={0} y1={0} x2={0} y2={210} stroke="#8E6845" strokeWidth={12} /><rect x={-120} y={-74} width={240} height={96} rx={10} fill="#FFF7DC" stroke={INK} strokeWidth={6} /><Label x={0} y={-26} t={sign} size={38} color="#E53935" /></g>}
      </g>
      {mood === 'sleep' && <Label x={120} y={-270 - (f % 40)} t="z" size={50} color="#fff" />}
    </g>
  );
};

/** your cat. Origin at the paws. */
export const Cat: React.FC<{ eye?: 'shut' | 'one' | 'open' }> = ({ eye = 'one' }) => {
  const f = F();
  return (
    <g>
      <ellipse cx={30} cy={4} rx={170} ry={14} fill="#000" opacity={0.2} />
      <path d={`M150 -40 Q${250 + Math.sin(f / 15) * 10} -60 ${226 + Math.sin(f / 15) * 14} -150`} stroke={INK} strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d={`M150 -40 Q${250 + Math.sin(f / 15) * 10} -60 ${226 + Math.sin(f / 15) * 14} -150`} stroke="#8A93A4" strokeWidth={22} fill="none" strokeLinecap="round" />
      <ellipse cx={40} cy={-62 + Math.sin(f / 20) * 2} rx={145} ry={72} fill="url(#catG)" stroke={INK} strokeWidth={7} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${10 + i * 40} -128 q10 22 0 44`} stroke="#6E7787" strokeWidth={8} fill="none" strokeLinecap="round" />)}
      <circle cx={-92} cy={-112} r={74} fill="url(#catG)" stroke={INK} strokeWidth={7} />
      <path d="M-150 -152 L-158 -224 L-108 -176 Z M-76 -176 L-26 -224 L-34 -152 Z" fill="#9AA3B5" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-146 -164 L-150 -206 L-120 -178 Z M-64 -178 L-36 -206 L-40 -164 Z" fill="#F7B6C8" />
      {eye === 'shut' ? <path d="M-134 -116 q14 10 28 0 M-82 -116 q14 10 28 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
        : <g><path d="M-134 -116 q14 10 28 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /><ellipse cx={-68} cy={-118} rx={16} ry={eye === 'open' ? 16 : 9} fill="#E8C35B" stroke={INK} strokeWidth={4} /><rect x={-70} y={-127} width={4} height={18} fill={INK} /><path d="M-90 -132 L-48 -128" stroke={INK} strokeWidth={6} strokeLinecap="round" /></g>}
      <path d="M-98 -94 l7 7 l7 -7 Z" fill="#F07FA8" stroke={INK} strokeWidth={3} />
      {[-1, 1].map((s) => <path key={s} d={`M${-91 + s * 20} -88 l${s * 50} ${-6} M${-91 + s * 20} -82 l${s * 50} 6`} stroke={INK} strokeWidth={3} />)}
    </g>
  );
};

/** first-person hands at the bottom of frame */
export const Hands: React.FC<{ reach?: number }> = ({ reach = 0 }) => (
  <g>
    {[-1, 1].map((s) => (
      <g key={s} transform={`translate(${960 + s * (420 - reach * 120)} ${1010 - reach * 160}) rotate(${s * -14})`}>
        <rect x={-74} y={0} width={148} height={260} rx={44} fill="#4A5568" stroke={INK} strokeWidth={8} />
        <rect x={-74} y={0} width={148} height={34} rx={14} fill="#2D3748" stroke={INK} strokeWidth={6} />
        <ellipse cx={0} cy={-10} rx={76} ry={88} fill={INK} />
        {[-48, -16, 16, 48].map((x) => <rect key={x} x={x - 14} y={-114} width={28} height={74} rx={14} fill={INK} />)}
        <ellipse cx={-26} cy={-30} rx={20} ry={30} fill="#fff" opacity={0.08} />
      </g>
    ))}
  </g>
);

/** brain meter: top-right progress bar */
export const Meter: React.FC<{ p: number }> = ({ p }) => {
  const f = F();
  const c = p >= 0.9 ? '#FF5A4E' : p >= 0.75 ? '#FF8A1F' : '#FFD45C';
  const shake = p >= 0.9 ? Math.sin(f) * 3 : 0;
  return (
    <g transform={`translate(${1370 + shake} 44)`}>
      <rect width={500} height={96} rx={48} fill="#0B0620" opacity={0.9} stroke={c} strokeWidth={5} />
      <g transform="translate(58 48) scale(0.32)"><path d="M-100 20 Q-120 -60 -40 -80 Q0 -110 40 -80 Q120 -60 100 20 Q100 70 40 70 Q0 90 -40 70 Q-100 70 -100 20 Z" fill={c} stroke={INK} strokeWidth={12} /></g>
      <rect x={110} y={30} width={260} height={36} rx={18} fill="#2B2150" stroke={INK} strokeWidth={4} />
      <rect x={110} y={30} width={Math.max(24, 260 * p)} height={36} rx={18} fill={c} filter="url(#glow)" />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={110 + (i + 1) * 26} y1={34} x2={110 + (i + 1) * 26} y2={62} stroke="#0B0620" strokeWidth={3} opacity={0.5} />)}
      <Label x={435} y={48} t={`${Math.round(p * 100)}%`} size={42} color={c} />
    </g>
  );
};

/** warm, lit first-person kitchen */
export const KitchenPOV: React.FC = () => (
  <g>
    <rect width={W} height={H} fill="url(#warm)" />
    <rect x={1150} y={110} width={520} height={380} rx={12} fill="#BFE6F7" stroke={INK} strokeWidth={10} />
    <circle cx={1540} cy={210} r={60} fill="#FFE45C" filter="url(#glow)" />
    <line x1={1410} y1={110} x2={1410} y2={490} stroke={INK} strokeWidth={8} /><line x1={1150} y1={300} x2={1670} y2={300} stroke={INK} strokeWidth={8} />
    <path d="M1150 490 L860 1080 L1960 1080 L1670 490 Z" fill="#FFF4D6" opacity={0.25} />
    {[0, 1, 2].map((i) => <rect key={i} x={100 + i * 280} y={150} width={240} height={200} rx={10} fill="#E8C9A0" stroke={INK} strokeWidth={7} />)}
    <rect y={560} width={W} height={60} fill="#8E6845" stroke={INK} strokeWidth={8} />
    <rect y={620} width={W} height={460} fill="#C99A68" />
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 220} y1={620} x2={i * 220 - 120} y2={1080} stroke="#B07D50" strokeWidth={4} />)}
    <g transform="translate(560 560)"><rect x={-80} y={-150} width={160} height={150} rx={14} fill="#E53935" stroke={INK} strokeWidth={7} /><rect x={-60} y={-130} width={120} height={60} rx={8} fill="#FFD21F" /><Label x={0} y={-100} t="CRUNCH" size={26} color={INK} /></g>
    <g transform="translate(860 560)"><rect x={-90} y={-110} width={180} height={110} rx={20} fill="#C7CDD8" stroke={INK} strokeWidth={7} /><rect x={-60} y={-130} width={40} height={30} rx={6} fill="#E2A15B" stroke={INK} strokeWidth={5} /><rect x={20} y={-130} width={40} height={30} rx={6} fill="#E2A15B" stroke={INK} strokeWidth={5} /></g>
  </g>
);

/** style board: four test frames for approval */
export const BrainLook: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs />
      {frame === 0 && <g><BrainCity lit={['see', 'mem']} /><Meter p={0.1} /></g>}
      {frame === 1 && <g><BrainCity lit={0.85} red /><At x={1060} y={1000} s={1.15}><Neil run mood="shock" /></At><Meter p={0.9} /></g>}
      {frame === 2 && <g><BrainCity lit={0.25} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.45} /><At x={700} y={960} s={2.1}><Neil coffee /></At><At x={1420} y={960} s={1.6}><Neil sign="OVERTIME" /></At></g>}
      {frame === 3 && <g><KitchenPOV /><At x={1430} y={600} s={1.1}><Cat eye="one" /></At><Hands reach={0.3} /><Meter p={0.25} /></g>}
    </svg>
  </AbsoluteFill>
);
export const BrainLookComp: React.FC = () => <BrainLook frame={useCurrentFrame() % 4} />;
