import { Component, register, html, css } from 'pouic'
import { initPopover } from '/src/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/src/bootstrap/bootstrap_css.js'

    
class PongWaitingRoom extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    <div class="background-waiting-room">
		<div class="rectangle-waiting-room">
			
            <div class="title-waiting-room"> Waiting Room </div>
            
            <div class="game-room" repeat="games" as="game"> 
                <div class="player-list" hidden="{this.IsCurrentGame(game.id, currentGame)}"> 
                    <div class="player" repeat="game.players" as="player">
                        <div class="profil">
                            <a href="/profile">
                                <div class="profil-nick"> {player} </div>
                                <img class="profil-pic" src="{this.getPlayerPic(player)}"></img>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
		
        </div>
	</div>
    `

    static css = css`
    @media only screen and (max-width: 768px) {
        .background-waiting-room {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: calc(90% - 6px);
            background-color: rgba(255, 255, 255, 0.5);
        }

        .rectangle-waiting-room {
            position: absolute;
            bottom: 10%;
            width: 70%;
            height: 80%;
            left: 15%;
            background-color: rgb(54, 54, 54);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
        }

        .title-waiting-room {
            color: rgb(254, 254, 254);
            font-size: 4vh;
            width: 90%;
            left: 5%;
            top: 10%;
            position: absolute;
            text-align: center;
        }

        .game-room {
            position: absolute;
            top: 30%;
            width: 70%;
            height: 70%;
            left: 15%;
            overflow-y: auto;
        }

        .player-list{
            position: absolute;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        .player {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 7%;
        }

        .profil {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 100%;
            margin: 10%;
        }

        .profil-pic {
            position: absolute;
            left: 0%;
            height: 100%;
            width 25%;
        }

        .profil-nick {
            position: absolute;
            font-size: 2.5vh;
            width: 40%;
            height: 50%;
            top: 25%;
            left: 35%;
        }

        a {
            color: white;
            text-decoration: none;
        }
    }


    @media only screen and (max-height: 524px) {
        .background-waiting-room {
            position: absolute;
            right: 0;
            bottom: 0;
            width: calc(75% - 10px);
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
        }

        .rectangle-waiting-room {
            position: absolute;
            bottom: 10%;
            width: 50%;
            height: 80%;
            left: 25%;
            background-color: rgb(54, 54, 54);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            display: flex;
            align-items: center;
        }

        .title-waiting-room {
            position: absolute;
            color: rgb(254, 254, 254);
            font-size: 8vh;
            width: 100%;
            height: 20%;
            left: 0%;
            right: 15%;
            top: 0%;
            overflow: hidden;
            text-align: center;
        }

        .game-room {
            position: absolute;
            top: 20%;
            width: 50%;
            height: 80%;
            left: 25%;
            overflow-y: auto;
        }

        .player-list{
            position: absolute;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        .player {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 15%;
        }

        .profil {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 100%;
            margin: 10%;
        }

        .profil-pic {
            position: absolute;
            left: 0%;
            height: 100%;
            width 25%;
        }

        .profil-nick {
            position: absolute;
            font-size: 2.5vh;
            width: 40%;
            height: 50%;
            top: 25%;
            left: 35%;
        }

        a {
            color: white;
            text-decoration: none;
        }
    }

	@media only screen and (min-width: 768px) and (min-height: 524px) {
        .background-waiting-room {
            position: absolute;
            right: 0;
            bottom: 0;
            width: calc(75% - 10px);
            height: calc(90% - 10px);
            background-color: rgba(255, 255, 255, 0.5);
        }

        .rectangle-waiting-room {
            position: absolute;
            bottom: 10%;
            width: 50%;
            height: 80%;
            left: 25%;
            background-color: rgb(54, 54, 54);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            display: flex;
            align-items: center;
        }

        .title-waiting-room {
            position: absolute;
            width: 100%;
            height: 20%;
            left: 0%;
            right: 15%;
            top: 0%;
            overflow: hidden;
            text-align: center;
            
            font-family: 'Courier New', monospace;
            font-size: 8vh;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
            text-align: center;
        }

        .game-room {
            position: absolute;
            top: 20%;
            width: 50%;
            height: 80%;
            left: 25%;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .player-list{
            position: absolute;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        .player {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 15%;
        }

        .profil {
            position: relative;
            flex-direction: column;
            width: 100%;
            height: 100%;
            margin: 10%;
        }

        .profil-pic {
            position: absolute;
            left: 0%;
            height: 100%;
            width 25%;
        }

        .profil-nick {
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

        a {
            color: white;
            text-decoration: none;
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