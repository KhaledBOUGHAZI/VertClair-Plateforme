from decimal import Decimal

from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordResetForm
from django.db.models import Q
from django.shortcuts import render, redirect
from django.utils import timezone

from accounts.models import (
    Organisation,
    ProfilUtilisateur,
    Abonnement,
    InvitationUtilisateur,
    JournalActivite,
    ResultatQuiz,
    BilanCarbone,
    ActionTransition,
    ServiceOrganisation,
)


def est_fenny(user):
    profil = getattr(user, "profil_vertclair", None)
    return profil and profil.role == "fenny"


@login_required
@login_required
def dashboard_fenny(request):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    aujourd_hui = timezone.now().date()
    il_y_a_30_jours = timezone.now() - timezone.timedelta(days=30)

    abonnements = Abonnement.objects.select_related("organisation").all()
    abonnements_actifs = abonnements.filter(statut="actif")
    abonnements_essai = abonnements.filter(statut="essai")
    abonnements_suspendus = abonnements.filter(statut="suspendu")
    abonnements_resilies = abonnements.filter(statut="resilie")

    organisations = Organisation.objects.count()
    organisations_30j = Organisation.objects.filter(
        date_creation__gte=il_y_a_30_jours
    ).count()

    utilisateurs = ProfilUtilisateur.objects.count()
    utilisateurs_actifs = ProfilUtilisateur.objects.filter(
        user__is_active=True
    ).count()
    utilisateurs_30j = ProfilUtilisateur.objects.filter(
        user__date_joined__gte=il_y_a_30_jours
    ).count()
    utilisateurs_connectes_aujourdhui = ProfilUtilisateur.objects.filter(
        user__last_login__date=aujourd_hui
    ).count()

    licences_vendues = sum(
        abonnements.filter(statut__in=["actif", "essai"])
        .values_list("nb_licences", flat=True)
    )

    licences_utilisees = ProfilUtilisateur.objects.filter(
        user__is_active=True
    ).count()

    licences_disponibles = licences_vendues - licences_utilisees

    taux_utilisation_licences = 0
    if licences_vendues > 0:
        taux_utilisation_licences = round(
            (licences_utilisees / licences_vendues) * 100
        )

    ca_mensuel = sum(
        abonnements_actifs.values_list("prix_mensuel_ht", flat=True),
        Decimal("0")
    )

    ca_annuel = ca_mensuel * 12

    panier_moyen = Decimal("0")
    if abonnements_actifs.count() > 0:
        panier_moyen = ca_mensuel / abonnements_actifs.count()

    revenu_par_utilisateur = Decimal("0")
    if utilisateurs_actifs > 0:
        revenu_par_utilisateur = ca_mensuel / utilisateurs_actifs

    invitations = InvitationUtilisateur.objects.filter(acceptee=False).count()
    invitations_expirees = InvitationUtilisateur.objects.filter(
        acceptee=False,
        date_expiration__lt=timezone.now()
    ).count()

    quiz_realises = ResultatQuiz.objects.count()
    quiz_30j = ResultatQuiz.objects.filter(
        date__gte=il_y_a_30_jours
    ).count()

    bilans_carbone = BilanCarbone.objects.count()
    bilans_carbone_30j = BilanCarbone.objects.filter(
        user__date_joined__gte=il_y_a_30_jours
    ).count()

    total_co2 = sum(
        BilanCarbone.objects.values_list("total_co2", flat=True)
    )

    actions_transition = ActionTransition.objects.count()

    alertes = []

    for abonnement in abonnements.filter(statut__in=["actif", "essai"]):
        nb_utilisateurs_org = ProfilUtilisateur.objects.filter(
            organisation=abonnement.organisation,
            user__is_active=True
        ).count()

        if abonnement.nb_licences > 0:
            taux = round((nb_utilisateurs_org / abonnement.nb_licences) * 100)
        else:
            taux = 0

        if taux >= 90:
            alertes.append({
                "niveau": "danger",
                "message": (
                    f"{abonnement.organisation.nom} utilise "
                    f"{taux}% de ses licences."
                )
            })

    if invitations_expirees:
        alertes.append({
            "niveau": "warning",
            "message": f"{invitations_expirees} invitation(s) expirée(s)."
        })

    if abonnements_suspendus.count():
        alertes.append({
            "niveau": "warning",
            "message": f"{abonnements_suspendus.count()} abonnement(s) suspendu(s)."
        })

    if not alertes:
        alertes.append({
            "niveau": "success",
            "message": "Aucune anomalie détectée sur la plateforme."
        })

    return render(request, "fenny/dashboard_fenny.html", {
        "organisations": organisations,
        "organisations_30j": organisations_30j,
        "utilisateurs": utilisateurs,
        "utilisateurs_actifs": utilisateurs_actifs,
        "utilisateurs_30j": utilisateurs_30j,
        "utilisateurs_connectes_aujourdhui": utilisateurs_connectes_aujourdhui,

        "licences_vendues": licences_vendues,
        "licences_utilisees": licences_utilisees,
        "licences_disponibles": licences_disponibles,
        "taux_utilisation_licences": taux_utilisation_licences,

        "ca_mensuel": ca_mensuel,
        "ca_annuel": ca_annuel,
        "panier_moyen": panier_moyen,
        "revenu_par_utilisateur": revenu_par_utilisateur,

        "abonnements_actifs": abonnements_actifs.count(),
        "essais": abonnements_essai.count(),
        "suspendus": abonnements_suspendus.count(),
        "resilies": abonnements_resilies.count(),

        "invitations": invitations,
        "invitations_expirees": invitations_expirees,

        "quiz_realises": quiz_realises,
        "quiz_30j": quiz_30j,
        "bilans_carbone": bilans_carbone,
        "bilans_carbone_30j": bilans_carbone_30j,
        "total_co2": total_co2,
        "actions_transition": actions_transition,

        "alertes": alertes,

        "dernieres_organisations": Organisation.objects.order_by("-date_creation")[:5],
        "derniers_utilisateurs": ProfilUtilisateur.objects.select_related(
            "user", "organisation"
        ).order_by("-user__date_joined")[:5],
        "derniers_abonnements": Abonnement.objects.select_related(
            "organisation"
        ).order_by("-id")[:5],
        "dernieres_activites": JournalActivite.objects.select_related(
            "organisation", "utilisateur"
        ).order_by("-date_creation")[:10],
    })


