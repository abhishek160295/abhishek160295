import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Character } from "../Character";
import { Glow, H, Svg, W } from "../lib";

const SANS = "Inter, Helvetica, Arial";
const SPLIT_TOP = 1000;
const SPLIT_BOT = 900;

const BigText: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode; anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  size,
  fill,
  children,
  anchor = "middle",
}) => (
  <g fontFamily={SANS} fontWeight={900} fontSize={size} textAnchor={anchor}>
    <text x={x + 8} y={y + 10} fill="#000" opacity={0.6}>
      {children}
    </text>
    <text x={x} y={y} fill={fill} stroke="#0b0b0b" strokeWidth={size * 0.08} paintOrder="stroke">
      {children}
    </text>
  </g>
);

/** YouTube thumbnail: 4h 37m of scrolling versus 1 minute that changed everything. */
export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Svg>
      <defs>
        <clipPath id="tL">
          <path d={`M0,0 L${SPLIT_TOP},0 L${SPLIT_BOT},${H} L0,${H} Z`} />
        </clipPath>
        <clipPath id="tR">
          <path d={`M${SPLIT_TOP},0 L${W},0 L${W},${H} L${SPLIT_BOT},${H} Z`} />
        </clipPath>
        <linearGradient id="tNight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#101a3c" />
          <stop offset="1" stopColor="#03040a" />
        </linearGradient>
        <linearGradient id="tSunBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd25e" />
          <stop offset="1" stopColor="#ff7a3d" />
        </linearGradient>
      </defs>

      {/* LEFT — scrolling at night while the kid waits */}
      <g clipPath="url(#tL)">
        <rect width={W} height={H} fill="url(#tNight)" />
        <rect x={110} y={300} width={230} height={520} fill="#ffcf8a" />
        <Glow cx={225} cy={560} r={300} color="#ffcf8a" o={0.4} id="tDoor" />
        <Character x={225} y={820} s={0.88} kid expr="sad" look={1} rim="#ffcf8a" />
        <ellipse cx={225} cy={600} rx={175} ry={290} fill="none" stroke="#ff2b2b" strokeWidth={14} transform="rotate(-6 225 600)" />
        <Glow cx={700} cy={560} r={560} color="#6f9dff" o={0.7} id="tPhone" />
        <Character x={640} y={1640} s={3.1} expr="tired" rim="#a9c4ff" />
        <path d="M900,1100 L930,760 L900,620" stroke="#0d0f13" strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <g transform="translate(880,520) rotate(-12)">
          <rect x={-80} y={-150} width={160} height={300} rx={26} fill="#04050a" />
          <rect x={-70} y={-140} width={140} height={280} rx={18} fill="#cfe0ff" />
        </g>
      </g>

      {/* RIGHT — morning, kid on his shoulders */}
      <g clipPath="url(#tR)">
        <rect width={W} height={H} fill="url(#tSunBg)" />
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M1430,560 L${1430 + Math.cos(a - 0.09) * 1500},${560 + Math.sin(a - 0.09) * 1500} L${1430 + Math.cos(a + 0.09) * 1500},${560 + Math.sin(a + 0.09) * 1500} Z`}
              fill="#fff7d6"
              opacity={0.22}
            />
          );
        })}
        <Glow cx={1430} cy={560} r={560} color="#fff2c0" o={0.8} id="tSun" />
        {/* kid's raised arms */}
        <g stroke="#0d0f13" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M1405,415 L1330,330 L1300,215" />
          <path d="M1455,415 L1530,330 L1560,215" />
        </g>
        <circle cx={1300} cy={205} r={20} fill="#0d0f13" />
        <circle cx={1560} cy={205} r={20} fill="#0d0f13" />
        <Character x={1430} y={720} s={0.95} kid expr="happy" rim="#fff7d6" />
        <Character x={1430} y={1360} s={1.9} expr="happy" rim="#fff7d6" />
        {/* his hands holding the kid's legs */}
        <g stroke="#0d0f13" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M1405,575 L1320,640 L1305,740" />
          <path d="M1455,575 L1540,640 L1555,740" />
        </g>
        <g stroke="#0d0f13" strokeWidth={42} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M1385,835 L1230,800 L1290,720" />
          <path d="M1475,835 L1630,800 L1570,720" />
        </g>
        <ellipse cx={1300} cy={752} rx={24} ry={11} fill="#dfe6ee" />
        <ellipse cx={1560} cy={752} rx={24} ry={11} fill="#dfe6ee" />
      </g>

      <line x1={SPLIT_TOP} y1={0} x2={SPLIT_BOT} y2={H} stroke="#fff" strokeWidth={16} />

      {/* headline: the comparison */}
      <g transform="translate(70,40)">
        <rect x={0} y={0} width={520} height={160} rx={30} fill="#e0222b" stroke="#0b0b0b" strokeWidth={8} />
        <text x={260} y={120} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={118} fill="#fff">
          4h 37m
        </text>
      </g>
      <g transform="translate(950,120)">
        <circle r={78} fill="#fff" stroke="#0b0b0b" strokeWidth={8} />
        <path d="M-38,0 L28,0 M4,-30 L34,0 L4,30" stroke="#0b0b0b" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <BigText x={1470} y={175} size={170} fill="#ffffff">
        1 MIN
      </BigText>
    </Svg>
  </AbsoluteFill>
);

export const ThumbComp = () => <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1920} height={1080} />;
