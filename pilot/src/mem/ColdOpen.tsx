// Test shot: the memory episode's cold open (0:00–0:26), silent animatic with scratch captions.
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Max, Dog, HOLD, HERO, STAND, TEACHER, DAVE, INK } from '../max/Max';
import {
  Cam, Stage, Shots, Shot, Sfx, Captions, scratchWords, Bathroom, ToiletRoll, ExamHall,
  Burst, Page, Gauge, BigNum, Confetti, Vignette, lerp, remap, FONT, W, H,
} from './kit';

const LINES: [number, number, string][] = [
  [4, 104, 'This is Max. Max just read his entire chemistry textbook.'],
  [110, 152, 'Once. In the bathroom.'],
  [158, 306, 'And now he knows every word. Every diagram. The coffee stain on page two hundred and twelve.'],
  [318, 398, 'Exam? Four minutes. One hundred percent.'],
  [408, 458, 'The teacher had to sit down.'],
  [470, 566, "Because this morning, Max's memory got one hundred times better."],
  [578, 662, 'Which sounds amazing. And for about a week… it is.'],
  [676, 760, 'Then it ruins his life. Slowly. In alphabetical order.'],
];

const At: React.FC<{ x: number; y: number; s?: number; r?: number; children: React.ReactNode }> = ({ x, y, s = 1, r = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>{children}</g>
);
const F = () => useCurrentFrame();

const Book: React.FC<{ open: number }> = ({ open }) => (
  <g>
    <rect x={-300} y={-200} width={600} height={400} rx={18} fill="#B8322A" stroke={INK} strokeWidth={14} />
    <g transform={`scale(${1 - open * 0.9} 1)`} style={{ transformOrigin: '-300px 0px' }}>
      <rect x={-300} y={-200} width={600} height={400} rx={18} fill="#D9473B" stroke={INK} strokeWidth={14} />
      <text x={0} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke">CHEMISTRY</text>
      <circle cx={-60} cy={90} r={34} fill="#FFD21F" stroke={INK} strokeWidth={8} /><circle cx={50} cy={60} r={24} fill="#fff" stroke={INK} strokeWidth={8} />
      <line x1={-60} y1={90} x2={50} y2={60} stroke={INK} strokeWidth={8} />
    </g>
  </g>
);

export const S = {
  bookSlam: (d: number) => {
    const C = () => { const f = F(); const open = lerp(f, 0, 9, 1, 0); const sq = f >= 9 && f < 14 ? 1.06 : 1;
      return <Stage bg="#BFE3EF"><Bathroom /><rect width={W} height={H} fill="rgba(255,255,255,0.35)" /><At x={960} y={560} s={1.25 * sq}><Book open={open} /></At>{f >= 9 && <Burst x={960} y={560} p={lerp(f, 9, 22, 0, 1)} color="#fff" r={520} />}</Stage>; };
    return <Cam a={{ z: 1.05 }} b={{ z: 1.0 }} dur={d} shake={0}><C /></Cam>;
  },
  hero: (d: number) => {
    const C = () => { const f = F(); return <Stage><Bathroom /><At x={980} y={1005} s={1.5}><Max pose={{ ...HOLD, tilt: -3 }} expr="smug" prop="book" look={[0.3, 0.1]} blink={f > 40 && f < 44 ? 1 : 0} /></At></Stage>; };
    return <Cam a={{ z: 1.0, y: -40 }} b={{ z: 1.14, y: -70 }} dur={d}><C /><Vignette /></Cam>;
  },
  freezeFace: (d: number) => {
    const C = () => { const f = F(); return (<>
      <Stage bg="#BFE3EF"><Bathroom /><rect width={W} height={H} fill="rgba(20,20,40,0.35)" /><At x={960} y={1340} s={2.6}><Max headOnly expr="smug" look={[0.6, 0]} /></At></Stage>
      <AbsoluteFill style={{ background: '#fff', opacity: lerp(f, 0, 5, 0.8, 0) }} />
    </>); };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.08 }} dur={d} shake={0.6}><C /></Cam>;
  },
  roll: (d: number) => {
    const C = () => { const f = F(); return <Stage bg="#BFE3EF"><Bathroom /><rect width={W} height={H} fill="rgba(191,227,239,0.7)" /><At x={960} y={430} s={2.3}><ToiletRoll spin={f * 38} /></At></Stage>; };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.06 }} dur={d}><C /></Cam>;
  },
  pagesIn: (d: number) => {
    const C = () => {
      const f = F(); const t = remap(f, [[0, 1.8], [14, 0.4]]);
      const eye = { x: 700, y: 522 };
      return (
        <Stage bg="#1F2347">
          {Array.from({ length: 9 }, (_, i) => <line key={i} x1={1920} y1={120 + i * 100} x2={eye.x + 300} y2={eye.y} stroke="#2E3466" strokeWidth={22} />)}
          <At x={700} y={1240} s={2.3}><Max headOnly expr="shocked" look={[0.85, -0.05]} /></At>
          {Array.from({ length: 9 }, (_, i) => {
            const k = Math.min(1, Math.max(0, (t - i * 4) / 22));
            if (k <= 0 || k >= 1) return null;
            const sx = 2100, sy = 140 + ((i * 263) % 800);
            const x = sx + (eye.x + (i % 2 ? 78 : -78) - sx) * k, y = sy + (eye.y - sy) * k - Math.sin(k * Math.PI) * 120;
            return <At key={i} x={x} y={y} s={1.5 * (1 - k * 0.85)} r={(1 - k) * (i % 2 ? 40 : -50)}><Page kind={i === 4 ? 'diagram' : 'text'} /></At>;
          })}
        </Stage>
      );
    };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.1, x: -40 }} dur={d}><C /></Cam>;
  },
  diagram: (d: number) => {
    const C = () => { const f = F(); const t = remap(f, [[0, 0.35]]);
      return <Stage bg="#1F2347"><circle cx={960} cy={540} r={420} fill="#2A2F5E" /><At x={960 + t * 6} y={560 - t * 3} s={3.2 + t * 0.06} r={-18 + t * 1.4}><Page kind="diagram" /></At></Stage>; };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.05 }} dur={d}><C /></Cam>;
  },
  stain: (d: number) => {
    const C = () => { const f = F(); const y = lerp(f, 0, 30, -260, 0); const r = lerp(f, 0, 34, 24, -4);
      return <Stage bg="#1F2347"><circle cx={960} cy={540} r={420} fill="#2A2F5E" /><At x={960} y={560 + y} s={3.4} r={r}><Page kind="stain" /></At>{f > 30 && <Burst x={1010} y={600} p={lerp(f, 30, 44, 0, 1)} color="#C88A4E" r={420} />}</Stage>; };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.12 }} dur={d}><C /></Cam>;
  },
  examSlam: (d: number) => {
    const C = () => { const f = F(); const up = f < 16 ? lerp(f, 4, 16, 0, -80) : lerp(f, 16, 19, -80, 0);
      return (
        <Stage>
          <ExamHall />
          <At x={960} y={1260} s={1.9}><Max pose={{ ...STAND, shR: 100 - (up / -80) * 50, elR: -20 }} expr={f > 18 ? 'smug' : 'determined'} look={[0, 0.3]} /></At>
          <rect x={560} y={880} width={800} height={70} rx={12} fill="#8E6845" stroke={INK} strokeWidth={10} />
          <rect x={760} y={840} width={300} height={44} fill="#fff" stroke={INK} strokeWidth={6} />
          <g transform={`translate(1140 ${830 + up})`}><rect x={-10} y={-70} width={20} height={80} rx={6} fill="#2F6FD6" stroke={INK} strokeWidth={6} /></g>
          {f > 18 && <Burst x={1140} y={850} p={lerp(f, 18, 30, 0, 1)} color="#FFD21F" r={300} />}
        </Stage>
      ); };
    return <Cam a={{ z: 1.0, y: 40 }} b={{ z: 1.08, y: 60 }} dur={d} whip={1} shake={0}><C /></Cam>;
  },
  counter: (d: number) => {
    const C = () => { const f = F(); const n = Math.round(lerp(f, 0, 26, 0, 100)); const pop = f >= 26 ? lerp(f, 26, 32, 1.25, 1) : 1;
      return <Stage bg="#1F2347"><circle cx={960} cy={540} r={380} fill="#2A2F5E" />{f >= 26 && <Burst x={960} y={540} p={lerp(f, 26, 42, 0, 1)} r={620} />}<At x={960} y={520} s={pop}><BigNum text={`${n}%`} size={330} color={n === 100 ? '#FFD21F' : '#fff'} /></At></Stage>; };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.06 }} dur={d}><C /></Cam>;
  },
  teacher: (d: number) => {
    const C = () => { const f = F(); const slide = lerp(f, 34, d, 0, 760);
      return <Stage><ExamHall /><rect width={W} height={H} fill="rgba(234,216,181,0.35)" /><At x={980} y={1120 + slide} s={1.8} r={slide * 0.012}><Max outfit={TEACHER} expr={f < 34 ? 'shocked' : 'blank'} pose={{ ...STAND, shL: -24, shR: 24 }} /></At></Stage>; };
    return <Cam a={{ z: 1.05 }} b={{ z: 1.0 }} dur={d}><C /></Cam>;
  },
  power: (d: number) => {
    const C = () => { const f = F(); const g = 0.5 + Math.sin(f / 4) * 0.5;
      return (
        <Stage bg="#14173A">
          {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2 + f / 30; return <line key={i} x1={960} y1={470} x2={960 + Math.cos(a) * 1400} y2={470 + Math.sin(a) * 1400} stroke="#232A66" strokeWidth={70} />; })}
          <circle cx={960} cy={470} r={300 + g * 30} fill="#FFD21F" opacity={0.18 + g * 0.12} />
          <At x={960} y={1170} s={2.3}><Max headOnly expr="determined" look={[0, -0.6]} /></At>
        </Stage>
      ); };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.1 }} dur={d}><C /></Cam>;
  },
  dial: (d: number) => {
    const C = () => { const f = F(); const v = f < 40 ? lerp(f, 4, 40, 0, 1.04) : lerp(f, 40, 46, 1.04, 1);
      return (
        <Stage bg="#1F2347">
          <At x={960} y={760}><Gauge v={v} label0="1×" label1="100×" /></At>
          {f > 40 && <Burst x={1380} y={760} p={lerp(f, 40, 56, 0, 1)} color="#E53935" r={360} />}
          <At x={960} y={250}><BigNum text="MEMORY" size={110} /></At>
        </Stage>
      ); };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.06 }} dur={d} shake={0}><C /></Cam>;
  },
  highFive: (d: number) => {
    const C = () => { const f = F(); const k = lerp(f, 0, 7, 0, 1);
      return (
        <Stage bg="#2F6FD6">
          {f > 7 && <Burst x={960} y={420} p={lerp(f, 7, 20, 0, 1)} r={400} />}
          <At x={600 + k * 215} y={1130} s={1.6}><Max pose={{ ...STAND, shR: 132, elR: 22 }} expr="laugh" /></At>
          <At x={1320 - k * 215} y={1130} s={1.6}><g transform="scale(-1 1)"><Max outfit={DAVE} pose={{ ...STAND, shR: 132, elR: 22 }} expr="happy" /></g></At>
        </Stage>
      ); };
    return <Cam a={{ z: 1.05 }} b={{ z: 1.0 }} dur={d} whip={-1}><C /></Cam>;
  },
  podium: (d: number) => {
    const C = () => { const f = F(); return (
      <Stage bg="#E53935">
        <Confetti t={f + 40} seed={2} />
        <rect x={760} y={760} width={400} height={320} fill="#FFD21F" stroke={INK} strokeWidth={12} />
        <At x={960} y={960}><BigNum text="1" size={220} /></At>
        <At x={960} y={770} s={1.15}><Max pose={HERO} expr="smug" /></At>
        <circle cx={960} cy={560} r={40} fill="#FFD21F" stroke={INK} strokeWidth={8} />
      </Stage>
    ); };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.07 }} dur={d}><C /></Cam>;
  },
  wink: (d: number) => {
    const C = () => { const f = F(); return <Stage bg="#3DBE7A"><Burst x={1300} y={300} p={(f % 20) / 20} color="#fff" r={200} n={8} /><At x={960} y={1380} s={2.8} r={-6}><Max headOnly expr="laugh" /></At></Stage>; };
    return <Cam a={{ z: 1.1 }} b={{ z: 1.0 }} dur={d}><C /></Cam>;
  },
  heroConfetti: (d: number, freeze = false) => {
    const C = () => {
      const f = F(); const ff = freeze ? 18 : f;
      const gray = freeze ? lerp(f, 0, 30, 0, 1) : 0;
      return (
        <AbsoluteFill style={{ filter: `grayscale(${gray}) brightness(${1 - gray * 0.25})` }}>
          <Stage bg="#7A4FD6">
            {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={960} y1={600} x2={960 + Math.cos(a) * 1500} y2={600 + Math.sin(a) * 1500} stroke="#8D63E8" strokeWidth={110} />; })}
            <Confetti t={ff + 10} />
            <At x={960} y={1180} s={1.9}><Max pose={HERO} expr="laugh" /></At>
          </Stage>
        </AbsoluteFill>
      );
    };
    return <Cam a={{ z: freeze ? 1.08 : 1.0, y: -20 }} b={{ z: freeze ? 1.16 : 1.08, y: -40 }} dur={d}><C /></Cam>;
  },
  blocks: (d: number) => {
    const C = () => {
      const f = F();
      const drops = [6, 18, 30];
      const hit = drops.some((a) => f >= a + 6 && f < a + 10);
      return (
        <Stage bg="#2A2340">
          <At x={960} y={1220} s={1.9}><Max pose={STAND} expr={f > 12 ? 'wince' : 'blank'} look={[0, -0.8]} /></At>
          {['A', 'B', 'C'].map((L, i) => {
            const a = drops[i]; if (f < a) return null;
            const y = f < a + 6 ? lerp(f, a, a + 6, -200, 388 - i * 176) : 388 - i * 176 + Math.sin((f - a) / 3) * 2;
            return <g key={L} transform={`translate(${960 + (i - 1) * 24} ${y}) rotate(${(i - 1) * 8})`}>
              <rect x={-90} y={-90} width={180} height={180} rx={14} fill={['#E53935', '#2F6FD6', '#3DBE7A'][i]} stroke={INK} strokeWidth={10} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={130} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke">{L}</text>
            </g>;
          })}
          {hit && <rect width={W} height={H} fill="rgba(255,255,255,0.08)" />}
        </Stage>
      );
    };
    return <Cam a={{ z: 1.0 }} b={{ z: 1.05 }} dur={d}><C /></Cam>;
  },
};

