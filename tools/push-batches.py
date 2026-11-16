"""Push a huge working tree to GitHub in small batches (large single pushes time out with HTTP 408)."""
import os
import subprocess
import sys
import time

ROOT = "D:/hermes/makanak"
BATCH = 150
RETRIES = 4


def run(cmd, check=True):
    p = subprocess.run(cmd, cwd=ROOT, shell=True, capture_output=True, text=True)
    out = (p.stdout or "") + (p.stderr or "")
    if check and p.returncode != 0:
        raise RuntimeError("FAILED %s\n%s" % (cmd, out[-2000:]))
    return p.returncode, out


def push(n):
    for attempt in range(RETRIES):
        code, out = run("git -c credential.helper=manager push -q origin main", check=False)
        if code == 0:
            print("push %d ok" % n, flush=True)
            return
        print("push %d attempt %d failed: %s" % (n, attempt + 1, out.strip()[-200:]), flush=True)
        time.sleep(5 * (attempt + 1))
    raise SystemExit("push failed permanently at batch %d" % n)


def main():
    run("git reset -q HEAD~1", check=False)  # undo the oversized commit, keep the index
    run("git reset -q")                     # unstage everything so we can batch it
    _, out = run("git status --porcelain")
    files = []
    for line in out.splitlines():
        line = line.rstrip()
        if not line:
            continue
        path = line[3:].strip()
        if path.startswith("assets/gallery/"):
            files.append(path)
    files.sort()
    code_files = [l[3:].strip() for l in out.splitlines() if l.strip() and not l[3:].strip().startswith("assets/gallery/")]
    total = (len(files) + BATCH - 1) // BATCH
    print("gallery files=%d batches=%d extra=%d" % (len(files), total, len(code_files)), flush=True)

    n = 0
    for i in range(0, len(files), BATCH):
        chunk = files[i:i + BATCH]
        n += 1
        run("git add " + " ".join('"%s"' % f for f in chunk))
        run('git commit -q -m "gallery photos %d/%d"' % (n, total))
        push(n)

    if code_files:
        run("git add " + " ".join('"%s"' % f for f in code_files))
        run('git commit -q -m "gallery: first photo in thumbs, jabama-style more-photos lightbox, catalog with all photos"')
        push(n + 1)

    _, log = run("git log --oneline -1")
    print(log.strip(), flush=True)
    _, st = run("git status -sb", check=False)
    print(st.splitlines()[0], flush=True)


if __name__ == "__main__":
    main()
