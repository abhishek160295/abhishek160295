import * as THREE from 'three';
import { useMemo } from 'react';
import { Part, useLimb } from './toon';

export type Pose = {
  lean: number; // upper-body pitch, + = forward
  bob: number; // vertical offset of the whole body
  thighL: number; kneeL: number; thighR: number; kneeR: number;
  shoulderL: number; elbowL: number; shoulderR: number; elbowR: number;
  armSpread: number;
  headYaw: number; headPitch: number;
  blink: number; // 0 open, 1 shut
  eyeScale: number;
};

export const IDLE: Pose = {
  lean: 0, bob: 0,
  thighL: 0, kneeL: 0, thighR: 0, kneeR: 0,
  shoulderL: 0, elbowL: -0.15, shoulderR: 0, elbowR: -0.15,
  armSpread: 0.12,
  headYaw: 0, headPitch: 0, blink: 0, eyeScale: 1,
};

export const mixPose = (a: Pose, b: Pose, t: number): Pose => {
  const o = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => (o[k] = a[k] + (b[k] - a[k]) * t));
  return o;
};

export const with_ = (p: Pose, o: Partial<Pose>): Pose => ({ ...p, ...o });

// sprint cycle driven by a phase angle
export const runPose = (p: number, intensity = 1): Pose => {
  const s = Math.sin(p);
  const c = Math.cos(p);
  return {
    lean: 0.32 * intensity,
    bob: Math.abs(c) * 0.09 * intensity - 0.04,
    thighL: -s * 0.95 * intensity,
    kneeL: (0.35 + Math.max(0, -c) * 1.5) * intensity,
    thighR: s * 0.95 * intensity,
    kneeR: (0.35 + Math.max(0, c) * 1.5) * intensity,
    shoulderL: s * 1.0 * intensity,
    elbowL: -1.5,
    shoulderR: -s * 1.0 * intensity,
    elbowR: -1.5,
    armSpread: 0.1,
    headYaw: 0, headPitch: -0.2 * intensity, blink: 0, eyeScale: 1,
  };
};

export const walkPose = (p: number): Pose => {
  const s = Math.sin(p);
  const c = Math.cos(p);
  return {
    ...IDLE,
    bob: Math.abs(c) * 0.03,
    thighL: -s * 0.45, kneeL: 0.1 + Math.max(0, -c) * 0.5,
    thighR: s * 0.45, kneeR: 0.1 + Math.max(0, c) * 0.5,
    shoulderL: s * 0.4, shoulderR: -s * 0.4, elbowL: -0.3, elbowR: -0.3,
  };
};

export const CROUCH: Pose = {
  lean: 1.05, bob: -0.34,
  thighL: -1.55, kneeL: 2.1, thighR: -0.25, kneeR: 1.5,
  shoulderL: -1.0, elbowL: -0.05, shoulderR: -1.0, elbowR: -0.05,
  armSpread: 0.08,
  headYaw: 0, headPitch: -0.55, blink: 0, eyeScale: 1,
};

export const SQUAT: Pose = {
  ...IDLE, lean: 0.45, bob: -0.32,
  thighL: -1.2, kneeL: 1.9, thighR: -1.2, kneeR: 1.9,
  shoulderL: 0.6, shoulderR: 0.6, elbowL: -0.2, elbowR: -0.2, headPitch: -0.3,
};

export const AIR: Pose = {
  ...IDLE, lean: -0.05,
  thighL: -0.5, kneeL: 1.0, thighR: 0.2, kneeR: 0.6,
  shoulderL: -2.9, shoulderR: -2.9, elbowL: -0.1, elbowR: -0.1, armSpread: 0.35, eyeScale: 1.25,
};

export const SHRUG: Pose = {
  ...IDLE, shoulderL: -0.35, shoulderR: -0.35, elbowL: -1.6, elbowR: -1.6, armSpread: 0.65, headPitch: 0.1,
};

