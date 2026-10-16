import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { at, ALL_WORDS, f as fr, FPS, secEnd, secStart, TOTAL_FRAMES } from './timing';
import * as K from './cards';
import * as S from './scenes';

const { C, Txt, Stamp, BigSay, Paper, Gauge } = K;

type Shot = { t: number; el: (k: (t: number) => number) => React.ReactNode; noCap?: boolean; chip?: [number, string] };

const P = (sec: number, phrase: string, nth = 1) => at(sec, phrase, nth);

/* small bespoke cards */
const ForceCard: React.FC<{ backAt: number; fwdAt: number }> = ({ backAt, fwdAt }) => {
  const a = K.usePop(backAt);
  const b = K.usePop(fwdAt);
  return (
    <Paper>
      <svg style={{ position: 'absolute', left: 360, top: 200 }} width={1200} height={700}>
        <rect x={0} y={520} width={1200} height={40} fill={C.grey} />
        <path d="M420 330 Q420 260 520 260 L700 300 Q790 330 780 420 L780 500 L420 500 Z" fill={C.red} stroke={C.navy} strokeWidth={10} />
        <rect x={400} y={500} width={400} height={30} rx={12} fill="#fff" stroke={C.navy} strokeWidth={8} />
        <g opacity={a} transform={`translate(${410 - a * 30},580)`}>
          <line x1={0} y1={0} x2={-360} y2={0} stroke={C.red} strokeWidth={22} />
          <path d="M-360 -36 L-430 0 L-360 36 Z" fill={C.red} />
          <text x={-160} y={80} textAnchor="middle" fontFamily={K.FONT} fontWeight={900} fontSize={48} fill={C.red}>your foot pushes back</text>
        </g>
        <g opacity={b} transform={`translate(${800 + b * 30},440)`}>
          <line x1={0} y1={0} x2={360} y2={0} stroke={C.green} strokeWidth={22} />
          <path d="M360 -36 L430 0 L360 36 Z" fill={C.green} />
          <text x={200} y={-55} textAnchor="middle" fontFamily={K.FONT} fontWeight={900} fontSize={48} fill={C.green}>ground pushes you forward</text>
        </g>
      </svg>
    </Paper>
  );
};

const MiniGauge: React.FC<{ v: number; at?: number }> = ({ v, at: a = 0 }) => {
  const p = K.usePop(a);
  return (
    <div style={{ position: 'absolute', right: 40, bottom: 160, transform: `scale(${p * 0.55})`, transformOrigin: 'bottom right', width: 700, height: 700 }}>
      <Gauge x={350} y={350} keys={[[a, 0], [a + 20, v]]} max={300} />
    </div>
  );
};

const Altimeter: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const h = interpolate(f, [from, from + 45], [0, 290], { extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) ** 2 });
  return (
    <div style={{ position: 'absolute', right: 80, top: 120, fontFamily: K.FONT, fontWeight: 900, fontSize: 120, color: '#fff', WebkitTextStroke: `12px ${C.navy}`, paintOrder: 'stroke fill' }}>
      ↑ {Math.round(h)} m
    </div>
  );
};

const Over: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill>{children}</AbsoluteFill>;

