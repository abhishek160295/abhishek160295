import * as THREE from 'three';
import { useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Character, IDLE, MAX, runPose, STRANGER, walkPose, with_ } from '../Character';
import { World } from '../World';
import { Bus, BusStop, Cam, Car, GEO, Puffs, rnd, Room, Town } from './set3d';
import { Part, toonMat } from '../toon';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const L = (f: number, a: number, b: number, v0: number, v1: number, e = Easing.inOut(Easing.cubic)) => interpolate(f, [a, b], [v0, v1], { ...clamp, easing: e });

const Stage: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = '#cfe3f5' }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 38, near: 0.1, far: 2000 }} gl={{ antialias: true }}>
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/** red digital alarm clock with canvas-drawn digits */
const Clock: React.FC<{ text: string; on: boolean }> = ({ text, on }) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const g = c.getContext('2d')!;
    g.fillStyle = '#1a0c10';
    g.fillRect(0, 0, 256, 128);
    if (on) {
      g.fillStyle = '#ff2d3d';
      g.font = 'bold 96px monospace';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(text, 128, 68);
    }
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, [text, on]);
  return (
    <group>
      <Part geometry={GEO.box} color="#e8443a" scale={[0.9, 0.5, 0.4]} line={0.02} />
      <mesh position={[0, 0.02, 0.205]}>
        <planeGeometry args={[0.76, 0.36]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </group>
  );
};

/** 0: alarm at 7:59 — Max asleep, then bolts upright */
export const Bedroom: React.FC<{ wakeAt: number; close?: boolean }> = ({ wakeAt, close }) => {
  const f = useCurrentFrame();
  const awake = f >= wakeAt;
  const shake = !awake ? Math.sin(f * 2.5) * 0.02 : 0;
  return (
    <Stage bg="#2a2240">
      <Room wall="#4b3f6b" floor="#5a4a3a" />
      <ambientLight intensity={0.25} color="#7f6fff" />
      {close ? <Cam pos={[1.6 + shake, 1.15, 2.2]} target={[1.2, 0.95, 0]} fov={34} lock /> : <Cam pos={[3.6, 2.4, 4.2]} target={[0, 0.8, -0.6]} fov={40} lock />}
      {/* bed */}
      <Part geometry={GEO.box} color="#3d5a9e" position={[-0.6, 0.35, -0.8]} scale={[1.8, 0.5, 3.2]} line={0.02} />
      <Part geometry={GEO.box} color="#f4f1ea" position={[-0.6, 0.65, -2.0]} scale={[1.2, 0.2, 0.6]} line={0.02} />
      <Part geometry={GEO.box} color="#6b8fd6" position={[-0.6, 0.66, -0.2]} scale={[1.85, 0.12, 2.0]} line={0.02} />
      {/* nightstand + clock */}
      <Part geometry={GEO.box} color="#8b5e3c" position={[1.2, 0.35, -1.6]} scale={[0.8, 0.7, 0.7]} line={0.02} />
      <group position={[1.2 + shake, 0.95, -1.5]} rotation={[0, -0.5, 0]}>
        <Clock text={awake ? '7:59' : '7:59'} on={Math.floor(f / 8) % 2 === 0 || awake} />
      </group>
      <Character
        position={[-0.6, awake ? 0.6 : 0.95, awake ? -0.9 : -1.2]}
        yaw={awake ? 0.6 : 0}
        pitch={awake ? 0 : -Math.PI / 2}
        pose={awake ? with_(IDLE, { thighL: -1.5, thighR: -1.5, kneeL: 0.2, kneeR: 0.2, eyeScale: 1.5, shoulderL: -0.4, shoulderR: -0.4, armSpread: 0.6, headYaw: 0.4 }) : with_(IDLE, { blink: 1 })}
        pupil={awake ? [0.6, 0] : [0, 0]}
      />
      <pointLight position={[1.2, 1.2, -1.2]} color="#ff2d3d" intensity={2} distance={4} />
    </Stage>
  );
};

/** morning routine in a blur: multiple ghost Max copies smeared across the room */
export const MorningBlur: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage bg="#f3e3c3">
      <Room />
      <Cam pos={[0.5, 2.0, 6.5]} target={[0, 1.2, 0]} fov={42} lock />
      {Array.from({ length: 6 }, (_, i) => {
        const x = Math.sin(f * 0.9 + i * 0.7) * 3.2;
        return (
          <Character
            key={i}
            position={[x, 0, 0.3 - i * 0.05]}
            yaw={Math.cos(f * 0.9 + i * 0.7) > 0 ? Math.PI / 2 : -Math.PI / 2}
            pose={with_(runPose(f * 1.5 + i, 1), {})}
            look={i ? { shirt: '#ffcfb0', pants: '#b7c3dd', shoe: '#f3a3aa', skin: '#a3a6b3' } : MAX}
          />
        );
      })}
      <Puffs f={f} list={Array.from({ length: 30 }, (_, i) => ({ p: [Math.sin(i * 1.3) * 3, 0.1, 0.3] as [number, number, number], born: i, size: 0.25, color: '#ffffff', life: 14 }))} />
    </Stage>
  );
};

/** Max blasts past the bus he missed */
export const Overtake: React.FC = () => {
  const f = useCurrentFrame();
  const busX = 10 + f * 0.3;
  const mx = -25 + f * 1.6;
  return (
    <Stage>
      <Cam pos={[busX + 2, 1.5, 9]} target={[busX + 1, 1.6, 0]} fov={44} lock />
      <Town near="sidewalk" />
      <Bus x={busX} z={-1.2} />
      <Character position={[mx, 0, 1.6]} yaw={Math.PI / 2} pose={runPose(f * 1.4, 1.2)} />
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} geometry={GEO.box} position={[mx - 1.5 - i * 1.2, 0.6 + rnd(i) * 1.2, 1.6]} scale={[1.2, 0.03, 0.03]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7 - i * 0.06} />
        </mesh>
      ))}
      <Puffs f={f} list={Array.from({ length: 30 }, (_, i) => ({ p: [-25 + i * 3.2, 0.05, 1.6] as [number, number, number], born: i * 2, size: 0.5, life: 30 }))} />
    </Stage>
  );
};

