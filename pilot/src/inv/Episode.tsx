// What If You Were Invisible for 24 Hours? Full episode, every shot cued to a narration phrase.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Max, Dog, STAND, HERO, PANIC, SHRUG, WAVE, walkPose, runPose, MUM, DAVE, TEACHER, INK, BONE, MaxProps, Look } from '../max/Max';
import { Cam, CamKey, Stage, Captions, Burst, Confetti, BigNum, Vignette, lerp, remap, FONT, W, H } from '../mem/kit';
import { WOMAN, JANITOR, Label, Rays, Street, Bench, Bedroom, Sandwich, Bus, Stamp, Cake } from '../mem/lib';
import { at, end, secStart, secEnd, TOTAL_FRAMES, CAPTION_WORDS } from './timing';

const F = () => useCurrentFrame();
const GUARD: Look = { jacket: '#2F4FB0', jacketDark: '#1F3680', pants: '#1E2240', shoes: '#141414', sole: '#666', skin: INK };
const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({ x, y, s = 1, r = 0, o = 1, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>{children}</g>
);
type MP = MaxProps & { flip?: boolean };
const M = (x: number, y: number, s: number, p: MP = {}) => <At x={x} y={y} s={s}>{p.flip ? <g transform="scale(-1 1)"><Max {...p} /></g> : <Max {...p} />}</At>;
const Head = (x: number, y: number, s: number, p: MaxProps = {}) => <At x={x} y={y} s={s}><g transform="translate(0 300)"><Max headOnly {...p} /></g></At>;
/** invisible Max: clothes only, or with floating eyeballs */
const Ghost = (x: number, y: number, s: number, p: MP = {}) => M(x, y, s, { ghost: 'eyes', ...p });
type CamP = { a?: CamKey; b?: CamKey; shake?: number; whip?: number; tilt?: number };
const sc = (render: (f: number, d: number) => React.ReactNode, cam: CamP = {}) => (d: number) => {
  const C = () => { const f = F(); return <>{render(f, d)}</>; };
  return <Cam a={cam.a ?? { z: 1 }} b={cam.b ?? { z: 1.06 }} dur={d} shake={cam.shake} whip={cam.whip} tilt={cam.tilt}><C /></Cam>;
};
const PUSH: CamP = { a: { z: 1 }, b: { z: 1.1 } };
const PULL: CamP = { a: { z: 1.1 }, b: { z: 1 } };
const dark = (t = 0) => <Rays bg="#1F2347" ray="#262B57" t={t} />;

// ---------- sets & props ----------
const Cinema: React.FC<{ glow?: number }> = ({ glow = 1 }) => (
  <g>
    <rect width={W} height={H} fill="#1A1320" />
    <rect x={260} y={60} width={1400} height={520} rx={16} fill="#E8E4F0" opacity={0.85 * glow} />
    <path d="M260 580 L120 1080 L1800 1080 L1660 580 Z" fill="#E8E4F0" opacity={0.06 * glow} />
    {[0, 1, 2].map((r) => Array.from({ length: 9 }, (_, i) => <rect key={r + '-' + i} x={150 + i * 190 + r * 30} y={760 + r * 110} width={150} height={120} rx={30} fill="#8E2433" stroke={INK} strokeWidth={6} />))}
  </g>
);
const Popcorn: React.FC = () => (
  <g>
    <path d="M-60 -60 L60 -60 L46 80 L-46 80 Z" fill="#fff" stroke={INK} strokeWidth={7} />
    {[-40, -14, 14, 40].map((x) => <rect key={x} x={x - 7} y={-60} width={14} height={140} fill="#E53935" opacity={0.85} />)}
    {[-44, -18, 8, 34, -30, 0, 26].map((x, i) => <circle key={i} cx={x} cy={-70 - (i > 3 ? 22 : 0)} r={20} fill="#FFF3C4" stroke={INK} strokeWidth={4} />)}
  </g>
);
const Kitchen: React.FC = () => (
  <g>
    <rect width={W} height={H} fill="#F6E3B4" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={430} width={160} height={100} fill="#fff" opacity={0.5} />)}
    <rect y={700} width={W} height={380} fill="#C9A27A" />
    <rect x={0} y={640} width={W} height={70} fill="#8E6845" stroke={INK} strokeWidth={8} />
  </g>
);
const Biscuit: React.FC = () => <g><circle r={34} fill="#D9A15B" stroke={INK} strokeWidth={6} />{[[-12, -8], [10, 4], [-4, 14]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill="#7A4A22" />)}</g>;
const Eye: React.FC<{ through: number; catchIt: boolean }> = ({ through, catchIt }) => (
  <g>
    <circle r={220} fill={catchIt ? '#fff' : 'rgba(255,255,255,0.15)'} stroke={catchIt ? INK : '#9AA3B5'} strokeWidth={12} strokeDasharray={catchIt ? undefined : '24 18'} />
    <circle cx={-170} r={60} fill={catchIt ? '#2F6FD6' : 'none'} stroke={catchIt ? INK : '#9AA3B5'} strokeWidth={8} />
    <path d="M150 -150 A220 220 0 0 1 150 150" fill="none" stroke={catchIt ? '#E53935' : '#9AA3B5'} strokeWidth={26} />
    <line x1={-700} y1={0} x2={catchIt ? 180 : -700 + through * 1500} y2={0} stroke="#FFE45C" strokeWidth={22} strokeLinecap="round" />
    {catchIt && through > 0.6 && <circle cx={180} r={40 + Math.sin(through * 30) * 6} fill="#FFE45C" opacity={0.7} />}
  </g>
);
const Frog: React.FC<{ k: 'frog' | 'squid' | 'eel' }> = ({ k }) => (
  <g>
    {k === 'frog' && <ellipse rx={150} ry={90} fill="rgba(160,230,170,0.35)" stroke="#5FBF77" strokeWidth={6} />}
    {k === 'squid' && <path d="M-60 -150 Q0 -230 60 -150 L50 60 Q30 160 0 200 Q-30 160 -50 60 Z" fill="rgba(200,220,255,0.3)" stroke="#8FB0E8" strokeWidth={6} />}
    {k === 'eel' && <path d="M-220 0 Q-110 -50 0 0 T220 0" fill="none" stroke="rgba(220,235,255,0.6)" strokeWidth={50} strokeLinecap="round" />}
    {[[-50, -60], [50, -60]].map(([x, y], i) => k === 'eel' && i ? null : <g key={i}><circle cx={k === 'eel' ? -200 : x} cy={k === 'squid' ? -120 : k === 'eel' ? -6 : y} r={30} fill={INK} /><circle cx={(k === 'eel' ? -200 : x) - 8} cy={(k === 'squid' ? -120 : k === 'eel' ? -6 : y) - 8} r={9} fill="#fff" /></g>)}
    <ellipse cx={k === 'squid' ? 0 : 0} cy={k === 'squid' ? 20 : 20} rx={k === 'eel' ? 0 : 40} ry={k === 'eel' ? 0 : 24} fill="rgba(229,57,53,0.45)" />
  </g>
);
const Vault: React.FC<{ open: number }> = ({ open }) => (
  <g>
    <circle r={300} fill="#8A96A8" stroke={INK} strokeWidth={16} />
    <g transform={`rotate(${open * 180})`}>
      <circle r={220} fill="#A9B4C4" stroke={INK} strokeWidth={10} />
      {[0, 60, 120].map((a) => <line key={a} x1={0} y1={-150} x2={0} y2={150} stroke={INK} strokeWidth={22} strokeLinecap="round" transform={`rotate(${a})`} />)}
      <circle r={40} fill="#5F6A7C" stroke={INK} strokeWidth={8} />
    </g>
  </g>
);
const Gold: React.FC = () => <g>{Array.from({ length: 12 }, (_, i) => <rect key={i} x={(i % 4) * 130 - 260} y={-Math.floor(i / 4) * 60} width={120} height={56} rx={8} fill="#F2C14E" stroke={INK} strokeWidth={6} />)}</g>;
const Stapler: React.FC = () => <g><rect x={-120} y={-10} width={240} height={50} rx={14} fill="#E53935" stroke={INK} strokeWidth={8} /><path d="M-120 -10 L110 -40 L120 -10 Z" fill="#C42222" stroke={INK} strokeWidth={8} /></g>;
const Phone: React.FC<{ t: string }> = ({ t }) => (
  <g>
    <rect x={-150} y={-280} width={300} height={560} rx={40} fill="#22252E" stroke={INK} strokeWidth={10} />
    <rect x={-128} y={-250} width={256} height={500} rx={24} fill="#3A3F58" />
    <Label x={0} y={0} t={t} size={44} color="#FF6B5E" />
  </g>
);
const Thermal: React.FC<{ t: number; glow: boolean }> = ({ t, glow }) => (
  <g>
    <rect width={W} height={H} fill="#140A30" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 250} y={300} width={200} height={500} fill="#24124A" />)}
    {glow && <g transform="translate(960 900) scale(1.4)">
      <ellipse cx={0} cy={-300} rx={110} ry={110} fill="#FF8A1F" opacity={0.9} />
      <rect x={-90} y={-200} width={180} height={200} rx={60} fill="#FF6A1F" opacity={0.9} />
      <circle cx={0} cy={-300} r={60} fill="#FFE45C" opacity={0.85} />
      <rect x={-50} y={-160} width={100} height={110} rx={40} fill="#FFD21F" opacity={0.8} />
    </g>}
    {Array.from({ length: 30 }, (_, i) => <rect key={'n' + i} x={(i * 211 + t * 13) % W} y={(i * 97) % H} width={40} height={2} fill="#fff" opacity={0.08} />)}
  </g>
);
const HourCard = (n: string, red = false) => sc((f) => (
  <Stage bg={red ? '#5A0F14' : '#14152A'}>
    <Rays bg={red ? '#5A0F14' : '#14152A'} ray={red ? '#6E141B' : '#1C1E3A'} t={f} />
    <At x={960} y={500} s={lerp(f, 0, 6, 1.5, 1, (t) => t)}><BigNum text={`HOUR ${n}`} size={190} color={red ? '#FF6B5E' : '#FFD21F'} /></At>
    <At x={960} y={680} o={0.8}><Label x={0} y={0} t="/ 24" size={70} /></At>
  </Stage>
), { a: { z: 1 }, b: { z: 1.03 }, shake: 0.4 });

