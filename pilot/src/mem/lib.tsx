// Sets and graphics for the 2D episodes. Everything is drawn on a 1920x1080 stage.
import React from 'react';
import { INK, Look } from '../max/Max';
import { FONT, W, H } from './kit';

export const WOMAN: Look = { jacket: '#F07FA8', jacketDark: '#C2507A', pants: '#2B2F4A', shoes: '#FFC72C', sole: '#fff', skin: INK, hair: 'bun', hairColor: '#2A1A12' };
export const JANITOR: Look = { jacket: '#7B8794', jacketDark: '#56606B', pants: '#56606B', shoes: '#2B2B2B', sole: '#888', skin: INK };
export const ATHLETE: Look = { jacket: '#E53935', jacketDark: '#A82522', pants: '#1E1E28', shoes: '#fff', sole: '#999', skin: INK };

const rnd = (i: number, k = 1) => { const s = Math.sin((i + 1) * 12.9898 * k) * 43758.5453; return s - Math.floor(s); };

const isDark = (c: string) => { const m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return false; const n = parseInt(m[1], 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 90; };
export const Label: React.FC<{ x: number; y: number; t: string; size?: number; color?: string; anchor?: 'middle' | 'start' | 'end' }> = ({ x, y, t, size = 64, color = '#fff', anchor = 'middle' }) => (
  // dark text gets no black outline (an outline would merge the letters into a blob)
  <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} stroke={isDark(color) ? 'none' : INK} strokeWidth={size / 7} paintOrder="stroke" letterSpacing={isDark(color) ? 1 : -1}>{t}</text>
);

export const Rays: React.FC<{ bg: string; ray: string; cx?: number; cy?: number; t?: number; n?: number }> = ({ bg, ray, cx = 960, cy = 540, t = 0, n = 14 }) => (
  <g>
    <rect width={W} height={H} fill={bg} />
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + t / 90;
      const b = a + Math.PI / n;
      return <path key={i} d={`M${cx} ${cy} L${cx + Math.cos(a) * 2400} ${cy + Math.sin(a) * 2400} L${cx + Math.cos(b) * 2400} ${cy + Math.sin(b) * 2400} Z`} fill={ray} />;
    })}
  </g>
);

// ---------- sets ----------
export const Bedroom: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <g>
    <rect width={W} height={H} fill="#1E2452" />
    <rect x={1240} y={120} width={420} height={340} rx={16} fill="#0F1433" stroke="#3A4380" strokeWidth={18} />
    <circle cx={1540} cy={210} r={46} fill="#F4EBC0" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1290 + rnd(i) * 300} cy={160 + rnd(i, 2) * 260} r={4} fill="#fff" />)}
    <rect y={820} width={W} height={260} fill="#2A2F63" />
    <g transform="translate(300 700)">
      <rect x={-40} y={-260} width={60} height={380} rx={14} fill="#6B4A2E" stroke={INK} strokeWidth={8} />
      <rect x={-20} y={0} width={1240} height={120} rx={20} fill="#6B4A2E" stroke={INK} strokeWidth={8} />
      <rect x={20} y={-40} width={260} height={90} rx={40} fill="#F2F2F2" stroke={INK} strokeWidth={8} />
      <path d="M240 -20 L1200 -20 Q1230 60 1200 100 L240 100 Z" fill="#4C7BD9" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M300 10 L1150 10 M300 50 L1150 50" stroke="#3B63B5" strokeWidth={6} />
    </g>
    <g transform="translate(1700 680)">
      <rect x={-60} y={0} width={120} height={140} fill="#6B4A2E" stroke={INK} strokeWidth={8} />
      <rect x={-50} y={-70} width={100} height={64} rx={10} fill="#141414" stroke={INK} strokeWidth={6} />
      <text x={0} y={-36} textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={900} fontSize={38} fill="#FF5A4E">11:00</text>
    </g>
    {glow > 0 && <rect width={W} height={H} fill="#7FB8FF" opacity={glow * 0.25} />}
  </g>
);

