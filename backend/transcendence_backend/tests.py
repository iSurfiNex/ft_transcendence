from django.test import TestCase
from .models import Player, Tournament, Pool
import requests
from http import HTTPStatus
from django.forms import model_to_dict

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
