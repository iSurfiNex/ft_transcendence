from .models import Game

async def set_game_done(id):
    game = await Game.objects.aget(id=id)
    if game is None:
        print(">> GAME NOT FOUND: can't stop it")
        return
    game.state = 'done'
    await game.asave()

    print(">> GAME set as done")
