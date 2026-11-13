// Render ai5.html to a 5-page PDF and one JPG per page. Reports content overflow.
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, '..');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'ai5.html'));
  const over = await p.$$eval('.pg', ps => ps.map((pg, i) => { const t = pg.getBoundingClientRect().top; let m = 0; for (const c of pg.children) { if (c.classList.contains('brand')) continue; m = Math.max(m, c.getBoundingClientRect().bottom - t); } return [i + 1, Math.round(m)]; }));
  console.log('content bottom per page (limit 1790):', JSON.stringify(over));
  await p.pdf({ path: path.join(OUT, 'AI-What-To-Learn-5-pages-thedataguy16.pdf'), width: '1080px', height: '1920px', printBackground: true, preferCSSPageSize: true });
  const pgs = await p.$$('.pg');
  for (let i = 0; i < pgs.length; i++) await pgs[i].screenshot({ path: path.join(OUT, `ai5-page-${i + 1}.jpg`), type: 'jpeg', quality: 92 });
  await b.close();
})();
