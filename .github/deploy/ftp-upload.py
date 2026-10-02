"""Uploads every file in _site/ to the FTP server and checks the sizes.

Used by .github/workflows/deploy-ftp.yml. curl does the transfers (FTP with
TLS, one reused connection); the login comes from the curl config file the
workflow writes. Nothing on the server is ever deleted.

Usage: python3 ftp-upload.py <curl login config> <server> <remote dir>
"""
import os
import subprocess
import sys
import time
from urllib.parse import quote

login_cfg, server, remote_dir = sys.argv[1], sys.argv[2], sys.argv[3]
LOCAL = "_site"
# TLS 1.2: some FTP servers stall at the end of each transfer under TLS 1.3.
CURL = ["curl", "-sS", "--ssl-reqd", "--tls-max", "1.2", "--retry", "3",
        "--connect-timeout", "20", "--speed-limit", "1", "--speed-time", "60",
        "-K", login_cfg]


def url(path):
    return f"ftp://{server}/{quote(remote_dir + path)}"


def cfg_value(text):
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'


files = sorted(
    os.path.relpath(os.path.join(root, name), LOCAL).replace(os.sep, "/")
    for root, _, names in os.walk(LOCAL)
    for name in names
)


def upload(paths):
    cfg = os.path.join(os.environ.get("RUNNER_TEMP", "."), "ftp-files.cfg")
    with open(cfg, "w", encoding="utf-8") as f:
        for p in paths:
            f.write(f"upload-file = {cfg_value(os.path.join(LOCAL, p))}\n")
            f.write(f"url = {cfg_value(url(p))}\n")
    subprocess.run(
        CURL + ["--ftp-create-dirs", "-w", "%{time_total}s  %{url}\\n", "-K", cfg],
        check=True,
    )
    os.remove(cfg)


def remote_sizes(folder):
    """Sizes of the files in one remote folder, from its LIST output."""
    out = subprocess.run(
        CURL + [url(folder)], check=True, capture_output=True, text=True
    ).stdout
    sizes = {}
    for line in out.splitlines():
        parts = line.rstrip("\r").split(None, 8)
        if len(parts) == 9 and parts[0].startswith("-"):
            sizes[parts[8]] = int(parts[4])
    return sizes


def mismatched():
    bad, cache = [], {}
    for p in files:
        folder = p.rsplit("/", 1)[0] + "/" if "/" in p else ""
        if folder not in cache:
            cache[folder] = remote_sizes(folder)
        name = p.rsplit("/", 1)[-1]
        if cache[folder].get(name) != os.path.getsize(os.path.join(LOCAL, p)):
            bad.append(p)
    return bad


start = time.time()
print(f"Uploading {len(files)} files to /{remote_dir}", flush=True)
todo = files
for attempt in range(3):
    upload(todo)
    print("Checking file sizes on the server...", flush=True)
    todo = mismatched()
    if not todo:
        print(f"All website files are on the server ({time.time() - start:.0f}s).")
        sys.exit(0)
    print(f"Sending again ({len(todo)} incomplete): {', '.join(todo)}")

print("::error::These files did not upload correctly: " + ", ".join(todo))
sys.exit(1)
