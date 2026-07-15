from django.contrib import admin

from .models import (
    ActionTransition,
    FacteurEmission,
    Organisation,
    ServiceOrganisation,
    Abonnement,
    ProfilUtilisateur,
    InvitationUtilisateur,
    JournalActivite,
)


@admin.register(ActionTransition)
class ActionTransitionAdmin(admin.ModelAdmin):

    list_display = (
        "titre",
        "theme",
        "priorite",
        "cout",
        "delai",
    )

    search_fields = (
        "titre",
        "description",
    )

    list_filter = (
        "theme",
        "priorite",
    )


@admin.register(FacteurEmission)
class FacteurEmissionAdmin(admin.ModelAdmin):

    list_display = (
        "categorie",
        "nom",
        "unite",
        "coefficient",
        "actif",
    )

    list_filter = (
        "categorie",
        "actif",
    )

    search_fields = (
        "nom",
        "code",
    )

@admin.register(Organisation)
class OrganisationAdmin(admin.ModelAdmin):
    list_display = (
        "nom",
        "type_organisation",
        "email",
        "telephone",
        "date_creation",
    )

    search_fields = (
        "nom",
        "email",
        "siret",
    )

    list_filter = (
        "type_organisation",
    )
    
@admin.register(ServiceOrganisation)
class ServiceOrganisationAdmin(admin.ModelAdmin):
    list_display = (
        "nom",
        "organisation",
        "responsable",
        "actif",
        "ordre",
    )

    list_filter = (
        "organisation",
        "actif",
    )

    search_fields = (
        "nom",
        "organisation__nom",
    )

@admin.register(Abonnement)
class AbonnementAdmin(admin.ModelAdmin):
    list_display = (
        "organisation",
        "formule",
        "nb_licences",
        "prix_mensuel_ht",
        "statut",
        "date_debut",
        "date_fin",
    )

    list_filter = (
        "statut",
        "formule",
    )

    search_fields = (
        "organisation__nom",
        "stripe_customer_id",
        "stripe_subscription_id",
    )


@admin.register(ProfilUtilisateur)
class ProfilUtilisateurAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "organisation",
        "service",
        "role",
        "fonction",
        "telephone",
    )

    list_filter = (
        "role",
        "organisation",
        "service",
    )

    search_fields = (
        "user__username",
        "user__email",
        "organisation__nom",
    )
@admin.register(InvitationUtilisateur)
class InvitationUtilisateurAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "organisation",
        "service",
        "role",
        "acceptee",
        "date_creation",
        "date_expiration",
    )

    list_filter = (
        "organisation",
        "role",
        "acceptee",
    )

    search_fields = (
        "email",
        "nom",
        "prenom",
        "organisation__nom",
    )
@admin.register(JournalActivite)
class JournalActiviteAdmin(admin.ModelAdmin):
    list_display = (
        "date_creation",
        "organisation",
        "utilisateur",
        "type_action",
        "message",
    )

    list_filter = (
        "type_action",
        "organisation",
        "date_creation",
    )

    search_fields = (
        "message",
        "utilisateur__username",
        "organisation__nom",
    )