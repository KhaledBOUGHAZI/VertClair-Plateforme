import requests

from django.conf import settings
from django.http import JsonResponse


def rechercher_commune_ou_adresse(recherche):
    url = "https://api-adresse.data.gouv.fr/search/"

    params = {
        "q": recherche,
        "limit": 1,
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()

    if not data.get("features"):
        return None

    feature = data["features"][0]
    props = feature.get("properties", {})
    coords = feature.get("geometry", {}).get("coordinates", [None, None])

    code_insee = props.get("citycode")

    population = None
    superficie_km2 = None

    if code_insee:
        commune_api = requests.get(
            f"https://geo.api.gouv.fr/communes/{code_insee}",
            params={"fields": "population,surface,nom,code"},
            timeout=10,
        )
        if commune_api.status_code == 200:
            commune_data = commune_api.json()
            population = commune_data.get("population")
            surface_ha = commune_data.get("surface")
            if surface_ha:
                superficie_km2 = round(surface_ha / 100, 2)

    return {
        "commune": props.get("city"),
        "code_insee": code_insee,
        "longitude": coords[0],
        "latitude": coords[1],
        "population": population,
        "superficie_km2": superficie_km2,
    }


def appeler_georisques_ssp(code_insee):
    url = "https://www.georisques.gouv.fr/api/v2/ssp"

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {settings.GEORISQUES_API_TOKEN}",
    }

    params = {
        "codesInsee": code_insee,
        "pageSize": 1000,
        "pageNumber": 0,
        "rayon": 0,
    }

    response = requests.get(url, headers=headers, params=params, timeout=20)
    response.raise_for_status()

    return response.json()


def api_sols(request):
    recherche = request.GET.get("q", "").strip()

    if not recherche:
        return JsonResponse({
            "success": False,
            "error": "Veuillez saisir une commune ou une adresse."
        }, status=400)

    try:
        commune = rechercher_commune_ou_adresse(recherche)

        if not commune or not commune.get("code_insee"):
            return JsonResponse({
                "success": False,
                "error": "Commune introuvable."
            }, status=404)

        donnees_ssp = appeler_georisques_ssp(commune["code_insee"])

        casias = donnees_ssp.get("casias", {}).get("content", [])
        instructions = donnees_ssp.get("instructions", {}).get("content", [])
        sis = donnees_ssp.get("conclusionsSis", {}).get("content", [])
        sup = donnees_ssp.get("conclusionsSup", {}).get("content", [])

        return JsonResponse({
            "success": True,
            "commune": commune,
            "diagnostic": {
                "casias": len(casias),
                "sites_pollues": len(instructions),
                "sis": len(sis),
                "sup": len(sup),
            },
            "donnees": {
                "casias": casias,
                "sites_pollues": instructions,
                "sis": sis,
                "sup": sup,
            },
            "sources": [
                "Géorisques",
                "InfoSols",
                "BRGM"
            ]
        })

    except requests.HTTPError as e:
        return JsonResponse({
            "success": False,
            "error": f"Erreur API Géorisques : {e}"
        }, status=500)

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)