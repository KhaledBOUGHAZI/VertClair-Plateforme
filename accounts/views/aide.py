import logging

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods


logger = logging.getLogger(__name__)


CATEGORIES_AIDE = {
    "question": "Question sur l’utilisation",
    "bug": "Signaler un problème technique",
    "suggestion": "Proposer une amélioration",
    "compte": "Compte ou connexion",
    "abonnement": "Abonnement ou facturation",
    "donnees": "Données environnementales",
    "autre": "Autre demande",
}


@login_required
@require_http_methods(["GET", "POST"])
def centre_aide(request):
    """
    Affiche le Centre d’aide VertClair et traite
    les demandes envoyées par les utilisateurs.
    """

    if request.method == "POST":
        categorie = request.POST.get(
            "categorie",
            "",
        ).strip()

        objet = request.POST.get(
            "objet",
            "",
        ).strip()

        message = request.POST.get(
            "message",
            "",
        ).strip()

        page_concernee = request.POST.get(
            "page_concernee",
            "",
        ).strip()

        if categorie not in CATEGORIES_AIDE:
            messages.error(
                request,
                "Veuillez sélectionner une catégorie valide.",
            )
            return redirect("centre_aide")

        if not objet:
            messages.error(
                request,
                "Veuillez indiquer l’objet de votre demande.",
            )
            return redirect("centre_aide")

        if len(objet) > 150:
            messages.error(
                request,
                "L’objet ne doit pas dépasser 150 caractères.",
            )
            return redirect("centre_aide")

        if not message:
            messages.error(
                request,
                "Veuillez décrire votre demande.",
            )
            return redirect("centre_aide")

        if len(message) < 10:
            messages.error(
                request,
                "Merci de décrire votre demande plus précisément.",
            )
            return redirect("centre_aide")

        utilisateur = request.user

        nom_utilisateur = (
            utilisateur.get_full_name().strip()
            or utilisateur.username
        )

        email_utilisateur = (
            utilisateur.email
            or "Adresse email non renseignée"
        )

        organisation = None

        profil = getattr(
            utilisateur,
            "profil_vertclair",
            None,
        )

        if profil:
            organisation = getattr(
                profil,
                "organisation",
                None,
            )

        nom_organisation = (
            organisation.nom
            if organisation
            else "Organisation non renseignée"
        )

        libelle_categorie = CATEGORIES_AIDE[
            categorie
        ]

        contenu_email = f"""
Nouvelle demande envoyée depuis le Centre d’aide VertClair

Catégorie :
{libelle_categorie}

Objet :
{objet}

Utilisateur :
{nom_utilisateur}

Nom d’utilisateur :
{utilisateur.username}

Email :
{email_utilisateur}

Organisation :
{nom_organisation}

Page concernée :
{page_concernee or "Non renseignée"}

Message :
{message}
"""

        destinataire_support = getattr(
            settings,
            "SUPPORT_EMAIL",
            settings.DEFAULT_FROM_EMAIL,
        )

        try:
            send_mail(
                subject=(
                    f"Centre d’aide VertClair - "
                    f"{libelle_categorie} - {objet}"
                ),
                message=contenu_email,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[
                    destinataire_support,
                ],
                fail_silently=False,
            )

        except Exception:
            logger.exception(
                "Erreur lors de l’envoi d’une demande "
                "depuis le Centre d’aide."
            )

            messages.error(
                request,
                (
                    "Votre demande n’a pas pu être envoyée. "
                    "Veuillez réessayer dans quelques instants."
                ),
            )

            return redirect("centre_aide")

        messages.success(
            request,
            (
                "Votre demande a bien été transmise à "
                "l’équipe VertClair."
            ),
        )

        return redirect("centre_aide")

    return render(
        request,
        "aide/centre_aide.html",
        {
            "categories_aide": CATEGORIES_AIDE,
        },
    )