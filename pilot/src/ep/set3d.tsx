import * as THREE from 'three';
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useCurrentFrame } from 'remotion';
import { Part, toonMat } from '../toon';

export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type V3 = [number, number, number];

const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cone: new THREE.ConeGeometry(1, 1, 7),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 18),
  ball: new THREE.SphereGeometry(1, 20, 14),
  torus: new THREE.TorusGeometry(1, 0.35, 10, 24),
};
export const GEO = G;

/** imperative camera. Every ~3.2 s it hops to another angle (hard cut feel) and drifts like a handheld camera */
export const Cam: React.FC<{ pos: V3; target: V3; fov?: number; roll?: number; lock?: boolean }> = ({ pos, target, fov = 38, roll = 0, lock }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const f = useCurrentFrame();
  const v = new THREE.Vector3(pos[0] - target[0], pos[1] - target[1], pos[2] - target[2]);
  const angle = lock ? 0 : Math.floor(f / 96) % 4;
  if (angle === 1) v.multiplyScalar(0.62);
  if (angle === 2) v.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.5).multiplyScalar(0.9);
  if (angle === 3) v.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.45).add(new THREE.Vector3(0, 0.6, 0));
  const drift = lock ? 0 : 1;
  camera.position.set(target[0] + v.x + Math.sin(f / 37) * 0.08 * drift, target[1] + v.y + Math.sin(f / 51) * 0.05 * drift, target[2] + v.z);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(...target);
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

