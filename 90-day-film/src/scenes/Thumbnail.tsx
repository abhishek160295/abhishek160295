import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, DISPLAY} from '../theme';

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: '#000', fontFamily: DISPLAY}}>
    <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 100% 38%, 0 62%)'}}>
      <Img src={staticFile('img/before_916.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.25) translateY(8%)', filter: 'saturate(0.6) brightness(0.8)'}} />
    </div>
    <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(0 62%, 100% 38%, 100% 100%, 0 100%)'}}>
      <Img src={staticFile('img/after_916.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2) translateY(14%)'}} />
    </div>
    <div style={{position: 'absolute', left: -20, right: -20, top: '49%', height: 8, background: C.gold, transform: 'rotate(-12.5deg)', boxShadow: `0 0 40px ${C.gold}`}} />
    <div style={{position: 'absolute', top: 90, left: 60, fontSize: 64, fontWeight: 900, color: C.red, letterSpacing: 2, textShadow: '0 4px 20px #000'}}>DAY 0<br /><span style={{fontSize: 38, color: '#fff'}}>NO SKILLS. NO PROJECTS.</span></div>
    <div style={{position: 'absolute', bottom: 330, right: 60, textAlign: 'right', fontSize: 64, fontWeight: 900, color: C.gold, textShadow: '0 4px 20px #000'}}>DAY 90<br /><span style={{fontSize: 38, color: '#fff'}}>JOB-READY ANALYST</span></div>
    <div style={{position: 'absolute', bottom: 90, width: '100%', textAlign: 'center', fontSize: 92, fontWeight: 900, color: '#fff', letterSpacing: -2, textShadow: '0 6px 30px #000'}}>
      ZERO → DATA ANALYST
      <div style={{fontSize: 34, letterSpacing: 6, color: C.gold}}>THE DATA GUY · 90-DAY SYSTEM</div>
    </div>
  </AbsoluteFill>
);
