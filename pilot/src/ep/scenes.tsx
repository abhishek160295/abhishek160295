import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { AIR, CARRY, Character, CROUCH, DAVE, HIGHFIVE, IDLE, KID, mixPose, Pose, runPose, SHRUG, SIT, SQUAT, STRANGER, THROW_BACK, THROW_FWD, TYPE, walkPose, with_ } from '../Character';
import { World } from '../World';
import { Backpack, Ball, Bench, Bus, BusStop, Cam, Car, Desk, Dog, GEO, Puffs, rnd, Room, Steam, Sweat, Teacup, Town } from './set3d';
import { Part, toonMat } from '../toon';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.inOut(Easing.cubic);
const L = (f: number, a: number, b: number, v0: number, v1: number, e = ease) => interpolate(f, [a, b], [v0, v1], { ...clamp, easing: e });

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

const breathe = (f: number): Pose => with_(IDLE, { bob: Math.sin(f / 9) * 0.012, lean: Math.sin(f / 9) * 0.02 });
const blinkAt = (f: number, every = 70, off = 0) => {
  const k = (f + off) % every;
  return k < 3 ? [0, 1, 0.3][k] : 0;
};

/* ---------- S1: missed the bus ---------- */
export const BusMiss: React.FC<{ smugAt: number }> = ({ smugAt }) => {
  const f = useCurrentFrame();
  const doors = L(f, 0, 14, 0, 1);
  const busX = 1.5 + Math.max(0, f - 26) ** 2 * 0.006;
  const runEnd = 34;
  const mx = L(f, 0, runEnd, -9, -1.2, Easing.out(Easing.quad));
  const running = f < runEnd;
  let pose = running ? runPose(f * 0.75, 0.9) : mixPose(runPose(runEnd * 0.75, 0.9), breathe(f), L(f, runEnd, runEnd + 10, 0, 1));
  pose = with_(pose, {
    headYaw: L(f, smugAt, smugAt + 8, f > runEnd + 12 ? 0.4 : 0, -1.0),
    eyeScale: f > runEnd && f < runEnd + 24 ? 1.25 : 1,
    blink: blinkAt(f, 60, 20),
  });
  if (f > runEnd + 8 && f < smugAt) pose = with_(mixPose(pose, SHRUG, L(f, runEnd + 8, runEnd + 18, 0, 0.6)), { headPitch: 0.25 });
  const camX = L(f, 0, 60, -6, -2);
  return (
    <Stage>
      <Cam pos={[camX + 1.5, 1.6, 10.5]} target={[camX + 1.2, 1.5, 1.5]} fov={42} />
      <Town near="sidewalk" />
      <BusStop x={0} />
      <Bus x={busX} doors={doors} />
      <Character position={[mx, 0.12, 4.6]} yaw={f < smugAt ? Math.PI / 2 : Math.PI / 2 - L(f, smugAt, smugAt + 8, 0, 1.0)} pose={pose} pupil={f > smugAt ? [-0.3, 0.2] : [0, 0]} />
      <Puffs f={f} list={Array.from({ length: 8 }, (_, i) => ({ p: [busX - 5.6, 0.4, -0.6 + i * 0.1] as [number, number, number], born: 24 + i * 3, size: 0.4, color: '#9aa0ad', life: 30 }))} />
    </Stage>
  );
};

/* ---------- S1/S7: Road-Runner spinning feet ---------- */
export const SpinFeet: React.FC<{ env?: 'street' | 'track'; zipAt?: number }> = ({ env = 'street', zipAt = 1e9 }) => {
  const f = useCurrentFrame();
  const spin = Math.min(1, f / 12);
  const phase = f * (0.6 + spin * 2.2);
  const x0 = env === 'street' ? -1 : 0;
  const x = f < zipAt ? x0 + f * 0.006 : x0 + (f - zipAt) ** 2 * 0.25;
  const pose = with_(runPose(phase, 1.15), { lean: 0.55, headPitch: -0.1, eyeScale: 1.3, armSpread: 0.25 });
  const y = env === 'street' ? 0.12 : 0;
  const z = env === 'street' ? 4.6 : 0;
  const puffs = Array.from({ length: 40 }, (_, i) => ({
    p: [x - 0.3 - rnd(i) * 0.5, y + 0.05, z + (rnd(i + 3) - 0.5) * 0.6] as [number, number, number],
    born: i * 1.5,
    size: 0.25 + rnd(i + 7) * 0.25,
    life: 26,
  }));
  return (
    <Stage>
      <Cam pos={[x + 3.4, 1.2, z + 5.2]} target={[x + 0.1, 1.0, z]} fov={34} />
      {env === 'street' ? (
        <>
          <Town near="sidewalk" />
          <BusStop x={6} />
        </>
      ) : (
        <World />
      )}
      <Character position={[x, y, z]} yaw={Math.PI / 2} pose={pose} pupil={[0.6, 0]} />
      <Puffs f={f} list={puffs} />
    </Stage>
  );
};