export const HIGHFIVE: Pose = { ...IDLE, shoulderR: -2.6, elbowR: -0.2, armSpread: 0.15 };

export const CARRY: Pose = { ...IDLE, shoulderL: -1.2, shoulderR: -1.2, elbowL: -0.9, elbowR: -0.9, armSpread: 0.05 };

export const THROW_BACK: Pose = { ...IDLE, lean: -0.15, shoulderR: 2.4, elbowR: -1.0, thighR: 0.35, shoulderL: -0.8 };
export const THROW_FWD: Pose = { ...IDLE, lean: 0.45, shoulderR: -1.7, elbowR: -0.1, thighL: -0.4, kneeL: 0.3, shoulderL: 0.5 };

export const SIT: Pose = {
  ...IDLE, thighL: -1.57, thighR: -1.57, kneeL: 1.57, kneeR: 1.57, bob: -0.42, shoulderL: -0.5, shoulderR: -0.5, elbowL: -0.9, elbowR: -0.9,
};

export const TYPE: Pose = { ...SIT, shoulderL: -0.9, shoulderR: -0.9, elbowL: -0.9, elbowR: -0.9, lean: 0.15, headPitch: 0.1 };

export type Look = {
  shirt?: string; pants?: string; shoe?: string; skin?: string; scale?: number;
  hair?: 'none' | 'tufts' | 'pigtails'; hairColor?: string; glow?: number;
};

export const MAX: Look = { shirt: '#ff7a2f', pants: '#2f4a8a', shoe: '#e63946' };
export const DAVE: Look = { shirt: '#3fb37f', pants: '#4a4f63', shoe: '#2b2d38', hair: 'tufts', hairColor: '#8a5a2b' };
export const KID: Look = { shirt: '#ffd23f', pants: '#e85d9a', shoe: '#7b5cff', scale: 0.62, hair: 'pigtails', hairColor: '#1d1f2b' };
export const STRANGER: Look = { shirt: '#7b8cff', pants: '#3a3f55', shoe: '#ffffff', hair: 'tufts', hairColor: '#e0b04a' };

const SOLE = '#f4f1ea';

