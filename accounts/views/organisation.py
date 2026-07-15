from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone

from accounts.models import (
    ProfilUtilisateur,
    ServiceOrganisation,
    InvitationUtilisateur,
    JournalActivite,
)


def accepter_invitation(request, token):
    invitation = InvitationUtilisateur.objects.filter(
        token=token,
        acceptee=False
    ).select_related("organisation", "service").first()

    if not invitation or invitation.est_expiree():
        return render(request, "invitation/invitation_invalide.html")

    if request.method == "POST":
        username = request.POST.get("username")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if password1 != password2:
            messages.error(request, "Les deux mots de passe ne correspondent pas.")
            return render(request, "invitation/accepter_invitation.html", {
                "invitation": invitation,
            })

        try:
            validate_password(password1)
        except ValidationError as erreurs:
            for erreur in erreurs:
                messages.error(request, erreur)
            return render(request, "invitation/accepter_invitation.html", {
                "invitation": invitation,
            })

        user = User.objects.create_user(
            username=username,
            email=invitation.email,
            password=password1,
            first_name=invitation.prenom,
            last_name=invitation.nom,
        )

        profil = user.profil_vertclair
        profil.organisation = invitation.organisation
        profil.service = invitation.service
        profil.role = invitation.role
        profil.fonction = invitation.fonction
        profil.save()

        invitation.acceptee = True
        invitation.date_acceptation = timezone.now()
        invitation.save()

        JournalActivite.objects.create(
            organisation=invitation.organisation,
            utilisateur=user,
            type_action="invitation_acceptee",
            message=f"{user.username} a accepté son invitation.",
        )

        login(request, user)
        return redirect("dashboard")

    return render(request, "invitation/accepter_invitation.html", {
        "invitation": invitation,
    })


@login_required
def utilisateurs_organisation(request):
    profil = getattr(request.user, "profil_vertclair", None)

    if not profil or not profil.organisation:
        return render(request, "403.html", status=403)

    if profil.role not in ["fenny", "admin_org"]:
        return render(request, "403.html", status=403)

    organisation = profil.organisation

    utilisateurs = ProfilUtilisateur.objects.filter(
        organisation=organisation
    ).select_related("user", "service")

    service_id = request.GET.get("service")
    role = request.GET.get("role")

    if service_id:
        utilisateurs = utilisateurs.filter(service_id=service_id)

    if role:
        utilisateurs = utilisateurs.filter(role=role)

    services = ServiceOrganisation.objects.filter(
        organisation=organisation,
        actif=True
    )

    invitations = InvitationUtilisateur.objects.filter(
        organisation=organisation,
        acceptee=False
    ).select_related("service")

    abonnement = getattr(organisation, "abonnement", None)
    nb_licences = abonnement.nb_licences if abonnement else 0
    licences_utilisees = utilisateurs.count()

    return render(request, "organisation/utilisateurs.html", {
        "organisation": organisation,
        "utilisateurs": utilisateurs,
        "services": services,
        "invitations": invitations,
        "nb_licences": nb_licences,
        "licences_utilisees": licences_utilisees,
    })


