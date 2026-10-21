
# ===== @thedataguy16 carousel renderer v2 =====
# Usage: python render.py spec.json outdir [--pdf]
# -> outdir/slide_XX.jpg (1080x1350) [+ cover_b.jpg] [+ outdir/carousel.pdf = every page + clickable product page]
# Carousels only (owner rule 16 Oct: no reels). Paths in specs may be absolute legacy paths (/home/claude/...);
# they are remapped to this project (mascot -> assets/mascot.jpg). Relative paths resolve from the project root.
# spec.preview_pages = N (NOTES DROP): the post shows cover + first N pages + product + cta; the PDF keeps every page.
# Spec: {"series": str, "slides": [ ... ]}
# Slide types (all text fields accept **bold-accent**, ~serif-italic~ and <br>):
#  cover   {kicker, title, sub, art: sql|powerbi|python|excel|roadmap|career, badge: "30 Q&A"}
#  list    {title, tag?, lang?, items:[{n?, h, b?, code?, icon?}]}   2 code items or 4-5 text items
#  point   {num?, title, body?, bullets[], icon?}
#  code    {title, lang, file?, code, note?}
#  compare {title, left{label,items[]}, right{label,items[]}}          left = wrong/avoid, right = right/do
#  stat    {value, label, body?}
#  timeline{title, phases:[{range, title, icon?, bullets[]}]}          2-3 phases per slide
#  table   {title, cols[], rows[[...]], hi?: row index to highlight, note?}
#  cta     {title, body, keyword?, action?}
#  spec.cover_alt = {kicker?, title, sub?, badge?} -> also renders cover_b.jpg (second hook; user picks one)
#  kids{title, subtitle?, mascot?:img path/url, cells:[{term, kid, sql?, img? OR emoji?}] x6}  emoji = 1-2 Noto emoji drawn as the picture (no Canva needed; Canva credits run out) 'explained to kids' picture-book sheet (3x2 cards, cartoon icon per card; images = local file paths or data URIs)
#  MEGA-SHEET series (spec.format='mega'): marker_cover{title, sub?} (red marker on paper, no chrome) | sheet{title, ribbon, data?, rows:[{name, formula, result?}], start?} (data = one line describing the sample cells) (result = tested answer on the sample data, shown as a green pill) (notebook formula sheet, 8-10 rows) | bigtable{title, cols?, rows:[[q, a]], start?} (dense 18-22 row reference table). 2-5 slides + auto product + cta.
#  split{top:{label, head?, points[], line?}, bottom:{...}}  mega-series 'X vs Y' page: two highlighter labels stacked, dashed divider, one comparison dimension per slide (Nicolas 'Economics vs Finance' style). Use 6-8 split slides after a marker_cover 'X<br>vs<br>Y'.
#  flow{title, steps:[{q, yes}] x4-6, else}  mega-series decision flowchart ('Which chart should I use?'): question boxes chained by 'No' arrows, each with a green Yes-> answer pill.
#  product (auto-inserted before the CTA: 90-Day System pitch; set spec.product=false to skip, or a dict to override fields)
# spec.layout = cards | grid | editorial | notebook -> changes cover composition and the shape of every slide (one per post; rotate).
# spec.style = ember | mist | terracotta | paper -> one consistent look per post. ALL styles are light: no dark backgrounds anywhere (owner rule). Use a different style for each of the day's posts.
import json, sys, re, html, pathlib, asyncio, os
from playwright.async_api import async_playwright
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent / "renderer"))
from assets import FONTS_CSS, ICONS

ROOT = pathlib.Path(__file__).resolve().parent

def resolve_path(p):
    """Map legacy absolute paths (/home/claude/...) and relative paths onto this project."""
    if not p or str(p).startswith(("data:", "http://", "https://")): return p
    q = pathlib.Path(p)
    if q.is_absolute() and q.exists(): return str(q)
    if "mascot" in q.name.lower(): return str(ROOT / "assets" / "mascot.jpg")
    for c in (ROOT / p, ROOT / "assets" / q.name):
        if c.exists(): return str(c)
    raise FileNotFoundError(f"asset not found: {p}")

async def launch(p):
    exe = os.environ.get("CHROMIUM_PATH")
    return await p.chromium.launch(**({"executable_path": exe} if exe else {}))

W, H = 1080, 1350

def icon(name, size=40, stroke=2, cls=""):
    inner = ICONS.get(name) or ICONS["sparkles"]
    return (f'<svg class="ic {cls}" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="{stroke}" stroke-linecap="round" stroke-linejoin="round">{inner}</svg>')

