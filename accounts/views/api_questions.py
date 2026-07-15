import json
from pathlib import Path

from django.conf import settings
from django.http import JsonResponse


def get_questions_quiz(request):

    theme = request.GET.get("theme")
    niveau = request.GET.get("niveau")

    if not theme or not niveau:
        return JsonResponse(
            {"error": "theme et niveau requis"},
            status=400
        )

    chemin = (
        Path(settings.BASE_DIR)
        / "accounts"
        / "data"
        / "questions"
        / theme
        / f"{niveau}.json"
    )

    if not chemin.exists():
        return JsonResponse(
            {"error": "Questions introuvables"},
            status=404
        )

    with open(chemin, "r", encoding="utf-8") as f:
        questions = json.load(f)

    return JsonResponse(questions, safe=False)