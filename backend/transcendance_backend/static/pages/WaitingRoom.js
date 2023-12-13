import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

    
class WaitingRoom extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    <div class="available-space">
        <img class="background-img" src="/static/img/background-5.svg">
        

        <div hidden="{this.IsTournamentWaiting()}">
            <div class="rectangle-waitingRoom-T">
                <div class="title-waitingRoom-T"> Waiting Room </div>

                <div class="tournament-room" repeat="tournaments" as="tournament"> 
                    <div class="player-list-T" hidden="{this.IsCurrentTournament(tournament.id)}"> 
                        <div class="player-T" repeat="tournament.players" as="player">
                            <div class="profil-T">
                                <a href="/profile">
                                    <div class="profil-nick-T"> {player} </div>
                                    <img class="profil-pic-T" src="{this.getPlayerPic(player)}">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>    



        <div hidden="{this.IsTournamentRunning()}">
            <div class="rectangle-waitingRoom-T">

                <div class="title-waitingRoom-T"> Waiting Room </div>
                <div class="countdown-T" hidden="{this.hasCountdownStarted()}"> STARTING IN {this.getCountdown()} </div>

                <div class="tournament-list" repeat="tournaments" as="tournament">
                    <div hidden="{this.IsCurrentTournament(tournament.id)}">
                        <div class="match" repeat="tournament.gamesId" as="matchId"> 
                            <div class="match-info">
                                <div class="player-1">
                                        <img src="{this.playerOnePic(matchId)}">
                                        <a href="/profile">{this.getPlayerOne(matchId)}</a> 
                                </div>
                                <div class="VS-logo"> VS </div>
                                <div class="player-2">
                                        <img src="{this.playerTwoPic(matchId)}">
                                        <a href="/profile">{this.getPlayerTwo(matchId)}</a>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    



        <div hidden="{this.IsNormal()}">
            <div class="nicknames-N">
                <a class="playerOne-N" href="/profile"> {this.getPlayerOne(currentGame)} </a> 
                <div class="VS-logo-N"> VS </div> 
                <a class="playerTwo-N" href="/profile"> {this.getPlayerTwo(currentGame)} </a> 
            </div>

            <div class="profil-pics-N">
                <div class="gallery-N">
                    <img src="{this.playerOnePic(currentGame)}" alt="player 1">
                    <img src="{this.playerTwoPic(currentGame)}" alt="player 2">
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
            width: calc(75% - 10px);
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
        }

        .background-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(50%); 
        }

        .rectangle-waitingRoom-T {
            position: absolute;
            bottom: 10%;
            width: 50%;
            height: 80%;
            left: 25%;
            background-color: rgba(200, 200, 200, 0.1);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            backdrop-filter: blur(1px);
            display: flex;
            align-items: center;
        }

        .title-waitingRoom-T {
            position: absolute;
            width: 100%;
            height: 20%;
            left: 0%;
            right: 15%;
            top: 0%;
            overflow: hidden;
            
            font-family: 'Courier New', monospace;
            font-size: 8vh;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
            text-align: center;
        }

        .game-room-T {
            position: absolute;
            top: 20%;
            width: 50%;
            height: 80%;
            left: 25%;
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

        .player-T {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 15%;
        }

        .profil-T {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 100%;
            margin: 10%;
        }

        .profil-pic-T {
            position: absolute;
            left: 0%;
            height: 100%;
            width 25%;
        }

        .profil-nick-T {
            position: absolute;
            width: 40%;
            height: 50%;
            top: 25%;
            left: 35%;

            font-family: 'Courier New', monospace;
            font-size: 2.5vh;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
            text-align: center;
        }

        .nicknames-N {
            position: absolute;
            width: 100%;
            height: 10%;
            top: 0%;
        }

        .title-N {
            position: absolute;
            overflow: hidden;
            text-align: center;
            word-spacing: .8em;
            width: 100%;
            height: 100%;
            margin-left: 40px;
            margin-top: 20px;

            font-size: 8vh;
            font-family: 'Courier New', monospace;
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
            opacity: 0.6;
            filter: brightness(100%);
        }
          
        .gallery-N > img:hover {
            width: calc(var(--s)/2);
            opacity: 1;
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
            color: currentColor;
            text-decoration: none;
            display: inline-block;
        }
    }



    @media only screen and (max-height: 524px) {
        .available-space {
            position: absolute;
            right: 0;
            bottom: 0;
            width: calc(75% - 10px);
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
        }

        .background-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(50%); 
        }

        .rectangle-waitingRoom-T {
            position: absolute;
            bottom: 10%;
            width: 50%;
            height: 80%;
            left: 25%;
            background-color: rgba(200, 200, 200, 0.1);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            backdrop-filter: blur(1px);
            display: flex;
            align-items: center;
        }

        .title-waitingRoom-T {
            position: absolute;
            width: 100%;
            height: 20%;
            left: 0%;
            right: 15%;
            top: 0%;
            overflow: hidden;
            
            font-family: 'Courier New', monospace;
            font-size: 8vh;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
            text-align: center;
        }

        .tournament-room {
            position: absolute;
            top: 20%;
            width: 50%;
            height: 80%;
            left: 25%;
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

        .player-T {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 15%;
        }

        .profil-T {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 100%;
            margin: 10%;
        }

        .profil-pic-T {
            position: absolute;
            left: 0%;
            height: 100%;
            width 25%;
        }

        .profil-nick-T {
            position: absolute;
            width: 40%;
            height: 50%;
            top: 25%;
            left: 35%;

            font-family: 'Courier New', monospace;
            font-size: 2.5vh;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
            text-align: center;
        }





        .countdown-T {
            position: absolute;
            width: 100%;
            height: 7%;
            top: 20%;

            font-family: 'Courier New', monospace;
            font-size: 3vh;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
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

            font-family: 'Courier New', monospace;
            font-size: 5vh;
            color: #ff9900;
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
            color: #ff9900;
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





        .nicknames-N {
            position: absolute;
            width: 100%;
            height: 15%;
            top: 0%;
            overflow: hidden;
        }

        .playerOne-N {
            position: absolute;
            width: 45%;
            height: 100%;
            left: 0%;
            text-align: right;
            transform: translateY(10%);

            font-size: 7vh;
            font-family: 'Courier New', monospace;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
        }

        .playerTwo-N {
            position: absolute;
            width: 45%;
            height: 100%;
            left: 55%;
            text-align: left;
            transform: translateY(10%);

            font-size: 7vh;
            font-family: 'Courier New', monospace;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
        }

        .VS-logo-N {
            position: absolute;
            height: 100%;
            width: 10%;
            left: 45%;
            text-align: center;

            font-size: 9vh;
            font-family: 'Courier New', monospace;
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
            opacity: 0.6;
            filter: brightness(100%);
        }
          
        .gallery-N > img:hover {
            width: calc(var(--s)/2);
            opacity: 1;
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







	@media only screen and (min-width: 768px) and (min-height: 524px) {
        .available-space {
            position: absolute;
            right: 0;
            bottom: 0;
            width: calc(75% - 10px);
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
        }

        .background-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(50%); 
        }

        .rectangle-waitingRoom-T {
            position: absolute;
            bottom: 10%;
            width: 50%;
            height: 80%;
            left: 25%;
            background-color: rgba(200, 200, 200, 0.1);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            backdrop-filter: blur(1px);
            display: flex;
            align-items: center;
        }

        .title-waitingRoom-T {
            position: absolute;
            width: 100%;
            height: 20%;
            left: 0%;
            right: 15%;
            top: 0%;
            overflow: hidden;
            
            font-family: 'Courier New', monospace;
            font-size: 8vh;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
            text-align: center;
        }

        .tournament-room {
            position: absolute;
            top: 20%;
            width: 50%;
            height: 80%;
            left: 25%;
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

        .player-T {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 15%;
        }

        .profil-T {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 100%;
            margin: 10%;
        }

        .profil-pic-T {
            position: absolute;
            left: 0%;
            height: 100%;
            width 25%;
        }

        .profil-nick-T {
            position: absolute;
            width: 40%;
            height: 50%;
            top: 25%;
            left: 35%;

            font-family: 'Courier New', monospace;
            font-size: 2.5vh;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
            text-align: center;
        }





        .countdown-T {
            position: absolute;
            width: 100%;
            height: 7%;
            top: 20%;

            font-family: 'Courier New', monospace;
            font-size: 3vh;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
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

            font-family: 'Courier New', monospace;
            font-size: 5vh;
            color: #ff9900;
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
            color: #ff9900;
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





        .nicknames-N {
            position: absolute;
            width: 100%;
            height: 15%;
            top: 0%;
            overflow: hidden;
        }

        .playerOne-N {
            position: absolute;
            width: 45%;
            height: 100%;
            left: 0%;
            text-align: right;
            transform: translateY(10%);

            font-size: 7vh;
            font-family: 'Courier New', monospace;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
        }

        .playerTwo-N {
            position: absolute;
            width: 45%;
            height: 100%;
            left: 55%;
            text-align: left;
            transform: translateY(10%);

            font-size: 7vh;
            font-family: 'Courier New', monospace;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
        }

        .VS-logo-N {
            position: absolute;
            height: 100%;
            width: 10%;
            left: 45%;
            text-align: center;

            font-size: 9vh;
            font-family: 'Courier New', monospace;
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
            opacity: 0.6;
            filter: brightness(100%);
        }
          
        .gallery-N > img:hover {
            width: calc(var(--s)/2);
            opacity: 1;
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

    observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this)
	}

    playerOnePic(gameId) {
        if (!gameId || state.games[gameId - 1].players.length < 1 || gameId == -1)
            return ("/static/img/list.svg");
        
        const playerNick = state.games[gameId - 1].players[0];
        const user = state.users.find(elem => elem.nickname === playerNick);

        if (user)
            return '/static/' + user.picture;

        return '/static/img/list.svg';
    }

    playerTwoPic(gameId) {
        if (!gameId || state.games[gameId - 1].players.length < 2 || gameId == -1)
            return ("/static/img/list.svg");
        
        const playerNick = state.games[gameId - 1].players[1];
        const user = state.users.find(elem => elem.nickname === playerNick);

        if (user)
            return '/static/' + user.picture;

        return '/static/img/list.svg';
    }

    getPlayerOne(gameId) {
        if (!gameId)
            return ("Unknown");
        
        if (state.games[gameId - 1].players.length < 1)
            return ("Unknown");

        const playerOne = state.games[gameId - 1].players[0];
        if (!playerOne)
            return ("Unknown");
        return (playerOne);
    }

    getPlayerTwo(gameId)
    {
        if (!gameId)
            return ("Unknown");

        if (state.games[gameId - 1].players.length < 2)
            return ("Unknown");

        const playerTwo = state.games[gameId - 1].players[1];
        if (!playerTwo)
            return ("Unknown");
        return (playerTwo);
    }

    getCountdown() {
        if (state.currentTournament == -1)
            return ;
        return state.tournaments[state.currentTournament - 1].countdown;
    }

    hasCountdownStarted() {
        if (state.currentTournament == -1)
            return ;
        if (state.tournaments[state.currentTournament - 1].countdown == -1)
            return (!false);
        return (!true);
    }

    IsCurrentGame(gameId) {
        return !(gameId == state.currentGame);
    }

    IsTournamentWaiting() {
        if (state.currentTournament == -1 || state.tournaments[state.currentTournament - 1].status != 'waiting')
            return !(false);
        return !(true);
    }

    IsTournamentRunning() {
        if (state.currentTournament == -1 || state.tournaments[state.currentTournament - 1].status != 'running')
            return !(false);
        return !(true);
    }


    IsNormal() {
        if (state.currentTournament != -1)
            return !(false);
        return !(true);
    }
    
    getPlayerPic(nickname) {
        const user = state.users.find(elem => elem.nickname === nickname);

        if (user) {
            return '/static/' + user.picture;
        }

        else {
            return '/static/img/list.svg';
        }
    }

    IsCurrentTournament(tournamentId) {
        return !(tournamentId == state.currentTournament);
    }

    IsTournamentGame(gameId, tournamentGameId) {
        return !(gameId == tournamentGameId);
    }
}

register(WaitingRoom)