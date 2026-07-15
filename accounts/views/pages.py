import json

from django.conf import settings
from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout,
)
from django.contrib.auth.decorators import login_required
from django.core import signing
from django.http import HttpResponseForbidden
from django.shortcuts import redirect, render

from ..models import (
    Abonnement,
    FacteurEmission,
    Organisation,
    ProfilUtilisateur,
)



def dechets_recyclage(request):
    return render(
        request,
        "territoire_dechets.html"
    )

def home(request):
    return redirect("dashboard")


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("dashboard")

        return render(request, "login.html", {"error": "Identifiants invalides"})

    return render(request, "login.html")


def logout_view(request):
    logout(request)
    return redirect("login")

def connexion_vertclair(request):
    token = request.GET.get("token", "")

    if not token:
        return HttpResponseForbidden(
            "Jeton de connexion VertClair absent."
        )

    try:
        donnees = signing.loads(
            token,
            key=settings.APPLI1_SSO_SECRET,
            salt="vertclair-appli1-sso",
            max_age=120,
        )

    except signing.SignatureExpired:
        return HttpResponseForbidden(
            "Ce lien de connexion a expiré. "
            "Retournez dans VertClair puis cliquez de nouveau "
            "sur « Accéder à la plateforme »."
        )

    except signing.BadSignature:
        return HttpResponseForbidden(
            "Le lien de connexion VertClair est invalide."
        )

    if not donnees.get("abonnement_actif"):
        return HttpResponseForbidden(
            "Votre abonnement VertClair n’est pas actif."
        )

    if donnees.get("statut_abonnement") not in {
        "active",
        "trialing",
    }:
        return HttpResponseForbidden(
            "Votre abonnement ne permet pas l’accès à la plateforme."
        )

    email = donnees.get("email", "").strip().lower()
    username = donnees.get("username", "").strip()

    if not email or not username:
        return HttpResponseForbidden(
            "Les informations utilisateur sont incomplètes."
        )

    User = get_user_model()

    user = User.objects.filter(
        email__iexact=email
    ).first()

    if user is None:
        user = User.objects.filter(
            username=username
        ).first()

    if user is None:
        username_disponible = username
        compteur = 1

        while User.objects.filter(
            username=username_disponible
        ).exists():
            compteur += 1
            username_disponible = f"{username}-{compteur}"

        user = User.objects.create_user(
            username=username_disponible,
            email=email,
            first_name=donnees.get("first_name", ""),
            last_name=donnees.get("last_name", ""),
        )

        user.set_unusable_password()
        user.save()

    else:
        champs_modifies = []

        if user.email != email:
            user.email = email
            champs_modifies.append("email")

        first_name = donnees.get("first_name", "")
        last_name = donnees.get("last_name", "")

        if user.first_name != first_name:
            user.first_name = first_name
            champs_modifies.append("first_name")

        if user.last_name != last_name:
            user.last_name = last_name
            champs_modifies.append("last_name")

        if champs_modifies:
            user.save(update_fields=champs_modifies)

    if not user.is_active:
        return HttpResponseForbidden(
            "Ce compte utilisateur est désactivé."
        )

    organisation_nom = donnees.get(
        "organisation_nom",
        "Organisation VertClair",
    ).strip()

    organisation, _ = Organisation.objects.get_or_create(
        nom=organisation_nom,
    )

    offre = donnees.get("offre", "essai")
    max_users = int(
        donnees.get("max_users") or 1
    )

    abonnement, _ = Abonnement.objects.get_or_create(
        organisation=organisation,
        defaults={
            "formule": offre,
            "nb_licences": max_users,
            "statut": "actif",
        },
    )

    abonnement.formule = offre
    abonnement.nb_licences = max_users
    abonnement.statut = "actif"
    abonnement.save()

    profil, _ = ProfilUtilisateur.objects.get_or_create(
        user=user,
        defaults={
            "organisation": organisation,
            "role": "utilisateur",
        },
    )

    profil.organisation = organisation

    if donnees.get("admin_organisation"):
        profil.role = "admin_org"
    elif profil.role != "fenny":
        profil.role = "utilisateur"

    profil.save()

    login(
        request,
        user,
        backend="django.contrib.auth.backends.ModelBackend",
    )

    return redirect("dashboard")

def dashboard(request):
    return render(request, "dashboard.html")


def formations(request):
    return render(request, "formations.html")

@login_required
def campus(request):
    from accounts.models import ResultatQuiz

    resultats = ResultatQuiz.objects.filter(user=request.user)

    resultats_dict = {
        f"{r.theme}_{r.niveau}": r
        for r in resultats
    }

    themes = ["climat", "eau", "biodiversite"]

    progressions = {}

    for theme in themes:
        debutant = resultats_dict.get(f"{theme}_debutant")
        connaisseur = resultats_dict.get(f"{theme}_connaisseur")
        expert = resultats_dict.get(f"{theme}_expert")

        scores = [
            r.pourcentage
            for r in [debutant, connaisseur, expert]
            if r
        ]

        progressions[theme] = round(sum(scores) / 3) if scores else 0

    NOMBRE_MODULES = 8

    progression_globale = round(
        sum(progressions.values()) / NOMBRE_MODULES
    )

    modules_commences = sum(
        1 for valeur in progressions.values() if valeur > 0
    )

    quiz_realises = resultats.count()

    return render(request, "campus.html", {
        "resultats": resultats,
        "quiz_realises": quiz_realises,
        "modules_commences": modules_commences,
        "progression_globale": progression_globale,

        "climat_debutant": resultats_dict.get("climat_debutant"),
        "climat_connaisseur": resultats_dict.get("climat_connaisseur"),
        "climat_expert": resultats_dict.get("climat_expert"),
        "progression_climat": progressions["climat"],

        "eau_debutant": resultats_dict.get("eau_debutant"),
        "eau_connaisseur": resultats_dict.get("eau_connaisseur"),
        "eau_expert": resultats_dict.get("eau_expert"),
        "progression_eau": progressions["eau"],

        "biodiversite_debutant": resultats_dict.get("biodiversite_debutant"),
        "biodiversite_connaisseur": resultats_dict.get("biodiversite_connaisseur"),
        "biodiversite_expert": resultats_dict.get("biodiversite_expert"),
        "progression_biodiversite": progressions["biodiversite"],
    })


def carbone(request):

    facteurs = FacteurEmission.objects.filter(
        actif=True
    )

    facteurs_dict = {
        facteur.code: {
            "nom": facteur.nom,
            "unite": facteur.unite,
            "coefficient": facteur.coefficient,
            "source": facteur.source,
        }
        for facteur in facteurs
    }

    return render(
        request,
        "carbone.html",
        {
            "facteurs_emission": json.dumps(facteurs_dict)
        }
    )


def territoire(request):
    return render(request, "territoire.html")


def qualite_air(request):
    return render(request, "territoire_air.html")


def qualite_eau(request):
    return render(request, "territoire_eau.html")


def trames(request):
    return render(request, "territoire_trames.html")


def changement_climatique(request):
    return render(request, "territoire_climat.html")


def energie_territoire(request):
    return render(request, "territoire_energie.html")


def transition(request):
    return render(request, "transition.html")

def alimentation_durable(request):
    return render(request, "territoire_alimentation.html")

@login_required
def territoire_sols(request):
    return render(request, "territoire_sols.html")