@login_required
def fenny_organisations(request):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    recherche = request.GET.get("q", "")
    statut = request.GET.get("statut", "")

    organisations = Organisation.objects.all().order_by("-date_creation")

    if recherche:
        organisations = organisations.filter(
            Q(nom__icontains=recherche) |
            Q(email__icontains=recherche)
        )

    if statut:
        organisations = organisations.filter(abonnement__statut=statut)

    total_organisations = Organisation.objects.count()
    total_utilisateurs = ProfilUtilisateur.objects.filter(user__is_active=True).count()

    total_licences = sum(
        Abonnement.objects.filter(statut__in=["actif", "essai"])
        .values_list("nb_licences", flat=True)
    )

    ca_mensuel = sum(
        Abonnement.objects.filter(statut="actif")
        .values_list("prix_mensuel_ht", flat=True),
        Decimal("0")
    )

    return render(request, "fenny/organisations.html", {
        "organisations": organisations,
        "recherche": recherche,
        "statut": statut,
        "total_organisations": total_organisations,
        "total_utilisateurs": total_utilisateurs,
        "total_licences": total_licences,
        "ca_mensuel": ca_mensuel,
    })


@login_required
def fenny_nouvelle_organisation(request):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    if request.method == "POST":
        organisation = Organisation.objects.create(
            nom=request.POST.get("nom"),
            type_organisation=request.POST.get("type_organisation"),
            email=request.POST.get("email"),
            telephone=request.POST.get("telephone"),
            siret=request.POST.get("siret"),
            adresse=request.POST.get("adresse"),
        )

        Abonnement.objects.create(
            organisation=organisation,
            formule="essai",
            statut="essai",
            nb_licences=1,
            prix_mensuel_ht=0,
        )

        JournalActivite.objects.create(
            organisation=organisation,
            utilisateur=request.user,
            type_action="utilisateur_modifie",
            message=f"{request.user.username} a créé l'organisation {organisation.nom}.",
        )

        return redirect(
            "fenny_organisation_detail",
            organisation_id=organisation.id
        )

    return render(request, "fenny/nouvelle_organisation.html")


