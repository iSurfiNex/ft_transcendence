import { Component, register } from 'pouic'
import { initPopover } from '/src/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/src/bootstrap/bootstrap_css.js'

class PongHome extends Component {
	static sheets = [bootstrapSheet]
	static template = `
	<div id="home" class="home">
		<div id="pong" class="pong-pannel">
			<div id="pong-content" class="content">
				<div class="content-main">
					<div id="pong-title" class="title">PONG</div>
					<div class="button">
						<button id="pong-button" @click="this.pongHandler()" class="pushable">
							<span class="front">PLAY</span>
						</button>
					</div>
					<div class="queue">
						<span class="player-nb">7</span><span class="player-text"> player(s) currently in game and/or in waiting-room.</span>
					</div>
				</div>
			</div>
		</div>

		<div id="other-game" class="other-game">
			<div id="other-game-content" class="content">
				<div class="content-main">
					<div id="other-game-title" class="title">PONG POWERUP</div>
					<div class="button">
						<button id="other-game-button" @click="this.othergameHandler()" class="pushable">
							<span class="front">PLAY</span>
						</button>
					</div>
					<div class="queue">
						<span class="player-nb">0</span><span class="player-text"> player(s) currently in game and/or in waiting-room.</span>
					</div>
				</div>
			</div>
		</div>

		<div id="tournament" class="tournament">
			<div id="tournament-content" class="content">
				<div class="content-main">
					<div id="tournament-title" class="title">TOURNAMENT</div>
					<div class="button">
						<button id="tournament-button" @click="this.tournamentHandler()" class="pushable">
							<span class="front">PLAY</span>
						</button>
					</div>
					<div class="queue">
						<span class="player-nb">8.462</span><span class="player-text"> player(s) currently in game and/or in waiting-room.</span>
					</div>
				</div>
			</div>
		</div>
	</div>
`

