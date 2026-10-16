// The one and only Max. Every shot in every episode uses this file (production rule 4).
// SVG, local units: origin at the feet, head top at about y = -392. Facing the viewer.
import React, { useId } from 'react';
import { useCurrentFrame } from 'remotion';

export const INK = '#141414';
export const BONE = '#EDE6D6';

export type Look = {
  jacket: string; jacketDark: string; pants: string; shoes: string; sole: string; skin: string;
  hair?: 'bun' | 'none';
  glasses?: boolean;
  hairColor?: string;
};
export const MAX: Look = { jacket: '#FFC72C', jacketDark: '#C9921A', pants: '#2F6FD6', shoes: '#E53935', sole: '#FFFFFF', skin: INK };
export const MUM: Look = { jacket: '#8E5BD6', jacketDark: '#5E3A9A', pants: '#3A3F58', shoes: '#F2F2F2', sole: '#9A9AA8', skin: INK, hair: 'bun', hairColor: '#5A3A22' };
export const TEACHER: Look = { jacket: '#8A96A8', jacketDark: '#5F6A7C', pants: '#3A3F58', shoes: '#2B2B2B', sole: '#8A8A8A', skin: INK, glasses: true };
export const DAVE: Look = { jacket: '#3DBE7A', jacketDark: '#258553', pants: '#5A4632', shoes: '#2B2B2B', sole: '#8A8A8A', skin: INK };

/** joint angles in degrees. 0 = hanging straight down, + = toward screen-right */
export type Pose = {
  shL: number; elL: number; shR: number; elR: number;
  hipL: number; knL: number; hipR: number; knR: number;
  lean?: number; tilt?: number; bob?: number;
};
export const STAND: Pose = { shL: -14, elL: -6, shR: 14, elR: 6, hipL: -4, knL: 0, hipR: 4, knR: 0 };
export const WAVE = (t = 0): Pose => ({ ...STAND, shR: 145, elR: 25 + Math.sin(t * 0.5) * 22, tilt: -4 });
export const POINT: Pose = { ...STAND, shR: 92, elR: 2, lean: 3 };
export const PANIC: Pose = { shL: -150, elL: -25, shR: 150, elR: 25, hipL: -12, knL: 6, hipR: 12, knR: -6, bob: -6 };
export const FACEPALM: Pose = { ...STAND, shR: -158, elR: -14, tilt: 6, lean: -2 };
export const HOLD: Pose = { ...STAND, shL: 28, elL: 105, shR: -28, elR: -105 };
export const SHRUG: Pose = { ...STAND, shL: -60, elL: 95, shR: 60, elR: -95, tilt: 5 };
export const HERO: Pose = { shL: -38, elL: 70, shR: 38, elR: -70, hipL: -14, knL: 0, hipR: 14, knR: 0, tilt: -3 };

export const runPose = (t: number): Pose => {
  const s = Math.sin(t), c = Math.cos(t);
  return {
    shL: -10 - s * 55, elL: -60, shR: 10 + s * 55, elR: 60,
    hipL: s * 40, knL: -Math.max(0, -c) * 70 - 10, hipR: -s * 40, knR: -Math.max(0, c) * 70 - 10,
    lean: 10, bob: -Math.abs(c) * 10,
  };
};
export const walkPose = (t: number): Pose => {
  const s = Math.sin(t);
  return {
    shL: -10 - s * 22, elL: -10, shR: 10 + s * 22, elR: 10,
    hipL: s * 20, knL: -Math.max(0, -Math.cos(t)) * 25, hipR: -s * 20, knR: -Math.max(0, Math.cos(t)) * 25,
    bob: -Math.abs(Math.cos(t)) * 4,
  };
};

