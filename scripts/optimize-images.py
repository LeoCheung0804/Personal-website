"""Generate responsive WebP derivatives and a deterministic media manifest.

Run this script whenever a raster source is added or replaced in assets/images.
The original files remain the archival and social-sharing sources; page markup uses
the generated derivatives in assets/images/optimized.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "images"
OUTPUT_DIR = SOURCE_DIR / "optimized"
MANIFEST_PATH = ROOT / "assets" / "data" / "media-manifest.json"
SOURCE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
TARGET_WIDTHS = (240, 480, 960, 1600)
WEBP_QUALITY = 76


def safe_stem(source: Path) -> str:
    value = f"{source.stem}-{source.suffix.lstrip('.')}".lower()
    return re.sub(r"[^a-z0-9_-]+", "-", value).strip("-")


def output_widths(source_width: int) -> list[int]:
    return sorted({min(source_width, width) for width in TARGET_WIDTHS})


def prepare_image(source: Path) -> Image.Image:
    with Image.open(source) as image:
        prepared = ImageOps.exif_transpose(image)
        if "A" in prepared.getbands():
            return prepared.convert("RGBA")
        return prepared.convert("RGB")


def relative_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def build_manifest(*, check_only: bool = False) -> dict[str, dict]:
    sources = sorted(
        (
            path
            for path in SOURCE_DIR.iterdir()
            if path.is_file() and path.suffix.lower() in SOURCE_EXTENSIONS
        ),
        key=lambda path: path.name.lower(),
    )

    manifest: dict[str, dict] = {}
    expected_outputs: set[Path] = set()

    if not check_only:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for source in sources:
        image = prepare_image(source)
        variants = []

        for width in output_widths(image.width):
            height = round(image.height * width / image.width)
            output = OUTPUT_DIR / f"{safe_stem(source)}-{width}.webp"
            expected_outputs.add(output.resolve())

            if not check_only:
                resized = image if width == image.width else image.resize(
                    (width, height),
                    Image.Resampling.LANCZOS,
                )
                resized.save(
                    output,
                    "WEBP",
                    quality=WEBP_QUALITY,
                    method=6,
                    exact=True,
                )

            variants.append(
                {
                    "path": relative_path(output),
                    "width": width,
                    "height": height,
                    **({"bytes": output.stat().st_size} if output.exists() else {}),
                }
            )

        manifest[relative_path(source)] = {
            "width": image.width,
            "height": image.height,
            "variants": variants,
        }

    if check_only:
        missing = [
            variant["path"]
            for entry in manifest.values()
            for variant in entry["variants"]
            if not (ROOT / variant["path"]).exists()
        ]
        if missing:
            raise SystemExit(
                "Responsive media is out of date; missing:\n- " + "\n- ".join(missing)
            )
        if not MANIFEST_PATH.exists():
            raise SystemExit("Responsive media is out of date; media manifest is missing.")
        current = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        comparable = {
            key: {
                "width": entry["width"],
                "height": entry["height"],
                "variants": [
                    {field: variant[field] for field in ("path", "width", "height")}
                    for variant in entry["variants"]
                ],
            }
            for key, entry in current.items()
        }
        expected = {
            key: {
                "width": entry["width"],
                "height": entry["height"],
                "variants": [
                    {field: variant[field] for field in ("path", "width", "height")}
                    for variant in entry["variants"]
                ],
            }
            for key, entry in manifest.items()
        }
        if comparable != expected:
            raise SystemExit("Responsive media is out of date; regenerate the media manifest.")
        print(f"Responsive media is up to date ({len(manifest)} sources).")
        return manifest

    for output in OUTPUT_DIR.glob("*.webp"):
        if output.resolve() not in expected_outputs:
            output.unlink()

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(
        f"Generated {sum(len(entry['variants']) for entry in manifest.values())} "
        f"responsive images from {len(manifest)} sources."
    )
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--check",
        action="store_true",
        help="Verify generated variants and manifest structure without writing files.",
    )
    args = parser.parse_args()
    build_manifest(check_only=args.check)


if __name__ == "__main__":
    main()