	static css = `
	@media only screen and (max-width: 768px) {
		.home {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 8px);
			background-color: rgb(29, 29, 29);
			transition: all 0.4s ease-in-out;
		}

		.pong-pannel {
			position: absolute;
			top: 2.5%;
			left: 2%;
			height: 31%;
			width: 96%;
			background-color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 20px;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			text-align: center;
			transition: all 0.4s ease-in-out;
			overflow: hidden;
		}

		.other-game {
			position: absolute;
			top: calc(2.5% + 31% + 1%);
			left: 2%;
			height: 31%;
			width: 96%;
			background-color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 20px;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			text-align: center;
			transition: all 0.4s ease-in-out;
			overflow: hidden;
		}

		.tournament {
			position: absolute;
			top: calc(2.5% + 31% + 1% + 31% + 1%);
			left: 2%;
			height: 31%;
			width: 96%;
			background-color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 20px;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			text-align: center;
			transition: all 0.4s ease-in-out;
			overflow: hidden;
		}

		.title {
			width: 50%;
			font-family: 'Press Start 2P', sans-serif;
			color: white;
			font-size: 30px;
			word-wrap: break-word;
		}

		.button {
			margin-left: 20px;
			color: white;
			font-size: 40px;
			word-wrap: break-word;
		}

		.queue {
			position: absolute;
			width: 80%;
			left: 0;
			bottom: 0;
			font-family: 'Roboto', sans-serif;
		}

		.content-main {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
		}

		.content {
			width: 100%;
			height: 100%;
		}

		.player-nb {
			color: white;
			font-size: 15px;
			word-wrap: break-word;
		}

		.player-text {
			color: white;
			font-size: 15px;
			word-wrap: break-word;
		}
	}

	@media only screen and (max-height: 524px) {
		.home {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 8px);
			background-color: rgb(29, 29, 29);
			transition: all 0.4s ease-in-out;
		}

		.pong-pannel {
			position: absolute;
			top: 2.5%;
			left: 2%;
			height: 31%;
			width: 96%;
			background-color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 20px;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			text-align: center;
			transition: all 0.4s ease-in-out;
			overflow: hidden;
		}

		.other-game {
			position: absolute;
			top: calc(2.5% + 31% + 1%);
			left: 2%;
			height: 31%;
			width: 96%;
			background-color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 20px;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			text-align: center;
			transition: all 0.4s ease-in-out;
			overflow: hidden;
		}

		.tournament {
			position: absolute;
			top: calc(2.5% + 31% + 1% + 31% + 1%);
			left: 2%;
			height: 31%;
			width: 96%;
			background-color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 20px;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			text-align: center;
			transition: all 0.4s ease-in-out;
			overflow: hidden;
		}

		.title {
			width: 50%;
			font-family: 'Press Start 2P', sans-serif;
			color: white;
			font-size: 30px;
			word-wrap: break-word;
		}

		.button {
			margin-left: 20px;
			color: white;
			font-size: 40px;
			word-wrap: break-word;
		}

		.queue {
			position: absolute;
			width: 80%;
			left: 0;
			bottom: 0;
			font-family: 'Roboto', sans-serif;
		}

		.content-main {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
		}

		.content {
			width: 100%;
			height: 100%;
		}

		.player-nb {
			color: white;
			font-size: 15px;
			word-wrap: break-word;
		}

		.player-text {
			color: white;
			font-size: 15px;
			word-wrap: break-word;
		}
	}

	@media only screen and (min-width: 768px) and (min-height: 524px) {
		.home {
			position: absolute;
			right: 0;
			bottom: 0;
			width: calc(75% - 10px);
			height: calc(90% - 10px);
			background-color: rgb(29, 29, 29);
		}

		.pong-pannel {
			position: absolute;
			left: 2.5%;
			top: 2%;
			width: 31%;
			height: 96%;
			background-color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 20px;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			text-align: center;
			transition: all 0.4s ease-in-out;
			overflow: hidden;
		}

		.other-game {
			position: absolute;
			left: calc(2.5% + 31% + 1%);
			top: 2%;
			width: 31%;
			height: 96%;
			background-color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 20px;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			text-align: center;
			transition: all 0.4s ease-in-out;
			overflow: hidden;
		}

		.tournament {
			position: absolute;
			left: calc(2.5% + 31% + 1% + 31% + 1%);
			top: 2%;
			width: 31%;
			height: 96%;
			background-color: rgba(255, 255, 255, 0.5);
			backdrop-filter: blur(5px);
			border-radius: 20px;
			box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
			text-align: center;
			transition: all 0.4s ease-in-out;
			overflow: hidden;
		}

		.title {
			position: relative;
			top: 31%;
			font-family: 'Press Start 2P', sans-serif;
			color: white;
			font-size: 40px;
			word-wrap: break-word;
		}

		.button {
			position: relative;
			top: 32%;
			color: white;
			font-size: 40px;
			word-wrap: break-word;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.queue {
			width: 100%;
			text-align: center;
			position: absolute;
			bottom: 20px;
			font-family: 'Roboto', sans-serif;
		}

		.content, .content-main {
			width: 100%;
			height: 100%;
		}

		.player-nb {
			color: white;
			font-size: 20px;
			word-wrap: break-word;
		}

		.player-text {
			color: white;
			font-size: 20px;
			word-wrap: break-word;
		}
	}

	.pushable {
		background: hsl(130, 100%, 32%);
		border-radius: 12px;
		border: none;
		padding: 0;
		cursor: pointer;
		outline-offset: 4px;
	}

	.front {
		display: block;
		padding: 12px 42px;
		border-radius: 12px;
		font-size: 1.25rem;
		background: hsl(123, 100%, 39%);
		color: white;
		transform: translateY(-6px);
		font-family: 'Press Start 2P', sans-serif;
	}

	.pushable:active .front {
		transform: translateY(-2px);
	}

	.hidden {
		visibility: hidden;
		opacity: 0;
		transition: visibility 0s 0.4s, opacity 0.4s ease;
	}

	.fullsize {
		border-radius: 0;
	}

	.home {
		font-family: 'Press Start 2P', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
`
	observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this);
	}

	pongHandler() {
		this.shadowRoot.getElementById("pong").style.zIndex=50;
		this.shadowRoot.getElementById("pong-content").classList.add("hidden");
		this.shadowRoot.getElementById("other-game").classList.add("hidden");
		this.shadowRoot.getElementById("tournament").classList.add("hidden");
		this.shadowRoot.getElementById("pong").style.borderRadius=0;
		this.shadowRoot.getElementById("pong").style.left=0;
		this.shadowRoot.getElementById("pong").style.top=0;
		this.shadowRoot.getElementById("pong").style.width="100%";
		this.shadowRoot.getElementById("pong").style.height="100%";
		if (state.isMobile) {
			this.shadowRoot.getElementById("home").style.height="calc(90% - 8px)";
			this.shadowRoot.getElementById("home").style.bottom="0";
		}
		setTimeout(function() {
			navigateTo("/play/pong");
		}, 400);
	}

	othergameHandler() {
		this.shadowRoot.getElementById("other-game").style.zIndex=50;
		this.shadowRoot.getElementById("other-game-content").classList.add("hidden");
		this.shadowRoot.getElementById("pong").classList.add("hidden");
		this.shadowRoot.getElementById("tournament").classList.add("hidden");
		this.shadowRoot.getElementById("other-game").style.borderRadius=0;
		this.shadowRoot.getElementById("other-game").style.left=0;
		this.shadowRoot.getElementById("other-game").style.top=0;
		this.shadowRoot.getElementById("other-game").style.width="100%";
		this.shadowRoot.getElementById("other-game").style.height="100%";
		if (state.isMobile) {
			this.shadowRoot.getElementById("home").style.height="calc(90% - 8px)";
			this.shadowRoot.getElementById("home").style.bottom="0";
		}
		setTimeout(function() {
			navigateTo("/play/pong-powerup");
		}, 400);
	}

	tournamentHandler() {
		this.shadowRoot.getElementById("tournament").style.zIndex=50;
		this.shadowRoot.getElementById("tournament-content").classList.add("hidden");
		this.shadowRoot.getElementById("pong").classList.add("hidden");
		this.shadowRoot.getElementById("other-game").classList.add("hidden");
		this.shadowRoot.getElementById("tournament").style.borderRadius=0;
		this.shadowRoot.getElementById("tournament").style.left=0;
		this.shadowRoot.getElementById("tournament").style.top=0;
		this.shadowRoot.getElementById("tournament").style.width="100%";
		this.shadowRoot.getElementById("tournament").style.height="100%";
		if (state.isMobile) {
			this.shadowRoot.getElementById("home").style.height="calc(90% - 8px)";
			this.shadowRoot.getElementById("home").style.bottom="0";
		}
		setTimeout(function() {
			navigateTo("/play/tournament");
		}, 400);
	}
}

register(PongHome);
