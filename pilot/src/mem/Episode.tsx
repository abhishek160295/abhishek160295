// What If Your Memory Was 100x Better? Full episode, every shot cued to a narration phrase.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Max, Dog, STAND, HERO, PANIC, SHRUG, FACEPALM, POINT, WAVE, walkPose, runPose, MUM, DAVE, TEACHER, INK, Pose, MaxProps } from '../max/Max';
import { Cam, CamKey, Stage, Captions, Burst, Confetti, BigNum, Gauge, Vignette, lerp, remap, FONT, W, H } from './kit';
import {
  WOMAN, JANITOR, ATHLETE, Label, Rays, Bedroom, Street, Pub, Rooftop, Sepia, Office, BrainInside, Bench,
  Screen, Card, Bin, Broom, Glass, Flag, Keys, MicStand, Receipt, Padlock, Cake, Calendar, Stamp, LoadingWheel,
  Sandwich, Rock, Bus, Sieve, Gem, Heart, WorldMap,
} from './lib';
import { S as OPEN } from './ColdOpen';
import { at, end, secStart, secEnd, TOTAL_FRAMES, CAPTION_WORDS } from './timing';

const F = () => useCurrentFrame();
const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({ x, y, s = 1, r = 0, o = 1, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>{children}</g>
);
const M = (x: number, y: number, s: number, p: MaxProps & { flip?: boolean } = {}) => (
  <At x={x} y={y} s={s}>{p.flip ? <g transform="scale(-1 1)"><Max {...p} /></g> : <Max {...p} />}</At>
);
const Head = (x: number, y: number, s: number, p: MaxProps = {}) => <At x={x} y={y} s={s}><g transform="translate(0 300)"><Max headOnly {...p} /></g></At>;

type CamP = { a?: CamKey; b?: CamKey; shake?: number; whip?: number; tilt?: number };
/** scene factory: render(frame, duration) inside a moving camera */
const sc = (render: (f: number, d: number) => React.ReactNode, cam: CamP = {}) => (d: number) => {
  const C = () => { const f = F(); return <>{render(f, d)}</>; };
  return <Cam a={cam.a ?? { z: 1 }} b={cam.b ?? { z: 1.06 }} dur={d} shake={cam.shake} whip={cam.whip} tilt={cam.tilt}><C /></Cam>;
};
const dark = (t = 0) => <Rays bg="#1F2347" ray="#262B57" t={t} />;
const PUSH: CamP = { a: { z: 1 }, b: { z: 1.1 } };
const PULL: CamP = { a: { z: 1.12 }, b: { z: 1 } };
const blink = (f: number, at0 = 40) => (f % 90 > at0 && f % 90 < at0 + 4 ? 1 : 0);

// ================= scenes =================
const X = {
  // ---- 1 extra
  day30: sc((f) => <Stage><Bedroom /><At x={1450} y={430} s={0.9}><Calendar text="30" sub="DAY" /></At>{M(700, 1090, 1.5, { expr: 'hollow', look: [0.5, 0], pose: { ...STAND, tilt: 6 } })}<Vignette strength={0.5} /></Stage>, PUSH),
  busFlash: sc((f) => <Stage><Street signal="green" tint="rgba(10,10,30,0.55)" /><At x={960} y={760} s={lerp(f, 0, 30, 0.8, 2.4)}><Bus /></At><rect width={W} height={H} fill="#FFF6C2" opacity={lerp(f, 18, 30, 0, 0.9)} /></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 1 }),
  title: sc((f) => <Stage bg="#0E0F1F"><At x={960} y={460} s={lerp(f, 0, 8, 1.4, 1, (t) => t)}><BigNum text="CAN'T" size={210} /></At><At x={960} y={650} s={lerp(f, 4, 12, 1.4, 1, (t) => t)} o={f > 4 ? 1 : 0}><BigNum text="FORGET." size={210} color="#FFD21F" /></At></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.7 }),

  // ---- 2 how good
  tape: sc((f) => <Stage bg="#2F6FD6"><Rays bg="#2F6FD6" ray="#3A7BE0" t={f} />{M(820, 1000, 1.45, { expr: 'blank', look: [0.6, -0.7], pose: { ...STAND, shR: 160, elR: 0 } })}<rect x={980} y={380 + Math.max(0, 40 - f) * 8} width={46} height={620} fill="#FFD21F" stroke={INK} strokeWidth={6} />{Array.from({ length: 12 }, (_, i) => <line key={i} x1={980} y1={420 + i * 50} x2={1004} y2={420 + i * 50} stroke={INK} strokeWidth={5} />)}</Stage>, PUSH),
  glassFull: sc(() => <Stage bg="#FFF2D6"><At x={960} y={470}><Glass level={0.92} label="TODAY" /></At></Stage>, PUSH),
  glassDrain: sc((f, d) => <Stage bg="#1F2347"><At x={960} y={470}><Glass level={lerp(f, 6, Math.min(d, 60), 0.92, 0.33)} label="TOMORROW" /></At><At x={1400} y={300} o={lerp(f, 40, 50, 0, 1)}><Label x={0} y={0} t="−⅔" size={120} color="#FF6B5E" /></At></Stage>, PUSH),
  normal: sc((f) => <Stage bg="#3DBE7A">{Array.from({ length: 21 }, (_, i) => <At key={i} x={260 + (i % 7) * 230} y={380 + Math.floor(i / 7) * 250} s={0.62}><g transform="translate(0 300)"><Max headOnly expr={i === 10 ? 'smug' : 'blank'} blink={(f + i * 13) % 70 < 4 ? 1 : 0} /></g></At>)}<At x={960} y={540}><Stamp t="NORMAL" p={lerp(f, 10, 18, 0, 1)} color="#fff" /></At></Stage>, PULL),
  curve: (maxOn: boolean) => sc((f) => {
    const pts = (x: number) => 430 + 420 * (1 - Math.exp(-(x - 160) / 520));
    return (
      <Stage bg="#BFE3EF">
        <path d={`M160 ${pts(160)} ${Array.from({ length: 40 }, (_, i) => { const x = 160 + i * 42; return `L${x} ${pts(x)}`; }).join(' ')} L1800 1080 L160 1080 Z`} fill="#FFFFFF" stroke={INK} strokeWidth={10} />
        {[0, 1, 2, 3].map((i) => { const x = 220 + ((f * (6 + i) + i * 300) % 1500); const y = pts(x); return <At key={i} x={x} y={y + 8} s={0.42} r={30}><Max expr={maxOn ? 'panic' : 'shocked'} pose={{ ...PANIC, lean: 30 }} outfit={i % 2 ? DAVE : WOMAN} /></At>; })}
        {maxOn && <><line x1={120} y1={370} x2={1820} y2={370} stroke="#FFD21F" strokeWidth={22} />{M(400 + f * 4, 362, 0.5, { pose: walkPose(f / 4), expr: 'smug', look: [0.6, 0] })}</>}
        <Label x={960} y={980} t={maxOn ? 'MAX' : 'YOU'} size={80} />
      </Stage>
    );
  }, PUSH),
  cards: sc((f) => { const t = remap(f, [[0, 0.45]]); return <Stage>{dark(f)}{M(960, 1060, 1.4, { outfit: ATHLETE, expr: 'determined', pose: { ...STAND, shL: -70, elL: -60, shR: 70, elR: 60 } })}{Array.from({ length: 13 }, (_, i) => { const a = (i / 13) * Math.PI * 2 + t / 12; return <At key={i} x={960 + Math.cos(a) * 520} y={520 + Math.sin(a) * 280} r={a * 40} s={0.9}><rect x={-60} y={-85} width={120} height={170} rx={12} fill="#fff" stroke={INK} strokeWidth={6} /><text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={70} fill={i % 2 ? '#E53935' : INK}>{['A', 'K', 'Q', 'J', '7'][i % 5]}</text></At>; })}</Stage>; }, { a: { z: 1 }, b: { z: 1.12 } }),
  yawn: sc((f) => <Stage bg="#7A4FD6"><Rays bg="#7A4FD6" ray="#8660E0" t={f} />{M(620, 1020, 1.3, { expr: 'tired', pose: { ...STAND, shR: -150, elR: -30 } })}{M(1320, 1020, 1.3, { outfit: ATHLETE, expr: 'shocked', look: [-0.8, 0] })}<At x={1400} y={300 + lerp(f, 10, 30, 0, 760)} r={f * 4}><rect x={-90} y={-14} width={180} height={28} rx={10} fill="#E53935" stroke={INK} strokeWidth={6} /></At></Stage>, PULL),
  drive: (big: boolean) => sc((f) => <Stage>{dark(f)}<At x={960} y={480}><rect x={-420} y={-230} width={840} height={460} rx={60} fill="#F29BB8" stroke={INK} strokeWidth={14} />{[0, 1, 2].map((i) => <path key={i} d={`M${-300 + i * 220} -150 q60 80 0 160 q-60 80 20 120`} fill="none" stroke="#D96F95" strokeWidth={14} />)}<rect x={-360} y={270} width={720} height={64} rx={30} fill="#22252E" stroke={INK} strokeWidth={8} /><rect x={-350} y={280} width={700 * lerp(f, 0, 50, 0.05, big ? 1 : 0.6)} height={44} rx={22} fill="#3DE07A" /></At>{big && <At x={960} y={480} s={lerp(f, 0, 10, 1.6, 1)}><BigNum text="2.5 PB" size={220} color="#FFD21F" /></At>}</Stage>, PUSH),
  tvStack: (top: boolean) => sc((f) => {
    if (top) return <Stage bg="#9ED8F0">{Array.from({ length: 5 }, (_, i) => <At key={i} x={960 + (i % 2 ? 14 : -14)} y={660 + i * 150}><Screen k={i} w={300} /></At>)}{M(960, 560, 0.95, { expr: 'smug', pose: { ...STAND, shR: -100, elR: -60 }, look: [0, 0.5] })}<At x={1050} y={250} s={0.6}><rect x={-60} y={-70} width={120} height={140} fill="#E53935" stroke={INK} strokeWidth={8} /><circle cx={-20} cy={-80} r={24} fill="#FFF6C2" /><circle cx={20} cy={-86} r={22} fill="#FFF6C2" /></At></Stage>;
    const rise = lerp(f, 0, 40, 0, 1);
    return <Stage bg="#9ED8F0"><rect y={880} width={W} height={200} fill="#7FB685" />{Array.from({ length: 14 }, (_, i) => <At key={i} x={960 + (i % 2 ? 14 : -14)} y={860 - i * 150 * rise}><Screen k={i} w={300} /></At>)}</Stage>;
  }, top ? { a: { z: 1 }, b: { z: 1.08 } } : { a: { z: 1, y: 0 }, b: { z: 1, y: -260 } }),

  // ---- 3 good week
  flag: (k: 'fr' | 'es' | 'jp' | 'ar' | 'kl', beret = false) => sc((f) => { const p = lerp(f, 0, 6, 0, 1); return <Stage bg={{ fr: '#2F4FB0', es: '#E53935', jp: '#F3EEE4', ar: '#1F8A4C', kl: '#14151F' }[k]}><At x={1250} y={520 - (1 - p) * 700} r={(1 - p) * 30} s={1.3}><Flag k={k} /></At>{M(620, 1040, 1.35, { expr: 'happy', pose: k === 'kl' ? SHRUG : HERO })}{beret && <At x={620} y={1040 - 392 * 1.35 + 30} s={1.35}><ellipse cx={10} cy={0} rx={90} ry={30} fill="#7A1F2B" stroke={INK} strokeWidth={6} /></At>}{p >= 1 && f < 16 && <Burst x={1250} y={520} p={lerp(f, 6, 16, 0, 1)} />}</Stage>; }, { a: { z: 1.04 }, b: { z: 1 }, shake: 0.4 }),
  keys: sc((f) => <Stage bg="#3DBE7A"><Rays bg="#3DBE7A" ray="#4ACB86" t={f} />{M(760, 1030, 1.4, { expr: 'smug', pose: { ...STAND, shR: 70, elR: 30 }, prop: 'keys', look: [0.3, 0] })}{f > 14 && <Burst x={1060} y={560} p={lerp(f, 14, 28, 0, 1)} color="#fff" n={10} r={200} />}</Stage>, PUSH),
  micKeys: sc(() => <Stage bg="#2A2340"><At x={960} y={520}><MicStand poster="LOST KEYS?" /></At></Stage>, PUSH),
  argue: sc((f) => <Stage bg="#F2C14E"><Rays bg="#F2C14E" ray="#F6CD66" t={f} />{M(560, 1030, 1.3, { expr: 'smug', pose: POINT, look: [0.8, 0] })}{M(1380, 1030, 1.3, { outfit: DAVE, expr: 'wince', flip: true })}<At x={1000} y={300}><Receipt len={lerp(f, 6, 40, 40, 600)} /></At></Stage>, PUSH),
  receipt: sc((f) => <Stage bg="#1F2347"><At x={960} y={60} s={1.6} r={-4}><Receipt len={lerp(f, 0, 30, 300, 640)} /></At></Stage>, { a: { z: 1, y: 0 }, b: { z: 1.05, y: 120 } }),
  pub: sc((f) => { const slam = f < 6 ? lerp(f, 0, 6, 1, 0) : 0; return <Stage><Pub /><At x={960} y={430} s={1 + slam * 0.2}><rect x={-200} y={-110} width={400} height={170} rx={16} fill="#fff" stroke={INK} strokeWidth={10} /><Label x={0} y={-24} t="NO MAX" size={90} color="#E53935" /></At>{Head(960, 760, 1.1, { expr: 'sad', look: [0, -0.3] })}<rect x={740} y={580} width={440} height={400} fill="#BFE6F7" opacity={0.25} /></Stage>; }, { a: { z: 1.06 }, b: { z: 1 }, shake: 1 }),
  locks: sc((f) => <Stage bg="#22252E">{Array.from({ length: 40 }, (_, i) => { const x = 140 + (i % 10) * 182, y = 220 + Math.floor(i / 10) * 220; return <At key={i} x={x} y={y} s={0.9}><Padlock shut={lerp(f, i * 0.8, i * 0.8 + 6, 0, 1)} /></At>; })}<At x={960} y={540} o={lerp(f, 30, 38, 0, 1)}><BigNum text="300" size={260} color="#FFD21F" /></At></Stage>, PUSH),
  cakeDog: sc((f) => <Stage bg="#F07FA8"><Confetti t={f} seed={4} />{M(640, 1040, 1.4, { expr: 'happy', pose: { ...STAND, shR: 80, elR: 10, shL: -70, elL: -10 } })}<At x={1020} y={560}><Cake /></At><At x={1420} y={1000} s={1.5}><Dog hat expr="happy" wag={Math.sin(f / 3)} /></At></Stage>, PUSH),
  biscuit: sc((f) => <Stage bg="#E8C35B"><Rays bg="#E8C35B" ray="#F0CD6B" t={f} /><At x={1060} y={980} s={3.2}><Dog hat expr="offended" /></At><At x={900} y={250} r={-6}><rect x={-330} y={-70} width={660} height={140} rx={20} fill="#fff" stroke={INK} strokeWidth={10} /><Label x={0} y={0} t="SIR BISCUIT" size={84} color={INK} /></At></Stage>, { a: { z: 1.0 }, b: { z: 1.08 }, shake: 0.5 }),
  allergy: sc((f) => <Stage bg="#FFD21F"><At x={700} y={520} s={2}><path d="M-120 60 L120 60 L120 -10 L-120 -90 Z" fill="#FFB31F" stroke={INK} strokeWidth={10} strokeLinejoin="round" />{[[-60, 10], [20, 30], [70, -10]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill="#E8981A" />)}</At><At x={700} y={520}><line x1={-300} y1={-300} x2={300} y2={300} stroke="#E53935" strokeWidth={40} strokeLinecap="round" /></At><At x={1350} y={950} s={1.6}><Dog expr="offended" /></At></Stage>, PUSH),
  crowd: sc((f) => <Stage bg="#7A4FD6"><Rays bg="#7A4FD6" ray="#8D63E8" cy={300} t={f} /><Confetti t={f} />{Array.from({ length: 8 }, (_, i) => <At key={i} x={120 + i * 240} y={1180 + (i % 2) * 40} s={0.9}><Max outfit={[DAVE, WOMAN, MUM, TEACHER][i % 4]} expr="laugh" pose={{ ...PANIC, bob: Math.sin(f / 3 + i) * 10 }} /></At>)}{M(960, 900, 1.3, { pose: HERO, expr: 'laugh' })}</Stage>, { a: { z: 1, y: 40 }, b: { z: 1.1, y: 10 } }),
  bed: (eyes: boolean) => sc((f) => <Stage><Bedroom /><At x={460} y={650} r={-80} s={0.95}><g transform="translate(0 300)"><Max headOnly expr={eyes ? 'blank' : 'tired'} blink={eyes ? 0 : 1} look={[0, -1]} /></g></At><Vignette strength={0.55} /></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),
  eyelid: sc((f) => <Stage bg="#0B0C18">{Head(960, 600, 3.2, { expr: 'blank', blink: 1 })}<At x={890} y={520} s={0.35} o={(f % 12) < 6 ? 1 : 0.35}><Screen k={3} /></At></Stage>, { a: { z: 1 }, b: { z: 1.2 } }),

  // ---- 4 brain janitors
  janitors: (mode: 'sweep' | 'toss' | 'nobin' | 'pile') => sc((f) => {
    const cards = mode === 'pile' ? 46 : 10;
    return (
      <Stage>
        <BrainInside t={f} />
        {Array.from({ length: cards }, (_, i) => {
          const pile = mode === 'pile';
          const x = pile ? 160 + (i * 97) % 1600 : 300 + i * 140;
          const y = pile ? 900 - Math.floor(i / 16) * 110 - lerp(f, 0, 40, 0, Math.floor(i / 16) * 60) : 860 - (i % 3) * 30;
          let tx = x, ty = y, r = (i * 37) % 40 - 20;
          if (mode === 'toss' && i < 4) { const k = lerp(f, 8 + i * 6, 22 + i * 6, 0, 1); tx = x + (1540 - x) * k; ty = y - Math.sin(k * Math.PI) * 300 + (640 - y) * k; r += k * 360; if (k >= 1) return null; }
          return <At key={i} x={tx} y={ty} r={r}><Card k={i} /></At>;
        })}
        {mode !== 'nobin' && mode !== 'pile' && <At x={1560} y={840}><Bin /></At>}
        {[0, 1].map((i) => (
          <At key={i} x={700 + i * 420} y={mode === 'pile' ? 1180 : 900} s={0.85}>
            <Max outfit={JANITOR} expr={mode === 'nobin' ? 'blank' : mode === 'pile' ? 'panic' : 'happy'} pose={mode === 'nobin' ? SHRUG : { ...STAND, shR: 30 + Math.sin(f / 4 + i) * 20, elR: 40 }} look={mode === 'nobin' ? [i ? -0.8 : 0.8, 0] : [0, 0.4]} />
            {mode === 'sweep' && <At x={90} y={-60} r={Math.sin(f / 4 + i) * 20}><Broom /></At>}
          </At>
        ))}
      </Stage>
    );
  }, mode === 'pile' ? { a: { z: 1 }, b: { z: 1.08 }, tilt: -7 } : PUSH),
  binItem: (k: 'sandwich' | 'hat') => sc((f) => { const p = lerp(f, 4, 26, 0, 1); return <Stage><BrainInside t={f} /><At x={1300} y={820}><Bin /></At><At x={500 + 800 * p} y={500 - Math.sin(p * Math.PI) * 260 + 200 * p} r={p * 400} s={1.2 - p * 0.5} o={p < 0.98 ? 1 : 0}>{k === 'sandwich' ? <Sandwich k={1} /> : <g><ellipse cx={0} cy={20} rx={150} ry={30} fill="#3A3D48" stroke={INK} strokeWidth={8} /><rect x={-90} y={-90} width={180} height={110} rx={16} fill="#3A3D48" stroke={INK} strokeWidth={8} /><rect x={-90} y={-10} width={180} height={24} fill="#E53935" /></g>}</At>{p >= 1 && <At x={1300} y={700}><Label x={0} y={-160} t="BINNED" size={80} color="#FFD21F" /></At>}</Stage>; }, PUSH),
  ominous: sc((f) => <Stage bg="#0B0C18"><At x={960} y={540} s={lerp(f, 0, 40, 0.9, 1.05)}><BigNum text="THE WAVE" size={170} color="#fff" /></At></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.6 }),
  waveScene: (part: 'before' | 'reveal') => sc((f) => {
    const t = part === 'reveal' ? remap(f, [[0, 0.35]]) : f;
    return (
      <Stage>
        <Street tint="rgba(255,236,190,0.35)" crossing={false} />
        {M(1380, 1010, 1.2, { outfit: WOMAN, expr: 'happy', pose: WAVE(t), flip: true })}
        {M(560, 1010, 1.2, { expr: 'happy', pose: WAVE(t + 1), look: [0.8, 0] })}
        {part === 'reveal' && M(280, 980, 1.05, { outfit: DAVE, expr: 'happy', pose: WAVE(t + 2), look: [0.8, 0] })}
        {part === 'reveal' && <At x={560} y={420} o={lerp(f, 20, 30, 0, 1)}><Label x={0} y={-80} t="NOT YOU." size={70} color="#FF6B5E" /></At>}
        <rect width={W} height={H} fill="#F4E3C0" opacity={0.18} />
        <Label x={1700} y={90} t="2014" size={60} color="#FFE29A" />
      </Stage>
    );
  }, part === 'reveal' ? { a: { z: 1, x: -80 }, b: { z: 1.18, x: -240 } } : PUSH),
  youFade: sc((f) => <Stage bg="#2F6FD6">{M(700, 1030, 1.3, { outfit: DAVE, expr: 'happy' })}<At x={1240} y={360} o={lerp(f, 6, 40, 1, 0)}><Screen k={4} w={420} /></At><At x={1240} y={360} o={lerp(f, 30, 40, 0, 1)}><Label x={0} y={0} t="GONE" size={110} color="#FFD21F" /></At></Stage>, PUSH),
  ceiling: (cut: boolean) => sc((f) => <Stage><Bedroom glow={0.6} /><path d="M520 650 L760 120 L1500 120 L1200 650 Z" fill="#9ED8F7" opacity={0.12} /><At x={1130} y={260} s={1.5}><Screen k={2} w={420} /></At>{cut && <At x={1130} y={260}><circle cx={180} cy={-90} r={60 + (f % 20) * 4} fill="#FFF6C2" opacity={0.45} /><Label x={0} y={-230} t="DIRECTOR'S CUT" size={56} color="#FFD21F" /></At>}{!cut && <Label x={1130} y={30} t="NOW SHOWING" size={52} color="#FFD21F" />}<At x={460} y={650} r={-80} s={0.95}><g transform="translate(0 300)"><Max headOnly expr="hollow" look={[0.7, -0.9]} /></g></At></Stage>, PUSH),

  // ---- 5 science
  sepiaPhoto: sc((f) => <Stage bg="#2A2018"><Sepia><At x={960} y={520} r={-3} s={lerp(f, 0, 12, 1.3, 1)}><rect x={-330} y={-400} width={660} height={800} fill="#E8D8B8" stroke="#3A2A18" strokeWidth={20} /><rect x={-280} y={-350} width={560} height={600} fill="#BCA27C" /><At x={0} y={240} s={1.3}><Max outfit={TEACHER} expr="blank" /></At><Label x={0} y={330} t="?" size={120} /></At></Sepia></Stage>, PULL),
  newsroom: sc((f) => <Stage><Sepia><Office />{[0, 1, 2, 3].map((i) => <At key={i} x={300 + i * 440} y={1020} s={1}><Max outfit={i === 2 ? TEACHER : JANITOR} expr={i === 2 ? 'smug' : 'tired'} pose={i === 2 ? { ...STAND, shL: 40, elL: 100, shR: -40, elR: -100 } : { ...STAND, shR: 60 + Math.sin(f + i) * 10, elR: 60 }} /></At>)}{[0, 1, 2, 3].map((i) => <rect key={i} x={170 + i * 440} y={820} width={260} height={40} fill="#7A5A3E" stroke={INK} strokeWidth={6} />)}</Sepia></Stage>, PUSH),
  numList: (again: boolean) => sc((f) => {
    const nums = ['7 3 9 1 4', '8 2 6 0 5', '1 9 9 3 7', '4 4 2 8 6', '0 5 1 7 3'];
    return (
      <Stage bg="#E8D8B8">
        <At x={again ? 1300 : 960} y={540} r={-2}><rect x={-380} y={-380} width={760} height={760} fill="#FFFDF4" stroke={INK} strokeWidth={10} />{nums.map((n, i) => <text key={i} x={0} y={-250 + i * 125} textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={900} fontSize={84} fill={INK} opacity={lerp(f, i * 3, i * 3 + 4, 0, 1)}>{n}</text>)}</At>
        {again && <At x={480} y={540}><Calendar text={String(Math.round(lerp(f, 0, 30, 1925, 1940)))} sub="YEAR" /></At>}
        {again && <At x={1300} y={540}><Stamp t="✓ SAME" color="#2E9E5B" p={lerp(f, 32, 40, 0, 1)} /></At>}
      </Stage>
    );
  }, PUSH),
  glasses: sc((f) => <Stage bg="#D8C8A8"><Sepia>{Head(960, 700, 3.4, { outfit: TEACHER, expr: 'shocked' })}</Sepia></Stage>, { a: { z: 1 }, b: { z: 1.25, y: -60 } }),
  mumFlicker: sc((f) => { const ex = (['happy', 'sad', 'laugh', 'shocked', 'smug'] as const)[Math.floor(f / 8) % 5]; return <Stage bg="#E8A0BF"><Rays bg="#E8A0BF" ray="#EEB0CA" t={f} />{M(560, 1030, 1.3, { expr: 'blank', look: [0.8, 0], pose: { ...STAND, tilt: -6 } })}{M(1360, 1030, 1.3, { outfit: MUM, expr: ex, flip: true })}{(f % 8) < 2 && <rect width={W} height={H} fill="#fff" opacity={0.18} />}</Stage>; }, PUSH),
  faceGrid: sc((f) => <Stage bg="#22252E">{(['happy', 'sad', 'laugh', 'shocked', 'smug', 'tired'] as const).map((e, i) => <At key={e} x={480 + (i % 3) * 480} y={330 + Math.floor(i / 3) * 400} s={0.95}><g transform="translate(0 300)"><Max headOnly outfit={MUM} expr={e} /></g></At>)}<At x={960} y={540}><Stamp t="NO MATCH" p={lerp(f, 24, 32, 0, 1)} /></At></Stage>, PULL),
  mumTap: sc((f) => <Stage bg="#8E5BD6"><Rays bg="#8E5BD6" ray="#9A68E0" t={f} />{M(960, 1060, 1.5, { outfit: MUM, expr: 'smug', look: [0, 0], pose: { ...STAND, shL: -40, elL: 110, shR: 40, elR: -110, hipR: 4 + Math.max(0, Math.sin(f / 2)) * 10 } })}</Stage>, PUSH),
  forgetStamp: sc((f) => { const t = remap(f, [[0, 1], [6, 0.3]]); return <Stage bg="#FFF2D6"><rect x={460} y={140} width={1000} height={800} fill="#fff" stroke={INK} strokeWidth={10} />{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={540} y1={240 + i * 90} x2={1380} y2={240 + i * 90} stroke="#C7CDD8" strokeWidth={14} strokeLinecap="round" />)}<At x={960} y={540}><Stamp t="FORGETTING" p={lerp(t, 2, 8, 0, 1)} size={130} color="#2E9E5B" /></At>{t > 8 && <Burst x={960} y={540} p={lerp(t, 8, 18, 0, 1)} color="#C7B48A" r={800} n={20} />}<At x={960} y={80} o={lerp(f, 30, 40, 0, 1)}><Label x={0} y={0} t="= WORKING" size={70} color="#2E9E5B" /></At></Stage>; }, { a: { z: 1 }, b: { z: 1.06 }, shake: 0.5 }),
  dogsMerge: sc((f) => { const k = lerp(f, 10, 45, 0, 1); return <Stage bg="#3DBE7A">{Array.from({ length: 24 }, (_, i) => { const x = 160 + (i % 8) * 230, y = 300 + Math.floor(i / 8) * 280; return <At key={i} x={x + (960 - x) * k} y={y + (640 - y) * k} s={0.6 * (1 - k * 0.3)} o={1 - k * 0.8}><Dog expr="happy" /></At>; })}<At x={960} y={760} s={lerp(f, 40, 50, 0, 1.8)}><Dog expr="happy" /></At><At x={960} y={200} o={lerp(f, 45, 52, 0, 1)}><Label x={0} y={0} t="“DOG”" size={110} color="#FFD21F" /></At></Stage>; }, PULL),
  manyDogs: sc((f) => <Stage bg="#F2C14E">{Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return <At key={i} x={960 + Math.cos(a) * (560 + (i % 3) * 70)} y={640 + Math.sin(a) * 300 + 120} s={0.7}><g transform={Math.cos(a) > 0 ? 'scale(-1 1)' : ''}><Dog expr={i % 3 ? 'happy' : 'offended'} wag={Math.sin(f / 3 + i)} /></g></At>; })}{M(960, 900, 1.15, { expr: 'panic', look: [Math.sin(f / 5), 0] })}</Stage>, PUSH),
  loading: sc((f) => <Stage bg="#2F6FD6">{Head(760, 560, 2.2, { expr: 'blank' })}<At x={685} y={490}><LoadingWheel t={f} r={26} /></At><At x={835} y={490}><LoadingWheel t={f} r={26} /></At><At x={1450} y={900} s={1.6}><Dog expr="happy" wag={Math.sin(f / 3)} /></At><At x={760} y={140}><Label x={0} y={0} t="ERROR" size={90} color="#FF6B5E" /></At></Stage>, PUSH),
  coolBiscuit: sc((f) => <Stage><Street crossing={false} /><At x={1700 - f * 9} y={1000} s={1.8}><Dog expr="cool" wag={Math.sin(f / 3)} /></At>{M(560, 1030, 1.3, { expr: 'smug', look: [0.9, 0], pose: { ...STAND, tilt: f % 30 < 15 ? 0 : 8 } })}</Stage>, PUSH),
  redLight: sc((f) => <Stage><Street signal="red" />{M(1200, 1030, 1.3, { expr: 'blank', look: [0.6, -0.6] })}<At x={360} y={260}><circle r={110} fill="#fff" stroke={INK} strokeWidth={10} /><line x1={0} y1={0} x2={0} y2={-80} stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${f * 12})`} /></At></Stage>, { a: { z: 1 }, b: { z: 1.04 }, shake: 0.5 }),

  // ---- 6 meltdown
  orbitScreens: sc((f) => <Stage bg="#2A2340">{M(960, 1060, 1.35, { expr: 'hollow', pose: { ...STAND, tilt: 8 } })}{Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + f / 20; return <At key={i} x={960 + Math.cos(a) * 560} y={420 + Math.sin(a) * 200} s={0.75}><Screen k={i} /></At>; })}</Stage>, { a: { z: 1 }, b: { z: 1.08 }, tilt: 6 }),
  sandwiches: sc((f) => { const i = Math.floor(f / 9); return <Stage bg={['#E53935', '#2F6FD6', '#3DBE7A', '#F2C14E', '#7A4FD6', '#F07FA8'][i % 6]}><At x={960} y={500} s={lerp(f % 9, 0, 3, 2.6, 2)} r={(i % 3 - 1) * 8}><Sandwich k={i} /></At><At x={1580} y={180} r={8}><rect x={-160} y={-50} width={320} height={100} fill="#FFFDF4" stroke={INK} strokeWidth={6} /><text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={900} fontSize={40} fill={INK}>#{1000 + i * 137}</text></At></Stage>; }, { a: { z: 1 }, b: { z: 1.02 } }),
  joke: sc((f) => <Stage bg="#FFD21F"><Rays bg="#FFD21F" ray="#FFDB4D" t={f} />{M(660, 1040, 1.35, { expr: 'blank', prop: 'book', pose: { ...STAND, shL: 28, elL: 105, shR: -28, elR: -105 }, look: [0.7, -0.6] })}<At x={1260} y={360} r={Math.sin(f / 8) * 6}><rect x={-260} y={-90} width={520} height={180} rx={90} fill="#fff" stroke={INK} strokeWidth={8} /><Label x={0} y={0} t="HA HA?" size={80} color={INK} /></At></Stage>, PUSH),
  micSad: sc((f) => <Stage bg="#2A2340"><At x={960} y={520}><MicStand sad /></At><rect width={W} height={H} fill="#000" opacity={0.25} /></Stage>, { a: { z: 1.06 }, b: { z: 1 } }),
  menus: sc((f) => <Stage bg="#22252E">{Array.from({ length: 40 }, (_, i) => <At key={i} x={130 + (i % 10) * 185} y={140 + Math.floor(i / 10) * 200}><rect x={-70} y={-85} width={140} height={170} rx={10} fill={['#E8836B', '#F2C14E', '#7FB685', '#8E9BD6'][i % 4]} stroke={INK} strokeWidth={6} />{[0, 1, 2].map((j) => <line key={j} x1={-44} y1={-40 + j * 36} x2={44} y2={-40 + j * 36} stroke="#fff" strokeWidth={8} strokeLinecap="round" />)}</At>)}<rect x={460} y={930} width={1000} height={70} rx={35} fill="#141414" stroke="#fff" strokeWidth={6} /><rect x={470} y={940} width={980 * (f < 30 ? lerp(f, 0, 30, 0, 0.012) : 0.012)} height={50} rx={25} fill="#FF4A3D" /><Label x={960} y={880} t="DECIDING… 1%" size={52} /></Stage>, PULL),
  kerb: sc((f) => <Stage><Street signal="green" />{M(1000, 1030, 1.4, { expr: 'happy', pose: walkPose(f / 6) })}</Stage>, PUSH),
  chain: sc((f, d) => { const n = Math.min(6, 1 + Math.floor(f / Math.max(10, d / 7))); return <Stage><Street signal="green" />{Head(960, 600, 2.4, { expr: 'blank', look: [0, 0] })}{Array.from({ length: n }, (_, i) => <At key={i} x={960 + (i % 2 ? 1 : -1) * (80 + i * 40)} y={500 - i * 10} s={0.8 + i * 0.35} r={(i % 2 ? 1 : -1) * 6}><Screen k={i + 1} /></At>)}</Stage>; }, { a: { z: 1 }, b: { z: 1.3 }, tilt: 4 }),
  pov2009: sc((f) => <Stage bg="#FFE29A"><Confetti t={f} seed={7} /><At x={960} y={520}><Cake /></At>{[0, 1, 2].map((i) => <At key={i} x={420 + i * 540} y={1100} s={1.1}><Max outfit={[DAVE, WOMAN, MUM][i]} expr="laugh" /></At>)}<Label x={960} y={120} t="2009" size={90} color="#E53935" /><rect width={W} height={H} fill="#000" opacity={0.12 + 0.12 * Math.sin(f / 2)} /><At x={1500} y={400} o={0.35 + 0.35 * Math.sin(f / 3)} s={2}><Bus s={0.4} /></At></Stage>, PUSH),
  busPiece: sc((f, d) => { const t = remap(f, [[0, 1], [10, 0.12]]); return <Stage><Street signal="green" tint="rgba(20,20,40,0.25)" />{M(980, 1030, 1.5, { expr: 'panic', pose: { ...PANIC, lean: -6 }, look: [0.9, 0] })}{Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + t / 10; return <At key={i} x={980 + Math.cos(a) * 380} y={520 + Math.sin(a) * 170} s={0.55}><Screen k={i} /></At>; })}<At x={1700 - t * 4} y={860} s={1.6 + t * 0.01}><Bus /></At></Stage>; }, { a: { z: 1, x: 0 }, b: { z: 1.22, x: 120 }, shake: 0.4 }),
  stumble: sc((f) => { const back = lerp(f, 0, 8, 0, 1); return <Stage><Street signal="green" />{M(980 - back * 200, 1030 - back * 40, 1.4, { expr: 'shocked', pose: { ...PANIC, lean: -14 * back }, look: [0.9, 0] })}<At x={2600 - f * 120} y={860} s={1.6}><Bus /></At><rect width={W} height={H} fill="#fff" opacity={f < 4 ? 0.5 : 0} /></Stage>; }, { a: { z: 1.04 }, b: { z: 1 }, shake: 1.2 }),
  lenses: sc((f) => <Stage bg="#22252E">{[0, 1].map((i) => <At key={i} x={560 + i * 800} y={560}><circle r={300} fill={i ? '#2A2340' : '#9ED8F0'} stroke={INK} strokeWidth={20} /><clipPath id={'lens' + i}><circle r={290} /></clipPath><g clipPath={`url(#lens${i})`}><rect x={-300} y={60} width={600} height={240} fill="#4A4E5C" />{Array.from({ length: 5 }, (_, j) => <rect key={j} x={-260 + j * 120} y={120} width={60} height={160} fill="#F2F2F2" />)}{i === 1 && Array.from({ length: 9 }, (_, j) => <At key={j} x={-200 + (j % 3) * 200 + Math.sin(f / 10 + j) * 20} y={-180 + Math.floor(j / 3) * 170} s={0.55}><Screen k={j} /></At>)}</g><Label x={0} y={-370} t={i ? 'MAX' : 'YOU'} size={80} color={i ? '#FF6B5E' : '#fff'} /></At>)}</Stage>, PUSH),
  benchAlone: sc((f) => <Stage><Bench />{M(960, 860, 1.05, { expr: 'sad', pose: { ...STAND, hipL: -70, knL: 70, hipR: -60, knR: 60 } })}<rect width={W} height={H} fill="#1B2440" opacity={0.25} /></Stage>, { a: { z: 1.08 }, b: { z: 1 } }),
  river: (jagged: boolean) => sc((f) => { const x = lerp(f, 0, 70, 260, 1660); return <Stage bg="#7FB685"><path d={`M0 380 Q480 300 960 400 T1920 380 L1920 760 Q1440 840 960 740 T0 760 Z`} fill="#4FB3F0" stroke={INK} strokeWidth={10} />{[0, 1, 2, 3].map((i) => <path key={i} d={`M${(f * 8 + i * 500) % 2200 - 200} ${480 + i * 60} l120 0`} stroke="#BFE6F7" strokeWidth={10} strokeLinecap="round" />)}<At x={x} y={560} r={f * 6} s={1.1}><Rock smooth={jagged ? 0 : lerp(f, 0, 70, 0, 1)} /></At>{jagged && <path d={`M260 560 L${x} 560`} stroke="#fff" strokeWidth={8} strokeDasharray="20 18" />}<Label x={960} y={160} t={jagged ? 'MAX' : 'YOU'} size={90} color={jagged ? '#FF6B5E' : '#fff'} /></Stage>; }, { a: { z: 1 }, b: { z: 1.05 } }),
  infinity: sc((f) => <Stage bg="#14152A">{Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2 + f / 40; const x = 960 + (620 * Math.cos(a)) / (1 + Math.sin(a) ** 2); const y = 520 + (620 * Math.sin(a) * Math.cos(a)) / (1 + Math.sin(a) ** 2); return <At key={i} x={x} y={y} s={0.5}><Screen k={i} /></At>; })}</Stage>, PUSH),
  world: sc((f) => <Stage bg="#1F4E79"><At x={960} y={520} s={1.25}><WorldMap lights={lerp(f, 0, 30, 0, 40) | 0} t={f} /></At><Label x={960} y={80} t="~ A FEW DOZEN" size={70} color="#FFD21F" /></Stage>, PULL),
  projectorOn: sc((f) => <Stage><Bedroom glow={(f % 10) < 5 ? 0.9 : 0.2} /><At x={460} y={650} r={-80} s={0.95}><g transform="translate(0 300)"><Max headOnly expr="shocked" look={[0.7, -0.9]} /></g></At><At x={1130} y={260} s={1.4} o={(f % 10) < 5 ? 1 : 0.3}><Screen k={0} w={420} /></At></Stage>, { a: { z: 1 }, b: { z: 1.06 }, shake: 0.4 }),
  burst: sc((f) => { const t = remap(f, [[0, 1], [20, 0.4]]); const z = lerp(t, 0, 90, 1, 0.42); return <Stage bg="#0B0C18"><At x={960} y={560} s={z}><Bedroom glow={1} />{Head(960, 600, 1.6, { expr: 'panic' })}{Array.from({ length: 80 }, (_, i) => { const a = i * 2.39996, r = Math.min(1, t / 40) * (220 + (i % 20) * 70) * (1 + Math.floor(i / 20) * 0.9); return <At key={i} x={960 + Math.cos(a) * r} y={560 + Math.sin(a) * r * 0.75} s={0.6} r={Math.sin(i) * 10}><Screen k={i} /></At>; })}</At></Stage>; }, { a: { z: 1 }, b: { z: 1.0 }, shake: 0.3 }),
  oneScreen: sc((f) => <Stage bg="#0B0C18">{Array.from({ length: 30 }, (_, i) => <At key={i} x={(i * 271) % 1900} y={(i * 157) % 1080} s={0.5} o={0.25}><Screen k={i} /></At>)}<At x={960} y={520} s={lerp(f, 0, 50, 2.2, 2.8)}><g><rect x={-230} y={-160} width={460} height={320} rx={20} fill="#22252E" stroke={INK} strokeWidth={8} /><rect x={-210} y={-140} width={420} height={280} rx={10} fill="#F4E3C0" /><At x={-90} y={120} s={0.32}><Max expr="happy" pose={WAVE(f / 3)} /></At><At x={110} y={120} s={0.32}><g transform="scale(-1 1)"><Max outfit={WOMAN} expr="happy" pose={WAVE(f / 3)} /></g></At></g></At></Stage>, { a: { z: 1 }, b: { z: 1.04 } }),

  // ---- 7 fix
  rooftop: (mug: boolean) => sc((f) => <Stage><Rooftop t={f} />{M(960, 860, 1.25, { expr: 'hollow', pose: mug ? { ...STAND, shR: 30, elR: 100 } : STAND, look: [0.5, -0.2] })}{mug && <At x={1030} y={680}><rect x={-30} y={-40} width={60} height={70} rx={10} fill="#fff" stroke={INK} strokeWidth={6} /><path d={`M-10 -50 q8 -20 0 -40`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.6} /></At>}</Stage>, { a: { z: 1.1 }, b: { z: 1 } }),
  dialDown: (to: number, smile: boolean) => sc((f) => <Stage>{dark(f)}<At x={960} y={720}><Gauge v={lerp(f, 4, 40, to === 2 ? 0.3 : 1, to === 2 ? 0.02 : 0.3)} label0="1×" label1="100×" /></At>{smile ? Head(1640, 320, 0.8, { expr: lerp(f, 30, 31, 0, 1) > 0 ? 'happy' : 'blank' }) : Head(1640, 320, 0.8, { expr: 'tired' })}<At x={960} y={260} o={to === 2 ? lerp(f, 36, 44, 0, 1) : 0}><BigNum text="2×" size={160} color="#3DE07A" /></At></Stage>, PUSH),
  sieve: (sand: boolean) => sc((f) => <Stage bg="#2F6FD6"><Rays bg="#2F6FD6" ray="#3A7BE0" t={f} /><At x={960} y={420}><Sieve /></At>{[['#E53935', 'MUM'], ['#FFD21F', 'BEST DAY'], ['#3DBE7A', 'FIRST BIKE']].map(([c, l], i) => <At key={l} x={760 + i * 200} y={lerp(f, i * 4, i * 4 + 12, -200, 380)}><Gem c={c} label={l} /></At>)}{sand && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={700 + (i * 37) % 520} cy={600 + ((f * 9 + i * 53) % 480)} r={8} fill="#E8C35B" />)}{sand && <At x={960} y={540 + lerp(f, 6, 50, 0, 520)} s={0.6} r={f * 3}><Card k={2} /><Label x={0} y={-80} t="2014" size={40} /></At>}</Stage>, PUSH),
  heart: sc((f) => <Stage bg="#F7B6C8"><At x={960} y={520} s={1.6}><Heart stitch={lerp(f, 4, 36, 1, 0)} /></At></Stage>, PUSH),
  rulebook: sc((f) => { const k = lerp(f, 10, 26, 0, 1); return <Stage bg="#FFF2D6"><At x={960} y={540 - k * 700} o={1 - k}><rect x={-160} y={-460} width={320} height={920} fill="#fff" stroke={INK} strokeWidth={8} />{Array.from({ length: 18 }, (_, i) => <line key={i} x1={-120} y1={-420 + i * 48} x2={120} y2={-420 + i * 48} stroke="#C7CDD8" strokeWidth={10} strokeLinecap="round" />)}</At><At x={960} y={540 + (1 - k) * 700}><rect x={-240} y={-170} width={480} height={340} rx={20} fill="#2F6FD6" stroke={INK} strokeWidth={10} /><Label x={0} y={0} t="RULES" size={100} /></At></Stage>; }, PUSH),
  frownFlip: sc((f) => <Stage bg="#3DBE7A"><Rays bg="#3DBE7A" ray="#4ACB86" t={f} />{Head(960, 600, 2.4, { expr: f < 18 ? 'sad' : 'laugh' })}{f >= 18 && <Burst x={960} y={520} p={lerp(f, 18, 30, 0, 1)} color="#fff" r={600} />}</Stage>, PUSH),
  trophy: sc((f) => { const t = remap(f, [[0, 0.5]]); return <Stage><Rooftop t={60 + t} />{M(960, 860, 1.35, { expr: 'happy', pose: { ...HERO, shR: 170, elR: 0 } })}<At x={1110} y={250 - t * 0.6} s={0.55} r={-10}><Sieve /></At><circle cx={1110} cy={260} r={200 + Math.sin(t / 4) * 20} fill="#FFE29A" opacity={0.3} /></Stage>; }, { a: { z: 1, y: 30 }, b: { z: 1.12, y: -10 } }),

  // ---- 8 ending
  cakeBiscuit: sc((f) => <Stage bg="#F07FA8"><Confetti t={f} seed={9} />{M(700, 1040, 1.3, { expr: 'laugh', pose: { ...STAND, shR: 70, elR: 10 } })}<At x={1000} y={600} s={0.8}><Cake /></At><At x={1380} y={1000} s={1.4}><Dog hat expr="happy" wag={Math.sin(f / 2)} /></At></Stage>, PUSH),
  walkRelaxed: sc((f) => <Stage><Street crossing={false} />{M(400 + f * 5, 1030, 1.3, { expr: 'happy', pose: walkPose(f / 5) })}</Stage>, { a: { z: 1, x: -100 }, b: { z: 1.04, x: 60 } }),
  waveAgain: sc((f) => { const t = remap(f, [[0, 1], [16, 0.3]]); return <Stage><Street crossing={false} />{M(1400, 1010, 1.2, { outfit: WOMAN, expr: 'happy', pose: WAVE(t), flip: true })}{M(760, 1010, 1.2, { expr: 'happy', pose: WAVE(t + 1), look: [0.8, 0] })}{M(380, 980, 1.05, { outfit: DAVE, expr: 'happy', pose: WAVE(t + 2), look: [0.8, 0] })}</Stage>; }, { a: { z: 1, x: 0 }, b: { z: 1.2, x: 160 } }),
  freezeOhNo: sc((f) => <Stage><Street crossing={false} tint="rgba(30,30,60,0.35)" />{Head(960, 640, 2.6, { expr: 'shocked', look: [-0.7, 0] })}<rect width={W} height={H} fill="#fff" opacity={lerp(f, 0, 5, 0.7, 0)} /></Stage>, { a: { z: 1 }, b: { z: 1.1 }, shake: 0.8 }),
  // ---- 9 outro
  micNote: sc((f) => { const fall = lerp(f, 60, 80, 0, 1); return <Stage bg="#2A2340"><At x={960} y={520}><MicStand /></At><At x={1000} y={400 + fall * 700} r={8 + fall * 60}><rect x={-140} y={-70} width={280} height={140} fill="#FFE45C" stroke={INK} strokeWidth={6} /><Label x={0} y={0} t="SUBSCRIBE" size={44} color={INK} /></At></Stage>; }, PUSH),
  endScreen: sc((f) => <Stage bg="#1F2347"><Rays bg="#1F2347" ray="#262B57" t={f} />{M(960, 1040, 1.3, { expr: 'smug', prop: 'keys', pose: { ...STAND, shR: 110, elR: 40 }, look: [0.4, 0] })}{[0, 1].map((i) => <rect key={i} x={i ? 1280 : 140} y={260} width={500} height={282} rx={20} fill="#2E3466" stroke="#FFD21F" strokeWidth={6} />)}</Stage>, { a: { z: 1 }, b: { z: 1.03 } }),
};

