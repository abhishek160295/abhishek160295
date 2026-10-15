import React from "react";
import { AbsoluteFill } from "remotion";
import { Arm, Character } from "../Character";
import { Cam, Finish, Glow, H, Particles, SERIF, W, lerp, useT } from "../lib";
import { Caption, Inner, PhoneScene, Quote } from "../ui";
import { Bedroom, Full, Park, ShoulderFG } from "../sets";
import { BedSide, Gym, Jeans, NoteWall, Party, PhoneHeld, PushUp, Room, SpeechSmall, Stairs, Sticky } from "./sets";
import { LockScreen, PayScreen, ReelsScreen, ScreenTimeScreen, StoryScreen } from "./screens";

const zoom = (cx: number, cy: number, s: number) => `translate(${960 - cx * s},${560 - cy * s}) scale(${s})`;

/** Small jolt used when a note slaps onto the wall. */
const useJolt = (times: number[]) => {
  const t = useT();
  let j = 0;
  for (const a of times) if (t > a && t < a + 0.2) j += (1 - (t - a) / 0.2) * 10 * Math.sin((t - a) * 90);
  return j;
};

/* ═════════ COLD OPEN ═════════ */

const CoNotes = () => {
  const t = useT();
  const j = useJolt([0.1, 1.35, 2.55]);
  const notes = [
    { at: 0.1, x: 560, y: 300, r: -6, stamp: "Jan 8" },
    { at: 1.35, x: 760, y: 260, r: 4, stamp: "Jan 15" },
    { at: 2.55, x: 680, y: 340, r: -2, stamp: "Jan 22" },
  ];
  return (
    <Cam from={[1.02, 0, 0]} to={[1.12, 0, 0]}>
      <Full>
        <g transform={`translate(${j},${j * 0.4})`}>
          <NoteWall night>
            {notes.map((n, i) =>
              t > n.at ? (
                <Sticky
                  key={i}
                  x={n.x}
                  y={n.y}
                  rot={n.r}
                  s={lerp(t, n.at, n.at + 0.15, 1.25, 1)}
                  stamp={n.stamp}
                  lines={[{ text: "From Monday.", at: n.at + 0.15, strike: n.at + 0.95, size: 72 }]}
                />
              ) : null,
            )}
            <Glow cx={900} cy={500} r={700} color="#ffd56b" o={0.12} id="coG" />
          </NoteWall>
        </g>
      </Full>
    </Cam>
  );
};

const CoText = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#050506", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 96,
          color: "#f2efe8",
          opacity: lerp(t, 0.3, 1.0, 0, 1),
          transform: `scale(${lerp(t, 0.3, 3.4, 0.96, 1.04)})`,
          filter: `blur(${lerp(t, 0.3, 1.0, 10, 0)}px)`,
        }}
      >
        Sound familiar?
      </div>
    </AbsoluteFill>
  );
};

const QOpen = () => <Quote lines={["Every Monday, millions of people start a new life.", "By Wednesday, most have quit."]} />;

/* ═════════ ACT 1 ═════════ */

const NoteBig = () => {
  const t = useT();
  const flash = Math.max(lerp(t, 1.0, 1.15, 0, 1) * lerp(t, 1.15, 1.9, 1, 0), lerp(t, 3.2, 3.35, 0, 1) * lerp(t, 3.35, 4.1, 1, 0));
  return (
    <Cam from={[1, 0, 0]} to={[1.12, 0, 0]}>
      <Full>
        <NoteWall warm>
          <Sticky
            x={640}
            y={200}
            s={1.6}
            rot={-3}
            lines={[
              { text: "GYM 2 HRS DAILY", at: 0.3, size: 50 },
              { text: "NO SUGAR", at: 1.5, size: 50 },
              { text: "WAKE 5 AM", at: 2.7, size: 50 },
            ]}
          />
          <rect width={W} height={H} fill="#ff7ab0" opacity={flash * 0.12} />
        </NoteWall>
      </Full>
    </Cam>
  );
};

const Pay = () => (
  <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
    <Full>
      <PhoneHeld>
        <PayScreen />
      </PhoneHeld>
    </Full>
  </Cam>
);