CSS = FONTS_CSS + r"""
:root{--ink:#121110;--ink2:#1C1A17;--paper:#F3EEE4;--card:#FFFDF8;--line:#E3D8C7;--muted:#7A6F61;--rust:#E0561F;--amber:#F4AE3D;--teal:#12876F;--red:#C63D2F;--cream:#FAF3E6}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden}
body{font-family:Inter,Poppins,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}
.s{position:relative;width:1080px;height:1350px;overflow:hidden;background:var(--paper)}
.s.dark{background:var(--ink);color:var(--cream)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(18,17,16,.05) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(18,17,16,.05) 1.5px,transparent 1.5px);background-size:54px 54px;background-position:-2px -2px;mask-image:linear-gradient(180deg,#000 0%,rgba(0,0,0,.55) 60%,rgba(0,0,0,.2) 100%)}
.dark .grid{background-image:linear-gradient(rgba(250,243,230,.055) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(250,243,230,.055) 1.5px,transparent 1.5px)}
.glow{position:absolute;border-radius:50%;filter:blur(90px);opacity:.55}
.grain{position:absolute;inset:0;opacity:.07;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.dark .grain{mix-blend-mode:screen;opacity:.06}
.wrap{position:absolute;inset:0;padding:190px 80px 160px;display:flex;flex-direction:column}
/* chrome */
.top{position:absolute;top:52px;left:80px;right:80px;display:flex;align-items:center;justify-content:space-between;z-index:5}
.who{display:flex;align-items:center;gap:16px}
.av{width:58px;height:58px;border-radius:50%;background:var(--ink);color:var(--amber);display:grid;place-items:center;font:800 22px Bricolage;letter-spacing:-.5px;box-shadow:0 0 0 3px var(--paper),0 0 0 6px var(--rust)}
.dark .av{background:var(--amber);color:var(--ink);box-shadow:0 0 0 3px var(--ink),0 0 0 6px var(--rust)}
.hn{font:700 25px Inter;letter-spacing:-.2px;display:flex;align-items:center;gap:8px}
.hn .ic{color:var(--rust)}
.hs{font:500 20px Inter;color:var(--muted);margin-top:2px}
.dark .hs{color:#A89C8B}
.pill{font:600 20px JBMono;letter-spacing:1.5px;text-transform:uppercase;padding:11px 18px;border-radius:40px;border:2px solid var(--ink);display:flex;gap:10px;align-items:center}
.dark .pill{border-color:rgba(250,243,230,.3);color:var(--cream)}
.prog{position:absolute;top:128px;left:80px;right:80px;display:flex;gap:8px;z-index:5}
.prog i{flex:1;height:6px;border-radius:6px;background:rgba(18,17,16,.1)}
.prog i.on{background:var(--rust)}
.dark .prog i{background:rgba(250,243,230,.14)}.dark .prog i.on{background:var(--amber)}
.foot{position:absolute;bottom:56px;left:80px;right:80px;display:flex;align-items:center;justify-content:space-between;z-index:5}
.pg{font:700 24px JBMono;color:var(--muted);letter-spacing:1px}
.pg b{color:var(--ink)}.dark .pg b{color:var(--cream)}
.fr{display:flex;gap:14px;align-items:center}
.save{display:flex;align-items:center;gap:10px;font:600 22px Inter;color:var(--muted)}
.nx{width:72px;height:72px;border-radius:50%;background:var(--ink);color:var(--paper);display:grid;place-items:center;box-shadow:0 10px 24px rgba(18,17,16,.25)}
.dark .nx{background:var(--rust);color:#fff;box-shadow:0 10px 30px rgba(224,86,31,.45)}
/* type */
b{color:var(--rust);font-weight:inherit}
.dark b{color:var(--amber)}
em{font-family:Serif;font-style:italic;font-weight:400;letter-spacing:0}
.h1{font:800 124px/0.94 Bricolage;letter-spacing:-5px}
.h1 em{font-size:1.08em;color:var(--amber);letter-spacing:-2px}
.h2{font:800 72px/1.02 Bricolage;letter-spacing:-2.5px;text-wrap:balance}
.h2 em{color:var(--rust);font-size:1.08em;letter-spacing:-1px}
.tag{align-self:flex-start;font:700 24px JBMono;letter-spacing:2px;text-transform:uppercase;color:var(--rust);display:flex;gap:10px;align-items:center;margin-bottom:18px}
.tag:before{content:"";width:34px;height:3px;background:var(--rust);display:block}
.lead{font:500 38px/1.42 Inter;color:#433B32;letter-spacing:-.3px}
.dark .lead{color:#D8CCBA}
/* cover */
.kick{align-self:flex-start;display:flex;align-items:center;gap:12px;font:700 22px JBMono;letter-spacing:2px;text-transform:uppercase;color:var(--amber);border:2px solid rgba(244,174,61,.45);background:rgba(244,174,61,.08);padding:12px 22px;border-radius:40px;margin-bottom:38px}
.cover .wrap{padding-top:190px}
.hasb .h1{max-width:700px}
.cover .lead{margin-top:34px;max-width:840px;font-size:36px}
.art{position:absolute;left:0;right:0;bottom:110px;height:560px;perspective:1600px}
.badge{position:absolute;right:74px;top:176px;width:190px;height:190px;border-radius:50%;background:var(--rust);color:#fff;display:grid;place-items:center;text-align:center;font:800 44px/0.95 Bricolage;letter-spacing:-1.5px;transform:rotate(9deg);box-shadow:0 20px 50px rgba(224,86,31,.45);z-index:6}
.badge:after{content:"";position:absolute;inset:10px;border:2px dashed rgba(255,255,255,.55);border-radius:50%}
.badge span{display:block;font:700 18px JBMono;letter-spacing:2px;margin-top:6px;opacity:.9}
.swipe{position:absolute;bottom:40px;right:64px;display:flex;align-items:center;gap:14px;font:700 24px Inter;color:var(--cream);z-index:6;background:rgba(18,17,16,.82);padding:10px 10px 10px 28px;border-radius:60px;border:1.5px solid rgba(250,243,230,.14)}
.swipe .nx{background:var(--rust)}
/* ui cards used in art */
.ui{position:absolute;background:#1F1C18;border:1.5px solid rgba(250,243,230,.12);border-radius:26px;box-shadow:0 40px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06);overflow:hidden;color:var(--cream)}
.ui.light{background:var(--card);border-color:rgba(18,17,16,.08);color:var(--ink);box-shadow:0 40px 80px rgba(0,0,0,.5)}
.ui .bar{height:54px;display:flex;align-items:center;gap:10px;padding:0 22px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(250,243,230,.08)}
.ui.light .bar{background:#F4EEE3;border-color:#E6DDCE}
.ui .bar i{width:14px;height:14px;border-radius:50%}
.ui .bar span{margin-left:12px;font:600 18px JBMono;color:#9C8F7D}
.ui pre,.code td,.it .cw pre,.mini,.tb td,.pg,.pill,.tag,.kick{font-variant-ligatures:none;font-feature-settings:"calt" 0,"liga" 0}
.ui pre{font:500 24px/1.6 JBMono;padding:20px 26px;white-space:pre}
.mini{width:100%;border-collapse:collapse;font:500 21px JBMono}
.mini td,.mini th{padding:12px 18px;border-bottom:1px solid rgba(18,17,16,.08);text-align:left}
.mini th{color:#8C8070;font-weight:700;font-size:17px;letter-spacing:1px;text-transform:uppercase}
.mini tr.hi td{background:rgba(224,86,31,.12);color:var(--rust);font-weight:700}
/* list */
.lst{display:flex;flex-direction:column;gap:20px;margin-top:40px}
.it{position:relative;display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:start;background:var(--card);border:2px solid var(--line);border-radius:28px;padding:28px 30px;box-shadow:0 2px 0 rgba(18,17,16,.04),0 18px 36px -18px rgba(60,40,20,.25)}
.it .n{min-width:74px;height:74px;padding:0 12px;border-radius:20px;background:var(--ink);color:var(--amber);display:grid;place-items:center;font:700 32px JBMono;letter-spacing:-1px}
.it .n.icn{background:var(--rust);color:#fff}
.it>div{min-width:0}
.it .cw pre{overflow:hidden}
.it h4{font:700 38px/1.18 Inter;letter-spacing:-.8px}
.it p{font:500 30px/1.42 Inter;color:#51483E;margin-top:8px;letter-spacing:-.2px}
.it .cw{margin-top:16px;border-radius:18px;background:var(--ink);overflow:hidden}
.it .cw pre{font:500 27px/1.5 JBMono;color:#F1E8DA;padding:20px 24px;white-space:pre}
/* code */
.code{margin-top:36px;border-radius:30px;background:var(--ink);overflow:hidden;box-shadow:0 40px 70px -24px rgba(40,25,10,.55)}
.code .bar{height:62px;display:flex;align-items:center;gap:11px;padding:0 26px;background:#1E1B17;border-bottom:1px solid rgba(250,243,230,.08)}
.code .bar i{width:16px;height:16px;border-radius:50%}
.code .bar span{margin-left:14px;font:600 20px JBMono;color:#A3957F;background:#2A2621;padding:6px 16px;border-radius:10px}
.code table{border-collapse:collapse;margin:22px 0}
.code td{font:500 31px/1.55 JBMono;color:#F1E8DA;padding:0 26px 0 0;white-space:pre-wrap;vertical-align:top}
.code td.ln{color:#5E554A;text-align:right;padding:0 22px 0 28px;user-select:none;width:1%}
.kw{color:#FF8A57;font-weight:700}.st{color:#B7E08F}.cm{color:#7D7263;font-style:italic}.fn{color:#7CCBF0}.nu{color:#F4C06A}
.note{margin-top:34px;display:flex;gap:22px;align-items:flex-start;background:var(--card);border:2px solid var(--line);border-radius:26px;padding:26px 28px;font:500 32px/1.45 Inter;color:#3C342C}
.note .ic{flex:none;color:var(--rust);margin-top:4px}
/* point */
.bigN{font:800 200px/.82 Bricolage;letter-spacing:-9px;color:transparent;-webkit-text-stroke:3px var(--rust);margin-bottom:26px}
.bl{display:flex;flex-direction:column;gap:16px;margin-top:40px}
.bl div{display:flex;gap:20px;align-items:center;font:600 36px/1.3 Inter;letter-spacing:-.4px;background:var(--card);border:2px solid var(--line);border-radius:22px;padding:24px 28px}
.bl .ck{flex:none;width:46px;height:46px;border-radius:14px;background:var(--rust);color:#fff;display:grid;place-items:center}
/* compare */
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:40px}
.col{min-width:0;overflow-wrap:anywhere;border-radius:30px;padding:32px 30px;border:2px solid var(--line);background:var(--card)}
.col.r{background:var(--ink);border-color:var(--ink);color:var(--cream)}
.col h3{display:flex;align-items:center;gap:12px;font:700 24px JBMono;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px}
.col.l h3{color:var(--red)}.col.r h3{color:var(--amber)}
.col h3 .dot{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff}
.col.l .dot{background:var(--red)}.col.r .dot{background:var(--teal)}
.col p{font:600 34px/1.3 Inter;letter-spacing:-.4px;padding:20px 0;border-top:2px dashed rgba(122,111,97,.25)}
.col.l p{color:#6B6055;text-decoration:line-through;text-decoration-color:rgba(198,61,47,.55);text-decoration-thickness:3px}
/* stat */
.statv{font:800 250px/.85 Bricolage;letter-spacing:-12px;color:var(--rust)}
/* timeline */
.tl{position:relative;margin-top:44px;display:flex;flex-direction:column;gap:26px;padding-left:66px}
.tl:before{content:"";position:absolute;left:21px;top:30px;bottom:30px;width:4px;background:repeating-linear-gradient(180deg,var(--rust) 0 14px,transparent 14px 26px)}
.ph{position:relative;background:var(--card);border:2px solid var(--line);border-radius:28px;padding:26px 30px;box-shadow:0 18px 36px -18px rgba(60,40,20,.25)}
.ph:before{content:"";position:absolute;left:-60px;top:30px;width:34px;height:34px;border-radius:50%;background:var(--paper);border:7px solid var(--rust)}
.ph .hd{display:flex;align-items:center;gap:18px;margin-bottom:12px}
.ph .rg{font:700 22px JBMono;background:var(--ink);color:var(--amber);padding:9px 16px;border-radius:12px;letter-spacing:1px}
.ph h4{font:800 44px Bricolage;letter-spacing:-1.2px}
.ph .ic{margin-left:auto;color:var(--rust)}
.ph ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:8px 22px}
.ph li{font:500 27px/1.35 Inter;color:#4A4138;padding-left:26px;position:relative}
.ph li:before{content:"";position:absolute;left:0;top:14px;width:12px;height:12px;border-radius:3px;background:var(--amber)}
/* table */
.tb{margin-top:40px;border-radius:28px;overflow:hidden;border:2px solid var(--line);background:var(--card)}
.tb table{width:100%;border-collapse:collapse}
.tb th{background:var(--ink);color:var(--amber);font:700 22px JBMono;letter-spacing:1.5px;text-transform:uppercase;text-align:left;padding:22px 26px}
.tb td{font:500 30px JBMono;padding:20px 26px;border-top:2px solid var(--line)}
.tb tr.hi td{background:rgba(224,86,31,.1);color:var(--rust);font-weight:700}
/* cta */
.cta .wrap{justify-content:center}
.cbox{margin-top:48px;background:#1F1C18;border:1.5px solid rgba(250,243,230,.12);border-radius:30px;padding:30px;box-shadow:0 30px 60px rgba(0,0,0,.45)}
.cm1{display:flex;gap:18px;align-items:center}
.cm1 .av{width:64px;height:64px;box-shadow:none;background:#3A342D;color:#CDBFAE;font-size:22px}
.inp{flex:1;border:2px solid rgba(250,243,230,.18);border-radius:40px;padding:18px 26px;font:600 32px Inter;color:#fff;display:flex;align-items:center;justify-content:space-between}
.inp .cur{display:inline-block;width:3px;height:36px;background:var(--amber);margin-left:4px;vertical-align:middle}
.inp .snd{color:var(--amber);font:700 26px Inter}
.dm{margin-top:22px;margin-left:82px;display:flex;align-items:center;gap:16px;background:var(--rust);color:#fff;border-radius:26px 26px 26px 8px;padding:20px 26px;font:600 28px Inter;align-self:flex-start;width:fit-content}



/* product page (PDF only) */
.prod{background:var(--ink);color:var(--cream)}
.prod .wrap{justify-content:center}
.prod .pk{align-self:flex-start;font:700 22px JBMono;letter-spacing:2px;text-transform:uppercase;color:var(--ink);background:var(--amber);padding:12px 22px;border-radius:40px;margin-bottom:34px}
.prod .feat{display:flex;flex-direction:column;gap:16px;margin-top:40px}
.prod .feat div{display:flex;gap:18px;align-items:center;font:600 34px/1.3 Inter;background:#1D1A16;border:1.5px solid rgba(250,243,230,.1);border-radius:22px;padding:22px 26px}
.prod .feat .ck{flex:none;width:46px;height:46px;border-radius:14px;background:var(--rust);color:#fff;display:grid;place-items:center}
.prod .buy{margin-top:46px;display:flex;flex-direction:column;align-items:flex-start;gap:8px;background:var(--rust);color:#fff;border-radius:30px;padding:30px 36px;text-decoration:none;box-shadow:0 24px 60px rgba(224,86,31,.45)}
.prod .buy b{color:#fff;font:800 44px Bricolage;letter-spacing:-1px}
.prod .buy span{font:600 24px JBMono;opacity:.9}



/* quiz */
.qprev{display:flex;flex-direction:column;gap:6px;background:var(--teal);color:#fff;border-radius:22px;padding:18px 24px;margin-bottom:28px}
.qpl{display:flex;align-items:center;gap:10px;font:700 26px Inter}.qpl b{color:#fff;font-weight:800}
.qpw{font:500 24px/1.35 Inter;opacity:.92}.qpw b{color:#fff}
.qh{font-size:60px}
.qos{display:flex;flex-direction:column;gap:16px;margin-top:34px}
.qo{display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;background:var(--card);border:2px solid var(--line);border-radius:24px;padding:18px 22px}
.qo .ql{width:64px;height:64px;border-radius:50%;border:3px solid var(--ink);display:grid;place-items:center;font:800 30px Bricolage}
.qo .qc{min-width:0}
.qo pre{font:500 27px/1.45 JBMono;background:var(--ink);color:#F1E8DA;padding:14px 18px;border-radius:14px;white-space:pre;overflow:hidden}
.qo span{font:600 32px/1.3 Inter}
.qhint{margin-top:26px;display:flex;align-items:center;gap:12px;font:600 26px Inter;color:var(--muted)}
.t-ink .qo{background:#1D1A16;border-color:rgba(250,243,230,.1)}.t-ink .qo .ql{border-color:var(--amber);color:var(--amber)}
.t-ink .qo pre{background:#0C0B0A}.t-ink .qo span{color:var(--cream)}
.t-clay .qo{background:#FFFBF5}.t-white .qo{background:#F6F1E8;border-color:#E6DDCE}

/* product pitch slide */
.p2 .wrap{padding-top:176px;justify-content:center}
.p2k{align-self:flex-start;display:flex;gap:10px;align-items:center;font:700 22px JBMono;letter-spacing:1.5px;text-transform:uppercase;background:var(--amber);color:var(--ink);padding:12px 20px;border-radius:40px;margin-bottom:26px}
.p2h{font-size:98px}
.p2l{font-size:31px;margin-top:20px}
.p2rail{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:34px;position:relative}
.p2ph{border-radius:18px;padding:16px 16px;background:rgba(250,243,230,.07);border:1.5px solid rgba(250,243,230,.12)}
.p2ph span{display:block;font:700 18px JBMono;color:var(--amber);letter-spacing:.5px;margin-bottom:6px}
.p2ph b{font:700 24px/1.2 Inter;color:inherit}
.p2grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
.p2st{border-radius:20px;padding:20px 22px;background:rgba(250,243,230,.07);border:1.5px solid rgba(250,243,230,.12)}
.p2st .v{font:800 54px/1 Bricolage;letter-spacing:-2px;color:var(--amber)}
.p2st .l{font:600 23px/1.3 Inter;margin-top:6px;opacity:.85}
.p2buy{margin-top:22px;display:flex;align-items:center;justify-content:space-between;gap:18px;background:var(--cream);color:var(--ink);border-radius:28px;padding:22px 26px;text-decoration:none}
.p2buy .pr{font:800 40px/1.05 Bricolage;letter-spacing:-1.2px}
.p2buy .pr s{font:600 28px Inter;color:#9A8C7B;margin-left:14px;letter-spacing:0}
.p2buy .by{font:600 20px Inter;color:#6F6456;margin-top:6px}
.p2buy .go{display:flex;align-items:center;gap:10px;background:var(--rust);color:#fff;font:700 26px Inter;padding:18px 24px;border-radius:40px;white-space:nowrap}
.terra.p2 .p2k{background:#16110D;color:#F4AE3D}
.terra .p2ph span,.terra .p2st .v{color:#16110D}
.terra .p2ph,.terra .p2st{background:rgba(255,246,234,.12);border-color:rgba(255,246,234,.22)}
.terra .p2buy .go{background:#16110D}
.pap.p2 .p2ph,.pap.p2 .p2st{background:#F4EEE3;border-color:#E3D8C7}
.pap.p2 .p2ph span,.pap.p2 .p2st .v{color:var(--rust)}
.pap.p2 .p2buy{background:var(--ink);color:var(--cream)}.pap.p2 .p2buy .by{color:#B5A895}
.pap.p2 .p2k{background:var(--ink);color:var(--amber)}


/* ===== layout families: one per post, rotated (spec.layout) ===== */
/* GRID: art on top, headline anchored bottom; list items tile 2-up; numbers as corner tags */
.lay-grid.cover .art{top:150px;bottom:auto}
.lay-grid.cover .wrap{justify-content:flex-end;padding-top:700px;padding-bottom:170px}
.lay-grid.cover .badge{top:auto;bottom:420px}
.lay-grid .lst:not(:has(.cw)){display:grid;grid-template-columns:1fr 1fr;gap:18px}
.lay-grid .lst:not(:has(.cw)) .it{grid-template-columns:1fr;gap:14px;padding:26px}
.lay-grid .it .n{min-width:64px;height:64px;border-radius:14px 14px 14px 4px}
.lay-grid .h2{font-size:78px}
.lay-grid .tb tr:nth-child(odd) td{background:rgba(122,111,97,.07)}

.wrap>*{flex-shrink:0}
.lay-grid .wrap>.tag,.lay-grid .wrap>.h2{align-self:center;text-align:center}
.lay-grid .wrap>.tag:after{content:"";width:34px;height:3px;background:var(--rust);display:block}
.lay-grid .it{grid-template-columns:1fr!important;border-left:14px solid var(--rust);border-radius:16px;padding-right:110px}
.lay-grid .it .n{position:absolute;top:20px;right:20px;min-width:auto;height:auto;padding:8px 14px;border-radius:30px;font-size:22px}
.lay-grid .cmp{gap:0}.lay-grid .col.l{border-radius:30px 0 0 30px;border-right:none}.lay-grid .col.r{border-radius:0 30px 30px 0}
.lay-grid .tb{border-radius:0;border-left:none;border-right:none}
.lay-grid .ph{border-left:14px solid var(--rust);border-radius:16px}
/* EDITORIAL: no art on cover, giant outlined number, magazine rules; list without cards */
.lay-editorial.cover .art{display:none}
.lay-editorial.cover .wrap{justify-content:center;padding-top:150px}
.lay-editorial.cover .h1{font-size:118px;max-width:none}
.lay-editorial.cover .lead{max-width:640px}
.lay-editorial.cover .badge{width:auto;height:auto;border-radius:0;background:none;box-shadow:none;transform:none;top:auto;bottom:150px;right:50px;font:800 330px/.8 Bricolage;letter-spacing:-16px;color:transparent;-webkit-text-stroke:4px var(--amber);opacity:.55}
.lay-editorial.cover .badge span,.lay-editorial.cover .badge:after{display:none}
.lay-editorial.cover .hasb .h1{max-width:none}
.lay-editorial .lst{gap:0}
.lay-editorial .it{background:none!important;border:none;box-shadow:none;border-radius:0;padding:26px 0;border-top:2.5px solid currentColor;border-top-color:rgba(122,111,97,.35)}
.lay-editorial .it .n{background:none!important;color:var(--rust)!important;font:400 86px/.9 Serif;font-style:italic;min-width:92px;height:auto;padding:0;letter-spacing:-2px}
.lay-editorial .h2{font-size:84px;letter-spacing:-3px;padding-bottom:18px;border-bottom:6px solid var(--rust);align-self:flex-start}
.lay-editorial .cmp{grid-template-columns:1fr;gap:14px}
.lay-editorial .col{display:grid;grid-template-columns:200px 1fr;gap:6px 20px;align-items:start}
.lay-editorial .col h3{grid-row:span 9;margin:14px 0 0}
.lay-editorial .col p{padding:14px 0}
.lay-editorial .tb{border:none;background:none}.lay-editorial .tb th{background:none;color:var(--rust);border-bottom:4px solid var(--rust)}
/* NOTEBOOK: sticky notes, tape, marker highlights */
.lay-notebook.cover .h1 em{font-family:Bricolage;font-style:normal;font-weight:800;background:var(--amber);color:var(--ink);padding:0 16px;border-radius:12px;font-size:1em;letter-spacing:-4px}
.lay-notebook.cover .kick{transform:rotate(-2deg);background:var(--amber);color:var(--ink);border:none}
.lay-notebook.cover .art{transform:rotate(-3deg) scale(.92);transform-origin:50% 100%}
.lay-notebook .it,.lay-notebook .ph,.lay-notebook .col,.lay-notebook .note,.lay-notebook .qo{position:relative;background:#FFF8E1!important;border:none!important;box-shadow:0 14px 26px -12px rgba(60,40,10,.35)!important;color:var(--ink)}
.lay-notebook .it:nth-child(odd),.lay-notebook .col.l,.lay-notebook .qo:nth-child(odd){transform:rotate(-.7deg)}
.lay-notebook .it:nth-child(even),.lay-notebook .col.r,.lay-notebook .qo:nth-child(even){transform:rotate(.6deg)}
.lay-notebook .it:before,.lay-notebook .col:before{content:"";position:absolute;top:-14px;left:50%;width:120px;height:30px;margin-left:-60px;background:rgba(244,174,61,.55);transform:rotate(-3deg)}
.lay-notebook .it h4,.lay-notebook .col p,.lay-notebook .ph h4{color:var(--ink)!important}
.lay-notebook .it p,.lay-notebook .ph li{color:#4A4138!important}
.lay-notebook .col.r{background:#E7F4EC!important}.lay-notebook .col.r h3{color:var(--teal)}
.lay-notebook .it .n{border-radius:50%;background:var(--rust)!important;color:#fff!important}
.lay-notebook .h2 em{background:linear-gradient(transparent 58%,rgba(244,174,61,.65) 58%);color:inherit;padding:0 6px}
.lay-notebook .tb tr.hi td{background:linear-gradient(transparent 20%,rgba(244,174,61,.45) 20%,rgba(244,174,61,.45) 85%,transparent 85%);color:var(--ink)}


/* ===== MEGA-SHEET series (paper + marker look) ===== */
.mg.sp .spw{position:absolute;inset:0;padding:90px 86px 150px;display:flex;flex-direction:column;justify-content:center;gap:28px}
.sph .spl{display:inline-block;font:800 104px/1 Bricolage;letter-spacing:-3px;padding:10px 26px 16px;border-radius:18px;color:#141210}
.sph .spl.a{background:#FFC98A}.sph .spl.b{background:#8FD9B4}
.sph h3{font:700 40px/1.2 Inter;margin:26px 0 10px;letter-spacing:-.5px}
.sph ul{list-style:none;padding:0;margin:0}.sph li{font:500 36px/1.42 Inter;color:#2A2622}.sph li:before{content:"- "}
.sph p{font:500 36px/1.4 Inter;margin-top:12px;color:#141210}
.spd{border-top:4px dashed #3A3530;opacity:.55;margin:6px 0}
.mg.fl .flw{position:absolute;inset:0;padding:80px 80px 140px;display:flex;flex-direction:column}
.flw h2{font:400 76px/1.05 Marker,Kalam,cursive;color:#B3121B;margin:0}.flw .by{font:400 28px Hand,cursive;color:#6C6356;margin:6px 0 26px}
.fls{display:flex;flex-direction:column;align-items:stretch;flex:1;justify-content:center}
.fq{display:flex;align-items:center;gap:20px;background:#FFFDF6;border:3px solid #2B2824;border-radius:20px;padding:20px 22px;box-shadow:5px 6px 0 #2B2824}
.fqt{flex:1;font:700 34px/1.25 Inter;color:#1B1A17}
.fy{display:flex;align-items:center;gap:10px;font:700 30px/1.15 JBMono;color:#1D4E89;background:#DCEBFA;border-radius:14px;padding:12px 16px;max-width:46%}
.fy span{font:800 22px Inter;color:#fff;background:#12876F;border-radius:8px;padding:4px 10px;flex:none}
.fno{font:400 32px Hand,cursive;color:#B3121B;padding:6px 0 6px 34px}
.fel{align-self:flex-start;font:700 32px Inter;background:#FFC98A;border-radius:16px;padding:16px 22px}
.mg{position:relative;width:1080px;height:1350px;overflow:hidden;background:#F6F3EC;color:#1B1A17}
.mg .pap{position:absolute;inset:0;background:
 radial-gradient(ellipse at 20% 10%,rgba(255,255,255,.9),transparent 55%),
 radial-gradient(ellipse at 90% 80%,rgba(0,0,0,.05),transparent 50%),
 linear-gradient(115deg,transparent 48%,rgba(0,0,0,.035) 50%,transparent 52%),
 linear-gradient(35deg,transparent 60%,rgba(0,0,0,.03) 62%,transparent 64%)}
.mg .grain{opacity:.16;mix-blend-mode:multiply}
.mg .mk{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:120px 90px}
.mg .mkt{font:400 150px/1.02 Marker,Kalam,cursive;color:#B3121B;transform:rotate(-1.5deg);letter-spacing:-1px;text-wrap:balance}
.mg .mks{font:400 44px/1.3 Hand,cursive;color:#5B544B;margin-top:40px;max-width:820px}
.mg .sig{position:absolute;left:0;right:0;bottom:54px;display:flex;justify-content:space-between;padding:0 70px;font:400 30px Hand,cursive;color:#8A8276}
.mg .sig b{color:#B3121B;font-weight:400}
/* notebook sheet */
.mg.nb .pap:after{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(transparent 0 57px,rgba(60,90,160,.13) 57px 59px);background-position:0 30px}
.mg.nb .pap:before{content:"";position:absolute;top:0;bottom:0;left:92px;width:3px;background:rgba(200,40,40,.22)}
.shw{position:absolute;inset:0;padding:50px 70px 120px 120px;display:flex;flex-direction:column}
.shh{text-align:center;margin-bottom:26px}
.shh h2{font:700 96px/1 Kalam,cursive;letter-spacing:2px;text-transform:uppercase;color:#1B1A17}
.shh .rib{display:inline-block;margin-top:10px;background:#E9828A;color:#fff;font:700 32px Kalam;letter-spacing:3px;text-transform:uppercase;padding:6px 44px;position:relative}
.shh .rib:before,.shh .rib:after{content:"";position:absolute;top:10px;border:22px solid #D9636D;z-index:-1}
.shh .rib:before{left:-30px;border-left-color:transparent}.shh .rib:after{right:-30px;border-right-color:transparent}
.shh .by{font:400 30px Hand;color:#3A352E;margin-top:8px}
.shr{display:flex;flex-direction:column;gap:10px;flex:1;justify-content:space-between;min-height:0}
.sr{display:grid;grid-template-columns:62px 1fr;gap:2px 18px;align-items:center}
.sr .n{grid-row:span 2;width:56px;height:56px;border-radius:50%;background:#F4B6BB;color:#9E1B24;display:grid;place-items:center;font:700 32px Kalam}
.sr .nm{font:400 33px/1.05 Kalam;color:#1B1A17}
.fxl{display:flex;align-items:center;gap:12px;min-width:0}.fxl .fx{flex:0 1 auto;min-width:0}
.sdat{font:600 21px/1.35 JBMono;color:#4A443B;background:#FFF6D8;border:1.5px dashed #C9B98F;border-radius:8px;padding:6px 12px;margin-top:8px;display:inline-block}
.sph li.spc{font:600 27px/1.4 JBMono;color:#1D4E89;background:#DCEBFA;border-radius:10px;padding:8px 14px;margin:8px 0}.sph li.spc:before{content:""}
.rs{flex:none;font:700 24px/1.2 JBMono;color:#16603F;background:#DDF3E6;border-radius:8px;padding:5px 12px;white-space:nowrap}
.sr .fx{justify-self:start;border:2.6px solid #2B2824;border-radius:4px;padding:4px 16px;font:400 29px/1.2 Hand;color:#1B1A17;background:rgba(255,255,255,.55);transform:rotate(-.3deg);max-width:100%}
.sr:nth-child(even) .fx{transform:rotate(.35deg)}
/* big table */
.mg.bt{background:#F4F4F1}
.btw{position:absolute;inset:0;padding:56px 50px 96px;display:flex;flex-direction:column}
.bth{text-align:center;margin-bottom:18px}
.bth h2{display:inline-block;background:#35C889;color:#0E2A1C;font:800 92px/1 Bricolage;letter-spacing:-2px;padding:14px 46px;border-radius:24px}
.bth .by{font:500 28px Inter;color:#44413B;margin-top:14px}
.btt{width:100%;border-collapse:collapse;background:#fff;border:2px solid #222}
.btt th{background:#1D1D1D;color:#fff;font:700 22px Inter;padding:12px 14px;text-align:left}
.btt td{font:500 23px/1.25 Inter;padding:12px 14px;border-top:1.5px solid #D4D4D0;vertical-align:top}
.btt td.i{width:46px;color:#777;font-weight:700;text-align:center}
.btt td.q{font-weight:600;width:52%}
.btt td.a{font-family:JBMono;font-size:20px;color:#1F5C42}
.btt tr:nth-child(even) td{background:#F7F7F4}


/* kids explainer sheet */
.mg.kd{background:#FBF1DC}
.kdw{position:absolute;inset:0;padding:46px 46px 120px;display:flex;flex-direction:column}
.kdh{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px;margin-bottom:22px}
.kdh h2{font:800 118px/0.9 Bricolage;letter-spacing:-4px;color:#1B1A17}
.kdh h2 span{display:inline-block;background:#FFC93C;padding:0 18px;border-radius:14px;transform:rotate(-2deg)}
.kdh h3{font:700 60px/1 Kalam;color:#1B1A17;margin-top:8px}
.kdh .by{font:400 28px Hand;color:#6C6356;margin-top:6px}
.kdh .masc{width:220px;height:220px;object-fit:cover;border-radius:28px;border:6px solid #fff;transform:rotate(3deg);box-shadow:0 12px 24px rgba(80,50,10,.25);filter:drop-shadow(0 10px 14px rgba(80,50,10,.25))}
.kdg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;flex:1;min-height:0}
.kc{position:relative;background:#FFFDF6;border:3px solid #2B2824;border-radius:20px;overflow:hidden;display:flex;flex-direction:column;box-shadow:5px 6px 0 #2B2824}
.kc .kt{font:800 38px/1.05 Bricolage;letter-spacing:-1px;padding:12px 16px 8px;color:#1B1A17}
.kc .kb{font:400 29px/1.28 Kalam;color:#2E2A25;padding:0 16px 10px}
.kc .kemo{font:104px/1 'Noto Color Emoji';text-align:center;white-space:nowrap;letter-spacing:-2px;margin:auto 0 16px;filter:drop-shadow(0 6px 8px rgba(80,50,10,.18))}.kc .kemo.k2{font-size:96px;letter-spacing:-6px}
.kc img{width:165px;height:165px;object-fit:contain;align-self:center;margin:auto 0 8px 0;mix-blend-mode:multiply}
.kc .kx{align-self:flex-start;margin:0 14px;font:700 19px/1.3 JBMono;color:#1D4E89;background:#DCEBFA;border-radius:10px;padding:7px 10px;overflow-wrap:anywhere}
.kc:nth-child(6n+1) .kt{background:#FFD8A8}.kc:nth-child(6n+2) .kt{background:#C9F2D5}.kc:nth-child(6n+3) .kt{background:#D8E3FF}
.kc:nth-child(6n+4) .kt{background:#FFD1DC}.kc:nth-child(6n+5) .kt{background:#FFF1A8}.kc:nth-child(6n+6) .kt{background:#E3D5FF}

/* ===== post styles ===== */
.terra.cover,.terra.cta,.terra.p2{background:linear-gradient(160deg,#D9581F 0%,#B2401A 55%,#7E2A10 100%);color:#FFF6EA}
.terra .glow{display:none}
.terra.dark .grid{background-image:linear-gradient(rgba(255,246,234,.08) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,246,234,.08) 1.5px,transparent 1.5px)}
.terra .h1 em,.terra.cta .h1 em{color:#1B0F08}
.terra .kick{color:#FFF6EA;border-color:rgba(255,246,234,.5);background:rgba(255,246,234,.1)}
.terra .badge{background:#16110D;color:#F4AE3D;box-shadow:0 20px 50px rgba(0,0,0,.35)}
.terra .lead{color:#FFE7D4}
.terra .av{background:#16110D;color:#F4AE3D;box-shadow:0 0 0 3px #C9491B,0 0 0 6px #FFF6EA}
.terra .prog i.on{background:#FFF6EA}.terra .prog i{background:rgba(255,246,234,.25)}
.terra .swipe .nx,.terra .nx{background:#16110D}
.terra .cbox{background:rgba(22,17,13,.55)}.terra .dm{background:#16110D}
.terra .hs{color:#FFD9C0}
.pap.cover,.pap.cta,.pap.p2{background:#FFFDF9;color:var(--ink)}
.pap.cover .grid,.pap.cta .grid{background-image:radial-gradient(rgba(18,17,16,.14) 2px,transparent 2.5px);background-size:36px 36px}
.pap .h1 em{color:var(--rust)}
.pap .kick{color:var(--ink);border-color:var(--ink);background:none}
.pap .lead{color:#4A4138}
.pap .swipe{background:var(--ink)}
.pap.cta .cbox{background:var(--ink)}
.pap.cta .act{background:var(--ink);color:var(--cream)}
.terra .art>div:last-child>div:first-child{background:#16110D!important;color:#F4AE3D!important}
.mid.cover .glow:first-child{background:#1F8A7A!important}

/* ===== themes for variety ===== */
.t-ink{background:var(--ink);color:var(--cream)}
.t-ink .h2,.t-ink .ph h4,.t-ink .it h4{color:var(--cream)}
.t-ink .h2 em{color:var(--amber)}
.t-ink .tag{color:var(--amber)}.t-ink .tag:before{background:var(--amber)}
.t-ink .it,.t-ink .ph,.t-ink .note,.t-ink .bl div,.t-ink .col.l,.t-ink .tb{background:#1D1A16;border-color:rgba(250,243,230,.10);box-shadow:0 24px 50px -20px rgba(0,0,0,.6)}
.t-ink .it p,.t-ink .ph li,.t-ink .note,.t-ink .lead{color:#CFC3B2}
.t-ink .it .n{background:var(--rust);color:#fff}
.t-ink .it .cw{background:#0C0B0A;border:1.5px solid rgba(250,243,230,.08)}
.t-ink .col.r{background:var(--rust);border-color:var(--rust)}.t-ink .col.r h3{color:#fff}.t-ink .col.r .dot{background:#fff;color:var(--rust)}
.t-ink .col.l p{color:#9C8F7D}.t-ink .ph:before{background:var(--ink)}
.t-ink .tb td{border-color:rgba(250,243,230,.08);color:var(--cream)}.t-ink .tb th{background:var(--rust);color:#fff}
.t-ink .bigN{-webkit-text-stroke-color:var(--amber)}
.t-clay{background:#EFD8C4}
.t-clay .grid{background-image:linear-gradient(rgba(160,60,20,.08) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(160,60,20,.08) 1.5px,transparent 1.5px)}
.t-clay .it,.t-clay .ph,.t-clay .note,.t-clay .bl div,.t-clay .col.l,.t-clay .tb{background:#FFFBF5;border-color:rgba(160,60,20,.14)}
.t-clay .it .n{background:var(--rust);color:#fff;border-radius:50%;min-width:78px;height:78px}
.t-clay .tb th{background:var(--rust);color:#fff}
.t-clay .prog i{background:rgba(160,60,20,.15)}
.t-white{background:#FFFDF9}
.t-white .grid{background-image:radial-gradient(rgba(18,17,16,.13) 2px,transparent 2.5px);background-size:36px 36px}
.t-white .lst{gap:0}
.t-white .it{background:none;border:none;box-shadow:none;border-radius:0;padding:30px 0;border-top:3px dashed rgba(122,111,97,.28)}
.t-white .it:first-child{border-top:none}
.t-white .it .n{background:none;color:transparent;-webkit-text-stroke:2.5px var(--rust);font:800 72px/1 Bricolage;letter-spacing:-3px;min-width:96px;height:auto;padding:0}
.t-white .it .cw{background:var(--ink)}
.wm{position:absolute;right:-30px;bottom:40px;font:800 520px/.8 Bricolage;letter-spacing:-30px;color:transparent;-webkit-text-stroke:3px rgba(224,86,31,.13);z-index:0;pointer-events:none}
.t-ink .wm{-webkit-text-stroke-color:rgba(244,174,61,.10)}
.wrap{z-index:2}

pre,td,th,.pg,.pill,.tag,.kick,.rg,.inp{font-variant-ligatures:none!important;font-feature-settings:"calt" 0,"liga" 0,"dlig" 0!important}
.act{margin-top:48px;align-self:flex-start;display:flex;gap:14px;align-items:center;background:var(--cream);color:var(--ink);font:700 32px Inter;padding:24px 36px;border-radius:60px}

/* ===== LIGHT-ONLY OVERRIDES (owner rule: no dark themes) ===== */
.emb.cover,.emb.cta,.emb.p2{background:linear-gradient(165deg,#FFF6EA 0%,#FBE9D4 100%)}
.emb .h1 em{color:var(--rust)}
.mist.cover,.mist.cta,.mist.p2{background:linear-gradient(165deg,#F4F8F9 0%,#E3EEF0 100%)}
.mist .h1 em,.t-mist .h2 em{color:var(--teal)}
.mist .badge{background:var(--teal);box-shadow:0 20px 50px rgba(18,135,111,.35)}
.mist .prog i.on,.t-mist .prog i.on{background:var(--teal)}
.t-mist{background:#EEF4F5}
.t-mist .grid{background-image:linear-gradient(rgba(18,90,100,.07) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(18,90,100,.07) 1.5px,transparent 1.5px)}
.t-mist .it,.t-mist .ph,.t-mist .note,.t-mist .bl div,.t-mist .col.l,.t-mist .tb{background:#FFFFFF;border-color:#D5E3E6}
.t-mist .tag{color:var(--teal)}.t-mist .tag:before{background:var(--teal)}
.t-mist .it .n,.t-mist .ph .rg,.t-mist .tb th{background:var(--teal)!important;color:#fff!important}
.t-mist .bl .ck{background:var(--teal)}
.terl.cover,.terl.cta,.terl.p2{background:linear-gradient(165deg,#FBE7D6 0%,#F3D2B8 100%)}
.terl .h1 em{color:#B2401A}
.terl .grid{background-image:linear-gradient(rgba(160,60,20,.08) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(160,60,20,.08) 1.5px,transparent 1.5px)!important;background-size:54px 54px!important}
/* components that used to be dark */
.ui{background:#FFFDF8;border:2px solid rgba(18,17,16,.09);color:var(--ink);box-shadow:0 30px 60px -20px rgba(60,40,20,.35)}
.ui .bar{background:#F4EEE3;border-bottom:1px solid #E6DDCE}
.it .cw,.t-white .it .cw,.code,.qo pre{background:#F8F3EA;border:2px solid #E7DDCC;box-shadow:none}
.it .cw pre,.code td,.ui pre,.qo pre{color:#2B2622}
.code .bar{background:#EFE7DA;border-bottom:1px solid #E1D6C4}
.code .bar span{background:#E6DCCB;color:#6F6456}
.code td.ln{color:#B5A895}
.kw{color:#C2410C}.st{color:#2F7A3A}.cm{color:#9A8F80}.fn{color:#1D6FA3}.nu{color:#A86A0C}
.cbox,.pap.cta .cbox,.terra .cbox{background:#FFFFFF;border:2px solid #E6DCCB;box-shadow:0 24px 50px -20px rgba(60,40,20,.3)}
.cm1 .av{background:#EFE7DA;color:#6F6456}
.inp{border-color:rgba(18,17,16,.15);color:var(--ink)}
.act,.pap.cta .act{background:var(--rust);color:#fff}
.swipe,.pap .swipe{background:#FFFFFF;color:var(--ink);border:2px solid rgba(18,17,16,.1);box-shadow:0 12px 30px -12px rgba(60,40,20,.35)}
.col.r{background:#E7F4EC;border-color:#CBE6D6;color:var(--ink)}.col.r h3{color:var(--teal)}
.it .n{background:var(--rust);color:#fff}
.ph .rg{background:var(--rust);color:#fff}
.tb th{background:var(--rust);color:#fff}
.prod{background:var(--paper);color:var(--ink)}
.prod .feat div{background:var(--card);border-color:var(--line)}
.pap.p2 .p2k{background:var(--amber);color:var(--ink)}
.pap.p2 .p2buy{background:#FFFFFF;color:var(--ink);border:2px solid #E6DCCB}.pap.p2 .p2buy .by{color:#6F6456}
.pap.p2 .p2ph,.pap.p2 .p2st{background:rgba(255,255,255,.7);border-color:#E3D8C7}
.mist.p2 .p2ph span,.mist.p2 .p2st .v{color:var(--teal)}
"""

