// What If You Could Read Minds? Full episode, every shot cued to a narration phrase.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Max, Dog, STAND, PANIC, SHRUG, WAVE, POINT, HOLD, walkPose, runPose, MUM, DAVE, TEACHER, INK, MaxProps, Look } from '../max/Max';
import { Cam, CamKey, Stage, Captions, Burst, Confetti, BigNum, Vignette, ExamHall, Bathroom, lerp, remap, FONT, W, H } from '../mem/kit';
import { WOMAN, Label, Rays, Bedroom, Office, Sepia, Cake, MicStand, Stamp, Bus } from '../mem/lib';
import { at, secStart, TOTAL_FRAMES, CAPTION_WORDS } from './timing';

const F = () => useCurrentFrame();
const ZOE: Look = WOMAN;
const CLERK: Look = { ...WOMAN, jacket: '#3FA7A0', jacketDark: '#2A7A75', hairColor: '#7A3A1A', shoes: '#2B2B2B' };
const STRANGER: Look = { jacket: '#9AA3B5', jacketDark: '#6E7787', pants: '#3A3F58', shoes: '#2B2B2B', sole: '#888', skin: INK };
const GOLD = '#FFE45C';
const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({ x, y, s = 1, r = 0, o = 1, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>{children}</g>
);
type MP = MaxProps & { flip?: boolean; glow?: number; paste?: boolean };
/** glowing mind-reader eyes, drawn in Max's own coordinates */
const EyeGlow: React.FC<{ k?: number }> = ({ k = 1 }) => {
  const f = F(); const a = k * (0.8 + 0.2 * Math.sin(f / 4));
  return <g opacity={a} style={{ pointerEvents: 'none' }}>
    <g style={{ filter: 'blur(9px)' }} opacity={0.4}><circle cx={-34} cy={-312} r={44} fill={GOLD} /><circle cx={34} cy={-312} r={44} fill={GOLD} /></g>
    <circle cx={-34} cy={-312} r={30} fill="none" stroke={GOLD} strokeWidth={4} opacity={0.6} /><circle cx={34} cy={-312} r={30} fill="none" stroke={GOLD} strokeWidth={4} opacity={0.6} />
  </g>;
};
const Paste: React.FC = () => <path transform="translate(14 28)" d="M44 -262 q14 -18 30 -6 q16 4 8 22 q-10 14 -28 8 q-18 -6 -10 -24 Z" fill="#F4FBFF" stroke="#9ED8F0" strokeWidth={4} />;
const body = (p: MP, head = false) => {
  const { flip, glow, paste, ...mp } = p;
  const inner = <>{head ? <Max headOnly {...mp} /> : <Max {...mp} />}{paste && <Paste />}{glow ? <EyeGlow k={glow} /> : null}</>;
  return flip ? <g transform="scale(-1 1)">{inner}</g> : inner;
};
const M = (x: number, y: number, s: number, p: MP = {}) => <At x={x} y={y} s={s}>{body(p)}</At>;
/** close-ups (s >= 1.7) keep the jacket and shoulders in frame so Max always reads as Max; small icons stay head-only */
const Head = (x: number, y: number, s: number, p: MP = {}) => <At x={x} y={s < 1.7 ? y : y - 110} s={s}><g transform="translate(0 300)">{body(p, s < 1.7)}</g></At>;
type CamP = { a?: CamKey; b?: CamKey; shake?: number; whip?: number; tilt?: number };
const sc = (render: (f: number, d: number) => React.ReactNode, cam: CamP = {}) => (d: number) => {
  const C = () => { const f = F(); return <>{render(f, d)}</>; };
  return <Cam a={cam.a ?? { z: 1 }} b={cam.b ?? { z: 1.06 }} dur={d} shake={cam.shake} whip={cam.whip} tilt={cam.tilt}><C /></Cam>;
};
const PUSH: CamP = { a: { z: 1 }, b: { z: 1.08 } };
const HOLDC: CamP = { a: { z: 1 }, b: { z: 1 } };
const LOW: CamP = { a: { z: 1.04, y: 30 }, b: { z: 1.1, y: 50 }, tilt: -4 };
const dark = (t = 0, bg = '#1F2347', ray = '#262B57') => <Rays bg={bg} ray={ray} t={t} />;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 * k + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- graphics ----------
/** thought bubble; (tx, ty) points from the bubble centre to the thinker's head */
const Bub: React.FC<{ x: number; y: number; w?: number; h?: number; p?: number; tx?: number; ty?: number; fill?: string; children?: React.ReactNode }> = ({ x, y, w = 440, h = 250, p = 1, tx = 0, ty = 260, fill = '#fff', children }) => {
  const n = 11; const lobes = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [Math.cos(a) * w * 0.42, Math.sin(a) * h * 0.4, Math.min(w, h) * 0.3] as const; });
  const s = Math.max(0.001, p);
  return (
    <g transform={`translate(${x} ${y})`}>
      {p > 0.3 && [0.62, 0.78, 0.9].map((k, i) => <circle key={i} cx={tx * k} cy={ty * k} r={22 - i * 6} fill={fill} stroke={INK} strokeWidth={6} />)}
      <g transform={`scale(${s})`}>
        {lobes.map(([lx, ly, r], i) => <circle key={'o' + i} cx={lx} cy={ly} r={r} fill={fill} stroke={INK} strokeWidth={10} />)}
        {lobes.map(([lx, ly, r], i) => <circle key={'i' + i} cx={lx} cy={ly} r={r - 5} fill={fill} />)}
        <ellipse rx={w * 0.44} ry={h * 0.42} fill={fill} />
        {children}
      </g>
    </g>
  );
};
const Static: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const f = F();
  return <g>{Array.from({ length: 70 }, (_, i) => <rect key={i} x={(rnd(i + f * 3) - 0.5) * w * 0.8} y={(rnd(i + f * 5, 2) - 0.5) * h * 0.7} width={18 + rnd(i, 3) * 40} height={6} fill={rnd(i + f, 4) > 0.5 ? '#3A3D48' : '#9AA3B5'} />)}</g>;
};
const Notes: React.FC<{ speed?: number; fall?: number }> = ({ speed = 1, fall = 0 }) => {
  const f = F();
  return <g>{[-130, -40, 50, 140].map((x, i) => <g key={i} transform={`translate(${x} ${Math.sin(f / (6 / speed) + i) * 18 + fall * (200 + i * 60)}) rotate(${fall * (i % 2 ? 60 : -50)})`} opacity={1 - fall * 0.8}><ellipse cx={0} cy={20} rx={22} ry={16} fill={INK} /><rect x={16} y={-50} width={8} height={70} fill={INK} /><path d="M24 -50 q30 10 24 34" stroke={INK} strokeWidth={8} fill="none" /></g>)}</g>;
};
const Duck: React.FC<{ squeak?: number }> = ({ squeak = 0 }) => (
  <g transform={`scale(${1 + squeak * 0.08} ${1 - squeak * 0.08})`}>
    <ellipse cx={0} cy={0} rx={110} ry={70} fill="#FFD21F" stroke={INK} strokeWidth={8} />
    <path d="M60 -10 Q120 -30 110 30" fill="#FFC107" stroke={INK} strokeWidth={6} />
    <circle cx={-70} cy={-80} r={58} fill="#FFD21F" stroke={INK} strokeWidth={8} />
    <path d="M-124 -82 L-170 -70 L-124 -58 Z" fill="#FF8A1F" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={-84} cy={-94} r={10} fill={INK} />
  </g>
);
const Note: React.FC<{ paw?: number }> = ({ paw = 0 }) => (
  <g>
    <rect x={-300} y={-200} width={600} height={400} fill="#FFF7DC" stroke={INK} strokeWidth={8} />
    {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-260} y1={-110 + i * 70} x2={260} y2={-110 + i * 70} stroke="#C9DDF0" strokeWidth={3} />)}
    <text x={-250} y={-90} fontFamily={FONT} fontWeight={800} fontSize={46} fill={INK} transform="rotate(-3)">I CAN READ</text>
    <text x={-240} y={-20} fontFamily={FONT} fontWeight={800} fontSize={46} fill={INK} transform="rotate(2)">MINDS TOO.</text>
    <text x={-150} y={110} fontFamily={FONT} fontWeight={900} fontSize={70} fill="#C42222" transform="rotate(-4)">MIDNIGHT.</text>
    <g transform="translate(220 140)" opacity={0.55 + paw * 0.45}>
      <ellipse cx={0} cy={10} rx={30} ry={24} fill="#7A4A22" />
      {[[-30, -26], [-10, -40], [14, -40], [32, -24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#7A4A22" />)}
    </g>
    {paw > 0 && <circle cx={220} cy={130} r={90 + Math.sin(paw * 20) * 6} fill="none" stroke="#E53935" strokeWidth={10} />}
  </g>
);
const ClockFace: React.FC<{ t: string; red?: boolean }> = ({ t, red }) => {
  const f = F();
  return <g><rect x={-480} y={-160} width={960} height={320} rx={40} fill="#0B0C18" stroke={red ? '#FF5A4E' : '#FFD21F'} strokeWidth={10} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={900} fontSize={210} fill={red ? '#FF5A4E' : '#FFD21F'}>{(f % 30) < 15 ? t : t.replace(':', ' ')}</text></g>;
};
const ClockCard = (t: string, red = false) => sc((f) => (
  <Stage bg={red ? '#5A0F14' : '#14152A'}>
    <Rays bg={red ? '#5A0F14' : '#14152A'} ray={red ? '#6E141B' : '#1C1E3A'} t={f} />
    <At x={960} y={500} s={lerp(f, 0, 6, 1.25, 1)}><ClockFace t={t} red={red} /></At>
    <At x={960} y={760} o={0.7}><Label x={0} y={0} t="UNTIL MIDNIGHT" size={54} /></At>
  </Stage>
), { a: { z: 1 }, b: { z: 1.03 }, shake: 0.4 });
const SUSPECTS: [string, Look][] = [['ZOE', ZOE], ['TEACHER', TEACHER], ['OFFICE', CLERK], ['DAVE', DAVE], ['MUM', MUM]];
const SuspectCard = (n: number, name: string, outfit: Look, bg: string, slow = false) => sc((f) => (
  <Stage bg={bg}><Rays bg={bg} ray="rgba(255,255,255,0.07)" t={f} />
    <At x={960} y={520} s={lerp(f, 0, slow ? 18 : 6, slow ? 0.9 : 1.4, 1)} r={-3}>
      <rect x={-330} y={-380} width={660} height={760} rx={20} fill="#FFF7DC" stroke={INK} strokeWidth={10} />
      <rect x={-280} y={-330} width={560} height={480} fill="#2B2F4A" />
      {Head(0, -80, 2, { outfit, expr: 'blank', still: true })}
      <Label x={0} y={220} t={`SUSPECT ${n}`} size={64} color="#C42222" />
      <Label x={0} y={310} t={name} size={72} color={INK} />
    </At>
  </Stage>
), { a: { z: 1 }, b: { z: 1.03 } });
/** suspect board: crossed names get a red X, `fresh` animates in */
const Board: React.FC<{ crossed: string[]; fresh?: string; circled?: string; viewer?: boolean }> = ({ crossed, fresh, circled, viewer }) => {
  const f = F();
  const slots = viewer ? [...SUSPECTS, ['YOU', MAX_GREY] as [string, Look]] : SUSPECTS;
  return (
    <g>
      <rect width={W} height={H} fill="#7A5232" />
      <rect x={80} y={80} width={1760} height={920} rx={20} fill="#C8A276" stroke="#5A3A20" strokeWidth={16} />
      {slots.map(([n, o], i) => {
        const cols = slots.length; const x = 960 + (i - (cols - 1) / 2) * (1600 / cols); const y = 520 + (i % 2 ? 40 : -30);
        const isX = crossed.includes(n); const p = n === fresh ? lerp(f, 4, 14, 0, 1) : 1;
        return (
          <g key={n} transform={`translate(${x} ${y}) rotate(${(i % 2 ? 3 : -3)})`}>
            <rect x={-130} y={-190} width={260} height={360} fill="#FFF7DC" stroke={INK} strokeWidth={6} />
            <rect x={-110} y={-170} width={220} height={220} fill="#2B2F4A" />
            {n === 'YOU' ? <Label x={0} y={-60} t="?" size={180} color={GOLD} /> : Head(0, -50, 0.95, { outfit: o, expr: isX ? 'happy' : 'blank', still: true })}
            <Label x={0} y={110} t={n} size={40} color={INK} />
            <circle cx={0} cy={-190} r={14} fill="#E53935" stroke={INK} strokeWidth={4} />
            {isX && <g stroke="#E53935" strokeWidth={22} strokeLinecap="round"><line x1={-120} y1={-170} x2={-120 + 240 * Math.min(1, p * 2)} y2={-170 + 330 * Math.min(1, p * 2)} /><line x1={120} y1={-170} x2={120 - 240 * Math.max(0, p * 2 - 1)} y2={-170 + 330 * Math.max(0, p * 2 - 1)} /></g>}
            {circled === n && <ellipse rx={190} ry={250} fill="none" stroke="#E53935" strokeWidth={14} strokeDasharray={`${lerp(f, 2, 16, 0, 1400)} 2000`} />}
          </g>
        );
      })}
    </g>
  );
};
const MAX_GREY: Look = { jacket: '#666', jacketDark: '#444', pants: '#444', shoes: '#333', sole: '#777', skin: INK };
const Brain: React.FC<{ seed: number; lit?: number; c?: string }> = ({ seed, lit = 1, c = GOLD }) => {
  const f = F();
  return <g>
    <path d="M-200 40 Q-230 -120 -90 -160 Q0 -220 100 -160 Q230 -130 210 20 Q220 120 110 140 Q0 170 -100 140 Q-210 130 -200 40 Z" fill="#F29BB8" stroke={INK} strokeWidth={10} />
    {[-120, -40, 40, 120].map((x, i) => <path key={i} d={`M${x} -140 q30 50 0 100 q-30 50 0 120`} fill="none" stroke="#D96F95" strokeWidth={10} />)}
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(rnd(i, seed) - 0.5) * 340} cy={(rnd(i, seed + 7) - 0.5) * 240} r={14} fill={c} opacity={lit * (0.5 + 0.5 * Math.sin(f / 5 + i))} />)}
  </g>;
};
const KeyIcon: React.FC = () => <g><circle cx={-90} r={44} fill="none" stroke="#F2C14E" strokeWidth={20} /><path d="M-46 0 L110 0 M70 0 L70 36 M100 0 L100 30" stroke="#F2C14E" strokeWidth={20} strokeLinecap="round" /></g>;
const Heart: React.FC<{ s?: number }> = ({ s = 1 }) => <path transform={`scale(${s})`} d="M0 30 C-60 -10 -40 -60 0 -30 C40 -60 60 -10 0 30 Z" fill="#E53935" stroke={INK} strokeWidth={5} />;
const Waves: React.FC<{ mode: 'one' | 'red' }> = ({ mode }) => {
  const f = F();
  return <g>{Array.from({ length: 9 }, (_, i) => { const y = 160 + i * 95; const hi = mode === 'one' && i === 4; const col = mode === 'red' ? '#FF5A4E' : hi ? GOLD : '#5A607A';
    return <path key={i} d={Array.from({ length: 49 }, (_, k) => `${k ? 'L' : 'M'}${120 + k * 35} ${y + Math.sin(k / 2 + f / 4 + i) * (hi || mode === 'red' ? 30 : 14)}`).join(' ')} fill="none" stroke={col} strokeWidth={hi ? 14 : 8} opacity={hi || mode === 'red' ? 1 : 0.5} />; })}</g>;
};
const Robot: React.FC = () => <g><rect x={-120} y={-140} width={240} height={220} rx={24} fill="#9AA3B5" stroke={INK} strokeWidth={8} /><rect x={-80} y={-90} width={50} height={40} fill="#E53935" /><rect x={30} y={-90} width={50} height={40} fill="#E53935" /><rect x={-60} y={10} width={120} height={20} fill={INK} /><line x1={0} y1={-140} x2={0} y2={-200} stroke={INK} strokeWidth={8} /><circle cy={-210} r={16} fill="#FFD21F" stroke={INK} strokeWidth={5} /></g>;
const Hood: React.FC = () => <g><path d="M-140 160 Q-160 -160 0 -180 Q160 -160 140 160 Z" fill="#2B2F4A" stroke={INK} strokeWidth={8} /><ellipse cx={0} cy={-30} rx={80} ry={90} fill="#0B0C18" /><circle cx={-26} cy={-40} r={8} fill={GOLD} /><circle cx={26} cy={-40} r={8} fill={GOLD} /><g transform="translate(90 100) rotate(10) scale(0.25)"><Note /></g></g>;
const Sun: React.FC<{ t: number }> = ({ t }) => <circle cx={200 + t * 1520} cy={500 - Math.sin(t * Math.PI) * 380} r={90} fill="#FFD21F" stroke="#FFB300" strokeWidth={8} />;
const Cup: React.FC = () => <g><rect x={-40} y={-50} width={80} height={80} rx={12} fill="#fff" stroke={INK} strokeWidth={6} /><path d="M40 -30 q30 0 30 25 q0 25 -30 25" fill="none" stroke={INK} strokeWidth={6} /><path d="M-10 -70 q10 -20 0 -40 M14 -70 q10 -20 0 -40" stroke="#fff" strokeWidth={5} fill="none" opacity={0.7} /></g>;
const Toast: React.FC = () => <g><rect x={-70} y={-60} width={140} height={120} rx={30} fill="#E2A15B" stroke={INK} strokeWidth={7} /><rect x={-54} y={-44} width={108} height={90} rx={22} fill="#F6D6A8" /></g>;
const Ball: React.FC = () => <g><circle r={50} fill="#fff" stroke={INK} strokeWidth={7} /><path d="M-20 -20 L20 -20 L28 14 L0 34 L-28 14 Z" fill={INK} /></g>;
const Crayon: React.FC = () => <g><rect x={-90} y={-14} width={170} height={28} rx={6} fill="#E53935" stroke={INK} strokeWidth={5} /><path d="M80 -14 L120 0 L80 14 Z" fill="#E53935" stroke={INK} strokeWidth={5} /></g>;

