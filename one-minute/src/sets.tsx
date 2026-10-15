import React from "react";
import { AbsoluteFill } from "remotion";
import { Glow, H, W, rand, useT, Svg } from "./lib";

const SHOE_COLS = ["#4f86b8", "#5aa597", "#8a92a8", "#3f6f9e", "#77a6c2", "#6c7a8f", "#58a07e"];

export const Shoe: React.FC<{ x: number; y: number; s?: number; c?: string; tag?: boolean; dir?: 1 | -1; worn?: boolean }> = ({
  x,
  y,
  s = 1,
  c = "#5f7f9e",
  tag,
  dir = 1,
  worn,
}) => (
  <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
    <ellipse cx={0} cy={6} rx={118} ry={10} fill="#000" opacity={0.25} />
    <path d="M-110,0 L110,0 Q118,-4 112,-14 L-110,-14 Z" fill={worn ? "#c9c5bb" : "#eef1f4"} />
    <path d="M-104,-14 Q-110,-60 -70,-74 Q-40,-82 -10,-62 L30,-40 Q90,-34 108,-16 L108,-14 Z" fill={c} />
    <path d="M-60,-66 L-20,-40 M-48,-72 L-8,-46 M-36,-77 L4,-50" stroke="#f4f6f8" strokeWidth={5} strokeLinecap="round" />
    <path d="M-20,-30 Q30,-36 80,-22" stroke="#ffffff" strokeWidth={5} opacity={0.5} fill="none" />
    {worn && <path d="M-90,-20 l20,-10 M10,-28 l15,6 M60,-24 l12,-4" stroke="#3d4a58" strokeWidth={3} opacity={0.5} />}
    {tag && (
      <g transform="translate(-30,-40) rotate(18)">
        <line x1={0} y1={0} x2={10} y2={40} stroke="#ddd" strokeWidth={2} />
        <rect x={0} y={40} width={34} height={22} rx={3} fill="#f6f6f2" />
      </g>
    )}
  </g>
);

const MiniShoe: React.FC<{ x: number; y: number; c: string }> = ({ x, y, c }) => (
  <path
    transform={`translate(${x},${y})`}
    d="M0,0 Q-2,-14 10,-17 Q18,-18 24,-12 L36,-8 Q46,-6 46,0 Z"
    fill={c}
  />
);