const GymEnter = () => {
  const t = useT();
  const x = lerp(t, 0, 2.6, -160, 860);
  return (
    <Cam from={[1, 0, 0]} to={[1.08, 0, 10]}>
      <Full>
        <Gym>
          <Character x={380} y={900} s={1.05} buff pose="curl" item="dumbbell" outfit="tank" expr="determined" rim="#7affea" />
          <Character x={1560} y={900} s={1.1} buff pose="armsUp" outfit="tank" expr="neutral" dir={-1} rim="#7affea" />
          <Character x={x} y={980} s={1.15} pose={t < 2.6 ? "walk" : "stand"} expr="determined" rim="#9fd8ff" />
        </Gym>
      </Full>
    </Cam>
  );
};

/* ═════════ ACT 2 ═════════ */

const GymStruggle = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
        <Full>
          <g transform={zoom(980, 600, 1.7)}>
            <Gym>
              <Character x={1220} y={940} s={1.15} buff pose="curl" item="dumbbell" outfit="tank" dir={-1} expr="neutral" look={t > 1.8 ? -1 : 0} rim="#7affea" />
              <Character x={800} y={960} s={1.0} pose="curl" item="dumbbell" expr="worried" shake={3} speed={0.4} rim="#9fd8ff" />
            </Gym>
          </g>
        </Full>
      </Cam>
      <Inner text="Everyone's watching." x={560} y={220} at={2.0} size={64} />
    </AbsoluteFill>
  );
};

const StairsScene = () => {
  const t = useT();
  const u = lerp(t, 0, 4.4, 0.05, 0.62, (v) => v);
  const x = 150 + u * 1500;
  const y = 260 + (x + 40) * 0.47 + 70;
  const hy = y - 380 * 1.0;
  return (
    <Cam from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <Full>
        <Stairs>
          <Character x={x} y={y} s={1.0} pose="walk" speed={0.45} expr="worried" shake={1.4} rim="#e6eef8" />
          <SpeechSmall x={x + 150} y={hy - 30} text="Ow." at={0.6} />
          <SpeechSmall x={x + 220} y={hy + 50} text="Ow." at={1.5} />
          <SpeechSmall x={x + 120} y={hy + 120} text="Ow!" at={2.4} />
        </Stairs>
      </Full>
    </Cam>
  );
};

const Alarm5 = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      {t < 1.6 ? (
        <PhoneScene date="Mon, Jan 6" label="GYM" time="5:00" dark={lerp(t, 0, 0.4, 0.6, 0)} />
      ) : (
        <Cam from={[1.15, 0, 60]} to={[1.05, 0, 30]}>
          <Full>
            <Bedroom expr="sleep" light={0.1} />
            <rect x={1040} y={lerp(t, 1.6, 2.1, 300, 150)} width={190} height={170} rx={50} fill="#8c9ab0" />
          </Full>
        </Cam>
      )}
      <Inner text="Rest day." x={330} y={480} at={2.0} size={64} />
      <Inner text="Recovery is important." x={330} y={570} at={2.6} size={46} />
    </AbsoluteFill>
  );
};

const Loop = () => {
  const t = useT();
  const j = useJolt([0.2, 1.6, 3.1]);
  return (
    <Cam from={[1, 0, 0]} to={[1.08, 0, 0]}>
      <Full>
        <g transform={`translate(${j},0)`}>
          <NoteWall night>
            {[
              { at: 0.2, x: 300, r: -5, stamp: "Feb 3", text: "From Monday.", strike: 1.3 },
              { at: 1.6, x: 760, r: 3, stamp: "Feb 10", text: "From Monday.", strike: 2.8 },
              { at: 3.1, x: 1220, r: -3, stamp: "Feb 24", text: "From the 1st.", strike: 4.3 },
            ].map((n, i) =>
              t > n.at ? (
                <Sticky
                  key={i}
                  x={n.x}
                  y={320}
                  rot={n.r}
                  s={lerp(t, n.at, n.at + 0.15, 1.2, 0.95)}
                  stamp={n.stamp}
                  lines={[{ text: n.text, at: n.at + 0.1, strike: n.strike, size: 66 }]}
                />
              ) : null,
            )}
            {t > 4.6 && (
              <Sticky x={760} y={330} rot={0} s={lerp(t, 4.6, 4.75, 1.3, 1.05)} stamp="Mar 3" lines={[{ text: "From Monday.", at: 4.7, size: 66 }]} />
            )}
            <g transform="translate(1720,170)">
              <circle r={90} fill="#e8e4da" stroke="#2a2e36" strokeWidth={8} />
              <line x1={0} y1={0} x2={0} y2={-60} stroke="#2a2e36" strokeWidth={6} transform={`rotate(${t * 720})`} />
              <line x1={0} y1={0} x2={0} y2={-40} stroke="#2a2e36" strokeWidth={8} transform={`rotate(${t * 60})`} />
            </g>
          </NoteWall>
        </g>
      </Full>
    </Cam>
  );
};

