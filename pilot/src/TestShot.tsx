import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Character, CROUCH, IDLE, mixPose, Pose, runPose } from './Character';
import { World } from './World';
import { Overlay } from './Overlay';
import { Cues, cues, SPLIT, TAKES } from './timeline';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.inOut(Easing.cubic);
const rnd = (i: number) => {
  const x = Math.sin(i * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};

const STRIDE = 2.24; // rad of run phase per metre
const LAUNCH_X = 6.75;

// ---------- scene A: start line ----------
const xA = (c: Cues, f: number) => {
  if (f < c.run) return 0;
  if (f < c.burst) return 3 * ((f - c.run) / 30) ** 2;
  return LAUNCH_X + 90 * ((f - c.burst) / 30);
};

const poseA = (c: Cues, f: number): Pose => {
  const breathe = Math.sin(f / 9) * 0.012;
  let p: Pose = { ...IDLE, bob: breathe, lean: breathe * 2 };
  // looks at camera for the intro, glances away on "Yesterday", back on "Today"
  p.headYaw = interpolate(
    f,
    [c.lookCam, c.lookCam + 10, c.at(1), c.at(1) + 8, c.at(3), c.at(3) + 8, c.crouch - 6, c.crouch + 4],
    [0, -1.15, -1.15, -0.2, -0.2, -1.15, -1.15, 0],
    { ...clamp, easing: ease },
  );
  p.headPitch = interpolate(f, [c.at(2), c.at(2) + 8, c.at(3)], [0, 0.12, 0], clamp);
  p.blink = interpolate(f, [c.at(2) + 4, c.at(2) + 7, c.at(2) + 10], [0, 1, 0], clamp);
  p.eyeScale = interpolate(f, [c.eyePop, c.eyePop + 4, c.eyePop + 12], [1, 1.2, 1.08], clamp);
  p.armSpread = 0.12 + interpolate(f, [c.eyePop - 4, c.eyePop + 4, c.eyePop + 16], [0, 0.2, 0], clamp);
  if (f >= c.crouch) p = mixPose(p, CROUCH, interpolate(f, [c.crouch, c.crouch + 24], [0, 1], { ...clamp, easing: ease }));
  if (f >= c.run) {
    const x = xA(c, f);
    const phase = f < c.burst ? x * STRIDE : LAUNCH_X * STRIDE + (f - c.burst) * 1.6;
    p = mixPose(CROUCH, runPose(phase, f < c.burst ? 1 : 1.25), interpolate(f, [c.run, c.run + 13], [0, 1], { ...clamp, easing: ease }));
  }
  return p;
};

// ---------- scene B: finish line ----------
const xB = (c: Cues, f: number) => {
  const u = interpolate(f, [c.cut, c.cut + 20], [0, 1], clamp);
  return 101.6 - 34 * (1 - u) ** 3;
};

const SKID: Pose = {
  lean: -0.38, bob: -0.12,
  thighL: -0.85, kneeL: 0.15, thighR: 0.45, kneeR: 1.3,
  shoulderL: -1.9, elbowL: -0.3, shoulderR: -1.6, elbowR: -0.5,
  armSpread: 0.75,
  headYaw: 0, headPitch: 0.15, blink: 0, eyeScale: 1.25,
};

const poseB = (c: Cues, f: number): Pose => {
  const C = c.cut;
  const breathe = Math.sin(f / 7) * 0.02;
  const p = mixPose(SKID, { ...IDLE, bob: breathe }, interpolate(f, [C + 20, C + 34], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) }));
  p.headYaw = interpolate(f, [C + 34, C + 44, c.at(12), c.at(12) + 8], [0, -0.45, -0.45, -0.75], { ...clamp, easing: ease });
  p.headPitch = interpolate(f, [c.at(12), c.at(12) + 8], [0, -0.08], clamp);
  p.blink = interpolate(f, [C + 50, C + 53, C + 56, c.at(11), c.at(11) + 3, c.at(11) + 6], [0, 1, 0, 0, 1, 0], clamp);
  // "Max… has a problem": eyes go wide, then a worried double-blink
  p.eyeScale =
    interpolate(f, [C + 20, C + 34], [1.25, 1], clamp) +
    interpolate(f, [c.problem, c.problem + 4], [0, 0.3], clamp);
  p.blink = Math.max(p.blink, interpolate(f, [c.problem + 20, c.problem + 23, c.problem + 26, c.problem + 29, c.problem + 32], [0, 1, 0, 1, 0], clamp));
  return p;
};

