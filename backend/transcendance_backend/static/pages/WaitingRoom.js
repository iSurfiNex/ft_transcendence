import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

//<div class="rectangle-waitingRoom-T" hidden="{this.IsTournamentRunning()}">
//<div class="title-waitingRoom-T"> {language.WaitingRoom} </div>

class WaitingRoom extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    <meta name="csrf-token" content="{% csrf_token %}">
    <div class="available-space">
        
        <div class="rectangle-waitingRoom-T" hidden="{this.IsTournament()}">
            <div class="title-waitingRoom-T">{language.WaitingRoom}</div>
                
            <div hidden="{this.IsTournamentWaiting()}">
                <div class="player-count">
                    <a type="button" class="btn btn-startGame-T" @click="this.startTournament()" hidden="{this.isTournamentCreator()}">START</a>
                    {this.getPlayerCount()}/4
                </div>

                <div class="tournament-room" repeat="tournaments" as="tournament"> 
                    <div class="player-list-T" hidden="{this.IsCurrentTournament(tournament.id)}"> 
                        <div class="player-T" repeat="tournament.players" as="player">
                            <a href="/profile" class="profil-T">
                                <img src="{this.getPlayerPic(player)}">
                                <div class="profil-nick-T"> {player} </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>



            <div hidden="{this.IsTournamentRunning()}">
                <div class="countdown-T" hidden="{this.hasCountdownStarted()}"> {language.Start} {this.getCountdown()} </div>

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
                <a type="button" class="btn btn-startGame" hidden="{this.isGameCreator()}">{language.GoButton}</a>
                <a class="playerOne-N" href="/profile"> {this.getPlayerOne(currentGame)} </a> 
                <div class="VS-logo-N"> VS </div> 
                <a class="playerTwo-N" href="/profile"> {this.getPlayerTwo(currentGame)} </a>
                <a href="/" type="button" class="btn btn-giveUp">{language.ByeButton}</a>
            </div>

            <div class="profil-pics-N">
                <div class="gallery-N">
                    <img src="{this.playerOnePic()}" alt="player 1">
                    <img src="{this.playerTwoPic()}" alt="player 2">
                </div>
            </div>    
	    </div>

    </div>
    `


    static css = css`
    @media only screen and (max-width: 370px) {
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

        .btn-startGame-T {
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

        .btn-startGame-T:hover {
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





        .countdown-T {
            position: absolute;
            width: 100%;
            height: 7%;
            top: 20%;

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






	@media only screen and (min-width: 370px){
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

        .btn-startGame-T {
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

        .btn-startGame-T:hover {
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





        .countdown-T {
            position: absolute;
            width: 100%;
            height: 7%;
            top: 20%;

            font-size: 1vw;
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

        //.player-1 img:hover {
        //    opacity: 1;
        //    transition: opacity 0.3s;
        //}

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

        //.player-2 img:hover {
        //    opacity: 1;
        //    transition: opacity 0.3s;
        //}

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

    observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this)
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
        const playerOne = game.players[0];
        
        if (!game || game.players.length < 1 || !playerOne)
            return ("Unknown");

        return (playerOne);
    }

    getPlayerTwo()
    {
        const game = state.games.find(game => game.id == state.currentGame);
        const playerTwo = game.players[1];

        if (!game || game.players.length < 2 || !playerTwo)
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

    IsTournament() {
        if (state.currentTournament == -1)
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

    isGameCreator() {
        const game = state.games.find(game => game.id == state.currentGame);

        if (!game || state.whoAmI != game.creator)
            return !(false);

        return !(true);
    }

    isTournamentCreator() {
        if (state.currentTournament == -1 )
            return !(false);

        if (state.whoAmI == state.tournaments[state.currentTournament - 1].creator)
            return !(true);
        return !(false);
    }

    IsCurrentTournament(tournamentId) {
        return !(tournamentId == state.currentTournament);
    }

    IsTournamentGame(gameId, tournamentGameId) {
        return !(gameId == tournamentGameId);
    }

    getPlayerCount() {
        if (state.currentTournament == -1)
            return (0);
        return (state.tournaments[state.currentTournament - 1].players.length);
    }

	getCSRF() {
		const token = document.cookie
			.split('; ')
			.find(row => row.startsWith('csrftoken='))
			.split('=')[1];
		return (token);
	}

    getGameID(data) {
        for (const game of data.games)
        {
            const players = game.players;

            if (players[0].name == state.whoAmI || players[1].name == state.whoAmI)
                return (game.id);
        }
        return (null);
    }

    startTournament() {
        const nb_players = state.tournaments[state.currentTournament].players.length;
        const url = "https://localhost:8000/api/manage-tournament/" + 1 + "/";

        if (nb_players != 4)
        {    
            console.error("not enought players");
            return ;
        }

        const dataToPut = {
            action: "start-tournament",
        }

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
				'X-CSRFToken': this.getCSRF(),
            },
            body: JSON.stringify(dataToPut), 
        })
        .then (response => {
            if (!response.ok)
				throw new Error('Problem starting Tournament');
            return (response.json());	
        })
        .then (data => {
            state.tournaments[state.currentTournament].status = "running";//PROB STATE
            //CHANGER LES STATUS DES DEUX GAME DU TOURNOI
            state.currentGame = this.getGameID(data);
        })
        .catch(error => {console.error(error)})
    }

    //startGame() {
    //    const nb_players = state.games[state.currentGame].players.lenght;
    //    const url = "https://localhost:8000/api/manage-game/" + state.currentGame + "/";
	//	const currentDatetime = new Date();
	//	const formatedDatetime = currentDatetime.toISOString();
//
    //    if (nb_players != 2)
    //    {    
    //        console.error("not enought players");
    //        return ;
    //    }
//
    //    const dataToPut = {
    //        use: 'start-game'
    //        started_at: formatedDatetime,
    //    }
    //}

}

register(WaitingRoom)