/* ------------------------------------------------------------------ */
export const SHOTS: Shot[] = [
  // S1 cold open
  { t: 0, el: (k) => <S.BusMiss smugAt={k(P(1, 'Not a problem'))} /> },
  {
    t: P(1, 'because as of'),
    el: (k) => <BigSay tint={C.yellow} lines={[{ t: 'As of this morning…', at: 0, size: 90 }, { t: 'MAX IS 50× FASTER', at: k(P(1, '50')), size: 150 }]} />,
    noCap: true,
  },
  { t: P(1, 'which raises'), el: () => <S.SpinFeet env="street" /> },
  {
    t: P(1, 'why does his commute'),
    el: (k) => (
      <BigSay lines={[{ t: 'YOUR commute: 1 hour 🚶', at: 0, size: 96 }, { t: "MAX'S commute: 2½ hours?!", at: k(P(1, 'longer')), color: C.red, size: 96 }]} />
    ),
    noCap: true,
  },
  {
    t: P(1, 'We did the maths'),
    el: (k) => (
      <BigSay dark lines={[{ t: 'F = μ·m·g', at: 0, size: 100, color: C.yellow }, { t: 'P = ½·ρ·CdA·v³', at: 6, size: 100 }, { t: 'ΔT = Q ÷ (m·c)', at: 12, size: 100, color: C.orange }]} />
    ),
    noCap: true,
  },
  { t: P(1, 'It is so much worse'), el: () => <S.LyingSteam /> },
  { t: secEnd(1) - 0.05, el: () => <K.TitleCard />, noCap: true },

  // S2 rules
  {
    t: secStart(2) + 0.2,
    el: (k) => (
      <K.Rules
        up={[['Muscles', k(P(2, 'muscles'))], ['Bones', k(P(2, 'bones'))], ['Tendons', k(P(2, 'tendons'))], ['Reflexes', k(P(2, 'reflexes'))]]}
        normal={[['Brain', k(P(2, 'brain'))], ['Stomach', k(P(2, 'stomach'))], ['Skin', k(P(2, 'skin'))], ['Weight', k(P(2, 'weight'))], ['The air 🌬️', k(P(2, 'air'))]]}
        normalAt={k(P(2, 'Everything else'))}
        wobbleAt={k(P(2, 'Keep an eye'))}
      />
    ),
    noCap: true,
  },
  {
    t: P(2, 'Oh and stick around'),
    el: (k) => (
      <Over>
        <K.Eiffel at={0} jumpAt={k(P(2, 'jumps higher'))} />
        <Stamp x={1500} y={300} at={k(P(2, 'once'))} text="ONCE." />
        <Stamp x={300} y={260} at={4} text="COMING UP" color={C.blue} rot={-8} size={60} />
      </Over>
    ),
    noCap: true,
  },

  // S3 on paper
  {
    t: secStart(3),
    el: (k) => (
      <Paper>
        <Gauge x={760} y={560} r={380} max={1400} redFrom={1235} keys={[[0, 0], [k(P(3, 'five kilometers')), 5], [k(P(3, '250')), 250], [k(P(3, '500')), 500], [k(P(3, '1,250')), 1250]]} shake={0} />
        <Txt x={1220} y={250} at={k(P(3, 'normal walk'))} size={70} w={650}>🚶 Walk: 5 → 250</Txt>
        <Txt x={1220} y={420} at={k(P(3, 'light jog'))} size={70} w={650}>🏃 Jog: 500</Txt>
        <Txt x={1220} y={520} at={k(P(3, 'passenger train'))} size={46} w={650} color={C.blue}>faster than any passenger train 🚄</Txt>
        <Txt x={1220} y={660} at={k(P(3, 'proper sprint'))} size={70} w={650} color={C.red}>⚡ Sprint: 1,250</Txt>
      </Paper>
    ),
    noCap: true,
  },
  {
    t: P(3, 'Now the speed of sound'),
    el: (k) => (
      <Paper>
        <Gauge x={760} y={560} r={380} max={1400} redFrom={1235} keys={[[0, 1250]]} shake={3} />
        <Txt x={1220} y={330} at={0} size={64} w={660}>Speed of sound:</Txt>
        <Txt x={1220} y={420} at={6} size={120} w={660} color={C.red}>1,235</Txt>
        <Txt x={1220} y={600} at={k(P(3, 'sound barrier'))} size={64} w={660}>💥 SUPERSONIC!</Txt>
        <Stamp x={960} y={540} at={k(P(3, 'on paper', 2))} text="ON PAPER" size={130} />
      </Paper>
    ),
    noCap: true,
  },

  // S4 the good stuff
  { t: P(4, 'But problems later'), el: (k) => <BigSay tint={C.yellow} lines={[{ t: 'THE GOOD STUFF 🎉', at: k(P(4, 'First')), size: 150 }]} />, noCap: true },
  { t: P(4, 'Washing up'), el: () => <K.TimerDuel title="Washing up" you={900} max={18} at={4} dur={50} />, noCap: true },
  { t: P(4, 'Max', 1) + 0.1, el: () => <S.Chores mode="dishes" /> },
  { t: P(4, 'The whole flat'), el: () => <S.Chores mode="hoover" /> },
  { t: P(4, 'A 10-minute shower'), el: () => <S.Shower /> },
  { t: P(4, 'He can type'), el: () => <S.Typing /> },
  { t: P(4, 'until you remember'), el: () => <BigSay dark lines={[{ t: '🧠 BRAIN:', at: 0, size: 110 }, { t: 'not upgraded', at: 8, size: 110, color: C.red }]} />, noCap: true },
  {
    t: P(4, 'and every email'),
    el: () => <K.Inbox at={0} items={['RE: RE: why did you send me a picture of a goose', 'sandwich?', 'I THINK BIRDS ARE FAKE', 'asdfghjkl', 'sorry, ignore last 40 emails', 'Can I pay rent in beans']} />,
  },

  // S5 high-five
  { t: P(5, 'And then there are'), el: (k) => <S.HighFive contactAt={k(P(5, '250')) + 18} /> },
  {
    t: P(5, 'At that speed'),
    el: (k) => (
      <Paper>
        <K.Bars
          x={260} y={330} w={1400} max={18000} log title="High-five energy" titleAt={0}
          rows={[
            { label: 'Normal high-five', value: 6, display: '≈ 6 J', color: C.green, at: 6 },
            { label: "Max's high-five", value: 15600, display: '≈ 16,000 J', color: C.orange, at: 16 },
            { label: 'Heavy sniper round', value: 18000, display: '≈ 18,000 J', color: C.red, at: k(P(5, 'sniper')) },
          ]}
        />
      </Paper>
    ),
    noCap: true,
  },
  { t: P(5, "That's why the upgrade"), el: (k) => <S.Bandage teaAt={k(P(5, 'So Max learns'))} /> },
  { t: P(5, 'around people'), el: (k) => (<Over><S.Bandage teaAt={-30} /><Stamp x={960} y={220} at={k(P(5, 'always'))} text="RULE #1: TEA MODE ☕" color={C.blue} rot={-4} size={70} /></Over>) },

  // S6 the study
  { t: secStart(6), el: (k) => <K.Treadmill at={0} hardAt={k(P(6, 'how hard'))} fastAt={k(P(6, "It's how fast"))} />, noCap: true },
  { t: P(6, "A sprinter's foot"), el: (k) => <K.ContactBars at={4} maxAt={k(P(6, "Max's foot"))} />, noCap: true },
  { t: P(6, 'No human muscle'), el: () => (<Over><S.PresenterRun /><Txt x={960} y={120} at={6} size={80} align="center" color="#fff" stroke>LEG SPEED: UPGRADED ✔</Txt></Over>) },
  { t: P(6, 'So problem solved'), el: (k) => (<Over><S.TrackCrouch scratchAt={k(P(6, 'No', 2))} /><Stamp x={960} y={300} at={k(P(6, 'No', 2)) + 2} text="NOPE." size={140} /></Over>) },

  // S7 grip
  { t: secStart(7) - 0.6, el: () => <K.ProblemCard n={1} name="GRIP" icon="👟" />, noCap: true },
  { t: P(7, 'When you run'), el: (k) => <ForceCard backAt={k(P(7, 'push the ground'))} fwdAt={k(P(7, 'ground pushes you'))} />, chip: [1, 'GRIP'] },
  {
    t: P(7, 'and grip depends'),
    el: (k) => (
      <Over>
        <BigSay lines={[{ t: 'GRIP depends on WEIGHT ⚖️', at: 0, size: 100 }, { t: 'Max: still 70 kg', at: k(P(7, "Max didn't get heavier")), size: 90, color: C.red }]} />
      </Over>
    ),
    chip: [1, 'GRIP'],
    noCap: true,
  },
  { t: P(7, 'his shoes can only shove'), el: () => <BigSay lines={[{ t: 'Max can push with about', at: 0, size: 80 }, { t: 'a 50 kg sandbag 🏋️', at: 8, size: 130, color: C.orange }]} />, chip: [1, 'GRIP'], noCap: true },
  { t: P(7, 'Push any harder'), el: () => <S.SpinFeet env="track" />, chip: [1, 'GRIP'] },
  { t: P(7, 'Meanwhile'), el: (k) => <K.GripGraph at={6} crossAt={k(P(7, '170'))} />, chip: [1, 'GRIP'], noCap: true },
  { t: P(7, "That's Max's real top speed"), el: () => (<Over><S.TrackRun speed={170} cam="front" /><MiniGauge v={172} at={4} /></Over>), chip: [1, 'GRIP'] },
  {
    t: P(7, '50 times faster legs'),
    el: (k) => (
      <Paper>
        <K.Bars x={260} y={330} w={1400} max={175} title="Top running speed" titleAt={0} rows={[{ label: 'Usain Bolt', value: 44.7, display: '44.7 km/h', color: C.blue, at: 4 }, { label: 'Max', value: 172, display: '≈ 170 km/h  (4×)', color: C.orange, at: k(P(7, 'four times')) }]} />
      </Paper>
    ),
    chip: [1, 'GRIP'],
    noCap: true,
  },
  {
    t: P(7, 'Naught to 100'),
    el: (k) => (
      <Over>
        <BigSay lines={[{ t: '0 → 100 km/h', at: 0, size: 120 }, { t: '≈ 3.5 s  🏎️', at: 8, size: 120, color: C.orange }, { t: '(a decent sports car)', at: k(P(7, 'sports car')), size: 70 }]} />
        <Stamp x={1500} y={850} at={k(P(7, 'Not superhero'))} text="NOT SUPERHERO" size={64} />
      </Over>
    ),
    chip: [1, 'GRIP'],
    noCap: true,
  },
  {
    t: P(7, 'There is a cheat'),
    el: (k) => (
      <Over>
        <S.TrackRun speed={240} beans cam="side" />
        <MiniGauge v={243} at={k(P(7, 'top speed jumps'))} />
        <Stamp x={700} y={260} at={k(P(7, '70 kilos'))} text="70 kg OF BEANS 🥫" color={C.green} size={70} />
      </Over>
    ),
    chip: [1, 'GRIP'],
  },

  // S8 air
  { t: secStart(8) - 0.6, el: () => <K.ProblemCard n={2} name="THE AIR" icon="🌬️" />, noCap: true },
  { t: P(8, 'Even at 170'), el: () => (<Over><S.TrackRun speed={170} wind cam="front" /><Txt x={960} y={90} at={10} size={84} align="center" color="#fff" stroke>🌀 CATEGORY 2 HURRICANE</Txt></Over>), chip: [2, 'THE AIR'] },
  { t: P(8, 'And this is the bit'), el: (k) => <K.CubeLaw at={4} eightAt={k(P(8, 'eight'))} fiftyAt={k(P(8, 'cube'))} />, chip: [2, 'THE AIR'], noCap: true },
  {
    t: P(8, 'So if Max somehow'),
    el: (k) => (
      <Over>
        <BigSay lines={[{ t: 'At 1,250 km/h:', at: 0, size: 90 }, { t: '≈ 10 MEGAWATTS', at: k(P(8, '10 megawatts')), size: 150, color: C.red }, { t: '= a high-speed train 🚄', at: k(P(8, 'high-speed')), size: 80 }]} />
        <Stamp x={1450} y={900} at={k(P(8, 'From one guy'))} text="ONE GUY. IN TRAINERS." size={56} />
      </Over>
    ),
    chip: [2, 'THE AIR'],
    noCap: true,
  },
  { t: P(8, 'Even at his real top speed'), el: () => <BigSay lines={[{ t: 'At 170 km/h:', at: 0, size: 90 }, { t: 'more power than a small car engine 🚗', at: 10, size: 80, color: C.orange }]} />, chip: [2, 'THE AIR'], noCap: true },

  // S9 lunch
  { t: secStart(9) - 0.6, el: () => <K.ProblemCard n={3} name="LUNCH" icon="🍔" />, noCap: true },
  { t: P(9, 'Muscles are only'), el: (k) => <K.Pie at={0} usefulAt={k(P(9, 'quarter'))} wasteAt={k(P(9, 'four times'))} />, chip: [3, 'LUNCH'], noCap: true },
  { t: P(9, 'Running flat out'), el: () => <BigSay tint="#fff3e0" lines={[{ t: '≈ 600 kcal', at: 0, size: 180, color: C.orange }, { t: 'per kilometre', at: 6, size: 90 }]} />, chip: [3, 'LUNCH'], noCap: true },
  { t: P(9, 'His commute is'), el: (k) => <K.Burgers at={k(P(9, '3,000'))} n={5} label="5 km = 3,000 kcal" />, chip: [3, 'LUNCH'], noCap: true },
  { t: P(9, 'And remember his stomach'), el: () => <BigSay lines={[{ t: 'STOMACH: 🐌', at: 0, size: 150 }, { t: 'normal speed', at: 8, size: 90, color: C.red }]} />, chip: [3, 'LUNCH'], noCap: true },
  { t: P(9, 'His muscles only carry'), el: (k) => <K.FuelGauge at={0} drainFrom={k(P(9, 'At full speed'))} drainTo={k(P(9, 'At full speed')) + 60} />, chip: [3, 'LUNCH'], noCap: true },
  { t: P(9, 'But luckily for Max'), el: () => <BigSay dark lines={[{ t: '…something else', at: 0, size: 110 }, { t: 'gets him first 🌡️', at: 14, size: 110, color: C.red }]} />, noCap: true },

  // S10 heat
  { t: secStart(10) - 0.6, el: () => <K.ProblemCard n={4} name="HEAT" icon="🔥" />, noCap: true },
  { t: P(10, 'Remember the quarter-efficient'), el: () => (<Over><S.TrackRun speed={170} heat={0.8} cam="front" /><Txt x={960} y={90} at={20} size={84} align="center" color="#fff" stroke>75% of the energy → HEAT</Txt></Over>), chip: [4, 'HEAT'] },
  {
    t: P(10, 'Running flat out'),
    el: (k) => <K.Thermo title="Max's body temperature, running flat out" titleAt={0} marks={[[0, 37], [k(P(10, '10 seconds')), 40.6, '10 s: dangerous fever 🤒'], [k(P(10, '20 seconds')), 44.3, '20 s: heatstroke ☠️']]} />,
    chip: [4, 'HEAT'],
    noCap: true,
  },
  { t: P(10, 'And the human body'), el: () => <BigSay lines={[{ t: 'Sweating can dump', at: 0, size: 90 }, { t: '≈ 1 kW 💦', at: 6, size: 170, color: C.blue }, { t: 'Max makes ≈ 90 kW', at: 22, size: 90, color: C.red }]} />, chip: [4, 'HEAT'], noCap: true },
  { t: P(10, 'So for every 10 seconds'), el: (k) => <K.RunRest at={0} restAt={k(P(10, 'lie down'))} />, chip: [4, 'HEAT'], noCap: true },
  { t: P(10, 'which means his'), el: (k) => <K.CommuteMap at={0} walkAt={k(P(10, 'Walking would'))} />, chip: [4, 'HEAT'], noCap: true },
  { t: P(10, 'So Max learns'), el: (k) => (<Over><S.LyingSteam walkerFrom={0} /><Stamp x={960} y={220} at={k(P(10, "don't"))} text="RULE #2: DON'T." size={90} /></Over>), chip: [4, 'HEAT'] },

  // S11 brakes / brain
  { t: secStart(11) - 0.6, el: () => <K.ProblemCard n={5} name="BRAKES & BRAIN" icon="🧠" />, noCap: true },
  { t: P(11, 'Stopping comes down'), el: () => (<Over><S.Skid /><Txt x={960} y={90} at={40} size={84} align="center" color="#fff" stroke>≈ 100 m to stop</Txt></Over>), chip: [5, 'BRAKES & BRAIN'] },
  { t: P(11, 'Corners are worse'), el: (k) => <K.TurnCircle at={6} overAt={k(P(11, 'He overshoots'))} />, chip: [5, 'BRAKES & BRAIN'], noCap: true },
  { t: P(11, "And then there's his brain"), el: () => <BigSay dark lines={[{ t: '🧠 Brain: normal speed', at: 0, size: 100 }, { t: 'reaction ≈ 0.25 s', at: 20, size: 100, color: C.yellow }]} />, chip: [5, 'BRAKES & BRAIN'], noCap: true },
  { t: P(11, 'At top speed Max covers'), el: (k) => <K.PitchBlind at={6} brakeAt={k(P(11, 'Add his'))} />, chip: [5, 'BRAKES & BRAIN'], noCap: true },
  { t: P(11, "Max isn't a superhero"), el: (k) => <BigSay tint={C.yellow} lines={[{ t: 'Not a superhero.', at: 0, size: 110 }, { t: 'A MISSILE 🚀', at: k(P(11, 'missile')), size: 140, color: C.red }, { t: 'with anxiety 😰', at: k(P(11, 'anxiety')), size: 110 }]} />, noCap: true },

  // S12 where speed shows
  { t: secStart(12), el: (k) => <S.ParkThrow throwAt={k(P(12, 'roughly'))} /> },
  { t: P(12, 'At that speed'), el: () => <BigSay dark lines={[{ t: 'Front of the ball:', at: 0, size: 90 }, { t: '≈ 1,000 °C 🔥', at: 8, size: 170, color: C.orange }]} />, noCap: true },
  { t: P(12, 'The dog has not'), el: () => <S.DogWaits /> },
  { t: P(12, 'and nothing limits'), el: (k) => (<Over><S.ParkJump jumpAt={k(P(12, 'So Max can jump')) + 8} /><Altimeter from={k(P(12, 'So Max can jump')) + 8} /></Over>) },
  { t: P(12, "That's higher than"), el: () => <K.Eiffel at={0} jumpAt={2} />, noCap: true },
  { t: P(12, 'That one jump'), el: (k) => (<Over><S.ParkJump jumpAt={-200} landAt={-1} /><Txt x={960} y={90} at={8} size={84} align="center" color="#fff" stroke>−600 kcal · +8 °C</Txt><Stamp x={960} y={420} at={k(P(12, 'once'))} text="ONCE." size={150} /></Over>) },

  // S13 rescue
  { t: secStart(13), el: (k) => <S.Rescue scoopAt={k(P(13, 'Then he scoops'))} hopAt={k(P(13, 'and he goes up'))} /> },

  // S14 verdict
  { t: secStart(14), el: () => <S.BenchScene /> },
  { t: P(14, 'For chores'), el: () => <BigSay lines={[{ t: '✔ chores', at: 0, size: 100, color: C.green }, { t: '✔ emails (badly)', at: 14, size: 100, color: C.green }, { t: '✔ catching phones', at: 34, size: 100, color: C.green }]} />, noCap: true },
  { t: P(14, 'But for actually'), el: (k) => <BigSay lines={[{ t: 'grip + air + food + heat', at: 0, size: 90 }, { t: '= 18 km/h 🏃', at: k(P(14, 'about 18')), size: 170, color: C.orange }]} />, noCap: true },
  { t: P(14, 'the speed of a decent jogger'), el: () => <S.TrackRun speed={18} cam="side" /> },
  { t: P(14, 'because speed was never'), el: (k) => <BigSay dark lines={[{ t: 'Speed was never the hard part.', at: 0, size: 90 }, { t: 'Getting rid of the HEAT is.', at: k(P(14, 'Getting rid')), size: 100, color: C.orange }]} />, noCap: true },

  // S15 outro
  { t: secStart(15), el: () => <K.Letter at={4} /> },
  { t: P(15, 'and somebody would like'), el: () => <K.CCTV at={0} /> },
  { t: P(15, 'So what would you do'), el: (k) => <K.CommentsEnd at={0} subAt={k(P(15, 'subscribe'))} />, noCap: true },
];