// ================= cue sheet =================
type El = (d: number) => React.ReactNode;
type Cue = [number, El, [number, string, number][]?];
const c = (sec: number, phrase: string, el: El, sfx?: [number, string, number][], nth = 1): Cue => [at(sec, phrase, nth), el, sfx];

const CUES: Cue[] = [
  // 1 cold open
  [secStart(1), OPEN.bookSlam, [[8, 'slap', 0.5]]],
  c(1, 'Max just', OPEN.hero),
  c(1, 'Once', OPEN.freezeFace, [[0, 'lowhit', 0.5]]),
  c(1, 'In the bathroom', OPEN.roll, [[0, 'spin', 0.35]]),
  c(1, 'And now he knows', OPEN.pagesIn, [[0, 'whoosh', 0.4]]),
  c(1, 'Every diagram', OPEN.diagram),
  c(1, 'The coffee stain', OPEN.stain, [[30, 'pop', 0.4]]),
  c(1, 'Exam', OPEN.examSlam, [[0, 'whoosh', 0.45], [18, 'slap', 0.5]]),
  c(1, 'One hundred percent', OPEN.counter, [[0, 'counter', 0.35], [26, 'pop', 0.5]]),
  c(1, 'The teacher', OPEN.teacher, [[34, 'boing', 0.3]]),
  c(1, 'Because this morning', OPEN.power),
  c(1, 'memory got', OPEN.dial, [[0, 'tick', 0.35], [40, 'lowhit', 0.55]]),
  c(1, 'Which sounds amazing', OPEN.highFive, [[7, 'slap', 0.45]]),
  c(1, 'And for about', OPEN.podium, [[0, 'pop', 0.35]]),
  c(1, 'a week', OPEN.wink),
  c(1, 'it is', (d) => OPEN.heroConfetti(d)),
  c(1, 'Then it ruins', (d) => OPEN.heroConfetti(d, true), [[0, 'scratch', 0.5]]),
  c(1, 'Slowly', OPEN.blocks, [[6, 'boing', 0.4], [18, 'boing', 0.4], [30, 'boing', 0.4]]),
  c(1, 'By day thirty', X.day30),
  c(1, 'And one memory', X.busFlash, [[0, 'bus', 0.5]]),
  [end(1, 'killed') + 4, X.title, [[0, 'lowhit', 0.6]]],
  // 2 how good
  c(2, 'So how good', X.tape, [[0, 'whoosh', 0.35]]),
  c(2, "Here's you", X.glassFull, [[0, 'pop', 0.35]]),
  c(2, 'and by tomorrow', X.glassDrain),
  c(2, "That's not you", X.normal, [[10, 'pop', 0.4]]),
  c(2, "It's called", X.curve(false), [[0, 'whoosh', 0.3]]),
  c(2, 'Max isn\'t', X.curve(true)),
  c(2, 'The world\'s top', X.cards, [[0, 'whoosh', 0.35]]),
  c(2, 'Max does it', X.yawn),
  c(2, 'And your brain', X.drive(false)),
  c(2, 'By one estimate', X.drive(true), [[0, 'pop', 0.4]]),
  c(2, "That's roughly", X.tvStack(false), [[0, 'whoosh', 0.35]]),
  c(2, 'Max intends', X.tvStack(true)),
  // 3 good week
  c(3, 'Day one', X.flag('fr', true), [[0, 'slap', 0.4]]),
  c(3, 'Day two', X.flag('es'), [[0, 'slap', 0.4]]),
  c(3, 'Day three', X.flag('jp'), [[0, 'slap', 0.4]]),
  c(3, 'Arabic', X.flag('ar'), [[0, 'slap', 0.35]]),
  c(3, 'for some reason', X.flag('kl'), [[0, 'slap', 0.35]]),
  c(3, 'He never loses', X.keys, [[14, 'pop', 0.4]]),
  c(3, 'Unlike some', X.micKeys),
  c(3, 'He wins every', X.argue),
  c(3, 'Word for word', X.receipt, [[0, 'typing', 0.3]]),
  c(3, 'Quiz night', X.pub, [[0, 'slap', 0.5]]),
  c(3, 'Passwords', X.locks, [[0, 'counter', 0.3]]),
  c(3, 'Birthdays', X.cakeDog, [[0, 'pop', 0.35]]),
  c(3, 'Sir Biscuit', X.biscuit, [[0, 'lowhit', 0.45]]),
  c(3, 'Allergic', X.allergy, [[0, 'dog', 0.35]]),
  c(3, 'For one week', X.crowd),
  c(3, 'And then', X.bed(false), [[0, 'scratch', 0.35]]),
  c(3, 'And the real problem', X.eyelid),
  // 4 janitors
  c(4, "Here's something", X.janitors('sweep')),
  c(4, 'It sorts the day', X.janitors('toss'), [[10, 'whoosh', 0.3]]),
  c(4, 'What you had', X.binItem('sandwich'), [[24, 'cans', 0.35]]),
  c(4, 'What that stranger', X.binItem('hat'), [[24, 'cans', 0.35]]),
  c(4, "Max's brain doesn't", X.janitors('nobin')),
  c(4, 'So everything stays', X.janitors('pile')),
  c(4, 'Including', X.ominous, [[0, 'lowhit', 0.55]]),
  c(4, 'March 2014', X.waveScene('before')),
  c(4, 'She was waving', X.waveScene('reveal'), [[0, 'scratch', 0.35]]),
  c(4, "You've forgotten", X.youFade),
  c(4, 'He relives', X.ceiling(false)),
  c(4, 'It now has', X.ceiling(true), [[0, 'pop', 0.35]]),
  // 5 science
  c(5, 'And this isn\'t', X.sepiaPhoto),
  c(5, 'Russia', X.newsroom, [[0, 'typing', 0.3]]),
  c(5, 'So scientists', X.numList(false)),
  c(5, 'Then he remembered', X.numList(true), [[32, 'pop', 0.4]]),
  c(5, 'Sounds like', X.glasses),
  c(5, 'Solomon struggled', X.mumFlicker),
  c(5, 'Because a face', X.faceGrid, [[24, 'slap', 0.4]]),
  c(5, "Max's mum", X.mumTap),
  c(5, "And that's the big", X.forgetStamp, [[2, 'lowhit', 0.5]]),
  c(5, 'When you forget', X.dogsMerge, [[45, 'pop', 0.35]]),
  c(5, 'Max remembers every', X.manyDogs, [[0, 'dog', 0.3]]),
  c(5, 'So when he sees', X.loading),
  c(5, 'Except Sir Biscuit', X.coolBiscuit),
  c(5, 'Funny, right', X.redLight, [[0, 'tick', 0.35]]),
  // 6 meltdown
  c(6, 'Week three', X.orbitScreens),
  c(6, 'Someone says', X.sandwiches, [[0, 'pop', 0.3], [9, 'pop', 0.3], [18, 'pop', 0.3], [27, 'pop', 0.3]]),
  c(6, "He can't read", X.joke),
  c(6, 'Comedy is dead', X.micSad),
  c(6, "He can't make", X.menus),
  c(6, 'Then comes that', X.kerb),
  c(6, 'Which reminds him of a birthday', X.chain, [[0, 'whoosh', 0.3]]),
  c(6, "He's not looking", X.pov2009),
  c(6, 'Max', X.busPiece, [[0, 'bus', 0.6], [4, 'lowhit', 0.5]], 2),
  c(6, 'Real life', X.stumble, [[0, 'whoosh', 0.55]]),
  c(6, 'Your brain filters', X.lenses),
  c(6, 'And the worst', X.benchAlone),
  c(6, 'For you', X.river(false)),
  c(6, 'For Max', X.river(true)),
  c(6, 'One woman', X.infinity),
  c(6, 'Scientists have', X.world),
  c(6, 'And then comes', X.projectorOn, [[0, 'tick', 0.3]]),
  c(6, 'Every memory', X.burst, [[0, 'whoosh', 0.45], [8, 'lowhit', 0.5]]),
  c(6, 'Including the Wave', X.oneScreen),
  // 7 fix (breathing hold at dawn first)
  [secEnd(6) + 15, X.rooftop(false)],
  c(7, 'So what does', X.rooftop(true)),
  c(7, 'Not a better', X.dialDown(30, false), [[0, 'tick', 0.35]]),
  c(7, "Because here's", X.sieve(false)),
  c(7, 'and lets', X.sieve(true)),
  c(7, "That's how you get", X.heart),
  c(7, "That's how you learn", X.rulebook, [[10, 'whoosh', 0.3]]),
  c(7, "That's how a bad", X.frownFlip, [[18, 'pop', 0.35]]),
  c(7, "Forgetting isn't", X.trophy),
  // 8 ending
  c(8, 'As for Max', X.dialDown(2, true), [[40, 'pop', 0.4]]),
  c(8, 'He still remembers', X.cakeBiscuit, [[0, 'dog', 0.3]]),
  c(8, 'He still never', X.keys, [[14, 'pop', 0.35]]),
  c(8, 'And he has', X.walkRelaxed),
  c(8, 'Oh no', X.waveAgain, [[0, 'scratch', 0.35]]),
  c(8, 'Some things', X.freezeOhNo, [[0, 'lowhit', 0.5]]),
  // 9 outro
  c(9, "What's the one", X.micNote),
  c(9, 'Wait', X.endScreen),
];