CSS += r"""
/* ===== v3 series look: progress bar, cover with inside-page fan, VS cards ===== */
.mg .sig3{bottom:44px;align-items:center;gap:26px;padding:0 64px;font:400 30px Hand,cursive;color:#7C7468}
.sig3 .dots{flex:1;display:flex;gap:6px;max-width:420px}
.sig3 .dots i{flex:1;height:6px;border-radius:6px;background:rgba(27,26,23,.12)}
.sig3 .dots i.on{background:#B3121B}
.sig3 .pg{display:flex;align-items:center;gap:8px;font:700 24px JBMono;letter-spacing:1px;color:#1B1A17}
.sig3 .pg .ic{color:#B3121B}
/* cover */
.mc3 .cv3{position:absolute;inset:0;padding:56px 64px 48px}
.cvtop{display:flex;justify-content:space-between;align-items:center}
.cvtop .who{display:flex;align-items:center;gap:14px;font:700 30px Inter;color:#1B1A17}
.cvtop .who .av{width:64px;height:64px;border-radius:50%;background:#1B1A17;color:#FFC93C;display:grid;place-items:center;font:800 24px Bricolage;letter-spacing:1px;box-shadow:0 0 0 4px #F6F3EC,0 0 0 7px #B3121B}
.cvtop .who .ic{color:#2F7DE1}
.cvtop .chip{display:flex;align-items:center;gap:10px;font:700 22px JBMono;letter-spacing:1.5px;text-transform:uppercase;color:#1B1A17;border:2.5px solid #1B1A17;border-radius:40px;padding:12px 22px;background:rgba(255,255,255,.6)}
.cvh{position:absolute;left:64px;right:64px;top:170px}
.mc3 .mkt{font:400 138px/1.0 Marker,Kalam,cursive;color:#B3121B;transform:rotate(-1.5deg);transform-origin:left top;letter-spacing:-1px;text-wrap:balance;text-align:left}
.mc3 .mkt em{font-family:Marker,Kalam,cursive;font-weight:400;font-style:normal;color:#1B1A17;background:linear-gradient(104deg,transparent 2%,#FFE15A 4%,#FFD12E 92%,transparent 96%);background-size:100% 62%;background-position:0 78%;background-repeat:no-repeat;padding:0 10px;margin:0 -6px}
.mc3 .mks{font:400 44px/1.25 Hand,cursive;color:#3F3A33;margin-top:30px;max-width:860px;text-align:left}
.mc3.nofan .cvh{top:300px}
.mc3.nofan .stk{bottom:240px}
.fan{position:absolute;left:0;right:0;bottom:150px;height:470px}
.fan img{position:absolute;bottom:0;width:316px;height:395px;object-fit:cover;object-position:top;border-radius:18px;border:7px solid #fff;box-shadow:0 26px 50px -12px rgba(60,40,10,.45),0 2px 0 rgba(0,0,0,.05)}
.fan .f0{left:92px;transform:rotate(-9deg);z-index:1}
.fan .f1{left:382px;bottom:46px;transform:rotate(-1deg);z-index:3}
.fan .f2{left:668px;transform:rotate(8deg);z-index:2}
.fan.n2 .f0{left:230px}.fan.n2 .f1{left:520px;transform:rotate(7deg)}
.stk{position:absolute;right:54px;bottom:500px;width:196px;height:196px;border-radius:50%;background:#FFD12E;color:#1B1A17;display:grid;place-items:center;text-align:center;transform:rotate(12deg);box-shadow:0 14px 30px -10px rgba(120,80,0,.55);z-index:5}
.stk:before{content:"";position:absolute;inset:10px;border-radius:50%;border:3px dashed rgba(27,26,23,.45)}
.stk span{font:800 40px/0.95 Bricolage;letter-spacing:-1px;text-transform:uppercase}
.cvbot{position:absolute;left:64px;right:64px;bottom:52px;display:flex;justify-content:space-between;align-items:center;gap:20px}
.kwc{display:flex;align-items:center;gap:12px;font:600 30px Inter;color:#1B1A17;background:#fff;border:2.5px solid #1B1A17;border-radius:18px;padding:16px 22px;box-shadow:5px 6px 0 #1B1A17}
.kwc b{font:800 30px JBMono;color:#B3121B;letter-spacing:1px}
.swp{display:flex;align-items:center;gap:12px;font:800 32px Bricolage;color:#fff;background:#B3121B;border-radius:40px;padding:18px 30px;box-shadow:0 14px 28px -10px rgba(179,18,27,.6)}
/* VS cards */
.mg.sp3{background:#F7F4EE}
.s3w{position:absolute;inset:0;padding:64px 64px 130px;display:flex;flex-direction:column;gap:20px}
.s3h{display:flex;align-items:center;gap:22px;margin-bottom:8px}
.s3n{font:800 30px JBMono;color:#fff;background:#B3121B;border-radius:14px;padding:10px 16px;letter-spacing:1px}
.s3h h2{font:800 66px/1.02 Bricolage;letter-spacing:-2px;color:#1B1A17;margin:0;text-wrap:balance}
.s3c{position:relative;border-radius:30px;padding:30px 36px 32px;border:3px solid #1B1A17;box-shadow:8px 10px 0 #1B1A17;flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0}
.s3c.a{background:#FFF0DA}.s3c.b{background:#E2F5EA}
.s3l{align-self:flex-start;font:800 52px/1 Bricolage;letter-spacing:-1.5px;color:#1B1A17;padding:8px 20px 12px;border-radius:14px;margin-bottom:16px}
.s3c.a .s3l{background:#FFC27A}.s3c.b .s3l{background:#86DDB0}
.s3c h4{font:700 34px/1.2 Inter;margin:0 0 10px;color:#1B1A17}
.s3c ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.s3c li{display:flex;gap:14px;align-items:flex-start;font:500 35px/1.3 Inter;color:#26221E}
.s3c li .ic{flex:none;margin-top:4px;color:#12876F}
.s3c.a li .ic{color:#D9771F}
.s3c li.spc{display:block;font:600 27px/1.4 JBMono;color:#1D4E89;background:#fff;border:2px solid #BCD6F5;border-radius:12px;padding:10px 16px}
.s3c p{display:flex;gap:10px;align-items:center;margin:16px 0 0;font:700 32px/1.25 Inter;color:#1B1A17}
.s3c p .ic{color:#B3121B;flex:none}
.s3vs{align-self:center;margin:-38px 0;z-index:3;width:92px;height:92px;border-radius:50%;background:#1B1A17;color:#FFD12E;display:grid;place-items:center;font:800 34px Bricolage;letter-spacing:1px;box-shadow:0 0 0 8px #F7F4EE}
"""

