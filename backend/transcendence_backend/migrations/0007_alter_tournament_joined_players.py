# Generated by Django 4.2.7 on 2023-11-10 14:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("transcendence_backend", "0006_alter_tournament_pools"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tournament",
            name="joined_players",
            field=models.ManyToManyField(blank=True, to="transcendence_backend.player"),
        ),
    ]