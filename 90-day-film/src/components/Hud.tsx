import React from 'react';
import {useCurrentFrame} from 'remotion';
import {from, len, PHASES} from '../timeline';
import {DISPLAY, MONO} from '../theme';

/** Persistent 90-day progress HUD across the skill montage. Receives the film-level frame. */
export const Hud: React.FC<{offset: number}> = ({offset}) => {
  const g = useCurrentFrame() + offset;
  const ph = PHASES.find((p) => g >= from(p.key) && g < from(p.key) + len(p.key)) ?? PHASES[PHASES.length - 1];
  const t = Math.min(1, (g - from(ph.key)) / len(ph.key));
  const day = Math.round(ph.days[0] + (ph.days[1] - ph.days[0]) * t);
  return (
    <div style={{position: 'absolute', top: 70, left: 50, right: 50, fontFamily: MONO}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#fff'}}>
        <span style={{fontSize: 30, letterSpacing: 4}}>DAY <b style={{fontSize: 64, fontFamily: DISPLAY, fontWeight: 900}}>{String(day).padStart(2, '0')}</b><span style={{opacity: 0.5}}> / 90</span></span>
        <span style={{fontSize: 22, letterSpacing: 4, opacity: 0.8}}>DAYS {String(ph.days[0]).padStart(2, '0')}–{ph.days[1]}</span>
      </div>
      <div style={{display: 'flex', gap: 6, marginTop: 10}}>
        {PHASES.map((p) => {
          const w = p.days[1] - p.days[0] + 1;
          const fill = g >= from(p.key) + len(p.key) ? 1 : p === ph ? t : 0;
          return <div key={p.key} style={{flex: w, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.15)', overflow: 'hidden'}}>
            <div style={{width: `${fill * 100}%`, height: '100%', background: '#fff'}} /></div>;
        })}
      </div>
      <div style={{position: 'absolute', right: 0, top: 120, fontSize: 18, letterSpacing: 5, color: 'rgba(255,255,255,0.45)'}}>THE DATA GUY</div>
    </div>
  );
};
