"""Fetch the official MoC7 programme, snapshot every abstract entry, report changes."""
import json, os, sys, urllib.request
from bs4 import BeautifulSoup

URL = "https://amcs-community.org/moc7-schedule-information/"
HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "snapshot.json")
BASE = os.path.join(HERE, "baseline.json")   # the programme as verified against the app on 11 Oct
LIVE = os.path.join(HERE, "..", "..", "moc7", "live.json")  # served next to the app; it applies these on load

req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (MoC7 Atlas programme watcher)"})
html = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")
soup = BeautifulSoup(html, "html.parser")

def txt(el, sel):
    f = el.select_one(sel)
    return " ".join(f.get_text(" ", strip=True).split()) if f else ""

entries = {}
for a in soup.select("article.abs"):
    key = a.get("id") or txt(a, ".no") + "|" + txt(a, ".title")
    sec = next((p.get("id") for p in a.parents if p.get("id")), "")
    entries[key] = {k: txt(a, "." + k) for k in ("no", "name", "co", "slot", "title")}
    entries[key]["section"] = sec

if len(entries) < 20:
    print(f"Only {len(entries)} entries parsed; page layout may have changed or fetch blocked.")
    sys.exit(1)

old = json.load(open(SNAP)) if os.path.exists(SNAP) else None
json.dump(entries, open(SNAP, "w"), indent=1, ensure_ascii=False, sort_keys=True)

lines = []
if old is not None:
    for k in sorted(set(old) | set(entries)):
        o, n = old.get(k), entries.get(k)
        label = (n or o).get("name") or k
        if o is None:
            lines.append(f"- **Added** {label}: {n['title']} ({n['slot']})")
        elif n is None:
            lines.append(f"- **Removed** {label}: {o['title']} ({o['slot']})")
        else:
            for f in ("slot", "title", "name", "co", "no"):
                if o.get(f) != n.get(f):
                    lines.append(f"- **{label}** {f}: `{o.get(f)}` → `{n.get(f)}`")

# Differences from the verified baseline, for the app to apply
base = json.load(open(BASE))
changes = {}
for k in sorted(set(base) | set(entries)):
    b, n = base.get(k), entries.get(k)
    if b is None:
        changes[k] = {"added": True, **n}
    elif n is None:
        changes[k] = {"removed": True, "name": b["name"], "title": b["title"]}
    else:
        d = {f: n[f] for f in ("slot", "title", "name") if b.get(f) != n.get(f)}
        if d:
            d["was"] = {f: b[f] for f in d}
            changes[k] = d
try:
    cur = json.load(open(LIVE))
except Exception:
    cur = {"changes": None}
if cur.get("changes") != changes:
    import datetime
    json.dump({"updated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%MZ"), "changes": changes},
              open(LIVE, "w"), indent=1, ensure_ascii=False)

print(f"{len(entries)} entries; {len(lines)} changes since last check; {len(changes)} differences from baseline")
out = os.environ.get("GITHUB_OUTPUT")
if out:
    with open(out, "a") as fh:
        fh.write(f"changed={'true' if lines else 'false'}\n")
if lines:
    open(os.path.join(HERE, "changes.md"), "w").write(
        "The official MoC7 programme changed:\n\n" + "\n".join(lines) +
        f"\n\nSource: {URL}\n\nUpdate MoC7 Atlas (moc7/index.html) to match. @nefinia\n")
