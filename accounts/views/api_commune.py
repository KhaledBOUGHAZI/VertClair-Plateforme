import requests

from django.http import JsonResponse


def api_commune(request):

    recherche = request.GET.get("q", "").strip()

    if not recherche:
        return JsonResponse({
            "success": False,
            "error": "Aucune commune renseignée."
        })

    # Recherche de la commune
    r = requests.get(
        "https://api-adresse.data.gouv.fr/search/",
        params={
            "q": recherche,
            "limit": 1
        },
        timeout=10
    )

    r.raise_for_status()

    data = r.json()

    if not data["features"]:
        return JsonResponse({
            "success": False,
            "error": "Commune introuvable."
        })

    feature = data["features"][0]

    props = feature["properties"]

    lon, lat = feature["geometry"]["coordinates"]

    code = props["citycode"]

    # Informations administratives
    commune = requests.get(
        f"https://geo.api.gouv.fr/communes/{code}",
        params={
            "fields": "nom,population,departement,region,centre,contour"
        },
        timeout=10
    )

    commune.raise_for_status()

    c = commune.json()

    return JsonResponse({

        "success": True,

        "nom": c["nom"],

        "code_insee": code,

        "population": c.get("population"),

        "departement": c.get("departement"),

        "region": c.get("region"),

        "latitude": lat,

        "longitude": lon,

        "centre": c.get("centre"),

        "contour": c.get("contour")
    })