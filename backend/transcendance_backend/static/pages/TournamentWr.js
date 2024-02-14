import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class TournamentWr extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    <div class="available-space">
	    <div class="top-bar">
            <div class="title-waitingRoom-T">{language.WaitingRoom}</div>
            <div class="player-count">{tournament.playersCount}/{tournament.expectedPlayers}</div>
        </div>
        <div class="buttons">
            <button hidden="{tournament.imReady}" class="btn btn-startGame" @click="this.ready()">{language.ReadyButton}</button>
            <button hidden="{this.cantGiveup(tournament.imReady, tournament.status)}" class="btn btn-giveUp" @click="this.giveUp()">{language.ByeButton}</button>
            <div hidden="{!tournament.imReady}">{language.waitingOther}</div>
        </div>
        <div class="tournament-room" repeat="tournaments" as="tournament">
            <div class="player-list-T" hidden="{this.IsCurrentTournament(tournament.id)}">
                <div class="player-T" repeat="tournament.players" as="player">
                    <a class="profil-T" href="javascript:void(0)" @click="this.navigate(player)">
                        <div class="player-text player-ready" hidden="{!this.isPlayerReady(player, tournament.readyPlayersId, users)}">READY</div>
                        <div class="player-text player-out" hidden="{!this.isPlayerOut(player, tournament.players_r2, users, tournament.status)}">OUT</div>
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
    :host {
        font-family: 'Press Start 2P', sans-serif;
    }

    .player-text {
        color: green;
        position: absolute;
        bottom: 20px;
        right: 20px;
        background: none;
        z-index: 1;
    }

    .player-ready {
        color: green;
    }

    .player-out {
        color: red;
    }

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
    }

    IsCurrentTournament(tournamentId) {
        return !(tournamentId == state.currentTournament);
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

    ready() {
        const nb_players = state.tournament.players.length;
        const url = "/api/manage-tournament/" + state.currentTournament + "/";

        const dataToPut = {
            action: "ready",
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

    isPlayerReady(nickname, readyPlayers, users) {
        const u = users.find(u => u.nickname === nickname)
        return u && readyPlayers.some(id => id === u.id)
    }

    isPlayerOut(nickname, players_r2_nicknames, users, tournament_status) {
        if (tournament_status != 'round 1')
            return false
        const u = users.find(u => u.nickname === nickname)
        return u && !players_r2_nicknames.some(nickname => nickname === u.nickname)
    }

    cantGiveup(imReady, status) {
       return imReady || status !== "waiting" // no given for last round, avoids problems, make things simpler
    }
}

register(TournamentWr)
