// node render.js <scene.js> <out-basename> [--preview t1,t2,...]
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs"), path = require("path");
(async () => {
  const [scene, outBase, flag, list] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on("pageerror", e => { console.error("PAGE ERROR", e); process.exit(1); });
  const url = "file://" + path.resolve(__dirname, "stage.html") + "?scene=" + encodeURIComponent("file://" + path.resolve(scene));
  await page.goto(url);
  await page.waitForFunction(() => window.ready === true);
  const meta = await page.evaluate(() => ({ duration: SCENE.duration, sfx: SCENE.sfx, title: SCENE.title }));
  if (flag === "--preview") {
    for (const t of list.split(",").map(Number)) {
      const d = await page.evaluate(t => window.frame(t), t);
      fs.writeFileSync(`${outBase}_t${t}.jpg`, Buffer.from(d.split(",")[1], "base64"));
    }
    await browser.close(); return;
  }
  fs.writeFileSync(outBase + ".sfx.json", JSON.stringify(meta, null, 1));
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-r", "30", "-movflags", "+faststart", outBase + ".video.mp4"], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(meta.duration * 30);
  for (let i = 0; i < n; i++) {
    const d = await page.evaluate(t => window.frame(t), i / 30);
    if (!ff.stdin.write(Buffer.from(d.split(",")[1], "base64"))) await new Promise(r => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  await browser.close();
  console.log("frames", n);
})();
