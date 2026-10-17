import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { AIR, CARRY, Character, DAVE, HIGHFIVE, IDLE, KID, mixPose, runPose, SIT, SQUAT, walkPose, with_ } from '../Character';
import { Ball, Bus, Cam, Car, Desk, GEO, Puffs, rnd, Room, Town } from './set3d';
import { Part, toonMat } from '../toon';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
type V3 = [number, number, number];

/** time remap: real frame -> scene frame. segments of [realStart, speed] */
const remap = (f: number, segs: [number, number][]) => {
  let t = 0;
  for (let i = 0; i < segs.length; i++) {
    const [s, sp] = segs[i];
    const e = i + 1 < segs.length ? segs[i + 1][0] : Infinity;
    if (f <= s) break;
    t += (Math.min(f, e) - s) * sp;
  }
  return t;
};

const Stage: React.FC<{ children: React.ReactNode; bg?: string; flash?: number; shake?: number }> = ({ children, bg = '#cfe3f5', flash = 0 }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 38, near: 0.1, far: 2000 }} gl={{ antialias: true }}>
        {children}
      </ThreeCanvas>
      {flash > 0 && <AbsoluteFill style={{ background: '#fffbe8', opacity: flash }} />}
    </AbsoluteFill>
  );
};

/** flying debris: boxes launched from a point with gravity */
const Debris: React.FC<{ origin: V3; t: number; n?: number; color?: string; speed?: number; dir?: V3; size?: number }> = ({ origin, t, n = 30, color = '#ffffff', speed = 0.25, dir = [1, 0.6, 0], size = 0.12 }) => {
  if (t < 0) return null;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const vx = (dir[0] + (rnd(i) - 0.5) * 1.4) * speed;
        const vy = (dir[1] + rnd(i + 3) * 0.8) * speed;
        const vz = (dir[2] + (rnd(i + 7) - 0.5) * 1.4) * speed;
        const y = origin[1] + vy * t - 0.004 * t * t;
        if (y < 0 && t > 5) return null;
        return (
          <mesh key={i} geometry={GEO.box} position={[origin[0] + vx * t, Math.max(0.02, y), origin[2] + vz * t]} rotation={[t * 0.2 * rnd(i + 1), t * 0.3 * rnd(i + 2), t * 0.1]} scale={[size, size * 0.15 + rnd(i) * size, size * 0.8]} material={toonMat(color)} />
        );
      })}
    </group>
  );
};

const Shock: React.FC<{ p: V3; t: number; max?: number; vertical?: boolean; color?: string }> = ({ p, t, max = 30, vertical, color = '#ffffff' }) => {
  if (t < 0 || t > max) return null;
  const s = 0.5 + t * 0.9;
  return (
    <mesh position={p} rotation={vertical ? [0, Math.PI / 2, 0] : [-Math.PI / 2, 0, 0]} scale={s}>
      <torusGeometry args={[1, 0.05, 8, 64]} />
      <meshBasicMaterial color={color} transparent opacity={interpolate(t, [0, max], [0.9, 0], clamp)} depthWrite={false} />
    </mesh>
  );
};

