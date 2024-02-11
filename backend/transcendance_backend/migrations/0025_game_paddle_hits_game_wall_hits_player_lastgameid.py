# Generated by Django 4.2.10 on 2024-02-11 16:07

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "transcendance_backend",
            "0024_tournament_losers_tournament_players_r2_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="game",
            name="paddle_hits",
            field=models.IntegerField(blank=True, default=-1, null=True),
        ),
        migrations.AddField(
            model_name="game",
            name="wall_hits",
            field=models.IntegerField(blank=True, default=-1, null=True),
        ),
        migrations.AddField(
            model_name="player",
            name="lastGameId",
            field=models.IntegerField(default=-1, null=True),
        ),
    ]
