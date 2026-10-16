import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const C = {
  navy: '#1b2a4e',
  paper: '#fbf7ee',
  paper2: '#f3ecdc',
  yellow: '#ffd23f',
  orange: '#ff7a2f',
  red: '#e63946',
  blue: '#4a94ee',
  sky: '#8fd0ff',
  green: '#3fb37f',
  grey: '#9aa3b5',
};
export const FONT = '"Inter Display", Inter, sans-serif';
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ez = Easing.out(Easing.cubic);

export const usePop = (at: number, damping = 12, stiffness = 180) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f < at ? 0 : spring({ frame: f - at, fps, config: { damping, stiffness } });
};

export const lerp = (f: number, a: number, b: number, v0: number, v1: number, e = ez) =>
  interpolate(f, [a, b], [v0, v1], { ...clamp, easing: e });

/** paper background with drifting dot grid */
export const Paper: React.FC<{ tint?: string; children?: React.ReactNode; dark?: boolean }> = ({ tint = C.paper, children, dark }) => {
  const f = useCurrentFrame();
  const bg = dark ? '#121a33' : tint;
  const dot = dark ? 'rgba(255,255,255,0.07)' : 'rgba(27,42,78,0.09)';
  return (
    <AbsoluteFill style={{ background: bg, fontFamily: FONT, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dot} 2.5px, transparent 2.6px)`,
          backgroundSize: '44px 44px',
          backgroundPosition: `${(f * 0.6) % 44}px ${(f * 0.3) % 44}px`,
        }}
      />
      {children}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(10,16,40,0.18) 100%)' }} />
    </AbsoluteFill>
  );
};

export const Box: React.FC<{ x: number; y: number; w: number; h?: number; at?: number; children: React.ReactNode; bg?: string; rot?: number; pad?: number }> = ({
  x, y, w, h, at = 0, children, bg = C.paper, rot = 0, pad = 40,
}) => {
  const p = usePop(at);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: w, height: h, padding: pad, boxSizing: 'border-box',
        background: bg, border: `6px solid ${C.navy}`, borderRadius: 30, boxShadow: `12px 12px 0 ${C.navy}`,
        transform: `scale(${p}) rotate(${rot + (1 - p) * -5}deg)`, opacity: p > 0 ? 1 : 0, fontFamily: FONT, color: C.navy,
      }}
    >
      {children}
    </div>
  );
};

export const Txt: React.FC<{ x: number; y: number; at?: number; size?: number; color?: string; children: React.ReactNode; w?: number; align?: 'left' | 'center' | 'right'; weight?: number; stroke?: boolean }> = ({
  x, y, at = 0, size = 80, color = C.navy, children, w = 1600, align = 'left', weight = 900, stroke,
}) => {
  const p = usePop(at, 11, 220);
  return (
    <div
      style={{
        position: 'absolute', left: align === 'center' ? x - w / 2 : x, top: y, width: w, textAlign: align,
        fontFamily: FONT, fontWeight: weight, fontSize: size, color, lineHeight: 1.05, letterSpacing: -1,
        transform: `translateY(${(1 - p) * 30}px) scale(${0.85 + p * 0.15})`, opacity: p,
        WebkitTextStroke: stroke ? `${Math.round(size / 9)}px ${C.navy}` : undefined, paintOrder: 'stroke fill',
      }}
    >
      {children}
    </div>
  );
};

/** rubber stamp that slams in */
export const Stamp: React.FC<{ x: number; y: number; at: number; text: string; color?: string; rot?: number; size?: number }> = ({ x, y, at, text, color = C.red, rot = -12, size = 90 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = f - at;
  const s = interpolate(k, [0, 5, 9], [2.4, 0.92, 1], clamp);
  const o = interpolate(k, [0, 3], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o,
        border: `10px solid ${color}`, borderRadius: 18, padding: '6px 34px', color, fontFamily: FONT, fontWeight: 900,
        fontSize: size, letterSpacing: 4, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.15)',
      }}
    >
      {text}
    </div>
  );
};

/** episode title */
export const TitleCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = usePop(0, 10, 160);
  const b = usePop(8, 10, 160);
  const shake = f < 14 ? Math.sin(f * 3) * (14 - f) * 0.8 : 0;
  return (
    <Paper tint={C.yellow}>
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.6}deg at 50% 55%, rgba(255,255,255,0.35) 0deg 10deg, transparent 10deg 20deg)` }} />
      <div style={{ position: 'absolute', top: 270, width: '100%', textAlign: 'center', transform: `translateX(${shake}px)` }}>
        <div style={{ fontSize: 96, fontWeight: 900, color: C.navy, letterSpacing: 6, transform: `scale(${a})` }}>WHAT IF YOU WERE</div>
        <div
          style={{
            fontSize: 330, fontWeight: 900, color: '#ffffff', WebkitTextStroke: `22px ${C.navy}`, paintOrder: 'stroke fill', lineHeight: 1,
            textShadow: `16px 16px 0 ${C.navy}`, transform: `scale(${b}) rotate(${(1 - b) * 8 - 3}deg)`,
          }}
        >
          50× FASTER?
        </div>
      </div>
    </Paper>
  );
};