@login_required
def fenny_organisation_detail(request, organisation_id):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    organisation = Organisation.objects.filter(id=organisation_id).first()

    if not organisation:
        return render(request, "403.html", status=403)

    utilisateurs = ProfilUtilisateur.objects.filter(
        organisation=organisation
    ).select_related("user", "service")

    invitations = InvitationUtilisateur.objects.filter(
        organisation=organisation,
        acceptee=False
    ).select_related("service")

    activites = JournalActivite.objects.filter(
        organisation=organisation
    ).select_related("utilisateur")[:10]

    abonnement = getattr(organisation, "abonnement", None)

    quiz_realises_org = ResultatQuiz.objects.filter(
        user__profil_vertclair__organisation=organisation
    ).count()

    bilans_carbone_org = BilanCarbone.objects.filter(
        user__profil_vertclair__organisation=organisation
    ).count()

    utilisateurs_actifs_org = utilisateurs.filter(
        user__is_active=True
    ).count()

    actions_transition_org = ActionTransition.objects.count()

    return render(request, "fenny/organisation_detail.html", {
        "organisation": organisation,
        "abonnement": abonnement,
        "utilisateurs": utilisateurs,
        "invitations": invitations,
        "activites": activites,
        "quiz_realises_org": quiz_realises_org,
        "bilans_carbone_org": bilans_carbone_org,
        "utilisateurs_actifs_org": utilisateurs_actifs_org,
        "actions_transition_org": actions_transition_org,
    })


@login_required
def fenny_modifier_organisation(request, organisation_id):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    organisation = Organisation.objects.filter(id=organisation_id).first()

    if not organisation:
        return render(request, "403.html", status=403)

    if request.method == "POST":
        organisation.nom = request.POST.get("nom")
        organisation.type_organisation = request.POST.get("type_organisation")
        organisation.email = request.POST.get("email")
        organisation.telephone = request.POST.get("telephone")
        organisation.siret = request.POST.get("siret")
        organisation.adresse = request.POST.get("adresse")
        organisation.save()

        JournalActivite.objects.create(
            organisation=organisation,
            utilisateur=request.user,
            type_action="utilisateur_modifie",
            message=f"{request.user.username} a modifié l'organisation {organisation.nom}.",
        )

        return redirect("fenny_organisation_detail", organisation_id=organisation.id)

    return render(request, "fenny/modifier_organisation.html", {
        "organisation": organisation,
    })


@login_required
def fenny_utilisateurs(request):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    recherche = request.GET.get("q", "")
    role = request.GET.get("role", "")

    utilisateurs = ProfilUtilisateur.objects.select_related(
        "user",
        "organisation",
        "service"
    ).order_by("organisation__nom", "user__username")

    if recherche:
        utilisateurs = utilisateurs.filter(
            Q(user__username__icontains=recherche) |
            Q(user__email__icontains=recherche) |
            Q(user__first_name__icontains=recherche) |
            Q(user__last_name__icontains=recherche)
        )

    if role:
        utilisateurs = utilisateurs.filter(role=role)

    return render(request, "fenny/utilisateurs.html", {
        "utilisateurs": utilisateurs,
        "recherche": recherche,
        "role": role,
    })


@login_required
def fenny_detail_utilisateur(request, profil_id):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    profil = ProfilUtilisateur.objects.select_related(
        "user",
        "organisation",
        "service"
    ).filter(id=profil_id).first()

    if not profil:
        return render(request, "403.html", status=403)

    quiz = ResultatQuiz.objects.filter(user=profil.user).count()
    carbone = BilanCarbone.objects.filter(user=profil.user).count()
    actions = ActionTransition.objects.count()

    return render(request, "fenny/utilisateur_detail.html", {
        "profil": profil,
        "quiz": quiz,
        "carbone": carbone,
        "actions": actions,
    })


@login_required
def fenny_modifier_utilisateur(request, profil_id):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    profil = ProfilUtilisateur.objects.select_related(
        "user", "organisation", "service"
    ).filter(id=profil_id).first()

    if not profil:
        return render(request, "403.html", status=403)

    services = ServiceOrganisation.objects.filter(
        organisation=profil.organisation,
        actif=True
    )

    if request.method == "POST":
        profil.user.first_name = request.POST.get("first_name")
        profil.user.last_name = request.POST.get("last_name")
        profil.user.email = request.POST.get("email")
        profil.user.save()

        profil.fonction = request.POST.get("fonction")
        profil.telephone = request.POST.get("telephone")
        profil.role = request.POST.get("role")
        profil.service_id = request.POST.get("service") or None
        profil.save()

        JournalActivite.objects.create(
            organisation=profil.organisation,
            utilisateur=request.user,
            type_action="utilisateur_modifie",
            message=f"{request.user.username} a modifié l'utilisateur {profil.user.username}.",
        )

        return redirect("fenny_detail_utilisateur", profil_id=profil.id)

    return render(request, "fenny/modifier_utilisateur.html", {
        "profil": profil,
        "services": services,
    })