CSS += r"""
/* ===== v4 brand system ===== */
.mono{width:64px;height:64px;flex:none;filter:drop-shadow(0 4px 8px rgba(27,26,23,.25))}
.sig3 .h{display:flex;align-items:center;gap:10px}.sig3 .h .mono{width:38px;height:38px;filter:none}
.bth h2{background:linear-gradient(100deg,transparent 1%,#FFD12E 3%,#FFD12E 97%,transparent 99%)!important;color:#1B1A17!important}
.btt th{background:#1B1A17!important;color:#FFD12E!important}
.btt tr:nth-child(even) td{background:rgba(255,209,46,.09)}
/* product */
.mprod{background:#F6F3EC}
.mpw{position:absolute;inset:0;padding:74px 64px 120px;display:flex;flex-direction:column;gap:30px}
.mpk{align-self:flex-start;display:flex;align-items:center;gap:10px;font:700 22px JBMono;letter-spacing:2px;text-transform:uppercase;background:#FFD12E;color:#1B1A17;padding:12px 22px;transform:rotate(-1.5deg);box-shadow:0 8px 18px -8px rgba(120,80,0,.5)}
.mpt{font:400 124px/1.0 Marker,Kalam,cursive;color:#B3121B;letter-spacing:-1px;transform:rotate(-1deg);transform-origin:left}
.mpt em{font-family:Marker,Kalam,cursive;font-style:normal;color:#1B1A17;background:linear-gradient(100deg,transparent 2%,#FFE15A 4%,#FFD12E 94%,transparent 97%);background-size:100% 60%;background-position:0 80%;background-repeat:no-repeat;padding:0 8px}
.mpb{font:500 34px/1.35 Inter;color:#3A352E;max-width:900px}
.mproad{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:8px}
.mproad .line{position:absolute;left:6%;right:6%;top:62px;border-top:5px dashed #B3121B;opacity:.7}
.mpp{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;position:relative}
.mpp .d{font:700 21px JBMono;color:#7C7468;letter-spacing:1px}
.mpp .dot{width:30px;height:30px;border-radius:50%;background:#B3121B;box-shadow:0 0 0 8px #F6F3EC,0 0 0 11px #B3121B}
.mpp b{font:800 30px/1.1 Bricolage;color:#1B1A17}
.mpg{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.mps{background:#fff;border:3px solid #1B1A17;border-radius:22px;padding:26px 24px;box-shadow:6px 7px 0 #1B1A17;display:flex;align-items:center;gap:18px}
.mps b{font:400 70px/1 Marker,Kalam,cursive;color:#B3121B;min-width:150px}
.mps span{font:600 27px/1.25 Inter;color:#26221E}
.mpbuy{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:18px;background:#1B1A17;color:#fff;border-radius:26px;padding:24px 28px;text-decoration:none}
.mpbuy .bt{font:800 36px/1.1 Bricolage}.mpbuy .by{font:500 22px Inter;color:#C9C2B6;margin-top:6px}
.mpbuy .go{flex:none;display:flex;align-items:center;gap:10px;background:#FFD12E;color:#1B1A17;font:800 30px Bricolage;border-radius:40px;padding:16px 26px}
/* cta */
.mcta{background:#F6F3EC}
.mcw{position:absolute;inset:0;padding:96px 70px 120px;display:flex;flex-direction:column}
.mct{font:400 150px/0.98 Marker,Kalam,cursive;color:#B3121B;transform:rotate(-1.5deg);transform-origin:left;letter-spacing:-1px}
.mct em{font-family:Marker,Kalam,cursive;font-style:normal;color:#1B1A17;background:linear-gradient(100deg,transparent 2%,#FFE15A 4%,#FFD12E 94%,transparent 97%);background-size:100% 58%;background-position:0 82%;background-repeat:no-repeat;padding:0 10px}
.mcb{font:400 46px/1.25 Hand,cursive;color:#3A352E;margin-top:26px;max-width:720px}
.mcw .doodle{position:absolute;right:120px;top:470px;width:200px;transform:rotate(8deg)}
.igc{margin-top:70px;background:#fff;border:3px solid #1B1A17;border-radius:30px;padding:26px;box-shadow:8px 10px 0 #1B1A17;display:flex;flex-direction:column;gap:22px}
.igr{display:flex;align-items:center;gap:16px}
.igr .you{width:64px;height:64px;border-radius:50%;background:#ECE6DA;display:grid;place-items:center;font:700 20px Inter;color:#6C6356;flex:none}
.igi{flex:1;border:2.5px solid #D9D3C7;border-radius:40px;padding:20px 26px;font:800 50px JBMono;color:#1B1A17;letter-spacing:1px;display:flex;align-items:center}
.igi .car{display:inline-block;width:4px;height:42px;background:#B3121B;margin-left:6px}
.igr .post{font:800 30px Inter;color:#0095F6}
.dmr{display:flex;gap:16px;align-items:flex-end}
.dmr .mono{width:58px;height:58px}
.bub{background:#F1EEE8;border-radius:28px 28px 28px 8px;padding:20px 22px;display:flex;flex-direction:column;gap:14px;flex:1}
.bub .bt{font:600 34px Inter;color:#1B1A17}
.file{display:flex;align-items:center;gap:18px;background:#fff;border:2px solid #E2DCD0;border-radius:18px;padding:20px 22px;color:#B3121B}
.file b{display:block;font:700 31px Inter;color:#1B1A17}.file span{font:600 25px JBMono;color:#7C7468}
.mca{margin-top:auto;display:flex;gap:16px}
.mca span{flex:1;justify-content:center;white-space:nowrap;display:flex;align-items:center;gap:12px;font:800 31px Bricolage;border-radius:40px;padding:20px 24px}
.mca .fol{background:#B3121B;color:#fff;box-shadow:0 14px 28px -10px rgba(179,18,27,.6)}
.mca .msh{border:3px solid #1B1A17;color:#1B1A17;background:#fff}
"""

