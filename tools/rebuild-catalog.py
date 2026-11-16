"""Rebuild gallery arrays in assets/catalog.js from jabama-parsed.json.

Photos we already host (tracked in git under assets/gallery) are referenced locally;
the rest point at the original jabama CDN URL so every stay exposes all of its photos
without adding hundreds of megabytes to the Pages repo.

Run: python tools/rebuild-catalog.py
"""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "assets", "catalog.js")
PARSED = os.path.join(ROOT, "jabama-parsed.json")


def tracked_gallery():
    out = subprocess.run(["git", "ls-files", "assets/gallery"], cwd=ROOT, capture_output=True, text=True).stdout
    return {line.strip().replace("\\", "/") for line in out.splitlines() if line.strip()}


def main():
    tracked = tracked_gallery()
    records = json.load(open(PARSED, encoding="utf-8"))
    by_code = {str(r.get("code")): r for r in records}

    src = open(CATALOG, encoding="utf-8").read()
    m = re.search(r"window\.MAKANAK_STAYS=(\[.*?\]);\nwindow\.IRAN_CITIES=(\[.*?\]);\s*$", src, re.S)
    if not m:
        raise SystemExit("catalog.js shape changed — refusing to rewrite")
    stays = json.loads(m.group(1))
    cities = json.loads(m.group(2))

    local = remote = 0
    for stay in stays:
        code = str(stay.get("sourceCode") or stay.get("id"))
        images = []
        for url in (by_code.get(code) or {}).get("images") or []:
            if url and url not in images:
                images.append(url)
        gallery = []
        for i, url in enumerate(images):
            rel = "assets/gallery/%s-%d.jpg" % (code, i)
            if rel in tracked:
                gallery.append(rel)
                local += 1
            else:
                gallery.append(url)
                remote += 1
        if gallery:
            stay["gallery"] = gallery

    out = "window.MAKANAK_STAYS=" + json.dumps(stays, ensure_ascii=True) + ";\n"
    out += "window.IRAN_CITIES=" + json.dumps(cities, ensure_ascii=True) + ";\n"
    open(CATALOG, "w", encoding="utf-8", newline="\n").write(out)
    print("catalog.js: %d stays · %d local photos · %d CDN photos" % (len(stays), local, remote))


if __name__ == "__main__":
    main()