/* ---------------- A. cold open: door explodes, slow-mo, snap ---------------- */
export const DoorBurst: React.FC = () => {
  const f = useCurrentFrame();
  const t = remap(f, [[0, 0.18], [22, 2.2]]);
  const mx = -1.2 + t * 0.55;
  const door = Math.min(1.9, t * 0.35);
  return (
    <Stage>
      <Cam pos={[5.5, 1.5, 13]} target={[0, 1.4, 6]} fov={40} lock />
      <Town near="sidewalk" />
      {/* house front */}
      <group position={[-1.6, 0, 6.6]}>
        <Part geometry={GEO.box} color="#f2c57c" position={[0, 2.5, -0.2]} scale={[6, 5, 0.3]} line={0.03} />
        <group position={[-0.3, 0, 0]} rotation={[0, door, 0]}>
          <Part geometry={GEO.box} color="#8b5e3c" position={[0.6, 1.1, 0]} scale={[1.2, 2.2, 0.12]} line={0.03} />
        </group>
      </group>
      <Character position={[mx, 0.2 + Math.sin(Math.min(Math.PI, t * 0.2)) * 0.4, 5.9]} yaw={Math.PI / 2 - 0.4} pose={with_(runPose(t * 0.6, 1.25), { eyeScale: 1.4 })} />
      <Debris origin={[-0.6, 1.4, 6.2]} t={t * 1.0} n={36} color="#ffffff" speed={0.09} dir={[1, 0.5, 0.6]} size={0.16} />
      <Puffs f={t} list={Array.from({ length: 20 }, (_, i) => ({ p: [-0.6 + i * 0.4, 0.2, 5.9] as V3, born: i * 1.5, size: 0.5, life: 30 }))} />
    </Stage>
  );
};

