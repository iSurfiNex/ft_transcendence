import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'


class PongWaitingRoom extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    <meta name="csrf-token" content="{% csrf_token %}">
    <div class="available-space">
            <div class="nicknames">
				<div class="start-game-div">
                    <button class="btn btn-startGame" @click="this.startGame()" hidden="{!this.canStart(game.creator_is_me,game.players.length,game.ia)}">{language.GoButton}</button>
				</div>
				<div class="player-vs">
					<div class="player-div-one">
                        <a class="playerOne" href="javascript:void(0)" @click="this.navigate(game.p1.nickname)">{game.p1.nickname}</a>
					</div>
                    <div class="VS-logo">VS</div>
					<div class="player-div-two">
                        <a class="playerTwo" href="javascript:void(0)" @click="this.navigate(game.p2.nickname)">{this.getPTwoName(game)}</a>
                    </div>
                </div>
                <div class="giveup-game-div">
                    <button class="btn btn-giveUp" @click="this.giveUp()">{language.ByeButton}</button>
                </div>
            </div>

            <div class="profil-pics">
                <div class="gallery">
                    <img src="{game.p1.picture}" alt="player 1" @click="this.navigate(game.p1.nickname)">
                    <img src="{this.getPTwoPic(game)}" alt="player 2" @click="this.navigate(game.p2.nickname)">
                </div>
            </div>
    </div>
    `

    static css = css`
    @media only screen and (max-width: 768px) {
        .available-space {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: calc(90% - 6px);
            background-color: rgba(255, 255, 255, 0.5);
            font-family: 'Press Start 2P', sans-serif;
        }
    }

    @media only screen and (max-height: 524px) {
        .available-space {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: calc(90% - 6px);
            background-color: rgba(255, 255, 255, 0.5);
            font-family: 'Press Start 2P', sans-serif;
        }
    }

	@media only screen and (min-width: 769px) and (min-height: 525px){
        .available-space {
            position: absolute;
            right: 0;
            bottom: 0;
            width: calc(75% - 10px);
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
            font-family: 'Press Start 2P', sans-serif;
        }
    }

    .nicknames {
        display: flex;
        width: 100%;
        height: 20%;
        overflow: hidden;
        color: white;
        align-items: center;
    }

    .player-vs {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .player-div-one {
        display: flex;
        justify-content: flex-end;
        overflow: hidden;
        padding: 5px;
        width: 50%;
    }

    .player-div-two {
        display: flex;
        justify-content: flex-start;
        overflow: hidden;
        padding: 5px;
        width: 50%;
    }

    .VS-logo {
        margin: 20px;
        line-height: 2;
        font-size: 2.5vw;
        color: #ff8000;
        text-shadow:
            2px 2px 3px #ff6600,
            4px 4px 6px #cc3300,
            6px 6px 9px #993300;
    }

    .playerOne {
        text-align: center;
        line-height: 2;
        font-size: 2vw;
        color: white;
        text-shadow:
            2px 2px 3px #595959,
            4px 4px 6px #595959,
            6px 6px 9px #595959;
    }

    .playerTwo {
        text-align: left;
        line-height: 2;
        font-size: 2vw;
        color: white;
        text-shadow:
            2px 2px 3px #595959,
            4px 4px 6px #595959,
            6px 6px 9px #595959;
    }

    .start-game-div {
        width: 15%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .giveup-game-div {
        width: 15%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .btn-startGame {
        padding: 20px 12px;
        justify-content: center;
        align-items: center;
        display: flex;
        white-space: nowrap;
        overflow: hidden;

        font-size: 1vw;
        background-color: rgba(42, 42, 42, 0.2);
        color: #00ff00;
        border: 2px solid #00ff00;
        border-radius: 10px;
        transition: background-color 0.3s, color 0.3s;
        opacity: 0.6;
        font-family: 'Press Start 2P', sans-serif;
    }

    .btn-startGame:hover {
        background-color: #00ff00;
        color: #2a2a2a;
        opacity: 1;
    }

    .btn-giveUp {
        padding: 20px 12px;
        justify-content: center;
        align-items: center;
        display: flex;
        white-space: nowrap;
        overflow: hidden;

        font-size: 1vw;
        background-color: rgba(42, 42, 42, 0.2);
        color: #ff0000;
        border: 2px solid #ff0000;
        border-radius: 10px;
        transition: background-color 0.3s, color 0.3s;
        opacity: 0.6;
        font-family: 'Press Start 2P', sans-serif;
    }

    .btn-giveUp:hover {
        background-color: #ff0000;
        color: #2a2a2a;
        opacity: 1;
    }

    .profil-pics {
        position: absolute;
        width: 100%;
        height: 80%;
        top: 20%;
        display: flex;
        justify-content: center;
    }

    .gallery {
        --z: 32px;
        --s: 440px;
        --g: 8px;

        display: grid;
        gap: var(--g);
        width: calc(2*var(--s) + var(--g));
        grid-auto-flow: column;
        height: 100%;
    }

    .gallery > img {
        width: 0;
        min-width: calc(100% + var(--z)/2);
        height: var(--s);
        object-fit: cover;
        object-position: center top;
        -webkit-mask: var(--mask);
                mask: var(--mask);
        cursor: pointer;
        transition: .5s;
        height: 100%;
        filter: brightness(100%);
    }

    .gallery > img:hover {
        width: calc(var(--s)/2);
        filter: brightness(100%);
    }

    .gallery > img:not(:hover) {
        filter: brightness(70%);
    }

    .gallery > img:first-child {
        place-self: center start;
        clip-path: polygon(calc(2*var(--z)) 0,100% 0,100% 100%,0 100%);
        --mask:
            conic-gradient(from -135deg at right,#0000,#000 1deg 89deg,#0000 90deg)
            50%/100% calc(2*var(--z)) repeat-y;
    }

    .gallery > img:last-child {
        place-self: center end;
        clip-path: polygon(0 0,100% 0,calc(100% - 2*var(--z)) 100%,0 100%);
        --mask:
            conic-gradient(from   45deg at left ,#0000,#000 1deg 89deg,#0000 90deg)
            50% calc(50% - var(--z))/100% calc(2*var(--z)) repeat-y;
    }

    a {
        color: inherit;
        text-decoration: none;
        display: block;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    ::-webkit-scrollbar-thumb {
        display: none;
    }

    ::-webkit-scrollbar-thumb:hover {
        display: none;
    }
    `

    startTournament() {
        const tournament = state.tournaments.find(tournament => tournament.id == state.currentTournament);
        const url = "/api/manage-tournament/" + state.currentTournament + "/";

        if (tournament.players.length != 4)
        {
            console.error("not enought players");
            return ;
        }

        const dataToSend = {
            action: "start-tournament",
        }

        put2(url, dataToSend)
        .then (data => {
            //navigateTo(LA-PAGE-DU-JEU)
        })
        .catch(error => {console.error(error)})
    }

    startGame() {
        const game = state.games.find(game => game.id == state.currentGame);
        const url = "/api/manage-game/" + state.currentGame + "/";

        if (!game.ia && game.players.length != 2)
        {
            console.error("not enought players");
            return ;
        }

        const dataToSend = {
            action: 'start-game'
        }

        put2(url, dataToSend)
        .then (data => {
            //navigateTo(LA-PAGE-DU-JEU)
        })
        .catch(error => {console.error(error)})
    }

    giveUp() {
        let url = "/api/manage-game/" + state.currentGame + "/";

        var dataToSend = {
            action: 'leave',
        }

        put2(url, dataToSend).catch(error => console.error(error));
        //NOTE after the request, state.currentGame will be updated by websocket and an observer on state.currentGame will redirect to the correct page
    }

    canStart(creatorIsMe,playersCount,ia) {
       return creatorIsMe && (ia || playersCount === 2)
    }

    getPTwoName(game) {
        if (game.ia)
            return 'AI';
        return game.p2?.nickname;
    }

    getPTwoPic(game) {
        if (game.ia)
            return '/media/avatars/bot.jpg';
        return game.p2?.picture;
    }

    navigate(nickname) {
		const user = state.users.find(user => user.nickname === nickname);

        if (!user)
            return ;

		state.profileLooking = user.id
		navigateTo('/profile');
		return false;
	}
}

register(PongWaitingRoom)
