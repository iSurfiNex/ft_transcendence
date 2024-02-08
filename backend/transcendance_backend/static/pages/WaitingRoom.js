import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'


class PongWaitingRoom extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    <meta name="csrf-token" content="{% csrf_token %}">
    <div class="available-space">
            <div class="nicknames-N">
                <button class="btn btn-startGame" @click="this.startGame()" hidden="{!this.canStart(game.creator_is_me,game.players.length,game.ia)}">{language.GoButton}</button>
                <a class="playerOne-N" href="/profile"> {game.p1.nickname} </a>
                <div class="VS-logo-N"> VS </div>
                <a class="playerTwo-N" href="/profile"> {game.p2.nickname} </a>
                <button class="btn btn-giveUp" @click="this.giveUp()">{language.ByeButton}</button>
            </div>

            <div class="profil-pics-N">
                <div class="gallery-N">
                    <img src="{game.p1.picture}" alt="player 1">
                    <img src="{game.p2.picture}" alt="player 2">
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

        .nicknames-N {
            position: absolute;
            width: 100%;
            height: 15%;
            top: 0%;
            overflow: hidden;
            color: white;
        }

        .btn-startGame {
            position: absolute;
            width: 13%;
            height: 50%;
            left: 0%;
            top: 30%;
            justify-content: center;
            align-items: center;
            display: flex;
            overflow: hidden;

            font-size: 2vw;
            background-color: rgba(42, 42, 42, 0.2);
            color: #00ff00;
            border: 1px solid #00ff00;
            transition: background-color 0.3s, color 0.3s;
            opacity: 0.6;
        }

        .btn-startGame:hover {
            background-color: #00ff00;
            color: #2a2a2a;
            opacity: 1;
        }

        .btn-giveUp {
            position: absolute;
            width: 13%;
            height: 50%;
            right: 0%;
            top: 30%;
            justify-content: center;
            align-items: center;
            display: flex;
            overflow: hidden;

            font-size: 2vw;
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






        .playerOne-N {
            position: absolute;
            width: 27%;
            height: 100%;
            left: 15%;
            justify-content: center;
            align-items: center;
            display: flex;

            font-size: 3vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .playerTwo-N {
            position: absolute;
            width: 27%;
            height: 100%;
            left: 57%;
            justify-content: center;
            align-items: center;
            display: flex;

            font-size: 3vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .VS-logo-N {
            position: absolute;
            height: 100%;
            width: 14%;
            left: 43%;
            justify-content: center;
            align-items: center;
            display: flex;

            font-size: 5vw;
            color: #00ff00;
            text-shadow:
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
        }

        .profil-pics-N {
            position: absolute;
            width: 100%;
            height: 85%;
            top: 15%;
            display: flex;
            justify-content: center;
        }

        .gallery-N {
            --z: 32px;
            --s: 360px;
            --g: 8px;

            display: grid;
            gap: var(--g);
            width: calc(2*var(--s) + var(--g));
            grid-auto-flow: column;
            height: 100%;
        }

        .gallery-N > img {
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
            //opacity: 1;
            filter: brightness(100%);
        }

        .gallery-N > img:hover {
            width: calc(var(--s)/2);
            //opacity: 1;
            filter: brightness(120%);
        }

        .gallery-N > img:first-child {
            place-self: center start;
            clip-path: polygon(calc(2*var(--z)) 0,100% 0,100% 100%,0 100%);
            --mask:
              conic-gradient(from -135deg at right,#0000,#000 1deg 89deg,#0000 90deg)
                50%/100% calc(2*var(--z)) repeat-y;
        }

        .gallery-N > img:last-child {
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

        .nicknames-N {
            position: absolute;
            width: 100%;
            height: 15%;
            top: 0%;
            overflow: hidden;
            color: white;
        }

        .btn-startGame {
            position: absolute;
            width: 13%;
            height: 50%;
            left: 0%;
            top: 30%;
            justify-content: center;
            align-items: center;
            display: flex;
            overflow: hidden;

            font-size: 2vw;
            background-color: rgba(42, 42, 42, 0.2);
            color: #00ff00;
            border: 1px solid #00ff00;
            transition: background-color 0.3s, color 0.3s;
            opacity: 0.6;
        }

        .btn-startGame:hover {
            background-color: #00ff00;
            color: #2a2a2a;
            opacity: 1;
        }

        .btn-giveUp {
            position: absolute;
            width: 13%;
            height: 50%;
            right: 0%;
            top: 30%;
            justify-content: center;
            align-items: center;
            display: flex;
            overflow: hidden;

            font-size: 2vw;
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






        .playerOne-N {
            position: absolute;
            width: 27%;
            height: 100%;
            left: 15%;
            justify-content: center;
            align-items: center;
            display: flex;

            font-size: 3vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .playerTwo-N {
            position: absolute;
            width: 27%;
            height: 100%;
            left: 57%;
            justify-content: center;
            align-items: center;
            display: flex;

            font-size: 3vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .VS-logo-N {
            position: absolute;
            height: 100%;
            width: 14%;
            left: 43%;
            justify-content: center;
            align-items: center;
            display: flex;

            font-size: 5vw;
            color: #00ff00;
            text-shadow:
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
        }

        .profil-pics-N {
            position: absolute;
            width: 100%;
            height: 85%;
            top: 15%;
            display: flex;
            justify-content: center;
        }

        .gallery-N {
            --z: 32px;
            --s: 360px;
            --g: 8px;

            display: grid;
            gap: var(--g);
            width: calc(2*var(--s) + var(--g));
            grid-auto-flow: column;
            height: 100%;
        }

        .gallery-N > img {
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
            //opacity: 1;
            filter: brightness(100%);
        }

        .gallery-N > img:hover {
            width: calc(var(--s)/2);
            //opacity: 1;
            filter: brightness(120%);
        }

        .gallery-N > img:first-child {
            place-self: center start;
            clip-path: polygon(calc(2*var(--z)) 0,100% 0,100% 100%,0 100%);
            --mask:
              conic-gradient(from -135deg at right,#0000,#000 1deg 89deg,#0000 90deg)
                50%/100% calc(2*var(--z)) repeat-y;
        }

        .gallery-N > img:last-child {
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

        .nicknames-N {
            position: absolute;
            width: 100%;
            height: 20%;
            top: 0%;
            overflow: hidden;
            color: white;
        }

        .btn-startGame {
            position: absolute;
            width: 8%;
            height: 50%;
            left: 1%;
            top: 10%;
            justify-content: center;
            align-items: center;
            display: flex;
            white-space: nowrap;
            overflow: hidden;

            font-size: 1vw;
            background-color: rgba(42, 42, 42, 0.2);
            color: #00ff00;
            border: 1px solid #00ff00;
            transition: background-color 0.3s, color 0.3s;
            opacity: 0.6;
        }

        .btn-startGame:hover {
            background-color: #00ff00;
            color: #2a2a2a;
            opacity: 1;
        }

        .btn-giveUp {
            position: absolute;
            width: 8%;
            height: 50%;
            right: 1%;
            top: 10%;
            justify-content: center;
            align-items: center;
            display: flex;
            white-space: nowrap;
            overflow: hidden;

            font-size: 0.8vw;
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




        .playerOne-N {
            position: absolute;
            width: 30%;
            height: 100%;
            left: 12%;
            text-align: center;
            line-height: 2;
            //transform: translateY(10px);

            font-size: 2.5vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .playerTwo-N {
            position: absolute;
            width: 30%;
            height: 100%;
            left: 58%;
            text-align: left;
            line-height: 2;
            //transform: translateY(10px);

            font-size: 2.5vw;
            color: white;
            text-shadow:
                2px 2px 3px #ff6600,
                4px 4px 6px #cc3300,
                6px 6px 9px #993300;
        }

        .VS-logo-N {
            position: absolute;
            height: 100%;
            width: 10%;
            left: 45%;
            text-align: center;
            line-height: 2;

            font-size: 3vw;
            color: #00ff00;
            text-shadow:
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
        }

        .profil-pics-N {
            position: absolute;
            width: 100%;
            height: 80%;
            top: 20%;
            display: flex;
            justify-content: center;
        }

        .gallery-N {
            --z: 32px;
            --s: 440px;
            --g: 8px;

            display: grid;
            gap: var(--g);
            width: calc(2*var(--s) + var(--g));
            grid-auto-flow: column;
            height: 100%;
        }

        .gallery-N > img {
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

        .gallery-N > img:hover {
            width: calc(var(--s)/2);
            filter: brightness(120%);
        }

        .gallery-N > img:first-child {
            place-self: center start;
            clip-path: polygon(calc(2*var(--z)) 0,100% 0,100% 100%,0 100%);
            --mask:
              conic-gradient(from -135deg at right,#0000,#000 1deg 89deg,#0000 90deg)
                50%/100% calc(2*var(--z)) repeat-y;
        }

        .gallery-N > img:last-child {
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
        //if (state.currentTournament != -1)
        //    url = "/api/manage-tournament/" + state.currentTournament + "/";

        var dataToSend = {
            action: 'leave',
        }

        put2(url, dataToSend)
        .then (data => {
            //state.profile.current_game_id = -1
            //state.currentGame = -1
            navigateTo('/');
        })
        .catch(error => console.error(error));
    }

    canStart(creatorIsMe,playersCount,ia) {
       return creatorIsMe && (ia || playersCount === 2)
    }

}

register(PongWaitingRoom)