const BedScroll = () => (
  <Cam from={[1, 0, 0]} to={[1.25, 180, 60]}>
    <Full>
      <BedSide face="bored" chips scrollHand />
    </Full>
  </Cam>
);

const Reels = () => (
  <Full>
    <PhoneHeld>
      <ReelsScreen swipes={[0.2, 1.9, 3.6]} taps={[1.2, 2.9, 4.6]} />
    </PhoneHeld>
  </Full>
);

const Debit = () => (
  <AbsoluteFill>
    <Full>
      <PhoneHeld>
        <LockScreen
          notif={[{ at: 0.5, app: "BANK ALERT", title: "₹2,000 debited", body: "To POWERGYM · monthly auto-pay" }]}
        />
      </PhoneHeld>
    </Full>
    <Inner text="...again." x={420} y={560} at={2.0} size={70} />
  </AbsoluteFill>
);

const Story = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Full>
        <PhoneHeld face={lerp(t, 3.2, 3.6, 0, 1)}>
          <StoryScreen />
        </PhoneHeld>
      </Full>
    </AbsoluteFill>
  );
};

const JeansScene = () => {
  const t = useT();
  const c = 0.55 * Math.abs(Math.sin(t * 1.4)) * lerp(t, 0.3, 0.8, 0, 1);
  return (
    <Full>
      <Jeans close={c} />
    </Full>
  );
};

const Mirror = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Cam from={[1, 0, 0]} to={[1.1, 0, 20]}>
        <Full>
          <rect width={W} height={H} fill="#2b2f38" />
          <rect x={540} y={60} width={840} height={980} rx={14} fill="#1b1f27" stroke="#8b939f" strokeWidth={12} />
          <rect x={556} y={76} width={808} height={948} fill="#3a4250" />
          <rect x={556} y={700} width={808} height={324} fill="#2a2f39" />
          <Glow cx={960} cy={300} r={500} color="#c9d6ea" o={0.25} id="mrG" />
          <Character x={960} y={1300} s={1.9} expr={t > 3.4 ? "closed" : "sad"} look={t > 3.0 ? -0.8 : 0} rim="#c9d6ea" />
          <path d="M600,76 L800,76 L620,1024 L556,1024 Z" fill="#fff" opacity={0.05} />
          <ShoulderFG x={380} s={1.5} />
        </Full>
      </Cam>
      <Caption text={"Maybe I'm just not\na disciplined person."} x={1100} y={150} at={3.2} />
    </AbsoluteFill>
  );
};

/* ═════════ ACT 3 ═════════ */

const ScreenTime = () => (
  <Cam from={[1, 0, 0]} to={[1.12, 0, 0]}>
    <Full>
      <PhoneHeld>
        <ScreenTimeScreen />
      </PhoneHeld>
    </Full>
  </Cam>
);

const FaceRealize = () => (
  <AbsoluteFill>
    <Cam from={[1.3, 260, 30]} to={[1.9, 520, 80]}>
      <Full>
        <BedSide face="shock" glow={1.3} />
      </Full>
    </Cam>
    <Inner text="Four and a half hours..." x={1420} y={700} at={0.6} size={66} />
    <Inner text="every day?" x={1420} y={810} at={2.0} size={84} />
  </AbsoluteFill>
);

