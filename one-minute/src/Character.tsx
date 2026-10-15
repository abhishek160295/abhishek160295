import React from "react";
import { useT } from "./lib";

export type Pose = "stand" | "walk" | "run" | "sit" | "counter" | "hold" | "wave" | "reach" | "hug" | "curl" | "armsUp" | "phone" | "write" | "cheer";
export type Expr =
  | "neutral"
  | "sad"
  | "tired"
  | "happy"
  | "smile"
  | "determined"
  | "closed"
  | "worried"
  | "back";

type Props = {
  x: number;
  y: number;
  s?: number;
  pose?: Pose;
  expr?: Expr;
  dir?: 1 | -1;
  keeper?: boolean;
  raincoat?: boolean;
  rim?: string;
  rimSide?: 1 | -1;
  speed?: number;
  look?: number;
  t0?: number;
  blur?: number;
  headDrop?: number;
  watch?: boolean;
  buff?: boolean;
  outfit?: "suit" | "cap" | "tank";
  item?: "dumbbell" | "phone" | "pen" | "note" | "cup";
  shake?: number;
  kid?: boolean;
  breath?: number;
};

const rad = (d: number) => (d * Math.PI) / 180;

const limb = (sx: number, sy: number, a1: number, a2: number, l1: number, l2: number) => {
  const kx = sx + l1 * Math.sin(rad(a1));
  const ky = sy + l1 * Math.cos(rad(a1));
  const fx = kx + l2 * Math.sin(rad(a1 + a2));
  const fy = ky + l2 * Math.cos(rad(a1 + a2));
  return { d: `M${sx},${sy} L${kx},${ky} L${fx},${fy}`, fx, fy };
};

