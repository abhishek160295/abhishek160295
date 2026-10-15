import React from "react";
import { AbsoluteFill } from "remotion";
import { Arm, Character, Expr, Pose } from "./Character";
import { Cam, Finish, H, HAND, Particles, Rain, Svg, W, lerp, useT, Glow } from "./lib";
import { Calendar, Caption, Inner, PhoneScene, Quote, Watch } from "./ui";
import { Bedroom, DoorMat, Full, Hill, Kitchen, Paper, Park, Shoe, ShoulderFG, Store, StoreWindow, Street, WindowRoom } from "./sets";

const Box: React.FC<{ x: number; y: number; s?: number; open?: boolean }> = ({ x, y, s = 1, open }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-80} y={-50} width={160} height={50} fill="#55616d" />
    <path d="M-30,-14 q6,-12 22,-10 l22,8 l-44,0 z" fill="#c8d0d8" />
    {!open && <rect x={-86} y={-62} width={172} height={16} fill="#eef0f2" />}
    {open && [-50, -10, 30].map((cx) => <ellipse key={cx} cx={cx} cy={-52} rx={34} ry={12} fill="#f5f6f8" />)}
  </g>
);

const zoom = (cx: number, cy: number, s: number) => `translate(${960 - cx * s},${560 - cy * s}) scale(${s})`;

/** Close-up on the shopkeeper behind the counter. */
const Keeper: React.FC<{
  expr: Expr;
  pose?: Pose;
  text?: string;
  tight?: boolean;
  fg?: boolean;
  spring?: boolean;
  box?: number;
}> = ({ expr, pose = "counter", text, tight, fg = true, spring, box }) => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Svg>
        <g transform={tight ? zoom(1000, 430, 3.0) : zoom(1000, 470, 2.4)}>
          <Store
            spring={spring}
            top={box !== undefined ? <Box x={lerp(t, box, box + 0.8, 1060, 940)} y={598} s={0.9} /> : null}
          >
            <Character x={1000} y={660} s={0.78} keeper expr={expr} pose={pose} rim="#ffffff" />
          </Store>
        </g>
        {fg && <ShoulderFG x={250} s={1.1} />}
      </Svg>
      {text && <Caption text={text} x={tight ? 960 : 1100} y={110} />}
    </AbsoluteFill>
  );
};

/** Reverse angle on the runner, keeper's shoulder in the foreground. */
const Runner: React.FC<{ expr: Expr; text?: string; spring?: boolean; pose?: Pose; box?: boolean; textX?: number }> = ({
  expr,
  text,
  spring,
  pose = "stand",
  box,
  textX = 960,
}) => (
  <AbsoluteFill>
    <Cam from={[1, 0, 0]} to={[1.05, 0, 10]}>
      <Svg>
        <StoreWindow spring={spring}>
          <Character x={960} y={980} s={1.3} expr={expr} pose={pose} rim={spring ? "#fff3d6" : "#ffffff"} />
          {box && <Box x={960} y={700} s={1.1} />}
        </StoreWindow>
        <ShoulderFG x={1660} keeper s={1.1} />
      </Svg>
    </Cam>
    {text && <Caption text={text} x={textX} y={110} />}
  </AbsoluteFill>
);


/* ───────────────────────── ACT 1 ───────────────────────── */

const QOpen = () => <Quote lines={["The bigger the plan,", "the easier it is to never begin."]} />;

const StoreEnter = () => {
  const t = useT();
  const x = lerp(t, 0, 3.2, -120, 820);
  return (
    <Cam from={[1, 0, 0]} to={[1.05, 0, 10]}>
      <Full>
        <Store>
          <Character x={1000} y={660} s={0.78} keeper pose="counter" expr="neutral" look={-0.6} />
        </Store>
        <Character x={x} y={900} s={1.15} pose={t < 3.2 ? "walk" : "stand"} expr="neutral" />
      </Full>
    </Cam>
  );
};

const StoreWant = () => (
  <AbsoluteFill>
    <Cam from={[1.05, 0, 10]} to={[1.14, -40, 40]}>
      <Full>
        <Store>
          <Character x={1000} y={660} s={0.78} keeper pose="counter" expr="neutral" look={-0.6} />
        </Store>
        <Character x={820} y={900} s={1.15} expr="determined" look={0.6} />
      </Full>
    </Cam>
    <Caption text="I'm going to start running." y={150} />
  </AbsoluteFill>
);

const KeeperBegin = () => <Keeper expr="smile" pose="wave" text="Love that. Most people start with—" />;

const Runner10k = () => <Runner expr="determined" text={"Ten K. Every single day.\nStarting tomorrow."} />;

const KeeperThese = () => <Keeper expr="smile" pose="hold" text="Then you'll need these." box={0.2} />;

