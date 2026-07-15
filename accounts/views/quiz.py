from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from accounts.models import ResultatQuiz


@csrf_exempt
@login_required
def save_quiz_result(request):
    if request.method != "POST":
        return JsonResponse({"error": "Méthode non autorisée"}, status=405)

    data = json.loads(request.body)

    ResultatQuiz.objects.update_or_create(
        user=request.user,
        theme=data.get("theme"),
        niveau=data.get("niveau"),
        defaults={
            "score": data.get("score", 0),
            "total": data.get("total", 0),
            "pourcentage": data.get("pourcentage", 0),
        }
    )

    return JsonResponse({"success": True})


def quiz_theme(request, theme):
    return render(request, "quiz_theme.html", {
        "theme": theme
    })


def quiz_session(request, theme, niveau):
    return render(request, "quiz_session.html", {
        "theme": theme,
        "niveau": niveau
    })