const NoteGym = () => (
  <AbsoluteFill>
    <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <Full>
        <NoteWall night>
          <Sticky
            x={360}
            y={360}
            rot={-3}
            lines={[
              { text: "GYM 2 HRS DAILY", at: -9, size: 50 },
              { text: "NO SUGAR", at: -9, size: 50 },
              { text: "WAKE 5 AM", at: -9, size: 50 },
            ]}
          />
          <g transform="translate(1320,560) rotate(6)">
            <rect x={-150} y={-280} width={300} height={560} rx={40} fill="#06070a" />
            <rect x={-134} y={-264} width={268} height={528} rx={28} fill="#0f1115" />
            <text x={0} y={-60} textAnchor="middle" fontFamily="Inter, Arial" fontSize={26} fill="#9aa1ab">
              Daily Average
            </text>
            <text x={0} y={20} textAnchor="middle" fontFamily="Inter, Arial" fontWeight={800} fontSize={68} fill="#fff">
              4h 37m
            </text>
          </g>
          <Glow cx={1320} cy={560} r={420} color="#8fa8ff" o={0.25} id="ngG" />
        </NoteWall>
      </Full>
    </Cam>
    <Inner text="No time for two hours..." x={960} y={160} at={0.6} size={62} />
    <Inner text="...but four and a half for this?" x={960} y={950} at={2.6} size={66} />
  </AbsoluteFill>
);

const Rip = () => {
  const t = useT();
  const peel = lerp(t, 0.5, 1.1, 0, 1);
  const fly = lerp(t, 0.9, 1.6, 0, 1);
  const shrink = lerp(t, 4.0, 4.5, 0, 1);
  return (
    <Cam from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <Full>
        <NoteWall night>
          {fly < 1 && (
            <g transform={`translate(${fly * -900},${fly * 400}) rotate(${fly * -60} 560 500) scale(${1 - fly * 0.6})`}>
              <Sticky
                x={560}
                y={300}
                rot={-3}
                peel={peel}
                lines={[
                  { text: "GYM 2 HRS DAILY", at: -9, size: 50 },
                  { text: "NO SUGAR", at: -9, size: 50 },
                  { text: "WAKE 5 AM", at: -9, size: 50 },
                ]}
              />
            </g>
          )}
          <g transform="translate(1480,640) rotate(4)">
            <rect x={-130} y={-250} width={260} height={500} rx={36} fill="#06070a" />
            <rect x={-116} y={-236} width={232} height={472} rx={24} fill="#1b2340" />
          </g>
          {t > 1.6 && (
            <g transform={`translate(${shrink * 760},${shrink * 280}) scale(${1 - shrink * 0.48})`}>
              <Sticky
                x={680}
                y={lerp(t, 1.6, 1.9, 220, 300)}
                rot={2}
                lines={[
                  { text: "1 MINUTE.", at: 2.0, size: 76 },
                  { text: "BEFORE PHONE.", at: 2.9, size: 58 },
                ]}
              />
            </g>
          )}
          {t > 2.2 && t < 3.9 && <Arm from={[1900, 1300]} to={[1100, 430 + (t > 2.9 ? 95 : 0) + Math.sin(t * 12) * 10]} w={70} kind="grip" />}
        </NoteWall>
      </Full>
    </Cam>
  );
};

const QZiglar = () => <Quote lines={["You don't have to be great to start.", "But you have to start to be great."]} by="Zig Ziglar" />;

/* ═════════ ACT 4 ═════════ */

const MorningReach = () => {
  const t = useT();
  const r = Math.min(lerp(t, 0.6, 2.0, 0, 0.84), 0.84);
  return (
    <Cam from={[1, 0, 0]} to={[1.1, 180, 0]}>
      <Full>
        <BedSide face="awake" phone={false} mode="morning" reach={r} />
        <rect x={1500} y={660} width={260} height={240} fill="#6c5a48" />
        <g transform="translate(1610,650) rotate(-8)">
          <rect x={-44} y={-18} width={130} height={36} rx={8} fill="#0b0d12" />
          <rect x={-10} y={-36} width={70} height={70} fill="#ffd84d" transform="rotate(10)" />
        </g>
        {t < 1.2 && <Glow cx={1640} cy={640} r={200} color="#9fc0ff" o={0.5 * (0.5 + 0.5 * Math.sin(t * 20))} id="mrA" />}
      </Full>
    </Cam>
  );
};

const PushUp1 = () => {
  const t = useT();
  const rep = (a: number, b: number) => lerp(t, a, (a + b) / 2, 0, 1) - lerp(t, (a + b) / 2, b, 0, 1);
  const k = rep(0.6, 2.4) + rep(2.8, 4.6);
  return (
    <AbsoluteFill>
      <Cam from={[1, 0, 0]} to={[1.08, 60, 20]}>
        <Full>
          <Room mode="morning" desk={false}>
            <ellipse cx={1000} cy={980} rx={620} ry={60} fill="#b3896a" opacity={0.6} />
            <PushUp x={1300} y={970} s={1.1} k={k} shake={2} />
          </Room>
        </Full>
      </Cam>
      <Caption text="...ugh. One minute. Fine." y={150} at={1.0} />
    </AbsoluteFill>
  );
};

