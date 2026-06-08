from pathlib import Path
from PIL import Image
import numpy as np

INPUT_DIR = Path("./input")
OUTPUT_DIR = Path("./output")

AUTO_CROP = False

# 青色识别参数
CYAN_STRENGTH = 1.05
MIN_GB = 25

# 去边缘残留参数
EDGE_EXPAND = 2


def dilate(mask, iterations=1):
    out = mask.copy()
    for _ in range(iterations):
        p = np.pad(out, 1, mode="constant", constant_values=False)
        out = (
            p[1:-1, 1:-1] |
            p[:-2, 1:-1] | p[2:, 1:-1] |
            p[1:-1, :-2] | p[1:-1, 2:] |
            p[:-2, :-2] | p[:-2, 2:] |
            p[2:, :-2] | p[2:, 2:]
        )
    return out


def clean_cyan_bg(img):
    img = img.convert("RGBA")
    arr = np.array(img).astype(np.float32)

    r = arr[..., 0]
    g = arr[..., 1]
    b = arr[..., 2]
    a = arr[..., 3]

    # 1. 全图识别青色系像素，包括亮青、暗青、抗锯齿青边
    cyan_like = (
        (g > MIN_GB) &
        (b > MIN_GB) &
        (g > r * CYAN_STRENGTH + 6) &
        (b > r * CYAN_STRENGTH + 6) &
        (np.abs(g - b) < 110)
    )

    # 2. 全图青色直接透明
    # 这一步会处理旗帜破洞、树叶缝隙、栅栏缝隙里的青色
    a[cyan_like] = 0

    # 3. 扩大一圈，处理紧贴青色区域的残边
    expanded = dilate(cyan_like, EDGE_EXPAND)

    near_edge = expanded & (a > 0)

    # 4. 对残留青边做去色污染
    spill = (
        near_edge &
        (g > r + 4) &
        (b > r + 4) &
        (np.abs(g - b) < 120)
    )

    g[spill] = np.minimum(g[spill], r[spill] * 1.02 + 6)
    b[spill] = np.minimum(b[spill], r[spill] * 0.90 + 6)

    # 5. 对特别靠近透明区域的薄边稍微降 alpha，减少硬边
    thin_edge = near_edge & (a > 0)
    a[thin_edge] = np.minimum(a[thin_edge], 235)

    arr[..., 0] = r
    arr[..., 1] = g
    arr[..., 2] = b
    arr[..., 3] = a

    out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")

    if AUTO_CROP:
        bbox = out.getbbox()
        if bbox:
            out = out.crop(bbox)

    return out


def process_all():
    OUTPUT_DIR.mkdir(exist_ok=True, parents=True)

    files = []
    for ext in ("*.png", "*.jpg", "*.jpeg", "*.webp"):
        files.extend(INPUT_DIR.glob(ext))

    for f in files:
        img = Image.open(f)
        out = clean_cyan_bg(img)
        out.save(OUTPUT_DIR / f"{f.stem}_transparent.png")
        print("done:", f.name)


if __name__ == "__main__":
    process_all()