/** "PROBLEM 2/5 — THE AIR" interstitial */
export const ProblemCard: React.FC<{ n: number; name: string; icon: string }> = ({ n, name, icon }) => {
  const f = useCurrentFrame();
  const a = usePop(0, 11, 200);
  const b = usePop(6, 11, 200);
  return (
    <Paper tint={C.navy} dark>
      <div style={{ position: 'absolute', top: 300, width: '100%', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 70, fontWeight: 800, letterSpacing: 12, color: C.yellow, transform: `scale(${a})` }}>PROBLEM {n} OF 5</div>
        <div style={{ fontSize: 200, fontWeight: 900, transform: `scale(${b})`, marginTop: 20 }}>
          <span style={{ marginRight: 40 }}>{icon}</span>
          {name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 60 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ width: 120, height: 22, borderRadius: 11, background: i < n ? C.yellow : i === n ? (f % 16 < 8 ? C.yellow : '#fff') : 'rgba(255,255,255,0.18)' }} />
          ))}
        </div>
      </div>
    </Paper>
  );
};

/** small persistent progress chip */
export const ProblemChip: React.FC<{ n: number; name: string }> = ({ n, name }) => {
  const p = usePop(4);
  return (
    <div
      style={{
        position: 'absolute', left: 40, top: 36, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 26px',
        background: C.navy, color: '#fff', borderRadius: 40, fontFamily: FONT, fontWeight: 800, fontSize: 30,
        transform: `translateX(${(1 - p) * -400}px)`, boxShadow: '0 6px 0 rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: i <= n ? C.yellow : 'rgba(255,255,255,0.25)' }} />
        ))}
      </div>
      <span>PROBLEM {n}: {name}</span>
    </div>
  );
};

/** analog speedometer */
export const Gauge: React.FC<{ x: number; y: number; r?: number; keys: [number, number][]; max?: number; label?: string; shake?: number; redFrom?: number }> = ({
  x, y, r = 300, keys, max = 1400, label = 'km/h', shake = 0, redFrom,
}) => {
  const f = useCurrentFrame();
  const frames = keys.map((k) => k[0]);
  const vals = keys.map((k) => k[1]);
  const v = frames.length > 1 ? interpolate(f, frames, vals, { ...clamp, easing: Easing.out(Easing.back(1.4)) }) : vals[0];
  const ang = (val: number) => -210 + (val / max) * 240;
  const jitter = shake ? Math.sin(f * 2.3) * shake : 0;
  const a = ((ang(v) + jitter) * Math.PI) / 180;
  const ticks = Array.from({ length: 15 }, (_, i) => (i * max) / 14);
  return (
    <svg style={{ position: 'absolute', left: x - r - 20, top: y - r - 20 }} width={2 * r + 40} height={2 * r + 40}>
      <g transform={`translate(${r + 20},${r + 20})`}>
        <circle r={r} fill={C.paper} stroke={C.navy} strokeWidth={10} />
        {redFrom && (
          <path
            d={(() => {
              const s = (ang(redFrom) * Math.PI) / 180;
              const e = (ang(max) * Math.PI) / 180;
              const rr = r - 34;
              return `M ${Math.cos(s) * rr} ${Math.sin(s) * rr} A ${rr} ${rr} 0 0 1 ${Math.cos(e) * rr} ${Math.sin(e) * rr}`;
            })()}
            stroke={C.red}
            strokeWidth={22}
            fill="none"
          />
        )}
        {ticks.map((t, i) => {
          const q = (ang(t) * Math.PI) / 180;
          return (
            <g key={i}>
              <line x1={Math.cos(q) * (r - 14)} y1={Math.sin(q) * (r - 14)} x2={Math.cos(q) * (r - (i % 2 ? 40 : 58))} y2={Math.sin(q) * (r - (i % 2 ? 40 : 58))} stroke={C.navy} strokeWidth={i % 2 ? 5 : 8} />
              {i % 2 === 0 && (
                <text x={Math.cos(q) * (r - 100)} y={Math.sin(q) * (r - 100) + 12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.navy}>
                  {Math.round(t)}
                </text>
              )}
            </g>
          );
        })}
        <line x1={0} y1={0} x2={Math.cos(a) * (r - 60)} y2={Math.sin(a) * (r - 60)} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
        <circle r={26} fill={C.navy} />
        <text y={r * 0.42} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={C.navy}>
          {Math.round(v).toLocaleString('en-US')}
        </text>
        <text y={r * 0.42 + 54} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.navy} opacity={0.7}>
          {label}
        </text>
      </g>
    </svg>
  );
};

