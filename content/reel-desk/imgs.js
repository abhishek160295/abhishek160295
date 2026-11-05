const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const docs=require('./docs_only.js');const OUT=path.join(__dirname,'..','reel','img');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const[k,h]of Object.entries(docs)){fs.mkdirSync(path.join(OUT,k),{recursive:true});await p.setContent(h);
const pgs=await p.$$('.pg');for(let i=1;i<pgs.length;i++){await pgs[i].screenshot({path:path.join(OUT,k,(i+1)+'.png')});}}
await b.close();console.log('ok')})();
