import requests
from django.http import JsonResponse


def get_donnees_eaux(request):

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

    lon = commune["centre"]["coordinates"][0]
    lat = commune["centre"]["coordinates"][1]

    print("Latitude :", lat)
    print("Longitude :", lon)

    eau_potable = []
    nitrates = []
    pesticides = []
    dernier_prelevement = None
    conclusion = "Non disponible"

    try:
        eau_potable_response = requests.get(
            "https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/resultats_dis",
            params={
                "code_commune": code_insee,
                "size": 100,
                "format": "json"
            },
            timeout=10
        )

        if eau_potable_response.status_code in [200, 206]:
            data = eau_potable_response.json()
            eau_potable = data.get("data", [])

            if eau_potable:
                eau_potable = sorted(
                    eau_potable,
                    key=lambda x: x.get("date_prelevement") or "",
                    reverse=True
                )

                dernier_prelevement = eau_potable[0].get("date_prelevement")
                conclusion = eau_potable[0].get(
                    "conclusion_conformite_prelevement",
                    "Non disponible"
                )

                for item in eau_potable:
                    parametre = (item.get("libelle_parametre") or "").lower()

                    if "nitrate" in parametre:
                        nitrates.append(item)

                    if "pesticide" in parametre or "atrazine" in parametre:
                        pesticides.append(item)

    except Exception as e:
        print("Erreur eau potable :", e)

    rivieres = []

    try:
        cours_eau_response = requests.get(
            "https://hubeau.eaufrance.fr/api/v2/qualite_rivieres/station_pc",
            params={
                "code_commune": code_insee,
                "size": 10,
                "format": "json"
            },
            timeout=10
        )

        if cours_eau_response.status_code in [200, 206]:
            rivieres = cours_eau_response.json().get("data", [])

    except Exception as e:
        print("Erreur rivières :", e)

    analyses_rivieres = []

    for station in rivieres[:5]:
        code_station = station.get("code_station")

        if not code_station:
            continue

        try:
            analyse_response = requests.get(
                "https://hubeau.eaufrance.fr/api/v2/qualite_rivieres/analyse_pc",
                params={
                    "code_station": code_station,
                    "size": 100,
                    "sort": "desc",
                    "format": "json"
                },
                timeout=5
            )

            if analyse_response.status_code in [200, 206]:
                analyses = analyse_response.json().get("data", [])

                analyses = [
                    analyse for analyse in analyses
                    if (
                        analyse.get("resultat")
                        or analyse.get("resultat_numerique")
                        or analyse.get("resultat_alphanumerique")
                    )
                ]

                analyses = sorted(
                    analyses,
                    key=lambda x: x.get("date_prelevement") or "",
                    reverse=True
                )

                analyses_rivieres.append({
                    "station": station,
                    "analyses": analyses[:10]
                })

        except requests.exceptions.Timeout:
            analyses_rivieres.append({
                "station": station,
                "analyses": [],
                "erreur": "Délai dépassé pour cette station"
            })

        except Exception as e:
            print("Erreur analyse rivière :", e)

    return JsonResponse({
        "commune": commune["nom"],
        "commune_demandee": ville,
        "code_insee": code_insee,
        "source": "commune demandée",
        "centre": commune.get("centre"),
        "dernier_prelevement": dernier_prelevement,
        "conclusion": conclusion,
        "nitrates": nitrates[:5],
        "pesticides": pesticides[:5],
        "eau_potable": eau_potable[:100],
        "rivieres": rivieres[:10],
        "analyses_rivieres": analyses_rivieres,
        "source": "Hub’Eau / Eaufrance"
    })

from django.http import JsonResponse
import requests