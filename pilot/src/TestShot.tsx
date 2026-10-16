import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { Character, CROUCH, IDLE, mixPose, Pose, runPose } from './Character';
import { World } from './World';
import { Overlay } from './Overlay';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.inOut(Easing.cubic);
const rnd = (i: number) => {
  const x = Math.sin(i * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};

export const BURST = 150;
export const CUT = 210;
const STRIDE = 2.24; // rad of run phase per metre

// ---------- scene A: start line ----------
const xA = (f: number) => {
  if (f < 105) return 0;
  if (f < BURST) return 3 * ((f - 105) / 30) ** 2;
  return 6.75 + 90 * ((f - BURST) / 30);
};

const poseA = (f: number): Pose => {
  const breathe = Math.sin(f / 9) * 0.012;
  let p: Pose = { ...IDLE, bob: breathe, lean: breathe * 2 };
  p.headYaw = interpolate(f, [20, 32, 62, 74], [0, -1.15, -1.15, 0], { ...clamp, easing: ease });
  p.blink = interpolate(f, [40, 43, 46], [0, 1, 0], clamp);
  p.eyeScale = interpolate(f, [50, 54, 60], [1, 1.18, 1.08], clamp);
  p.armSpread = 0.12 + interpolate(f, [48, 56, 64], [0, 0.18, 0], clamp);
  if (f >= 74) p = mixPose(p, CROUCH, interpolate(f, [74, 98], [0, 1], { ...clamp, easing: ease }));
  if (f >= 105) {
    const x = xA(f);
    const phase = f < BURST ? x * STRIDE : 6.75 * STRIDE + (f - BURST) * 1.6;
    p = mixPose(CROUCH, runPose(phase, f < BURST ? 1 : 1.25), interpolate(f, [105, 118], [0, 1], { ...clamp, easing: ease }));
  }
  return p;
};

// ---------- scene B: finish line ----------
const xB = (f: number) => {
  const u = interpolate(f, [CUT, CUT + 20], [0, 1], clamp);
  return 101.6 - 34 * (1 - u) ** 3;
};

const SKID: Pose = {
  lean: -0.38, bob: -0.12,
  thighL: -0.85, kneeL: 0.15, thighR: 0.45, kneeR: 1.3,
  shoulderL: -1.9, elbowL: -0.3, shoulderR: -1.6, elbowR: -0.5,
  armSpread: 0.75,
  headYaw: 0, headPitch: 0.15, blink: 0, eyeScale: 1.25,
};

const poseB = (f: number): Pose => {
  const breathe = Math.sin(f / 7) * 0.02;
  let p = mixPose(SKID, { ...IDLE, bob: breathe }, interpolate(f, [CUT + 20, CUT + 34], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) }));
  p.headYaw = interpolate(f, [CUT + 34, CUT + 44], [0, -0.45], { ...clamp, easing: ease });
  p.blink = interpolate(f, [CUT + 50, CUT + 53, CUT + 56, CUT + 70, CUT + 73, CUT + 76], [0, 1, 0, 0, 1, 0], clamp);
  p.eyeScale = interpolate(f, [CUT + 20, CUT + 34], [1.25, 1], clamp);
  return p;
};

