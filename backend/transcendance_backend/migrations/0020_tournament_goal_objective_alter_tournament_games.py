# Generated by Django 4.2.7 on 2024-02-06 08:45

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("transcendance_backend", "0019_remove_player_games"),
    ]

    operations = [
        migrations.AddField(
            model_name="tournament",
            name="goal_objective",
            field=models.PositiveIntegerField(
                default=1,
                validators=[
                    django.core.validators.MinValueValidator(1),
                    django.core.validators.MaxValueValidator(15),
                ],
            ),
        ),
        migrations.AlterField(
            model_name="tournament",
            name="games",
            field=models.ManyToManyField(
                blank=True, related_name="tournaments", to="transcendance_backend.game"
            ),
        ),
    ]