/** aerial flyover of town with a dust trail racing along the street (title shot) */
export const Aerial: React.FC = () => {
  const f = useCurrentFrame();
  const cx = -20 + f * 0.25;
  const head = -30 + f * 1.9;
  return (
    <Stage>
      <Cam pos={[cx, 26 - f * 0.03, 30]} target={[cx + 14, 0, -2]} fov={45} lock />
      <Town near="park" x0={-80} x1={220} />
      <Puffs f={f} list={Array.from({ length: 60 }, (_, i) => ({ p: [-30 + i * 1.9 * 2, 0.1, 0.5] as [number, number, number], born: i * 2, size: 1.0, life: 40 }))} />
      <Character position={[head, 0, 0.5]} yaw={Math.PI / 2} pose={runPose(f * 1.4, 1.2)} look={{ ...MAX, scale: 1.6 }} />
    </Stage>
  );
};

/** Max vs a sprinter on the track */
export const RaceRunner: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const accel = (vmax: number, a: number) => (t < vmax / a ? 0.5 * a * t * t : (vmax * vmax) / (2 * a) + vmax * (t - vmax / a));
  const xMax = accel(47.8, 7.85);
  const xRun = accel(12.4, 5.5);
  const camX = Math.min(xMax, xRun + 25) * 0.6 + xRun * 0.4;
  return (
    <Stage>
      <Cam pos={[camX + 2, 1.6, 8]} target={[camX + 2, 1.0, 0]} fov={46} lock />
      <World cx={camX} />
      <Character position={[xRun, 0, -1.2]} yaw={Math.PI / 2} pose={runPose(xRun * 2.2, 1)} look={{ ...STRANGER, shirt: '#ffd23f', pants: '#2fa84f' }} />
      <Character position={[xMax, 0, 0.6]} yaw={Math.PI / 2} pose={runPose(f * 0.95, 1.15)} />
      <Puffs f={f} list={Array.from({ length: 40 }, (_, i) => ({ p: [i * 4, 0.05, 0.6] as [number, number, number], born: Math.sqrt((i * 8) / 7.85) * 30, size: 0.4, life: 26 }))} />
    </Stage>
  );
};

/** 0–100 drag race against a car */
export const DragRace: React.FC<{ goAt: number }> = ({ goAt }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, (f - goAt) / 30);
  const x = 0.5 * 7.85 * Math.min(t, 3.6) ** 2 + (t > 3.6 ? 28 * (t - 3.6) : 0);
  return (
    <Stage>
      <Cam pos={[x + 6, 1.4, 9]} target={[x + 1, 1.0, 0.5]} fov={42} lock />
      <Town near="sidewalk" x0={-30} x1={200} />
      <Car x={x + 1.4} z={-1.4} color="#e8443a" />
      <Character position={[x, 0, 1.4]} yaw={Math.PI / 2} pose={t > 0 ? runPose(f * 0.9, 1.1) : with_(IDLE, { lean: 0.6, thighL: -1.2, kneeL: 1.6, bob: -0.3 })} />
      <Puffs f={f} list={Array.from({ length: 30 }, (_, i) => ({ p: [i * 1.5, 0.05, 1.4] as [number, number, number], born: goAt + Math.sqrt((i * 3) / 7.85) * 30, size: 0.35, life: 24 }))} />
    </Stage>
  );
};

/** run on the track with speed driven by keyframes [frame, km/h] */
export const SpeedRun: React.FC<{ keys: [number, number][]; time?: 'day' | 'sunset' }> = ({ keys, time = 'day' }) => {
  const f = useCurrentFrame();
  const kmh = (fr: number) => interpolate(fr, keys.map((k) => k[0]), keys.map((k) => k[1]), clamp);
  let x = 0;
  for (let i = 0; i < f; i++) x += kmh(i) / 3.6 / 30;
  const v = kmh(f);
  const walking = v < 300;
  const pose = walking ? walkPose(f * 0.9) : runPose(f * 1.2, 1.15);
  const streaks = v > 400;
  return (
    <Stage>
      <Cam pos={[x + 1.5, 1.3, 5.2]} target={[x + 0.6, 1.1, 0]} fov={40} />
      <World cx={x} time={time} />
      <Character position={[x, 0, 0]} yaw={Math.PI / 2} pose={with_(pose, { eyeScale: streaks ? 1.3 : 1 })} />
      {streaks &&
        Array.from({ length: 16 }, (_, i) => {
          const tt = (f * 0.12 + rnd(i)) % 1;
          return (
            <mesh key={i} geometry={GEO.box} position={[x + 5 - tt * 10, 0.3 + rnd(i + 2) * 2, (rnd(i + 4) - 0.5) * 2]} scale={[2, 0.025, 0.025]}>
              <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
          );
        })}
    </Stage>
  );
};

export const BusStopWide: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Cam pos={[-4, 1.5, 9]} target={[0, 1.4, 2]} fov={40} lock />
      <Town near="sidewalk" />
      <BusStop x={0} />
      <Character position={[-0.6, 0.12, 4.6]} yaw={-0.3} pose={with_(IDLE, { shoulderL: -0.35, shoulderR: -0.35, elbowL: -1.6, elbowR: -1.6, armSpread: 0.65, headPitch: 0.15, blink: f % 50 < 3 ? 1 : 0 })} />
    </Stage>
  );
};