/* ═════════ ACT 5 ═════════ */

const MontGym = () => {
  const t = useT();
  return (
    <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <Full>
        <g transform={zoom(980, 600, 1.5)}>
          <Gym bright>
            <Character x={1220} y={940} s={1.15} buff pose={t > 2 ? "stand" : "curl"} item="dumbbell" outfit="tank" dir={-1} expr={t > 2 ? "smile" : "neutral"} look={-1} rim="#7affea" />
            <Character x={800} y={960} s={1.0} pose="curl" item="dumbbell" expr="determined" speed={0.8} rim="#9fd8ff" />
          </Gym>
        </g>
      </Full>
    </Cam>
  );
};

const Wedding = () => {
  const t = useT();
  const pu = t > 2.6;
  const k = pu ? 0.5 + 0.5 * Math.sin((t - 2.6) * 3.6 - Math.PI / 2) : 0;
  return (
    <AbsoluteFill>
      <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
        <Full>
          <Room mode="late" desk={false}>
            <Sticky x={1500} y={300} s={0.4} rot={4} lines={[{ text: "1 MINUTE.", at: -9, size: 70 }]} />
            <Glow cx={1580} cy={380} r={200} color="#ffd84d" o={0.15} id="wdG" />
            {pu ? (
              <PushUp x={1250} y={970} s={1.1} k={k} suit />
            ) : (
              <Character x={1000} y={1000} s={1.15} outfit="suit" expr="tired" pose="stand" look={0.8} rim="#8fa6d8" />
            )}
          </Room>
        </Full>
      </Cam>
      <Inner text="Just one." x={700} y={260} at={1.3} size={70} />
      <Caption text="Ha." x={1000} y={560} at={5.0} />
    </AbsoluteFill>
  );
};

const ButtonScene = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Full>
        <Jeans close={lerp(t, 0.3, 1.8, 0.4, 1)} />
        {t > 1.8 && <Glow cx={960} cy={596} r={lerp(t, 1.8, 2.4, 40, 260)} color="#fff4c2" o={lerp(t, 1.8, 2.8, 0.8, 0)} id="btG" />}
      </Full>
    </AbsoluteFill>
  );
};

const QDurant = () => <Quote lines={["We are what we repeatedly do."]} by="Will Durant" />;

/* ═════════ ACT 6 ═════════ */

const FriendGym = () => (
  <AbsoluteFill>
    <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <Full>
        <g transform={zoom(960, 620, 1.4)}>
          <Gym bright>
            <Character x={1160} y={960} s={1.1} outfit="cap" dir={-1} expr="smile" rim="#7affea" />
            <Character x={760} y={960} s={1.1} expr="neutral" rim="#9fd8ff" />
          </Gym>
        </g>
      </Full>
    </Cam>
    <Caption text={"Bro, you look different.\nWhat's your routine? Two hours daily?"} y={140} at={0.3} />
  </AbsoluteFill>
);

const Close: React.FC<{ friend?: boolean; expr: "smile" | "happy" | "worried"; text: string }> = ({ friend, expr, text }) => (
  <AbsoluteFill>
    <Cam from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <Full>
        <g transform={friend ? zoom(1160, 560, 2.4) : zoom(760, 560, 2.4)}>
          <Gym bright>
            <Character x={1160} y={960} s={1.1} outfit="cap" dir={-1} expr={friend ? expr : "smile"} rim="#7affea" />
            <Character x={760} y={960} s={1.1} expr={friend ? "smile" : expr} rim="#9fd8ff" />
          </Gym>
        </g>
        <ShoulderFG x={friend ? 300 : 1640} s={1.2} />
      </Full>
    </Cam>
    <Caption text={text} y={150} at={0.3} />
  </AbsoluteFill>
);

const HeOne = () => <Close expr="smile" text="One minute." />;
const FriendWhat = () => <Close friend expr="worried" text="One minute?" />;
const HeRest = () => <Close expr="happy" text={"The rest just shows up\nafter that."} />;

