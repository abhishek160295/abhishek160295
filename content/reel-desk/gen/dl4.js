const {chromium}=require('playwright');const fs=require('fs');const http=require('http');const path=require('path');const {PDFDocument}=require('pdf-lib');
const root=process.argv[2];
const types={'.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf','.html':'text/html; charset=utf-8'};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(fs.existsSync(f)&&fs.statSync(f).isFile()){r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f))}else{r.writeHead(404);r.end()}}).listen(8766);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:420,height:900}});
await p.route('https://cdnjs.cloudflare.com/**',r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync(__dirname+'/node_modules/pdf-lib/dist/pdf-lib.min.js','utf8')}));
await p.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
await p.addInitScript(()=>{window.__saved=[];window.claude={use:async n=>n==='downloads'?{save:async r=>{const u=new Uint8Array(r.data);window.__saved.push({name:r.filename,b64:btoa(Array.from(u,c=>String.fromCharCode(c)).join(''))});return{status:'saved'}}}:null}});
await p.goto('http://localhost:8766/index.html');await p.waitForTimeout(1500);
console.log(await p.$$eval('.card .cta',e=>e.map(x=>x.textContent)));
for(const bt of await p.$$('#cards button')){if((await bt.textContent()).startsWith('Get PDF')){await bt.click();await p.waitForTimeout(800)}}
for(const b2 of await p.$$('#cards .card:first-child button')){if((await b2.textContent())==='Save images'){await b2.click();break}}
await p.waitForTimeout(1200);const th=await p.$$('.gallery button');console.log('thumbs',th.length);
for(const i of [0,4,th.length-1]){await th[i].click();await p.waitForTimeout(500)}
for(const x of await p.evaluate(()=>window.__saved)){const buf=Buffer.from(x.b64,'base64');let info=buf.length+' bytes';if(x.name.endsWith('.pdf')){const d=await PDFDocument.load(buf);info+=' pages '+d.getPageCount()}console.log(x.name,info)}
await b.close();srv.close()})();
