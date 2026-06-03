"""生成分享卡片封面 assets/share-cover.png（1200x630）。需要 Pillow。
用法： python make_cover.py
"""
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PAPER = (243, 236, 225)
INK = (43, 38, 34)
SOFT = (111, 101, 91)
LINE = (216, 203, 182)

os.makedirs("assets", exist_ok=True)
img = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(img)


def font(size):
    for p in (
        r"C:\Windows\Fonts\msyhbd.ttc",
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
        r"C:\Windows\Fonts\simsun.ttc",
    ):
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def center(y, s, f, fill):
    w = d.textlength(s, font=f)
    d.text(((W - w) / 2, y), s, font=f, fill=fill)


title = font(104)
sub = font(40)
tile_font = font(92)

center(70, "你从来没玩过的", title, INK)
center(196, "完形填空", title, INK)
center(338, "把桌上的东西，变成那个缺的字", sub, SOFT)

tiles = [("火", (200, 85, 61)), ("冰", (79, 143, 176)), ("水", (79, 143, 176))]
tw, gap = 150, 44
total = len(tiles) * tw + (len(tiles) - 1) * gap
x0, y0 = (W - total) / 2, 432
for i, (ch, col) in enumerate(tiles):
    x = x0 + i * (tw + gap)
    d.rounded_rectangle([x, y0, x + tw, y0 + tw], radius=26, fill=(255, 255, 255), outline=LINE, width=2)
    cw = d.textlength(ch, font=tile_font)
    d.text((x + (tw - cw) / 2, y0 + 22), ch, font=tile_font, fill=col)
    if i < len(tiles) - 1:
        d.text((x + tw + gap / 2 - 14, y0 + tw / 2 - 22), "→", font=sub, fill=SOFT)

img.save("assets/share-cover.png")
print("ok", os.path.abspath("assets/share-cover.png"))