/** Running-shoe store, front view. */
export const Store: React.FC<{ children?: React.ReactNode; top?: React.ReactNode; spring?: boolean; dim?: number }> = ({ children, top, spring, dim = 0 }) => {
  const units = [
    [540, 170],
    [990, 170],
  ];
  return (
    <>
      <defs>
        <linearGradient id="stWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe3e8" />
          <stop offset="1" stopColor="#c9ced5" />
        </linearGradient>
        <linearGradient id="stFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4d7dc" />
          <stop offset="1" stopColor="#9fa5ae" />
        </linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#stWall)" />
      <rect y={0} width={W} height={110} fill="#b9bec6" />
      <rect y={104} width={W} height={8} fill="#a3a9b2" />
      <rect y={640} width={W} height={440} fill="url(#stFloor)" />
      <line x1={0} y1={640} x2={W} y2={640} stroke="#a7adb5" strokeWidth={3} />
      {/* track lights */}
      <rect x={480} y={58} width={960} height={8} rx={4} fill="#5d636c" />
      {[560, 700, 840, 980, 1120, 1260, 1400].map((x) => (
        <g key={x}>
          <rect x={x - 10} y={64} width={20} height={26} rx={4} fill="#41464e" />
          <path d={`M${x - 10},90 L${x - 120},620 L${x + 120},620 L${x + 10},90 Z`} fill="url(#beam)" opacity={0.25} />
        </g>
      ))}
      {/* shelving */}
      {units.map(([ux, uy], ui) => (
        <g key={ui}>
          <rect x={ux - 14} y={uy - 14} width={418} height={432} fill="#f4f5f7" />
          {Array.from({ length: 36 }).map((_, i) => {
            const c = i % 6,
              r = Math.floor(i / 6);
            const cx = ux + c * 66,
              cy = uy + r * 68;
            return (
              <g key={i}>
                <rect x={cx} y={cy} width={60} height={62} fill="#ffffff" stroke="#dde1e6" strokeWidth={2} />
                <MiniShoe x={cx + 7} y={cy + 46} c={SHOE_COLS[Math.floor(rand(i + ui * 50) * 7)]} />
              </g>
            );
          })}
        </g>
      ))}
      {/* left wall */}
      <rect x={110} y={210} width={110} height={160} fill="#fafafa" stroke="#7d848e" strokeWidth={5} />
      <path d="M130,350 Q160,260 200,230" stroke="#7aa08b" strokeWidth={10} fill="none" />
      <rect x={270} y={250} width={90} height={110} fill="#d7dbe0" stroke="#7d848e" strokeWidth={3} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={282 + i * 24} y={268} width={18} height={18} fill={SHOE_COLS[i + 2]} />
      ))}
      <rect x={160} y={640} width={260} height={18} fill="#6c727b" />
      <rect x={175} y={658} width={10} height={70} fill="#6c727b" />
      <rect x={395} y={658} width={10} height={70} fill="#6c727b" />
      {/* right wall poster + treadmill */}
      <rect x={1640} y={230} width={110} height={150} fill="#2f343b" />
      <circle cx={1700} cy={270} r={9} fill="#e8ecef" />
      <path d="M1700,282 L1694,312 L1708,330 M1694,312 L1680,318 M1698,288 L1716,300" stroke="#e8ecef" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M1520,720 L1820,720 L1820,690 L1560,700 Z" fill="#4a5059" />
      <rect x={1560} y={470} width={14} height={230} fill="#4a5059" transform="rotate(-8 1567 585)" />
      <rect x={1530} y={460} width={110} height={44} rx={6} fill="#3b4048" />
      {/* counter */}
      {children}
      <rect x={520} y={598} width={880} height={22} fill="#f6f7f8" />
      <rect x={530} y={620} width={860} height={160} fill="#c3c8cf" />
      {Array.from({ length: 43 }).map((_, i) => (
        <rect key={i} x={536 + i * 20} y={626} width={10} height={150} fill="#b1b7bf" />
      ))}
      <rect x={1150} y={540} width={72} height={58} fill="#fff" stroke="#aab0b8" strokeWidth={2} />
      <text x={1186} y={566} textAnchor="middle" fontSize={15} fontWeight={800} fontFamily="Inter, Arial" fill="#2a2d31">
        14-DAY
      </text>
      <text x={1186} y={584} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="Inter, Arial" fill="#2a2d31">
        RETURNS
      </text>
      <rect x={660} y={556} width={38} height={42} fill="#3c4148" />
      <rect x={640} y={940} width={640} height={60} fill="#7c828b" opacity={0.5} />
      {top}
      {spring && <rect width={W} height={H} fill="#ffd9a0" opacity={0.08} />}
      {dim > 0 && <rect width={W} height={H} fill="#1a1f2a" opacity={dim} />}
    </>
  );
};

