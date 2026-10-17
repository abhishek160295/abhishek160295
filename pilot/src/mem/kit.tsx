// Reusable 2D kit: camera, transitions, captions, sets, graphics. Shared by every 2D episode.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, Sequence, Audio, staticFile } from 'remotion';
import { INK } from '../max/Max';

export const FONT = '"Inter Display", Inter, sans-serif';
export const W = 1920, H = 1080;
export const ease = Easing.bezier(0.33, 0, 0.2, 1);
export const lerp = (f: number, a: number, b: number, from: number, to: number, e = ease) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e });

/** time remap: piecewise speeds [[atFrame, speed], ...] -> local animation time */
export const remap = (f: number, segs: [number, number][]) => {
  let t = 0;
  for (let i = 0; i < segs.length; i++) {
    const [a, sp] = segs[i];
    const b = i + 1 < segs.length ? segs[i + 1][0] : Infinity;
    if (f <= a) break;
    t += (Math.min(f, b) - a) * sp;
  }
  return t;
};

export type CamKey = { x?: number; y?: number; z?: number; r?: number };
/** Camera over a 1920x1080 stage: moves from `a` to `b` over `dur` frames, plus optional shake and whip-in. */
export const Cam: React.FC<{ a: CamKey; b?: CamKey; dur: number; shake?: number; whip?: number; tilt?: number; children: React.ReactNode }> = ({ a, b, dur, shake = 0, whip = 0, tilt = 0, children }) => {
  const f = useCurrentFrame();
  const B = { ...a, ...b };
  const k = lerp(f, 0, dur, 0, 1);
  const x = (a.x ?? 0) + ((B.x ?? 0) - (a.x ?? 0)) * k;
  const y = (a.y ?? 0) + ((B.y ?? 0) - (a.y ?? 0)) * k;
  // gentle camera: zoom drift is damped to 35% of the requested move so nothing feels like a zoom-in
  const z0 = 1 + ((a.z ?? 1) - 1) * 0.35, z1 = 1 + ((B.z ?? 1) - 1) * 0.35;
  const z = z0 + (z1 - z0) * k;
  const r = (a.r ?? 0) + ((B.r ?? 0) - (a.r ?? 0)) * k + tilt;
  const sh = shake * 0.4 * Math.max(0, 1 - f / 12);
  const sx = sh * Math.sin(f * 2.9) * 14, sy = sh * Math.cos(f * 3.7) * 10;
  const wk = whip ? lerp(f, 0, 7, 1, 0) : 0;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{
        transform: `translate(${sx + wk * whip * 700}px, ${sy}px) scale(${z}) rotate(${r}deg) translate(${-x}px, ${-y}px)`,
        filter: wk > 0.02 ? `blur(${wk * 26}px)` : undefined,
      }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', background: bg }}>{children}</svg>
);

/** shot list: each shot is a Sequence */
export type Shot = { d: number; el: (d: number) => React.ReactNode };
export const Shots: React.FC<{ shots: Shot[]; start?: number }> = ({ shots, start = 0 }) => {
  let t = start;
  return (<>{shots.map((s, i) => { const from = t; t += s.d; return <Sequence key={i} from={from} durationInFrames={s.d}>{s.el(s.d)}</Sequence>; })}</>);
};
export const shotsLength = (shots: Shot[]) => shots.reduce((a, s) => a + s.d, 0);

export const Sfx: React.FC<{ at: number; src: string; v?: number }> = ({ at, src, v = 0.5 }) => (
  <Sequence from={Math.round(at)} durationInFrames={150}><Audio src={staticFile(src)} volume={v} /></Sequence>
);

