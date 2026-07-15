from django.core.management.base import BaseCommand

from accounts.models import Organisation, ServiceOrganisation


SERVICES_BASE = [
    "Direction",
    "Urbanisme",
    "Espaces verts",
    "Patrimoine",
    "Voirie",
    "Finances",
    "Achats",
    "RH",
    "Communication",
]


class Command(BaseCommand):
    help = "Crée les services de base pour chaque organisation."

    def handle(self, *args, **options):
        organisations = Organisation.objects.all()

        if not organisations.exists():
            self.stdout.write(self.style.WARNING("Aucune organisation trouvée."))
            return

        for organisation in organisations:
            self.stdout.write(f"Organisation : {organisation.nom}")

            for index, nom_service in enumerate(SERVICES_BASE, start=1):
                service, created = ServiceOrganisation.objects.get_or_create(
                    organisation=organisation,
                    nom=nom_service,
                    defaults={"ordre": index}
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f"  + {nom_service}"))
                else:
                    self.stdout.write(f"  = {nom_service} déjà existant")

        self.stdout.write(self.style.SUCCESS("Services de base créés."))