export type EyeMode = 'open' | 'happy' | 'squeeze' | 'closed';
export type Mouth = 'smile' | 'grin' | 'smirk' | 'o' | 'scream' | 'flat' | 'frown' | 'wobble';
export type Expr = {
  eyes: EyeMode; lid: number; lidAngle: number; lidLow?: number;
  pupil?: number; eyeScale?: number; mouth: Mouth; sweat?: boolean; bags?: boolean; tear?: boolean;
};
export const EXPR = {
  happy: { eyes: 'open', lid: 0.08, lidAngle: -6, lidLow: 0.18, mouth: 'grin' },
  smug: { eyes: 'open', lid: 0.5, lidAngle: 12, mouth: 'smirk' },
  shocked: { eyes: 'open', lid: 0, lidAngle: 0, pupil: 0.55, eyeScale: 1.18, mouth: 'o' },
  panic: { eyes: 'open', lid: 0, lidAngle: -14, pupil: 0.4, eyeScale: 1.15, mouth: 'scream', sweat: true },
  sad: { eyes: 'open', lid: 0.32, lidAngle: -22, mouth: 'frown', tear: true },
  tired: { eyes: 'open', lid: 0.58, lidAngle: -4, mouth: 'flat', bags: true },
  blank: { eyes: 'open', lid: 0.05, lidAngle: 0, pupil: 0.35, mouth: 'flat' },
  wince: { eyes: 'squeeze', lid: 0, lidAngle: 0, mouth: 'wobble', sweat: true },
  laugh: { eyes: 'happy', lid: 0, lidAngle: 0, mouth: 'grin' },
  hollow: { eyes: 'open', lid: 0.42, lidAngle: -8, pupil: 0.3, mouth: 'flat', bags: true },
  determined: { eyes: 'open', lid: 0.36, lidAngle: 18, mouth: 'smile' },
} satisfies Record<string, Expr>;
export type ExprName = keyof typeof EXPR;

const rad = (d: number) => (d * Math.PI) / 180;
const limb = (x: number, y: number, a1: number, a2: number, l1: number, l2: number) => {
  const kx = x + Math.sin(rad(a1)) * l1, ky = y + Math.cos(rad(a1)) * l1;
  const fx = kx + Math.sin(rad(a1 + a2)) * l2, fy = ky + Math.cos(rad(a1 + a2)) * l2;
  return { kx, ky, fx, fy, d: `M${x} ${y} L${kx} ${ky} L${fx} ${fy}` };
};

