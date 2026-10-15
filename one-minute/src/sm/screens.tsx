import React from "react";
import { HAND, lerp, useT } from "../lib";
import { Character } from "../Character";
import { StatusBar } from "./sets";

const SANS = "Inter, Helvetica, Arial";
const SW = 540,
  SH = 1060;

export const PayScreen: React.FC = () => {
  const t = useT();
  const pressed = t > 1.3 && t < 1.55;
  const ok = lerp(t, 1.7, 2.0, 0, 1);
  return (
    <g fontFamily={SANS}>
      <rect width={SW} height={SH} fill="#f5f7fa" />
      <StatusBar time="12:04" light={false} />
      <circle cx={70} cy={150} r={30} fill="#18c3a5" />
      <text x={70} y={160} textAnchor="middle" fontSize={28} fontWeight={900} fill="#fff">
        P
      </text>
      <text x={116} y={162} fontSize={34} fontWeight={800} fill="#121722">
        PowerGym
      </text>
      <text x={40} y={260} fontSize={46} fontWeight={800} fill="#121722">
        Choose your plan
      </text>
      <rect x={32} y={310} width={476} height={300} rx={28} fill="#fff" stroke="#18c3a5" strokeWidth={4} />
      <text x={64} y={370} fontSize={30} fontWeight={700} fill="#18c3a5">
        MONTHLY
      </text>
      <text x={64} y={450} fontSize={72} fontWeight={800} fill="#121722">
        ₹2,000
      </text>
      <text x={64} y={500} fontSize={26} fill="#6b7280">
        per month · auto-renew
      </text>
      <text x={64} y={560} fontSize={26} fill="#121722">
        ✓ Unlimited access  ✓ Trainer
      </text>
      <rect x={32} y={640} width={476} height={130} rx={28} fill="#eef1f5" />
      <text x={64} y={720} fontSize={30} fill="#9aa1ab">
        Yearly · ₹18,000
      </text>
      <rect x={32} y={900} width={476} height={100} rx={50} fill={pressed ? "#0f8f78" : "#18c3a5"} />
      <text x={270} y={963} textAnchor="middle" fontSize={34} fontWeight={800} fill="#fff">
        Pay ₹2,000
      </text>
      {ok > 0 && (
        <g opacity={ok}>
          <rect width={SW} height={SH} fill="#ffffff" opacity={0.96} />
          <circle cx={270} cy={460} r={110 * (0.6 + 0.4 * ok)} fill="#18c3a5" />
          <path d="M215,462 L255,502 L330,420" stroke="#fff" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={270} y={650} textAnchor="middle" fontSize={40} fontWeight={800} fill="#121722">
            Payment successful
          </text>
          <text x={270} y={705} textAnchor="middle" fontSize={28} fill="#6b7280">
            Welcome to PowerGym. Let's go!
          </text>
        </g>
      )}
    </g>
  );
};

const REELS = [
  { title: "30-DAY SHRED", sub: "transform your body", c1: "#ff5f6d", c2: "#2b1055" },
  { title: "ABS IN 10 DAYS", sub: "no equipment needed", c1: "#00c9ff", c2: "#1a1f4a" },
  { title: "5 AM ROUTINE", sub: "of a millionaire", c1: "#f7b733", c2: "#3a1c0b" },
  { title: "NO EXCUSES", sub: "just do it", c1: "#a8ff78", c2: "#0f2a1d" },
];

export const ReelsScreen: React.FC<{ swipes: number[]; taps: number[] }> = ({ swipes, taps }) => {
  const t = useT();
  let idx = 0;
  for (const s of swipes) idx += lerp(t, s, s + 0.35, 0, 1);
  return (
    <g fontFamily={SANS}>
      <rect width={SW} height={SH} fill="#000" />
      <g transform={`translate(0,${-idx * SH})`}>
        {REELS.map((r, i) => {
          const saved = taps[i - 1] !== undefined && t > taps[i - 1];
          return (
            <g key={i} transform={`translate(0,${i * SH})`}>
              <defs>
                <linearGradient id={`rl${i}`} x1="0" y1="0" x2="0.4" y2="1">
                  <stop offset="0" stopColor={r.c1} />
                  <stop offset="1" stopColor={r.c2} />
                </linearGradient>
              </defs>
              <rect width={SW} height={SH} fill={`url(#rl${i})`} />
              <g transform="translate(270,1000) scale(1.5)">
                <Character x={0} y={0} buff pose="armsUp" expr="determined" rim="#ffffff" />
              </g>
              <text x={270} y={240} textAnchor="middle" fontSize={64} fontWeight={900} fill="#fff" stroke="#000" strokeWidth={2}>
                {r.title}
              </text>
              <text x={270} y={290} textAnchor="middle" fontSize={30} fill="#fff" opacity={0.9}>
                {r.sub}
              </text>
              <text x={36} y={960} fontSize={28} fontWeight={700} fill="#fff">
                @fit.coach.daily
              </text>
              {[0, 1, 2].map((k) => (
                <circle key={k} cx={480} cy={560 + k * 100} r={28} fill="#fff" opacity={0.9} />
              ))}
              <path
                d="M464,846 L496,846 L496,892 L480,878 L464,892 Z"
                fill={saved ? "#fff" : "none"}
                stroke="#fff"
                strokeWidth={4}
              />
            </g>
          );
        })}
      </g>
      <StatusBar time="1:12" />
      {taps.map((tp, i) => {
        const o = Math.min(lerp(t, tp, tp + 0.15, 0, 1), lerp(t, tp + 0.7, tp + 0.9, 1, 0));
        return o > 0 ? (
          <g key={i} opacity={o}>
            <rect x={110} y={860} width={320} height={64} rx={32} fill="#fff" />
            <text x={270} y={902} textAnchor="middle" fontSize={28} fontWeight={700} fill="#111">
              Saved to collection
            </text>
          </g>
        ) : null;
      })}
    </g>
  );
};

