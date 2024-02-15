import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongHome extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div id="home" class="home">
		<div id="content" class="content">
			<div id="pong" class="pong">
				<div id="pong-content1" class="pong-content">
					<div id="pong-title" class="title">PONG</div>
					<div class="button">
						<button id="pong-button" @click="this.pongHandler()" class="pushable">
							<span class="front">{language.play}</span>
						</button>
					</div>
				</div>
			</div>
			<div id="power-up" class="power-up">
				<div id="pong-content2" class="pong-content">
					<div id="powerup-title" class="title">PONG POWERUP</div>
					<div class="button">
						<button id="other-game-button" @click="this.othergameHandler()" class="pushable">
							<span class="front">{language.play}</span>
						</button>
					</div>
				</div>
			</div>
			<div id="tournament" class="tournament">
				<div id="pong-content3" class="pong-content">
					<div id="tournament-title" class="title">{language.tournament}</div>
					<div class="button">
						<button id="tournament-button" @click="this.tournamentHandler()" class="pushable">
							<span class="front">{language.play}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
`

	static css = css`
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

		.content {
			flex-direction: row;
		}

		.pong-content {
			display: flex;
			text-align: center;
			flex-direction: column;
			overflow: hidden;
			height: 85%;
			width: 100%;
		}

		.pong {
			height: 96%;
			width: 31%;
		}

		.power-up {
			height: 96%;
			width: 31%;
		}

		.tournament {
			height: 96%;
			width: 31%;
		}

		.button {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			height: 100%;
			font-size: 40px;
			word-wrap: break-word;
			overflow: hidden;
			width: 100%;
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

		.content {
			flex-direction: column;
		}

		.pong-content {
			display: flex;
			text-align: center;
			flex-direction: row;
			justify-content: space-evenly;
			overflow: hidden;
			height: 100%;
			width: 85%;
			align-items: center;
		}

		.pong {
			width: 96%;
			height: 31%;
		}

		.power-up {
			width: 96%;
			height: 31%;
		}

		.tournament {
			width: 96%;
			height: 31%;
		}

		.button {
			display: flex;
			height: 100%;
			width: 100%;
			font-size: 40px;
			word-wrap: break-word;
			overflow: hidden;
    		align-items: center;
			justify-content: flex-end;
		}
	}

	@media only screen and (min-width: 769px) and (min-height: 525px) {
		.home {
			position: absolute;
			right: 0;
			bottom: 0;
			width: calc(75% - 10px);
			height: calc(90% - 10px);
			background-color: rgb(29, 29, 29);
		}

		.content {
			flex-direction: row;
		}

		.pong-content {
			display: flex;
			text-align: center;
			flex-direction: column;
			overflow: hidden;
			height: 60%;
			width: 100%;
		}

		.pong {
			height: 96%;
			width: 31%;
		}

		.power-up {
			height: 96%;
			width: 31%;
		}

		.tournament {
			height: 96%;
			width: 31%;
		}

		.button {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			height: 100%;
			width: 100%;
			font-size: 40px;
			word-wrap: break-word;
			overflow: hidden;
		}
	}

	.content {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	.pong {
		position: relative;
		background-color: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(5px);
		border-radius: 20px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		transition: all 0.4s ease-in-out;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.power-up {
		position: relative;
		background-color: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(5px);
		border-radius: 20px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		text-align: center;
		transition: all 0.4s ease-in-out;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tournament {
		position: relative;
		background-color: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(5px);
		border-radius: 20px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		text-align: center;
		transition: all 0.4s ease-in-out;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.title {
		font-family: 'Press Start 2P', sans-serif;
		color: white;
		font-size: 40px;
		word-wrap: break-word;
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
		width: 0;
		height: 0;
		transition: visibility 0s 0.4s, opacity 0.4s, width 0.4s, height 0.4s ease;
	}

	.hidden-front {
		visibility: hidden;
		opacity: 0;
		transition: visibility 0s 0.4s, opacity 0.4s, width 0.4s ease;
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

	pongHandler() {
		this.shadowRoot.getElementById("pong").style.zIndex=50;
		this.shadowRoot.getElementById("pong-content1").classList.add("hidden-front");
		this.shadowRoot.getElementById("powerup-title").style.wordWrap = "normal";
		this.shadowRoot.getElementById("tournament-title").style.whiteSpace = "nowrap";
		this.shadowRoot.getElementById("power-up").classList.add("hidden");
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
		this.shadowRoot.getElementById("power-up").style.zIndex=50;
		this.shadowRoot.getElementById("pong-content2").classList.add("hidden-front");
		this.shadowRoot.getElementById("pong-title").style.wordWrap = "normal";
		this.shadowRoot.getElementById("tournament-title").style.whiteSpace = "nowrap";
		this.shadowRoot.getElementById("pong").classList.add("hidden");
		this.shadowRoot.getElementById("tournament").classList.add("hidden");
		this.shadowRoot.getElementById("power-up").style.borderRadius=0;
		this.shadowRoot.getElementById("power-up").style.left=0;
		this.shadowRoot.getElementById("power-up").style.top=0;
		this.shadowRoot.getElementById("power-up").style.width="100%";
		this.shadowRoot.getElementById("power-up").style.height="100%";
		if (state.isMobile) {
			this.shadowRoot.getElementById("home").style.height="calc(90% - 8px)";
			this.shadowRoot.getElementById("home").style.bottom="0";
		}
		setTimeout(function() {
			navigateTo("/play/pong-up");
		}, 400);
	}

	tournamentHandler() {
		this.shadowRoot.getElementById("tournament").style.zIndex=50;
		this.shadowRoot.getElementById("pong-content3").classList.add("hidden-front");
		this.shadowRoot.getElementById("pong-title").style.wordWrap = "normal";
		this.shadowRoot.getElementById("powerup-title").style.whiteSpace = "nowrap";
		this.shadowRoot.getElementById("pong").classList.add("hidden");
		this.shadowRoot.getElementById("power-up").classList.add("hidden");
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
