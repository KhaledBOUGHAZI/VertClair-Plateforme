from math import radians, sin, cos, sqrt, atan2
from pathlib import Path

import pandas as pd
import requests

from django.http import JsonResponse

def geocoder_adresse(adresse, ville):

    if not adresse:
        return None

    recherche = f"{adresse}, {ville}"

    try:
        response = requests.get(
            "https://api-adresse.data.gouv.fr/search/",
            params={
                "q": recherche,
                "limit": 1
            },
            timeout=10
        )

        data = response.json()

        features = data.get("features", [])

        if not features:
            return None

        coords = features[0]["geometry"]["coordinates"]

        return {
            "lon": coords[0],
            "lat": coords[1]
        }

    except Exception as e:
        print("Erreur géocodage adresse :", e)
        return None

def charger_sau_agreste(code_insee):

    try:
        fichier = (
            Path(__file__).resolve().parent.parent
            / "data"
            / "alimentation"
            / "agreste_sau.csv"
        )

        df = pd.read_csv(
            fichier,
            sep=";",
            skiprows=2,
            dtype={"Code": str},
            encoding="utf-8-sig"
        )

        ligne = df[
            df["Code"].astype(str).str.strip()
            == str(code_insee).strip()
        ]

        if ligne.empty:
            return None

        valeur = ligne.iloc[0]["SAU moyenne en 2020"]
        valeur = str(valeur).replace(",", ".")

        return {
            "sau_moyenne": valeur
        }

    except Exception as e:
        print("Erreur Agreste SAU :", e)
        return None


def charger_operateurs_bio(code_insee):

    try:
        fichier = (
            Path(__file__).resolve().parent.parent
            / "data"
            / "alimentation"
            / "bio_operateurs.csv"
        )

        df = pd.read_csv(
            fichier,
            sep=";"
        )

        df = df[
            df["codeinseecommune"].astype(str).str.strip()
            == str(code_insee).strip()
        ]

        if df.empty:
            return {
                "operateurs_bio": 0,
                "annee": None
            }

        derniere_annee = df["annee"].max()

        df = df[
            df["annee"] == derniere_annee
        ]

        total = int(
            df["nboperateur"].sum()
        )

        return {
            "annee": int(derniere_annee),
            "operateurs_bio": total
        }

    except Exception as e:
        print("Erreur Agence Bio CSV :", e)
        return {
            "operateurs_bio": 0,
            "annee": None
        }


def extraire_liste_libelles(elements):

    libelles = []

    for element in elements or []:

        if isinstance(element, dict):
            libelle = (
                element.get("nom")
                or element.get("libelle")
                or element.get("label")
                or element.get("description")
            )

            if libelle:
                libelles.append(str(libelle))
            else:
                libelles.append(str(element))

        else:
            libelles.append(str(element))

    return libelles


def classer_operateur(op):

    activites = " ".join(
        op.get("activites", [])
    ).lower()

    nom = (
        op.get("nom", "")
        .lower()
    )

    productions = " ".join(
        op.get("productions", [])
    ).lower()

    # Producteurs agricoles

    if "production" in activites:

        return "producteurs"

    # Magasins et commerces alimentaires

    mots_commerces = [
        "monoprix",
        "carrefour",
        "auchan",
        "leclerc",
        "intermarche",
        "super u",
        "u express",
        "naturalia",
        "biocoop",
        "grand frais",
        "cocci",
        "epicerie"
    ]

    if any(
        mot in nom
        for mot in mots_commerces
    ):
        return "commerces"

    if "distribution" in activites:
        return "commerces"

    # Restauration

    mots_restauration = [
        "restaurant",
        "restauration",
        "cantine",
        "traiteur"
    ]

    if any(
        mot in nom
        for mot in mots_restauration
    ):
        return "restauration"

    if "restauration" in activites:
        return "restauration"

    # Entreprises agroalimentaires

    if (
        "préparation" in activites
        or "preparation" in activites
    ):
        return "agroalimentaire"

    if (
        "boulanger"
        in productions
    ):
        return "agroalimentaire"

    # Logistique

    if "stockage" in activites:
        return "logistique"

    return "autres"

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

