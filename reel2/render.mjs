// Deterministic frame renderer: headless Chromium draws each frame on <canvas>,
// PNG frames are streamed in order straight into FFmpeg. No screen capture.
//
//   node render.mjs                     -> out/video_silent.mp4 + out/events.json
//   node render.mjs --stills 0,45,120   -> out/stills/frame_XXX.png
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'out');
fs.mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
const stillsArg = args.includes('--stills') ? args[args.indexOf('--stills') + 1] : null;
const WORKERS = Number(process.env.WORKERS || 4);

const launchOpts = { args: ['--force-color-profile=srgb', '--disable-gpu'] };
if (fs.existsSync('/opt/pw-browsers/chromium')) {
  // use the preinstalled browser if the bundled one isn't present
  try { chromium.executablePath(); } catch { launchOpts.executablePath = '/opt/pw-browsers/chromium'; }
}
const browser = await chromium.launch(launchOpts);
const url = pathToFileURL(path.join(ROOT, 'src/index.html')).href + '?render';

async function newPage() {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(url);
  await page.evaluate(() => window.READY);
  return page;
}
const grab = (page, f) => page.evaluate((f) => {
  REEL.renderFrame(f);
  return document.getElementById('c').toDataURL('image/png').split(',')[1];
}, f).then((b64) => Buffer.from(b64, 'base64'));

const pages = await Promise.all(Array.from({ length: WORKERS }, newPage));
const meta = await pages[0].evaluate(() => ({ FRAMES: REEL.FRAMES, FPS: REEL.FPS, EVENTS: REEL.EVENTS }));
fs.writeFileSync(path.join(OUT, 'events.json'), JSON.stringify(meta.EVENTS, null, 2));

if (stillsArg) {
  const dir = path.join(OUT, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  const frames = stillsArg.split(',').map(Number);
  for (let i = 0; i < frames.length; i += WORKERS) {
    const batch = frames.slice(i, i + WORKERS);
    const bufs = await Promise.all(batch.map((f, k) => grab(pages[k], f)));
    batch.forEach((f, k) => fs.writeFileSync(path.join(dir, `frame_${String(f).padStart(3, '0')}.png`), bufs[k]));
  }
  console.log(`stills -> ${dir}`);
} else {
  const target = path.join(OUT, 'video_silent.mp4');
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(meta.FPS), '-c:v', 'png', '-i', '-',
    '-frames:v', String(meta.FRAMES),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-r', String(meta.FPS), target,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const write = (buf) => new Promise((res) => (ff.stdin.write(buf) ? res() : ff.stdin.once('drain', res)));
  const t0 = Date.now();
  for (let f = 0; f < meta.FRAMES; f += WORKERS) {
    const batch = Array.from({ length: Math.min(WORKERS, meta.FRAMES - f) }, (_, k) => f + k);
    const bufs = await Promise.all(batch.map((fr, k) => grab(pages[k], fr)));
    for (const b of bufs) await write(b);
    if (f % 60 === 0) process.stdout.write(`frame ${f}/${meta.FRAMES}  ${((Date.now() - t0) / 1000).toFixed(0)}s\n`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
  console.log(`video -> ${target}`);
}
await browser.close();