KW = r"\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|FULL JOIN|ON|AS|AND|OR|NOT|IN|IS|NULL|HAVING|LIMIT|OFFSET|OVER|PARTITION BY|ROWS BETWEEN|PRECEDING|CURRENT ROW|CASE|WHEN|THEN|ELSE|END|WITH|DISTINCT|UNION|ALL|DESC|ASC|INTERVAL|import|from|def|return|for|in|if|elif|else|print|lambda|True|False|None|as|with|class|VAR|RETURN)\b"

def inl(t):
    t = html.escape(t or "", quote=False).replace("&lt;br&gt;", "<br>")
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"~(.+?)~", r"<em>\1</em>", t)

def hl(code, lang):
    out = []
    cmt = {"sql": "--", "python": "#", "dax": "//"}.get(lang)
    for raw in code.split("\n"):
        cm = ""
        if cmt:
            q = False
            for i, ch in enumerate(raw):
                if ch in "'\"": q = not q
                if not q and raw.startswith(cmt, i):
                    cm = f'<span class="cm">{html.escape(raw[i:], quote=False)}</span>'; raw = raw[:i]; break
        parts = re.split(r"('[^']*'|\"[^\"]*\")", raw)
        line = ""
        for j, part in enumerate(parts):
            e = html.escape(part, quote=False)
            if j % 2:
                line += f'<span class="st">{e}</span>'; continue
            if lang in ("excel", "dax"):
                e = re.sub(r"\b([A-Z][A-Z0-9.]{1,})(?=\()", r'<span class="fn">\1</span>', e)
                if lang == "dax": e = re.sub(r"\b(VAR|RETURN)\b", r'<span class="kw">\1</span>', e)
            else:
                e = re.sub(KW, r'<span class="kw">\1</span>', e)
                e = re.sub(r"\b([A-Za-z_]+)(?=\()", lambda m: m.group(0) if '<' in m.group(0) else f'<span class="fn">{m.group(1)}</span>', e)
            e = re.sub(r"(?<![\w#&])(\d+(?:\.\d+)?)(?![\w;])", r'<span class="nu">\1</span>', e)
            line += e
        out.append(line + cm)
    return out

def br(code, lang):
    return "<br>".join(hl(code.replace("|", chr(10)), lang))

def dots():
    return '<i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i>'

