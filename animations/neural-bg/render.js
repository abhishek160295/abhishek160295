const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{
  const [,,html,out,fpsArg,durArg]=process.argv;const fps=+fpsArg||30,dur=+durArg||20;
  const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
  await pg.goto('file://'+html);
  const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',String(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','16','-preset','medium','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<fps*dur;i++){
    const d=await pg.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',.95)},i/fps);
    ff.stdin.write(Buffer.from(d.split(',')[1],'base64'));
  }
  ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();
})();
