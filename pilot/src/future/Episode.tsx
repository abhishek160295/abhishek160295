// What If You Could See 1 Hour Into the Future? Full episode, every shot cued to a narration phrase.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Max, Dog, STAND, PANIC, POINT, HOLD, FACEPALM, HERO, walkPose, runPose, MUM, DAVE, INK, Look } from '../max/Max';
import { Stage, Captions, Burst, Confetti, BigNum, Vignette, Gauge, lerp, remap, W, H } from '../mem/kit';
import { ATHLETE, Label, Rays, Bedroom, MicStand, Stamp, Bus } from '../mem/lib';
import { F, GOLD, At, M, Head, sc, PUSH, HOLDC, LOW, dark, rnd, Bub, Duck, Heart, Ball, Toast, DayKitchen, Stadium, Brain } from '../mind/Episode';
import { at, secStart, TOTAL_FRAMES, CAPTION_WORDS } from './timing';

const GUARD: Look = { jacket: '#2F4FB0', jacketDark: '#1F3680', pants: '#1E2240', shoes: '#141414', sole: '#666', skin: INK };
const ORANGE = '#FF8A1F';
const SIT = { ...STAND, hipL: -70, knL: 70, hipR: -70, knR: 70 };
const WHIP = { a: { z: 1.06, x: -20 }, b: { z: 1.1, x: 25 } };

// ---------- vision look: blue tint, scanlines, white flash in, time stamp ----------
const VisFX: React.FC<{ f: number; t?: string }> = ({ f, t = '10:00 AM' }) => (
  <g>
    <rect width={W} height={H} fill="#2F6FD6" opacity={0.2} />
    {Array.from({ length: 90 }, (_, i) => <rect key={i} y={i * 12 + (f % 12)} width={W} height={2} fill="#fff" opacity={0.05} />)}
    <Vignette strength={0.6} />
    <g opacity={0.85}><rect x={40} y={34} width={260} height={64} rx={10} fill="#0B0C18" opacity={0.6} /><circle cx={74} cy={66} r={12} fill="#E53935" opacity={(f % 20) < 10 ? 1 : 0.3} /><Label x={190} y={66} t={t} size={36} color="#BFE6F7" /></g>
    <rect width={W} height={H} fill="#fff" opacity={lerp(f, 0, 6, 0.95, 0)} />
  </g>
);
const vis = (render: (f: number) => React.ReactNode, t?: string, cam = PUSH) => sc((f) => <Stage>{render(f)}<VisFX f={f} t={t} /></Stage>, cam);

// ---------- sets ----------
const Sky: React.FC<{ t?: number; city?: boolean; dusk?: boolean; night?: boolean }> = ({ t = 0, city = true, dusk, night }) => (
  <g>
    <rect width={W} height={H} fill={night ? '#14152A' : dusk ? '#E8836B' : '#7EC8F0'} />
    <rect y={H * 0.55} width={W} height={H * 0.45} fill={night ? '#1F2347' : dusk ? '#F2A97A' : '#A9DDF5'} />
    {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={((i * 610 + t * (2 + i)) % 2400) - 240} cy={140 + i * 90} rx={170} ry={44} fill="#fff" opacity={night ? 0.1 : 0.75} />)}
    {city && Array.from({ length: 34 }, (_, i) => { const h = 50 + rnd(i) * 150; const x = i * 58; return <g key={i}><rect x={x} y={1080 - h} width={52} height={h} fill={night ? '#0B0C18' : '#5E7187'} />{Array.from({ length: Math.floor(h / 30) }, (_, k) => <rect key={k} x={x + 10 + (k % 2) * 20} y={1080 - h + 10 + Math.floor(k / 2) * 30} width={10} height={12} fill={night ? GOLD : '#BFE6F7'} opacity={0.6} />)}</g>; })}
  </g>
);
const Festival: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <rect width={W} height={H} fill="#7EC8F0" /><rect y={760} width={W} height={320} fill="#6BB36F" />
    <path d={Array.from({ length: 21 }, (_, i) => `${i ? 'L' : 'M'}${i * 96} ${160 + (i % 2) * 40}`).join(' ')} stroke={INK} strokeWidth={4} fill="none" />
    {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${i * 96} ${160 + (i % 2) * 40} l48 ${i % 2 ? -20 : 20} l-20 60 Z`} fill={['#E53935', GOLD, '#2F6FD6', '#3DBE7A'][i % 4]} />)}
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${120 + i * 470} 480)`}><rect width={300} height={280} fill="#FFF7DC" stroke={INK} strokeWidth={6} />{Array.from({ length: 6 }, (_, k) => <rect key={k} x={k * 50} y={-60} width={50} height={70} fill={k % 2 ? '#fff' : ['#E53935', '#2F6FD6', '#3DBE7A', '#F07FA8'][i]} stroke={INK} strokeWidth={4} />)}</g>)}
    {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(i * 33) % W} cy={840 + (i % 3) * 70 + Math.sin(t / 6 + i) * 5} r={26} fill={['#2B2F4A', '#5A3A22', '#3A3F58', '#7A3A1A'][i % 4]} />)}
  </g>
);
const Market: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <rect width={W} height={H} fill="#F2C14E" /><rect y={760} width={W} height={320} fill="#C9A27A" />
    {[0, 1, 2, 3, 4].map((i) => { const x = ((i * 520 - t * 18) % 2600 + 2600) % 2600 - 400; return <g key={i} transform={`translate(${x} 420)`}><rect width={380} height={340} fill="#FFF7DC" stroke={INK} strokeWidth={6} />{Array.from({ length: 6 }, (_, k) => <rect key={k} x={k * 64} y={-70} width={64} height={80} fill={k % 2 ? '#fff' : ['#E53935', '#3DBE7A', '#2F6FD6'][i % 3]} stroke={INK} strokeWidth={4} />)}{Array.from({ length: 10 }, (_, k) => <circle key={'f' + k} cx={40 + (k % 5) * 70} cy={260 + Math.floor(k / 5) * 40} r={22} fill={[ORANGE, '#E53935', '#3DBE7A'][k % 3]} stroke={INK} strokeWidth={3} />)}</g>; })}
  </g>
);
const Roofs: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <rect width={W} height={H} fill="#E8A87C" /><circle cx={1600} cy={200} r={90} fill="#FFE29A" />
    {Array.from({ length: 8 }, (_, i) => { const x = ((i * 300 - t * 10) % 2400 + 2400) % 2400 - 300; const y = 640 + (i % 3) * 50; return <g key={i}><path d={`M${x} ${y} L${x + 140} ${y - 120} L${x + 280} ${y} Z`} fill="#A8473A" stroke={INK} strokeWidth={6} /><rect x={x} y={y} width={280} height={500} fill={['#E8D8B8', '#D8C8A8', '#C9B795'][i % 3]} stroke={INK} strokeWidth={6} /><rect x={x + 190} y={y - 150} width={40} height={90} fill="#7A4A32" stroke={INK} strokeWidth={5} /></g>; })}
  </g>
);
const Home: React.FC = () => (
  <g><rect width={W} height={H} fill="#F6E3B4" /><rect y={800} width={W} height={280} fill="#C9A27A" /><rect x={760} y={140} width={420} height={660} fill="#8E5BD6" stroke={INK} strokeWidth={10} /><circle cx={1120} cy={480} r={14} fill={GOLD} /><rect x={1300} y={200} width={400} height={300} fill="#BFE6F7" stroke={INK} strokeWidth={10} /></g>
);

