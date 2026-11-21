// Every scene boundary lives here. Seconds -> frames. Edit timings in one place.
export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);
export const TOTAL = s(12.9);

export const SCENES = {
  hook: [0, 1.4],
  pain: [1.4, 2.6],
  built: [2.6, 4.7],
  excel: [4.7, 5.25],
  sql: [5.25, 5.95],
  python: [5.95, 6.45],
  stats: [6.45, 6.95],
  powerbi: [6.95, 7.65],
  tableau: [7.65, 8.2],
  github: [8.2, 8.85],
  ecosystem: [8.85, 11.3],
  finale: [11.3, 12.9],
} as const;

export type SceneKey = keyof typeof SCENES;
export const from = (k: SceneKey) => s(SCENES[k][0]);
export const len = (k: SceneKey) => s(SCENES[k][1]) - s(SCENES[k][0]);

// Day ranges shown on the HUD for each skill phase
export const PHASES: {key: SceneKey; days: [number, number]; label: string}[] = [
  {key: 'excel', days: [1, 15], label: 'EXCEL'},
  {key: 'sql', days: [16, 35], label: 'SQL'},
  {key: 'python', days: [36, 50], label: 'PYTHON'},
  {key: 'stats', days: [51, 57], label: 'STATISTICS'},
  {key: 'powerbi', days: [58, 70], label: 'POWER BI'},
  {key: 'tableau', days: [71, 75], label: 'TABLEAU'},
  {key: 'github', days: [76, 80], label: 'GIT + GITHUB'},
];
