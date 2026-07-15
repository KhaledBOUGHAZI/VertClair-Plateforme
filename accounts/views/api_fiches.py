import json
from pathlib import Path

from django.conf import settings
from django.http import JsonResponse


def get_fiche_pedagogique(request):
    theme = request.GET.get("theme")
    fiche = request.GET.get("fiche")

    if not theme or not fiche:
        return JsonResponse({
            "error": "Paramètres theme et fiche requis"
        }, status=400)

    chemin = (
        settings.BASE_DIR
        / "accounts"
        / "data"
        / "fiches"
        / theme
        / f"{fiche}.json"
    )

    if not chemin.exists():
        return JsonResponse({
            "error": "Fiche introuvable",
            "theme": theme,
            "fiche": fiche
        }, status=404)

    with open(chemin, "r", encoding="utf-8") as fichier:
        data = json.load(fichier)

    return JsonResponse(data, safe=False)