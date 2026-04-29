#!/usr/bin/env python3
"""Generate normalized committee portrait crops from original images."""

from __future__ import annotations

import re
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "committees.html"
SOURCE_DIR = ROOT / "assets/img/committees"
OUTPUT_DIR = ROOT / "assets/img/committees/portraits"
OUTPUT_SIZE = 600
FALLBACK_CANVAS_COLOR = (255, 255, 255)
PORTRAIT_OVERRIDES = {
    "fukuda-toshio": {
        "size_scale": 1.27,
        "top_margin": 0.20,
    },
    "zhao-lian": {
        "allow_width_padding": True,
    },
}


def committee_sources() -> list[Path]:
    html = HTML_PATH.read_text()
    used_stems = set()
    for src in re.findall(r'<img class="committee-ref-photo" src="([^"]+)".*?>', html):
        if "committee-placeholder.svg" in src or "/portraits/" in src:
            continue
        path = ROOT / src
        if path.parent == SOURCE_DIR and path.exists():
            used_stems.add(path.stem)

    if used_stems:
        paths = [
            path
            for path in SOURCE_DIR.iterdir()
            if path.is_file() and path.stem in used_stems and path.suffix.lower() in {".jpeg", ".jpg", ".png"}
        ]
    else:
        paths = [
            path
            for path in SOURCE_DIR.iterdir()
            if path.is_file() and path.suffix.lower() in {".jpeg", ".jpg", ".png"}
        ]
    return sorted(paths, key=lambda path: path.name)


def load_rgb(path: Path) -> Image.Image:
    image = Image.open(path)
    image = ImageOps.exif_transpose(image)
    if image.mode in {"RGBA", "LA"}:
        background = Image.new("RGBA", image.size, (255, 255, 255, 255))
        image = Image.alpha_composite(background, image.convert("RGBA"))
    return image.convert("RGB")


def detect_face(image: Image.Image) -> tuple[int, int, int, int] | None:
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    gray = cv2.equalizeHist(gray)
    cascades = [
        "haarcascade_frontalface_alt2.xml",
        "haarcascade_frontalface_default.xml",
        "haarcascade_profileface.xml",
    ]
    faces: list[tuple[int, int, int, int]] = []
    for name in cascades:
        cascade = cv2.CascadeClassifier(str(Path(cv2.data.haarcascades) / name))
        detected = cascade.detectMultiScale(
            gray,
            scaleFactor=1.05,
            minNeighbors=4,
            minSize=(max(24, image.width // 18), max(24, image.height // 18)),
        )
        faces.extend(tuple(map(int, face)) for face in detected)
    if not faces:
        return None
    return max(faces, key=lambda face: face[2] * face[3])


def crop_box(
    image: Image.Image,
    face: tuple[int, int, int, int] | None,
    stem: str,
) -> tuple[int, int, int, int]:
    width, height = image.size
    override = PORTRAIT_OVERRIDES.get(stem, {})
    if face:
        x, y, w, h = face
        cx = x + w / 2
        face_size = max(w, h)
        desired_size = min(face_size * override.get("size_scale", 1.68), height)
        min_face_size = min(max(w * 1.08, h * 1.30), height)
        if desired_size > width and width >= min_face_size and not override.get("allow_width_padding"):
            size = width
        else:
            size = desired_size
        left = cx - size / 2
        top = y - h * override.get("top_margin", 0.40)
    else:
        size = min(width, height)
        left = (width - size) / 2
        top = max(0, (height - size) * 0.28)

    top = max(0, min(top, height - size))
    if size <= width:
        left = max(0, min(left, width - size))
    return tuple(round(v) for v in (left, top, left + size, top + size))


def estimate_edge_color(image: Image.Image, box: tuple[int, int, int, int], side: str) -> tuple[int, int, int]:
    _, top, _, bottom = box
    source_top = max(0, top)
    source_bottom = min(image.height, bottom)
    if source_bottom <= source_top:
        return FALLBACK_CANVAS_COLOR

    edge_x = 0 if side == "left" else image.width - 1
    strip = image.crop((edge_x, source_top, edge_x + 1, source_bottom))
    pixels = np.array(strip).reshape(-1, 3)
    color = np.median(pixels, axis=0)
    return tuple(int(round(channel)) for channel in color)


def crop_with_padding(image: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    left, top, right, bottom = box
    crop_width = right - left
    crop_height = bottom - top
    canvas = Image.new("RGB", (crop_width, crop_height), FALLBACK_CANVAS_COLOR)

    source_left = max(0, left)
    source_top = top
    source_right = min(image.width, right)
    source_bottom = bottom

    if left < 0:
        canvas.paste(estimate_edge_color(image, box, "left"), (0, 0, source_left - left, crop_height))
    if right > image.width:
        canvas.paste(
            estimate_edge_color(image, box, "right"),
            (source_right - left, 0, crop_width, crop_height),
        )

    if source_right > source_left and source_bottom > source_top:
        region = image.crop((source_left, source_top, source_right, source_bottom))
        canvas.paste(region, (source_left - left, source_top - top))
    return canvas


def save_portrait(src: Path) -> tuple[Path, bool]:
    image = load_rgb(src)
    face = detect_face(image)
    cropped = crop_with_padding(image, crop_box(image, face, src.stem)).resize(
        (OUTPUT_SIZE, OUTPUT_SIZE),
        Image.Resampling.LANCZOS,
    )
    out = OUTPUT_DIR / f"{src.stem}.jpg"
    cropped.save(out, "JPEG", quality=94, optimize=True, progressive=True)
    return out, face is not None


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for src in committee_sources():
        out, detected = save_portrait(src)
        status = "face" if detected else "fallback"
        print(f"{status:8} {src.relative_to(ROOT)} -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
