from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from transcendance_backend.models import Player, Game, Tournament

from transcendance_backend.utils import stateUpdate, stateUpdateAll

from datetime import datetime, timedelta


# Register a new command, use it this way `python3 manage.py create_site --domain=YOUR_DOMAIN`
class Command(BaseCommand):
    help = "Create a new site"

    def add_arguments(self, parser):
        parser.add_argument("-p1", type=str, help="Nickname of player 1")
        parser.add_argument(
            "-p2",
            type=str,
            help="Nickname of player 2",
        )
        parser.add_argument(
            "-p3",
            type=str,
            help="Nickname of player 3",
        )
        parser.add_argument(
            "-p4",
            type=str,
            help="Nickname of player 4",
        )

    def clean_game_tournament(self):
        Game.objects.all().delete()
        Tournament.objects.all().delete()

    def handle(self, *args, **options):
        nickname_p1 = options["p1"]
        nickname_p2 = options["p2"]
        nickname_p3 = options["p3"]
        nickname_p4 = options["p4"]
        try:
            p1 = Player.objects.get(nickname=nickname_p1)
        except:
            self.stdout.write(self.style.ERROR(f"P1({nickname_p1}) not found"))
            return

        try:
            p2 = Player.objects.get(nickname=nickname_p2)
        except:
            self.stdout.write(self.style.ERROR(f"P2({nickname_p2}) not found"))
            return

        try:
            p3 = Player.objects.get(nickname=nickname_p3)
        except:
            self.stdout.write(self.style.ERROR(f"P3({nickname_p3}) not found"))
            return

        try:
            p4 = Player.objects.get(nickname=nickname_p4)
        except:
            self.stdout.write(self.style.ERROR(f"P4({nickname_p4}) not found"))
            return

        self.clean_game_tournament()


        tournament = Tournament.objects.create(
            state="waiting",
            power_ups=False,
            goal_objective=1,
            created_by=p1,
        )
        tournament.players.add(p1)
        tournament.players.add(p2)
        tournament.players.add(p3)
        tournament.players.add(p4)

        self.stdout.write(
            self.style.SUCCESS(f"Tournament started")
        )
