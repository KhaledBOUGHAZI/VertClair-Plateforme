import requests
from django.http import JsonResponse


def api_sensibilite_commune(request):

    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse(
            {"error": "Commune manquante"},
            status=400
        )

    try:
        response = requests.get(
            "https://geo.api.gouv.fr/communes",
            params={
                "nom": ville,
                "fields": "nom,code,population,surface",
                "format": "json",
                "limit": 1
            },
            timeout=10
        )

        communes = response.json()

        if not communes:
            return JsonResponse(
                {"error": "Commune introuvable"},
                status=404
            )

        commune = communes[0]

        population = commune.get("population", 0)
        surface = commune.get("surface", 1)

        densite = round(population / surface, 2)

        score = 30

        if population > 100000:
            score += 25
        elif population > 20000:
            score += 15
        elif population > 5000:
            score += 8

        if densite > 3000:
            score += 25
        elif densite > 1000:
            score += 15
        elif densite > 300:
            score += 8

        return JsonResponse({
            "commune": commune.get("nom"),
            "code_insee": commune.get("code"),
            "population": population,
            "surface_ha": surface,
            "densite_hab_ha": densite,
            "score_sensibilite": min(score, 100),
            "source": "INSEE / geo.api.gouv.fr"
        })

    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500
        )