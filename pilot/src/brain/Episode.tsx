// What If You Used 100% of Your Brain? Built section by section; each section is approved before the next.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { INK } from '../max/Max';
import { Stage, Captions, BigNum, Vignette, lerp, W, H } from '../mem/kit';
import { Label, Rays, Stamp } from '../mem/lib';
import { GOLD, At, sc, PUSH, HOLDC, rnd, Heart } from '../mind/Episode';
import { Defs, BrainCity, Neil, Cat, Hands, Meter, KitchenPOV } from './look';
import { at, secStart, secEnd, CAPTION_WORDS } from './timing';

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

const SOFT = (n: string) => staticFile(`mem/sfx/${n}.mp3`);
export const S1_FRAMES = secEnd(1) + 75;
const SECTIONS: Record<number, Cue[]> = { 1: S1_CUES, 2: S2_CUES };
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