def charger_operateurs_bio_carte(lat, lon):

    try:
        response = requests.get(
            "https://opendata.agencebio.org/api/gouv/operateurs/",
            params={
                "lat": lat,
                "lng": lon,
                "dist": 20,
                "nb": 100,
                "trierPar": "coords",
                "ordreTri": "asc",
                "filtrerEngages": 1
            },
            timeout=15
        )

        data = response.json()

        operateurs = []

        for item in data.get("items", []):

            adresses = item.get("adressesOperateurs", [])

            if not adresses:
                continue

            adresse = adresses[0]

            activites = extraire_liste_libelles(
                item.get("activites", [])
            )

            productions = extraire_liste_libelles(
                item.get("productions", [])
            )

            distance = None

            try:
                distance = round(
                    distance_km(
                        float(lat),
                        float(lon),
                        float(adresse.get("lat")),
                        float(adresse.get("long"))
                    ),
                    1
                )
            except Exception:
                distance = None

            operateurs.append({

                "nom":
                    item.get("raisonSociale", ""),

                "activites":
                    activites,

                "productions":
                    productions,

                "vente_particuliers":
                    item.get("venteAnnuaire", {}).get(
                        "venteParticuliers"
                    ),

                "adresse":
                    adresse.get("lieu", ""),

                "code_postal":
                    adresse.get("codePostal", ""),

                "ville":
                    adresse.get("ville", ""),

                "lat":
                    adresse.get("lat"),

                "lon":
                    adresse.get("long"),

                "distance":
                    distance,

            })

        return operateurs

    except Exception as e:
        print("Erreur API opérateurs bio :", e)
        return []
def chercher_commune(ville):

    response = requests.get(
        "https://geo.api.gouv.fr/communes",
        params={
            "nom": ville,
            "fields": "nom,code,population,centre",
            "format": "json",
            "limit": 20
        },
        timeout=10
    )

    communes = response.json()

    if not communes:
        return None

    return sorted(
        communes,
        key=lambda x: x.get("population", 0),
        reverse=True
    )[0]


def api_alimentation(request):

    ville = request.GET.get("ville")
    adresse = request.GET.get("adresse")

    if not ville:
        return JsonResponse({
            "error": "Ville manquante"
        })

    corrections = {
        "pacy": "Pacy-sur-Eure",
        "pacy sur eure": "Pacy-sur-Eure",
        "pacy-sur-eure": "Pacy-sur-Eure"
    }

    ville_recherche = corrections.get(
        ville.lower().strip(),
        ville
    )

    commune = chercher_commune(
        ville_recherche
    )

    if commune is None:
        return JsonResponse({
            "error": "Commune introuvable"
        })

    code_insee = commune["code"]

    lat = commune["centre"]["coordinates"][1]
    lon = commune["centre"]["coordinates"][0]

    point_depart = geocoder_adresse(
        adresse,
        commune["nom"]
    )

    if point_depart:
        lat = point_depart["lat"]
        lon = point_depart["lon"]

    bio = charger_operateurs_bio(
        code_insee
    )

    sau = charger_sau_agreste(
        code_insee
    )

    operateurs_carte = charger_operateurs_bio_carte(
        lat,
        lon
    )
    for index, op in enumerate(operateurs_carte):
        op["id_carte"] = "bio_" + str(index)

    categories = {
        "producteurs": [],
        "agroalimentaire": [],
        "commerces": [],
        "restauration": [],
        "logistique": [],
        "autres": []
    }

    for op in operateurs_carte:
        categorie = classer_operateur(op)
        categories[categorie].append(op)

    return JsonResponse({

        "commune": commune["nom"],

        "code_insee": code_insee,

        "population":
            commune.get("population", 0),

        "latitude": lat,

        "longitude": lon,

        "operateurs_bio":
            bio["operateurs_bio"],

        "operateurs_bio_carte":
            operateurs_carte,

        "categories_bio":
            categories,

        "annee_bio":
            bio.get("annee"),

        "sau_moyenne":
            sau["sau_moyenne"]
            if sau else None,

        "source":
            "Agence Bio / Agreste RA2020 / INSEE"

    })