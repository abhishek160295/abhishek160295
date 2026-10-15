import { openBrowser, selectComposition, renderStill } from "@remotion/renderer";
import fs from "fs";
const [bundle, out] = process.argv.slice(2);
const segs = JSON.parse(fs.readFileSync("src/sm/reel.json"));
const browser = await openBrowser("chrome", { browserExecutable: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
const comp = await selectComposition({ serveUrl: bundle, id: "Reel", puppeteerInstance: browser });
let at = 0;
for (const [i, s] of segs.entries()) {
  const d = Math.round(s.len * 30);
  await renderStill({ composition: comp, serveUrl: bundle, frame: at + Math.floor(d * 0.75), output: `${out}/r${String(i).padStart(2, "0")}.jpg`, imageFormat: "jpeg", jpegQuality: 70, puppeteerInstance: browser, scale: 0.3 });
  at += d;
}
await browser.close({ silent: true });
console.log("done");