const SHOTS: Shot[] = [
  { d: 36, el: S.bookSlam },
  { d: 72, el: S.hero },
  { d: 24, el: S.freezeFace },
  { d: 24, el: S.roll },
  { d: 66, el: S.pagesIn },
  { d: 42, el: S.diagram },
  { d: 48, el: S.stain },
  { d: 48, el: S.examSlam },
  { d: 45, el: S.counter },
  { d: 63, el: S.teacher },
  { d: 42, el: S.power },
  { d: 66, el: S.dial },
  { d: 24, el: S.highFive },
  { d: 24, el: S.podium },
  { d: 24, el: S.wink },
  { d: 24, el: (d) => S.heroConfetti(d) },
  { d: 48, el: (d) => S.heroConfetti(d, true) },
  { d: 45, el: S.blocks },
  { d: 15, el: () => <AbsoluteFill style={{ background: '#000' }} /> },
];
export const COLD_OPEN_FRAMES = SHOTS.reduce((a, s) => a + s.d, 0);

const WORDS = scratchWords(LINES);

export const ColdOpen: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Shots shots={SHOTS} />
    <Captions words={WORDS} />
    <Sequence durationInFrames={672}><Audio src={staticFile('ep/music-fun.mp3')} volume={(f) => interpolate(f, [0, 20, 650, 672], [0, 0.16, 0.16, 0], { extrapolateRight: 'clamp' })} /></Sequence>
    <Sfx at={8} src="ep/sfx/slap.mp3" v={0.5} />
    <Sfx at={108} src="ep/sfx/lowhit.mp3" v={0.55} />
    <Sfx at={132} src="ep/sfx/spin.mp3" v={0.35} />
    <Sfx at={156} src="ep/sfx/whoosh.mp3" v={0.45} />
    <Sfx at={222} src="ep/sfx/whoosh.mp3" v={0.3} />
    <Sfx at={294} src="ep/sfx/pop.mp3" v={0.45} />
    <Sfx at={312} src="ep/sfx/whoosh.mp3" v={0.5} />
    <Sfx at={330} src="ep/sfx/slap.mp3" v={0.55} />
    <Sfx at={360} src="ep/sfx/counter.mp3" v={0.4} />
    <Sfx at={386} src="ep/sfx/pop.mp3" v={0.55} />
    <Sfx at={429} src="ep/sfx/boing.mp3" v={0.35} />
    <Sfx at={514} src="ep/sfx/tick.mp3" v={0.4} />
    <Sfx at={550} src="ep/sfx/lowhit.mp3" v={0.6} />
    <Sfx at={576} src="ep/sfx/slap.mp3" v={0.5} />
    <Sfx at={600} src="ep/sfx/pop.mp3" v={0.4} />
    <Sfx at={672} src="ep/sfx/scratch.mp3" v={0.6} />
    <Sfx at={726} src="ep/sfx/boing.mp3" v={0.45} />
    <Sfx at={738} src="ep/sfx/boing.mp3" v={0.45} />
    <Sfx at={750} src="ep/sfx/boing.mp3" v={0.45} />
  </AbsoluteFill>
);