/* ---------------- B. the sound barrier ---------------- */
export const SoundBarrier: React.FC<{ boomAt: number; freezeAt: number }> = ({ boomAt, freezeAt }) => {
  const f = useCurrentFrame();
  const t = remap(Math.min(f, freezeAt), [[0, 1], [boomAt - 4, 0.2], [boomAt + 40, 1]]);
  const v = 1.5; // units per scene frame (cartoon-fast)
  const x = -40 + t * v;
  const k = t - (boomAt - 4 + 0); // scene frames since boom (approx)
  const kb = t - remap(boomAt, [[0, 1], [boomAt - 4, 0.2], [boomAt + 40, 1]]);
  const flash = interpolate(f, [boomAt, boomAt + 2, boomAt + 10], [0, 0.85, 0], clamp);
  const shake = f >= boomAt && f < freezeAt ? Math.exp(-(f - boomAt) / 14) * 0.25 : 0;
  const frozen = f >= freezeAt;
  const camX = x - 4;
  return (
    <AbsoluteFill style={{ filter: frozen ? 'sepia(0.7) contrast(1.05)' : undefined }}>
      <Stage flash={flash}>
        <Cam pos={[camX + Math.sin(f * 3) * shake, 1.0 + Math.cos(f * 2.7) * shake, 6.5]} target={[x - 0.5, 1.2, 0.8]} fov={44} lock />
        <Town near="sidewalk" x0={-80} x1={260} />
        <Bus x={x + 30} z={-1.4} />
        <Character position={[x, 0, 1.2]} yaw={Math.PI / 2} pose={with_(runPose(t * 1.3, 1.3), { eyeScale: 1.3 })} />
        {kb > 0 && (
          <mesh position={[x - 0.8, 1.1, 1.2]} rotation={[0, 0, Math.PI / 2]} scale={[1.4, 1.6, 1.4]}>
            <coneGeometry args={[1, 2.2, 32, 1, true]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={Math.min(0.55, kb * 0.05)} depthWrite={false} side={2} />
          </mesh>
        )}
        <Shock p={[x, 0.05, 1.2]} t={kb * 0.9} max={40} />
        <Shock p={[x, 1.2, 1.2]} t={kb * 0.7} max={40} vertical />
        {kb > 0 && (
          <mesh position={[x, 1.2, 1.2]} scale={0.5 + kb * 0.6}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshBasicMaterial color="#e8f4ff" transparent opacity={interpolate(kb, [0, 40], [0.35, 0], clamp)} depthWrite={false} />
          </mesh>
        )}
        <Debris origin={[x + 2, 3, -7.4]} t={kb} n={40} color="#a9d4f5" speed={0.12} dir={[0.2, 0.3, 1]} size={0.18} />
        <Debris origin={[x - 6, 4, -7.4]} t={kb - 3} n={30} color="#bfe3ff" speed={0.12} dir={[-0.2, 0.3, 1]} size={0.16} />
        <Puffs f={t} list={Array.from({ length: 50 }, (_, i) => ({ p: [-40 + i * 3, 0.05, 1.2] as V3, born: i * 2, size: 0.6, life: 40 }))} />
      </Stage>
    </AbsoluteFill>
  );
};

/* ---------------- C. grip fail: sparks and smoke, slow-mo close-up ---------------- */
export const GripFail: React.FC = () => {
  const f = useCurrentFrame();
  const t = remap(f, [[0, 0.35]]);
  const pose = with_(runPose(t * 3.2, 1.2), { lean: 0.6, eyeScale: 1.35 });
  return (
    <Stage>
      <Cam pos={[1.6, 0.35, 2.4]} target={[0, 0.4, 0]} fov={38} lock />
      <World2 />
      <Character position={[0, 0, 0]} yaw={Math.PI / 2} pose={pose} pupil={[0.7, -0.2]} />
      {Array.from({ length: 40 }, (_, i) => {
        const age = ((t * 2 + i * 3) % 24);
        const vx = -(0.05 + rnd(i) * 0.08);
        const vy = 0.03 + rnd(i + 3) * 0.05;
        return (
          <mesh key={i} geometry={GEO.ball} position={[0.1 + vx * age, 0.05 + vy * age - 0.003 * age * age, (rnd(i + 5) - 0.5) * 0.5]} scale={0.025}>
            <meshBasicMaterial color={i % 3 ? '#ffb347' : '#fff2a8'} transparent opacity={Math.max(0, 1 - age / 24)} />
          </mesh>
        );
      })}
      <Puffs f={t * 2} list={Array.from({ length: 40 }, (_, i) => ({ p: [-0.3 - rnd(i) * 0.6, 0.05, (rnd(i + 2) - 0.5) * 0.6] as V3, born: i * 1.2, size: 0.35, color: '#d9d2c6', life: 30 }))} />
    </Stage>
  );
};

/** compact track scene (close-ups don't need the whole stadium) */
const World2: React.FC = () => (
  <group>
    <color attach="background" args={['#cfe3f5']} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={toonMat('#d9653b')}>
      <planeGeometry args={[60, 12]} />
    </mesh>
    {[-1.8, -0.6, 0.6, 1.8].map((z) => (
      <mesh key={z} position={[0, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]} material={toonMat('#fdf6ec')}>
        <planeGeometry args={[60, 0.06]} />
      </mesh>
    ))}
    <hemisphereLight args={['#dfefff', '#7aa35c', 0.9]} />
    <directionalLight position={[8, 10, 6]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
  </group>
);

/* ---------------- D. high-five impact ---------------- */
export const HighFiveBoom: React.FC<{ contactAt: number }> = ({ contactAt }) => {
  const f = useCurrentFrame();
  const t = remap(f, [[0, 1], [contactAt - 8, 0.15], [contactAt + 30, 1]]);
  const tc = remap(contactAt, [[0, 1], [contactAt - 8, 0.15], [contactAt + 30, 1]]);
  const k = t - tc;
  const flash = interpolate(f, [contactAt, contactAt + 2, contactAt + 12], [0, 0.9, 0], clamp);
  const shake = f >= contactAt ? Math.exp(-(f - contactAt) / 10) * 0.2 : 0;
  return (
    <Stage bg="#f3e3c3" flash={flash}>
      <Room />
      <Cam pos={[Math.sin(f * 3) * shake, 1.9 + Math.cos(f * 2.7) * shake, 4.2]} target={[0, 1.9, 0]} fov={40} lock />
      <Desk p={[-3.5, 0, -2.5]} />
      <Character position={[-0.9, 0, 0]} yaw={Math.PI / 2} pose={with_(HIGHFIVE, { shoulderR: -2.6 + Math.min(1, t / 30) * 0.9, eyeScale: 1.2 })} pupil={[0.3, 0.3]} />
      <Character position={[0.9, 0, 0]} yaw={-Math.PI / 2} pose={with_(HIGHFIVE, { eyeScale: k > 0 ? 1.6 : 1, lean: k > 0 ? -0.3 : 0 })} look={DAVE} />
      <Shock p={[0, 2.1, 0]} t={k * 1.4} max={30} vertical />
      <Debris origin={[-3.5, 1.2, -2.5]} t={k} n={30} color="#ffffff" speed={0.12} dir={[0.6, 0.8, 0.8]} size={0.2} />
    </Stage>
  );
};

/* ---------------- E. the jump: launch + top-down altitude ---------------- */
export const JumpEpic: React.FC<{ jumpAt: number }> = ({ jumpAt }) => {
  const f = useCurrentFrame();
  const k = f - jumpAt;
  const y = k <= 0 ? 0 : Math.min(120, 0.11 * k * k + 1.5 * k);
  const pose = k < 0 ? mixPose(IDLE, SQUAT, interpolate(f, [jumpAt - 16, jumpAt], [0, 1], clamp)) : AIR;
  const flash = interpolate(f, [jumpAt, jumpAt + 2, jumpAt + 8], [0, 0.6, 0], clamp);
  const topDown = k > 28;
  return (
    <Stage flash={flash}>
      {topDown ? (
        <Cam pos={[0.01, y + 4.5, 8.4]} target={[0, y - 50, 8]} fov={55} lock />
      ) : (
        <Cam pos={[3, y + (k > 0 ? 3 : 0.4), 13]} target={[0, y + 1, 8]} fov={42} lock />
      )}
      <Town near="park" x0={-120} x1={160} />
      {/* simple 3D Eiffel silhouette in the distance */}
      <group position={[70, 0, -60]} scale={1.0}>
        <Part geometry={GEO.cone} color="#6b5b4b" position={[0, 45, 0]} scale={[14, 90, 14]} line={0} />
        <Part geometry={GEO.box} color="#3b3226" position={[0, 82, 0]} scale={[9, 1.2, 9]} line={0} />
      </group>
      <Character position={[0, y, 8]} yaw={topDown ? 0 : 0.15} pose={pose} pupil={k > 0 ? [0, topDown ? -1 : 1] : [0, 0]} />
      <Shock p={[0, 0.05, 8]} t={k * 1.2} max={30} />
      {k >= 0 && <Debris origin={[0, 0.1, 8]} t={k} n={40} color="#7a5a3a" speed={0.25} dir={[0, 1.2, 0]} size={0.18} />}
      {k >= 0 && <Puffs f={k} list={Array.from({ length: 18 }, (_, i) => ({ p: [Math.cos(i) * 1.2, 0.05, 8 + Math.sin(i) * 1.2] as V3, born: 0, size: 1.0, life: 45 }))} />}
    </Stage>
  );
};

/* ---------------- F. rescue with bullet-time freeze ---------------- */
export const RescueBullet: React.FC<{ freezeAt: number; resumeAt: number; scoopAt: number; hopAt: number }> = ({ freezeAt, resumeAt, scoopAt, hopAt }) => {
  const f = useCurrentFrame();
  const frozen = f >= freezeAt && f < resumeAt;
  const segs: [number, number][] = [[0, 1], [freezeAt, 0], [resumeAt, 0.28], [hopAt + 34, 1]];
  const sf = remap(f, segs);
  const sScoop = remap(scoopAt, segs);
  const sHop = remap(hopAt, segs);
  const passAt = sHop + 6;
  const carX = 3 + (sf - passAt) * 0.46;
  const scooped = sf >= sScoop;
  const kidZ = interpolate(sf, [0, sScoop], [5.0, 1.6], clamp);
  const hop = sf >= sHop ? Math.max(0, Math.sin(Math.min(Math.PI, ((sf - sHop) / 30) * Math.PI))) * 2.3 : 0;
  const mStep = interpolate(sf, [sScoop - 7, sScoop], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const mx = 1.4 + mStep * 1.6;
  const mz = 4.6 - mStep * 2.6;
  // camera: orbit while frozen
  const orbit = frozen ? interpolate(f, [freezeAt, resumeAt], [0, Math.PI * 1.1], { ...clamp, easing: Easing.inOut(Easing.quad) }) : f >= resumeAt ? Math.PI * 1.1 : 0;
  const cR = 7.5;
  const cx = 2.8 + Math.sin(0.75 + orbit) * cR;
  const cz = 2.2 + Math.cos(0.75 + orbit) * cR;
  const desat = frozen ? 0.85 : 0;
  return (
    <AbsoluteFill style={{ filter: desat ? `saturate(${1 - desat * 0.7}) contrast(1.08)` : undefined }}>
      <Stage>
        <Cam pos={[cx, frozen ? 1.6 : 2.0, cz]} target={[2.8, 1.0, 2.2]} fov={38} lock />
        <Town near="park" />
        <Car x={carX} z={1.3} color="#4aa3df" />
        <Character position={[mx, hop, mz]} yaw={scooped ? Math.PI : -0.2} pose={scooped ? with_(CARRY, hop > 0.05 ? { thighL: -0.6, kneeL: 1.0, thighR: -0.3, kneeR: 0.8 } : {}) : with_(IDLE, { headYaw: 0.8, eyeScale: sf > sScoop - 30 ? 1.4 : 1 })} pupil={[0.5, 0]} />
        <Character position={scooped ? [mx, 0.95 + hop, mz - 0.5] : [3, 0, kidZ]} yaw={scooped ? 0 : Math.PI} pose={scooped ? with_(IDLE, { shoulderL: -2.6, shoulderR: -2.6, eyeScale: hop > 0.3 ? 1.35 : 1, armSpread: 0.4 }) : walkPose(sf * 0.4)} look={KID} />
        {!scooped && <Ball p={[3.4, 0.12, kidZ - 1.4]} />}
      </Stage>
    </AbsoluteFill>
  );
};

/* ---------------- G. cliffhanger: chair spins, eyes in the dark ---------------- */
export const DarkReveal: React.FC<{ spinAt: number }> = ({ spinAt }) => {
  const f = useCurrentFrame();
  const yaw = interpolate(f, [spinAt, spinAt + 40], [Math.PI, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const push = interpolate(f, [0, 200], [0, 1], clamp);
  return (
    <Stage bg="#05070d">
      <color attach="background" args={['#05070d']} />
      <ambientLight intensity={0.08} />
      <Cam pos={[0, 1.6, 5 - push * 1.6]} target={[0, 1.3, 0]} fov={36} lock />
      <mesh position={[0, 1.6, -1.6]}>
        <planeGeometry args={[2.6, 1.5]} />
        <meshBasicMaterial color="#1f4a2a" />
      </mesh>
      <mesh position={[(f % 90) / 90 * 2.2 - 1.1, 1.75, -1.59]} scale={[0.25, 0.03, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffb347" />
      </mesh>
      <pointLight position={[0, 1.6, -1.2]} color="#3cff8a" intensity={1.4} distance={4} />
      <group position={[0, 0, 0]} rotation={[0, yaw, 0]}>
        <Part geometry={GEO.box} color="#0b0c12" position={[0, 0.5, 0]} scale={[0.8, 0.12, 0.8]} line={0} />
        <Part geometry={GEO.box} color="#0b0c12" position={[0, 1.1, -0.4]} scale={[0.8, 1.2, 0.12]} line={0} />
        <Character position={[0, 0.08, 0]} yaw={0} pose={with_(SIT, { headPitch: -0.05, eyeScale: f > spinAt + 38 ? 0.8 : 1 })} look={{ shirt: '#0b0c12', pants: '#0b0c12', shoe: '#0b0c12', skin: '#0b0c12' }} />
      </group>
    </Stage>
  );
};
