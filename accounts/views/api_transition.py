import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from accounts.models import ActionTransition


@login_required
@require_POST
def ajouter_action_transition(request):
    try:
        data = json.loads(request.body.decode("utf-8"))

        action = ActionTransition.objects.create(
            titre=data.get("titre", ""),
            theme=data.get("theme", "Général"),
            priorite=data.get("priorite", "Moyenne"),
            cout=data.get("cout", ""),
            delai=data.get("delai", ""),
            responsable=data.get("responsable", ""),
            efficacite=data.get("efficacite", ""),
            statut=data.get("statut", "À étudier"),
            origine=data.get("origine", ""),
            description=data.get("description", ""),
            commentaire=data.get("commentaire", ""),
            echeance=data.get("echeance") or None,

            objectifs=data.get("objectifs", []),
            indicateur_suivi=data.get("indicateur_suivi", ""),
            valeur_cible=data.get("valeur_cible", ""),
            sources=data.get("sources", ""),
            financements=data.get("financements", []),
        )

        return JsonResponse({
            "success": True,
            "message": "Action ajoutée au plan de transition.",
            "id": action.id,
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e),
        }, status=500)