import json
import os
import shutil

from django.conf import settings
from django.core.management.base import BaseCommand


SOURCE_DIR = os.path.join(settings.BASE_DIR, "data", "sources_biodiversite")
TARGET_DIR = os.path.join(settings.BASE_DIR, "data", "biodiversite")


FICHIERS_ATTENDUS = {
    "cours_eau.geojson": [
        "cours_eau.geojson",
        "CoursEau_FXX.geojson",
        "cours-deau.geojson",
    ],
    "znieff1.geojson": [
        "znieff1.geojson",
        "ZNIEFF1.geojson",
        "znieff_type1.geojson",
    ],
    "znieff2.geojson": [
        "znieff2.geojson",
        "ZNIEFF2.geojson",
        "znieff_type2.geojson",
    ],
    "natura2000.geojson": [
        "natura2000.geojson",
        "NATURA2000.geojson",
        "natura_2000.geojson",
    ],
    "zones_humides.geojson": [
        "zones_humides.geojson",
        "ZONES_HUMIDES.geojson",
        "milieux_humides.geojson",
    ],
}


class Command(BaseCommand):
    help = "Prépare les données biodiversité GeoJSON pour VertClair"

    def handle(self, *args, **options):
        os.makedirs(SOURCE_DIR, exist_ok=True)
        os.makedirs(TARGET_DIR, exist_ok=True)

        self.stdout.write("")
        self.stdout.write("🌿 Préparation des données biodiversité VertClair")
        self.stdout.write("")

        self.stdout.write(f"Dossier source : {SOURCE_DIR}")
        self.stdout.write(f"Dossier cible  : {TARGET_DIR}")
        self.stdout.write("")

        for fichier_final, variantes in FICHIERS_ATTENDUS.items():
            fichier_trouve = None

            for nom_possible in variantes:
                chemin = os.path.join(SOURCE_DIR, nom_possible)
                if os.path.exists(chemin):
                    fichier_trouve = chemin
                    break

            cible = os.path.join(TARGET_DIR, fichier_final)

            if fichier_trouve:
                if self.est_geojson_valide(fichier_trouve):
                    shutil.copyfile(fichier_trouve, cible)
                    self.stdout.write(
                        self.style.SUCCESS(f"✓ {fichier_final} préparé")
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(f"✗ {fichier_trouve} n'est pas un GeoJSON valide")
                    )
            else:
                self.stdout.write(
                    self.style.WARNING(f"⚠ {fichier_final} manquant")
                )

        self.stdout.write("")
        self.stdout.write("Terminé.")

    def est_geojson_valide(self, chemin):
        try:
            with open(chemin, "r", encoding="utf-8") as fichier:
                data = json.load(fichier)

            return (
                data.get("type") == "FeatureCollection"
                and isinstance(data.get("features"), list)
            )

        except Exception:
            return False