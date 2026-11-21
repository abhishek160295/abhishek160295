import {interpolate, spring, Easing} from 'remotion';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const lerp = (f: number, a: number, b: number, x: number, y: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [x, y], {...clamp, easing: ease});
export const pop = (f: number, fps: number, delay = 0, damping = 12, mass = 0.6) =>
  spring({frame: f - delay, fps, config: {damping, mass, stiffness: 180}});
export const seeded = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
