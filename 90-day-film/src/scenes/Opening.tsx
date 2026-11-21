import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, DISPLAY, MONO} from '../theme';
import {clamp, lerp, pop} from '../lib';
import {Flash, Particles} from '../components/fx';

/** 0–1.4s: black, heartbeat, the question. */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = pop(f, fps, 8, 9, 0.5);
  const shake = f >= 8 && f < 14 ? Math.sin(f * 9) * (14 - f) * 2 : 0;
  const beat = interpolate(f % 27, [0, 3, 10], [0.25, 0.6, 0.25], clamp);
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: DISPLAY, color: C.ink, alignItems: 'center', justifyContent: 'center'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, rgba(255,45,61,${beat * 0.35}) 0%, transparent 55%)`}} />
      <div style={{transform: `translateX(${shake}px)`, textAlign: 'center'}}>
        <div style={{fontSize: 64, fontWeight: 700, letterSpacing: 6, opacity: lerp(f, 2, 6, 0, 1)}}>
          WHAT IF YOU HAD JUST
        </div>
        <div style={{position: 'relative', fontSize: 330, fontWeight: 900, lineHeight: 0.95, letterSpacing: -12,
          transform: `scale(${interpolate(slam, [0, 1], [2.4, 1])})`, opacity: slam}}>
          <span style={{position: 'absolute', left: 0, right: 0, color: C.red, transform: `translateX(${f < 16 ? -10 : 0}px)`, mixBlendMode: 'screen'}}>90</span>
          <span style={{position: 'absolute', left: 0, right: 0, color: C.cyan, transform: `translateX(${f < 16 ? 10 : 0}px)`, mixBlendMode: 'screen'}}>90</span>
          <span style={{position: 'relative'}}>90</span>
        </div>
        <div style={{fontSize: 120, fontWeight: 900, letterSpacing: -2, marginTop: -6, opacity: slam}}>DAYS</div>
        <div style={{fontSize: 58, fontWeight: 700, letterSpacing: 4, marginTop: 30, color: C.red, opacity: lerp(f, 16, 20, 0, 1)}}>
          TO CHANGE YOUR CAREER?<span style={{opacity: f % 10 < 5 ? 1 : 0}}>_</span>
        </div>
      </div>
      <div style={{position: 'absolute', top: 120, fontFamily: MONO, fontSize: 26, letterSpacing: 8, color: C.dim, opacity: lerp(f, 0, 6, 0, 1)}}>
        THE DATA GUY · PRESENTS
      </div>
      <Flash at={8} dur={5} />
    </AbsoluteFill>
  );
};

const Counter: React.FC<{label: string; value: string; d: number}> = ({label, value, d}) => {
  const f = useCurrentFrame();
  const o = lerp(f, d, d + 4, 0, 1);
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 34px',
      borderBottom: '1px solid rgba(255,45,61,0.35)', opacity: o, transform: `translateX(${lerp(f, d, d + 5, -60, 0)}px)`}}>
      <span style={{fontFamily: MONO, fontSize: 34, letterSpacing: 6, color: '#ffb3b9'}}>{label}</span>
      <span style={{fontFamily: MONO, fontSize: 84, fontWeight: 700, color: C.red, textShadow: `0 0 24px ${C.red}`,
        opacity: f % 8 < 6 ? 1 : 0.6}}>{value}</span>
    </div>
  );
};

const Reject: React.FC<{text: string; sub: string; d: number; y: number; x: number; rot: number}> = ({text, sub, d, y, x, rot}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, fps, d, 13, 0.4);
  return (
    <div style={{position: 'absolute', top: y, left: x, width: 520, padding: '18px 24px', borderRadius: 18,
      background: 'rgba(20,10,14,0.78)', border: '1.5px solid rgba(255,45,61,0.6)', backdropFilter: 'blur(8px)',
      transform: `scale(${p}) rotate(${rot}deg)`, opacity: p, fontFamily: DISPLAY}}>
      <div style={{fontSize: 22, color: '#ff8c95', letterSpacing: 3, fontWeight: 700}}>{sub}</div>
      <div style={{fontSize: 34, color: C.ink, fontWeight: 800, marginTop: 4}}>{text}</div>
    </div>
  );
};

/** 1.4–2.6s: the pain — dark bedroom, rejection, red zero counters. */
export const Pain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={staticFile('img/before_916.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${lerp(f, 0, 36, 1.12, 1.32)})`, transformOrigin: '50% 42%', filter: 'saturate(0.7) contrast(1.1) brightness(0.85)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 30%, transparent 55%, rgba(30,0,4,0.92) 78%)'}} />
      <Reject sub="APPLICATION UPDATE" text="Not selected." d={0} y={150} x={60} rot={-3} />
      <Reject sub="REQUIREMENT" text="2+ years experience" d={4} y={270} x={500} rot={2.5} />
      <Reject sub="PORTFOLIO" text="No projects found" d={8} y={390} x={90} rot={-1.5} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 1300, borderRadius: 24, border: `2px solid ${C.red}`,
        background: 'rgba(10,0,2,0.7)', boxShadow: `0 0 60px rgba(255,45,61,0.35)`}}>
        <Counter label="SKILLS" value="00" d={2} />
        <Counter label="EXPERIENCE" value="00" d={5} />
        <Counter label="PROJECTS" value="00" d={8} />
        <Counter label="DAYS LEFT" value="90" d={11} />
      </div>
    </AbsoluteFill>
  );
};

