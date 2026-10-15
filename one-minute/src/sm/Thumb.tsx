import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { Glow, H, Svg, W, rand } from "../lib";
import "@fontsource/patrick-hand";
import { PushUp } from "./sets";

const SPLIT_TOP = 1010;
const SPLIT_BOT = 890;

/** YouTube thumbnail: stuck and helpless on the left, doing the push-up on the right, "1 MINUTE" on the divide. */
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
        <linearGradient id="tGrey" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3f4a" />
          <stop offset="1" stopColor="#1b1e24" />
        </linearGradient>
        <linearGradient id="tSunBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd25e" />
          <stop offset="1" stopColor="#ff7a3d" />
        </linearGradient>
      </defs>

      {/* LEFT — slumped on the floor, helpless */}
      <g clipPath="url(#tL)">
        <rect width={W} height={H} fill="url(#tGrey)" />
        <rect y={820} width={W} height={260} fill="#14161b" />
        <line x1={0} y1={820} x2={W} y2={820} stroke="#4a505c" strokeWidth={4} />
        <Glow cx={430} cy={560} r={520} color="#8fa3c8" o={0.18} id="tCold" />
        <g transform="translate(440,880) scale(1.6)">
          <ellipse cx={0} cy={6} rx={160} ry={16} fill="#000" opacity={0.4} />
          <rect x={-90} y={-310} width={180} height={312} rx={70} fill="#0d0f13" stroke="#9fb2c7" strokeWidth={5} />
          {[-1, 1].map((d) => (
            <g key={d}>
              <rect x={d < 0 ? -84 : 12} y={-215} width={72} height={215} rx={36} fill="#1b1f27" stroke="#2f3542" strokeWidth={4} />
              <circle cx={d * 48} cy={-212} r={44} fill="#1b1f27" stroke="#2f3542" strokeWidth={4} />
              <ellipse cx={d * 50} cy={4} rx={38} ry={14} fill="#dfe6ee" />
              <path d={`M${d * 88},-255 Q${d * 125},-150 ${d * 70},-120 L${d * 8},-128`} stroke="#0d0f13" strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d={`M${d * 104},-232 Q${d * 128},-160 ${d * 96},-128`} stroke="#9fb2c7" strokeWidth={4} fill="none" opacity={0.8} />
            </g>
          ))}
          <circle cx={0} cy={-330} r={92} fill="#0d0f13" stroke="#9fb2c7" strokeWidth={5} />
          <ellipse cx={-30} cy={-322} rx={12} ry={16} fill="#f4f6f8" />
          <ellipse cx={30} cy={-322} rx={12} ry={16} fill="#f4f6f8" />
          <circle cx={-28} cy={-316} r={5} fill="#0d0f13" />
          <circle cx={32} cy={-316} r={5} fill="#0d0f13" />
          <path d="M-56,-350 L-16,-364 M16,-364 L56,-350" stroke="#cfd5dc" strokeWidth={6} strokeLinecap="round" />
          <path d="M-16,-276 q16,-10 32,0" stroke="#cfd5dc" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
        <g transform="translate(760,880)">
          <circle r={58} fill="#e8e6e0" />
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={i}
              x1={(rand(i) - 0.5) * 100}
              y1={(rand(i + 9) - 0.5) * 100}
              x2={(rand(i + 18) - 0.5) * 100}
              y2={(rand(i + 27) - 0.5) * 100}
              stroke={i % 3 ? "#9a9890" : "#d62f35"}
              strokeWidth={5}
            />
          ))}
        </g>
      </g>

      {/* RIGHT — doing the push-up, sun behind */}
      <g clipPath="url(#tR)">
        <rect width={W} height={H} fill="url(#tSunBg)" />
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M1460,620 L${1460 + Math.cos(a - 0.09) * 1500},${620 + Math.sin(a - 0.09) * 1500} L${1460 + Math.cos(a + 0.09) * 1500},${620 + Math.sin(a + 0.09) * 1500} Z`}
              fill="#fff7d6"
              opacity={0.22}
            />
          );
        })}
        <Glow cx={1460} cy={620} r={560} color="#fff2c0" o={0.75} id="tSun" />
        <rect x={0} y={900} width={W} height={180} fill="#c9622e" opacity={0.55} />
        <PushUp x={1720} y={905} s={1.4} k={0.55} />
        {[
          [1800, 600],
          [1830, 650],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x},${y} q10,18 0,26 q-10,-8 0,-26 z`} fill="#ffffff" opacity={0.9} />
        ))}
        {[0, 1, 2].map((i) => (
          <line key={i} x1={1140} y1={700 + i * 50} x2={1060} y2={700 + i * 50} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.55} />
        ))}
      </g>

      {/* divider + the note that changes everything */}
      <line x1={SPLIT_TOP} y1={0} x2={SPLIT_BOT} y2={H} stroke="#fff" strokeWidth={16} />
      <g transform="translate(950,520) rotate(4) scale(1.05) translate(-200,-200)">
        <rect x={14} y={22} width={400} height={400} fill="#000" opacity={0.35} />
        <rect width={400} height={400} fill="#fff8e0" />
        <rect width={400} height={56} fill="#000" opacity={0.05} />
        <path d="M400,330 L400,400 L330,400 Z" fill="#000" opacity={0.08} />
        <text x={200} y={250} textAnchor="middle" fontFamily="'Patrick Hand', cursive" fontSize={230} fill="#d8262f">
          1
        </text>
        <text x={200} y={350} textAnchor="middle" fontFamily="'Patrick Hand', cursive" fontSize={96} fill="#d8262f">
          MINUTE
        </text>
        <circle cx={40} cy={30} r={13} fill="#3b6fd8" />
        <circle cx={360} cy={30} r={13} fill="#2fa36b" />
      </g>
    </Svg>
  </AbsoluteFill>
);

export const ThumbComp = () => <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1920} height={1080} />;