const SignReturns = () => (
  <Cam from={[1, 0, 0]} to={[1.08, 0, 0]}>
    <Full>
      <g transform={zoom(1186, 572, 5.2)}>
        <Store>
          <Character x={1000} y={660} s={0.78} keeper pose="counter" expr="neutral" />
        </Store>
      </g>
    </Full>
  </Cam>
);

const KitchenPin = () => {
  const t = useT();
  const o = lerp(t, 0.6, 1.4, 0, 1);
  return (
    <Cam from={[1, 0, 0]} to={[1.07, 30, 0]}>
      <Full>
        <Kitchen
          poster={
            <g opacity={o}>
              <Calendar x={800 + 20 * (1 - o)} y={170} s={0.88} title="10K EVERY DAY" marks={0} kind="x" />
            </g>
          }
        >
          <Character x={520} y={1060} s={1.4} pose={t < 1.4 ? "reach" : "stand"} expr="determined" look={0.8} rim="#e9eef5" />
        </Kitchen>
      </Full>
    </Cam>
  );
};

const DoorShoes = () => {
  const t = useT();
  const k = lerp(t, 0.2, 1.4, 0, 1);
  const back = lerp(t, 1.6, 2.4, 0, 1);
  const sy = lerp(k, 0, 1, 560, 900);
  return (
    <Full>
      <DoorMat>
        <Shoe x={830} y={sy} s={1.3} c="#5f86ad" tag />
        <Shoe x={1120} y={sy + 20} s={1.3} c="#5f86ad" />
        <Arm from={[1700, -200]} to={[lerp(back, 0, 1, 1180, 1500), lerp(back, 0, 1, sy - 140, -100)]} w={70} kind="grip" />
      </DoorMat>
    </Full>
  );
};

/* ───────────────────────── ACT 2 ───────────────────────── */

const Phone = (p: React.ComponentProps<typeof PhoneScene>) => () => {
  const t = useT();
  return <PhoneScene {...p} dark={p.dark ?? lerp(t, 0, 0.5, 0.6, 0)} />;
};

const PhoneMon = Phone({ date: "Mon, Sep 22", label: "RUN 10K", press: 2.6 });
const PhoneTue = Phone({ date: "Tue, Sep 23", label: "RUN 10K", press: 1.7, excuses: [{ text: "Too dark out.", at: 0.3 }] });
const PhoneWed = Phone({ date: "Wed, Sep 24", label: "RUN 10K", press: 1.7, excuses: [{ text: "Legs feel heavy.", at: 0.3 }] });
const PhoneThu = Phone({ date: "Thu, Sep 25", label: "RUN 10K", press: 1.7, excuses: [{ text: "Long day yesterday.", at: 0.3 }] });
const PhoneOct14 = Phone({ date: "Tue, Oct 14", label: "RUN 10K", press: 1.4, excuses: [{ text: "Freezing.", at: 0.2 }], fadeExcuses: 0.45 });
const PhoneOct19 = Phone({ date: "Sun, Oct 19", label: "RUN 10K", press: 1.4, excuses: [{ text: "It's Sunday.", at: 0.2 }], fadeExcuses: 0.3 });

const BedTomorrow = () => (
  <AbsoluteFill>
    <Cam from={[1.1, 0, 0]} to={[1, 0, 0]}>
      <Full>
        <Bedroom expr="sleep" light={0.15} />
      </Full>
    </Cam>
    <Inner text="Tomorrow." x={1130} y={110} at={0.6} size={64} />
  </AbsoluteFill>
);

const KitchenWeekend = () => (
  <AbsoluteFill>
    <Cam from={[1, 0, 0]} to={[1.06, 40, 0]}>
      <Full>
        <Kitchen night poster={<Calendar x={800} y={170} s={0.88} title="10K EVERY DAY" marks={5} kind="x" />}>
          <Character x={560} y={1080} s={1.5} expr="back" rim="#8fa3c4" />
        </Kitchen>
      </Full>
    </Cam>
    <Inner text="Big weekend." x={420} y={260} at={0.5} />
  </AbsoluteFill>
);

const CalXs = () => {
  const t = useT();
  const s = 1.3,
    cx0 = 960 - 280 * s,
    cy0 = 560 - 360 * s;
  const i = Math.min(27, Math.floor((t - 0.3) * 4 + 5));
  const c = i % 7,
    r = Math.floor(i / 7);
  const px = cx0 + s * (40 + c * 70 + 54),
    py = cy0 + s * (130 + r * 140 + 116);
  return (
    <Full bg="#3f444c">
      <rect width={W} height={H} fill="#454a52" />
      <Calendar x={cx0} y={cy0} s={s} title="10K EVERY DAY" marks={20} kind="x" markStart={-1} markRate={4} />
      {t < 4 && <Arm from={[2100, 1300]} to={[px + 10, py + 10]} w={66} kind="grip" />}
    </Full>
  );
};

const CalFull = () => (
  <Cam from={[1.15, 60, 40]} to={[1.35, -60, -40]}>
    <Full bg="#3f444c">
      <rect width={W} height={H} fill="#454a52" />
      <Calendar x={680} y={180} s={1} title="10K EVERY DAY" marks={28} kind="x" />
    </Full>
  </Cam>
);

