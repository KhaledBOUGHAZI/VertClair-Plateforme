import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

DOSSIER_FICHES = BASE_DIR / "accounts" / "data" / "fiches"

CHAMPS_PAR_DEFAUT = {
    "id": "",
    "titre": "",
    "niveau": "debutant",
    "illustration": "",
    "message_image": "",
    "resume": "",
    "pourquoi": "",
    "causes": [],
    "consequences": [],
    "solutions": [],
    "saviez_vous": "",
    "territoire": "",
    "a_retenir": "",
    "fenny": ""
}

def normaliser_fiche(chemin):
    with open(chemin, "r", encoding="utf-8") as f:
        data = json.load(f)

    for champ, valeur in CHAMPS_PAR_DEFAUT.items():
        if champ not in data:
            data[champ] = valeur

    if not data["id"]:
        data["id"] = chemin.stem

    if not data["illustration"]:
        data["illustration"] = f"{data['id']}.png"

    with open(chemin, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"✅ Normalisé : {chemin}")

def main():
    for chemin in DOSSIER_FICHES.rglob("*.json"):
        normaliser_fiche(chemin)

    print("\n🎉 Toutes les fiches ont été normalisées.")

if __name__ == "__main__":
    main()