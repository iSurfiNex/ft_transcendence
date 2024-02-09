import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class TournamentWr extends Component {
	static sheets = [bootstrapSheet]
	static template = html`

    <div class="available-space">
        <div class="rectangle-waitingRoom-T">
            <div class="title-waitingRoom-T">{language.WaitingRoom}</div>

            <div class="player-count">
                <button class="btn btn-startGame" @click="this.startTournament()" hidden="{this.isTournamentCreator()}">START</button>
                {tournament.players.length}/{tournament.expectedPlayers}
                <button class="btn btn-giveUp" @click="this.giveUp()">GIVE UP</button>
            </div>

            <div class="tournament-room" repeat="tournaments" as="tournament">
                <div class="player-list-T" hidden="{this.IsCurrentTournament(tournament.id)}">
                    <div class="player-T" repeat="tournament.players" as="player">
                        <a href="javascript:void(0)" @click="this.navigate(player.nickname)" class="profil-T">
                            <img src="{this.getPlayerPic(player)}">
                            <div class="profil-nick-T"> {player} </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <script>document.addEventListener("DOMContentLoaded", this.startRound2())</script>
    </div>
    `

    static css = css`
	@media only screen and (max-width: 768px) {
        .available-space {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
            font-family: 'Press Start 2P', sans-serif;

        }

        .rectangle-waitingRoom-T {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0%;
            background-color: rgba(200, 200, 200, 0.1);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            backdrop-filter: blur(1px);
            align-items: center;
            white-space: nowrap;
            font-family: 'Press Start 2P', sans-serif;
        }

        .title-waitingRoom-T {
            position: absolute;
            width: 100%;
            height: 15%;
            left: 0%;
            right: 15%;
            top: 0%;
            overflow: hidden;

            font-size: 8vw;
        	color: white;
        	text-shadow:
        	    2px 2px 3px #ff6600,
        	    4px 4px 6px #cc3300,
        	    6px 6px 9px #993300;
        	text-align: center;
        }

        .player-count {
            position: absolute;
            width: 100%;
            height: 10%;
            top: 15%;
            text-align: center;
            line-height: 2.5;

            font-size: 3vh;
            color: white;
        }

        .tournament-room {
            position: absolute;
            top: 30%;
            width: 100%;
            height: 70%;
            left: 0%;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .player-list-T{
            position: absolute;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        .btn-startGame {
            position: absolute;
            left: 2%;
            top: 15%;
            width: 20%;
            height: 70%;
            justify-content: center;
            align-items: center;
            display: flex;

            font-size: 3vw;
            background-color: rgba(42, 42, 42, 0.2);
            color: #00ff00;
            border: 1px solid #00c7d6;
            transition: background-color 0.3s, color 0.3s;
            opacity: 1;
            backdrop-filter: blur(1px);
        }

        .btn-startGame:hover {
            background-color: #00ff00;
            color: #2a2a2a;
            opacity: 1;
        }

        .player-T {
            position: relative;
            flex-direction: column;
            width: 50%;
            left: 25%;
            height: 20%;
        }

        .profil-T {
            position: relative;
            flex-direction: column;
            left: 0%;
            width: 100%;
            height: 100%;
            margin-bottom: 5%;
        }

        .profil-T img {
            position: absolute;
            width: 100%;
            height: auto;
            max-height: 100%;
            object-fit: cover;
            object-position: center +10%;
            opacity: 0.7;
            transition: opacity 0.3s;
        }

        .profil-nick-T {
            position: absolute;
            width: 50%;
            height: 50%;
            top: 40%;
            left: 20%;

            font-size: 4vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
            text-align: center;
        }
    }

    @media only screen and (max-height: 524px) {
        .available-space {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
            font-family: 'Press Start 2P', sans-serif;

        }

        .rectangle-waitingRoom-T {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0%;
            background-color: rgba(200, 200, 200, 0.1);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            backdrop-filter: blur(1px);
            align-items: center;
            white-space: nowrap;
            font-family: 'Press Start 2P', sans-serif;
        }

        .title-waitingRoom-T {
            position: absolute;
            width: 100%;
            height: 15%;
            left: 0%;
            right: 15%;
            top: 0%;
            overflow: hidden;

            font-size: 8vw;
        	color: white;
        	text-shadow:
        	    2px 2px 3px #ff6600,
        	    4px 4px 6px #cc3300,
        	    6px 6px 9px #993300;
        	text-align: center;
        }

        .player-count {
            position: absolute;
            width: 100%;
            height: 10%;
            top: 15%;
            text-align: center;
            line-height: 2.5;

            font-size: 3vh;
            color: white;
        }

        .tournament-room {
            position: absolute;
            top: 30%;
            width: 100%;
            height: 70%;
            left: 0%;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .player-list-T{
            position: absolute;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        .btn-startGame {
            position: absolute;
            left: 2%;
            top: 15%;
            width: 20%;
            height: 70%;
            justify-content: center;
            align-items: center;
            display: flex;

            font-size: 3vw;
            background-color: rgba(42, 42, 42, 0.2);
            color: #00ff00;
            border: 1px solid #00c7d6;
            transition: background-color 0.3s, color 0.3s;
            opacity: 1;
            backdrop-filter: blur(1px);
        }

        .btn-startGame:hover {
            background-color: #00ff00;
            color: #2a2a2a;
            opacity: 1;
        }

        .player-T {
            position: relative;
            flex-direction: column;
            width: 50%;
            left: 25%;
            height: 20%;
        }

        .profil-T {
            position: relative;
            flex-direction: column;
            left: 0%;
            width: 100%;
            height: 100%;
            margin-bottom: 5%;
        }

        .profil-T img {
            position: absolute;
            width: 100%;
            height: auto;
            max-height: 100%;
            object-fit: cover;
            object-position: center +10%;
            opacity: 0.7;
            transition: opacity 0.3s;
        }

        .profil-nick-T {
            position: absolute;
            width: 50%;
            height: 50%;
            top: 40%;
            left: 20%;

            font-size: 4vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
            text-align: center;
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
        }

        .rectangle-waitingRoom-T {
            position: absolute;
            bottom: 0;
            width: 50%;
            height: 90%;
            left: 25%;
            background-color: rgb(86, 86, 86);
            backdrop-filter: blur(1px);
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-family: 'Press Start 2P', sans-serif;
        }

        .title-waitingRoom-T {
            position: absolute;
            width: 100%;
            height: 15%;
            left: 0%;
            right: 15%;
            top: 0%;
            overflow: hidden;
            white-space: nowrap;
            background-color: rgb(112, 112, 112);
            font-size: 2.5vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
            text-align: center;
        }

        .player-count {
            position: absolute;
            width: 100%;
            height: 10%;
            top: 15%;
            text-align: center;
            line-height: 2.5;

            font-size: 1.3vw;
            color: #00ff00;
            text-shadow:
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
        }

        .tournament-room {
            position: absolute;
            top: 30%;
            width: 100%;
            height: 70%;
            left: 0%;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .player-list-T{
            position: absolute;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        .btn-startGame {
            position: absolute;
            left: 2%;
            bottom: 0;
            width: 20%;
            height: 70%;
            justify-content: center;
            align-items: center;
            display: flex;

            font-size: 1vw;
            background-color: rgba(42, 42, 42, 0.2);
            color: #00ff00;
            border: 1px solid #00c7d6;
            transition: background-color 0.3s, color 0.3s;
            opacity: 0.6;
            backdrop-filter: blur(1px);
        }

        .btn-startGame:hover {
            background-color: #00ff00;
            color: #2a2a2a;
            opacity: 1;
        }

        .btn-giveUp {
            position: absolute;
            width: 20%;
            height: 70%;
            right: 2%;
            bottom: 0;
            justify-content: center;
            align-items: center;
            display: flex;
            overflow: hidden;

            font-size: 1vw;
            background-color: rgba(42, 42, 42, 0.2);
            color: #ff0000;
            border: 1px solid #ff0000;
            transition: background-color 0.3s, color 0.3s;
            opacity: 0.6;
        }

        .btn-giveUp:hover {
            background-color: #ff0000;
            color: #2a2a2a;
            opacity: 1;
        }

        .player-T {
            position: relative;
            flex-direction: column;
            width: 100%;
            left: 0;
            height: 20%;
        }

        .profil-T {
            position: relative;
            flex-direction: column;
            left: 0%;
            width: 100%;
            height: 100%;
            margin-bottom: 5%;
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

        .profil-nick-T {
            position: absolute;
            width: 50%;
            height: 50%;
            top: 25%;
            left: 25%;

            font-size: 1.2vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
            text-align: center;
        }
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
            action: "start-1st-round",
        }

        put2(url, dataToPut).catch(error => console.error(error));
        //GERER LA REDIRECTION
    }

    navigate(nickname) {
		const user = state.users.find(user => user.nickname === nickname);

		state.profileLooking = user.id
		navigateTo('/profile');
		return false;
	}
}

register(TournamentWr)
