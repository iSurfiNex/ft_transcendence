from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from django.conf import settings


# Register a new command, use it this way `python3 manage.py create_site --domain=YOUR_DOMAIN`
class Command(BaseCommand):
    help = "Create a new site"

    def add_arguments(self, parser):
        parser.add_argument(
            "--domain", type=str, help="Specify the domain for the new site"
        )

    def handle(self, *args, **options):
        domain = options["domain"] or settings.SITE_DOMAIN
        new_site = Site.objects.create(domain=domain, name=domain)
        self.stdout.write(
            self.style.SUCCESS(f"New site created with ID: {new_site.id}")
        )
