"""Verify delivered APK embeds exactly the current offline app assets."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parent.parent
apk = root / "TreningNaukowo.apk"
assets = root / "android/app/src/main/assets"
with zipfile.ZipFile(apk) as archive:
    names = archive.namelist()
    assert len(names) == len(set(names)), "Duplicate archive entries"
    assert not any("\\" in name for name in names), "Windows path separator in APK"
    assert "classes.dex" in names and "AndroidManifest.xml" in names
    checked = []
    for file in sorted(assets.rglob("*")):
        if not file.is_file():
            continue
        name = "assets/" + file.relative_to(assets).as_posix()
        assert archive.read(name) == file.read_bytes(), f"Asset differs: {name}"
        checked.append(name)
    assert sum(name.startswith("assets/") and not name.endswith("/") for name in names) == len(checked)
result = {"apk": str(apk), "bytes": apk.stat().st_size,
          "sha256": hashlib.sha256(apk.read_bytes()).hexdigest(), "exact_assets": checked}
(root / "qa/final-asset-verification.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(result, ensure_ascii=False, indent=2))
