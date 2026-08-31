#!/usr/bin/env python3
"""
Generate stand-in assets so the layout can be judged before the real pictures
exist: a grainy black and white loop for the landing, and one grey plate for
every entry in src/data/photos.js.

Delete this script once you have swapped in your own files. Nothing in the site
depends on it.

    python3 scripts/make_placeholders.py
"""

import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
DATA = os.path.join(ROOT, "src", "data", "photos.js")

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(size):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except OSError:
        return ImageFont.load_default()


def vignette(w, h, strength=0.55):
    """A radial falloff, 1.0 in the middle and darker toward the corners."""
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = (w - 1) / 2, (h - 1) / 2
    r = np.sqrt(((xx - cx) / cx) ** 2 + ((yy - cy) / cy) ** 2) / math.sqrt(2)
    return 1.0 - strength * np.clip(r, 0, 1) ** 2.1


def _shapes(w, h, rng, count, scale, blur):
    """A layer of soft shapes at one scale, blurred by the given radius."""
    canvas = Image.new("L", (w, h), 128)
    draw = ImageDraw.Draw(canvas)

    for _ in range(count):
        bw = int(rng.uniform(0.2, 1.1) * w * scale)
        bh = int(rng.uniform(0.2, 1.1) * h * scale)
        x = int(rng.uniform(-0.25, 1.0) * w)
        y = int(rng.uniform(-0.25, 1.0) * h)
        tone = int(rng.integers(10, 246))
        box = [x, y, x + max(bw, 8), y + max(bh, 8)]
        if rng.random() < 0.5:
            draw.rectangle(box, fill=tone)
        else:
            draw.ellipse(box, fill=tone)

    canvas = canvas.filter(ImageFilter.GaussianBlur(radius=max(blur, 0.5)))
    return np.asarray(canvas).astype(np.float32) - 128.0


def soft_field(w, h, seed, blobs=4):
    """
    An abstract tonal field built in three passes, so there is something to
    look at rather than an even wash: big masses, then mid shapes, then a
    couple of near-hard edges.
    """
    rng = np.random.default_rng(seed)
    long_edge = max(w, h)

    arr = np.full((h, w), 128.0, dtype=np.float32)
    arr += _shapes(w, h, rng, blobs, 0.95, long_edge / 11) * 1.35
    arr += _shapes(w, h, rng, blobs + 2, 0.42, long_edge / 42) * 0.55
    arr += _shapes(w, h, rng, 3, 0.22, long_edge / 220) * 0.22

    # A directional wash, as if the light came from one edge.
    yy, xx = np.mgrid[0:h, 0:w]
    angle = float(rng.uniform(0, 2 * math.pi))
    ramp = np.cos(angle) * xx / w + np.sin(angle) * yy / h
    arr += 52 * (ramp - ramp.mean())

    return arr


def stretch(arr, low, high):
    """Map an array onto a tonal range."""
    span = max(np.ptp(arr), 1e-6)
    return low + (arr - arr.min()) / span * (high - low)


def grain(w, h, seed, amount=13.0):
    rng = np.random.default_rng(seed)
    fine = rng.normal(0, amount, (h, w))
    coarse = np.asarray(
        Image.fromarray(
            np.clip(rng.normal(128, amount * 1.5, (h // 3 + 1, w // 3 + 1)), 0, 255).astype(
                np.uint8
            )
        )
        .resize((w, h), Image.BILINEAR)
        .filter(ImageFilter.GaussianBlur(0.6)),
        dtype=np.float32,
    ) - 128.0
    return fine + coarse * 0.7


def label(img, text, pad=16, size=11, alpha=135):
    """A faint mark so nobody mistakes these for real photographs."""
    layer = Image.new("L", img.size, 0)
    ImageDraw.Draw(layer).text((pad, img.size[1] - pad - size - 3), text, font=font(size), fill=alpha)
    return Image.composite(Image.new("L", img.size, 255), img, layer.point(lambda v: v))


def make_plate(path, w, h, seed, tag):
    # Stretch the structure first. Adding grain before this would let a few
    # stray noise pixels set the range and flatten everything else to mud.
    arr = stretch(soft_field(w, h, seed), 14, 242)
    arr = arr * vignette(w, h, 0.42)
    arr = arr * 0.9 + 10  # silver prints rarely reach either end
    arr += grain(w, h, seed + 1, amount=7.5)

    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), mode="L")
    img = label(img, tag)

    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.convert("RGB").save(path, "JPEG", quality=74, optimize=True, progressive=True)


