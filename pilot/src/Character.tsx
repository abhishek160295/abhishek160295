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

export const CROUCH: Pose = {
  lean: 1.05, bob: -0.34,
  thighL: -1.55, kneeL: 2.1, thighR: -0.25, kneeR: 1.5,
  shoulderL: -1.0, elbowL: -0.05, shoulderR: -1.0, elbowR: -0.05,
  armSpread: 0.08,
  headYaw: 0, headPitch: -0.55, blink: 0, eyeScale: 1,
};

const SHIRT = '#ff7a2f';
const SKIN = '#1d1f2b';
const PANTS = '#2f4a8a';
const SHOE = '#e63946';
const SOLE = '#f4f1ea';

export const Character: React.FC<{
  position: [number, number, number];
  yaw: number;
  pose: Pose;
}> = ({ position, yaw, pose }) => {
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

  const arm = (side: 1 | -1, sh: number, el: number) => (
    <group position={[0.3 * side, 0.36, 0]} rotation={[sh, 0, pose.armSpread * side]}>
      <Part geometry={upperArm} color={SHIRT} />
      <group position={[0, -0.34, 0]} rotation={[el, 0, 0]}>
        <Part geometry={foreArm} color={SKIN} />
        <Part geometry={g.ball} color={SKIN} position={[0, -0.34, 0]} scale={0.085} line={0.15} />
      </group>
    </group>
  );

  return (
    <group position={[position[0], position[1] + pose.bob, position[2]]} rotation={[0, yaw, 0]}>
      {leg(1, pose.thighL, pose.kneeL)}
      {leg(-1, pose.thighR, pose.kneeR)}
      {/* upper body pivots at the hips */}
      <group position={[0, 0.92, 0]} rotation={[pose.lean, 0, 0]}>
        <Part geometry={g.torso} color={SHIRT} position={[0, 0.3, 0]} />
        {arm(1, pose.shoulderL, pose.elbowL)}
        {arm(-1, pose.shoulderR, pose.elbowR)}
        <group position={[0, 0.86, 0]} rotation={[pose.headPitch, pose.headYaw, 0]}>
          <Part geometry={g.head} color={SKIN} line={0.022} />
          {/* glossy highlight */}
          <mesh geometry={g.ball} position={[-0.13, 0.17, 0.25]} scale={[0.07, 0.045, 0.03]} rotation={[0, 0, 0.6]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
          </mesh>
          {[1, -1].map((s) => (
            <group key={s} position={[0.13 * s, 0.05, 0.3]} rotation={[0, 0.32 * s, 0]} scale={[1, eyeY, 1]}>
              <mesh geometry={g.ball} scale={[0.1, 0.13, 0.05]}>
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh geometry={g.ball} position={[-0.012 * s, -0.01, 0.04]} scale={[0.05, 0.065, 0.025]}>
                <meshBasicMaterial color="#0b0c12" />
              </mesh>
              <mesh geometry={g.ball} position={[-0.03 * s, 0.025, 0.06]} scale={[0.016, 0.016, 0.01]}>
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
};