export type BarRow = { label: string; value: number; display: string; color: string; at: number };
export const Bars: React.FC<{ x: number; y: number; w: number; rows: BarRow[]; max: number; title?: string; titleAt?: number; log?: boolean }> = ({ x, y, w, rows, max, title, titleAt = 0, log }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, fontFamily: FONT, color: C.navy }}>
      {title && <Txt x={0} y={-110} at={titleAt} size={64}>{title}</Txt>}
      {rows.map((r, i) => {
        const g = lerp(f, r.at, r.at + 20, 0, 1);
        const frac = log ? Math.log10(1 + r.value) / Math.log10(1 + max) : r.value / max;
        return (
          <div key={i} style={{ marginTop: i ? 34 : 0, opacity: f >= r.at ? 1 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 44, fontWeight: 800 }}>
              <span>{r.label}</span>
              <span style={{ opacity: g }}>{r.display}</span>
            </div>
            <div style={{ height: 50, marginTop: 10, borderRadius: 25, border: `6px solid ${C.navy}`, overflow: 'hidden', background: '#fff' }}>
              <div style={{ width: `${Math.max(0.6, frac * 100) * g}%`, height: '100%', background: r.color, borderRight: `6px solid ${C.navy}` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** stopwatch race: you vs Max */
export const TimerDuel: React.FC<{ title: string; you: number; max: number; at?: number; dur?: number }> = ({ title, you, max, at = 0, dur = 50 }) => {
  const f = useCurrentFrame();
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const p = lerp(f, at, at + dur, 0, 1, Easing.linear);
  const yt = you * p;
  const mt = Math.min(max, you * p);
  const clock = (label: string, t: number, done: boolean, col: string, xx: number, delay: number) => (
    <Box x={xx} y={420} w={640} at={at + delay} bg={done ? C.yellow : C.paper}>
      <div style={{ fontSize: 46, fontWeight: 800, opacity: 0.75 }}>{label}</div>
      <div style={{ fontSize: 170, fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: col, lineHeight: 1 }}>{fmt(t)}</div>
      <div style={{ fontSize: 40, fontWeight: 800, marginTop: 6, opacity: done ? 1 : 0 }}>DONE ✔</div>
    </Box>
  );
  return (
    <Paper>
      <Txt x={960} y={170} at={at} size={100} align="center">{title}</Txt>
      {clock('YOU', yt, p >= 1, C.navy, 220, 4)}
      {clock('MAX', mt, mt >= max, C.orange, 1060, 8)}
    </Paper>
  );
};

/** two-column rule sheet */
export const Rules: React.FC<{ up: [string, number][]; normal: [string, number][]; normalAt: number; wobbleAt?: number }> = ({ up, normal, normalAt, wobbleAt = 1e9 }) => {
  const f = useCurrentFrame();
  const wob = (i: number) => (f > wobbleAt ? Math.sin((f - wobbleAt) * 0.4 + i) * 3 : 0);
  const col = (title: string, color: string, items: [string, number][], x: number, at: number, mark: string) => (
    <Box x={x} y={200} w={760} h={720} at={at}>
      <div style={{ fontSize: 58, fontWeight: 900, color, letterSpacing: 2 }}>{title}</div>
      {items.map(([t, a], i) => {
        const p = f >= a ? spring({ frame: f - a, fps: 30, config: { damping: 12, stiffness: 200 } }) : 0;
        return (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 30, fontSize: 64, fontWeight: 800, opacity: p, transform: `translateX(${(1 - p) * 60}px) rotate(${wob(i)}deg)` }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46 }}>{mark}</div>
            {t}
          </div>
        );
      })}
    </Box>
  );
  return (
    <Paper>
      {col('UPGRADED 50×', C.green, up, 150, up[0][1] - 6, '✔')}
      {col('STAYS NORMAL', C.red, normal, 1010, normalAt, '✘')}
    </Paper>
  );
};

export const Inbox: React.FC<{ at: number; items: string[] }> = ({ at, items }) => {
  const f = useCurrentFrame();
  return (
    <Paper tint="#eef3fb">
      <Box x={330} y={110} w={1260} h={860} at={at} pad={0}>
        <div style={{ background: C.navy, color: '#fff', padding: '22px 36px', fontSize: 44, fontWeight: 800, borderRadius: '22px 22px 0 0' }}>📥 Sent — Max</div>
        {items.map((t, i) => {
          const a = at + 10 + i * 10;
          const o = f >= a ? 1 : 0;
          return (
            <div key={i} style={{ display: 'flex', gap: 24, padding: '26px 36px', borderBottom: `3px solid rgba(27,42,78,0.15)`, fontSize: 42, fontWeight: 700, opacity: o, transform: `translateY(${o ? 0 : 20}px)` }}>
              <span style={{ fontWeight: 900, width: 220 }}>To: {['Boss', 'Mum', 'HR', 'Everyone', 'Dave', 'Bank'][i % 6]}</span>
              <span>{t}</span>
            </div>
          );
        })}
      </Box>
    </Paper>
  );
};

/** grip vs drag graph */
export const GripGraph: React.FC<{ at: number; crossAt: number }> = ({ at, crossAt }) => {
  const f = useCurrentFrame();
  const W = 1300;
  const H = 640;
  const vmax = 260;
  const grip = 0.55; // fraction of H
  const drag = (v: number) => grip * (v / 172) ** 2;
  const draw = lerp(f, at, at + 45, 0, 1);
  const pts = Array.from({ length: 80 }, (_, i) => {
    const v = (i / 79) * vmax * draw;
    return `${(v / vmax) * W},${H - Math.min(1.05, drag(v)) * H}`;
  }).join(' ');
  const cx = (172 / vmax) * W;
  const cy = H - grip * H;
  const cp = usePop(crossAt);
  return (
    <Paper>
      <Txt x={960} y={70} at={at - 10} size={76} align="center">Push from grip vs push-back from air</Txt>
      <svg style={{ position: 'absolute', left: 310, top: 240 }} width={W + 40} height={H + 80}>
        <line x1={0} y1={H} x2={W} y2={H} stroke={C.navy} strokeWidth={8} />
        <line x1={0} y1={0} x2={0} y2={H} stroke={C.navy} strokeWidth={8} />
        <line x1={0} y1={cy} x2={W * draw} y2={cy} stroke={C.green} strokeWidth={12} strokeDasharray="30 16" />
        <polyline points={pts} fill="none" stroke={C.red} strokeWidth={12} strokeLinecap="round" />
        <text x={W - 10} y={cy - 22} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.green}>SHOE GRIP (max push)</text>
        <text x={W * 0.9} y={60} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.red} opacity={draw}>AIR RESISTANCE</text>
        <text x={W / 2} y={H + 64} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.navy}>speed →</text>
        {cp > 0 && (
          <g transform={`translate(${cx},${cy}) scale(${cp})`}>
            <circle r={30} fill={C.yellow} stroke={C.navy} strokeWidth={8} />
            <rect x={-150} y={-150} width={300} height={90} rx={20} fill={C.navy} />
            <text y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#fff">170 km/h</text>
          </g>
        )}
      </svg>
    </Paper>
  );
};

