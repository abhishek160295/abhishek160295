import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, DISPLAY, MONO} from '../theme';
import {clamp, lerp, pop} from '../lib';
import {Flash, Glass, Particles} from '../components/fx';

export const ORBIT = [
  {src: 'excel', inv: false}, {src: 'sqlserver', inv: true}, {src: 'python', inv: false}, {src: 'numpy', inv: false},
  {src: 'pandas', inv: true}, {src: 'powerbi', inv: false}, {src: 'tableau', inv: false}, {src: 'git', inv: false}, {src: 'github', inv: true},
];
const Logo: React.FC<{src: string; inv: boolean; size: number; style?: React.CSSProperties}> = ({src, inv, size, style}) => (
  <Img src={staticFile(`logos/${src}.svg`)} style={{width: size, height: size, objectFit: 'contain',
    filter: `${inv ? 'invert(1) ' : ''}drop-shadow(0 0 18px rgba(255,255,255,0.45))`, ...style}} />
);

const Chip: React.FC<{t: string; d: number; y: number}> = ({t, d, y}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const p = pop(f, fps, d, 13, 0.4);
  const out = lerp(f, 54, 60, 1, 0);
  return <div style={{position: 'absolute', left: 50, top: y, padding: '14px 26px', borderRadius: 40, fontFamily: DISPLAY, fontWeight: 800, fontSize: 32,
    color: '#fff', background: 'rgba(10,14,22,0.6)', border: '1.5px solid rgba(255,207,112,0.7)', backdropFilter: 'blur(10px)',
    transform: `translateX(${(1 - p) * -300}px)`, opacity: p * out}}><span style={{color: '#4ade80'}}>✓</span> {t}</div>;
};