/** 2.6–4.7s: freeze, push into the eyes, interface boots, "SO HE BUILT HIMSELF. IN 90 DAYS." */
export const Built: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = lerp(f, 0, 40, 1.35, 3.1);
  const t1 = pop(f, fps, 0, 10, 0.5);
  const t2 = pop(f, fps, 33, 10, 0.5);
  const ringRot = f * 3;
  const out = lerp(f, 54, 63, 1, 0);
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: DISPLAY}}>
      <AbsoluteFill style={{opacity: out}}>
        <Img src={staticFile('img/before_916.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${zoom})`, transformOrigin: '50% 42.5%',
          filter: `grayscale(${lerp(f, 0, 6, 0, 0.85)}) contrast(1.25) brightness(${lerp(f, 30, 50, 0.9, 0.35)})`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, rgba(56,225,255,0.06) 0 2px, transparent 2px 6px)`}} />
      {/* HUD rings that boot around the eye line */}
      {[260, 380, 520].map((r, i) => (
        <div key={r} style={{position: 'absolute', left: 540 - r, top: 820 - r, width: r * 2, height: r * 2, borderRadius: '50%',
          border: `${i === 1 ? 3 : 2}px ${i === 2 ? 'dashed' : 'solid'} ${C.cyan}`, opacity: lerp(f, 4 + i * 3, 10 + i * 3, 0, 0.75) * out,
          transform: `rotate(${i % 2 ? -ringRot : ringRot}deg) scale(${lerp(f, 4 + i * 3, 14 + i * 3, 0.6, 1)})`,
          clipPath: i === 0 ? 'polygon(0 0,100% 0,100% 40%,0 40%,0 60%,100% 60%,100% 100%,0 100%)' : undefined}} />
      ))}
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', opacity: t1,
        transform: `scale(${interpolate(t1, [0, 1], [1.8, 1])})`}}>
        <div style={{fontSize: 92, fontWeight: 900, color: C.ink, letterSpacing: -1, lineHeight: 1.02}}>SO HE BUILT</div>
        <div style={{fontSize: 150, fontWeight: 900, color: C.ink, letterSpacing: -4, lineHeight: 1,
          textShadow: `0 0 50px ${C.cyan}`}}>HIMSELF.</div>
      </div>
      <div style={{position: 'absolute', top: 1280, width: '100%', textAlign: 'center', opacity: t2,
        transform: `translateY(${interpolate(t2, [0, 1], [80, 0])}px)`}}>
        <div style={{fontFamily: MONO, fontSize: 34, letterSpacing: 10, color: C.cyan}}>INITIALISING · DAY 01</div>
        <div style={{fontSize: 170, fontWeight: 900, color: C.ink, letterSpacing: -5, lineHeight: 1.05}}>IN 90 DAYS.</div>
        <div style={{margin: '18px auto 0', width: 760, height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}>
          <div style={{width: `${lerp(f, 36, 60, 0, 100)}%`, height: '100%', background: `linear-gradient(90deg, ${C.cyan}, ${C.excel})`}} />
        </div>
        <div style={{fontSize: 30, letterSpacing: 6, color: C.dim, marginTop: 18, fontWeight: 600}}>THE 90-DAY DATA ANALYST CAREER SYSTEM</div>
      </div>
      <Sequence from={52}><Particles color={C.excel} n={90} burst seed={3} /></Sequence>
      <Flash at={0} dur={6} />
      <Flash at={33} dur={4} color={C.cyan} />
    </AbsoluteFill>
  );
};