@login_required
def fenny_changer_statut_utilisateur(request, profil_id):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    profil = ProfilUtilisateur.objects.select_related(
        "user",
        "organisation"
    ).filter(id=profil_id).first()

    if not profil:
        return render(request, "403.html", status=403)

    profil.user.is_active = not profil.user.is_active
    profil.user.save()

    JournalActivite.objects.create(
        organisation=profil.organisation,
        utilisateur=request.user,
        type_action="utilisateur_modifie",
        message=f"{request.user.username} a changé le statut de {profil.user.username}.",
    )

    return redirect("fenny_detail_utilisateur", profil_id=profil.id)


@login_required
def fenny_reinitialiser_mdp(request, profil_id):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    profil = ProfilUtilisateur.objects.select_related(
        "user",
        "organisation"
    ).filter(id=profil_id).first()

    if not profil:
        return render(request, "403.html", status=403)

    form = PasswordResetForm({
        "email": profil.user.email
    })

    if form.is_valid():
        form.save(
            request=request,
            use_https=request.is_secure(),
            email_template_name="registration/password_reset_email.html",
        )

    JournalActivite.objects.create(
        organisation=profil.organisation,
        utilisateur=request.user,
        type_action="utilisateur_modifie",
        message=f"{request.user.username} a demandé une réinitialisation du mot de passe de {profil.user.username}.",
    )

    return redirect("fenny_detail_utilisateur", profil_id=profil.id)


@login_required
def fenny_abonnements(request):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    statut = request.GET.get("statut", "")

    abonnements = Abonnement.objects.select_related(
        "organisation"
    ).order_by("organisation__nom")

    if statut:
        abonnements = abonnements.filter(statut=statut)

    total_abonnements = abonnements.count()
    total_licences = sum(abonnements.values_list("nb_licences", flat=True))

    ca_mensuel = sum(
        abonnements.filter(statut="actif")
        .values_list("prix_mensuel_ht", flat=True),
        Decimal("0")
    )

    ca_annuel = ca_mensuel * 12

    return render(request, "fenny/abonnements.html", {
        "abonnements": abonnements,
        "statut": statut,
        "total_abonnements": total_abonnements,
        "total_licences": total_licences,
        "ca_mensuel": ca_mensuel,
        "ca_annuel": ca_annuel,
    })


@login_required
def fenny_abonnement_detail(request, abonnement_id):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    abonnement = Abonnement.objects.select_related(
        "organisation"
    ).filter(id=abonnement_id).first()

    if not abonnement:
        return render(request, "403.html", status=404)

    nb_utilisateurs = ProfilUtilisateur.objects.filter(
        organisation=abonnement.organisation,
        user__is_active=True
    ).count()

    taux_utilisation = 0
    if abonnement.nb_licences:
        taux_utilisation = round(
            (nb_utilisateurs / abonnement.nb_licences) * 100
        )

    ca_annuel = abonnement.prix_mensuel_ht * 12
    licences_disponibles = abonnement.nb_licences - nb_utilisateurs

    cout_par_utilisateur = 0
    if nb_utilisateurs > 0:
        cout_par_utilisateur = abonnement.prix_mensuel_ht / nb_utilisateurs

    alertes_abonnement = []

    if taux_utilisation >= 90:
        alertes_abonnement.append({
            "niveau": "danger",
            "message": "Presque toutes les licences sont utilisées."
        })
    elif taux_utilisation >= 70:
        alertes_abonnement.append({
            "niveau": "warning",
            "message": "L’occupation des licences devient élevée."
        })
    else:
        alertes_abonnement.append({
            "niveau": "success",
            "message": "L’abonnement fonctionne normalement."
        })

    historique_abonnement = JournalActivite.objects.filter(
        organisation=abonnement.organisation
    ).order_by("-date_creation")[:10]

    return render(request, "fenny/abonnement_detail.html", {
        "abonnement": abonnement,
        "nb_utilisateurs": nb_utilisateurs,
        "taux_utilisation": taux_utilisation,
        "ca_annuel": ca_annuel,
        "licences_disponibles": licences_disponibles,
        "cout_par_utilisateur": cout_par_utilisateur,
        "alertes_abonnement": alertes_abonnement,
        "historique_abonnement": historique_abonnement,
    })


