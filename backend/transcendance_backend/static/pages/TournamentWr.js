import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class TournamentWr extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    <div class="available-space">
	    <div class="top-bar">
            <div class="title-waitingRoom-T">{language.WaitingRoom}</div>
            <div class="player-count">{tournament.players.length}/{tournament.expectedPlayers}</div>
        </div>
        <div class="buttons">
            <button class="btn btn-startGame" @click="this.startTournament()" hidden="{this.isTournamentCreator()}">{language.GoButton}</button>
            <button class="btn btn-giveUp" @click="this.giveUp()">{language.ByeButton}</button>
        </div>
        <div class="tournament-room" repeat="tournaments" as="tournament">
            <div class="player-list-T" hidden="{this.IsCurrentTournament(tournament.id)}">
                <div class="player-T" repeat="tournament.players" as="player">
                    <a class="profil-T" href="javascript:void(0)" @click="this.navigate(player)">
                        <img src="{this.getPlayerPic(player)}">
                        <div class="profil-nick-T">{player}</div>
                    </a>
                </div>
            </div>
        </div>
    </div>
`
        //<script>document.addEventListener("DOMContentLoaded", this.startRound2())</script>

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
            display: flex;
            flex-direction: column;
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
            display: flex;
            flex-direction: column;
        }
    }

	@media only screen and (min-width: 769px) and (min-height: 525px) {
        .available-space {
            position: absolute;
            right: 0;
            bottom: 0;
            width: calc(75% - 10px);
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
            font-family: 'Press Start 2P', sans-serif;
            display: flex;
            flex-direction: column;
        }
    }

    .top-bar {
        display: flex;
        padding: 30px 30px;
        background-color: rgb(112, 112, 112);
        justify-content: space-around;
        flex-direction: column;
        align-items: center;
    }

    .title-waitingRoom-T {
        display: flex;
        justify-content: center;
        padding: 1vw;
        overflow: hidden;
        white-space: nowrap;
        font-size: 2vw;
        color: white;
        text-shadow:
            2px 2px 3px #595959,
            4px 4px 6px #595959,
            6px 6px 9px #595959;
    }

    .player-count {
        display: flex;
        line-height: 2.5;
        font-size: 1.8vw;
        color: #ff8000;
        text-shadow:
            2px 2px 3px #ff6600,
            4px 4px 6px #cc3300,
            6px 6px 9px #993300;
        text-decoration-line: underline;
    }

    .buttons {
        display: flex;
        padding: 30px 30px;
        justify-content: space-around;
        flex-direction: row;
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

    .tournament-room {
        display: flex;
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;
    }

    .player-list-T {
        display: flex;
        overflow-y: auto;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .player-T {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .profil-T {
        position: relative;
        width: 100%;
        height: 100%;
        border-top: 8px solid white;
    }

    .profil-T:last-child {
        border-bottom: 8px solid white;
    }

    .profil-T img {
        position: absolute;
        width: 100%;
        height: auto;
        max-height: 100%;
        object-fit: cover;
        object-position: center +10%;
        opacity: 1;
    }

    .profil-T:hover {
        height: 450%;
        transition: all 1s ease;
    }

    .profil-T:not(hover) {
        height: 100%;
        transition: all 1s ease;
    }

    .profil-nick-T {
        position: absolute;
        display: flex;
        justify-content: center;
        margin-top: 15px;

        width: 100%;
        font-size: 1.2vw;
        color: white;
        text-shadow:
            2px 2px 3px #595959,
            4px 4px 6px #595959,
            6px 6px 9px #595959;
        text-align: center;
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

    connectedCallback() {
        var tournament = state.tournaments.find(tournament => tournament.id == state.currentTournament)
        let url = "/api/manage-tournament/" + state.currentTournament + "/";

        if (tournament)
        {
            if (tournament.status == "round 1")
            {
                if (tournament.players_r2.length == 2)
                {
                    var dataToSend = {
                        action: "start-round",
                    };
                    put2(url, dataToSend).catch(error => console.log(error));
                }
            }
        }
    }

    StartRound2() {
        let tournament = state.tournaments.find(tournament => tournament.id == state.currentTournament)

        if (tournament.status == "waiting")
            return ;

        if (tournament.players.lenght == 2)
        {
            //start round 2
        }
        else
            setInterval(checkPlayersSize, 1000);
    }

    IsCurrentTournament(tournamentId) {
        return !(tournamentId == state.currentTournament);
    }

    isTournamentCreator() {
        if (state.currentTournament == -1 )
            return !(false);

        let tournament = state.tournaments.find(tournament => tournament.id == state.currentTournament)
        if (state.profile.nickname == tournament.creator && tournament.status == "waiting")
            return !(true);
        return !(false);
    }

    getPlayerPic(nickname) {
        const user = state.users.find(elem => elem.nickname === nickname);

        if (user) {
            return user.picture;
        }

        else {
            return '/media/avatars/default.jpg';
        }
    }

    giveUp() {
        let url = "/api/manage-tournament/" + state.currentTournament + "/";

        let dataToSend = {
            action: 'leave',
        }

        put2(url, dataToSend)
        .catch(error => console.error(error));
    }

    startTournament() {
        const nb_players = state.tournament.players.length;
        const url = "/api/manage-tournament/" + state.currentTournament + "/";

        if (nb_players != 4)
        {
            console.error("not enought players");
            return ;
        }

        const dataToPut = {
            action: "start-round",
        }

        put2(url, dataToPut).catch(error => console.error(error));
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

register(TournamentWr)