export const LockScreen: React.FC<{ notif: { at: number; title: string; body: string; app: string }[]; time?: string; date?: string }> = ({
  notif,
  time = "1:12",
  date = "Wednesday, February 5",
}) => {
  const t = useT();
  return (
    <g fontFamily={SANS}>
      <defs>
        <linearGradient id="lock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d2b64" />
          <stop offset="1" stopColor="#0b0f1e" />
        </linearGradient>
      </defs>
      <rect width={SW} height={SH} fill="url(#lock)" />
      <text x={270} y={150} textAnchor="middle" fontSize={30} fill="#dfe6ff">
        {date}
      </text>
      <text x={270} y={300} textAnchor="middle" fontSize={150} fontWeight={300} fill="#fff">
        {time}
      </text>
      {notif.map((n, i) => {
        const k = lerp(t, n.at, n.at + 0.35, 0, 1);
        const y = 400 + i * 150 - (1 - k) * 60;
        return (
          <g key={i} opacity={k} transform={`translate(0,${y})`}>
            <rect x={24} y={0} width={492} height={136} rx={30} fill="#ffffff" opacity={0.92} />
            <rect x={48} y={24} width={40} height={40} rx={10} fill="#e23d3d" />
            <text x={68} y={53} textAnchor="middle" fontSize={24} fontWeight={800} fill="#fff">
              ₹
            </text>
            <text x={104} y={52} fontSize={24} fontWeight={700} fill="#333">
              {n.app}
            </text>
            <text x={490} y={52} textAnchor="end" fontSize={22} fill="#777">
              now
            </text>
            <text x={48} y={94} fontSize={27} fontWeight={700} fill="#111">
              {n.title}
            </text>
            <text x={48} y={124} fontSize={23} fill="#444">
              {n.body}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export const StoryScreen: React.FC = () => {
  const t = useT();
  return (
    <g fontFamily={SANS}>
      <defs>
        <linearGradient id="story" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4150" />
          <stop offset="1" stopColor="#11141a" />
        </linearGradient>
      </defs>
      <rect width={SW} height={SH} fill="url(#story)" />
      <rect x={0} y={300} width={SW} height={500} fill="#2a3040" />
      <text x={270} y={350} textAnchor="middle" fontSize={40} fontWeight={900} letterSpacing={8} fill="#7affea" opacity={0.6}>
        POWERGYM
      </text>
      <g transform="translate(270,1010) scale(1.6)">
        <Character x={0} y={0} buff pose="cheer" expr="happy" outfit="tank" rim="#ffffff" />
      </g>
      <g transform="translate(270,560) rotate(-6)">
        <rect x={-170} y={-60} width={340} height={110} rx={20} fill="#ffffff" />
        <text x={0} y={22} textAnchor="middle" fontSize={68} fontWeight={900} fill="#111">
          DAY 100
        </text>
      </g>
      <text x={270} y={690} textAnchor="middle" fontFamily={HAND} fontSize={44} fill="#fff">
        no days off
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={24 + i * 168} y={34} width={160} height={6} rx={3} fill="#fff" opacity={0.35} />
      ))}
      <rect x={24} y={34} width={160} height={6} rx={3} fill="#fff" />
      <rect x={192} y={34} width={160 * Math.min(1, t / 3.5)} height={6} rx={3} fill="#fff" />
      <circle cx={60} cy={92} r={26} fill="#e9a23b" />
      <text x={100} y={102} fontSize={26} fontWeight={700} fill="#fff">
        rohan.lifts
      </text>
      <text x={250} y={102} fontSize={24} fill="#ddd">
        2h
      </text>
      <rect x={24} y={970} width={420} height={64} rx={32} fill="none" stroke="#fff" strokeWidth={2} opacity={0.7} />
      <text x={56} y={1012} fontSize={26} fill="#ddd">
        Send message
      </text>
    </g>
  );
};

export const ScreenTimeScreen: React.FC = () => {
  const t = useT();
  const mins = Math.round(lerp(t, 1.2, 2.8, 0, 277));
  const full = lerp(t, 0.9, 1.3, 0, 1);
  const bars = [0.72, 0.85, 0.66, 0.92, 1.0, 0.95, 0.81];
  const notifK = lerp(t, 0.3, 0.6, 0, 1);
  return (
    <g fontFamily={SANS}>
      <rect width={SW} height={SH} fill="#0f1115" />
      <StatusBar time="11:48" />
      <g opacity={1 - full}>
        <g transform={`translate(0,${120 - (1 - notifK) * 60})`} opacity={notifK}>
          <rect x={24} y={0} width={492} height={120} rx={28} fill="#2a2d35" />
          <rect x={48} y={24} width={40} height={40} rx={10} fill="#7c5cff" />
          <text x={104} y={52} fontSize={24} fontWeight={700} fill="#ddd">
            Screen Time
          </text>
          <text x={48} y={98} fontSize={26} fontWeight={600} fill="#fff">
            Your weekly report is ready
          </text>
        </g>
      </g>
      <g opacity={full}>
        <text x={40} y={150} fontSize={30} fill="#9aa1ab">
          Weekly Report
        </text>
        <text x={40} y={210} fontSize={44} fontWeight={800} fill="#fff">
          Screen Time
        </text>
        <text x={40} y={300} fontSize={28} fill="#9aa1ab">
          Daily Average
        </text>
        <text x={40} y={400} fontSize={110} fontWeight={800} fill="#fff">
          {Math.floor(mins / 60)}h {String(mins % 60).padStart(2, "0")}m
        </text>
        <text x={40} y={450} fontSize={26} fill="#ff6b6b">
          ▲ 12% from last week
        </text>
        {bars.map((b, i) => {
          const h = 240 * b * lerp(t, 1.2 + i * 0.08, 1.8 + i * 0.08, 0, 1);
          return <rect key={i} x={46 + i * 66} y={760 - h} width={44} height={h} rx={8} fill={i === 4 ? "#7c5cff" : "#4b4f5c"} />;
        })}
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <text key={i} x={68 + i * 66} y={800} textAnchor="middle" fontSize={22} fill="#9aa1ab">
            {d}
          </text>
        ))}
        {[
          ["Social", "2h 51m", "#4aa3ff", 0.62],
          ["Videos", "1h 22m", "#ff9f43", 0.3],
          ["Other", "24m", "#9aa1ab", 0.09],
        ].map(([n, v, c, w], i) => (
          <g key={i} transform={`translate(40,${860 + i * 60})`}>
            <rect x={0} y={-22} width={460 * (w as number)} height={14} rx={7} fill={c as string} />
            <text x={0} y={22} fontSize={24} fill="#ddd">
              {n as string}
            </text>
            <text x={460} y={22} textAnchor="end" fontSize={24} fill="#ddd">
              {v as string}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
};

export const WidgetScreen: React.FC<{ values: [string, number][]; delta: string }> = ({ values, delta }) => {
  const t = useT();
  let v = values[0][0];
  let changed = -10;
  for (const [s, at] of values)
    if (t >= at) {
      v = s;
      changed = at;
    }
  const pop = lerp(t, changed, changed + 0.25, 1.12, 1);
  return (
    <g fontFamily={SANS}>
      <defs>
        <linearGradient id="home" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb88c" />
          <stop offset="1" stopColor="#de6262" />
        </linearGradient>
      </defs>
      <rect width={SW} height={SH} fill="url(#home)" />
      <StatusBar time="7:02" />
      <rect x={32} y={110} width={476} height={250} rx={36} fill="#ffffff" opacity={0.92} />
      <text x={64} y={170} fontSize={28} fontWeight={700} fill="#7c5cff">
        Screen Time
      </text>
      <g transform={`translate(64,280) scale(${pop})`}>
        <text x={0} y={0} fontSize={92} fontWeight={800} fill="#111">
          {v}
        </text>
      </g>
      <text x={64} y={330} fontSize={26} fontWeight={600} fill="#1f9a4a">
        ▼ {delta}
      </text>
      {Array.from({ length: 16 }).map((_, i) => (
        <rect
          key={i}
          x={44 + (i % 4) * 120}
          y={420 + Math.floor(i / 4) * 140}
          width={92}
          height={92}
          rx={24}
          fill={["#4aa3ff", "#ff6b6b", "#ffd84d", "#7c5cff", "#2ecc71", "#ff9f43", "#ffffff", "#34495e"][i % 8]}
          opacity={0.92}
        />
      ))}
    </g>
  );
};
