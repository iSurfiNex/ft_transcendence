import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class TournamentRunningWr extends Component {
	static sheets = [bootstrapSheet]
    static template = html`
    <meta name="csrf-token" content="{% csrf_token %}">
    <div class="available-space">
        <div class="rectangle-waitingRoom-T" hidden="{this.IsTournament()}">
            <div class="title-waitingRoom-T">{language.WaitingRoom}</div>

            <div class="tournament-list" repeat="tournaments" as="tournament">
                <div hidden="{this.IsCurrentTournament(tournament.id)}">
                    <div class="match" repeat="tournament.gamesId" as="matchId">
                        <div class="match-info">
                            <div class="player-1">
                                <img src="{this.playerOnePic(matchId)}">
                                <a href="javascript:void(0)" @click="this.navigate({this.getPlayerOne(matchId)})">{this.getPlayerOne(matchId)}</a>
                            </div>
                            <div class="VS-logo"> VS </div>
                            <div class="player-2">
                                <img src="{this.playerTwoPic(matchId)}">
                                <a href="javascript:void(0)" @click="this.navigate({this.getPlayerTwo(matchId)})">{this.getPlayerTwo(matchId)}</a>
                            </div>
                        </div>
                    </div>
                </div>
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

        .tournament-list {
            position: absolute;
            width: 100%;
            height: 65%;
            top: 35%;
        }

        .match {
            position: absolute;
            height: 100%;
            width: 100%;
            overflow: scroll;
        }

        .match-info {
            position: relative;
            height: 30%;
            width: 100%;
            word-spacing: 30px;
            overflow: auto;
            justify-content: center;
            margin-bottom: 1%;
            transition: opacity 0.9s;
            transition: width 1s, height 1s;
        }


        .player-1 {
            position: absolute;
            left: 0%;
            width: 40%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            font-size: 5vh;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .player-1 img {
            width: 100%;
            height: auto;
            max-height: 100%;
            object-fit: cover;
            object-position: center +10%;
            opacity: 0.5;
            transition: opacity 0.3s;
        }

        .player-1 img:hover {
            opacity: 1;
            transition: opacity 0.3s;
        }

        .player-1 a {
            position: absolute;
        }

        .player-2 {
            position: absolute;
            left: 60%;
            width: 40%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            font-family: 'Courier New', monospace;
            font-size: 5vh;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .player-2 img {
            width: 100%;
            height: auto;
            max-height: 100%;
            object-fit: cover;
            object-position: center +10%;
            opacity: 0.5;
            transition: opacity 0.3s;
        }

        .player-2 img:hover {
            opacity: 1;
            transition: opacity 0.3s;
        }

        .player-2 a {
            position: absolute;
        }

        .VS-logo {
            position: absolute;
            height: 100%;
            width: 20%;
            left: 40%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: font-size 0.3s;

            font-family: 'Courier New', monospace;
            font-size: 5vh;
            color: #00ff00;
            text-shadow:
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
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

        .tournament-list {
            position: absolute;
            width: 100%;
            height: 65%;
            top: 35%;
        }

        .match {
            position: absolute;
            height: 100%;
            width: 100%;
            overflow: scroll;
        }

        .match-info {
            position: relative;
            height: 30%;
            width: 100%;
            word-spacing: 30px;
            overflow: auto;
            justify-content: center;
            margin-bottom: 1%;
            transition: opacity 0.9s;
            transition: width 1s, height 1s;
        }


        .player-1 {
            position: absolute;
            left: 0%;
            width: 40%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            font-size: 5vh;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .player-1 img {
            width: 100%;
            height: auto;
            max-height: 100%;
            object-fit: cover;
            object-position: center +10%;
            opacity: 0.5;
            transition: opacity 0.3s;
        }

        .player-1 img:hover {
            opacity: 1;
            transition: opacity 0.3s;
        }

        .player-1 a {
            position: absolute;
        }

        .player-2 {
            position: absolute;
            left: 60%;
            width: 40%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            font-family: 'Courier New', monospace;
            font-size: 5vh;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .player-2 img {
            width: 100%;
            height: auto;
            max-height: 100%;
            object-fit: cover;
            object-position: center +10%;
            opacity: 0.5;
            transition: opacity 0.3s;
        }

        .player-2 img:hover {
            opacity: 1;
            transition: opacity 0.3s;
        }

        .player-2 a {
            position: absolute;
        }

        .VS-logo {
            position: absolute;
            height: 100%;
            width: 20%;
            left: 40%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: font-size 0.3s;

            font-family: 'Courier New', monospace;
            font-size: 5vh;
            color: #00ff00;
            text-shadow:
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
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

        .tournament-list {
            position: absolute;
            width: 100%;
            height: 65%;
            top: 35%;
        }

        .match {
            position: absolute;
            height: 100%;
            width: 100%;
            overflow: scroll;
        }

        .match-info {
            position: relative;
            height: 30%;
            width: 100%;
            word-spacing: 30px;
            overflow: auto;
            justify-content: center;
            margin-bottom: 1%;
            transition: opacity 0.9s;
            transition: width 1s, height 1s;
        }

        .match-info:hover {
            height: 100%;
            top: 0%;
            transition: opacity 0.3s;
            transition: width 1s, height 1s;
        }

        .match-info:hover .VS-logo {
            font-size: 8vh;
            transition: font-size 0.3s;
        }

        .player-1 {
            position: absolute;
            left: 0%;
            width: 40%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            font-size: 1vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .player-1 img {
            width: 100%;
            height: auto;
            max-height: 100%;
            object-fit: cover;
            object-position: center +10%;
        }

        .player-1 a {
            position: absolute;
        }

        .player-2 {
            position: absolute;
            left: 60%;
            width: 40%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            font-size: 1vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .player-2 img {
            width: 100%;
            height: auto;
            max-height: 100%;
            object-fit: cover;
            object-position: center +10%;
        }

        .player-2 a {
            position: absolute;
        }

        .VS-logo {
            position: absolute;
            height: 100%;
            width: 20%;
            left: 40%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: font-size 0.3s;

            font-size: 5vh;
            color: #00ff00;
            text-shadow:
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
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
    }
    `

    IsTournament() {
        if (state.currentTournament == -1)
            return !(false);
        return !(true);
    }

    IsCurrentTournament(tournamentId) {
        return !(tournamentId == state.currentTournament);
    }

    playerOnePic() {
        const game = state.games.find(game => game.id == state.currentGame);

        if (!game || game.players.length < 1 || state.currentGame == -1)
            return ("/static/img/list.svg");

        const playerNick = game.players[0];
        const user = state.users.find(elem => elem.nickname === playerNick);

        if (user)
            return '/static/' + user.picture;

        return '/static/img/list.svg';
    }

    playerTwoPic() {
        const game = state.games.find(game => game.id == state.currentGame);

        if (!game || game.players.length < 2 || state.currentGame == -1)
            return ("/static/img/list.svg");

        const playerNick = game.players[1];
        const user = state.users.find(elem => elem.nickname === playerNick);

        if (user)
            return '/static/' + user.picture;

        return '/static/img/list.svg';
    }

    getPlayerOne() {
        const game = state.games.find(game => game.id == state.currentGame);

        if (!game || game.players.lenght < 1)
            return ("Unknown");

        const playerOne = game.players[0];

        if (!playerOne)
            return ("Unknown");

        return (playerOne);
    }

    getPlayerTwo()
    {
        var game = state.games.find(game => game.id == state.currentGame);

        if (!game || game.players.length < 2)
            return ("Unknown");

        var playerTwo = game.players[1];

        if (!playerTwo)
            return ("Unknown");

        return (playerTwo);
    }

    navigate(nickname) {
		const user = state.users.find(user => user.nickname === nickname);

		state.profileLooking = user.id
		navigateTo('/profile');
		return false;
	}
}
register (TournamentRunningWr)
