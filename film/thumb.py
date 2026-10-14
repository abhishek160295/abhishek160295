"""Thumbnail: the 2:47 AM moment. Leo on the bed, the villain at full size."""
import math
from PIL import Image
from engine import *
from chars import red_text
from props import *
import scenes as S

f = Frame(3.3, 0)
f.letterbox = False
f.grain = 0.6
f.cam(1.0, 960, 540)
fy = 980
f.layer(0.7)
window(f, 110, 460, 330, 700, 2.0, 'night', rain=True)
f.layer(1.0)
floor(f, fy)
top = bed(f, 380, 1000, fy)
pillow(f, 480, top - 14)
blanket(f, 600, 996, top, 0.2)
ns = nightstand(f, 1080, fy)
clock(f, 1080, ns - 44, '02:47', None, 0.8)
S.MON.draw(f, 1420, fy + 150, 3.5, dict(face=-0.6, talk=0.75, lhw=(1000, 500), rot=-0.08), 3.3, halo=1.5)
y, p = S.leo_sit(800, top + 4, (-30, 25), fy)
p.update(eyes='wide', mouth='o', brow=-0.8, sq=0.93, face=0.5, look=(2, -1), lhw=(775, top + 40),
         rhw=(835, top + 40), light=(-0.8, -0.3), sweat=2)
S.LEO.draw(f, 800, y, 1.25, p, 3.3)
f.light(320, 260, 420, (0, 0, 0), 0)
f.otext(70, 150, 'START', 190, WHITE, GAEGU, 'lm', 1.0, stroke=8)
f.otext(70, 330, 'MONDAY?', 210, RED, GAEGU, 'lm', 1.0, stroke=8)
f.light(380, 330, 380, RED, 0.18)
im = f.finish().resize((1280, 720), Image.LANCZOS)
im.save('out/thumbnail.png')
print('ok')