@login_required
def inviter_utilisateur(request):
    profil = getattr(request.user, "profil_vertclair", None)

    if not profil or not profil.organisation:
        return render(request, "403.html", status=403)

    if profil.role not in ["fenny", "admin_org"]:
        return render(request, "403.html", status=403)

    organisation = profil.organisation

    services = ServiceOrganisation.objects.filter(
        organisation=organisation,
        actif=True
    )

    if request.method == "POST":
        email = request.POST.get("email")

        abonnement = getattr(organisation, "abonnement", None)

        if abonnement:
            licences_utilisees = ProfilUtilisateur.objects.filter(
                organisation=organisation,
                user__is_active=True
            ).count()

            invitations_en_attente = InvitationUtilisateur.objects.filter(
                organisation=organisation,
                acceptee=False
            ).count()

            total_engage = licences_utilisees + invitations_en_attente

            if total_engage >= abonnement.nb_licences:
                messages.error(
                    request,
                    "Vous avez utilisé toutes les licences de votre abonnement. "
                    "Passez à une formule supérieure pour inviter un nouvel utilisateur."
                )
                return render(request, "organisation/inviter_utilisateur.html", {
                    "organisation": organisation,
                    "services": services,
                })

        if User.objects.filter(email=email).exists():
            messages.error(
                request,
                "Cette adresse e-mail est déjà associée à un compte VertClair. "
                "L'utilisateur peut se connecter directement. Aucune invitation n'a été envoyée."
            )
            return render(request, "organisation/inviter_utilisateur.html", {
                "organisation": organisation,
                "services": services,
            })

        if InvitationUtilisateur.objects.filter(
            organisation=organisation,
            email=email,
            acceptee=False
        ).exists():
            messages.warning(
                request,
                "Une invitation est déjà en attente pour cette adresse e-mail. "
                "Vous pouvez la renvoyer depuis la liste des invitations."
            )
            return render(request, "organisation/inviter_utilisateur.html", {
                "organisation": organisation,
                "services": services,
            })

        invitation = InvitationUtilisateur.objects.create(
            organisation=organisation,
            service_id=request.POST.get("service") or None,
            email=email,
            nom=request.POST.get("nom"),
            prenom=request.POST.get("prenom"),
            fonction=request.POST.get("fonction"),
            role=request.POST.get("role"),
            invite_par=request.user,
        )

        JournalActivite.objects.create(
            organisation=organisation,
            utilisateur=request.user,
            type_action="invitation_envoyee",
            message=(
                f"{request.user.username} a invité "
                f"{invitation.prenom} {invitation.nom} "
                f"({invitation.email})."
            ),
        )

        lien_invitation = request.build_absolute_uri(
            reverse("accepter_invitation", args=[invitation.token])
        )

        send_mail(
            "Invitation à rejoindre VertClair",
            f"""
Bonjour {invitation.prenom},

Vous avez été invité à rejoindre l'organisation {organisation.nom} sur VertClair.

Cliquez sur ce lien pour activer votre compte :
{lien_invitation}

Ce lien est valable 7 jours.

L'équipe VertClair
""",
            settings.DEFAULT_FROM_EMAIL,
            [invitation.email],
            fail_silently=False,
        )

        messages.success(
            request,
            f"Invitation envoyée avec succès à {invitation.email}."
        )
        return redirect("utilisateurs_organisation")

    return render(request, "organisation/inviter_utilisateur.html", {
        "organisation": organisation,
        "services": services,
    })


@login_required
def modifier_utilisateur_organisation(request, profil_id):
    profil_connecte = getattr(request.user, "profil_vertclair", None)

    if not profil_connecte or not profil_connecte.organisation:
        return render(request, "403.html", status=403)

    if profil_connecte.role not in ["fenny", "admin_org"]:
        return render(request, "403.html", status=403)

    profil_cible = ProfilUtilisateur.objects.select_related(
        "user",
        "organisation",
        "service"
    ).filter(
        id=profil_id,
        organisation=profil_connecte.organisation
    ).first()

    if not profil_cible:
        return render(request, "403.html", status=403)

    services = ServiceOrganisation.objects.filter(
        organisation=profil_connecte.organisation,
        actif=True
    )

    if request.method == "POST":
        profil_cible.service_id = request.POST.get("service") or None
        profil_cible.role = request.POST.get("role")
        profil_cible.fonction = request.POST.get("fonction")
        profil_cible.telephone = request.POST.get("telephone")
        profil_cible.save()

        profil_cible.user.email = request.POST.get("email")
        profil_cible.user.first_name = request.POST.get("first_name")
        profil_cible.user.last_name = request.POST.get("last_name")
        profil_cible.user.save()

        JournalActivite.objects.create(
            organisation=profil_connecte.organisation,
            utilisateur=request.user,
            type_action="utilisateur_modifie",
            message=f"{request.user.username} a modifié l'utilisateur {profil_cible.user.username}.",
        )

        messages.success(request, "Utilisateur modifié avec succès.")
        return redirect("utilisateurs_organisation")

    return render(request, "organisation/modifier_utilisateur.html", {
        "profil_cible": profil_cible,
        "services": services,
    })


