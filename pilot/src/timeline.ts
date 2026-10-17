// Phrase timings (seconds) inside each VO take, measured from pauses in the audio.
// Order: This is Max | Yesterday? | Totally normal guy | Today… | Max is 10x faster than you |
// Watch this | Aaand he's gone | A hundred metres | 1.44 seconds | Usain Bolt? | Nine and a half |
// Bolt's fine | Max… | has a problem
export type Take = { file: string; phrases: [number, number][] };

export const TAKES: Record<string, Take> = {
  arthur: {
    file: 'audio/arthur.mp3',
    phrases: [
      [0.0, 0.93], [1.16, 1.8], [2.01, 3.0], [3.39, 3.85], [4.17, 6.17], [6.54, 7.3], [7.76, 8.88],
      [9.36, 10.29], [10.51, 12.04], [12.41, 13.09], [13.5, 14.39], [14.8, 15.41], [15.85, 16.44], [16.79, 17.6],
    ],
  },
  asher: {
    file: 'audio/asher.mp3',
    phrases: [
      [0.18, 0.92], [1.05, 1.64], [1.92, 2.97], [3.18, 3.81], [4.59, 6.09], [6.38, 6.91], [7.59, 8.64],
      [8.85, 9.85], [10.0, 11.82], [11.99, 12.68], [12.86, 13.67], [14.11, 14.72], [15.24, 15.9], [16.21, 17.12],
    ],
  },
};

export const FPS = 30;
export const SPLIT = 6; // part 2 of the VO starts at phrase 6 ("Aaand…")

export type Cues = ReturnType<typeof cues>;

export const cues = (take: Take) => {
  const s = (t: number) => Math.round(t * FPS);
  const p = take.phrases;
  const v1 = 9; // VO part 1 starts here
  const crouch = v1 + s(p[5][0]); // "Watch this"
  const run = crouch + 30;
  const burst = run + 45;
  const v2 = burst + 10 - s(p[SPLIT][0]); // "Aaand" lands just after the boom
  const cut = burst + 60;
  // absolute frame where phrase i starts / ends
  const at = (i: number) => (i < SPLIT ? v1 : v2) + s(p[i][0]);
  const end = (i: number) => (i < SPLIT ? v1 : v2) + s(p[i][1]);
  return {
    v1, v2, crouch, run, burst, cut, at, end,
    lookCam: at(0),
    eyePop: at(4) + 12,
    card: cut + 28,
    cardOut: at(12),
    problem: at(13),
    total: end(13) + 40,
  };
};
