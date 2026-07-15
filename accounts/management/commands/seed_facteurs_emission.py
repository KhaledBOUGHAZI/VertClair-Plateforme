from django.core.management.base import BaseCommand
from accounts.models import FacteurEmission


FACTEURS = [
    {
        "code": "energie_electricite",
        "categorie": "Energie",
        "nom": "Électricité - mix moyen France 2024",
        "unite": "kWh",
        "coefficient": 0.0519,
    },
    {
        "code": "energie_gaz",
        "categorie": "Energie",
        "nom": "Gaz naturel - 2022 - mix moyen consommation - PCS",
        "unite": "kWh",
        "coefficient": 0.2154,
    },
    {
        "code": "energie_fioul",
        "categorie": "Energie",
        "nom": "Fioul domestique - France continentale",
        "unite": "litre",
        "coefficient": 3.24348,
    },
    {
        "code": "energie_climatisation",
        "categorie": "Energie",
        "nom": "Électricité - mix moyen France 2024",
        "unite": "kWh",
        "coefficient": 0.0519,
    },

    {
        "code": "deplacement_voiture_essence",
        "categorie": "Déplacements",
        "nom": "Voiture - motorisation essence - 2023",
        "unite": "véhicule.km",
        "coefficient": 0.1978,
    },
    {
        "code": "deplacement_voiture_diesel",
        "categorie": "Déplacements",
        "nom": "Voiture - motorisation gazole - 2023",
        "unite": "véhicule.km",
        "coefficient": 0.1865,
    },
    {
        "code": "deplacement_deux_roues",
        "categorie": "Déplacements",
        "nom": "Moto <= 250 cm3 - mixte - 2023",
        "unite": "véhicule.km",
        "coefficient": 0.06958,
    },
    {
        "code": "deplacement_bus",
        "categorie": "Déplacements",
        "nom": "Autobus gazole",
        "unite": "passager.km",
        "coefficient": 0.1135579,
    },
    {
        "code": "deplacement_train",
        "categorie": "Déplacements",
        "nom": "Métro, tramway, trolleybus - agglomération > 250 000 habitants",
        "unite": "passager.km",
        "coefficient": 0.00329,
    },
    {
        "code": "deplacement_avion_court",
        "categorie": "Déplacements",
        "nom": "Avion passagers 51-100 sièges < 500 km jet avec traînées - 2023",
        "unite": "passager.km",
        "coefficient": 0.42301615,
    },
    {
        "code": "deplacement_avion_long",
        "categorie": "Déplacements",
        "nom": "Avion passagers 20-50 sièges 1000-2000 km avec traînées - 2023",
        "unite": "passager.km",
        "coefficient": 0.60399992,
    },

    {
        "code": "achats_papier",
        "categorie": "Achats / Intrants",
        "nom": "Papier",
        "unite": "kg",
        "coefficient": 0.919,
    },
    {
        "code": "achats_carton",
        "categorie": "Achats / Intrants",
        "nom": "Carton neuf",
        "unite": "kg",
        "coefficient": 0.390,
    },

    {
        "code": "fret_routier",
        "categorie": "Fret",
        "nom": "Articulé 34 à 40 T diesel routier",
        "unite": "tonne.km",
        "coefficient": 0.0836891,
    },
    {
        "code": "fret_ferroviaire",
        "categorie": "Fret",
        "nom": "Train traction électrique - chargement moyen",
        "unite": "tonne.km",
        "coefficient": 0.00167,
    },
    {
        "code": "fret_maritime",
        "categorie": "Fret",
        "nom": "Porte-conteneurs Dry - autres liaisons majeures",
        "unite": "tonne.km",
        "coefficient": 0.00956,
    },
    {
        "code": "fret_aerien",
        "categorie": "Fret",
        "nom": "Avion cargo 10 à 25 T - 500 à 1000 km avec traînées",
        "unite": "tonne.km",
        "coefficient": 3.3461728,
    },

]
class Command(BaseCommand):
    help = "Charge les facteurs d'émission VertClair de référence"

    def handle(self, *args, **options):
        for item in FACTEURS:
            FacteurEmission.objects.update_or_create(
                code=item["code"],
                defaults={
                    "categorie": item["categorie"],
                    "nom": item["nom"],
                    "unite": item["unite"],
                    "coefficient": item["coefficient"],
                    "source": "Base Empreinte® ADEME",
                    "actif": True,
                }
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"{len(FACTEURS)} facteurs d'émission chargés."
            )
        )