// ---------- sets ----------
const BusIn: React.FC = () => (
  <g><rect width={W} height={H} fill="#5B8FD9" />{[0, 1, 2, 3].map((i) => <rect key={i} x={80 + i * 470} y={140} width={400} height={300} rx={30} fill="#BFE6F7" stroke={INK} strokeWidth={10} />)}
    {[0, 1, 2, 3].map((i) => <rect key={'b' + i} x={80 + i * 470 + ((F() * 8) % 400)} y={300} width={60} height={140} fill="#7FB685" opacity={0.6} />)}
    <rect y={760} width={W} height={320} fill="#3A3F58" /><rect x={0} y={80} width={W} height={20} fill="#FFD21F" /></g>
);
const Cafe: React.FC = () => <g><rect width={W} height={H} fill="#E8C9A0" />{Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 200} y={0} width={100} height={700} fill="#E1BE92" />)}<rect y={700} width={W} height={380} fill="#8E6845" /><rect x={600} y={740} width={720} height={40} rx={10} fill="#5A3A20" /></g>;
const Lab: React.FC<{ on?: number }> = ({ on = 1 }) => (
  <g><rect width={W} height={H} fill="#DDF2FA" /><rect y={800} width={W} height={280} fill="#B9D3DE" />
    <circle cx={760} cy={560} r={330} fill="#F2F6F8" stroke={INK} strokeWidth={12} /><circle cx={760} cy={560} r={170} fill="#22252E" stroke={INK} strokeWidth={10} />
    <rect x={760} y={500} width={900} height={120} rx={20} fill="#C7CDD8" stroke={INK} strokeWidth={8} />
    <rect x={1460} y={180} width={360} height={240} rx={16} fill="#22252E" stroke={INK} strokeWidth={8} />
    {[0, 1, 2].map((i) => <rect key={i} x={1490} y={220 + i * 60} width={Math.min(300, (F() * 10 - i * 80)) * on} height={26} rx={8} fill="#3DE07A" />)}
  </g>
);
const Aisle: React.FC = () => <g><rect width={W} height={H} fill="#F3EEE4" />{[0, 1].map((s) => <g key={s}>{[0, 1, 2, 3].map((r) => <rect key={r} x={s ? 1260 : 0} y={140 + r * 170} width={660} height={20} fill="#9AA3B5" />)}{Array.from({ length: 24 }, (_, i) => <rect key={'c' + i} x={(s ? 1280 : 20) + (i % 6) * 105} y={70 + Math.floor(i / 6) * 170} width={80} height={70} fill={['#E53935', '#FFD21F', '#3DBE7A', '#2F6FD6'][i % 4]} stroke={INK} strokeWidth={4} />)}</g>)}<rect y={820} width={W} height={260} fill="#D8D2C4" /></g>;
const Stadium: React.FC<{ t?: number; night?: boolean }> = ({ t = 0, night = true }) => (
  <g><rect width={W} height={H} fill={night ? '#14152A' : '#9ED8F0'} />
    {[0, 1, 2, 3, 4].map((r) => <rect key={r} x={0} y={180 + r * 90} width={W} height={90} fill={r % 2 ? '#2B2F4A' : '#262A44'} />)}
    {Array.from({ length: 160 }, (_, i) => <circle key={i} cx={(i % 40) * 49 + 20} cy={210 + Math.floor(i / 40) * 90 + Math.sin(t / 5 + i) * 4} r={16} fill={['#E53935', '#FFD21F', '#2F6FD6', '#F2F2F2'][i % 4]} opacity={0.8} />)}
    <rect y={640} width={W} height={440} fill="#2E8B57" />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i * 340} y={640} width={170} height={440} fill="#329A60" />)}
    <path d="M960 640 L960 1080" stroke="#fff" strokeWidth={8} opacity={0.6} /><ellipse cx={960} cy={860} rx={220} ry={90} fill="none" stroke="#fff" strokeWidth={8} opacity={0.6} />
    {[200, 1720].map((x) => <g key={x}><rect x={x - 8} y={0} width={16} height={180} fill="#3A3D48" /><rect x={x - 70} y={0} width={140} height={60} fill="#FFF6C2" /></g>)}
  </g>
);
const NightKitchen: React.FC = () => (
  <g><rect width={W} height={H} fill="#2A2F55" /><rect x={760} y={120} width={400} height={300} fill="#0F1433" stroke={INK} strokeWidth={12} /><circle cx={1060} cy={200} r={40} fill="#F4EBC0" />
    <path d="M960 0 L960 120" stroke={INK} strokeWidth={6} /><path d="M900 120 L1020 120 L990 160 L930 160 Z" fill="#FFD21F" /><path d="M930 160 L520 900 L1400 900 L990 160 Z" fill="#FFE29A" opacity={0.18} />
    <rect y={760} width={W} height={320} fill="#3A3360" /><rect x={480} y={700} width={960} height={50} rx={10} fill="#8E6845" stroke={INK} strokeWidth={8} /><rect x={540} y={750} width={30} height={300} fill="#6B4A2E" /><rect x={1350} y={750} width={30} height={300} fill="#6B4A2E" /></g>
);
const DayKitchen: React.FC = () => (
  <g><rect width={W} height={H} fill="#F6E3B4" /><rect x={760} y={120} width={400} height={300} fill="#BFE6F7" stroke={INK} strokeWidth={12} /><circle cx={1060} cy={210} r={50} fill="#FFD21F" />
    <rect y={760} width={W} height={320} fill="#C9A27A" /><rect x={480} y={700} width={960} height={50} rx={10} fill="#8E6845" stroke={INK} strokeWidth={8} /><rect x={540} y={750} width={30} height={300} fill="#6B4A2E" /><rect x={1350} y={750} width={30} height={300} fill="#6B4A2E" /></g>
);
const Door: React.FC<{ open: number; bg?: string; color?: string }> = ({ open, bg = '#0B0C18', color = '#8E5BD6' }) => (
  <g><rect x={760} y={200} width={400} height={800} fill={bg} /><path d={`M760 200 L${1160 - open * 300} ${200 + open * 40} L${1160 - open * 300} ${1000 - open * 40} L760 1000 Z`} fill={color} stroke={INK} strokeWidth={10} /><circle cx={1110 - open * 290} cy={620} r={14} fill="#FFD21F" opacity={1 - open} /></g>
);
const DaveHouse: React.FC<{ t?: number; sky?: string }> = ({ t = 0, sky = '#9ED8F0' }) => (
  <g><rect width={W} height={H} fill={sky} /><rect y={900} width={W} height={180} fill="#7FB685" /><rect x={460} y={260} width={1000} height={660} fill="#E8836B" stroke={INK} strokeWidth={10} /><path d="M400 280 L960 60 L1520 280 Z" fill="#8E3B2E" stroke={INK} strokeWidth={10} />
    <rect x={560} y={380} width={360} height={260} fill="#DDF2FA" stroke={INK} strokeWidth={10} /><rect x={1080} y={560} width={240} height={360} fill="#3DBE7A" stroke={INK} strokeWidth={10} /></g>
);