@login_required
def fenny_modifier_abonnement(request, organisation_id):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    organisation = Organisation.objects.filter(id=organisation_id).first()

    if not organisation:
        return render(request, "403.html", status=403)

    abonnement = getattr(organisation, "abonnement", None)

    if not abonnement:
        abonnement = Abonnement.objects.create(
            organisation=organisation,
            formule="essai",
            nb_licences=1,
            prix_mensuel_ht=0,
            statut="essai",
        )

    if request.method == "POST":
        abonnement.formule = request.POST.get("formule")
        abonnement.nb_licences = request.POST.get("nb_licences")
        abonnement.prix_mensuel_ht = request.POST.get("prix_mensuel_ht")
        abonnement.statut = request.POST.get("statut")
        abonnement.date_debut = request.POST.get("date_debut") or None
        abonnement.date_fin = request.POST.get("date_fin") or None
        abonnement.save()

        JournalActivite.objects.create(
            organisation=organisation,
            utilisateur=request.user,
            type_action="abonnement_modifie",
            message=f"{request.user.username} a modifié l'abonnement de {organisation.nom}.",
        )

        return redirect("fenny_abonnement_detail", abonnement_id=abonnement.id)

    return render(request, "fenny/modifier_abonnement.html", {
        "organisation": organisation,
        "abonnement": abonnement,
    })


@login_required
def fenny_changer_statut_abonnement(request, abonnement_id):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    abonnement = Abonnement.objects.select_related(
        "organisation"
    ).filter(id=abonnement_id).first()

    if not abonnement:
        return render(request, "403.html", status=404)

    if abonnement.statut == "suspendu":
        abonnement.statut = "actif"
        message_action = "réactivé"
    else:
        abonnement.statut = "suspendu"
        message_action = "suspendu"

    abonnement.save()

    JournalActivite.objects.create(
        organisation=abonnement.organisation,
        utilisateur=request.user,
        type_action="abonnement_modifie",
        message=f"{request.user.username} a {message_action} l'abonnement de {abonnement.organisation.nom}.",
    )

    return redirect("fenny_abonnement_detail", abonnement_id=abonnement.id)
@login_required
def fenny_supervision(request):
    if not est_fenny(request.user):
        return render(request, "403.html", status=403)

    maintenant = timezone.now()

    invitations_expirees = InvitationUtilisateur.objects.filter(
        acceptee=False,
        date_expiration__lt=maintenant
    ).select_related("organisation")

    abonnements_suspendus = Abonnement.objects.filter(
        statut="suspendu"
    ).select_related("organisation")

    abonnements_expires = Abonnement.objects.filter(
        statut="expire"
    ).select_related("organisation")

    organisations_sans_utilisateur = Organisation.objects.filter(
        utilisateurs__isnull=True
    ).distinct()

    licences_saturees = []

    for abonnement in Abonnement.objects.filter(
        statut__in=["actif", "essai"]
    ).select_related("organisation"):

        nb_utilisateurs = ProfilUtilisateur.objects.filter(
            organisation=abonnement.organisation,
            user__is_active=True
        ).count()

        taux = 0
        if abonnement.nb_licences:
            taux = round((nb_utilisateurs / abonnement.nb_licences) * 100)

        if taux >= 90:
            licences_saturees.append({
                "organisation": abonnement.organisation,
                "utilisateurs": nb_utilisateurs,
                "licences": abonnement.nb_licences,
                "taux": taux,
            })

    utilisateurs_inactifs = ProfilUtilisateur.objects.filter(
        user__is_active=True,
        user__last_login__lt=maintenant - timezone.timedelta(days=90)
    ).select_related("user", "organisation")

    return render(request, "fenny/supervision.html", {
        "invitations_expirees": invitations_expirees,
        "abonnements_suspendus": abonnements_suspendus,
        "abonnements_expires": abonnements_expires,
        "organisations_sans_utilisateur": organisations_sans_utilisateur,
        "licences_saturees": licences_saturees,
        "utilisateurs_inactifs": utilisateurs_inactifs,
    })