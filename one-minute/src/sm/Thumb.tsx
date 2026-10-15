import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Character } from "../Character";
import { Glow, H, HAND, Svg, W } from "../lib";
import { Room, Sticky } from "./sets";

const SANS = "Inter, Helvetica, Arial";
const SPLIT_TOP = 1010;
const SPLIT_BOT = 880;

/** YouTube thumbnail: the 1 AM scroll versus the 1-minute habit. */
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
          <stop offset="0" stopColor="#141a2e" />
          <stop offset="1" stopColor="#05070d" />
        </linearGradient>
      </defs>

      {/* LEFT: 1 AM, phone glow, kid waiting in the doorway */}
      <g clipPath="url(#tL)">
        <rect width={W} height={H} fill="url(#tNight)" />
        <rect x={90} y={250} width={260} height={560} fill="#ffcf8a" />
        <path d="M90,810 L350,810 L520,1080 L0,1080 Z" fill="#ffcf8a" opacity={0.18} />
        <Glow cx={220} cy={520} r={330} color="#ffcf8a" o={0.35} id="tDoor" />
        <Character x={220} y={810} s={0.95} kid expr="sad" look={1} rim="#ffcf8a" />
        <rect x={350} y={250} width={26} height={560} fill="#1a1612" />
        <Glow cx={640} cy={520} r={520} color="#7fa8ff" o={0.55} id="tPhone" />
        <Character x={650} y={1230} s={1.9} expr="tired" rim="#9fc0ff" />
        <path d="M0,900 Q300,820 600,860 Q800,880 1000,840 L1000,1080 L0,1080 Z" fill="#26304d" />
        <path d="M60,905 Q400,840 900,870" stroke="#34406a" strokeWidth={18} fill="none" />
        <path d="M820,900 L860,700 L770,470" stroke="#0d0f13" strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <g transform="translate(760,400) rotate(-14)">
          <rect x={-62} y={-112} width={124} height={224} rx={20} fill="#05060a" />
          <rect x={-54} y={-104} width={108} height={208} rx={14} fill="#bcd2ff" />
        </g>
        <g transform="translate(150,860) rotate(-6)">
          <rect x={0} y={0} width={360} height={110} rx={55} fill="#e0262f" />
          <rect x={26} y={22} width={40} height={66} rx={8} fill="none" stroke="#fff" strokeWidth={6} />
          <text x={88} y={78} fontFamily={SANS} fontWeight={900} fontSize={68} fill="#fff">
            4h 37m
          </text>
        </g>
      </g>

      {/* RIGHT: morning, the habit, the kid copying him */}
      <g clipPath="url(#tR)">
        <g transform="translate(560,0)">
          <Room mode="morning" desk={false} />
        </g>
        <Glow cx={1440} cy={620} r={620} color="#ffd36b" o={0.75} id="tSun" />
        <g transform="translate(1590,330) rotate(6) scale(0.62)">
          <Sticky x={0} y={0} rot={0} tally={23} lines={[{ text: "1 MINUTE.", at: -9, size: 80 }]} />
        </g>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M1440,600 L${1440 + Math.cos(a - 0.08) * 1400},${600 + Math.sin(a - 0.08) * 1400} L${1440 + Math.cos(a + 0.08) * 1400},${600 + Math.sin(a + 0.08) * 1400} Z`}
              fill="#fff6d6"
              opacity={0.16}
            />
          );
        })}
        {[
          [1360, 1080, 1.75],
          [1710, 1080, 0.95],
        ].map(([cx, cy, sc], i) => {
          const sy = cy - 277 * sc;
          const L = (i === 0 ? 128 : 150) * sc;
          return (
            <g key={i} stroke="#0d0f13" strokeWidth={24 * sc} strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d={`M${cx - 24 * sc},${sy} L${cx - 0.75 * L},${sy - 0.55 * L} L${cx - 0.95 * L},${sy - 1.45 * L}`} />
              <path d={`M${cx + 24 * sc},${sy} L${cx + 0.75 * L},${sy - 0.55 * L} L${cx + 0.95 * L},${sy - 1.45 * L}`} />
              <circle cx={cx - 0.95 * L} cy={sy - 1.45 * L - 6 * sc} r={20 * sc} fill="#0d0f13" stroke="none" />
              <circle cx={cx + 0.95 * L} cy={sy - 1.45 * L - 6 * sc} r={20 * sc} fill="#0d0f13" stroke="none" />
            </g>
          );
        })}
        <Character x={1360} y={1080} s={1.75} pose="stand" expr="happy" rim="#fff3cf" />
        <Character x={1710} y={1080} s={0.95} kid pose="stand" expr="happy" rim="#fff3cf" />
      </g>

      {/* split line */}
      <line x1={SPLIT_TOP} y1={0} x2={SPLIT_BOT} y2={H} stroke="#fff" strokeWidth={14} />

      {/* title */}
      <g fontFamily={SANS} fontWeight={900} fontSize={190} letterSpacing={6} textAnchor="middle">
        <text x={960} y={215} fill="#000" opacity={0.55} transform="translate(8,10)">
          1 MINUTE
        </text>
        <text x={960} y={215} fill="#fff" stroke="#0b0b0b" strokeWidth={14} paintOrder="stroke">
          <tspan fill="#ffc93c">1</tspan> MINUTE
        </text>
      </g>
      <text x={470} y={340} textAnchor="middle" fontFamily={HAND} fontSize={64} fill="#ffb347" stroke="#000" strokeWidth={6} paintOrder="stroke">
        "Tomorrow."
      </text>
    </Svg>
  </AbsoluteFill>
);

export const ThumbComp = () => <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1920} height={1080} />;
