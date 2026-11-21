import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, DISPLAY, MONO} from '../theme';
import {clamp, lerp, pop, seeded} from '../lib';
import {Flash, Glass, Grid, LogoArrival, Particles, SkillTitle} from '../components/fx';

const Stage: React.FC<{bg: string; glow: string; children: React.ReactNode; grid?: string}> = ({bg, glow, children, grid}) => (
  <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 28%, ${glow}55 0%, transparent 55%)`}} />
    <Grid color={grid ?? glow} opacity={0.35} />
    <Particles color={glow} n={40} seed={glow.length} />
    {children}
    <Flash dur={4} color={glow} />
  </AbsoluteFill>
);

/* ───────────── EXCEL · chaos → structure ───────────── */
const FORMULAS = ['SUM', 'IF', 'SUMIFS', 'COUNTIFS', 'XLOOKUP', 'INDEX MATCH', 'PIVOT TABLE', 'CHARTS'];
export const Excel: React.FC = () => {
  const f = useCurrentFrame();
  const cols = 6, rows = 9;
  const messy = ['#N/A', '??', '12,0', ' ', '#REF!', 'n/a'];
  return (
    <Stage bg="#03140b" glow={C.excel}>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1010, height: 700, perspective: 1400}}>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 5, transform: `rotateX(${lerp(f, 0, 14, 50, 18)}deg)`, transformOrigin: 'top'}}>
          {Array.from({length: cols * rows}).map((_, i) => {
            const r = Math.floor(i / cols), c = i % cols;
            const d = (r + c) * 0.8;
            const clean = f > 6 + d * 0.6;
            const hdr = r === 0;
            const val = hdr ? ['Region', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'][c] : c === 0 ? ['North', 'South', 'East', 'West', 'Central', 'Metro', 'Rural', 'Online'][r - 1] : clean ? (seeded(i) * 90 + 10).toFixed(1) : messy[i % messy.length];
            return (
              <div key={i} style={{height: 62, borderRadius: 6, fontFamily: MONO, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: hdr ? '#fff' : clean ? '#d7ffe8' : '#ff9aa2',
                background: hdr ? C.excelDark : clean ? (c === 5 ? 'rgba(33,163,102,0.55)' : 'rgba(33,163,102,0.18)') : 'rgba(255,60,80,0.12)',
                border: `1px solid ${clean ? 'rgba(33,163,102,0.6)' : 'rgba(255,80,90,0.4)'}`,
                opacity: lerp(f, d * 0.5, d * 0.5 + 3, 0, 1), transform: `translateZ(${lerp(f, d * 0.5, d * 0.5 + 5, 300, 0)}px)`}}>{val}</div>
            );
          })}
        </div>
      </div>
      {FORMULAS.map((t, i) => {
        const a = (i / FORMULAS.length) * Math.PI * 2 + f * 0.05;
        const rad = lerp(f, 0, 12, 620, 420);
        return <div key={t} style={{position: 'absolute', left: 540 + Math.cos(a) * rad - 110, top: 470 + Math.sin(a) * rad * 0.42,
          width: 220, textAlign: 'center', fontFamily: MONO, fontSize: 28, fontWeight: 700, color: '#eafff3',
          padding: '8px 0', borderRadius: 40, background: 'rgba(16,124,65,0.6)', border: '1px solid #3ddc84',
          opacity: lerp(f, i * 0.8, i * 0.8 + 3, 0, 0.95)}}>={t}</div>;
      })}
      <LogoArrival src="logos/excel.svg" glow={C.excel} size={250} y={470} />
      <SkillTitle name="EXCEL" tag="FROM ZERO TO DATA CONFIDENCE" color="#5ff2a6" y={720} />
    </Stage>
  );
};

/* ───────────── SQL · raw data → answers ───────────── */
const Cyl: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
    <defs><linearGradient id="cy" x1="0" x2="1"><stop offset="0" stopColor="#1d4ed8" /><stop offset=".5" stopColor="#60a5fa" /><stop offset="1" stopColor="#1e3a8a" /></linearGradient></defs>
    <path d="M5 15v85c0 8 20 14 45 14s45-6 45-14V15" fill="url(#cy)" />
    {[42, 70].map((y) => <path key={y} d={`M5 ${y}c0 8 20 14 45 14s45-6 45-14`} fill="none" stroke="#bfdbfe" strokeWidth="2.5" />)}
    <ellipse cx="50" cy="15" rx="45" ry="14" fill="#93c5fd" stroke="#dbeafe" strokeWidth="2" />
  </svg>
);
const Table: React.FC<{title: string; cols: string[]; x: number; lit: number}> = ({title, cols, x, lit}) => (
  <Glass tint="#60a5fa" style={{left: x, top: 1080, width: 430, padding: 0}}>
    <div style={{fontFamily: MONO, fontSize: 26, color: '#bfdbfe', padding: '14px 20px', background: 'rgba(59,130,246,0.35)'}}>{title}</div>
    {Array.from({length: 7}).map((_, r) => (
      <div key={r} style={{display: 'flex', fontFamily: MONO, fontSize: 22, color: '#e0ecff', padding: '9px 20px',
        background: r < lit ? 'rgba(56,225,255,0.22)' : 'transparent', borderTop: '1px solid rgba(147,197,253,0.18)'}}>
        {cols.map((c, i) => <span key={c} style={{flex: 1}}>{r === 0 ? c : i === 0 ? 100 + r : ['₹', '', ''][i] + Math.round(seeded(r * 9 + i + x) * 900)}</span>)}
      </div>
    ))}
  </Glass>
);
export const Sql: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, fps, 0, 13, 0.5);
  const merge = lerp(f, 6, 14, 0, 1);
  const kw = ['SELECT', 'JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'CTE', 'WINDOW FN', 'CASE WHEN'];
  return (
    <Stage bg="#020818" glow={C.sql}>
      <div style={{position: 'absolute', left: 540 - 110, top: 330, transform: `scale(${p}) rotateY(${(1 - p) * 120}deg)`, filter: `drop-shadow(0 0 50px ${C.sql})`}}>
        <Cyl size={220} />
      </div>
      <Img src={staticFile('logos/sqlserver.svg')} style={{position: 'absolute', left: 170, top: 420, width: 110, opacity: lerp(f, 4, 8, 0, 0.9), filter: 'invert(1) brightness(1.4)'}} />
      <Img src={staticFile('logos/postgresql.svg')} style={{position: 'absolute', right: 170, top: 420, width: 110, opacity: lerp(f, 5, 9, 0, 0.9)}} />
      <SkillTitle name="SQL" tag="LEARN TO THINK IN DATA" color="#93c5fd" y={650} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 940, fontFamily: MONO, fontSize: 27, color: '#c7d7ff', textAlign: 'center', opacity: lerp(f, 2, 6, 0, 1)}}>
        <span style={{color: '#f472b6'}}>SELECT</span> region, <span style={{color: '#fbbf24'}}>SUM</span>(o.revenue) <span style={{color: '#f472b6'}}>FROM</span> orders o<br />
        <span style={{color: '#38e1ff'}}>JOIN</span> customers c <span style={{color: '#f472b6'}}>ON</span> o.cid = c.id <span style={{color: '#f472b6'}}>GROUP BY</span> region;
      </div>
      <Table title="orders" cols={['id', 'revenue', 'cid']} x={lerp(f, 0, 12, -460, 60 + merge * 40)} lit={Math.floor(lerp(f, 10, 20, 0, 7))} />
      <Table title="customers" cols={['id', 'region', 'ltv']} x={lerp(f, 0, 12, 1100, 590 - merge * 40)} lit={Math.floor(lerp(f, 10, 20, 0, 7))} />
      <div style={{position: 'absolute', left: 540 - 70, top: 1260, width: 140, height: 140, borderRadius: '50%', border: `4px solid ${C.cyan}`,
        boxShadow: `0 0 60px ${C.cyan}`, opacity: merge, transform: `scale(${merge})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: MONO, fontWeight: 700, color: '#fff', fontSize: 30, background: 'rgba(2,8,24,0.85)'}}>JOIN</div>
      <div style={{position: 'absolute', top: 1560, left: 40, right: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12}}>
        {kw.map((k, i) => <span key={k} style={{fontFamily: MONO, fontSize: 25, color: '#dbeafe', padding: '8px 16px', borderRadius: 30,
          border: '1px solid #3b82f6', background: 'rgba(59,130,246,0.18)', opacity: lerp(f, 4 + i, 7 + i, 0, 1)}}>{k}</span>)}
      </div>
    </Stage>
  );
};

