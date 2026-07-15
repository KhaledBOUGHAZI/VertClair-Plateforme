import pandas as pd

from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    help = "Prépare un fichier allégé économie circulaire ADEME."

    def handle(self, *args, **options):

        source = (
            Path(settings.BASE_DIR)
            / "accounts"
            / "data"
            / "dechets"
            / "economie_circulaire.csv"
        )

        sortie = (
            Path(settings.BASE_DIR)
            / "accounts"
            / "data"
            / "dechets"
            / "economie_circulaire_light.csv"
        )

        colonnes = [
            "nom",
            "ville",
            "code_postal",
            "adresse",
            "latitude",
            "longitude",
            "type_de_services",
            "type_dacteur",
            "site_web",
            "telephone",
            "public_accueilli",
            "date_de_derniere_modification",
        ]

        morceaux = []

        for chunk in pd.read_csv(
            source,
            sep=",",
            chunksize=50000,
            low_memory=False
        ):
            chunk = chunk[colonnes]
            chunk = chunk.dropna(
                subset=["latitude", "longitude"]
            )
            morceaux.append(chunk)

        df = pd.concat(morceaux)

        df.to_csv(
            sortie,
            index=False,
            encoding="utf-8"
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Fichier allégé créé : {len(df)} lignes"
            )
        )