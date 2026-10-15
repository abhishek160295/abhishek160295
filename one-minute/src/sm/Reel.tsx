import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "@fontsource/patrick-hand";
import { lerp, useT } from "../lib";
import { ShowText } from "../ui";
import { SMShell } from "./Scenes";
import timeline from "./timeline.json";
import segments from "./reel.json";

const FPS = 30;
const RW = 1080;
const RH = 1920;
const SANS = "Inter, Helvetica, Arial";

type Seg = { id: string; from: number; len: number; focus?: number; fit?: boolean; text?: string; hi?: string; end?: boolean };
const SEGS = segments as Seg[];
const sceneLen = Object.fromEntries((timeline as { id: string; dur: number }[]).map((s) => [s.id, Math.round(s.dur * FPS)]));
export const REEL_FRAMES = SEGS.reduce((a, s) => a + Math.round(s.len * FPS), 0);

/** One film scene, cropped to portrait (or letterboxed) and started part-way in. */
const Shot: React.FC<{ seg: Seg }> = ({ seg }) => {
  const f = useCurrentFrame();
  const punch = lerp(f, 0, 7, 1.09, 1);
  const s = seg.fit ? RW / 1920 : RH / 1080;
  const tx = seg.fit ? 0 : Math.min(0, Math.max(RW - 1920 * s, RW / 2 - (seg.focus ?? 960) * s));
  const ty = seg.fit ? (RH - 1080 * s) / 2 : 0;
  return (
    <AbsoluteFill style={{ background: "#07080b", transform: `scale(${punch})` }}>
      <div style={{ position: "absolute", width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
        <ShowText.Provider value={false}>
          <Sequence from={-Math.round(seg.from * FPS)} durationInFrames={sceneLen[seg.id]} layout="none">
            <SMShell id={seg.id} />
          </Sequence>
        </ShowText.Provider>
      </div>
    </AbsoluteFill>
  );
};

/** Big bold reel caption; words pop in one by one, one keyword in yellow. */
const Punch: React.FC<{ text: string; hi?: string; y?: number }> = ({ text, hi, y = 1330 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <>
    <div style={{ position: "absolute", left: 0, right: 0, top: y - 160, height: 620, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0) 100%)" }} />
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 92,
        lineHeight: 1.08,
        color: "#fff",
        WebkitTextStroke: "14px #0b0b0b",
        paintOrder: "stroke fill",
        textShadow: "0 10px 30px rgba(0,0,0,0.6)",
      }}
    >
      {words.map((w, i) => {
        const sp = spring({ frame: f - i * 3, fps, config: { damping: 11, stiffness: 220 } });
        const isHi = hi && w.replace(/[.,!?]/g, "").toLowerCase() === hi.toLowerCase();
        return (
          <span key={i} style={{ display: "inline-block", marginRight: 22, transform: `scale(${0.4 + 0.6 * sp})`, opacity: Math.min(1, sp * 1.5), color: isHi ? "#ffd23f" : "#fff" }}>
            {w}
          </span>
        );
      })}
    </div>
    </>
  );
};

const EndCard: React.FC = () => {
  const t = useT();
  const pop = (a: number) => lerp(t, a, a + 0.25, 0, 1);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2a2116 0%, #07080b 75%)", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 900, color: "#fff" }}>
        <div style={{ fontSize: 84, opacity: pop(0.1), transform: `scale(${0.8 + 0.2 * pop(0.1)})`, color: "#d7dbe2" }}>
          Don't start Monday.
        </div>
        <div
          style={{
            marginTop: 70,
            display: "inline-block",
            background: "#ffd84d",
            color: "#d8262f",
            fontFamily: "'Patrick Hand', cursive",
            fontWeight: 400,
            fontSize: 150,
            padding: "40px 70px",
            transform: `rotate(-3deg) scale(${0.6 + 0.4 * pop(0.6)})`,
            opacity: pop(0.6),
            boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          }}
        >
          Start for
          <br />1 minute.
        </div>
        <div style={{ marginTop: 90, fontSize: 46, color: "#ffd23f", opacity: pop(1.4) }}>Full film on my channel</div>
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SEGS.map((seg, i) => {
        const d = Math.round(seg.len * FPS);
        const from = at;
        at += d;
        return (
          <Sequence key={i} from={from} durationInFrames={d}>
            {seg.end ? <EndCard /> : <Shot seg={seg} />}
            {seg.text && <Punch text={seg.text} hi={seg.hi} />}
          </Sequence>
        );
      })}
      <Audio src={staticFile("reel-audio.wav")} />
    </AbsoluteFill>
  );
};

export const ReelComp = () => <Composition id="Reel" component={Reel} durationInFrames={REEL_FRAMES} fps={FPS} width={RW} height={RH} />;
