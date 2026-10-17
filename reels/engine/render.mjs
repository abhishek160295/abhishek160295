// Renders scenes/<id>.js into output/<id>.mp4 plus cover, caption and QA contact sheet.
// Usage: node engine/render.mjs <id> [<id> ...] [--music path.mp3] [--fast]

import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawn, execFileSync } from 'node:child_process';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : null; };
const music = flag('--music');
const fast = args.includes('--fast') && args.splice(args.indexOf('--fast'), 1);
const ids = args.map((a) => path.basename(a, '.js'));
if (!ids.length) { console.error('usage: node engine/render.mjs <scene-id> ...'); process.exit(1); }

const brand = JSON.parse(readFileSync(path.join(root, 'brand.json'), 'utf8'));
const lib = readFileSync(path.join(root, 'engine/lib.js'), 'utf8');
const outDir = path.join(root, 'output');
mkdirSync(outDir, { recursive: true });

// Per-frame wrapper: background, scene, brand mark, loop-friendly fade at the very end.
const runtime = `
const BRAND = ${JSON.stringify(brand)};
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
function renderAt(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  SCENE.draw(ctx, t);
  if (BRAND.handle) text(ctx, BRAND.handle, W / 2, 1520, { size: 26, weight: 600, spacing: 3, color: C.dim });
  const fade = seg(t, SCENE.duration - 0.25, SCENE.duration);
  if (fade > 0) { ctx.globalAlpha = fade; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
}`;

const browser = await chromium.launch();
for (const id of ids) {
  const file = path.join(root, 'scenes', `${id}.js`);
  if (!existsSync(file)) { console.error(`missing ${file}`); continue; }
  const scene = readFileSync(file, 'utf8');
  // Fresh page per scene: scripts share one global scope within a page.
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.setContent(`<html><body style="margin:0;background:#000"><canvas id="c" width="1080" height="1920"></canvas>
<script>${lib}\n${scene}\n${runtime}</script></body></html>`);
  await page.evaluate(() => document.fonts.load('600 40px Inter'));
  const meta = await page.evaluate(() => ({ ...SCENE.meta, duration: SCENE.duration }));
  const fps = fast ? 15 : brand.fps;
  const frames = Math.round(meta.duration * fps);
  const out = path.join(outDir, `${id}.mp4`);

  const ffArgs = ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-'];
  if (music) ffArgs.push('-stream_loop', '-1', '-i', music, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest');
  ffArgs.push('-c:v', 'libx264', '-preset', fast ? 'veryfast' : 'slow', '-crf', '15', '-tune', 'animation',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', out);
  const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c ? rej(new Error(`ffmpeg exit ${c}`)) : res())));

  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    const b64 = await page.evaluate((t) => { renderAt(t); return cv.toDataURL('image/png').slice(22); }, i / fps);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;

  // Cover frame for the grid (the payoff moment).
  const coverT = meta.cover ?? meta.duration * 0.75;
  const cover = await page.evaluate((t) => { renderAt(t); return cv.toDataURL('image/jpeg', 0.95).slice(23); }, coverT);
  writeFileSync(path.join(outDir, `${id}-cover.jpg`), Buffer.from(cover, 'base64'));

  // Caption ready to paste.
  writeFileSync(path.join(outDir, `${id}.txt`), `${meta.caption.trim()}\n\n${(meta.hashtags || []).map((h) => '#' + h).join(' ')}\n`);

  // QA contact sheet: 8 evenly spaced frames.
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', out, '-vf', `fps=${8 / meta.duration},scale=270:-1,tile=4x2`, '-frames:v', '1', path.join(outDir, `${id}-sheet.jpg`)]);

  await page.close();
  console.log(`${id}: ${frames} frames, ${meta.duration}s, ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${path.relative(root, out)}`);
}

await browser.close();