/* ------------------------------------------------------------------ */
type Cue = [string, number, number?, number?]; // file, time, volume, startFrom(frames)
const SFX: Cue[] = [
  ['ep/sfx/bus.mp3', 0, 0.4],
  ['ep/sfx/crack.mp3', P(1, '50'), 0.25],
  ['ep/sfx/spin.mp3', P(1, 'which raises'), 0.35],
  ['ep/sfx/whoosh.mp3', P(1, 'why does his commute') - 0.15, 0.3],
  ['ep/sfx/pop.mp3', P(1, 'We did the maths'), 0.25],
  ['ep/sfx/sizzle.mp3', P(1, 'It is so much worse'), 0.25],
  ['ep/sfx/lowhit.mp3', secEnd(1), 0.4],
  ['ep/sfx/whoosh.mp3', secEnd(1) - 0.1, 0.35],
  ...(['muscles', 'bones', 'tendons', 'reflexes', 'brain', 'stomach', 'skin', 'weight', 'air'].map((w) => ['ep/sfx/pop.mp3', P(2, w), 0.18] as Cue)),
  ['ep/sfx/whoosh.mp3', P(2, 'Oh and stick around') - 0.1, 0.3],
  ['ep/sfx/jump.mp3', P(2, 'jumps higher'), 0.25],
  ['ep/sfx/pop.mp3', P(2, 'once'), 0.3],
  ['ep/sfx/counter.mp3', P(3, '250'), 0.2],
  ['ep/sfx/counter.mp3', P(3, '500'), 0.2],
  ['ep/sfx/counter.mp3', P(3, '1,250'), 0.22],
  ['ep/sfx/crack.mp3', P(3, 'sound barrier'), 0.3],
  ['ep/sfx/pop.mp3', P(3, 'on paper', 2), 0.3],
  ['ep/sfx/whoosh.mp3', P(4, 'But problems later'), 0.3],
  ['ep/sfx/tick.mp3', P(4, 'Washing up'), 0.2],
  ['ep/sfx/chores.mp3', P(4, 'Max', 1) + 0.1, 0.3],
  ['ep/sfx/whoosh.mp3', P(4, 'The whole flat'), 0.25],
  ['ep/sfx/chores.mp3', P(4, 'The whole flat') + 0.3, 0.25],
  ['ep/sfx/typing.mp3', P(4, 'He can type'), 0.3],
  ['ep/sfx/pop.mp3', P(4, 'and every email'), 0.25],
  ['ep/sfx/whoosh.mp3', P(5, 'Dave goes'), 0.25],
  ['ep/sfx/slap.mp3', P(5, '250') + 0.6, 0.4],
  ['ep/sfx/alarm.mp3', P(5, '250') + 0.9, 0.15],
  ['ep/sfx/counter.mp3', P(5, 'At that speed') + 0.4, 0.2],
  ['ep/sfx/pop.mp3', P(5, 'always'), 0.3],
  ['ep/sfx/pop.mp3', P(6, "It's how fast"), 0.25],
  ['ep/sfx/tick.mp3', P(6, "A sprinter's foot"), 0.15],
  ['ep/sfx/scratch.mp3', P(6, 'No', 2) - 0.05, 0.35],
  ...[7, 8, 9, 10, 11].flatMap((s) => [['ep/sfx/lowhit.mp3', secStart(s) - 0.6, 0.35], ['ep/sfx/whoosh.mp3', secStart(s) - 0.7, 0.3]] as Cue[]),
  ['ep/sfx/spin.mp3', P(7, 'Push any harder'), 0.35],
  ['ep/sfx/pop.mp3', P(7, '170'), 0.25],
  ['ep/sfx/wind.mp3', P(7, "That's Max's real top speed"), 0.15],
  ['ep/sfx/counter.mp3', P(7, 'four times'), 0.2],
  ['ep/sfx/pop.mp3', P(7, 'Not superhero'), 0.3],
  ['ep/sfx/cans.mp3', P(7, 'There is a cheat') + 0.4, 0.3],
  ['ep/sfx/cans.mp3', P(7, 'top speed jumps'), 0.3],
  ['ep/sfx/pop.mp3', P(7, '70 kilos'), 0.3],
  ['ep/sfx/wind.mp3', P(8, 'Even at 170'), 0.2],
  ['ep/sfx/counter.mp3', P(8, 'eight'), 0.2],
  ['ep/sfx/counter.mp3', P(8, 'cube'), 0.22],
  ['ep/sfx/pop.mp3', P(8, 'From one guy'), 0.3],
  ['ep/sfx/pop.mp3', P(9, 'quarter'), 0.25],
  ['ep/sfx/counter.mp3', P(9, '600'), 0.2],
  ['ep/sfx/pop.mp3', P(9, '3,000'), 0.25],
  ['ep/sfx/growl.mp3', P(9, 'stomach'), 0.35],
  ['ep/sfx/tick.mp3', P(9, 'At full speed'), 0.2],
  ['ep/sfx/lowhit.mp3', P(9, 'something else'), 0.3],
  ['ep/sfx/sizzle.mp3', P(10, 'turns into heat'), 0.3],
  ['ep/sfx/tick.mp3', P(10, 'Running flat out'), 0.18],
  ['ep/sfx/sizzle.mp3', P(10, '20 seconds'), 0.25],
  ['ep/sfx/pop.mp3', P(10, 'kilowatt'), 0.25],
  ['ep/sfx/whoosh.mp3', P(10, 'Walking would'), 0.25],
  ['ep/sfx/pop.mp3', P(10, "don't"), 0.3],
  ['audio/skid.mp3', P(11, 'Stopping comes down') + 1.0, 0.35, 0],
  ['ep/sfx/whoosh.mp3', P(11, 'Corners are worse'), 0.25],
  ['ep/sfx/scratch.mp3', P(11, 'He overshoots'), 0.25],
  ['ep/sfx/tick.mp3', P(11, 'quarter of a second'), 0.18],
  ['ep/sfx/pop.mp3', P(11, 'missile'), 0.3],
  ['ep/sfx/dog.mp3', secStart(12) + 0.5, 0.25],
  ['ep/sfx/crack.mp3', P(12, 'roughly'), 0.4],
  ['ep/sfx/sizzle.mp3', P(12, 'heats up'), 0.25],
  ['ep/sfx/jump.mp3', P(12, 'So Max can jump') + 0.2, 0.35],
  ['ep/sfx/pop.mp3', P(12, 'Eiffel'), 0.25],
  ['ep/sfx/sizzle.mp3', P(12, 'That one jump'), 0.25],
  ['ep/sfx/pop.mp3', P(12, 'once'), 0.3],
  ['ep/sfx/carby.mp3', P(13, 'and he goes up') - 0.6, 0.35],
  ['ep/sfx/boing.mp3', P(13, 'and he goes up'), 0.35],
  ['ep/sfx/pop.mp3', P(14, 'For chores'), 0.25],
  ['ep/sfx/counter.mp3', P(14, 'about 18'), 0.2],
  ['ep/sfx/whoosh.mp3', P(14, 'because speed was never'), 0.25],
  ['ep/sfx/letter.mp3', secStart(15) + 0.1, 0.35],
  ['ep/sfx/lowhit.mp3', P(15, 'and somebody would like'), 0.4],
  ['ep/sfx/pop.mp3', P(15, 'So what would you do'), 0.25],
  ['ep/sfx/pop.mp3', P(15, 'subscribe'), 0.3],
];

