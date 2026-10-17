import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Cues } from './timeline';

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

const SpeedLines: React.FC<{ c: Cues }> = ({ c }) => {
  const f = useCurrentFrame();
  const k = f - c.burst;
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

const Flash: React.FC<{ c: Cues }> = ({ c }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [c.burst, c.burst + 1, c.burst + 8], [0, 0.85, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ background: '#fffbe8', opacity: o }} /> : null;
};

// navy line-art stat card
const StatCard: React.FC<{ c: Cues }> = ({ c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = c.card;
  if (f < start) return null;
  const pop = spring({ frame: f - start, fps, config: { damping: 13, stiffness: 160 } }) * interpolate(f, [c.cardOut, c.cardOut + 8], [1, 0], clamp);
  if (pop <= 0.001) return null;
  const t = interpolate(f, [c.at(8), c.end(8)], [0, 1.44], { ...clamp, easing: Easing.out(Easing.quad) });
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
      {row('Usain Bolt', '9.58 s', 1, '#8ea6cf', c.at(10))}
      {row('Max (10x)', '1.44 s', 1.44 / 9.58, ACCENT, c.end(8))}
    </div>
  );
};

// caption groups: phrase indices shown together; ^ marks a highlighted word
const LINES: { phrases: number[]; text: string[] }[] = [
  { phrases: [0], text: ['This is ^Max.'] },
  { phrases: [1, 2], text: ['Yesterday?', 'Totally normal guy.'] },
  { phrases: [3, 4], text: ['Today…', 'Max is ^10x ^faster than you.'] },
  { phrases: [5], text: ['Watch this.'] },
  { phrases: [6], text: ['Aaand… he’s ^gone.'] },
  { phrases: [7, 8], text: ['A hundred metres.', '^1.44 ^seconds.'] },
  { phrases: [9, 10], text: ['Usain Bolt?', 'Nine and a half.'] },
  { phrases: [11], text: ['Bolt’s fine.'] },
  { phrases: [12, 13], text: ['Max…', 'has a ^problem.'] },
];

const Captions: React.FC<{ c: Cues }> = ({ c }) => (
  <>
    {LINES.map((line, li) => {
      const words: Word[] = [];
      line.phrases.forEach((pi, k) => {
        const ws = line.text[k].split(' ');
        const a = c.at(pi);
        const step = (c.end(pi) - a) / ws.length;
        ws.forEach((w, i) => words.push({ t: w.replace('^', ''), hot: w.startsWith('^'), at: Math.round(a + i * step) }));
      });
      const next = LINES[li + 1];
      const last = line.phrases[line.phrases.length - 1];
      const to = next ? Math.min(c.at(next.phrases[0]) - 1, c.end(last) + 24) : c.total;
      return <Caption key={li} from={c.at(line.phrases[0])} to={to} words={words} />;
    })}
  </>
);

const Vignette: React.FC<{ c: Cues }> = ({ c }) => {
  const f = useCurrentFrame();
  const dark = interpolate(f, [c.problem - 6, c.problem + 10], [0.28, 0.75], clamp);
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(10,16,40,${dark}) 100%)` }} />;
};

export const Overlay: React.FC<{ c: Cues }> = ({ c }) => (
  <AbsoluteFill>
    <Vignette c={c} />
    <SpeedLines c={c} />
    <StatCard c={c} />
    <Captions c={c} />
    <Flash c={c} />
  </AbsoluteFill>
);
