import React from "react";
import { Glow, H, HAND, W, lerp, rand, useT } from "../lib";
import { Arm } from "../Character";

const SANS = "Inter, Helvetica, Arial";

/* ───────── Sticky notes ───────── */

export type NoteLine = { text: string; at: number; strike?: number; size?: number; color?: string };

export const Sticky: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  lines: NoteLine[];
  color?: string;
  peel?: number;
  stamp?: string;
}> = ({ x, y, s = 1, rot = -2, lines, color = "#ffd84d", peel = 0, stamp }) => {
  const t = useT();
  return (
    <g transform={`translate(${x},${y}) rotate(${rot + peel * 30}) scale(${s})`}>
      <rect x={10} y={16} width={400} height={400} fill="#000" opacity={0.22} />
      <rect width={400} height={400} fill={color} />
      <rect width={400} height={60} fill="#000" opacity={0.05} />
      <path d="M400,330 L400,400 L330,400 Z" fill="#000" opacity={0.08} />
      {stamp && (
        <text x={380} y={40} textAnchor="end" fontFamily={HAND} fontSize={30} fill="#7a6420" opacity={0.8}>
          {stamp}
        </text>
      )}
      {lines.map((l, i) => {
        const n = Math.max(0, Math.floor((t - l.at) * 22));
        const vis = l.text.slice(0, n);
        const size = l.size ?? 64;
        const ly = 130 + i * (size * 1.25);
        const k = l.strike !== undefined ? lerp(t, l.strike, l.strike + 0.35, 0, 1) : 0;
        const w = l.text.length * size * 0.42;
        return (
          <g key={i}>
            <text x={34} y={ly} fontFamily={HAND} fontSize={size} fill={l.color ?? "#1f2a44"}>
              {vis}
            </text>
            {k > 0 && (
              <path
                d={`M28,${ly - size * 0.3} q${w / 2},${-8} ${w + 14},4`}
                stroke="#d62f35"
                strokeWidth={8}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={w + 40}
                strokeDashoffset={(w + 40) * (1 - k)}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

export const NoteWall: React.FC<{ children?: React.ReactNode; warm?: boolean; night?: boolean }> = ({ children, warm, night }) => (
  <>
    <defs>
      <radialGradient id="nwL" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor={night ? "#3a4256" : warm ? "#efe2c9" : "#dcdfe4"} />
        <stop offset="1" stopColor={night ? "#141822" : warm ? "#a99677" : "#8b919a"} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#nwL)" />
    {Array.from({ length: 30 }).map((_, i) => (
      <circle key={i} cx={rand(i) * W} cy={rand(i + 3) * H} r={1.5} fill="#000" opacity={0.06} />
    ))}
    {children}
  </>
);

/* ───────── Fireworks ───────── */

export const Fireworks: React.FC<{ bursts: [number, number, number, string][]; clip?: string }> = ({ bursts, clip }) => {
  const t = useT();
  return (
    <g clipPath={clip ? `url(#${clip})` : undefined}>
      {bursts.map(([bx, by, t0, c], bi) => {
        const dt = t - t0;
        if (dt < -0.6 || dt > 2.4) return null;
        if (dt < 0) {
          const k = (dt + 0.6) / 0.6;
          return <circle key={bi} cx={bx} cy={by + (1 - k) * 260} r={3} fill="#fff3cf" />;
        }
        const o = Math.max(0, 1 - dt / 2.2);
        return (
          <g key={bi}>
            <Glow cx={bx} cy={by} r={170 * Math.min(1, dt * 3)} color={c} o={0.45 * o} id={`fwg${bi}`} />
            {Array.from({ length: 36 }).map((_, i) => {
              const a = (i / 36) * Math.PI * 2 + rand(bi + i) * 0.1;
              const sp = 150 + rand(i * 7 + bi) * 60;
              const r = sp * (1 - Math.exp(-dt * 2.6));
              const px = bx + Math.cos(a) * r;
              const py = by + Math.sin(a) * r + dt * dt * 30;
              return (
                <line
                  key={i}
                  x1={px}
                  y1={py}
                  x2={px - Math.cos(a) * 14}
                  y2={py - Math.sin(a) * 14 - 4}
                  stroke={c}
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  opacity={o * (0.6 + 0.4 * Math.sin(t * 30 + i))}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

/* ───────── Bedroom (side view) ───────── */

type RoomMode = "night" | "morning" | "late";

const Skyline: React.FC<{ mode: RoomMode }> = ({ mode }) => (
  <g>
    {Array.from({ length: 9 }).map((_, i) => {
      const x = 120 + i * 60;
      const h = 120 + rand(i + 2) * 200;
      return (
        <g key={i}>
          <rect x={x} y={560 - h} width={54} height={h} fill={mode === "morning" ? "#8aa0b8" : "#121a2c"} />
          {Array.from({ length: 6 }).map((_, j) => (
            <rect
              key={j}
              x={x + 8 + (j % 2) * 22}
              y={560 - h + 14 + Math.floor(j / 2) * 34}
              width={12}
              height={16}
              fill={mode === "morning" ? "#a9bdd2" : rand(i * 9 + j) > 0.5 ? "#ffcf7a" : "#1d2740"}
            />
          ))}
        </g>
      );
    })}
  </g>
);

export const Room: React.FC<{
  mode?: RoomMode;
  fireworks?: [number, number, number, string][];
  children?: React.ReactNode;
  front?: React.ReactNode;
  desk?: boolean;
}> = ({ mode = "night", fireworks, children, front, desk = true }) => {
  const sky =
    mode === "morning" ? ["#f6c27e", "#fbe3b8"] : mode === "late" ? ["#05070d", "#0d1220"] : ["#0a0f22", "#1b2342"];
  const wall = mode === "morning" ? ["#c9b9a2", "#a69479"] : ["#2a2f3d", "#1a1d26"];
  return (
    <>
      <defs>
        <linearGradient id={`rmSky${mode}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
        <linearGradient id={`rmWall${mode}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={wall[0]} />
          <stop offset="1" stopColor={wall[1]} />
        </linearGradient>
        <clipPath id="rmWin">
          <rect x={120} y={120} width={500} height={440} />
        </clipPath>
      </defs>
      <rect width={W} height={H} fill={`url(#rmWall${mode})`} />
      <rect x={120} y={120} width={500} height={440} fill={`url(#rmSky${mode})`} />
      {mode === "morning" && <Glow cx={470} cy={240} r={260} color="#fff2c8" o={0.9} id="rmSun" />}
      {fireworks && <Fireworks bursts={fireworks} clip="rmWin" />}
      <g clipPath="url(#rmWin)">
        <Skyline mode={mode} />
      </g>
      <g fill="none" stroke={mode === "morning" ? "#f4ede2" : "#3c4252"} strokeWidth={16}>
        <rect x={120} y={120} width={500} height={440} />
        <line x1={370} y1={120} x2={370} y2={560} />
      </g>
      {mode === "morning" && <path d="M120,560 L620,560 L900,1080 L300,1080 Z" fill="#fff1cc" opacity={0.18} />}
      {mode !== "morning" && fireworks && <path d="M120,560 L620,560 L900,1080 L300,1080 Z" fill="#9fb4ff" opacity={0.06} />}
      <rect x={0} y={900} width={W} height={180} fill={mode === "morning" ? "#7d6a54" : "#14161c"} />
      {/* poster + shelf */}
      <rect x={1640} y={180} width={170} height={230} fill={mode === "morning" ? "#e9dfcf" : "#2e3446"} />
      <path d="M1680,360 l40,-90 l40,60 l30,-30" stroke={mode === "morning" ? "#b98f5a" : "#4a5470"} strokeWidth={8} fill="none" />
      {children}
      {desk && (
        <g>
          <rect x={880} y={700} width={680} height={24} rx={4} fill={mode === "morning" ? "#8a6a4a" : "#3a2f2a"} />
          <rect x={900} y={724} width={30} height={176} fill={mode === "morning" ? "#6d533a" : "#2a2320"} />
          <rect x={1510} y={724} width={30} height={176} fill={mode === "morning" ? "#6d533a" : "#2a2320"} />
          <rect x={1380} y={560} width={12} height={140} fill="#1a1c22" transform="rotate(-18 1386 700)" />
          <path d="M1300,560 L1400,540 L1420,600 L1320,610 Z" fill="#1a1c22" />
          {mode !== "morning" && <Glow cx={1370} cy={640} r={420} color="#ffc979" o={0.55} id="rmLamp" />}
          <rect x={1060} y={688} width={90} height={12} fill="#e9e4d8" />
          <rect x={1170} y={676} width={50} height={24} rx={4} fill="#c9b07a" />
        </g>
      )}
      {front}
    </>
  );
};

/* ───────── Lying in bed, phone above face ───────── */

export const BedSide: React.FC<{
  face?: "bored" | "wince" | "sad" | "shock" | "sleep" | "awake";
  phone?: boolean;
  chips?: boolean;
  mode?: RoomMode;
  glow?: number;
  scrollHand?: boolean;
  noteOnPhone?: boolean;
  reach?: number;
}> = ({ face = "bored", phone = true, chips, mode = "late", glow = 1, scrollHand, noteOnPhone, reach }) => {
  const t = useT();
  const hx = 640,
    hy = 610;
  const thumb = scrollHand ? Math.sin(t * 5) * 8 : 0;
  const eyes = () => {
    if (face === "sleep")
      return <path d={`M${hx - 30},${hy} q8,6 16,0 M${hx + 10},${hy} q8,6 16,0`} stroke="#e9edf2" strokeWidth={4} fill="none" />;
    const ry = face === "shock" ? 14 : face === "bored" ? 6 : 10;
    return (
      <g>
        <ellipse cx={hx - 18} cy={hy - 4} rx={8} ry={ry} fill="#f4f6f8" />
        <ellipse cx={hx + 22} cy={hy - 4} rx={8} ry={ry} fill="#f4f6f8" />
        <circle cx={hx - 16} cy={hy - 8} r={3.4} fill="#0d0f13" />
        <circle cx={hx + 24} cy={hy - 8} r={3.4} fill="#0d0f13" />
        {face === "bored" && (
          <>
            <rect x={hx - 28} y={hy - 16} width={20} height={8} fill="#0d0f13" />
            <rect x={hx + 12} y={hy - 16} width={20} height={8} fill="#0d0f13" />
          </>
        )}
        {(face === "sad" || face === "wince") && (
          <path
            d={`M${hx - 34},${hy - 18} L${hx - 10},${hy - 26} M${hx + 14},${hy - 26} L${hx + 38},${hy - 18}`}
            stroke="#cfd5dc"
            strokeWidth={4}
            strokeLinecap="round"
          />
        )}
        {face === "wince" && <path d={`M${hx - 8},${hy + 26} l8,-5 l8,5 l8,-5`} stroke="#cfd5dc" strokeWidth={3} fill="none" />}
        {face === "shock" && <ellipse cx={hx + 2} cy={hy + 28} rx={9} ry={12} fill="#f0f2f5" opacity={0.85} />}
      </g>
    );
  };
  const px = 820,
    py = 380 + (reach ? 0 : Math.sin(t * 0.8) * 4);
  return (
    <>
      <Room mode={mode} desk={false} />
      {/* bed */}
      <rect x={200} y={700} width={1560} height={150} rx={30} fill={mode === "morning" ? "#cfd6e0" : "#2a3142"} />
      <rect x={200} y={830} width={1560} height={60} fill={mode === "morning" ? "#6c5a48" : "#191b22"} />
      <rect x={240} y={560} width={330} height={150} rx={60} fill={mode === "morning" ? "#f3f1ec" : "#4a5266"} />
      <circle cx={hx} cy={hy} r={62} fill="#0d0f13" />
      {eyes()}
      <path
        d={`M680,700 Q760,600 900,630 Q1200,600 1500,640 Q1640,660 1700,700 Z`}
        fill={mode === "morning" ? "#8fa6c7" : "#3b4a6e"}
      />
      <path d="M700,690 Q900,640 1200,650" stroke={mode === "morning" ? "#a9bcd8" : "#4b5b82"} strokeWidth={14} fill="none" />
      {chips && (
        <g transform="translate(960,600) rotate(-12)">
          <path d="M-60,-40 L60,-46 L66,40 L-56,46 Z" fill="#e8b33a" />
          <text x={0} y={8} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={26} fill="#b2241c">
            CRUNCH
          </text>
        </g>
      )}
      {phone && (
        <g>
          <line x1={760} y1={650} x2={px + 10} y2={py + 90} stroke="#0d0f13" strokeWidth={26} strokeLinecap="round" />
          <g transform={`translate(${px},${py}) rotate(160)`}>
            <rect x={-46} y={-86} width={92} height={172} rx={14} fill="#0b0d12" />
            <rect x={-40} y={-80} width={80} height={160} rx={10} fill="#a8c4ff" opacity={0.15 + 0.85 * glow} />
            {noteOnPhone && <rect x={-36} y={-40} width={72} height={72} fill="#ffd84d" transform="rotate(8)" />}
          </g>
          <circle cx={px + 30 + thumb} cy={py + 40} r={16} fill="#0d0f13" />
          <Glow cx={hx + 40} cy={hy - 40} r={380} color="#8fb0ff" o={0.38 * glow} id="bsGlow" />
        </g>
      )}
      {reach !== undefined && (
        <Arm from={[760, 700]} to={[lerp(reach, 0, 1, 900, 1560), lerp(reach, 0, 1, 690, 640)]} w={30} kind="open" />
      )}
    </>
  );
};

/* ───────── Phone held in hand ───────── */

export const PhoneHeld: React.FC<{ children: React.ReactNode; dim?: number; face?: number; tilt?: number; bg?: string }> = ({
  children,
  dim = 0,
  face = 0,
  tilt = -4,
  bg = "#0c0e14",
}) => {
  const t = useT();
  const sw = 540,
    sh = 1060;
  const flip = face;
  return (
    <>
      <rect width={W} height={H} fill={bg} />
      <Glow cx={960} cy={560} r={900} color="#6d8fe0" o={0.22 * (1 - flip)} id="phG" />
      <g transform={`translate(960,${600 + flip * 500}) rotate(${tilt + Math.sin(t * 0.7) * 0.6}) scale(${1 - flip * 0.2},${1 - flip * 0.9})`}>
        <rect x={-sw / 2 - 18} y={-sh / 2 - 18} width={sw + 36} height={sh + 36} rx={70} fill="#06070a" stroke="#2c303a" strokeWidth={4} />
        <clipPath id="scr">
          <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} rx={54} />
        </clipPath>
        <g clipPath="url(#scr)">
          <g transform={`translate(${-sw / 2},${-sh / 2})`}>{children}</g>
          <rect x={-sw / 2} y={-sh / 2} width={sw} height={sh} fill="#000" opacity={dim} />
          <path d={`M${-sw / 2},${-sh / 2} L${-sw / 2 + 200},${-sh / 2} L${-sw / 2 - 100},${sh / 2} Z`} fill="#fff" opacity={0.04} />
        </g>
        <rect x={-60} y={-sh / 2 + 14} width={120} height={30} rx={15} fill="#06070a" />
      </g>
      <path d="M1180,1100 Q1160,900 1260,840 Q1320,820 1330,880 L1300,1100 Z" fill="#0d0f13" />
      <path d="M650,1100 Q660,940 600,880 Q570,850 560,900 Q560,1000 600,1100 Z" fill="#0d0f13" />
    </>
  );
};

export const StatusBar: React.FC<{ time?: string; light?: boolean }> = ({ time = "1:12", light = true }) => (
  <g fontFamily={SANS} fill={light ? "#fff" : "#111"}>
    <text x={60} y={66} fontSize={28} fontWeight={600}>
      {time}
    </text>
    <rect x={440} y={46} width={44} height={22} rx={5} fill="none" stroke={light ? "#fff" : "#111"} strokeWidth={2} />
    <rect x={444} y={50} width={28} height={14} rx={3} />
  </g>
);

/* ───────── Gym ───────── */

export const Gym: React.FC<{ children?: React.ReactNode; bright?: boolean }> = ({ children, bright }) => {
  const t = useT();
  const flick = 0.85 + 0.15 * Math.sin(t * 40) * (rand(Math.floor(t * 6)) > 0.9 ? 1 : 0);
  return (
    <>
      <defs>
        <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bright ? "#3a4150" : "#20242d"} />
          <stop offset="1" stopColor={bright ? "#2a2f3a" : "#14171d"} />
        </linearGradient>
        <linearGradient id="gMirror" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3d4656" />
          <stop offset="1" stopColor="#262c37" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#gWall)" />
      {[260, 660, 1060, 1460].map((x) => (
        <g key={x}>
          <rect x={x} y={40} width={220} height={14} rx={7} fill="#e9f2ff" opacity={0.9} />
          <path d={`M${x},54 L${x - 100},700 L${x + 320},700 L${x + 220},54 Z`} fill="#dfe9ff" opacity={0.05} />
        </g>
      ))}
      <rect x={120} y={180} width={1680} height={500} fill="url(#gMirror)" />
      {[520, 980, 1440].map((x) => (
        <line key={x} x1={x} y1={180} x2={x} y2={680} stroke="#1b1f27" strokeWidth={6} />
      ))}
      <path d="M300,180 L520,180 L360,680 L140,680 Z" fill="#fff" opacity={0.05} />
      <g opacity={flick}>
        <Glow cx={960} cy={120} r={420} color="#2fe3c4" o={0.3} id="neon" />
        <text x={960} y={140} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={72} letterSpacing={14} fill="none" stroke="#7affea" strokeWidth={4}>
          POWERGYM
        </text>
      </g>
      {/* dumbbell rack */}
      <rect x={1240} y={600} width={560} height={20} fill="#3a3f48" />
      <rect x={1240} y={680} width={560} height={20} fill="#3a3f48" />
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={i}>
          <rect x={1260 + i * 60} y={578 - i * 1.5} width={40} height={22 + i * 1.5} rx={4} fill="#15171b" />
          <rect x={1260 + i * 60} y={656 - i * 1.5} width={40} height={24 + i * 1.5} rx={4} fill="#15171b" />
        </g>
      ))}
      {/* plates */}
      {[180, 260, 330].map((x, i) => (
        <circle key={x} cx={x} cy={760 - i * 8} r={70 - i * 12} fill="#121418" stroke="#2c3038" strokeWidth={6} />
      ))}
      <rect x={0} y={760} width={W} height={320} fill="#101216" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={i * 170} y1={760} x2={i * 170 - 120} y2={1080} stroke="#1a1d23" strokeWidth={3} />
      ))}
      <rect x={0} y={760} width={W} height={6} fill="#2a2e36" />
      {children}
    </>
  );
};

/* ───────── Stairwell ───────── */

export const Stairs: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <rect width={W} height={H} fill="#5f6672" />
    <rect x={1300} y={80} width={360} height={420} fill="#c4d3e2" />
    <path d="M1300,500 L1660,500 L1500,1080 L1000,1080 Z" fill="#dfe8f2" opacity={0.15} />
    <g fill="none" stroke="#3d434d" strokeWidth={12}>
      <rect x={1300} y={80} width={360} height={420} />
      <line x1={1480} y1={80} x2={1480} y2={500} />
    </g>
    {Array.from({ length: 11 }).map((_, i) => (
      <g key={i}>
        <rect x={i * 170 - 40} y={260 + i * 80} width={1920} height={80} fill={i % 2 ? "#7c8490" : "#858d99"} />
        <rect x={i * 170 - 40} y={260 + i * 80} width={1920} height={8} fill="#a0a8b3" />
      </g>
    ))}
    <line x1={0} y1={120} x2={1800} y2={1000} stroke="#2a2e35" strokeWidth={10} />
    {Array.from({ length: 10 }).map((_, i) => (
      <line key={i} x1={i * 180} y1={120 + i * 88} x2={i * 180} y2={210 + i * 88} stroke="#2a2e35" strokeWidth={6} />
    ))}
    {children}
  </>
);

/* ───────── Jeans close-up ───────── */

export const Jeans: React.FC<{ close: number }> = ({ close }) => {
  const t = useT();
  const gap = lerp(close, 0, 1, 120, 0) + (close < 1 ? Math.sin(t * 40) * 4 : 0);
  return (
    <>
      <rect width={W} height={H} fill="#2b2f37" />
      <Glow cx={960} cy={300} r={900} color="#8fa3c8" o={0.2} id="jG" />
      <rect x={300} y={0} width={1320} height={560} fill="#111317" />
      <g>
        <path d={`M200,560 L${900 - gap / 2},560 L${900 - gap / 2},1080 L200,1080 Z`} fill="#38598a" />
        <path d={`M${1020 + gap / 2},560 L1720,560 L1720,1080 L${1020 + gap / 2},1080 Z`} fill="#3b5d90" />
        <rect x={200} y={560} width={700 - gap / 2} height={70} fill="#2f4c78" />
        <rect x={1020 + gap / 2} y={560} width={700 - gap / 2} height={70} fill="#2f4c78" />
        <path d={`M200,600 L${900 - gap / 2},600 M${1020 + gap / 2},600 L1720,600`} stroke="#e0a64b" strokeWidth={3} strokeDasharray="10 8" />
        <circle cx={880 - gap / 2} cy={596} r={24} fill="#c9a24a" stroke="#8a6d2a" strokeWidth={5} />
        <rect x={1032 + gap / 2} y={588} width={44} height={14} rx={7} fill="#1d2f4b" />
      </g>
      <Arm from={[-100, 1200]} to={[820 - gap / 2, 640]} w={90} kind="grip" />
      <Arm from={[2000, 1200]} to={[1100 + gap / 2, 640]} w={90} kind="grip" />
    </>
  );
};

/* ───────── Push-up figure (side view) ───────── */

export const PushUp: React.FC<{ x: number; y: number; s?: number; k: number; suit?: boolean; shake?: number }> = ({
  x,
  y,
  s = 1,
  k,
  suit,
  shake = 0,
}) => {
  const t = useT();
  const sy = -150 + k * 85 + (shake ? Math.sin(t * 50) * shake : 0);
  const hand = { x: 0, y: 0 };
  const sh = { x: -10, y: sy };
  const elbow = { x: -60 - k * 40, y: sy / 2 + 6 };
  const feet = { x: -520, y: -12 };
  const hip = { x: -280, y: sy * 0.55 - 8 };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={-260} cy={6} rx={330} ry={14} fill="#000" opacity={0.25} />
      <path d={`M${feet.x},${feet.y} L${hip.x},${hip.y} L${sh.x - 30},${sh.y + 12}`} stroke="#0d0f13" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${hip.x + 20},${hip.y - 6} L${sh.x - 30},${sh.y}`} stroke="#0d0f13" strokeWidth={74} strokeLinecap="round" />
      {suit && <path d={`M${sh.x - 70},${sh.y + 26} L${sh.x - 40},${sh.y + 40} L${sh.x - 46},${sh.y + 120}`} stroke="#a8323a" strokeWidth={14} fill="none" strokeLinecap="round" />}
      <path d={`M${sh.x - 20},${sh.y + 10} L${elbow.x},${elbow.y} L${hand.x},${hand.y - 8}`} stroke="#0d0f13" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={sh.x + 40} cy={sh.y - 34} r={58} fill="#0d0f13" />
      <path d={`M${sh.x + 50},${sh.y - 40} l18,0 M${sh.x + 78},${sh.y - 40} l12,0`} stroke="#f2f4f6" strokeWidth={6} strokeLinecap="round" />
      <ellipse cx={feet.x - 6} cy={-6} rx={22} ry={9} fill="#dfe6ee" />
      {suit && <path d={`M${sh.x - 40},${sh.y - 4} l30,-10 l10,26 z`} fill="#f2f2f0" />}
    </g>
  );
};

/* ───────── Clock timer ───────── */

export const Timer: React.FC<{ p: number }> = ({ p }) => (
  <g transform="translate(960,540)">
    <circle r={330} fill="#f4f1ea" stroke="#1d2027" strokeWidth={20} />
    {Array.from({ length: 60 }).map((_, i) => (
      <line
        key={i}
        x1={0}
        y1={-300}
        x2={0}
        y2={i % 5 ? -284 : -262}
        stroke="#1d2027"
        strokeWidth={i % 5 ? 3 : 7}
        transform={`rotate(${i * 6})`}
      />
    ))}
    <path
      d={`M0,0 L0,-250 A250,250 0 ${p > 0.5 ? 1 : 0} 1 ${250 * Math.sin(p * 2 * Math.PI)},${-250 * Math.cos(p * 2 * Math.PI)} Z`}
      fill="#e2463b"
      opacity={0.85}
    />
    <line x1={0} y1={30} x2={0} y2={-270} stroke="#1d2027" strokeWidth={8} strokeLinecap="round" transform={`rotate(${p * 360})`} />
    <circle r={18} fill="#1d2027" />
  </g>
);

/* ───────── Party room ───────── */

export const Party: React.FC<{ children?: React.ReactNode; fireworks: [number, number, number, string][] }> = ({ children, fireworks }) => {
  const t = useT();
  return (
    <>
      <Room mode="night" fireworks={fireworks} desk={false} />
      <rect width={W} height={H} fill="#2a1d3a" opacity={0.35} />
      <path d="M0,90 Q480,180 960,100 T1920,110" stroke="#2a2a2a" strokeWidth={3} fill="none" />
      {Array.from({ length: 22 }).map((_, i) => {
        const x = i * 92 + 20;
        const y = 90 + Math.sin((x / 1920) * Math.PI * 2) * 40 + 30;
        const c = ["#ffcf6b", "#ff8fa3", "#8fd3ff", "#b6ff8f"][i % 4];
        return (
          <g key={i}>
            <Glow cx={x} cy={y} r={50} color={c} o={0.5 + 0.3 * Math.sin(t * 3 + i)} id={`bulb${i}`} />
            <circle cx={x} cy={y} r={9} fill={c} />
          </g>
        );
      })}
      <text x={1250} y={300} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={64} fill="#ffd56b" opacity={0.9} letterSpacing={6}>
        HAPPY NEW YEAR
      </text>
      <rect x={0} y={900} width={W} height={180} fill="#15121c" />
      {children}
    </>
  );
};

export const SpeechSmall: React.FC<{ x: number; y: number; text: string; at: number; color?: string }> = ({ x, y, text, at, color = "#fff" }) => {
  const t = useT();
  const o = lerp(t, at, at + 0.25, 0, 1);
  const sc = lerp(t, at, at + 0.25, 0.6, 1);
  return (
    <g opacity={o} transform={`translate(${x},${y}) scale(${sc})`}>
      <rect x={-text.length * 15 - 24} y={-44} width={text.length * 30 + 48} height={72} rx={36} fill="#111" opacity={0.75} />
      <text x={0} y={6} textAnchor="middle" fontFamily={HAND} fontSize={46} fill={color}>
        {text}
      </text>
    </g>
  );
};