export const SkyDome: React.FC<{ top?: string; horizon?: string }> = ({ top = '#4a94ee', horizon = '#d9edfa' }) => {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { top: { value: new THREE.Color(top) }, hor: { value: new THREE.Color(horizon) } },
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 top; uniform vec3 hor; varying vec3 vP; void main(){ float h = clamp(vP.y*1.6, 0.0, 1.0); gl_FragColor = vec4(mix(hor, top, pow(h,0.7)), 1.0); }`,
      }),
    [top, horizon],
  );
  return (
    <mesh material={mat} renderOrder={-1}>
      <sphereGeometry args={[900, 32, 16]} />
    </mesh>
  );
};

export const Lights: React.FC<{ night?: boolean; shadowBox?: number; center?: V3 }> = ({ night, shadowBox = 25, center = [0, 0, 0] }) => (
  <>
    <hemisphereLight args={[night ? '#5d6aa8' : '#dfefff', night ? '#1c2033' : '#7aa35c', night ? 0.55 : 0.9]} />
    <directionalLight
      position={[center[0] + 30, 40, center[2] + 25]}
      target-position={center}
      intensity={night ? 0.7 : 2.4}
      color={night ? '#9fb2ff' : '#ffffff'}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-shadowBox}
      shadow-camera-right={shadowBox}
      shadow-camera-top={shadowBox}
      shadow-camera-bottom={-shadowBox}
      shadow-camera-far={150}
      shadow-bias={-0.0005}
    />
  </>
);

export const Clouds: React.FC<{ n?: number; spread?: number }> = ({ n = 14, spread = 400 }) => (
  <group>
    {Array.from({ length: n }, (_, i) => (
      <group key={i} position={[-spread / 2 + (i / n) * spread + rnd(i) * 20, 30 + rnd(i + 5) * 18, -110 - rnd(i + 9) * 60]}>
        {[0, 1, 2, 3].map((k) => (
          <mesh key={k} geometry={G.ball} material={toonMat('#ffffff')} position={[k * 4 - 6, Math.sin(k * 2) * 1.2, 0]} scale={4 + rnd(i * 4 + k) * 3} />
        ))}
      </group>
    ))}
  </group>
);

export const Tree: React.FC<{ p: V3; s?: number; round?: boolean }> = ({ p, s = 1, round }) => (
  <group position={p} scale={s}>
    <Part geometry={G.cyl} color="#7a4e2d" position={[0, 0.8, 0]} scale={[0.15, 1.6, 0.15]} line={0.04} />
    {round ? (
      <Part geometry={G.ball} color="#46a653" position={[0, 2.4, 0]} scale={[1.2, 1.1, 1.2]} line={0.03} />
    ) : (
      <Part geometry={G.cone} color="#3f9b4a" position={[0, 2.4, 0]} scale={[1.1, 2.4, 1.1]} line={0.03} />
    )}
  </group>
);

const BCOL = ['#f2c57c', '#e98a6b', '#9fb4d8', '#c8d3ec', '#f4e1c1', '#b8d8be'];
export const Building: React.FC<{ p: V3; w: number; h: number; d: number; c: string; windows?: boolean; night?: boolean }> = ({ p, w, h, d, c, windows = true, night }) => (
  <group position={p}>
    <Part geometry={G.box} color={c} position={[0, h / 2, 0]} scale={[w, h, d]} line={0.03} />
    {windows &&
      Array.from({ length: Math.floor(h / 2.2) }, (_, r) =>
        Array.from({ length: Math.max(1, Math.floor(w / 1.8)) }, (_, q) => (
          <mesh
            key={`${r}-${q}`}
            geometry={G.box}
            material={toonMat(night ? (rnd(r * 7 + q + w) > 0.5 ? '#ffd76a' : '#2a3150') : '#7fb2e6')}
            position={[-w / 2 + 0.9 + q * 1.8, 1.4 + r * 2.2, d / 2 + 0.02]}
            scale={[0.9, 1.1, 0.04]}
          />
        )),
      )}
  </group>
);

/** a street running along x. road z∈[-3,3]; near side z∈[3,6] (sidewalk or park) */
export const Town: React.FC<{ near?: 'sidewalk' | 'park'; night?: boolean; x0?: number; x1?: number; seed?: number }> = ({
  near = 'sidewalk',
  night,
  x0 = -60,
  x1 = 140,
  seed = 1,
}) => {
  const L = x1 - x0;
  const cx = (x0 + x1) / 2;
  const blds = useMemo(() => {
    const out: { x: number; w: number; h: number; d: number; c: string }[] = [];
    let x = x0;
    let i = seed * 31;
    while (x < x1) {
      const w = 6 + rnd(i) * 7;
      out.push({ x: x + w / 2, w, h: 6 + rnd(i + 3) * 14, d: 7, c: BCOL[i % BCOL.length] });
      x += w + 0.6;
      i++;
    }
    return out;
  }, [x0, x1, seed]);
  return (
    <group>
      <SkyDome top={night ? '#0d1330' : '#4a94ee'} horizon={night ? '#2a335c' : '#d9edfa'} />
      {!night && <Clouds />}
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, -0.02, 0]} receiveShadow material={toonMat(near === 'park' ? '#7cc36a' : '#b9bcc6')}>
        <planeGeometry args={[L + 200, 300]} />
      </mesh>
      {/* road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0, 0]} receiveShadow material={toonMat(night ? '#2b2e3a' : '#4a4e5c')}>
        <planeGeometry args={[L, 6]} />
      </mesh>
      {Array.from({ length: Math.floor(L / 4) }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x0 + i * 4 + 1, 0.01, 0]} material={toonMat('#f6e9b8')}>
          <planeGeometry args={[2, 0.15]} />
        </mesh>
      ))}
      {/* kerbs + far pavement */}
      <Part geometry={G.box} color="#d9dbe3" position={[cx, 0.08, 3.1]} scale={[L, 0.16, 0.2]} line={0} />
      <Part geometry={G.box} color="#d9dbe3" position={[cx, 0.08, -3.1]} scale={[L, 0.16, 0.2]} line={0} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.12, -5]} receiveShadow material={toonMat('#cfd2db')}>
        <planeGeometry args={[L, 3.6]} />
      </mesh>
      {near === 'sidewalk' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.12, 5]} receiveShadow material={toonMat('#cfd2db')}>
          <planeGeometry args={[L, 3.6]} />
        </mesh>
      )}
      {near === 'park' &&
        Array.from({ length: 14 }, (_, i) => <Tree key={i} p={[x0 + 6 + i * (L / 14) + rnd(i) * 4, 0, 9 + rnd(i + 2) * 6]} s={0.9 + rnd(i + 4) * 0.5} round={i % 2 === 0} />)}
      {/* far buildings */}
      {blds.map((b, i) => (
        <Building key={i} p={[b.x, 0, -11]} w={b.w} h={b.h} d={b.d} c={b.c} night={night} />
      ))}
      {/* street lamps */}
      {Array.from({ length: Math.floor(L / 16) }, (_, i) => (
        <group key={i} position={[x0 + 8 + i * 16, 0, -3.6]}>
          <Part geometry={G.cyl} color="#3b3f4f" position={[0, 2.2, 0]} scale={[0.07, 4.4, 0.07]} line={0.02} />
          <Part geometry={G.box} color="#3b3f4f" position={[0, 4.4, 0.4]} scale={[0.15, 0.12, 0.9]} line={0.02} />
          <mesh geometry={G.ball} position={[0, 4.3, 0.8]} scale={0.14} material={toonMat(night ? '#fff2a8' : '#f4f4f4')} />
        </group>
      ))}
      <Lights night={night} shadowBox={30} />
    </group>
  );
};

export const Bus: React.FC<{ x: number; z?: number; doors?: number }> = ({ x, z = -1.2, doors = 0 }) => (
  <group position={[x, 0, z]}>
    <Part geometry={G.box} color="#e8443a" position={[0, 1.75, 0]} scale={[11, 2.9, 2.6]} line={0.03} />
    <Part geometry={G.box} color="#f4f1ea" position={[0, 3.25, 0]} scale={[11, 0.15, 2.6]} line={0.02} />
    {Array.from({ length: 6 }, (_, i) => (
      <mesh key={i} geometry={G.box} material={toonMat('#a9d4f5')} position={[-4.2 + i * 1.6, 2.3, 1.31]} scale={[1.3, 1.0, 0.04]} />
    ))}
    {/* door */}
    <mesh geometry={G.box} material={toonMat('#2a2e3d')} position={[4.4 - doors * 0.5, 1.5, 1.32]} scale={[1.0 * (1 - doors) + 0.05, 2.2, 0.04]} />
    {[-3.6, 3.4].map((wx) => (
      <Part key={wx} geometry={G.cyl} color="#1d1f2b" position={[wx, 0.5, 1.2]} rotation={[Math.PI / 2, 0, 0]} scale={[0.5, 0.35, 0.5]} line={0.03} />
    ))}
    <mesh geometry={G.box} material={toonMat('#ffd23f')} position={[5.51, 2.9, 0]} scale={[0.04, 0.4, 1.6]} />
  </group>
);

export const BusStop: React.FC<{ x: number }> = ({ x }) => (
  <group position={[x, 0.12, 4.2]}>
    <Part geometry={G.cyl} color="#3b3f4f" position={[-1.4, 1.3, -0.6]} scale={[0.06, 2.6, 0.06]} line={0.02} />
    <Part geometry={G.cyl} color="#3b3f4f" position={[1.4, 1.3, -0.6]} scale={[0.06, 2.6, 0.06]} line={0.02} />
    <Part geometry={G.box} color="#2f4a8a" position={[0, 2.65, -0.3]} scale={[3.2, 0.12, 1.4]} line={0.02} />
    <Part geometry={G.cyl} color="#3b3f4f" position={[2.2, 1.4, 0]} scale={[0.05, 2.8, 0.05]} line={0.02} />
    <Part geometry={G.cyl} color="#ffd23f" position={[2.2, 2.9, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.35, 0.06, 0.35]} line={0.02} />
  </group>
);

export const Car: React.FC<{ x: number; z?: number; color?: string; yaw?: number }> = ({ x, z = -1.5, color = '#4aa3df', yaw = 0 }) => (
  <group position={[x, 0, z]} rotation={[0, yaw, 0]}>
    <Part geometry={G.box} color={color} position={[0, 0.75, 0]} scale={[4.2, 0.9, 1.9]} line={0.03} />
    <Part geometry={G.box} color={color} position={[-0.3, 1.45, 0]} scale={[2.3, 0.7, 1.7]} line={0.03} />
    <mesh geometry={G.box} material={toonMat('#bfe3ff')} position={[0.86, 1.45, 0]} scale={[0.05, 0.55, 1.5]} />
    <mesh geometry={G.box} material={toonMat('#bfe3ff')} position={[-0.3, 1.45, 0.86]} scale={[2.0, 0.5, 0.04]} />
    {[-1.3, 1.3].map((wx) =>
      [-0.95, 0.95].map((wz) => (
        <Part key={`${wx}${wz}`} geometry={G.cyl} color="#1d1f2b" position={[wx, 0.38, wz]} rotation={[Math.PI / 2, 0, 0]} scale={[0.38, 0.25, 0.38]} line={0.03} />
      )),
    )}
    <mesh geometry={G.box} material={toonMat('#fff6c4')} position={[2.11, 0.85, 0.6]} scale={[0.04, 0.2, 0.35]} />
    <mesh geometry={G.box} material={toonMat('#fff6c4')} position={[2.11, 0.85, -0.6]} scale={[0.04, 0.2, 0.35]} />
  </group>
);

export const Dog: React.FC<{ p: V3; yaw?: number; f: number; wag?: number; headYaw?: number; sit?: boolean; sleep?: boolean }> = ({ p, yaw = 0, f, wag = 1, headYaw = 0, sit, sleep }) => {
  const tail = Math.sin(f * 0.9) * 0.6 * wag;
  return (
    <group position={p} rotation={[0, yaw, 0]} scale={0.8}>
      <Part geometry={G.ball} color="#d99a52" position={[0, sleep ? 0.3 : 0.55, 0]} scale={[0.32, 0.26, 0.5]} rotation={[sit ? -0.5 : 0, 0, 0]} />
      {!sleep &&
        [[-0.16, 0.3], [0.16, 0.3], [-0.16, -0.3], [0.16, -0.3]].map(([lx, lz], i) => (
          <Part key={i} geometry={G.cyl} color="#c4863f" position={[lx, 0.22, lz * (sit && lz < 0 ? 0.5 : 1)]} scale={[0.06, 0.44, 0.06]} line={0.03} />
        ))}
      <group position={[0, sleep ? 0.38 : 0.85, 0.42]} rotation={[0, headYaw, 0]}>
        <Part geometry={G.ball} color="#d99a52" scale={[0.24, 0.22, 0.24]} />
        <Part geometry={G.ball} color="#f1d2a8" position={[0, -0.05, 0.2]} scale={[0.12, 0.09, 0.12]} line={0.04} />
        <mesh geometry={G.ball} material={toonMat('#1d1f2b')} position={[0, -0.01, 0.31]} scale={0.04} />
        {[1, -1].map((s) => (
          <group key={s}>
            <Part geometry={G.ball} color="#8a5a2b" position={[0.2 * s, 0.1, -0.02]} scale={[0.07, 0.16, 0.05]} rotation={[0, 0, 0.4 * s]} line={0.04} />
            <mesh geometry={G.ball} material={toonMat(sleep ? '#8a5a2b' : '#1d1f2b')} position={[0.09 * s, 0.06, 0.2]} scale={sleep ? [0.04, 0.01, 0.02] : 0.035} />
          </group>
        ))}
      </group>
      <group position={[0, sleep ? 0.35 : 0.65, -0.48]} rotation={[0.8, tail, 0]}>
        <Part geometry={G.cyl} color="#c4863f" position={[0, 0.15, 0]} scale={[0.04, 0.3, 0.04]} line={0.04} />
      </group>
    </group>
  );
};

export const Bench: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <Part geometry={G.box} color="#b0743f" position={[0, 0.5, 0]} scale={[2.2, 0.1, 0.6]} line={0.02} />
    <Part geometry={G.box} color="#b0743f" position={[0, 0.95, -0.28]} scale={[2.2, 0.5, 0.08]} line={0.02} />
    {[-0.95, 0.95].map((x) => (
      <Part key={x} geometry={G.box} color="#3b3f4f" position={[x, 0.25, 0]} scale={[0.08, 0.5, 0.55]} line={0.02} />
    ))}
  </group>
);

/** generic interior: floor, two walls, window */
export const Room: React.FC<{ wall?: string; floor?: string; tiles?: boolean }> = ({ wall = '#f3e3c3', floor = '#c99b6d', tiles }) => (
  <group>
    <color attach="background" args={[wall]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={toonMat(floor)}>
      <planeGeometry args={[30, 30]} />
    </mesh>
    <mesh position={[0, 5, -4]} receiveShadow material={toonMat(wall)}>
      <planeGeometry args={[30, 10]} />
    </mesh>
    <mesh position={[-6, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={toonMat(wall)}>
      <planeGeometry args={[30, 10]} />
    </mesh>
    {tiles &&
      Array.from({ length: 12 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => (
          <mesh key={`${i}-${j}`} position={[-5.5 + i * 0.8, 0.4 + j * 0.8, -3.98]} material={toonMat((i + j) % 2 ? '#d7ecf2' : '#c5e2ea')}>
            <planeGeometry args={[0.76, 0.76]} />
          </mesh>
        )),
      )}
    {!tiles && (
      <group position={[2.5, 3, -3.95]}>
        <mesh material={toonMat('#ffffff')}>
          <planeGeometry args={[3.2, 2.2]} />
        </mesh>
        <mesh position={[0, 0, 0.01]} material={toonMat('#8fd0ff')}>
          <planeGeometry args={[3.0, 2.0]} />
        </mesh>
        <mesh position={[0, 0, 0.02]} material={toonMat('#ffffff')}>
          <planeGeometry args={[0.08, 2.0]} />
        </mesh>
      </group>
    )}
    <hemisphereLight args={['#fff6e6', '#8a6a4a', 1.0]} />
    <directionalLight position={[6, 9, 8]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} />
  </group>
);

export const Desk: React.FC<{ p: V3; screen?: string }> = ({ p, screen = '#e9f4ff' }) => (
  <group position={p}>
    <Part geometry={G.box} color="#8b5e3c" position={[0, 0.85, 0]} scale={[2.6, 0.1, 1.2]} line={0.02} />
    {[-1.2, 1.2].map((x) => (
      <Part key={x} geometry={G.box} color="#6b4428" position={[x, 0.42, 0]} scale={[0.1, 0.85, 1.1]} line={0.02} />
    ))}
    <Part geometry={G.box} color="#2a2e3d" position={[0, 1.55, -0.35]} scale={[1.4, 0.9, 0.08]} line={0.02} />
    <mesh geometry={G.box} material={toonMat(screen)} position={[0, 1.55, -0.3]} scale={[1.28, 0.78, 0.02]} />
    <Part geometry={G.box} color="#2a2e3d" position={[0, 1.02, -0.35]} scale={[0.1, 0.25, 0.1]} line={0.02} />
    <Part geometry={G.box} color="#d9dbe3" position={[0, 0.92, 0.15]} scale={[1.0, 0.04, 0.32]} line={0.015} />
  </group>
);

export const Puffs: React.FC<{ list: { p: V3; born: number; size: number; color?: string; rise?: number; life?: number }[]; f: number }> = ({ list, f }) => (
  <group>
    {list.map((q, i) => {
      const age = f - q.born;
      const life = q.life ?? 45;
      if (age < 0 || age > life) return null;
      const s = q.size * (0.3 + 0.9 * (1 - Math.exp(-age / 7)));
      const o = Math.max(0, (q.color === '#ffffff' ? 0.45 : 0.85) * (1 - age / life));
      return (
        <mesh key={i} geometry={G.ball} position={[q.p[0], q.p[1] + s * 0.4 + age * (q.rise ?? 0.006), q.p[2]]} scale={s}>
          <meshToonMaterial color={q.color ?? '#f1e0c6'} transparent opacity={o} depthWrite={false} />
        </mesh>
      );
    })}
  </group>
);

/** rising steam wisps around a point */
export const Steam: React.FC<{ p: V3; f: number; amount?: number }> = ({ p, f, amount = 1 }) => {
  const list = Array.from({ length: Math.round(14 * amount) }, (_, i) => {
    const period = 40;
    const born = Math.floor((f - i * 3) / period) * period + i * 3;
    return { p: [p[0] + (rnd(i) - 0.5) * 0.7, p[1] + (rnd(i + 9) - 0.2) * 0.6, p[2] + (rnd(i + 3) - 0.5) * 0.5] as V3, born, size: 0.16 + rnd(i + 4) * 0.12, color: '#ffffff', rise: 0.035, life: period };
  });
  return <Puffs list={list} f={f} />;
};

export const Sweat: React.FC<{ p: V3; f: number }> = ({ p, f }) => (
  <group>
    {[0, 1, 2].map((i) => {
      const t = ((f + i * 13) % 30) / 30;
      return (
        <mesh key={i} geometry={G.ball} position={[p[0] + (i - 1) * 0.28, p[1] - t * 0.6, p[2] + 0.2]} scale={[0.05, 0.08, 0.05]}>
          <meshBasicMaterial color="#8fd4ff" transparent opacity={1 - t} />
        </mesh>
      );
    })}
  </group>
);

export const Backpack: React.FC = () => (
  <group>
    <Part geometry={G.box} color="#6b8f3a" position={[0, 0, -0.1]} scale={[0.7, 0.9, 0.5]} line={0.03} />
    {Array.from({ length: 9 }, (_, i) => (
      <Part key={i} geometry={G.cyl} color={i % 2 ? '#d6d9e0' : '#e8443a'} position={[-0.25 + (i % 3) * 0.25, 0.55 + Math.floor(i / 3) * 0.2, -0.1 + ((i * 7) % 3) * 0.08 - 0.08]} scale={[0.1, 0.18, 0.1]} line={0.02} />
    ))}
  </group>
);

export const Teacup: React.FC = () => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    <Part geometry={G.box} color="#ffffff" position={[0, 0, 0]} scale={[0.28, 0.02, 0.28]} line={0.01} />
    <Part geometry={G.cyl} color="#ffffff" position={[0, -0.1, 0]} scale={[0.1, 0.18, 0.1]} line={0.01} />
    <mesh geometry={G.cyl} position={[0, -0.19, 0]} scale={[0.085, 0.01, 0.085]} material={toonMat('#8a5a2b')} />
  </group>
);

export const Ball: React.FC<{ p: V3; glow?: number; s?: number }> = ({ p, glow = 0, s = 0.12 }) => (
  <group position={p}>
    <Part geometry={G.ball} color={glow > 0.5 ? '#ffb347' : '#d7f257'} scale={s} line={0.15} />
    {glow > 0 && (
      <mesh geometry={G.ball} scale={s * (1.6 + glow)}>
        <meshBasicMaterial color="#ff7a1a" transparent opacity={0.45 * glow} depthWrite={false} />
      </mesh>
    )}
  </group>
);