// ================= scenes =================
const X = {
  // ---- 1 cold open
  bedWake: sc((f) => <Stage><Bedroom />{M(1080, 760, 0.95, { expr: f < 12 ? { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'flat' } : 'shocked', pose: { ...STAND, hipL: -80, knL: 80, hipR: -80, knR: 80 }, glow: f < 12 ? 0 : lerp(f, 12, 20, 0, 1) })}<At x={1500} y={790} s={0.8}><Dog expr="happy" wag={Math.sin(f / 3)} /></At></Stage>, PUSH),
  wake: sc((f) => <Stage><Bedroom />{Head(960, 560, 2.6, { expr: 'shocked', glow: 1, look: [Math.sin(f / 10) * 0.5, 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  dogFood: sc((f) => <Stage><Bedroom /><At x={1240} y={980} s={2.2}><Dog expr="happy" wag={Math.sin(f / 3)} /></At><Bub x={980} y={300} w={460} h={240} p={lerp(f, 2, 12, 0, 1)} tx={130} ty={330}><Label x={0} y={0} t="FOOD." size={110} color={INK} /></Bub>{Head(360, 760, 1.2, { expr: 'blank', glow: 0.7, look: [1, 0] })}</Stage>, PUSH),
  foodClose: sc((f) => <Stage bg="#1E2452"><Bub x={960} y={500} w={900} h={480} p={lerp(f, 0, 8, 0.8, 1)} ty={400}><Label x={0} y={0} t="FOOD." size={220} color={INK} /></Bub></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  unimpressed: sc((f) => <Stage bg="#2A2F63">{Head(960, 600, 2.6, { expr: { eyes: 'open', lid: 0.55, lidAngle: 0, mouth: 'flat' }, still: true, glow: 0.5 })}</Stage>, HOLDC),
  noteSlide: sc((f) => { const t = remap(f, [[0, 0.35]]); return <Stage bg="#2A2F63"><rect x={0} y={0} width={W} height={640} fill="#3A4380" /><rect x={560} y={-200} width={800} height={840} fill="#6B4A2E" stroke={INK} strokeWidth={10} /><rect y={640} width={W} height={440} fill="#2A2F63" /><rect x={560} y={632} width={800} height={14} fill="#FFF6C2" opacity={0.8} /><At x={960} y={640 + Math.min(t, 24) * 9} s={0.6}><g transform="scale(1 0.4)"><Note /></g></At></Stage>; }, { a: { z: 1 }, b: { z: 1.04 } }),
  note: sc((f) => <Stage bg="#2A2F63"><At x={960} y={540} s={1.45} r={-2}><Note /></At><Vignette strength={0.5} /></Stage>, { a: { z: 1 }, b: { z: 1.05 } }),
  readNote: sc((f) => <Stage bg="#2A2F63">{Head(700, 640, 2.2, { expr: 'shocked', look: [0.6, 0.4], glow: 0.6 })}<At x={1380} y={700} s={0.7} r={8}><Note /></At></Stage>, PUSH),
  clock8: ClockCard('08:00'),
  qFace: (outfit: Look, bg: string) => sc((f) => <Stage bg={bg}><Rays bg={bg} ray="rgba(255,255,255,0.06)" t={f} />{Head(800, 640, 2.2, { outfit, expr: 'blank', look: [0.6, 0] })}<At x={1380} y={520} s={lerp(f, 0, 6, 1.6, 1)}><Label x={0} y={0} t="?" size={420} color="#FF5A4E" /></At></Stage>, HOLDC),
  smugGlow: sc((f) => <Stage>{dark(f, '#3A2A6E', '#45337F')}{Head(960, 620, 2.6, { expr: 'smug', glow: 1, look: [0.5, 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  theyStare: sc((f) => <Stage bg="#0B0C18">{[[360, 'mum'], [760, 'dave'], [1160, 'teacher'], [1560, 'zoe']].map(([x, k], i) => <g key={i}>{Head(x as number, 560 + (i % 2) * 60, 1.3, { outfit: [MUM, DAVE, TEACHER, ZOE][i], expr: 'blank', look: [i < 2 ? 0.6 : -0.6, 0], glow: lerp(f, 6 + i * 3, 12 + i * 3, 0, 1) })}</g>)}</Stage>, { a: { z: 1 }, b: { z: 1.05 } }),
  title: sc((f) => <Stage bg="#0B0C18"><Rays bg="#0B0C18" ray="#16182E" t={f} />{Head(960, 420, 1.6, { expr: 'panic', glow: 1 })}<At x={960} y={760} s={lerp(f, 0, 6, 1.3, 1)}><BigNum text="READ MINDS?" size={170} color={GOLD} /></At><Label x={960} y={890} t="WHAT IF YOU COULD" size={52} /></Stage>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.6 }),
  // ---- 2 Zoe and the teacher
  zoeCard: SuspectCard(1, 'ZOE', ZOE, '#F07FA8'),
  bus: sc((f) => <Stage><BusIn />{M(560, 980, 1.2, { outfit: ZOE, expr: 'blank', prop: 'book', pose: HOLD, look: [0, 0.5] })}{M(1360, 980, 1.2, { expr: 'happy', look: [-0.8, 0], flip: true })}</Stage>, PUSH),
  focus: sc((f) => <Stage><BusIn />{Head(960, 600, 2.5, { expr: { eyes: 'squeeze', lid: 0, lidAngle: 0, mouth: 'flat' }, glow: lerp(f, 0, 14, 0.2, 1), look: [-0.6, 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  zoeInflate: sc((f) => { const t = remap(f, [[0, 0.4]]); return <Stage><BusIn />{M(620, 1000, 1.3, { outfit: ZOE, expr: 'blank', prop: 'book', pose: HOLD, look: [0, 0.5] })}<Bub x={1040} y={260} w={500} h={260} p={lerp(t, 0, 20, 0, 0.7)} tx={-380} ty={250} /></Stage>; }, HOLDC),
  maxLean: sc((f) => <Stage><BusIn />{Head(960, 620, 2.4, { expr: 'shocked', glow: 1, look: [-0.8, -0.2] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  cute: sc((f) => <Stage><BusIn /><rect width={W} height={H} fill="#F07FA8" opacity={0.25} /><Bub x={960} y={460} w={980} h={520} ty={480}><Label x={0} y={-10} t="…HE'S CUTE." size={120} color="#E53935" /></Bub>{Array.from({ length: 8 }, (_, i) => <At key={i} x={200 + i * 220} y={900 - ((f * 3 + i * 40) % 300)}><Heart s={1.3} /></At>)}</Stage>, HOLDC),
  float: sc((f) => <Stage bg="#F48CB2"><Rays bg="#F48CB2" ray="#F7A0C0" t={f} />{M(960, 900 - Math.sin(f / 10) * 30 - 60, 1.3, { expr: 'laugh', pose: { ...STAND, hipL: -30, knL: 60, hipR: 20, knR: 40, shL: -100, shR: 100 } })}{Array.from({ length: 6 }, (_, i) => <At key={i} x={960 + Math.cos(f / 15 + i) * 360} y={500 + Math.sin(f / 15 + i) * 200}><Heart /></At>)}</Stage>, PUSH),
  board: (crossed: string[], fresh?: string, circled?: string) => sc(() => <Stage><Board crossed={crossed} fresh={fresh} circled={circled} /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  clock9: ClockCard('09:00'),
  exam: sc((f) => <Stage><ExamHall />{M(1500, 1040, 1.2, { outfit: TEACHER, expr: 'blank', look: [-0.6, 0] })}{M(700, 1080, 1.1, { expr: 'smug', glow: 0.8, look: [0.9, -0.3] })}</Stage>, PUSH),
  noStudy: sc((f) => <Stage><ExamHall />{M(960, 1080, 1.4, { expr: 'smug', pose: { ...STAND, shL: -110, elL: 90, shR: 110, elR: -90 } })}<At x={1400} y={300} r={10}><rect x={-140} y={-90} width={280} height={180} fill="#fff" stroke={INK} strokeWidth={6} /><Stamp t="NO" p={lerp(f, 4, 10, 0, 1)} size={90} /></At></Stage>, PUSH),
  answers: sc((f) => <Stage><ExamHall />{M(1440, 1060, 1.2, { outfit: TEACHER, expr: 'blank', look: [-0.4, -0.6] })}<Bub x={1120} y={280} w={520} h={240} tx={300} ty={360}><Label x={0} y={0} t={f < 30 ? 'Q4 = 17' : 'Q5 = B'} size={90} color={INK} /></Bub>{M(520, 1080, 1.1, { expr: 'happy', glow: 1, look: [0.9, -0.4], pose: { ...STAND, shR: 60, elR: 60 } })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  hundred: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><At x={960} y={540} s={1.6} r={-4}><rect x={-260} y={-320} width={520} height={640} fill="#fff" stroke={INK} strokeWidth={8} />{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-200} y1={-200 + i * 80} x2={160} y2={-200 + i * 80} stroke="#C7CDD8" strokeWidth={14} strokeLinecap="round" />)}<Stamp t="100%" p={lerp(f, 2, 8, 0, 1)} size={140} color="#2E9E5B" /></At></Stage>, PUSH),
  teacherMad: sc((f) => <Stage><ExamHall />{Head(560, 620, 1.9, { outfit: TEACHER, expr: 'wince', look: [0.6, 0] })}<Bub x={1260} y={420} w={680} h={360} tx={-520} ty={160}><g>{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-220 + rnd(i + f) * 60} ${-100 + i * 20} q${100} ${-40 + rnd(i, f) * 80} ${440} ${rnd(i, 2) * 40}`} stroke={INK} strokeWidth={14} fill="none" />)}</g><At x={0} y={0} o={(f % 8) < 5 ? 1 : 0}><rect x={-160} y={-50} width={320} height={100} rx={20} fill="#E53935" /><Label x={0} y={0} t="BLEEP" size={60} /></At></Bub></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.3 }),
  teacherCar: sc((f) => <Stage><ExamHall />{Head(560, 640, 1.9, { outfit: TEACHER, expr: 'blank', look: [0.4, -0.6] })}<Bub x={1260} y={400} w={680} h={360} tx={-520} ty={200}><g transform="translate(-120 30)">{[0, 1, 2].map((i) => <rect key={i} x={-130 + i * 110} y={-30} width={90} height={60} rx={10} fill={['#9AA3B5', '#E53935', '#9AA3B5'][i]} stroke={INK} strokeWidth={4} />)}</g><Label x={190} y={0} t="?" size={160} color="#E53935" /></Bub></Stage>, PUSH),
  // ---- 3 the first rule, suspect four
  cafe: sc((f) => <Stage><Cafe />{M(1200, 1000, 1.2, { outfit: STRANGER, expr: 'blank', look: [0, 0.6] })}<At x={1200} y={720}><ellipse rx={90} ry={24} fill="#fff" stroke={INK} strokeWidth={6} /></At>{M(560, 1000, 1.2, { expr: 'happy', look: [0.8, 0] })}</Stage>, PUSH),
  squint: sc((f) => <Stage><Cafe />{Head(960, 620, 2.5, { expr: { eyes: 'squeeze', lid: 0, lidAngle: 0, mouth: 'flat' }, glow: 1, look: [0.6, 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  staticBub: sc((f) => <Stage><Cafe />{M(1100, 1020, 1.3, { outfit: STRANGER, expr: 'blank', look: [0, 0.6] })}<Bub x={1100} y={300} w={640} h={340} ty={300} fill="#C7CDD8"><Static w={640} h={340} /></Bub></Stage>, HOLDC),
  maxWhy: sc((f) => <Stage>{dark(f, '#2B6B8F', '#33789E')}{Head(960, 620, 2.5, { expr: 'shocked', look: [0, -0.5] })}<At x={1420} y={340} s={lerp(f, 0, 6, 1.4, 1)}><Label x={0} y={0} t="?" size={220} color={GOLD} /></At></Stage>, HOLDC),
  lab: sc((f) => <Stage><Lab /><At x={300} y={300}><Label x={0} y={0} t="2023" size={110} color="#2F6FD6" /></At></Stage>, PUSH),
  labText: sc((f) => <Stage bg="#22252E"><rect x={260} y={160} width={1400} height={760} rx={30} fill="#0B0C18" stroke="#3A3F58" strokeWidth={16} />{[0, 1, 2, 3].map((i) => <rect key={i} x={340} y={260 + i * 150} width={Math.max(0, Math.min(1240, (f - i * 10) * 50))} height={60} rx={16} fill="#3DE07A" opacity={0.85} />)}<At x={1600} y={230}><Brain seed={1} /></At></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  sixteen: sc((f) => { const k = lerp(f, 0, 50, 0, 1); return <Stage>{dark(f)}<At x={560} y={520} s={1.3}><Brain seed={2} lit={k} /></At><At x={1340} y={480}><rect x={-300} y={-60} width={600} height={120} rx={60} fill="#2B2F4A" stroke="#fff" strokeWidth={6} /><rect x={-290} y={-50} width={580 * k} height={100} rx={50} fill={GOLD} /></At><Label x={1340} y={680} t={`${Math.round(16 * k)} HOURS`} size={90} color={GOLD} /></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  keyFit: sc((f) => { const k = lerp(f, 0, 24, 0, 1); return <Stage>{dark(f)}<At x={560} y={540} s={1.2}><Brain seed={3} c="#3DE07A" /></At><At x={1360} y={540} s={1.2}><Brain seed={9} c="#7FB8FF" /></At><At x={560 - 400 + 300 * k} y={540}><KeyIcon /></At><At x={560} y={260} o={k > 0.9 ? 1 : 0}><Label x={0} y={0} t="FITS" size={70} color="#3DE07A" /></At></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  keyBounce: sc((f) => { const k = lerp(f, 0, 14, 0, 1), b = lerp(f, 14, 26, 0, 1); return <Stage>{dark(f)}<At x={560} y={540} s={1.2}><Brain seed={3} c="#3DE07A" /></At><At x={1360} y={540} s={1.2}><Brain seed={9} c="#7FB8FF" /></At><At x={1000 + 200 * k - 300 * b} y={540 + 200 * b} r={b * 120}><KeyIcon /></At>{f > 14 && <At x={1360} y={260}><Label x={0} y={0} t="USELESS" size={70} color="#FF5A4E" /></At>}</Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  ownLang: sc((f) => <Stage>{dark(f)}{[0, 1, 2].map((i) => <At key={i} x={420 + i * 540} y={540} s={0.9}><Brain seed={i * 5 + 1} c={['#3DE07A', '#7FB8FF', '#FF8A1F'][i]} /></At>)}<Label x={960} y={180} t="OWN LANGUAGE" size={70} color={GOLD} /></Stage>, PUSH),
  circle: sc((f) => <Stage>{dark(f)}{Head(960, 560, 1.4, { expr: 'happy', glow: 1 })}{[[MUM, 0], [DAVE, 1], [ZOE, 2], [STRANGER, 3], [STRANGER, 4]].map(([o, i]) => { const a = -Math.PI / 2 + (i as number) * (Math.PI * 2 / 5); const x = 960 + Math.cos(a) * 520, y = 560 + Math.sin(a) * 330; const known = (i as number) < 3; return <g key={i as number}>{known && <line x1={960} y1={560} x2={x} y2={y} stroke={GOLD} strokeWidth={10} opacity={0.6} />}{Head(x, y, 0.9, { outfit: o as Look, expr: known ? 'happy' : 'blank' })}{!known && <At x={x} y={y}><circle r={110} fill="#5A607A" opacity={0.8} /><Static w={200} h={200} /></At>}</g>; })}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  noteAgain: sc((f) => <Stage bg="#2A2F63"><At x={760} y={540} s={1.25} r={-2}><Note /></At><At x={1560} y={540} s={0.5}><ClockFace t="13:00" /></At><Vignette strength={0.55} /></Stage>, { a: { z: 1 }, b: { z: 1.06 } }),
  worried: sc((f) => <Stage bg="#2A2F63">{Head(960, 620, 2.5, { expr: { eyes: 'open', lid: 0, lidAngle: 0, mouth: 'wobble', sweat: true }, look: [Math.sin(f / 6) * 0.6, 0] })}</Stage>, HOLDC),
  messy: sc((f) => <Stage bg="#9ED8F0">{Head(560, 700, 1.8, { outfit: STRANGER, expr: 'blank', look: [0.6, -0.4] })}<Bub x={1240} y={420} w={780} h={420} tx={-560} ty={200}>{[['🖼', -200, -40], ['♥', 0, 40], ['…', 200, -20]].map(([, x, y], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(f / 8 + i) * 10})`}>{i === 0 ? <rect x={-70} y={-55} width={140} height={110} fill="#BFE6F7" stroke={INK} strokeWidth={8} /> : i === 1 ? <Heart s={1.6} /> : <Label x={0} y={0} t="…" size={120} color={INK} />}</g>)}</Bub></Stage>, PUSH),
  sampler: sc((f) => <Stage bg="#22252E">{Head(560, 680, 1.8, { outfit: STRANGER, expr: 'blank' })}{[0, 1, 2].map((i) => <At key={i} x={1100 + i * 260} y={420} o={f > i * 12 ? 1 : 0}><rect x={-100} y={-100} width={200} height={200} rx={20} fill="#3A3F58" stroke="#fff" strokeWidth={6} /><Label x={0} y={0} t={['BEEP', 'BEEP', 'BEEP'][i]} size={44} color={GOLD} /></At>)}</Stage>, PUSH),
  pie: sc((f) => { const k = lerp(f, 0, 20, 0, 1); const a = Math.PI / 2 * k; return <Stage>{dark(f)}<At x={760} y={540}><circle r={330} fill="#3A3F58" stroke="#fff" strokeWidth={8} /><path d={`M0 0 L0 -330 A330 330 0 0 1 ${Math.sin(a) * 330} ${-Math.cos(a) * 330} Z`} fill={GOLD} stroke={INK} strokeWidth={6} /><Label x={130} y={-130} t="WORDS" size={56} color={INK} /></At><Label x={1450} y={540} t="1 IN 4" size={150} color={GOLD} /></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  pieRest: sc((f) => <Stage>{dark(f)}<At x={760} y={540}><circle r={330} fill="#3A3F58" stroke="#fff" strokeWidth={8} /><path d="M0 0 L0 -330 A330 330 0 0 1 330 0 Z" fill={GOLD} stroke={INK} strokeWidth={6} /><At x={-150} y={110} o={f > 4 ? 1 : 0}><rect x={-60} y={-46} width={120} height={92} fill="#BFE6F7" stroke={INK} strokeWidth={6} /></At><At x={60} y={190} o={f > 12 ? 1 : 0}><Heart s={1.4} /></At><At x={-120} y={-120} o={f > 20 ? 1 : 0}><rect x={-60} y={-60} width={120} height={120} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray="16 12" /></At></At><Label x={1450} y={540} t="THE REST" size={110} /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  aisle: sc((f) => <Stage><Aisle />{Array.from({ length: 7 }, (_, i) => <g key={i}>{M(220 + i * 250, 1060, 0.75, { outfit: [STRANGER, WOMAN, DAVE, TEACHER, STRANGER, CLERK, MUM][i], expr: 'blank', pose: walkPose(f / 6 + i), look: [0, -0.3] })}<Bub x={220 + i * 250} y={500 + (i % 2) * 60} w={170} h={120} p={lerp(f, i * 3, i * 3 + 8, 0, 1)} ty={230}><Label x={0} y={0} t="?" size={80} color={INK} /></Bub></g>)}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  clock14: ClockCard('14:00'),
  office: sc((f) => <Stage><Office /><rect x={820} y={560} width={480} height={300} rx={14} fill="#22252E" stroke={INK} strokeWidth={8} /><g>{Head(1060, 520, 1.1, { outfit: CLERK, expr: { eyes: 'open', lid: 0.35, lidAngle: 0, mouth: 'flat' }, look: [-0.9, 0] })}</g><rect x={820} y={600} width={480} height={260} rx={14} fill="#22252E" stroke={INK} strokeWidth={8} /><rect y={860} width={W} height={220} fill="#A0805A" />{M(300, 1080, 1.2, { expr: 'shocked', look: [0.9, 0] })}</Stage>, PUSH),
  clerkCard: SuspectCard(4, 'OFFICE', CLERK, '#3FA7A0'),
  clerkEyes: sc((f) => <Stage><Office />{Head(960, 620, 2.6, { outfit: CLERK, expr: { eyes: 'open', lid: 0.3, lidAngle: 0, mouth: 'flat' }, look: [-1, 0], still: true })}</Stage>, HOLDC),
  readClerk: sc((f) => <Stage><Office />{Head(960, 620, 2.5, { expr: { eyes: 'squeeze', lid: 0, lidAngle: 0, mouth: 'flat' }, glow: 1, look: [0.6, 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  emptyAbove: sc((f) => <Stage><Office />{M(960, 1060, 1.3, { outfit: CLERK, expr: { eyes: 'open', lid: 0.3, lidAngle: 0, mouth: 'flat' }, look: [-0.6, 0] })}<rect x={660} y={140} width={600} height={300} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="20 16" opacity={0.6} /></Stage>, HOLDC),
  notIcon: (k: 'static' | 'music' | 'cricket') => sc((f) => <Stage bg="#2B2F4A">{k !== 'cricket' ? <Bub x={960} y={520} w={720} h={420} ty={400} fill="#C7CDD8">{k === 'static' ? <Static w={720} h={420} /> : <Notes />}</Bub> : <At x={960} y={560} s={2.2}><ellipse rx={120} ry={50} fill="#3DBE7A" stroke={INK} strokeWidth={6} /><path d="M-100 0 L-180 -120 M-60 0 L-120 -140" stroke={INK} strokeWidth={6} /><Label x={260} y={-160} t="chirp" size={60} color="#9AA3B5" /></At>}{k !== 'cricket' && <g stroke="#E53935" strokeWidth={30} strokeLinecap="round" opacity={f > 6 ? 1 : 0}><line x1={640} y1={240} x2={1280} y2={800} /><line x1={1280} y1={240} x2={640} y2={800} /></g>}</Stage>, HOLDC),
  clerkBlank: sc((f) => <Stage><Office />{Head(960, 640, 2.4, { outfit: CLERK, expr: 'blank', look: [-0.8, 0], still: true })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  imagine: (k: 'robot' | 'spy' | 'hood') => sc((f) => <Stage bg="#5A2346"><Rays bg="#5A2346" ray="#662A50" t={f} /><Bub x={960} y={500} w={900} h={620} p={lerp(f, 0, 6, 0.7, 1)} ty={520}>{k === 'robot' ? <Robot /> : k === 'spy' ? <g>{Head(0, 20, 1.2, { outfit: CLERK, expr: 'smug' })}<rect x={-100} y={-40} width={90} height={40} rx={10} fill={INK} /><rect x={10} y={-40} width={90} height={40} rx={10} fill={INK} /></g> : <Hood />}</Bub></Stage>, HOLDC),
  clerkWave: sc((f) => <Stage><Office />{M(960, 1060, 1.4, { outfit: CLERK, expr: 'happy', pose: WAVE(f / 3) })}</Stage>, PUSH),
  voice: sc((f) => <Stage>{dark(f)}{[0, 1].map((i) => <g key={i}>{Head(560 + i * 800, 560, 2, { outfit: i ? CLERK : MAX_GREY, expr: 'happy' })}{i === 0 ? <Bub x={560} y={220} w={260} h={150} p={0.9 + Math.sin(f / 6) * 0.08} ty={160}><Label x={0} y={0} t="blah" size={50} color={INK} /></Bub> : <ellipse cx={1360} cy={220} rx={130} ry={70} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="16 14" />}<Label x={560 + i * 800} y={810} t={i ? 'NO VOICE' : 'VOICE'} size={70} color={i ? '#7FB8FF' : GOLD} /></g>)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  anendo: sc((f) => <Stage>{dark(f, '#2A2340', '#332A4E')}<At x={960} y={420} s={lerp(f, 0, 8, 1.2, 1)}><BigNum text="2024" size={240} color={GOLD} /></At><Label x={960} y={700} t="ANENDOPHASIA" size={100} /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  anendoWord: sc((f) => <Stage>{dark(f, '#2A2340', '#332A4E')}{Head(960, 560, 2.2, { outfit: CLERK, expr: 'happy' })}<ellipse cx={960} cy={200} rx={180} ry={90} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="16 14" opacity={0.7} /><Label x={960} y={830} t="NO INNER VOICE" size={80} color="#7FB8FF" /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  lives: sc((f) => <Stage bg="#9ED8F0">{Array.from({ length: 6 }, (_, i) => <g key={i}>{M(220 + i * 300, 1040, 0.9, { outfit: [CLERK, STRANGER, WOMAN, DAVE, TEACHER, MUM][i], expr: 'happy', pose: walkPose(f / 6 + i) })}{i % 2 === 0 ? <ellipse cx={220 + i * 300} cy={560} rx={90} ry={50} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="12 10" /> : <Bub x={220 + i * 300} y={560} w={160} h={100} ty={160}><Label x={0} y={0} t="…" size={60} color={INK} /></Bub>}</g>)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  neverKnew: sc((f) => <Stage>{dark(f, '#2A2340', '#332A4E')}{Head(960, 640, 2.4, { outfit: CLERK, expr: 'shocked' })}<At x={1450} y={300} s={lerp(f, 4, 10, 0, 1)}><Label x={0} y={0} t="?!" size={200} color={GOLD} /></At></Stage>, HOLDC),
  toCam: sc((f) => <Stage bg="#2F6FD6"><Rays bg="#2F6FD6" ray="#3A7BE0" t={f} />{Head(960, 620, 2.7, { expr: { eyes: 'squeeze', lid: 0, lidAngle: 0, mouth: 'smirk' }, glow: 1, look: [0, 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.05 } }),
  viewer: sc((f) => <Stage bg="#14152A"><At x={960} y={760}><path d="M-360 320 Q-360 0 0 0 Q360 0 360 320 Z" fill="#2B2F4A" /><circle cx={0} cy={-200} r={230} fill="#2B2F4A" /></At><Bub x={1300} y={300} w={500} h={260} tx={-340} ty={260}><Label x={0} y={0} t="…reading…" size={60} color={INK} /></Bub></Stage>, PUSH),
  comments: (opts: string[]) => sc((f) => <Stage bg="#1F2347">{Head(460, 640, 1.8, { expr: 'smug', look: [0.8, 0] })}<At x={1240} y={540}><rect x={-460} y={-330} width={920} height={660} rx={30} fill="#fff" stroke={INK} strokeWidth={8} />{opts.map((t, i) => <At key={i} x={0} y={-200 + i * 190} o={f > 4 + i * 8 ? 1 : 0}><rect x={-400} y={-70} width={800} height={140} rx={20} fill="#EEF1F6" /><circle cx={-320} r={40} fill={['#E53935', '#2F6FD6', '#FFD21F'][i]} /><Label x={40} y={0} t={t} size={60} color={INK} /></At>)}</At></Stage>, PUSH),
  stareWhy: sc((f) => <Stage><Office />{M(560, 1060, 1.3, { outfit: CLERK, expr: 'smug', pose: POINT, look: [0.8, 0] })}{M(1380, 1060, 1.3, { expr: 'shocked', look: [-0.8, 0], flip: true })}</Stage>, PUSH),
  paste: sc((f) => <Stage bg="#9ED8F0"><Rays bg="#9ED8F0" ray="#AEE0F4" t={f} />{Head(960, 620, 2.7, { expr: 'shocked', paste: true, look: [0.4, 0.3] })}<circle cx={960 + 72 * 2.7} cy={620 + 52 * 2.7} r={80 + Math.sin(f / 4) * 10} fill="none" stroke="#E53935" strokeWidth={12} /></Stage>, HOLDC),
  brushing: sc((f) => <Stage><Bathroom />{M(960, 1040, 1.3, { expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'smile' }, paste: true, pose: { ...STAND, shR: 120, elR: 60 + Math.sin(f) * 20 } })}<Label x={960} y={140} t="7:30 AM" size={70} color={INK} /></Stage>, PUSH),
  clock15: ClockCard('15:00'),
  // ---- 4 Dave
  daveCard: SuspectCard(2, 'DAVE', DAVE, '#3DBE7A'),
  bestFriends: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><Sepia>{M(760, 1040, 1.3, { outfit: DAVE, expr: 'laugh', pose: { ...STAND, shR: 60, elR: 40 } })}{M(1160, 1040, 1.3, { expr: 'laugh', pose: { ...STAND, shL: -60, elL: -40 } })}</Sepia><Label x={960} y={150} t="BEST FRIEND" size={80} color={INK} /></Stage>, PUSH),
  daveDoor: sc((f) => <Stage><DaveHouse /><rect x={1080} y={560} width={240} height={360} fill="#14152A" />{Head(1150, 700, 0.8, { outfit: DAVE, expr: 'happy', look: [-0.6, 0] })}<path d={`M1080 560 L${1320 - lerp(f, 0, 10, 0, 120)} 570 L${1320 - lerp(f, 0, 10, 0, 120)} 910 L1080 920 Z`} fill="#3DBE7A" stroke={INK} strokeWidth={8} />{M(560, 1060, 1.1, { expr: 'happy', look: [0.8, 0] })}</Stage>, PUSH),
  readDave: sc((f) => <Stage><DaveHouse />{Head(960, 620, 2.5, { expr: { eyes: 'squeeze', lid: 0, lidAngle: 0, mouth: 'flat' }, glow: 1, look: [0.7, 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  baa: (speed: number, label: string) => sc((f) => <Stage bg="#7FB685">{M(560, 1060, 1.3, { outfit: DAVE, expr: 'happy', look: [0.6, 0] })}<Bub x={1240} y={400} w={760} h={440} tx={-620} ty={160}><Notes speed={speed} /><Label x={0} y={140} t={label} size={56} color={INK} /></Bub></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  sweat: sc((f) => <Stage bg="#7FB685">{Head(960 + Math.sin(f * 2) * 4, 620, 2.6, { expr: { eyes: 'squeeze', lid: 0, lidAngle: 0, mouth: 'wobble', sweat: true }, glow: 1 })}</Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.3 }),
  daveFreeze: sc((f) => <Stage bg="#3DBE7A"><Rays bg="#3DBE7A" ray="#4ACB86" t={f} />{Head(960, 640, 2.6, { outfit: DAVE, expr: 'happy', still: true })}<ellipse cx={960} cy={620} rx={380} ry={360} fill="none" stroke="#E53935" strokeWidth={16} strokeDasharray={`${lerp(f, 4, 20, 0, 2400)} 3000`} /></Stage>, HOLDC),
  decoderJunk: sc((f) => <Stage><Lab on={0} />{[0, 1, 2].map((i) => <At key={i} x={1640} y={250 + i * 60} o={0.9}><Label x={0} y={0} t={['xq#zl', 'FLURB', '7… 14…'][i]} size={38} color={i === 2 ? GOLD : '#FF5A4E'} /></At>)}</Stage>, PUSH),
  thinkElse: sc((f) => <Stage>{dark(f)}{Head(560, 640, 1.9, { outfit: STRANGER, expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'smirk' } })}<Bub x={1300} y={420} w={620} h={360} tx={-560} ty={180}><g transform="scale(1.1)"><Duck /></g></Bub></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  counting: sc((f) => <Stage>{dark(f)}{Head(560, 640, 1.9, { outfit: STRANGER, expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'flat' } })}<At x={1300} y={540}><BigNum text={String(7 * (1 + Math.min(5, Math.floor(f / 10))))} size={300} color={GOLD} /></At></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  animals: sc((f) => <Stage>{dark(f)}<At x={480} y={700} s={1.4} o={f > 0 ? 1 : 0}><Dog expr="happy" /></At><At x={960} y={560} s={1.1} o={f > 8 ? 1 : 0}><Duck /></At><At x={1440} y={560} o={f > 16 ? 1 : 0}><ellipse rx={120} ry={60} fill="#7FB8FF" stroke={INK} strokeWidth={8} /><path d="M110 0 L190 -60 L190 60 Z" fill="#7FB8FF" stroke={INK} strokeWidth={8} /><circle cx={-60} cy={-10} r={10} fill={INK} /></At></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  glare: sc((f) => <Stage bg="#E53935"><Rays bg="#E53935" ray="#EA4B47" t={f} />{Head(960, 620, 2.7, { expr: { eyes: 'open', lid: 0.5, lidAngle: -12, mouth: 'flat' }, glow: 1 })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  sevens: sc((f) => <Stage bg="#14152A">{[7, 14, 21, 28].map((n, i) => <At key={n} x={360 + i * 400} y={540} s={lerp(f, i * 6, i * 6 + 6, 0.01, 1)}><BigNum text={String(n)} size={220} color={GOLD} /></At>)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  mic: sc((f) => <Stage bg="#2A2340"><Rays bg="#2A2340" ray="#332A4E" t={f} /><At x={960} y={620} s={1.4}><MicStand /></At><Label x={960} y={140} t="NARRATOR" size={60} color="#9AA3B5" /></Stage>, PUSH),
  like: sc((f) => { const press = f > 24; return <Stage bg="#1F2347">{Head(560, 640, 2, { expr: 'smug', look: [0.6, 0] })}<At x={1320} y={540} s={press ? lerp(f, 24, 30, 0.85, 1.05) : 1}><rect x={-220} y={-110} width={440} height={220} rx={110} fill={press ? '#2F6FD6' : '#3A3F58'} stroke="#fff" strokeWidth={8} /><path d="M-60 40 L-60 -20 L-20 -20 L10 -80 Q40 -80 34 -40 L30 -20 L80 -20 Q100 -20 96 4 L80 60 Q76 76 60 76 L-60 76 Z" fill="#fff" transform="translate(-20 -10) scale(0.9)" /></At>{press && <Burst x={1320} y={540} p={lerp(f, 24, 38, 0, 1)} color="#FFD21F" r={320} />}</Stage>; }, PUSH),
  sneak: sc((f) => <Stage bg="#2A2340"><At x={1300} y={620} s={1.3}><MicStand /></At>{M(400 + Math.min(f, 40) * 10, 1060, 1.2, { expr: 'smug', glow: 1, pose: walkPose(f / 6), look: [1, 0] })}</Stage>, PUSH),
  micDuck: sc((f) => <Stage bg="#2A2340"><At x={1100} y={680} s={1.3}><MicStand /></At>{M(780, 1060, 1.2, { expr: 'shocked', glow: 1, look: [1, -0.6], pose: { ...STAND, lean: 10 } })}<Bub x={1300} y={240} w={420} h={240} tx={-200} ty={260}><g transform="scale(0.8)"><Duck /></g></Bub></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  duckClose: sc((f) => <Stage bg="#2A2340"><Bub x={960} y={520} w={900} h={560} ty={460}><g transform="scale(1.8)"><Duck squeak={Math.max(0, Math.sin(f / 3))} /></g></Bub></Stage>, HOLDC),
  eyebrow: sc((f) => <Stage bg="#2F6FD6">{Head(960, 620, 2.7, { expr: 'smug', still: true, look: [0.7, 0] })}</Stage>, HOLDC),
  timelapse: sc((f) => { const k = lerp(f, 0, 70, 0, 1); return <Stage><DaveHouse sky={k < 0.85 ? '#9ED8F0' : '#E8836B'} /><Sun t={k} />{Head(740, 520, 0.6, { outfit: DAVE, expr: 'happy' })}{M(1600, 1060, 0.9, { expr: { eyes: 'open', lid: 0.4 + k * 0.3, lidAngle: 0, mouth: 'flat' }, glow: 0.8, look: [-1, 0] })}<Label x={1600} y={160} t={`HOUR ${1 + Math.floor(k * 8.99)}`} size={60} color={INK} /></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  daveWindow: sc((f) => <Stage><DaveHouse sky="#E8836B" />{Head(740, 540, 0.8, { outfit: DAVE, expr: { eyes: 'open', lid: 0, lidAngle: 0, mouth: (f % 12) < 6 ? 'o' : 'smile' } })}<g transform="translate(740 320) scale(0.4)"><Notes /></g></Stage>, PUSH),
  twitch: sc((f) => <Stage bg="#E8836B">{Head(960, 620, 2.7, { expr: { eyes: 'open', lid: (f % 10) < 3 ? 0.6 : 0.2, lidAngle: 0, mouth: 'flat' }, glow: 0.8 })}</Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.3 }),
  glitch: sc((f) => <Stage bg="#7FB685">{M(560, 1060, 1.3, { outfit: DAVE, expr: { eyes: 'open', lid: 0, lidAngle: 0, mouth: 'wobble', sweat: true } })}<g transform={`translate(${(f % 6 < 3 ? 12 : -12)} 0)`}><Bub x={1240} y={400} w={760} h={440} tx={-620} ty={160}><Notes fall={lerp(f, 6, 40, 0, 1)} /></Bub></g></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.4 }),
  ducks: sc((f) => { const t = remap(f, [[0, 0.5]]); return <Stage bg="#7FB685">{M(560, 1060, 1.3, { outfit: DAVE, expr: 'panic', pose: PANIC })}<Bub x={1240} y={400} w={760} h={440} p={lerp(t, 0, 10, 0.5, 1)} tx={-620} ty={160}><g transform="scale(1.2)"><Duck /></g></Bub></Stage>; }, HOLDC),
  slam: sc((f) => <Stage><DaveHouse /><rect x={1080} y={560} width={240} height={360} fill="#3DBE7A" stroke={INK} strokeWidth={10} /><Burst x={1200} y={740} p={lerp(f, 0, 12, 0, 1)} color="#fff" r={300} n={10} /><Label x={1200} y={480} t="SLAM" size={90} color={INK} /></Stage>, { a: { z: 1 }, b: { z: 1.02 }, shake: 1 }),
  daveDuck: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} />{M(620 - Math.min(f, 30) * 4, 1060, 1.4, { outfit: DAVE, expr: 'panic', pose: PANIC })}<At x={1400} y={900 - Math.abs(Math.sin(f / 5)) * 60}><Duck /></At></Stage>, PUSH),
  clock21: ClockCard('21:00'),
  // ---- 5 stadium
  stadium: sc((f) => <Stage><Stadium t={f} />{M(960, 1060, 1.2, { expr: 'happy', look: [0, -0.4] })}</Stage>, { a: { z: 1, y: 20 }, b: { z: 1.04, y: -20 } }),
  badIdea: sc((f) => <Stage><Stadium t={f} />{Head(960, 620, 2.5, { expr: 'wince' })}</Stage>, HOLDC),
  sixty: sc((f) => <Stage><Stadium t={f} /><rect width={W} height={H} fill="#0B0C18" opacity={0.55} /><At x={960} y={520}><BigNum text={Math.round(lerp(f, 0, 30, 0, 60000)).toLocaleString('en-US')} size={240} color={GOLD} /></At><Label x={960} y={720} t="PEOPLE" size={70} /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  wavesOne: sc((f) => <Stage bg="#1F2347"><Waves mode="one" /><At x={960} y={540}>{Head(0, 0, 0.9, { expr: 'happy' })}</At></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  party: sc((f) => <Stage bg="#7A4FD6"><Rays bg="#7A4FD6" ray="#8660DD" t={f} />{[0, 1, 2].map((i) => <At key={i} x={560 + i * 400} y={520} r={(i - 1) * 12}><path d="M-60 -120 L60 -120 L0 0 Z" fill="#BFE6F7" stroke={INK} strokeWidth={8} /><line x1={0} y1={0} x2={0} y2={120} stroke={INK} strokeWidth={8} /><line x1={-50} y1={120} x2={50} y2={120} stroke={INK} strokeWidth={8} /></At>)}<Label x={960} y={200} t="COCKTAIL PARTY" size={100} color={GOLD} /></Stage>, PUSH),
  wavesRed: sc((f) => <Stage bg="#2A0F14"><Waves mode="red" /><At x={960} y={540}>{Head(0, 0, 0.9, { expr: 'panic' })}</At></Stage>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.4 }),
  noFilter: sc((f) => <Stage bg="#2A0F14">{Head(960, 620, 2.4, { expr: 'panic', glow: 1, look: [Math.sin(f / 3), 0] })}{Array.from({ length: 10 }, (_, i) => <At key={i} x={(rnd(i) * W)} y={(rnd(i, 2) * H)} o={0.6}><Bub x={0} y={0} w={180} h={110} ty={0} /></At>)}</Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.4 }),
  kickoff: sc((f) => <Stage><Stadium t={f} /><At x={960 + lerp(f, 4, 20, 0, 600)} y={880 - Math.sin(lerp(f, 4, 20, 0, Math.PI)) * 300}><Ball /></At><Burst x={960} y={880} p={lerp(f, 2, 14, 0, 1)} color="#fff" r={260} n={10} /></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  tornado: sc((f) => { const t = remap(f, [[0, 1], [10, 0.25]]); return <Stage><Stadium t={t} /><rect width={W} height={H} fill="#0B0C18" opacity={0.35} />{Array.from({ length: 36 }, (_, i) => { const a = i * 0.7 + t * 0.12 * (1 + (i % 3) * 0.2); const r = 260 + (i % 6) * 90; const y = 1000 - ((i * 37 + t * 6) % 900); return <At key={i} x={960 + Math.cos(a) * r} y={y} s={0.4 + (i % 4) * 0.12} o={Math.min(1, t / 8)}><Bub x={0} y={0} w={260} h={150} ty={0}><Label x={0} y={0} t={['!', '?', '…', 'GO', '!!'][i % 5]} size={70} color={INK} /></Bub></At>; })}{M(960, 1060, 1.3, { expr: 'panic', pose: PANIC, glow: 1 })}<Vignette strength={0.5} /></Stage>; }, { a: { z: 1 }, b: { z: 1.1 }, tilt: 3 }),
  slamBub: (t: string, bg: string, icon?: 'burger' | 'oven') => sc((f) => <Stage bg={bg}><Rays bg={bg} ray="rgba(255,255,255,0.08)" t={f} /><Bub x={960} y={500} w={1100} h={600} p={lerp(f, 0, 5, 1.2, 1)} ty={520}>{icon === 'burger' ? <g><ellipse cx={0} cy={-60} rx={170} ry={70} fill="#E2A15B" stroke={INK} strokeWidth={8} /><rect x={-170} y={-20} width={340} height={50} fill="#7A4A22" stroke={INK} strokeWidth={8} /><rect x={-170} y={30} width={340} height={40} rx={18} fill="#E2A15B" stroke={INK} strokeWidth={8} /></g> : icon === 'oven' ? <g><rect x={-180} y={-150} width={360} height={300} rx={20} fill="#9AA3B5" stroke={INK} strokeWidth={8} /><rect x={-130} y={-80} width={260} height={180} rx={14} fill="#FF8A1F" opacity={0.6 + 0.4 * Math.sin(f / 3)} /></g> : <Label x={0} y={0} t={t} size={180} color={INK} />}</Bub></Stage>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.4 }),
  screamSelf: sc((f) => <Stage bg="#E53935"><Bub x={960} y={500} w={1100} h={640} ty={520}>{Head(0, 20, 1.6, { expr: 'panic' })}</Bub></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.6 }),
  mascot: sc((f) => <Stage><Stadium t={f} /><At x={760} y={940} s={2.2}><Duck /></At><Bub x={1340} y={360} w={560} h={300} tx={-460} ty={300}><Label x={0} y={0} t="I QUIT." size={110} color={INK} /></Bub></Stage>, PUSH),
  daveFaint: sc((f) => <Stage><Stadium t={f} />{M(960, 1060, 1.3, { outfit: DAVE, expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'o' }, pose: { ...STAND, lean: lerp(f, 6, 22, 0, -80) } })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  clock2358: ClockCard('23:58', true),
  runOut: sc((f) => <Stage><Stadium t={f} />{M(400 + f * 22, 1060, 1.3, { expr: 'determined', pose: runPose(f / 2), look: [1, 0], glow: 0.6 })}</Stage>, { a: { z: 1, x: -40 }, b: { z: 1.04, x: 80 } }),
  // ---- 6 Mum
  houseNight: sc((f) => <Stage><DaveHouse sky="#14152A" /><rect x={560} y={380} width={360} height={260} fill="#FFE29A" stroke={INK} strokeWidth={10} />{M(1500, 1060, 1, { expr: 'tired', pose: walkPose(f / 6), flip: true })}</Stage>, PUSH),
  kitchen: sc((f) => <Stage><NightKitchen />{M(960, 1060, 1.3, { outfit: MUM, expr: 'smug', pose: { ...STAND, hipL: -70, knL: 70, hipR: -70, knR: 70 } })}<At x={760} y={680}><Cup /></At><At x={1160} y={680}><Cup /></At></Stage>, PUSH),
  mumCard: SuspectCard(3, 'MUM', MUM, '#5E3A9A', true),
  lying: sc((f) => <Stage bg="#C9A27A"><Sepia><DayKitchen />{M(1300, 1060, 1.3, { outfit: MUM, expr: 'smug', pose: POINT, flip: true, look: [-0.8, 0] })}{M(700, 1060, 0.85, { expr: 'shocked', pose: { ...STAND, shR: 140, elR: 20 } })}<At x={740} y={640}><circle r={30} fill="#D9A15B" stroke={INK} strokeWidth={6} /></At></Sepia></Stage>, PUSH),
  sadHug: sc((f) => <Stage bg="#C9A27A"><Sepia><DayKitchen />{M(1000, 1060, 1.3, { outfit: MUM, expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'smile' }, pose: { ...STAND, shL: 60, elL: 90, shR: -60, elR: -90 } })}{M(880, 1060, 0.85, { expr: 'sad' })}</Sepia></Stage>, PUSH),
  mumWarm: sc((f) => <Stage><NightKitchen />{Head(960, 640, 2.4, { outfit: MUM, expr: { eyes: 'happy', lid: 0, lidAngle: 0, mouth: 'smile' } })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  breath: sc((f) => <Stage><NightKitchen />{Head(960, 640, 2.5, { expr: { eyes: 'closed', lid: 0, lidAngle: 0, mouth: 'flat' }, look: [0, 0] })}</Stage>, HOLDC),
  slowGlow: sc((f) => { const t = remap(f, [[0, 0.4]]); return <Stage><NightKitchen />{Head(960, 640, 2.5, { expr: 'determined', glow: lerp(t, 0, 20, 0, 1) })}</Stage>; }, { a: { z: 1 }, b: { z: 1.04 } }),
  intoBubble: sc((f) => { const t = remap(f, [[0, 0.4]]); return <Stage><NightKitchen />{M(960, 1060, 1.3, { outfit: MUM, expr: 'smug', pose: { ...STAND, hipL: -70, knL: 70, hipR: -70, knR: 70 } })}<Bub x={960} y={300} w={lerp(t, 0, 30, 300, 900)} h={lerp(t, 0, 30, 170, 500)} ty={300} fill="#FFF3D0"><rect x={-200} y={-120} width={400} height={240} fill="#F2C14E" opacity={0.5} /></Bub></Stage>; }, HOLDC),
  reel: sc((f) => <Stage bg="#FFF3D0">{Array.from({ length: 6 }, (_, i) => { const x = ((i * 380 - f * 10) % 2280) + 2280; const xx = (x % 2280) - 200; return <At key={i} x={xx} y={540}><rect x={-160} y={-200} width={320} height={400} fill="#2B2B2B" />{Array.from({ length: 5 }, (_, k) => <rect key={k} x={-150 + k * 64} y={-190} width={30} height={20} fill="#FFF3D0" />)}<rect x={-140} y={-140} width={280} height={280} fill="#F2C14E" /><Sepia>{M(0, 120, 0.4 + (i % 3) * 0.1, { expr: 'happy' })}</Sepia></At>; })}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  himself: sc((f) => <Stage bg="#FFF3D0"><Rays bg="#FFF3D0" ray="#FFEBB8" t={f} /><Sepia>{M(960, 960, 0.9, { expr: 'laugh', pose: WAVE(f / 3) })}</Sepia><circle cx={960} cy={700} r={420} fill="#FFD21F" opacity={0.18} /></Stage>, PUSH),
  memory: (k: 'cake' | 'knee' | 'mum') => sc((f) => <Stage bg="#FFF3D0"><At x={960} y={540} r={-3}><rect x={-520} y={-380} width={1040} height={760} fill="#fff" stroke={INK} strokeWidth={8} /><rect x={-480} y={-340} width={960} height={600} fill="#F6E3B4" /><Sepia>{k === 'cake' ? <g>{M(-180, 240, 0.8, { expr: 'laugh' })}<At x={200} y={120} s={1.4}><Cake /></At></g> : k === 'knee' ? <g>{M(0, 240, 0.8, { expr: 'sad', pose: { ...STAND, hipL: -40, knL: 40 } })}<rect x={-60} y={130} width={50} height={26} rx={8} fill="#F6C28B" stroke={INK} strokeWidth={4} /></g> : <g>{M(-120, 240, 0.6, { expr: 'happy' })}<Bub x={160} y={-120} w={320} h={180} tx={-240} ty={180}><Label x={0} y={0} t="MUM!" size={70} color={INK} /></Bub></g>}</Sepia><rect x={-480} y={-340} width={960} height={600} fill="#FFD21F" opacity={0.12 + 0.06 * Math.sin(f / 6)} /></At></Stage>, PUSH),
  rebuild: sc((f) => { const k = lerp(f, 0, 24, 0, 1), b = lerp(f, 28, 52, 0, 1); const off = Math.sin(k * Math.PI) * (1 - b); return <Stage>{dark(f, '#2A2340', '#332A4E')}{[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => <At key={i} x={960 + sx * (150 + off * 220)} y={540 + sy * (110 + off * 160)} r={off * sx * 12}><rect x={-150} y={-110} width={300} height={220} fill={b > 0.5 ? '#FFC94E' : '#F2C14E'} stroke={INK} strokeWidth={8} style={{ filter: `hue-rotate(${b * 20}deg)` }} /></At>)}<Label x={960} y={160} t="REBUILT" size={70} color={GOLD} /></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  shifted: sc((f) => <Stage>{dark(f, '#2A2340', '#332A4E')}{[0, 1, 2, 3].map((i) => <At key={i} x={360 + i * 400} y={540} o={f > i * 6 ? 1 : 0} r={(i - 1.5) * 3}><rect x={-160} y={-200} width={320} height={400} fill="#fff" stroke={INK} strokeWidth={6} /><rect x={-140} y={-180} width={280} height={300} fill="#F6E3B4" style={{ filter: `hue-rotate(${i * 18}deg) saturate(${1 + i * 0.2})` }} /><g style={{ filter: `hue-rotate(${i * 18}deg)` }}>{M(0, 100, 0.45, { expr: 'happy', still: true })}</g></At>)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  brighter: (k: number) => sc((f) => <Stage bg="#FFF3D0"><Rays bg="#FFF3D0" ray="#FFEBB8" t={f} /><At x={960} y={540}><rect x={-420} y={-320} width={840} height={640} fill="#fff" stroke={INK} strokeWidth={8} /><rect x={-380} y={-280} width={760} height={500} fill="#F6E3B4" /><Sepia>{M(0, 200, 0.8, { expr: 'happy' })}</Sepia><rect x={-380} y={-280} width={760} height={500} fill="#FFE45C" opacity={k * lerp(f, 0, 30, 0.1, 0.35)} /></At>{k > 0.5 && Array.from({ length: 6 }, (_, i) => <circle key={i} cx={560 + i * 160} cy={180 + Math.sin(f / 6 + i) * 20} r={10} fill={GOLD} />)}</Stage>, PUSH),
  tea: sc((f) => <Stage><NightKitchen />{M(1300, 1060, 1.3, { outfit: MUM, expr: 'happy', pose: { ...STAND, hipL: -70, knL: 70, hipR: -70, knR: 70, shL: -80, elL: 0 }, flip: true })}{M(600, 1060, 1.3, { expr: { eyes: 'open', lid: 0, lidAngle: 0, mouth: 'wobble', tear: true }, pose: { ...STAND, hipL: -70, knL: 70, hipR: -70, knR: 70 } })}<At x={1100 - lerp(f, 0, 30, 0, 300)} y={680}><Cup /></At></Stage>, PUSH),
  teary: sc((f) => <Stage><NightKitchen />{Head(960, 640, 2.5, { expr: { eyes: 'open', lid: 0, lidAngle: 0, mouth: 'wobble', tear: true } })}</Stage>, HOLDC),
  midnight: sc((f) => <Stage bg={(f > 14 && f % 8 < 4) ? '#0B0C18' : '#14152A'}><At x={960} y={540} s={lerp(f, 0, 6, 1.2, 1)}><ClockFace t={f < 12 ? '23:59' : '00:00'} red /></At></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.4 }),
  // ---- 7 reveal
  backDoor: sc((f) => { const t = remap(f, [[0, 0.35]]); return <Stage bg="#14152A"><rect y={900} width={W} height={180} fill="#2A2F55" /><Door open={lerp(t, 6, 30, 0, 0.8)} bg="#0B0C18" color="#5A4632" /><path d={`M960 1000 L${960 + lerp(t, 6, 30, 0, 300)} 1000`} stroke="#9AA3B5" strokeWidth={6} /></Stage>; }, { a: { z: 1 }, b: { z: 1.04 } }),
  shadow: sc((f) => <Stage bg="#14152A"><rect y={900} width={W} height={180} fill="#2A2F55" /><Door open={0.8} bg="#2A3550" color="#5A4632" /><At x={960 + Math.max(0, 30 - f) * 4} y={1000} s={2}><g style={{ filter: 'brightness(0)' }}><Dog /></g></At></Stage>, PUSH),
  sits: sc((f) => <Stage bg="#14152A"><rect y={900} width={W} height={180} fill="#2A2F55" /><At x={960} y={1000} s={2.4}><g style={{ filter: `brightness(${lerp(f, 6, 30, 0, 1)})` }}><Dog /></g></At></Stage>, HOLDC),
  dogStare: sc((f) => <Stage bg="#2A2F55"><At x={1060} y={1180} s={4.4} r={lerp(f, 4, 20, 0, -10)}><Dog expr="cool" /></At></Stage>, { a: { z: 1 }, b: { z: 1.05 } }),
  pawReveal: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><At x={600} y={980} s={2}><Dog expr="happy" /></At><At x={1260} y={560} s={1.1} r={6}><Note paw={lerp(f, 6, 20, 0, 1)} /></At></Stage>, HOLDC),
  crayon: sc((f) => <Stage bg="#F2C14E"><At x={960} y={980} s={2.6}><Dog expr="cool" /></At><At x={960 - 170 * 2.6 + 30} y={980 - 100 * 2.6 + lerp(f, 14, 26, 0, 260)} r={lerp(f, 14, 26, 0, 80)}><Crayon /></At></Stage>, PUSH),
  notAnswering: sc((f) => <Stage bg="#2A2340"><At x={960} y={620} s={1.4}><MicStand /></At><At x={960} y={180}><Stamp t="NO COMMENT" p={lerp(f, 4, 10, 0, 1)} size={90} /></At></Stage>, HOLDC),
  dogMind: sc((f) => <Stage bg="#2F6FD6"><Rays bg="#2F6FD6" ray="#3A7BE0" t={f} /><At x={1060} y={1000} s={3.4}><Dog expr="happy" wag={Math.sin(f / 3)} /></At><g transform="translate(1060 1000) scale(3.4)"><circle cx={-74} cy={-128} r={14} fill={GOLD} opacity={0.8} style={{ filter: 'blur(4px)' }} /><circle cx={-46} cy={-128} r={14} fill={GOLD} opacity={0.8} style={{ filter: 'blur(4px)' }} /></g></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  faces: sc((f) => { const k = lerp(f, 10, 30, 0, 1); return <Stage>{dark(f)}<At x={960} y={1000} s={2}><Dog expr="happy" wag={Math.sin(f / 3)} /></At>{Head(500, 360, 1.3, { expr: 'happy' })}{Head(1420, 360, 1.3, { outfit: DAVE, expr: 'sad' })}<circle cx={500} cy={360} r={160 * k} fill="none" stroke="#3DE07A" strokeWidth={12} /><Label x={500} y={600} t="HAPPY" size={56} color="#3DE07A" /><Label x={1420} y={600} t="ANGRY" size={56} color="#FF5A4E" /></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  point: sc((f) => { const k = lerp(f, 0, 20, 0, 1); return <Stage bg="#7FB685"><rect y={820} width={W} height={260} fill="#5E9A66" />{M(400, 1060, 1.3, { expr: 'happy', pose: POINT, look: [1, 0] })}<At x={1600} y={960}><Ball /></At><At x={700 + 700 * k} y={1060} s={1.6} r={0}><g transform="scale(-1 1)"><Dog expr="happy" wag={Math.sin(f / 2)} /></g></At></Stage>; }, PUSH),
  dogVoice: sc((f) => <Stage>{dark(f)}<At x={1200} y={980} s={2.4}><Dog expr="happy" /></At>{[0, 1, 2].map((i) => { const r = ((f * 5 + i * 70) % 260); return <circle key={i} cx={860} cy={640} r={r} fill="none" stroke={GOLD} strokeWidth={8} opacity={1 - r / 260} />; })}{Head(500, 640, 1.4, { expr: 'happy' })}<At x={1050} y={560}><Heart s={1.2 + Math.sin(f / 4) * 0.15} /></At></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  callback: (k: 'bed' | 'bus' | 'kitchen' | 'sad') => sc((f) => <Stage>{k === 'bed' ? <Bedroom /> : k === 'bus' ? <BusIn /> : k === 'kitchen' ? <NightKitchen /> : <rect width={W} height={H} fill="#5E7187" />}{M(700, k === 'bed' ? 760 : 1060, 1.2, { expr: k === 'sad' ? 'sad' : k === 'bus' ? 'happy' : 'smug', look: [-0.6, 0] })}<At x={1300} y={k === 'bed' ? 790 : 1060} s={1.6}><Dog expr="cool" /></At><circle cx={1200} cy={k === 'bed' ? 600 : 870} r={40} fill="none" stroke={GOLD} strokeWidth={8} opacity={0.6 + 0.4 * Math.sin(f / 4)} /></Stage>, PUSH),
  wonder: sc((f) => <Stage>{dark(f, '#2F6FD6', '#3A7BE0')}{Head(960, 620, 2.5, { expr: 'shocked', look: [0.5, -0.4] })}</Stage>, HOLDC),
  foodInflate: sc((f) => { const t = remap(f, [[0, 0.45]]); return <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><At x={1160} y={1060} s={2.6}><Dog expr="happy" /></At><Bub x={820} y={380} w={620} h={340} p={lerp(t, 0, 40, 0.1, 0.85)} tx={150} ty={360} /></Stage>; }, HOLDC),
  foodFinal: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><At x={1160} y={1060} s={2.6}><Dog expr="happy" wag={Math.sin(f / 2) * 1.5} /></At><Bub x={820} y={380} w={620} h={340} tx={150} ty={360}><Label x={0} y={0} t="FOOD." size={150} color={INK} /></Bub>{M(300, 1060, 1, { outfit: MUM, expr: 'laugh' })}<Confetti t={f} /></Stage>, HOLDC),
  // ---- 8 ending
  breakfast: sc((f) => <Stage><DayKitchen />{M(760, 1060, 1.3, { expr: 'happy', pose: { ...STAND, hipL: -70, knL: 70, hipR: -70, knR: 70 } })}{M(1180, 1060, 1.3, { outfit: MUM, expr: 'happy', flip: true, pose: { ...STAND, hipL: -70, knL: 70, hipR: -70, knR: 70 } })}<At x={1600} y={1060} s={1.3}><Dog expr="happy" wag={Math.sin(f / 3)} /></At><At x={960} y={680}><Toast /></At></Stage>, PUSH),
  hug: sc((f) => <Stage bg="#FFE29A"><Rays bg="#FFE29A" ray="#FFEBB8" t={f} />{M(1020, 1060, 1.4, { outfit: MUM, expr: { eyes: 'happy', lid: 0, lidAngle: 0, mouth: 'smile' }, pose: { ...STAND, shL: 60, elL: 90, shR: -60, elR: -90 } })}{M(880, 1060, 1.3, { expr: { eyes: 'happy', lid: 0, lidAngle: 0, mouth: 'smile' } })}</Stage>, PUSH),
  knowYou: sc((f) => <Stage><DayKitchen />{Head(960, 640, 2.4, { outfit: MUM, expr: 'smug', look: [-0.4, 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  toastStare: sc((f) => <Stage><DayKitchen /><At x={1260} y={1180} s={3.4}><Dog expr="cool" /></At><At x={560} y={620} s={1.6}><Toast /></At></Stage>, HOLDC),
  handOver: sc((f) => <Stage><DayKitchen />{M(700, 1060, 1.3, { expr: 'tired', pose: { ...STAND, shR: 80, elR: 10 }, look: [1, 0] })}<At x={1420} y={1060} s={1.6}><Dog expr="happy" wag={Math.sin(f / 2) * 1.5} /></At><At x={940 + lerp(f, 0, 30, 0, 260)} y={780 + lerp(f, 0, 30, 0, 100)}><Toast /></At></Stage>, PUSH),
  // ---- 9 outro
  outroBoard: (red: boolean) => sc(() => <Stage><Board crossed={['ZOE', 'TEACHER', 'OFFICE', 'DAVE', 'MUM']} viewer circled={red ? 'YOU' : undefined} /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  endScreen: sc((f) => <Stage bg="#1F2347"><Rays bg="#1F2347" ray="#262B57" t={f} /><At x={lerp(f, 20, 40, 2200, 960)} y={820} s={1.2}><Duck squeak={f > 40 ? Math.max(0, Math.sin((f - 40) / 3)) : 0} /></At>{[0, 1].map((i) => <rect key={i} x={i ? 1280 : 140} y={260} width={500} height={282} rx={20} fill="#2E3466" stroke="#FFD21F" strokeWidth={6} />)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
};

// ================= cue sheet =================
type El = (d: number) => React.ReactNode;
type Cue = [number, El, [number, string, number][]?];
const c = (sec: number, phrase: string, el: El, sfx?: [number, string, number][], nth = 1): Cue => [at(sec, phrase, nth), el, sfx];
const S1 = ['ZOE'], S2 = [...S1, 'TEACHER'], S3 = [...S2, 'OFFICE'], S4 = [...S3, 'DAVE'], S5 = [...S4, 'MUM'];

const CUES: Cue[] = [
  // 1 cold open
  [secStart(1), X.bedWake, [[12, 'pop', 0.3]]],
  c(1, 'This morning', X.wake),
  c(1, 'His first ever', X.dogFood, [[4, 'pop', 0.3]]),
  c(1, 'It said', X.foodClose),
  c(1, 'Great start', X.unimpressed),
  c(1, 'Then he found', X.noteSlide, [[2, 'letter', 0.4]]),
  c(1, 'I can read minds', X.note),
  c(1, 'I know what', X.readNote),
  c(1, 'Midnight', X.clock8, [[0, 'tick', 0.35]]),
  c(1, 'Someone who knows', X.qFace(MUM, '#5E3A9A'), [[0, 'slap', 0.25]]),
  c(1, 'And Max has', X.qFace(DAVE, '#258553'), [[0, 'slap', 0.25]]),
  c(1, 'until midnight', X.qFace(TEACHER, '#5F6A7C'), [[0, 'slap', 0.25]]),
  c(1, 'to find out', X.qFace(ZOE, '#C2507A'), [[0, 'slap', 0.25]]),
  c(1, 'Luckily', X.smugGlow),
  c(1, 'Unluckily', X.theyStare, [[6, 'whoosh', 0.3]]),
  c(1, 'so can they', X.title, [[0, 'lowhit', 0.5]]),
  // 2 Zoe and the teacher
  c(2, 'Suspect one', X.zoeCard, [[0, 'slap', 0.4]]),
  c(2, 'She sits', X.bus, [[0, 'bus', 0.2]]),
  c(2, 'Max focuses', X.focus),
  c(2, 'And for the first', X.zoeInflate),
  c(2, 'he hears what', X.maxLean),
  c(2, "he's cute", X.cute, [[0, 'pop', 0.4]]),
  c(2, 'a criminal mastermind', X.float),
  c(2, 'Suspect one', X.board(S1, 'ZOE'), [[6, 'scratch', 0.3]], 2),
  c(2, 'Nine', X.clock9, [[0, 'tick', 0.35]]),
  c(2, 'The maths exam', X.exam),
  c(2, "Max doesn't need", X.noStudy, [[4, 'slap', 0.3]]),
  c(2, 'The teacher is literally', X.answers, [[0, 'pop', 0.25], [30, 'pop', 0.25]]),
  c(2, 'One hundred', X.hundred, [[2, 'slap', 0.35]]),
  c(2, 'The teacher is now', X.teacherMad),
  c(2, "But it can't", X.teacherCar),
  c(2, 'wondering where', X.board(S2, 'TEACHER'), [[6, 'scratch', 0.3]]),
  // 3 first rule, suspect four
  c(3, 'Lunch', X.cafe),
  c(3, 'Max tries', X.squint),
  c(3, 'And gets', X.staticBub, [[0, 'scratch', 0.2]]),
  c(3, "Here's why", X.maxWhy),
  c(3, 'In 2023', X.lab, [[0, 'typing', 0.25]]),
  c(3, 'that turns brain', X.labText, [[0, 'typing', 0.3]]),
  c(3, 'But it only', X.sixteen, [[0, 'counter', 0.25]]),
  c(3, 'And a decoder', X.keyFit),
  c(3, 'was useless', X.keyBounce, [[14, 'boing', 0.35]]),
  c(3, 'Every brain', X.ownLang),
  c(3, 'So the people', X.circle),
  c(3, 'Which means', X.noteAgain),
  c(3, 'knows him very', X.worried),
  c(3, 'And even then', X.messy),
  c(3, 'Scientists who', X.sampler, [[0, 'tick', 0.25], [12, 'tick', 0.25], [24, 'tick', 0.25]]),
  c(3, 'found actual words', X.pie),
  c(3, 'The rest is', X.pieRest, [[4, 'pop', 0.2], [12, 'pop', 0.2], [20, 'pop', 0.2]]),
  c(3, 'and a lot', X.aisle),
  c(3, 'Two', X.clock14, [[0, 'tick', 0.35]]),
  c(3, 'The office', X.office),
  c(3, "And there's a woman", X.clerkCard, [[0, 'slap', 0.4]]),
  c(3, 'All', X.clerkEyes),
  c(3, 'Max reads her', X.readClerk),
  c(3, 'And gets', X.emptyAbove, undefined, 2),
  c(3, 'Not static', X.notIcon('static')),
  c(3, 'Not music', X.notIcon('music')),
  c(3, 'Total silence', X.notIcon('cricket')),
  c(3, 'No thoughts', X.clerkBlank),
  c(3, 'Either', X.imagine('robot'), [[0, 'whoosh', 0.25]]),
  c(3, "or she's", X.imagine('spy'), [[0, 'whoosh', 0.25]]),
  c(3, 'Which is exactly', X.imagine('hood'), [[0, 'lowhit', 0.35]]),
  c(3, "She isn't hiding", X.clerkWave),
  c(3, "She's one of", X.voice),
  c(3, 'Researchers only', X.anendo),
  c(3, 'anendophasia', X.anendoWord),
  c(3, 'Some people live', X.lives),
  c(3, 'Many of them', X.neverKnew),
  c(3, 'Quick question', X.toCam),
  c(3, 'Is there a voice', X.viewer),
  c(3, 'Tell us', X.comments(['YES', 'NO', 'WAIT, WHAT?']), [[4, 'pop', 0.25], [12, 'pop', 0.25], [20, 'pop', 0.25]]),
  c(3, 'Oh and', X.stareWhy),
  c(3, 'because Max had', X.paste, [[0, 'boing', 0.3]]),
  c(3, 'Since breakfast', X.brushing),
  c(3, 'Suspect four', X.board(S3, 'OFFICE'), [[6, 'scratch', 0.3]]),
  // 4 Dave
  c(4, 'Suspect two', X.daveCard, [[0, 'slap', 0.4]]),
  c(4, 'Best friend', X.bestFriends),
  c(4, 'Knows everything', X.daveDoor),
  c(4, 'Max reads him', X.readDave),
  c(4, 'Baa baa', X.baa(1, 'BAA BAA')),
  c(4, 'Max reads harder', X.sweat),
  c(4, 'Yes sir', X.baa(2.2, '3 BAGS FULL')),
  c(4, 'Dave is blocking', X.daveFreeze),
  c(4, 'Which is exactly', X.board(S3, undefined, 'DAVE'), [[2, 'lowhit', 0.35]]),
  c(4, "And here's the thing", X.lab),
  c(4, 'In that same', X.labText, [[0, 'typing', 0.25]]),
  c(4, 'people could beat', X.decoderJunk, [[0, 'typing', 0.25]]),
  c(4, 'just by thinking', X.thinkElse),
  c(4, 'Counting', X.counting),
  c(4, 'Naming animals', X.animals, [[0, 'pop', 0.2], [8, 'pop', 0.2], [16, 'pop', 0.2]]),
  c(4, 'So if a mind', X.glare),
  c(4, 'start counting', X.sevens),
  c(4, "You're welcome", X.mic),
  c(4, 'And if that', X.like, [[24, 'pop', 0.4]]),
  c(4, 'And Max if', X.sneak),
  c(4, 'please stay out', X.micDuck),
  c(4, "It's private", X.duckClose),
  c(4, "It's not about", X.eyebrow),
  c(4, 'Max spends nine', X.timelapse),
  c(4, 'Dave sings', X.daveWindow),
  c(4, 'for all nine', X.twitch),
  c(4, 'Then Dave cracks', X.glitch, [[0, 'crack', 0.35]]),
  c(4, "please don't let", X.ducks),
  c(4, 'Dave is not', X.slam, [[0, 'slap', 0.4]]),
  c(4, 'Dave is just', X.daveDuck),
  c(4, 'Suspect two', X.board(S4, 'DAVE'), [[6, 'scratch', 0.3]], 2),
  c(4, 'cleared', X.clock21, [[0, 'tick', 0.35]]),
  // 5 stadium
  c(5, 'Max goes to', X.stadium, [[0, 'wind', 0.25]]),
  c(5, 'Bad idea', X.badIdea),
  c(5, 'Sixty thousand people', X.sixty, [[0, 'counter', 0.3]]),
  c(5, 'Your brain is', X.wavesOne),
  c(5, "It's called", X.party),
  c(5, 'But thoughts', X.wavesRed),
  c(5, "There's nothing", X.noFilter),
  c(5, 'Kick-off', X.kickoff, [[2, 'slap', 0.35]]),
  c(5, 'Sixty thousand minds', X.tornado, [[0, 'spin', 0.35], [10, 'wind', 0.3]]),
  c(5, 'Goal', X.slamBub('GOAL!', '#2E8B57'), [[0, 'pop', 0.3]]),
  c(5, 'Did I leave', X.slamBub('', '#FF8A1F', 'oven'), [[0, 'pop', 0.3]]),
  c(5, 'Why is that', X.screamSelf, [[0, 'pop', 0.3]]),
  c(5, 'Even the team', X.mascot),
  c(5, 'about quitting', X.daveFaint, [[10, 'boing', 0.3]]),
  c(5, 'Eleven', X.clock2358, [[0, 'tick', 0.45]]),
  c(5, 'Two minutes', X.runOut, [[0, 'whoosh', 0.3]]),
  c(5, 'One suspect left', X.board(S4)),
  // 6 Mum
  c(6, 'Max gets home', X.houseNight),
  c(6, 'The kitchen', X.kitchen),
  c(6, 'Mum is waiting', X.mumCard, [[0, 'lowhit', 0.3]]),
  c(6, "She knows when he's lying", X.lying),
  c(6, "She knows when he's sad", X.sadHug),
  c(6, 'She always has', X.mumWarm),
  c(6, 'Max takes', X.breath),
  c(6, 'And reads his', X.slowGlow),
  c(6, 'for the first', X.intoBubble, [[0, 'whoosh', 0.25]]),
  c(6, "And he doesn't", X.reel),
  c(6, 'He finds', X.himself),
  c(6, 'Every birthday', X.memory('cake')),
  c(6, 'Every scraped', X.memory('knee')),
  c(6, 'The first time he said', X.memory('mum')),
  c(6, "And here's something", X.reel),
  c(6, 'Every time you', X.rebuild),
  c(6, 'A little different', X.shifted),
  c(6, 'So Mum', X.brighter(0.3)),
  c(6, 'She remembers', X.brighter(1)),
  c(6, "Mum didn't write", X.board(S5, 'MUM'), [[6, 'scratch', 0.3]]),
  c(6, "Mum doesn't need", X.tea),
  c(6, "She's been reading", X.teary),
  c(6, 'Then', X.midnight, [[12, 'alarmclock', 0.35]]),
  // 7 reveal
  c(7, 'Something scratches', X.backDoor, [[0, 'scratch', 0.35]]),
  c(7, 'It walks in', X.shadow),
  c(7, 'Sits down', X.sits),
  c(7, 'And stares', X.dogStare),
  c(7, 'It was the dog', X.pawReveal, [[0, 'lowhit', 0.45]]),
  c(7, 'How did', X.crayon, [[24, 'pop', 0.25]]),
  c(7, "We're not", X.notAnswering, [[4, 'slap', 0.3]]),
  c(7, 'But a dog', X.dogMind),
  c(7, 'Dogs can tell', X.faces),
  c(7, 'They follow', X.point),
  c(7, 'Their brains', X.dogVoice),
  c(7, 'Sir Biscuit has', X.callback('bed')),
  c(7, 'Every mood', X.callback('bus')),
  c(7, 'Every lie', X.callback('kitchen')),
  c(7, 'Every time he', X.callback('sad')),
  c(7, 'And what was', X.wonder),
  c(7, 'The answer', X.foodInflate),
  c(7, 'FOOD', X.foodFinal, [[0, 'pop', 0.4], [4, 'dog', 0.3]]),
  // 8 ending
  c(8, 'Max learned', X.breakfast),
  c(8, 'The people who', X.hug),
  c(8, 'They already', X.knowYou),
  c(8, 'And never', X.toastStare),
  c(8, 'let a dog', X.handOver),
  // 9 outro
  c(9, 'Whose mind', X.outroBoard(false)),
  c(9, 'And whose', X.outroBoard(true)),
  c(9, 'Comments', X.comments(['READ FIRST', 'NEVER READ', 'THE DUCK?'])),
  c(9, 'And Max', X.endScreen, [[40, 'boing', 0.3]]),
];

const SOFT = (n: string) => staticFile(`mem/sfx/${n}.mp3`);
const VO_FILES = Array.from({ length: 9 }, (_, i) => `mind/vo0${i + 1}.mp3`);

export const MindEpisode: React.FC = () => {
  const cues = [...CUES].sort((a, b) => a[0] - b[0]);
  const storm = at(5, 'Sixty thousand minds');
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
      <Captions words={CAPTION_WORDS} />
      {VO_FILES.map((src, i) => (
        <Sequence key={src} from={secStart(i + 1)}><Audio src={staticFile(src)} volume={1} /></Sequence>
      ))}
      <Sequence from={0} durationInFrames={secStart(5)}>
        <Audio src={staticFile('ep/music-fun.mp3')} loop volume={(f) => interpolate(f, [0, 15, secStart(5) - 30, secStart(5)], [0, 0.1, 0.1, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
      <Sequence from={secStart(5)} durationInFrames={secStart(6) - secStart(5)}>
        <Audio src={staticFile('ep/music-tense.mp3')} loop volume={(f) => {
          const b = storm - secStart(5);
          return interpolate(f, [0, 30, b - 6, b, b + 60, b + 90], [0, 0.09, 0.09, 0.03, 0.03, 0.09], { extrapolateRight: 'clamp' });
        }} />
      </Sequence>
      <Sequence from={secStart(6)} durationInFrames={TOTAL_FRAMES - secStart(6)}>
        <Audio src={staticFile('ep/music-end.mp3')} loop volume={(f) => interpolate(f, [0, 40, TOTAL_FRAMES - secStart(6) - 60, TOTAL_FRAMES - secStart(6)], [0, 0.1, 0.1, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
    </AbsoluteFill>
  );
};
export { TOTAL_FRAMES as MIND_FRAMES };
