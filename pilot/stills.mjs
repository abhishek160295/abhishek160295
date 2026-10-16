// usage: node stills.mjs <outdir> <frame...>  — renders stills with one bundle + one browser
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition, openBrowser } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [outDir, ...frames] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public') });
const browser = await openBrowser('chrome', { browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', chromiumOptions: { gl: 'swiftshader' } });
const comp = await selectComposition({ serveUrl, id: process.env.COMP ?? 'Episode50x', puppeteerInstance: browser });
for (const fr of frames.map(Number)) {
  await renderStill({ serveUrl, composition: comp, frame: fr, output: path.join(outDir, `f${String(fr).padStart(5, '0')}.jpg`), imageFormat: 'jpeg', jpegQuality: 70, scale: 0.5, puppeteerInstance: browser });
  process.stdout.write('.');
}
await browser.close({ silent: true });
console.log('\ndone');
