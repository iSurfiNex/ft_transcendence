from .models import Game
from asgiref.sync import sync_to_async

@sync_to_async
def get_player(game, i):
    try:
        return game.players.all()[i]
    except: # against IA player might not exist
        return None

async def set_game_done(id, p1_score, p2_score, paddle_hits, wall_hits):
    game = await Game.objects.aget(id=id)
    if game is None:
        print(">> GAME NOT FOUND: can't stop it")
        return
    game.state = 'done'
    game.p1_score = p1_score
    game.p2_score = p2_score
    if p1_score > p2_score:
        game.winner = await get_player(game, 0)
    else:
        game.winner = await get_player(game, 1)
    game.paddle_hits = paddle_hits
    game.wall_hits = wall_hits
    game.state = "done"
    await game.asave()

    print(f">> GAME {id} set as done")
