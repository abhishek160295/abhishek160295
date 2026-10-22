// Usage: node render.cjs <reel.js> <out> [--sheet] [--info]
//   default: renders silent H.264 video to <out>.mp4
//   --sheet: writes a contact sheet PNG (3 frames per scene) to <out>
//   --info : writes timing/cue JSON to <out>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const [reelPath, out, mode] = process.argv.slice(2);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.setContent('<html><body style="margin:0;background:#000"><canvas id="cv"></canvas></body></html>');
  await page.addScriptTag({ path: path.join(__dirname, 'engine.js') });
  await page.addScriptTag({ path: path.resolve(reelPath) });
  await page.evaluate(async () => { await document.fonts.load('600 40px Inter'); await document.fonts.load('900 40px Inter'); await document.fonts.load('700 40px Inter'); setupReel(REEL); });
  const info = await page.evaluate(() => REEL_INFO);
  const grab = async T => Buffer.from((await page.evaluate(T => { renderAt(T); return document.getElementById('cv').toDataURL('image/png'); }, T)).split(',')[1], 'base64');

  if (mode === '--info') { fs.writeFileSync(out, JSON.stringify(info)); }
  else if (mode === '--sheet') {
    const dir = fs.mkdtempSync('/tmp/claude-0/sheet-'); const files = [];
    const n = info.starts.length;
    for (let i = 0; i < n; i++) {
      const s = info.starts[i], d = (info.starts[i + 1] ?? info.total) - s;
      for (const k of [.18, .5, .9]) { const f = `${dir}/${files.length}.png`; fs.writeFileSync(f, await grab(s + d * k)); files.push(f); }
    }
    await new Promise(r => spawn('ffmpeg', ['-v', 'error', '-y', '-i', `${dir}/%d.png`, '-vf', 'scale=270:-1,tile=6x3', '-frames:v', '1', out]).on('close', r));
  } else {
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-tune', 'animation', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = 0; f < info.frames; f++) {
      const buf = await grab(f / 30);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