/** Reverse angle: runner at the counter, shop window and street behind. */
export const StoreWindow: React.FC<{ spring?: boolean; children?: React.ReactNode }> = ({ spring, children }) => {
  const t = useT();
  const sky = spring ? ["#9fd0f5", "#d9eefb"] : ["#c6ccd4", "#e3e6ea"];
  return (
    <>
      <defs>
        <linearGradient id="swSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#e7e9ec" />
      <rect x={60} y={80} width={1800} height={620} fill="url(#swSky)" />
      {/* street */}
      {[
        [60, 260, 380, "#cfc6bd"],
        [440, 200, 420, "#d8d3c9"],
        [880, 300, 360, spring ? "#e0c9a8" : "#d6d1ca"],
        [1260, 180, 400, "#b8aea6"],
        [1640, 260, 260, "#cfc8bf"],
      ].map(([x, y, w, c], i) => (
        <g key={i}>
          <rect x={x as number} y={y as number} width={w as number} height={600} fill={c as string} />
          {Array.from({ length: 6 }).map((_, j) => (
            <rect
              key={j}
              x={(x as number) + 30 + (j % 3) * ((w as number) / 3.2)}
              y={(y as number) + 40 + Math.floor(j / 3) * 110}
              width={(w as number) / 5}
              height={70}
              fill="#8e979f"
              opacity={0.7}
            />
          ))}
        </g>
      ))}
      <rect x={60} y={560} width={1800} height={140} fill={spring ? "#9aa0a6" : "#a7abb0"} />
      <g transform={`translate(${((t * 60) % 2400) - 300},0)`}>
        <rect x={0} y={590} width={190} height={56} rx={22} fill={spring ? "#d9534f" : "#eceef0"} />
        <rect x={34} y={566} width={110} height={40} rx={16} fill={spring ? "#c94440" : "#dfe2e5"} />
        <circle cx={40} cy={648} r={17} fill="#3a3d42" />
        <circle cx={150} cy={648} r={17} fill="#3a3d42" />
      </g>
      {/* tree */}
      <rect x={1470} y={80} width={20} height={480} fill="#5a4e44" />
      {Array.from({ length: spring ? 14 : 6 }).map((_, i) => (
        <circle
          key={i}
          cx={1480 + (rand(i) - 0.5) * 300}
          cy={110 + rand(i + 9) * 160}
          r={spring ? 70 : 24}
          fill={spring ? (i % 2 ? "#5fa847" : "#77bd57") : "#b9a991"}
          opacity={spring ? 1 : 0.7}
        />
      ))}
      {/* window frame */}
      <g fill="none" stroke="#6b7078" strokeWidth={14}>
        <rect x={60} y={80} width={1800} height={620} />
        <line x1={660} y1={80} x2={660} y2={700} />
        <line x1={1260} y1={80} x2={1260} y2={700} />
        <line x1={60} y1={150} x2={1860} y2={150} />
      </g>
      <rect x={60} y={80} width={1800} height={620} fill="#ffffff" opacity={0.12} />
      <path d="M200,80 L520,80 L260,700 L-60,700 Z" fill="#fff" opacity={0.08} />
      {children}
      {/* counter + drawers */}
      <rect x={0} y={700} width={W} height={26} fill="#f6f7f8" />
      <rect x={0} y={726} width={W} height={354} fill="#cdd1d6" />
      {Array.from({ length: 22 }).map((_, i) => {
        const c = i % 11,
          r = Math.floor(i / 11);
        return (
          <g key={i}>
            <rect x={20 + c * 172} y={760 + r * 150} width={156} height={120} fill="#5d6874" />
            <rect x={28 + c * 172} y={768 + r * 150} width={140} height={60} fill="#6f7b88" />
            <path d={`M${78 + c * 172},${800 + r * 150} q6,-10 20,-8 l18,6 l-38,0 z`} fill="#c8d0d8" />
          </g>
        );
      })}
      <rect x={300} y={640} width={180} height={60} fill="#f4f4f2" />
      <rect x={1260} y={640} width={200} height={60} fill="#f4f4f2" />
    </>
  );
};

