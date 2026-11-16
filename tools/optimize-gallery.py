"""Shrink oversized gallery JPEGs so the Pages repo stays light.

Re-encodes only files above the size threshold (default 120 KB) to max width 1280, quality 76.
Run: python tools/optimize-gallery.py [--dry]
"""
import os
import sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALLERY = os.path.join(ROOT, "assets", "gallery")
THRESHOLD = 120 * 1024
MAX_W = 1280
Q = 76


def work(name):
    path = os.path.join(GALLERY, name)
    before = os.path.getsize(path)
    if before <= THRESHOLD:
        return 0, before, before
    try:
        from PIL import Image

        with Image.open(path) as im:
            im = im.convert("RGB")
            if im.width > MAX_W:
                im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
            tmp = path + ".tmp"
            im.save(tmp, "JPEG", quality=Q, optimize=True, progressive=True)
        if os.path.getsize(tmp) < before:
            os.replace(tmp, path)
        else:
            os.remove(tmp)
    except Exception as exc:  # noqa: BLE001
        print("skip", name, exc, flush=True)
    return 1, before, os.path.getsize(path)


def main():
    files = [f for f in os.listdir(GALLERY) if f.lower().endswith(".jpg")]
    if "--dry" in sys.argv:
        big = [f for f in files if os.path.getsize(os.path.join(GALLERY, f)) > THRESHOLD]
        print("files", len(files), "over threshold", len(big))
        return
    total_before = total_after = 0
    done = 0
    with ThreadPoolExecutor(max_workers=8) as pool:
        for touched, before, after in pool.map(work, files):
            total_before += before
            total_after += after
            done += touched
            if done and done % 200 == 0:
                print("optimized", done, flush=True)
    print("done: %d files re-encoded, %.0f MB -> %.0f MB" % (done, total_before / 1048576, total_after / 1048576))


if __name__ == "__main__":
    main()