export const Character: React.FC<Props> = ({
  x,
  y,
  s = 1,
  pose = "stand",
  expr = "neutral",
  dir = 1,
  keeper = false,
  raincoat = false,
  rim = "#ffffff",
  rimSide = -1,
  speed = 1,
  look = 0,
  t0 = 0,
  blur = 0,
  headDrop = 0,
  watch = false,
  buff = false,
  outfit,
  item,
  shake = 0,
  kid = false,
  breath = 1,
}) => {
  const t = useT() + t0;
  const body = raincoat ? "#e8b82a" : "#0d0f13";
  const limbC = "#0d0f13";

  // Gait phase
  const cadence = pose === "run" ? 9.5 * speed : 5.2 * speed;
  const p = t * cadence;
  const amp = pose === "run" ? 1 : 0.55;

  let hipY = -160;
  let bob = 0;
  let lean = 0;
  let L1 = { a: 4, b: 0 },
    L2 = { a: -4, b: 0 },
    A1 = { a: 10, b: -8 },
    A2 = { a: -10, b: 8 };

  const breathe = Math.sin(t * (breath > 1 ? 1.1 : 2.2)) * 2 * breath;

  if (pose === "walk" || pose === "run") {
    const sw = Math.sin(p);
    const sw2 = Math.sin(p + Math.PI);
    L1 = { a: 34 * amp * sw, b: -(10 + 55 * amp * Math.max(0, -Math.cos(p))) };
    L2 = { a: 34 * amp * sw2, b: -(10 + 55 * amp * Math.max(0, -Math.cos(p + Math.PI))) };
    A1 = { a: -38 * amp * sw, b: pose === "run" ? 75 : 25 };
    A2 = { a: -38 * amp * sw2, b: pose === "run" ? 75 : 25 };
    bob = -Math.abs(Math.cos(p)) * (pose === "run" ? 14 : 5);
    lean = pose === "run" ? 7 : 2;
  } else if (pose === "sit") {
    hipY = -48;
    L1 = { a: 118, b: -104 };
    L2 = { a: 112, b: -100 };
    A1 = { a: 70, b: 30 };
    A2 = { a: 64, b: 34 };
    lean = 14;
  } else if (pose === "counter") {
    A1 = { a: 38 + breathe, b: 20 };
    A2 = { a: -38 - breathe, b: -20 };
  } else if (pose === "hold") {
    A1 = { a: 55, b: 40 };
    A2 = { a: -55, b: -40 };
  } else if (pose === "wave") {
    A1 = { a: 160 + Math.sin(t * 9) * 12, b: 10 };
  } else if (pose === "reach") {
    A1 = { a: 95, b: 0 };
  } else if (pose === "hug") {
    A1 = { a: 30, b: 70 };
    A2 = { a: -30, b: -70 };
  } else if (pose === "curl") {
    const k = 0.5 + 0.5 * Math.sin(t * 2.4);
    A2 = { a: -14, b: -(40 + 95 * k) };
  } else if (pose === "armsUp") {
    A1 = { a: 165 + Math.sin(t * 2) * 6, b: 8 };
    A2 = { a: -165 - Math.sin(t * 2) * 6, b: -8 };
  } else if (pose === "phone") {
    A2 = { a: -30, b: -110 };
    A1 = { a: 25, b: 90 };
  } else if (pose === "write") {
    A2 = { a: -70 + Math.sin(t * 14) * 4, b: -30 };
  } else if (pose === "cheer") {
    A1 = { a: 150 + Math.sin(t * 7) * 10, b: 20 };
    A2 = { a: -150 - Math.sin(t * 7 + 1) * 10, b: -20 };
  } else {
    A1 = { a: 8 + breathe * 0.6, b: -6 };
    A2 = { a: -8 - breathe * 0.6, b: 6 };
  }

  const neckY = hipY - 135 + bob + breathe * 0.4;
  const headY = neckY - 62 + headDrop;
  const shY = neckY + 18;

  const legs = [
    limb(-12, hipY + bob, L1.a, L1.b, 82, 82),
    limb(12, hipY + bob, L2.a, L2.b, 82, 82),
  ];
  const arms = [
    limb(-24, shY, A1.a, A1.b, 68, 64),
    limb(24, shY, A2.a, A2.b, 68, 64),
  ];

  const blinkCycle = (t + x * 0.001) % 3.9;
  const blink = blinkCycle < 0.12 && expr !== "closed" && expr !== "happy";

  const ex = look * 14 + (pose === "run" || pose === "walk" ? 12 : 0);
  const eyes = () => {
    if (expr === "back") return null;
    if (expr === "closed" || blink)
      return (
        <g stroke="#e9edf2" strokeWidth={4} strokeLinecap="round" fill="none">
          <path d={`M${ex - 30},${headY + 4} q8,6 16,0`} />
          <path d={`M${ex + 14},${headY + 4} q8,6 16,0`} />
        </g>
      );
    if (expr === "happy")
      return (
        <g stroke="#f3f5f7" strokeWidth={5} strokeLinecap="round" fill="none">
          <path d={`M${ex - 30},${headY + 6} q8,-12 16,0`} />
          <path d={`M${ex + 14},${headY + 6} q8,-12 16,0`} />
        </g>
      );
    const lid = expr === "tired" ? 7 : 0;
    const brow =
      expr === "sad" || expr === "worried"
        ? { l: `M${ex - 36},${headY - 14} L${ex - 14},${headY - 22}`, r: `M${ex + 14},${headY - 22} L${ex + 36},${headY - 14}` }
        : expr === "determined"
          ? { l: `M${ex - 36},${headY - 19} L${ex - 14},${headY - 15}`, r: `M${ex + 14},${headY - 15} L${ex + 36},${headY - 19}` }
          : expr === "tired"
            ? { l: `M${ex - 36},${headY - 16} L${ex - 14},${headY - 16}`, r: `M${ex + 14},${headY - 16} L${ex + 36},${headY - 16}` }
            : null;
    return (
      <g>
        <ellipse cx={ex - 22} cy={headY + 2} rx={8} ry={11 - lid / 2} fill="#f4f6f8" />
        <ellipse cx={ex + 22} cy={headY + 2} rx={8} ry={11 - lid / 2} fill="#f4f6f8" />
        <circle cx={ex - 20 + look * 2} cy={headY + 4} r={3.2} fill="#0d0f13" />
        <circle cx={ex + 24 + look * 2} cy={headY + 4} r={3.2} fill="#0d0f13" />
        {lid > 0 && (
          <>
            <rect x={ex - 32} y={headY - 12} width={20} height={lid + 6} fill="#0d0f13" />
            <rect x={ex + 12} y={headY - 12} width={20} height={lid + 6} fill="#0d0f13" />
          </>
        )}
        {brow && (
          <g stroke="#cfd5dc" strokeWidth={4} strokeLinecap="round">
            <path d={brow.l} />
            <path d={brow.r} />
          </g>
        )}
        {(expr === "smile" || expr === "determined") && (
          <path
            d={`M${ex - 12},${headY + 26} q12,${expr === "smile" ? 10 : 4} 24,0`}
            stroke="#cfd5dc"
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </g>
    );
  };

  const figure = (fill: string, lc: string, isRim: boolean) => (
    <g>
      {keeper && (
        <path
          d={`M18,${headY - 30} q60,-10 70,40 q4,40 -20,70 q10,-50 -30,-80 z`}
          fill={isRim ? fill : "#0d0f13"}
        />
      )}
      {raincoat && <circle cx={0} cy={headY + 2} r={76} fill={isRim ? fill : "#e8b82a"} />}
      {legs.map((l, i) => (
        <path key={`l${i}`} d={l.d} stroke={lc} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
      {legs.map((l, i) =>
        !isRim && (pose === "run" || pose === "walk" || pose === "sit") ? (
          <ellipse key={`s${i}`} cx={l.fx + 8} cy={l.fy + 4} rx={22} ry={9} fill="#dfe6ee" opacity={0.92} />
        ) : null,
      )}
      <rect x={buff ? -54 : -36} y={neckY} width={buff ? 108 : 72} height={hipY - neckY + 22 + bob} rx={buff ? 40 : 30} fill={isRim ? fill : body} />
      {!isRim && outfit === "suit" && (
        <g>
          <path d={`M-16,${neckY + 2} L0,${neckY + 46} L16,${neckY + 2} Z`} fill="#f2f2f0" />
          <path d={`M-5,${neckY + 10} L5,${neckY + 10} L8,${neckY + 70} L0,${neckY + 82} L-8,${neckY + 70} Z`} fill="#a8323a" />
        </g>
      )}
      {!isRim && outfit === "tank" && <rect x={-30} y={neckY + 10} width={60} height={70} rx={16} fill="#2b3a55" opacity={0.9} />}
      {arms.map((a, i) => (
        <path
          key={`a${i}`}
          d={a.d}
          stroke={isRim ? lc : raincoat ? "#e8b82a" : lc}
          strokeWidth={buff ? 34 : 22}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
      {watch && !isRim && <circle cx={arms[1].fx} cy={arms[1].fy - 6} r={9} fill="#7fd1ff" opacity={0.9} />}
      <circle cx={0} cy={headY} r={62} fill={isRim ? fill : raincoat ? "#16120a" : "#0d0f13"} />
      {keeper && !isRim && (
        <g>
          <path d={`M-60,${headY - 22} Q0,${headY - 40} 60,${headY - 22} L60,${headY - 6} Q0,${headY - 24} -60,${headY - 6} Z`} fill="#eef0f2" />
          <path d={`M58,${headY - 16} l22,10 l-4,10 z`} fill="#eef0f2" />
        </g>
      )}
      {!isRim && kid && (
        <path d={`M-20,${headY - 58} q10,-30 22,-6 q8,-26 22,2`} stroke="#0d0f13" strokeWidth={10} fill="none" strokeLinecap="round" />
      )}
      {!isRim && outfit === "cap" && (
        <g>
          <path d={`M-62,${headY - 8} Q-60,${headY - 70} 0,${headY - 70} Q60,${headY - 70} 62,${headY - 8} Z`} fill="#c0392b" />
          <path d={`M30,${headY - 14} L112,${headY - 6} L112,${headY + 2} L30,${headY - 2} Z`} fill="#a93226" />
        </g>
      )}
      {!isRim && item === "dumbbell" && (
        <g transform={`translate(${arms[1].fx},${arms[1].fy})`}>
          <rect x={-26} y={-5} width={52} height={10} rx={4} fill="#4a4f57" />
          <rect x={-34} y={-14} width={12} height={28} rx={3} fill="#2d3138" />
          <rect x={22} y={-14} width={12} height={28} rx={3} fill="#2d3138" />
        </g>
      )}
      {!isRim && item === "phone" && (
        <g transform={`translate(${arms[1].fx},${arms[1].fy - 10})`}>
          <rect x={-16} y={-28} width={32} height={56} rx={6} fill="#0b0d12" stroke="#7fa6ff" strokeWidth={2} />
          <rect x={-12} y={-24} width={24} height={48} rx={3} fill="#9fc0ff" opacity={0.85} />
        </g>
      )}
      {!isRim && item === "cup" && (
        <rect x={arms[0].fx - 14} y={arms[0].fy - 34} width={28} height={36} rx={4} fill="#d9534f" />
      )}
      {!isRim && item === "note" && (
        <rect x={arms[1].fx - 26} y={arms[1].fy - 50} width={52} height={52} fill="#ffd84d" transform={`rotate(-8 ${arms[1].fx} ${arms[1].fy})`} />
      )}
      {!isRim && eyes()}
    </g>
  );

  return (
    <g
      transform={`translate(${x + (shake ? Math.sin(t * 61) * shake : 0)},${y + (shake ? Math.cos(t * 53) * shake * 0.5 : 0)}) scale(${s * dir},${s}) rotate(${lean})`}
      filter={blur ? `url(#cb${Math.round(x)}${Math.round(y)})` : undefined}
    >
      {blur > 0 && (
        <defs>
          <filter id={`cb${Math.round(x)}${Math.round(y)}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>
      )}
      <ellipse cx={0} cy={6} rx={pose === "sit" ? 120 : 70} ry={12} fill="#000" opacity={0.28} />
      <g transform={`translate(${rimSide * 4},-3)`} opacity={0.85}>
        {figure(rim, rim, true)}
      </g>
      {figure(body, limbC, false)}
    </g>
  );
};

/** A dark arm entering frame, ending in a simple hand. */
export const Arm: React.FC<{
  from: [number, number];
  to: [number, number];
  w?: number;
  kind?: "point" | "open" | "grip";
  rot?: number;
}> = ({ from, to, w = 70, kind = "open", rot }) => {
  const ang = rot ?? (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke="#0d0f13" strokeWidth={w} strokeLinecap="round" />
      <g transform={`translate(${to[0]},${to[1]}) rotate(${ang})`}>
        <ellipse cx={w * 0.5} cy={0} rx={w * 0.62} ry={w * 0.55} fill="#0d0f13" />
        {kind === "point" && <rect x={w * 0.6} y={-w * 0.14} width={w * 1.2} height={w * 0.3} rx={w * 0.15} fill="#0d0f13" />}
        {kind === "open" &&
          [-0.42, -0.14, 0.14, 0.42].map((o, i) => (
            <rect key={i} x={w * 0.7} y={w * o - w * 0.11} width={w * (i === 0 || i === 3 ? 0.75 : 0.95)} height={w * 0.22} rx={w * 0.11} fill="#0d0f13" />
          ))}
        {kind === "grip" && <ellipse cx={w * 0.95} cy={0} rx={w * 0.4} ry={w * 0.5} fill="#0d0f13" />}
      </g>
    </g>
  );
};
