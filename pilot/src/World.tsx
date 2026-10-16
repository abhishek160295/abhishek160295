import * as THREE from 'three';
import { useMemo } from 'react';
import { Part, toonMat } from './toon';

// deterministic pseudo-random
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Sky: React.FC = () => {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vP; void main(){ float h = clamp(vP.y*1.6, 0.0, 1.0); vec3 top = vec3(0.29,0.58,0.93); vec3 hor = vec3(0.85,0.93,0.98); gl_FragColor = vec4(mix(hor, top, pow(h,0.7)), 1.0); }`,
      }),
    [],
  );
  return (
    <mesh material={mat} renderOrder={-1}>
      <sphereGeometry args={[900, 32, 16]} />
    </mesh>
  );
};

export const World: React.FC = () => {
  const geo = useMemo(
    () => ({
      box: new THREE.BoxGeometry(1, 1, 1),
      cone: new THREE.ConeGeometry(1, 1, 7),
      cyl: new THREE.CylinderGeometry(1, 1, 1, 8),
      puff: new THREE.SphereGeometry(1, 16, 12),
    }),
    [],
  );

  const lanes = [-3, -1.8, -0.6, 0.6, 1.8, 3];
  const buildings = Array.from({ length: 70 }, (_, i) => {
    const w = 6 + rnd(i) * 10;
    const h = 8 + rnd(i + 50) * 30;
    return { x: -60 + i * 10 + rnd(i + 9) * 4, z: -45 - rnd(i + 3) * 25, w, h, d: 6 + rnd(i + 7) * 8, c: ['#9fb4d8', '#b9c6e4', '#8ea6cf', '#c8d3ec'][i % 4] };
  });
  const trees = Array.from({ length: 80 }, (_, i) => ({
    x: -40 + i * 8 + rnd(i + 100) * 5,
    z: -8 - rnd(i + 200) * 8,
    s: 0.8 + rnd(i + 300) * 0.7,
  }));
  const clouds = Array.from({ length: 22 }, (_, i) => ({ x: -80 + i * 30 + rnd(i + 400) * 15, y: 28 + rnd(i + 500) * 18, z: -120 - rnd(i + 600) * 60 }));

  return (
    <group>
      <Sky />
      <hemisphereLight args={['#dfefff', '#7aa35c', 0.9]} />
      <directionalLight
        position={[30, 40, 25]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-far={150}
        shadow-bias={-0.0005}
      />
      {/* grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[200, -0.01, 0]} receiveShadow material={toonMat('#7cc36a')}>
        <planeGeometry args={[900, 400]} />
      </mesh>
      {/* track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[200, 0, 0]} receiveShadow material={toonMat('#d9653b')}>
        <planeGeometry args={[900, 7]} />
      </mesh>
      {lanes.map((z) => (
        <mesh key={z} position={[200, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]} material={toonMat('#fdf6ec')} receiveShadow>
          <planeGeometry args={[900, 0.06]} />
        </mesh>
      ))}
      {/* start line */}
      <mesh position={[0.6, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} material={toonMat('#fdf6ec')} receiveShadow>
        <planeGeometry args={[0.12, 7]} />
      </mesh>
      {/* chequered finish */}
      {Array.from({ length: 28 }, (_, i) => (
        <mesh key={i} position={[100 + (i % 2) * 0.5, 0.007, -3.25 + Math.floor(i / 2) * 0.5]} rotation={[-Math.PI / 2, 0, 0]} material={toonMat(((i + Math.floor(i / 2)) % 2) === 0 ? '#14161f' : '#fdf6ec')} receiveShadow>
          <planeGeometry args={[0.5, 0.5]} />
        </mesh>
      ))}
      {/* finish gantry */}
      <Part geometry={geo.box} color="#14161f" position={[100.25, 1.8, -3.8]} scale={[0.18, 3.6, 0.18]} />
      <Part geometry={geo.box} color="#14161f" position={[100.25, 1.8, 3.8]} scale={[0.18, 3.6, 0.18]} />
      <Part geometry={geo.box} color="#ffd23f" position={[100.25, 3.7, 0]} scale={[0.4, 0.7, 7.9]} />
      {/* distance boards */}
      {Array.from({ length: 30 }, (_, i) => (
        <Part key={i} geometry={geo.box} color={i % 2 ? '#fdf6ec' : '#ffd23f'} position={[10 + i * 10, 0.5, -4]} scale={[0.6, 1, 0.08]} line={0.03} />
      ))}
      {/* low barrier + stepped stands */}
      <Part geometry={geo.box} color="#fdf6ec" position={[150, 0.45, -5.2]} scale={[400, 0.9, 0.25]} line={0.02} />
      {[0, 1, 2, 3].map((k) => (
        <Part key={k} geometry={geo.box} color={['#4f6ea8', '#5a7bb6', '#6788c2', '#7495cd'][k]} position={[150, 0.5 + k * 0.7, -19 - k * 1.4]} scale={[400, 1 + k * 1.4, 1.4]} line={0} />
      ))}
      {buildings.map((b, i) => (
        <Part key={i} geometry={geo.box} color={b.c} position={[b.x, b.h / 2, b.z]} scale={[b.w, b.h, b.d]} line={0} shadow={false} />
      ))}
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.s}>
          <Part geometry={geo.cyl} color="#7a4e2d" position={[0, 0.7, 0]} scale={[0.15, 1.4, 0.15]} line={0.04} />
          <Part geometry={geo.cone} color="#3f9b4a" position={[0, 2.3, 0]} scale={[1.1, 2.4, 1.1]} line={0.03} />
        </group>
      ))}
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]}>
          {[0, 1, 2, 3].map((k) => (
            <mesh key={k} geometry={geo.puff} material={toonMat('#ffffff')} position={[k * 4 - 6, Math.sin(k * 2) * 1.2, 0]} scale={4 + rnd(i * 4 + k) * 3} />
          ))}
        </group>
      ))}
    </group>
  );
};