/* music: fun → tense → fun → warm/ominous, ducked under the voice */
const MUSIC: [string, number, number][] = [
  ['ep/music-fun.mp3', 0, secStart(7) - 0.7],
  ['ep/music-tense.mp3', secStart(7) - 0.7, secStart(12)],
  ['ep/music-fun.mp3', secStart(12), secStart(13)],
  ['ep/music-end.mp3', secStart(13), 1e9],
];

const useDuck = () =>
  useMemo(() => {
    const speak = new Float32Array(TOTAL_FRAMES + 1);
    for (const w of ALL_WORDS) for (let i = fr(w.s - 0.15); i <= fr(w.e + 0.25) && i <= TOTAL_FRAMES; i++) if (i >= 0) speak[i] = 1;
    // smooth with attack/release
    const out = new Float32Array(TOTAL_FRAMES + 1);
    let v = 0;
    for (let i = 0; i <= TOTAL_FRAMES; i++) {
      const target = speak[i] ? 1 : 0;
      v += (target - v) * (target > v ? 0.35 : 0.06);
      out[i] = v;
    }
    return out;
  }, []);

const Music: React.FC = () => {
  const duck = useDuck();
  return (
    <>
      {MUSIC.map(([file, a, b], i) => {
        const from = fr(a);
        const dur = Math.min(TOTAL_FRAMES, fr(b)) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Audio
              src={staticFile(file)}
              loop
              volume={(lf) => {
                const g = from + lf;
                const base = 0.1 + 0.16 * (1 - (duck[g] ?? 0));
                const fadeIn = interpolate(lf, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
                const fadeOut = interpolate(lf, [dur - 20, dur], [1, 0], { extrapolateLeft: 'clamp' });
                return base * Math.min(fadeIn, fadeOut);
              }}
            />
          </Sequence>
        );
      })}
    </>
  );
};