/* ---------- lying on the pavement, steaming ---------- */
export const LyingSteam: React.FC<{ walkerFrom?: number }> = ({ walkerFrom = 1e9 }) => {
  const f = useCurrentFrame();
  const wx = L(f, walkerFrom, walkerFrom + 150, -8, 8, Easing.linear);
  return (
    <Stage>
      <Cam pos={[2.2, 1.9, 10.5]} target={[0, 0.5, 4.8]} fov={32} />
      <Town near="sidewalk" />
      <Character position={[0, 0.3, 4.6]} yaw={Math.PI / 2} pitch={-Math.PI / 2} pose={with_(IDLE, { shoulderL: -2.8, shoulderR: 0.2, blink: 0.6, eyeScale: 0.9 })} look={{ glow: 0.6 }} />
      <Steam p={[0.5, 1.1, 4.4]} f={f} amount={0.5} />
      <Sweat p={[0.2, 0.9, 4.6]} f={f} />
      {f >= walkerFrom && <Character position={[wx, 0.12, 3.9]} yaw={Math.PI / 2} pose={with_(walkPose(f * 0.25), { headYaw: Math.abs(wx) < 2 ? -0.9 : 0 })} look={STRANGER} />}
    </Stage>
  );
};

/* ---------- interiors ---------- */
export const Chores: React.FC<{ mode: 'dishes' | 'hoover' }> = ({ mode }) => {
  const f = useCurrentFrame();
  const r = (i: number) => rnd(f * 3.1 + i);
  const blur = with_(IDLE, {
    shoulderL: -0.6 - r(1) * 1.6, shoulderR: -0.6 - r(2) * 1.6, elbowL: -r(3) * 1.6, elbowR: -r(4) * 1.6,
    armSpread: 0.2 + r(5) * 0.5, eyeScale: 1.15, blink: blinkAt(f, 80),
  });
  const hx = mode === 'hoover' ? Math.sin(f * 1.7) * 3.5 : 0.4;
  return (
    <Stage bg="#f3e3c3">
      <Room />
      <Cam pos={[1.0, 2.0, mode === 'dishes' ? 4.6 : 7.5]} target={[0, 1.3, mode === 'dishes' ? -1.4 : 0]} fov={40} />
      {mode === 'dishes' && (
        <group position={[0, 0, -2.2]}>
          <Part geometry={GEO.box} color="#f4f1ea" position={[0, 0.5, 0]} scale={[4, 1, 1.2]} line={0.02} />
          <Part geometry={GEO.box} color="#c9d3df" position={[0, 1.02, 0]} scale={[4.1, 0.08, 1.3]} line={0.02} />
          {Array.from({ length: Math.min(12, Math.floor(f / 3)) }, (_, i) => (
            <Part key={i} geometry={GEO.cyl} color="#ffffff" position={[1.2, 1.1 + i * 0.07, 0]} scale={[0.4, 0.03, 0.4]} line={0.012} />
          ))}
        </group>
      )}
      {mode === 'hoover' &&
        [0, 1, 2].map((k) => (
          <Character key={k} position={[hx - k * Math.cos(f * 1.7) * 0.5, 0, 0.4]} yaw={Math.cos(f * 1.7) > 0 ? Math.PI / 2 : -Math.PI / 2} pose={walkPose(f * 2)} look={k ? { shirt: '#ffd0b0', pants: '#b7c3dd', shoe: '#f3a3aa', skin: '#9da0ad' } : undefined} />
        ))}
      {mode === 'dishes' && <Character position={[hx, 0, -1.2]} yaw={0.15} pose={blur} />}
      <Puffs f={f} list={Array.from({ length: 30 }, (_, i) => ({ p: [mode === 'hoover' ? Math.sin(i * 1.7) * 3.5 : 0.4 + (rnd(i) - 0.5), 0.1, 0.4] as [number, number, number], born: i * 2, size: 0.2, color: '#ffffff', life: 16 }))} />
    </Stage>
  );
};

