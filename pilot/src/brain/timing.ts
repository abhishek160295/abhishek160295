// 100%-brain episode timeline: sections back to back with short gaps, phrase lookups in frames.
import data from './words.json';

export const FPS = 30;
type W = { text: string; start: number; end: number };
const words = (data as { words: W[][] }).words;
export const DUR = [28.19, 38.27, 47.57, 36.21, 45.32, 31.63, 33.15, 27.79, 17.71, 17.01];
// silence before each section (s): room for title smash, set pieces and breathing holds
export const GAP = [0.2, 1.0, 0.8, 1.0, 0.8, 0.8, 0.8, 1.4, 3.0, 1.0];
export const TAIL = 3;

export const SEC_START: number[] = [];
{ let t = 0; for (let i = 0; i < DUR.length; i++) { t += GAP[i]; SEC_START.push(t); t += DUR[i]; } }
export const TOTAL_FRAMES = Math.round((SEC_START[DUR.length - 1] + DUR[DUR.length - 1] + TAIL) * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/** frame where `phrase` starts in section `sec` (1-based) */
export const at = (sec: number, phrase: string, nth = 1): number => {
  const ws = words[sec - 1];
  const tg = phrase.split(/\s+/).map(norm).filter(Boolean);
  let seen = 0;
  for (let i = 0; i < ws.length; i++) {
    if (tg.every((t, j) => ws[i + j] && norm(ws[i + j].text) === t) && ++seen === nth) return Math.round((SEC_START[sec - 1] + ws[i].start) * FPS);
  }
  throw new Error(`phrase not found: s${sec} "${phrase}"`);
};
/** frame where the last word of `phrase` ends */
export const end = (sec: number, phrase: string, nth = 1): number => {
  const a = at(sec, phrase, nth) / FPS - SEC_START[sec - 1];
  const ws = words[sec - 1];
  const i = ws.findIndex((w) => Math.abs(w.start - a) < 0.02);
  const n = phrase.split(/\s+/).filter(Boolean).length;
  return Math.round((SEC_START[sec - 1] + ws[i + n - 1].end) * FPS);
};
export const secStart = (sec: number) => Math.round(SEC_START[sec - 1] * FPS);
export const secEnd = (sec: number) => Math.round((SEC_START[sec - 1] + DUR[sec - 1]) * FPS);
export const CAPTION_WORDS: [string, number, number][] = words.flatMap((ws, i) =>
  ws.map((w) => [w.text, Math.round((SEC_START[i] + w.start) * FPS), Math.round((SEC_START[i] + w.end) * FPS)] as [string, number, number]));