/** 8.85–11.3s: every skill orbits him, fuses, and the bedroom becomes an office. Interview → offer (dramatised). */
export const Ecosystem: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const speed = interpolate(f, [0, 26], [0.04, 0.32], clamp);
  const ang = interpolate(f, [0, 26], [0, 3.4], {...clamp, easing: (x) => x * x});
  const rad = lerp(f, 0, 26, 470, 0, (x) => x * x * x);
  const orbitO = lerp(f, 22, 28, 1, 0);
  const reveal = lerp(f, 24, 34, 0, 1);
  const notif = pop(f, fps, 44, 12, 0.5);
  const offer = pop(f, fps, 56, 12, 0.5);
  // caption synced to VO "Your career doesn't need a perfect start." (local f4–f72)
  const words = "YOUR CAREER DOESN'T NEED A PERFECT START.".split(' ');
  return (
    <AbsoluteFill style={{background: '#04060a', fontFamily: DISPLAY}}>
      <AbsoluteFill style={{opacity: reveal}}>
        <Img src={staticFile('img/after_916.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${lerp(f, 24, 73, 1.3, 1.08)}) rotate(${lerp(f, 24, 73, -2, 0)}deg)`, transformOrigin: '50% 40%'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35), transparent 30%, transparent 55%, rgba(0,0,0,0.85) 85%)'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: orbitO, background: 'radial-gradient(circle at 50% 50%, rgba(56,225,255,0.25), transparent 60%)'}}>
        {ORBIT.map((l, i) => {
          const a = (i / ORBIT.length) * Math.PI * 2 + ang + f * speed;
          const z = Math.sin(a);
          return <div key={l.src} style={{position: 'absolute', left: 540 + Math.cos(a) * rad - 60, top: 900 + z * rad * 0.55 - 60,
            transform: `scale(${0.75 + (z + 1) * 0.3})`, zIndex: Math.round(z * 10) + 10}}><Logo {...l} size={120} /></div>;
        })}
        <div style={{position: 'absolute', left: 540 - 90, top: 900 - 90, width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 0%, #38e1ff 40%, transparent 70%)', transform: `scale(${lerp(f, 10, 27, 0.2, 5)})`, opacity: lerp(f, 10, 27, 0.4, 1)}} />
      </AbsoluteFill>
      <Chip t="RESUME" d={26} y={1000} />
      <Chip t="LINKEDIN" d={28} y={1090} />
      <Chip t="PORTFOLIO" d={30} y={1180} />
      <Chip t="MOCK INTERVIEWS" d={32} y={1270} />
      <Glass tint="#ffffff" style={{left: 60, right: 60, top: 110, height: 150, padding: '22px 30px', transform: `translateY(${(1 - notif) * -260}px)`, opacity: notif,
        background: 'rgba(28,30,38,0.78)'}}>
        <div style={{display: 'flex', gap: 22, alignItems: 'center'}}>
          <div style={{width: 92, height: 92, borderRadius: 22, background: 'linear-gradient(135deg,#38e1ff,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52}}>✉</div>
          <div>
            <div style={{fontSize: 24, color: '#9aa4b2', fontWeight: 600, letterSpacing: 2}}>MAIL · NOW</div>
            <div style={{fontSize: 40, color: '#fff', fontWeight: 800}}>INTERVIEW UPDATE</div>
            <div style={{fontSize: 26, color: '#cfd6e0'}}>Congratulations — we'd like to make you an offer…</div>
          </div>
        </div>
      </Glass>
      <div style={{position: 'absolute', left: 140, right: 140, top: 1020, height: 420, borderRadius: 16, background: '#fbfaf6', padding: '34px 40px',
        boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 80px rgba(255,207,112,0.4)', transform: `perspective(1400px) rotateX(${(1 - offer) * 70}deg) translateY(${(1 - offer) * 300}px)`,
        opacity: offer, transformOrigin: 'bottom'}}>
        <div style={{fontFamily: MONO, fontSize: 20, color: '#8a8478', letterSpacing: 4}}>LETTER OF OFFER</div>
        <div style={{fontSize: 58, fontWeight: 900, color: '#111', marginTop: 8, letterSpacing: -1}}>Data Analyst</div>
        <div style={{height: 2, background: '#e4ded0', margin: '18px 0'}} />
        {['SQL · Python · Power BI · Tableau', 'Start date: Monday'].map((t) => <div key={t} style={{fontSize: 28, color: '#3a3730', marginBottom: 8}}>{t}</div>)}
        <div style={{position: 'absolute', right: 34, bottom: 30, fontSize: 30, fontWeight: 800, color: '#b8860b', border: '3px solid #b8860b', padding: '4px 14px', borderRadius: 8, transform: 'rotate(-8deg)'}}>ACCEPTED</div>
        <div style={{position: 'absolute', left: 40, bottom: 26, fontFamily: MONO, fontSize: 16, color: '#9a9484'}}>Dramatisation · fictional employer · results vary</div>
      </div>
      <div style={{position: 'absolute', left: 50, right: 50, top: 1540, textAlign: 'center', fontSize: 76, fontWeight: 900, lineHeight: 1.04, letterSpacing: -2, color: '#fff',
        textShadow: '0 4px 30px rgba(0,0,0,0.8)'}}>
        {words.map((w, i) => <span key={i} style={{opacity: lerp(f, 4 + i * 8, 7 + i * 8, 0.15, 1), color: w === 'PERFECT' ? C.gold : '#fff'}}>{w} </span>)}
      </div>
      <Particles color={C.gold} n={30} seed={21} />
      <Flash at={26} dur={7} />
    </AbsoluteFill>
  );
};

/** 11.3–12.9s: IT NEEDS A PLAN + brand + CTA. */
export const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = pop(f, fps, 1, 10, 0.5);
  const row = ['excel', 'sqlserver', 'python', 'powerbi', 'tableau', 'github'];
  const pulse = 1 + Math.sin(f / 3) * 0.03;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #1b1404 0%, #05070c 60%)', fontFamily: DISPLAY, color: '#fff'}}>
      <Particles color={C.gold} n={50} seed={31} />
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', transform: `scale(${interpolate(slam, [0, 1], [2, 1])})`, opacity: slam}}>
        <div style={{fontSize: 74, fontWeight: 800, letterSpacing: 2, color: C.dim}}>IT NEEDS A</div>
        <div style={{fontSize: 290, fontWeight: 900, letterSpacing: -12, lineHeight: 0.9, color: C.gold, textShadow: `0 0 70px ${C.gold}88`}}>PLAN.</div>
      </div>
      <div style={{position: 'absolute', top: 760, width: '100%', display: 'flex', justifyContent: 'center', gap: 38}}>
        {row.map((l, i) => {
          const on = f >= 6 + i * 2;
          return <Img key={l} src={staticFile(`logos/${l}.svg`)} style={{width: 104, height: 104, objectFit: 'contain',
            filter: `${['sqlserver', 'github'].includes(l) ? 'invert(1) ' : ''}${on ? 'drop-shadow(0 0 22px rgba(255,255,255,0.8))' : 'grayscale(1) brightness(0.3)'}`,
            transform: `scale(${on ? lerp(f, 6 + i * 2, 10 + i * 2, 1.4, 1) : 0.9})`}} />;
        })}
      </div>
      <div style={{position: 'absolute', top: 930, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 30, letterSpacing: 5, color: '#e8dcc0', opacity: lerp(f, 8, 14, 0, 1), lineHeight: 1.6}}>
        ONE SKILL · ONE PROJECT · ONE OPPORTUNITY<br />AT A TIME
      </div>
      <div style={{position: 'absolute', top: 1110, width: '100%', textAlign: 'center', opacity: lerp(f, 12, 18, 0, 1), transform: `translateY(${lerp(f, 12, 20, 40, 0)}px)`}}>
        <div style={{fontSize: 118, fontWeight: 900, letterSpacing: -3}}>THE DATA GUY</div>
        <div style={{fontSize: 33, fontWeight: 700, letterSpacing: 5, color: C.gold, marginTop: 6}}>THE 90-DAY DATA ANALYST CAREER SYSTEM</div>
      </div>
      <div style={{position: 'absolute', top: 1430, left: 60, right: 60, padding: '34px 0', whiteSpace: 'nowrap', borderRadius: 80, textAlign: 'center',
        background: `linear-gradient(90deg, ${C.gold}, #ff9f43)`, color: '#140d00', fontSize: 50, fontWeight: 900, letterSpacing: 0,
        transform: `scale(${lerp(f, 18, 24, 0.6, 1) * pulse})`, opacity: lerp(f, 18, 22, 0, 1), boxShadow: `0 0 80px ${C.gold}88`}}>
        COMMENT “ROADMAP” TO START
      </div>
      <Flash at={1} dur={5} color={C.gold} />
    </AbsoluteFill>
  );
};