// sentence ends on the episode timeline (frames): the only moments the camera is allowed to re-frame
const BREAKS = CAPTION_WORDS.filter((w) => /[.?!…]$/.test(w[0])).map((w) => w[2]);
/** smooth re-frame: on long shots, glide between two framings at each sentence break (never a snap) */
const Reframe: React.FC<{ t: number; d: number; children: React.ReactNode }> = ({ t, d, children }) => {
  const f = F();
  const pts = d > 90 ? BREAKS.filter((b) => b > t + 36 && b < t + d - 30) : [];
  let z = 1, ox = 0, level = 0;
  for (const b of pts) {
    const k = lerp(t + f, b, b + 12, 0, 1);
    const from = level % 2 ? 1.1 : 1, to = level % 2 ? 1 : 1.1;
    if (t + f >= b) { z = from + (to - from) * k; ox = (level % 4 === 0 ? 1 : -1) * 40 * (to > from ? k : 1 - k); }
    level++;
  }
  return <AbsoluteFill style={{ transform: `translate(${ox}px, 0) scale(${z})` }}>{children}</AbsoluteFill>;
};

const SOFT = (n: string) => staticFile(`mem/sfx/${n}.mp3`);
const VO_FILES = Array.from({ length: 9 }, (_, i) => `mem/vo0${i + 1}.mp3`);

