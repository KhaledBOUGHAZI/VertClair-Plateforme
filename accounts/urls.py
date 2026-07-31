from django.urls import path

from .views.api_questions import get_questions_quiz
from .views import api_sols, pages
from accounts.views import api_biodiversite_couches
from .views.api_commune import api_commune

from accounts.views.organisation import (
    utilisateurs_organisation,
    inviter_utilisateur,
    accepter_invitation,
    modifier_utilisateur_organisation,
    changer_statut_utilisateur,
    annuler_invitation,
    renvoyer_invitation,
    abonnement_organisation,
)

from accounts.views.fenny import (
    dashboard_fenny,
    fenny_organisations,
    fenny_nouvelle_organisation,
    fenny_organisation_detail,
    fenny_modifier_organisation,
    fenny_utilisateurs,
    fenny_detail_utilisateur,
    fenny_modifier_utilisateur,
    fenny_changer_statut_utilisateur,
    fenny_reinitialiser_mdp,
    fenny_abonnements,
    fenny_abonnement_detail,
    fenny_modifier_abonnement,
    fenny_changer_statut_abonnement,
    fenny_supervision,
)

from accounts.views.fenny_finance import fenny_finance
from accounts.views.aide import centre_aide

from .views import (
    home,
    login_view,
    deconnexion,
    dashboard,
    campus,
    formations,
    quiz_theme,
    quiz_session,
    carbone,
    territoire,
    transition,
    qualite_air,
    qualite_eau,
    trames,
    changement_climatique,
    energie_territoire,
    alimentation_durable,
    api_alimentation,
    dechets_recyclage,
    api_decheteries,
    save_carbon,
    get_bilans_carbone,
    get_indice_air,
    get_donnees_eaux,
    api_climat,
    risques_climat,
    api_energie,
    api_sensibilite_commune,
    api_dpe_commune,
    api_dpe_batiment,
    api_carte_dpe,
    api_climat_futur,
    api_economie_circulaire,
    get_fiche_pedagogique,
    save_quiz_result,
    connexion_vertclair,
)