export const Shower: React.FC = () => {
  const f = useCurrentFrame();
  const drops = Array.from({ length: 26 }, (_, i) => {
    const t = ((f * 0.025 + rnd(i)) % 1);
    return [(rnd(i + 2) - 0.5) * 0.9, 3.1 - t * 3.1, (rnd(i + 5) - 0.5) * 0.6] as [number, number, number];
  });
  const tap = Math.max(0, Math.sin(f * 0.5)) * 0.25;
  return (
    <Stage bg="#d7ecf2">
      <Room tiles wall="#d7ecf2" floor="#bcd6de" />
      <Cam pos={[0.8, 2.1, 6]} target={[0, 1.5, -1]} fov={40} />
      <Part geometry={GEO.cyl} color="#c0c6d1" position={[0, 3.3, -1.2]} rotation={[Math.PI / 2, 0, 0]} scale={[0.05, 1.2, 0.05]} line={0.02} />
      <Part geometry={GEO.cyl} color="#c0c6d1" position={[0, 3.2, -0.6]} scale={[0.3, 0.08, 0.3]} line={0.02} />
      {drops.map((d, i) => (
        <mesh key={i} geometry={GEO.ball} position={[d[0], d[1], -0.6 + d[2]]} scale={[0.03, 0.07, 0.03]} material={toonMat('#7fc8ff')} />
      ))}
      <Character position={[0, 0, -0.6]} yaw={0.1} pose={with_(IDLE, { thighR: -tap, kneeR: tap * 0.5, shoulderL: -0.2, elbowL: -1.8, armSpread: 0.5, headPitch: -0.35, blink: blinkAt(f, 50) })} pupil={[0, 0.8]} />
    </Stage>
  );
};

export const Typing: React.FC = () => {
  const f = useCurrentFrame();
  const r = (i: number) => rnd(f * 2.3 + i);
  return (
    <Stage bg="#f3e3c3">
      <Room />
      <Cam pos={[3.4, 1.9, 0.6]} target={[0, 1.25, -0.2]} fov={38} />
      <Desk p={[0, 0, -0.9]} screen={f % 4 < 2 ? '#e9f4ff' : '#d4e8ff'} />
      <Part geometry={GEO.box} color="#3b3f4f" position={[0, 0.48, 0.45]} scale={[0.7, 0.08, 0.7]} line={0.02} />
      <Character position={[0, 0.06, 0.45]} yaw={Math.PI} pose={with_(TYPE, { elbowL: -0.9 - r(1) * 0.4, elbowR: -0.9 - r(2) * 0.4, shoulderL: -0.9 - r(3) * 0.3, shoulderR: -0.9 - r(4) * 0.3, eyeScale: 1.2 })} />
    </Stage>
  );
};

export const HighFive: React.FC<{ contactAt: number }> = ({ contactAt }) => {
  const f = useCurrentFrame();
  const slow = L(f, 0, contactAt, 0, 1, Easing.in(Easing.quad));
  const davePose = mixPose(breathe(f), with_(HIGHFIVE, { eyeScale: 1 }), L(f, 0, 12, 0, 1));
  const maxPose = mixPose(breathe(f), with_(HIGHFIVE, { shoulderR: -2.6 + slow * 0.8 }), L(f, 4, 16, 0, 1));
  const shake = f >= contactAt ? Math.exp(-(f - contactAt) / 5) * 0.15 : 0;
  return (
    <Stage bg="#f3e3c3">
      <Room />
      <Cam pos={[0 + Math.sin(f * 3) * shake, 1.9 + Math.cos(f * 2.7) * shake, 6.5 - slow * 2]} target={[0, 1.7, 0]} fov={36} />
      <Desk p={[-3.5, 0, -2.5]} />
      <Character position={[-1.0, 0, 0]} yaw={Math.PI / 2} pose={maxPose} pupil={[0.3, 0]} />
      <Character position={[1.0, 0, 0]} yaw={-Math.PI / 2} pose={with_(davePose, { eyeScale: f > contactAt ? 1.5 : 1 })} look={DAVE} />
      {f >= contactAt && f < contactAt + 6 && (
        <mesh geometry={GEO.ball} position={[0, 2.15, 0]} scale={0.3 + (f - contactAt) * 0.5}>
          <meshBasicMaterial color="#fff6c4" transparent opacity={1 - (f - contactAt) / 6} />
        </mesh>
      )}
    </Stage>
  );
};

