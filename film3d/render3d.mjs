// Render frames [a, b) of the 3D film into an mp4 chunk.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
import fs from 'fs';
const [a, b, out] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4]];
const FPS = 24;
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out + '.tmp.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await br.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto('http://127.0.0.1:8765/film.html');
await p.waitForFunction('window.ready===true', null, { timeout: 180000 });
for (let i = a; i < b; i++) {
  await p.evaluate(t => window.renderAt(t), i / FPS);
  const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await br.close();
fs.renameSync(out + '.tmp.mp4', out);
fs.writeFileSync(out + '.done', '');
