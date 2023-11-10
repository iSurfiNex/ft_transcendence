from django.test import TestCase
from .models import Player, Tournament, Pool
import requests
from http import HTTPStatus
from django.forms import model_to_dict

# class TournamentTestCase(TestCase):
#    fixtures = ["test_data.json"]
#
#    def test_tournament_and_pools(self):
#        # Check if the players, tournament, and pools were created correctly
#        players = Player.objects.all()
#        tournament = Tournament.objects.get(pk=1)
#        pools = Pool.objects.filter(tournament=tournament)
#
#        self.assertEqual(players.count(), 4)
#        self.assertEqual(players[0].name, "Player 1")
#        self.assertEqual(pools.count(), 2)

# from django.test import TestCase
from django.test import LiveServerTestCase
from django.urls import reverse


class ApiTests(LiveServerTestCase):
    fixtures = ["test_data.json"]

    def test_player_getall_endpoint(self):
        # Use the 'reverse' function to get the URL for the PlayerView
        url = reverse("player-list")

        # self.live_server_url contains for example http://localhost:8000
        base_url = self.live_server_url + url

        response = requests.get(base_url)

        self.assertEqual(response.status_code, HTTPStatus.OK)

        data = response.json()

        self.assertEqual(len(data), 4)

    def test_player_get_endpoint(self):
        # Use the 'reverse' function to get the URL for the PlayerView
        url = reverse("player-detail", args=[1])

        response = requests.get(self.live_server_url + url)

        self.assertEqual(response.status_code, HTTPStatus.OK)

        data = response.json()

        self.assertEqual(
            data,
            {
                "id": 1,
                "name": "Player 1",
                "blocked_users": [],
                "tournaments": [],
                "games": [],
            },
        )

        url = reverse("player-detail", args=[5])
        response = requests.get(self.live_server_url + url)
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_player_post_endpoint(self):
        # Use the 'reverse' function to get the URL for the PlayerView
        url = reverse("player-list")
        response = requests.post(
            self.live_server_url + url, json={"name": "test_player"}
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        data = response.json()
        self.assertEqual(
            data,
            {
                "name": "test_player",
                "id": 5,
                "blocked_users": [],
                "tournaments": [],
                "games": [],
            },
        )
        new_player = Player.objects.get(id=5)
        self.assertEqual(
            model_to_dict(new_player),
            {
                "name": "test_player",
                "id": 5,
                "blocked_users": [],
                "tournaments": [],
                "games": [],
            },
        )


#    def test_create_endpoint(self):
#        data = {"name": "New Item"}
#        response = self.client.post("/api/your_endpoint/", data)
#
#        # Assert that the response status code is 201 (Created)
#        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


## Make a GET request to retrieve data
# response = requests.get("http://localhost:8000/api/your_endpoint/")
# print(response.status_code)
# print(response.json())
#
## Make a POST request to create data
# data = {"name": "New Item"}
# response = requests.post("http://localhost:8000/api/your_endpoint/", json=data)
# print(response.status_code)
# print(response.json())
#
## Make a PUT request to update data
# data = {"name": "Updated Item"}
# response = requests.put("http://localhost:8000/api/your_endpoint/1/", json=data)
# print(response.status_code)
# print(response.json())
#
## Make a DELETE request to delete data
# response = requests.delete("http://localhost:8000/api/your_endpoint/1/")
# print(response.status_code)
