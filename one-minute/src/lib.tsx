import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "@fontsource/patrick-hand";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/400-italic.css";

export const W = 1920;
export const H = 1080;
export const HAND = "'Patrick Hand', cursive";
export const SERIF = "'Cormorant Garamond', serif";

export const ease = Easing.bezier(0.45, 0, 0.2, 1);

export const lerp = (
  t: number,
  a: number,
  b: number,
  from: number,
  to: number,
  e = ease,
) =>
  interpolate(t, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e,
  });

/** Seconds since the start of the current sequence. */
export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

export const useDur = () => {
  const { durationInFrames, fps } = useVideoConfig();
  return durationInFrames / fps;
};

export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    width={W}
    height={H}
    style={{ position: "absolute", inset: 0, ...style }}
  >
    {children}
  </svg>
);

/** Slow camera move: interpolates scale and pan across the scene. */
export const Cam: React.FC<{
  children: React.ReactNode;
  from?: [number, number, number];
  to?: [number, number, number];
  start?: number;
  end?: number;
  blur?: number;
}> = ({ children, from = [1, 0, 0], to = [1.06, 0, 0], start = 0, end, blur = 0 }) => {
  const t = useT();
  const d = useDur();
  const e = end ?? d;
  const s = lerp(t, start, e, from[0], to[0]);
  const x = lerp(t, start, e, from[1], to[1]);
  const y = lerp(t, start, e, from[2], to[2]);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) scale(${s})`,
        transformOrigin: "50% 50%",
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Fades each scene in and out so cuts feel soft. */
export const Fade: React.FC<{ children: React.ReactNode; inn?: number; out?: number }> = ({
  children,
  inn = 0.35,
  out = 0.35,
}) => {
  const t = useT();
  const d = useDur();
  const o = Math.min(inn ? lerp(t, 0, inn, 0, 1) : 1, out ? lerp(t, d - out, d, 1, 0) : 1);
  return <AbsoluteFill style={{ opacity: o, backgroundColor: "transparent" }}>{children}</AbsoluteFill>;
};

/** Soft radial glow, used for lamps, screens and light pools. */
export const Glow: React.FC<{
  cx: number;
  cy: number;
  r: number;
  color: string;
  o?: number;
  id: string;
}> = ({ cx, cy, r, color, o = 1, id }) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={o} />
        <stop offset="0.4" stopColor={color} stopOpacity={o * 0.35} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
  </>
);

/** Cinematic finish: vignette, grain, gentle colour grade. */
export const Finish: React.FC<{ tint?: string; vignette?: number }> = ({
  tint = "transparent",
  vignette = 0.55,
}) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 50;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: tint, mixBlendMode: "soft-light" }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Falling particles: leaves, dust or snow. */
export const Particles: React.FC<{
  n: number;
  colors: string[];
  size?: [number, number];
  speed?: number;
  drift?: number;
  kind?: "leaf" | "dust";
  seed?: number;
  area?: [number, number, number, number];
}> = ({ n, colors, size = [8, 16], speed = 120, drift = 60, kind = "leaf", seed = 1, area = [0, 0, W, H] }) => {
  const t = useT();
  const [ax, ay, aw, ah] = area;
  return (
    <Svg>
      {Array.from({ length: n }).map((_, i) => {
        const r1 = rand(i * 7 + seed);
        const r2 = rand(i * 13 + seed);
        const r3 = rand(i * 29 + seed);
        const sp = speed * (0.6 + r2 * 0.8);
        const y = ay + ((r1 * ah + t * sp) % (ah + 80)) - 40;
        const x = ax + ((r3 * aw + Math.sin(t * 1.3 + i) * drift + t * drift * 0.4) % aw);
        const s = size[0] + (size[1] - size[0]) * r2;
        const c = colors[i % colors.length];
        if (kind === "dust") {
          return <circle key={i} cx={x} cy={y} r={s / 4} fill={c} opacity={0.25 + 0.4 * Math.abs(Math.sin(t + i))} />;
        }
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={s}
            ry={s * 0.45}
            fill={c}
            transform={`rotate(${(t * 90 * (r1 - 0.5) * 4 + i * 40) % 360} ${x} ${y})`}
            opacity={0.9}
          />
        );
      })}
    </Svg>
  );
};

export const Rain: React.FC<{ n?: number; o?: number }> = ({ n = 220, o = 0.45 }) => {
  const t = useT();
  return (
    <Svg>
      {Array.from({ length: n }).map((_, i) => {
        const r1 = rand(i * 3.1);
        const r2 = rand(i * 5.7);
        const sp = 2600 + r2 * 900;
        const y = ((r1 * H + t * sp) % (H + 200)) - 100;
        const x = (rand(i * 9.3) * (W + 300) - 150 + y * 0.18) % (W + 100);
        return (
          <line key={i} x1={x} y1={y} x2={x - 9} y2={y + 46 + r2 * 30} stroke="#b9c8dd" strokeWidth={1.6} opacity={o * (0.4 + r2 * 0.6)} />
        );
      })}
    </Svg>
  );
};