/** cube law bars */
export const CubeLaw: React.FC<{ at: number; eightAt: number; fiftyAt: number }> = ({ at, eightAt, fiftyAt }) => {
  const f = useCurrentFrame();
  const rows: [string, number, string, number][] = [
    ['1× speed', 1, '1×', at],
    ['2× speed', 8, '8×', eightAt],
    ['3× speed', 27, '27×', eightAt + 12],
    ['50× speed', 125000, '125,000×', fiftyAt],
  ];
  return (
    <Paper>
      <Txt x={960} y={80} at={at} size={84} align="center">Power needed to push the air</Txt>
      {rows.map(([l, v, d, a], i) => {
        const g = lerp(f, a, a + 22, 0, 1);
        const wpx = i === 3 ? 2400 * g : Math.min(1200, v * 40) * g;
        return (
          <div key={i} style={{ position: 'absolute', left: 140, top: 300 + i * 160, opacity: f >= a ? 1 : 0, fontFamily: FONT, color: C.navy }}>
            <div style={{ fontSize: 44, fontWeight: 800, width: 280, display: 'inline-block' }}>{l}</div>
            <div style={{ position: 'absolute', left: 300, top: -6, height: 70, width: wpx, background: i === 3 ? C.red : C.orange, border: `6px solid ${C.navy}`, borderRadius: 18 }} />
            <div style={{ position: 'absolute', left: 300 + Math.min(wpx, 1300) + 26, top: -2, fontSize: 56, fontWeight: 900, opacity: g, whiteSpace: 'nowrap' }}>{d}</div>
          </div>
        );
      })}
    </Paper>
  );
};

export const Burgers: React.FC<{ at: number; n: number; label: string }> = ({ at, n, label }) => {
  const f = useCurrentFrame();
  return (
    <Paper tint="#fff3e0">
      <Txt x={960} y={170} at={at} size={110} align="center">{label}</Txt>
      <div style={{ position: 'absolute', top: 460, width: '100%', display: 'flex', justifyContent: 'center', gap: 40 }}>
        {Array.from({ length: n }, (_, i) => {
          const p = f >= at + 8 + i * 6 ? spring({ frame: f - at - 8 - i * 6, fps: 30, config: { damping: 9, stiffness: 220 } }) : 0;
          return (
            <svg key={i} width={260} height={230} style={{ transform: `scale(${p}) translateY(${Math.sin((f + i * 8) / 6) * 6}px)` }}>
              <path d="M20 110 Q130 -10 240 110 Z" fill="#e8a24a" stroke={C.navy} strokeWidth={8} />
              <rect x={14} y={110} width={232} height={26} rx={10} fill="#5fbf5a" stroke={C.navy} strokeWidth={7} />
              <rect x={20} y={136} width={220} height={34} rx={12} fill="#7a3e1d" stroke={C.navy} strokeWidth={7} />
              <rect x={14} y={170} width={232} height={14} rx={6} fill={C.yellow} stroke={C.navy} strokeWidth={6} />
              <path d="M20 186 L240 186 Q240 222 130 222 Q20 222 20 186 Z" fill="#e8a24a" stroke={C.navy} strokeWidth={8} />
              {[60, 110, 160, 200].map((sx, k) => (
                <ellipse key={k} cx={sx} cy={60 + (k % 2) * 16} rx={7} ry={4} fill="#fff6d8" />
              ))}
            </svg>
          );
        })}
      </div>
    </Paper>
  );
};

