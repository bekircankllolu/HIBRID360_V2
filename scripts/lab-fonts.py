"""LAB — monks.com'un dört sesine en yakın açık lisanslı fontlar.

    python scripts/lab-fonts.py

Helvetica Now Extended -> Archivo wdth 125 (Expanded), wght 400-800
Helvetica Now          -> Inter Tight, wght 400-600
Morian (serif)         -> Newsreader (mevcut dosya, değişmedi)
Caveat                 -> Caveat (aynı font, OFL)

Yalnız HIBRID360-lab deneyi içindir; üretim betiği generate-fonts.py.
"""

from __future__ import annotations

import importlib.util
import io
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("genfonts", HERE / "generate-fonts.py")
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

print("Archivo Expanded — display (wdth 125, wght 400-800)")
archivo = TTFont(io.BytesIO(gen.fetch(f"{gen.GF}/archivo/Archivo%5Bwdth%2Cwght%5D.ttf")))
archivo = instancer.instantiateVariableFont(archivo, {"wght": (400, 700, 800), "wdth": 125}, updateFontNames=False)
gen.build(archivo, gen.OUT / "lab-archivo-expanded-latin-tr.woff2")

print("Inter Tight — gövde/ui (wght 400-600)")
tight = TTFont(io.BytesIO(gen.fetch(f"{gen.GF}/intertight/InterTight%5Bwght%5D.ttf")))
tight = instancer.instantiateVariableFont(tight, {"wght": (400, 500, 600)}, updateFontNames=False)
gen.build(tight, gen.OUT / "lab-inter-tight-latin-tr.woff2")

print("Caveat — el yazısı (wght 400-600)")
caveat = TTFont(io.BytesIO(gen.fetch(f"{gen.GF}/caveat/Caveat%5Bwght%5D.ttf")))
caveat = instancer.instantiateVariableFont(caveat, {"wght": (400, 500, 600)}, updateFontNames=False)
gen.build(caveat, gen.OUT / "lab-caveat-latin-tr.woff2")

for family, name in (("intertight", "InterTight"), ("caveat", "Caveat")):
    (gen.OUT / f"OFL-{name}.txt").write_bytes(gen.fetch(f"{gen.GF}/{family}/OFL.txt"))
print("tamam")