export const Bandage: React.FC<{ teaAt: number }> = ({ teaAt }) => {
  const f = useCurrentFrame();
  const tea = f >= teaAt;
  const mx = tea ? L(f, teaAt, teaAt + 120, -2.5, 1.5, Easing.linear) : -1.3;
  return (
    <Stage bg="#f3e3c3">
      <Room />
      <Cam pos={[0.3, 1.8, 6.2]} target={[0, 1.4, 0]} fov={38} />
      <Character
        position={[1.3, 0, -0.4]}
        yaw={-0.4}
        pose={with_(breathe(f), { shoulderR: -1.3, elbowR: -1.2, headPitch: 0.15, eyeScale: 0.9, blink: blinkAt(f, 45) })}
        look={DAVE}
        handR={<Part geometry={GEO.ball} color="#ffffff" scale={[0.22, 0.25, 0.22]} line={0.08} />}
        pupil={[0, -0.6]}
      />
      <Character
        position={[mx, 0, 0.6]}
        yaw={tea ? Math.PI / 2 : 0.5}
        pose={tea ? with_(walkPose(f * 0.12), { shoulderR: -1.25, elbowR: -0.35, headPitch: 0.3, eyeScale: 1.1 }) : with_(breathe(f), { shoulderL: -0.6, elbowL: -1.4, headPitch: 0.2 })}
        handR={tea ? <Teacup /> : undefined}
        pupil={tea ? [0, -0.7] : [0.4, -0.3]}
      />
    </Stage>
  );
};

/* ---------- track ---------- */
export const TrackCrouch: React.FC<{ scratchAt: number }> = ({ scratchAt }) => {
  const f = useCurrentFrame();
  const fr = Math.min(f, scratchAt);
  const pose = mixPose(breathe(fr), CROUCH, L(fr, 0, 20, 0, 1));
  const zoom = f >= scratchAt ? 0 : L(f, 0, scratchAt, 0, 1);
  return (
    <Stage>
      <Cam pos={[2.6 - zoom * 0.6, 1.2, 5.2 - zoom * 1.4]} target={[0.2, 0.8, 0]} fov={36} />
      <World />
      <Character position={[0, 0, 0]} yaw={Math.PI / 2 - 0.3} pose={with_(pose, { headYaw: f >= scratchAt ? -1.0 : 0, eyeScale: f >= scratchAt ? 1.35 : 1 })} pupil={f >= scratchAt ? [-0.5, 0] : [0, 0]} />
    </Stage>
  );
};

