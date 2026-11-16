"""Download every gallery photo we have for each Makanak stay and refresh catalog.js.

Run from D:/hermes/makanak:
    python tools/fetch-gallery.py            # download missing + rewrite catalog.js
    python tools/fetch-gallery.py --no-catalog   # only download
"""
import json
import os
import re
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARSED = os.path.join(ROOT, "jabama-parsed.json")
CATALOG = os.path.join(ROOT, "assets", "catalog.js")
GALLERY = os.path.join(ROOT, "assets", "gallery")
MAX_WIDTH = 1600
QUALITY = 82
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
    "Referer": "https://www.jabama.com/",
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
}


def log(msg):
    print(msg, flush=True)


def fetch(url, path):
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
            if len(data) < 2000:
                raise ValueError("too small: %d bytes" % len(data))
            tmp = path + ".part"
            with open(tmp, "wb") as f:
                f.write(data)
            shrink(tmp, path)
            return True
        except Exception as exc:  # noqa: BLE001
            if attempt == 2:
                log("FAIL %s -> %s (%s)" % (url, os.path.basename(path), exc))
                for junk in (path + ".part",):
                    if os.path.exists(junk):
                        os.remove(junk)
                return False
            time.sleep(1.5 * (attempt + 1))
    return False


def shrink(tmp, path):
    """Re-encode oversized photos so the Pages repo stays reasonable."""
    try:
        from PIL import Image

        with Image.open(tmp) as im:
            im = im.convert("RGB")
            if im.width > MAX_WIDTH:
                h = round(im.height * MAX_WIDTH / im.width)
                im = im.resize((MAX_WIDTH, h), Image.LANCZOS)
            im.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        os.remove(tmp)
    except Exception:  # noqa: BLE001 — keep whatever bytes we got
        os.replace(tmp, path)


def main():
    os.makedirs(GALLERY, exist_ok=True)
    records = json.load(open(PARSED, encoding="utf-8"))
    jobs = []
    for rec in records:
        code = str(rec.get("code"))
        seen = []
        for url in rec.get("images") or []:
            if url and url not in seen:
                seen.append(url)
        for i, url in enumerate(seen):
            jobs.append((url, os.path.join(GALLERY, "%s-%d.jpg" % (code, i))))
    missing = [(u, p) for u, p in jobs if not (os.path.exists(p) and os.path.getsize(p) > 2000)]
    log("stays=%d photos=%d existing=%d todo=%d" % (len(records), len(jobs), len(jobs) - len(missing), len(missing)))

    done = 0
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = [pool.submit(fetch, u, p) for u, p in missing]
        for fut in futures:
            done += 1
            fut.result()
            if done % 25 == 0 or done == len(missing):
                rate = done / max(0.1, time.time() - t0)
                log("progress %d/%d (%.1f/s)" % (done, len(missing), rate))

    if "--no-catalog" in sys.argv:
        return
    rebuild_catalog(records)


def rebuild_catalog(records):
    by_code = {str(r.get("code")): r for r in records}
    src = open(CATALOG, encoding="utf-8").read()
    m = re.search(r"window\.MAKANAK_STAYS=(\[.*?\]);\nwindow\.IRAN_CITIES=(\[.*?\]);\s*$", src, re.S)
    if not m:
        raise SystemExit("catalog.js shape changed — refusing to rewrite")
    stays = json.loads(m.group(1))
    cities = json.loads(m.group(2))
    total = 0
    for stay in stays:
        code = str(stay.get("sourceCode") or stay.get("id"))
        count = len((by_code.get(code) or {}).get("images") or [])
        files = []
        for i in range(count):
            rel = "assets/gallery/%s-%d.jpg" % (code, i)
            if os.path.exists(os.path.join(ROOT, rel)) and os.path.getsize(os.path.join(ROOT, rel)) > 2000:
                files.append(rel)
        if files:
            stay["gallery"] = files
            total += len(files)
    out = "window.MAKANAK_STAYS=" + json.dumps(stays, ensure_ascii=True) + ";\n"
    out += "window.IRAN_CITIES=" + json.dumps(cities, ensure_ascii=True) + ";\n"
    open(CATALOG, "w", encoding="utf-8", newline="\n").write(out)
    log("catalog.js rewritten: %d stays, %d gallery photos" % (len(stays), total))


if __name__ == "__main__":
    main()
