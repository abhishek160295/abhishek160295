import * as THREE from 'three';
import { useMemo } from 'react';

// 3-band ramp gives the flat cel look
const ramp = (() => {
  const t = new THREE.DataTexture(new Uint8Array([90, 175, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.needsUpdate = true;
  return t;
})();

const outlineCache = new Map<number, THREE.ShaderMaterial>();
const outline = (w: number) => {
  if (!outlineCache.has(w)) {
    outlineCache.set(
      w,
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: `void main(){ vec3 p = position + normal * ${w.toFixed(4)}; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
        fragmentShader: `void main(){ gl_FragColor = vec4(0.05, 0.06, 0.11, 1.0); }`,
      }),
    );
  }
  return outlineCache.get(w)!;
};

const matCache = new Map<string, THREE.MeshToonMaterial>();
export const toonMat = (color: string) => {
  if (!matCache.has(color)) matCache.set(color, new THREE.MeshToonMaterial({ color, gradientMap: ramp }));
  return matCache.get(color)!;
};

type V3 = [number, number, number];
export const Part: React.FC<{
  geometry: THREE.BufferGeometry;
  color: string;
  position?: V3;
  rotation?: V3;
  scale?: V3 | number;
  line?: number;
  shadow?: boolean;
}> = ({ geometry, color, position, rotation, scale, line = 0.018, shadow = true }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh geometry={geometry} material={toonMat(color)} castShadow={shadow} receiveShadow />
    {line > 0 && <mesh geometry={geometry} material={outline(line)} />}
  </group>
);

// limb geometry hanging down from its pivot
export const useLimb = (len: number, r: number) =>
  useMemo(() => {
    const g = new THREE.CapsuleGeometry(r, len, 6, 14);
    g.translate(0, -len / 2, 0);
    return g;
  }, [len, r]);