/** Blurred back-of-head in the foreground for over-the-shoulder shots. */
export const ShoulderFG: React.FC<{ x: number; keeper?: boolean; s?: number }> = ({ x, keeper, s = 1 }) => (
  <g transform={`translate(${x},${H}) scale(${s})`} filter={`url(#fgb${Math.round(x)})`}>
    <defs>
      <filter id={`fgb${Math.round(x)}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={10} />
      </filter>
    </defs>
    <rect x={-150} y={-240} width={300} height={300} rx={120} fill="#090a0c" />
    <circle cx={0} cy={-330} r={135} fill="#090a0c" />
    {keeper && (
      <>
        <path d="M-140,-390 Q0,-440 140,-390 L140,-350 Q0,-400 -140,-350 Z" fill="#eceef0" />
        <path d="M40,-450 q170,-20 150,120 q-20,80 -80,110 q50,-120 -70,-230 z" fill="#090a0c" />
      </>
    )}
  </g>
);

/** Kitchen with fridge, window and counter. */
export const Kitchen: React.FC<{ night?: boolean; children?: React.ReactNode; poster?: React.ReactNode; morning?: boolean }> = ({
  night,
  children,
  poster,
  morning,
}) => (
  <>
    <defs>
      <linearGradient id="kWall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={night ? "#4b5059" : "#c3c7cd"} />
        <stop offset="1" stopColor={night ? "#3a3e45" : "#aeb3ba"} />
      </linearGradient>
      <linearGradient id="kFridge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={night ? "#b6bbc2" : "#f3f4f6"} />
        <stop offset="1" stopColor={night ? "#8f959d" : "#d9dce0"} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#kWall)" />
    <rect x={1460} y={180} width={420} height={360} fill={night ? "#1a2233" : morning ? "#f6c88b" : "#9cb0c6"} />
    {night && <Glow cx={1600} cy={260} r={90} color="#e8e2c6" o={0.4} id="kMoon" />}
    {!night &&
      [0, 1, 2, 3].map((i) => <circle key={i} cx={1520 + i * 100} cy={500} r={70} fill={morning ? "#d79b5d" : "#7c8f86"} opacity={0.9} />)}
    <g fill="none" stroke="#596069" strokeWidth={12}>
      <rect x={1460} y={180} width={420} height={360} />
      <line x1={1670} y1={180} x2={1670} y2={540} />
    </g>
    <rect x={1400} y={620} width={520} height={460} fill={night ? "#3b4048" : "#9aa0a8"} />
    <rect x={1390} y={600} width={540} height={26} fill={night ? "#61666e" : "#d6d9dd"} />
    {[1420, 1600, 1760].map((x) => (
      <rect key={x} x={x} y={660} width={150} height={380} fill="none" stroke={night ? "#2c3036" : "#868c94"} strokeWidth={4} />
    ))}
    {/* laptop */}
    <path d="M1700,598 L1880,598 L1860,470 L1720,470 Z" fill="#2c3036" />
    <rect x={1730} y={482} width={120} height={100} fill={night ? "#8ea0ba" : "#dfe6f0"} opacity={0.9} />
    {/* shoebox */}
    <rect x={1440} y={540} width={170} height={60} fill="#55616d" />
    <path d="M1490,580 q6,-10 20,-8 l18,6 l-38,0 z" fill="#c8d0d8" />
    {/* fridge */}
    <rect x={760} y={120} width={640} height={960} rx={18} fill="url(#kFridge)" />
    <line x1={760} y1={690} x2={1400} y2={690} stroke={night ? "#7d838b" : "#c3c7cc"} strokeWidth={4} />
    <rect x={800} y={260} width={16} height={360} rx={8} fill={night ? "#8b9199" : "#c9ccd1"} />
    <rect x={800} y={740} width={16} height={200} rx={8} fill={night ? "#8b9199" : "#c9ccd1"} />
    <rect x={1330} y={300} width={22} height={60} rx={8} fill="#d8443b" />
    <rect x={600} y={480} width={40} height={60} rx={6} fill={night ? "#888e96" : "#e6e8eb"} />
    {poster}
    {children}
  </>
);

/** Bed seen from above. */
export const Bedroom: React.FC<{ expr?: "sleep" | "awake" | "stretch"; light?: number; lamp?: boolean }> = ({ expr = "sleep", light = 0.25, lamp }) => {
  const t = useT();
  return (
    <>
      <rect width={W} height={H} fill="#2c3038" />
      <path d={`M${200 + t * 10},0 L${700 + t * 10},0 L${1300 + t * 10},${H} L${800 + t * 10},${H} Z`} fill="#c8d4e6" opacity={light * 0.5} />
      <rect x={620} y={80} width={680} height={1000} rx={20} fill="#59606c" />
      <rect x={640} y={100} width={300} height={170} rx={30} fill="#d9dde3" />
      <rect x={980} y={100} width={300} height={170} rx={30} fill="#d9dde3" />
      {expr === "stretch" ? (
        <>
          <rect x={640} y={520} width={640} height={540} rx={20} fill="#8c9ab0" />
          <path d="M660,520 Q960,470 1260,520" stroke="#a7b3c6" strokeWidth={30} fill="none" />
          <g transform="translate(1130,320)">
            <circle r={62} fill="#0d0f13" />
            <path d="M-30,6 q8,-12 16,0 M14,6 q8,-12 16,0" stroke="#f3f5f7" strokeWidth={5} fill="none" />
            <rect x={-40} y={50} width={80} height={140} rx={30} fill="#0d0f13" />
            <line x1={-30} y1={70} x2={-150} y2={-60 + Math.sin(t * 3) * 8} stroke="#0d0f13" strokeWidth={24} strokeLinecap="round" />
            <line x1={30} y1={70} x2={150} y2={-60 - Math.sin(t * 3) * 8} stroke="#0d0f13" strokeWidth={24} strokeLinecap="round" />
          </g>
        </>
      ) : (
        <>
          <g transform="translate(1130,230)">
            <circle r={62} fill="#0d0f13" />
            {expr === "sleep" ? (
              <path d="M-30,4 q8,6 16,0 M14,4 q8,6 16,0" stroke="#e9edf2" strokeWidth={4} fill="none" />
            ) : (
              <>
                <ellipse cx={-22} cy={2} rx={8} ry={6} fill="#f4f6f8" />
                <ellipse cx={22} cy={2} rx={8} ry={6} fill="#f4f6f8" />
              </>
            )}
          </g>
          <rect x={640} y={280} width={640} height={780} rx={20} fill="#8c9ab0" />
          <path d="M660,290 Q960,250 1260,290" stroke="#a7b3c6" strokeWidth={30} fill="none" />
          <rect x={1060} y={270} width={90} height={60} rx={30} fill="#0d0f13" />
        </>
      )}
      <rect x={1340} y={110} width={200} height={200} rx={10} fill="#3d424b" />
      <rect x={1370} y={140} width={56} height={100} rx={10} fill="#11141a" transform="rotate(-10 1398 190)" />
      {lamp && <Glow cx={1480} cy={170} r={260} color="#ffcf7a" o={0.6} id="bLamp" />}
      {lamp && <circle cx={1480} cy={170} r={34} fill="#fff1cf" />}
    </>
  );
};

/** Floor by the front door with a pair of shoes. */
export const DoorMat: React.FC<{ children?: React.ReactNode; leaves?: boolean; night?: boolean }> = ({ children, night }) => (
  <>
    <rect width={W} height={H} fill={night ? "#1e2127" : "#3b3f46"} />
    <rect x={0} y={0} width={W} height={560} fill={night ? "#2a2f38" : "#8f9aa6"} />
    {!night && (
      <>
        <rect x={0} y={260} width={W} height={300} fill="#a8b8a2" />
        <rect x={140} y={40} width={30} height={300} fill="#5a4b40" />
        {Array.from({ length: 10 }).map((_, i) => (
          <circle key={i} cx={155 + (rand(i) - 0.5) * 340} cy={60 + rand(i + 4) * 140} r={60} fill={i % 2 ? "#d99a45" : "#c47c32"} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} x={i * 130} y={300} width={14} height={150} fill="#6d5a4c" />
        ))}
        <rect x={0} y={330} width={W} height={12} fill="#6d5a4c" />
        <rect x={0} y={400} width={W} height={12} fill="#6d5a4c" />
      </>
    )}
    <rect x={900} y={0} width={36} height={560} fill="#2a2d33" />
    <rect x={0} y={556} width={W} height={20} fill="#2a2d33" />
    <rect x={460} y={760} width={1000} height={240} rx={10} fill="#2b2e33" />
    <rect x={480} y={780} width={960} height={200} rx={6} fill="none" stroke="#3d4148" strokeWidth={4} strokeDasharray="12 10" />
    {children}
  </>
);

const TreeBare: React.FC<{ x: number; y: number; h: number; seed: number; c?: string }> = ({ x, y, h, seed, c = "#1d1f24" }) => {
  const segs: React.ReactNode[] = [];
  const grow = (x0: number, y0: number, len: number, ang: number, w: number, d: number, k: number) => {
    const x1 = x0 + Math.sin(ang) * len;
    const y1 = y0 - Math.cos(ang) * len;
    segs.push(<line key={`${k}-${d}-${segs.length}`} x1={x0} y1={y0} x2={x1} y2={y1} stroke={c} strokeWidth={w} strokeLinecap="round" />);
    if (d === 0) return;
    const n = 2 + (rand(seed + k + d) > 0.6 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const a = ang + (i - (n - 1) / 2) * 0.55 + (rand(seed + k * 3 + i) - 0.5) * 0.3;
      grow(x1, y1, len * 0.7, a, w * 0.62, d - 1, k * 3 + i);
    }
  };
  grow(x, y, h * 0.42, 0, h * 0.05, 4, 1);
  return <g>{segs}</g>;
};

const TreeLeafy: React.FC<{ x: number; y: number; h: number; seed: number; cols: string[] }> = ({ x, y, h, seed, cols }) => (
  <g>
    <rect x={x - h * 0.03} y={y - h * 0.65} width={h * 0.06} height={h * 0.65} fill="#1d1f24" />
    {Array.from({ length: 9 }).map((_, i) => (
      <circle
        key={i}
        cx={x + (rand(seed + i) - 0.5) * h * 0.55}
        cy={y - h * 0.7 + (rand(seed + i + 20) - 0.5) * h * 0.35}
        r={h * (0.13 + rand(seed + i + 40) * 0.08)}
        fill={cols[i % cols.length]}
      />
    ))}
  </g>
);

/** A repeating horizontal layer that scrolls for parallax. */
const Scroll: React.FC<{ speed: number; children: React.ReactNode }> = ({ speed, children }) => {
  const t = useT();
  const off = -((t * speed) % W);
  return (
    <g transform={`translate(${off},0)`}>
      <g>{children}</g>
      <g transform={`translate(${W},0)`}>{children}</g>
    </g>
  );
};

type StreetMode = "night" | "dusk" | "rain";

/** Side-scrolling neighbourhood street with lamps. */
export const Street: React.FC<{ mode?: StreetMode; speed?: number; children?: React.ReactNode }> = ({
  mode = "night",
  speed = 1,
  children,
}) => {
  const sky =
    mode === "dusk" ? ["#2b2d52", "#b26a5b", "#e9a46a"] : mode === "rain" ? ["#0d1118", "#1b2230", "#262d3a"] : ["#080b14", "#141a2a", "#232a3c"];
  return (
    <>
      <defs>
        <linearGradient id={`sky${mode}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="0.65" stopColor={sky[1]} />
          <stop offset="1" stopColor={sky[2]} />
        </linearGradient>
        <linearGradient id="pave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mode === "rain" ? "#2a3240" : "#2b2f37"} />
          <stop offset="1" stopColor={mode === "rain" ? "#151a22" : "#17191e"} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#sky${mode})`} />
      {mode === "night" &&
        Array.from({ length: 70 }).map((_, i) => (
          <circle key={i} cx={rand(i) * W} cy={rand(i + 100) * 420} r={rand(i + 200) * 1.8 + 0.4} fill="#fff" opacity={0.3 + rand(i + 300) * 0.5} />
        ))}
      {mode === "night" && <Glow cx={1500} cy={170} r={140} color="#dfe6ff" o={0.35} id="moon" />}
      {mode === "night" && <circle cx={1500} cy={170} r={40} fill="#eef1ff" opacity={0.9} />}
      <Scroll speed={20 * speed}>
        <path d="M0,620 Q300,520 600,590 T1200,570 T1920,600 L1920,700 L0,700 Z" fill={mode === "dusk" ? "#4a3d55" : "#121722"} />
      </Scroll>
      <Scroll speed={70 * speed}>
        {Array.from({ length: 6 }).map((_, i) => {
          const x = i * 330 + 20;
          const h = 200 + rand(i) * 90;
          return (
            <g key={i}>
              <rect x={x} y={700 - h} width={260} height={h} fill={mode === "dusk" ? "#2f2a3c" : "#1a1f2b"} />
              <path d={`M${x - 16},${700 - h} L${x + 130},${640 - h} L${x + 276},${700 - h} Z`} fill={mode === "dusk" ? "#2a2535" : "#161a25"} />
              {Array.from({ length: 4 }).map((__, j) => (
                <rect
                  key={j}
                  x={x + 34 + (j % 2) * 120}
                  y={700 - h + 40 + Math.floor(j / 2) * 70}
                  width={56}
                  height={40}
                  fill={rand(i * 4 + j) > 0.45 ? "#ffcf7a" : "#2a3142"}
                  opacity={0.9}
                />
              ))}
            </g>
          );
        })}
      </Scroll>
      <Scroll speed={140 * speed}>
        {[150, 800, 1450].map((x, i) => (
          <g key={i}>
            <TreeBare x={x} y={720} h={420} seed={i * 11} c={mode === "dusk" ? "#231f2c" : "#0e1118"} />
          </g>
        ))}
      </Scroll>
      <rect x={0} y={700} width={W} height={380} fill="url(#pave)" />
      <rect x={0} y={700} width={W} height={10} fill="#3a404b" />
      <Scroll speed={300 * speed}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={i * 240} y={860} width={4} height={220} fill="#3b414c" opacity={0.6} transform={`skewX(-40)`} />
        ))}
        {[300, 1260].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={900} rx={340} ry={70} fill="#ffc46b" opacity={mode === "rain" ? 0.22 : 0.16} />
            {mode === "rain" && <rect x={x - 10} y={900} width={20} height={180} fill="#ffc46b" opacity={0.18} />}
            <Glow cx={x} cy={300} r={260} color="#ffc46b" o={0.55} id={`lamp${i}${mode}`} />
            <rect x={x - 7} y={300} width={14} height={600} fill="#0b0d12" />
            <path d={`M${x - 26},300 L${x + 26},300 L${x + 16},262 L${x - 16},262 Z`} fill="#fff1cf" />
          </g>
        ))}
      </Scroll>
      {children}
    </>
  );
};

