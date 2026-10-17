// What If You Used 100% of Your Brain? Built section by section; each section is approved before the next.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { INK } from '../max/Max';
import { Stage, Captions, BigNum, Vignette, lerp, W, H } from '../mem/kit';
import { Label, Rays, Stamp } from '../mem/lib';
import { F, GOLD, At, sc, PUSH, HOLDC, rnd, Heart } from '../mind/Episode';
import { Defs, BrainCity, Neil, Cat, Hands, Meter, KitchenPOV } from './look';
import { at, secStart, secEnd, CAPTION_WORDS, TOTAL_FRAMES } from './timing';

const St: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => <Stage bg={bg}><Defs />{children}</Stage>;
const STILL = HOLDC;
const Worker: React.FC = () => <g><circle cx={0} cy={-130} r={70} fill="url(#neilG)" stroke={INK} strokeWidth={7} />{[-20, 20].map((x) => <g key={x}><circle cx={x} cy={-140} r={14} fill="#fff" stroke={INK} strokeWidth={4} /><circle cx={x} cy={-138} r={7} fill={INK} /></g>)}<path d="M-14 -105 Q0 -96 14 -105" stroke={INK} strokeWidth={5} fill="none" /><line x1={-50} y1={-120} x2={-110} y2={-170} stroke="#6FC0FF" strokeWidth={12} strokeLinecap="round" /><line x1={50} y1={-120} x2={110} y2={-170} stroke="#6FC0FF" strokeWidth={12} strokeLinecap="round" /><line x1={-16} y1={-62} x2={-20} y2={0} stroke={INK} strokeWidth={10} /><line x1={16} y1={-62} x2={20} y2={0} stroke={INK} strokeWidth={10} /></g>;

// ---------- first-person bedroom ----------
const Ceiling: React.FC<{ f: number; sharp?: number }> = ({ f, sharp = 1 }) => (
  <g>
    <rect width={W} height={H} fill="#2A3270" />
    <rect width={W} height={H} fill="#FFE29A" opacity={0.12} />
    <g transform="translate(960 420)"><circle r={130} fill="#F6EEDC" stroke={INK} strokeWidth={10} /><circle r={70} fill="#FFF8C4" filter="url(#glow)" opacity={0.6} /></g>
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${200 + i * 180} ${120 + (i % 3) * 200} l${40 + rnd(i) * 60} ${20 + rnd(i, 2) * 40} l${-20} ${50}`} stroke="#1A1F4E" strokeWidth={4} fill="none" opacity={0.6 * sharp} />)}
    {Array.from({ length: 30 }, (_, i) => <circle key={'d' + i} cx={(rnd(i) * W + f * 0.6) % W} cy={rnd(i, 3) * H} r={3} fill="#FFF8C4" opacity={0.5 * sharp} />)}
    {sharp > 0.5 && Array.from({ length: 5 }, (_, i) => <g key={'t' + i} opacity={lerp(f, i * 3, i * 3 + 6, 0, 1)}><rect x={240 + i * 300} y={200 + (i % 2) * 380} width={150} height={40} rx={8} fill="#0B0620" opacity={0.75} /><Label x={315 + i * 300} y={220 + (i % 2) * 380} t={['CRACK 3mm', 'DUST ×412', 'SPIDER: 1', 'PAINT 2014', 'BULB 60W'][i]} size={22} color={GOLD} /></g>)}
  </g>
);
const Lids: React.FC<{ open: number }> = ({ open }) => (
  <g>
    <rect width={W} height={H * 0.5 * (1 - open)} fill="#000" />
    <rect y={H - H * 0.5 * (1 - open)} width={W} height={H * 0.5 * (1 - open)} fill="#000" />
  </g>
);
const AlarmClock: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#1E2452" />
    <rect y={760} width={W} height={320} fill="#6B4A2E" />
    <g transform="translate(960 560)">
      <rect x={-380} y={-200} width={760} height={360} rx={40} fill="#22252E" stroke={INK} strokeWidth={12} />
      <rect x={-330} y={-150} width={660} height={260} rx={20} fill="#0B0C18" />
      <text textAnchor="middle" dominantBaseline="central" y={-20} fontFamily="monospace" fontWeight={900} fontSize={190} fill="#FF5A4E" filter="url(#glow)">07:00</text>
      <Label x={0} y={140} t={`07:00:${String(Math.floor(f / 3) % 60).padStart(2, '0')}.${String((f * 33) % 1000).padStart(3, '0')}`} size={44} color={GOLD} />
    </g>
  </g>
);
const HouseCut: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#1E2452" />
    <rect x={260} y={140} width={1400} height={420} fill="#2A3270" stroke={INK} strokeWidth={10} />
    <rect x={260} y={560} width={1400} height={420} fill="#3A2C5E" stroke={INK} strokeWidth={10} />
    <g transform="translate(560 520)"><rect x={-200} y={-60} width={400} height={60} rx={12} fill="#4C7BD9" stroke={INK} strokeWidth={6} /><rect x={-220} y={-110} width={40} height={110} rx={8} fill="#6B4A2E" stroke={INK} strokeWidth={6} /><circle cx={-130} cy={-80} r={44} fill={INK} /><circle cx={-145} cy={-86} r={9} fill="#fff" /><circle cx={-117} cy={-86} r={9} fill="#fff" /><Label x={0} y={-180} t="YOU" size={44} color={GOLD} /></g><Label x={1300} y={590} t="FRIDGE" size={40} color="#BFE6F7" />
    <g transform="translate(1300 960)"><rect x={-110} y={-330} width={220} height={330} rx={20} fill="#E2E8F0" stroke={INK} strokeWidth={8} /><line x1={-110} y1={-210} x2={110} y2={-210} stroke={INK} strokeWidth={6} /></g>
    {[0, 1, 2, 3].map((i) => { const r = ((f * 4 + i * 60) % 240); return <circle key={i} cx={1300} cy={760} r={r} fill="none" stroke={GOLD} strokeWidth={8} opacity={1 - r / 240} />; })}
    <path d="M1240 700 Q900 560 440 440" stroke={GOLD} strokeWidth={6} strokeDasharray="18 14" strokeDashoffset={-f * 4} fill="none" />
    <Label x={1300} y={1020} t="HUMMMM" size={40} color="#BFE6F7" />
  </g>
);
const Heartbeat: React.FC<{ f: number }> = ({ f }) => {
  const pts = Array.from({ length: 120 }, (_, i) => { const x = i * 16; const ph = (i + f * 2) % 40; const y = ph === 10 ? -160 : ph === 11 ? 120 : ph === 12 ? -60 : 0; return `${i ? 'L' : 'M'}${x} ${540 + y}`; }).join(' ');
  const beat = (f % 20) < 4 ? 1.12 : 1;
  return <g><rect width={W} height={H} fill="#2A0A18" /><path d={pts} stroke="#FF5A6E" strokeWidth={10} fill="none" filter="url(#glow)" /><At x={1500} y={300} s={2.6 * beat}><Heart /></At><Label x={1500} y={480} t="72 BPM" size={56} color="#FF8AB0" /></g>;
};
const Blanket: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#4C7BD9" />
    {Array.from({ length: 48 }, (_, i) => <line key={'v' + i} x1={i * 40} y1={0} x2={i * 40} y2={H} stroke="#3B63B5" strokeWidth={10} />)}
    {Array.from({ length: 27 }, (_, i) => <line key={'h' + i} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="#6A93E8" strokeWidth={6} />)}
    {Array.from({ length: 14 }, (_, i) => <g key={'n' + i} opacity={lerp(f, i * 2, i * 2 + 4, 0, 1)}><circle cx={120 + (i % 7) * 260} cy={260 + Math.floor(i / 7) * 420} r={36} fill="#0B0620" opacity={0.75} /><Label x={120 + (i % 7) * 260} y={260 + Math.floor(i / 7) * 420} t={String(i + 1)} size={34} color={GOLD} /></g>)}
    <g transform="translate(960 540)"><rect x={-280} y={-70} width={560} height={140} rx={30} fill="#0B0620" opacity={0.85} stroke={GOLD} strokeWidth={5} /><Label x={0} y={0} t={`THREADS: ${Math.floor(lerp(f, 0, 40, 0, 4382)).toLocaleString('en-US')}`} size={60} color={GOLD} /></g>
  </g>
);
const Bedside: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#141A40" />
    <rect x={1300} y={80} width={460} height={380} rx={14} fill="#0B0F2E" stroke="#2A3270" strokeWidth={14} /><circle cx={1620} cy={180} r={50} fill="#F4EBC0" filter="url(#glow)" />
    <path d="M1300 460 L900 1080 L1700 1080 L1760 460 Z" fill="#BFD6FF" opacity={0.08} />
    <rect x={500} y={640} width={920} height={60} rx={12} fill="#6B4A2E" stroke={INK} strokeWidth={8} /><rect x={540} y={700} width={840} height={380} fill="#5A3A22" stroke={INK} strokeWidth={8} />
    <At x={960} y={620} s={1.6}><ellipse rx={50} ry={22} fill="#fff" stroke={INK} strokeWidth={5} /><rect x={-50} y={-22} width={50} height={44} fill="#E53935" /><ellipse rx={50} ry={22} fill="none" stroke={INK} strokeWidth={5} /><ellipse cx={-14} cy={-8} rx={14} ry={5} fill="#fff" opacity={0.7} /></At>
    <circle cx={960} cy={600} r={120 + Math.sin(f / 5) * 10} fill={GOLD} opacity={0.12} filter="url(#soft)" />
  </g>
);
const SketchySite: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#0B0F2E" />
    <g transform="translate(960 560)">
      <rect x={-330} y={-500} width={660} height={1000} rx={60} fill="#1A202C" stroke={INK} strokeWidth={12} />
      <rect x={-300} y={-460} width={600} height={900} rx={30} fill="#FFF7DC" />
      <rect x={-300} y={-460} width={600} height={110} fill={(f % 10) < 5 ? '#FF2EC4' : '#3DE07A'} />
      <Label x={0} y={-405} t="100% BRAIN PILLS" size={52} color="#fff" />
      <At x={0} y={-200} s={2.2}><ellipse rx={50} ry={22} fill="#fff" stroke={INK} strokeWidth={5} /><rect x={-50} y={-22} width={50} height={44} fill="#E53935" /><ellipse rx={50} ry={22} fill="none" stroke={INK} strokeWidth={5} /></At>
      <At x={0} y={-30} r={-6}><Stamp t="TOTALLY SAFE" p={1} size={60} color="#E53935" /></At>
      {['★★★★★ "my cat"', '★★★★★ "trust me"', 'FREE SHIPPING TO MARS'].map((t, i) => <Label key={i} x={0} y={100 + i * 80} t={t} size={36} color={INK} />)}
      <rect x={-200} y={340} width={400} height={80} rx={40} fill={(f % 16) < 8 ? '#E53935' : '#FF8A1F'} /><Label x={0} y={380} t="BUY NOW!!!" size={44} color="#fff" />
    </g>
  </g>
);
const MeterCard: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <BrainCity lit={lerp(f, 6, 40, 0.05, 0.25)} labels={false} />
    <rect width={W} height={H} fill="#0B0620" opacity={0.55} />
    <At x={960 - 1620 * 1.6} y={540 - 92 * 1.6} s={1.6}><g transform="translate(0 0)"><Meter p={lerp(f, 4, 40, 0, 0.1)} /></g></At>
  </g>
);
/** fly through the ear into the city: layers move at different speeds */
const FlyIn: React.FC<{ f: number; d: number }> = ({ f }) => {
  const k = lerp(f, 0, 26, 0, 1);
  const s = 1 + k * 3;
  return (
    <g>
      <BrainCity lit={lerp(f, 10, 40, 0.1, 0.55)} labels={false} />
      <g opacity={1 - k} transform={`translate(960 540) scale(${s}) translate(-960 -540)`}>
        <rect width={W} height={H} fill="#1E2452" />
        <ellipse cx={960} cy={540} rx={260} ry={340} fill="#141414" stroke="#3A3F58" strokeWidth={10} />
        <path d="M900 420 Q1020 460 980 560 Q940 640 1010 680" stroke="#5A607A" strokeWidth={24} fill="none" strokeLinecap="round" />
        <circle cx={980} cy={560} r={60} fill="#0B0620" />
      </g>
    </g>
  );
};
const Poster: React.FC<{ f: number; stage: 0 | 1 }> = ({ f, stage }) => (
  <g>
    <rect width={W} height={H} fill="#0B0C18" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M960 1080 L${i * 210} 0 L${i * 210 + 90} 0 Z`} fill="#FFF6C2" opacity={0.04} />)}
    <g transform="translate(960 520) rotate(-2)">
      <rect x={-380} y={-460} width={760} height={940} rx={14} fill="#1A1240" stroke={GOLD} strokeWidth={10} />
      <g transform="translate(0 -60)"><path d="M-260 300 Q-260 120 0 120 Q260 120 260 300 Z" fill="#141414" /><circle r={200} fill="#141414" /><g transform="scale(1.4)" filter="url(#glow)"><path d="M-100 20 Q-120 -60 -40 -80 Q0 -110 40 -80 Q120 -60 100 20 Q100 70 40 70 Q0 90 -40 70 Q-100 70 -100 20 Z" fill={GOLD} opacity={0.75 + 0.25 * Math.sin(f / 4)} /><path d="M-60 -40 q20 30 0 60 M0 -70 q20 40 0 120 M60 -40 q-20 30 0 60" stroke="#B8860B" strokeWidth={8} fill="none" /></g><circle r={220} fill="none" stroke={GOLD} strokeWidth={14} filter="url(#glow)" opacity={0.6 + 0.4 * Math.sin(f / 4)} />{Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-240} x2={0} y2={-300} stroke={GOLD} strokeWidth={10} transform={`rotate(${i * 30})`} filter="url(#glow)" />)}</g>
      <Label x={0} y={260} t={stage ? 'GENIUS' : '100%'} size={130} color={GOLD} />
      <Label x={0} y={380} t="IN CINEMAS NOWHERE" size={34} color="#9AA3B5" />
    </g>
  </g>
);

