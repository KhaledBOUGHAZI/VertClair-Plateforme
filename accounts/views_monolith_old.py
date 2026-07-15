import json
import requests

from datetime import date

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt

from .models import BilanCarbone, LigneCarbone

def qualite_air(request):
    return render(request, "territoire_air.html")

def qualite_eau(request):
    return render(request, "territoire_eau.html")

def trames(request):
    return render(request, "territoire_trames.html")

def changement_climatique(request):

    return render(
        request,
        "territoire_climat.html"
    )

def home(request):
    return redirect("dashboard")


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:
            login(request, user)
            return redirect("dashboard")

        return render(
            request,
            "login.html",
            {"error": "Identifiants invalides"}
        )

    return render(request, "login.html")


def dashboard(request):
    return render(request, "dashboard.html")


def formations(request):
    return render(request, "formations.html")


def carbone(request):
    return render(request, "carbone.html")


def territoire(request):
    return render(request, "territoire.html")


def transition(request):
    return render(request, "transition.html")


@csrf_exempt
def save_carbon(request):
    if request.method == "POST":
        data = json.loads(request.body)

        mois = data.get("mois")
        lignes = data.get("lignes", [])

        total = sum(
            float(ligne.get("co2", 0))
            for ligne in lignes
        )

        if not request.user.is_authenticated:
            return JsonResponse({
                "error": "Utilisateur non authentifié"
            }, status=401)

        bilan, created = BilanCarbone.objects.update_or_create(
            user=request.user,
            mois=mois,
            defaults={"total_co2": total}
        )

        LigneCarbone.objects.filter(bilan=bilan).delete()

        for ligne in lignes:
            LigneCarbone.objects.create(
                bilan=bilan,
                rubrique=ligne.get("rubrique"),
                poste=ligne.get("poste"),
                consommation=ligne.get("consommation", 0),
                co2=ligne.get("co2", 0)
            )

        return JsonResponse({"status": "ok"})

    return JsonResponse(
        {"error": "Méthode non autorisée"},
        status=405
    )


def get_bilans_carbone(request):
    if not request.user.is_authenticated:
        return JsonResponse({"bilans": []})

    bilans = BilanCarbone.objects.filter(
        user=request.user
    ).order_by("mois")

    data = []

    for bilan in bilans:
        lignes = [
            {
                "rubrique": ligne.rubrique,
                "poste": ligne.poste,
                "consommation": ligne.consommation,
                "co2": ligne.co2
            }
            for ligne in bilan.lignes.all()
        ]

        data.append({
            "mois": bilan.mois,
            "total": bilan.total_co2,
            "lignes": lignes
        })

    return JsonResponse({"bilans": data})


def get_atmo_token():
    url = f"{settings.ATMO_API_URL}/login"

    payload = {
        "username": settings.ATMO_USERNAME,
        "password": settings.ATMO_PASSWORD
    }

    response = requests.post(
        url,
        json=payload,
        timeout=10
    )

    if response.status_code != 200:
        print(
            "Erreur token Atmo :",
            response.status_code,
            response.text
        )
        return None

    data = response.json()
    return data.get("token")


def get_indice_air(request):
    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse(
            {"error": "Ville manquante"},
            status=400
        )

    ville_lower = ville.lower()

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
        return JsonResponse(
            {"error": "Ville introuvable"},
            status=404
        )

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

    
    token = get_atmo_token()

    if not token:
        return JsonResponse(
            {"error": "Connexion Atmo impossible"},
            status=500
        )

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


def logout_view(request):
    logout(request)
    return redirect("login")


def get_donnees_eaux(request):
    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse({"error": "Ville manquante"}, status=400)

    geo_response = requests.get(
        "https://geo.api.gouv.fr/communes",
        params={
            "nom": ville,
"fields": "nom,code,centre,population",            "format": "json",
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


def api_climat(request):

    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse({
            "error": "Ville manquante"
        })

    try:

        url = (
    "https://geo.api.gouv.fr/communes?"
    f"nom={ville}"
    "&fields=nom,centre,population"
    "&format=json"
)

        response = requests.get(url)

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

    print("Latitude :", lat)
    print("Longitude :", lon)

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

        print(
            "GASPAR status :",
            response_risques.status_code
        )

        data_risques = response_risques.json()

        print(data_risques)

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

        "source":
        "Géorisques / DRIAS / démonstration"
    
    })

