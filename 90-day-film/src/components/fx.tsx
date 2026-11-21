import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {clamp, lerp, pop, seeded} from '../lib';
import {C, DISPLAY} from '../theme';

/** Perspective digital floor + horizon glow. */
export const Grid: React.FC<{color: string; speed?: number; opacity?: number}> = ({color, speed = 6, opacity = 0.5}) => {
  const f = useCurrentFrame();
  const off = (f * speed) % 120;
  return (
    <AbsoluteFill style={{perspective: 900, overflow: 'hidden', opacity}}>
      <div style={{position: 'absolute', left: -1200, right: -1200, top: 1150, height: 2400,
        transform: 'rotateX(72deg)', transformOrigin: 'top center',
        backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`,
        backgroundSize: '120px 120px', backgroundPosition: `0 ${off}px`,
        maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 60%, transparent)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 980, height: 360,
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 65%)`, opacity: 0.45, filter: 'blur(30px)'}} />
    </AbsoluteFill>
  );
};

/** Drifting data particles; burst=true explodes from the centre. */
export const Particles: React.FC<{color: string; n?: number; burst?: boolean; seed?: number}> = ({color, n = 70, burst, seed = 1}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: n}).map((_, i) => {
        const r1 = seeded(i + seed * 100), r2 = seeded(i * 3 + seed), r3 = seeded(i * 7 + seed * 9);
        let x: number, y: number;
        if (burst) {
          const ang = r1 * Math.PI * 2, dist = lerp(f, 0, 14, 0, 300 + r2 * 900);
          x = 540 + Math.cos(ang) * dist; y = 900 + Math.sin(ang) * dist;
        } else {
          x = r1 * 1080 + Math.sin(f / 12 + i) * 18; y = ((r2 * 1920 - f * (3 + r3 * 9)) % 1920 + 1920) % 1920;
        }
        const sz = 3 + r3 * 7;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: 2,
          background: color, boxShadow: `0 0 ${sz * 3}px ${color}`, opacity: burst ? lerp(f, 6, 18, 1, 0) : 0.35 + r3 * 0.5}} />;
      })}
    </AbsoluteFill>
  );
};

/** Film grain + vignette + letterbox scanline sheen. Sits on top of everything. */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.75) 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${f % 9}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`}} />
    </AbsoluteFill>
  );
};

/** White flash used as a cut accent. */
export const Flash: React.FC<{at?: number; dur?: number; color?: string}> = ({at = 0, dur = 6, color = '#fff'}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + dur], [0, 0.9, 0], clamp);
  return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen'}} />;
};

/** The official logo as a physical object: flies in from depth, spins on Y, lands with glow + shockwave. */
export const LogoArrival: React.FC<{src: string; size?: number; glow: string; y?: number; invert?: boolean; delay?: number}> =
  ({src, size = 300, glow, y = 520, invert, delay = 0}) => {
  const f = useCurrentFrame() - delay;
  const {fps} = useVideoConfig();
  const p = pop(f, fps, 0, 11, 0.5);
  const z = interpolate(p, [0, 1], [-1400, 0]);
  const rot = interpolate(f, [0, 9], [-160, 0], {...clamp});
  const ring = lerp(f, 4, 16, 0.3, 2.4);
  return (
    <div style={{position: 'absolute', left: 540 - size / 2, top: y - size / 2, width: size, height: size, perspective: 1200}}>
      <div style={{position: 'absolute', inset: -size * 0.6, borderRadius: '50%',
        border: `4px solid ${glow}`, transform: `scale(${ring})`, opacity: lerp(f, 4, 16, 0.9, 0)}} />
      <div style={{position: 'absolute', inset: -size * 0.5, borderRadius: '50%',
        background: `radial-gradient(circle, ${glow}66 0%, transparent 65%)`, opacity: p}} />
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'contain',
        transform: `translateZ(${z}px) rotateY(${rot}deg)`,
        filter: `${invert ? 'invert(1) ' : ''}drop-shadow(0 0 40px ${glow}) drop-shadow(0 20px 30px rgba(0,0,0,0.6))`}} />
    </div>
  );
};

/** Big skill name + tagline, slams in. */
export const SkillTitle: React.FC<{name: string; tag: string; color: string; y?: number}> = ({name, tag, color, y = 760}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, fps, 2, 14, 0.5);
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', fontFamily: DISPLAY}}>
      <div style={{fontSize: name.length > 8 ? 120 : 160, fontWeight: 900, color: C.ink, letterSpacing: -3, lineHeight: 1,
        transform: `scale(${interpolate(p, [0, 1], [1.6, 1])})`, opacity: p,
        textShadow: `0 0 40px ${color}aa, 0 6px 0 rgba(0,0,0,0.4)`}}>{name}</div>
      <div style={{marginTop: 22, fontSize: 44, fontWeight: 700, color, letterSpacing: 4,
        opacity: lerp(f, 5, 10, 0, 1), transform: `translateY(${lerp(f, 5, 12, 20, 0)}px)`}}>{tag}</div>
    </div>
  );
};

/** Glass panel used for dashboards, code windows, cards. */
export const Glass: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; tint?: string}> = ({style, children, tint = '#ffffff'}) => (
  <div style={{position: 'absolute', borderRadius: 26, background: `linear-gradient(145deg, ${tint}22, ${tint}08)`,
    border: `1.5px solid ${tint}40`, boxShadow: `0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 ${tint}40`,
    backdropFilter: 'blur(14px)', overflow: 'hidden', ...style}}>{children}</div>
);