export const MemEpisode: React.FC = () => {
  const cues = [...CUES].sort((a, b) => a[0] - b[0]);
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
      <Sequence from={0} durationInFrames={secStart(4)}>
        <Audio src={staticFile('ep/music-fun.mp3')} loop volume={(f) => interpolate(f, [0, 15, secStart(4) - 30, secStart(4)], [0, 0.1, 0.1, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
      <Sequence from={secStart(4)} durationInFrames={secEnd(6) - secStart(4)}>
        <Audio src={staticFile('ep/music-tense.mp3')} loop volume={(f) => {
          const bus = at(6, 'Max', 2) - secStart(4);
          return interpolate(f, [0, 30, bus - 6, bus, bus + 60, bus + 90], [0, 0.09, 0.09, 0, 0, 0.09], { extrapolateRight: 'clamp' });
        }} />
      </Sequence>
      <Sequence from={secEnd(6)} durationInFrames={TOTAL_FRAMES - secEnd(6)}>
        <Audio src={staticFile('ep/music-end.mp3')} loop volume={(f) => interpolate(f, [0, 40, TOTAL_FRAMES - secEnd(6) - 60, TOTAL_FRAMES - secEnd(6)], [0, 0.11, 0.11, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
    </AbsoluteFill>
  );
};
export { TOTAL_FRAMES as MEM_FRAMES };