/** Side-scrolling park path; autumn or winter. */
export const Park: React.FC<{ season: "autumn" | "winter"; children?: React.ReactNode }> = ({ season, children }) => {
  const autumn = season === "autumn";
  const cols = ["#e8a03a", "#d9822b", "#f2bc4f", "#c86a24"];
  return (
    <>
      <defs>
        <linearGradient id={`pk${season}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={autumn ? "#2f3558" : "#3a4258"} />
          <stop offset="1" stopColor={autumn ? "#d9a27a" : "#9aa6b8"} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#pk${season})`} />
      <Scroll speed={25}>
        <path d="M0,560 Q480,480 960,540 T1920,530 L1920,700 L0,700 Z" fill={autumn ? "#4d4766" : "#59627a"} />
      </Scroll>
      <rect x={0} y={640} width={W} height={440} fill={autumn ? "#43553b" : "#5b6152"} />
      <Scroll speed={90}>
        {[100, 460, 820, 1180, 1540].map((x, i) =>
          autumn ? (
            <TreeLeafy key={i} x={x} y={660} h={320} seed={i * 7} cols={cols} />
          ) : (
            <TreeBare key={i} x={x} y={660} h={320} seed={i * 7} c="#2a2c33" />
          ),
        )}
      </Scroll>
      <path d="M0,820 L1920,820 L1920,940 L0,940 Z" fill={autumn ? "#5b5148" : "#6d6c6a"} />
      <Scroll speed={260}>
        {[200, 900, 1600].map((x, i) =>
          autumn ? (
            <TreeLeafy key={i} x={x} y={1100} h={900} seed={i * 13 + 3} cols={cols} />
          ) : (
            <TreeBare key={i} x={x} y={1100} h={900} seed={i * 13 + 3} c="#1e2026" />
          ),
        )}
        {Array.from({ length: 30 }).map((_, i) => (
          <ellipse key={i} cx={rand(i) * W} cy={960 + rand(i + 5) * 100} rx={10} ry={4} fill={autumn ? cols[i % 4] : "#8b8f96"} />
        ))}
      </Scroll>
      {children}
    </>
  );
};

