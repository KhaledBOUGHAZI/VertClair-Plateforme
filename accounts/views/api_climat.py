import requests
from django.http import JsonResponse


def api_climat(request):

    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse({
            "error": "Ville manquante"
        })

    try:
        response = requests.get(
            "https://geo.api.gouv.fr/communes",
            params={
                "nom": ville,
                "fields": "nom,centre,population",
                "format": "json",
                "boost": "population",
                "limit": 5
            },
            timeout=10
        )

        communes = response.json()

        if not communes:
            return JsonResponse({
                "error": "Ville introuvable"
            })

        commune = sorted(
            communes,
            key=lambda x: x.get("population", 0),
            reverse=True
        )[0]

        return JsonResponse({

            "commune": commune["nom"],
            "centre": commune.get("centre"),

            "objectifs": {
                "accord_paris_15": 1.5,
                "accord_paris_2": 2.0,
                "neutralite_france": "Neutralité carbone 2050",
                "reduction_france_2030":
                    "Réduction importante des émissions d'ici 2030"
            },

            "scenarios": {

                "Transition forte": {

                    "description":
                        "Scénario sobre / émissions réduites",

                    "2030": {
                        "temperature": 1.4,
                        "jours_chaleur": 14,
                        "nuits_tropicales": 4,
                        "secheresse": "Hausse modérée"
                    },

                    "2050": {
                        "temperature": 1.8,
                        "jours_chaleur": 20,
                        "nuits_tropicales": 8,
                        "secheresse": "Hausse modérée"
                    },

                    "2100": {
                        "temperature": 2.1,
                        "jours_chaleur": 25,
                        "nuits_tropicales": 12,
                        "secheresse": "Hausse maîtrisée"
                    }
                },

                "Scénario intermédiaire": {

                    "description": "Scénario médian",

                    "2030": {
                        "temperature": 1.8,
                        "jours_chaleur": 18,
                        "nuits_tropicales": 6,
                        "secheresse": "Hausse modérée"
                    },

                    "2050": {
                        "temperature": 2.7,
                        "jours_chaleur": 28,
                        "nuits_tropicales": 15,
                        "secheresse": "Hausse importante"
                    },

                    "2100": {
                        "temperature": 3.5,
                        "jours_chaleur": 40,
                        "nuits_tropicales": 24,
                        "secheresse": "Hausse forte"
                    }
                },

                "Fortes émissions": {

                    "description":
                        "Scénario pessimiste / émissions élevées",

                    "2030": {
                        "temperature": 2.0,
                        "jours_chaleur": 22,
                        "nuits_tropicales": 8,
                        "secheresse": "Hausse importante"
                    },

                    "2050": {
                        "temperature": 3.4,
                        "jours_chaleur": 38,
                        "nuits_tropicales": 24,
                        "secheresse": "Hausse forte"
                    },

                    "2100": {
                        "temperature": 5.1,
                        "jours_chaleur": 65,
                        "nuits_tropicales": 45,
                        "secheresse": "Hausse très forte"
                    }
                }
            },

            "source":
                "DRIAS / Météo-France - valeurs provisoires de démonstration"
        })

    except Exception as e:
        return JsonResponse({
            "error": str(e)
        })


def risques_climat(request):

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
            "error": "Ville introuvable"
        })

    commune = sorted(
        communes,
        key=lambda x: x.get("population", 0),
        reverse=True
    )[0]

    code_insee = commune["code"]

    lon = commune["centre"]["coordinates"][0]
    lat = commune["centre"]["coordinates"][1]

    argiles = "non renseigné"
    inondation = "non renseigné"
    feu_foret = "non renseigné"
    mouvement_terrain = "non renseigné"

    risques_detectes = []

    try:
        response_risques = requests.get(
            "https://www.georisques.gouv.fr/api/v1/gaspar/risques",
            params={
                "code_insee": code_insee,
                "rayon": 1000
            },
            timeout=10
        )

        data_risques = response_risques.json()

        risques_detail = data_risques["data"][0].get(
            "risques_detail",
            []
        )

        for risque in risques_detail:

            libelle = risque.get(
                "libelle_risque_long",
                ""
            )

            libelle_lower = libelle.lower()

            if libelle and libelle not in risques_detectes:
                risques_detectes.append(libelle)

            if "inondation" in libelle_lower:
                inondation = "concerné"

            if "mouvement de terrain" in libelle_lower:
                mouvement_terrain = "concerné"

            if "feu" in libelle_lower or "incendie" in libelle_lower:
                feu_foret = "concerné"

            if "argile" in libelle_lower:
                argiles = "concerné"

    except Exception as e:
        print("Erreur GASPAR :", e)

    risques = {
        "argiles": argiles,
        "inondation": inondation,
        "secheresse": "à compléter avec DRIAS / Météo-France",
        "feu_foret": feu_foret,
        "mouvement_terrain": mouvement_terrain
    }

    priorites = []

    if inondation == "concerné":
        priorites.append(
            "Renforcer la gestion des eaux pluviales"
        )

    if argiles == "concerné":
        priorites.append(
            "Adapter les fondations et limiter l’imperméabilisation"
        )

    if mouvement_terrain == "concerné":
        priorites.append(
            "Surveiller les zones de glissement et les talus"
        )

    if feu_foret == "concerné":
        priorites.append(
            "Prévenir les incendies et renforcer les coupures végétales"
        )

    details_score = {
        "chaleur": 18,
        "secheresse": 16,
        "inondation": 10 if inondation == "concerné" else 0,
        "mouvement_terrain": 12 if mouvement_terrain == "concerné" else 0,
        "argiles": 15 if argiles == "concerné" else 0,
        "vegetation": 8,
        "batiments": 3
    }

    score_total = sum(details_score.values())

    if score_total < 30:
        niveau = "faible"

    elif score_total < 60:
        niveau = "modéré"

    elif score_total < 80:
        niveau = "élevé"

    else:
        niveau = "critique"

    return JsonResponse({

        "commune": commune["nom"],
        "latitude": lat,
        "longitude": lon,
        "score_vulnerabilite": score_total,
        "niveau": niveau,
        "details_score": details_score,
        "risques": risques,
        "risques_detectes": risques_detectes,
        "priorites": priorites,
        "centre": commune.get("centre"),
        "source": "Géorisques / DRIAS / démonstration"
    })