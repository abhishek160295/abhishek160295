"""Contact sheet: stills from every scene at given fractions."""
import sys, os
from multiprocessing import Pool
from PIL import Image, ImageDraw
import scenes as S
from engine import FPS, font, HAND

def job(fi):
    return fi, S.render(fi).resize((480, 270), Image.LANCZOS)

if __name__ == '__main__':
    out = sys.argv[1]
    names = sys.argv[2].split(',') if len(sys.argv) > 2 and sys.argv[2] else None
    fr = [float(x) for x in (sys.argv[3].split(',') if len(sys.argv) > 3 else '0.1,0.4,0.7,0.95'.split(','))]
    items = []
    for sc in S.SCENES:
        if names and sc.name not in names and sc.name[:2] not in names:
            continue
        for q in fr:
            items.append((sc.name, q, int((sc.start + sc.dur * q) * FPS)))
    with Pool(4) as p:
        res = dict(p.map(job, [i[2] for i in items]))
    cols = len(fr)
    rows = (len(items) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * 484, rows * 296), (40, 40, 40))
    d = ImageDraw.Draw(sheet)
    for k, (n, q, fi) in enumerate(items):
        x, y = (k % cols) * 484, (k // cols) * 296
        sheet.paste(res[fi], (x + 2, y + 24))
        d.text((x + 6, y + 2), '%s %.2f  t=%.2f' % (n, q, fi / FPS), fill=(255, 255, 0), font=font(HAND, 18))
    sheet.save(out)
    print('ok', len(items), S.TOTAL)
