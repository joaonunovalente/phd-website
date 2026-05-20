#!/usr/bin/env python3
import sys
from pathlib import Path

EXCLUDE_DIRS = {"_site", "vendor", "node_modules", ".git"}
EXTS = {".html", ".md", ".markdown", ".yml", ".yaml", ".bib", ".json", ".txt", ".xml", ".htm"}

REPLACEMENTS = {
    '\u2018': "'",
    '\u2019': "'",
    '\u201C': '"',
    '\u201D': '"',
}

def should_skip(path: Path):
    for part in path.parts:
        if part in EXCLUDE_DIRS:
            return True
    return False

def normalize_file(path: Path):
    try:
        text = path.read_text(encoding='utf-8')
    except Exception:
        return False
    new = text
    for k, v in REPLACEMENTS.items():
        new = new.replace(k, v)
    if new != text:
        path.write_text(new, encoding='utf-8')
        print(f"Updated: {path}")
        return True
    return False

def main(root='.'):
    rootp = Path(root)
    changed = 0
    for p in rootp.rglob('*'):
        if p.is_file() and p.suffix.lower() in EXTS and not should_skip(p):
            if normalize_file(p):
                changed += 1
    print(f"Done. Files changed: {changed}")

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else '.'
    main(target)