export const TrackRun: React.FC<{ speed: number; wind?: boolean; beans?: boolean; heat?: number; cam?: 'side' | 'front' }> = ({ speed, wind, beans, heat = 0, cam = 'side' }) => {
  const f = useCurrentFrame();
  const v = speed / 3.6;
  const x = 5 + (f / 30) * v;
  const pose = with_(runPose(f * 0.75, 1.1), { eyeScale: wind ? 0.75 : 1, headPitch: -0.25 });
  const streaks = wind
    ? Array.from({ length: 18 }, (_, i) => {
        const t = ((f * 0.08 + rnd(i)) % 1);
        return [x + 6 - t * 12, 0.4 + rnd(i + 2) * 1.8, (rnd(i + 4) - 0.5) * 2] as [number, number, number];
      })
    : [];
  return (
    <Stage>
      {cam === 'side' ? <Cam pos={[x + 1.2, 1.3, 5]} target={[x + 0.6, 1.1, 0]} fov={36} /> : <Cam pos={[x + 5, 1.5, 2.2]} target={[x, 1.1, 0]} fov={34} />}
      <World />
      <Character position={[x, 0, 0]} yaw={Math.PI / 2} pose={pose} back={beans ? <Backpack /> : undefined} look={heat ? { glow: heat } : undefined} />
      {streaks.map((s, i) => (
        <mesh key={i} geometry={GEO.box} position={s} scale={[1.6, 0.025, 0.025]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      ))}
      {heat > 0 && <Steam p={[x, 1.9, 0]} f={f} amount={heat * 1.5} />}
      <Puffs f={f} list={Array.from({ length: 40 }, (_, i) => ({ p: [5 + (i * 2 * v) / 30, 0.05, (rnd(i) - 0.5) * 0.4] as [number, number, number], born: i * 2, size: 0.25, life: 22 }))} />
    </Stage>
  );
};

/* ---------- street skid ---------- */
export const Skid: React.FC = () => {
  const f = useCurrentFrame();
  const u = Math.min(1, f / 75);
  const x = -40 + 40 * (1 - (1 - u) ** 2);
  const pose = with_(mixPose(runPose(0, 1), { ...IDLE, lean: -0.4, thighL: -0.9, kneeL: 0.1, thighR: 0.4, kneeR: 1.2, shoulderL: -1.8, shoulderR: -1.6, armSpread: 0.7, eyeScale: 1.35 }, Math.min(1, f / 8)), {});
  return (
    <Stage>
      <Cam pos={[x + 4.5, 1.5, 6]} target={[x, 1, 0]} fov={40} />
      <Town near="sidewalk" />
      <Character position={[x, 0, 0]} yaw={Math.PI / 2} pose={u < 1 ? pose : with_(breathe(f), { eyeScale: 1.2 })} />
      <Puffs f={f} list={Array.from({ length: 40 }, (_, i) => ({ p: [-40 + i, 0.05, (rnd(i) - 0.5) * 0.4] as [number, number, number], born: (i / 40) * 60, size: 0.5 + rnd(i) * 0.3, life: 50 }))} />
    </Stage>
  );
};

/* ---------- park ---------- */
export const ParkThrow: React.FC<{ throwAt: number; dogWatch?: boolean }> = ({ throwAt }) => {
  const f = useCurrentFrame();
  const k = f - throwAt;
  const pose = k < -10 ? breathe(f) : k < 0 ? mixPose(breathe(f), THROW_BACK, L(f, throwAt - 10, throwAt, 0, 1)) : mixPose(THROW_FWD, breathe(f), L(k, 8, 30, 0, 1));
  const bx = k < 0 ? null : -0.4 + k * 9;
  const dogYaw = k < 0 ? -0.6 : L(k, 0, 4, -0.6, Math.PI / 2 - 0.1);
  const shake = k >= 0 ? Math.exp(-k / 5) * 0.12 : 0;
  return (
    <Stage>
      <Cam pos={[-0.2 + Math.sin(f * 3) * shake, 1.6 + Math.cos(f * 2.5) * shake, 14]} target={[0.6, 1.2, 8]} fov={38} />
      <Town near="park" />
      <Character position={[-1, 0, 8]} yaw={Math.PI / 2 - 0.25} pose={pose} handR={k < 0 ? <Ball p={[0, 0, 0]} /> : undefined} />
      <Dog p={[1.2, 0, 9]} yaw={dogYaw} f={f} wag={k < 0 ? 1 : 0} />
      {bx !== null && <Ball p={[bx, 1.8 + k * 0.05, 8]} glow={Math.min(1, k / 3)} />}
      {bx !== null &&
        Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} geometry={GEO.box} position={[bx - 1.5 - i * 1.5, 1.8 + k * 0.05 - i * 0.02, 8]} scale={[1.5, 0.05 - i * 0.004, 0.05]}>
            <meshBasicMaterial color={i < 3 ? '#ffb347' : '#ffffff'} transparent opacity={0.8 - i * 0.07} />
          </mesh>
        ))}
    </Stage>
  );
};

export const DogWaits: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Cam pos={[-0.3, 1.1, 14.5]} target={[0.6, 0.8, 8]} fov={34} />
      <Town near="park" />
      <Dog p={[0, 0, 8.5]} yaw={Math.PI / 2 - 0.2} f={f} wag={0.15} sit />
      <Character position={[-2.0, 0, 7.4]} yaw={Math.PI / 2 - 0.2} pose={with_(SHRUG, { blink: blinkAt(f, 40) })} />
    </Stage>
  );
};

