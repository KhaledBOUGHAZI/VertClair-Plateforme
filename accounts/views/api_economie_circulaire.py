import pandas as pd
import requests

from math import radians, sin, cos, sqrt, atan2
from pathlib import Path

from django.conf import settings
from django.http import JsonResponse


def distance_km(lat1, lon1, lat2, lon2):
    r = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    return r * 2 * atan2(sqrt(a), sqrt(1 - a))


def chercher_commune(ville):
    geo = requests.get(
        "https://geo.api.gouv.fr/communes",
        params={
            "nom": ville,
            "fields": "nom,code,centre,population",
            "format": "json",
            "limit": 20
        },
        timeout=10
    ).json()

    if not geo:
        return None

    return sorted(
        geo,
        key=lambda c: c.get("population", 0),
        reverse=True
    )[0]


def classer_acteur(acteur):

    texte = " ".join([
        str(acteur.get("type", "")),
        str(acteur.get("service", "")),
        str(acteur.get("type_acteur", "")),
        str(acteur.get("nom", ""))
    ]).lower()

    categories = []

    if "structure_de_collecte" in texte:
        categories.append("collecte")

    if any(mot in texte for mot in [
        "service_de_reparation",
        "atelier_pour_reparer_soi_meme",
        "structure_qui_sous_traite_la_reparation",
        "pieces_detachees",
        "tutoriels_et_diagnostics_en_ligne"
    ]):
        categories.append("reparation")

    if any(mot in texte for mot in [
        "recyclerie",
        "don_particuliers",
        "ess"
    ]):
        categories.append("reemploi")

    if any(mot in texte for mot in [
        "espace_de_partage",
        "partage_particuliers",
        "location_professionnel",
        "localtion_particuliers"
    ]):
        categories.append("partage")

    if any(mot in texte for mot in [
        "achat_revente_professionnel",
        "achat_revente_particuliers",
        "depot_vente"
    ]):
        categories.append("achatRevente")

        if any(mot in texte for mot in [
        "compost",
        "compostage",
        "biodéchets",
        "biodechets",
        "déchets organiques",
        "dechets organiques",
        "valorisation organique"
    ]):
            categories.append("biodechets")

    if not categories:
        categories.append("autre")

    return categories

def api_economie_circulaire(request):

    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse({
            "error": "Ville manquante"
        })

    corrections_communes = {
        "pacy": "Pacy-sur-Eure",
        "pacy sur eure": "Pacy-sur-Eure",
        "pacy-sur-eure": "Pacy-sur-Eure",
    }

    ville_recherche = corrections_communes.get(
        ville.lower().strip(),
        ville
    )

    commune = chercher_commune(ville_recherche)

    if commune is None:
        return JsonResponse({
            "error": "Commune introuvable"
        })

    lon_commune = commune["centre"]["coordinates"][0]
    lat_commune = commune["centre"]["coordinates"][1]

    fichier = (
        Path(settings.BASE_DIR)
        / "accounts"
        / "data"
        / "dechets"
        / "economie_circulaire_light.csv"
    )

    df = pd.read_csv(
        fichier,
        low_memory=False
    )
    

    df["latitude"] = (
        df["latitude"]
        .astype(str)
        .str.replace(",", ".", regex=False)
    )

    df["longitude"] = (
        df["longitude"]
        .astype(str)
        .str.replace(",", ".", regex=False)
    )

    df["latitude"] = pd.to_numeric(
        df["latitude"],
        errors="coerce"
    )

    df["longitude"] = pd.to_numeric(
        df["longitude"],
        errors="coerce"
    )

    df = df.dropna(
        subset=[
            "latitude",
            "longitude"
        ]
    )

    df["distance"] = df.apply(
        lambda ligne: distance_km(
            lat_commune,
            lon_commune,
            float(ligne["latitude"]),
            float(ligne["longitude"])
        ),
        axis=1
    )

    resultat = (
        df
        .sort_values("distance")
        .head(80)
        .copy()
    )

    acteurs = []

    collecte = []
    reparation = []
    reemploi = []
    partage = []
    achat_revente = []
    biodechets = []

    for _, ligne in resultat.iterrows():

        acteur = {
            "nom": ligne.get("nom", ""),
            "type": ligne.get("type_de_services", ""),
            "service": ligne.get("type_de_services", ""),
            "type_acteur": ligne.get("type_dacteur", ""),
            "ville": ligne.get("ville", ""),
            "adresse": ligne.get("adresse", ""),
            "lat": ligne.get("latitude", ""),
            "lon": ligne.get("longitude", ""),
            "distance_km": round(
                float(ligne.get("distance", 0)),
                1
            )
        }

        categories = classer_acteur(acteur)
        if "recyclerie" in str(acteur.get("service", "")).lower():
           
            acteur["categories"] = categories
            acteur["categorie"] = ", ".join(categories)

            acteurs.append(acteur)

        if "collecte" in categories:
            collecte.append(acteur)

        if "reparation" in categories:
            reparation.append(acteur)

        if "reemploi" in categories:
            reemploi.append(acteur)

        if "partage" in categories:
            partage.append(acteur)

        if "achatRevente" in categories:
            achat_revente.append(acteur)
                    
        if "biodechets" in categories:
            biodechets.append(acteur)

    categories = classer_acteur(acteur)
    acteur["categories"] = categories
    acteur["categorie"] = ", ".join(categories)

    acteurs.append(acteur)

    if "collecte" in categories:
        collecte.append(acteur)

    if "reparation" in categories:
        reparation.append(acteur)

    if "reemploi" in categories:
        reemploi.append(acteur)

    if "partage" in categories:
        partage.append(acteur)

    if "achatRevente" in categories:
        achat_revente.append(acteur)

    return JsonResponse({
        "commune": commune["nom"],
        "code_insee": commune["code"],
        "acteurs": acteurs,
        "collecte": collecte,
        "reparation": reparation,
        "reemploi": reemploi,
        "partage": partage,
        "achatRevente": achat_revente,
        "biodechets": biodechets
    })