export const Pie: React.FC<{ at: number; usefulAt: number; wasteAt: number }> = ({ at, usefulAt, wasteAt }) => {
  const f = useCurrentFrame();
  const g = lerp(f, at, at + 30, 0, 1);
  const r = 260;
  const a = 0.25 * 2 * Math.PI * g;
  const x = Math.sin(a) * r;
  const y = -Math.cos(a) * r;
  return (
    <Paper>
      <Txt x={960} y={80} at={at} size={84} align="center">Where Max's food energy goes</Txt>
      <svg style={{ position: 'absolute', left: 260, top: 260 }} width={640} height={640}>
        <g transform="translate(320,320)">
          <circle r={r} fill="#ff9b6a" stroke={C.navy} strokeWidth={10} />
          <path d={`M0 0 L0 ${-r} A ${r} ${r} 0 0 1 ${x} ${y} Z`} fill={C.green} stroke={C.navy} strokeWidth={10} />
        </g>
      </svg>
      <Box x={1000} y={330} w={760} at={usefulAt} bg="#e4f6ec">
        <div style={{ fontSize: 110, fontWeight: 900, color: C.green }}>25%</div>
        <div style={{ fontSize: 46, fontWeight: 800 }}>actually pushes him forward</div>
      </Box>
      <Box x={1000} y={640} w={760} at={wasteAt} bg="#ffe5da">
        <div style={{ fontSize: 110, fontWeight: 900, color: C.red }}>75%</div>
        <div style={{ fontSize: 46, fontWeight: 800 }}>becomes heat 🔥</div>
      </Box>
    </Paper>
  );
};

export const FuelGauge: React.FC<{ at: number; drainFrom: number; drainTo: number }> = ({ at, drainFrom, drainTo }) => {
  const f = useCurrentFrame();
  const lvl = lerp(f, drainFrom, drainTo, 1, 0, Easing.inOut(Easing.quad));
  return (
    <Paper>
      <Txt x={960} y={90} at={at} size={84} align="center">Quick fuel in Max's muscles</Txt>
      <div style={{ position: 'absolute', left: 560, top: 300, width: 800, height: 220, border: `10px solid ${C.navy}`, borderRadius: 40, background: '#fff', overflow: 'hidden' }}>
        <div style={{ width: `${lvl * 100}%`, height: '100%', background: lvl > 0.3 ? C.green : C.red }} />
      </div>
      <div style={{ position: 'absolute', left: 1360, top: 360, width: 40, height: 100, background: C.navy, borderRadius: 10 }} />
      <Txt x={960} y={580} at={at + 6} size={96} align="center">{Math.round(2000 * lvl).toLocaleString('en-US')} kcal</Txt>
      <Txt x={960} y={720} at={drainFrom} size={60} align="center" color={C.red}>
        {`⏱ ${Math.round(lerp(f, drainFrom, drainTo, 0, 60, Easing.linear))} s at full speed`}
      </Txt>
    </Paper>
  );
};

export const Thermo: React.FC<{ marks: [number, number, string?][]; x?: number; title?: string; titleAt?: number }> = ({ marks, x = 960, title, titleAt = 0 }) => {
  const f = useCurrentFrame();
  const frames = marks.map((m) => m[0]);
  const temps = marks.map((m) => m[1]);
  const T = frames.length > 1 ? interpolate(f, frames, temps, clamp) : temps[0];
  const lvl = (T - 30) / (50 - 30);
  const label = [...marks].reverse().find((m) => f >= m[0] && m[2])?.[2];
  const hot = T > 40;
  return (
    <Paper tint={hot ? '#ffe9e0' : C.paper}>
      {title && <Txt x={960} y={70} at={titleAt} size={78} align="center">{title}</Txt>}
      <svg style={{ position: 'absolute', left: x - 140, top: 190 }} width={280} height={820}>
        <rect x={90} y={20} width={100} height={640} rx={50} fill="#fff" stroke={C.navy} strokeWidth={10} />
        <rect x={110} y={40 + 600 * (1 - lvl)} width={60} height={600 * lvl + 20} rx={30} fill={C.red} />
        <circle cx={140} cy={710} r={90} fill={C.red} stroke={C.navy} strokeWidth={10} />
        {[30, 35, 40, 45, 50].map((t) => (
          <g key={t}>
            <line x1={190} x2={230} y1={40 + 600 * (1 - (t - 30) / 20)} y2={40 + 600 * (1 - (t - 30) / 20)} stroke={C.navy} strokeWidth={6} />
          </g>
        ))}
      </svg>
      <Txt x={x + 220} y={420} size={170} at={frames[0]} w={900} color={hot ? C.red : C.navy}>{T.toFixed(1)}°C</Txt>
      {label && (
        <Txt key={label} x={x + 220} y={620} size={64} at={[...marks].reverse().find((m) => f >= m[0] && m[2])![0]} w={760}>
          {label}
        </Txt>
      )}
    </Paper>
  );
};

