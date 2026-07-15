from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import timedelta
from django.utils import timezone

class ResultatQuiz(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    theme = models.CharField(max_length=50)
    niveau = models.CharField(max_length=50)
    score = models.IntegerField()
    total = models.IntegerField()
    pourcentage = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "theme", "niveau")

    def __str__(self):
        return f"{self.user.username} - {self.theme} - {self.niveau} : {self.pourcentage}%"

class FacteurEmission(models.Model):
    code = models.CharField(max_length=100, unique=True)
    categorie = models.CharField(max_length=100)
    nom = models.CharField(max_length=255)
    unite = models.CharField(max_length=50)
    coefficient = models.FloatField()
    source = models.CharField(
        max_length=255,
        default="Base Empreinte® ADEME – sélection VertClair"
    )
    actif = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.categorie} - {self.nom}"


class BilanCarbone(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mois = models.CharField(max_length=7)
    total_co2 = models.FloatField(default=0)

    class Meta:
        unique_together = ("user", "mois")

    def __str__(self):
        return f"{self.user.username} - {self.mois}"


class LigneCarbone(models.Model):
    bilan = models.ForeignKey(
        BilanCarbone,
        on_delete=models.CASCADE,
        related_name="lignes"
    )
    rubrique = models.CharField(max_length=100)
    poste = models.CharField(max_length=255)
    consommation = models.FloatField(default=0)
    co2 = models.FloatField(default=0)

    def __str__(self):
        return self.poste
    
class ActionTransition(models.Model):

    THEME_CHOICES = [
        ("Energie", "Energie"),
        ("Mobilité", "Mobilité"),
        ("Déchets", "Déchets"),
        ("Alimentation", "Alimentation"),
        ("Numérique", "Numérique"),
        ("Achats", "Achats"),
        ("Bâtiments", "Bâtiments"),
        ("Logistique", "Logistique"),
        ("Climat", "Climat"),
        ("Eau", "Eau"),
        ("Biodiversité", "Biodiversité"),

        
    ]

    theme = models.CharField(
        max_length=50,
        choices=THEME_CHOICES
    )

    titre = models.CharField(
        max_length=255
    )

    description = models.TextField()

    gain_co2 = models.FloatField(
        default=0
    )

    cout = models.CharField(
        max_length=100,
        blank=True
    )

    delai = models.CharField(
        max_length=100,
        blank=True
    )

    priorite = models.CharField(
        max_length=50,
        blank=True
    )

    financement = models.CharField(
        max_length=255,
        blank=True
    )

    indicateur = models.CharField(
        max_length=255,
        blank=True
    )

    source = models.CharField(
        max_length=255,
        blank=True
    )
    objectifs = models.JSONField(default=list, blank=True)
    indicateur_suivi = models.CharField(max_length=200, blank=True)
    valeur_cible = models.CharField(max_length=100, blank=True)
    sources = models.TextField(blank=True)
    financements = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.titre
    
from django.contrib.auth.models import User


class Organisation(models.Model):
    TYPE_CHOICES = [
        ("commune", "Commune / collectivité"),
        ("entreprise", "Entreprise"),
        ("association", "Association"),
        ("particulier", "Particulier"),
        ("autre", "Autre"),
    ]

    nom = models.CharField(max_length=255)
    type_organisation = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default="entreprise"
    )
    siret = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    telephone = models.CharField(max_length=30, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom

class ServiceOrganisation(models.Model):
    organisation = models.ForeignKey(
        Organisation,
        on_delete=models.CASCADE,
        related_name="services"
    )
    nom = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    responsable = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="services_responsable"
    )
    actif = models.BooleanField(default=True)
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["ordre", "nom"]
        unique_together = ("organisation", "nom")

    def __str__(self):
        return f"{self.organisation.nom} - {self.nom}"
class Abonnement(models.Model):
    FORMULE_CHOICES = [
    ("essai", "Essai"),
    ("1", "1 utilisateur"),
    ("5", "5 utilisateurs"),
    ("10", "10 utilisateurs"),
    ("20", "20 utilisateurs"),
    ("50", "50 utilisateurs"),
    ("100", "100 utilisateurs"),
]
    STATUT_CHOICES = [
        ("actif", "Actif"),
        ("essai", "Période d’essai"),
        ("suspendu", "Suspendu"),
        ("resilie", "Résilié"),
        ("expire", "Expiré"),
    ]

    organisation = models.OneToOneField(
        Organisation,
        on_delete=models.CASCADE,
        related_name="abonnement"
    )
    formule = models.CharField(
    max_length=30,
    choices=FORMULE_CHOICES,
    default="essai"
)
    nb_licences = models.PositiveIntegerField(default=1)
    prix_mensuel_ht = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=35
    )
    date_debut = models.DateField(blank=True, null=True)
    date_fin = models.DateField(blank=True, null=True)
    statut = models.CharField(
        max_length=30,
        choices=STATUT_CHOICES,
        default="essai"
    )

    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.organisation.nom} - {self.formule}"


class ProfilUtilisateur(models.Model):
    ROLE_CHOICES = [
    ("fenny", "Fenny - Superviseur global"),
    ("admin_org", "Administrateur d’organisation"),
    ("gestionnaire", "Gestionnaire"),
    ("utilisateur", "Utilisateur"),
    ("lecteur", "Lecteur"),
]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profil_vertclair"
    )
    organisation = models.ForeignKey(
        Organisation,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="utilisateurs"
    )
    service = models.ForeignKey(
    ServiceOrganisation,
    on_delete=models.SET_NULL,
    blank=True,
    null=True,
    related_name="profils"
)
    role = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES,
        default="utilisateur"
    )
    fonction = models.CharField(max_length=100, blank=True, null=True)
    telephone = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self):
        return self.user.username


from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=User)
def creer_profil_utilisateur(sender, instance, created, **kwargs):
    if created:
        ProfilUtilisateur.objects.create(user=instance)

class InvitationUtilisateur(models.Model):
    ROLE_CHOICES = ProfilUtilisateur.ROLE_CHOICES

    organisation = models.ForeignKey(
        Organisation,
        on_delete=models.CASCADE,
        related_name="invitations"
    )
    service = models.ForeignKey(
        ServiceOrganisation,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="invitations"
    )

    email = models.EmailField()
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    fonction = models.CharField(max_length=100, blank=True)

    role = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES,
        default="utilisateur"
    )

    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_expiration = models.DateTimeField(blank=True, null=True)

    acceptee = models.BooleanField(default=False)
    date_acceptation = models.DateTimeField(blank=True, null=True)

    invite_par = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="invitations_envoyees"
    )

    def save(self, *args, **kwargs):
        if not self.date_expiration:
            self.date_expiration = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def est_expiree(self):
        return timezone.now() > self.date_expiration

    def __str__(self):
        return f"{self.email} - {self.organisation.nom}"
class JournalActivite(models.Model):
    TYPE_CHOICES = [
        ("invitation_envoyee", "Invitation envoyée"),
        ("invitation_acceptee", "Invitation acceptée"),
        ("utilisateur_modifie", "Utilisateur modifié"),
        ("utilisateur_desactive", "Utilisateur désactivé"),
        ("utilisateur_reactive", "Utilisateur réactivé"),
        ("abonnement_modifie", "Abonnement modifié"),
    ]

    organisation = models.ForeignKey(
        Organisation,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="journal_activite"
    )

    utilisateur = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="activites_vertclair"
    )

    type_action = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES
    )

    message = models.TextField()

    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_creation"]

    def __str__(self):
        return self.message