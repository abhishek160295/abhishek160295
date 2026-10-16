import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const FONT = '"Inter Display", Inter, sans-serif';
const NAVY = '#1b2a4e';
const PAPER = '#fbf7ee';
const ACCENT = '#ffd23f';

type Word = { t: string; at: number; hot?: boolean };

const Caption: React.FC<{ words: Word[]; from: number; to: number }> = ({ words, from, to }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < from || f > to) return null;
  const out = interpolate(f, [to - 6, to], [1, 0], clamp);
  return (
    <div style={{ position: 'absolute', bottom: 120, width: '100%', textAlign: 'center', opacity: out }}>
      {words.map((w, i) => {
        if (f < w.at) return null;
        const s = spring({ frame: f - w.at, fps, config: { damping: 11, stiffness: 220 } });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 14px',
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 92,
              letterSpacing: -1,
              color: w.hot ? ACCENT : '#ffffff',
              WebkitTextStroke: `10px ${NAVY}`,
              paintOrder: 'stroke fill',
              textShadow: `0 8px 0 ${NAVY}`,
              transform: `translateY(${(1 - s) * 40}px) scale(${0.6 + s * 0.4})`,
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

const SpeedLines: React.FC = () => {
  const f = useCurrentFrame();
  const k = f - 150;
  if (k < 0 || k > 45) return null;
  const fade = interpolate(k, [0, 4, 30, 45], [0, 1, 0.8, 0], clamp);
  return (
    <svg width="1920" height="1080" style={{ position: 'absolute', opacity: fade }}>
      {Array.from({ length: 34 }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin((i + n) * 78.233) * 43758.5453;
          return x - Math.floor(x);
        };
        const y = 80 + r(1) * 920;
        const len = 300 + r(2) * 700;
        const x = 2200 - ((k * (90 + r(3) * 60) + r(4) * 2000) % 3200);
        return <line key={i} x1={x} y1={y} x2={x + len} y2={y} stroke="#ffffff" strokeWidth={2 + r(5) * 5} strokeLinecap="round" opacity={0.75} />;
      })}
    </svg>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [150, 151, 158], [0, 0.85, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ background: '#fffbe8', opacity: o }} /> : null;
};

// navy line-art stat card
const StatCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 238;
  if (f < start) return null;
  const pop = spring({ frame: f - start, fps, config: { damping: 13, stiffness: 160 } });
  const t = interpolate(f, [272, 300], [0, 1.44], { ...clamp, easing: Easing.out(Easing.quad) });
  const bar = (d: number) => interpolate(f, [d, d + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const row = (label: string, secs: string, w: number, color: string, d: number) => (
    <div style={{ marginTop: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 34, fontWeight: 800, color: NAVY }}>
        <span>{label}</span>
        <span style={{ opacity: bar(d) }}>{secs}</span>
      </div>
      <div style={{ height: 30, marginTop: 10, borderRadius: 15, border: `4px solid ${NAVY}`, overflow: 'hidden' }}>
        <div style={{ width: `${w * bar(d) * 100}%`, height: '100%', background: color, borderRight: bar(d) > 0 ? `4px solid ${NAVY}` : 'none' }} />
      </div>
    </div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 110,
        top: 170,
        width: 700,
        padding: '44px 52px 52px',
        background: PAPER,
        border: `6px solid ${NAVY}`,
        borderRadius: 34,
        boxShadow: `14px 14px 0 ${NAVY}`,
        fontFamily: FONT,
        transform: `scale(${pop}) rotate(${(1 - pop) * -6}deg)`,
        transformOrigin: 'left center',
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, color: NAVY, letterSpacing: 3, opacity: 0.7 }}>100 METRES</div>
      <div style={{ fontSize: 150, fontWeight: 900, color: NAVY, lineHeight: 1, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
        {t.toFixed(2)}
        <span style={{ fontSize: 70 }}> s</span>
      </div>
      {row('Usain Bolt', '9.58 s', 1, '#8ea6cf', 320)}
      {row('Max (10x)', '1.44 s', 1.44 / 9.58, ACCENT, 300)}
    </div>
  );
};

export const Overlay: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(10,16,40,0.28) 100%)' }} />
    <SpeedLines />
    <Caption from={12} to={36} words={[{ t: 'Meet', at: 12 }, { t: 'Max.', at: 20 }]} />
    <Caption
      from={38}
      to={102}
      words={[
        { t: 'Max', at: 38 },
        { t: 'is', at: 44 },
        { t: 'now', at: 49 },
        { t: '10x', at: 55, hot: true },
        { t: 'faster', at: 62, hot: true },
        { t: 'than', at: 70 },
        { t: 'you.', at: 75 },
      ]}
    />
    <Caption
      from={157}
      to={210}
      words={[
        { t: 'Aaand…', at: 157 },
        { t: 'he’s', at: 185 },
        { t: 'gone.', at: 191, hot: true },
      ]}
    />
    <Caption
      from={320}
      to={375}
      words={[
        { t: 'Usain', at: 320 },
        { t: 'Bolt', at: 327 },
        { t: 'needs', at: 334 },
        { t: 'nine', at: 341 },
        { t: 'and a', at: 347 },
        { t: 'half.', at: 353, hot: true },
      ]}
    />
    <StatCard />
    <Flash />
  </AbsoluteFill>
);