export const Street: React.FC<{ signal?: 'red' | 'green' | null; tint?: string; crossing?: boolean }> = ({ signal = null, tint, crossing = true }) => (
  <g>
    <rect width={W} height={H} fill="#9ED8F0" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const x = i * 290 - 60, h = 380 + rnd(i) * 260, c = ['#E8836B', '#F2C14E', '#7FB685', '#8E9BD6', '#E8A0BF', '#6FC3C8', '#F29E4C'][i];
      return (
        <g key={i}>
          <rect x={x} y={640 - h} width={270} height={h} fill={c} stroke={INK} strokeWidth={8} />
          {Array.from({ length: Math.floor(h / 110) }, (_, r) => [0, 1, 2].map((cc) => <rect key={r + '-' + cc} x={x + 30 + cc * 78} y={640 - h + 40 + r * 110} width={50} height={64} rx={6} fill="#DDF2FA" stroke={INK} strokeWidth={5} />))}
        </g>
      );
    })}
    <rect y={630} width={W} height={60} fill="#C9C3B6" stroke={INK} strokeWidth={6} />
    <rect y={690} width={W} height={390} fill="#4A4E5C" />
    {crossing && Array.from({ length: 9 }, (_, i) => <rect key={i} x={600 + i * 90} y={720} width={56} height={330} fill="#F2F2F2" opacity={0.9} />)}
    <rect y={1050} width={W} height={30} fill="#C9C3B6" />
    {signal && (
      <g transform="translate(1500 640)">
        <rect x={-10} y={-420} width={20} height={420} fill="#3A3D48" stroke={INK} strokeWidth={6} />
        <rect x={-55} y={-520} width={110} height={160} rx={16} fill="#22252E" stroke={INK} strokeWidth={8} />
        <circle cx={0} cy={-480} r={30} fill={signal === 'red' ? '#FF4A3D' : '#4A1F1C'} />
        <circle cx={0} cy={-400} r={30} fill={signal === 'green' ? '#3DE07A' : '#163A22'} />
        {signal === 'green' && <circle cx={0} cy={-400} r={56} fill="#3DE07A" opacity={0.3} />}
        {signal === 'red' && <circle cx={0} cy={-480} r={56} fill="#FF4A3D" opacity={0.3} />}
      </g>
    )}
    {tint && <rect width={W} height={H} fill={tint} />}
  </g>
);

export const Pub: React.FC = () => (
  <g>
    <rect width={W} height={H} fill="#8E4A33" />
    {Array.from({ length: 14 }, (_, r) => Array.from({ length: 12 }, (_, c) => <rect key={r + '-' + c} x={c * 170 - (r % 2) * 85} y={r * 70} width={160} height={60} fill="#9C5640" />))}
    <rect x={660} y={180} width={600} height={900} rx={20} fill="#2E5E46" stroke={INK} strokeWidth={14} />
    <rect x={740} y={250} width={440} height={330} rx={14} fill="#F5D88A" stroke={INK} strokeWidth={10} />
    <circle cx={1180} cy={720} r={22} fill="#C9A227" stroke={INK} strokeWidth={6} />
    <rect y={1000} width={W} height={80} fill="#5A3324" />
  </g>
);

export const Rooftop: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <defs><linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B2C6B" /><stop offset="0.55" stopColor="#E86F5A" /><stop offset="1" stopColor="#F7C66B" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#dawn)" />
    <circle cx={1320} cy={720 - t * 0.6} r={150} fill="#FFE29A" opacity={0.9} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170 - 20} y={560 + rnd(i) * 160} width={150} height={600} fill="#2C2350" />)}
    <rect y={820} width={W} height={260} fill="#5B4A6E" stroke={INK} strokeWidth={8} />
    <rect y={800} width={W} height={36} fill="#7A6890" stroke={INK} strokeWidth={6} />
  </g>
);

export const Sepia: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <g style={{ filter: 'sepia(0.85) contrast(0.95) brightness(1.02)' }}>{children}</g>
);

export const Office: React.FC = () => (
  <g>
    <rect width={W} height={H} fill="#D8C8A8" />
    <rect x={180} y={120} width={360} height={260} fill="#BBA987" stroke={INK} strokeWidth={8} />
    <rect y={700} width={W} height={380} fill="#A0805A" />
  </g>
);