// ---------- effects ----------
const Dust: React.FC<{ c: Cues; f: number; scene: 'A' | 'B' }> = ({ c, f, scene }) => {
  const puffs: { x: number; z: number; born: number; size: number }[] = [];
  if (scene === 'A') {
    for (let i = 0; i < 6; i++) puffs.push({ x: 0.2 + rnd(i) * 0.5, z: (rnd(i + 40) - 0.5) * 0.8, born: c.run + 1 + i * 0.6, size: 0.3 });
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      puffs.push({ x: LAUNCH_X + Math.cos(a) * 1.1, z: Math.sin(a) * 1.1, born: c.burst, size: 0.55 + rnd(i + 3) * 0.4 });
    }
    for (let x = 7.5; x < 190; x += 1.6) puffs.push({ x, z: (rnd(x) - 0.5) * 0.8, born: c.burst + (x - LAUNCH_X) / 3, size: 1 + rnd(x + 1) * 0.8 });
  } else {
    for (let x = 84; x < 101.6; x += 0.9) {
      const u = 1 - Math.cbrt((101.6 - x) / 34);
      puffs.push({ x, z: (rnd(x) - 0.5) * 0.6, born: c.cut + u * 20, size: 0.45 + rnd(x + 2) * 0.35 });
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

const Shockwave: React.FC<{ c: Cues; f: number }> = ({ c, f }) => {
  const age = f - c.burst;
  if (age < 0 || age > 22) return null;
  return (
    <mesh position={[LAUNCH_X, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.5 + age * 0.55}>
      <torusGeometry args={[1, 0.06, 8, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={interpolate(age, [0, 22], [0.9, 0], clamp)} />
    </mesh>
  );
};

const Rig: React.FC<{ c: Cues; f: number }> = ({ c, f }) => {
  const camera = useThree((s) => s.camera);
  if (f < c.cut) {
    const x = Math.min(xA(c, f), LAUNCH_X);
    const push = interpolate(f, [0, c.run], [0, 1], { ...clamp, easing: ease });
    let cx = interpolate(push, [0, 1], [3.4, 2.3]) + x * 0.85;
    let cy = interpolate(push, [0, 1], [1.9, 1.35]);
    let cz = interpolate(push, [0, 1], [7.8, 5.4]) + interpolate(f, [c.run, c.burst], [0, 0.8], clamp);
    let tx = 0.2 + x;
    let ty = 1.05;
    if (f >= c.burst) {
      const k = f - c.burst;
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
    const k = interpolate(f, [c.cut, c.problem], [0, 1], clamp);
    // slow push-in onto Max's face for the cliffhanger line
    const z = interpolate(f, [c.at(12), c.total], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
    const px = interpolate(z, [0, 1], [106.2 - k * 0.6, 103.3]);
    const py = interpolate(z, [0, 1], [1.3, 1.85]);
    const pz = interpolate(z, [0, 1], [4.4 - k * 0.4, 1.9]);
    camera.position.set(px, py, pz);
    camera.lookAt(interpolate(z, [0, 1], [99.6, 101.5]), interpolate(z, [0, 1], [1.15, 1.75]), interpolate(z, [0, 1], [-0.6, 0]));
  }
  return null;
};

const Scene: React.FC<{ c: Cues }> = ({ c }) => {
  const f = useCurrentFrame();
  const a = f < c.cut;
  return (
    <>
      <fog attach="fog" args={['#d6e6f4', 70, 420]} />
      <Rig c={c} f={f} />
      <World />
      {a ? (
        <Character position={[xA(c, f), 0, 0]} yaw={Math.PI / 2 - (f < c.run ? 0.3 : 0)} pose={poseA(c, f)} />
      ) : (
        <Character position={[xB(c, f), 0, 0]} yaw={Math.PI / 2 - interpolate(f, [c.cut + 20, c.cut + 34], [0, 0.3], clamp)} pose={poseB(c, f)} />
      )}
      <Dust c={c} f={f} scene={a ? 'A' : 'B'} />
      {a && <Shockwave c={c} f={f} />}
    </>
  );
};

const sfx = (name: string) => staticFile(`audio/${name}`);

// VO plays as two natural chunks, split at the pause before "Aaand"
const Soundtrack: React.FC<{ c: Cues; voFile: string; splitAt: number }> = ({ c, voFile, splitAt }) => (
  <>
    <Audio src={sfx('amb.wav')} volume={0.5} />
    <Sequence from={c.v1}>
      <Audio src={staticFile(voFile)} endAt={splitAt} />
    </Sequence>
    <Sequence from={c.v2 + splitAt}>
      <Audio src={staticFile(voFile)} startFrom={splitAt} />
    </Sequence>
    <Sequence from={c.run + 3}>
      <Audio src={sfx('steps.mp3')} volume={0.35} />
    </Sequence>
    <Sequence from={c.burst - 24}>
      <Audio src={sfx('boom.mp3')} startFrom={36} volume={(f) => (f < 20 ? 0.35 : 0.6)} />
    </Sequence>
    <Sequence from={c.cut}>
      <Audio src={sfx('skid.mp3')} startFrom={18} volume={0.55} />
    </Sequence>
    <Sequence from={c.problem}>
      <Audio src={sfx('hit.wav')} volume={0.7} />
    </Sequence>
  </>
);

export const TestShot: React.FC<{ voice: keyof typeof TAKES }> = ({ voice }) => {
  const { width, height } = useVideoConfig();
  const take = TAKES[voice];
  const c = cues(take);
  // cut the VO between "Watch this" and "Aaand"
  const splitAt = Math.round(((take.phrases[SPLIT - 1][1] + take.phrases[SPLIT][0]) / 2) * 30);
  return (
    <AbsoluteFill style={{ backgroundColor: '#cfe3f5' }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 38, near: 0.1, far: 2000 }} gl={{ antialias: true }}>
        <Scene c={c} />
      </ThreeCanvas>
      <Overlay c={c} />
      <Soundtrack c={c} voFile={take.file} splitAt={splitAt} />
    </AbsoluteFill>
  );
};
