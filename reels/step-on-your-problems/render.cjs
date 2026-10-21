// usage: node render.cjs scene.html outDir [fps] [duration] [workers] [onlyTimes,comma]
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const [,,html,out,fps='60',dur='16',workers='4',only]=process.argv;
(async()=>{const b=await chromium.launch({args:['--disable-gpu-vsync']});fs.mkdirSync(out,{recursive:true});
 const jobs=only?only.split(',').map(Number):[...Array(Math.round(dur*fps)).keys()].map(f=>f/fps);let next=0;
 await Promise.all([...Array(+workers)].map(async()=>{const p=await b.newPage({viewport:{width:1080,height:1920}});
  p.on('pageerror',e=>console.error('ERR',e.message));await p.goto('file://'+path.resolve(html));await p.waitForFunction('window.ready===true');
  for(;;){const i=next++;if(i>=jobs.length)break;const t=jobs[i],d=await p.evaluate(t=>window.frame(t),t);
   fs.writeFileSync(path.join(out,only?`t${t}.png`:`f${String(i).padStart(5,'0')}.png`),Buffer.from(d.split(',')[1],'base64'))}}));
 await b.close()})();
