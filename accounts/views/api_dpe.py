import requests
from django.http import JsonResponse


def api_dpe_commune(request):

    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse({
            "error": "Ville manquante"
        })

    geo_response = requests.get(
        "https://geo.api.gouv.fr/communes",
        params={
            "nom": ville,
            "fields": "nom,code,population",
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

    dpe_response = requests.get(
        "https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines",
        params={
            "qs": code_insee,
            "size": 100
        },
        timeout=15
    )

    try:
        dpe_data = dpe_response.json()

    except Exception:
        return JsonResponse({
            "error": "L’API DPE ne renvoie pas du JSON",
            "status": dpe_response.status_code,
            "reponse": dpe_response.text[:500]
        })

    resultats = dpe_data.get("results", [])

    classes = {
        "A": 0,
        "B": 0,
        "C": 0,
        "D": 0,
        "E": 0,
        "F": 0,
        "G": 0
    }

    for dpe in resultats:
        classe = dpe.get("etiquette_dpe")

        if classe in classes:
            classes[classe] += 1

    total_analyse = sum(classes.values())
    passoires = classes["F"] + classes["G"]

    if total_analyse > 0:
        part_passoires = round(
            passoires / total_analyse * 100,
            1
        )
    else:
        part_passoires = 0

    classe_dominante = max(
        classes,
        key=classes.get
    )

    return JsonResponse({
        "commune": commune["nom"],
        "code_insee": code_insee,
        "nombre_dpe": dpe_data.get("total", 0),
        "classes_dpe": classes,
        "classe_dominante": classe_dominante,
        "part_passoires": part_passoires,
        "dpe": resultats[:20],
        "source": "ADEME / DPE logements"
    })


def api_dpe_batiment(request):

    adresse = request.GET.get("adresse")
    ville = request.GET.get("ville")

    if not adresse:
        return JsonResponse({
            "error": "Adresse manquante"
        })

    if not ville:
        return JsonResponse({
            "error": "Commune manquante"
        })

    geo_response = requests.get(
        "https://geo.api.gouv.fr/communes",
        params={
            "nom": ville,
            "fields": "nom,code",
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

    code_insee = communes[0]["code"]

    dpe_response = requests.get(
        "https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines",
        params={
            "qs": adresse,
            "size": 50
        },
        timeout=15
    )

    try:
        dpe_data = dpe_response.json()

    except Exception:
        return JsonResponse({
            "error": "Erreur API DPE",
            "status": dpe_response.status_code,
            "reponse": dpe_response.text[:300]
        })

    resultats = dpe_data.get("results", [])

    resultats_commune = [
        d for d in resultats
        if str(d.get("code_insee_ban", "")) == str(code_insee)
        or str(d.get("code_insee", "")) == str(code_insee)
    ]

    if not resultats_commune:
        return JsonResponse({
            "error": "Aucun DPE trouvé dans cette commune"
        })

    dpe = resultats_commune[0]

    classe = dpe.get(
        "etiquette_dpe",
        "Non disponible"
    )

    ges = dpe.get(
        "etiquette_ges",
        "Non disponible"
    )

    passoire = classe in ["F", "G"]

    if passoire:
        niveau = "priorité élevée"
        diagnostic = (
            "Ce bâtiment semble être une passoire énergétique."
        )

    elif classe in ["D", "E"]:
        niveau = "priorité modérée"
        diagnostic = (
            "Ce bâtiment présente un potentiel d’amélioration énergétique."
        )

    else:
        niveau = "priorité faible"
        diagnostic = (
            "Ce bâtiment semble relativement performant."
        )

    recommandations = [
        "Vérifier l’isolation thermique",
        "Analyser le système de chauffage",
        "Étudier les protections solaires",
        "Mettre en place un pilotage énergétique"
    ]

    ordre = {
        "A": 7,
        "B": 6,
        "C": 5,
        "D": 4,
        "E": 3,
        "F": 2,
        "G": 1
    }

    moyenne_commune = "D"

    if ordre.get(classe, 0) > ordre.get(moyenne_commune, 0):
        comparaison_commune = "plus performant que la moyenne"

    elif ordre.get(classe, 0) < ordre.get(moyenne_commune, 0):
        comparaison_commune = "moins performant que la moyenne"

    else:
        comparaison_commune = "équivalent à la moyenne"

    return JsonResponse({
        "adresse_recherchee": dpe.get(
            "adresse_brut",
            adresse
        ),

        "classe_dpe": classe,
        "classe_ges": ges,
        "passoire_thermique": passoire,
        "niveau_priorite": niveau,
        "diagnostic": diagnostic,
        "recommandations": recommandations,
        "donnees": dpe,
        "moyenne_commune": moyenne_commune,
        "comparaison_commune": comparaison_commune,
        "source": "ADEME / DPE logements"
    })


def api_carte_dpe(request):

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

    code_insee = commune["code"]

    dpe_response = requests.get(
        "https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines",
        params={
            "qs": code_insee,
            "size": 100
        },
        timeout=20
    )

    dpe_data = dpe_response.json()
    resultats = dpe_data.get("results", [])

    donnees = []

    for dpe in resultats:

        geopoint = dpe.get("_geopoint")

        if not geopoint:
            continue

        try:
            lat, lon = geopoint.split(",")

            lat = float(lat)
            lon = float(lon)

        except Exception:
            continue

        classe = dpe.get(
            "etiquette_dpe",
            "Non disponible"
        )

        couleur = "green"

        if classe == "E":
            couleur = "orange"

        if classe in ["F", "G"]:
            couleur = "red"

        donnees.append({
            "adresse": dpe.get(
                "adresse_brut",
                "Adresse inconnue"
            ),

            "classe_dpe": classe,

            "ges": dpe.get(
                "etiquette_ges",
                "Non disponible"
            ),

            "conso": dpe.get(
                "conso_5_usages_par_m2_ef",
                "Non disponible"
            ),

            "lat": lat,
            "lon": lon,

            "couleur": couleur
        })

    return JsonResponse({
        "commune": commune["nom"],
        "centre": commune.get("centre"),
        "dpe": donnees
    })