urlpatterns = [
    path(
    "profil/",
    pages.profil,
    name="profil",
),
path(
    "organisation/",
    pages.organisation,
    name="organisation",
),
    path(
    "connexion-vertclair/",
    connexion_vertclair,
    name="connexion_vertclair",
),
    path(
    "fenny/finance/",
    fenny_finance,
    name="fenny_finance",
),
    path("fenny/supervision/", fenny_supervision, name="fenny_supervision"),
    path("", home, name="home"),

    path("login/", login_view, name="login"),
    path("logout/", deconnexion, name="logout"),

    path("dashboard/", dashboard, name="dashboard"),
    path(
    "centre-aide/",
    centre_aide,
    name="centre_aide",
),
    path("campus/", campus, name="campus"),

    path("formations/", formations, name="formations"),
    path("formations/quiz/<str:theme>/", quiz_theme, name="quiz_theme"),
    path("formations/quiz/<str:theme>/<str:niveau>/", quiz_session, name="quiz_session"),

    path("carbone/", carbone, name="carbone"),
    path("transition/", transition, name="transition"),

    path("territoire/", territoire, name="territoire"),
    path("territoire/air/", qualite_air, name="qualite_air"),
    path("territoire/eau/", qualite_eau, name="qualite_eau"),
    path("territoire/trames/", trames, name="trames"),
    path("territoire/climat/", changement_climatique, name="changement_climatique"),
    path("territoire/energie/", energie_territoire, name="energie_territoire"),
    path("territoire/dechets/", dechets_recyclage, name="dechets_recyclage"),
    path("territoire/alimentation/", alimentation_durable, name="alimentation_durable"),
    path("territoire/sols/", pages.territoire_sols, name="territoire_sols"),

    path("organisation/abonnement/", abonnement_organisation, name="abonnement_organisation"),
    path("organisation/utilisateurs/", utilisateurs_organisation, name="utilisateurs_organisation"),
    path("organisation/utilisateurs/inviter/", inviter_utilisateur, name="inviter_utilisateur"),
    path("organisation/utilisateurs/<int:profil_id>/modifier/", modifier_utilisateur_organisation, name="modifier_utilisateur_organisation"),
    path("organisation/utilisateurs/<int:profil_id>/statut/", changer_statut_utilisateur, name="changer_statut_utilisateur"),
    path("organisation/invitations/<int:invitation_id>/annuler/", annuler_invitation, name="annuler_invitation"),
    path("organisation/invitations/<int:invitation_id>/renvoyer/", renvoyer_invitation, name="renvoyer_invitation"),
    path("invitation/<uuid:token>/", accepter_invitation, name="accepter_invitation"),

    path("fenny/", dashboard_fenny, name="dashboard_fenny"),
    path("fenny/organisations/", fenny_organisations, name="fenny_organisations"),
    path("fenny/organisations/nouvelle/", fenny_nouvelle_organisation, name="fenny_nouvelle_organisation"),
    path("fenny/organisations/<int:organisation_id>/", fenny_organisation_detail, name="fenny_organisation_detail"),
    path("fenny/organisations/<int:organisation_id>/modifier/", fenny_modifier_organisation, name="fenny_modifier_organisation"),
    path("fenny/organisations/<int:organisation_id>/abonnement/modifier/", fenny_modifier_abonnement, name="fenny_modifier_abonnement"),

    path("fenny/utilisateurs/", fenny_utilisateurs, name="fenny_utilisateurs"),
    path("fenny/utilisateurs/<int:profil_id>/", fenny_detail_utilisateur, name="fenny_detail_utilisateur"),
    path("fenny/utilisateurs/<int:profil_id>/modifier/", fenny_modifier_utilisateur, name="fenny_modifier_utilisateur"),
    path("fenny/utilisateurs/<int:profil_id>/statut/", fenny_changer_statut_utilisateur, name="fenny_changer_statut_utilisateur"),
    path("fenny/utilisateurs/<int:profil_id>/motdepasse/", fenny_reinitialiser_mdp, name="fenny_reinitialiser_mdp"),

    path("fenny/abonnements/", fenny_abonnements, name="fenny_abonnements"),
    path("fenny/abonnements/<int:abonnement_id>/", fenny_abonnement_detail, name="fenny_abonnement_detail"),
    path("fenny/abonnements/<int:abonnement_id>/statut/", fenny_changer_statut_abonnement, name="fenny_changer_statut_abonnement"),

    path("api/questions-quiz/", get_questions_quiz, name="questions_quiz"),
    path("api/fiche-pedagogique/", get_fiche_pedagogique, name="get_fiche_pedagogique"),
    path("api/save-quiz-result/", save_quiz_result, name="save_quiz_result"),

    path("api/save-carbon/", save_carbon, name="save_carbon"),
    path("api/bilans-carbone/", get_bilans_carbone, name="get_bilans_carbone"),

    path("api/indice-air/", get_indice_air, name="get_indice_air"),
    path("api/donnees-eaux/", get_donnees_eaux, name="get_donnees_eaux"),

    path("api/climat/", api_climat, name="api_climat"),
    path("api/risques-climat/", risques_climat, name="risques_climat"),
    path("api/climat-futur/", api_climat_futur, name="api_climat_futur"),
    path("api/sensibilite-commune/", api_sensibilite_commune, name="api_sensibilite_commune"),

    path("api/energie/", api_energie, name="api_energie"),

    path("api/dpe-commune/", api_dpe_commune, name="api_dpe_commune"),
    path("api/dpe-batiment/", api_dpe_batiment, name="api_dpe_batiment"),
    path("api/carte-dpe/", api_carte_dpe, name="api_carte_dpe"),

    path("api/decheteries/", api_decheteries, name="api_decheteries"),
    path("api/economie-circulaire/", api_economie_circulaire, name="api_economie_circulaire"),
    path("api/alimentation/", api_alimentation, name="api_alimentation"),

    path("api/sols/", api_sols.api_sols, name="api_sols"),
    path("api/commune/", api_commune, name="api_commune"),
    path("api/biodiversite/couches/", api_biodiversite_couches.api_biodiversite_couches, name="api_biodiversite_couches"),
]