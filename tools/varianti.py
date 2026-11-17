"""Crea le versioni ridotte delle foto usate dal sito (srcset).

Uso, dalla cartella del progetto:  python3 tools/varianti.py
Da rilanciare ogni volta che si sostituisce una foto in assets/img.
"""
from pathlib import Path
from PIL import Image

IMG = Path(__file__).resolve().parent.parent / "assets" / "img"
LARGHEZZE = {
    "reparti": [800],
    "sposa": [800],
    "look": [800],
    "evento": [1200, 480],
    "boutique": [800],
    "prodotti": [600],
}

for cartella, larghezze in LARGHEZZE.items():
    for foto in sorted((IMG / cartella).glob("*.jpg")):
        if foto.stem.rsplit("-", 1)[-1].isdigit():
            continue  # salta le varianti gia create
        originale = Image.open(foto).convert("RGB")
        for w in larghezze:
            h = round(originale.height * w / originale.width)
            out = foto.with_name(f"{foto.stem}-{w}.jpg")
            originale.resize((w, h), Image.LANCZOS).save(out, "JPEG", quality=80, optimize=True, progressive=True)
            print(out.relative_to(IMG), f"{out.stat().st_size // 1024} KB")