const Crumple = () => {
  const t = useT();
  const c = lerp(t, 0.6, 2.2, 0, 1);
  const gap = lerp(c, 0, 1, 360, 70);
  return (
    <Full>
      <Kitchen night poster={<Calendar x={800 + c * 200} y={170 + c * 260} s={0.88} title="10K EVERY DAY" marks={28} kind="x" crumple={c} />} />
      <Arm from={[300, 1300]} to={[1046 - gap, 520 + c * 60]} w={80} kind="open" />
      <Arm from={[1700, 1300]} to={[1046 + gap, 520 + c * 60]} w={80} kind="open" />
    </Full>
  );
};

const WindowSlump = () => (
  <AbsoluteFill>
    <Cam from={[1, 0, 0]} to={[1.12, 0, -30]}>
      <Full>
        <WindowRoom>
          <Character x={940} y={930} s={0.95} pose="sit" expr="sad" headDrop={8} rim="#9fb2c7" />
          <Shoe x={1280} y={930} s={0.55} c="#5f86ad" tag />
          <Shoe x={1360} y={945} s={0.55} c="#5f86ad" />
          <g transform="translate(1560,990)">
            <circle r={34} fill="#e8e6e0" />
            <path d="M-20,-10 l18,14 l14,-20 M-24,10 l30,-4" stroke="#c9372f" strokeWidth={4} />
          </g>
        </WindowRoom>
      </Full>
    </Cam>
    <Particles n={14} colors={["#d99a45", "#c47c32", "#e6b05c"]} size={[8, 12]} speed={90} area={[440, 60, 1040, 720]} />
    <Caption text="Maybe I'm just not built for this." y={150} at={2.2} />
  </AbsoluteFill>
);

/* ───────────────────────── ACT 3 ───────────────────────── */

const BoxShoes = () => {
  const t = useT();
  const k = lerp(t, 1.0, 2.0, 0, 1);
  return (
    <Full>
      <rect width={W} height={H} fill="#5a5f66" />
      <rect y={760} width={W} height={320} fill="#7b8088" />
      <g transform="translate(960,860) scale(4)">
        <rect x={-80} y={-50} width={160} height={50} fill="#55616d" />
        <path d="M-30,-14 q6,-12 22,-10 l22,8 l-44,0 z" fill="#c8d0d8" />
        {[-50, -10, 30].map((cx) => (
          <ellipse key={cx} cx={cx} cy={-52} rx={34} ry={12} fill="#f5f6f8" />
        ))}
        <rect x={-86} y={lerp(k, 0, 1, -200, -62)} width={172} height={16} fill="#eef0f2" opacity={k > 0 ? 1 : 0} />
      </g>
      <Arm from={[1300, -300]} to={[lerp(k, 0, 1, 1200, 1090), lerp(k, 0, 1, 150, 610) - lerp(t, 2.2, 3, 0, 700)]} w={80} kind="open" rot={100} />
    </Full>
  );
};

const StoreReturn = () => (
  <Cam from={[1, 0, 0]} to={[1.08, 0, 20]}>
    <Full>
      <Store dim={0.12} top={<Box x={900} y={598} s={0.9} />}>
        <Character x={1000} y={660} s={0.78} keeper pose="counter" expr="neutral" look={-0.5} />
      </Store>
      <Character x={820} y={900} s={1.15} pose="reach" expr="sad" />
    </Full>
  </Cam>
);