/* ───────────── PYTHON · manual → intelligent ───────────── */
const CODE = [
  ['import', ' pandas as pd, numpy as np'],
  ['df', ' = pd.read_csv("sales.csv")'],
  ['df', ' = df.drop_duplicates().dropna()'],
  ['df', '["margin"] = np.round(df.profit / df.revenue, 2)'],
  ['df', '.groupby("region").revenue.sum().plot.bar()'],
];
export const Python: React.FC = () => {
  const f = useCurrentFrame();
  const chars = Math.floor(lerp(f, 1, 13, 0, 230, (x) => x));
  let used = 0;
  return (
    <Stage bg="#0b0f1a" glow={C.python} grid={C.pythonBlue}>
      <LogoArrival src="logos/python.svg" glow={C.python} size={260} y={430} />
      <SkillTitle name="PYTHON" tag="TURN DATA INTO INTELLIGENCE" color={C.python} y={640} />
      <div style={{position: 'absolute', top: 905, width: '100%', display: 'flex', justifyContent: 'center', gap: 46}}>
        {['numpy', 'pandas', 'matplotlib', 'seaborn'].map((l, i) => (
          <Img key={l} src={staticFile(`logos/${l}.svg`)} style={{height: 84, opacity: lerp(f, 2 + i * 1.5, 5 + i * 1.5, 0, 1),
            transform: `translateY(${lerp(f, 2 + i * 1.5, 7 + i * 1.5, 40, 0)}px)`, filter: l === 'pandas' ? 'invert(1) hue-rotate(180deg)' : 'none'}} />
        ))}
      </div>
      <Glass tint="#3776ab" style={{left: 60, right: 60, top: 1040, height: 380, padding: '22px 28px'}}>
        <div style={{display: 'flex', gap: 10, marginBottom: 14}}>{['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />)}<span style={{fontFamily: MONO, color: C.dim, fontSize: 20, marginLeft: 12}}>analysis.py</span></div>
        {CODE.map(([k, rest], i) => {
          const line = k + rest; const show = Math.max(0, Math.min(line.length, chars - used)); used += line.length;
          const txt = line.slice(0, show);
          return <div key={i} style={{fontFamily: MONO, fontSize: 25, lineHeight: '56px', color: '#e6edf3', whiteSpace: 'pre'}}>
            <span style={{color: '#6e7681'}}>{i + 1}  </span><span style={{color: '#ff7b72'}}>{txt.slice(0, k.length)}</span>{txt.slice(k.length)}
            {show > 0 && show < line.length && <span style={{background: C.python, color: C.python}}>|</span>}</div>;
        })}
      </Glass>
      <div style={{position: 'absolute', left: 120, right: 120, top: 1460, height: 280, display: 'flex', alignItems: 'flex-end', gap: 22}}>
        {[0.55, 0.8, 0.42, 0.95, 0.68, 0.5, 0.85].map((h, i) => (
          <div key={i} style={{flex: 1, height: `${lerp(f, 6 + i, 12 + i, 0, h * 100)}%`, borderRadius: '10px 10px 0 0',
            background: `linear-gradient(180deg, ${C.python}, ${C.pythonBlue})`, boxShadow: `0 0 24px ${C.python}55`}} />
        ))}
      </div>
    </Stage>
  );
};

/* ───────────── STATISTICS · numbers → understanding ───────────── */
export const Stats: React.FC = () => {
  const f = useCurrentFrame();
  const W = 900, H = 330;
  const pts = Array.from({length: 61}, (_, i) => { const x = i / 60; const z = (x - 0.5) / 0.15; return [x * W, H - Math.exp(-z * z / 2) * (H - 20)]; });
  const d = 'M' + pts.map((p) => p.join(',')).join(' L');
  const draw = lerp(f, 0, 10, 0, 1);
  return (
    <Stage bg="#0c0618" glow={C.stats}>
      <SkillTitle name="STATISTICS" tag="UNDERSTAND WHAT THE DATA IS SAYING" color="#c4b5fd" y={330} />
      <svg width={W} height={H + 60} style={{position: 'absolute', left: 90, top: 640, overflow: 'visible'}}>
        <path d={d + ` L${W},${H} L0,${H} Z`} fill="rgba(167,139,250,0.18)" opacity={draw} />
        <path d={d} fill="none" stroke={C.stats} strokeWidth={6} strokeDasharray={2000} strokeDashoffset={2000 * (1 - draw)} style={{filter: `drop-shadow(0 0 14px ${C.stats})`}} />
        {[-1, 0, 1].map((k) => <line key={k} x1={W / 2 + k * 135} x2={W / 2 + k * 135} y1={20} y2={H} stroke="#fff" strokeOpacity={0.5 * draw} strokeDasharray="6 8" />)}
        <text x={W / 2} y={H + 48} fill="#fff" fontSize={34} fontFamily={MONO} textAnchor="middle" opacity={draw}>μ</text>
        <text x={W / 2 + 135} y={H + 48} fill="#c4b5fd" fontSize={30} fontFamily={MONO} textAnchor="middle" opacity={draw}>+1σ</text>
        <text x={W / 2 - 135} y={H + 48} fill="#c4b5fd" fontSize={30} fontFamily={MONO} textAnchor="middle" opacity={draw}>−1σ</text>
      </svg>
      <svg width={900} height={560} style={{position: 'absolute', left: 90, top: 1120}}>
        {Array.from({length: 70}).map((_, i) => {
          const x = seeded(i) * 860 + 20; const y = 520 - x * 0.52 - (seeded(i * 5) - 0.5) * 190;
          return <circle key={i} cx={x} cy={y} r={9} fill={C.stats} opacity={lerp(f, i * 0.12, i * 0.12 + 3, 0, 0.85)} />;
        })}
        <line x1={20} y1={510} x2={20 + 860 * lerp(f, 7, 14, 0, 1)} y2={510 - 860 * 0.52 * lerp(f, 7, 14, 0, 1)} stroke="#fff" strokeWidth={5} style={{filter: 'drop-shadow(0 0 10px #fff)'}} />
      </svg>
      <div style={{position: 'absolute', top: 1700, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 32, color: '#ede9fe', opacity: lerp(f, 8, 12, 0, 1)}}>
        r = 0.82 · p &lt; 0.05 · A/B TEST: B WINS
      </div>
    </Stage>
  );
};

/* ───────────── POWER BI · data → decisions ───────────── */
const Kpi: React.FC<{l: string; v: string; d: number; x: number; up: string}> = ({l, v, d, x, up}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const p = pop(f, fps, d, 12, 0.4);
  return <Glass tint={C.powerbi} style={{left: x, top: 1000, width: 300, height: 170, padding: 20, transform: `translateZ(0) scale(${p})`, opacity: p}}>
    <div style={{fontFamily: DISPLAY, fontSize: 22, letterSpacing: 3, color: '#fff3b0', fontWeight: 700}}>{l}</div>
    <div style={{fontFamily: DISPLAY, fontSize: 58, fontWeight: 900, color: '#fff'}}>{v}</div>
    <div style={{fontFamily: MONO, fontSize: 20, color: '#4ade80'}}>{up}</div>
  </Glass>;
};
export const PowerBI: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, fps, 7, 12, 0.5);
  const filt = f > 14 ? 1 : 0; // a slicer gets clicked, the bars re-flow
  return (
    <Stage bg="#120f02" glow={C.powerbi}>
      <LogoArrival src="logos/powerbi.svg" glow={C.powerbi} size={230} y={420} />
      <SkillTitle name="POWER BI" tag="MAKE DATA VISUALLY POWERFUL" color={C.powerbi} y={610} />
      <div style={{position: 'absolute', top: 905, width: '100%', display: 'flex', justifyContent: 'center', gap: 14}}>
        {['POWER QUERY', 'MODEL', 'DAX', 'KPIs'].map((t, i) => <span key={t} style={{fontFamily: MONO, fontSize: 23, padding: '6px 14px', borderRadius: 8,
          color: '#1a1400', background: C.powerbi, opacity: lerp(f, 3 + i, 6 + i, 0, 1)}}>{t}</span>)}
      </div>
      <Kpi l="REVENUE" v="₹4.2Cr" d={4} x={45} up="▲ 12.4% YoY" />
      <Kpi l="MARGIN" v="18.4%" d={6} x={390} up="▲ 2.1 pts" />
      <Kpi l="ORDERS" v="12.8K" d={8} x={735} up="▲ 9.7%" />
      <Glass tint={C.powerbi} style={{left: 45, right: 45, top: 1200, height: 520, padding: 26, opacity: p, transform: `perspective(1200px) rotateX(${(1 - p) * 40}deg)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: DISPLAY, color: '#fff', fontSize: 26, fontWeight: 700}}>
          <span>Sales by Region</span>
          <span style={{display: 'flex', gap: 8}}>{['All', 'FY26'].map((s, i) => <span key={s} style={{fontSize: 20, padding: '4px 14px', borderRadius: 20,
            background: i === filt ? C.powerbi : 'rgba(255,255,255,0.12)', color: i === filt ? '#1a1400' : '#fff'}}>{s}</span>)}</span>
        </div>
        <div style={{display: 'flex', gap: 30, marginTop: 24, height: 380}}>
          <div style={{flex: 1.6, display: 'flex', alignItems: 'flex-end', gap: 14}}>
            {[0.7, 0.45, 0.9, 0.6, 0.35, 0.8].map((h, i) => {
              const hh = filt ? [0.5, 0.85, 0.6, 0.95, 0.4, 0.7][i] : h;
              return <div key={i} style={{flex: 1, height: `${hh * 100 * p}%`, background: i % 2 ? '#f2c811' : '#e8a400', borderRadius: '6px 6px 0 0'}} />;
            })}
          </div>
          <svg viewBox="0 0 42 42" style={{flex: 1}}>
            {[[40, '#f2c811'], [25, '#e8a400'], [20, '#fff3b0'], [15, '#8a6d00']].reduce<{acc: number; el: React.ReactNode[]}>((o, [v, c], i) => {
              o.el.push(<circle key={i} cx={21} cy={21} r={15.9} fill="none" stroke={c as string} strokeWidth={6}
                strokeDasharray={`${(v as number) * p} ${100 - (v as number) * p}`} strokeDashoffset={25 - o.acc} />); o.acc += v as number; return o;
            }, {acc: 0, el: []}).el}
          </svg>
        </div>
      </Glass>
      <div style={{position: 'absolute', top: 1745, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 26, color: '#fff3b0', opacity: lerp(f, 10, 14, 0, 1)}}>
        Total Sales = SUM ( Sales[Amount] )
      </div>
    </Stage>
  );
};

/* ───────────── TABLEAU · information → story ───────────── */
export const Tableau: React.FC = () => {
  const f = useCurrentFrame();
  const T = C.tableau;
  const tiles = [[0, 0, 55, 60], [55, 0, 45, 35], [55, 35, 25, 25], [80, 35, 20, 25], [0, 60, 30, 40], [30, 60, 40, 40], [70, 60, 30, 40]];
  return (
    <Stage bg="#071018" glow="#4e79a7">
      <Sequence from={0}><Particles color={T[1]} n={60} burst seed={11} /></Sequence>
      <Sequence from={0}><Particles color={T[2]} n={60} burst seed={12} /></Sequence>
      <LogoArrival src="logos/tableau.svg" glow="#e8762c" size={240} y={420} />
      <SkillTitle name="TABLEAU" tag="MAKE INSIGHTS IMPOSSIBLE TO IGNORE" color="#ffb36b" y={610} />
      <div style={{position: 'absolute', left: 60, width: 520, top: 960, height: 760}}>
        {tiles.map(([x, y, w, h], i) => (
          <div key={i} style={{position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, padding: 4}}>
            <div style={{width: '100%', height: '100%', borderRadius: 8, background: T[i % T.length], opacity: lerp(f, i, i + 4, 0, 0.92),
              transform: `scale(${lerp(f, i, i + 6, 0.2, 1)})`}} />
          </div>
        ))}
      </div>
      <Glass tint="#76b7b2" style={{left: 610, width: 410, top: 960, height: 760, padding: 18}}>
        <div style={{fontFamily: DISPLAY, color: '#fff', fontSize: 24, fontWeight: 700}}>Growth by City</div>
        {Array.from({length: 54}).map((_, i) => {
          const x = (i % 6) * 62 + 30 + (Math.floor(i / 6) % 2) * 31, y = Math.floor(i / 6) * 70 + 70;
          const v = seeded(i * 3);
          return <div key={i} style={{position: 'absolute', left: x, top: y, width: 18 + v * 30, height: 18 + v * 30, borderRadius: '50%',
            background: T[Math.floor(v * 7)], opacity: lerp(f, 3 + i * 0.12, 6 + i * 0.12, 0, 0.9), transform: 'translate(-50%,-50%)'}} />;
        })}
      </Glass>
    </Stage>
  );
};

/* ───────────── GIT + GITHUB · learning → proof ───────────── */
const PROJECTS = [['01', 'SALES PERFORMANCE ANALYSIS', 'SQL · Excel · Power BI'], ['02', 'CUSTOMER CHURN ANALYSIS', 'Python · pandas · Statistics'], ['03', 'BUSINESS PROFITABILITY DASHBOARD', 'Power BI · DAX · Tableau']];
export const GitHub: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Stage bg="#06090f" glow={C.github}>
      <LogoArrival src="logos/github.svg" glow="#ffffff" size={210} y={360} invert />
      <Img src={staticFile('logos/git.svg')} style={{position: 'absolute', left: 820, top: 300, width: 110, opacity: lerp(f, 3, 6, 0, 1), transform: `rotate(${lerp(f, 3, 10, -90, 0)}deg)`}} />
      <SkillTitle name="PORTFOLIO" tag="LEARNING → PROOF" color="#7ee787" y={520} />
      <div style={{position: 'absolute', left: 90, top: 790, display: 'grid', gridTemplateColumns: 'repeat(26, 30px)', gap: 5}}>
        {Array.from({length: 26 * 5}).map((_, i) => {
          const v = seeded(i * 13); const on = f > (i % 26) * 0.5;
          return <div key={i} style={{width: 30, height: 30, borderRadius: 6, background: on ? ['#0e4429', '#006d32', '#26a641', '#39d353'][Math.floor(v * 4)] : '#161b22'}} />;
        })}
      </div>
      {PROJECTS.map(([n, t, s], i) => {
        const p = pop(f, fps, 3 + i * 3, 13, 0.5);
        return <Glass key={n} tint="#3fb950" style={{left: 60, right: 60, top: 1000 + i * 250, height: 220, padding: '24px 30px',
          transform: `perspective(1200px) translateZ(${(1 - p) * -600}px) rotateX(${(1 - p) * 30}deg)`, opacity: p}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
            <div style={{fontFamily: DISPLAY, fontSize: 84, fontWeight: 900, color: '#3fb950'}}>{n}</div>
            <div>
              <div style={{fontFamily: MONO, fontSize: 20, color: '#8b949e'}}>thedataguy / project-{n} · README.md · ★</div>
              <div style={{fontFamily: DISPLAY, fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.1}}>{t}</div>
              <div style={{fontFamily: MONO, fontSize: 22, color: '#7ee787', marginTop: 6}}>{s}</div>
            </div>
          </div>
        </Glass>;
      })}
    </Stage>
  );
};
