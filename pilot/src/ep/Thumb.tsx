import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill } from 'remotion';
import { Character, runPose, with_ } from '../Character';
import { World } from '../World';
import { Cam, Puffs, Steam, rnd } from './set3d';
import { C, FONT } from './cards';

export const Thumb: React.FC = () => {
  const f = 40;
  return (
    <AbsoluteFill style={{ background: '#4a94ee' }}>
      <ThreeCanvas width={1280} height={720} shadows camera={{ fov: 30, near: 0.1, far: 2000 }} gl={{ antialias: true }}>
        <Cam pos={[2.4, 1.2, 4.6]} target={[-0.6, 1.15, 0]} fov={30} />
        <World />
        <Character position={[0, 0, 0]} yaw={Math.PI / 2 + 0.5} pose={with_(runPose(1.2, 1.25), { lean: 0.5, eyeScale: 1.45, headYaw: -0.5 })} look={{ glow: 1 }} pupil={[-0.6, 0.2]} />
        <Steam p={[0, 2.1, 0]} f={f} amount={0.8} />
        <Puffs f={30} list={Array.from({ length: 14 }, (_, i) => ({ p: [-0.6 - i * 0.25, 0.05, (rnd(i) - 0.5) * 0.5] as [number, number, number], born: i * 1.5, size: 0.35, life: 40 }))} />
      </ThreeCanvas>
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(10,16,40,0.55) 0%, rgba(10,16,40,0.0) 55%)' }} />
      <div style={{ position: 'absolute', left: 50, top: 70, fontFamily: FONT, fontWeight: 900, lineHeight: 0.92 }}>
        <div style={{ fontSize: 190, color: C.yellow, WebkitTextStroke: `14px ${C.navy}`, paintOrder: 'stroke fill', textShadow: `10px 10px 0 ${C.navy}` }}>50×</div>
        <div style={{ fontSize: 130, color: '#fff', WebkitTextStroke: `12px ${C.navy}`, paintOrder: 'stroke fill', textShadow: `8px 8px 0 ${C.navy}` }}>FASTER</div>
      </div>
      <div style={{ position: 'absolute', left: 60, top: 470, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#fff', background: C.red, padding: '8px 26px', borderRadius: 16, border: `6px solid ${C.navy}`, transform: 'rotate(-4deg)' }}>
        …and COOKED 🔥
      </div>
    </AbsoluteFill>
  );
};