// ---- 3 twenty-five percent
const BOX = { y: '#FFD45C' };
const Brackets: React.FC<{ x: number; y: number; w: number; h: number; p: number }> = ({ x, y, w, h, p }) => p <= 0 ? null : (
  <g opacity={p} transform={`translate(${x} ${y}) scale(${1.25 - p * 0.25})`}>{[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <path key={i} d={`M${a * w / 2} ${b * h / 2 - b * 30} L${a * w / 2} ${b * h / 2} L${a * w / 2 - a * 30} ${b * h / 2}`} stroke={BOX.y} strokeWidth={8} fill="none" strokeLinecap="round" filter="url(#glow)" />)}</g>
);
const Stairs: React.FC<{ f: number }> = ({ f }) => {
  const bob = Math.sin(f / 5) * 14;
  return (
    <g transform={`translate(0 ${bob})`}>
      <rect width={W} height={H + 40} fill="#E9D3AE" />
      <rect x={0} y={-20} width={420} height={H + 60} fill="#D8BC8E" />
      <rect x={1500} y={-20} width={420} height={H + 60} fill="#D8BC8E" />
      <g transform="translate(1600 260)"><rect x={-90} y={-70} width={180} height={140} fill="#fff" stroke={INK} strokeWidth={8} /><rect x={-76} y={-56} width={152} height={112} fill="#9ED8F0" /><circle cx={30} cy={-10} r={24} fill="#FFE45C" /></g>
      <rect x={720} y={60} width={480} height={260} fill="#FFF4D6" stroke={INK} strokeWidth={8} />
      <rect x={740} y={80} width={440} height={240} fill="url(#warm)" opacity={0.8} />
      {Array.from({ length: 7 }, (_, i) => { const t = i / 7, y0 = 320 + Math.pow(t, 1.4) * 760, y1 = 320 + Math.pow((i + 1) / 7, 1.4) * 760, x0 = 720 - t * 600, x1 = 720 - ((i + 1) / 7) * 600; return <g key={i}><path d={`M${x0} ${y0} L${W - x0} ${y0} L${W - x1} ${y1} L${x1} ${y1} Z`} fill={i % 2 ? '#B07D50' : '#C99A68'} stroke={INK} strokeWidth={6} /><rect x={x0} y={y0} width={W - 2 * x0} height={10 + t * 10} fill="#7A4A22" /></g>; })}
      <path d="M1500 -20 L1260 330 L1880 1100" stroke="#7A4A22" strokeWidth={46} fill="none" strokeLinecap="round" />
      <path d="M1500 -20 L1260 330 L1880 1100" stroke="#A86B3A" strokeWidth={26} fill="none" strokeLinecap="round" />
      <At x={0} y={-bob + 60}><Hands reach={0.15} /></At>
    </g>
  );
};
const ScanKitchen: React.FC<{ f: number }> = ({ f }) => (
  <g><KitchenPOV />
    {([[400, 475, 190, 210], [640, 500, 230, 170], [870, 490, 200, 190], [1060, 515, 110, 120], [1210, 505, 250, 130], [930, 150, 150, 150], [1410, 290, 580, 440], [145, 330, 280, 520], [1000, 80, 160, 120], [1300, 470, 140, 200]] as const).map(([x, y, w, h], i) => <Brackets key={i} x={x} y={y} w={w} h={h} p={lerp(f, i * 2, i * 2 + 6, 0, 1)} />)}
    <rect width={W} height={H} fill="#FFD45C" opacity={lerp(f, 0, 20, 0.25, 0)} />
    <Meter p={0.25} />
  </g>
);
const CerealClose: React.FC<{ f: number }> = ({ f }) => {
  const n = Math.round(lerp(f, 0, 40, 0, 1204));
  return (
    <g><rect width={W} height={H} fill="url(#warm)" />
      <g transform="translate(860 560) rotate(-4)"><rect x={-420} y={-470} width={840} height={980} rx={26} fill="#E53935" stroke={INK} strokeWidth={10} /><rect x={-360} y={-420} width={720} height={240} rx={18} fill="#FFD21F" stroke={INK} strokeWidth={7} /><Label x={0} y={-300} t="CRUNCH" size={130} color={INK} />
        <rect x={-360} y={-140} width={720} height={600} rx={14} fill="#FFF7DC" stroke={INK} strokeWidth={6} />
        {Array.from({ length: 22 }, (_, i) => { const lit = i < f / 2; return <rect key={i} x={-330} y={-115 + i * 26} width={300 + rnd(i, 4) * 360} height={12} rx={6} fill={lit ? '#2F6FD6' : '#C9BFA8'} opacity={lit ? 1 : 0.8} />; })}
        <rect x={-340} y={-128 + Math.min(21, Math.floor(f / 2)) * 26} width={680} height={34} rx={8} fill="#FFD45C" opacity={0.5} />
      </g>
      <At x={1540} y={300} r={6}><rect x={-230} y={-80} width={460} height={160} rx={80} fill="#0B0620" stroke={GOLD} strokeWidth={6} /><Label x={0} y={0} t={`${n.toLocaleString('en-US')} WORDS`} size={58} color={GOLD} /></At>
      <Meter p={0.25} />
    </g>
  );
};
const CEIL_CRACKS = Array.from({ length: 14 }, (_, i) => { const x = 140 + rnd(i, 7) * 1640, y = 140 + rnd(i, 8) * 760; let d = `M${x} ${y}`, cx = x, cy = y; for (let k = 0; k < 5; k++) { cx += (rnd(i * 9 + k, 2) - 0.5) * 180; cy += (rnd(i * 9 + k, 3) - 0.5) * 140; d += ` L${cx} ${cy}`; } return d; });
const CeilingCracks: React.FC<{ f: number }> = ({ f }) => (
  <g><rect width={W} height={H} fill="#EFE6D6" />
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={i * 150} x2={W} y2={i * 150 + 60} stroke="#E2D6C0" strokeWidth={30} />)}
    <g transform="translate(960 540)"><circle r={90} fill="#FFF8C4" stroke={INK} strokeWidth={8} filter="url(#glow)" /><circle r={130} fill="none" stroke="#E2D6C0" strokeWidth={14} /></g>
    {CEIL_CRACKS.map((d, i) => <g key={i} opacity={f > i * 1.5 ? 1 : 0}><path d={d} stroke="#6B5A44" strokeWidth={5} fill="none" /><path d={d} stroke={BOX.y} strokeWidth={10} fill="none" opacity={0.6} filter="url(#glow)" /></g>)}
    <At x={960} y={780}><rect x={-240} y={-62} width={480} height={124} rx={62} fill="#0B0620" stroke={GOLD} strokeWidth={6} /><Label x={0} y={0} t={`${Math.min(214, Math.round(f * 9))} CRACKS`} size={60} color={GOLD} /></At>
    <Meter p={0.25} />
  </g>
);
const ToasterClose: React.FC<{ f: number }> = ({ f }) => {
  const pop = 60, up = f >= pop ? Math.min(1, (f - pop) / 5) : 0;
  const t = Math.max(0, (pop - f) / 30);
  return (
    <g><rect width={W} height={H} fill="url(#warm)" /><rect y={760} width={W} height={320} fill="#C99A68" stroke={INK} strokeWidth={8} />
      <g transform="translate(820 760)">
        {[-130, 130].map((x) => <g key={x} transform={`translate(${x} ${-430 - up * 220}) rotate(${up * (x > 0 ? 12 : -10)})`}><rect x={-100} y={-90} width={200} height={190} rx={50} fill="#E2A15B" stroke={INK} strokeWidth={8} /><rect x={-80} y={-70} width={160} height={150} rx={40} fill="#F2C98A" /></g>)}
        <rect x={-340} y={-420} width={680} height={420} rx={90} fill="#C7CDD8" stroke={INK} strokeWidth={10} />
        <rect x={-300} y={-390} width={90} height={360} rx={30} fill="#fff" opacity={0.4} />
        <rect x={340} y={-260} width={60} height={40} rx={10} fill={INK} transform={`translate(0 ${up * -80})`} />
      </g>
      <At x={1470} y={420}><circle r={170} fill="#0B0620" stroke={f >= pop ? '#3DBE7A' : GOLD} strokeWidth={10} /><circle r={150} fill="none" stroke={f >= pop ? '#3DBE7A' : GOLD} strokeWidth={18} strokeDasharray={`${942 * Math.min(1, t / 2)} 942`} transform="rotate(-90)" /><Label x={0} y={0} t={f >= pop ? 'POP!' : t.toFixed(1) + 's'} size={86} color={f >= pop ? '#3DBE7A' : GOLD} /></At>
      <Meter p={0.25} />
    </g>
  );
};
const BITS = ['#FFD45C', '#6FD3FF', '#FF8AD8', '#3DBE7A', '#FF8A1F'];
const Eye: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><ellipse rx={180} ry={120} fill="#fff" stroke={INK} strokeWidth={10} /><circle r={78} fill="#2F6FD6" stroke={INK} strokeWidth={8} /><circle r={38} fill={INK} /><circle cx={-22} cy={-24} r={14} fill="#fff" /></g>
);
const SmallBrain: React.FC = () => <path d="M-200 40 Q-240 -120 -80 -160 Q0 -220 80 -160 Q240 -120 200 40 Q200 140 80 140 Q0 180 -80 140 Q-200 140 -200 40 Z" fill="#FF9FD0" stroke={INK} strokeWidth={10} />;
const Firehose: React.FC<{ f: number; trickle?: boolean }> = ({ f, trickle }) => (
  <g><rect width={W} height={H} fill="#1F2347" />
    <At x={280} y={540}><Eye s={1.2} /></At>
    <path d={trickle ? 'M500 470 Q900 420 1180 470 L1180 610 Q900 660 500 610 Z' : 'M500 470 Q1000 400 1460 470 L1460 610 Q1000 680 500 610 Z'} fill="#2B2150" stroke={INK} strokeWidth={8} />
    {Array.from({ length: 60 }, (_, i) => { const len = trickle ? 680 : 960; const x = 520 + ((rnd(i) * len + f * 22) % len); return <rect key={i} x={x} y={490 + rnd(i, 2) * 90} width={26} height={26} rx={5} fill={BITS[i % 5]} />; })}
    {trickle ? <g>
      <path d="M1180 420 L1420 540 L1180 660 Z" fill="#9AA3B5" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 30 }, (_, i) => { const t = (rnd(i, 5) + f / 25) % 1; return <rect key={i} x={1430 + t * 360} y={300 + (rnd(i, 6) - 0.5) * 300 + t * t * 700} width={22} height={22} rx={4} fill={BITS[i % 5]} opacity={0.8} />; })}
      <At x={1720} y={760}><rect x={-140} y={-110} width={280} height={140} rx={14} fill="#4A5568" stroke={INK} strokeWidth={8} /><Label x={0} y={-40} t="TRASH" size={52} color="#E2E8F0" /></At>
      <circle cx={1420} cy={560 + ((f * 3) % 60)} r={12} fill={GOLD} filter="url(#glow)" />
      <At x={1420} y={680}><path d="M-70 -60 L70 -60 L56 70 L-56 70 Z" fill="#FFF7DC" stroke={INK} strokeWidth={8} /><rect x={-56} y={50} width={112} height={18} fill={GOLD} /></At>
      <Label x={1420} y={800} t="YOU NOTICE" size={44} color={GOLD} />
    </g> : <g><At x={1660} y={540}><SmallBrain /></At><Label x={1000} y={300} t="MILLIONS / SEC" size={84} color={GOLD} /></g>}
  </g>
);
const Dumpster: React.FC<{ f: number; closed?: boolean }> = ({ f, closed }) => (
  <g><BrainCity lit={closed ? 0.6 : 0.25} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.45} />
    <g transform="translate(1180 900)"><rect x={-300} y={-300} width={600} height={300} rx={20} fill="#3DBE7A" stroke={INK} strokeWidth={10} /><rect x={-300} y={-300} width={600} height={40} fill="#2E9A60" />
      <path d={closed ? 'M-320 -320 L320 -320 L320 -290 L-320 -290 Z' : `M-320 -300 L320 -300 L${280} ${-560} L${-360} ${-520} Z`} fill="#2E9A60" stroke={INK} strokeWidth={10} />
      <Label x={0} y={-150} t={closed ? 'CLOSED' : 'TRASH'} size={84} color="#fff" />
      {closed && <g transform="rotate(-8) translate(0 -380)"><rect x={-200} y={-50} width={400} height={100} rx={12} fill="#E53935" stroke={INK} strokeWidth={8} /><Label x={0} y={0} t="NO DUMPING" size={50} color="#fff" /></g>}
    </g>
    {Array.from({ length: closed ? 90 : 26 }, (_, i) => { if (closed) { const t = Math.min(1, (f / 50) * rnd(i, 4) + 0.1); return <rect key={i} x={rnd(i) * W} y={1080 - t * (120 + rnd(i, 2) * 520)} width={34} height={34} rx={6} fill={BITS[i % 5]} stroke={INK} strokeWidth={3} />; } const t = ((rnd(i, 3) + f / 30) % 1); return <rect key={i} x={460 + t * 700} y={560 - Math.sin(t * Math.PI) * 300 + rnd(i, 5) * 60} width={34} height={34} rx={6} fill={BITS[i % 5]} stroke={INK} strokeWidth={3} />; })}
    <At x={closed ? 560 : 420} y={1060} s={2}><Neil mood={closed ? 'shock' : 'happy'} /></At>
    <Meter p={0.25} />
  </g>
);
const Hole: React.FC<{ r: number; ring?: number }> = ({ r, ring = 0 }) => (
  <g transform="translate(1180 360)"><circle r={r} fill="#05040A" filter="url(#soft)" /><circle r={r * 0.85} fill="#000" />{ring > 0 && <circle r={r + 30} fill="none" stroke={GOLD} strokeWidth={8} strokeDasharray="26 16" opacity={ring} transform={`rotate(${ring * 40})`} />}</g>
);
const EyeSection: React.FC<{ f: number }> = ({ f }) => (
  <g><rect width={W} height={H} fill="#1F2347" />
    {[-1, 0, 1].map((k) => <line key={k} x1={0} y1={540 + k * 160} x2={540} y2={540 + k * 40} stroke="#FFF2A8" strokeWidth={8} opacity={0.6} />)}
    <g transform="translate(900 540)">
      <circle r={360} fill="#FFF7EC" stroke={INK} strokeWidth={12} />
      <path d="M-330 -140 Q-400 0 -330 140" fill="#2F6FD6" stroke={INK} strokeWidth={10} />
      <ellipse cx={-280} rx={44} ry={110} fill="#BEE3F8" stroke={INK} strokeWidth={8} opacity={0.9} />
      <path d="M-120 -320 A360 360 0 0 1 340 -120 L320 -100 A340 340 0 0 0 -110 -300 Z" fill="#F2A3B8" />
      <path d="M240 260 A360 360 0 0 1 -120 320 L-110 300 A340 340 0 0 0 225 245 Z" fill="#F2A3B8" />
      <path d="M330 -110 L340 -40 L340 40 L330 110" stroke="#F2A3B8" strokeWidth={22} fill="none" />
      <path d={`M340 0 Q520 0 ${560 + 200} ${-40}`} stroke="#F6C27A" strokeWidth={90} fill="none" strokeLinecap="round" />
      <path d={`M340 0 Q520 0 ${560 + 200} ${-40}`} stroke={INK} strokeWidth={6} fill="none" strokeDasharray="0" opacity={0.2} />
      <circle cx={345} cy={0} r={54 + Math.sin(f / 4) * 6} fill="none" stroke="#E53935" strokeWidth={10} filter="url(#glow)" />
    </g>
    <At x={1250} y={340} s={lerp(f, 8, 16, 0.4, 1)}><rect x={-200} y={-56} width={400} height={112} rx={56} fill="#0B0620" stroke="#E53935" strokeWidth={6} /><Label x={0} y={0} t="BLIND SPOT" size={58} color="#FF7A6E" /></At>
    <Label x={1560} y={600} t="NERVE" size={46} color="#F6C27A" />
  </g>
);
const PaintOver: React.FC<{ f: number }> = ({ f }) => {
  const p = lerp(f, 6, 46, 0, 1);
  return (
    <g><g transform="translate(-700 -40) scale(1.6)"><KitchenPOV /></g>
      <g transform="translate(960 470)"><circle r={200} fill="#000" /><clipPath id="paintC"><rect x={-240} y={-240} width={480 * p} height={480} /></clipPath><g clipPath="url(#paintC)"><circle r={204} fill="#9ED8F0" /><ellipse cx={-30} cy={110} rx={200} ry={130} fill="#6BB36F" /><circle cx={0} cy={0} r={204} fill="none" stroke="#9ED8F0" strokeWidth={8} /></g></g>
      <g transform={`translate(${760 + p * 420} ${300 + Math.sin(f / 3) * 40})`}><rect x={-24} y={-150} width={48} height={300} rx={16} fill="#FFD21F" stroke={INK} strokeWidth={8} /><rect x={-10} y={150} width={20} height={200} fill="#7A4A22" stroke={INK} strokeWidth={5} /></g>
      <At x={360} y={1060} s={2}><Neil mood="happy" /></At>
      <At x={1560} y={760} r={-4}><rect x={-210} y={-60} width={420} height={120} rx={20} fill="#FFF7DC" stroke={INK} strokeWidth={8} /><Label x={0} y={0} t="AUTO-FILL" size={64} color="#2F6FD6" /></At>
    </g>
  );
};
const MemFly: React.FC<{ f: number }> = ({ f }) => (
  <g><BrainCity lit={['mem']} labels={false} />
    {Array.from({ length: 16 }, (_, i) => { const t = ((rnd(i, 3) + f / 45) % 1); const x = 700 + rnd(i) * 520 + (rnd(i, 2) - 0.5) * t * 1100, y = 520 - t * 520; return <g key={i} transform={`translate(${x} ${y}) rotate(${(rnd(i, 4) - 0.5) * 60 + Math.sin(f / 4 + i) * 20})`} opacity={1 - t * 0.5}><path d="M0 0 L-60 -18 L-60 34 L0 52 Z" fill={BITS[i % 5]} stroke={INK} strokeWidth={5} /><path d="M0 0 L60 -18 L60 34 L0 52 Z" fill="#FFF7DC" stroke={INK} strokeWidth={5} /></g>; })}
    <At x={960} y={160}><rect x={-280} y={-54} width={560} height={108} rx={54} fill="#0B0620" opacity={0.85} stroke={GOLD} strokeWidth={4} /><Label x={0} y={0} t="REMEMBERING" size={60} color={GOLD} /></At>
    <Meter p={0.25} />
  </g>
);
const Pin: React.FC<{ x: number; y: number; p: number; label: string; children: React.ReactNode }> = ({ x, y, p, label, children }) => p <= 0 ? null : (
  <g transform={`translate(${x} ${y}) scale(${lerp(p, 0, 1, 1.6, 1)})`} opacity={Math.min(1, p * 2)}>
    <rect x={-190} y={-190} width={380} height={380} rx={12} fill="#FFF7DC" stroke={INK} strokeWidth={8} transform="rotate(-3)" />
    {children}
    <circle cy={-180} r={22} fill="#E53935" stroke={INK} strokeWidth={6} />
    <Label x={0} y={140} t={label} size={52} color={INK} />
  </g>
);
const PinBoard: React.FC<{ f: number }> = ({ f }) => (
  <g><rect width={W} height={H} fill="#B07D50" />{Array.from({ length: 120 }, (_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i, 2) * H} r={4} fill="#8A5A30" />)}
    <path d={`M560 420 Q960 ${300 + Math.sin(f / 8) * 20} 1360 420`} stroke="#E53935" strokeWidth={6} fill="none" opacity={f > 24 ? 1 : 0} />
    <Pin x={560} y={520} p={lerp(f, 0, 6, 0, 1)} label="UNDER COUCH"><g transform="translate(0 -20) rotate(-20)"><rect x={-40} y={-110} width={80} height={220} rx={30} fill="#2D3748" stroke={INK} strokeWidth={7} /><circle cy={-70} r={16} fill="#E53935" />{[0, 1, 2].map((k) => <circle key={k} cx={-16 + k * 16} cy={-10} r={8} fill="#9AA3B5" />)}{[0, 1, 2].map((k) => <circle key={k} cx={-16 + k * 16} cy={30} r={8} fill="#9AA3B5" />)}</g></Pin>
    <Pin x={1360} y={520} p={lerp(f, 24, 30, 0, 1)} label="AGE 6"><g transform="translate(0 -20)"><path d="M-70 -70 Q-70 -110 -30 -100 Q0 -90 30 -100 Q70 -110 70 -70 Q74 0 50 70 Q36 100 20 50 Q0 20 -20 50 Q-36 100 -50 70 Q-74 0 -70 -70 Z" fill="#fff" stroke={INK} strokeWidth={8} /><circle cx={-24} cy={-50} r={10} fill={INK} /><circle cx={24} cy={-50} r={10} fill={INK} /><path d="M-16 -20 Q0 -6 16 -20" stroke={INK} strokeWidth={6} fill="none" /></g></Pin>
    <Meter p={0.25} />
  </g>
);
const PW = ['fluffy123', 'password1', 'qwerty!!', 'iloveCAT', 'p@ssw0rd', 'letmein', '123456', 'sunshine9'];
const Passwords: React.FC<{ f: number }> = ({ f }) => (
  <g><rect width={W} height={H} fill="#1F2347" />
    {Array.from({ length: 34 }, (_, i) => { const t0 = i * 1.4; if (f < t0) return null; const y = Math.min(260 + rnd(i, 2) * 700, -200 + (f - t0) * 90); return <g key={i} transform={`translate(${160 + rnd(i) * 1600} ${y}) rotate(${(rnd(i, 3) - 0.5) * 30})`}><rect x={-120} y={-80} width={240} height={160} fill={['#FFE45C', '#FF8AD8', '#6FD3FF', '#9BE07A'][i % 4]} stroke={INK} strokeWidth={5} /><Label x={0} y={0} t={PW[i % PW.length]} size={30} color={INK} /></g>; })}
    <At x={960} y={160}><rect x={-330} y={-64} width={660} height={128} rx={64} fill="#0B0620" stroke={GOLD} strokeWidth={6} /><Label x={0} y={0} t={`${Math.min(412, Math.round(f * 7))} PASSWORDS`} size={60} color={GOLD} /></At>
    <Meter p={0.25} />
  </g>
);
const CatStare: React.FC<{ f: number; meh?: boolean }> = ({ f, meh }) => (
  <g><g transform="translate(-300 -200) scale(1.3)"><KitchenPOV /></g><rect width={W} height={H} fill="#000" opacity={0.15} />
    <At x={1050} y={1000} s={3.2}><Cat eye={meh ? 'shut' : 'open'} /></At>
    {meh && <At x={1380} y={300}><Stamp t="NOT IMPRESSED" p={lerp(f, 18, 26, 0, 1)} size={84} /></At>}
    <Meter p={0.25} />
  </g>
);