const CityBelow: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g><rect width={W} height={H} fill="#6BB36F" />
    {Array.from({ length: 7 }, (_, r) => Array.from({ length: 11 }, (_, c) => <rect key={r + '-' + c} x={c * 190 + 30 - (t % 190)} y={r * 170 + 30} width={150} height={130} rx={8} fill={['#C9B795', '#E8836B', '#8E9BD6', '#F2C14E', '#E8D8B8'][(r * 3 + c) % 5]} stroke={INK} strokeWidth={4} />))}
    {Array.from({ length: 7 }, (_, r) => <rect key={'r' + r} y={r * 170 + 160} width={W} height={40} fill="#5E5A66" />)}
    <rect width={W} height={H} fill="#BFE6F7" opacity={0.25} /></g>
);
// ---------- props ----------
const DuckBalloon: React.FC<{ flame?: number; inside?: React.ReactNode; tilt?: number }> = ({ flame = 1, inside, tilt = 0 }) => {
  const f = F();
  return (
    <g transform={`rotate(${tilt + Math.sin(f / 18) * 2} 0 -500)`}>
      <ellipse cx={0} cy={-720} rx={360} ry={310} fill="#FFD21F" stroke={INK} strokeWidth={12} />
      <path d="M260 -760 Q420 -820 380 -650" fill="#FFC107" stroke={INK} strokeWidth={10} />
      <circle cx={-250} cy={-980} r={160} fill="#FFD21F" stroke={INK} strokeWidth={12} />
      <path d="M-380 -990 L-500 -960 L-380 -930 Z" fill={ORANGE} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <circle cx={-290} cy={-1020} r={22} fill={INK} /><circle cx={-298} cy={-1028} r={7} fill="#fff" />
      {[-120, 120].map((x) => <line key={x} x1={x} y1={-430} x2={x * 0.9} y2={-180} stroke={INK} strokeWidth={6} />)}
      <path d={`M-30 -300 Q0 ${-300 - 90 * flame} 30 -300 Z`} fill={ORANGE} opacity={0.4 + 0.6 * flame} />
      <rect x={-40} y={-300} width={80} height={30} rx={6} fill="#3A3D48" />
      {inside}
      <rect x={-140} y={-180} width={280} height={180} rx={14} fill="#A8743A" stroke={INK} strokeWidth={10} />
      {[0, 1, 2].map((i) => <line key={i} x1={-140} y1={-130 + i * 50} x2={140} y2={-130 + i * 50} stroke="#7A4A22" strokeWidth={6} />)}
    </g>
  );
};
const Firework: React.FC<{ x: number; y: number; p: number; c: string; r?: number }> = ({ x, y, p, c, r = 260 }) => p <= 0 ? null : (
  <g transform={`translate(${x} ${y})`} opacity={Math.max(0, 1 - p * p)}>
    {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * r * p * 0.4} y1={Math.sin(a) * r * p * 0.4} x2={Math.cos(a) * r * p} y2={Math.sin(a) * r * p + p * p * 60} stroke={c} strokeWidth={10} strokeLinecap="round" />; })}
    <circle r={30 * (1 - p)} fill="#fff" />
  </g>
);
const Fireworks: React.FC<{ f: number; speed?: number }> = ({ f, speed = 1 }) => (
  <g>{Array.from({ length: 9 }, (_, i) => { const per = 40; const t = (f * speed + i * 13) % per; return <Firework key={i} x={160 + (i * 233) % 1600} y={160 + (i * 97) % 600} p={t / per} c={['#FF5A4E', GOLD, '#7FB8FF', '#F07FA8', '#3DE07A'][i % 5]} r={180 + (i % 3) * 80} />; })}</g>
);
const Pigeon: React.FC<{ flap?: number }> = ({ flap = 0 }) => (
  <g><ellipse rx={70} ry={44} fill="#9AA3B5" stroke={INK} strokeWidth={6} /><path d={`M-10 -10 Q-60 ${-80 + flap * 60} -110 ${-40 + flap * 40}`} fill="#7B8794" stroke={INK} strokeWidth={6} /><circle cx={60} cy={-40} r={30} fill="#9AA3B5" stroke={INK} strokeWidth={6} /><path d="M86 -42 L112 -34 L86 -28 Z" fill={ORANGE} /><circle cx={66} cy={-48} r={6} fill={INK} /><path d="M40 -20 Q60 -6 72 -20" stroke="#7FB685" strokeWidth={8} fill="none" /></g>
);
const Van: React.FC = () => (
  <g><rect x={-300} y={-260} width={460} height={260} rx={20} fill="#fff" stroke={INK} strokeWidth={10} /><rect x={160} y={-180} width={150} height={180} rx={16} fill="#E53935" stroke={INK} strokeWidth={10} /><circle cx={-180} cy={10} r={50} fill={INK} /><circle cx={200} cy={10} r={50} fill={INK} /><rect x={-260} y={-340} width={380} height={80} rx={40} fill="#C46A3A" stroke={INK} strokeWidth={8} /><Label x={-70} y={-130} t="SAUSAGES" size={48} color="#E53935" /></g>
);
const Sausage: React.FC<{ r?: number }> = ({ r = 0 }) => <g transform={`rotate(${r})`}><rect x={-60} y={-18} width={120} height={36} rx={18} fill="#C46A3A" stroke={INK} strokeWidth={5} /></g>;
const Cake: React.FC<{ boom?: number }> = ({ boom = 0 }) => (
  <g>{[0, 1, 2].map((i) => <rect key={i} x={-160 + i * 40 + (i - 1) * boom * 200} y={-i * 110 - boom * (60 + i * 80)} width={320 - i * 80} height={110} rx={14} fill="#FFF7DC" stroke={INK} strokeWidth={6} transform={`rotate(${boom * (i - 1) * 30})`} />)}</g>
);
const Skate: React.FC = () => <g><rect x={-120} y={-14} width={240} height={28} rx={14} fill="#E53935" stroke={INK} strokeWidth={6} /><circle cx={-80} cy={26} r={18} fill={INK} /><circle cx={80} cy={26} r={18} fill={INK} /></g>;
const Phone: React.FC<{ t?: string }> = ({ t }) => <g><rect x={-90} y={-170} width={180} height={340} rx={30} fill="#22252E" stroke={INK} strokeWidth={8} /><rect x={-74} y={-150} width={148} height={300} rx={16} fill="#3A3F58" />{t && <Label x={0} y={0} t={t} size={34} color={GOLD} />}</g>;
const Arrow: React.FC<{ dir: number; c?: string }> = ({ dir, c = '#fff' }) => <g transform={`scale(${dir} 1)`}><path d="M-120 0 L80 0 M40 -40 L90 0 L40 40" stroke={c} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
const Pin: React.FC = () => <g><line x1={0} y1={0} x2={0} y2={-220} stroke="#C7CDD8" strokeWidth={10} strokeLinecap="round" /><circle cy={-230} r={28} fill="#E53935" stroke={INK} strokeWidth={6} /></g>;
const Bars: React.FC<{ k: number }> = ({ k }) => (
  <g><rect x={160} y={360} width={30} height={90} fill={GOLD} /><Label x={175} y={500} t="YOU" size={50} />
    <rect x={300} y={600} width={Math.max(30, k * 1700)} height={90} fill="#FF5A4E" /><Label x={330} y={760} t="MAX" size={50} anchor="start" /></g>
);
const PlanCard = (t: string, bg: string) => sc((f) => <Stage bg={bg}><Rays bg={bg} ray="rgba(255,255,255,0.08)" t={f} />{Head(560, 640, 2, { expr: 'determined', look: [0.6, 0] })}<At x={1340} y={520} s={lerp(f, 0, 6, 1.4, 1)} r={-6}><rect x={-300} y={-140} width={600} height={280} rx={24} fill="#FFF7DC" stroke={INK} strokeWidth={10} /><Label x={0} y={0} t={t} size={130} color={INK} /></At></Stage>, HOLDC);
const ClockBig = (t: string, red = false) => sc((f) => <Stage bg={red ? '#5A0F14' : '#14152A'}><Rays bg={red ? '#5A0F14' : '#14152A'} ray={red ? '#6E141B' : '#1C1E3A'} t={f} /><At x={960} y={520} s={lerp(f, 0, 6, 1.25, 1)}><rect x={-480} y={-160} width={960} height={320} rx={40} fill="#0B0C18" stroke={red ? '#FF5A4E' : GOLD} strokeWidth={10} /><text textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={900} fontSize={210} fill={red ? '#FF5A4E' : GOLD}>{t}</text></At></Stage>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.4 });
const flash = (render: (f: number) => React.ReactNode) => sc((f) => <Stage>{render(f)}<rect width={W} height={H} fill="#fff" opacity={lerp(f, 0, 8, 1, 0)} /></Stage>, HOLDC);
const Threads: React.FC<{ f: number }> = ({ f }) => (
  <g>{Array.from({ length: 7 }, (_, i) => { const x = 120 + i * 240, y = 900 - (i % 2) * 120; return <g key={i}><path d={`M${x} ${y} Q${(x + 1500) / 2} ${y - 500} 1500 260`} stroke={GOLD} strokeWidth={5} fill="none" strokeDasharray="1400" strokeDashoffset={1400 - lerp(f, i * 4, i * 4 + 24, 0, 1400)} opacity={0.8} /><circle cx={x} cy={y} r={40} fill={['#FF8A1F', '#FFF7DC', '#E53935', '#3DBE7A', '#9AA3B5', '#F07FA8', '#7FB8FF'][i]} stroke={INK} strokeWidth={5} /></g>; })}<At x={1500} y={420} s={0.25}><DuckBalloon /></At></g>
);