const Voice: React.FC = () => (
  <>
    {Array.from({ length: 15 }, (_, i) => (
      <Sequence key={i} from={fr(secStart(i + 1))}>
        <Audio src={staticFile(`ep/vo${String(i + 1).padStart(2, '0')}.mp3`)} />
      </Sequence>
    ))}
  </>
);

const Sfx: React.FC = () => (
  <>
    {SFX.map(([file, t, vol = 0.3, startFrom], i) => (
      <Sequence key={i} from={Math.max(0, fr(t))}>
        <Audio src={staticFile(file)} volume={vol} startFrom={startFrom} />
      </Sequence>
    ))}
  </>
);

/* captions: chunks of up to 5 words, current word highlighted */
const CHUNKS = (() => {
  const out: { words: typeof ALL_WORDS; s: number; e: number }[] = [];
  let cur: typeof ALL_WORDS = [];
  ALL_WORDS.forEach((w, i) => {
    const prev = ALL_WORDS[i - 1];
    if (cur.length && (cur.length >= 5 || w.s - prev.e > 0.35 || /[.?!,:]$/.test(prev.t) || w.sec !== prev.sec)) {
      out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
  return out;
})();

const HOT = /^(50|fifty|faster|longer|worse|grip|heat|air|lunch|brain|once|170|1,250|four|eight|cube|beans|kills|don't|missile|anxiety|up|problem)/i;

const Captions: React.FC<{ hidden: (t: number) => boolean }> = ({ hidden }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (hidden(t)) return null;
  const ch = CHUNKS.find((c) => t >= c.s - 0.05 && t <= c.e + 0.35);
  if (!ch) return null;
  return (
    <div style={{ position: 'absolute', bottom: 70, width: '100%', textAlign: 'center', padding: '0 120px', boxSizing: 'border-box' }}>
      {ch.words.map((w, i) => {
        const on = t >= w.s;
        const active = t >= w.s && t <= w.e + 0.05;
        const p = on ? spring({ frame: Math.round((t - w.s) * fps), fps, config: { damping: 14, stiffness: 260 } }) : 0;
        const txt = w.t.replace(/[.,]$/, '');
        return (
          <span
            key={i}
            style={{
              display: 'inline-block', margin: '0 12px', fontFamily: K.FONT, fontWeight: 900, fontSize: 72, letterSpacing: -0.5,
              color: active || HOT.test(txt) ? C.yellow : '#ffffff', WebkitTextStroke: `9px ${C.navy}`, paintOrder: 'stroke fill',
              textShadow: `0 7px 0 ${C.navy}`, opacity: on ? 1 : 0.0, transform: `translateY(${(1 - p) * 18}px) scale(${active ? 1.08 : 1})`,
            }}
          >
            {txt}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
export const Episode: React.FC = () => {
  const shots = useMemo(() => [...SHOTS].sort((a, b) => a.t - b.t), []);
  const hidden = (t: number) => {
    let cur = shots[0];
    for (const s of shots) if (s.t <= t) cur = s;
    return !!cur.noCap;
  };
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {shots.map((s, i) => {
        const from = fr(s.t);
        const next = i + 1 < shots.length ? fr(shots[i + 1].t) : TOTAL_FRAMES;
        const k = (t: number) => fr(t) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, next - from)}>
            <Punch>{s.el(k)}</Punch>
            {s.chip && !s.noCap && <K.ProblemChip n={s.chip[0]} name={s.chip[1]} />}
          </Sequence>
        );
      })}
      <Captions hidden={hidden} />
      <Voice />
      <Music />
      <Sfx />
    </AbsoluteFill>
  );
};

/** every cut lands with a tiny punch-in */
const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 7], [1.05, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};