/** run 10 s / rest 15 min bar */
export const RunRest: React.FC<{ at: number; restAt: number }> = ({ at, restAt }) => {
  const f = useCurrentFrame();
  const rw = lerp(f, restAt, restAt + 40, 0, 1500);
  return (
    <Paper>
      <Txt x={960} y={150} at={at} size={84} align="center">Every 10 seconds of running costs…</Txt>
      <div style={{ position: 'absolute', left: 160, top: 470, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 70, height: 140, background: C.orange, border: `6px solid ${C.navy}`, borderRadius: 14, opacity: f >= at ? 1 : 0 }} />
        <div style={{ width: rw, height: 140, background: '#9fd3ff', border: rw > 0 ? `6px solid ${C.navy}` : 'none', borderRadius: 14, marginLeft: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', fontSize: 64, fontWeight: 900, color: C.navy, paddingLeft: 40, boxSizing: 'border-box', whiteSpace: 'nowrap' }}>
          😴 z z z … 15 MINUTES IN THE SHADE
        </div>
      </div>
      <Txt x={160} y={650} at={at + 6} size={52}>▲ 10 s run</Txt>
    </Paper>
  );
};

/** commute map: dashes and naps */
export const CommuteMap: React.FC<{ at: number; walkAt: number }> = ({ at, walkAt }) => {
  const f = useCurrentFrame();
  const n = 10;
  const prog = lerp(f, at, walkAt - 10, 0, n, Easing.linear);
  const W = 1500;
  const walker = lerp(f, walkAt, walkAt + 40, 0, W);
  return (
    <Paper tint="#eef6e8">
      <Txt x={960} y={80} at={at} size={80} align="center">Max's 5 km commute</Txt>
      <div style={{ position: 'absolute', left: 210, top: 470, width: W, height: 16, background: C.grey, borderRadius: 8 }} />
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: 210 + (i / n) * W, top: 440, opacity: prog > i ? 1 : 0 }}>
          <div style={{ width: W / n - 50, height: 20, background: C.orange, borderRadius: 10, marginTop: 28 }} />
          <div style={{ position: 'absolute', left: W / n - 60, top: -60, fontSize: 52 }}>😴</div>
        </div>
      ))}
      <Txt x={960} y={600} at={at + 15} size={130} align="center" color={C.red}>{`⏱ ${Math.min(2.5, (prog / n) * 2.5).toFixed(1)} h`}</Txt>
      {f >= walkAt && (
        <div style={{ position: 'absolute', left: 170 + walker, top: 250, fontSize: 120 }}>🚶</div>
      )}
      {f >= walkAt + 40 && <Stamp x={1500} y={850} at={walkAt + 40} text="WALKING: 1 h" color={C.green} rot={-6} size={70} />}
    </Paper>
  );
};

export const TurnCircle: React.FC<{ at: number; overAt: number }> = ({ at, overAt }) => {
  const f = useCurrentFrame();
  const r = lerp(f, at, at + 30, 0, 330);
  return (
    <Paper tint="#e9eef7">
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1920} height={1080}>
        {Array.from({ length: 7 }, (_, i) => (
          <g key={i}>
            <rect x={120 + i * 250} y={110} width={190} height={340} rx={12} fill="#d0d8e8" stroke={C.navy} strokeWidth={5} />
            <rect x={120 + i * 250} y={630} width={190} height={340} rx={12} fill="#d0d8e8" stroke={C.navy} strokeWidth={5} />
          </g>
        ))}
        <rect x={0} y={480} width={1920} height={120} fill="#6b7186" />
        <rect x={810} y={0} width={120} height={1080} fill="#6b7186" opacity={0.9} />
        <circle cx={600} cy={540} r={r} fill="rgba(230,57,70,0.12)" stroke={C.red} strokeWidth={10} strokeDasharray="26 16" />
        <text x={600} y={540 - r - 20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={C.red} opacity={r / 330}>
          turning circle ≈ 580 m
        </text>
      </svg>
      {f >= overAt && <Stamp x={1450} y={300} at={overAt} text="MISSED THE TURN" rot={8} size={70} />}
    </Paper>
  );
};