/** Word-by-word captions: white with the spoken word in yellow. words = [text, startFrame, endFrame] */
export const Captions: React.FC<{ words: [string, number, number][]; per?: number }> = ({ words, per = 4 }) => {
  const f = useCurrentFrame();
  // phrase groups: break at sentence ends or after `per` words
  const groups: number[][] = [];
  let cur: number[] = [];
  words.forEach((w, j) => { cur.push(j); if (cur.length >= per || /[.?!…]$/.test(w[0])) { groups.push(cur); cur = []; } });
  if (cur.length) groups.push(cur);
  const i = words.findIndex((w, j) => f >= w[1] && f < (words[j + 1]?.[1] ?? w[2] + 12));
  if (i < 0) return null;
  const grp = groups.find((g) => g.includes(i))!;
  if (f > words[grp[grp.length - 1]][2] + 10) return null;
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90, pointerEvents: 'none' }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: -1, textAlign: 'center', maxWidth: 1500 }}>
        {grp.map((j) => {
          const w = words[j];
          const on = j === i;
          const p = lerp(f, w[1], w[1] + 4, 0.8, 1);
          return (
            <span key={j} style={{
              display: 'inline-block', margin: '0 12px', color: on ? '#FFD21F' : '#fff',
              transform: `scale(${on ? 1.08 * p + (1 - p) * 0.9 : 1})`,
              WebkitTextStroke: '12px #141414', paintOrder: 'stroke fill',
              textShadow: '0 6px 0 rgba(0,0,0,0.35)',
            }}>{w[0]}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** narration lines -> word timings (frames), spread by word length, used before the real voice exists */
export const scratchWords = (lines: [number, number, string][]): [string, number, number][] =>
  lines.flatMap(([a, b, text]) => {
    const ws = text.split(/\s+/).filter(Boolean);
    const wt = ws.map((w) => w.replace(/[^\w]/g, '').length + 2);
    const tot = wt.reduce((x, y) => x + y, 0);
    let acc = 0;
    return ws.map((w, i) => { const s = a + (acc / tot) * (b - a); acc += wt[i]; return [w, Math.round(s), Math.round(a + (acc / tot) * (b - a))] as [string, number, number]; });
  });

// ---------- sets ----------
export const Bathroom: React.FC = () => (
  <g>
    <rect width={W} height={H} fill="#BFE3EF" />
    {Array.from({ length: 24 }, (_, i) => <line key={'v' + i} x1={i * 90} y1={0} x2={i * 90} y2={800} stroke="#A5D2E2" strokeWidth={4} />)}
    {Array.from({ length: 10 }, (_, i) => <line key={'h' + i} x1={0} y1={i * 90} x2={W} y2={i * 90} stroke="#A5D2E2" strokeWidth={4} />)}
    <rect y={800} width={W} height={280} fill="#E8DFCF" />
    <rect y={800} width={W} height={14} fill="#CFC3AE" />
    <g transform="translate(1260 170)">
      <rect width={380} height={300} rx={30} fill="#E6F7FC" stroke={INK} strokeWidth={8} />
      <path d="M60 60 L140 140 M100 50 L190 140" stroke="#fff" strokeWidth={14} strokeLinecap="round" />
      <rect x={60} y={380} width={260} height={90} rx={20} fill="#fff" stroke={INK} strokeWidth={8} />
      <rect x={170} y={330} width={40} height={60} rx={8} fill="#C8CED8" stroke={INK} strokeWidth={6} />
      <rect x={140} y={470} width={100} height={330} fill="#fff" stroke={INK} strokeWidth={8} />
    </g>
    <g transform="translate(330 800)">
      <rect x={-20} y={-330} width={170} height={170} rx={14} fill="#fff" stroke={INK} strokeWidth={8} />
      <path d="M-60 -170 L200 -170 Q200 -60 120 -40 L120 0 L20 0 L20 -40 Q-60 -60 -60 -170 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <ellipse cx={70} cy={-170} rx={130} ry={22} fill="#EEF3F7" stroke={INK} strokeWidth={8} />
    </g>
  </g>
);

export const ToiletRoll: React.FC<{ spin: number }> = ({ spin }) => (
  <g>
    <rect x={-120} y={-14} width={240} height={28} rx={14} fill="#B9C0CC" stroke={INK} strokeWidth={6} />
    <g transform={`rotate(${spin})`}>
      <circle r={90} fill="#fff" stroke={INK} strokeWidth={8} />
      <circle r={34} fill="#D8C7A8" stroke={INK} strokeWidth={6} />
      {[0, 60, 120, 180, 240, 300].map((a) => <line key={a} x1={44} y1={0} x2={84} y2={0} stroke="#D9DEE6" strokeWidth={6} transform={`rotate(${a})`} />)}
    </g>
    <path d={`M90 0 L90 ${160 + Math.sin(spin / 20) * 10} L20 ${190 + Math.sin(spin / 14) * 14}`} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d={`M90 0 L90 ${160 + Math.sin(spin / 20) * 10} L20 ${190 + Math.sin(spin / 14) * 14}`} fill="none" stroke="#fff" strokeWidth={0} />
  </g>
);

export const ExamHall: React.FC = () => (
  <g>
    <rect width={W} height={H} fill="#EAD8B5" />
    <rect x={460} y={80} width={1000} height={360} rx={18} fill="#2F5E46" stroke="#7A5232" strokeWidth={22} />
    <path d="M540 170 Q620 140 700 175 M540 250 L880 250 M540 320 L760 320 M1000 180 Q1080 140 1160 190 Q1240 240 1320 180" stroke="#E9F2EA" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.85} />
    <circle cx={1660} cy={170} r={70} fill="#fff" stroke={INK} strokeWidth={8} />
    <path d="M1660 170 L1660 125 M1660 170 L1695 185" stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <rect y={640} width={W} height={440} fill="#C89263" />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={640 + i * 40} x2={W} y2={640 + i * 40} stroke="#B07D50" strokeWidth={4} />)}
    {[0, 1].map((row) => Array.from({ length: 6 }, (_, i) => {
      const x = 180 + i * 320 + row * 80, y = 600 + row * 70;
      return (
        <g key={row + '-' + i} transform={`translate(${x} ${y}) scale(${0.55 + row * 0.08})`}>
          <circle cx={0} cy={-150} r={70} fill={INK} />
          <rect x={-90} y={-90} width={180} height={60} rx={12} fill="#8E6845" stroke={INK} strokeWidth={8} />
        </g>
      );
    }))}
  </g>
);

// ---------- graphics ----------
export const Burst: React.FC<{ x: number; y: number; p: number; color?: string; n?: number; r?: number }> = ({ x, y, p, color = '#FFD21F', n = 14, r = 260 }) => (
  <g transform={`translate(${x} ${y})`} opacity={1 - p}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return <line key={i} x1={Math.cos(a) * r * p * 0.5} y1={Math.sin(a) * r * p * 0.5} x2={Math.cos(a) * r * (0.3 + p)} y2={Math.sin(a) * r * (0.3 + p)} stroke={color} strokeWidth={16 * (1 - p) + 4} strokeLinecap="round" />;
    })}
  </g>
);

