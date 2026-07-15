import json
import os
from math import radians, cos, sin, asin, sqrt

from django.conf import settings
from django.http import JsonResponse


DATA_DIR = os.path.join(settings.BASE_DIR, "data", "biodiversite")


def distance_km(lat1, lon1, lat2, lon2):
    r = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    )

    return 2 * r * asin(sqrt(a))


def feature_est_proche(feature, lat, lon, rayon_km):
    geometry = feature.get("geometry", {})

    if not geometry:
        return False

    coords = geometry.get("coordinates", [])
    type_geom = geometry.get("type")

    points = []

    if type_geom == "Point":
        points = [coords]

    elif type_geom == "LineString":
        points = coords

    elif type_geom == "Polygon":
        points = coords[0] if coords else []

    elif type_geom == "MultiPolygon":
        for polygon in coords:
            if polygon and polygon[0]:
                points.extend(polygon[0])

    elif type_geom == "MultiLineString":
        for ligne in coords:
            points.extend(ligne)

    for point in points[::10]:
        try:
            lon2, lat2 = point[0], point[1]
            if distance_km(lat, lon, lat2, lon2) <= rayon_km:
                return True
        except Exception:
            continue

    return False


def filtrer_geojson(nom_fichier, lat, lon, rayon_km):
    chemin = os.path.join(DATA_DIR, nom_fichier)

    if not os.path.exists(chemin):
        return {
            "type": "FeatureCollection",
            "features": []
        }

    with open(chemin, "r", encoding="utf-8") as fichier:
        geojson = json.load(fichier)

    features = geojson.get("features", [])

    features_filtrees = [
        feature
        for feature in features
        if feature_est_proche(feature, lat, lon, rayon_km)
    ]

    return {
        "type": "FeatureCollection",
        "features": features_filtrees[:300]
    }


def api_biodiversite_couches(request):
    try:
        lat = float(request.GET.get("lat"))
        lon = float(request.GET.get("lon"))
        rayon_km = float(request.GET.get("rayon", 8))

        data = {
            "cours_eau": filtrer_geojson("cours_eau.geojson", lat, lon, rayon_km),
            "znieff1": filtrer_geojson("znieff1.geojson", lat, lon, rayon_km),
            "znieff2": filtrer_geojson("znieff2.geojson", lat, lon, rayon_km),
            "natura2000": filtrer_geojson("natura2000.geojson", lat, lon, rayon_km),
            "zones_humides": filtrer_geojson("zones_humides.geojson", lat, lon, rayon_km),
        }

        return JsonResponse(data)

    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)