const SoleBarcode = () => {
  const t = useT();
  const r = lerp(t, 0, 1.2, 20, 0);
  return (
    <Full>
      <defs>
        <filter id="bgb">
          <feGaussianBlur stdDeviation={14} />
        </filter>
      </defs>
      <g filter="url(#bgb)">
        <g transform={zoom(1100, 500, 2.4)}>
          <Store dim={0.1} />
        </g>
      </g>
      <g transform={`translate(900,500) rotate(${-12 + r})`}>
        <path d="M-330,0 Q-340,-120 -200,-130 L240,-110 Q360,-90 350,0 Q360,90 240,110 L-200,130 Q-340,120 -330,0 Z" fill="#e9ecef" />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M${-260 + i * 46},-80 l20,40 l-20,40 l20,40`} stroke="#c7cdd3" strokeWidth={8} fill="none" />
        ))}
        <rect x={-60} y={-50} width={180} height={100} fill="#ffffff" stroke="#9aa1a9" strokeWidth={2} />
        {Array.from({ length: 26 }).map((_, i) => (
          <rect key={i} x={-48 + i * 6} y={-38} width={i % 3 ? 2 : 4} height={64} fill="#1b1d21" />
        ))}
      </g>
      <Arm from={[1700, 1300]} to={[1250, 560]} w={86} kind="grip" />
    </Full>
  );
};

const KeeperSorry = () => <Keeper expr="worried" text={"Sorry, it's been a month.\nI can't take them back."} />;
const KeeperWhat = () => <Keeper expr="sad" tight fg={false} text={"Whatever happened to\nten K a day?"} />;
const RunnerDoor = () => <Runner expr="sad" text={"I never even made it\nout the door."} />;
const KeeperHardest = () => <Keeper expr="neutral" text={"That's the part\nnobody trains for."} />;
const KeeperOne = () => <Keeper expr="smile" pose="wave" text={"So skip the ten K.\nCan you run one minute?"} />;
const RunnerNothing = () => <Runner expr="worried" text={"One minute?\nThat's nothing."} />;
const KeeperExactly = () => <Keeper expr="smile" tight fg={false} text={"Exactly. Nothing is\neasy to start."} />;
const RunnerTake = () => <Runner expr="smile" pose="hold" box text={"Come back and tell me\nhow it goes."} textX={1220} />;

const FridgeBlank = () => {
  const t = useT();
  const k = lerp(t, 0.2, 1.4, 0, 1);
  return (
    <Cam from={[1.25, 0, 0]} to={[1.3, 0, 0]}>
      <Full>
        <Kitchen night poster={<g opacity={k}><Paper x={870} y={180 + (1 - k) * 40} /></g>} />
        <Arm from={[300, 1400]} to={[860, 300 + (1 - k) * 60]} w={80} kind="open" rot={-80} />
        <Arm from={[1800, 1400]} to={[1290, 300 + (1 - k) * 60]} w={80} kind="open" rot={-100} />
      </Full>
    </Cam>
  );
};

const FridgeWrite = () => {
  const t = useT();
  const d = lerp(t, 0.4, 3.4, 0, 1);
  const px = 870 + 60 + d * 320;
  const py = 180 + 280 + Math.sin(t * 9) * 80;
  return (
    <Cam from={[1.3, 0, 0]} to={[1.42, 0, 0]}>
      <Full>
        <Kitchen night poster={<Paper x={870} y={180} text="1 MIN" draw={d} />} />
        {t < 3.6 && <Arm from={[1900, 1300]} to={[px + 40, py + 30]} w={78} kind="grip" />}
      </Full>
    </Cam>
  );
};

const RunnerNight = () => (
  <Cam from={[1, 0, 0]} to={[1.08, 0, -20]}>
    <Full>
      <rect width={W} height={H} fill="#1b1f27" />
      <rect x={360} y={100} width={1200} height={620} fill="#2d3646" />
      <Glow cx={960} cy={300} r={700} color="#8aa4d6" o={0.25} id="rnG" />
      <rect x={0} y={720} width={W} height={360} fill="#121419" />
      <Character x={960} y={1380} s={2.5} expr="determined" rim="#9db4dc" />
    </Full>
  </Cam>
);

/* ───────────────────────── ACT 4 ───────────────────────── */

const PhoneOct21 = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <PhoneScene
        date="Tue, Oct 21"
        label="RUN 1 MIN"
        excuses={[{ text: "Maybe tomorrow?", at: 0.5 }]}
        hover={[1.1, 3.9]}
        press={5.3}
        pressBtn="stop"
        fadeExcuses={lerp(t, 3.0, 3.6, 1, 0.25)}
        dark={lerp(t, 0, 0.5, 0.6, 0)}
      />
      <Caption text="It's one minute." x={520} y={560} at={3.2} />
    </AbsoluteFill>
  );
};

const ShoesOn = () => {
  const t = useT();
  const up = lerp(t, 1.6, 2.6, 0, 1);
  return (
    <Full>
      <DoorMat night>
        <Shoe x={830} y={900 - up * 700} s={1.3} c="#5f86ad" />
        <Shoe x={1120} y={920 - lerp(t, 1.9, 2.9, 0, 1) * 700} s={1.3} c="#5f86ad" />
        <g transform="translate(1420,960) rotate(30)">
          <rect x={-16} y={-10} width={34} height={22} rx={3} fill="#f6f6f2" />
        </g>
      </DoorMat>
    </Full>
  );
};

const BlurStreet: React.FC<{ mode: "night" | "dusk" }> = ({ mode }) => (
  <>
    <defs>
      <filter id="sbl">
        <feGaussianBlur stdDeviation={16} />
      </filter>
    </defs>
    <g filter="url(#sbl)">
      <Street mode={mode} speed={0.3} />
    </g>
  </>
);

const WatchTimer = () => (
  <Full>
    <BlurStreet mode="night" />
    <Watch mode="timer" />
  </Full>
);

const Runner2: React.FC<{ x?: number; y?: number; s?: number; rim?: string; raincoat?: boolean; speed?: number; expr?: Expr }> = ({
  x = 820,
  y = 960,
  s = 0.9,
  rim = "#ffc46b",
  raincoat,
  speed = 1,
  expr = "determined",
}) => <Character x={x} y={y} s={s} pose="run" expr={expr} rim={rim} raincoat={raincoat} speed={speed} watch />;

const NightRun = () => (
  <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
    <Full>
      <Street mode="night">
        <Runner2 />
      </Street>
    </Full>
  </Cam>
);

const NightOkay = () => (
  <AbsoluteFill>
    <Cam from={[1.25, -100, -180]} to={[1.3, -100, -200]}>
      <Full>
        <Street mode="night" speed={0.7}>
          <Runner2 speed={0.8} expr="worried" />
        </Street>
      </Full>
    </Cam>
    <Caption text="Okay. One minute." y={160} at={0.4} until={2.6} />
    <Caption text="...maybe one more." y={160} at={3.0} />
  </AbsoluteFill>
);

const NightAerial = () => (
  <Cam from={[1.4, -200, -380]} to={[1, 0, 0]}>
    <Full>
      <Street mode="night">
        <Runner2 s={0.55} y={930} x={900} />
      </Street>
    </Full>
  </Cam>
);

const QEpictetus = () => (
  <Quote lines={["No great thing is created suddenly,", "any more than a bunch of grapes or a fig."]} by="Epictetus" />
);

const BedWake = () => (
  <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
    <Full>
      <Bedroom expr="stretch" light={0.7} />
    </Full>
  </Cam>
);

const WatchStats = () => (
  <Full>
    <BlurStreet mode="dusk" />
    <Watch mode="stats" />
  </Full>
);

const RunDusk = () => (
  <Full>
    <Street mode="dusk">
      <Runner2 rim="#ffb27a" />
    </Street>
  </Full>
);

const RunAutumn = () => (
  <AbsoluteFill>
    <Full>
      <Park season="autumn">
        <Runner2 y={900} rim="#ffd29a" />
      </Park>
    </Full>
    <Particles n={30} colors={["#e8a03a", "#d9822b", "#f2bc4f"]} speed={110} drift={-120} />
  </AbsoluteFill>
);

const RunWinter = () => (
  <AbsoluteFill>
    <Full>
      <Park season="winter">
        <Runner2 y={900} rim="#dfe8f5" />
      </Park>
    </Full>
    <Particles n={90} colors={["#ffffff"]} size={[10, 18]} speed={70} kind="dust" />
  </AbsoluteFill>
);

const KitchenLook = () => (
  <Cam from={[1, 0, 0]} to={[1.06, 40, 0]}>
    <Full>
      <Kitchen morning poster={<Paper x={870} y={180} text="1 MIN" draw={1} />}>
        <Character x={520} y={1060} s={1.4} expr="smile" look={0.8} rim="#ffe2b8" />
      </Kitchen>
    </Full>
  </Cam>
);

const TYPE: [string, number][] = [
  ["10K", 0],
  ["10", 0.9],
  ["1", 1.05],
  ["", 1.2],
  ["5", 1.8],
  ["5 ", 1.95],
  ["5 M", 2.1],
  ["5 MI", 2.25],
  ["5 MIN", 2.4],
  ["5 MI", 4.6],
  ["5 M", 4.72],
  ["5 ", 4.84],
  ["5", 4.96],
  ["", 5.08],
  ["1", 5.5],
  ["1 ", 5.65],
  ["1 M", 5.8],
  ["1 MI", 5.95],
  ["1 MIN", 6.1],
];

const LaptopType = () => {
  const t = useT();
  let pre = "10K";
  for (const [s, at] of TYPE) if (t >= at) pre = s;
  const caret = Math.floor(t * 2.5) % 2 === 0;
  const cool = ["#6fa392", "#5a7fa8", "#9b9cb2", "#6aa0a8", "#79a98b", "#8f93ad", "#5d7ea3"];
  const hot = ["#e3a256", "#e48a5a", "#e6b45e", "#d98a63", "#e7a35a", "#de9459", "#e9b866"];
  const warm = t > 6.3;
  return (
    <AbsoluteFill>
      <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
        <Full bg="#0c0d10">
          <Glow cx={960} cy={540} r={900} color="#9fb4d8" o={0.25} id="lpG" />
          <rect x={250} y={90} width={1420} height={860} rx={24} fill="#1c1f25" />
          <rect x={280} y={120} width={1360} height={800} rx={10} fill="#f4f5f7" />
          <rect x={280} y={120} width={1360} height={56} rx={10} fill="#e3e6ea" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={316 + i * 30} cy={148} r={9} fill={["#ff6058", "#ffbd2e", "#28c940"][i]} />
          ))}
          <text x={960} y={300} textAnchor="end" fontFamily="Inter, Helvetica, Arial" fontWeight={800} fontSize={76} fill="#30343a">
            {pre}
          </text>
          {caret && <rect x={964} y={236} width={5} height={78} fill="#2f6fde" />}
          <text x={985} y={300} fontFamily="Inter, Helvetica, Arial" fontWeight={800} fontSize={76} fill="#30343a">
            EVERY DAY
          </text>
          <line x1={520} y1={340} x2={1400} y2={340} stroke="#30343a" strokeWidth={5} />
          {Array.from({ length: 28 }).map((_, i) => {
            const c = i % 7,
              r = Math.floor(i / 7);
            return (
              <rect key={i} x={520 + c * 128} y={380 + r * 130} width={112} height={112} rx={8} fill={(warm ? hot : cool)[(i * 3 + r) % 7]} />
            );
          })}
          <rect x={1460} y={850} width={150} height={50} rx={25} fill={t > 6.5 ? "#2f6fde" : "#c9d2e0"} />
          <text x={1535} y={884} textAnchor="middle" fontFamily="Inter, Arial" fontSize={26} fill="#fff" fontWeight={700}>
            Print
          </text>
        </Full>
      </Cam>
      <Caption text="Not five. One." y={1000} at={2.9} until={4.5} size={52} />
    </AbsoluteFill>
  );
};

const PinNew = () => {
  const t = useT();
  const k = lerp(t, 0.3, 1.4, 0, 1);
  const back = lerp(t, 2, 3, 0, 1);
  return (
    <Cam from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <Full>
        <Kitchen
          morning
          poster={
            <>
              <Paper x={870} y={180} text="1 MIN" draw={1} />
              <g opacity={k}>
                <Calendar x={150} y={200 + (1 - k) * 30} s={0.85} title="1 MIN EVERY DAY" marks={0} kind="check" warm />
              </g>
            </>
          }
        />
        <Arm from={[-200, 1400]} to={[150 - back * 400, 400 + back * 900]} w={80} kind="open" rot={-60} />
        <Arm from={[900, 1400]} to={[640 + back * 400, 400 + back * 900]} w={80} kind="open" rot={-120} />
      </Full>
    </Cam>
  );
};

const QClear = () => <Quote lines={["The point is to master", "the habit of showing up."]} by="James Clear" />;

/* ───────────────────────── ACT 5 ───────────────────────── */

const BedRain = () => (
  <AbsoluteFill>
    <Full>
      <Bedroom expr="awake" light={0.08} />
    </Full>
    <Rain n={90} o={0.2} />
  </AbsoluteFill>
);

const PhoneNov22 = () => {
  const t = useT();
  return (
    <PhoneScene
      date="Sat, Nov 22"
      label="RUN 1 MIN"
      excuses={[
        { text: "Pouring rain.", at: 0.3, size: 60 },
        { text: "Too cold.", at: 1.1, size: 76 },
        { text: "Tomorrow.", at: 1.9, size: 96 },
      ]}
      hover={[2.4, 4.3]}
      press={5.2}
      pressBtn="stop"
      fadeExcuses={lerp(t, 4.0, 4.6, 1, 0.2)}
      dark={lerp(t, 0, 0.4, 0.6, 0)}
    />
  );
};

const PosterGlance = () => (
  <AbsoluteFill>
    <Cam from={[1.1, 0, 0]} to={[1.45, -260, 120]}>
      <Full>
        <Kitchen
          night
          poster={
            <>
              <Paper x={870} y={180} text="1 MIN" draw={1} />
              <Calendar x={150} y={200} s={0.85} title="1 MIN EVERY DAY" marks={18} kind="check" warm />
            </>
          }
        />
        <Glow cx={1080} cy={450} r={400} color="#ffd59a" o={0.2} id="pgG" />
      </Full>
    </Cam>
    <Rain n={60} o={0.12} />
  </AbsoluteFill>
);

const RainRun = () => (
  <AbsoluteFill>
    <Cam from={[1, 0, 0]} to={[1.06, 0, 0]}>
      <Full>
        <Street mode="rain">
          <Runner2 raincoat rim="#ffd56b" />
        </Street>
      </Full>
    </Cam>
    <Rain />
  </AbsoluteFill>
);

const RainClose = () => (
  <AbsoluteFill>
    <Full>
      <defs>
        <filter id="rcb">
          <feGaussianBlur stdDeviation={18} />
        </filter>
      </defs>
      <g filter="url(#rcb)">
        <Street mode="rain" speed={0.4} />
      </g>
      <Character x={900} y={1500} s={2.3} pose="run" speed={0.5} raincoat expr="smile" rim="#ffd56b" />
    </Full>
    <Rain n={160} o={0.5} />
  </AbsoluteFill>
);

const CalChecks = () => {
  const t = useT();
  const sweep = lerp(t, 0, 6, -600, 2400);
  return (
    <AbsoluteFill>
      <Cam from={[1, 0, 0]} to={[1.08, 0, 0]}>
        <Full bg="#e4ddd0">
          <rect width={W} height={H} fill="#d8d2c6" />
          <Calendar x={960 - 280 * 1.3} y={560 - 360 * 1.3} s={1.3} title="1 MIN EVERY DAY" marks={28} kind="check" warm markStart={0.3} markRate={5.5} />
          <path d={`M${sweep},0 L${sweep + 300},0 L${sweep - 200},${H} L${sweep - 500},${H} Z`} fill="#fff6dc" opacity={0.25} />
        </Full>
      </Cam>
    </AbsoluteFill>
  );
};

const pathPt = (u: number) => {
  const segs: [number, number][][] = [
    [
      [500, 1080],
      [560, 900],
      [780, 860],
    ],
    [
      [780, 860],
      [1000, 820],
      [900, 700],
    ],
    [
      [900, 700],
      [820, 600],
      [1040, 520],
    ],
    [
      [1040, 520],
      [1200, 470],
      [1250, 400],
    ],
  ];
  const v = Math.min(0.999, Math.max(0, u)) * segs.length;
  const i = Math.floor(v),
    k = v - i;
  const [a, b, c] = segs[i];
  const x = (1 - k) * (1 - k) * a[0] + 2 * (1 - k) * k * b[0] + k * k * c[0];
  const y = (1 - k) * (1 - k) * a[1] + 2 * (1 - k) * k * b[1] + k * k * c[1];
  return { x, y, dir: (c[0] - a[0] >= 0 ? 1 : -1) as 1 | -1 };
};

const HillRun = () => {
  const t = useT();
  const u = lerp(t, 0, 6, 0.12, 0.9, (x) => x);
  const p = pathPt(u);
  const s = lerp(u, 0, 1, 0.5, 0.16, (x) => x);
  return (
    <Cam from={[1, 0, 0]} to={[1.05, 0, 0]}>
      <Full>
        <Hill>
          <Character x={p.x} y={p.y} s={s} pose="run" dir={p.dir} expr="happy" rim="#fff5d6" />
        </Hill>
      </Full>
    </Cam>
  );
};

const HillVista = () => (
  <Cam from={[1, 0, 0]} to={[1.1, 0, -20]}>
    <Full>
      <Hill vista>
        <Character x={720} y={960} s={0.75} expr="back" rim="#fff5d6" />
      </Hill>
    </Full>
  </Cam>
);

/* ───────────────────────── ACT 6 ───────────────────────── */

const StoreBack = () => {
  const t = useT();
  const x = lerp(t, 0, 2.0, -120, 820);
  return (
    <AbsoluteFill>
      <Cam from={[1, 0, 0]} to={[1.06, 0, 10]}>
        <Full>
          <Store spring>
            <Character x={1000} y={660} s={0.78} keeper pose="counter" expr={t > 2 ? "smile" : "neutral"} look={-0.6} />
          </Store>
          <Character x={x} y={900} s={1.15} pose={t < 2 ? "walk" : "stand"} expr="smile" rim="#fff3d6" />
        </Full>
      </Cam>
      <Caption text={"Hey. It's been a while.\nThese are done."} y={150} at={2.1} />
    </AbsoluteFill>
  );
};

const WornShoes = () => (
  <Cam from={[1, 0, 0]} to={[1.08, 0, 0]}>
    <Full>
      <defs>
        <filter id="wsb">
          <feGaussianBlur stdDeviation={14} />
        </filter>
      </defs>
      <g filter="url(#wsb)">
        <g transform={zoom(1000, 450, 2.2)}>
          <Store spring>
            <Character x={1000} y={660} s={0.78} keeper pose="counter" expr="smile" />
          </Store>
        </g>
      </g>
      <rect y={760} width={W} height={320} fill="#f1f2f3" />
      <Shoe x={760} y={860} s={1.5} c="#6d8197" worn />
      <Shoe x={1180} y={880} s={1.5} c="#6d8197" worn dir={-1} />
    </Full>
  </Cam>
);

const Keeper10k = () => <Keeper expr="smile" spring text="So... ten K every day?" />;
const RunnerNope = () => <Runner expr="smile" spring text="Nope. One minute every day." />;
const RunnerRest = () => <Runner expr="happy" spring text={"Everything after that\nis a bonus."} />;
const KeeperSmile = () => <Keeper expr="happy" pose="hold" spring box={0.4} text="Then you'll need these." />;

const EndCard = () => <Quote big lines={["1 MINUTE"]} sub="Start small. Keep showing up." />;

export const SCENES: Record<string, { C: React.FC; tint?: string; vig?: number }> = {
  q_open: { C: QOpen, vig: 0 },
  store_enter: { C: StoreEnter, tint: "rgba(120,150,190,0.35)" },
  store_want: { C: StoreWant, tint: "rgba(120,150,190,0.35)" },
  keeper_begin: { C: KeeperBegin, tint: "rgba(120,150,190,0.3)" },
  runner_10k: { C: Runner10k, tint: "rgba(120,150,190,0.3)" },
  keeper_these: { C: KeeperThese, tint: "rgba(120,150,190,0.3)" },
  sign_returns: { C: SignReturns, tint: "rgba(120,150,190,0.3)" },
  kitchen_pin: { C: KitchenPin, tint: "rgba(255,190,120,0.25)" },
  door_shoes: { C: DoorShoes, tint: "rgba(255,180,110,0.25)" },
  phone_mon: { C: PhoneMon },
  bed_tomorrow: { C: BedTomorrow },
  phone_tue: { C: PhoneTue },
  phone_wed: { C: PhoneWed },
  phone_thu: { C: PhoneThu },
  kitchen_weekend: { C: KitchenWeekend, tint: "rgba(80,110,170,0.4)" },
  cal_xs: { C: CalXs, tint: "rgba(80,110,170,0.3)" },
  phone_oct14: { C: PhoneOct14 },
  phone_oct19: { C: PhoneOct19 },
  cal_full: { C: CalFull, tint: "rgba(80,110,170,0.4)" },
  crumple: { C: Crumple, tint: "rgba(80,110,170,0.4)" },
  window_slump: { C: WindowSlump, tint: "rgba(80,110,170,0.45)", vig: 0.7 },
  box_shoes: { C: BoxShoes, tint: "rgba(80,110,170,0.4)" },
  store_return: { C: StoreReturn, tint: "rgba(80,110,170,0.35)" },
  sole_barcode: { C: SoleBarcode, tint: "rgba(80,110,170,0.35)" },
  keeper_sorry: { C: KeeperSorry, tint: "rgba(80,110,170,0.35)" },
  keeper_what: { C: KeeperWhat, tint: "rgba(80,110,170,0.35)" },
  runner_door: { C: RunnerDoor, tint: "rgba(80,110,170,0.35)" },
  keeper_hardest: { C: KeeperHardest, tint: "rgba(150,160,190,0.3)" },
  keeper_one: { C: KeeperOne, tint: "rgba(255,200,140,0.2)" },
  runner_nothing: { C: RunnerNothing, tint: "rgba(255,200,140,0.2)" },
  keeper_exactly: { C: KeeperExactly, tint: "rgba(255,200,140,0.25)" },
  runner_take: { C: RunnerTake, tint: "rgba(255,200,140,0.25)" },
  fridge_blank: { C: FridgeBlank, tint: "rgba(90,120,180,0.35)" },
  fridge_write: { C: FridgeWrite, tint: "rgba(90,120,180,0.3)" },
  runner_night: { C: RunnerNight, vig: 0.75 },
  phone_oct21: { C: PhoneOct21 },
  shoes_on: { C: ShoesOn, vig: 0.7 },
  watch_timer: { C: WatchTimer },
  night_run: { C: NightRun },
  night_okay: { C: NightOkay },
  night_aerial: { C: NightAerial },
  q_epictetus: { C: QEpictetus, vig: 0 },
  bed_wake: { C: BedWake, tint: "rgba(255,200,130,0.35)" },
  watch_stats: { C: WatchStats },
  run_dusk: { C: RunDusk, tint: "rgba(255,170,120,0.2)" },
  run_autumn: { C: RunAutumn, tint: "rgba(255,180,100,0.25)" },
  run_winter: { C: RunWinter, tint: "rgba(150,180,220,0.3)" },
  kitchen_look: { C: KitchenLook, tint: "rgba(255,200,130,0.3)" },
  laptop_type: { C: LaptopType },
  pin_new: { C: PinNew, tint: "rgba(255,200,130,0.3)" },
  q_clear: { C: QClear, vig: 0 },
  bed_rain: { C: BedRain, vig: 0.75 },
  phone_nov22: { C: PhoneNov22 },
  poster_glance: { C: PosterGlance, tint: "rgba(80,110,170,0.3)" },
  rain_run: { C: RainRun },
  rain_close: { C: RainClose },
  cal_checks: { C: CalChecks, tint: "rgba(255,210,150,0.3)" },
  hill_run: { C: HillRun, tint: "rgba(255,230,170,0.2)", vig: 0.35 },
  hill_vista: { C: HillVista, tint: "rgba(255,230,170,0.25)", vig: 0.35 },
  store_back: { C: StoreBack, tint: "rgba(255,220,160,0.3)" },
  worn_shoes: { C: WornShoes, tint: "rgba(255,220,160,0.3)" },
  keeper_10k: { C: Keeper10k, tint: "rgba(255,220,160,0.3)" },
  runner_nope: { C: RunnerNope, tint: "rgba(255,220,160,0.3)" },
  runner_rest: { C: RunnerRest, tint: "rgba(255,220,160,0.3)" },
  keeper_smile: { C: KeeperSmile, tint: "rgba(255,220,160,0.3)" },
  end_card: { C: EndCard, vig: 0 },
};

export const SceneShell: React.FC<{ id: string }> = ({ id }) => {
  const sc = SCENES[id];
  const C = sc.C;
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: HAND }}>
      <C />
      <Finish tint={sc.tint} vignette={sc.vig ?? 0.55} />
    </AbsoluteFill>
  );
};