def read_plates():
    """Pull src / w / h out of the data file so the two stay in step."""
    with open(DATA, encoding="utf-8") as fh:
        source = fh.read()

    pattern = re.compile(
        r"\{\s*src:\s*'([^']+)'\s*,\s*w:\s*(\d+)\s*,\s*h:\s*(\d+)"
    )
    return [(m.group(1), int(m.group(2)), int(m.group(3))) for m in pattern.finditer(source)]


def make_photos():
    plates = read_plates()
    if not plates:
        sys.exit("No plates found in src/data/photos.js")

    for i, (src, w, h) in enumerate(plates):
        chapter = src.split("/")[-2]
        out = os.path.join(PUBLIC, *src.split("/"))
        tag = f"{chapter.upper()}  ·  PLACEHOLDER"
        make_plate(out, w, h, seed=1000 + i * 7, tag=tag)
        print(f"  {src}  {w}x{h}")

    print(f"{len(plates)} plates written")


def make_portrait(width=480, height=640, seconds=5, fps=20):
    """A slow, grainy, loopable stand-in for the landing clip."""
    if not shutil.which("ffmpeg"):
        print("ffmpeg not found, skipping the video")
        return

    frames = seconds * fps
    base = stretch(soft_field(width, height, seed=77, blobs=4), 38, 186)
    vig = vignette(width, height, 0.5)

    yy, xx = np.mgrid[0:height, 0:width]
    tmp = tempfile.mkdtemp(prefix="portrait-")

    try:
        for f in range(frames):
            t = 2 * math.pi * f / frames  # full turn over the clip, so it loops

            # A soft highlight drifting the way a face does under one lamp.
            cx = width * (0.5 + 0.08 * math.cos(t))
            cy = height * (0.42 + 0.05 * math.sin(t))
            radius = min(width, height) * 0.5
            dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / radius
            glow = 26 * np.exp(-np.clip(dist, 0, 4) ** 2)

            arr = (base + glow) * vig + grain(width, height, seed=5000 + f, amount=11.0)
            img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), mode="L")

            # Dark text, so it stays readable against the lit middle.
            draw = ImageDraw.Draw(img)
            fnt = font(17)
            for line, dy in (("YOUR CLIP", -14), ("GOES HERE", 12)):
                spaced = " ".join(line)
                box = draw.textbbox((0, 0), spaced, font=fnt)
                draw.text(
                    ((width - (box[2] - box[0])) / 2, height / 2 + dy - 10),
                    spaced,
                    font=fnt,
                    fill=38,
                )

            img.convert("RGB").save(os.path.join(tmp, f"f{f:04d}.png"))

        out = os.path.join(PUBLIC, "media", "portrait.mp4")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-framerate", str(fps), "-i", os.path.join(tmp, "f%04d.png"),
                "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
                "-crf", "31", "-preset", "slow", "-an",
                "-movflags", "+faststart", out,
            ],
            check=True,
        )

        Image.open(os.path.join(tmp, "f0000.png")).convert("RGB").save(
            os.path.join(PUBLIC, "media", "portrait-poster.jpg"),
            "JPEG", quality=76, optimize=True,
        )
        print(f"  portrait.mp4  {os.path.getsize(out) / 1024:.0f} KB")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    print("plates:")
    make_photos()
    print("portrait:")
    make_portrait()
