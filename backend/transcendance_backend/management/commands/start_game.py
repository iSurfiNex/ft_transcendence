from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from transcendance_backend.models import Player, Game

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

    def handle(self, *args, **options):
        nickname_p1 = options["p1"]
        nickname_p2 = options["p2"]
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

        if p1.games.filter(state__in=["running", "waiting"]).first() is not None:
            self.stdout.write(self.style.ERROR(f"{nickname_p1} is already in a game"))
            return
        if p2.games.filter(state__in=["running", "waiting"]).first() is not None:
            self.stdout.write(self.style.ERROR(f"{nickname_p2} is already in a game"))
            return

        game = Game.objects.create(
            state="waiting",
            created_by=p1,
        )

        game.players.add(p1)
        game.players.add(p2)

        game.started_at = datetime.now() + timedelta(seconds=5)
        game.state = "waiting"
        game.goal_objective = 2
        game.save()

        self.stdout.write(
            self.style.SUCCESS(f"{nickname_p1} Vs {nickname_p2} - Game started")
        )
