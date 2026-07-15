import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from ..models import BilanCarbone, LigneCarbone


@csrf_exempt
def save_carbon(request):
    if request.method == "POST":
        data = json.loads(request.body)

        mois = data.get("mois")
        lignes = data.get("lignes", [])

        total = sum(float(ligne.get("co2", 0)) for ligne in lignes)

        if not request.user.is_authenticated:
            return JsonResponse({"error": "Utilisateur non authentifié"}, status=401)

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

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)


def get_bilans_carbone(request):
    if not request.user.is_authenticated:
        return JsonResponse({"bilans": []})

    bilans = BilanCarbone.objects.filter(user=request.user).order_by("mois")

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