// ================= scenes =================
const X = {
  // ---- 1 cold open
  walk: sc((f) => <Stage><Street crossing={false} />{Ghost(500 + f * 6, 1030, 1.35, { ghost: 'clothes', pose: walkPose(f / 5) })}</Stage>, { a: { z: 1, x: -60 }, b: { z: 1.04, x: 60 } }),
  clock: sc((f) => { const s = 86400 - Math.floor(f * 40); const hh = String(Math.floor(s / 3600)).padStart(2, '0'), mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0'), ss = String(s % 60).padStart(2, '0'); return <Stage>{dark(f)}<At x={960} y={520} s={lerp(f, 0, 6, 1.3, 1)}><rect x={-560} y={-170} width={1120} height={340} rx={40} fill="#0B0C18" stroke="#FFD21F" strokeWidth={10} /><text textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={900} fontSize={200} fill="#FF5A4E">{f < 8 ? '24:00:00' : `${hh}:${mm}:${ss}`}</text></At></Stage>; }, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.5 }),
  popcornFloat: sc((f) => <Stage><Cinema /><At x={960 + Math.sin(f / 8) * 40} y={620 - f * 2} r={Math.sin(f / 6) * 8} s={1.3}><Popcorn /></At></Stage>, PUSH),
  donut: sc((f) => { const bites = Math.min(4, Math.floor(f / 7)); return <Stage bg="#F07FA8"><Rays bg="#F07FA8" ray="#F48CB2" t={f} /><At x={960} y={520} s={2.2}><circle r={100} fill="#E8B46B" stroke={INK} strokeWidth={10} /><circle r={88} fill="#F7B6C8" /><circle r={34} fill="#F07FA8" stroke={INK} strokeWidth={8} />{Array.from({ length: bites }, (_, i) => { const a = -Math.PI / 4 + i * 0.7; return <circle key={i} cx={Math.cos(a) * 100} cy={Math.sin(a) * 100} r={44} fill="#F07FA8" />; })}</At></Stage>; }, PUSH),
  door: sc((f) => <Stage bg="#7FB685"><rect x={760} y={240} width={400} height={760} fill="#1F2347" /><path d={`M760 240 L${1160 - lerp(f, 0, 20, 0, 300)} ${240 + lerp(f, 0, 20, 0, 40)} L${1160 - lerp(f, 0, 20, 0, 300)} ${1000 - lerp(f, 0, 20, 0, 40)} L760 1000 Z`} fill="#8E5BD6" stroke={INK} strokeWidth={10} /><rect y={1000} width={W} height={80} fill="#5A4632" /></Stage>, PUSH),
  daveScream: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} />{M(620, 1040, 1.4, { outfit: DAVE, expr: 'panic', pose: { ...PANIC, lean: -10 } })}<At x={1240} y={480 + Math.sin(f / 6) * 20} r={Math.sin(f / 5) * 10} s={1.2}><Sandwich k={2} /></At></Stage>, { a: { z: 1 }, b: { z: 1.06 }, shake: 0.4 }),
  black: sc(() => <Stage bg="#000" />, { a: { z: 1 }, b: { z: 1 } }),
  eyesPanic: sc((f) => <Stage bg="#0B0C18">{Head(960, 600, 3, { ghost: 'eyes', expr: 'panic', look: [Math.sin(f / 4), 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.06 } }),
  headlights: sc((f) => <Stage><Street tint="rgba(10,10,30,0.55)" /><At x={960} y={760} s={lerp(f, 0, 30, 0.8, 2.6)}><Bus /></At><rect width={W} height={H} fill="#FFF6C2" opacity={lerp(f, 16, 28, 0, 0.9)} /></Stage>, { a: { z: 1 }, b: { z: 1.03 }, shake: 0.8 }),
  // ---- 2 the dream
  cinemaWalk: sc((f) => <Stage><Cinema /><rect x={300} y={600} width={260} height={140} rx={14} fill="#5A3324" stroke={INK} strokeWidth={8} />{M(380, 600, 0.9, { outfit: TEACHER, expr: 'blank', look: [0, -0.4] })}{Ghost(700 + f * 6, 960, 1.1, { ghost: 'clothes', pose: walkPose(f / 4) })}</Stage>, PUSH),
  tickets: sc((f) => <Stage bg="#8E2433">{[0, 1, 2].map((i) => <At key={i} x={480 + i * 480} y={520} r={-6 + i * 6}><rect x={-180} y={-100} width={360} height={200} rx={16} fill="#FFE29A" stroke={INK} strokeWidth={8} /><Label x={0} y={-40} t={`FILM ${i + 1}`} size={44} color={INK} /><Stamp t="FREE" p={lerp(f, 6 + i * 10, 12 + i * 10, 0, 1)} size={70} color="#2E9E5B" /></At>)}</Stage>, PUSH),
  chewing: sc((f) => <Stage><Cinema glow={0.4} />{[0, 1, 2, 3].map((i) => <At key={i} x={300 + i * 380} y={900} s={0.8}><g transform="translate(0 300)"><Max headOnly expr={f > 20 ? 'wince' : 'blank'} look={[i < 2 ? 0.8 : -0.8, 0]} /></g></At>)}<At x={960} y={680 + Math.sin(f / 3) * 6} s={1.2}><Popcorn /></At><At x={1150} y={560} o={(f % 10) < 5 ? 1 : 0}><Label x={0} y={0} t="CRUNCH" size={60} color="#FFD21F" /></At></Stage>, PUSH),
  tap: sc((f) => { const ph = Math.floor(f / 10) % 3; return <Stage bg="#3DBE7A"><Rays bg="#3DBE7A" ray="#4ACB86" t={f} />{M(900, 1040, 1.4, { outfit: DAVE, expr: 'shocked', look: [ph === 0 ? -0.9 : ph === 1 ? 0.9 : 0, 0], pose: { ...STAND, tilt: ph === 2 ? 10 : 0 }, flip: ph === 1 })}{Ghost(1300, 1040, 1.4, { ghost: 'clothes', pose: { ...STAND, shL: -80, elL: 0 } })}</Stage>; }, PUSH),
  van: sc((f) => <Stage><Street crossing={false} /><At x={600 + f * 22} y={900} s={1.3}><rect x={-260} y={-300} width={420} height={300} rx={20} fill="#fff" stroke={INK} strokeWidth={10} /><rect x={160} y={-200} width={140} height={200} rx={16} fill="#E53935" stroke={INK} strokeWidth={10} /><circle cx={-160} cy={10} r={50} fill={INK} /><circle cx={200} cy={10} r={50} fill={INK} /><At x={-30} y={-150} s={0.45}><g transform="translate(0 300)"><Max headOnly outfit={DAVE} expr="panic" /></g></At></At></Stage>, { a: { z: 1, x: 0 }, b: { z: 1.04, x: 200 } }),
  kitchen: sc((f) => { const lift = lerp(f, 6, 30, 0, 160); return <Stage><Kitchen />{M(1300, 1040, 1.35, { outfit: MUM, expr: 'blank', look: [-0.6, 0] })}<At x={640} y={620}><ellipse rx={150} ry={26} fill="#fff" stroke={INK} strokeWidth={6} /></At><At x={640} y={590 - lift} r={lift / 6}><Biscuit /></At></Stage>; }, PUSH),
  mumStare: sc((f) => <Stage><Kitchen />{Head(960, 640, 2.6, { outfit: MUM, expr: { eyes: 'open', lid: 0.55, lidAngle: 0, mouth: 'flat' } })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  shrug: sc((f) => <Stage><Kitchen />{Ghost(960, 1040, 1.4, { ghost: 'clothes', pose: SHRUG })}<At x={1400} y={600}><Biscuit /></At></Stage>, PUSH),
  selfie: sc((f) => <Stage><Street crossing={false} />{M(760, 1040, 1.3, { outfit: WOMAN, expr: 'happy', pose: { ...STAND, shR: 150, elR: 20 } })}{Head(1080, 560, 0.75, { ghost: 'eyes', expr: 'laugh' })}<At x={1080} y={480}><rect x={-80} y={-26} width={160} height={52} rx={20} fill={INK} /></At><At x={1180} y={460} r={10}><path d="M0 0 l-20 -60 M0 0 l20 -60" stroke="#FFC72C" strokeWidth={14} strokeLinecap="round" /></At></Stage>, PUSH),
  gallery: sc((f) => <Stage bg="#22252E">{Array.from({ length: 12 }, (_, i) => <At key={i} x={250 + (i % 4) * 470} y={200 + Math.floor(i / 4) * 330 - lerp(f, 0, 60, 0, 120)}><rect x={-200} y={-140} width={400} height={280} rx={16} fill="#9ED8F0" stroke="#fff" strokeWidth={6} /><rect x={-80} y={-26} width={160} height={52} rx={20} fill={INK} /><path d="M100 -30 l-20 -50 M100 -30 l20 -50" stroke="#FFC72C" strokeWidth={12} strokeLinecap="round" /></At>)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  // ---- 3 the reveal
  heroMovie: sc((f) => <Stage><Cinema /><At x={960} y={330}><Label x={0} y={0} t="INVISIBLE MAN 4" size={90} color="#2F6FD6" /></At><At x={960} y={330}><Stamp t="WRONG" p={lerp(f, 14, 22, 0, 1)} size={150} /></At></Stage>, PUSH),
  beamThrough: sc((f) => <Stage>{dark(f)}<g opacity={0.35}>{Ghost(960, 1000, 1.5, { ghost: 'clothes' })}</g><line x1={0} y1={520} x2={lerp(f, 0, 30, 0, W)} y2={520} stroke="#FFE45C" strokeWidth={26} strokeLinecap="round" /><Label x={960} y={140} t="IN ONE SIDE… OUT THE OTHER" size={56} /></Stage>, PUSH),
  eyeCatch: sc((f) => <Stage bg="#1F2347"><At x={960} y={520}><Eye through={lerp(f, 0, 30, 0, 1)} catchIt /></At><Label x={1340} y={260} t="CATCH" size={80} color="#FFD21F" /></Stage>, PUSH),
  eyeMiss: sc((f) => <Stage bg="#1F2347"><At x={960} y={520}><Eye through={lerp(f, 0, 40, 0, 1)} catchIt={false} /></At><Label x={1340} y={260} t="MISSED" size={80} color="#FF6B5E" /></Stage>, PUSH),
  glassWater: sc((f) => <Stage bg="#F3EEE4">{Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 260} y={0} width={130} height={H} fill="#E3DACB" />)}<At x={960} y={560} s={1.6}><path d="M-120 -200 L120 -200 L100 200 L-100 200 Z" fill="rgba(160,210,240,0.35)" stroke={INK} strokeWidth={10} /><rect x={-104} y={-60} width={208} height={256} fill="rgba(79,179,240,0.35)" /></At></Stage>, PUSH),
  bend: sc((f) => { const k = lerp(f, 0, 30, 0, 1); return <Stage>{dark(f)}<At x={600} y={540}><rect x={-120} y={-200} width={240} height={400} fill="rgba(160,210,240,0.3)" stroke="#9ED8F0" strokeWidth={8} /><path d={`M-500 -80 L-120 -80 L120 40 L${-120 + 620 * k} ${40 + 80 * k}`} fill="none" stroke="#FFE45C" strokeWidth={18} /><Label x={0} y={300} t="BENDS = SEEN" size={56} /></At><At x={1400} y={540}><g opacity={0.35}><circle r={160} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="20 16" /></g><line x1={-400} y1={-80} x2={-400 + 800 * k} y2={-80} stroke="#FFE45C" strokeWidth={18} /><Label x={0} y={300} t="LIKE AIR = GONE" size={56} color="#3DE07A" /></At></Stage>; }, PUSH),
  jacketPush: sc((f) => <Stage bg="#2A2340">{Ghost(960, 1060, 1.6, { ghost: 'clothes' })}</Stage>, { a: { z: 1 }, b: { z: 1.15 } }),
  blind: sc((f) => { const k = lerp(f, 0, 40, 0, 1); return <Stage><Street crossing={false} /><rect width={W} height={H} fill="#000" opacity={k} /><circle cx={960} cy={540} r={1200 * (1 - k)} fill="none" stroke="#000" strokeWidth={1200} opacity={1} /><At x={960} y={540} o={lerp(f, 30, 40, 0, 1)}><Label x={0} y={0} t="BLIND" size={140} color="#FF6B5E" /></At></Stage>; }, { a: { z: 1 }, b: { z: 1.02 } }),
  wallBonk: sc((f) => { const hit = (f % 30) > 12 && (f % 30) < 18; return <Stage><Cinema />{Ghost(860 + Math.min(f % 30, 12) * 10, 1050, 1.3, { ghost: 'clothes', pose: { ...STAND, lean: hit ? -10 : 0 } })}<rect x={1080} y={0} width={120} height={H} fill="#3A2830" stroke={INK} strokeWidth={8} />{hit && <Burst x={1080} y={600} p={((f % 30) - 12) / 6} color="#fff" r={200} n={8} />}</Stage>; }, PUSH),
  nature: sc((f) => <Stage bg="#0E3B57">{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={(i * 337 + f * 3) % W} cy={(i * 191) % H} r={6} fill="#9ED8F0" opacity={0.4} />)}<At x={420} y={560}><Frog k="frog" /></At><At x={960} y={540} r={Math.sin(f / 10) * 6}><Frog k="squid" /></At><At x={1500} y={560}><Frog k="eel" /></At><Label x={960} y={110} t="EYES ALWAYS SHOW" size={70} color="#FFD21F" /></Stage>, PUSH),
  eyesCircled: sc((f) => <Stage bg="#0E3B57"><At x={960} y={540} s={2.2}><Frog k="frog" /></At>{[[850, 410], [1070, 410]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={90 + Math.sin(f / 4) * 10} fill="none" stroke="#FFD21F" strokeWidth={12} />)}</Stage>, PUSH),
  like: sc((f) => { const press = f > 30; return <Stage bg="#1F2347">{Head(640, 640, 2.2, { ghost: 'eyes', expr: 'smug', look: [0.5, 0] })}<At x={1320} y={540} s={press ? lerp(f, 30, 36, 0.85, 1.05) : 1}><rect x={-220} y={-110} width={440} height={220} rx={110} fill={press ? '#2F6FD6' : '#3A3F58'} stroke="#fff" strokeWidth={8} /><path d="M-60 40 L-60 -20 L-20 -20 L10 -80 Q40 -80 34 -40 L30 -20 L80 -20 Q100 -20 96 4 L80 60 Q76 76 60 76 L-60 76 Z" fill="#fff" transform="translate(-20 -10) scale(0.9)" /></At>{press && <Burst x={1320} y={540} p={lerp(f, 30, 44, 0, 1)} color="#FFD21F" r={320} />}</Stage>; }, PUSH),
  // ---- 4 blind chaos
  stick: sc((f) => <Stage><Street crossing={false} /><At x={600 + f * 5} y={980} r={20 + Math.sin(f / 3) * 10}><line x1={0} y1={-260} x2={0} y2={60} stroke="#fff" strokeWidth={14} strokeLinecap="round" /><line x1={0} y1={30} x2={0} y2={60} stroke="#E53935" strokeWidth={14} /></At>{[0, 1, 2].map((i) => <At key={i} x={1300 + i * 200 + f * 4} y={1040} s={1}><Max outfit={[WOMAN, DAVE, MUM][i]} expr="panic" pose={runPose(f / 3 + i)} /></At>)}</Stage>, PUSH),
  click: sc((f) => <Stage><Street crossing={false} />{Ghost(760, 1040, 1.3, { ghost: 'clothes' })}{[0, 1, 2].map((i) => { const r = ((f * 6 + i * 70) % 220); return <circle key={i} cx={760} cy={600} r={r} fill="none" stroke="#fff" strokeWidth={8} opacity={1 - r / 220} />; })}<rect x={1300} y={300} width={30} height={760} fill="#3A3D48" /></Stage>, PUSH),
  batPerson: sc((f) => <Stage bg="#1F2347">{[0, 1].map((i) => <g key={i}>{[0, 1, 2].map((j) => { const r = ((f * 5 + j * 60) % 200); return <circle key={j} cx={i ? 1340 : 580} cy={420} r={r} fill="none" stroke="#9ED8F0" strokeWidth={6} opacity={1 - r / 200} />; })}</g>)}<At x={580} y={420} s={1.6}><path d="M-100 0 Q-60 -60 -20 -10 Q0 -40 20 -10 Q60 -60 100 0 Q60 -20 20 20 L0 40 L-20 20 Q-60 -20 -100 0 Z" fill={INK} stroke="#fff" strokeWidth={4} /></At>{M(1340, 960, 1.1, { expr: 'smug', look: [0, 0] })}<Label x={960} y={960} t="ECHOLOCATION" size={70} color="#FFD21F" /></Stage>, PUSH),
  lamppost: sc((f) => { const hit = f > 16; return <Stage><Street crossing={false} /><rect x={1040} y={260} width={34} height={800} fill="#3A3D48" stroke={INK} strokeWidth={6} />{Ghost(hit ? 880 : 700 + f * 10, 1040, 1.3, { ghost: 'clothes', pose: hit ? { ...STAND, lean: -14, hipL: -40, knL: 50 } : walkPose(f / 3) })}{hit && f < 30 && <Burst x={1040} y={620} p={lerp(f, 16, 30, 0, 1)} color="#fff" r={220} n={8} />}</Stage>; }, PUSH),
  stomach: sc((f) => { const k = lerp(f, 0, 50, 0, 1); return <Stage bg="#FFF2D6"><g opacity={0.25}>{Ghost(960, 1060, 1.6, { ghost: 'clothes' })}</g><path d="M960 380 L960 700" stroke="#C7CDD8" strokeWidth={30} strokeDasharray="8 12" /><ellipse cx={960} cy={760} rx={130} ry={90} fill="none" stroke="#C7CDD8" strokeWidth={10} strokeDasharray="14 12" /><At x={960} y={300 + 460 * k} s={0.6} r={k * 40}><Sandwich k={3} /></At></Stage>; }, PUSH),
  waiter: sc((f) => <Stage bg="#E8D8B8"><rect x={760} y={760} width={400} height={30} fill="#8E6845" stroke={INK} strokeWidth={6} /><At x={960} y={620 + Math.sin(f / 6) * 6} s={0.8}><Sandwich k={1} /></At>{M(1420, 1040 + (f > 20 ? lerp(f, 20, 30, 0, 300) : 0), 1.3, { outfit: TEACHER, expr: f > 14 ? 'shocked' : 'blank', look: [-0.7, 0] })}</Stage>, PUSH),
  shiver: sc((f) => <Stage><Bench /><rect width={W} height={H} fill="#FFE29A" opacity={0.25} />{Ghost(960 + Math.sin(f * 2) * 4, 860, 1.05, { ghost: 'clothes', pose: { ...STAND, hipL: -70, knL: 70, hipR: -60, knR: 60, shL: 40, elL: 100, shR: -40, elR: -100 } })}<circle cx={1700} cy={140} r={90} fill="#FFD21F" /></Stage>, PUSH),
  sunGfx: sc((f) => <Stage bg="#9ED8F0"><circle cx={960} cy={0} r={160} fill="#FFD21F" />{[0, 1, 2, 3].map((i) => <line key={i} x1={960} y1={140} x2={i < 2 ? 520 + i * 60 : 1340 + (i - 2) * 60} y2={600} stroke="#FFD21F" strokeWidth={12} strokeDasharray="30 20" strokeDashoffset={-f * 4} />)}{M(560, 1040, 1.3, { outfit: DAVE, expr: 'happy' })}<circle cx={560} cy={700} r={260} fill="#FF8A1F" opacity={0.18} /><g>{Ghost(1360, 1040, 1.3, { ghost: 'clothes' })}</g><circle cx={1360} cy={700} r={260} fill="#2F6FD6" opacity={0.15} /><Label x={560} y={140} t="WARM" size={70} color="#FF8A1F" /><Label x={1360} y={140} t="COLD" size={70} color="#2F6FD6" /></Stage>, PUSH),
  coats: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><At x={960} y={1040} s={1.5}><Max ghost="clothes" outfit={{ ...JANITOR, jacket: '#E53935' }} /></At><At x={960} y={1040} s={1.62}><Max ghost="clothes" outfit={{ ...JANITOR, jacket: '#2F6FD6' }} /></At><At x={960} y={1040} s={1.74}><Max ghost="clothes" /></At><Label x={1500} y={200} t="30°C" size={120} color="#E53935" /></Stage>, PUSH),
  sniff: sc((f) => <Stage><Street crossing={false} /><At x={960} y={1000} s={2}><Dog expr="happy" wag={Math.sin(f / 3)} /></At>{[0, 1, 2].map((i) => <path key={i} d={`M${700 - i * 90} ${700 - i * 30} q30 -30 60 0 t60 0`} fill="none" stroke="#fff" strokeWidth={8} opacity={0.5 + 0.5 * Math.sin(f / 5 + i)} />)}</Stage>, PUSH),
  dogFinds: sc((f) => <Stage><Street crossing={false} />{Ghost(1200, 1030, 1.3, { ghost: 'eyes', expr: 'happy', look: [-0.7, 0.6] })}<At x={300 + Math.min(f, 40) * 16} y={1000} s={1.5}><Dog expr="happy" wag={Math.sin(f / 2)} /></At></Stage>, PUSH),
  pat: sc((f) => <Stage bg="#E8C35B"><Rays bg="#E8C35B" ray="#F0CD6B" t={f} /><At x={960} y={960} s={2.6}><Dog expr="happy" wag={Math.sin(f / 2) * 1.5} /></At><At x={780} y={520 + Math.abs(Math.sin(f / 6)) * 30}><path d="M-40 -20 q40 -30 80 0" stroke="#FFF6C2" strokeWidth={10} fill="none" /></At></Stage>, PUSH),
  dusk: sc((f) => <Stage><Street crossing={false} tint={`rgba(20,20,60,${lerp(f, 0, 60, 0.1, 0.6)})`} />{Ghost(960, 1030, 1.3, { ghost: 'eyes', expr: 'shocked', look: [Math.sin(f / 8), 0] })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  // ---- 5 the bus
  crossingEyes: sc((f) => <Stage><Street signal="green" tint="rgba(20,20,60,0.45)" />{Ghost(960, 1030, 1.3, { ghost: 'eyes', expr: 'panic', look: [Math.sin(f / 4), 0] })}</Stage>, PUSH),
  driverPov: sc((f) => <Stage><Street signal="green" tint="rgba(20,20,60,0.45)" /><rect y={760} width={W} height={320} fill="#22252E" /><rect x={0} y={0} width={W} height={80} fill="#22252E" /><At x={1500} y={1000} r={-20}><circle r={180} fill="none" stroke="#3A3D48" strokeWidth={40} /></At><Label x={960} y={400} t="NOBODY THERE" size={64} /></Stage>, PUSH),
  stepOut: sc((f) => { const t = remap(f, [[0, 0.4]]); return <Stage><Street signal="green" tint="rgba(20,20,60,0.45)" /><At x={960} y={860 + Math.min(t, 10) * 3} s={2.4}><ellipse cx={-30} cy={0} rx={60} ry={30} fill="#E53935" stroke={INK} strokeWidth={8} /><ellipse cx={60} cy={-10 + Math.min(t, 10)} rx={60} ry={30} fill="#E53935" stroke={INK} strokeWidth={8} /></At></Stage>; }, { a: { z: 1 }, b: { z: 1.04 } }),
  busPiece: sc((f) => { const t = remap(f, [[0, 1], [8, 0.15]]); const bx = 1750 - t * 6; return <Stage><Street signal="green" tint="rgba(20,20,40,0.35)" />{Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return <line key={i} x1={960 + Math.cos(a) * 380} y1={600 + Math.sin(a) * 260} x2={960 + Math.cos(a) * 1500} y2={600 + Math.sin(a) * 1000} stroke="#fff" strokeWidth={6} opacity={0.18} />; })}{[3, 2, 1].map((k) => <At key={k} x={bx + k * 40} y={860} s={1.6 + t * 0.012} o={0.12 * (4 - k)}><Bus /></At>)}{Ghost(980, 1030, 1.5, { ghost: 'eyes', expr: 'panic', look: [0.9, 0], pose: { ...PANIC, lean: -6 } })}<At x={bx} y={860} s={1.6 + t * 0.012}><Bus /></At>{Array.from({ length: 16 }, (_, i) => { const a = -Math.PI / 2 + (i - 8) * 0.18; const r = 60 + t * (6 + (i % 4)); return <rect key={i} x={bx - 500 + Math.cos(a) * r} y={980 + Math.sin(a) * r * 0.5} width={14} height={10} fill={i % 2 ? '#C9C3B6' : '#8A8D99'} transform={`rotate(${t * 20 + i * 30} ${bx - 500 + Math.cos(a) * r} ${980 + Math.sin(a) * r * 0.5})`} />; })}<At x={560} y={1000} s={1.4}><Dog expr="offended" /></At><Vignette strength={0.5} /></Stage>; }, { a: { z: 1, x: 0 }, b: { z: 1.12, x: 80 }, shake: 0.4 }),
  yank: sc((f) => { const back = lerp(f, 0, 8, 0, 1); return <Stage><Street signal="green" />{Ghost(980 - back * 260, 1030, 1.4, { ghost: 'clothes', pose: { ...PANIC, lean: -14 * back } })}<At x={560} y={1000} s={1.4}><Dog expr="offended" wag={2} /></At><At x={2600 - f * 120} y={860} s={1.6}><Bus /></At></Stage>; }, { a: { z: 1.04 }, b: { z: 1 }, shake: 1 }),
  seenSafe: sc((f) => <Stage><Street signal="green" /><At x={960} y={320} s={1 + Math.sin(f / 8) * 0.04}><ellipse rx={220} ry={120} fill="#fff" stroke={INK} strokeWidth={12} /><circle r={70} fill="#2F6FD6" stroke={INK} strokeWidth={10} /><circle r={30} fill={INK} /></At><Label x={960} y={560} t="SEEN = SAFE" size={90} color="#3DE07A" /></Stage>, PUSH),
  // ---- 6 the heist
  bankFront: sc((f) => <Stage bg="#9ED8F0"><rect x={360} y={180} width={1200} height={820} fill="#E8E0D0" stroke={INK} strokeWidth={10} /><path d="M300 200 L960 40 L1620 200 Z" fill="#D8CEB8" stroke={INK} strokeWidth={10} />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={460 + i * 230} y={280} width={70} height={700} fill="#F3EEE4" stroke={INK} strokeWidth={6} />)}<Label x={960} y={150} t="BANK" size={80} color={INK} />{Ghost(960, 1060, 1.1, { ghost: 'eyes', expr: 'smug', look: [0, -0.5] })}</Stage>, PUSH),
  guard: sc((f) => <Stage bg="#5F6A7C">{[0, 1, 2].map((i) => <rect key={i} x={200 + i * 600} y={160} width={300} height={880} fill="#3A3F58" stroke={INK} strokeWidth={8} />)}{M(700 + f * 6, 1040, 1.3, { outfit: GUARD, expr: 'blank', pose: walkPose(f / 5) })}<At x={760 + f * 6} y={620}><circle r={14} fill="#FFE29A" stroke={INK} strokeWidth={4} /><circle cx={20} r={14} fill="#FFE29A" stroke={INK} strokeWidth={4} /></At></Stage>, PUSH),
  vault: sc((f) => { const t = remap(f, [[0, 0.5]]); return <Stage bg="#22252E"><At x={960} y={760}><Gold /></At><At x={960} y={480} s={1.2}><Vault open={lerp(t, 0, 20, 0, 1)} /></At></Stage>; }, PUSH),
  grabStapler: sc((f) => <Stage bg="#22252E"><At x={960} y={900}><Gold /></At>{Head(560, 520, 1.4, { ghost: 'eyes', expr: 'happy', look: [0.7, 0] })}<At x={1200} y={460 - lerp(f, 6, 20, 0, 120)} r={-10}><Stapler /></At></Stage>, PUSH),
  staplerFreeze: sc((f) => <Stage bg="#E53935"><Rays bg="#E53935" ray="#EA4B47" t={f} /><At x={960} y={540} s={2.4} r={-8}><Stapler /></At></Stage>, { a: { z: 1 }, b: { z: 1.06 }, shake: 0.4 }),
  securityRoom: sc((f) => <Stage bg="#14152A"><rect x={500} y={160} width={920} height={560} rx={20} fill="#22252E" stroke="#3A3F58" strokeWidth={14} /><rect x={540} y={200} width={840} height={480} fill="#0B0C18" />{M(960, 1160, 1.5, { outfit: GUARD, expr: 'blank', look: [0, -0.8] })}</Stage>, PUSH),
  spectrum: sc((f) => <Stage>{dark(f)}<At x={960} y={480}>{['#7A4FD6', '#2F6FD6', '#3DBE7A', '#FFD21F', '#E53935'].map((c, i) => <rect key={i} x={-600 + i * 160} y={-60} width={160} height={120} fill={c} />)}<rect x={200} y={-60} width={420} height={120} fill="#5A0F14" stroke="#FF6A1F" strokeWidth={8} /><Label x={-200} y={140} t="EYES" size={64} /><Label x={410} y={140} t="HEAT" size={64} color="#FF8A1F" /></At></Stage>, PUSH),
  viper: sc((f) => <Stage><Thermal t={f} glow={false} /><At x={700} y={700}><path d="M-300 100 Q-150 -60 0 60 T300 0" fill="none" stroke="#3A2A6E" strokeWidth={60} strokeLinecap="round" /><circle cx={300} cy={0} r={56} fill="#3A2A6E" /><circle cx={320} cy={-14} r={8} fill="#FFD21F" /></At><At x={1300 + Math.sin(f / 4) * 10} y={760}><ellipse rx={70} ry={40} fill="#FF8A1F" /><circle cx={60} cy={-20} r={30} fill="#FFD21F" /></At></Stage>, PUSH),
  thermalMax: sc((f) => <Stage><Thermal t={f} glow /><rect width={W} height={H} fill="#FF2020" opacity={(f % 16) < 8 ? 0.12 : 0} /><Label x={960} y={90} t="ALERT" size={80} color="#FF5A4E" /></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.4 }),
  runBonk: sc((f) => { const ph = Math.floor(f / 14) % 3; return <Stage bg={['#E8E0D0', '#D8CEB8', '#C8BEA8'][ph]}>{ph === 0 && <rect x={1100} y={0} width={160} height={H} fill="#F3EEE4" stroke={INK} strokeWidth={8} />}{ph === 1 && <path d="M600 760 L1400 760" stroke="#C42222" strokeWidth={20} />}{Ghost(960, 1040, 1.3, { ghost: 'clothes', pose: runPose(f / 2) })}<At x={1060} y={640}><Stapler /></At><rect width={W} height={H} fill="#FF2020" opacity={(f % 16) < 8 ? 0.1 : 0} /></Stage>; }, PUSH),
  rain: sc((f) => <Stage><Street crossing={false} tint="rgba(40,50,80,0.5)" />{Array.from({ length: 70 }, (_, i) => <line key={i} x1={(i * 97) % W} y1={((i * 61 + f * 40) % (H + 100)) - 100} x2={(i * 97) % W - 8} y2={((i * 61 + f * 40) % (H + 100)) - 60} stroke="#BFE6F7" strokeWidth={4} opacity={0.7} />)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  outline: sc((f) => { const k = lerp(f, 0, 50, 0, 1); return <Stage><Street crossing={false} tint="rgba(40,50,80,0.55)" />{Array.from({ length: 70 }, (_, i) => <line key={i} x1={(i * 97) % W} y1={((i * 61 + f * 40) % (H + 100)) - 100} x2={(i * 97) % W - 8} y2={((i * 61 + f * 40) % (H + 100)) - 60} stroke="#BFE6F7" strokeWidth={4} opacity={0.7} />)}<g opacity={k} style={{ filter: 'drop-shadow(0 0 8px #BFE6F7)' }}><At x={960} y={1040} s={1.4}><g opacity={0.6}><Max ghost="clothes" outfit={{ ...JANITOR, jacket: 'rgba(191,230,247,0.4)', jacketDark: 'rgba(191,230,247,0.6)', pants: 'rgba(191,230,247,0.4)', shoes: 'rgba(191,230,247,0.4)' }} /></g><circle cx={0} cy={-300} r={94} fill="rgba(191,230,247,0.25)" stroke="#BFE6F7" strokeWidth={6} /></At></g></Stage>; }, PUSH),
  guardPoints: sc((f) => <Stage><Street crossing={false} tint="rgba(40,50,80,0.5)" />{M(560, 1040, 1.3, { outfit: GUARD, expr: 'shocked', pose: { ...STAND, shR: 92, elR: 0 }, look: [0.8, 0] })}<At x={1300 - f * 3} y={1040} s={1.3}><circle cx={0} cy={-300} r={94} fill="rgba(191,230,247,0.25)" stroke="#BFE6F7" strokeWidth={6} /></At></Stage>, PUSH),
  scarfDoor: sc((f) => <Stage bg="#7FB685"><rect x={560} y={200} width={420} height={840} fill="#8E5BD6" stroke={INK} strokeWidth={10} />{M(760, 1040, 1.3, { outfit: DAVE, expr: 'shocked', look: [0.8, 0] })}<At x={1300} y={640 + Math.sin(f / 6) * 10}><path d="M-80 -40 Q0 -70 80 -40 L70 0 Q0 -24 -70 0 Z M40 -10 L60 180 L20 180 L10 0 Z" fill="#E53935" stroke={INK} strokeWidth={6} />{Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-60 + i * 24} cy={20 + (f + i * 9) % 60} r={5} fill="#7FD4FF" />)}</At></Stage>, PUSH),
  scarfDroop: sc((f) => <Stage bg="#7FB685"><At x={960} y={560} s={1.8}><path d={`M-80 -40 Q0 -70 80 -40 L70 0 Q0 -24 -70 0 Z M40 -10 L${60 - lerp(f, 0, 20, 0, 40)} 180 L${20 - lerp(f, 0, 20, 0, 40)} 180 L10 0 Z`} fill="#E53935" stroke={INK} strokeWidth={6} /></At><Label x={960} y={160} t="“BAD DAY”" size={80} /></Stage>, PUSH),
  aloneDoor: sc((f) => <Stage bg="#0B0C18"><rect x={760} y={160} width={400} height={880} fill="#14152A" />{Head(960, 600, 1.6, { ghost: 'eyes', expr: 'sad', look: [0, 0.4] })}</Stage>, { a: { z: 1 }, b: { z: 1.12 } }),
  // ---- 7 loneliest day
  park: sc((f) => <Stage><Bench />{[0, 1, 2, 3].map((i) => <At key={i} x={((i * 520 + f * (i % 2 ? 4 : -4)) % 2300) - 200} y={1060} s={0.9}><Max outfit={[WOMAN, DAVE, MUM, TEACHER][i]} expr="happy" pose={walkPose(f / 5 + i)} look={[i % 2 ? 0.8 : -0.8, 0]} /></At>)}</Stage>, PUSH),
  bubbles: sc((f) => <Stage><Bench />{[[400, 300], [800, 240], [1250, 330], [1600, 260]].map(([x, y], i) => <At key={i} x={x} y={y + Math.sin(f / 10 + i) * 10}><ellipse rx={140} ry={70} fill="#fff" stroke={INK} strokeWidth={6} /><path d="M-20 60 L-40 110 L10 66" fill="#fff" stroke={INK} strokeWidth={6} /></At>)}<At x={960} y={760}><Label x={0} y={0} t="…" size={120} color="#9AA3B5" /></At></Stage>, PUSH),
  phones: sc((f) => <Stage bg="#22252E">{['CALL ENDED', 'CALL ENDED', 'BLOCKED'].map((t, i) => <At key={i} x={420 + i * 540} y={540} o={f > i * 10 ? 1 : 0} r={(i - 1) * 4}><Phone t={t} /></At>)}</Stage>, PUSH),
  plate: sc((f) => <Stage><Kitchen /><At x={960} y={620}><ellipse rx={240} ry={40} fill="#fff" stroke={INK} strokeWidth={8} />{[-120, -40, 40, 120].map((x) => <At key={x} x={x} y={-30}><Biscuit /></At>)}</At><At x={1400} y={380} r={6}><rect x={-230} y={-110} width={460} height={220} fill="#FFE45C" stroke={INK} strokeWidth={6} /><Label x={0} y={-30} t="FOR MAX." size={46} color={INK} /><Label x={0} y={40} t="STILL MY SON." size={40} color="#E53935" /></At></Stage>, PUSH),
  biscuitTower: sc((f) => <Stage><Kitchen /><g opacity={0.3}>{Ghost(960, 1040, 1.5, { ghost: 'clothes' })}</g>{Array.from({ length: Math.min(6, 1 + Math.floor(f / 8)) }, (_, i) => <At key={i} x={960} y={860 - i * 50}><Biscuit /></At>)}</Stage>, PUSH),
  countdown: sc((f) => <Stage>{dark(f)}<At x={960} y={520}><rect x={-560} y={-170} width={1120} height={340} rx={40} fill="#0B0C18" stroke="#FFD21F" strokeWidth={10} /><text textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={900} fontSize={200} fill="#FF5A4E">{`00:${String(59 - Math.floor(f / 30)).padStart(2, '0')}:${String(59 - (f % 60)).padStart(2, '0')}`}</text></At></Stage>, PUSH),
  flicker: sc((f) => <Stage bg="#14152A"><g opacity={(f % 8) < 4 ? 1 : 0.2}>{M(960, 1040, 1.4, { expr: 'shocked' })}</g><At x={1440} y={1000} s={1.4}><Dog expr="happy" /></At></Stage>, { a: { z: 1 }, b: { z: 1.06 }, shake: 0.3 }),
  // ---- 8 fix and twist
  lab: sc((f) => <Stage bg="#DDF2FA">{M(500, 1040, 1.3, { outfit: TEACHER, expr: 'determined', pose: { ...STAND, shR: 70, elR: 30 } })}<At x={1200} y={500}><circle r={200} fill="#22252E" stroke={INK} strokeWidth={12} /><g transform={`rotate(${lerp(f, 6, 30, -60, 60)})`}><path d="M-12 0 L0 -170 L12 0 Z" fill="#FFD21F" /></g><circle r={30} fill="#3A3F58" /><Label x={0} y={260} t="SKIN ONLY" size={56} color={INK} /></At></Stage>, PUSH),
  flash: sc((f) => <Stage bg="#fff"><rect width={W} height={H} fill="#FFE45C" opacity={lerp(f, 0, 20, 1, 0)} /><Burst x={960} y={540} p={lerp(f, 0, 24, 0, 1)} color="#FFD21F" r={900} n={20} /></Stage>, { a: { z: 1 }, b: { z: 1.02 }, shake: 0.6 }),
  skeleton: sc((f) => <Stage bg="#DDF2FA">{M(960, 1040, 1.5, { ghost: 'skeleton', expr: 'happy', blink: f % 40 < 4 ? 1 : 0 })}</Stage>, { a: { z: 1.04 }, b: { z: 1 } }),
  mumScream: sc((f) => <Stage><Kitchen />{M(760, 1040, 1.4, { outfit: MUM, expr: 'panic', pose: PANIC })}{Array.from({ length: 4 }, (_, i) => <At key={i} x={900 + i * 60} y={600 + lerp(f, 0, 18, 0, 400) + i * 20} r={f * 8}><Biscuit /></At>)}<At x={1500} y={1040 + lerp(f, 10, 22, 0, 400)} s={1.2} r={lerp(f, 10, 22, 0, 80)}><Max outfit={DAVE} expr="wince" /></At></Stage>, { a: { z: 1 }, b: { z: 1.05 }, shake: 0.6 }),
  window: sc((f) => <Stage bg="#7FB685"><rect x={460} y={160} width={1000} height={760} fill="#E8836B" stroke={INK} strokeWidth={10} /><rect x={660} y={300} width={600} height={460} fill="#DDF2FA" stroke={INK} strokeWidth={10} /><At x={960} y={900} s={1.2}><Max ghost="skeleton" expr="sad" pose={WAVE(f / 3)} /></At><line x1={960} y1={300} x2={960} y2={760} stroke={INK} strokeWidth={8} /></Stage>, PUSH),
  // ---- cutaways (real cuts at phrase breaks, no zooms)
  eyes: (expr: MaxProps['expr'], bg: string, look: [number, number] = [0, 0]) => sc((f) => <Stage><Rays bg={bg} ray="rgba(255,255,255,0.06)" t={f} />{Head(960, 620, 2.6, { ghost: 'eyes', expr, look })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  face: (outfit: Look, expr: MaxProps['expr'], bg: string, look: [number, number] = [0, 0]) => sc((f) => <Stage><Rays bg={bg} ray="rgba(255,255,255,0.06)" t={f} />{Head(960, 640, 2.5, { outfit, expr, look })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  retina: sc((f) => <Stage bg="#1F2347"><At x={520} y={540} s={2.4}><Eye through={1} catchIt /></At><circle cx={952} cy={540} r={60 + Math.sin(f / 4) * 14} fill="#FFE45C" opacity={0.6} /><Label x={1400} y={540} t="ABSORB" size={90} color="#FFD21F" /></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  bendGlass: sc((f) => { const k = lerp(f, 0, 30, 0, 1); return <Stage>{dark(f)}<At x={960} y={540} s={1.5}><rect x={-120} y={-200} width={240} height={400} fill="rgba(160,210,240,0.3)" stroke="#9ED8F0" strokeWidth={8} /><path d={`M-500 -80 L-120 -80 L120 40 L${-120 + 620 * k} ${40 + 80 * k}`} fill="none" stroke="#FFE45C" strokeWidth={18} /><Label x={0} y={300} t="BENDS = SEEN" size={56} /></At></Stage>; }, { a: { z: 1 }, b: { z: 1.04 } }),
  airMatch: sc((f) => { const k = lerp(f, 0, 30, 0, 1); return <Stage>{dark(f)}<g opacity={0.3}>{Ghost(960, 1000, 1.5, { ghost: 'clothes' })}</g><line x1={0} y1={480} x2={W * k} y2={480} stroke="#FFE45C" strokeWidth={22} /><Label x={960} y={140} t="BEND LIKE AIR = GONE" size={70} color="#3DE07A" /></Stage>; }, { a: { z: 1 }, b: { z: 1.04 } }),
  stickClose: sc((f) => <Stage><Street crossing={false} /><At x={960} y={760} r={18 + Math.sin(f / 3) * 12} s={2}><line x1={0} y1={-260} x2={0} y2={60} stroke="#fff" strokeWidth={14} strokeLinecap="round" /><line x1={0} y1={30} x2={0} y2={60} stroke="#E53935" strokeWidth={14} /></At></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  bike: sc((f) => <Stage bg="#7FB685"><rect y={760} width={W} height={320} fill="#4A4E5C" />{[0, 1, 2].map((j) => { const r = ((f * 5 + j * 60) % 260); return <circle key={j} cx={700 + f * 4} cy={520} r={r} fill="none" stroke="#fff" strokeWidth={6} opacity={1 - r / 260} />; })}<At x={700 + f * 4} y={900}><circle cx={-110} cy={60} r={70} fill="none" stroke={INK} strokeWidth={12} /><circle cx={110} cy={60} r={70} fill="none" stroke={INK} strokeWidth={12} /><path d="M-110 60 L0 -20 L110 60 M0 -20 L-30 -80" stroke={INK} strokeWidth={10} fill="none" /></At>{M(700 + f * 4, 880, 0.9, { expr: 'happy', pose: { ...STAND, hipL: -60, knL: 70, hipR: -40, knR: 60, shL: 60, elL: 10, shR: 60, elR: 10 } })}</Stage>, { a: { z: 1, x: -40 }, b: { z: 1.02, x: 80 } }),
  warmDave: sc((f) => <Stage bg="#9ED8F0"><circle cx={1700} cy={120} r={140} fill="#FFD21F" />{[0, 1, 2].map((i) => <line key={i} x1={1700} y1={120} x2={900 + i * 60} y2={560} stroke="#FFD21F" strokeWidth={12} strokeDasharray="30 20" strokeDashoffset={-f * 4} />)}<circle cx={960} cy={700} r={300} fill="#FF8A1F" opacity={0.2 + Math.sin(f / 6) * 0.05} />{M(960, 1040, 1.4, { outfit: DAVE, expr: 'happy' })}<Label x={960} y={140} t="SKIN SOAKS IT UP" size={64} color="#FF8A1F" /></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  thermo: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} /><At x={960} y={540}><rect x={-50} y={-380} width={100} height={620} rx={50} fill="#fff" stroke={INK} strokeWidth={10} /><rect x={-28} y={240 - lerp(f, 0, 30, 60, 520)} width={56} height={lerp(f, 0, 30, 60, 520)} fill="#E53935" /><circle cx={0} cy={280} r={90} fill="#E53935" stroke={INK} strokeWidth={10} /></At><Label x={1340} y={360} t="30°C" size={140} color="#E53935" /></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  smellMap: sc((f) => { const k = lerp(f, 0, 50, 0, 1); return <Stage bg="#E8E0D0">{[0, 1, 2, 3].map((i) => <rect key={i} x={160 + i * 420} y={140} width={300} height={800} fill="#C9C3B6" />)}<path d={`M260 900 C 600 900, 700 300, 1000 500 S 1500 800, 1680 260`} fill="none" stroke="#E2A15B" strokeWidth={14} strokeDasharray="30 22" strokeDashoffset={-f * 6} /><At x={260 + 1420 * k} y={900 - 640 * k} s={0.7}><Dog expr="happy" wag={Math.sin(f / 2)} /></At><At x={1680} y={260} s={0.5}><g transform="translate(0 300)"><Max headOnly ghost="eyes" expr="sad" /></g></At><Label x={960} y={1000} t="2 STREETS" size={70} /></Stage>; }, { a: { z: 1 }, b: { z: 1.03 } }),
  roadStat: sc((f) => <Stage bg="#22252E"><rect y={620} width={W} height={300} fill="#3A3D48" />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170 + ((f * 12) % 170)} y={760} width={90} height={18} fill="#F2F2F2" />)}<At x={960} y={340}><BigNum text={(Math.round(lerp(f, 0, 40, 0, 1190000))).toLocaleString('en-US')} size={170} color="#FF6B5E" /></At><Label x={960} y={500} t="EVERY YEAR" size={60} /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  goldClose: sc((f) => <Stage bg="#22252E"><At x={960} y={640} s={1.6}><Gold /></At>{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={500 + i * 230} cy={400 + Math.sin(f / 5 + i) * 20} r={10} fill="#FFE29A" opacity={0.5 + 0.5 * Math.sin(f / 4 + i)} />)}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  warmBody: sc((f) => <Stage><Thermal t={f} glow /><Label x={960} y={90} t="EVERY WARM BODY GLOWS" size={60} color="#FFD21F" /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  thermalCam: sc((f) => <Stage bg="#14152A"><rect x={300} y={100} width={1320} height={760} rx={20} fill="#22252E" stroke="#3A3F58" strokeWidth={14} /><g transform="translate(340 140) scale(0.65)"><Thermal t={f} glow={false} /></g><circle cx={1560} cy={160} r={14} fill="#E53935" opacity={(f % 20) < 10 ? 1 : 0.2} /><Label x={460} y={170} t="REC" size={40} color="#E53935" /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  splash: sc((f) => <Stage bg="#2A3550">{Array.from({ length: 50 }, (_, i) => <line key={i} x1={(i * 97) % W} y1={((i * 61 + f * 40) % (H + 100)) - 100} x2={(i * 97) % W - 8} y2={((i * 61 + f * 40) % (H + 100)) - 60} stroke="#BFE6F7" strokeWidth={4} opacity={0.7} />)}<path d="M760 700 Q960 380 1160 700" fill="none" stroke="#BFE6F7" strokeWidth={8} opacity={0.6} />{Array.from({ length: 10 }, (_, i) => { const a = -Math.PI + (i / 9) * Math.PI; const r = ((f * 8 + i * 13) % 120); return <circle key={i} cx={960 + Math.cos(a) * (200 + r)} cy={560 + Math.sin(a) * (200 + r) * 0.6} r={8} fill="#BFE6F7" opacity={1 - r / 120} />; })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  manchester: sc((f) => <Stage><Street crossing={false} tint="rgba(60,70,90,0.55)" />{Array.from({ length: 70 }, (_, i) => <line key={i} x1={(i * 97) % W} y1={((i * 61 + f * 40) % (H + 100)) - 100} x2={(i * 97) % W - 8} y2={((i * 61 + f * 40) % (H + 100)) - 60} stroke="#BFE6F7" strokeWidth={4} opacity={0.7} />)}<Label x={960} y={300} t="MANCHESTER" size={120} /><Label x={960} y={440} t="RAIN: 140+ DAYS A YEAR" size={56} color="#BFE6F7" /></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  benchEyes: sc((f) => <Stage><Bench /><At x={960} y={560} s={0.6}><g transform="translate(0 300)"><Max headOnly ghost="eyes" expr="sad" /></g></At>{Ghost(960, 860, 1.05, { ghost: 'clothes', pose: { ...STAND, hipL: -70, knL: 70, hipR: -60, knR: 60 } })}</Stage>, { a: { z: 1.04 }, b: { z: 1 } }),
  phoneDial: sc((f) => <Stage bg="#22252E">{Head(620, 620, 1.8, { ghost: 'eyes', expr: 'happy', look: [0.8, 0] })}<At x={1300} y={540} r={-6}><Phone t={(f % 30) < 15 ? 'CALLING…' : 'CALLING'} /></At></Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
  skelFace: sc((f) => <Stage bg="#DDF2FA">{Head(960, 640, 2.4, { ghost: 'skeleton', expr: 'happy' })}</Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  // ---- 9 outro
  comments: sc((f) => <Stage bg="#1F2347">{Head(560, 640, 2, { ghost: 'eyes', expr: 'smug', look: [0.8, 0] })}<At x={1300} y={540} s={lerp(f, 0, 8, 0.8, 1)}><rect x={-380} y={-180} width={760} height={360} rx={30} fill="#fff" stroke={INK} strokeWidth={8} /><Label x={0} y={-80} t="WRONG ANSWERS" size={56} color={INK} /><Label x={0} y={10} t="ONLY" size={56} color="#E53935" />{[0, 1].map((i) => <line key={i} x1={-300} y1={90 + i * 40} x2={i ? 100 : 300} y2={90 + i * 40} stroke="#C7CDD8" strokeWidth={14} strokeLinecap="round" />)}</At></Stage>, PUSH),
  endScreen: sc((f) => <Stage bg="#1F2347"><Rays bg="#1F2347" ray="#262B57" t={f} /><At x={960} y={760 + Math.sin(f / 6) * 10} s={1.3}><Popcorn /></At>{[0, 1].map((i) => <rect key={i} x={i ? 1280 : 140} y={260} width={500} height={282} rx={20} fill="#2E3466" stroke="#FFD21F" strokeWidth={6} />)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
};

// ================= cue sheet =================
type El = (d: number) => React.ReactNode;
type Cue = [number, El, [number, string, number][]?];
const c = (sec: number, phrase: string, el: El, sfx?: [number, string, number][], nth = 1): Cue => [at(sec, phrase, nth), el, sfx];

const CUES: Cue[] = [
  // 1 cold open
  [secStart(1), X.walk],
  c(1, "You can't see him", X.eyes('smug', '#9ED8F0', [0.6, 0])),
  c(1, 'For the next', X.clock, [[0, 'tick', 0.35]]),
  c(1, 'Free movies', X.popcornFloat, [[0, 'pop', 0.3]]),
  c(1, 'Free food', X.donut, [[6, 'pop', 0.3], [14, 'pop', 0.3]]),
  c(1, 'Zero consequences', X.door),
  c(1, 'Dave has been', X.daveScream),
  c(1, "There's just one", X.black),
  c(1, "Max can't see", X.eyesPanic, [[6, 'bus', 0.3]]),
  c(1, 'And by hour nine', X.headlights, [[0, 'bus', 0.45]]),
  // 2 dream
  c(2, 'Hour one', HourCard('1'), [[0, 'lowhit', 0.45]]),
  c(2, 'Max does what', X.cinemaWalk),
  c(2, 'He watches three', X.tickets, [[6, 'slap', 0.3], [16, 'slap', 0.3], [26, 'slap', 0.3]]),
  c(2, 'Max, I know', X.chewing, [[0, 'pop', 0.25]]),
  c(2, 'Back to back', X.eyes('laugh', '#8E2433')),
  c(2, 'I can hear', X.chewing),
  c(2, 'Hour two', HourCard('2'), [[0, 'lowhit', 0.45]]),
  c(2, 'He taps Dave', X.tap, [[0, 'pop', 0.3], [10, 'pop', 0.3], [20, 'pop', 0.3]]),
  c(2, 'Dave has now', X.van, [[0, 'carby', 0.35]]),
  c(2, 'Hour three', HourCard('3'), [[0, 'lowhit', 0.45]]),
  c(2, 'The ultimate test', X.kitchen),
  c(2, 'Mum does not', X.face(MUM, 'smug', '#F6E3B4', [0.8, 0])),
  c(2, 'Mum just says', X.mumStare),

  c(2, 'Some powers', X.shrug),
  c(2, 'Hour three and', HourCard('3½'), [[0, 'lowhit', 0.4]]),
  c(2, 'Max photobombs', X.selfie, [[0, 'pop', 0.3]]),
  c(2, 'Every single photo', X.gallery),
  // 3 reveal
  c(3, "But here's the part", X.heroMovie, [[14, 'slap', 0.4]]),
  c(3, 'To be invisible', X.beamThrough, [[0, 'whoosh', 0.3]]),
  c(3, 'In one side', X.eyes('shocked', '#1F2347', [1, 0])),
  c(3, 'But your eyes', X.eyeCatch),
  c(3, 'The back of your eye', X.retina),
  c(3, "Invisible eyes", X.eyeMiss, [[0, 'whoosh', 0.3]]),
  c(3, 'The light just', X.eyes('blank', '#1F2347', [1, 0])),
  c(3, 'And being see-through', X.eyes('smug', '#2A2340', [0.6, 0])),
  c(3, 'A glass of water is', X.glassWater),
  c(3, "That's because glass", X.bendGlass),
  c(3, 'To be truly invisible', X.airMatch),
  c(3, 'Not a tiny bit', X.eyes('wince', '#2A2340')),
  c(3, 'So the second', X.jacketPush),
  c(3, 'He went completely', X.blind, [[0, 'lowhit', 0.55]]),
  c(3, 'Which explains', X.wallBonk, [[13, 'slap', 0.35]]),
  c(3, "And it's true", X.eyes('shocked', '#0E3B57')),
  c(3, 'Every see-through animal', X.nature),
  c(3, 'still has visible', X.eyesCircled),
  c(3, 'Because eyes that', X.eyes('blank', '#0E3B57')),
  c(3, "If you'd still", X.like, [[30, 'pop', 0.45]]),
  // 4 blind chaos
  c(3, 'smash like', X.like, [[30, 'pop', 0.45]]),
  c(3, 'If not', X.eyes('determined', '#5A0F14', [0.4, 0])),
  c(4, 'Hour four', HourCard('4'), [[0, 'lowhit', 0.45]]),
  c(4, 'He uses a stick', X.stickClose),
  c(4, 'Then he realises', X.stick),
  c(4, 'So he tries', X.click, [[0, 'tick', 0.3], [12, 'tick', 0.3]]),
  c(4, 'This is real', X.batPerson),
  c(4, 'They can ride', X.bike),
  c(4, 'Max is not one', X.eyes('smug', '#9ED8F0')),
  c(4, 'Max clicks straight', X.lamppost, [[16, 'slap', 0.4]]),
  c(4, 'Hour five', HourCard('5'), [[0, 'lowhit', 0.45]]),
  c(4, "Here's something else", X.eyes('wince', '#FFF2D6')),
  c(4, 'Food is only', X.stomach),
  c(4, 'So for two hours', X.waiter, [[20, 'boing', 0.3]]),
  c(4, 'Hour six', HourCard('6'), [[0, 'lowhit', 0.45]]),
  c(4, 'Sunlight warms', X.warmDave),
  c(4, "Max's doesn't", X.sunGfx),
  c(4, "It's thirty degrees", X.thermo),
  c(4, 'Max is wearing', X.coats, [[0, 'pop', 0.3]]),
  c(4, 'Hour seven', HourCard('7'), [[0, 'lowhit', 0.45]]),
  c(4, "Sir Biscuit doesn't", X.sniff, [[0, 'dog', 0.3]]),
  c(4, 'Only one living', X.eyes('sad', '#7FB685')),
  c(4, 'Sir Biscuit can smell', X.dogFinds),
  c(4, 'Good boy', X.pat),
  c(4, 'From two streets', X.smellMap),
  c(4, 'Hour eight', HourCard('8'), [[0, 'lowhit', 0.45]]),
  c(4, 'Max is lost', X.dusk),
  // 5 bus
  c(5, 'Hour nine', HourCard('9', true), [[0, 'lowhit', 0.55]]),
  c(5, "He can't see", X.crossingEyes),
  c(5, "The traffic can't", X.driverPov),
  c(5, 'Max steps out', X.stepOut),
  c(5, 'Max', X.busPiece, [[0, 'bus', 0.6], [4, 'lowhit', 0.5]], 3),
  c(5, "He's pulled back", X.yank, [[0, 'whoosh', 0.5], [4, 'dog', 0.35]]),
  c(5, 'Every year', X.roadStat),
  c(5, 'Being seen is', X.seenSafe),

  // 6 heist
  c(6, 'Hour ten', HourCard('10'), [[0, 'lowhit', 0.45]]),
  c(6, 'Having nearly died', X.eyes('smug', '#1F2347', [0.5, -0.3])),
  c(6, "He's going to rob", X.bankFront),
  c(6, 'He follows a guard', X.guard),
  c(6, 'The vault door', X.vault, [[0, 'lowhit', 0.4]]),
  c(6, 'Surrounded by millions', X.goldClose),
  c(6, "And he can't see", X.grabStapler),
  c(6, 'Max has stolen', X.staplerFreeze, [[0, 'pop', 0.4]]),
  c(6, "But it doesn't", X.securityRoom),
  c(6, "Here's the thing", X.eyes('smug', '#14152A', [0.5, 0])),
  c(6, 'Max is invisible to', X.spectrum),
  c(6, 'But every warm', X.warmBody),
  c(6, 'Thermal cameras see', X.thermalCam),
  c(6, 'Snakes like', X.viper),

  c(6, "So on the bank's", X.thermalMax, [[0, 'alarm', 0.3]]),
  c(6, 'Max runs', X.runBonk, [[14, 'slap', 0.3], [28, 'slap', 0.3]]),
  c(6, 'Hour twelve', HourCard('12'), [[0, 'lowhit', 0.45]]),
  c(6, 'But then', X.rain, [[0, 'wind', 0.3]]),
  c(6, 'And suddenly', X.outline),
  c(6, 'Every raindrop', X.splash),
  c(6, 'Being invisible only', X.guardPoints),
  c(6, 'Max is from', X.manchester),
  c(6, 'Hour fourteen', HourCard('14'), [[0, 'lowhit', 0.45]]),
  c(6, 'Back home', X.scarfDoor),
  c(6, 'Dave says', X.scarfDroop),
  c(6, "And that's when", X.aloneDoor),
  // 7 loneliest
  c(6, 'The worst part', X.aloneDoor),
  c(7, 'Hour seventeen', HourCard('17'), [[0, 'lowhit', 0.4]]),
  c(7, 'Max sits', X.benchEyes),
  c(7, 'People walk past', X.park),
  c(7, "It's what lonely", X.bubbles),
  c(7, 'It turns out', X.eyes('sad', '#5E7187')),

  c(7, 'He calls his', X.phoneDial),
  c(7, 'They hear his', X.phones, [[0, 'pop', 0.3], [10, 'pop', 0.3], [20, 'pop', 0.3]]),
  c(7, 'They think', X.face(DAVE, 'laugh', '#22252E')),
  c(7, 'Hour twenty', HourCard('20'), [[0, 'lowhit', 0.4]]),
  c(7, 'Mum leaves', X.plate),
  c(7, 'He eats every', X.biscuitTower),
  c(7, 'Hour twenty-three', X.countdown, [[0, 'tick', 0.35]]),
  c(7, 'Three', X.flicker),
  // 8 fix
  c(8, 'So scientists', X.lab),
  c(8, 'Like a glass frog', X.eyesCircled),
  c(8, 'Invisible skin', X.flash, [[0, 'lowhit', 0.5]]),
  c(8, 'They forgot', X.skeleton),
  c(8, 'Mum screamed', X.mumScream, [[0, 'scratch', 0.4]]),
  c(8, 'Max is now', X.skelFace),
  // 9 outro
  c(8, 'and still', X.window),
  c(9, "What's the first", X.eyes('smug', '#1F2347', [0.6, 0])),
  c(9, 'Wrong answers', X.comments),
  c(9, 'And Max', X.endScreen, [[0, 'pop', 0.3]]),
];

const SOFT = (n: string) => staticFile(`mem/sfx/${n}.mp3`);
const VO_FILES = Array.from({ length: 9 }, (_, i) => `inv/vo0${i + 1}.mp3`);

export const InvEpisode: React.FC = () => {
  const cues = [...CUES].sort((a, b) => a[0] - b[0]);
  const bus = at(5, 'Max', 3);
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
      <Sequence from={secStart(5)} durationInFrames={secStart(7) - secStart(5)}>
        <Audio src={staticFile('ep/music-tense.mp3')} loop volume={(f) => {
          const b = bus - secStart(5);
          return interpolate(f, [0, 30, b - 6, b, b + 60, b + 90], [0, 0.09, 0.09, 0, 0, 0.09], { extrapolateRight: 'clamp' });
        }} />
      </Sequence>
      <Sequence from={secStart(7)} durationInFrames={TOTAL_FRAMES - secStart(7)}>
        <Audio src={staticFile('ep/music-end.mp3')} loop volume={(f) => interpolate(f, [0, 40, TOTAL_FRAMES - secStart(7) - 60, TOTAL_FRAMES - secStart(7)], [0, 0.11, 0.11, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
    </AbsoluteFill>
  );
};
export { TOTAL_FRAMES as INV_FRAMES };
