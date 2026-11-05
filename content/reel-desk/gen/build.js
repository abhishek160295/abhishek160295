// Build per-reel PDFs + page images. Usage: node build.js t1 t34 t7
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', 'reel');
const src = fs.readFileSync(path.join(__dirname, 'pdfs.js'), 'utf8');
const css = src.match(/const css = `([\s\S]*?)`;/)[1];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rich = s => esc(s).replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>');
const list = items => `<ul>${items.map(([t, e, c]) => `<li>${esc(t)}${e ? `<span class="e">${esc(e)}</span>` : ''}${c ? `<code>${esc(c)}</code>` : ''}</li>`).join('')}</ul>`;

function html(r) {
  const N = r.pages.length + 1;
  const hs = r.title.length > 70 ? 84 : r.title.length > 50 ? 96 : 108;
  const inside = r.pages.map(p => p.h).slice(0, 7);
  const cover = `<section class="pg cover"><div class="tag">${esc(r.tag)}</div>
<h1 style="font-size:${hs}px">${esc(r.title)}</h1><p>${esc(r.sub)}</p>
<div style="margin:44px 0 auto"><div style="font-size:30px;font-weight:700;color:#8a8a8a;letter-spacing:.08em;margin-bottom:22px">INSIDE THIS PDF · ${N} PAGES</div>
<ul style="gap:18px">${inside.map(x => `<li style="font-size:38px">${esc(x)}</li>`).join('')}</ul></div>
<div class="brand"><b>@thedataguy16</b><span>Comment ${esc(r.kw)} · Swipe →</span></div></section>`;
  const pages = r.pages.map((p, i) => `<section class="pg"><div class="n">${String(i + 2).padStart(2, '0')} / ${String(N).padStart(2, '0')}</div>
<h2>${esc(p.h)}</h2><p class="lead">${esc(p.l)}</p>${p.code ? `<div class="code">${esc(p.code)}</div>` : ''}${p.items ? list(p.items) : ''}${p.box ? `<div class="box">${rich(p.box)}</div>` : ''}<div class="sp"></div>
<div class="brand"><b>@thedataguy16</b><span>Save · Share</span></div></section>`).join('');
  return `<html><head><meta charset="utf-8"><style>${css}.code{font-size:29px}li code{font-size:28px}</style></head><body>${cover}${pages}</body></html>`;
}

(async () => {
  const ids = process.argv.slice(2);
  const manPath = path.join(ROOT, 'reels.json');
  const man = fs.existsSync(manPath) ? JSON.parse(fs.readFileSync(manPath, 'utf8')) : {};
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  let bad = 0;
  for (const id of ids) {
    const r = require(path.join(__dirname, 'reels', id + '.js'));
    await p.setContent(html(r), { waitUntil: 'load' });
    const over = await p.$$eval('.pg', ps => ps.map((pg, i) => { const t = pg.getBoundingClientRect().top; let m = 0; for (const c of pg.children) { if (c.classList.contains('brand')) continue; m = Math.max(m, c.getBoundingClientRect().bottom - t); } return [i + 1, Math.round(m)]; }).filter(x => x[1] > 1790));
    if (over.length) { console.log('OVERFLOW', id, JSON.stringify(over)); bad++; continue; }
    fs.mkdirSync(path.join(ROOT, 'pdfs', 'r'), { recursive: true });
    await p.pdf({ path: path.join(ROOT, 'pdfs', 'r', id + '.pdf'), width: '1080px', height: '1920px', printBackground: true, preferCSSPageSize: true });
    const dir = path.join(ROOT, 'img', 'r', id); fs.mkdirSync(dir, { recursive: true });
    const pgs = await p.$$('.pg');
    for (let i = 0; i < pgs.length; i++) await pgs[i].screenshot({ path: path.join(dir, (i + 1) + '.jpg'), type: 'jpeg', quality: 90 });
    man[id] = { pages: pgs.length, kw: r.kw, title: r.title, built: new Date().toISOString().slice(0, 10) };
    console.log('built', id, pgs.length, 'pages');
  }
  await b.close();
  fs.writeFileSync(manPath, JSON.stringify(man, null, 1));
  process.exit(bad ? 1 : 0);
})();
