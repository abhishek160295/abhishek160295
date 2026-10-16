import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out, mirror = sys.argv[1], sys.argv[2], sys.argv[3] == '1'
W, H = 1280, 720
im = Image.open(src).convert('RGB').resize((W, H))
if mirror: im = im.transpose(Image.FLIP_LEFT_RIGHT)
# darken bottom-left + top-right so text pops
sh = Image.new('L', (W, H), 0); d = ImageDraw.Draw(sh)
d.ellipse((-420, 300, 760, 1100), fill=170); d.ellipse((-300, -260, 520, 260), fill=140)
sh = sh.filter(ImageFilter.GaussianBlur(90))
im = Image.composite(Image.new('RGB', (W, H), (10, 5, 25)), im, sh)
F = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
def txt(xy, s, size, fill, stroke=14, anchor='la'):
    f = ImageFont.truetype(F, size)
    lay = Image.new('RGBA', (W, H)); ld = ImageDraw.Draw(lay)
    ld.text((xy[0] + 10, xy[1] + 12), s, font=f, fill=(0, 0, 0, 200), stroke_width=stroke, stroke_fill=(0, 0, 0, 200), anchor=anchor)
    lay = lay.filter(ImageFilter.GaussianBlur(6))
    ImageDraw.Draw(lay).text(xy, s, font=f, fill=fill, stroke_width=stroke, stroke_fill='black', anchor=anchor)
    im.paste(lay, (0, 0), lay)
txt((44, 400), 'STILL', 140, 'white')
txt((36, 530), 'LATE.', 160, '#FFD21F')
txt((40, 20), '50×', 170, 'white')
im.save(out, quality=95)