export const PitchBlind: React.FC<{ at: number; brakeAt: number }> = ({ at, brakeAt }) => {
  const f = useCurrentFrame();
  const W = 1600;
  const blind = lerp(f, at, at + 20, 0, (12 / 112) * W);
  const brake = lerp(f, brakeAt, brakeAt + 25, 0, (100 / 112) * W);
  return (
    <Paper tint="#e6f4e2">
      <Txt x={960} y={90} at={at - 4} size={78} align="center">How far ahead Max must see trouble</Txt>
      <div style={{ position: 'absolute', left: 160, top: 360, width: W, height: 360, background: '#7cc36a', border: `8px solid ${C.navy}`, borderRadius: 20 }}>
        <div style={{ position: 'absolute', left: W / 2 - 4, top: 0, width: 8, height: '100%', background: '#fff' }} />
        <div style={{ position: 'absolute', left: W / 2 - 80, top: 100, width: 160, height: 160, border: '8px solid #fff', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: blind, height: '100%', background: 'rgba(27,42,78,0.75)', color: '#fff', fontSize: 40, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          BLIND
        </div>
        <div style={{ position: 'absolute', left: blind, top: 0, width: brake, height: '100%', background: 'rgba(230,57,70,0.55)', color: '#fff', fontSize: 52, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          BRAKING 100 m
        </div>
      </div>
      <Txt x={160} y={760} at={at + 8} size={52}>12 m before his brain even reacts</Txt>
    </Paper>
  );
};

export const Eiffel: React.FC<{ at: number; jumpAt: number }> = ({ at, jumpAt }) => {
  const f = useCurrentFrame();
  const H = 820;
  const deck = (276 / 330) * H;
  const jy = lerp(f, jumpAt, jumpAt + 30, 0, (290 / 330) * H, Easing.out(Easing.quad));
  return (
    <Paper tint="#dff0ff">
      <svg style={{ position: 'absolute', left: 520, top: 1000 - H }} width={500} height={H}>
        <path d={`M40 ${H} L230 0 L270 0 L460 ${H} L380 ${H} L250 ${H * 0.35} L120 ${H} Z`} fill="#6b5b4b" stroke={C.navy} strokeWidth={8} />
        <rect x={120} y={H - deck - 10} width={260} height={20} fill={C.navy} />
        <rect x={90} y={H * 0.62} width={320} height={22} fill={C.navy} />
      </svg>
      <div style={{ position: 'absolute', left: 1070, top: 1000 - deck - 30, fontSize: 40, fontWeight: 800, color: C.navy }}>— top deck 276 m</div>
      <div style={{ position: 'absolute', left: 1300, top: 1000 - jy - 120, fontSize: 120, opacity: f >= jumpAt ? 1 : 0 }}>🧍</div>
      {f >= jumpAt + 26 && <Txt x={1420} y={1000 - jy - 120} at={jumpAt + 26} size={64} color={C.red}>290 m!</Txt>}
      <div style={{ position: 'absolute', left: 0, top: 1000, width: 1920, height: 80, background: '#7cc36a', borderTop: `8px solid ${C.navy}` }} />
      <Txt x={120} y={80} at={at} size={76}>Max's jump vs the Eiffel Tower</Txt>
    </Paper>
  );
};

export const Treadmill: React.FC<{ at: number; hardAt: number; fastAt: number }> = ({ at, hardAt, fastAt }) => {
  const f = useCurrentFrame();
  const leg = Math.sin(f * 0.6);
  return (
    <Paper>
      <Txt x={120} y={70} at={at} size={70}>Southern Methodist University, 2010</Txt>
      <svg style={{ position: 'absolute', left: 140, top: 230 }} width={900} height={700}>
        <rect x={60} y={560} width={720} height={60} rx={30} fill="#d9dbe3" stroke={C.navy} strokeWidth={8} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={80 + ((i * 60 + f * 8) % 700)} y1={566} x2={80 + ((i * 60 + f * 8) % 700)} y2={614} stroke={C.navy} strokeWidth={4} />
        ))}
        <g transform="translate(420,250)" stroke={C.navy} strokeWidth={14} strokeLinecap="round" fill="none">
          <circle cx={0} cy={-120} r={46} fill={C.navy} />
          <line x1={0} y1={-70} x2={10} y2={90} />
          <line x1={10} y1={90} x2={10 + leg * 70} y2={200} />
          <line x1={10 + leg * 70} y1={200} x2={leg * 40} y2={300} />
          <line x1={10} y1={90} x2={10 - leg * 70} y2={200} />
          <line x1={10 - leg * 70} y1={200} x2={-leg * 40 - 20} y2={300} />
          <line x1={5} y1={-30} x2={-leg * 80} y2={40} />
          <line x1={5} y1={-30} x2={leg * 80} y2={40} />
        </g>
        {[0, 1, 2].map((i) => (
          <line key={i} x1={420} y1={640} x2={420} y2={690} stroke={C.red} strokeWidth={10} opacity={(f + i * 5) % 15 < 8 ? 1 : 0.3} />
        ))}
      </svg>
      <Box x={1060} y={280} w={720} at={hardAt}>
        <div style={{ fontSize: 66, fontWeight: 900 }}>
          <s style={{ color: C.grey }}>how HARD</s>
        </div>
      </Box>
      <Box x={1060} y={560} w={720} at={fastAt} bg={C.yellow}>
        <div style={{ fontSize: 80, fontWeight: 900 }}>how FAST ✔</div>
      </Box>
    </Paper>
  );
};

export const ContactBars: React.FC<{ at: number; maxAt: number }> = ({ at, maxAt }) => (
  <Paper>
    <Bars
      x={260} y={330} w={1400} max={0.1} title="Foot on the ground per step" titleAt={at - 4}
      rows={[
        { label: 'A sprinter', value: 0.1, display: '0.1 s', color: C.blue, at },
        { label: 'Max', value: 0.002, display: '0.002 s', color: C.orange, at: maxAt },
      ]}
    />
  </Paper>
);

export const Letter: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const y = lerp(f, at, at + 25, -500, 420, Easing.out(Easing.bounce));
  return (
    <Paper dark>
      <div style={{ position: 'absolute', left: 0, top: 820, width: 1920, height: 260, background: '#3a2c22' }} />
      <div style={{ position: 'absolute', left: 560, top: 860, width: 800, height: 130, background: '#6b4a2f', borderRadius: 16 }} />
      <div style={{ position: 'absolute', left: 660, top: y, width: 600, height: 380, background: '#f4ead8', border: `6px solid #1b1b1b`, borderRadius: 14, transform: 'rotate(-6deg)', boxShadow: '0 30px 40px rgba(0,0,0,0.5)', fontFamily: FONT }}>
        <div style={{ position: 'absolute', left: 240, top: 120, width: 120, height: 120, borderRadius: 60, background: C.red, border: '6px solid #7a1a20' }} />
        <div style={{ position: 'absolute', left: 30, top: 270, fontSize: 30, fontWeight: 900, color: '#1b1b1b', letterSpacing: 2 }}>DEPT. OF UNEXPLAINED BOOMS</div>
        <div style={{ position: 'absolute', left: 30, top: 20, fontSize: 28, fontWeight: 800, color: C.red }}>URGENT</div>
      </div>
    </Paper>
  );
};