def energie_territoire(request):

    return render(
        request,
        "territoire_energie.html"
    )


def api_energie(request):

    ville = request.GET.get("ville")

    if not ville:
        return JsonResponse({
            "error": "Ville manquante"
        })

    # ---------------------------------
    # Recherche commune
    # ---------------------------------

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

    lat = commune["centre"]["coordinates"][1]
    lon = commune["centre"]["coordinates"][0]

    # ---------------------------------
    # Données énergie
    # ---------------------------------

    data = {

        "commune": commune["nom"],

        "latitude": lat,
        "longitude": lon,

        "centre": commune.get("centre"),

        "dju_chauffage": 2100,
        "dju_climatisation": 180,

        "objectif_2030": "-40%",
        "objectif_2040": "-50%",
        "objectif_2050": "-60%",

        "conso_reference": 100,

        "projection": {
            "2030": 92,
            "2040": 85,
            "2050": 70
        },

        "stress_thermique": "Hausse forte",

        "recommandations": [
            "Isolation thermique",
            "Végétalisation",
            "Protections solaires",
            "Réduction climatisation",
            "Pilotage énergétique"
        ],

        "source": "Météo-France / Décret tertiaire"
    }

    # ---------------------------------
    # Analyse territoriale
    # ---------------------------------

    niveau_risque = "modéré"

    if data["projection"]["2050"] <= 75:
        niveau_risque = "élevé"

    if data["projection"]["2050"] <= 60:
        niveau_risque = "critique"

    synthese = f"""
    {commune['nom']} présente un niveau de vulnérabilité climatique {niveau_risque}.

    Le territoire est exposé à une hausse du stress thermique
    et à une augmentation des besoins d’adaptation énergétique.

    Les bâtiments tertiaires devront renforcer :
    - l’isolation thermique
    - la protection solaire
    - la végétalisation
    - la sobriété énergétique
    """

    priorites = [
        "Isolation thermique",
        "Protections solaires",
        "Végétalisation",
        "Réduction climatisation",
        "Pilotage énergétique"
    ]

    data["niveau_risque"] = niveau_risque
    data["synthese"] = synthese
    data["priorites"] = priorites

    return JsonResponse(data)


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

    print("DPE status :", dpe_response.status_code)
    print("DPE réponse :", dpe_response.text[:500])

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

    # -----------------------------
    # Recherche commune
    # -----------------------------

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

    # -----------------------------
    # Recherche DPE
    # -----------------------------

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

    # -----------------------------
    # Filtre sur la bonne commune
    # -----------------------------

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

    # -----------------------------
    # Analyse énergétique
    # -----------------------------

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
            "Ce bâtiment semble être "
            "une passoire énergétique."
        )

    elif classe in ["D", "E"]:

        niveau = "priorité modérée"

        diagnostic = (
            "Ce bâtiment présente un "
            "potentiel d’amélioration énergétique."
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

    # -----------------------------
    # Comparaison communale
    # -----------------------------

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

        comparaison_commune = (
            "plus performant que la moyenne"
        )

    elif ordre.get(classe, 0) < ordre.get(moyenne_commune, 0):

        comparaison_commune = (
            "moins performant que la moyenne"
        )

    else:

        comparaison_commune = (
            "équivalent à la moyenne"
        )

    # -----------------------------
    # Résultat final
    # -----------------------------

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

    if resultats:
        print("CHAMPS DPE :", resultats[0].keys())
        print("PREMIER DPE :", resultats[0])

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

        if lat is None or lon is None:
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
        print(lat, lon)
        donnees.append({

            "adresse":
                dpe.get(
                    "adresse_brut",
                    "Adresse inconnue"
                ),

            "classe_dpe": classe,

            "ges":
                dpe.get(
                    "etiquette_ges",
                    "Non disponible"
                ),

            "conso":
                dpe.get(
                    "conso_5_usages_par_m2_ef",
                    "Non disponible"
                ),

            "lat": lat,
            "lon": lon,

            "couleur": couleur
        })

    return JsonResponse({
        "commune": commune["nom"],
        "dpe": donnees
    })
