import { Component, register, html, css } from 'pouic'
import { initPopover } from '/src/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/src/bootstrap/bootstrap_css.js'

    
class PongWaitingRoom extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    <div class="available-space">
        <img class="background-img" src="/src/img/background-5.svg">
        
        <div hidden="{this.IsTournament()}">
            <div class="rectangle-waitingRoom-T">
                <div class="title-waitingRoom-T"> Waiting Room </div>

                <div class="game-room-T" repeat="games" as="game"> 
                    <div class="player-list-T" hidden="{this.IsCurrentGame(game.id, currentGame)}"> 
                        <div class="player-T" repeat="game.players" as="player">
                            <div class="profil-T">
                                <a href="/profile">
                                    <div class="profil-nick-T"> {player} </div>
                                    <img class="profil-pic-T" src="{this.getPlayerPic(player)}"></img>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div hidden="{this.IsNormal()}">
            <div class="nicknames-N">
                <h1 class="title-N"> <a href="/profile"> Mia </a>VS<a href="/profile"> Abella </a></h1>
            </div>

            <div class="profil-pics-N">
                <div class="gallery-N">
                    <img src="/src/img/mia.svg" alt="player 1">
                    <img src="/src/img/abella.svg" alt="player 2">
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
            color: inherit;
            text-decoration: none;
            display: inline;
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
            color: inherit;
            text-decoration: none;
            display: inline;
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

    IsCurrentGame(gameId, currentGameId) {
        return !(gameId == currentGameId);
    }

    IsTournament() {
        const gameId = state.currentGame - 1;
        const type = state.games[gameId].type;

        console.log(type);
        if (type == "tournament")
            return !(true);
        return (!false);
    }

    IsNormal() {
        const gameId = state.currentGame - 1;
        const type = state.games[gameId].type;

        if (type == "normal")
            return !(true);
        return !(false);
    }
    
    getPlayerPic(nickname) {
        const user = state.users.find(elem => elem.nickname === nickname);

        if (user) {
            return '/src/' + user.picture;
        }

        else {
            return '/src/img/list.svg';
        }
    }
}

register(PongWaitingRoom)