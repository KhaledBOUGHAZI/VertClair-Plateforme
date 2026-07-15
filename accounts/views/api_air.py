import requests

from datetime import date
from django.conf import settings
from django.http import JsonResponse


def get_atmo_token():
    url = f"{settings.ATMO_API_URL}/login"

    payload = {
        "username": settings.ATMO_USERNAME,
        "password": settings.ATMO_PASSWORD
    }

    response = requests.post(url, json=payload, timeout=10)

    if response.status_code != 200:
        print("Erreur token Atmo :", response.status_code, response.text)
        return None

    data = response.json()
    return data.get("token")


def get_indice_air(request):
    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse({"error": "Ville manquante"}, status=400)

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
        return JsonResponse({"error": "Ville introuvable"}, status=404)

    commune = sorted(
        communes,
        key=lambda x: x.get("population", 0),
        reverse=True
    )[0]

    code_insee = commune["code"]

    token = get_atmo_token()

    if not token:
        return JsonResponse({"error": "Connexion Atmo impossible"}, status=500)

    headers = {
        "Authorization": f"Bearer {token}"
    }

    atmo_response = requests.get(
        f"{settings.ATMO_API_URL}/v2/data/indices/atmo",
        headers=headers,
        params={
            "format": "geojson",
            "date": date.today().isoformat(),
            "code_commune": code_insee
        },
        timeout=15
    )

    if atmo_response.status_code != 200:
        return JsonResponse({
            "error": "Erreur API Atmo",
            "details": atmo_response.text
        }, status=atmo_response.status_code)

    atmo_data = atmo_response.json()

    if atmo_data.get("features"):
        return JsonResponse({
            "commune": commune["nom"],
            "commune_demandee": ville,
            "code_insee": code_insee,
            "source": "commune demandée",
            "atmo": atmo_data
        })

    return JsonResponse({
        "error": f"Aucune donnée Atmo trouvée pour {commune['nom']}."
    }, status=404)