export const Page: React.FC<{ kind?: 'text' | 'diagram' | 'stain' }> = ({ kind = 'text' }) => (
  <g>
    <rect x={-80} y={-105} width={160} height={210} rx={8} fill="#FFFDF6" stroke={INK} strokeWidth={6} />
    {kind === 'text' && [-70, -45, -20, 5, 30, 55].map((y) => <line key={y} x1={-55} y1={y} x2={y % 2 ? 40 : 55} y2={y} stroke="#9AA3B5" strokeWidth={8} strokeLinecap="round" />)}
    {kind === 'diagram' && (
      <g stroke={INK} strokeWidth={6}>
        <line x1={-30} y1={-20} x2={30} y2={-40} /><line x1={-30} y1={-20} x2={0} y2={40} />
        <circle cx={-30} cy={-20} r={20} fill="#E53935" /><circle cx={30} cy={-40} r={14} fill="#fff" /><circle cx={0} cy={40} r={14} fill="#fff" />
      </g>
    )}
    {kind === 'stain' && (
      <g>
        {[-70, -45, -20].map((y) => <line key={y} x1={-55} y1={y} x2={55} y2={y} stroke="#9AA3B5" strokeWidth={8} strokeLinecap="round" />)}
        <circle cx={10} cy={30} r={46} fill="none" stroke="#8A5A2E" strokeWidth={12} opacity={0.75} />
        <text x={0} y={92} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={INK}>212</text>
      </g>
    )}
  </g>
);

export const Gauge: React.FC<{ v: number; label0: string; label1: string }> = ({ v, label0, label1 }) => {
  const a = -180 + v * 180;
  return (
    <g>
      <path d="M-420 0 A420 420 0 0 1 420 0" fill="none" stroke={INK} strokeWidth={96} />
      <path d="M-420 0 A420 420 0 0 1 -150 -392" fill="none" stroke="#3DBE7A" strokeWidth={70} />
      <path d="M-150 -392 A420 420 0 0 1 150 -392" fill="none" stroke="#FFD21F" strokeWidth={70} />
      <path d="M150 -392 A420 420 0 0 1 420 0" fill="none" stroke="#E53935" strokeWidth={70} />
      <g transform={`rotate(${a})`}>
        <path d="M0 -18 L380 0 L0 18 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      </g>
      <circle r={46} fill={INK} />
      <text x={-420} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#fff" stroke={INK} strokeWidth={12} paintOrder="stroke">{label0}</text>
      <text x={420} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#FFD21F" stroke={INK} strokeWidth={12} paintOrder="stroke">{label1}</text>
    </g>
  );
};

export const BigNum: React.FC<{ text: string; size?: number; color?: string }> = ({ text, size = 300, color = '#fff' }) => (
  <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} stroke={INK} strokeWidth={size / 12} paintOrder="stroke" letterSpacing={-4}>{text}</text>
);

export const Confetti: React.FC<{ t: number; seed?: number }> = ({ t, seed = 1 }) => (
  <g>
    {Array.from({ length: 60 }, (_, i) => {
      const r = (k: number) => { const s = Math.sin((i + 1) * 9301 * k * seed) * 43758.5453; return s - Math.floor(s); };
      const x = r(1) * W, y = -60 + ((r(2) * H + t * (6 + r(3) * 8)) % (H + 120));
      const c = ['#FFD21F', '#E53935', '#3DBE7A', '#2F6FD6', '#fff'][i % 5];
      return <rect key={i} x={x + Math.sin(t / 10 + i) * 30} y={y} width={18} height={30} rx={4} fill={c} transform={`rotate(${t * 6 + i * 40} ${x} ${y})`} />;
    })}
  </g>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.35 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: 'none' }} />
);
