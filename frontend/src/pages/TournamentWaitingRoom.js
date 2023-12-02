import { Component, register, html, css } from 'pouic'
import { initPopover } from '/src/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/src/bootstrap/bootstrap_css.js'

class TournamentWaitingRoom extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
    <div class="background">
		<img class="background-img" src="/src/img/background-4.svg" >
        <div class="rectangle-waiting-room">
			<div class="title"> Waiting Room </div>
            <div class="countdown"> STARTING IN n  </div>
		</div>
	</div>
`
    static css= css`

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
            background-color: rgba(200, 200, 200, 0.1);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            backdrop-filter: blur(1px);
        }

        .title {
            color: rgb(254, 254, 254);
            font-size: 4vh;
            width: 90%;
            left: 5%;
            top: 10%;
            position: absolute;
            text-align: center;
        }

        .countdown {

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
            background-color: rgba(200, 200, 200, 0.1);
            box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
            backdrop-filter: blur(1px);
            display: flex;
            align-items: center;
        }

        .title {
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

        .countdown {
            
        }

    }


    @media only screen and (min-width: 768px) and (min-height: 524px) { 
        .background {
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

        .rectangle-waiting-room {
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

        .title {
            position: absolute;
            font-size: 8vh;
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

        .countdown {
            position: absolute;
            height: 10%;
            width: 100%;
            top: 20%;
            font-family: 'Courier New', monospace;
            font-size: 1.5em;
            color: #00ff00;
            text-shadow: 
                2px 2px 3px #009900,
                4px 4px 6px #006600,
                6px 6px 9px #003300;
            text-align: center;
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
}

register(TournamentWaitingRoom)
