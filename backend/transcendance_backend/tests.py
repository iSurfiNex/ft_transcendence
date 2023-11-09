from django.test import TestCase
from .models import Player, Tournament, Pool


class TournamentTestCase(TestCase):
    fixtures = ["test_data.json"]

    def test_tournament_and_pools(self):
        # Check if the players, tournament, and pools were created correctly
        players = Player.objects.all()
        tournament = Tournament.objects.get(pk=1)
        pools = Pool.objects.filter(tournament=tournament)

        self.assertEqual(players.count(), 4)
        self.assertEqual(players[0].name, "Player 1")
        self.assertEqual(pools.count(), 2)
