import csv
import math
import requests
from pathlib import Path
from django.http import JsonResponse


BASE_DIR = Path(__file__).resolve().parent.parent
CLIMAT_DIR = BASE_DIR / "data" / "climat"

FICHIERS_CLIMAT = {
    "reference": CLIMAT_DIR / "climat_ref.txt",
    "2030": CLIMAT_DIR / "climat_2030.txt",
    "2050": CLIMAT_DIR / "climat_2050.txt",
    "2100": CLIMAT_DIR / "climat_2100.txt",
}

CACHE_DRIAS = {}


def lire_fichier_drias(chemin):
    donnees = {}

    with open(chemin, "r", encoding="utf-8") as fichier:
        lignes = fichier.readlines()

    entete = None
    lignes_data = []

    for ligne in lignes:
        ligne = ligne.strip()

        if not ligne:
            continue

        if ligne.startswith("# Format des enregistrements"):
            continue

        if ligne.startswith("# Point;"):
            entete = ligne.replace("# ", "").split(";")
            entete = [col for col in entete if col]
            continue

        if ligne.startswith("#"):
            continue

        if entete:
            lignes_data.append(ligne)

    for ligne in lignes_data:
        valeurs = ligne.split(";")
        valeurs = [v for v in valeurs if v != ""]

        if len(valeurs) < len(entete):
            continue

        row = dict(zip(entete, valeurs))

        point = row["Point"]

        if point not in donnees:
            donnees[point] = {
                "point": point,
                "latitude": float(row["Latitude"]),
                "longitude": float(row["Longitude"]),
                "valeurs": []
            }

        donnees[point]["valeurs"].append(row)

    return donnees


def charger_donnees_drias():
    global CACHE_DRIAS

    if CACHE_DRIAS:
        return CACHE_DRIAS

    for horizon, chemin in FICHIERS_CLIMAT.items():
        CACHE_DRIAS[horizon] = lire_fichier_drias(chemin)

    return CACHE_DRIAS


def moyenne_lignes(lignes, indicateur):
    valeurs = []

    for ligne in lignes:
        try:
            valeurs.append(float(ligne[indicateur]))
        except Exception:
            pass

    if not valeurs:
        return None

    return round(sum(valeurs) / len(valeurs), 2)


def distance_km(lat1, lon1, lat2, lon2):
    r = 6371

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )

    return r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def trouver_point_plus_proche(lat, lon, donnees_reference):
    meilleur_point = None
    meilleure_distance = None

    for point, infos in donnees_reference.items():
        d = distance_km(
            lat,
            lon,
            infos["latitude"],
            infos["longitude"]
        )

        if meilleure_distance is None or d < meilleure_distance:
            meilleure_distance = d
            meilleur_point = point

    return meilleur_point, round(meilleure_distance, 2)


def geocoder_commune(ville):
    response = requests.get(
        "https://geo.api.gouv.fr/communes",
        params={
            "nom": ville,
            "fields": "nom,code,centre",
            "format": "json",
            "limit": 1
        },
        timeout=10
    )

    communes = response.json()

    if not communes:
        return None

    commune = communes[0]
    lon, lat = commune["centre"]["coordinates"]

    return {
        "nom": commune["nom"],
        "code_insee": commune["code"],
        "latitude": lat,
        "longitude": lon
    }


def extraire_indicateurs(point, donnees):
    resultats = {}

    for horizon, points in donnees.items():

        if point not in points:
            continue

        lignes = points[point]["valeurs"]

        resultats[horizon] = {
            "temperature_moyenne": moyenne_lignes(lignes, "TMm_yr"),
            "temperature_ete": moyenne_lignes(lignes, "TMm_seas_JJA"),
            "temperature_hiver": moyenne_lignes(lignes, "TMm_seas_DJF"),
            "jours_35": moyenne_lignes(lignes, "TX35D_yr"),
            "jours_30": moyenne_lignes(lignes, "TX30D_yr"),
            "nuits_tropicales": moyenne_lignes(lignes, "TR_yr"),
            "precipitations_ete": moyenne_lignes(lignes, "RR_seas_JJA"),
            "precipitations_hiver": moyenne_lignes(lignes, "RR_seas_DJF"),
            "pluies_extremes": moyenne_lignes(lignes, "Rx1d_yr"),
            "feux_meteo": moyenne_lignes(lignes, "IFM40_yr"),
            "sol_sec": moyenne_lignes(lignes, "SWI04_yr"),
        }

    return resultats


def api_climat_futur(request):

    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse(
            {"error": "Commune manquante"},
            status=400
        )

    try:
        commune = geocoder_commune(ville)

        if not commune:
            return JsonResponse(
                {"error": "Commune introuvable"},
                status=404
            )

        donnees = charger_donnees_drias()

        point, distance = trouver_point_plus_proche(
            commune["latitude"],
            commune["longitude"],
            donnees["reference"]
        )

        indicateurs = extraire_indicateurs(point, donnees)

        return JsonResponse({
            "commune": commune["nom"],
            "code_insee": commune["code_insee"],
            "point_drias": point,
            "distance_point_km": distance,
            "coordonnees_commune": {
                "latitude": commune["latitude"],
                "longitude": commune["longitude"]
            },
            "indicateurs": indicateurs,
            "source": "DRIAS / Météo-France / TRACC 2023 — modèle ALADIN63_CNRM-CM5"
        })

    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500
        )