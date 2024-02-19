# Generated by Django 4.2.10 on 2024-02-11 08:48

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("transcendence_backend", "0023_game_p1_score_game_p2_score_tournament_winner"),
    ]

    operations = [
        migrations.AddField(
            model_name="tournament",
            name="losers",
            field=models.ManyToManyField(
                blank=True,
                related_name="tournament_losers",
                to="transcendence_backend.player",
            ),
        ),
        migrations.AddField(
            model_name="tournament",
            name="players_r2",
            field=models.ManyToManyField(
                blank=True,
                related_name="tournament_r2",
                to="transcendence_backend.player",
            ),
        ),
        migrations.AlterField(
            model_name="game",
            name="goal_objective",
            field=models.PositiveIntegerField(
                default=3,
                validators=[
                    django.core.validators.MinValueValidator(1),
                    django.core.validators.MaxValueValidator(15),
                ],
            ),
        ),
    ]