const EndCard = () => <Quote big lines={["1 MINUTE"]} sub="Don't start Monday. Start for one minute." />;


/* ═════════ NEW BEATS ═════════ */

const NYE_FW: [number, number, number, string][] = [
  [260, 240, 0.6, "#ffcf6b"],
  [480, 300, 3.0, "#ff6b9a"],
  [330, 200, 5.6, "#7ad7ff"],
];

const NyeParty = () => (
  <Cam from={[1, 0, 0]} to={[1.1, 80, 20]}>
    <Full>
      <Party fireworks={NYE_FW}>
        <Character x={420} y={1000} s={0.9} pose="cheer" expr="happy" item="cup" rim="#ffcf8a" />
        <Character x={1560} y={1000} s={0.9} pose="cheer" expr="happy" rim="#8fd3ff" />
        <Character x={1220} y={1000} s={1.05} pose="wave" outfit="cap" expr="smile" dir={-1} rim="#ff9fb8" />
        <Character x={900} y={1000} s={1.05} pose="write" item="note" expr="determined" rim="#ffd56b" />
        <SpeechSmall x={1400} y={540} text="Gym every day, bro. You in?" at={1.0} />
        <SpeechSmall x={760} y={360} text="Two hours. Daily. This year." at={3.6} color="#ffd56b" />
      </Party>
    </Full>
  </Cam>
);

const KidDoor = () => {
  const t = useT();
  const door = Math.min(lerp(t, 0.6, 1.4, 0, 0.75), lerp(t, 8.0, 9.0, 0.75, 0));
  const kidO = Math.min(lerp(t, 1.0, 1.4, 0, 1), lerp(t, 7.6, 8.1, 1, 0));
  return (
    <AbsoluteFill>
      <Cam from={[1.05, -40, 20]} to={[1.1, -80, 30]}>
        <Full>
          <BedSide
            face="bored"
            scrollHand
            door={door}
            kid={
              <g opacity={kidO}>
                <Character x={1630} y={705} s={0.55} kid expr={t > 6.4 ? "sad" : "neutral"} look={-1} rim="#ffcf8a" />
              </g>
            }
          />
        </Full>
      </Cam>
      <Caption text="Papa... can we play outside tomorrow?" x={1320} y={200} at={1.7} until={4.0} size={52} />
      <Caption text="Mm. Tomorrow." x={760} y={260} at={4.4} until={6.0} size={52} />
      <Caption text="You said that yesterday." x={1320} y={200} at={6.3} until={8.2} size={52} />
    </AbsoluteFill>
  );
};

const SilenceHold = () => (
  <Cam from={[1.3, 260, 30]} to={[1.55, 380, 50]}>
    <Full>
      <BedSide face="sad" glow={0.7} door={0} />
    </Full>
  </Cam>
);

const Exhale = () => (
  <Cam from={[1, 0, 0]} to={[1.12, 0, -30]}>
    <Full>
      <Room mode="morning" desk={false}>
        <Character x={960} y={1420} s={2.4} expr="determined" breath={5} rim="#ffe2b8" />
      </Room>
    </Full>
  </Cam>
);

const KidWatch = () => {
  const t = useT();
  const kx = lerp(t, 0.3, 1.8, 2100, 1720);
  const down = t > 2.4;
  const k1 = 0.5 + 0.5 * Math.sin(t * 2.6 - 1.5);
  const k2 = 0.5 + 0.5 * Math.sin((t - 2.4) * 3.2 - 1.5);
  return (
    <Cam from={[1, 0, 0]} to={[1.06, -40, 10]}>
      <Full>
        <Room mode="morning" desk={false}>
          <ellipse cx={1050} cy={980} rx={760} ry={60} fill="#b3896a" opacity={0.6} />
          <PushUp x={1150} y={970} s={1.05} k={k1} />
          {down ? (
            <PushUp x={1780} y={975} s={0.5} k={k2} />
          ) : (
            <Character x={kx} y={985} s={0.58} kid pose={t < 1.8 ? "walk" : "stand"} dir={-1} expr="happy" rim="#ffe2b8" />
          )}
        </Room>
      </Full>
    </Cam>
  );
};

