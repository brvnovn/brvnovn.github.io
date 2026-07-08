"""
Amostra pixels dos PNGs exportados do Figma (refs/) para extrair valores de
design (cor, margens, larguras) de forma programatica, em vez de estimativa
visual. Roda sobre os 3 exports @2x (frame original = 1280px de largura).
"""
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image

REFS = Path(__file__).resolve().parent.parent / "refs"
SCALE = 2  # exports sao @2x de um frame de 1280px


def load(name):
    im = Image.open(REFS / name).convert("RGB")
    return np.array(im)


def bg_color(arr):
    # canto superior-esquerdo, longe de qualquer conteudo
    return tuple(int(v) for v in arr[2, 2])


def top_colors(arr, bg, n=8, threshold=12):
    diff = np.abs(arr.astype(int) - np.array(bg)).sum(axis=2)
    ink = arr[diff > threshold]
    if ink.size == 0:
        return []
    counts = Counter(map(tuple, ink.tolist()))
    return counts.most_common(n)


def ink_column_clusters(arr, bg, threshold=20, gap=15):
    diff = np.abs(arr.astype(int) - np.array(bg)).sum(axis=2)
    ink_mask = diff > threshold
    col_has_ink = ink_mask.any(axis=0)
    ranges = []
    in_range = False
    start = 0
    for x, v in enumerate(col_has_ink):
        if v and not in_range:
            start = x
            in_range = True
        elif not v and in_range:
            ranges.append([start, x - 1])
            in_range = False
    if in_range:
        ranges.append([start, len(col_has_ink) - 1])
    merged = []
    for r in ranges:
        if merged and r[0] - merged[-1][1] < gap:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    return merged


def to_1x(px):
    return round(px / SCALE, 1)


def hexcolor(rgb):
    return "#{:02x}{:02x}{:02x}".format(*rgb)


for name in ["home-1280.png", "article-1280.png", "curriculum-1280.png"]:
    arr = load(name)
    h, w, _ = arr.shape
    bg = bg_color(arr)
    clusters = ink_column_clusters(arr, bg)
    clusters_1x = [[to_1x(a), to_1x(b), to_1x(b - a)] for a, b in clusters]
    colors = top_colors(arr, bg)

    print(f"\n=== {name} (frame {to_1x(w)}x{to_1x(h)}px @1x) ===")
    print("bg:", hexcolor(bg))
    print("column clusters (start, end, width) @1x:")
    for c in clusters_1x:
        print("  ", c)
    print("top non-bg colors (rgb, count):")
    for color, count in colors:
        print("  ", hexcolor(color), color, count)