const Stroke: React.FC<{ d: string; w: number; color: string }> = ({ d, w, color }) => (
  <>
    <path d={d} fill="none" stroke={INK} strokeWidth={w + 12} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const Eye: React.FC<{ cx: number; side: -1 | 1; e: Expr; look: [number, number]; blink: number; id: string }> = ({ cx, side, e, look, blink, id }) => {
  const cy = -312, s = e.eyeScale ?? 1, rx = 27 * s, ry = 33 * s;
  if (e.eyes === 'happy' || blink > 0.92) {
    const d = blink > 0.92 && e.eyes !== 'happy' ? `M${cx - rx} ${cy + 4} L${cx + rx} ${cy + 4}` : `M${cx - rx} ${cy + 8} Q${cx} ${cy - 30} ${cx + rx} ${cy + 8}`;
    return <path d={d} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" />;
  }
  if (e.eyes === 'squeeze') {
    const k = side; // > <
    return <path d={`M${cx - 20 * k} ${cy - 18} L${cx + 16 * k} ${cy} L${cx - 20 * k} ${cy + 18}`} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (e.eyes === 'closed') return <path d={`M${cx - rx} ${cy + 4} L${cx + rx} ${cy + 4}`} stroke="#fff" strokeWidth={9} strokeLinecap="round" />;
  const lid = Math.max(e.lid, blink);
  const pr = 12 * s * (e.pupil ?? 1) + (e.pupil && e.pupil < 0.6 ? 2 : 0);
  const clip = `${id}${side < 0 ? 'l' : 'r'}`;
  return (
    <g>
      <clipPath id={clip}><ellipse cx={cx} cy={cy} rx={rx + 3} ry={ry + 3} /></clipPath>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
      <circle cx={cx + look[0] * rx * 0.42} cy={cy + look[1] * ry * 0.4 + 3} r={Math.max(4, pr)} fill={INK} />
      <circle cx={cx + look[0] * rx * 0.42 - pr * 0.35} cy={cy + look[1] * ry * 0.4 - pr * 0.3} r={Math.max(1.5, pr * 0.3)} fill="#fff" />
      <g clipPath={`url(#${clip})`}>
        <rect x={cx - rx - 10} y={cy - ry - 30} width={rx * 2 + 20} height={30 + ry * 2 * lid + 2} fill={INK}
          transform={`rotate(${e.lidAngle * -side} ${cx} ${cy})`} />
        {e.lidLow ? <rect x={cx - rx - 10} y={cy + ry - ry * 2 * e.lidLow} width={rx * 2 + 20} height={ry} fill={INK} /> : null}
      </g>
      {e.bags && <path d={`M${cx - rx * 0.8} ${cy + ry + 8} Q${cx} ${cy + ry + 18} ${cx + rx * 0.8} ${cy + ry + 8}`} fill="none" stroke="#6B5A8E" strokeWidth={5} strokeLinecap="round" />}
    </g>
  );
};

const MouthShape: React.FC<{ m: Mouth; x: number }> = ({ m, x }) => {
  const y = -254;
  const st = { fill: 'none', stroke: '#fff', strokeWidth: 8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (m) {
    case 'smile': return <path d={`M${x - 24} ${y - 4} Q${x} ${y + 18} ${x + 24} ${y - 4}`} {...st} />;
    case 'grin': return <path d={`M${x - 32} ${y - 8} Q${x} ${y - 2} ${x + 32} ${y - 8} Q${x + 26} ${y + 30} ${x} ${y + 30} Q${x - 26} ${y + 30} ${x - 32} ${y - 8} Z`} fill="#fff" />;
    case 'smirk': return <path d={`M${x - 20} ${y + 4} Q${x + 4} ${y + 10} ${x + 28} ${y - 10}`} {...st} />;
    case 'o': return <ellipse cx={x} cy={y + 4} rx={12} ry={15} fill="#6E1218" stroke="#fff" strokeWidth={6} />;
    case 'scream': return (<g><ellipse cx={x} cy={y + 8} rx={24} ry={28} fill="#6E1218" stroke="#fff" strokeWidth={6} /><ellipse cx={x} cy={y + 24} rx={13} ry={7} fill="#E05A6A" /></g>);
    case 'flat': return <path d={`M${x - 16} ${y + 2} L${x + 16} ${y + 2}`} {...st} />;
    case 'frown': return <path d={`M${x - 22} ${y + 10} Q${x} ${y - 8} ${x + 22} ${y + 10}`} {...st} />;
    case 'wobble': return <path d={`M${x - 24} ${y + 4} l8 -6 l8 6 l8 -6 l8 6 l8 -6`} {...st} strokeWidth={6} />;
  }
};

export type MaxProps = {
  pose?: Pose; expr?: ExprName | Expr; look?: [number, number]; blink?: number;
  face?: number; outfit?: Look; prop?: 'book' | 'keys' | null; headOnly?: boolean;
  /** invisible Max: 'clothes' = no head or hands, 'eyes' = floating eyeballs only, 'skeleton' = skull and bone hands */
  ghost?: 'clothes' | 'eyes' | 'skeleton';
  /** turn off the idle breathing / sway / auto-blink (model sheet) */
  still?: boolean;
};

/** Render inside an <svg>; place with a parent <g transform>. */
export const Max: React.FC<MaxProps> = ({ expr = 'happy', look = [0, 0], blink = 0, face = 0, outfit = MAX, prop = null, headOnly = false, ghost, still = false, pose: pose0 = STAND }) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  // idle life: breathing bob, arm sway, head tilt and an auto-blink every ~3 s (phase varies per instance)
  const fr = useCurrentFrame();
  const ph = (id.charCodeAt(id.length - 1) % 7) * 13;
  const t = fr + ph;
  const pose: Pose = still ? pose0 : {
    ...pose0,
    tilt: (pose0.tilt ?? 0) + Math.sin(t / 22) * 2.2,
    shL: pose0.shL + Math.sin(t / 17) * 3.5, shR: pose0.shR - Math.sin(t / 19) * 3.5,
    bob: (pose0.bob ?? 0) + Math.sin(t / 13) * 3,
  };
  if (!still && t % 95 < 4) blink = Math.max(blink, 1);
  const e: Expr = typeof expr === 'string' ? EXPR[expr] : expr;
  const fx = face * 16;
  const head = (
    <g transform={`rotate(${pose.tilt ?? 0} 0 -230)`}>
      {!ghost && outfit.hair === 'bun' && <circle cx={0} cy={-398} r={34} fill={outfit.hairColor} stroke={INK} strokeWidth={6} />}
      {!ghost && <circle cx={0} cy={-300} r={94} fill={outfit.skin} stroke={INK} strokeWidth={6} />}
      {!ghost && <path d="M-58 -362 A80 80 0 0 1 10 -386" fill="none" stroke="#3A3A48" strokeWidth={9} strokeLinecap="round" />}
      {ghost === 'skeleton' && <g>
        <circle cx={0} cy={-300} r={94} fill={BONE} stroke={INK} strokeWidth={6} />
        <path d="M-10 -268 L10 -268 L0 -286 Z" fill={INK} />
        <rect x={-46} y={-240} width={92} height={30} rx={8} fill={BONE} stroke={INK} strokeWidth={5} />
        {[-24, 0, 24].map((x) => <line key={x} x1={x} y1={-240} x2={x} y2={-210} stroke={INK} strokeWidth={4} />)}
        <circle cx={-34} cy={-312} r={40} fill={INK} /><circle cx={34} cy={-312} r={40} fill={INK} />
      </g>}
      {ghost === 'eyes' && <g><ellipse cx={-34 + fx} cy={-312} rx={31} ry={37} fill={INK} /><ellipse cx={34 + fx} cy={-312} rx={31} ry={37} fill={INK} /></g>}
      {outfit.hair === 'bun' && <path d="M-92 -300 Q-88 -392 0 -394 Q88 -392 92 -300 Q70 -350 0 -356 Q-70 -350 -92 -300 Z" fill={outfit.hairColor} stroke={INK} strokeWidth={5} />}
      {ghost !== 'clothes' && <Eye cx={-34 + fx} side={-1} e={e} look={look} blink={blink} id={id} />}
      {ghost !== 'clothes' && <Eye cx={34 + fx} side={1} e={e} look={look} blink={blink} id={id} />}
      {!ghost && outfit.glasses && <g fill="none" stroke="#D7DCE6" strokeWidth={6}><circle cx={-34 + fx} cy={-312} r={38} /><circle cx={34 + fx} cy={-312} r={38} /><path d={`M${-0 + fx - 4} -314 L${fx + 4} -314`} /></g>}
      {!ghost && <MouthShape m={e.mouth} x={fx * 1.2} />}
      {!ghost && e.sweat && <path d="M78 -352 q10 18 0 26 q-10 -8 0 -26 Z" fill="#7FD4FF" stroke={INK} strokeWidth={4} />}
      {!ghost && e.tear && <path d="M-44 -272 q8 16 0 22 q-8 -6 0 -22 Z" fill="#7FD4FF" stroke={INK} strokeWidth={3} />}
    </g>
  );
  if (headOnly) return head;

  const hipY = -106, shY = -196;
  const lL = limb(-24, hipY, pose.hipL, pose.knL, 58, 54);
  const lR = limb(24, hipY, pose.hipR, pose.knR, 58, 54);
  const aL = limb(-54, shY, pose.shL, pose.elL, 68, 62);
  const aR = limb(54, shY, pose.shR, pose.elR, 68, 62);
  const shoe = (x: number, y: number, a: number) => (
    <g transform={`translate(${x} ${y}) rotate(${-a * 0.3})`}>
      <ellipse cx={8} cy={4} rx={30} ry={15} fill={outfit.shoes} stroke={INK} strokeWidth={6} />
      <path d="M-20 12 L36 12" stroke={outfit.sole} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
  const hand = (x: number, y: number) => ghost === 'clothes' || ghost === 'eyes' ? null : <circle cx={x} cy={y} r={15} fill={ghost === 'skeleton' ? BONE : outfit.skin} stroke={INK} strokeWidth={5} />;

  return (
    <g transform={`translate(0 ${pose.bob ?? 0}) rotate(${pose.lean ?? 0} 0 -100)`}>
      {/* back arm */}
      <Stroke d={aL.d} w={30} color={outfit.jacket} />
      {hand(aL.fx, aL.fy)}
      {/* legs */}
      <Stroke d={lL.d} w={34} color={outfit.pants} />
      <Stroke d={lR.d} w={34} color={outfit.pants} />
      {shoe(lL.fx, lL.fy + 4, pose.hipL + pose.knL)}
      {shoe(lR.fx, lR.fy + 4, pose.hipR + pose.knR)}
      {/* jacket */}
      <path d="M-62 -204 Q-68 -150 -54 -98 L54 -98 Q68 -150 62 -204 Q0 -226 -62 -204 Z" fill={outfit.jacket} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M0 -214 L0 -100" stroke={outfit.jacketDark} strokeWidth={5} />
      <rect x={-5} y={-176} width={10} height={16} rx={3} fill={outfit.jacketDark} />
      <path d="M-30 -212 L0 -190 L30 -212" fill="none" stroke={outfit.jacketDark} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-46 -130 L-20 -130 M20 -130 L46 -130" stroke={outfit.jacketDark} strokeWidth={5} strokeLinecap="round" />
      {head}
      {prop === 'book' && (
        <g transform="translate(0 -150) rotate(-4)">
          <rect x={-54} y={-34} width={108} height={70} rx={6} fill="#D9473B" stroke={INK} strokeWidth={6} />
          <path d="M0 -34 L0 36" stroke={INK} strokeWidth={4} />
          <path d="M-40 -18 L-12 -18 M-40 -4 L-12 -4 M12 -18 L40 -18" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
        </g>
      )}
      {/* front arm */}
      <Stroke d={aR.d} w={30} color={outfit.jacket} />
      {hand(aR.fx, aR.fy)}
      {prop === 'keys' && (
        <g transform={`translate(${aR.fx + 6} ${aR.fy + 14})`}>
          <circle r={10} fill="none" stroke="#C9A227" strokeWidth={5} />
          <path d="M4 8 L12 34 M8 22 L16 20 M10 28 L18 26" stroke="#C9A227" strokeWidth={5} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

/** Sir Biscuit, Dave's dog. Origin at the feet. */
export const Dog: React.FC<{ wag?: number; expr?: 'happy' | 'offended' | 'cool'; hat?: boolean }> = ({ wag = 0, expr = 'happy', hat = false }) => (
  <g>
    <path d={`M62 -72 Q${92 + wag * 10} ${-110 - Math.abs(wag) * 6} ${84 + wag * 18} -128`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
    <path d={`M62 -72 Q${92 + wag * 10} ${-110 - Math.abs(wag) * 6} ${84 + wag * 18} -128`} fill="none" stroke="#E2A15B" strokeWidth={12} strokeLinecap="round" />
    {[-44, -14, 26, 52].map((x) => <rect key={x} x={x - 9} y={-46} width={18} height={46} rx={8} fill="#E2A15B" stroke={INK} strokeWidth={5} />)}
    <ellipse cx={4} cy={-70} rx={72} ry={38} fill="#E2A15B" stroke={INK} strokeWidth={6} />
    <ellipse cx={14} cy={-62} rx={30} ry={16} fill="#F6D6A8" />
    <circle cx={-62} cy={-118} r={44} fill="#E2A15B" stroke={INK} strokeWidth={6} />
    <path d="M-100 -142 Q-118 -100 -96 -88 Q-90 -116 -84 -138 Z" fill="#8A5A2E" stroke={INK} strokeWidth={5} />
    <path d="M-26 -150 Q-6 -112 -28 -96 Q-36 -122 -40 -146 Z" fill="#8A5A2E" stroke={INK} strokeWidth={5} />
    <ellipse cx={-86} cy={-104} rx={22} ry={16} fill="#F6D6A8" stroke={INK} strokeWidth={4} />
    <ellipse cx={-98} cy={-110} rx={9} ry={7} fill={INK} />
    {expr === 'cool' ? (
      <path d="M-92 -134 L-28 -134 L-34 -118 L-56 -116 L-60 -126 L-66 -116 L-86 -116 Z" fill={INK} />
    ) : (
      <g>
        <circle cx={-74} cy={-128} r={7} fill={INK} />
        <circle cx={-46} cy={-128} r={7} fill={INK} />
        {expr === 'offended' && <path d="M-84 -144 L-64 -138 M-36 -144 L-56 -138" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
      </g>
    )}
    <path d={expr === 'offended' ? 'M-92 -86 Q-82 -92 -72 -86' : 'M-94 -92 Q-82 -80 -70 -92'} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
    {hat && (
      <g transform="translate(-60 -158) rotate(-14)">
        <path d="M-20 4 L0 -44 L20 4 Z" fill="#3DBE7A" stroke={INK} strokeWidth={5} />
        <circle cx={0} cy={-46} r={7} fill="#FFC72C" stroke={INK} strokeWidth={4} />
      </g>
    )}
  </g>
);