// ---- 4-10 shared bits
const Tag: React.FC<{ x: number; y: number; t: string; c?: string; size?: number }> = ({ x, y, t, c = GOLD, size = 60 }) => {
  const w = t.length * size * 0.62 + 90;
  return <g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={size * 0.95} fill="#0B0620" opacity={0.92} stroke={c} strokeWidth={6} /><Label x={0} y={0} t={t} size={size} color={c} /></g>;
};
const Night: React.FC<{ op?: number; lit?: number; red?: boolean }> = ({ op = 0.55, lit = 0.3, red }) => <><BrainCity lit={lit} labels={false} red={red} /><rect width={W} height={H} fill="#0B0620" opacity={op} /></>;
const Say: React.FC<{ x: number; y: number; t: string; w?: number; size?: number; tx?: number; ty?: number; p?: number; fill?: string; color?: string }> = ({ x, y, t, w, size = 54, tx = 0, ty = 160, p = 1, fill = '#fff', color = INK }) => {
  if (p <= 0) return null;
  const ww = w ?? t.length * size * 0.6 + 100, hh = size * 2.2;
  return <g transform={`translate(${x} ${y}) scale(${lerp(p, 0, 1, 0.6, 1)})`} opacity={Math.min(1, p * 2)}><path d={`M${-30} ${hh / 2 - 4} L${tx} ${ty} L${30} ${hh / 2 - 4} Z`} fill={fill} stroke={INK} strokeWidth={7} strokeLinejoin="round" /><rect x={-ww / 2} y={-hh / 2} width={ww} height={hh} rx={hh / 2} fill={fill} stroke={INK} strokeWidth={7} /><rect x={-24} y={hh / 2 - 12} width={48} height={14} fill={fill} /><Label x={0} y={0} t={t} size={size} color={color} /></g>;
};
type Mood = 'ok' | 'shock' | 'mad' | 'smug' | 'sad';
/** a generic person (not Max). Origin at the feet, about 600 tall. */
const Guy: React.FC<{ skin?: string; shirt?: string; hair?: string; mood?: Mood; hat?: 'none' | 'waiter' | 'crown' | 'host' | 'glasses' | 'doc' }> = ({ skin = '#F2C29B', shirt = '#2F6FD6', hair = '#3A2A1E', mood = 'ok', hat = 'none' }) => {
  const f = F(), b = Math.sin(f / 10) * 3;
  const arm = (s: number) => `M${s * 92} -360 Q${s * 150} -290 ${s * 128} -205`;
  return (
    <g>
      <ellipse cy={4} rx={120} ry={14} fill="#000" opacity={0.25} />
      {[-30, 30].map((x) => <rect key={x} x={x - 20} y={-200} width={40} height={204} rx={16} fill="#2D3748" stroke={INK} strokeWidth={6} />)}
      <g transform={`translate(0 ${b})`}>
        {[-1, 1].map((s) => <g key={s}><path d={arm(s)} stroke={INK} strokeWidth={50} fill="none" strokeLinecap="round" /><path d={arm(s)} stroke={hat === 'doc' ? '#fff' : shirt} strokeWidth={36} fill="none" strokeLinecap="round" /><circle cx={s * 128} cy={-200} r={22} fill={skin} stroke={INK} strokeWidth={6} /></g>)}
        <path d="M-100 -180 Q-112 -384 0 -392 Q112 -384 100 -180 Z" fill={hat === 'doc' ? '#fff' : shirt} stroke={INK} strokeWidth={7} />
        {hat === 'doc' && <g><path d="M-30 -385 L0 -300 L30 -385" fill={shirt} stroke={INK} strokeWidth={5} /><path d="M-40 -370 Q-60 -260 0 -250 Q60 -260 40 -370" stroke="#4A5568" strokeWidth={8} fill="none" /><circle cx={0} cy={-246} r={14} fill="#9AA3B5" stroke={INK} strokeWidth={4} /><rect x={40} y={-330} width={40} height={10} fill="#E53935" /><rect x={55} y={-345} width={10} height={40} fill="#E53935" /></g>}
        {(hat === 'waiter' || hat === 'host') && <path d="M-34 -394 L0 -380 L34 -394 L34 -362 L0 -376 L-34 -362 Z" fill={hat === 'host' ? GOLD : INK} stroke={INK} strokeWidth={4} />}
        {hat === 'waiter' && <rect x={60} y={-300} width={40} height={90} rx={6} fill="#fff" stroke={INK} strokeWidth={5} />}
        <circle cy={-482} r={100} fill={skin} stroke={INK} strokeWidth={7} />
        {mood === 'mad' && <circle cy={-482} r={95} fill="#E53935" opacity={0.45} />}
        <path d={hat === 'host' ? 'M-102 -500 Q-80 -610 30 -598 Q110 -580 102 -500 Q70 -560 -10 -566 Q-70 -560 -102 -500 Z' : 'M-102 -496 Q-92 -600 0 -592 Q92 -600 102 -496 Q60 -556 0 -552 Q-60 -556 -102 -496 Z'} fill={hair} stroke={INK} strokeWidth={6} />
        {[-36, 36].map((x) => <g key={x}><ellipse cx={x} cy={-486} rx={20} ry={mood === 'shock' ? 28 : 22} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={x} cy={-484} r={mood === 'shock' ? 7 : 10} fill={INK} /></g>)}
        {mood === 'mad' && <path d="M-62 -530 L-16 -510 M62 -530 L16 -510" stroke={INK} strokeWidth={9} strokeLinecap="round" />}
        {mood === 'smug' && <path d="M-60 -520 L-16 -522 M16 -530 L60 -540" stroke={INK} strokeWidth={8} strokeLinecap="round" />}
        {mood === 'sad' && <path d="M-60 -510 L-16 -526 M16 -526 L60 -510" stroke={INK} strokeWidth={8} strokeLinecap="round" />}
        <path d={mood === 'shock' ? 'M-16 -430 Q0 -400 16 -430 Q0 -446 -16 -430' : mood === 'mad' || mood === 'sad' ? 'M-30 -420 Q0 -444 30 -420' : mood === 'smug' ? 'M-20 -434 Q14 -420 34 -444' : 'M-30 -440 Q0 -414 30 -440'} stroke={INK} strokeWidth={7} fill={mood === 'shock' ? INK : 'none'} strokeLinecap="round" />
        {hat === 'waiter' && <path d="M-40 -452 Q-20 -470 0 -456 Q20 -470 40 -452 Q20 -440 0 -448 Q-20 -440 -40 -452 Z" fill={hair} stroke={INK} strokeWidth={4} />}
        {hat === 'glasses' && <g fill="none" stroke={INK} strokeWidth={7}><circle cx={-36} cy={-486} r={32} /><circle cx={36} cy={-486} r={32} /><line x1={-4} y1={-486} x2={4} y2={-486} /></g>}
        {hat === 'crown' && <path d="M-70 -570 L-70 -640 L-35 -600 L0 -660 L35 -600 L70 -640 L70 -570 Z" fill={GOLD} stroke={INK} strokeWidth={7} strokeLinejoin="round" />}
        {hat === 'doc' && <g transform="translate(0 -560)"><circle r={30} fill="#CBD5E0" stroke={INK} strokeWidth={6} /><circle r={12} fill="#fff" /></g>}
        {mood === 'mad' && [-50, 0, 50].map((x, k) => <circle key={x} cx={x} cy={-640 - ((f * 3 + k * 20) % 60)} r={22 + k * 4} fill="#E2E8F0" opacity={0.8 - ((f * 3 + k * 20) % 60) / 80} />)}
      </g>
    </g>
  );
};
const BrainIcon: React.FC<{ face?: boolean }> = ({ face }) => <g><path d="M-200 40 Q-240 -120 -80 -160 Q0 -220 80 -160 Q240 -120 200 40 Q200 140 80 140 Q0 180 -80 140 Q-200 140 -200 40 Z" fill="#FF9FD0" stroke={INK} strokeWidth={10} /><path d="M-120 -40 Q-60 -90 0 -40 Q60 10 120 -40 M-140 60 Q-60 20 0 70 Q80 110 140 50" stroke="#E07AB0" strokeWidth={10} fill="none" />{face && <g>{[-60, 60].map((x) => <g key={x}><ellipse cx={x} cy={-20} rx={28} ry={32} fill="#fff" stroke={INK} strokeWidth={6} /><circle cx={x} cy={-14} r={13} fill={INK} /></g>)}<path d="M-50 60 Q0 100 50 60" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" /></g>}</g>;
const pctCard = (from: number, to: number, red = false) => sc((f) => <St><Night lit={to >= 1 ? 1 : to * 0.9} op={0.55} red={red} /><At x={960} y={500} s={lerp(f, 0, 8, 1.3, 1)}><BigNum text={`${Math.round(lerp(f, 0, 16, from, to) * 100)}%`} size={300} color={to >= 0.9 ? '#FF7A6E' : to >= 0.75 ? '#FFB45C' : GOLD} /></At><Meter p={lerp(f, 0, 16, from, to)} /></St>, { a: { z: 1 }, b: { z: 1 }, shake: to >= 0.9 ? 0.4 : 0 });
const WarmBg: React.FC = () => <><rect width={W} height={H} fill="url(#warm)" /><rect y={760} width={W} height={320} fill="#C99A68" stroke={INK} strokeWidth={8} /></>;
const BookOpen: React.FC<{ f: number; flip?: boolean }> = ({ f, flip = true }) => {
  const k = (f % 4) / 4;
  return <g><path d="M0 -20 Q-220 -60 -440 -20 L-440 340 Q-220 300 0 340 Z" fill="#FFF7EC" stroke={INK} strokeWidth={8} /><path d="M0 -20 Q220 -60 440 -20 L440 340 Q220 300 0 340 Z" fill="#FFF7EC" stroke={INK} strokeWidth={8} />{[0, 1].map((s) => Array.from({ length: 9 }, (_, i) => <rect key={s + '-' + i} x={s ? 50 : -400} y={20 + i * 32} width={250 + rnd(i, s + 2) * 100} height={12} rx={6} fill="#C9BFA8" />))}{flip && <path d={`M0 -20 Q${220 * (1 - 2 * k)} -70 ${440 * (1 - 2 * k)} -20 L${440 * (1 - 2 * k)} 340 Q${220 * (1 - 2 * k)} 300 0 340 Z`} fill="#FFFDF6" stroke={INK} strokeWidth={6} />}<line x1={0} y1={-20} x2={0} y2={340} stroke={INK} strokeWidth={8} /></g>;
};
const Race: React.FC<{ f: number }> = ({ f }) => (
  <g><rect width={W} height={H} fill="#1F2347" />
    <At x={420} y={540}><circle r={220} fill="#FFF7DC" stroke={INK} strokeWidth={12} /><rect x={-30} y={-280} width={60} height={50} rx={10} fill="#9AA3B5" stroke={INK} strokeWidth={8} />{Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-190} x2={0} y2={-165} stroke={INK} strokeWidth={8} transform={`rotate(${i * 30})`} />)}<line x1={0} y1={0} x2={0} y2={-160} stroke="#E53935" strokeWidth={12} strokeLinecap="round" transform={`rotate(${lerp(f, 0, 40, 0, 240)})`} /><circle r={16} fill={INK} /><Label x={0} y={90} t={`0:${String(Math.round(lerp(f, 0, 40, 0, 40))).padStart(2, '0')}`} size={64} color={INK} /></At>
    {[['YOU', 1, GOLD, 380], ['NORMAL', 0.06, '#9AA3B5', 640]].map(([t, v, c, y]) => <g key={t as string}><Label x={1020} y={(y as number) - 70} t={t as string} size={50} color={c as string} /><rect x={760} y={y as number} width={1000} height={80} rx={40} fill="#2B2150" stroke={INK} strokeWidth={6} /><rect x={760} y={y as number} width={Math.max(80, 1000 * (v as number) * Math.min(1, f / 40))} height={80} rx={40} fill={c as string} /></g>)}
    <Label x={1260} y={860} t="6 HOURS" size={46} color="#9AA3B5" />
  </g>
);
const Silhouette: React.FC = () => <g><circle cy={-300} r={90} fill="#3A3F58" /><path d="M-150 0 Q-160 -190 0 -200 Q160 -190 150 0 Z" fill="#3A3F58" /></g>;
const BookStack: React.FC<{ f: number }> = ({ f }) => (
  <g><rect width={W} height={H} fill="#1F2347" /><rect y={940} width={W} height={140} fill="#2B2150" />
    {Array.from({ length: 30 }, (_, i) => i * 1.5 > f ? null : <rect key={i} x={810 + (rnd(i) - 0.5) * 60} y={940 - (i + 1) * 34} width={300 + rnd(i, 2) * 60} height={34} rx={6} fill={BITS[i % 5]} stroke={INK} strokeWidth={5} />)}
    <At x={1500} y={300}><Tag x={0} y={0} t="REMEMBERED" /></At>
  </g>
);
const Juggle: React.FC<{ f: number }> = ({ f }) => <g>{[0, 1, 2].map((k) => { const t = (f / 24 + k / 3) % 1; return <circle key={k} cx={-90 + 180 * t} cy={-Math.sin(t * Math.PI) * 160} r={34} fill={['#E53935', '#FFD21F', '#2F6FD6'][k]} stroke={INK} strokeWidth={6} />; })}</g>;
const Keys: React.FC<{ n?: number }> = ({ n = 14 }) => <g>{Array.from({ length: n }, (_, i) => <rect key={i} x={i * 80} y={0} width={80} height={300} fill="#fff" stroke={INK} strokeWidth={6} />)}{Array.from({ length: n - 1 }, (_, i) => [0, 1, 3, 4, 5].includes(i % 7) ? <rect key={'b' + i} x={i * 80 + 56} y={0} width={48} height={180} rx={6} fill={INK} /> : null)}</g>;
const Skills: React.FC<{ f: number; t1: number; t2: number }> = ({ f, t1, t2 }) => (
  <g><rect width={W} height={H} fill="#1F2347" />
    <Tag x={960} y={140} t="BY LUNCH" />
    {[[0, 'JUGGLE', 0], [1, 'ITALIAN', t1], [2, 'PIANO', t2]].map(([i, t, t0]) => { const p = lerp(f, t0 as number, (t0 as number) + 6, 0, 1); if (p <= 0) return null; const x = 400 + (i as number) * 560; return <g key={i as number} transform={`translate(${x} 580) scale(${lerp(p, 0, 1, 0.5, 1)})`}><rect x={-230} y={-260} width={460} height={520} rx={30} fill="#FFF7DC" stroke={INK} strokeWidth={8} />
      {i === 0 && <g transform="translate(0 40)"><Juggle f={f} /></g>}
      {i === 1 && <g transform="translate(0 -20)"><Say x={0} y={0} t="CIAO!" size={70} tx={-60} ty={110} fill="#fff" /><rect x={-150} y={-120} width={100} height={20} fill="#3DBE7A" /><rect x={-50} y={-120} width={100} height={20} fill="#fff" stroke="#ddd" /><rect x={50} y={-120} width={100} height={20} fill="#E53935" /></g>}
      {i === 2 && <g transform="translate(-200 -100) scale(0.36)"><Keys n={14} /></g>}
      <Label x={0} y={190} t={t as string} size={56} color={INK} /><circle cx={180} cy={-220} r={40} fill="#3DBE7A" stroke={INK} strokeWidth={6} /><path d="M160 -220 L176 -204 L202 -236" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" /></g>; })}
  </g>
);
const Piano: React.FC<{ f: number; good: number }> = ({ f, good }) => {
  const ok = f >= good;
  return (
    <g><rect width={W} height={H} fill={ok ? '#2B2150' : '#3A2030'} />
      <g transform="translate(400 620)"><rect x={-40} y={-80} width={1200} height={420} rx={20} fill={INK} /><Keys n={14} /></g>
      {Array.from({ length: 14 }, (_, i) => { const t = ((f / 30 + rnd(i)) % 1); return <g key={i} transform={`translate(${440 + rnd(i, 3) * 1040} ${560 - t * 460}) rotate(${ok ? 0 : (rnd(i, 4) - 0.5) * 80})`} opacity={1 - t}>{ok ? <g><ellipse cx={0} cy={0} rx={26} ry={20} fill={GOLD} stroke={INK} strokeWidth={5} /><line x1={24} y1={0} x2={24} y2={-80} stroke={INK} strokeWidth={7} /></g> : <path d="M-30 -30 L30 30 M30 -30 L-30 30" stroke="#E53935" strokeWidth={14} strokeLinecap="round" />}</g>; })}
      <Hands reach={0.25} />
      <Tag x={960} y={150} t={ok ? 'BRILLIANTLY' : 'BADLY'} c={ok ? GOLD : '#FF7A6E'} />
    </g>
  );
};
const Plate: React.FC<{ crumbs?: boolean }> = ({ crumbs = true }) => <g><ellipse rx={260} ry={90} fill="#fff" stroke={INK} strokeWidth={8} /><ellipse rx={180} ry={56} fill="none" stroke="#E2E8F0" strokeWidth={6} />{crumbs && [[-40, -10], [30, 14], [60, -20], [-80, 20]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="#C99A68" />)}</g>;
const Sandwich: React.FC = () => <g><path d="M-120 0 L120 0 L100 -40 L-100 -40 Z" fill="#F2C98A" stroke={INK} strokeWidth={6} /><path d="M-124 -40 L124 -40 L124 -54 L-124 -54 Z" fill="#6BB36F" stroke={INK} strokeWidth={5} /><path d="M-118 -54 L118 -54 L116 -68 L-116 -68 Z" fill="#E53935" stroke={INK} strokeWidth={5} /><path d="M-110 -68 L110 -68 L90 -110 L-90 -110 Z" fill="#F2C98A" stroke={INK} strokeWidth={6} /></g>;
const Socket: React.FC = () => <g><rect x={-90} y={-120} width={180} height={240} rx={24} fill="#fff" stroke={INK} strokeWidth={8} /><rect x={-36} y={-60} width={16} height={50} rx={6} fill={INK} /><rect x={20} y={-60} width={16} height={50} rx={6} fill={INK} /><path d="M-20 40 Q0 70 20 40" stroke={INK} strokeWidth={10} fill="none" /></g>;
const Bulb: React.FC<{ glow?: number }> = ({ glow = 0.5 }) => <g><circle cy={-60} r={130} fill="#FFF2A8" opacity={glow * 0.5} filter="url(#glow)" /><circle cy={-60} r={100} fill="#FFF8C4" stroke={INK} strokeWidth={8} opacity={0.6 + glow * 0.4} /><rect x={-50} y={30} width={100} height={70} rx={10} fill="#9AA3B5" stroke={INK} strokeWidth={7} /><path d="M-30 -40 L-10 -80 L10 -40 L30 -80" stroke="#C99A68" strokeWidth={6} fill="none" /></g>;
const Workers: React.FC<{ signs?: string[] }> = ({ signs = [] }) => <g>{signs.map((s, i) => <g key={i} transform={`translate(${i * 300} ${Math.sin(F() / 6 + i) * 6})`}><Worker /><line x1={90} y1={-180} x2={90} y2={-20} stroke="#8E6845" strokeWidth={10} /><rect x={10} y={-260} width={160} height={84} rx={8} fill="#FFF7DC" stroke={INK} strokeWidth={5} /><Label x={90} y={-218} t={s} size={30} color="#E53935" /></g>)}</g>;
const Cafe: React.FC = () => <g><rect width={W} height={H} fill="#F3D7B0" />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={0} width={80} height={700} fill="#EBC99A" />)}<rect x={1300} y={120} width={460} height={340} rx={14} fill="#9ED8F0" stroke={INK} strokeWidth={10} /><line x1={1530} y1={120} x2={1530} y2={460} stroke={INK} strokeWidth={8} /><rect y={700} width={W} height={380} fill="#8A5A30" /><path d="M200 900 L1720 900 L1820 1080 L100 1080 Z" fill="#fff" stroke={INK} strokeWidth={8} /><g transform="translate(560 900)"><rect x={-60} y={-90} width={120} height={90} rx={14} fill="#fff" stroke={INK} strokeWidth={7} /><path d="M60 -70 q30 0 30 24 q0 24 -30 24" stroke={INK} strokeWidth={7} fill="none" /></g></g>;
const Park: React.FC = () => <g><rect width={W} height={H} fill="#9ED8F0" /><circle cx={1600} cy={160} r={70} fill="#FFE45C" filter="url(#glow)" />{[[160, 520], [520, 470], [1380, 500], [1760, 520]].map(([x, y], i) => <g key={i}><rect x={x - 16} y={y} width={32} height={180} fill="#7A4A22" /><circle cx={x} cy={y - 40} r={140} fill="#6BB36F" stroke={INK} strokeWidth={6} /></g>)}<rect y={680} width={W} height={400} fill="#7CC36F" /><path d="M0 760 Q960 700 1920 760" stroke="#6BB36F" strokeWidth={30} fill="none" /></g>;
const Pigeon: React.FC = () => { const f = F(); return <g><ellipse cy={6} rx={110} ry={14} fill="#000" opacity={0.25} /><line x1={-20} y1={-50} x2={-24} y2={0} stroke="#E07A7A" strokeWidth={10} /><line x1={20} y1={-50} x2={24} y2={0} stroke="#E07A7A" strokeWidth={10} /><ellipse cx={0} cy={-110} rx={130} ry={80} fill="#9AA3B5" stroke={INK} strokeWidth={8} /><path d="M-40 -130 Q40 -180 120 -110 Q40 -80 -40 -130 Z" fill="#7E8798" stroke={INK} strokeWidth={6} /><path d="M120 -120 L200 -90 L120 -80 Z" fill="#7E8798" stroke={INK} strokeWidth={6} /><g transform={`rotate(${Math.sin(f / 5) * 8} -100 -180)`}><circle cx={-110} cy={-200} r={64} fill="#9AA3B5" stroke={INK} strokeWidth={8} /><path d="M-150 -160 Q-110 -130 -70 -160" stroke="#6FC08A" strokeWidth={14} fill="none" /><circle cx={-130} cy={-212} r={16} fill="#FF8A1F" stroke={INK} strokeWidth={4} /><circle cx={-132} cy={-212} r={6} fill={INK} /><path d="M-168 -200 L-206 -190 L-168 -180 Z" fill="#FFD45C" stroke={INK} strokeWidth={4} /></g></g>; };
const Cloud: React.FC<{ face?: boolean }> = ({ face = true }) => <g><path d="M-200 60 Q-260 60 -250 0 Q-250 -70 -170 -70 Q-150 -150 -50 -130 Q20 -190 100 -130 Q200 -150 210 -60 Q280 -40 250 30 Q240 70 180 60 Z" fill="#fff" stroke="#C9D7E8" strokeWidth={8} />{face && <g><circle cx={-60} cy={-40} r={16} fill="#B7C7DC" /><circle cx={60} cy={-40} r={16} fill="#B7C7DC" /><path d="M-50 20 Q0 50 50 20" stroke="#B7C7DC" strokeWidth={10} fill="none" strokeLinecap="round" /></g>}</g>;
const Toast: React.FC = () => <g><path d="M-200 220 L-200 -100 Q-240 -230 -80 -240 Q0 -290 80 -240 Q240 -230 200 -100 L200 220 Z" fill="#E2A15B" stroke={INK} strokeWidth={10} /><path d="M-170 200 L-170 -90 Q-200 -200 -70 -210 Q0 -250 70 -210 Q200 -200 170 -90 L170 200 Z" fill="#F2C98A" /><ellipse cx={-60} cy={-40} rx={30} ry={22} fill="#9A5A22" opacity={0.85} /><ellipse cx={60} cy={-40} rx={30} ry={22} fill="#9A5A22" opacity={0.85} /><path d="M-70 80 Q0 130 70 80" stroke="#9A5A22" strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.85} /></g>;
const Sock: React.FC<{ c: string }> = ({ c }) => <g><path d="M-60 -300 L60 -300 L60 0 Q60 80 -20 80 L-160 80 Q-220 80 -220 20 Q-220 -30 -160 -30 L-60 -30 Z" fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" /><rect x={-60} y={-300} width={120} height={50} fill="#fff" stroke={INK} strokeWidth={6} /><g transform="translate(0 -150)">{[-26, 26].map((x) => <g key={x}><ellipse cx={x} cy={0} rx={20} ry={14} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={x + 4} cy={4} r={7} fill={INK} /><path d={`M${x - 22} -14 L${x + 22} ${x < 0 ? -4 : -18}`} stroke={INK} strokeWidth={7} strokeLinecap="round" /></g>)}<path d="M-20 50 L20 50" stroke={INK} strokeWidth={7} strokeLinecap="round" /></g></g>;
const FaceTile: React.FC<{ k: 0 | 1 | 2 }> = ({ k }) => (
  <g><rect x={-230} y={-230} width={460} height={460} rx={30} fill="#FFF7DC" stroke={INK} strokeWidth={8} />
    {k === 0 && <Socket />}
    {k === 1 && <g><rect x={-180} y={-70} width={360} height={150} rx={40} fill="#E53935" stroke={INK} strokeWidth={8} /><path d="M-130 -70 L-90 -150 L90 -150 L130 -70 Z" fill="#E53935" stroke={INK} strokeWidth={8} /><circle cx={-110} cy={-10} r={34} fill="#FFF8C4" stroke={INK} strokeWidth={6} /><circle cx={110} cy={-10} r={34} fill="#FFF8C4" stroke={INK} strokeWidth={6} /><path d="M-70 50 Q0 80 70 50" stroke={INK} strokeWidth={10} fill="none" /></g>}
    {k === 2 && <g><path d="M-170 160 L-170 -40 L0 -180 L170 -40 L170 160 Z" fill="#F2C98A" stroke={INK} strokeWidth={8} /><rect x={-120} y={-40} width={70} height={70} fill="#9ED8F0" stroke={INK} strokeWidth={6} /><rect x={50} y={-40} width={70} height={70} fill="#9ED8F0" stroke={INK} strokeWidth={6} /><rect x={-40} y={60} width={80} height={100} rx={40} fill="#8E5BD6" stroke={INK} strokeWidth={6} /></g>}
  </g>
);
const Googly: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => { const f = F(); return <g transform={`translate(${x} ${y}) scale(${s})`}>{[-24, 24].map((d) => <g key={d}><circle cx={d} r={22} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={d + Math.sin(f / 7 + x) * 6} cy={6} r={10} fill={INK} /></g>)}</g>; };
const EYES_AT: [number, number, number][] = [[400, 470, 1], [640, 500, 1], [870, 480, 1], [1060, 520, 0.7], [1210, 500, 0.9], [930, 150, 0.8], [145, 200, 1.2], [1000, 100, 0.6], [1560, 190, 0.9], [1300, 460, 0.7], [400, 230, 1], [660, 230, 1]];
const CommentBox: React.FC<{ f: number; t: string; who?: string }> = ({ f, t, who = 'you' }) => {
  const n = Math.min(t.length, Math.floor(f / 2));
  return (
    <g><rect width={W} height={H} fill="#F4F5F7" />
      <g transform="translate(960 520)"><rect x={-760} y={-200} width={1520} height={400} rx={30} fill="#fff" stroke={INK} strokeWidth={8} /><circle cx={-620} cy={-60} r={70} fill={who === 'you' ? '#2F6FD6' : '#8E5BD6'} stroke={INK} strokeWidth={6} /><Label x={-620} y={-60} t={who === 'you' ? 'U' : 'A'} size={60} color="#fff" />
        <Label x={-500} y={-60} t={t.slice(0, n) + (f % 16 < 8 ? '|' : '')} size={60} color={INK} anchor="start" />
        <line x1={-500} y1={30} x2={700} y2={30} stroke="#CBD5E0" strokeWidth={6} />
        <rect x={420} y={80} width={260} height={84} rx={42} fill="#2F6FD6" /><Label x={550} y={122} t="COMMENT" size={36} color="#fff" />
      </g>
    </g>
  );
};
const Studio: React.FC<{ f: number; dark?: boolean }> = ({ f, dark }) => (
  <g><rect width={W} height={H} fill={dark ? '#0B0620' : '#2B1B5E'} />
    {!dark && Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${200 + i * 300} 0 L${100 + i * 300 + Math.sin(f / 20 + i) * 120} 1080 L${380 + i * 300 + Math.sin(f / 20 + i) * 120} 1080 Z`} fill={BITS[i % 5]} opacity={0.12} />)}
    {!dark && <g transform="translate(960 190)"><rect x={-360} y={-110} width={720} height={220} rx={30} fill="#0B0620" stroke={GOLD} strokeWidth={10} />{Array.from({ length: 24 }, (_, i) => <circle key={i} cx={-340 + i * 29.5} cy={-100} r={7} fill={(i + Math.floor(f / 4)) % 2 ? GOLD : '#FF8AD8'} />)}<Label x={0} y={10} t="BRAIN QUIZ" size={100} color={GOLD} /></g>}
    <rect y={820} width={W} height={260} fill="#1A1240" />
  </g>
);
const Podium: React.FC<{ c?: string }> = ({ c = '#2F6FD6' }) => <g><path d="M-160 0 L-130 -260 L130 -260 L160 0 Z" fill={c} stroke={INK} strokeWidth={8} /><rect x={-150} y={-300} width={300} height={50} rx={10} fill="#1A1240" stroke={INK} strokeWidth={6} /><ellipse cx={0} cy={-310} rx={60} ry={22} fill="#E53935" stroke={INK} strokeWidth={6} /></g>;
const Audience: React.FC<{ f: number; signs?: boolean }> = ({ f, signs }) => <g>{Array.from({ length: 22 }, (_, i) => { const row = i % 2, x = 60 + (i >> 1) * 180 + row * 90, y = 1000 + row * 70 - Math.abs(Math.sin(f / 5 + i)) * (signs ? 40 : 8); return <g key={i}><circle cx={x} cy={y - 60} r={60} fill={['#3A2A1E', '#7A4A22', '#E2A15B', '#2D3748'][i % 4]} stroke={INK} strokeWidth={5} /><rect x={x - 70} y={y} width={140} height={120} rx={40} fill={BITS[i % 5]} stroke={INK} strokeWidth={5} />{signs && i % 3 === 0 && <g transform={`translate(${x} ${y - 200}) rotate(${Math.sin(f / 6 + i) * 8})`}><rect x={-80} y={-46} width={160} height={92} rx={8} fill="#fff" stroke={INK} strokeWidth={5} /><Label x={0} y={0} t="YOU!" size={44} color="#E53935" /></g>}</g>; })}</g>;
const QCard: React.FC<{ f: number; q: string; icon: React.ReactNode }> = ({ f, q, icon }) => (
  <g><Studio f={f} dark /><At x={960} y={520} s={lerp(f, 0, 6, 0.85, 1)}><rect x={-700} y={-300} width={1400} height={600} rx={40} fill="#2F3FA8" stroke={GOLD} strokeWidth={12} /><g transform="translate(-380 0)">{icon}</g><Label x={240} y={0} t={q} size={92} color="#fff" /></At><Meter p={0.9} /></g>
);
const Answer: React.FC<{ f: number; a: string; icon: React.ReactNode }> = ({ f, a, icon }) => (
  <g><Rays bg="#1F6F4A" ray="#26875A" t={f} /><At x={960} y={420} s={lerp(f, 0, 6, 1.3, 1)}>{icon}</At><At x={960} y={760}><Tag x={0} y={0} t={a} size={84} c="#9BE07A" /></At><Meter p={0.9} /></g>
);
const Phone: React.FC<{ f: number }> = ({ f }) => (
  <g><rect width={W} height={H} fill="#FFD9E6" /><At x={960} y={560} r={-4}><rect x={-300} y={-500} width={600} height={1000} rx={70} fill={INK} /><rect x={-270} y={-440} width={540} height={880} rx={30} fill="#F4F5F7" /><rect x={-270} y={-440} width={540} height={110} fill="#fff" /><Label x={0} y={-385} t="MUM" size={50} color={INK} />
    {['OMG!!!', 'THAT IS MY BABY!!!', 'CALL ME!!!!', 'WHY NO SCARF?!'].map((t, i) => f < i * 8 ? null : <g key={i} transform={`translate(${-250} ${-260 + i * 150})`}><rect x={0} y={-50} width={Math.min(500, t.length * 30 + 60)} height={100} rx={40} fill="#E2E8F0" stroke={INK} strokeWidth={4} /><Label x={Math.min(500, t.length * 30 + 60) / 2} y={0} t={t} size={38} color={INK} /></g>)}
  </At></g>
);
const Notes: React.FC<{ f: number }> = ({ f }) => <g>{Array.from({ length: 40 }, (_, i) => { const a = rnd(i) * Math.PI * 2 + f / 20, r = 120 + ((rnd(i, 2) * 700 + f * 8) % 700); return <g key={i} transform={`translate(${960 + Math.cos(a) * r} ${540 + Math.sin(a) * r * 0.6}) rotate(${(rnd(i, 3) - 0.5) * 50})`}><ellipse rx={26} ry={20} fill={BITS[i % 5]} stroke={INK} strokeWidth={5} /><line x1={24} y1={0} x2={24} y2={-80} stroke={INK} strokeWidth={7} /><path d="M24 -80 Q60 -60 50 -30" stroke={INK} strokeWidth={7} fill="none" /></g>; })}</g>;
const Screens: React.FC<{ f: number; you?: boolean }> = ({ f, you }) => <g>{Array.from({ length: 12 }, (_, i) => { const x = 180 + (i % 4) * 520, y = 200 + Math.floor(i / 4) * 330; const k = (i + Math.floor(f / (you ? 30 : 5))) % 6; return <g key={i} transform={`translate(${x - 20} ${y})`}><rect x={-230} y={-140} width={460} height={280} rx={18} fill={INK} stroke="#3A3F58" strokeWidth={8} /><rect x={-210} y={-120} width={420} height={240} rx={8} fill={you ? '#2B1B5E' : ['#9ED8F0', '#FFD9E6', '#C6F0C2', '#FFE9A8', '#E0D4FF', '#FFC9A8'][k]} />{you ? <g><g transform="translate(0 90) scale(0.35)"><Podium /></g><Label x={-150} y={-90} t="LIVE" size={30} color="#E53935" /></g> : <g transform="translate(0 20)">{k === 0 && <path d="M-60 40 L60 40 L50 -20 L-50 -20 Z" fill="#FF8AD8" stroke={INK} strokeWidth={5} />}{k === 1 && <g><circle cx={-50} cy={30} r={30} fill="none" stroke={INK} strokeWidth={7} /><circle cx={50} cy={30} r={30} fill="none" stroke={INK} strokeWidth={7} /><path d="M-50 30 L0 -20 L50 30" stroke={INK} strokeWidth={7} fill="none" /></g>}{k === 2 && <ellipse rx={70} ry={44} fill="#C99A68" stroke={INK} strokeWidth={6} />}{k === 3 && <rect x={-60} y={-40} width={120} height={80} fill="#fff" stroke={INK} strokeWidth={6} />}{k === 4 && <circle r={50} fill="#E53935" stroke={INK} strokeWidth={6} />}{k === 5 && <path d="M-60 40 L0 -50 L60 40 Z" fill="#3DBE7A" stroke={INK} strokeWidth={6} />}</g>}</g>; })}</g>;
const Flames: React.FC<{ f: number }> = ({ f }) => <g>{Array.from({ length: 16 }, (_, i) => { const h = 160 + Math.sin(f / 3 + i * 1.7) * 60 + rnd(i) * 120, x = i * 125; return <g key={i}><path d={`M${x - 70} 1080 Q${x - 60} ${1080 - h * 0.6} ${x} ${1080 - h} Q${x + 60} ${1080 - h * 0.6} ${x + 70} 1080 Z`} fill="#FF8A1F" opacity={0.9} /><path d={`M${x - 36} 1080 Q${x - 30} ${1080 - h * 0.4} ${x} ${1080 - h * 0.6} Q${x + 30} ${1080 - h * 0.4} ${x + 36} 1080 Z`} fill="#FFE45C" /></g>; })}</g>;
const Eeg: React.FC<{ f: number }> = ({ f }) => {
  const line = (y: number, big: boolean) => { let d = ''; for (let x = 0; x <= 1400; x += 10) { const v = big ? Math.sin((x + f * 12) / 40) * 110 : (Math.sin((x + f * 10) / 13) * 14 + Math.sin((x * 1.7 + f * 6) / 7) * 10); d += `${x ? 'L' : 'M'}${420 + x} ${y + v}`; } return d; };
  return <g><rect width={W} height={H} fill="#12304A" />{Array.from({ length: 20 }, (_, i) => <line key={i} x1={0} y1={i * 60} x2={W} y2={i * 60} stroke="#1B4466" strokeWidth={3} />)}
    <Label x={220} y={330} t="NORMAL" size={50} color="#9BE0D8" /><path d={line(330, false)} stroke="#9BE0D8" strokeWidth={8} fill="none" />
    <Label x={220} y={720} t="SEIZURE" size={50} color="#FFD45C" /><path d={line(720, true)} stroke="#FFD45C" strokeWidth={10} fill="none" />
  </g>;
};
const People: React.FC = () => <g>{['#F2C29B', '#8D5524', '#C68642', '#E0AC69', '#5C3A21'].map((sk, i) => <g key={i} transform={`translate(${-680 + i * 340} 0) scale(0.75)`}><Guy skin={sk} shirt={BITS[i]} hair={i % 2 ? '#1A1A1A' : '#7A4A22'} /></g>)}</g>;
const Cheque: React.FC = () => <g><rect x={-520} y={-240} width={1040} height={480} rx={20} fill="#E8F6E0" stroke={INK} strokeWidth={10} /><rect x={-480} y={-200} width={960} height={400} fill="none" stroke="#9BE07A" strokeWidth={6} strokeDasharray="20 12" /><Label x={0} y={-60} t="$1,000,000" size={130} color="#1F6F4A" /><line x1={-400} y1={120} x2={400} y2={120} stroke={INK} strokeWidth={5} /></g>;
const Pick: React.FC<{ f: number }> = ({ f }) => {
  const on = Math.floor(f / 18) % 5;
  const ic = (k: number) => k === 0 ? <g transform="scale(0.5)"><Eye /></g> : k === 1 ? <g><rect x={-60} y={-70} width={120} height={140} rx={8} fill="#2F6FD6" stroke={INK} strokeWidth={6} /><rect x={-40} y={-50} width={80} height={100} fill="#fff" /></g> : k === 2 ? <g><circle r={60} fill="#E53935" stroke={INK} strokeWidth={6} filter="url(#glow)" /><rect x={-14} y={-40} width={28} height={50} fill="#fff" /><circle cy={30} r={10} fill="#fff" /></g> : k === 3 ? <Say x={0} y={0} t="HI!" size={46} ty={80} tx={-30} /> : <g><rect x={-80} y={-40} width={160} height={80} rx={40} fill="#4A5568" stroke={INK} strokeWidth={6} /><circle cx={-40} r={16} fill="#E53935" /><circle cx={40} r={16} fill="#3DBE7A" /></g>;
  return <g><Night lit={0.4} op={0.6} /><Tag x={960} y={150} t="PICK ONE" />{['SEEING', 'MEMORY', 'FEAR', 'WORDS', 'CONTROL'].map((t, k) => <g key={t} transform={`translate(${240 + k * 360} 600) scale(${k === on ? 1.12 : 1})`}><rect x={-160} y={-220} width={320} height={440} rx={30} fill={k === on ? '#FFF7DC' : '#E2E8F0'} stroke={k === on ? GOLD : INK} strokeWidth={k === on ? 14 : 8} filter={k === on ? 'url(#glow)' : undefined} /><g transform="translate(0 -50)">{ic(k)}</g><Label x={0} y={140} t={t} size={44} color={INK} /></g>)}</g>;
};

const X = {
  wake: sc((f) => <St><Ceiling f={f} sharp={lerp(f, 6, 20, 0, 1)} /><Lids open={lerp(f, 0, 10, 0, 1)} /></St>, HOLDC),
  alarm: sc((f) => <St><AlarmClock f={f} /></St>, PUSH),
  fridge: sc((f) => <St><HouseCut f={f} /></St>, PUSH),
  heart: sc((f) => <St><Heartbeat f={f} /></St>, PUSH),
  blanket: sc((f) => <St><Blanket f={f} /></St>, PUSH),
  pill: sc((f) => <St><Bedside f={f} /></St>, PUSH),
  site: sc((f) => <St><SketchySite f={f} /></St>, { a: { z: 1 }, b: { z: 1.05 } }),
  meter: sc((f) => <St><MeterCard f={f} /></St>, HOLDC),
  flyIn: sc((f, d) => <St><FlyIn f={f} d={d} /><Meter p={0.1} /></St>, HOLDC),
  poster: (stage: 0 | 1) => sc((f) => <St><Poster f={f} stage={stage} /></St>, PUSH),
  whiteCity: sc((f) => <St><BrainCity lit={1} white={lerp(f, 0, 30, 0, 0.55)} labels={false} /><Meter p={1} /></St>, { a: { z: 1 }, b: { z: 1.03 } }),
  blackout: sc((f) => <St><BrainCity lit={1} black={f > 3} white={f <= 3 ? 0.8 : 0} labels={false} /></St>, HOLDC),
  neilTorch: sc((f) => <St><rect width={W} height={H} fill="#000" /><path d={`M${880} 760 L${300 + Math.sin(f / 10) * 200} 200 L${700 + Math.sin(f / 10) * 200} 160 Z`} fill="#FFF6C2" opacity={0.25} /><At x={960} y={980} s={1.6}><Neil mood="shock" /></At><circle cx={900} cy={770} r={18} fill="#FFF6C2" filter="url(#glow)" /></St>, HOLDC),
  title: sc((f) => <St><BrainCity lit={0.35} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.6} /><At x={960} y={470} s={lerp(f, 0, 6, 1.25, 1)}><BigNum text="100% BRAIN" size={210} color={GOLD} /></At><Label x={960} y={640} t="WHAT IF YOU USED" size={56} /><Meter p={1} /></St>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.4 }),
  // ---- 2 inside the city
  door: sc((f) => <St><rect width={W} height={H} fill="#1E2452" /><g transform="translate(960 640) scale(1.45)"><path d="M-300 380 Q-340 -60 -120 -300 Q60 -420 240 -280 Q380 -160 330 60 Q380 160 300 200 Q320 300 200 320 L120 380 Z" fill="#141414" stroke="#3A3F58" strokeWidth={10} /><g transform="translate(40 -170)"><rect x={-60} y={-80} width={120} height={160} rx={10} fill="#2B2160" stroke={INK} strokeWidth={6} /><path d={`M-60 -80 L${-60 + lerp(f, 6, 22, 120, 30)} ${-80 + lerp(f, 6, 22, 0, 12)} L${-60 + lerp(f, 6, 22, 120, 30)} ${80 - lerp(f, 6, 22, 0, 12)} L-60 80 Z`} fill="#8E5BD6" stroke={INK} strokeWidth={6} /><rect x={-56} y={-76} width={112} height={152} fill="#FFD45C" opacity={lerp(f, 6, 22, 0, 0.6)} filter="url(#glow)" /><Label x={0} y={-118} t="STAFF ONLY" size={30} color={GOLD} /></g></g></St>, PUSH),
  cityWide: (lit: number | ('see' | 'mem' | 'alarm' | 'word' | 'ctrl')[], labels = false) => sc((f) => <St><BrainCity lit={lit} labels={labels} /></St>, { a: { z: 1 }, b: { z: 1.03 } }),
  count86: sc((f) => <St><BrainCity lit={0.3} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.55} /><At x={960} y={470}><BigNum text={Math.round(lerp(f, 0, 30, 0, 86)) + ' BILLION'} size={170} color={GOLD} /></At><Label x={960} y={640} t="NEURONS" size={70} color="#E9C8FF" /></St>, HOLDC),
  chain: (bulb: boolean) => sc((f) => { const p = (f % 30) / 30; return <St><BrainCity lit={0.15} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.6} />{Array.from({ length: 5 }, (_, i) => <g key={i}><At x={240 + i * 330} y={820} s={0.9}><Worker /></At>{i < 4 && <path d={`M${300 + i * 330} 640 Q${405 + i * 330} 560 ${510 + i * 330} 640`} stroke="#B98CFF" strokeWidth={10} fill="none" strokeDasharray="30 10" />}</g>)}<circle cx={300 + (bulb ? Math.min(1, f / 40) : p) * 1320} cy={600} r={22} fill="#FFF2A8" filter="url(#glow)" />{bulb && f > 40 && <g><At x={1760} y={420} s={lerp(f, 40, 48, 0.4, 1)}><circle r={80} fill="#FFF8C4" stroke={INK} strokeWidth={8} filter="url(#glow)" /><rect x={-30} y={70} width={60} height={50} fill="#9AA3B5" stroke={INK} strokeWidth={6} /></At><Label x={1500} y={240} t="THOUGHT: TOAST?" size={44} color={GOLD} /></g>}</St>; }, HOLDC),
  trails: sc((f) => <St><BrainCity lit={0.4} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.35} />{Array.from({ length: 40 }, (_, i) => { const y = 120 + rnd(i) * 760; const x = ((rnd(i, 2) * W) + f * (30 + rnd(i, 3) * 40)) % (W + 300) - 150; return <line key={i} x1={x - 180} y1={y} x2={x} y2={y} stroke={['#FFF2A8', '#6FD3FF', '#FF8AD8'][i % 3]} strokeWidth={6} strokeLinecap="round" filter="url(#glow)" />; })}<Label x={960} y={160} t="BILLIONS / SECOND" size={64} color={GOLD} /></St>, HOLDC),
  neilIntro: sc((f) => <St><BrainCity lit={0.2} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.4} /><At x={860} y={1000} s={2.3}><Neil mood="happy" /></At><At x={1460} y={440} r={-4} s={lerp(f, 4, 10, 0.4, 1)}><rect x={-200} y={-90} width={400} height={180} rx={20} fill="#FFF7DC" stroke={INK} strokeWidth={8} /><Label x={0} y={-30} t="NEIL" size={80} color={INK} /><Label x={0} y={50} t="FOREMAN" size={40} color="#2F6FD6" /></At></St>, PUSH),
  neilBadge: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={620} y={980} s={2.2}><Neil mood="happy" /></At><At x={1340} y={520} r={4}><rect x={-260} y={-300} width={520} height={600} rx={24} fill="#FFF7DC" stroke={INK} strokeWidth={8} /><rect x={-200} y={-240} width={400} height={300} fill="#F6E3B4" stroke={INK} strokeWidth={6} /><circle cx={0} cy={-90} r={80} fill={INK} /><circle cx={-26} cy={-100} r={14} fill="#fff" /><circle cx={26} cy={-100} r={14} fill="#fff" /><Label x={0} y={140} t="ON DUTY SINCE" size={40} color={INK} /><Label x={0} y={210} t="BEFORE YOU" size={46} color="#E53935" /></At></St>, PUSH),
  neilTired: sc((f) => <St><BrainCity lit={0.15} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.5} /><At x={960} y={1060} s={3}><Neil coffee mood={(f % 60) < 30 ? 'tired' : 'sleep'} /></At></St>, HOLDC),
  dark: sc((f) => <St><BrainCity lit={0.03} labels={false} /></St>, { a: { z: 1 }, b: { z: 1.03 } }),
  turns: sc((f) => { const k = (['see', 'mem', 'alarm', 'word', 'ctrl'] as const)[Math.floor(f / 12) % 5]; return <St><BrainCity lit={[k]} labels={false} /></St>; }, HOLDC),
  district: (k: 'see' | 'mem' | 'alarm', t: string) => sc((f) => <St><BrainCity lit={[k]} labels={false} />{k === 'alarm' && <At x={1500 + Math.sin(f / 6) * 20} y={420} s={lerp(f, 4, 12, 0.3, 1.6)}><ellipse rx={60} ry={50} fill={INK} />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${i < 4 ? -40 : 40} ${-20 + (i % 4) * 14} q${i < 4 ? -60 : 60} ${-30} ${i < 4 ? -90 : 90} ${30}`} stroke={INK} strokeWidth={10} fill="none" />)}<circle cx={-16} cy={-10} r={8} fill="#FF5A6E" /><circle cx={16} cy={-10} r={8} fill="#FF5A6E" /></At>}<At x={960} y={170}><rect x={-260} y={-54} width={520} height={108} rx={54} fill="#0B0620" opacity={0.85} stroke={GOLD} strokeWidth={4} /><Label x={0} y={0} t={t} size={60} color={GOLD} /></At></St>, HOLDC),
  waking: sc((f) => <St><BrainCity lit={lerp(f, 0, 40, 0.05, 0.5)} labels={false} /></St>, { a: { z: 1 }, b: { z: 1.04 } }),
  coffeeDrop: sc((f) => <St><BrainCity lit={0.5} labels={false} /><At x={760} y={1060} s={2.4}><Neil mood="shock" /></At><At x={1120} y={600 + lerp(f, 0, 14, 0, 300)} r={lerp(f, 0, 14, 0, 140)} s={2}><rect x={-28} y={-32} width={56} height={64} rx={10} fill="#fff" stroke={INK} strokeWidth={5} /><rect x={-28} y={-8} width={56} height={14} fill="#E53935" /></At><Meter p={lerp(f, 6, 30, 0.1, 0.25)} /></St>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.3 }),
  // ---- 3 twenty-five percent
  meter25: sc((f) => <St><BrainCity lit={0.5} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.55} /><At x={960} y={500} s={lerp(f, 0, 8, 1.3, 1)}><BigNum text="25%" size={300} color={GOLD} /></At><Meter p={lerp(f, 4, 20, 0.1, 0.25)} /></St>, HOLDC),
  stairs: sc((f) => <St><Stairs f={f} /></St>, { a: { z: 1 }, b: { z: 1.06 } }),
  scan: sc((f) => <St><ScanKitchen f={f} /></St>, HOLDC),
  cereal: sc((f) => <St><CerealClose f={f} /></St>, PUSH),
  cracks: sc((f) => <St><CeilingCracks f={f} /></St>, HOLDC),
  toast: sc((f) => <St><ToasterClose f={f} /></St>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.2 }),
  real: sc((f) => <St><Rays bg="#1F2347" ray="#2B3166" t={f} /><At x={960} y={560} r={-3}><rect x={-300} y={-360} width={600} height={720} rx={24} fill="#FFF7DC" stroke={INK} strokeWidth={10} /><rect x={-100} y={-390} width={200} height={70} rx={14} fill="#9AA3B5" stroke={INK} strokeWidth={8} /><g transform="translate(0 -120) scale(0.9)"><Eye /></g>{[0, 1, 2, 3].map((k) => <rect key={k} x={-220} y={80 + k * 50} width={300 + (k % 2) * 140} height={18} rx={9} fill="#C9BFA8" />)}</At><At x={1060} y={640}><Stamp t="REAL" p={lerp(f, 8, 16, 0, 1)} size={150} color="#3DBE7A" /></At></St>, PUSH),
  hose: sc((f) => <St><Firehose f={f} /></St>, HOLDC),
  trickle: sc((f) => <St><Firehose f={f} trickle /></St>, HOLDC),
  dump: sc((f) => <St><Dumpster f={f} /></St>, PUSH),
  flood: sc((f) => <St><Dumpster f={f} closed /></St>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.3 }),
  calm: sc((f) => <St><KitchenPOV /><rect width={W} height={H} fill="#0B0620" opacity={lerp(f, 0, 40, 0, 0.25)} /><Meter p={0.25} /></St>, { a: { z: 1 }, b: { z: 1.04 } }),
  hole: sc((f) => <St><KitchenPOV /><Hole r={lerp(f, 0, 16, 0, 130)} /><Meter p={0.25} /></St>, HOLDC),
  eyeCut: sc((f) => <St><EyeSection f={f} /></St>, PUSH),
  paint: sc((f) => <St><PaintOver f={f} /></St>, HOLDC),
  seeHole: sc((f) => <St><KitchenPOV /><Hole r={130} ring={lerp(f, 0, 12, 0, 1)} /><Label x={1180} y={580} t="HOLE" size={64} color={GOLD} /><Meter p={0.25} /></St>, HOLDC),
  memFly: sc((f) => <St><MemFly f={f} /></St>, { a: { z: 1 }, b: { z: 1.04 } }),
  pins: sc((f) => <St><PinBoard f={f} /></St>, HOLDC),
  passwords: sc((f) => <St><Passwords f={f} /></St>, HOLDC),
  catStare: sc((f) => <St><CatStare f={f} /></St>, PUSH),
  catMeh: sc((f) => <St><CatStare f={f} meh /></St>, HOLDC),
  // ---- 4 fifty percent
  pct50: pctCard(0.25, 0.5),
  book: sc((f) => <St><WarmBg /><At x={960} y={420}><BookOpen f={f} /></At><Hands reach={0.3} /><Tag x={330} y={140} t={`PAGE ${Math.min(312, f * 6)}`} size={46} /><Meter p={0.5} /></St>, PUSH),
  race: sc((f) => <St><Race f={f} /><Meter p={0.5} /></St>, HOLDC),
  kim: sc((f) => <St><rect width={W} height={H} fill="#2B2150" />{Array.from({ length: 10 }, (_, i) => <rect key={i} x={120 + i * 170} y={860 - rnd(i) * 200} width={120} height={300} rx={8} fill={BITS[i % 5]} stroke={INK} strokeWidth={5} opacity={0.5} />)}<At x={960} y={500} r={-2}><rect x={-330} y={-400} width={660} height={800} rx={26} fill="#FFF7DC" stroke={INK} strokeWidth={10} /><g transform="translate(0 200)"><Silhouette /></g><Label x={0} y={300} t="KIM PEEK" size={90} color={INK} /></At><At x={1360} y={300}><Stamp t="REAL" p={lerp(f, 8, 16, 0, 1)} size={110} color="#3DBE7A" /></At></St>, PUSH),
  twoPages: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={960} y={620} s={1.2}><BookOpen f={f} flip={false} /></At>{[-1, 1].map((s) => <g key={s}><At x={960 + s * 150} y={200}><Eye s={0.5} /></At><line x1={960 + s * 150} y1={260} x2={960 + s * 520} y2={720} stroke={GOLD} strokeWidth={10} strokeDasharray="24 14" strokeDashoffset={-f * 3} filter="url(#glow)" /></g>)}<Tag x={960} y={960} t="2 AT ONCE" /></St>, HOLDC),
  stack: sc((f) => <St><BookStack f={f} /></St>, { a: { z: 1 }, b: { z: 1.04 } }),
  skills: sc((f) => <St><Skills f={f} t1={54} t2={81} /><Meter p={0.5} /></St>, HOLDC),
  piano: sc((f) => <St><Piano f={f} good={15} /><Meter p={0.5} /></St>, HOLDC),
  problem: sc((f) => <St><Night lit={0.5} op={0.5} /><rect width={W} height={H} fill="#E53935" opacity={(f % 20) < 10 ? 0.18 : 0} /><At x={960} y={1020} s={2.2}><Neil mood="shock" /></At><Tag x={960} y={160} t="ONE PROBLEM" c="#FF7A6E" /><Meter p={0.5} /></St>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.2 }),
  starving: sc((f) => <St><WarmBg /><At x={960} y={620} s={1.4}><Plate /></At>{[0, 1, 2].map((k) => <path key={k} d={`M${560 + k * 400} ${300 + Math.sin(f / 3 + k) * 20} q40 -40 80 0 t80 0 t80 0`} stroke="#E53935" strokeWidth={10} fill="none" strokeLinecap="round" />)}<Hands reach={0.2} /><Tag x={960} y={140} t="STARVING" c="#FF7A6E" /><Meter p={0.5} /></St>, PUSH),
  greedy: sc((f) => <St><Rays bg="#FFD9E6" ray="#FFC6DA" t={f} /><At x={960} y={560} s={1.6}><BrainIcon face /><path d="M-70 120 L70 120 L0 220 Z" fill="#fff" stroke={INK} strokeWidth={6} /><g transform={`rotate(${Math.sin(f / 4) * 14} -260 0)`}><line x1={-260} y1={-80} x2={-260} y2={120} stroke="#9AA3B5" strokeWidth={14} strokeLinecap="round" /></g><g transform={`rotate(${-Math.sin(f / 4) * 14} 260 0)`}><line x1={260} y1={-80} x2={260} y2={120} stroke="#9AA3B5" strokeWidth={14} strokeLinecap="round" /></g></At><At x={480 + ((f * 20) % 400)} y={300} s={0.6}><Sandwich /></At><Tag x={960} y={150} t="GREEDY" /></St>, PUSH),
  energy: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={360} y={900} s={1.1}><path d="M-110 0 L-80 -320 L80 -320 L110 0 Z" fill="#4A5568" stroke={INK} strokeWidth={8} /><circle cy={-430} r={110} fill="#4A5568" stroke={INK} strokeWidth={8} /><g transform="translate(0 -450) scale(0.36)"><BrainIcon /></g></At>{([['WEIGHT', 0.02, '#9AA3B5', 400, 0], ['ENERGY', 0.2, GOLD, 700, 54]] as const).map(([t, v, c, y, t0]) => <g key={t}><Label x={720} y={y - 90} t={t} size={52} color={c} anchor="start" /><rect x={720} y={y - 40} width={1000} height={90} rx={45} fill="#2B2150" stroke={INK} strokeWidth={6} /><rect x={720} y={y - 40} width={Math.max(50, 4000 * v * lerp(f, t0, t0 + 20, 0, 1))} height={90} rx={45} fill={c} filter={t === 'ENERGY' ? 'url(#glow)' : undefined} />{f > t0 + 8 && <Label x={760 + 4000 * v + 80} y={y + 5} t={`${Math.round(v * 100)}%`} size={70} color={c} />}</g>)}</St>, HOLDC),
  plug: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={1500} y={540}><Socket /></At><path d={`M1200 560 Q900 ${700 + Math.sin(f / 6) * 20} 760 560`} stroke={INK} strokeWidth={22} fill="none" /><rect x={1210} y={530} width={120} height={60} rx={10} fill="#4A5568" stroke={INK} strokeWidth={6} /><At x={560} y={540} s={1.2}><BrainIcon face /></At>{(f % 10) < 5 && <path d="M1360 420 L1320 480 L1360 480 L1320 540" stroke={GOLD} strokeWidth={10} fill="none" filter="url(#glow)" />}<Tag x={960} y={170} t="20 WATTS" /></St>, PUSH),
  bulb: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={600} y={560}><BrainIcon face /></At><Label x={960} y={540} t="=" size={200} color="#fff" /><At x={1340} y={600} s={1.4}><Bulb glow={0.35 + Math.sin(f / 5) * 0.05} /></At><Tag x={600} y={880} t="20 W" size={56} /><Tag x={1340} y={880} t="20 W" size={56} /></St>, HOLDC),
  sandwiches: sc((f) => { const n = Math.min(9, 1 + Math.floor(f / 6)); return <St><WarmBg /><At x={960} y={900} s={1.2}><Plate crumbs={false} /></At>{Array.from({ length: n }, (_, i) => <At key={i} x={960 + (rnd(i) - 0.5) * 60} y={880 - i * 70} s={1.1} r={(rnd(i, 2) - 0.5) * 12}><Sandwich /></At>)}<At x={1550} y={420}><BigNum text={String(n)} size={300} color={GOLD} /></At><Label x={1550} y={620} t="SANDWICHES" size={60} color="#fff" /><Meter p={0.5} /></St>; }, HOLDC),
  union: sc((f) => <St><Night lit={0.35} op={0.4} /><At x={300} y={960}><Workers signs={['NO!', 'BREAK?', 'TIRED']} /></At><At x={1440} y={1040} s={2}><Neil mood="tired" sign="UNION" /></At><Meter p={0.5} /></St>, { a: { z: 1 }, b: { z: 1.04 } }),
  // ---- 5 seventy-five percent
  pct75: pctCard(0.5, 0.75),
  patterns: sc((f) => <St><rect width={W} height={H} fill="#0B0620" />{Array.from({ length: 36 }, (_, i) => { const x = 120 + rnd(i) * 1680, y = 120 + rnd(i, 2) * 840, j = (i * 7 + 3) % 36, x2 = 120 + rnd(j) * 1680, y2 = 120 + rnd(j, 2) * 840; return <g key={i}><line x1={x} y1={y} x2={x + (x2 - x) * Math.min(1, Math.max(0, (f - i) / 12))} y2={y + (y2 - y) * Math.min(1, Math.max(0, (f - i) / 12))} stroke={GOLD} strokeWidth={4} opacity={0.7} /><circle cx={x} cy={y} r={12} fill="#FFF2A8" filter="url(#glow)" /></g>; })}<Tag x={960} y={540} t="PATTERNS" size={80} /><Meter p={0.75} /></St>, { a: { z: 1 }, b: { z: 1.05 } }),
  predict: sc((f) => <St><Cafe /><At x={1300} y={1100} s={1.1}><Guy shirt="#3DBE7A" mood="ok" /></At><Say x={560} y={300} t="NICE SHOES" p={lerp(f, 0, 6, 0, 1)} tx={-100} ty={600} fill="#FFF2A8" /><Say x={1300} y={240} t="NICE SHOES!" p={lerp(f, 40, 46, 0, 1)} tx={-40} ty={180} /><Meter p={0.75} /></St>, PUSH),
  waiter: sc((f) => <St><Cafe /><At x={1250} y={1150} s={1.1}><Guy hat="waiter" shirt="#2D3748" mood="ok" /></At><Say x={1250} y={180} t="CAN I GET YOU…" p={lerp(f, 0, 5, 0, 1)} tx={-40} ty={160} size={46} /><Say x={560} y={420} t="SOUP. YES." p={lerp(f, 12, 18, 0, 1)} tx={-100} ty={500} fill="#FFF2A8" /><Meter p={0.75} /></St>, HOLDC),
  waiter2: sc((f) => <St><Cafe /><At x={1250} y={1150} s={1.1}><Guy hat="waiter" shirt="#2D3748" mood="shock" /></At>{[0, 1, 2].map((k) => <circle key={k} cx={1380 + k * 20} cy={560 + ((f * 4 + k * 30) % 120)} r={12} fill="#6FD3FF" />)}<Say x={560} y={420} t="NO DESSERT." p={lerp(f, 0, 6, 0, 1)} tx={-100} ty={500} fill="#FFF2A8" /><Meter p={0.75} /></St>, PUSH),
  waiterGone: sc((f) => <St><Cafe />{Array.from({ length: 8 }, (_, i) => <line key={i} x1={1250 + i * 40} y1={400 + i * 70} x2={1920} y2={400 + i * 70} stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={Math.max(0, 1 - f / 20)} />)}<At x={1250} y={1000} r={f * 24}><ellipse rx={120} ry={30} fill="#CBD5E0" stroke={INK} strokeWidth={6} /></At><Tag x={960} y={160} t="HE LEFT" /><Meter p={0.75} /></St>, HOLDC),
  champ: sc((f) => <St><Park /><At x={720} y={1080}><Guy hat="crown" shirt="#8E5BD6" mood="smug" /></At><rect x={900} y={760} width={500} height={40} fill="#7A4A22" stroke={INK} strokeWidth={6} /><g transform="translate(900 680)">{Array.from({ length: 16 }, (_, i) => <rect key={i} x={(i % 8) * 62} y={Math.floor(i / 8) * 40} width={62} height={40} fill={(i + Math.floor(i / 8)) % 2 ? '#F6E3B4' : '#7A4A22'} />)}</g>{[0, 1, 2].map((k) => <g key={k} transform={`translate(${1560 + k * 110} ${820 - k * 10})`}><path d="M-40 -120 L40 -120 L30 -40 L-30 -40 Z" fill={GOLD} stroke={INK} strokeWidth={6} /><rect x={-10} y={-40} width={20} height={30} fill={GOLD} stroke={INK} strokeWidth={4} /><rect x={-40} y={-10} width={80} height={20} fill="#7A4A22" stroke={INK} strokeWidth={4} /></g>)}<Tag x={960} y={140} t="CHAMPION" /><Meter p={0.75} /></St>, PUSH),
  chess: sc((f) => <St><rect width={W} height={H} fill="#2B2150" /><g transform="translate(560 140)">{Array.from({ length: 64 }, (_, i) => <rect key={i} x={(i % 8) * 100} y={Math.floor(i / 8) * 100} width={100} height={100} fill={(i + Math.floor(i / 8)) % 2 ? '#7A4A22' : '#F6E3B4'} />)}<rect width={800} height={800} fill="none" stroke={INK} strokeWidth={10} />{[[1, 1], [3, 2], [6, 1], [5, 6], [2, 6]].map(([x, y], k) => <circle key={k} cx={x * 100 + 50} cy={y * 100 + 50} r={34} fill={k < 3 ? INK : '#fff'} stroke={INK} strokeWidth={5} />)}<g transform={`translate(450 150) rotate(${lerp(f, 20, 34, 0, 90)} 0 40)`}><rect x={-26} y={-60} width={52} height={100} rx={10} fill={INK} /><rect x={-6} y={-90} width={12} height={40} fill={INK} /><rect x={-20} y={-80} width={40} height={12} fill={INK} /></g></g><At x={1620} y={460}><BigNum text={String(Math.min(4, 1 + Math.floor(f / 10)))} size={260} color={GOLD} /></At><Label x={1620} y={640} t="MOVES" size={60} color="#fff" /><Meter p={0.75} /></St>, HOLDC),
  noLook: sc((f) => <St><Park /><At x={960} y={1080} s={1.1}><Guy hat="none" shirt="#8E5BD6" mood="sad" /></At><At x={960 + f * 6} y={520 + f * f * 0.4} r={f * 10}><path d="M-70 0 L-70 -70 L-35 -30 L0 -90 L35 -30 L70 -70 L70 0 Z" fill={GOLD} stroke={INK} strokeWidth={7} /></At><Tag x={960} y={140} t="WITHOUT LOOKING" /><Meter p={0.75} /></St>, HOLDC),
  pigeon: sc((f) => <St><Park /><rect x={500} y={760} width={900} height={40} rx={10} fill="#7A4A22" stroke={INK} strokeWidth={6} /><At x={960} y={lerp(f, 0, 14, 380, 760)} s={1.1}><Pigeon /></At><Meter p={0.75} /></St>, PUSH),
  pigeonHud: sc((f) => <St><Park /><rect width={W} height={H} fill="#0B0620" opacity={0.45} /><At x={700} y={900} s={1.8}><Pigeon /></At><path d={`M800 560 Q1200 ${100} 1760 400`} stroke={GOLD} strokeWidth={8} fill="none" strokeDasharray="30 18" strokeDashoffset={-f * 4} filter="url(#glow)" /><Tag x={1500} y={200} t="FLIGHT" size={48} />{f > 39 && <Tag x={1450} y={560} t="MOOD: SMUG" size={48} c="#FF8AD8" />}{f > 57 && <g><Tag x={1450} y={780} t="LUNCH" size={48} c="#9BE07A" /><At x={1720} y={780}><rect x={-60} y={-40} width={120} height={80} rx={30} fill="#F2C98A" stroke={INK} strokeWidth={6} /></At></g>}<Meter p={0.75} /></St>, HOLDC),
  noOff: sc((f) => <St><KitchenPOV />{Array.from({ length: 30 }, (_, i) => { const a = EYES_AT[i % EYES_AT.length], b = EYES_AT[(i * 5 + 2) % EYES_AT.length]; return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#FF5A4E" strokeWidth={4} opacity={0.6 + Math.sin(f / 3 + i) * 0.3} />; })}<Tag x={960} y={540} t="NO OFF SWITCH" c="#FF7A6E" /><Meter p={0.75} /></St>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.2 }),
  clouds: sc((f) => <St><rect width={W} height={H} fill="#7EC8F0" />{[[420, 340, 1.4], [1300, 260, 1.7], [900, 720, 1.2]].map(([x, y, s], i) => <At key={i} x={x + f * (1 + i)} y={y} s={s}><Cloud /></At>)}<Meter p={0.75} /></St>, { a: { z: 1 }, b: { z: 1.04 } }),
  toastFace: sc((f) => <St><WarmBg /><At x={960} y={560} s={1.4} r={-4}><Toast /></At><Meter p={0.75} /></St>, PUSH),
  socks: sc((f) => <St><rect width={W} height={H} fill="#B9C6E0" /><rect y={800} width={W} height={280} fill="#8E9BB8" /><At x={760} y={860} r={-6}><Sock c="#E53935" /></At><At x={1260} y={880} r={6}><Sock c="#2F6FD6" /></At><Meter p={0.75} /></St>, PUSH),
  pareidolia: sc((f) => <St><Rays bg="#1F2347" ray="#262B57" t={f} /><At x={960} y={560} s={1.2}><FaceTile k={0} /></At><Tag x={960} y={160} t="PAREIDOLIA" size={70} /><At x={1420} y={760}><Stamp t="REAL" p={lerp(f, 4, 12, 0, 1)} size={110} color="#3DBE7A" /></At></St>, PUSH),
  hungry: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={560} y={560} s={1.2}><BrainIcon face /></At><g transform={`translate(${1150 + Math.sin(f / 8) * 260} ${520 + Math.cos(f / 10) * 160})`}><circle r={130} fill="#9ED8F0" opacity={0.35} stroke={INK} strokeWidth={14} /><line x1={90} y1={90} x2={200} y2={200} stroke={INK} strokeWidth={28} strokeLinecap="round" /><Googly x={0} y={0} /></g><Tag x={960} y={150} t="HUNGRY" /></St>, HOLDC),
  faces: sc((f) => <St><rect width={W} height={H} fill="#2B2150" />{([0, 1, 2] as const).map((k) => <At key={k} x={400 + k * 560} y={560} s={lerp(f, k * 6, k * 6 + 6, 0.5, 1)} o={f >= k * 6 ? 1 : 0}><FaceTile k={k} /></At>)}<Tag x={960} y={150} t="FACES!" /></St>, HOLDC),
  everyone: sc((f) => <St><rect width={W} height={H} fill="#141A3A" />{Array.from({ length: 60 }, (_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i, 2) * 600} r={3} fill="#fff" />)}<At x={1400} y={300}><circle r={160} fill="#FFF8C4" filter="url(#glow)" /><circle cx={-50} cy={-30} r={22} fill="#D8CFA0" /><circle cx={50} cy={-30} r={22} fill="#D8CFA0" /><path d="M-50 50 Q0 80 50 50" stroke="#D8CFA0" strokeWidth={14} fill="none" /></At><At x={200} y={1200} s={0.5}>{Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${i * 340} 0)`}><Guy skin={['#F2C29B', '#8D5524', '#C68642', '#E0AC69', '#5C3A21', '#F2C29B'][i]} shirt={BITS[i % 5]} mood="shock" /></g>)}</At></St>, HOLDC),
  googly: sc((f) => <St><KitchenPOV />{EYES_AT.map(([x, y, s], i) => f >= i ? <Googly key={i} x={x} y={y} s={s} /> : null)}<Meter p={0.75} /></St>, PUSH),
  quickQ: sc((f) => <St><Night lit={0.4} op={0.4} /><At x={960} y={1040} s={2.2}><Neil mood="happy" sign="QUICK Q" /></At></St>, PUSH),
  countFaces: sc((f) => <St><KitchenPOV />{EYES_AT.map(([x, y, s], i) => <Googly key={i} x={x} y={y} s={s} />)}<rect width={W} height={H} fill="#0B0620" opacity={0.35} /><Tag x={960} y={540} t="? FACES" size={100} /></St>, HOLDC),
  comments: sc((f) => <St><CommentBox f={f} t="I counted 7 faces" /></St>, HOLDC),
  // ---- 6 the myth
  commenter: sc((f) => <St><rect width={W} height={H} fill="#141A3A" /><rect x={500} y={0} width={900} height={1080} fill="#6FD3FF" opacity={0.08} /><At x={960} y={1180} s={1.2}><Guy hat="glasses" shirt="#4A5568" mood="smug" /></At><rect x={560} y={820} width={800} height={60} rx={10} fill="#9AA3B5" stroke={INK} strokeWidth={6} /><path d="M660 820 L720 560 L1200 560 L1260 820 Z" fill="#CBD5E0" stroke={INK} strokeWidth={8} /><circle cx={960} cy={690} r={20} fill="#fff" /><Label x={960} y={160} t="TYPING…" size={60} color="#9AA3B5" /></St>, PUSH),
  typing: sc((f) => <St><CommentBox f={f} t="Actually, we use 100%..." who="them" /></St>, HOLDC),
  annoyed: sc((f) => <St><Night lit={0.4} op={0.4} /><At x={960} y={1040} s={2.4}><Neil mood="tired" coffee /></At><Tag x={960} y={150} t="UGH" size={80} /></St>, PUSH),
  right: sc((f) => <St><Rays bg="#1F6F4A" ray="#26875A" t={f} /><At x={960} y={480} s={lerp(f, 0, 6, 1.4, 1)}><circle r={200} fill="#3DBE7A" stroke={INK} strokeWidth={12} /><path d="M-90 0 L-20 80 L110 -80" stroke="#fff" strokeWidth={40} fill="none" strokeLinecap="round" strokeLinejoin="round" /></At><Tag x={960} y={820} t="THEY'RE RIGHT" c="#9BE07A" /></St>, HOLDC),
  myth: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={960} y={480}><BigNum text="10%" size={340} color="#9AA3B5" /></At><At x={980} y={560}><Stamp t="MYTH" p={lerp(f, 6, 14, 0, 1)} size={190} /></At></St>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.3 }),
  origin: sc((f) => <St><rect width={W} height={H} fill="#2B2150" /><At x={960} y={540}><BigNum text="?" size={500} color={GOLD} /></At>{[[340, 300], [1580, 300], [340, 800], [1580, 800]].map(([x, y], i) => <g key={i}><line x1={x} y1={y} x2={960 + (x - 960) * 0.4} y2={540 + (y - 540) * 0.4} stroke="#9AA3B5" strokeWidth={8} strokeDasharray="20 14" /><circle cx={x} cy={y} r={70} fill="#4A5568" stroke={INK} strokeWidth={6} /><Label x={x} y={y} t="?" size={70} color="#fff" /></g>)}<Tag x={960} y={960} t="WHO SAID IT?" size={56} /></St>, HOLDC),
  scan: sc((f) => { const lit = Math.min(1, f / 80); return <St><rect width={W} height={H} fill="#0B0620" /><At x={760} y={560} s={1.8}><path d="M-200 40 Q-240 -120 -80 -160 Q0 -220 80 -160 Q240 -120 200 40 Q200 140 80 140 Q0 180 -80 140 Q-200 140 -200 40 Z" fill="#1F2347" stroke="#6FD3FF" strokeWidth={6} />{Array.from({ length: 18 }, (_, i) => <circle key={i} cx={-160 + rnd(i) * 320} cy={-130 + rnd(i, 2) * 240} r={34} fill={BITS[i % 5]} opacity={i / 18 < lit ? 0.85 : 0.06} filter="url(#glow)" />)}</At><At x={1520} y={420}><circle r={120} fill="#fff" stroke={INK} strokeWidth={8} /><line x1={0} y1={0} x2={0} y2={-90} stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${f * 9})`} /></At><Tag x={1520} y={700} t={`${Math.round(lit * 100)}% USED`} size={56} /></St>; }, HOLDC),
  jobs: sc((f) => <St><BrainCity lit={1} labels={false} /><Tag x={960} y={150} t="5 DISTRICTS" /></St>, { a: { z: 1.06 }, b: { z: 1 } }),
  slice: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={960} y={540}><circle r={330} fill="#2B2150" stroke={INK} strokeWidth={12} /><path d={`M0 0 L0 -330 A330 330 0 0 1 ${330 * Math.sin(0.5)} ${-330 * Math.cos(0.5)} Z`} fill={GOLD} stroke={INK} strokeWidth={8} filter="url(#glow)" transform={`rotate(${f * 3})`} /></At><Tag x={960} y={960} t="SMALL SLICE" /></St>, HOLDC),
  notLazy: sc((f) => <St><Night lit={0.3} op={0.5} /><At x={960} y={1000} s={2}><Neil mood="sleep" /></At><Tag x={960} y={300} t="LAZY" size={110} c="#9AA3B5" /><path d="M700 160 L1220 440 M1220 160 L700 440" stroke="#E53935" strokeWidth={30} strokeLinecap="round" opacity={f > 6 ? 1 : 0} /></St>, HOLDC),
  design: sc((f) => <St><rect width={W} height={H} fill="#1B4F9A" />{Array.from({ length: 40 }, (_, i) => <line key={i} x1={i * 50} y1={0} x2={i * 50} y2={H} stroke="#2A63B8" strokeWidth={2} />)}{Array.from({ length: 22 }, (_, i) => <line key={'h' + i} x1={0} y1={i * 50} x2={W} y2={i * 50} stroke="#2A63B8" strokeWidth={2} />)}{[[300, 300, 200], [600, 200, 300], [960, 260, 240], [1300, 150, 350], [1600, 300, 200]].map(([x, h, w], i) => <rect key={i} x={x - w / 2} y={880 - h * 2} width={w} height={h * 2} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray={f < 30 ? `${f * 40} 4000` : undefined} />)}<line x1={0} y1={880} x2={W} y2={880} stroke="#fff" strokeWidth={6} /><Tag x={960} y={160} t="THE DESIGN" /></St>, PUSH),
  allOn: sc((f) => <St><BrainCity lit={1} labels={false} /><At x={960} y={480}><rect x={-320} y={-150} width={640} height={300} rx={20} fill="#1A1240" stroke={INK} strokeWidth={10} /><Label x={0} y={-80} t="NOW SERVING" size={44} color="#9AA3B5" /><Label x={0} y={30} t="ALL" size={140} color={(f % 10) < 5 ? '#FF5A4E' : GOLD} /></At><Meter p={0.75} /></St>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.2 }),
  stayOn: sc((f) => <St><BrainCity lit={1} labels={false} white={0.1 + Math.sin(f / 4) * 0.05} /><Meter p={lerp(f, 0, 40, 0.75, 0.85)} /></St>, { a: { z: 1 }, b: { z: 1.05 }, shake: 0.3 }),
  // ---- 7 ninety percent: the quiz
  pct90: pctCard(0.85, 0.9),
  onAir: sc((f) => <St><rect width={W} height={H} fill="#140F2E" /><At x={960} y={460}><rect x={-420} y={-140} width={840} height={280} rx={40} fill={(f % 30) < 22 ? '#E53935' : '#7A1E1E'} stroke={INK} strokeWidth={12} filter="url(#glow)" /><Label x={0} y={0} t="LIVE TV" size={140} color="#fff" /></At><Meter p={0.9} /></St>, PUSH),
  studio: sc((f) => <St><Studio f={f} /><At x={560} y={900}><Guy hat="host" shirt="#8E5BD6" /></At><At x={1360} y={880}><Podium /></At><Audience f={f} /><Meter p={0.9} /></St>, { a: { z: 1.05 }, b: { z: 1 } }),
  buzz: sc((f) => <St><Studio f={f} /><At x={960} y={760} s={0.9}><Guy hat="host" shirt="#8E5BD6" mood="shock" /></At><Say x={1260} y={260} t="THE CAPI—" size={50} tx={-200} ty={120} /><rect y={860} width={W} height={220} fill="#2F6FD6" stroke={INK} strokeWidth={10} /><ellipse cx={960} cy={880} rx={200} ry={60} fill="#E53935" stroke={INK} strokeWidth={8} /><g transform={`translate(0 ${(f % 16) < 4 ? 40 : 0})`}><Hands reach={0.9} /></g><Meter p={0.9} /></St>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.2 }),
  qMongolia: sc((f) => <St><QCard f={f} q="MONGOLIA?" icon={<g><circle r={150} fill="#6FD3FF" stroke={INK} strokeWidth={8} /><path d="M-90 -40 Q-20 -90 80 -50 Q120 0 60 40 Q-20 60 -90 20 Z" fill="#3DBE7A" stroke={INK} strokeWidth={6} /><circle cx={20} cy={-10} r={14} fill="#E53935" /></g>} /></St>, HOLDC),
  aMongolia: sc((f) => <St><Answer f={f} a="ULAANBAATAR" icon={<g>{[[-200, 160], [-80, 240], [40, 200], [160, 280], [280, 140]].map(([x, h], i) => <rect key={i} x={x - 50} y={140 - h} width={100} height={h} fill="#E2E8F0" stroke={INK} strokeWidth={6} />)}<circle cx={60} cy={-230} r={60} fill="#fff" stroke={INK} strokeWidth={8} /><path d="M30 -230 L55 -205 L95 -255" stroke="#3DBE7A" strokeWidth={14} fill="none" strokeLinecap="round" /></g>} /></St>, HOLDC),
  qGold: sc((f) => <St><QCard f={f} q="GOLD = ?" icon={<g><path d="M-160 60 L-110 -50 L110 -50 L160 60 Z" fill={GOLD} stroke={INK} strokeWidth={8} /><path d="M-110 -50 L-80 -90 L80 -90 L110 -50" fill="#FFF2A8" stroke={INK} strokeWidth={6} /></g>} /></St>, HOLDC),
  aGold: sc((f) => <St><Answer f={f} a="79" icon={<g><rect x={-170} y={-200} width={340} height={340} rx={20} fill={GOLD} stroke={INK} strokeWidth={10} /><Label x={-110} y={-140} t="79" size={60} color={INK} /><Label x={0} y={-20} t="Au" size={170} color={INK} /></g>} /></St>, HOLDC),
  qBreakfast: sc((f) => <St><QCard f={f} q="HIS BREAKFAST?" icon={<g transform="translate(0 280) scale(0.5)"><Guy hat="host" shirt="#8E5BD6" mood="smug" /></g>} /></St>, HOLDC),
  aEggs: sc((f) => <St><Answer f={f} a="EGGS" icon={<g><circle r={170} fill="#4A5568" stroke={INK} strokeWidth={10} /><rect x={150} y={-20} width={220} height={40} rx={20} fill="#2D3748" stroke={INK} strokeWidth={8} />{[-60, 60].map((x) => <g key={x}><path d={`M${x - 70} 0 Q${x - 60} -70 ${x} -60 Q${x + 70} -60 ${x + 60} 10 Q${x} 70 ${x - 70} 0 Z`} fill="#fff" /><circle cx={x} cy={-4} r={28} fill="#FFB020" stroke={INK} strokeWidth={4} /></g>)}</g>} /></St>, HOLDC),
  furious: sc((f) => <St><Studio f={f} /><At x={960 + Math.sin(f) * 4} y={1080} s={1.3}><Guy hat="host" shirt="#8E5BD6" mood="mad" /></At>{Array.from({ length: 6 }, (_, i) => <At key={i} x={500 + i * 180 + f * 6} y={500 - f * 4 + i * 40} r={f * (8 + i)}><rect x={-50} y={-34} width={100} height={68} rx={6} fill="#fff" stroke={INK} strokeWidth={5} /></At>)}<Meter p={0.9} /></St>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.4 }),
  audience: sc((f) => <St><Studio f={f} /><At x={0} y={-140}><Audience f={f} signs /></At><Tag x={960} y={360} t="YOUR NAME!" size={70} /><Meter p={0.9} /></St>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.2 }),
  mum: sc((f) => <St><Phone f={f} /></St>, PUSH),
  fire: sc((f) => <St><BrainCity lit={1} red labels={false} /><Flames f={f} /><Meter p={0.9} /></St>, { a: { z: 1 }, b: { z: 1.05 }, shake: 0.4 }),
  memAll: sc((f) => <St><rect width={W} height={H} fill="#1A1240" /><Screens f={f} /><Tag x={960} y={540} t="ALL AT ONCE" c="#FF7A6E" /><Meter p={0.9} /></St>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.3 }),
  songs: sc((f) => <St><rect width={W} height={H} fill="#2B1B5E" /><Notes f={f} /><At x={960} y={540} s={1.1}><path d="M-180 40 Q-180 -200 0 -200 Q180 -200 180 40" stroke={INK} strokeWidth={30} fill="none" /><rect x={-230} y={10} width={100} height={170} rx={40} fill="#E53935" stroke={INK} strokeWidth={8} /><rect x={130} y={10} width={100} height={170} rx={40} fill="#E53935" stroke={INK} strokeWidth={8} /></At><Tag x={960} y={150} t="EVERY SONG" /><Meter p={0.9} /></St>, HOLDC),
  neilRun: sc((f) => <St><Night lit={1} op={0.2} red />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={300 + i * 70} x2={600} y2={300 + i * 70} stroke="#fff" strokeWidth={8} opacity={0.4} strokeDasharray="80 60" strokeDashoffset={f * 30} />)}<At x={lerp(f, 0, 30, 300, 1500)} y={1000} s={1.8}><Neil mood="shock" run /></At><Meter p={0.9} /></St>, HOLDC),
  neilNever: sc((f) => <St><Night lit={1} op={0.3} red /><At x={960} y={1120} s={3}><Neil mood="shock" run /></At>{[0, 1, 2].map((k) => <circle key={k} cx={1260 + k * 30} cy={520 + ((f * 5 + k * 40) % 140)} r={16} fill="#6FD3FF" />)}<Tag x={960} y={150} t="FIRST RUN EVER" /><Meter p={0.9} /></St>, HOLDC),
  finalQ: sc((f) => <St><Studio f={f} dark /><path d="M860 0 L620 1080 L1300 1080 L1060 0 Z" fill="#FFF8C4" opacity={0.2} /><At x={960} y={980} s={1.1}><Podium /></At><Tag x={960} y={240} t="FINAL QUESTION" /><Meter p={0.9} /></St>, { a: { z: 1 }, b: { z: 1.06 } }),
  million: sc((f) => <St><Rays bg="#1F6F4A" ray="#26875A" t={f} />{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={rnd(i) * W} cy={((rnd(i, 2) * H + f * 14) % (H + 100)) - 50} r={26} fill={GOLD} stroke={INK} strokeWidth={5} />)}<At x={960} y={540} s={lerp(f, 0, 8, 1.4, 1)}><BigNum text="$1,000,000" size={220} color={GOLD} /></At><Meter p={lerp(f, 0, 50, 0.9, 0.98)} /></St>, { a: { z: 1 }, b: { z: 1.05 }, shake: 0.3 }),
  // ---- 8 one hundred percent
  noMovie: sc((f) => <St><rect width={W} height={H} fill="#140F2E" /><rect x={260} y={140} width={1400} height={700} fill="#E2E8F0" stroke={INK} strokeWidth={10} /><g transform="translate(384 200) scale(0.6)"><Poster f={f} stage={1} /></g><path d={`M260 140 L${260 + lerp(f, 6, 30, 0, 700)} 140 L${260 + lerp(f, 6, 30, 0, 700)} 840 L260 840 Z M1660 140 L${1660 - lerp(f, 6, 30, 0, 700)} 140 L${1660 - lerp(f, 6, 30, 0, 700)} 840 L1660 840 Z`} fill="#B71C1C" stroke={INK} strokeWidth={8} /><Tag x={960} y={70} t="NOT IN MOVIES" size={46} /></St>, HOLDC),
  flare: sc((f) => <St><BrainCity lit={1} labels={false} white={lerp(f, 0, 40, 0.1, 0.6)} /><Meter p={1} /></St>, { a: { z: 1 }, b: { z: 1.06 }, shake: 0.3 }),
  notGenius: sc((f) => <St><Poster f={f} stage={1} /><path d="M560 200 L1360 880 M1360 200 L560 880" stroke="#E53935" strokeWidth={40} strokeLinecap="round" opacity={f > 4 ? 1 : 0} /></St>, HOLDC),
  sync: sc((f) => { const on = (f % 24) < 12; return <St><rect width={W} height={H} fill="#12304A" />{Array.from({ length: 15 }, (_, i) => <At key={i} x={260 + (i % 5) * 350} y={360 + Math.floor(i / 5) * 280} s={0.8}><Worker />{on && <circle cy={-130} r={90} fill="#FFF2A8" opacity={0.35} filter="url(#glow)" />}</At>)}<Tag x={960} y={120} t="ALL TOGETHER" size={56} /></St>; }, HOLDC),
  eeg: sc((f) => <St><Eeg f={f} /></St>, HOLDC),
  noSense: sc((f) => <St><BrainCity lit={1} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.4} />{Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${rnd(i) * W} ${rnd(i, 2) * H} q${(rnd(i, 3) - 0.5) * 400} ${(rnd(i, 4) - 0.5) * 400} ${(rnd(i, 5) - 0.5) * 600} ${(rnd(i, 6) - 0.5) * 300}`} stroke={BITS[i % 5]} strokeWidth={8} fill="none" opacity={0.5 + 0.5 * Math.sin(f / 2 + i)} />)}<Tag x={960} y={540} t="NO SENSE" /></St>, HOLDC),
  noTurns: sc((f) => <St><BrainCity lit={1} labels={false} /><rect width={W} height={H} fill="#0B0620" opacity={0.3} /><At x={960} y={480}><rect x={-320} y={-150} width={640} height={300} rx={20} fill="#1A1240" stroke={INK} strokeWidth={10} /><Label x={0} y={-80} t="NOW SERVING" size={44} color="#9AA3B5" /><Label x={0} y={30} t="ALL" size={140} color="#FF5A4E" /></At></St>, HOLDC),
  realCond: sc((f) => <St><rect width={W} height={H} fill="#E8F1F8" /><At x={960} y={1000} s={0.95}><People /></At><At x={960} y={160}><Heart s={2.2} /></At></St>, { a: { z: 1 }, b: { z: 1.03 } }),
  doctors: sc((f) => <St><rect width={W} height={H} fill="#E8F1F8" /><At x={760} y={1060} s={1.1}><Guy hat="doc" shirt="#3DBE7A" skin="#8D5524" hair="#1A1A1A" /></At><At x={1340} y={420}><circle r={150} fill="#3DBE7A" stroke={INK} strokeWidth={10} /><rect x={-30} y={-90} width={60} height={180} fill="#fff" /><rect x={-90} y={-30} width={180} height={60} fill="#fff" /></At><Tag x={1340} y={720} t="DOCTORS HELP" c="#9BE07A" size={54} /></St>, PUSH),
  secret: sc((f) => <St><Night lit={lerp(f, 0, 40, 0.1, 0.35)} op={0.4} /><At x={960} y={500} r={Math.sin(f / 10) * 6}><circle cx={-120} r={110} fill="none" stroke={GOLD} strokeWidth={36} filter="url(#glow)" /><rect x={-20} y={-18} width={300} height={36} fill={GOLD} /><rect x={200} y={0} width={30} height={70} fill={GOLD} /><rect x={250} y={0} width={30} height={50} fill={GOLD} /></At><Tag x={960} y={820} t="THE BIG SECRET" /></St>, PUSH),
  works: sc((f) => { const k = (['see', 'mem', 'alarm', 'word', 'ctrl'] as const)[Math.floor(f / 20) % 5]; return <St><BrainCity lit={[k]} labels={false} /><At x={1700} y={200}><circle r={80} fill="#3DBE7A" stroke={INK} strokeWidth={8} /><path d="M-36 0 L-8 30 L40 -30" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" /></At><Tag x={960} y={150} t="TAKING TURNS" c="#9BE07A" /></St>; }, { a: { z: 1 }, b: { z: 1.04 } }),
  // ---- 9 waking up
  floor: sc((f) => <St><rect width={W} height={H} fill="#140F2E" />{Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={150 + i * 300} y={160} width={160} height={110} rx={20} fill="#4A5568" stroke={INK} strokeWidth={6} /><circle cx={230 + i * 300} cy={270} r={50} fill="#FFF8C4" opacity={0.3 + lerp(f, 6, 20, 0, 0.6)} filter="url(#glow)" /></g>)}<rect x={0} y={130} width={W} height={20} fill="#2D3748" /><Lids open={lerp(f, 0, 14, 0, 1)} /></St>, HOLDC),
  country: sc((f) => <St><rect width={W} height={H} fill="#1A1240" /><Screens f={f} you /><Tag x={960} y={540} t="WHOLE COUNTRY" size={64} /></St>, PUSH),
  wornOff: sc((f) => <St><Night lit={lerp(f, 0, 30, 1, 0.35)} op={0.5} /><At x={960} y={440} s={lerp(f, 0, 30, 1.6, 0.6)} o={lerp(f, 10, 30, 1, 0)}><rect x={-120} y={-50} width={240} height={100} rx={50} fill="#FF8AD8" stroke={INK} strokeWidth={8} /><rect x={0} y={-50} width={120} height={100} rx={0} fill="#fff" opacity={0.5} /></At><At x={960} y={540} o={lerp(f, 24, 34, 0, 1)}><BigNum text="NORMAL" size={200} color="#fff" /></At><Meter p={lerp(f, 0, 30, 1, 0.3)} /></St>, HOLDC),
  allAlong: sc((f) => <St><Rays bg="#1F6F4A" ray="#26875A" t={f} /><At x={960} y={420}><rect x={-600} y={-80} width={1200} height={160} rx={80} fill="#0B0620" stroke="#9BE07A" strokeWidth={10} /><rect x={-580} y={-60} width={1160 * lerp(f, 0, 24, 0.3, 1)} height={120} rx={60} fill="#3DBE7A" filter="url(#glow)" /><Label x={0} y={0} t={`${Math.round(lerp(f, 0, 24, 30, 100))}%`} size={100} color="#fff" /></At><Tag x={960} y={720} t="ALL ALONG" c="#9BE07A" size={80} /></St>, HOLDC),
  noMillion: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={960} y={520} r={-3}><Cheque /></At><At x={980} y={560}><Stamp t="NOPE" p={lerp(f, 6, 14, 0, 1)} size={190} /></At></St>, HOLDC),
  ciao: sc((f) => <St><WarmBg /><Say x={960} y={460} t="CIAO, BELLA!" size={110} ty={360} tx={-120} p={lerp(f, 0, 6, 0, 1)} /><g transform="translate(560 220)"><rect width={270} height={30} fill="#3DBE7A" /><rect x={270} width={270} height={30} fill="#fff" stroke="#ddd" /><rect x={540} width={270} height={30} fill="#E53935" /></g></St>, PUSH),
  mostly: sc((f) => <St><WarmBg /><Say x={960} y={460} t="SPAGHETTI…?" size={110} ty={360} tx={-120} /><circle cx={1440} cy={300 + ((f * 3) % 80)} r={20} fill="#6FD3FF" /><Tag x={960} y={150} t="MOSTLY" /></St>, HOLDC),
  catSleep: sc((f) => <St><g transform="translate(-300 -200) scale(1.3)"><KitchenPOV /></g><rect width={W} height={H} fill="#0B0620" opacity={0.25} /><At x={1050} y={1000} s={3.2}><Cat eye="shut" /></At><Label x={1400 + Math.sin(f / 10) * 10} y={300 - (f % 40)} t="z" size={80} color="#fff" /></St>, { a: { z: 1 }, b: { z: 1.04 } }),
  catPerfect: sc((f) => <St><g transform="translate(-300 -200) scale(1.3)"><KitchenPOV /></g><At x={1050} y={1000} s={3.2}><Cat eye="shut" /></At><At x={760} y={300} r={-12}><path d="M-70 0 L-70 -70 L-35 -30 L0 -90 L35 -30 L70 -70 L70 0 Z" fill={GOLD} stroke={INK} strokeWidth={7} /></At><Tag x={1400} y={180} t="PERFECT" c="#9BE07A" /></St>, HOLDC),
  // ---- 10 the truth
  truth: sc((f) => <St><BrainCity lit={0.5} labels={false} /><rect width={W} height={H} fill="#FFB45C" opacity={lerp(f, 0, 30, 0, 0.12)} /><Tag x={960} y={150} t="THE TRUTH" /></St>, { a: { z: 1 }, b: { z: 1.04 } }),
  ten: sc((f) => <St><rect width={W} height={H} fill="#1F2347" /><At x={960} y={480}><BigNum text="10%" size={340} color="#9AA3B5" /></At><path d="M600 300 L1320 700 M1320 300 L600 700" stroke="#E53935" strokeWidth={40} strokeLinecap="round" opacity={f > 4 ? 1 : 0} /></St>, HOLDC),
  city86: sc((f) => <St><BrainCity lit={0.7} labels={false} /><Tag x={960} y={150} t="86 BILLION" /></St>, { a: { z: 1.06 }, b: { z: 1 } }),
  pick: sc((f) => <St><Pick f={f} /></St>, HOLDC),
  comments2: sc((f) => <St><CommentBox f={f} t="MEMORY. Obviously." /></St>, HOLDC),
  dayOff: sc((f) => <St><Night lit={0.2} op={0.3} /><rect y={860} width={W} height={220} fill="#F2C98A" /><circle cx={1600} cy={200} r={90} fill="#FFE45C" filter="url(#glow)" /><path d="M700 900 L1300 900 L1220 760 L780 760 Z" fill="#E53935" stroke={INK} strokeWidth={8} /><At x={1000} y={900} s={2}><Neil mood="sleep" /></At></St>, PUSH),
  earned: sc((f) => <St><Night lit={0.2} op={0.3} /><rect y={860} width={W} height={220} fill="#F2C98A" /><At x={960} y={1020} s={2.2}><Neil mood="happy" sign="DAY OFF!" /></At></St>, HOLDC),
};

type El = (d: number) => React.ReactNode;
type Cue = [number, El, [number, string, number][]?];
const c = (sec: number, phrase: string, el: El, sfx?: [number, string, number][], nth = 1): Cue => [at(sec, phrase, nth), el, sfx];

export const S1_CUES: Cue[] = [
  [secStart(1), X.wake],
  c(1, 'And something', X.alarm, [[0, 'tick', 0.3]]),
  c(1, 'You can hear the fridge', X.fridge),
  c(1, 'You can hear your own', X.heart),
  c(1, 'You can count', X.blanket, [[4, 'counter', 0.25]]),
  c(1, 'Last night', X.pill),
  c(1, 'took a tiny pill', X.site, [[0, 'pop', 0.25]]),
  c(1, 'And now', X.meter, [[4, 'tick', 0.3]]),
  c(1, 'All of it', X.flyIn, [[0, 'whoosh', 0.35]]),
  c(1, 'Movies love', X.poster(0)),
  c(1, 'become a genius', X.poster(1), [[0, 'pop', 0.25]]),
  c(1, 'But at a hundred', X.whiteCity, [[0, 'wind', 0.25]]),
  c(1, 'no movie ever', X.blackout, [[3, 'lowhit', 0.5]]),
  c(1, "Don't worry", X.neilTorch),
  c(1, 'Probably', X.title, [[0, 'lowhit', 0.4]]),
];

export const S2_CUES: Cue[] = [
  [secStart(2), X.door, [[6, 'whoosh', 0.3]]],
  c(2, 'This is your brain', X.cityWide(['see', 'mem'])),
  c(2, 'A city of', X.count86, [[0, 'counter', 0.25]]),
  c(2, 'Every neuron is', X.chain(false)),
  c(2, "That's a thought", X.chain(true), [[40, 'pop', 0.3]]),
  c(2, 'Billions of times', X.trails, [[0, 'whoosh', 0.25]]),
  c(2, 'This is Neil', X.neilIntro, [[6, 'pop', 0.3]]),
  c(2, 'Neil has worked', X.neilBadge),
  c(2, 'Neil is tired', X.neilTired),
  c(2, "And here's the weird", X.dark),
  c(2, 'Only small groups', X.turns),
  c(2, 'A district for seeing', X.district('see', 'SEEING')),
  c(2, 'A district for remembering', X.district('mem', 'REMEMBERING')),
  c(2, 'A district for being', X.district('alarm', 'SPIDERS!'), [[4, 'boing', 0.25]]),
  c(2, 'But not today', X.waking, [[0, 'tick', 0.3]]),
  c(2, 'Today the whole', X.coffeeDrop, [[0, 'slap', 0.3]]),
];

export const S3_CUES: Cue[] = [
  [secStart(3), X.meter25, [[0, 'tick', 0.3]]],
  c(3, 'You walk downstairs', X.stairs),
  c(3, 'everything', X.scan, [[0, 'whoosh', 0.25]]),
  c(3, 'Every word on', X.cereal, [[0, 'counter', 0.2]]),
  c(3, 'Every crack', X.cracks),
  c(3, 'The exact moment', X.toast, [[60, 'pop', 0.3]]),
  c(3, 'And this part', X.real, [[8, 'slap', 0.25]]),
  c(3, 'Your eyes send', X.hose, [[0, 'whoosh', 0.3]]),
  c(3, 'But scientists', X.trickle),
  c(3, 'Your brain throws', X.dump),
  c(3, 'stopped throwing', X.flood, [[0, 'lowhit', 0.35]]),
  c(3, "And here's something", X.calm),
  c(3, "There's a hole", X.hole, [[0, 'lowhit', 0.3]]),
  c(3, 'Every eye has', X.eyeCut),
  c(3, 'Your brain simply', X.paint),
  c(3, 'you can see the hole', X.seeHole, [[0, 'tick', 0.25]]),
  c(3, 'You also remember', X.memFly, [[0, 'whoosh', 0.25]]),
  c(3, 'The TV remote', X.pins, [[0, 'pop', 0.25], [24, 'pop', 0.25]]),
  c(3, 'Every password', X.passwords, [[0, 'counter', 0.2]]),
  c(3, 'Your cat is staring', X.catStare),
  c(3, 'Your cat is not', X.catMeh, [[18, 'slap', 0.3]]),
];

export const S4_CUES: Cue[] = [
  [secStart(4), X.pct50, [[0, 'tick', 0.3]]],
  c(4, 'You open a book', X.book, [[0, 'letter', 0.25]]),
  c(4, 'It took forty', X.race, [[0, 'tick', 0.3]]),
  c(4, 'There was a real', X.kim, [[8, 'slap', 0.25]]),
  c(4, 'One with each', X.twoPages),
  c(4, 'He remembered', X.stack, [[0, 'counter', 0.2]]),
  c(4, 'By lunch', X.skills, [[0, 'pop', 0.25], [54, 'pop', 0.25], [81, 'pop', 0.25]]),
  c(4, 'Badly then', X.piano),
  c(4, "There's just one", X.problem, [[0, 'lowhit', 0.3]]),
  c(4, 'You are starving', X.starving, [[0, 'growl', 0.3]]),
  c(4, 'Because your brain', X.greedy),
  c(4, "It's only about", X.energy, [[54, 'whoosh', 0.25]]),
  c(4, 'Running on roughly', X.plug, [[0, 'crack', 0.2]]),
  c(4, 'About the same', X.bulb),
  c(4, 'At fifty percent', X.sandwiches, [[0, 'counter', 0.2]]),
  c(4, 'Neil has started', X.union, [[0, 'pop', 0.25]]),
];
export const S5_CUES: Cue[] = [
  [secStart(5), X.pct75, [[0, 'tick', 0.3]]],
  c(5, 'Now you start', X.patterns, [[0, 'whoosh', 0.25]]),
  c(5, 'You know what', X.predict),
  c(5, "You finish the waiter's", X.waiter),
  c(5, 'You finish his', X.waiter2),
  c(5, 'He leaves', X.waiterGone, [[0, 'whoosh', 0.3]]),
  c(5, 'In the park', X.champ),
  c(5, 'You beat him', X.chess, [[20, 'slap', 0.25]]),
  c(5, 'Without looking', X.noLook),
  c(5, 'A pigeon lands', X.pigeon),
  c(5, 'You calculate', X.pigeonHud, [[39, 'pop', 0.2], [57, 'pop', 0.2]]),
  c(5, 'But the patterns', X.noOff, [[0, 'lowhit', 0.25]]),
  c(5, 'You see faces', X.clouds),
  c(5, 'Faces in the toast', X.toastFace, [[0, 'pop', 0.25]]),
  c(5, 'Your socks', X.socks, [[0, 'boing', 0.25]]),
  c(5, "That's real too", X.pareidolia, [[4, 'slap', 0.25]]),
  c(5, 'Your brain is so', X.hungry),
  c(5, 'especially faces', X.faces, [[0, 'pop', 0.2], [6, 'pop', 0.2], [12, 'pop', 0.2]]),
  c(5, 'Everyone does it', X.everyone),
  c(5, 'Today you', X.googly, [[0, 'boing', 0.2]]),
  c(5, 'Actually quick', X.quickQ),
  c(5, 'How many faces', X.countFaces),
  c(5, 'Tell us in', X.comments, [[0, 'typing', 0.2]]),
];
export const S6_CUES: Cue[] = [
  [secStart(6), X.commenter, [[10, 'typing', 0.2]]],
  c(6, 'Actually we use', X.typing, [[0, 'typing', 0.25]]),
  c(6, 'And annoyingly', X.annoyed),
  c(6, "they're right", X.right, [[0, 'pop', 0.25]]),
  c(6, 'The ten percent', X.myth, [[6, 'slap', 0.3]]),
  c(6, 'Nobody knows', X.origin),
  c(6, 'but brain scans', X.scan),
  c(6, 'Every district does', X.jobs),
  c(6, 'The difference is', X.turns),
  c(6, 'At any moment', X.slice),
  c(6, "That's not laziness", X.notLazy, [[6, 'slap', 0.25]]),
  c(6, "That's the design", X.design),
  c(6, 'But today the', X.allOn, [[0, 'tick', 0.3]]),
  c(6, "They're all staying", X.stayOn, [[0, 'wind', 0.2]]),
];
export const S7_CUES: Cue[] = [
  [secStart(7), X.pct90, [[0, 'lowhit', 0.3]]],
  c(7, 'Someone books', X.onAir),
  c(7, 'The biggest quiz', X.studio, [[0, 'whoosh', 0.25]]),
  c(7, 'You answer every', X.buzz, [[0, 'slap', 0.3]]),
  c(7, 'Capital of Mongolia', X.qMongolia),
  c(7, 'Ulaanbaatar', X.aMongolia, [[0, 'pop', 0.25]]),
  c(7, 'The atomic number', X.qGold),
  c(7, 'Seventy-nine', X.aGold, [[0, 'pop', 0.25]]),
  c(7, 'What the host', X.qBreakfast),
  c(7, 'Eggs', X.aEggs, [[0, 'sizzle', 0.2]]),
  c(7, "He's furious", X.furious),
  c(7, 'The audience is', X.audience),
  c(7, 'Your mum is', X.mum, [[0, 'pop', 0.2], [8, 'pop', 0.2], [16, 'pop', 0.2], [24, 'pop', 0.2]]),
  c(7, 'But inside your', X.fire, [[0, 'lowhit', 0.35]]),
  c(7, 'Every memory is', X.memAll),
  c(7, 'Every song', X.songs),
  c(7, 'Neil is running', X.neilRun, [[0, 'whoosh', 0.3]]),
  c(7, 'Neil has never', X.neilNever),
  c(7, 'Final question', X.finalQ, [[0, 'lowhit', 0.3]]),
  c(7, 'For one million', X.million, [[0, 'counter', 0.2]]),
];
export const S8_CUES: Cue[] = [
  [secStart(8), X.whiteCity, [[0, 'wind', 0.25]]],
  c(8, 'And this is the part', X.noMovie),
  c(8, 'When every neuron', X.flare),
  c(8, "it isn't genius", X.notGenius),
  c(8, "It's a power cut", X.blackout, [[3, 'lowhit', 0.45]]),
  c(8, 'In real life', X.sync),
  c(8, "that's what a seizure", X.eeg),
  c(8, "The brain's signals", X.noSense),
  c(8, 'because nothing is', X.noTurns),
  c(8, 'Seizures are a real', X.realCond),
  c(8, 'and doctors can', X.doctors),
  c(8, 'But they show', X.secret),
  c(8, 'It works because', X.works),
];
export const S9_CUES: Cue[] = [
  [secStart(9), X.floor],
  c(9, 'The whole country', X.country),
  c(9, 'The pill has', X.wornOff),
  c(9, 'Which it turns', X.allAlong, [[0, 'pop', 0.25]]),
  c(9, 'You did not win', X.noMillion, [[6, 'slap', 0.3]]),
  c(9, 'But you can still', X.ciao),
  c(9, 'Mostly', X.mostly),
  c(9, 'At home', X.catSleep),
  c(9, 'The cat has been', X.catPerfect, [[0, 'pop', 0.2]]),
];
export const S10_CUES: Cue[] = [
  [secStart(10), X.truth],
  c(10, "Your brain isn't lazy", X.notLazy, [[6, 'slap', 0.25]]),
  c(10, "It isn't ten", X.ten),
  c(10, "It's an", X.city86),
  c(10, 'If you could switch', X.pick),
  c(10, 'Comments', X.comments2, [[0, 'typing', 0.2]]),
  c(10, 'And Neil take', X.dayOff),
  c(10, "You've earned", X.earned),
];

const SOFT = (n: string) => staticFile(`mem/sfx/${n}.mp3`);
export const S1_FRAMES = secEnd(1) + 75;
const SECTIONS: Record<number, Cue[]> = { 1: S1_CUES, 2: S2_CUES, 3: S3_CUES, 4: S4_CUES, 5: S5_CUES, 6: S6_CUES, 7: S7_CUES, 8: S8_CUES, 9: S9_CUES, 10: S10_CUES };
/** one section as a stand-alone test clip (starts at the section, ends 1.5 s after it) */
export const sectionClip = (n: number) => {
  const from = secStart(n) - (n === 1 ? secStart(1) : 15), to = secEnd(n) + 45;
  const Clip: React.FC = () => {
    const cues = [...SECTIONS[n]].sort((a, b) => a[0] - b[0]);
    return (
      <AbsoluteFill style={{ background: '#000' }}>
        <Sequence from={-from}>
          {cues.map(([t, el, sfx], i) => {
            const d = (cues[i + 1]?.[0] ?? to) - t;
            return (
              <Sequence key={i} from={t} durationInFrames={Math.max(1, d)}>
                {el(d)}
                {(sfx ?? []).map(([o, nm, v], j) => <Sequence key={j} from={o} durationInFrames={120}><Audio src={SOFT(nm)} volume={v * 0.9} /></Sequence>)}
              </Sequence>
            );
          })}
          <Captions words={CAPTION_WORDS} />
          <Sequence from={secStart(n)}><Audio src={staticFile(`brain/vo${String(n).padStart(2, '0')}.mp3`)} /></Sequence>
        </Sequence>
        <Audio src={staticFile('ep/music-fun.mp3')} volume={0.07} />
      </AbsoluteFill>
    );
  };
  return { Clip, frames: to - from };
};
export const S2 = sectionClip(2);
export const S3 = sectionClip(3);

/** section 1 test clip for approval */
export const BrainS1: React.FC = () => {
  const cues = [...S1_CUES].sort((a, b) => a[0] - b[0]);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {cues.map(([t, el, sfx], i) => {
        const d = (cues[i + 1]?.[0] ?? S1_FRAMES) - t;
        return (
          <Sequence key={i} from={t} durationInFrames={Math.max(1, d)}>
            {el(d)}
            {(sfx ?? []).map(([o, n, v], j) => <Sequence key={j} from={o} durationInFrames={120}><Audio src={SOFT(n)} volume={v * 0.9} /></Sequence>)}
          </Sequence>
        );
      })}
      <Captions words={CAPTION_WORDS} />
      <Sequence from={secStart(1)}><Audio src={staticFile('brain/vo01.mp3')} /></Sequence>
      <Audio src={staticFile('ep/music-tense.mp3')} volume={(f) => interpolate(f, [0, 20, S1_FRAMES - 30, S1_FRAMES], [0, 0.08, 0.08, 0], { extrapolateRight: 'clamp' })} />
    </AbsoluteFill>
  );
};

const ALL_CUES = Object.values(SECTIONS).flat();
const MUSIC: [string, number, number, number][] = [['ep/music-fun.mp3', 0, secStart(5), 0.09], ['ep/music-tense.mp3', secStart(5), secStart(8), 0.09], ['ep/music-tense.mp3', secStart(8), secStart(9), 0.05], ['ep/music-end.mp3', secStart(9), TOTAL_FRAMES, 0.1]];
/** the full episode */
export const BrainEpisode: React.FC = () => {
  const cues = [...ALL_CUES].sort((a, b) => a[0] - b[0]);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {cues.map(([t, el, sfx], i) => {
        const d = (cues[i + 1]?.[0] ?? TOTAL_FRAMES) - t;
        return (
          <Sequence key={i} from={t} durationInFrames={Math.max(1, d)}>
            {el(d)}
            {(sfx ?? []).map(([o, nm, v], j) => <Sequence key={j} from={o} durationInFrames={120}><Audio src={SOFT(nm)} volume={v * 0.9} /></Sequence>)}
          </Sequence>
        );
      })}
      <Captions words={CAPTION_WORDS} />
      {Array.from({ length: 10 }, (_, i) => <Sequence key={i} from={secStart(i + 1)}><Audio src={staticFile(`brain/vo${String(i + 1).padStart(2, '0')}.mp3`)} /></Sequence>)}
      {MUSIC.map(([src, a, b, v]) => (
        <Sequence key={src + a} from={a} durationInFrames={b - a}>
          <Audio src={staticFile(src)} loop volume={(f) => interpolate(f, [0, 20, b - a - 25, b - a], [0, v, v, 0], { extrapolateRight: 'clamp' })} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
export { TOTAL_FRAMES as BRAIN_FRAMES };
