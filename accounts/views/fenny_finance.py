from decimal import Decimal

from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from accounts.models import (
    Organisation,
    ProfilUtilisateur,
    Abonnement,
)


def est_fenny(user):
    if not user.is_authenticated:
        return False

    if user.is_superuser:
        return True

    profil = getattr(user, "profil_vertclair", None)
    return profil and profil.role == "fenny"


@login_required
def fenny_finance(request):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    abonnements = Abonnement.objects.select_related("organisation").all()

    abonnements_actifs = abonnements.filter(statut="actif")
    abonnements_essai = abonnements.filter(statut="essai")
    abonnements_suspendus = abonnements.filter(statut="suspendu")
    abonnements_resilies = abonnements.filter(statut="resilie")
    abonnements_expires = abonnements.filter(statut="expire")

    mrr = sum(
        abonnements_actifs.values_list("prix_mensuel_ht", flat=True),
        Decimal("0")
    )

    arr = mrr * 12

    nb_abonnements_actifs = abonnements_actifs.count()

    panier_moyen = Decimal("0")
    if nb_abonnements_actifs > 0:
        panier_moyen = mrr / nb_abonnements_actifs

    utilisateurs_actifs = ProfilUtilisateur.objects.filter(
        user__is_active=True
    ).count()

    revenu_par_utilisateur = Decimal("0")
    if utilisateurs_actifs > 0:
        revenu_par_utilisateur = mrr / utilisateurs_actifs

    licences_vendues = sum(
        abonnements.filter(statut__in=["actif", "essai"])
        .values_list("nb_licences", flat=True)
    )

    licences_utilisees = utilisateurs_actifs
    licences_disponibles = licences_vendues - licences_utilisees

    taux_occupation = 0
    if licences_vendues > 0:
        taux_occupation = round((licences_utilisees / licences_vendues) * 100)

    revenus_par_formule = {
        "essai": 0,
        "1": 0,
        "5": 0,
        "10": 0,
        "20": 0,
        "50": 0,
        "100": 0,
    }

    for abonnement in abonnements_actifs:
        revenus_par_formule[abonnement.formule] = (
            revenus_par_formule.get(abonnement.formule, 0)
            + float(abonnement.prix_mensuel_ht)
        )

    return render(request, "fenny/finance.html", {
        "mrr": mrr,
        "arr": arr,
        "panier_moyen": panier_moyen,
        "revenu_par_utilisateur": revenu_par_utilisateur,

        "organisations": Organisation.objects.count(),
        "utilisateurs_actifs": utilisateurs_actifs,

        "licences_vendues": licences_vendues,
        "licences_utilisees": licences_utilisees,
        "licences_disponibles": licences_disponibles,
        "taux_occupation": taux_occupation,

        "abonnements_actifs": abonnements_actifs.count(),
        "abonnements_essai": abonnements_essai.count(),
        "abonnements_suspendus": abonnements_suspendus.count(),
        "abonnements_resilies": abonnements_resilies.count(),
        "abonnements_expires": abonnements_expires.count(),

        "revenus_par_formule": revenus_par_formule,
    })