# ---------- cover art ----------
def art(kind):
    if kind == "sql":
        return f'''<div class="art">
<div class="ui" style="left:60px;bottom:110px;width:560px;transform:rotateY(14deg) rotateX(6deg) rotate(-3deg)">
<div class="bar">{dots()}<span>query.sql</span></div>
<pre>{br("SELECT dept, name, salary|FROM employees|WHERE rk = 2;", "sql")}</pre></div>
<div class="ui light" style="right:60px;bottom:40px;width:470px;transform:rotateY(-12deg) rotateX(6deg) rotate(3deg)">
<div class="bar">{dots()}<span>result · 3 rows</span></div>
<table class="mini"><tr><th>dept</th><th>name</th><th>salary</th></tr><tr><td>Sales</td><td>Riya</td><td>82K</td></tr><tr class="hi"><td>Data</td><td>Aman</td><td>95K</td></tr><tr><td>HR</td><td>Neha</td><td>61K</td></tr></table></div></div>'''
    if kind == "powerbi":
        bars = "".join(f'<div style="flex:1;height:{h}%;border-radius:10px 10px 4px 4px;background:{c}"></div>' for h, c in [(45,"#E3D8C7"),(62,"#E3D8C7"),(52,"#E3D8C7"),(78,"#F4AE3D"),(70,"#E3D8C7"),(96,"#E0561F")])
        return f'''<div class="art">
<div class="ui light" style="left:70px;bottom:70px;width:600px;height:400px;transform:rotateY(14deg) rotateX(8deg) rotate(-3deg)">
<div class="bar">{dots()}<span>Sales Dashboard.pbix</span></div>
<div style="display:flex;gap:16px;padding:22px 24px 0">
<div style="flex:1;background:#F4EEE3;border-radius:16px;padding:14px 18px"><div style="font:600 16px JBMono;color:#8C8070">REVENUE</div><div style="font:800 40px Bricolage;letter-spacing:-1px">₹4.2Cr</div></div>
<div style="flex:1;background:#F4EEE3;border-radius:16px;padding:14px 18px"><div style="font:600 16px JBMono;color:#8C8070">YoY</div><div style="font:800 40px Bricolage;color:#12876F;letter-spacing:-1px">+18.4%</div></div></div>
<div style="display:flex;align-items:flex-end;gap:14px;height:190px;padding:18px 24px">{bars}</div></div>
<div class="ui" style="right:70px;bottom:150px;width:420px;transform:rotateY(-14deg) rotateX(6deg) rotate(4deg)">
<div class="bar">{dots()}<span>measure.dax</span></div>
<pre style="font-size:22px">{br("YoY % =|DIVIDE(|  [Sales] - [Sales LY],|  [Sales LY])", "dax")}</pre></div></div>'''
    if kind == "python":
        return f'''<div class="art">
<div class="ui" style="left:60px;bottom:90px;width:600px;transform:rotateY(14deg) rotateX(6deg) rotate(-3deg)">
<div class="bar">{dots()}<span>analysis.py</span></div>
<pre>{br("import pandas as pd|df = pd.read_csv('sales.csv')|df.groupby('city')['rev'].sum()", "python")}</pre></div>
<div class="ui light" style="right:60px;bottom:40px;width:400px;transform:rotateY(-12deg) rotateX(6deg) rotate(3deg)">
<div class="bar">{dots()}<span>Out [3]</span></div>
<table class="mini"><tr><th>city</th><th>rev</th></tr><tr><td>Pune</td><td>4.1L</td></tr><tr class="hi"><td>Indore</td><td>6.8L</td></tr><tr><td>Patna</td><td>3.2L</td></tr></table></div></div>'''
    if kind == "excel":
        cells = "".join(f'<tr><td style="color:#8C8070">{i}</td><td>{a}</td><td>{b}</td><td>{c}</td></tr>' for i, (a, b, c) in enumerate([("Order","Region","Amount"),("1021","North","12,400"),("1022","South","8,950"),("1023","North","15,200")], 1))
        return f'''<div class="art">
<div class="ui light" style="left:70px;bottom:60px;width:640px;transform:rotateY(14deg) rotateX(8deg) rotate(-3deg)">
<div class="bar">{dots()}<span>Book1.xlsx</span></div>
<div style="display:flex;gap:12px;align-items:center;padding:14px 20px;border-bottom:1px solid #E6DDCE;font:600 22px JBMono"><span style="color:#12876F;font-style:italic">fx</span><span>{"".join(hl('=SUMIFS(C:C, B:B, "North")', "excel"))}</span></div>
<table class="mini">{cells}<tr class="hi"><td>5</td><td>Total</td><td>North</td><td>27,600</td></tr></table></div>
<div class="badge" style="position:absolute;right:90px;bottom:300px;top:auto;width:150px;height:150px;font-size:34px;background:#12876F;transform:rotate(-8deg)">fx</div></div>'''
    if kind == "roadmap":
        steps = [("Excel","file-spreadsheet"),("SQL","database"),("Power BI","layout-dashboard"),("Python","code-xml"),("Hired","trophy")]
        pts = [(110,420),(300,300),(500,360),(700,230),(900,110)]
        path = "M " + " L ".join(f"{x} {y}" for x, y in pts)
        nodes = "".join(f'<div style="position:absolute;left:{x-58}px;top:{y-58}px;width:116px;text-align:center"><div style="width:116px;height:116px;border-radius:32px;background:{"#E0561F" if i==4 else "#1F1C18"};border:2px solid rgba(250,243,230,.14);display:grid;place-items:center;color:{"#fff" if i==4 else "#F4AE3D"};box-shadow:0 20px 40px rgba(0,0,0,.5)">{icon(ic,52,2)}</div><div style="font:700 24px Inter;color:#FAF3E6;margin-top:12px">{n}</div></div>' for i, ((n, ic), (x, y)) in enumerate(zip(steps, pts)))
        return f'''<div class="art"><svg width="1080" height="560" style="position:absolute;left:0;top:0"><path d="{path}" fill="none" stroke="#F4AE3D" stroke-width="5" stroke-dasharray="16 14" stroke-linecap="round" opacity=".7"/></svg>{nodes}</div>'''
    # career / default
    return f'''<div class="art">
<div class="ui light" style="left:90px;bottom:70px;width:560px;transform:rotateY(14deg) rotateX(8deg) rotate(-3deg);padding:0 0 26px">
<div class="bar">{dots()}<span>Offer_Letter.pdf</span></div>
<div style="padding:26px 30px"><div style="font:800 40px Bricolage;letter-spacing:-1px">Data Analyst</div><div style="font:500 22px Inter;color:#7A6F61;margin-top:6px">Full-time · Bengaluru</div>
<div style="height:14px;background:#F0E8DA;border-radius:8px;margin-top:22px"></div><div style="height:14px;width:70%;background:#F0E8DA;border-radius:8px;margin-top:12px"></div></div></div>
<div class="ui" style="right:80px;bottom:200px;width:360px;padding:24px 28px;transform:rotateY(-14deg) rotate(4deg);display:flex;gap:18px;align-items:center">
<div style="width:64px;height:64px;border-radius:18px;background:#12876F;display:grid;place-items:center;color:#fff">{icon("badge-check",36)}</div>
<div><div style="font:700 26px Inter">Interview cleared</div><div style="font:500 20px JBMono;color:#A89C8B">Round 3 of 3</div></div></div></div>'''

# ---------- slides ----------
def chrome(i, n, series, dark):
    prog = "".join(f'<i class="{"on" if k < i else ""}"></i>' for k in range(n))
    return (f'<div class="top"><div class="who"><div class="av">DG</div><div><div class="hn">thedataguy16 {icon("badge-check",24,2.4)}</div>'
            f'<div class="hs">Data analytics · Jobs</div></div></div><div class="pill">{html.escape(series)}</div></div><div class="prog">{prog}</div>')

def foot(i, n, dark):
    last = i == n
    right = (f'<div class="save">{icon("bookmark",28)} Save this</div>' if not last else f'<div class="save">{icon("repeat-2",28)} Share it</div>')
    return (f'<div class="foot"><div class="pg"><b>{i:02d}</b> / {n:02d}</div><div class="fr">{right}'
            + ("" if last else f'<div class="nx">{icon("arrow-right",34,2.6)}</div>') + '</div></div>')

def body(s):
    t = s["type"]
    if t == "cover":
        k = f'<div class="kick">{icon("sparkles",24)}{inl(s.get("kicker",""))}</div>' if s.get("kicker") else ""
        bd = ""
        if s.get("badge"):
            parts = s["badge"].split(" ", 1)
            bd = f'<div class="badge">{html.escape(parts[0])}<span>{html.escape(parts[1]) if len(parts)>1 else ""}</span></div>'
        return "dark cover", True, f'{bd}<div class="wrap{" hasb" if bd else ""}">{k}<div class="h1">{inl(s["title"])}</div><div class="lead">{inl(s.get("sub",""))}</div></div>{art(s.get("art","career"))}'
    if t == "list":
        lang = s.get("lang", "sql")
        its = ""
        for x in s["items"]:
            n = f'<div class="n">{html.escape(str(x["n"]).zfill(2))}</div>' if x.get("n") is not None else f'<div class="n icn">{icon(x.get("icon","check"),38)}</div>'
            c = f'<div class="cw"><pre>{"<br>".join(hl(x["code"], lang))}</pre></div>' if x.get("code") else ""
            its += f'<div class="it">{n}<div><h4>{inl(x["h"])}</h4>' + (f'<p>{inl(x["b"])}</p>' if x.get("b") else "") + c + '</div></div>'
        tag = f'<div class="tag">{inl(s["tag"])}</div>' if s.get("tag") else ""
        return "", False, f'<div class="wrap">{tag}<div class="h2">{inl(s["title"])}</div><div class="lst">{its}</div></div>'
    if t == "point":
        n = f'<div class="bigN">{html.escape(str(s["num"]))}</div>' if s.get("num") else ""
        bl = "".join(f'<div><span class="ck">{icon("check",28,3)}</span><span>{inl(x)}</span></div>' for x in s.get("bullets", []))
        return "", False, f'<div class="wrap" style="justify-content:center">{n}<div class="h2">{inl(s["title"])}</div>' + (f'<div class="lead" style="margin-top:26px">{inl(s["body"])}</div>' if s.get("body") else "") + (f'<div class="bl">{bl}</div>' if bl else "") + '</div>'
    if t == "code":
        lang = s.get("lang", "sql")
        rows = "".join(f'<tr><td class="ln">{k}</td><td>{l or " "}</td></tr>' for k, l in enumerate(hl(s["code"], lang), 1))
        note = f'<div class="note">{icon("lightbulb",40)}<div>{inl(s["note"])}</div></div>' if s.get("note") else ""
        return "", False, f'<div class="wrap"><div class="h2">{inl(s["title"])}</div><div class="code"><div class="bar">{dots()}<span>{html.escape(s.get("file", "query." + lang))}</span></div><table>{rows}</table></div>{note}</div>'
    if t == "compare":
        c = lambda d, k, ic: f'<div class="col {k}"><h3><span class="dot">{icon(ic,26,3)}</span>{inl(d["label"])}</h3>' + "".join(f"<p>{inl(x)}</p>" for x in d["items"]) + "</div>"
        return "", False, f'<div class="wrap" style="justify-content:center"><div class="h2">{inl(s["title"])}</div><div class="cmp">{c(s["left"],"l","x")}{c(s["right"],"r","check")}</div></div>'
    if t == "quiz":
        lang = s.get("lang", "python")
        prev = ""
        if s.get("prev"):
            pv = s["prev"]
            prev = (f'<div class="qprev"><span class="qpl">{icon("check",26,3)} Q{html.escape(str(pv.get("q","")))} answer: <b>{html.escape(pv["ans"])}</b></span>'
                    f'<span class="qpw">{inl(pv.get("why",""))}</span></div>')
        opts = ""
        for k, o in zip("ABCD", s["options"]):
            body_ = f'<pre>{"<br>".join(hl(o, lang))}</pre>' if s.get("code_options", True) else f'<span>{inl(o)}</span>'
            opts += f'<div class="qo"><div class="ql">{k}</div><div class="qc">{body_}</div></div>'
        return "", False, (f'<div class="wrap">{prev}<div class="tag">{inl(s.get("tag","Challenge"))}</div><div class="h2 qh">{inl(s["q"])}</div>'
                           f'<div class="qos">{opts}</div><div class="qhint">{icon("message-circle",30)} {inl(s.get("hint","Comment your answer, then swipe"))}</div></div>')
    if t == "stat":
        return "", False, f'<div class="wrap" style="justify-content:center"><div class="statv">{inl(s["value"])}</div><div class="h2" style="margin-top:30px">{inl(s["label"])}</div>' + (f'<div class="lead" style="margin-top:26px">{inl(s["body"])}</div>' if s.get("body") else "") + '</div>'
    if t == "timeline":
        ph = ""
        for p in s["phases"]:
            ph += (f'<div class="ph"><div class="hd"><span class="rg">{html.escape(p["range"])}</span><h4>{inl(p["title"])}</h4>{icon(p.get("icon","flag"),44)}</div>'
                   f'<ul>{"".join(f"<li>{inl(b)}</li>" for b in p.get("bullets", []))}</ul></div>')
        return "", False, f'<div class="wrap"><div class="h2">{inl(s["title"])}</div><div class="tl">{ph}</div></div>'
    if t == "table":
        hi = s.get("hi")
        th = "".join(f"<th>{inl(c)}</th>" for c in s["cols"])
        tr = "".join(f'<tr class="{"hi" if k == hi else ""}">' + "".join(f"<td>{inl(str(c))}</td>" for c in r) + "</tr>" for k, r in enumerate(s["rows"]))
        note = f'<div class="note">{icon("lightbulb",40)}<div>{inl(s["note"])}</div></div>' if s.get("note") else ""
        return "", False, f'<div class="wrap" style="justify-content:center"><div class="h2">{inl(s["title"])}</div><div class="tb"><table><tr>{th}</tr>{tr}</table></div>{note}</div>'
    if t == "product":
        ph = "".join(f'<div class="p2ph"><span>{html.escape(r)}</span><b>{inl(n)}</b></div>' for r, n in s.get("phases", []))
        st = "".join(f'<div class="p2st"><div class="v">{inl(v)}</div><div class="l">{inl(l)}</div></div>' for v, l in s.get("stats", []))
        mrp = ("<s>" + inl(s["mrp"]) + "</s>") if s.get("mrp") else ""
        return "p2 dark", True, (f'<div class="wrap"><div class="p2k">{icon("star",24,2.4)}{inl(s.get("kicker",""))}</div>'
            f'<div class="h1 p2h">{inl(s["title"])}</div><div class="lead p2l">{inl(s.get("body",""))}</div>'
            f'<div class="p2rail">{ph}</div><div class="p2grid">{st}</div>'
            f'<a class="p2buy" href="{html.escape(s["url"])}"><div><div class="pr">{inl(s.get("price") or s.get("buy_title",""))}{mrp}</div>'
            f'<div class="by">{inl(s.get("byline",""))}</div></div><div class="go">{inl(s.get("button","Link in bio"))}{icon("arrow-right",30,2.6)}</div></a></div>')
    if t == "cta":
        kw = s.get("keyword")
        box = ""
        if kw:
            box = (f'<div class="cbox"><div class="cm1"><div class="av">You</div><div class="inp"><span>{html.escape(kw)}<span class="cur"></span></span><span class="snd">Post</span></div></div>'
                   f'<div class="dm">{icon("send",30)} Sent to your DMs</div></div>')
        act = f'<div class="act">{icon("user-check",34)}{inl(s["action"])}</div>' if s.get("action") else ""
        return "dark cta", True, f'<div class="wrap"><div class="h1" style="font-size:108px">{inl(s["title"])}</div><div class="lead" style="margin-top:30px">{inl(s.get("body",""))}</div>{box}{act}</div>'
    raise ValueError(t)