export const Character: React.FC<{
  position: [number, number, number];
  yaw: number;
  pose: Pose;
  look?: Look;
  pitch?: number; // whole-body pitch (lying down etc.)
  roll?: number;
  pupil?: [number, number]; // look direction, -1..1
  handR?: React.ReactNode; // prop held in right hand
  back?: React.ReactNode; // prop on the back
  children?: React.ReactNode; // attached to body root
}> = ({ position, yaw, pose, look = MAX, pitch = 0, roll = 0, pupil = [0, 0], handR, back, children }) => {
  const SHIRT = look.shirt ?? MAX.shirt!;
  const PANTS = look.pants ?? MAX.pants!;
  const SHOE = look.shoe ?? MAX.shoe!;
  const SKIN = look.skin ?? '#1d1f2b';
  const upperArm = useLimb(0.26, 0.075);
  const foreArm = useLimb(0.24, 0.065);
  const thigh = useLimb(0.34, 0.1);
  const shin = useLimb(0.32, 0.085);
  const g = useMemo(
    () => ({
      torso: new THREE.CapsuleGeometry(0.25, 0.3, 8, 20),
      head: new THREE.SphereGeometry(0.36, 40, 28),
      ball: new THREE.SphereGeometry(1, 24, 16),
      shoe: (() => {
        const s = new THREE.CapsuleGeometry(0.085, 0.16, 6, 14);
        s.rotateX(Math.PI / 2);
        return s;
      })(),
      sole: new THREE.BoxGeometry(0.19, 0.04, 0.36),
    }),
    [],
  );

  const eyeY = Math.max(0.06, 1 - pose.blink) * pose.eyeScale;

  const leg = (side: 1 | -1, th: number, kn: number) => (
    <group position={[0.13 * side, 0.92, 0]} rotation={[th, 0, 0]}>
      <Part geometry={thigh} color={PANTS} />
      <group position={[0, -0.44, 0]} rotation={[kn, 0, 0]}>
        <Part geometry={shin} color={PANTS} />
        <group position={[0, -0.42, 0.06]} rotation={[-kn * 0.35, 0, 0]}>
          <Part geometry={g.shoe} color={SHOE} />
          <Part geometry={g.sole} color={SOLE} position={[0, -0.07, 0]} line={0.012} />
        </group>
      </group>
    </group>
  );

  const arm = (side: 1 | -1, sh: number, el: number, held?: React.ReactNode) => (
    <group position={[0.3 * side, 0.36, 0]} rotation={[sh, 0, pose.armSpread * side]}>
      <Part geometry={upperArm} color={SHIRT} />
      <group position={[0, -0.34, 0]} rotation={[el, 0, 0]}>
        <Part geometry={foreArm} color={SKIN} />
        <Part geometry={g.ball} color={SKIN} position={[0, -0.34, 0]} scale={0.085} line={0.15} />
        {held && <group position={[0, -0.42, 0]}>{held}</group>}
      </group>
    </group>
  );

  const s = look.scale ?? 1;
  const hc = look.hairColor ?? '#1d1f2b';

  return (
    <group position={[position[0], position[1] + pose.bob * s, position[2]]} rotation={[pitch, yaw, roll]} scale={s}>
      {leg(1, pose.thighL, pose.kneeL)}
      {leg(-1, pose.thighR, pose.kneeR)}
      <group position={[0, 0.92, 0]} rotation={[pose.lean, 0, 0]}>
        <Part geometry={g.torso} color={SHIRT} position={[0, 0.3, 0]} />
        {back && <group position={[0, 0.35, -0.3]}>{back}</group>}
        {arm(1, pose.shoulderL, pose.elbowL)}
        {arm(-1, pose.shoulderR, pose.elbowR, handR)}
        <group position={[0, 0.86, 0]} rotation={[pose.headPitch, pose.headYaw, 0]}>
          <Part geometry={g.head} color={SKIN} line={0.022} />
          {look.hair === 'tufts' &&
            [-0.12, 0, 0.12].map((x, i) => (
              <Part key={i} geometry={g.ball} color={hc} position={[x, 0.33, -0.02]} scale={[0.09, 0.12, 0.09]} line={0.2} />
            ))}
          {look.hair === 'pigtails' &&
            [1, -1].map((sd) => (
              <Part key={sd} geometry={g.ball} color={hc} position={[0.36 * sd, 0.12, -0.05]} scale={0.13} line={0.15} />
            ))}
          {/* glossy highlight */}
          <mesh geometry={g.ball} position={[-0.13, 0.17, 0.25]} scale={[0.07, 0.045, 0.03]} rotation={[0, 0, 0.6]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
          </mesh>
          {[1, -1].map((sd) => (
            <group key={sd} position={[0.13 * sd, 0.05, 0.3]} rotation={[0, 0.32 * sd, 0]} scale={[1, eyeY, 1]}>
              <mesh geometry={g.ball} scale={[0.1, 0.13, 0.05]}>
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh geometry={g.ball} position={[-0.012 * sd + pupil[0] * 0.035, -0.01 + pupil[1] * 0.04, 0.04]} scale={[0.05, 0.065, 0.025]}>
                <meshBasicMaterial color="#0b0c12" />
              </mesh>
              <mesh geometry={g.ball} position={[-0.03 * sd + pupil[0] * 0.035, 0.025 + pupil[1] * 0.04, 0.06]} scale={[0.016, 0.016, 0.01]}>
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
          {(look.glow ?? 0) > 0 && (
            <mesh geometry={g.ball} scale={0.6}>
              <meshBasicMaterial color="#ff4a1f" transparent opacity={0.16 * (look.glow ?? 0)} depthWrite={false} side={THREE.BackSide} />
            </mesh>
          )}
        </group>
      </group>
      {children}
    </group>
  );
};
