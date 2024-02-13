from .models import Game
from .views import Update
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
    p1 = await get_player(game, 0)
    p2 = await get_player(game, 1)
    if p1:
        p1.lastGameId = game.id
    if p2:
        p2.lastGameId = game.id
    if p1_score > p2_score:
        game.winner = p1
    else:
        game.winner = p2
    loser = p1 if game.winner is p2 else p1
    game.paddle_hits = paddle_hits
    game.wall_hits = wall_hits
    game.state = "done"
    await game.asave()

    tournament = await sync_to_async(lambda: game.tournament)()

    if tournament is not None:
        if tournament.state == "round 1":
            await sync_to_async(tournament.players_r2.add)(game.winner)
            await sync_to_async(tournament.losers.add)(loser)

        elif tournament.state == "round 2":
            tournament.winner = game.winner
            await sync_to_async(tournament.losers.add)(loser)
            tournament.state = "done"
        await tournament.asave()
        Update(tournament=tournament, tournament_action="update")

    print(f">> GAME {id} set as done")
