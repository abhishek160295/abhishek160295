import { openBrowser, selectComposition, renderStill } from "@remotion/renderer";
import fs from "fs";
const [bundle, out, ...ids] = process.argv.slice(2);
const frames = JSON.parse(fs.readFileSync(process.env.FRAMES || "tools/frames.json"));
const browser = await openBrowser("chrome", { browserExecutable: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
const comp = await selectComposition({ serveUrl: bundle, id: process.env.COMP || "OneMinute", puppeteerInstance: browser });
const list = ids.length ? ids : Object.keys(frames);
for (const id of list) {
  const [st, d] = frames[id];
  await renderStill({ composition: comp, serveUrl: bundle, frame: st + Math.floor(d * 0.7), output: `${out}/${id}.jpg`, imageFormat: "jpeg", jpegQuality: 70, puppeteerInstance: browser, scale: 0.4 });
}
await browser.close({ silent: true });
console.log("done", list.length);