export const ParkJump: React.FC<{ jumpAt: number; landAt?: number }> = ({ jumpAt, landAt = 1e9 }) => {
  const f = useCurrentFrame();
  const k = f - jumpAt;
  const air = k >= 0 && f < landAt;
  const y = air ? Math.min(60, k * k * 0.3 + k * 2) : 0;
  const pose = k < 0 ? mixPose(breathe(f), SQUAT, L(f, jumpAt - 18, jumpAt, 0, 1)) : air ? AIR : with_(SQUAT, { eyeScale: 0.8, blink: 0.4 });
  const camY = air ? 1.6 + y * 0.9 : 1.6;
  const shake = k >= 0 && k < 10 ? (10 - k) * 0.03 : 0;
  return (
    <Stage>
      <Cam pos={[2.5 + Math.sin(f * 3) * shake, air ? y * 0.9 + 0.6 : 1.2, 14]} target={[0, air ? y + 1.1 : camY, 8]} fov={40} />
      <Town near="park" />
      <Character position={[0, y, 8]} yaw={0.15} pose={pose} look={f >= landAt ? { glow: 0.7 } : undefined} pupil={air ? [0, 1] : [0, 0]} />
      {k >= 0 && k < 40 && <Puffs f={k} list={Array.from({ length: 16 }, (_, i) => ({ p: [Math.cos(i) * 0.8, 0.05, 8 + Math.sin(i) * 0.8] as [number, number, number], born: 0, size: 0.6, life: 40 }))} />}
      {f >= landAt && <Steam p={[0, 1.9, 8]} f={f} amount={2} />}
    </Stage>
  );
};

/* ---------- rescue ---------- */
export const Rescue: React.FC<{ scoopAt: number; hopAt: number }> = ({ scoopAt, hopAt }) => {
  const f = useCurrentFrame();
  const passAt = hopAt + 18;
  const carX = 3 + (f - passAt) * 0.46; // 50 km/h
  const scooped = f >= scoopAt;
  const kidZ = L(f, 0, scoopAt, 5.0, 1.6, Easing.linear);
  const hop = f >= hopAt ? Math.max(0, Math.sin(Math.min(Math.PI, ((f - hopAt) / 42) * Math.PI))) * 2.2 : 0;
  const mStep = L(f, scoopAt - 7, scoopAt, 0, 1, Easing.out(Easing.quad));
  const mx = 1.4 + mStep * 1.6;
  const mz = 4.6 - mStep * 2.6;
  const maxPose = scooped ? (hop > 0.05 ? with_(CARRY, { thighL: -0.6, kneeL: 1.0, thighR: -0.3, kneeR: 0.8 }) : CARRY) : with_(breathe(f), { headYaw: 0.8, eyeScale: f > scoopAt - 20 ? 1.3 : 1 });
  const kidPos: [number, number, number] = scooped ? [mx, 0.95 + hop, mz - 0.5] : [3, 0, kidZ];
  return (
    <Stage>
      <Cam pos={[8.5, 2.1, 9.5]} target={[2.4, 1.1, 2.6]} fov={36} />
      <Town near="park" />
      <Car x={carX} z={1.3} color="#4aa3df" />
      <Character position={[mx, hop, mz]} yaw={scooped ? Math.PI : -0.2} pose={maxPose} pupil={[0.5, 0]} />
      <Character position={kidPos} yaw={scooped ? 0 : Math.PI} pose={scooped ? with_(IDLE, { shoulderL: -2.6, shoulderR: -2.6, eyeScale: hop > 0.3 ? 1.35 : 1, armSpread: 0.4 }) : walkPose(f * 0.4)} look={KID} />
      {!scooped && <Ball p={[3.4, 0.12, kidZ - 1.4]} />}
    </Stage>
  );
};

export const BenchScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Cam pos={[0.6, 1.6, 15.5]} target={[0, 1.0, 9]} fov={34} />
      <Town near="park" />
      <Bench p={[0, 0, 9]} />
      <Character
        position={[-0.4, 0.06, 9.15]}
        yaw={0}
        pose={with_(SIT, { shoulderR: -1.6 + Math.max(0, Math.sin(f * 0.15)) * 0.4, elbowR: -1.6, blink: blinkAt(f, 60) })}
        handR={<Part geometry={GEO.box} color="#f2c57c" scale={[0.4, 0.14, 0.25]} line={0.03} />}
      />
      <Dog p={[0.9, 0.55, 9]} yaw={-0.4} f={f} sleep wag={0} />
    </Stage>
  );
};

export const PresenterRun: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Cam pos={[3.5 + f * 0.02, 1.4, 6]} target={[0.2, 1.0, 0]} fov={36} />
      <World />
      <Character position={[0, 0, 0]} yaw={Math.PI / 2 - 0.6} pose={with_(breathe(f), { blink: blinkAt(f, 55), headYaw: -0.6 })} pupil={[-0.4, 0.1]} />
    </Stage>
  );
};