const Tally1 = () => {
  const t = useT();
  return (
    <Cam from={[1.05, 0, 0]} to={[1.15, 0, 0]}>
      <Full>
        <NoteWall warm>
          <Sticky x={720} y={260} rot={2} tally={t > 1.2 ? 1 : 0} lines={[{ text: "1 MINUTE.", at: -9, size: 76 }]} />
          {t < 2.4 && <Arm from={[1900, 1300]} to={[lerp(t, 0.4, 1.0, 1300, 800), 520]} w={70} kind="grip" />}
          <Glow cx={960} cy={500} r={700} color="#ffe2b0" o={0.18} id="t1G" />
        </NoteWall>
      </Full>
    </Cam>
  );
};

const MontTally = () => {
  const t = useT();
  const a = Math.min(25, lerp(t, 0.4, 2.0, 1, 25, (v) => v));
  const b = Math.min(25, lerp(t, 2.2, 3.8, 0, 25, (v) => v));
  const c = lerp(t, 4.0, 5.6, 0, 18, (v) => v);
  return (
    <Cam from={[1.2, 200, 0]} to={[1.0, 0, 0]}>
      <Full>
        <NoteWall warm>
          <Sticky x={300} y={300} rot={2} tally={a} lines={[{ text: "1 MINUTE.", at: -9, size: 70 }]} />
          {t > 2.1 && <Sticky x={760} y={290} rot={-2} tally={b} lines={[{ text: "1 MINUTE.", at: -9, size: 70 }]} />}
          {t > 3.9 && <Sticky x={1220} y={310} rot={3} tally={c} lines={[{ text: "1 MINUTE.", at: -9, size: 70 }]} />}
          <rect width={W} height={H} fill="#ffd9a0" opacity={lerp(t, 0, 6, 0, 0.12)} />
        </NoteWall>
      </Full>
    </Cam>
  );
};

const MontPark = () => (
  <AbsoluteFill>
    <Full>
      <Park season="autumn">
        <Character x={760} y={900} s={0.9} pose="run" speed={0.8} expr="smile" rim="#ffd29a" />
        <Character x={1060} y={905} s={0.52} kid pose="run" speed={1.1} expr="happy" rim="#ffd29a" />
      </Park>
    </Full>
    <Particles n={24} colors={["#e8a03a", "#d9822b", "#f2bc4f"]} speed={110} drift={-120} />
  </AbsoluteFill>
);

const DebitAgain = () => (
  <AbsoluteFill>
    <Full>
      <defs>
        <filter id="dagb">
          <feGaussianBlur stdDeviation={14} />
        </filter>
      </defs>
      <g filter="url(#dagb)">
        <Gym bright>
          <Character x={760} y={960} s={1.1} pose="curl" item="dumbbell" expr="determined" rim="#9fd8ff" />
        </Gym>
      </g>
      <g transform="translate(240,140) scale(0.75)">
        <PhoneHeld bg="none">
          <LockScreen time="7:42" date="Monday, October 6" notif={[{ at: 0.6, app: "BANK ALERT", title: "₹2,000 debited", body: "To POWERGYM · monthly auto-pay" }]} />
        </PhoneHeld>
      </g>
    </Full>
    <Caption text="Worth it." x={960} y={150} at={2.4} />
  </AbsoluteFill>
);

const NyeAgain = () => (
  <AbsoluteFill>
    <Cam from={[1, 0, 0]} to={[1.08, 0, 10]}>
      <Full>
        <Party fireworks={NYE_FW}>
          <Character x={420} y={1000} s={0.9} pose="cheer" expr="happy" item="cup" rim="#ffcf8a" />
          <Character x={1500} y={1000} s={1.05} pose="cheer" outfit="cap" expr="happy" dir={-1} rim="#ff9fb8" />
          <Character x={1000} y={1000} s={1.05} pose="hold" item="note" expr="smile" rim="#ffd56b" />
          <Character x={1180} y={1005} s={0.55} kid expr="happy" look={-1} rim="#ffd56b" />
          <SpeechSmall x={1440} y={420} text="This year: gym THREE hours daily!" at={0.8} />
          <SpeechSmall x={1420} y={800} text="Papa, what's yours?" at={3.4} />
          <SpeechSmall x={860} y={500} text="Same as last year." at={5.2} color="#ffd56b" />
        </Party>
      </Full>
    </Cam>
  </AbsoluteFill>
);

