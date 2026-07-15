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


def preparer_decheteries(df):

    df = df.copy()

    df["GPS_LAT"] = (
        df["GPS_LAT"]
        .astype(str)
        .str.replace(",", ".", regex=False)
    )

    df["GPS_LONG"] = (
        df["GPS_LONG"]
        .astype(str)
        .str.replace(",", ".", regex=False)
    )

    df["GPS_LAT"] = pd.to_numeric(
        df["GPS_LAT"],
        errors="coerce"
    )

    df["GPS_LONG"] = pd.to_numeric(
        df["GPS_LONG"],
        errors="coerce"
    )

    df = df.dropna(
        subset=["GPS_LAT", "GPS_LONG"]
    )

    df["nom_normalise"] = (
        df["N_SERVICE"]
        .astype(str)
        .str.upper()
        .str.replace("SAINT", "ST", regex=False)
        .str.replace(".", "", regex=False)
        .str.strip()
    )

    df["adresse_normalisee"] = (
        df["AD1_SITE"]
        .astype(str)
        .str.upper()
        .str.replace("SAINT", "ST", regex=False)
        .str.replace(".", "", regex=False)
        .str.strip()
    )

    df["ville_normalisee"] = (
        df["L_VILLE_SITE"]
        .astype(str)
        .str.upper()
        .str.replace("SAINT", "ST", regex=False)
        .str.replace("-", " ", regex=False)
        .str.replace(".", "", regex=False)
        .str.strip()
    )

    df["cle_dedoublonnage"] = (
        df["CP_SITE"].astype(str).str.strip()
        + "_"
        + df["ville_normalisee"]
    )

    df = df.drop_duplicates(
        subset=[
            "cle_dedoublonnage"
        ]
    )

    return df


def dataframe_vers_liste(df):

    decheteries = []

    for _, ligne in df.iterrows():

        item = {
            "nom": ligne.get("N_SERVICE", ""),
            "adresse": ligne.get("AD1_SITE", ""),
            "cp": ligne.get("CP_SITE", ""),
            "ville": ligne.get("L_VILLE_SITE", ""),
            "lat": ligne.get("GPS_LAT", ""),
            "lon": ligne.get("GPS_LONG", "")
        }

        if "distance" in ligne:
            item["distance_km"] = round(
                float(ligne.get("distance", 0)),
                1
            )

        decheteries.append(item)

    return decheteries


def chercher_commune(ville_recherche):

    geo = requests.get(
        "https://geo.api.gouv.fr/communes",
        params={
            "nom": ville_recherche,
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


def ajouter_distances(df, commune):

    lon_commune = commune["centre"]["coordinates"][0]
    lat_commune = commune["centre"]["coordinates"][1]

    df = df.copy()

    df["distance"] = df.apply(
        lambda ligne: distance_km(
            lat_commune,
            lon_commune,
            float(ligne["GPS_LAT"]),
            float(ligne["GPS_LONG"])
        ),
        axis=1
    )

    return df


def api_decheteries(request):

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

    fichier = (
        Path(settings.BASE_DIR)
        / "accounts"
        / "data"
        / "dechets"
        / "JD_ANNUAIRE_DECHETERIES.csv"
    )

    df = pd.read_csv(
        fichier,
        sep=";",
        encoding="utf-8",
        low_memory=False
    )

    df = preparer_decheteries(df)

    commune =    chercher_commune(ville_recherche)

    if commune is None:
        return JsonResponse({
            "error": "Commune introuvable"
        })

    df = ajouter_distances(
        df,
        commune
    )

    recherche_directe = df[
        df.astype(str)
        .apply(
            lambda col: col.str.contains(
                ville_recherche,
                case=False,
                na=False
            )
        )
        .any(axis=1)
    ].copy()

    if not recherche_directe.empty:

        resultat = (
            recherche_directe
            .sort_values("distance")
            .head(2)
            .copy()
        )

        return JsonResponse({
            "commune": commune["nom"],
            "code_insee": commune["code"],
            "mode": "recherche_directe",
            "decheteries": dataframe_vers_liste(resultat)
        })

    resultat = (
        df
        .sort_values("distance")
        .head(2)
        .copy()
    )

    return JsonResponse({
        "commune": commune["nom"],
        "code_insee": commune["code"],
        "mode": "distance",
        "decheteries": dataframe_vers_liste(resultat)
    })