// ---------- effects ----------
const Dust: React.FC<{ f: number; scene: 'A' | 'B' }> = ({ f, scene }) => {
  const puffs: { x: number; z: number; born: number; size: number }[] = [];
  if (scene === 'A') {
    for (let i = 0; i < 6; i++) puffs.push({ x: 0.2 + rnd(i) * 0.5, z: (rnd(i + 40) - 0.5) * 0.8, born: 106 + i * 0.6, size: 0.3 });
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      puffs.push({ x: 6.75 + Math.cos(a) * 1.1, z: Math.sin(a) * 1.1, born: BURST, size: 0.55 + rnd(i + 3) * 0.4 });
    }
    for (let x = 7.5; x < 190; x += 1.6) puffs.push({ x, z: (rnd(x) - 0.5) * 0.8, born: BURST + (x - 6.75) / 3, size: 1 + rnd(x + 1) * 0.8 });
  } else {
    for (let x = 84; x < 101.6; x += 0.9) {
      const u = 1 - Math.cbrt((101.6 - x) / 34);
      puffs.push({ x, z: (rnd(x) - 0.5) * 0.6, born: CUT + u * 20, size: 0.45 + rnd(x + 2) * 0.35 });
    }
  }
  return (
    <group>
      {puffs.map((p, i) => {
        const age = f - p.born;
        const life = scene === 'A' ? 90 : 50;
        if (age < 0 || age > life) return null;
        const s = p.size * (0.25 + 0.95 * (1 - Math.exp(-age / 7)));
        return (
          <mesh key={i} position={[p.x + age * 0.01, 0.15 + s * 0.45 + age * 0.006, p.z]} scale={s}>
            <sphereGeometry args={[1, 14, 10]} />
            <meshToonMaterial color="#f1e0c6" transparent opacity={interpolate(age, [0, 6, life], [0.9, 0.75, 0], clamp)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const Shockwave: React.FC<{ f: number }> = ({ f }) => {
  const age = f - BURST;
  if (age < 0 || age > 22) return null;
  return (
    <mesh position={[6.75, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.5 + age * 0.55}>
      <torusGeometry args={[1, 0.06, 8, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={interpolate(age, [0, 22], [0.9, 0], clamp)} />
    </mesh>
  );
};

const Rig: React.FC<{ f: number }> = ({ f }) => {
  const camera = useThree((s) => s.camera);
  if (f < CUT) {
    const x = Math.min(xA(f), 6.75);
    const push = interpolate(f, [0, 105], [0, 1], { ...clamp, easing: ease });
    let cx = interpolate(push, [0, 1], [3.4, 2.3]) + x * 0.85;
    let cy = interpolate(push, [0, 1], [1.9, 1.35]);
    let cz = interpolate(push, [0, 1], [7.8, 5.4]) + interpolate(f, [105, BURST], [0, 0.8], clamp);
    let tx = 0.2 + x;
    let ty = 1.05;
    if (f >= BURST) {
      const k = f - BURST;
      const shake = Math.exp(-k / 6) * 0.12;
      cx += Math.sin(k * 2.7) * shake;
      cy += Math.cos(k * 3.1) * shake;
      tx += interpolate(k, [4, 30], [0, 22], { ...clamp, easing: Easing.out(Easing.cubic) });
      ty += interpolate(k, [4, 30], [0, 0.6], clamp);
      cz += interpolate(k, [4, 30], [0, 1.2], { ...clamp, easing: ease });
    }
    camera.position.set(cx, cy, cz);
    camera.lookAt(tx, ty, 0);
  } else {
    const k = interpolate(f, [CUT, 300], [0, 1], clamp);
    camera.position.set(106.2 - k * 0.6, 1.3, 4.4 - k * 0.4);
    camera.lookAt(99.6, 1.15, -0.6);
  }
  return null;
};

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const a = f < CUT;
  return (
    <>
      <fog attach="fog" args={['#d6e6f4', 70, 420]} />
      <Rig f={f} />
      <World />
      {a ? (
        <Character position={[xA(f), 0, 0]} yaw={Math.PI / 2 - (f < 105 ? 0.3 : 0)} pose={poseA(f)} />
      ) : (
        <Character position={[xB(f), 0, 0]} yaw={Math.PI / 2 - interpolate(f, [CUT + 20, CUT + 34], [0, 0.3], clamp)} pose={poseB(f)} />
      )}
      <Dust f={f} scene={a ? 'A' : 'B'} />
      {a && <Shockwave f={f} />}
    </>
  );
};

export const TestShot: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: '#cfe3f5' }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 38, near: 0.1, far: 2000 }} gl={{ antialias: true }}>
        <Scene />
      </ThreeCanvas>
      <Sequence>
        <Overlay />
      </Sequence>
    </AbsoluteFill>
  );
};