/** Bright spring hill with a winding path and a town beyond. */
export const Hill: React.FC<{ children?: React.ReactNode; vista?: boolean }> = ({ children, vista }) => {
  const t = useT();
  return (
    <>
      <defs>
        <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f9be0" />
          <stop offset="1" stopColor="#cfe9fb" />
        </linearGradient>
        <linearGradient id="hGrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ccf55" />
          <stop offset="1" stopColor="#4c9a35" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#hSky)" />
      <Glow cx={1550} cy={160} r={380} color="#fff6d8" o={0.8} id="sun" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${((i * 600 + t * 25) % 2400) - 300},${90 + i * 45})`} opacity={0.9}>
          <ellipse cx={0} cy={0} rx={120} ry={34} fill="#fff" />
          <ellipse cx={60} cy={-18} rx={80} ry={32} fill="#fff" />
          <ellipse cx={-50} cy={-10} rx={70} ry={26} fill="#fff" />
        </g>
      ))}
      {vista ? (
        <>
          <path d="M0,520 Q960,470 1920,520 L1920,1080 L0,1080 Z" fill="#9ccf73" />
          {Array.from({ length: 60 }).map((_, i) => {
            const x = 300 + rand(i) * 1300,
              y = 520 + rand(i + 50) * 120;
            return (
              <g key={i}>
                <rect x={x} y={y} width={36} height={24} fill={["#f1ece2", "#e8d9c4", "#dfe5ea"][i % 3]} />
                <path d={`M${x - 4},${y} L${x + 18},${y - 14} L${x + 40},${y} Z`} fill={["#b9574a", "#8b6b5c", "#5d6f86"][i % 3]} />
              </g>
            );
          })}
          <path d="M0,740 Q960,640 1920,740 L1920,1080 L0,1080 Z" fill="url(#hGrass)" />
        </>
      ) : (
        <>
          <path d="M-200,1080 Q600,180 1500,420 Q1800,500 2100,640 L2100,1080 Z" fill="url(#hGrass)" />
          <path
            d="M500,1080 Q560,900 780,860 Q1000,820 900,700 Q820,600 1040,520 Q1200,470 1250,400"
            stroke="#e3cf9f"
            strokeWidth={34}
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
      {Array.from({ length: 140 }).map((_, i) => {
        const x = rand(i * 3) * W,
          y = (vista ? 760 : 520) + rand(i * 5) * 560;
        const sw = Math.sin(t * 2 + i) * 6;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x + sw} y2={y - 26 - rand(i) * 30} stroke="#3f8a2c" strokeWidth={3} />
            {i % 4 === 0 && <circle cx={x + sw} cy={y - 30} r={5} fill={["#ffd84d", "#ffffff", "#c58cf2", "#ff8fa3"][i % 4 === 0 ? (i / 4) % 4 : 0]} />}
          </g>
        );
      })}
      {children}
    </>
  );
};

/** Big window looking onto an autumn yard; for the low point. */
export const WindowRoom: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <rect width={W} height={H} fill="#3a3e45" />
    <rect x={420} y={40} width={1080} height={760} fill="#8f9fae" />
    <path d="M420,520 Q800,420 1100,480 T1500,460 L1500,800 L420,800 Z" fill="#6f7d76" />
    <rect x={420} y={560} width={1080} height={240} fill="#8fa287" />
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={440 + i * 92} y={590} width={12} height={130} fill="#5b4d43" />
    ))}
    <rect x={420} y={620} width={1080} height={10} fill="#5b4d43" />
    <rect x={420} y={670} width={1080} height={10} fill="#5b4d43" />
    <path d="M1240,600 L1320,540 L1400,600 L1400,700 L1240,700 Z" fill="#9aa7a4" />
    <rect x={560} y={40} width={30} height={560} fill="#4c3f37" />
    {Array.from({ length: 12 }).map((_, i) => (
      <circle key={i} cx={575 + (rand(i) - 0.3) * 420} cy={80 + rand(i + 3) * 200} r={60 + rand(i + 9) * 30} fill={["#d99a45", "#c47c32", "#e6b05c"][i % 3]} />
    ))}
    <g fill="none" stroke="#24272c" strokeWidth={20}>
      <rect x={420} y={40} width={1080} height={760} />
      <line x1={960} y1={40} x2={960} y2={800} />
    </g>
    <rect x={0} y={800} width={W} height={280} fill="#1f2227" />
    <path d="M420,800 L1500,800 L1700,1080 L220,1080 Z" fill="#c9d3dc" opacity={0.08} />
    {children}
  </>
);

export const Paper: React.FC<{ x: number; y: number; s?: number; text?: string; draw?: number; warm?: boolean }> = ({
  x,
  y,
  s = 1,
  text,
  draw = 1,
  warm,
}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={8} y={12} width={420} height={540} fill="#000" opacity={0.2} />
    <rect width={420} height={540} fill={warm ? "#f6e9cf" : "#f3f3f1"} />
    {Array.from({ length: 10 }).map((_, i) => (
      <line key={i} x1={rand(i) * 420} y1={rand(i + 7) * 540} x2={rand(i + 14) * 420} y2={rand(i + 21) * 540} stroke="#c9c9c6" strokeWidth={2} />
    ))}
    <circle cx={30} cy={20} r={9} fill="#5d7fa8" />
    <circle cx={390} cy={20} r={9} fill="#5fa07e" />
    {text && (
      <g fill="none" stroke="#d83a3a" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round">
        {[
          "M70,190 L100,170 L100,380",
          "M170,380 L170,180 L215,290 L260,180 L260,380",
          "M300,180 L300,380",
          "M340,380 L340,180 L395,380 L395,180",
        ].map((d, i) => {
          const k = Math.min(1, Math.max(0, draw * 4 - i));
          return <path key={i} d={d} strokeDasharray={700} strokeDashoffset={700 * (1 - k)} transform="translate(-20,0) scale(1,1)" />;
        })}
      </g>
    )}
  </g>
);

export const Full: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <AbsoluteFill style={{ background: bg }}>
    <Svg>{children}</Svg>
  </AbsoluteFill>
);