const NoteWallFinal = () => {
  const t = useT();
  const k = lerp(t, 4.4, 5.0, 0, 1);
  return (
    <Cam from={[2.2, 0, 0]} to={[1.0, 0, 0]} end={4.2}>
      <Full>
        <NoteWall warm>
          {Array.from({ length: 21 }).map((_, i) => {
            const c = i % 7,
              r = Math.floor(i / 7);
            return (
              <Sticky
                key={i}
                x={60 + c * 262}
                y={70 + r * 330}
                s={0.6}
                rot={((i * 37) % 9) - 4}
                tally={i === 10 ? 25 : 18 + ((i * 7) % 8)}
                tallyY={200}
                lines={[{ text: "1 MINUTE.", at: -9, size: 70 }]}
              />
            );
          })}
          <rect width={W} height={H} fill="#000" opacity={0.35 * k} />
          {k > 0 && (
            <Sticky x={760} y={lerp(k, 0, 1, 380, 330)} s={lerp(k, 0, 1, 1.5, 1.0)} rot={-2} lines={[{ text: "Keep going.", at: 4.7, size: 78 }]} />
          )}
        </NoteWall>
      </Full>
    </Cam>
  );
};

const COOL = "rgba(80,110,170,0.4)";
const WARM = "rgba(255,190,120,0.28)";
const GYM = "rgba(60,200,190,0.18)";

export const SM_SCENES: Record<string, { C: React.FC; tint?: string; vig?: number }> = {
  co_notes: { C: CoNotes, tint: "rgba(255,200,120,0.2)", vig: 0.75 },
  co_text: { C: CoText, vig: 0 },
  q_open: { C: QOpen, vig: 0 },
  nye_party: { C: NyeParty, tint: "rgba(170,120,255,0.2)" },
  note_big: { C: NoteBig, tint: WARM },
  pay: { C: Pay },
  gym_enter: { C: GymEnter, tint: GYM },
  gym_struggle: { C: GymStruggle, tint: GYM },
  stairs: { C: StairsScene, tint: COOL },
  alarm5: { C: Alarm5, vig: 0.7 },
  loop: { C: Loop, tint: COOL, vig: 0.7 },
  bed_scroll: { C: BedScroll, tint: COOL, vig: 0.7 },
  reels_screen: { C: Reels },
  debit: { C: Debit },
  story: { C: Story },
  jeans: { C: JeansScene, tint: COOL },
  mirror: { C: Mirror, tint: COOL, vig: 0.75 },
  screentime: { C: ScreenTime },
  kid_door: { C: KidDoor, tint: COOL, vig: 0.7 },
  silence_hold: { C: SilenceHold, tint: COOL, vig: 0.85 },
  face_realize: { C: FaceRealize, vig: 0.8 },
  note_gym: { C: NoteGym, tint: COOL, vig: 0.7 },
  rip: { C: Rip, tint: "rgba(255,200,120,0.15)" },
  q_ziglar: { C: QZiglar, vig: 0 },
  morning_reach: { C: MorningReach, tint: WARM },
  pushup1: { C: PushUp1, tint: WARM },
  exhale: { C: Exhale, tint: WARM, vig: 0.7 },
  kid_watch: { C: KidWatch, tint: WARM },
  tally1: { C: Tally1, tint: WARM },
  mont_tally: { C: MontTally, tint: WARM },
  mont_park: { C: MontPark, tint: WARM },
  mont_gym: { C: MontGym, tint: GYM },
  wedding: { C: Wedding, tint: "rgba(120,140,220,0.3)", vig: 0.7 },
  button: { C: ButtonScene, tint: WARM },
  q_durant: { C: QDurant, vig: 0 },
  debit_again: { C: DebitAgain, tint: GYM },
  friend_gym: { C: FriendGym, tint: GYM },
  he_one: { C: HeOne, tint: GYM },
  friend_what: { C: FriendWhat, tint: GYM },
  he_rest: { C: HeRest, tint: GYM },
  nye_again: { C: NyeAgain, tint: "rgba(255,170,220,0.2)" },
  note_wall: { C: NoteWallFinal, tint: WARM, vig: 0.6 },
  end_card: { C: EndCard, vig: 0 },
};

export const SMShell: React.FC<{ id: string }> = ({ id }) => {
  const sc = SM_SCENES[id];
  const C = sc.C;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <C />
      <Finish tint={sc.tint} vignette={sc.vig ?? 0.55} />
    </AbsoluteFill>
  );
};

