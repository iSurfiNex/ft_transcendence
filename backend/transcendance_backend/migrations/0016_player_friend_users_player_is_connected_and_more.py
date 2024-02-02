# Generated by Django 4.2.7 on 2024-02-02 16:17

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("transcendance_backend", "0015_player_url_profile_42"),
    ]

    operations = [
        migrations.AddField(
            model_name="player",
            name="friend_users",
            field=models.ManyToManyField(
                blank=True, related_name="friends", to="transcendance_backend.player"
            ),
        ),
        migrations.AddField(
            model_name="player",
            name="is_connected",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="player",
            name="blocked_users",
            field=models.ManyToManyField(
                blank=True, related_name="blocked_by", to="transcendance_backend.player"
            ),
        ),
    ]
