import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p = await b.newPage({viewport:{width:1920,height:1080}});
p.on('console', m=>console.log('console:', m.text()));
await p.goto('http://127.0.0.1:8765/test.html'); await p.waitForFunction('window.ready===true');
const t0=Date.now();
for(let i=0;i<10;i++){ await p.evaluate(t=>window.renderAt(t), i/24); const buf=await p.screenshot({type:'png'}); if(i==9) (await import('fs')).writeFileSync('test.png',buf);}
console.log('ms/frame', (Date.now()-t0)/10);
await b.close();