def _src(p):
    import base64, os, mimetypes
    p = resolve_path(p)
    if p and os.path.exists(p):
        mt = mimetypes.guess_type(p)[0] or "image/png"
        return f"data:{mt};base64," + base64.b64encode(open(p, "rb").read()).decode()
    return p

MONO = ('<svg class="mono" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#1B1A17"/>'
        '<rect x="15" y="33" width="9" height="15" rx="2.5" fill="#FFD12E"/><rect x="27.5" y="25" width="9" height="23" rx="2.5" fill="#FFFFFF"/>'
        '<rect x="40" y="15" width="9" height="33" rx="2.5" fill="#E8333B"/></svg>')
ARROW = ('<svg class="doodle" viewBox="0 0 220 150" aria-hidden="true"><path d="M14 22 C 90 2, 170 30, 186 118" stroke="#B3121B" stroke-width="7" fill="none" stroke-linecap="round"/>'
         '<path d="M160 104 L188 126 L202 94" stroke="#B3121B" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def mega_page(s, i, n):
    """Mega-sheet series slides: marker_cover | sheet | bigtable (no app chrome; series look)."""
    t = s["type"]
    segs = "".join(f'<i class="{"on" if k <= i else ""}"></i>' for k in range(1, n + 1))
    sig = (f'<div class="sig sig3"><span class="h">{MONO}@thedataguy16</span><span class="dots">{segs}</span>'
           f'<span class="pg">{"Save this" if i == n else f"{i:02d} / {n:02d}"}{icon("bookmark", 26, 2.4) if i == n else icon("arrow-right", 26, 2.6)}</span></div>')
    if t == "marker_cover":
        prev = s.get("_previews") or []
        fan = "".join(f'<img class="f{k}" src="{p}">' for k, p in enumerate(prev[:3]))
        kw = s.get("_keyword")
        inner = (f'<div class="cv3"><div class="cvtop"><div class="who">{MONO}<b>thedataguy16</b>{icon("badge-check", 30, 2.4)}</div>'
                 f'<span class="chip">{icon("bookmark", 26, 2.4)}Save for later</span></div>'
                 f'<div class="cvh"><div class="mkt">{inl(s["title"])}</div>' + (f'<div class="mks">{inl(s["sub"])}</div>' if s.get("sub") else "") + '</div>'
                 + (f'<div class="fan n{len(prev[:3])}">{fan}</div>' if fan else "")
                 + (f'<div class="stk"><span>{inl(s["_sticker"])}</span></div>' if s.get("_sticker") else "")
                 + '<div class="cvbot">' + (f'<span class="kwc">{icon("message-circle", 30, 2.4)}Comment <b>{html.escape(kw)}</b> for the PDF</span>' if kw else "<span></span>")
                 + f'<span class="swp">Swipe{icon("arrow-right", 30, 2.8)}</span></div></div>')
        cls = "mg mc3" + (" nofan" if not fan else "")
        return (f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="{cls}"><div class="pap"></div>{inner}<div class="grain"></div></div></body></html>')
    elif t == "mproduct":
        ph = "".join(f'<div class="mpp"><span class="d">{html.escape(r)}</span><span class="dot"></span><b>{inl(nm)}</b></div>' for r, nm in s.get("phases", []))
        st = "".join(f'<div class="mps"><b>{inl(v)}</b><span>{inl(l)}</span></div>' for v, l in s.get("stats", []))
        inner = (f'<div class="mpw"><div class="mpk">{icon("star", 26, 2.6)}{inl(s.get("kicker",""))}</div>'
                 f'<div class="mpt">{inl(s["title"])}</div><div class="mpb">{inl(s.get("body",""))}</div>'
                 f'<div class="mproad"><div class="line"></div>{ph}</div><div class="mpg">{st}</div>'
                 f'<a class="mpbuy" href="{html.escape(s["url"])}"><div><div class="bt">{inl(s.get("buy_title",""))}</div><div class="by">{inl(s.get("byline",""))}</div></div>'
                 f'<span class="go">{inl(s.get("button","Link in bio"))}{icon("arrow-right", 30, 2.8)}</span></a></div>')
        cls = "mg mprod"
    elif t == "mcta":
        kw = s.get("keyword", "")
        pages = s.get("_pdf_pages")
        inner = (f'<div class="mcw"><div class="mct">{inl(s["title"])}</div><div class="mcb">{inl(s.get("body","").replace("-page", "\u2011page"))}</div>{ARROW}'
                 f'<div class="igc"><div class="igr"><span class="you">You</span><div class="igi">{html.escape(kw)}<i class="car"></i></div><span class="post">Post</span></div>'
                 f'<div class="dmr">{MONO}<div class="bub"><div class="bt">Here is your PDF. Save it.</div>'
                 f'<div class="file">{icon("book-open", 34, 2.4)}<div><b>{html.escape(s.get("_series","notes"))} by @thedataguy16</b><span>PDF' + (f' · {pages} pages' if pages else '') + '</span></div></div></div></div></div>'
                 f'<div class="mca"><span class="fol">{icon("user-check", 32, 2.4)}{inl(s.get("action","Follow @thedataguy16"))}</span>'
                 f'<span class="msh">{icon("send", 30, 2.4)}Send to a friend</span></div></div>')
        cls = "mg mcta"
    elif t == "sheet":
        def fxrow(r):
            fx = f'<div class="fx">{html.escape(r["formula"])}</div>'
            if r.get("result") in (None, ""): return fx
            return f'<div class="fxl">{fx}<span class="rs">&rarr; {html.escape(str(r["result"]))}</span></div>'
        rows = "".join(f'<div class="sr"><div class="n">{k}</div><div class="nm">{inl(r["name"])}</div>{fxrow(r)}</div>' for k, r in enumerate(s["rows"], s.get("start", 1)))
        inner = (f'<div class="shw"><div class="shh"><h2>{inl(s["title"])}</h2><div><span class="rib">{inl(s.get("ribbon",""))}</span></div>'
                 f'<div class="by">By @thedataguy16</div>' + (f'<div class="sdat">Sample data: {html.escape(s["data"])}</div>' if s.get("data") else "") + f'</div><div class="shr">{rows}</div></div>')
        cls = "mg nb"
    elif t == "kids":
        cells = "".join(f'<div class="kc"><div class="kt">{inl(c["term"])}</div><div class="kb">{inl(c["kid"])}</div>'
                        + (f'<div class="kx">{inl(c["sql"])}</div>' if c.get("sql") else "")
                        + (f'<img src="{_src(c["img"])}">' if c.get("img") else (f'<div class="kemo{" k2" if len(c["emoji"]) > 2 else ""}">{html.escape(c["emoji"])}</div>' if c.get("emoji") else "")) + '</div>' for c in s["cells"])
        masc = f'<img class="masc" src="{_src(s["mascot"])}">' if s.get("mascot") else ""
        inner = (f'<div class="kdw"><div class="kdh"><div><h2><span>{inl(s["title"])}</span></h2><h3>{inl(s.get("subtitle","explained to kids"))}</h3>'
                 f'<div class="by">by @thedataguy16</div></div>{masc}</div><div class="kdg">{cells}</div></div>')
        cls = "mg kd"
    elif t == "flow":
        st = ""
        for k, x in enumerate(s["steps"]):
            st += (f'<div class="fq"><div class="fqt">{inl(x["q"])}</div><div class="fy"><span>Yes</span>{inl(x["yes"])}</div></div>'
                   + '<div class="fno">No &darr;</div>')
        st += f'<div class="fel">{inl(s.get("else","Ask a senior"))}</div>'
        inner = f'<div class="flw"><h2>{inl(s["title"])}</h2><div class="by">by @thedataguy16</div><div class="fls">{st}</div></div>'
        cls = "mg fl"
    elif t == "split":
        code = re.compile(r"^\s*(SELECT|WITH|=|df\b|pd\.)", re.I)
        same = (s["top"].get("head") or "") == (s["bottom"].get("head") or "")
        def card(h, k):
            bl = "".join(f'<li class="spc">{html.escape(x)}</li>' if code.match(x) else f'<li>{icon("check", 30, 3)}<span>{inl(x)}</span></li>' for x in h.get("points", []))
            return (f'<div class="s3c {k}"><div class="s3l">{inl(h["label"])}</div>' + ("" if same or not h.get("head") else f'<h4>{inl(h["head"])}</h4>')
                    + f'<ul>{bl}</ul>' + (f'<p>{icon("arrow-right", 28, 2.6)}<span>{inl(h["line"])}</span></p>' if h.get("line") else "") + '</div>')
        head = s["top"].get("head") if same else s.get("title", "")
        inner = (f'<div class="s3w"><div class="s3h"><span class="s3n">{s.get("_n", i - 1):02d}</span><h2>{inl(head or "")}</h2></div>'
                 f'{card(s["top"], "a")}<div class="s3vs">VS</div>{card(s["bottom"], "b")}</div>')
        cls = "mg sp3"
    else:  # bigtable
        cols = s.get("cols", ["#", "Question", "Answer"])
        rows = "".join(f'<tr><td class="i">{k}</td><td class="q">{inl(q)}</td><td class="a">{html.escape(a)}</td></tr>' for k, (q, a) in enumerate(s["rows"], s.get("start", 1)))
        inner = (f'<div class="btw"><div class="bth"><h2>{inl(s["title"])}</h2><div class="by">by @thedataguy16</div></div>'
                 f'<table class="btt"><tr>{"".join(f"<th>{html.escape(c)}</th>" for c in cols)}</tr>{rows}</table></div>')
        cls = "mg bt"
    return (f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="{cls}"><div class="pap"></div>{inner}{sig}<div class="grain"></div></div></body></html>')

MEGA_TYPES = ("marker_cover", "sheet", "bigtable", "kids", "split", "flow", "mproduct", "mcta")

LAYOUTS = ["cards", "grid", "editorial", "notebook"]
# Post styles: every slide in a post shares one style; the 3 daily posts must use different styles.
STYLES = {  # style: (cover/cta class, cover is dark?, inner theme)  -- ALL LIGHT (owner rule: no dark themes)
    "ember": ("pap emb", False, "paper"),
    "mist": ("pap mist", False, "mist"),
    "terracotta": ("pap terl", False, "clay"),
    "paper": ("pap", False, "white"),
}
STYLES["midnight"] = STYLES["mist"]  # legacy name, now light

def page(s, i, n, series, style="ember", layout="cards"):
    cls, dark, inner = body(s)
    cls += " lay-" + layout
    cc, cdark, theme_in = STYLES.get(style, STYLES["ember"])
    theme = ""
    if s["type"] in ("cover", "cta", "product"):
        if cc: cls += " " + cc
        cls = cls.replace("dark", "").strip(); dark = False
    else:
        theme = s.get("theme") or theme_in
        if theme in ("ink", "dark"): theme = "mist"  # owner rule: light only
        cls += " t-" + theme
    if s["type"] in ("cover", "cta", "product") and dark and cc != "terra":
        glows = ('<div class="glow" style="width:620px;height:620px;background:#E0561F;right:-200px;top:-160px"></div>'
                 '<div class="glow" style="width:520px;height:520px;background:#F4AE3D;left:-240px;bottom:-200px;opacity:.28"></div>')
    elif theme == "ink":
        glows = '<div class="glow" style="width:560px;height:560px;background:#E0561F;left:-260px;top:-220px;opacity:.35"></div>'
    elif cc == "terra":
        glows = ""
    else:
        glows = '<div class="glow" style="width:520px;height:520px;background:#F4AE3D;right:-260px;top:-240px;opacity:.22"></div>'
    wm = f'<div class="wm">{i:02d}</div>' if theme in ("white", "ink", "clay") else ""
    ft = foot(i, n, dark) if s["type"] != "cover" else f'<div class="swipe">Swipe <div class="nx">{icon("arrow-right",34,2.6)}</div></div>'
    return (f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="s {cls}">{glows}<div class="grid"></div>{wm}'
            f'{chrome(i, n, series, dark)}{inner}{ft}<div class="grain"></div></div></body></html>')

MEASURE_JS = """()=>{const w=document.querySelector('.wrap');const f=document.querySelector('.foot,.swipe');const lim=(f?f.getBoundingClientRect().top:1300)-36;
let top=9999,m=0;for(const e of w.children){const r=e.getBoundingClientRect();m=Math.max(m,r.bottom);top=Math.min(top,r.top)}let wide=false;document.querySelectorAll('.wrap pre').forEach(p=>{if(p.scrollWidth>p.clientWidth+2)wide=true});if(wide)m=99999;return {bottom:m,lim:lim,top:top,art:(()=>{const a=document.querySelector('.art');return !!a&&getComputedStyle(a).display!=='none'})()}}"""
SCALE_JS = "(k)=>{document.querySelectorAll('.wrap *').forEach(e=>{const cs=getComputedStyle(e);e.style.fontSize=(parseFloat(cs.fontSize)*k)+'px';if(e.matches('.lst,.tl,.bl,.cmp,.qos')){e.style.gap=(parseFloat(cs.rowGap)*k)+'px'}if(e.matches('.it,.ph,.col,.bl>div,.note,.tb td,.tb th,.qo,.qprev')){['paddingTop','paddingBottom'].forEach(p=>e.style[p]=(parseFloat(cs[p])*k)+'px')}})}"

async def fit(pg):
    m = await pg.evaluate(MEASURE_JS)
    if m["art"]:
        grid = await pg.evaluate("()=>!!document.querySelector('.lay-grid')")
        for _ in range(12):
            if grid:
                ok = await pg.evaluate("()=>document.querySelector('.wrap').firstElementChild.getBoundingClientRect().top>=660")
            else:
                ok = await pg.evaluate("()=>document.querySelector('.wrap').lastElementChild.getBoundingClientRect().bottom<=800")
            if ok: break
            await pg.evaluate(SCALE_JS, 0.95)
        return
    for _ in range(16):
        m = await pg.evaluate(MEASURE_JS)
        if m["bottom"] > m["lim"]:
            await pg.evaluate(SCALE_JS, 0.95); continue
        if m["bottom"] < m["lim"] - 70:
            await pg.evaluate(SCALE_JS, 1.05)
            m2 = await pg.evaluate(MEASURE_JS)
            if m2["bottom"] > m2["lim"]:
                await pg.evaluate(SCALE_JS, 1/1.05); break
            continue
        break

MEGA_OVER_JS = ("()=>{const w=document.querySelector('.shw,.btw,.cvh,.kdw,.s3w,.flw');if(!w)return false;const fan=document.querySelector('.fan,.cvbot');const lim=(w.classList.contains('cvh')&&fan?fan.getBoundingClientRect().top:document.querySelector('.sig,.cvbot').getBoundingClientRect().top)-10;"
                "let m=0;w.querySelectorAll('.sr,.btt,.mks,.mkt,.kc,.s3c,.fls').forEach(e=>m=Math.max(m,e.getBoundingClientRect().bottom));return m>lim||w.scrollHeight>w.clientHeight+2}")

async def mega_fit(pg):
    shrinks, over = 0, False
    for _ in range(14):
        over = await pg.evaluate(MEGA_OVER_JS)
        if not over: break
        shrinks += 1
        await pg.evaluate("()=>{document.querySelectorAll(document.querySelector('.cvh')?'.cvh *':'.mg *').forEach(e=>{const fs=parseFloat(getComputedStyle(e).fontSize);e.style.fontSize=(fs*0.95)+'px'})}")
    return shrinks, bool(over)

async def render(spec, out):
    out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    sl, series = with_product(spec), spec.get("series", "")
    style = spec.get("style") or list(STYLES)[sum(map(ord, series)) % len(STYLES)]
    layout = spec.get("layout") or LAYOUTS[sum(map(ord, series + style)) % len(LAYOUTS)]
    files, qa, cover_ctx = [], [], None
    async with async_playwright() as p:
        b = await launch(p)
        pg = await b.new_page(viewport={"width": W, "height": H})
        kw = next((x.get("keyword") for x in sl if x["type"] in ("cta", "mcta")), None)
        sticker = spec.get("sticker") or (f"{spec.get('_pdf_pages') or len(sl)}-page<br>PDF" if kw else None)
        content = [k for k, x in enumerate(sl) if x["type"] in ("sheet", "bigtable", "kids", "split", "flow")]
        nsplit = 0
        for x in sl:
            if x["type"] == "split":
                nsplit += 1; x["_n"] = nsplit
        order = list(range(1, len(sl))) + [0] if sl[0]["type"] == "marker_cover" else list(range(len(sl)))
        files = [None] * len(sl)
        for idx in order:
            i, s = idx + 1, sl[idx]
            if s["type"] == "marker_cover":
                s = dict(s, _previews=[_src(files[k]) for k in content[:3]], _sticker=sticker, _keyword=kw); cover_ctx = s
            await pg.set_content(mega_page(s, i, len(sl)) if s["type"] in MEGA_TYPES else page(s, i, len(sl), series, style, layout))
            await pg.evaluate("document.fonts.ready")
            if s["type"] in MEGA_TYPES:
                shrinks, over = await mega_fit(pg)
                qa.append(dict(slide=i, type=s["type"], shrinks=shrinks, overflow=bool(over), **(await pg.evaluate(QA_JS))))
                f = out / f"slide_{i:02d}.jpg"
                await pg.screenshot(path=str(f), type="jpeg", quality=94); files[idx] = str(f); continue
            await fit(pg)
            m = await pg.evaluate(MEASURE_JS)
            qa.append(dict(slide=i, type=s["type"], shrinks=0, overflow=bool(m["bottom"] > m["lim"] + 2), **(await pg.evaluate(QA_JS))))
            if not m["art"] and m["bottom"] < m["lim"] - 110:
                await pg.evaluate("()=>{const w=document.querySelector('.wrap');w.style.justifyContent='center';w.style.paddingTop='170px'}")
            f = out / f"slide_{i:02d}.jpg"
            await pg.screenshot(path=str(f), type="jpeg", quality=94); files[idx] = str(f)
        if spec.get("cover_alt"):  # second hook option for the cover -> cover_b.jpg
            alt = dict(cover_ctx if sl[0]["type"] == "marker_cover" else sl[0], **{k: v for k, v in spec["cover_alt"].items() if k != "hook"})
            if sl[0]["type"] == "marker_cover":  # mega series keep the marker look for both hooks
                await pg.set_content(mega_page(alt, 1, len(sl))); await pg.evaluate("document.fonts.ready"); await mega_fit(pg)
            else:
                alt["type"] = "cover"
                await pg.set_content(page(alt, 1, len(sl), series, style, layout)); await pg.evaluate("document.fonts.ready"); await fit(pg)
            await pg.screenshot(path=str(out / "cover_b.jpg"), type="jpeg", quality=94)
        await b.close()
    qa.sort(key=lambda q: q["slide"])
    json.dump(qa, open(out / "qa.json", "w"), indent=1)
    return files


# Layout QA read after fitting: emoji that wrapped to 2 lines, text clipped by its box, words broken mid-line.
QA_JS = """()=>{const r={emojiWrap:[],clipped:[],minFont:99};
document.querySelectorAll('.kemo').forEach((e,k)=>{const fs=parseFloat(getComputedStyle(e).fontSize);if(e.getBoundingClientRect().height>fs*1.6)r.emojiWrap.push(k+1)});
document.querySelectorAll('.kc,.sr .fx,.btt td,.sph li,.it,.col,.ph').forEach(e=>{if(e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3)r.clipped.push((e.innerText||'').slice(0,40))});
document.querySelectorAll('.mg *, .wrap *').forEach(e=>{if(e.children.length===0&&(e.innerText||'').trim()){const fs=parseFloat(getComputedStyle(e).fontSize);if(fs<r.minFont)r.minFont=fs}});
return r}"""


PRODUCT = {"type": "product", "kicker": "The 90-Day System · 5.0 Best Seller",
    "title": "Become a data<br>analyst in ~90 days~.",
    "body": "Open it every morning. It tells you what to learn, build and ship that day. 1 hour a day, no coding background needed.",
    "phases": [["DAY 1-21", "Excel + Stats"], ["DAY 22-45", "SQL"], ["DAY 46-65", "Power BI"], ["DAY 66-90", "Python + Jobs"]],
    "stats": [["27", "portfolio projects with real data"], ["100+", "interview Q&As with model answers"], ["365", "days of 1:1 mentor access"], ["10+", "job applications sent by Day 90"]],
    "price": "", "mrp": "", "buy_title": "0 to job-ready, one day at a time", "byline": "Built by Abhishek · 7 yrs in data · 31,000+ helped",
    "button": "Link in bio", "url": "https://topmate.io/abhishek_kumar1085/1990922"}

def with_product(spec):
    """Insert the product pitch slide right before the CTA (default on; spec.product=false disables).
    Marker-series posts get the brand versions: mproduct + mcta."""
    sl = list(spec["slides"])
    series = bool(sl) and sl[0]["type"] == "marker_cover"
    if series:
        sl = [dict(x, type="mcta", _pdf_pages=spec.get("_pdf_pages"), _series=spec.get("series", "")) if x["type"] == "cta" else x for x in sl]
    if spec.get("product") is False or any(x["type"] in ("product", "mproduct") for x in sl): return sl
    p = dict(PRODUCT, **(spec.get("product") if isinstance(spec.get("product"), dict) else {}))
    if series: p["type"] = "mproduct"
    k = len(sl) - 1 if sl and sl[-1]["type"] in ("cta", "mcta") else len(sl)
    return sl[:k] + [p] + sl[k:]

async def build_pdf(spec, files, out_pdf):
    """PDF for DM delivery: every slide as rendered; the product slide is live HTML so its button is a clickable link."""
    import base64
    sl = with_product(dict(spec, _pdf_pages=page_count(spec))); style = spec.get("style") or list(STYLES)[sum(map(ord, spec.get("series", ""))) % len(STYLES)]
    async with async_playwright() as p:
        b = await launch(p)
        pg = await b.new_page(viewport={"width": W, "height": H})
        parts = []
        for i, (s, f) in enumerate(zip(sl, files), 1):
            if s["type"] == "mproduct":
                await pg.set_content(mega_page(s, i, len(sl))); await pg.evaluate("document.fonts.ready")
                parts.append('<div class="pp">' + await pg.evaluate("document.querySelector('.mg').outerHTML") + '</div>')
            elif s["type"] == "product":
                await pg.set_content(page(s, i, len(sl), spec.get("series", ""), style, spec.get("layout") or "cards")); await pg.evaluate("document.fonts.ready")
                await fit(pg)
                parts.append('<div class="pp">' + await pg.evaluate("document.querySelector('.s').outerHTML") + '</div>')
            else:
                parts.append(f'<div class="pp"><img src="data:image/jpeg;base64,{base64.b64encode(open(f,"rb").read()).decode()}"></div>')
        doc = (f'<html><head><meta charset="utf-8"><style>{CSS}@page{{size:1080px 1350px;margin:0}}html,body{{height:auto;overflow:visible}}'
               f'.pp{{width:1080px;height:1350px;page-break-after:always;overflow:hidden;position:relative}}.pp img{{width:1080px;height:1350px;display:block}}</style></head>'
               f'<body>{"".join(parts)}</body></html>')
        await pg.set_content(doc); await pg.evaluate("document.fonts.ready")
        await pg.pdf(path=str(out_pdf), width="1080px", height="1350px", print_background=True, margin={"top":"0","bottom":"0","left":"0","right":"0"})
        await b.close()
    return str(out_pdf)

def preview_spec(spec):
    """NOTES DROP: the posted carousel = cover + first N pages + cta (product auto-inserted)."""
    n = spec.get("preview_pages")
    if not n: return spec
    sl = spec["slides"]; body = [x for x in sl[1:] if x["type"] != "cta"]; cta = [x for x in sl if x["type"] == "cta"]
    return dict(spec, slides=[sl[0]] + body[:n] + cta)

def page_count(spec):
    return len(with_product(spec))

async def render_post(spec, out, pdf=False):
    out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("slide_*.jpg"): f.unlink()
    post = dict(preview_spec(spec), _pdf_pages=page_count(spec))
    files = await render(post, out)
    if not pdf: return files, None
    if post is spec:
        pdf_path = await build_pdf(spec, files, out / "carousel.pdf")
    else:
        full = out / "_full"; allf = await render(dict(spec, cover_alt=None, _pdf_pages=page_count(spec)), full)
        pdf_path = await build_pdf(spec, allf, out / "carousel.pdf")
        import shutil; shutil.rmtree(full)
    return files, pdf_path

if __name__ == "__main__":
    if len(sys.argv) < 3: sys.exit("usage: python render.py spec.json outdir [--pdf]")
    spec = json.load(open(sys.argv[1]))
    files, pdf = asyncio.run(render_post(spec, sys.argv[2], "--pdf" in sys.argv))
    print("\n".join(files))
    if pdf: print(pdf)
