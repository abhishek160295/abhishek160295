import data from '../ep-data.json';

export const FPS = 30;
// extra silence inserted before each section (seconds); section 2 gets the title card
export const GAP_BEFORE = [0.3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.6, 0.6, 0.6, 0.6, 0.6, 0.3, 0.4, 0.4, 0.4];
export const TAIL = 3.5;

type Word = [string, number, number];
const words = data.words as Word[][];
export const DUR = data.durations as number[];

export const SEC_START: number[] = [];
{
  let t = 0;
  for (let i = 0; i < 15; i++) {
    t += GAP_BEFORE[i];
    SEC_START.push(t);
    t += DUR[i];
  }
}
export const TOTAL_SEC = SEC_START[14] + DUR[14] + TAIL;
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** episode time (s) where `phrase` starts inside section `sec` (1-based). nth = occurrence */
export const at = (sec: number, phrase: string, nth = 1): number => {
  const ws = words[sec - 1];
  const target = phrase.split(/\s+/).map(norm).filter(Boolean);
  let seen = 0;
  for (let i = 0; i < ws.length; i++) {
    let ok = true;
    for (let j = 0; j < target.length; j++) {
      if (!ws[i + j] || norm(ws[i + j][0]) !== target[j]) {
        ok = false;
        break;
      }
    }
    if (ok && ++seen === nth) return SEC_START[sec - 1] + ws[i][1];
  }
  throw new Error(`phrase not found: s${sec} "${phrase}"`);
};

/** end time of the last word of a phrase */
export const end = (sec: number, phrase: string, nth = 1): number => {
  const t0 = at(sec, phrase, nth);
  const ws = words[sec - 1];
  const n = phrase.split(/\s+/).filter(Boolean).length;
  const i = ws.findIndex((w) => Math.abs(SEC_START[sec - 1] + w[1] - t0) < 1e-6);
  return SEC_START[sec - 1] + ws[i + n - 1][2];
};

export const secStart = (sec: number) => SEC_START[sec - 1];
export const secEnd = (sec: number) => SEC_START[sec - 1] + DUR[sec - 1];
export const f = (t: number) => Math.round(t * FPS);

/** all words on the episode timeline, for captions */
export const ALL_WORDS: { t: string; s: number; e: number; sec: number }[] = words.flatMap((ws, i) =>
  ws.map((w) => ({ t: w[0], s: SEC_START[i] + w[1], e: SEC_START[i] + w[2], sec: i + 1 })),
);
