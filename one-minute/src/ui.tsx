import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HAND, SERIF, lerp, rand, useDur, useT, W, H } from "./lib";
import { Arm } from "./Character";

/** Dialogue bubble with a typewriter reveal. */
export const Caption: React.FC<{
  text: string;
  x?: number;
  y?: number;
  at?: number;
  until?: number;
  size?: number;
  color?: string;
}> = ({ text, x = W / 2, y = 120, at = 0.3, until, size = 58, color = "#fbfbfb" }) => {
  const t = useT();
  const d = useDur();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = until ?? d - 0.25;
  if (t < at) return null;
  const sp = spring({ frame: f - at * fps, fps, config: { damping: 14, stiffness: 160 } });
  const chars = Math.floor((t - at) * 38);
  const o = lerp(t, end - 0.25, end, 1, 0);
  const lines = text.split("\n");
  let used = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * sp})`,
        opacity: o * sp,
        padding: "18px 42px",
        borderRadius: 60,
        background: "rgba(14,16,20,0.62)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
        backdropFilter: "blur(6px)",
        fontFamily: HAND,
        fontSize: size,
        lineHeight: 1.15,
        color,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {lines.map((ln, i) => {
        const vis = Math.max(0, Math.min(ln.length, chars - used));
        used += ln.length;
        return (
          <div key={i}>
            <span>{ln.slice(0, vis)}</span>
            <span style={{ opacity: 0 }}>{ln.slice(vis)}</span>
          </div>
        );
      })}
    </div>
  );
};

/** Excuse voice: warm amber text that floats in the dark. */
export const Inner: React.FC<{
  text: string;
  x: number;
  y: number;
  at?: number;
  size?: number;
  fade?: number;
}> = ({ text, x, y, at = 0.3, size = 60, fade = 1 }) => {
  const t = useT();
  const d = useDur();
  const o = Math.min(lerp(t, at, at + 0.4, 0, 1), lerp(t, d - 0.3, d, 1, 0)) * fade;
  const dy = lerp(t, at, at + 0.6, 14, 0);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + dy,
        transform: "translate(-50%,-50%)",
        fontFamily: HAND,
        fontSize: size,
        color: "#ffb347",
        opacity: o,
        textShadow: "0 0 24px rgba(255,150,40,0.55), 0 4px 18px rgba(0,0,0,0.8)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const Quote: React.FC<{ lines: string[]; by?: string; big?: boolean; sub?: string }> = ({
  lines,
  by,
  big,
  sub,
}) => {
  const t = useT();
  const d = useDur();
  const out = lerp(t, d - 0.8, d, 1, 0);
  const z = lerp(t, 0, d, 1, 1.05);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #15171c 0%, #050506 70%)" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, alignItems: "center", justifyContent: "center", opacity: out }}>
        <div style={{ textAlign: "center", fontFamily: SERIF, color: "#f2efe8" }}>
          {lines.map((l, i) => {
            const a = 0.4 + i * 1.1;
            return (
              <div
                key={i}
                style={{
                  fontSize: big ? 150 : 66,
                  letterSpacing: big ? 26 : 0.5,
                  fontWeight: big ? 500 : 400,
                  fontStyle: big ? "normal" : "italic",
                  lineHeight: 1.3,
                  opacity: lerp(t, a, a + 0.9, 0, 1),
                  filter: `blur(${lerp(t, a, a + 0.9, 8, 0)}px)`,
                  transform: `translateY(${lerp(t, a, a + 0.9, 16, 0)}px)`,
                }}
              >
                {l}
              </div>
            );
          })}
          {sub && (
            <div
              style={{
                marginTop: 26,
                fontSize: 44,
                opacity: lerp(t, 1.8, 2.8, 0, 0.85),
                letterSpacing: 1,
              }}
            >
              {sub}
            </div>
          )}
          {by && (
            <div
              style={{
                marginTop: 34,
                fontSize: 32,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#a9a49a",
                opacity: lerp(t, 0.6 + lines.length * 1.1, 1.4 + lines.length * 1.1, 0, 1),
              }}
            >
              — {by}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Alarm phone lying on a bedside table. */
export const PhoneScene: React.FC<{
  date: string;
  label: string;
  excuses?: { text: string; at: number; size?: number }[];
  press?: number;
  pressBtn?: "snooze" | "stop";
  hover?: [number, number];
  fadeExcuses?: number;
  dark?: number;
}> = ({ date, label, excuses = [], press, pressBtn = "snooze", hover, fadeExcuses = 1, dark = 0 }) => {
  const t = useT();
  const pulse = 0.5 + 0.5 * Math.sin(t * 10);
  const px = 1240,
    py = 560;
  const btnY = pressBtn === "snooze" ? py + 150 : py + 240;
  let armTo: [number, number] | null = null;
  if (press !== undefined) {
    const k = lerp(t, press - 0.6, press, 0, 1);
    const back = lerp(t, press + 0.25, press + 0.9, 0, 1);
    const tx = px - 10;
    armTo = [lerp(k - back, 0, 1, 1500, tx), lerp(k - back, 0, 1, 1250, btnY + 8)];
  }
  if (hover) {
    const k = lerp(t, hover[0], hover[0] + 0.7, 0, 1);
    const back = lerp(t, hover[1], hover[1] + 0.8, 0, 1);
    armTo = [lerp(k - back, 0, 1, 1500, px + 10), lerp(k - back, 0, 1, 1250, py + 175)];
  }
  const pressed = press !== undefined && t > press && t < press + 0.4;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#2a2d33 0%,#17191d 60%,#0d0e10 100%)" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <pattern id="wood" width="1920" height="60" patternUnits="userSpaceOnUse">
            <rect width="1920" height="60" fill="#22252a" />
            <path d="M0,30 Q480,22 960,32 T1920,28" stroke="#2c3036" strokeWidth="2" fill="none" />
          </pattern>
          <radialGradient id="screenGlow">
            <stop offset="0" stopColor="#3d63b8" stopOpacity={0.55} />
            <stop offset="1" stopColor="#3d63b8" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1f3360" />
            <stop offset="1" stopColor="#0f1a33" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#wood)" opacity={0.6} />
        <circle cx={1700} cy={70} r={160} fill="#2b2f36" opacity={0.6} />
        <circle cx={px} cy={py} r={520} fill="url(#screenGlow)" opacity={0.6 + 0.4 * pulse} />
        <g transform={`translate(${px},${py}) rotate(-8)`}>
          <rect x={-215} y={-385} width={430} height={770} rx={56} fill="#090b10" />
          <rect x={-200} y={-370} width={400} height={740} rx={46} fill="url(#screen)" />
          <text x={0} y={-215} textAnchor="middle" fill="#c9d4ea" fontFamily="Inter, Helvetica, Arial" fontSize={36}>
            {date}
          </text>
          <text x={0} y={-80} textAnchor="middle" fill="#eef3ff" fontFamily="Inter, Helvetica, Arial" fontSize={170} fontWeight={300}>
            5:30
          </text>
          <text x={0} y={-10} textAnchor="middle" fill="#b9c6e2" fontFamily="Inter, Helvetica, Arial" fontSize={40} fontWeight={700} letterSpacing={3}>
            {label}
          </text>
          <rect x={-120} y={110} width={240} height={86} rx={43} fill={pressed && pressBtn === "snooze" ? "#b8c4dc" : "#e9edf6"} />
          <text x={0} y={166} textAnchor="middle" fill="#1b2235" fontFamily="Inter, Helvetica, Arial" fontSize={38} fontWeight={800}>
            SNOOZE
          </text>
          <rect x={-70} y={220} width={140} height={52} rx={26} fill={pressed && pressBtn === "stop" ? "#3a6bd8" : "none"} stroke="#7c8bad" strokeWidth={2} />
          <text x={0} y={255} textAnchor="middle" fill="#9fb0d2" fontFamily="Inter, Helvetica, Arial" fontSize={26}>
            STOP
          </text>
        </g>
        {armTo && <Arm from={[1640, 1300]} to={armTo} w={64} kind="point" />}
      </svg>
      {excuses.map((e, i) => (
        <Inner key={i} text={e.text} x={520} y={380 + i * 130} at={e.at} size={e.size ?? 66} fade={fadeExcuses} />
      ))}
      <AbsoluteFill style={{ background: "#000", opacity: dark }} />
    </AbsoluteFill>
  );
};

export type Mark = "none" | "x" | "check";

/** Wall calendar: 4 weeks x 7 days, with hand-drawn marks. */
export const Calendar: React.FC<{
  x: number;
  y: number;
  s?: number;
  title: string;
  marks: number;
  kind: "x" | "check";
  warm?: boolean;
  markStart?: number;
  markRate?: number;
  crumple?: number;
}> = ({ x, y, s = 1, title, marks, kind, warm, markStart = 0, markRate = 0, crumple = 0 }) => {
  const t = useT();
  const cool = ["#6fa392", "#5a7fa8", "#9b9cb2", "#6aa0a8", "#79a98b", "#8f93ad", "#5d7ea3"];
  const hot = ["#e3a256", "#e48a5a", "#e6b45e", "#d98a63", "#e7a35a", "#de9459", "#e9b866"];
  const cols = warm ? hot : cool;
  const shown = markRate ? Math.min(marks, Math.max(0, Math.floor((t - markStart) * markRate))) : marks;
  return (
    <g transform={`translate(${x},${y}) scale(${s * (1 - crumple * 0.85)}) rotate(${crumple * 25})`}>
      <rect x={-6} y={-6} width={572} height={732} fill="#000" opacity={0.18} transform="translate(10,14)" />
      <rect width={560} height={720} rx={6} fill="#f7f6f2" />
      <text x={280} y={78} textAnchor="middle" fontFamily="Inter, Helvetica, Arial" fontWeight={800} fontSize={44} fill="#3d4148">
        {title}
      </text>
      <line x1={50} y1={104} x2={510} y2={104} stroke="#3d4148" strokeWidth={4} />
      {Array.from({ length: 28 }).map((_, i) => {
        const c = i % 7,
          r = Math.floor(i / 7);
        const cx = 40 + c * 70,
          cy = 130 + r * 140;
        const done = i < shown;
        const k = markRate ? lerp(t, markStart + i / markRate, markStart + (i + 0.8) / markRate, 0, 1) : 1;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={60} height={124} rx={6} fill={cols[(i * 3 + r) % 7]} opacity={0.9} />
            <rect x={cx + 10} y={cy + 30} width={40} height={5} fill="#fff" opacity={0.5} />
            <rect x={cx + 10} y={cy + 70} width={30} height={5} fill="#fff" opacity={0.5} />
            {done && kind === "x" && (
              <g stroke="#d9363e" strokeWidth={7} strokeLinecap="round" fill="none">
                <path d={`M${cx + 6},${cy + 8} L${cx + 54},${cy + 116}`} strokeDasharray={130} strokeDashoffset={130 * (1 - Math.min(1, k * 2))} />
                <path d={`M${cx + 54},${cy + 8} L${cx + 6},${cy + 116}`} strokeDasharray={130} strokeDashoffset={130 * (1 - Math.max(0, k * 2 - 1))} />
              </g>
            )}
            {done && kind === "check" && (
              <path
                d={`M${cx + 10},${cy + 66} L${cx + 26},${cy + 90} L${cx + 54},${cy + 30}`}
                stroke="#1f9a4a"
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={110}
                strokeDashoffset={110 * (1 - k)}
              />
            )}
          </g>
        );
      })}
      {crumple > 0 &&
        Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1={rand(i) * 560}
            y1={rand(i + 40) * 720}
            x2={rand(i + 80) * 560}
            y2={rand(i + 120) * 720}
            stroke="#7a7a7a"
            strokeWidth={2}
            opacity={crumple * 0.7}
          />
        ))}
    </g>
  );
};

/** Fitness watch close-up on a wrist. */
export const Watch: React.FC<{ mode: "timer" | "stats" }> = ({ mode }) => {
  const t = useT();
  const sec = Math.max(0, 59 - Math.floor(t * 1.0));
  const ring = mode === "timer" ? 1 - (60 - (59 - t)) / 60 : 1;
  const km = Math.min(0.54, t * 0.4).toFixed(2);
  return (
    <g transform="translate(1100,540) rotate(18)">
      <rect x={-130} y={-900} width={260} height={1800} rx={60} fill="#0d0f13" />
      <rect x={-190} y={-260} width={380} height={520} rx={70} fill="#1a1d22" stroke="#3a3f47" strokeWidth={6} />
      <rect x={-165} y={-235} width={330} height={470} rx={56} fill="#04060a" />
      {mode === "timer" ? (
        <g>
          <text x={0} y={-160} textAnchor="middle" fill="#c9cdd4" fontSize={28} fontFamily="Inter, Helvetica, Arial" fontWeight={600}>
            Timer
          </text>
          <circle cx={0} cy={-20} r={105} stroke="#3a2c10" strokeWidth={12} fill="none" />
          <circle
            cx={0}
            cy={-20}
            r={105}
            stroke="#ffad2e"
            strokeWidth={12}
            fill="none"
            strokeDasharray={660}
            strokeDashoffset={660 * (1 - Math.max(0.02, ring))}
            transform="rotate(-90 0 -20)"
            strokeLinecap="round"
          />
          <text x={0} y={2} textAnchor="middle" fill="#fff" fontSize={76} fontFamily="Inter, Helvetica, Arial" fontWeight={400}>
            0:{String(sec).padStart(2, "0")}
          </text>
          <circle cx={0} cy={150} r={36} fill="#5a3d0d" />
          <text x={0} y={158} textAnchor="middle" fill="#ffc46b" fontSize={22} fontFamily="Inter, Helvetica, Arial">
            Pause
          </text>
        </g>
      ) : (
        <g>
          <text x={0} y={-170} textAnchor="middle" fill="#c9cdd4" fontSize={26} fontFamily="Inter, Helvetica, Arial">
            Wed, Oct 22
          </text>
          <g transform="translate(0,-110)" stroke="#3ddc84" strokeWidth={9} strokeLinecap="round" fill="none">
            <circle cx={6} cy={-26} r={9} fill="#3ddc84" stroke="none" />
            <path d="M0,-12 L-6,14 L12,30 M-6,14 L-24,24 M0,-8 L-20,2 M2,-8 L22,4 L30,-6 M-6,14 L-2,30" />
          </g>
          <text x={0} y={40} textAnchor="middle" fill="#fff" fontSize={96} fontFamily="Inter, Helvetica, Arial">
            {km}
          </text>
          <text x={0} y={82} textAnchor="middle" fill="#9aa1ab" fontSize={28} fontFamily="Inter, Helvetica, Arial">
            km
          </text>
          <text x={0} y={150} textAnchor="middle" fill="#fff" fontSize={46} fontFamily="Inter, Helvetica, Arial">
            {t > 1.6 ? "4 min" : "1 min"}
          </text>
          <rect x={-60} y={172} width={120} height={6} rx={3} fill="#ffad2e" />
        </g>
      )}
    </g>
  );
};
