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
        {[-170, 150, 115, 65, 30, -10].map((a, i) => { const r = (a * Math.PI) / 180; const w = Math.sin(f / 9 + i) * 0.08; return <g key={i}><path d={`M${Math.cos(r) * 84} ${-140 + Math.sin(r) * 84} Q${Math.cos(r + w) * 120} ${-140 + Math.sin(r + w) * 120} ${Math.cos(r) * 140} ${-140 + Math.sin(r) * 140}`} stroke={INK} strokeWidth={18} fill="none" strokeLinecap="round" /><path d={`M${Math.cos(r) * 84} ${-140 + Math.sin(r) * 84} Q${Math.cos(r + w) * 120} ${-140 + Math.sin(r + w) * 120} ${Math.cos(r) * 140} ${-140 + Math.sin(r) * 140}`} stroke="#6FC0FF" strokeWidth={9} fill="none" strokeLinecap="round" /><circle cx={Math.cos(r) * 144} cy={-140 + Math.sin(r) * 144} r={12} fill="#FFF2A8" stroke={INK} strokeWidth={4} filter="url(#glow)" /></g>; })}
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
export const Hands: React.FC<{ reach?: number; hold?: React.ReactNode }> = ({ reach = 0, hold }) => (
  <g>
    {[-1, 1].map((s) => (
      <g key={s} transform={`translate(${960 + s * (400 - reach * 120)} ${990 - reach * 160}) rotate(${s * -12})`}>
        <path d="M-82 40 L82 40 L96 300 L-96 300 Z" fill="#4A5568" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M-60 60 L-50 290" stroke="#5E6A80" strokeWidth={14} strokeLinecap="round" />
        <rect x={-86} y={18} width={172} height={40} rx={16} fill="#2D3748" stroke={INK} strokeWidth={6} />
        {s === -1 && <g><rect x={-60} y={-4} width={120} height={30} rx={8} fill="#1A202C" stroke={INK} strokeWidth={5} /><rect x={-26} y={-12} width={52} height={44} rx={10} fill="#E2E8F0" stroke={INK} strokeWidth={5} /><line x1={0} y1={10} x2={0} y2={-2} stroke={INK} strokeWidth={3} /><line x1={0} y1={10} x2={10} y2={14} stroke={INK} strokeWidth={3} /></g>}
        <path d="M-64 0 Q-74 -70 -56 -96 L56 -96 Q74 -70 64 0 Z" fill={INK} />
        {[-42, -14, 14, 42].map((x, k) => <g key={x}><rect x={x - 13} y={-170 + Math.abs(k - 1.5) * 12} width={26} height={90} rx={13} fill={INK} /><line x1={x - 8} y1={-128 + Math.abs(k - 1.5) * 12} x2={x + 8} y2={-128 + Math.abs(k - 1.5) * 12} stroke="#3A3F58" strokeWidth={3} strokeLinecap="round" /></g>)}
        <path d={`M${s * -60} -30 Q${s * -110} -70 ${s * -96} -120`} stroke={INK} strokeWidth={30} strokeLinecap="round" fill="none" />
        <path d="M-40 -80 Q-30 -40 -44 -10" stroke="#3A3F58" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
      </g>
    ))}
    {hold}
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
export const KitchenPOV: React.FC = () => {
  const f = F();
  return (
    <g>
      <rect width={W} height={H} fill="url(#warm)" />
      {/* window with tree, curtains and sunlight */}
      <rect x={1140} y={90} width={540} height={400} rx={12} fill="#9ED8F0" stroke={INK} strokeWidth={10} />
      <circle cx={1560} cy={190} r={56} fill="#FFE45C" filter="url(#glow)" />
      <ellipse cx={1290} cy={420} rx={170} ry={120} fill="#6BB36F" stroke={INK} strokeWidth={6} /><rect x={1280} y={420} width={22} height={70} fill="#7A4A22" />
      <line x1={1410} y1={90} x2={1410} y2={490} stroke={INK} strokeWidth={8} /><line x1={1140} y1={290} x2={1680} y2={290} stroke={INK} strokeWidth={8} />
      <path d={`M1110 70 Q${1150 + Math.sin(f / 25) * 8} 280 1120 500 L1170 500 Q1200 280 1170 70 Z`} fill="#F07FA8" stroke={INK} strokeWidth={6} />
      <path d={`M1710 70 Q${1670 + Math.sin(f / 25) * 8} 280 1700 500 L1650 500 Q1620 280 1650 70 Z`} fill="#F07FA8" stroke={INK} strokeWidth={6} />
      <path d="M1140 490 L900 1080 L1960 1080 L1680 490 Z" fill="#FFF4D6" opacity={0.28} />
      {/* clock */}
      <g transform="translate(930 150)"><circle r={58} fill="#fff" stroke={INK} strokeWidth={8} /><line x1={0} y1={0} x2={0} y2={-38} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${f * 6})`} /><line x1={0} y1={0} x2={26} y2={0} stroke={INK} strokeWidth={7} strokeLinecap="round" /><circle r={6} fill={INK} /></g>
      {/* upper cabinets */}
      {[0, 1].map((i) => <g key={i}><rect x={300 + i * 260} y={90} width={240} height={250} rx={10} fill="#E8C9A0" stroke={INK} strokeWidth={7} /><rect x={318 + i * 260} y={108} width={204} height={214} rx={6} fill="none" stroke="#C99A68" strokeWidth={5} /><rect x={i ? 320 + i * 260 : 500} y={200} width={10} height={50} rx={5} fill="#7A4A22" /></g>)}
      {/* fridge */}
      <g><rect x={20} y={90} width={250} height={480} rx={20} fill="#E2E8F0" stroke={INK} strokeWidth={8} /><line x1={20} y1={260} x2={270} y2={260} stroke={INK} strokeWidth={6} /><rect x={230} y={150} width={12} height={70} rx={6} fill="#9AA3B5" /><rect x={230} y={300} width={12} height={90} rx={6} fill="#9AA3B5" /><rect x={60} y={300} width={70} height={56} rx={6} fill="#FFF7DC" stroke={INK} strokeWidth={4} transform="rotate(-6 95 328)" /><circle cx={160} cy={190} r={14} fill="#E53935" stroke={INK} strokeWidth={3} /><circle cx={100} cy={410} r={12} fill="#3DBE7A" stroke={INK} strokeWidth={3} /><rect x={36} y={100} width={30} height={460} fill="#fff" opacity={0.35} /></g>
      {/* tiled backsplash */}
      {Array.from({ length: 30 }, (_, i) => <rect key={'t' + i} x={290 + (i % 10) * 82} y={380 + Math.floor(i / 10) * 60} width={78} height={56} fill="#F6EEDC" stroke="#D9C9A8" strokeWidth={3} />)}
      {/* counter */}
      <rect y={560} width={W} height={34} fill="#5A3A20" stroke={INK} strokeWidth={6} />
      <rect y={594} width={W} height={486} fill="#C99A68" />
      <rect y={594} width={W} height={20} fill="#000" opacity={0.15} />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 220} y1={614} x2={i * 220 - 140} y2={1080} stroke="#B07D50" strokeWidth={4} />)}
      {/* cereal, toaster, kettle, mug, plant, fruit */}
      <g transform="translate(400 560)"><ellipse cx={0} cy={4} rx={90} ry={10} fill="#000" opacity={0.2} /><rect x={-80} y={-170} width={160} height={170} rx={12} fill="#E53935" stroke={INK} strokeWidth={7} /><rect x={-62} y={-150} width={124} height={64} rx={8} fill="#FFD21F" /><Label x={0} y={-118} t="CRUNCH" size={28} color={INK} /><circle cx={0} cy={-46} r={26} fill="#FFF7DC" stroke={INK} strokeWidth={4} /></g>
      <g transform="translate(640 560)"><ellipse cx={0} cy={4} rx={100} ry={10} fill="#000" opacity={0.2} /><rect x={-95} y={-115} width={190} height={115} rx={24} fill="#C7CDD8" stroke={INK} strokeWidth={7} /><rect x={-80} y={-108} width={30} height={100} rx={10} fill="#fff" opacity={0.4} /><rect x={-62} y={-136} width={42} height={30} rx={6} fill="#E2A15B" stroke={INK} strokeWidth={5} /><rect x={20} y={-136} width={42} height={30} rx={6} fill="#E2A15B" stroke={INK} strokeWidth={5} /><rect x={86} y={-70} width={24} height={14} rx={4} fill={INK} /></g>
      <g transform="translate(870 560)"><ellipse cx={0} cy={4} rx={70} ry={10} fill="#000" opacity={0.2} /><path d="M-60 0 L-50 -120 Q0 -140 50 -120 L60 0 Z" fill="#3DBE7A" stroke={INK} strokeWidth={7} /><path d="M50 -100 Q100 -100 90 -50" fill="none" stroke={INK} strokeWidth={8} /><path d="M-50 -110 L-90 -140" stroke={INK} strokeWidth={10} strokeLinecap="round" />{[0, 1].map((k) => <path key={k} d={`M${-96 + k * 10} -150 q10 -20 0 -40`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.5 + 0.5 * Math.sin(f / 6 + k)} />)}</g>
      <g transform="translate(1060 560)"><ellipse cx={0} cy={4} rx={50} ry={8} fill="#000" opacity={0.2} /><rect x={-36} y={-70} width={72} height={70} rx={10} fill="#2F6FD6" stroke={INK} strokeWidth={6} /><path d="M36 -54 q22 0 22 18 q0 18 -22 18" fill="none" stroke={INK} strokeWidth={6} />{[0, 1].map((k) => <path key={k} d={`M${-10 + k * 18} -80 q8 -14 0 -28`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.4 + 0.4 * Math.sin(f / 7 + k)} />)}</g>
      <g transform="translate(1300 560)"><ellipse cx={0} cy={4} rx={60} ry={8} fill="#000" opacity={0.2} /><path d="M-40 0 L-50 -60 L50 -60 L40 0 Z" fill="#C46A3A" stroke={INK} strokeWidth={6} />{[-30, 0, 30].map((x, k) => <ellipse key={k} cx={x} cy={-100 - (k % 2) * 30} rx={20} ry={44} fill="#3DBE7A" stroke={INK} strokeWidth={5} transform={`rotate(${(k - 1) * 25} ${x} -80)`} />)}</g>
      <g transform="translate(1210 560)"><ellipse cx={0} cy={4} rx={110} ry={12} fill="#000" opacity={0.2} /><path d="M-100 -40 Q0 40 100 -40 Z" fill="#E8C9A0" stroke={INK} strokeWidth={6} />{[[-50, '#FF8A1F'], [0, '#E53935'], [45, '#FFD21F']].map(([x, c], k) => <circle key={k} cx={x as number} cy={-60 - (k % 2) * 16} r={34} fill={c as string} stroke={INK} strokeWidth={5} />)}</g>
      {/* hanging lamp */}
      <line x1={1000} y1={0} x2={1000} y2={60} stroke={INK} strokeWidth={6} /><path d="M940 100 L1060 100 L1030 60 L970 60 Z" fill="#FFD21F" stroke={INK} strokeWidth={6} /><circle cx={1000} cy={104} r={14} fill="#FFF8C4" filter="url(#glow)" />
      <rect width={W} height={H} fill="#3A1F00" opacity={0.06} />
    </g>
  );
};

/** style board: four test frames for approval */
export const BrainLook: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs />
      {frame === 0 && <g><BrainCity lit={['see', 'mem']} /><Meter p={0.1} /></g>}
      {frame === 1 && <g><BrainCity lit={0.85} red /><At x={1060} y={1000} s={1.15}><Neil run mood="shock" /></At><Meter p={0.9} /></g>}
      {frame === 2 && <g><BrainCity lit={0.25} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.45} /><At x={700} y={960} s={2.1}><Neil coffee /></At><At x={1420} y={960} s={1.6}><Neil sign="OVERTIME" /></At></g>}
      {frame === 3 && <g><KitchenPOV /><At x={1600} y={600} s={1.1}><Cat eye="one" /></At><Hands reach={0.3} /><Meter p={0.25} /></g>}
    </svg>
  </AbsoluteFill>
);
export const BrainLookComp: React.FC = () => <BrainLook frame={useCurrentFrame() % 4} />;