export const BrainInside: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <rect width={W} height={H} fill="#5A2346" />
    <ellipse cx={960} cy={520} rx={1000} ry={640} fill="#F29BB8" stroke={INK} strokeWidth={12} />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M${100 + i * 210} ${150 + rnd(i) * 80} q60 ${80 + Math.sin(t / 20 + i) * 10} 0 160 q-60 80 20 160`} fill="none" stroke="#D96F95" strokeWidth={14} strokeLinecap="round" />
    ))}
    <rect y={860} width={W} height={220} fill="#E5809F" />
  </g>
);

export const Bench: React.FC = () => (
  <g>
    <rect width={W} height={H} fill="#5E7187" />
    <rect y={760} width={W} height={320} fill="#4A5A6C" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 520 + 60} y={360 + rnd(i) * 80} width={18} height={420} fill="#3B4757" />)}
    <g transform="translate(960 840)">
      <rect x={-330} y={-130} width={660} height={34} rx={8} fill="#7A5A3E" stroke={INK} strokeWidth={7} />
      <rect x={-330} y={-70} width={660} height={34} rx={8} fill="#7A5A3E" stroke={INK} strokeWidth={7} />
      <rect x={-300} y={-36} width={24} height={110} fill="#3A3D48" /><rect x={276} y={-36} width={24} height={110} fill="#3A3D48" />
    </g>
  </g>
);

// ---------- props & graphics ----------
const SCREEN_CONTENT = ['#FFD21F', '#E53935', '#3DBE7A', '#2F6FD6', '#F07FA8', '#7A4FD6'];
/** a little memory screen: mini picture inside a TV frame. k picks the content. */
export const Screen: React.FC<{ k: number; w?: number; on?: number }> = ({ k, w = 220, on = 1 }) => {
  const h = w * 0.66, c = SCREEN_CONTENT[k % 6];
  const kind = k % 5;
  return (
    <g>
      <rect x={-w / 2 - 10} y={-h / 2 - 10} width={w + 20} height={h + 20} rx={18} fill="#22252E" stroke={INK} strokeWidth={6} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={c} opacity={on} />
      {kind === 0 && <g><circle cx={-w * 0.2} cy={-h * 0.1} r={h * 0.18} fill="#fff" /><rect x={-w / 2} y={h * 0.2} width={w} height={h * 0.3} fill="#2E7D4F" /></g>}
      {kind === 1 && <g><rect x={-w * 0.22} y={-h * 0.05} width={w * 0.44} height={h * 0.32} fill="#fff" stroke={INK} strokeWidth={4} /><rect x={-w * 0.03} y={-h * 0.28} width={w * 0.06} height={h * 0.2} fill="#FFD21F" /></g>}
      {kind === 2 && <g><circle cx={0} cy={-h * 0.05} r={h * 0.25} fill={INK} /><circle cx={-h * 0.08} cy={-h * 0.08} r={h * 0.06} fill="#fff" /><circle cx={h * 0.08} cy={-h * 0.08} r={h * 0.06} fill="#fff" /></g>}
      {kind === 3 && <g><path d={`M${-w * 0.3} ${h * 0.2} L${-w * 0.05} ${-h * 0.25} L${w * 0.2} ${h * 0.2} Z`} fill="#fff" opacity={0.85} /><rect x={-w / 2} y={h * 0.22} width={w} height={h * 0.28} fill="#3B3F4C" /></g>}
      {kind === 4 && <g><circle cx={-w * 0.15} cy={0} r={h * 0.16} fill={INK} /><path d={`M${w * 0.05} ${-h * 0.2} l${w * 0.1} ${h * 0.12} M${w * 0.12} ${-h * 0.3} l0 ${h * 0.2}`} stroke="#fff" strokeWidth={6} strokeLinecap="round" /></g>}
    </g>
  );
};

/** memory card that janitors sweep */
export const Card: React.FC<{ k: number; s?: number }> = ({ k, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-60} y={-44} width={120} height={88} rx={12} fill="#FFF7D6" stroke={INK} strokeWidth={6} />
    <circle cx={-22} cy={-4} r={18} fill={SCREEN_CONTENT[k % 6]} stroke={INK} strokeWidth={4} />
    <path d="M6 -14 L42 -14 M6 6 L34 6" stroke="#9AA3B5" strokeWidth={7} strokeLinecap="round" />
  </g>
);

export const Bin: React.FC<{ label?: string }> = ({ label = 'NAH' }) => (
  <g>
    <path d="M-110 -150 L110 -150 L86 60 L-86 60 Z" fill="#5D6B7A" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <rect x={-124} y={-176} width={248} height={34} rx={10} fill="#748394" stroke={INK} strokeWidth={8} />
    <Label x={0} y={-50} t={label} size={56} />
  </g>
);

export const Broom: React.FC = () => (
  <g>
    <line x1={0} y1={-150} x2={0} y2={60} stroke="#8A5A2E" strokeWidth={14} strokeLinecap="round" />
    <path d="M-40 50 L40 50 L56 110 L-56 110 Z" fill="#E8C35B" stroke={INK} strokeWidth={6} />
  </g>
);

export const Glass: React.FC<{ level: number; label: string }> = ({ level, label }) => (
  <g>
    <clipPath id="glassclip"><path d="M-170 -260 L170 -260 L140 260 L-140 260 Z" /></clipPath>
    <g clipPath="url(#glassclip)">
      <rect x={-200} y={260 - 520 * level} width={400} height={600} fill="#4FB3F0" />
      <rect x={-200} y={252 - 520 * level} width={400} height={18} fill="#9ED8F7" />
    </g>
    <path d="M-170 -260 L170 -260 L140 260 L-140 260 Z" fill="none" stroke={INK} strokeWidth={14} strokeLinejoin="round" />
    <path d="M-120 -200 L-104 180" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.6} />
    <Label x={0} y={340} t={label} size={70} />
  </g>
);

export const Flag: React.FC<{ k: 'fr' | 'es' | 'jp' | 'ar' | 'kl' }> = ({ k }) => (
  <g>
    <line x1={-200} y1={-150} x2={-200} y2={260} stroke="#5A4632" strokeWidth={18} strokeLinecap="round" />
    <g>
      <rect x={-200} y={-150} width={400} height={260} fill="#fff" stroke={INK} strokeWidth={10} />
      {k === 'fr' && <><rect x={-195} y={-145} width={130} height={250} fill="#2F4FB0" /><rect x={68} y={-145} width={127} height={250} fill="#E53935" /></>}
      {k === 'es' && <><rect x={-195} y={-145} width={390} height={62} fill="#D42C2C" /><rect x={-195} y={43} width={390} height={62} fill="#D42C2C" /><rect x={-195} y={-83} width={390} height={126} fill="#FFC72C" /></>}
      {k === 'jp' && <circle cx={0} cy={-20} r={78} fill="#D42C2C" />}
      {k === 'ar' && <><rect x={-195} y={-145} width={390} height={250} fill="#1F8A4C" /><path d="M-90 -10 Q0 40 90 -10" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" /></>}
      {k === 'kl' && <><rect x={-195} y={-145} width={390} height={250} fill="#1B1B1B" /><path d="M0 -110 L60 40 L0 0 L-60 40 Z" fill="#C42222" stroke="#E0E0E0" strokeWidth={6} /></>}
    </g>
  </g>
);

export const Keys: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle r={34} fill="none" stroke="#C9A227" strokeWidth={14} />
    <g stroke={INK} strokeWidth={4}>
      <path d="M20 30 L70 150 L92 140 L82 118 L100 110 L92 92 L76 98 L44 22 Z" fill="#E2C25A" />
      <path d="M-14 34 L-40 160 L-16 164 L-12 140 L8 142 L10 122 L-8 120 L4 36 Z" fill="#B8C2CF" />
    </g>
  </g>
);

export const MicStand: React.FC<{ note?: string; poster?: string; sad?: boolean }> = ({ note, poster, sad }) => (
  <g>
    <rect x={-6} y={-200} width={12} height={540} fill="#3A3D48" />
    <ellipse cx={0} cy={340} rx={120} ry={24} fill="#3A3D48" />
    <rect x={-40} y={-300} width={80} height={130} rx={40} fill="#5A5F6E" stroke={INK} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={-34} y1={-276 + i * 26} x2={34} y2={-276 + i * 26} stroke="#2E313A" strokeWidth={5} />)}
    {poster && (
      <g transform="translate(0 40) rotate(-4)">
        <rect x={-170} y={-110} width={340} height={220} fill="#FFF7D6" stroke={INK} strokeWidth={7} />
        <Label x={0} y={-30} t={poster} size={48} color="#E53935" />
        <g transform="translate(0 50) scale(0.6)"><Keys /></g>
      </g>
    )}
    {note && (
      <g transform="translate(40 -120) rotate(8)">
        <rect x={-120} y={-60} width={240} height={120} fill="#FFE45C" stroke={INK} strokeWidth={6} />
        <Label x={0} y={0} t={note} size={40} color={INK} />
      </g>
    )}
    {sad && (
      <g transform="translate(260 -160) rotate(20)">
        <path d="M-120 -16 L60 -16 L140 -60 L140 60 L60 16 L-120 16 Z" fill="#E2C25A" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      </g>
    )}
  </g>
);

export const Receipt: React.FC<{ len: number }> = ({ len }) => (
  <g>
    <rect x={-170} y={0} width={340} height={len} fill="#FFFDF4" stroke={INK} strokeWidth={6} />
    <text x={0} y={60} textAnchor="middle" fontFamily="monospace" fontWeight={900} fontSize={34} fill={INK}>TUE 3:42 PM</text>
    {Array.from({ length: Math.max(0, Math.floor((len - 90) / 44)) }, (_, i) => <line key={i} x1={-130} y1={110 + i * 44} x2={i % 3 === 2 ? 40 : 130} y2={110 + i * 44} stroke="#9AA3B5" strokeWidth={10} strokeLinecap="round" />)}
  </g>
);

export const Padlock: React.FC<{ shut: number }> = ({ shut }) => (
  <g>
    <path d={`M-34 ${-20 - (1 - shut) * 34} L-34 -60 Q-34 -104 0 -104 Q34 -104 34 -60 L34 -20`} fill="none" stroke="#9AA3B5" strokeWidth={14} />
    <rect x={-56} y={-26} width={112} height={92} rx={14} fill="#FFC72C" stroke={INK} strokeWidth={8} />
    <circle cx={0} cy={14} r={12} fill={INK} />
  </g>
);

export const Cake: React.FC = () => (
  <g>
    <rect x={-120} y={-60} width={240} height={110} rx={14} fill="#F7B6C8" stroke={INK} strokeWidth={8} />
    <path d="M-120 -40 Q-90 0 -60 -40 Q-30 0 0 -40 Q30 0 60 -40 Q90 0 120 -40" fill="none" stroke="#fff" strokeWidth={12} />
    {[-50, 0, 50].map((x) => <g key={x}><rect x={x - 8} y={-120} width={16} height={60} fill="#7FD4FF" stroke={INK} strokeWidth={4} /><path d={`M${x} -150 q14 18 0 28 q-14 -10 0 -28`} fill="#FFC72C" /></g>)}
  </g>
);

export const Calendar: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => (
  <g>
    <rect x={-170} y={-190} width={340} height={380} rx={20} fill="#fff" stroke={INK} strokeWidth={10} />
    <rect x={-170} y={-190} width={340} height={100} rx={20} fill="#E53935" stroke={INK} strokeWidth={10} />
    <Label x={0} y={30} t={text} size={130} color={INK} />
    {sub && <Label x={0} y={-140} t={sub} size={44} />}
  </g>
);

export const Stamp: React.FC<{ t: string; color?: string; p: number; size?: number; r?: number }> = ({ t, color = '#E53935', p, size = 120, r = -10 }) => {
  if (p <= 0) return null;
  const s = p < 1 ? 2.2 - p * 1.2 : 1;
  const wdt = t.length * size * 0.62 + 80;
  return (
    <g transform={`rotate(${r}) scale(${s})`} opacity={Math.min(1, p * 2)}>
      <rect x={-wdt / 2} y={-size * 0.75} width={wdt} height={size * 1.5} rx={20} fill="none" stroke={color} strokeWidth={16} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} letterSpacing={2}>{t}</text>
    </g>
  );
};

export const LoadingWheel: React.FC<{ t: number; r?: number }> = ({ t, r = 30 }) => (
  <g transform={`rotate(${t * 18})`}>
    {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={Math.cos((i / 8) * Math.PI * 2) * r} cy={Math.sin((i / 8) * Math.PI * 2) * r} r={r * 0.22} fill="#fff" opacity={0.25 + (i / 8) * 0.75} />)}
  </g>
);

export const Sandwich: React.FC<{ k: number }> = ({ k }) => (
  <g>
    <path d="M-170 -10 Q0 -120 170 -10 Z" fill="#E8B46B" stroke={INK} strokeWidth={8} />
    <rect x={-176} y={-14} width={352} height={22} rx={10} fill={['#7FC75A', '#E53935', '#FFD21F', '#F07FA8'][k % 4]} stroke={INK} strokeWidth={6} />
    <rect x={-170} y={8} width={340} height={26} rx={8} fill={['#C4553E', '#F2D16B', '#8A5A2E', '#E8E0D0'][k % 4]} stroke={INK} strokeWidth={6} />
    <path d="M-170 34 L170 34 Q170 80 0 80 Q-170 80 -170 34 Z" fill="#E8B46B" stroke={INK} strokeWidth={8} />
  </g>
);

export const Rock: React.FC<{ smooth: number }> = ({ smooth }) => {
  const pts = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const r = 110 + (1 - smooth) * (i % 2 ? 50 : -30);
    return `${Math.cos(a) * r * 1.3},${Math.sin(a) * r}`;
  });
  return <polygon points={pts.join(' ')} fill="#8D8A99" stroke={INK} strokeWidth={10} strokeLinejoin={smooth > 0.5 ? 'round' : 'miter'} />;
};

export const Bus: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-320} y={-420} width={640} height={520} rx={40} fill="#D62F2F" stroke={INK} strokeWidth={14} />
    <rect x={-270} y={-370} width={540} height={200} rx={20} fill="#BFE6F7" stroke={INK} strokeWidth={10} />
    <rect x={-160} y={-410} width={320} height={40} rx={8} fill="#22252E" />
    <text x={0} y={-388} textAnchor="middle" dominantBaseline="central" fontFamily="monospace" fontWeight={900} fontSize={30} fill="#FFC72C">2009</text>
    <circle cx={-220} cy={-40} r={50} fill="#FFF6C2" stroke={INK} strokeWidth={10} />
    <circle cx={220} cy={-40} r={50} fill="#FFF6C2" stroke={INK} strokeWidth={10} />
    <rect x={-140} y={-80} width={280} height={60} rx={10} fill="#22252E" />
    <rect x={-330} y={60} width={660} height={60} rx={14} fill="#3A3D48" stroke={INK} strokeWidth={10} />
  </g>
);

export const Sieve: React.FC = () => (
  <g>
    <path d="M-360 -40 Q0 360 360 -40 Z" fill="#B8C2CF" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={-250 + (i % 10) * 55} cy={20 + Math.floor(i / 10) * 55} r={9} fill="#5D6B7A" />)}
    <rect x={-400} y={-62} width={800} height={36} rx={14} fill="#94A0B0" stroke={INK} strokeWidth={10} />
    <rect x={360} y={-56} width={200} height={24} rx={12} fill="#94A0B0" stroke={INK} strokeWidth={8} />
  </g>
);

export const Gem: React.FC<{ c: string; label: string }> = ({ c, label }) => (
  <g>
    <path d="M-60 -30 L-30 -66 L30 -66 L60 -30 L0 54 Z" fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M-30 -66 L-14 -30 L14 -30 L30 -66 M-60 -30 L60 -30" stroke="#fff" strokeWidth={4} opacity={0.6} fill="none" />
    <Label x={0} y={-104} t={label} size={34} />
  </g>
);

export const Heart: React.FC<{ stitch: number }> = ({ stitch }) => (
  <g>
    <path d="M0 120 C-220 -20 -160 -200 0 -90 C160 -200 220 -20 0 120 Z" fill="#E53935" stroke={INK} strokeWidth={12} />
    <path d={`M-10 -80 L20 -20 L-20 30 L10 90`} fill="none" stroke={INK} strokeWidth={8} strokeDasharray="300" strokeDashoffset={300 * stitch} opacity={1 - stitch * 0.0} />
    {stitch > 0.5 && [-40, 0, 40].map((y, i) => <line key={i} x1={-24} y1={y - 10} x2={24} y2={y + 10} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={(stitch - 0.5) * 2} />)}
  </g>
);

export const WorldMap: React.FC<{ lights: number; t: number }> = ({ lights, t }) => (
  <g>
    {[
      'M-640 -200 Q-520 -300 -380 -240 Q-300 -120 -420 -40 Q-520 40 -600 -60 Z',
      'M-420 40 Q-330 20 -300 140 Q-340 300 -400 260 Q-450 140 -420 40 Z',
      'M-120 -240 Q40 -300 120 -220 Q60 -140 -60 -150 Q-150 -170 -120 -240 Z',
      'M-80 -120 Q60 -110 70 40 Q20 220 -40 180 Q-120 40 -80 -120 Z',
      'M120 -240 Q420 -300 560 -160 Q500 -40 300 -60 Q160 -100 120 -240 Z',
      'M380 120 Q500 90 560 160 Q520 240 420 220 Q360 180 380 120 Z',
    ].map((d, i) => <path key={i} d={d} fill="#3DBE7A" stroke={INK} strokeWidth={8} />)}
    {Array.from({ length: lights }, (_, i) => {
      const x = -600 + rnd(i, 3) * 1150, y = -240 + rnd(i, 5) * 460;
      const b = 0.5 + 0.5 * Math.sin(t / 6 + i);
      return <g key={i}><circle cx={x} cy={y} r={20} fill="#FFD21F" opacity={0.25 * b} /><circle cx={x} cy={y} r={8} fill="#FFE97A" /></g>;
    })}
  </g>
);
