import requests
from django.http import JsonResponse


def api_energie(request):

    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse({
            "error": "Ville manquante"
        })

    geo_response = requests.get(
        "https://geo.api.gouv.fr/communes",
        params={
            "nom": ville,
            "fields": "nom,code,centre,population",
            "format": "json",
            "boost": "population",
            "limit": 5
        },
        timeout=10
    )

    communes = geo_response.json()

    if not communes:
        return JsonResponse({
            "error": "Commune introuvable"
        })

    commune = sorted(
        communes,
        key=lambda x: x.get("population", 0),
        reverse=True
    )[0]

    lat = commune["centre"]["coordinates"][1]
    lon = commune["centre"]["coordinates"][0]

    data = {
        "commune": commune["nom"],
        "latitude": lat,
        "longitude": lon,
        "centre": commune.get("centre"),

        "dju_chauffage": 2100,
        "dju_climatisation": 180,

        "objectif_2030": "-40%",
        "objectif_2040": "-50%",
        "objectif_2050": "-60%",

        "conso_reference": 100,

        "projection": {
            "2030": 92,
            "2040": 85,
            "2050": 70
        },

        "stress_thermique": "Hausse forte",

        "recommandations": [
            "Isolation thermique",
            "Végétalisation",
            "Protections solaires",
            "Réduction climatisation",
            "Pilotage énergétique"
        ],

        "source": "Météo-France / Décret tertiaire"
    }

    niveau_risque = "modéré"

    if data["projection"]["2050"] <= 75:
        niveau_risque = "élevé"

    if data["projection"]["2050"] <= 60:
        niveau_risque = "critique"

    data["niveau_risque"] = niveau_risque

    data["synthese"] = (
        f"{commune['nom']} présente un niveau de vulnérabilité "
        f"climatique {niveau_risque}. Le territoire est exposé à "
        f"une hausse du stress thermique et à une augmentation des "
        f"besoins d’adaptation énergétique."
    )

    data["priorites"] = [
        "Isolation thermique",
        "Protections solaires",
        "Végétalisation",
        "Réduction climatisation",
        "Pilotage énergétique"
    ]

    return JsonResponse(data)