export const CCTV: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const bx = lerp(f, at + 10, at + 40, 300, 1500, Easing.linear);
  const paused = f > at + 40;
  return (
    <Paper dark>
      <div style={{ position: 'absolute', left: 360, top: 140, width: 1200, height: 680, background: '#1a2a1a', border: '14px solid #2b2b2b', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 6px)' }} />
        <div style={{ position: 'absolute', left: 0, top: 460, width: '100%', height: 220, background: '#243a24' }} />
        <div style={{ position: 'absolute', left: bx - 300, top: 300, width: 300, height: 10, background: 'linear-gradient(90deg, transparent, #ffb347)', borderRadius: 5 }} />
        <div style={{ position: 'absolute', left: bx, top: 290, width: 30, height: 30, borderRadius: 15, background: '#ffcf7a', boxShadow: '0 0 30px #ff7a1a' }} />
        <div style={{ position: 'absolute', left: 30, top: 24, color: '#9f9', fontFamily: 'monospace', fontSize: 34 }}>CAM 07 · PARK · 14:32:{String(Math.floor(f / 3) % 60).padStart(2, '0')}</div>
        {paused && <div style={{ position: 'absolute', right: 40, top: 24, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 44 }}>❚❚ PAUSED</div>}
        {paused && <div style={{ position: 'absolute', left: bx - 70, top: 230, width: 160, height: 160, border: `6px solid ${C.red}` }} />}
      </div>
      <div style={{ position: 'absolute', left: 760, top: 760, width: 420, height: 420, borderRadius: '50% 50% 0 0', background: '#05070d' }} />
      <div style={{ position: 'absolute', left: 860, top: 640, width: 220, height: 220, borderRadius: 110, background: '#05070d' }} />
    </Paper>
  );
};

export const CommentsEnd: React.FC<{ at: number; subAt: number }> = ({ at, subAt }) => {
  const f = useCurrentFrame();
  const sub = usePop(subAt, 9, 200);
  const comments = ['I would finally win at musical chairs', 'Speedrun my homework 📚', 'Catch every bus. Out of spite.'];
  return (
    <Paper tint="#eef3fb">
      <Txt x={960} y={90} at={at} size={86} align="center">What would YOU do with 50× speed?</Txt>
      {comments.map((c, i) => (
        <Box key={i} x={300 + (i % 2) * 120} y={260 + i * 170} w={1100} at={at + 10 + i * 8} pad={26}>
          <div style={{ fontSize: 42, fontWeight: 800 }}>💬 {c}</div>
        </Box>
      ))}
      <div
        style={{
          position: 'absolute', left: 960, top: 880, transform: `translate(-50%,-50%) scale(${sub * (1 + Math.sin(f / 5) * 0.03)})`,
          background: C.red, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 84, padding: '26px 80px', borderRadius: 24,
          border: `8px solid ${C.navy}`, boxShadow: `10px 10px 0 ${C.navy}`,
        }}
      >
        SUBSCRIBE 🔔
      </div>
    </Paper>
  );
};

/** full-bleed big statement, vertically centred */
export const BigSay: React.FC<{ lines: { t: string; at: number; color?: string; size?: number }[]; tint?: string; dark?: boolean; burst?: boolean }> = ({ lines, tint, dark, burst }) => {
  const f = useCurrentFrame();
  const hs = lines.map((l) => (l.size ?? 120) * 1.32);
  const total = hs.reduce((a, b) => a + b, 0);
  let y = 540 - total / 2;
  const rays = burst ?? tint === C.yellow;
  return (
    <Paper tint={tint} dark={dark}>
      {rays && <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.5}deg at 50% 50%, rgba(255,255,255,0.28) 0deg 10deg, transparent 10deg 20deg)` }} />}
      {lines.map((l, i) => {
        const yy = y;
        y += hs[i];
        return (
          <Txt key={i} x={960} y={yy} at={l.at} size={l.size ?? 120} align="center" color={l.color ?? (dark ? '#fff' : C.navy)}>
            {l.t}
          </Txt>
        );
      })}
    </Paper>
  );
};