// ================= scenes =================
const BASKET = (p: { max?: React.ComponentProps<typeof Max>['expr']; dog?: boolean; dave?: React.ComponentProps<typeof Max>['expr'] } = {}) => (
  <g>{p.dave && Head(70, -210, 0.62, { outfit: DAVE, expr: p.dave, look: [0, -0.6] })}{p.max && Head(-60, -220, 0.66, { expr: p.max })}{p.dog && <At x={60} y={-150} s={0.7}><Dog expr="happy" /></At>}</g>
);
const X = {
  // ---- 1 cold open
  breakfast: sc((f) => <Stage><DayKitchen />{M(960, 1060, 1.3, { expr: 'happy', pose: SIT })}<At x={1240} y={690}><Toast /></At><At x={1560} y={1060} s={1.2}><Dog expr="happy" wag={Math.sin(f / 3)} /></At></Stage>, PUSH),
  blink: flash(() => <><DayKitchen />{Head(960, 640, 2.6, { expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'flat' } })}</>),
  visWide: vis((f) => <><Sky t={f} /><At x={960 + Math.sin(f / 20) * 30} y={760} s={0.55}><DuckBalloon inside={BASKET({ max: 'panic', dog: true })} /></At></>),
  visScream: vis((f) => <><Sky t={f} city={false} /><At x={960} y={1040} s={1.3}><DuckBalloon inside={BASKET({ max: 'panic', dog: true })} /></At></>),
  visSwing: vis((f) => <><Sky t={f} city={false} /><At x={960} y={1040} s={1.3}><DuckBalloon tilt={Math.sin(f / 5) * 12} inside={BASKET({ max: 'panic', dog: true })} /></At></>, undefined, { a: { z: 1 }, b: { z: 1.04 }, tilt: 4 }),
  visDown: vis((f) => <CityBelow t={f * 2} />),
  visDog: vis((f) => <><Sky t={f} city={false} /><At x={960} y={1100} s={2.6}><Dog expr="happy" wag={Math.sin(f / 3)} /></At><At x={960 - 170 * 2.6 + 40} y={1100 - 100 * 2.6} r={Math.sin(f / 4) * 10}><Sausage /></At></>),
  visFireworks: vis((f) => <><Sky t={f} night /><Fireworks f={f} /><At x={960} y={1260} s={1.2}><DuckBalloon inside={BASKET({ max: 'panic', dog: true })} /></At></>),
  visTurn: vis((f) => <><Sky t={f} night /><Fireworks f={f} speed={0.5} />{Head(960, 600, 2.4, { expr: 'shocked', look: [lerp(f, 0, 30, 1, 0), 0] })}</>),
  visClose: vis((f) => <><Sky t={f} night />{Head(960, 600, 3, { expr: 'panic', look: [0, 0] })}</>, undefined, { a: { z: 1 }, b: { z: 1.08 } }),
  dontGo: (vision: boolean) => sc((f) => <Stage>{vision ? <Sky night /> : <Sky t={f} night />}{!vision && <Fireworks f={f} speed={0.4} />}{Head(960, 680, 2.8, { expr: 'panic', still: true })}<At x={960} y={140} s={lerp(f, 0, 5, 1.3, 1)}><BigNum text="DON'T GO!" size={170} color={GOLD} /></At>{vision && <VisFX f={f + 10} />}</Stage>, HOLDC),
  spoonDrop: sc((f) => <Stage><DayKitchen />{M(960, 1060, 1.4, { expr: 'shocked', pose: { ...SIT, shR: 60 - lerp(f, 0, 10, 0, 50), elR: 40 } })}<At x={1080} y={620 + lerp(f, 0, 14, 0, 100)} r={lerp(f, 0, 14, 0, 160)}><rect x={-8} y={-60} width={16} height={100} rx={8} fill="#C7CDD8" stroke={INK} strokeWidth={4} /></At></Stage>, PUSH),
  sixty: ClockBig('60:00', true),
  mic: (bubble?: string) => sc((f) => <Stage bg="#2A2340"><Rays bg="#2A2340" ray="#332A4E" t={f} /><At x={960} y={640} s={1.3}><MicStand /></At>{bubble && <Bub x={1380} y={300} w={560} h={260} tx={-400} ty={60}><Label x={0} y={0} t={bubble} size={66} color={INK} /></Bub>}<Label x={960} y={150} t="NARRATOR" size={56} color="#9AA3B5" /></Stage>, PUSH),
  title: sc((f) => <Stage bg="#0B0C18"><Rays bg="#0B0C18" ray="#16182E" t={f} /><At x={960} y={360} s={0.38}><DuckBalloon /></At><At x={960} y={690} s={lerp(f, 0, 6, 1.3, 1)}><BigNum text="1 HOUR AHEAD" size={160} color={GOLD} /></At><Label x={960} y={810} t="WHAT IF YOU COULD SEE" size={50} /></Stage>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.5 }),
  // ---- 2 testing
  clock: (t: string, red = false) => ClockBig(t, red),
  tests: sc((f) => <Stage>{dark(f, '#2F6FD6', '#3A7BE0')}{Head(960, 620, 2.6, { expr: { eyes: 'squeeze', lid: 0, lidAngle: 0, mouth: 'flat' } })}</Stage>, HOLDC),
  busLate: sc((f) => <Stage bg="#9ED8F0"><At x={1300} y={820} s={1.1}><Bus /></At><At x={560} y={520}><rect x={-240} y={-260} width={480} height={520} rx={16} fill="#FFF7DC" stroke={INK} strokeWidth={8} />{[0, 1, 2, 3].map((i) => <line key={i} x1={-180} y1={-160 + i * 80} x2={180} y2={-160 + i * 80} stroke="#C7CDD8" strokeWidth={14} strokeLinecap="round" />)}<Stamp t="LATE" p={lerp(f, 6, 12, 0, 1)} size={110} /></At></Stage>, PUSH),
  mumHomework: sc((f) => <Stage><DayKitchen />{M(700, 1060, 1.3, { outfit: MUM, expr: 'smug', pose: POINT, look: [0.8, 0] })}<Bub x={1240} y={360} w={520} h={300} tx={-460} ty={200}><rect x={-110} y={-80} width={220} height={160} rx={10} fill="#D9473B" stroke={INK} strokeWidth={6} /><line x1={0} y1={-80} x2={0} y2={80} stroke={INK} strokeWidth={5} /></Bub></Stage>, PUSH),
  pigeonFuture: sc((f) => <Stage bg="#7EC8F0"><Sky t={f} /><At x={960 + Math.cos(f / 10) * 380} y={360 + Math.sin(f / 10) * 120} s={1.3}><Pigeon flap={Math.abs(Math.sin(f / 2))} /></At><At x={260} y={140}><rect x={-140} y={-50} width={280} height={100} rx={14} fill="#0B0C18" /><Label x={0} y={0} t="10:01" size={60} color="#FF5A4E" /></At></Stage>, PUSH),
  lookUp: sc((f) => <Stage bg="#7EC8F0">{Head(960, 660, 2.6, { expr: 'wince', look: [0, -0.9] })}</Stage>, HOLDC),
  idea: sc((f) => <Stage bg="#FFD21F"><Rays bg="#FFD21F" ray="#FFDC4A" t={f} />{Head(960, 680, 2.4, { expr: 'smug', look: [0.3, -0.5] })}<At x={1340} y={220} s={lerp(f, 0, 6, 0.4, 1)}><circle r={90} fill="#FFF8C4" stroke={INK} strokeWidth={8} /><rect x={-36} y={80} width={72} height={60} fill="#9AA3B5" stroke={INK} strokeWidth={6} /></At></Stage>, PUSH),
  lottery: sc((f) => <Stage bg="#7A4FD6"><Rays bg="#7A4FD6" ray="#8660DD" t={f} />{[7, 14, 23, 31, 42, 49].map((n, i) => <At key={n} x={260 + i * 280} y={540 + Math.abs(Math.sin(f / 5 + i)) * -120}><circle r={100} fill={['#E53935', GOLD, '#2F6FD6', '#3DBE7A', '#F07FA8', '#fff'][i]} stroke={INK} strokeWidth={8} /><Label x={0} y={0} t={String(n)} size={70} color={INK} /></At>)}</Stage>, PUSH),
  timeline: (bracket: boolean) => sc((f) => <Stage>{dark(f)}<line x1={140} y1={560} x2={1780} y2={560} stroke="#fff" strokeWidth={8} />{['9 AM', '12', '3 PM', '6', '8 PM'].map((t, i) => <g key={t}><line x1={200 + [0, 400, 800, 1200, 1500][i]} y1={530} x2={200 + [0, 400, 800, 1200, 1500][i]} y2={590} stroke="#fff" strokeWidth={6} /><Label x={200 + [0, 400, 800, 1200, 1500][i]} y={650} t={t} size={44} /></g>)}<At x={1700} y={440}><circle r={70} fill={GOLD} stroke={INK} strokeWidth={8} /><Label x={0} y={0} t="?" size={70} color={INK} /></At>{bracket && <g><rect x={200} y={470} width={lerp(f, 0, 12, 0, 135)} height={180} fill={GOLD} opacity={0.35} stroke={GOLD} strokeWidth={6} /><Label x={270} y={420} t="1 HOUR" size={50} color={GOLD} /></g>}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  deadpan: (bg: string) => sc(() => <Stage bg={bg}>{Head(960, 640, 2.6, { expr: { eyes: 'open', lid: 0.55, lidAngle: 0, mouth: 'flat' }, still: true })}</Stage>, HOLDC),
  ignore: sc((f) => <Stage bg="#2A2340"><At x={1200} y={640} s={1.2}><MicStand /></At>{M(300 + f * 9, 1060, 1.2, { expr: 'smug', pose: walkPose(f / 6), look: [1, 0] })}</Stage>, PUSH),
  // ---- 3 brain predicts
  pointCam: sc((f) => <Stage bg="#2F6FD6"><Rays bg="#2F6FD6" ray="#3A7BE0" t={f} />{M(960, 1060, 1.5, { expr: 'smug', pose: { ...POINT, shR: 70 }, look: [0, 0] })}</Stage>, PUSH),
  viewer: sc((f) => <Stage bg="#14152A"><At x={960} y={800}><path d="M-360 320 Q-360 0 0 0 Q360 0 360 320 Z" fill="#2B2F4A" /><circle cx={0} cy={-200} r={230} fill="#2B2F4A" /></At><At x={1480} y={300}><circle r={110} fill="#0B0C18" stroke={GOLD} strokeWidth={8} /><line x1={0} y1={0} x2={0} y2={-80} stroke={GOLD} strokeWidth={8} transform={`rotate(${f * 6})`} /></At></Stage>, PUSH),
  tiny: sc((f) => <Stage>{dark(f)}<line x1={160} y1={540} x2={1760} y2={540} stroke="#fff" strokeWidth={6} /><circle cx={960} cy={540} r={18} fill="#fff" /><rect x={960} y={500} width={12} height={80} fill={GOLD} /><Label x={960} y={420} t="NOW" size={50} /><Label x={1060} y={640} t="0.1 s" size={50} color={GOLD} /></Stage>, HOLDC),
  eyeBrain: sc((f) => { const k = lerp(f, 0, 40, 0, 1); return <Stage>{dark(f)}<At x={420} y={540}><ellipse rx={150} ry={100} fill="#fff" stroke={INK} strokeWidth={8} /><circle r={50} fill="#2F6FD6" /><circle r={22} fill={INK} /></At><At x={1460} y={540} s={1.2}><Brain seed={4} lit={k} /></At><path d="M570 540 C 800 400, 1000 700, 1220 540" stroke={GOLD} strokeWidth={10} fill="none" strokeDasharray="20 16" /><circle cx={570 + 650 * k} cy={540 + Math.sin(k * Math.PI) * -60} r={24} fill={GOLD} /></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  ghostBall: sc((f) => { const x = 300 + ((f * 18) % 1300); return <Stage>{dark(f)}<At x={x - 220} y={540} o={0.35}><Ball /></At><At x={x} y={540}><Ball /></At><Label x={x - 110} y={440} t="0.1 s LATE" size={46} color={GOLD} /></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  predictLine: sc((f) => { const x = 300 + Math.min(f, 50) * 22; return <Stage>{dark(f)}<path d={`M${x} 540 Q ${x + 400} 380 ${x + 800} 620`} stroke={GOLD} strokeWidth={8} fill="none" strokeDasharray="22 16" /><At x={x} y={540}><Ball /></At><At x={480} y={360} s={0.9}><Brain seed={6} /></At></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  tennis: sc((f) => <Stage bg="#2E8B57"><rect y={700} width={W} height={380} fill="#3DBE7A" /><line x1={0} y1={700} x2={W} y2={700} stroke="#fff" strokeWidth={8} />{M(1300, 1060, 1.4, { outfit: ATHLETE, expr: 'determined', pose: { ...STAND, shR: lerp(f, 0, 14, -60, 120), elR: 10 }, look: [-1, 0] })}<At x={1180 - lerp(f, 0, 14, 0, 0)} y={560}><g transform={`rotate(${lerp(f, 0, 14, -60, 60)})`}><ellipse cx={0} cy={-120} rx={50} ry={70} fill="none" stroke="#fff" strokeWidth={10} /><line x1={0} y1={-50} x2={0} y2={40} stroke={INK} strokeWidth={14} /></g></At><At x={300 + Math.min(f, 14) * 60} y={520}><circle r={24} fill="#E6F05A" stroke={INK} strokeWidth={4} /></At><At x={360} y={200}><rect x={-140} y={-60} width={280} height={120} rx={20} fill="#0B0C18" /><Label x={0} y={0} t="0.4 s" size={70} color={GOLD} /></At></Stage>, PUSH),
  react: (ok: boolean) => sc((f) => <Stage bg={ok ? '#2E8B57' : '#5A0F14'}><Rays bg={ok ? '#2E8B57' : '#5A0F14'} ray="rgba(255,255,255,0.07)" t={f} /><At x={960} y={540} s={lerp(f, 0, 6, 1.3, 1)}><BigNum text={ok ? 'PREDICTING' : 'REACTING'} size={170} color={ok ? '#3DE07A' : '#FF5A4E'} /></At>{!ok && <g stroke="#FF5A4E" strokeWidth={26} strokeLinecap="round"><line x1={320} y1={420} x2={1600} y2={660} /></g>}</Stage>, HOLDC),
  bars: (k: number) => sc((f) => <Stage>{dark(f)}<Bars k={k ? lerp(f, 0, 30, 0.02, 1) : 0.02} />{k > 0 && <At x={1300} y={300} s={lerp(f, 20, 30, 0.6, 1)} o={f > 20 ? 1 : 0}><BigNum text="36,000×" size={180} color={GOLD} /></At>}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  blinkAgain: flash(() => <><rect width={W} height={H} fill="#2F6FD6" />{Head(960, 640, 2.6, { expr: 'shocked' })}</>),
  predictLand: sc((f) => <Stage>{dark(f)}<path d="M300 540 Q 700 380 1100 620" stroke={GOLD} strokeWidth={8} fill="none" strokeDasharray="22 16" /><At x={lerp(f, 0, 24, 300, 1100)} y={lerp(f, 0, 24, 540, 620) - Math.sin(lerp(f, 0, 24, 0, Math.PI)) * 110}><Ball /></At>{f > 24 && <At x={1100} y={420} s={lerp(f, 24, 30, 0, 1)}><circle r={60} fill="#3DE07A" stroke={INK} strokeWidth={6} /><path d="M-26 0 L-6 20 L28 -22" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" /></At>}<Label x={1500} y={300} t="THE GUESS" size={60} color={GOLD} /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  real: (t: string) => sc((f) => <Stage bg="#1F2347"><Rays bg="#1F2347" ray="#262B57" t={f} /><At x={960} y={540}><Stamp t={t} p={lerp(f, 2, 8, 0, 1)} size={t.length > 6 ? 110 : 180} color={t === 'NOT THE FUTURE' ? '#FF5A4E' : '#3DE07A'} /></At></Stage>, HOLDC),
  printout: sc((f) => <Stage bg="#E8D8B8"><rect x={560} y={160} width={800} height={520} rx={20} fill="#3A3D48" stroke={INK} strokeWidth={10} /><rect x={600} y={200} width={720} height={400} fill="#0B0C18" /><rect x={700} y={600} width={520} height={lerp(f, 0, 40, 0, 420)} fill="#fff" stroke={INK} strokeWidth={5} />{Array.from({ length: 8 }, (_, i) => <line key={i} x1={740} y1={640 + i * 50} x2={740 + 300 + (i % 3) * 60} y2={640 + i * 50} stroke="#9AA3B5" strokeWidth={10} opacity={lerp(f, 0, 40, 0, 420) > i * 50 + 40 ? 1 : 0} />)}<Label x={960} y={400} t="FORECAST" size={70} color="#3DE07A" /></Stage>, PUSH),
  study: sc((f) => <Stage bg="#DDF2FA">{M(700, 1060, 1.3, { outfit: ATHLETE, expr: { eyes: 'open', lid: 0, lidAngle: 0, mouth: 'wobble', sweat: true }, pose: SIT })}<rect x={980} y={600} width={300} height={200} rx={16} fill="#3A3D48" stroke={INK} strokeWidth={8} /><path d="M1100 640 L1060 720 L1110 710 L1080 780" stroke={GOLD} strokeWidth={14} fill="none" strokeLinejoin="round" /><line x1={980} y1={700} x2={760} y2={760} stroke={INK} strokeWidth={6} /><Label x={1400} y={300} t="STUDY" size={80} color="#2F6FD6" /></Stage>, PUSH),
  // ---- 4 plan A
  visFestival: vis((f) => <Festival t={f} />),
  visPoster: vis((f) => <><Festival t={f} /><At x={960} y={500} r={-3}><rect x={-360} y={-260} width={720} height={520} fill="#FFF7DC" stroke={INK} strokeWidth={10} /><Label x={0} y={-120} t="FIREWORKS" size={100} color="#E53935" /><Label x={0} y={40} t="10 AM SHARP" size={80} color={INK} /></At></>),
  visDuckRise: vis((f) => <><Festival t={f} /><At x={960} y={1200 - lerp(f, 0, 60, 0, 220)} s={0.8}><DuckBalloon /></At></>),
  visDuckFace: vis((f) => <><Sky t={f} city={false} /><At x={1260} y={2100} s={1.6}><DuckBalloon /></At></>, undefined, { a: { z: 1 }, b: { z: 1.06 } }),
  planA: PlanCard('PLAN A', '#2F6FD6'),
  locks: sc((f) => <Stage><Home />{[0, 1, 2].map((i) => <At key={i} x={1060} y={300 + i * 120} o={f > i * 8 ? 1 : 0}><rect x={-60} y={-20} width={120} height={40} rx={10} fill="#C7CDD8" stroke={INK} strokeWidth={6} /></At>)}<At x={1000} y={760} o={f > 26 ? 1 : 0}><rect x={-120} y={-200} width={20} height={240} fill="#8E6845" /><rect x={-140} y={-40} width={160} height={30} fill="#8E6845" /></At>{M(560, 1060, 1.3, { expr: 'determined', pose: POINT, look: [1, 0] })}</Stage>, PUSH),
  van: sc((f) => <Stage><Sky t={f} /><rect y={900} width={W} height={180} fill="#5E5A66" /><At x={2200 - f * 22} y={960} s={0.9}><Van /></At></Stage>, PUSH),
  ears: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><At x={1100} y={1180} s={4.4} r={lerp(f, 0, 6, 0, -6)}><Dog expr="happy" /></At></Stage>, HOLDC),
  foodBub: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><At x={1260} y={1060} s={2.2}><Dog expr="happy" wag={Math.sin(f / 2)} /></At><Bub x={760} y={400} w={640} h={340} p={lerp(f, 0, 8, 0.4, 1)} tx={260} ty={340}><Label x={0} y={0} t="FOOD." size={150} color={INK} /></Bub></Stage>, HOLDC),
  flap: sc((f) => <Stage><Home /><rect x={860} y={700} width={220} height={140} rx={14} fill="#5E3A9A" stroke={INK} strokeWidth={8} /><g transform={`rotate(${Math.sin(f / 2) * 40 * Math.max(0, 1 - f / 40)} 970 700)`}><rect x={870} y={700} width={200} height={130} rx={10} fill="#7A4FD6" stroke={INK} strokeWidth={6} /></g><At x={1000 + f * 30} y={1040} s={1.2} o={f < 8 ? 1 : 0}><Dog expr="happy" /></At></Stage>, PUSH),
  hedge: sc((f) => <Stage bg="#7EC8F0"><rect y={800} width={W} height={280} fill="#6BB36F" /><rect x={300} y={420} width={1320} height={400} rx={60} fill="#3D8A4A" stroke={INK} strokeWidth={8} /><path d="M900 820 L900 700 Q930 640 980 660 L1020 620 L1040 680 Q1080 700 1060 820 Z" fill="#7EC8F0" stroke={INK} strokeWidth={6} /></Stage>, PUSH),
  window: sc((f) => <Stage><Home /><At x={1500} y={350}><rect x={-200} y={-150} width={400} height={300} fill="#7EC8F0" /><g>{Head(0, 60, 1.2, { expr: 'shocked', look: [0, 0] })}</g><rect x={-200} y={-150} width={400} height={300} fill="none" stroke={INK} strokeWidth={10} /></At><At x={700} y={440}><Stamp t="PLAN A: FAIL" p={lerp(f, 8, 14, 0, 1)} size={90} /></At></Stage>, HOLDC),
  // ---- 5 the chase
  run: (set: 'street' | 'market' | 'bakery' | 'hill') => sc((f) => <Stage>{set === 'market' ? <Market t={f} /> : set === 'hill' ? <g><rect width={W} height={H} fill="#7EC8F0" /><path d="M0 500 L1920 1080 L0 1080 Z" fill="#6BB36F" stroke={INK} strokeWidth={8} /></g> : set === 'bakery' ? <g><rect width={W} height={H} fill="#F6C28B" /><rect y={760} width={W} height={320} fill="#C9A27A" />{[0, 1, 2].map((i) => <rect key={i} x={((i * 700 - f * 16) % 2100 + 2100) % 2100 - 300} y={360} width={420} height={400} fill="#FFF7DC" stroke={INK} strokeWidth={6} />)}</g> : <Sky t={f} />}{M(set === 'hill' ? 400 + f * 14 : 960, set === 'hill' ? 700 + f * 4 : 1060, 1.3, { expr: 'determined', pose: runPose(f / 2), look: [1, 0], flip: false })}{set !== 'hill' && <At x={1700 - (f % 60) * 2} y={1040} s={0.8}><Dog expr="happy" /></At>}</Stage>, set === 'street' ? LOW : WHIP),
  problem: sc((f) => <Stage bg="#5A0F14"><Rays bg="#5A0F14" ray="#6E141B" t={f} />{Head(960, 640, 2.5, { expr: { eyes: 'open', lid: 0.4, lidAngle: 0, mouth: 'flat' } })}</Stage>, HOLDC),
  oneHourIcon: sc((f) => <Stage>{dark(f)}<At x={960} y={520}><circle r={260} fill="#0B0C18" stroke={GOLD} strokeWidth={14} /><line x1={0} y1={0} x2={0} y2={-180} stroke={GOLD} strokeWidth={14} transform={`rotate(${f * 4})`} /><Label x={0} y={-340} t="1 HOUR" size={80} color={GOLD} /></At></Stage>, PUSH),
  cartFreeze: sc((f) => <Stage><Market /><At x={1350} y={900} s={1.4}><rect x={-200} y={-120} width={400} height={160} rx={12} fill="#8E6845" stroke={INK} strokeWidth={8} />{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-150 + i * 42} cy={-140} r={26} fill={ORANGE} stroke={INK} strokeWidth={4} />)}<circle cx={-120} cy={60} r={40} fill={INK} /><circle cx={120} cy={60} r={40} fill={INK} /></At>{M(820, 960, 1.3, { expr: 'panic', pose: { ...PANIC, hipL: -50, knL: 60 }, still: true })}<Label x={1350} y={200} t="1 SECOND" size={80} color="#E53935" /></Stage>, HOLDC),
  splat: sc((f) => <Stage><Market />{Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; const r = lerp(f, 0, 20, 0, 500 + (i % 4) * 80); return <circle key={i} cx={960 + Math.cos(a) * r} cy={600 + Math.sin(a) * r * 0.7 + lerp(f, 10, 40, 0, 200)} r={30} fill={ORANGE} stroke={INK} strokeWidth={4} />; })}{M(960, 1100, 1.3, { expr: 'wince', pose: { ...PANIC, lean: -20 } })}<Label x={960} y={200} t="SPLAT" size={120} color={ORANGE} /></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.8 }),
  cake: sc((f) => <Stage bg="#F7D6E0"><Rays bg="#F7D6E0" ray="#FADFE7" t={f} /><At x={1100} y={860}><Cake boom={lerp(f, 6, 20, 0, 1)} /></At>{M(700 + f * 6, 1060, 1.3, { expr: 'panic', pose: runPose(f / 2) })}{M(1600, 1060, 1.2, { outfit: { ...MUM, jacket: '#fff', jacketDark: '#ddd' }, expr: f > 10 ? 'shocked' : 'happy', look: [-1, 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.4 }),
  skateGrab: sc((f) => <Stage><Market />{M(960, 1060, 1.4, { expr: 'smug', pose: HOLD, look: [0.5, 0] })}<At x={960} y={860} r={-10}><Skate /></At></Stage>, PUSH),
  skateDown: sc((f) => <Stage><rect width={W} height={H} fill="#7EC8F0" /><path d="M0 400 L1920 1000 L1920 1080 L0 1080 Z" fill="#9AA3B5" stroke={INK} strokeWidth={8} /><g transform={`translate(${300 + f * 30} ${490 + f * 9.4}) rotate(17)`}><Skate /><g transform="translate(0 -30) scale(1.1)"><Max expr="laugh" pose={{ ...STAND, shL: -100, elL: 0, shR: 100, elR: 0, hipL: -30, knL: 30, hipR: 30, knR: 30 }} /></g></g></Stage>, WHIP),
  vanTurn: sc((f) => <Stage><Roofs /><rect y={820} width={W} height={260} fill="#5E5A66" /><At x={500 + f * 20} y={980} s={0.6}><Van /></At></Stage>, WHIP),
  drainpipe: sc((f) => <Stage bg="#E8D8B8"><rect x={900} y={0} width={40} height={H} fill="#5E6A7C" stroke={INK} strokeWidth={6} />{M(960, 1100 - f * 12, 1.3, { expr: 'determined', pose: { ...STAND, shL: -160, elL: 0, shR: 160, elR: 0, hipL: (f % 10 < 5 ? -40 : 0), knL: 40 } })}</Stage>, PUSH),
  rooftops: sc((f) => <Stage><Roofs t={f} />{M(400, 560, 0.7, { expr: 'determined', pose: runPose(f / 2) })}</Stage>, { a: { z: 1.06, x: 0 }, b: { z: 1.1, x: 25 } }),
  edge: sc((f) => <Stage><Roofs />{M(960, 860, 1.6, { expr: 'determined', pose: HERO, look: [0.8, 0] })}</Stage>, LOW),
  jump: (n: number) => sc((f) => { const t = remap(f, [[0, n === 3 ? 0.35 : 0.5]]); const k = Math.min(1, t / 30); return <Stage><Roofs />{M(500 + k * 900, 700 - Math.sin(k * Math.PI) * 260 + (n === 3 ? 0 : 0), 1, { expr: n === 3 ? 'panic' : 'determined', pose: n === 3 ? PANIC : { ...STAND, shL: -120, shR: 120, hipL: -40, knL: 60, hipR: 30, knR: 40 } })}<Label x={300} y={140} t={`JUMP ${n}`} size={70} color={INK} /></Stage>; }, HOLDC),
  laundry: sc((f) => <Stage bg="#9ED8F0"><line x1={0} y1={300} x2={W} y2={340} stroke={INK} strokeWidth={6} />{Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 240 + 40} y={300 + lerp(f, 0, 10, 0, i % 2 ? 400 : 200)} width={140} height={160} fill={['#E53935', '#fff', '#2F6FD6', GOLD][i % 4]} stroke={INK} strokeWidth={5} transform={`rotate(${lerp(f, 0, 10, 0, (i - 4) * 12)} ${i * 240 + 110} 380)`} />)}<ellipse cx={960} cy={980} rx={420} ry={120} fill="#F3EEE4" stroke={INK} strokeWidth={6} />{Head(960, 860, 1.1, { expr: 'wince' })}<rect x={890} y={700} width={140} height={60} rx={10} fill="#F07FA8" stroke={INK} strokeWidth={5} /><At x={1600} y={760} s={0.9}><ellipse rx={70} ry={50} fill="#5A5F6E" /><circle cx={-60} cy={-50} r={40} fill="#5A5F6E" /><path d="M-90 -80 L-80 -110 L-66 -84 M-50 -84 L-36 -110 L-30 -78" fill="#5A5F6E" stroke="#5A5F6E" strokeWidth={6} /><circle cx={-74} cy={-54} r={6} fill={GOLD} /><circle cx={-50} cy={-54} r={6} fill={GOLD} /></At></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.6 }),
  lying: sc((f) => <Stage bg="#9ED8F0">{Head(960, 660, 2.4, { expr: 'shocked', look: [0, -0.4] })}<rect x={800} y={330} width={320} height={90} rx={16} fill="#F07FA8" stroke={INK} strokeWidth={6} /></Stage>, HOLDC),
  echo: sc((f) => <Stage bg="#9ED8F0"><g opacity={0.4} transform={`translate(${30 + Math.sin(f / 3) * 10} 0)`}>{Head(960, 660, 2.4, { expr: 'shocked', still: true })}</g>{Head(960, 660, 2.4, { expr: 'shocked', still: true })}</Stage>, HOLDC),
  dejaVu: sc((f) => <Stage bg="#7A4FD6"><Rays bg="#7A4FD6" ray="#8660DD" t={f} /><At x={960} y={540} s={lerp(f, 0, 6, 1.3, 1)}><BigNum text="DÉJÀ VU" size={220} color={GOLD} /></At><g opacity={0.3}><At x={980} y={560}><BigNum text="DÉJÀ VU" size={220} color="#fff" /></At></g></Stage>, HOLDC),
  inspector: (tick: boolean) => sc((f) => <Stage>{dark(f)}<At x={560} y={540} s={1.2}><Brain seed={8} /></At>{[0, 1].map((i) => <At key={i} x={1180 + i * 300} y={540}><rect x={-110} y={-150} width={220} height={300} rx={14} fill="#FFF7DC" stroke={INK} strokeWidth={6} />{M(0, 120, 0.4, { expr: 'shocked', still: true })}</At>)}<At x={1330} y={540} r={Math.sin(f / 6) * 10}><circle r={110} fill="none" stroke={GOLD} strokeWidth={14} /><line x1={80} y1={80} x2={180} y2={180} stroke={GOLD} strokeWidth={20} strokeLinecap="round" /></At>{tick && <At x={1330} y={220} s={lerp(f, 0, 8, 0, 1)}><circle r={80} fill="#3DE07A" stroke={INK} strokeWidth={8} /><path d="M-36 0 L-8 28 L40 -30" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" /></At>}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  pantsOff: sc((f) => <Stage bg="#9ED8F0">{M(960, 1060, 1.4, { expr: { eyes: 'open', lid: 0.5, lidAngle: 0, mouth: 'flat' }, pose: { ...STAND, shR: lerp(f, 0, 12, 170, 120), elR: 10 } })}<At x={960 + lerp(f, 0, 12, 0, 200)} y={600 - lerp(f, 0, 12, 0, 200)}><rect x={-80} y={-30} width={160} height={60} rx={10} fill="#F07FA8" stroke={INK} strokeWidth={5} /></At></Stage>, PUSH),
  visDave: vis((f) => <><Sky t={f} city={false} /><At x={960} y={1300} s={1.4}><DuckBalloon inside={BASKET({ max: 'panic', dave: 'panic', dog: true })} /></At></>, '10:00 AM'),
  visDaveDuck: vis((f) => <><Sky t={f} city={false} /><At x={1300} y={2300} s={1.8}><DuckBalloon /></At>{Head(560, 700, 2.2, { outfit: DAVE, expr: 'panic', look: [0.8, -0.8] })}</>),
  // ---- 6 plan B + butterfly
  planB: PlanCard('PLAN B', '#3DBE7A'),
  split: sc((f) => <Stage><rect width={960} height={H} fill="#F2C14E" /><rect x={960} width={960} height={H} fill="#9ED8F0" />{M(480, 1060, 1.2, { expr: 'determined', pose: { ...runPose(f / 2), shR: 150, elR: 40 } })}<At x={560} y={420} s={0.5}><Phone /></At>{M(1440, 1060, 1.2, { outfit: DAVE, expr: 'happy', pose: { ...SIT, shR: 90, elR: 60 } })}<At x={1560} y={700}><ellipse rx={60} ry={24} fill="#fff" stroke={INK} strokeWidth={5} /></At><line x1={960} y1={0} x2={960} y2={H} stroke={INK} strokeWidth={10} /></Stage>, PUSH),
  phoneClose: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} />{Head(760, 640, 2.2, { expr: 'determined', look: [0.6, 0] })}<At x={1300} y={500} s={1.2} r={10}><Phone t="STAY AWAY" /></At></Stage>, PUSH),
  cereal: sc((f) => <Stage bg="#9ED8F0">{Head(960, 640, 2.4, { outfit: DAVE, expr: { eyes: 'open', lid: 0.3, lidAngle: 0, mouth: 'flat' }, look: [0, 0], still: true })}<At x={1300} y={900 + lerp(f, 0, 20, 0, 80)}><ellipse rx={100} ry={36} fill="#fff" stroke={INK} strokeWidth={6} /></At></Stage>, HOLDC),
  stroll: sc((f) => <Stage><Festival t={f} /><rect x={160} y={300} width={40} height={500} fill="#8E6845" /><rect x={600} y={300} width={40} height={500} fill="#8E6845" /><rect x={160} y={260} width={480} height={70} fill="#E53935" stroke={INK} strokeWidth={6} />{M(200 + f * 8, 1060, 1.2, { outfit: DAVE, expr: 'happy', pose: walkPose(f / 6) })}</Stage>, PUSH),
  facepalm: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} />{M(960, 1060, 1.5, { expr: 'wince', pose: FACEPALM })}</Stage>, HOLDC),
  branches: sc((f) => <Stage>{dark(f)}{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M200 540 C 700 540, 900 ${180 + i * 150}, 1700 ${120 + i * 170}`} stroke={['#FF5A4E', GOLD, '#3DE07A', '#7FB8FF', '#F07FA8', ORANGE][i]} strokeWidth={10} fill="none" strokeDasharray="1800" strokeDashoffset={1800 - lerp(f, i * 3, i * 3 + 30, 0, 1800)} />)}{M(200, 640, 0.5, { expr: 'shocked' })}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  lorenz: sc((f) => <Stage bg="#E8D8B8"><rect x={560} y={240} width={800} height={520} rx={20} fill="#3A3D48" stroke={INK} strokeWidth={10} /><rect x={600} y={280} width={720} height={400} fill="#0B0C18" /><Label x={960} y={420} t="WEATHER" size={70} color="#3DE07A" /><Label x={960} y={560} t="1961" size={110} color="#3DE07A" />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={600 + i * 120} y={800} width={100} height={40} rx={6} fill="#C7CDD8" stroke={INK} strokeWidth={4} />)}</Stage>, PUSH),
  numbers: sc((f) => <Stage>{dark(f)}<Label x={960} y={380} t="0.506127" size={150} color="#3DE07A" /><At x={960} y={700}><Label x={0} y={0} t={f < 20 ? '0.506127' : '0.506'} size={150} color={GOLD} /></At>{f > 20 && <Label x={1500} y={700} t="…" size={120} color="#FF5A4E" />}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  crumb: sc((f) => <Stage bg="#F6E3B4"><At x={960} y={560} s={lerp(f, 0, 30, 1, 0.3)}><circle r={60} fill="#D9A15B" stroke={INK} strokeWidth={6} /></At><Label x={960} y={240} t="SMALLER THAN A CRUMB" size={70} color={INK} /></Stage>, PUSH),
  maps: (k: 'both' | 'sun' | 'storm') => sc((f) => <Stage>{dark(f)}{(['sun', 'storm'] as const).map((m, i) => (k === 'both' || k === m) && <At key={m} x={k === 'both' ? 560 + i * 800 : 960} y={540} s={k === 'both' ? 1 : 1.4}><rect x={-320} y={-240} width={640} height={480} rx={20} fill={m === 'sun' ? '#9ED8F0' : '#3A3F58'} stroke="#fff" strokeWidth={8} />{m === 'sun' ? <circle r={110} fill={GOLD} stroke={INK} strokeWidth={8} /> : <g><ellipse rx={200} ry={90} fill="#5A607A" stroke={INK} strokeWidth={8} /><path d="M-20 80 L-60 180 L0 160 L-30 260" stroke={GOLD} strokeWidth={16} fill="none" strokeLinejoin="round" />{Array.from({ length: 10 }, (_, j) => <line key={j} x1={-180 + j * 40} y1={110 + ((f * 6 + j * 20) % 100)} x2={-190 + j * 40} y2={140 + ((f * 6 + j * 20) % 100)} stroke="#7FB8FF" strokeWidth={6} />)}</g>}</At>)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  butterfly: sc((f) => { const w = Math.abs(Math.sin(f / 3)); return <Stage bg="#7EC8F0"><Sky t={f} city={false} /><At x={960} y={540} s={2}><g transform={`scale(${0.3 + w * 0.7} 1)`}><path d="M0 0 C -160 -200, -260 -40, -40 20 C -220 120, -120 220, 0 40 Z" fill="#F07FA8" stroke={INK} strokeWidth={6} /><path d="M0 0 C 160 -200, 260 -40, 40 20 C 220 120, 120 220, 0 40 Z" fill="#F07FA8" stroke={INK} strokeWidth={6} /></g><rect x={-8} y={-60} width={16} height={130} rx={8} fill={INK} /></At></Stage>; }, PUSH),
  tinyBig: sc((f) => <Stage>{dark(f)}<circle cx={500} cy={540} r={20} fill={GOLD} /><At x={1300} y={540} s={lerp(f, 0, 30, 0.1, 1)}><circle r={320} fill="#FF5A4E" opacity={0.85} /></At><Label x={500} y={720} t="TINY" size={60} /><Label x={1300} y={150} t="MASSIVE" size={70} color="#FF5A4E" /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  forecast: sc((f) => <Stage>{dark(f)}<At x={500} y={480} s={0.8}><Gauge v={0.9} label0="" label1="" /></At><At x={1420} y={480} s={0.8}><Gauge v={0.5} label0="" label1="" /></At><Label x={500} y={780} t="5 DAYS" size={70} color="#3DE07A" /><Label x={1420} y={780} t="10 DAYS" size={70} color="#FF5A4E" /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  threads: sc((f) => <Stage>{dark(f, '#2A2340', '#332A4E')}<Threads f={f} /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  // ---- 7 plan C
  planC: PlanCard('PLAN C', '#E53935'),
  pinHold: sc((f) => <Stage bg="#14152A">{Head(760, 640, 2.2, { expr: { eyes: 'open', lid: 0.45, lidAngle: -10, mouth: 'smirk' }, look: [0.6, -0.3] })}<At x={1340} y={760} s={1.4} r={10}><Pin /></At><circle cx={1340 + 14} cy={760 - 300} r={14 + Math.abs(Math.sin(f / 4)) * 16} fill="#fff" opacity={0.8} /></Stage>, HOLDC),
  sneak: (k: 'gate' | 'hotdog' | 'stage') => sc((f) => <Stage><Festival t={f} />{k === 'hotdog' && <At x={1300} y={700}><rect x={-220} y={-200} width={440} height={300} fill="#FFF7DC" stroke={INK} strokeWidth={8} /><Label x={0} y={-260} t="HOT DOGS" size={60} color="#E53935" /></At>}{k === 'stage' && <rect x={0} y={560} width={W} height={180} fill="#5A3A22" stroke={INK} strokeWidth={10} />}{M(300 + f * 7, k === 'stage' ? 1060 : 1060, 1.1, { expr: 'determined', pose: { ...walkPose(f / 8), lean: 18, bob: 40 }, look: [1, 0] })}</Stage>, LOW),
  duckLoom: sc((f) => <Stage><Festival t={f} /><At x={1100} y={1900} s={2.1}><DuckBalloon /></At>{M(400, 1060, 1, { expr: 'shocked', look: [1, -0.8] })}</Stage>, LOW),
  guard: sc((f) => <Stage bg="#14152A"><path d={`M1500 420 L${400} ${600} L${400} ${900} Z`} fill="#FFF6C2" opacity={0.3} />{M(1600, 1060, 1.3, { outfit: GUARD, expr: 'shocked', pose: POINT, flip: true, look: [-1, 0] })}{M(420, 1060, 1.2, { expr: 'panic', pose: PANIC, still: true })}</Stage>, HOLDC),
  bouncy: sc((f) => { const t = remap(f, [[0, 0.5]]); return <Stage bg="#7EC8F0"><rect y={760} width={W} height={320} fill="#6BB36F" /><g>{[0, 1, 2, 3].map((i) => <rect key={i} x={300 + i * 330} y={300} width={300} height={500} rx={60} fill={['#E53935', GOLD, '#2F6FD6', '#3DBE7A'][i]} stroke={INK} strokeWidth={8} />)}</g>{M(500 + t * 14, 760 - Math.abs(Math.sin(t / 10)) * 380, 1.1, { expr: 'laugh', pose: { ...PANIC, hipL: -40, knL: 50 } })}</Stage>; }, HOLDC),
  mirrors: sc((f) => <Stage bg="#B9D3DE">{Array.from({ length: 12 }, (_, i) => <g key={i}><rect x={60 + (i % 6) * 310} y={80 + Math.floor(i / 6) * 480} width={260} height={440} rx={20} fill="#DDF2FA" stroke="#8A96A8" strokeWidth={10} />{M(190 + (i % 6) * 310, 480 + Math.floor(i / 6) * 480, 0.6, { expr: ['smug', 'shocked', 'laugh'][i % 3] as 'smug', flip: i % 2 === 1 })}</g>)}</Stage>, PUSH),
  guardSpin: sc((f) => <Stage bg="#B9D3DE">{Array.from({ length: 6 }, (_, i) => <g key={i} opacity={0.6}>{M(200 + i * 300, 760, 0.6, { expr: 'smug' })}</g>)}{M(960, 1100, 1.4, { outfit: GUARD, expr: 'shocked', flip: Math.floor(f / 6) % 2 === 1, look: [Math.sin(f / 3), 0] })}</Stage>, PUSH),
  dodgems: (over: boolean) => sc((f) => <Stage bg="#2B2F4A">{[0, 1, 2, 3].map((i) => <At key={i} x={((i * 520 + f * (i % 2 ? 10 : -10)) % 2300 + 2300) % 2300 - 200} y={880}><rect x={-160} y={-80} width={320} height={160} rx={60} fill={['#E53935', '#2F6FD6', GOLD, '#3DBE7A'][i]} stroke={INK} strokeWidth={8} /><line x1={0} y1={-80} x2={0} y2={-600} stroke="#9AA3B5" strokeWidth={6} /></At>)}{M(over ? 300 + f * 14 : 960, over ? 760 - Math.abs(Math.sin(f / 6)) * 160 : 820, 1.1, { expr: 'determined', pose: over ? { ...PANIC, hipL: -50, knL: 60 } : runPose(f / 2) })}</Stage>, over ? WHIP : PUSH),
  candyFloss: sc((f) => <Stage bg="#F7D6E0">{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={960 + Math.cos(i) * lerp(f, 0, 14, 40, 600) * rnd(i)} cy={540 + Math.sin(i * 1.3) * lerp(f, 0, 14, 30, 400) * rnd(i, 2)} r={90 + rnd(i, 3) * 80} fill="#F7A8C8" opacity={0.85} />)}</Stage>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.5 }),
  sticky: sc((f) => <Stage bg="#F2C14E">{M(960, 1060, 1.4, { outfit: { jacket: '#F7A8C8', jacketDark: '#E07AA8', pants: '#F7A8C8', shoes: '#F07FA8', sole: '#fff', skin: INK }, expr: { eyes: 'open', lid: 0.5, lidAngle: 0, mouth: 'flat' } })}{M(300 + f * 20, 1060, 1.2, { outfit: GUARD, expr: 'determined', pose: runPose(f / 2) })}</Stage>, PUSH),
  pockets: sc((f) => <Stage bg="#F2C14E">{Head(960, 640, 2.4, { outfit: { jacket: '#F7A8C8', jacketDark: '#E07AA8', pants: '#F7A8C8', shoes: '#F07FA8', sole: '#fff', skin: INK }, expr: 'shocked', look: [0, 0.8] })}<Label x={1480} y={300} t="NO PIN" size={80} color="#E53935" /></Stage>, HOLDC),
  looksUp: sc((f) => <Stage><Festival t={f} />{Head(960, 700, 2.3, { expr: 'shocked', look: [0, lerp(f, 0, 20, 0.6, -0.9)] })}</Stage>, HOLDC),
  duckAbove: sc((f) => <Stage bg="#7EC8F0"><At x={1260} y={2400} s={2.4}><DuckBalloon /></At></Stage>, LOW),
  // ---- 8 the duck
  festWide: sc((f) => <Stage><Festival t={f} /><At x={960} y={1060} s={0.85}><DuckBalloon inside={BASKET({ dog: true })} /></At></Stage>, PUSH),
  basketDog: sc((f) => <Stage bg="#7EC8F0"><At x={960} y={1300} s={2.4}><DuckBalloon inside={BASKET({ dog: true })} /></At></Stage>, PUSH),
  dogCool: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><At x={1100} y={1180} s={4}><Dog expr="cool" /></At><At x={1100 - 170 * 4 + 120} y={1180 - 100 * 4} r={-10}><Sausage /></At></Stage>, HOLDC),
  leap: sc((f) => { const t = remap(f, [[0, 0.5]]); return <Stage><Festival /><At x={1300} y={1080} s={0.9}><DuckBalloon /></At>{M(300 + t * 22, 900 - Math.sin(Math.min(1, t / 40) * Math.PI) * 300, 1.1, { expr: 'determined', pose: { ...PANIC, hipL: -60, knL: 70 } })}</Stage>; }, HOLDC),
  rope: sc((f) => <Stage><Festival t={f} /><line x1={1200} y1={0} x2={960} y2={700} stroke="#8E6845" strokeWidth={14} />{M(960, 1060, 1.4, { outfit: DAVE, expr: 'happy', pose: { ...STAND, shR: 150, elR: 20 }, look: [0.4, -0.6] })}</Stage>, PUSH),
  daveEyes: sc((f) => <Stage bg="#7EC8F0">{Head(960, 640, 2.8, { outfit: DAVE, expr: 'shocked', look: [0, -1], still: true })}</Stage>, HOLDC),
  duckFace: sc((f) => <Stage bg="#7EC8F0"><At x={1500} y={2300} s={2.4}><DuckBalloon /></At></Stage>, { a: { z: 1 }, b: { z: 1.08 } }),
  letGo: sc((f) => <Stage bg="#7EC8F0"><line x1={960} y1={0} x2={960 + lerp(f, 4, 16, 0, 300)} y2={560 - lerp(f, 4, 16, 0, 600)} stroke="#8E6845" strokeWidth={14} />{Head(960, 760, 2, { outfit: DAVE, expr: 'panic' })}</Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.5 }),
  dive: sc((f) => <Stage><Festival /><At x={1100} y={1080 - f * 4} s={0.9}><DuckBalloon inside={BASKET({ max: 'panic', dog: true })} /></At>{M(400 + f * 18, 900 - Math.sin(Math.min(1, f / 30) * Math.PI) * 260, 1, { outfit: DAVE, expr: 'panic', pose: PANIC })}</Stage>, WHIP),
  rise: sc((f) => { const t = remap(f, [[0, 0.4]]); return <Stage><Sky t={t} /><At x={960} y={1200 - t * 4} s={1.2}><DuckBalloon inside={BASKET({ max: 'panic', dave: 'panic', dog: true })} /></At><Vignette strength={0.4} /></Stage>; }, { a: { z: 1, y: 20 }, b: { z: 1.08, y: -20 } }),
  basketPOV: sc((f) => <Stage><Sky t={f} /><rect x={0} y={760} width={W} height={320} fill="#A8743A" stroke={INK} strokeWidth={10} />{Head(560, 700, 1.4, { expr: 'panic', look: [0.3, -0.6] })}{Head(1360, 720, 1.3, { outfit: DAVE, expr: 'panic', look: [-0.3, -0.6] })}</Stage>, HOLDC),
  fireworks: sc((f) => { const t = remap(f, [[0, 1], [6, 0.3]]); return <Stage><Sky t={t} night /><Fireworks f={t} speed={1} /><At x={960} y={1250} s={1.25}><DuckBalloon inside={BASKET({ max: 'shocked', dave: 'panic', dog: true })} /></At><Vignette strength={0.4} /></Stage>; }, { a: { z: 1 }, b: { z: 1.1 }, tilt: 2 }),
  fwFace: sc((f) => <Stage><Sky night /><Fireworks f={f} speed={0.5} /><rect width={W} height={H} fill={GOLD} opacity={0.1 + 0.08 * Math.sin(f / 3)} />{Head(960, 620, 2.6, { expr: { eyes: 'open', lid: 0, lidAngle: 0, mouth: 'o', pupil: 1.3 }, look: [0, -0.6] })}</Stage>, HOLDC),
  // ---- 9 DON'T GO
  daveEdge: sc((f) => <Stage><Sky t={f} /><At x={960} y={1300} s={1.6}><DuckBalloon inside={BASKET({ max: 'panic', dog: true })} /></At>{M(1260, 1050, 1.1, { outfit: DAVE, expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'wobble' }, pose: { ...STAND, hipR: 70, knR: 20, shL: -120 } })}</Stage>, PUSH),
  drop: sc((f) => <Stage><CityBelow t={f} /><At x={960} y={200} s={0.7}>{M(0, 0, 1, { outfit: DAVE, expr: 'panic', pose: { ...STAND, hipR: 70 } })}</At></Stage>, { a: { z: 1 }, b: { z: 1.08 } }),
  inhale: sc((f) => <Stage><Sky t={f} />{Head(960, 640, 2.6, { expr: { eyes: 'open', lid: 0, lidAngle: 0, mouth: 'o' }, look: [0.6, 0] })}</Stage>, HOLDC),
  match: sc((f) => <Stage bg="#0B0C18"><At x={540} y={540} s={0.48}><g><Sky night />{Head(960, 560, 3, { expr: 'panic', still: true })}<VisFX f={20} /></g></At><At x={1380} y={540} s={0.48}><g><Sky night />{Head(960, 560, 3, { expr: 'panic', still: true })}</g></At><line x1={1000} y1={540} x2={1150} y2={540} stroke={GOLD} strokeWidth={10} strokeDasharray={`${lerp(f, 0, 14, 0, 150)} 200`} /><Label x={540} y={220} t="9:00 VISION" size={50} color="#BFE6F7" /><Label x={1380} y={220} t="10:00 REAL" size={50} color={GOLD} /></Stage>, HOLDC),
  daveStops: sc((f) => <Stage><Sky t={f} />{Head(960, 640, 2.5, { outfit: DAVE, expr: 'shocked', look: [-0.6, 0] })}</Stage>, HOLDC),
  calm: sc((f) => <Stage><Sky t={f} />{Head(960, 640, 2.5, { expr: { eyes: 'happy', lid: 0, lidAngle: 0, mouth: 'smile' } })}</Stage>, PUSH),
  blink2: flash(() => <><Sky />{Head(960, 640, 2.5, { expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'flat' } })}</>),
  vis11: vis((f) => <><Stadium t={f} night={false} /><At x={960} y={1000} s={0.6}><DuckBalloon flame={0} /></At><Confetti t={f} /></>, '11:00 AM'),
  shoulders: sc((f) => <Stage><Sky t={f} />{M(760, 1060, 1.4, { expr: 'determined', pose: { ...STAND, shR: 80, elR: 0 }, look: [1, 0] })}{M(1220, 1060, 1.4, { outfit: DAVE, expr: { eyes: 'open', lid: 0, lidAngle: 0, mouth: 'wobble', tear: true }, flip: true, look: [-1, 0] })}</Stage>, PUSH),
  meters: (which: 0 | 1 | 2) => sc((f) => <Stage>{dark(f)}{which !== 2 && <><At x={500} y={460} s={0.8}><Gauge v={lerp(f, 0, 20, 0, 0.92)} label0="" label1="" /></At><Label x={500} y={760} t="50% CHANCE" size={60} color="#FF5A4E" /></>}{which !== 0 && <><At x={which === 2 ? 960 : 1420} y={460} s={0.8}><Gauge v={lerp(f, 0, 20, 0, 0.45)} label0="" label1="" /></At><Label x={which === 2 ? 960 : 1420} y={760} t="100% SURE" size={60} color="#3DE07A" /></>}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  notKnowing: sc((f) => <Stage bg="#5A0F14"><Rays bg="#5A0F14" ray="#6E141B" t={f} /><At x={960} y={540} s={lerp(f, 0, 6, 1.3, 1)}><BigNum text="NOT KNOWING" size={170} color="#FF5A4E" /></At></Stage>, HOLDC),
  talk: sc((f) => <Stage><Sky t={f} />{M(760, 1060, 1.4, { expr: 'happy', pose: { ...STAND, shR: 80, elR: 0 }, look: [1, 0] })}{M(1220, 1060, 1.4, { outfit: DAVE, expr: 'shocked', flip: true, look: [-1, 0] })}<Bub x={600} y={300} w={460} h={220} tx={120} ty={320}><Label x={0} y={0} t="I'VE SEEN IT" size={60} color={INK} /></Bub></Stage>, PUSH),
  visLand: vis((f) => <><Stadium t={f} night={false} /><At x={960} y={1000} s={0.6}><DuckBalloon flame={0} /></At></>, '10:10 AM'),
  daveLaugh: vis((f) => <><Sky t={f} />{Head(960, 640, 2.5, { outfit: DAVE, expr: 'laugh' })}</>, '10:20 AM'),
  sitDown: sc((f) => <Stage><Sky t={f} /><rect y={760} width={W} height={320} fill="#A8743A" stroke={INK} strokeWidth={10} />{Head(760, 700, 1.5, { expr: 'happy', look: [0.6, 0] })}{Head(1160, 700, 1.5, { outfit: DAVE, expr: { eyes: 'happy', lid: 0, lidAngle: 0, mouth: 'smile' }, look: [-0.6, 0] })}<At x={960} y={980} s={1.4}><Dog expr="happy" wag={Math.sin(f / 2) * 1.5} /></At></Stage>, PUSH),
  // ---- 10 landing
  burner: (shrink: boolean) => sc((f) => <Stage bg="#14152A"><rect x={860} y={600} width={200} height={70} rx={10} fill="#3A3D48" /><path d={`M900 600 Q960 ${600 - (shrink ? lerp(f, 0, 30, 360, 60) : 360 - (f % 6 < 3 ? 120 : 0))} 1020 600 Z`} fill={ORANGE} /><path d={`M930 600 Q960 ${600 - (shrink ? lerp(f, 0, 30, 220, 40) : 200)} 990 600 Z`} fill={GOLD} /></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.4 }),
  fuel: sc((f) => <Stage bg="#14152A"><At x={960} y={560} s={1.6}><Gauge v={lerp(f, 0, 30, 0.4, 0.04)} label0="" label1="" /></At><Label x={960} y={180} t="FUEL" size={80} color="#FF5A4E" /></Stage>, HOLDC),
  second: sc((f) => <Stage><Sky t={f} />{Head(960, 640, 2.5, { expr: 'wince', look: [0, -0.4] })}</Stage>, HOLDC),
  drift: sc((f) => <Stage><Sky t={f * 3} /><At x={400 + f * 6} y={900} s={0.6}><DuckBalloon flame={0.3} /></At></Stage>, PUSH),
  winds: (k: number, row: number) => sc((f) => <Stage bg="#7EC8F0">{[0, 1, 2, 3].map((i) => <g key={i}><rect y={i * 270} width={W} height={270} fill="#fff" opacity={i % 2 ? 0.12 : 0} /><At x={((i * 400 + f * 8 * (i % 2 ? -1 : 1)) % 1600 + 1600) % 1600 + 160} y={i * 270 + 135}><Arrow dir={i % 2 ? -1 : 1} c={i === 2 && k > 0 ? GOLD : '#fff'} /></At></g>)}<At x={960} y={lerp(f, 0, 20, 1000, row * 250 + 330)} s={0.42}><DuckBalloon flame={0.5} /></At>{k > 1 && <Label x={1640} y={135 + 2 * 270} t="STADIUM →" size={50} color={GOLD} />}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  overStadium: sc((f) => <Stage><Stadium t={f} night={false} /><At x={600 + f * 8} y={500} s={0.4}><DuckBalloon flame={0.2} /></At></Stage>, WHIP),
  crowdUp: sc((f) => <Stage><Stadium t={f} night={false} />{[0, 1, 2, 3, 4].map((i) => <g key={i}>{Head(260 + i * 350, 900 - (i % 2) * 40, 1, { outfit: [MUM, DAVE, ATHLETE, GUARD, MUM][i], expr: 'shocked', look: [0, -1] })}</g>)}</Stage>, PUSH),
  descend: sc((f) => { const t = remap(f, [[0, 0.5]]); return <Stage><Stadium t={t} night={false} /><At x={960} y={420 + Math.min(t, 40) * 9} s={0.5}><DuckBalloon flame={0} inside={BASKET({ max: 'happy', dave: 'shocked', dog: true })} /></At></Stage>; }, HOLDC),
  touchdown: sc((f) => <Stage><Stadium t={f} night={false} /><At x={960} y={860} s={0.62}><DuckBalloon flame={0} inside={BASKET({ max: 'laugh', dave: 'laugh', dog: true })} /></At><Burst x={960} y={860} p={lerp(f, 0, 16, 0, 1)} color="#fff" r={500} n={16} /><Confetti t={f} /></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.4 }),
  sausages: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} />{Array.from({ length: 26 }, (_, i) => <At key={i} x={300 + (i % 9) * 170} y={300 + Math.floor(i / 9) * 140 + Math.min(f * 20, 400) - 400 + 400}><Sausage r={(i * 37) % 60 - 30} /></At>)}<Label x={960} y={150} t="FREE FOR LIFE" size={90} color={INK} /></Stage>, PUSH),
  dogPile: sc((f) => <Stage bg="#F2C14E">{Array.from({ length: 30 }, (_, i) => <At key={i} x={500 + (i % 10) * 100} y={980 - Math.floor(i / 10) * 40}><Sausage r={(i * 37) % 60 - 30} /></At>)}<At x={960} y={900} s={2.4}><Dog expr="happy" wag={Math.sin(f / 2) * 2} /></At>{Array.from({ length: 4 }, (_, i) => <At key={i} x={760 + i * 140} y={300 - (f * 3 + i * 30) % 120}><Heart /></At>)}</Stage>, PUSH),
  kissGrass: sc((f) => <Stage><Stadium t={f} night={false} />{M(960, 1060, 1.3, { outfit: DAVE, expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'smile' }, pose: { ...STAND, lean: -80, shL: -170, shR: 170 } })}</Stage>, PUSH),
  // ---- 11 ending
  sunset: sc((f) => <Stage><Sky dusk city={false} /><rect y={800} width={W} height={280} fill="#3D8A4A" /><At x={960} y={1000} s={0.9}><rect x={-140} y={-180} width={280} height={180} rx={14} fill="#A8743A" stroke={INK} strokeWidth={10} /></At>{M(800, 840, 1, { expr: 'happy', pose: SIT })}{M(1120, 840, 1, { outfit: DAVE, expr: 'happy', pose: SIT })}<At x={960} y={1000} s={0.9}><Dog expr="happy" /></At></Stage>, PUSH),
  warmFace: sc((f) => <Stage><Sky dusk city={false} />{Head(960, 640, 2.5, { expr: { eyes: 'happy', lid: 0, lidAngle: 0, mouth: 'smile' } })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  together: sc((f) => <Stage><Sky dusk city={false} />{M(800, 1060, 1.4, { expr: 'happy', pose: { ...STAND, shR: 80, elR: 0 } })}{M(1160, 1060, 1.4, { outfit: DAVE, expr: 'laugh', flip: true })}</Stage>, PUSH),
  comments: sc((f) => <Stage bg="#1F2347">{Head(460, 640, 1.8, { expr: 'smug', look: [0.8, 0] })}<At x={1240} y={540}><rect x={-460} y={-330} width={920} height={660} rx={30} fill="#fff" stroke={INK} strokeWidth={8} />{['EXAMS', 'LOTTERY', 'AVOID MUM'].map((t, i) => <At key={i} x={0} y={-200 + i * 190} o={f > 4 + i * 8 ? 1 : 0}><rect x={-400} y={-70} width={800} height={140} rx={20} fill="#EEF1F6" /><circle cx={-320} r={40} fill={['#E53935', '#2F6FD6', GOLD][i]} /><Label x={40} y={0} t={t} size={60} color={INK} /></At>)}</At></Stage>, PUSH),
  pigeonEnd: sc((f) => <Stage bg="#2A2340"><Rays bg="#2A2340" ray="#332A4E" t={f} /><At x={960} y={640} s={1.3}><MicStand /></At><At x={960 + lerp(f, 10, 40, 900, 0)} y={250 - lerp(f, 10, 40, 300, 0)} s={1.1}><Pigeon flap={f < 40 ? Math.abs(Math.sin(f / 2)) : 0} /></At><At x={1600} y={140}><rect x={-140} y={-50} width={280} height={100} rx={14} fill="#0B0C18" /><Label x={0} y={0} t="10:01" size={60} color="#FF5A4E" /></At>{f > 60 && [0, 1].map((i) => <rect key={i} x={i ? 1280 : 140} y={420} width={500} height={282} rx={20} fill="#2E3466" stroke={GOLD} strokeWidth={6} opacity={lerp(f, 60, 80, 0, 1)} />)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
};

// ================= countdown HUD =================
const KEYS = () => [
  [at(1, 'Max has sixty'), 3600], [secStart(2), 3480], [at(3, 'Nine-oh-eight'), 3120], [at(4, 'Nine-twelve'), 2880],
  [at(5, 'Nine-thirty'), 1800], [at(6, 'Which means every'), 900], [at(7, 'Nine-forty-eight'), 720], [at(8, 'Nine-fifty-five'), 300], [at(8, 'Ten a.m.'), 0],
];
const Countdown: React.FC = () => {
  const f = useCurrentFrame();
  const k = KEYS();
  if (f < k[0][0] || f > secStart(9)) return null;
  const s = Math.max(0, Math.round(interpolate(f, k.map((x) => x[0]), k.map((x) => x[1]), { extrapolateRight: 'clamp' })));
  const red = s < 600; const pulse = s < 60 ? 1 + Math.abs(Math.sin(f / 4)) * 0.12 : 1;
  const t = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <g transform={`translate(1700 78) scale(${pulse})`}>
          <rect x={-170} y={-46} width={340} height={92} rx={16} fill="#0B0C18" opacity={0.85} stroke={red ? '#FF5A4E' : GOLD} strokeWidth={5} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={900} fontSize={64} fill={red ? '#FF5A4E' : GOLD}>{s === 0 && (f % 20) < 10 ? '' : t}</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ================= cue sheet =================
type El = (d: number) => React.ReactNode;
type Cue = [number, El, [number, string, number][]?];
const c = (sec: number, phrase: string, el: El, sfx?: [number, string, number][], nth = 1): Cue => [at(sec, phrase, nth), el, sfx];

const CUES: Cue[] = [
  // 1 cold open
  [secStart(1), X.breakfast],
  c(1, 'Max blinked', X.blink, [[0, 'whoosh', 0.3]]),
  c(1, 'and saw ten', X.visWide, [[0, 'wind', 0.3]]),
  c(1, "He's in a", X.visScream),
  c(1, 'Out of control', X.visSwing),
  c(1, 'Over the city', X.visDown),
  c(1, 'Holding the dog', X.visDog),
  c(1, 'And underneath', X.visFireworks, [[4, 'crack', 0.3], [18, 'crack', 0.25]]),
  c(1, 'Then future Max', X.visTurn),
  c(1, 'and screams two', X.visClose),
  c(1, "DON'T GO", X.dontGo(true), [[0, 'lowhit', 0.5]]),
  c(1, 'Max has sixty', X.spoonDrop, [[0, 'tick', 0.4], [10, 'cans', 0.25]]),
  c(1, "I'd tell you", X.mic()),
  c(1, 'give me spoilers', X.title, [[6, 'lowhit', 0.45]]),
  // 2 testing
  c(2, 'Nine-oh-two', X.clock('9:02'), [[0, 'tick', 0.35]]),
  c(2, 'Max tests it', X.tests),
  c(2, 'He sees the bus', X.busLate, [[6, 'slap', 0.3]]),
  c(2, 'He sees Mum', X.mumHomework),
  c(2, 'He sees a pigeon', X.pigeonFuture),
  c(2, 'Not a nice one', X.lookUp),
  c(2, 'Then Max has', X.idea, [[0, 'pop', 0.3]]),
  c(2, 'The lottery', X.lottery, [[0, 'boing', 0.25]]),
  c(2, 'The draw is', X.timeline(false)),
  c(2, 'His power sees', X.timeline(true)),
  c(2, 'Of nine', X.deadpan('#2F6FD6')),
  c(2, 'quick question', X.mic('PROMOTION?')),
  c(2, 'Max', X.ignore, undefined, 4),
  // 3 brain predicts
  c(3, "Here's the thing", X.pointCam),
  c(3, 'You can already', X.viewer),
  c(3, 'Just not very', X.tiny),
  c(3, 'Light from the', X.eyeBrain),
  c(3, 'By the time', X.ghostBall),
  c(3, 'So your brain', X.predictLine),
  c(3, 'It guesses', X.predictLand),
  c(3, "It's how a tennis", X.tennis, [[12, 'slap', 0.3]]),
  c(3, "They're not reacting", X.react(false)),
  c(3, "They're predicting", X.react(true), [[0, 'pop', 0.3]]),
  c(3, "So you've been", X.bars(0)),
  c(3, 'About a tenth', X.tiny, undefined, 2),
  c(3, 'Max just got', X.bars(1), [[0, 'whoosh', 0.3]]),
  c(3, 'Nine-oh-eight', X.blinkAgain, [[0, 'lowhit', 0.35]]),
  c(3, 'And the vision', X.visFireworks, [[4, 'crack', 0.25]]),
  // 4 plan A
  c(4, 'A festival', X.visFestival),
  c(4, 'A poster', X.visPoster),
  c(4, 'And the balloon', X.visDuckRise, [[0, 'wind', 0.25]]),
  c(4, 'shaped like a duck', X.visDuckFace),
  c(4, 'Plan A', X.planA, [[0, 'slap', 0.35]]),
  c(4, 'If Max never', X.locks, [[0, 'tick', 0.3], [8, 'tick', 0.3], [16, 'tick', 0.3]]),
  c(4, 'Nine-twelve', X.van, [[0, 'carby', 0.3]]),
  c(4, 'Sir Biscuit has', X.ears),
  c(4, "It's always", X.foodBub, [[0, 'pop', 0.3]]),
  c(4, "He's through", X.flap, [[0, 'slap', 0.3], [6, 'dog', 0.3]]),
  c(4, "He's gone", X.hedge),
  c(4, 'Plan A lasted', X.window, [[8, 'slap', 0.3]]),
  // 5 chase
  c(5, 'So Max runs', X.run('street'), [[0, 'whoosh', 0.25]]),
  c(5, 'Through the market', X.run('market')),
  c(5, 'Past the bakery', X.run('bakery')),
  c(5, 'Down the hill', X.run('hill')),
  c(5, "And here's the problem", X.problem),
  c(5, 'He can see exactly', X.oneHourIcon),
  c(5, 'Which is no help', X.cartFreeze),
  c(5, 'in one second', X.splat, [[0, 'slap', 0.45]]),
  c(5, 'He goes through', X.cake, [[6, 'slap', 0.35]]),
  c(5, 'He borrows', X.skateGrab),
  c(5, 'He does not', X.skateDown, [[0, 'whoosh', 0.3]]),
  c(5, 'The van turns', X.vanTurn, [[0, 'carby', 0.25]]),
  c(5, 'So Max takes', X.drainpipe),
  c(5, 'Across the rooftops', X.rooftops, [[0, 'wind', 0.25]]),
  c(5, 'Max has never', X.edge),
  c(5, 'Jump one', X.jump(1), [[10, 'jump', 0.3]]),
  c(5, 'Jump two', X.jump(2), [[10, 'jump', 0.3]]),
  c(5, 'Jump three', X.jump(3), [[6, 'jump', 0.3]]),
  c(5, 'less perfect', X.laundry, [[0, 'slap', 0.4]]),
  c(5, 'Lying in the', X.lying),
  c(5, "Like he's been", X.echo),
  c(5, 'Déjà vu', X.dejaVu, [[0, 'spin', 0.25]]),
  c(5, "And that's real", X.real('NOT THE FUTURE')),
  c(5, 'Some scientists think', X.inspector(false)),
  c(5, 'and flagging', X.inspector(true), [[0, 'pop', 0.3]]),
  c(5, "It's actually a sign", X.real('HEALTHY')),
  c(5, "Max's memory", X.pantsOff),
  c(5, 'His day is not', X.deadpan('#9ED8F0')),
  c(5, 'Nine-thirty', X.blinkAgain, [[0, 'lowhit', 0.35]]),
  c(5, 'Dave is in', X.visDave),
  c(5, 'Because the balloon', X.visDaveDuck),
  // 6 plan B + butterfly
  c(6, 'Plan B', X.planB, [[0, 'slap', 0.35]]),
  c(6, 'Max phones Dave', X.split),
  c(6, 'Dave whatever', X.phoneClose),
  c(6, 'Dave has never', X.cereal),
  c(6, 'without immediately', X.stroll),
  c(6, 'Great plan', X.facepalm, [[0, 'slap', 0.3]]),
  c(6, 'Every time Max', X.branches),
  c(6, 'And this is real', X.real('REAL')),
  c(6, 'In 1961', X.lorenz, [[0, 'typing', 0.3]]),
  c(6, 'and typed', X.numbers),
  c(6, 'A difference smaller', X.crumb),
  c(6, 'His whole forecast', X.printout),
  c(6, 'completely different', X.maps('both')),
  c(6, 'Sunshine in one', X.maps('sun')),
  c(6, 'Storms in the other', X.maps('storm'), [[0, 'wind', 0.3]]),
  c(6, "It's called the butterfly", X.butterfly),
  c(6, 'Tiny change', X.tinyBig),
  c(6, "It's why a ten-day", X.forecast),
  c(6, 'Which means every', X.threads),
  c(6, 'pushed him', X.duckFace),
  // 7 plan C
  c(7, 'Plan C', X.planC, [[0, 'slap', 0.35]]),
  c(7, 'No balloon', X.pinHold),
  c(7, 'Nine-forty-eight', X.sneak('gate')),
  c(7, 'Past the hot dog', X.sneak('hotdog')),
  c(7, 'Under the stage', X.sneak('stage')),
  c(7, 'Right up to', X.duckLoom),
  c(7, 'And a security', X.guard, [[0, 'lowhit', 0.35]]),
  c(7, 'Max runs', X.bouncy, [[6, 'boing', 0.3], [26, 'boing', 0.3]]),
  c(7, 'Through the hall', X.mirrors),
  c(7, 'where there are', X.guardSpin),
  c(7, 'which one is real', X.mirrors),
  c(7, 'Through the dodgems', X.dodgems(false)),
  c(7, 'Over the dodgems', X.dodgems(true), [[0, 'jump', 0.3]]),
  c(7, 'Into a giant', X.candyFloss, [[0, 'pop', 0.3]]),
  c(7, 'He escapes', X.sticky),
  c(7, "And he's lost", X.pockets),
  c(7, 'And when he looks', X.looksUp),
  c(7, 'Exactly where', X.duckAbove, [[0, 'lowhit', 0.35]]),
  // 8 the duck
  c(8, 'Nine-fifty-five', X.festWide),
  c(8, "And who's sitting", X.basketDog),
  c(8, 'Sir Biscuit', X.dogCool),
  c(8, 'Max jumps in', X.leap, [[6, 'jump', 0.3]]),
  c(8, "And who's been", X.rope),
  c(8, 'Dave looks up', X.daveEyes),
  c(8, 'Dave sees the duck', X.duckFace),
  c(8, 'Dave lets go', X.letGo, [[4, 'whoosh', 0.35]]),
  c(8, 'Then he panics', X.dive),
  c(8, 'Ten a.m.', X.rise, [[0, 'wind', 0.35]]),
  c(8, 'And right on time', X.basketPOV),
  c(8, 'the fireworks', X.fireworks, [[2, 'crack', 0.4], [14, 'lowhit', 0.4], [30, 'crack', 0.3], [60, 'crack', 0.3]]),
  // 9 DON'T GO
  c(9, "Dave can't", X.fwFace),
  c(9, 'He climbs onto', X.daveEdge),
  c(9, "He's going to jump", X.drop),
  c(9, 'And Max screams', X.inhale),
  c(9, "DON'T GO", X.dontGo(false), [[0, 'lowhit', 0.55]]),
  c(9, 'He was saving', X.match),
  c(9, 'So Max does', X.calm),
  c(9, 'He blinks', X.blink2, [[0, 'whoosh', 0.3]]),
  c(9, 'and looks at eleven', X.vis11),
  c(9, 'Then he tells', X.shoulders),
  c(9, 'And this is real', X.real('REAL')),
  c(9, 'In one study', X.study),
  c(9, 'a fifty-fifty chance', X.meters(0)),
  c(9, 'than when they', X.meters(1)),
  c(9, 'Not knowing', X.notKnowing),
  c(9, 'So Max takes', X.talk),
  c(9, 'In ten minutes', X.visLand),
  c(9, 'In twenty', X.daveLaugh),
  c(9, 'Dave climbs down', X.sitDown, [[4, 'dog', 0.3]]),
  // 10 landing
  c(10, 'Then the burner', X.burner(false), [[0, 'sizzle', 0.35]]),
  c(10, 'The flame shrinks', X.burner(true)),
  c(10, 'The fuel gauge', X.fuel, [[0, 'alarm', 0.25]]),
  c(10, 'Second problem', X.second),
  c(10, "You can't steer", X.drift, [[0, 'wind', 0.25]]),
  c(10, 'But the wind', X.winds(0, 3)),
  c(10, 'So pilots go', X.winds(1, 3)),
  c(10, 'Up', X.winds(1, 0), [[0, 'whoosh', 0.2]], 2),
  c(10, 'Down', X.winds(1, 3), [[0, 'whoosh', 0.2]]),
  c(10, 'Up a tiny', X.winds(2, 2), [[16, 'pop', 0.3]]),
  c(10, 'They drift', X.overStadium),
  c(10, 'Sixty thousand', X.crowdUp),
  c(10, 'And the duck lands', X.descend),
  c(10, 'right on the centre', X.touchdown, [[0, 'lowhit', 0.4], [4, 'cans', 0.3]]),
  c(10, 'The festival gives', X.sausages),
  c(10, 'Sir Biscuit has', X.dogPile, [[0, 'dog', 0.3]]),
  c(10, 'Dave kisses', X.kissGrass),
  // 11 ending
  c(11, 'Max learned', X.sunset),
  c(11, "You can't always", X.warmFace),
  c(11, 'But you can make', X.together),
  c(11, 'If you could', X.comments, [[4, 'pop', 0.25], [12, 'pop', 0.25], [20, 'pop', 0.25]]),
  c(11, 'And Max the', X.mic('PROMOTION?')),
  c(11, 'He says to watch', X.pigeonEnd, [[40, 'boing', 0.3]]),
];

const SOFT = (n: string) => staticFile(`mem/sfx/${n}.mp3`);
const VO_FILES = Array.from({ length: 11 }, (_, i) => `future/vo${String(i + 1).padStart(2, '0')}.mp3`);

export const FutureEpisode: React.FC = () => {
  const cues = [...CUES].sort((a, b) => a[0] - b[0]);
  const fw = at(8, 'the fireworks');
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {cues.map(([t, el, sfx], i) => {
        const d = (cues[i + 1]?.[0] ?? TOTAL_FRAMES) - t;
        return (
          <Sequence key={i} from={t} durationInFrames={Math.max(1, d)}>
            {el(d)}
            {(sfx ?? []).map(([o, n, v], j) => (
              <Sequence key={j} from={o} durationInFrames={120}><Audio src={SOFT(n)} volume={v * 0.9} /></Sequence>
            ))}
          </Sequence>
        );
      })}
      <Countdown />
      <Captions words={CAPTION_WORDS} />
      {VO_FILES.map((src, i) => (
        <Sequence key={src} from={secStart(i + 1)}><Audio src={staticFile(src)} volume={1} /></Sequence>
      ))}
      <Sequence from={0} durationInFrames={secStart(5)}>
        <Audio src={staticFile('ep/music-fun.mp3')} loop volume={(f) => interpolate(f, [0, 15, secStart(5) - 30, secStart(5)], [0, 0.1, 0.1, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
      <Sequence from={secStart(5)} durationInFrames={secStart(9) - secStart(5)}>
        <Audio src={staticFile('ep/music-tense.mp3')} loop volume={(f) => {
          const b = fw - secStart(5), e = secStart(9) - secStart(5);
          return interpolate(f, [0, 30, b - 20, b, e - 20, e], [0, 0.09, 0.09, 0.14, 0.14, 0], { extrapolateRight: 'clamp' });
        }} />
      </Sequence>
      <Sequence from={secStart(9)} durationInFrames={TOTAL_FRAMES - secStart(9)}>
        <Audio src={staticFile('ep/music-end.mp3')} loop volume={(f) => interpolate(f, [0, 40, TOTAL_FRAMES - secStart(9) - 60, TOTAL_FRAMES - secStart(9)], [0, 0.1, 0.1, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
    </AbsoluteFill>
  );
};
export { TOTAL_FRAMES as FUTURE_FRAMES };
