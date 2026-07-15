import csv
import requests

from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    help = "Synchronise les acteurs ADEME de l'économie circulaire."

    def handle(self, *args, **options):

        dataset = (
            "longue-vie-aux-objects-acteurs-de-leconomie-circulaire"
        )

        url = (
            "https://data.ademe.fr/api/explore/v2.1/catalog/datasets/"
            f"{dataset}/records"
        )

        dossier = (
            Path(settings.BASE_DIR)
            / "accounts"
            / "data"
            / "dechets"
        )

        dossier.mkdir(
            parents=True,
            exist_ok=True
        )

        fichier_sortie = (
            dossier
            / "economie_circulaire_light.csv"
        )

        colonnes = [
            "nom",
            "type_acteur",
            "code_postal",
            "ville",
            "latitude",
            "longitude",
            "type_de_services",
            "paternite",
            "date_de_derniere_modification",
        ]

        limit = 100
        offset = 0
        total = 0

        with open(
            fichier_sortie,
            "w",
            newline="",
            encoding="utf-8"
        ) as f:

            writer = csv.DictWriter(
                f,
                fieldnames=colonnes
            )

            writer.writeheader()

            while True:

                response = requests.get(
                    url,
                    params={
                        "limit": limit,
                        "offset": offset,
                        "select": ",".join(colonnes),
                    },
                    timeout=30
                )

                response.raise_for_status()

                data = response.json()

                records = data.get(
                    "results",
                    []
                )

                if not records:
                    break

                for record in records:

                    ligne = {}

                    for colonne in colonnes:
                        ligne[colonne] = record.get(
                            colonne,
                            ""
                        )

                    writer.writerow(ligne)

                total += len(records)
                offset += limit

                self.stdout.write(
                    f"{total} lignes synchronisées..."
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Synchronisation terminée : {total} lignes."
            )
        )