@login_required
def changer_statut_utilisateur(request, profil_id):
    profil_connecte = getattr(request.user, "profil_vertclair", None)

    if not profil_connecte or not profil_connecte.organisation:
        return render(request, "403.html", status=403)

    if profil_connecte.role not in ["fenny", "admin_org"]:
        return render(request, "403.html", status=403)

    profil_cible = ProfilUtilisateur.objects.select_related("user").filter(
        id=profil_id,
        organisation=profil_connecte.organisation
    ).first()

    if not profil_cible:
        return render(request, "403.html", status=403)

    if profil_cible.role == "fenny":
        messages.error(request, "Le compte Fenny ne peut pas être désactivé.")
        return redirect("utilisateurs_organisation")

    profil_cible.user.is_active = not profil_cible.user.is_active
    profil_cible.user.save()

    if profil_cible.user.is_active:
        type_action = "utilisateur_reactive"
        message = f"{request.user.username} a réactivé {profil_cible.user.username}."
        messages.success(request, "Utilisateur réactivé.")
    else:
        type_action = "utilisateur_desactive"
        message = f"{request.user.username} a désactivé {profil_cible.user.username}."
        messages.success(request, "Utilisateur désactivé.")

    JournalActivite.objects.create(
        organisation=profil_connecte.organisation,
        utilisateur=request.user,
        type_action=type_action,
        message=message,
    )

    return redirect("utilisateurs_organisation")


@login_required
def annuler_invitation(request, invitation_id):
    profil = getattr(request.user, "profil_vertclair", None)

    if not profil or not profil.organisation:
        return render(request, "403.html", status=403)

    if profil.role not in ["fenny", "admin_org"]:
        return render(request, "403.html", status=403)

    invitation = InvitationUtilisateur.objects.filter(
        id=invitation_id,
        organisation=profil.organisation,
        acceptee=False
    ).first()

    if not invitation:
        return render(request, "403.html", status=403)

    JournalActivite.objects.create(
        organisation=profil.organisation,
        utilisateur=request.user,
        type_action="invitation_envoyee",
        message=f"{request.user.username} a annulé l'invitation envoyée à {invitation.email}.",
    )

    invitation.delete()
    messages.success(request, "Invitation annulée.")
    return redirect("utilisateurs_organisation")


@login_required
def renvoyer_invitation(request, invitation_id):
    profil = getattr(request.user, "profil_vertclair", None)

    if not profil or not profil.organisation:
        return render(request, "403.html", status=403)

    if profil.role not in ["fenny", "admin_org"]:
        return render(request, "403.html", status=403)

    invitation = InvitationUtilisateur.objects.filter(
        id=invitation_id,
        organisation=profil.organisation,
        acceptee=False
    ).first()

    if not invitation:
        return render(request, "403.html", status=403)

    lien_invitation = request.build_absolute_uri(
        reverse("accepter_invitation", args=[invitation.token])
    )

    send_mail(
        "Rappel - Invitation à rejoindre VertClair",
        f"""
Bonjour {invitation.prenom},

Votre invitation à rejoindre l'organisation {invitation.organisation.nom} sur VertClair est toujours active.

Cliquez sur ce lien pour activer votre compte :
{lien_invitation}

Ce lien est valable jusqu'au {invitation.date_expiration.strftime("%d/%m/%Y à %H:%M")}.

L'équipe VertClair
""",
        settings.DEFAULT_FROM_EMAIL,
        [invitation.email],
        fail_silently=False,
    )

    JournalActivite.objects.create(
        organisation=profil.organisation,
        utilisateur=request.user,
        type_action="invitation_envoyee",
        message=f"{request.user.username} a renvoyé l'invitation à {invitation.email}.",
    )

    messages.success(request, f"Invitation renvoyée à {invitation.email}.")
    return redirect("utilisateurs_organisation")


@login_required
def abonnement_organisation(request):
    profil = getattr(request.user, "profil_vertclair", None)

    if not profil or not profil.organisation:
        return render(request, "403.html", status=403)

    if profil.role not in ["fenny", "admin_org"]:
        return render(request, "403.html", status=403)

    organisation = profil.organisation
    abonnement = organisation.abonnement

    licences_utilisees = ProfilUtilisateur.objects.filter(
        organisation=organisation,
        user__is_active=True
    ).count()

    invitations = InvitationUtilisateur.objects.filter(
        organisation=organisation,
        acceptee=False
    ).count()

    return render(request, "organisation/abonnement.html", {
        "organisation": organisation,
        "abonnement": abonnement,
        "licences_utilisees": licences_utilisees,
        "invitations": invitations,
    })