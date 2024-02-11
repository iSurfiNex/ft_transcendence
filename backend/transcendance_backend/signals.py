from django.db.models.signals import post_save, pre_save
from django.contrib.auth.models import User
from django.dispatch import receiver

from .models import Tournament, User, Game, Player
from .pong.init import run_pong_thread
from .pong.communication import set_game_stopped, init_threadsafe_game_data

from .utils import stateUpdate, stateUpdateAll

def get_unique_nickname(str):
    if not Player.objects.filter(nickname=str).exists():
        return str
    i = 2
    while Player.objects.filter(nickname=f"{str}{i}").exists():
        i += 1
    return f"{str}{i}"


# Automatically associate a Player when a User is created
@receiver(post_save, sender=User)
def create_player(sender, instance, created, **kwargs):
    if created:
        Player.objects.create(
            user=instance, nickname=get_unique_nickname(f"{instance.username}_")
        )


def create_tournament_game(tournament):
    return Game.objects.create(
        state="waiting",
        goal_objective=tournament.goal_objective,
        power_ups=tournament.power_ups,
        created_by=tournament.created_by,
        tournament=tournament,
    )

@receiver(post_save, sender=Tournament)
def on_tournament_created(sender, instance, created, **kwargs):
    if created:
        create_tournament_game(instance)
        create_tournament_game(instance)
        create_tournament_game(instance)


@receiver(pre_save, sender=Tournament)
def on_tournament_field_change(sender, instance, **kwargs):
    if instance.id is not None:  # Not created
        previous = sender.objects.get(id=instance.id)
        if previous.created_by != instance.created_by:  # field will be updated
            Game.objects.filter(tournament=instance).update(
                created_by=instance.created_by
            )


@receiver(pre_save, sender=Game)
def on_game_pre_save(sender, instance, **kwargs):
    id = instance.id
    if id is not None:  # Not created
        previous = Game.objects.get(id=id)
        game_start = previous.state != "running" and instance.state == "running"
        game_stop = previous.state == "running" and instance.state != "running"
        if game_start:  # field will be updated
            init_threadsafe_game_data(id)
            run_pong_thread(instance.serialize())
            print(">> GAME RUNNING : thread started")
        elif game_stop:  # field will be updated
            set_game_stopped(id)
            print(">> GAME STOP RUNNING : tell game thread to stop")

@receiver(post_save, sender=Game)
def on_game_post_save(sender, instance, created, **kwargs):
    stateUpdate(instance, "create" if created else "update", "game")
    [stateUpdate(p, "update", "user") for p in instance.players.all()]


@receiver(post_save, sender=User)
def save_player(sender, instance, **kwargs):
    instance.player.save()


# Notify other users through websocket anytime a player instance is updated
@receiver(post_save, sender=Player)
def player_saved_hook(sender, instance, created, **kwargs):
    stateUpdate(instance, "create" if created else "update", "user")
