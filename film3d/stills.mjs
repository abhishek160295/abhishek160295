import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const times = process.argv[2].split(',').map(Number);
const out = process.argv[3] || 'stills';
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text()); });
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto('http://127.0.0.1:8765/film.html');
await p.waitForFunction('window.ready===true', null, { timeout: 120000 });
for (const t of times) { await p.evaluate(t => window.renderAt(t), t); fs.writeFileSync(`${out}/s_${t.toFixed(2)}.jpg`, await p.screenshot({ type: 'jpeg', quality: 85 })); }
await b.close();
console.log('done', times.length);
