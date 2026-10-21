"""Contact sheet: one row per post folder, every slide (and cover_b) as a thumbnail.
usage: python tools/contact_sheet.py out.jpg dir1 [dir2 ...]"""
import sys, pathlib
from PIL import Image, ImageDraw

def sheet(out, dirs, tw=216, gap=10, label=34):
    rows = []
    for d in map(pathlib.Path, dirs):
        fs = sorted(d.glob("slide_*.jpg")) + sorted(d.glob("cover_b.jpg")) + sorted(d.glob("frame_*.jpg"))
        if fs: rows.append((d.name, fs))
    th = int(tw * 1920 / 1080) if any("frame_" in str(f) for _, fs in rows for f in fs) else int(tw * 1350 / 1080); cols = max(len(f) for _, f in rows)
    W = gap + cols * (tw + gap); H = sum(label + th + gap for _ in rows) + gap
    img = Image.new("RGB", (W, H), (250, 250, 247)); dr = ImageDraw.Draw(img); y = gap
    for name, fs in rows:
        dr.text((gap, y + 8), f"{name}  ({len(fs)})", fill=(20, 20, 20)); y += label
        for k, f in enumerate(fs):
            im = Image.open(f).convert("RGB"); im.thumbnail((tw, th)); img.paste(im, (gap + k * (tw + gap), y))
        y += th + gap
    img.save(out, quality=88); return out

if __name__ == "__main__":
    print(sheet(sys.argv[1], sys.argv[2:]))
