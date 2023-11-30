import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongTournament extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="pong">
		<div class="content">
			<div class="pong-title">{language.tournament}</div>
			<div class="pong-content">
				<div class="pong-create">
					<button id="pong-button" class="pushable" onclick="navigateTo('/play/create-game'); return false;">
						<span class="front">{language.createTournament}</span>
					</button>
				</div>
				<div class="pong-list">
					<div repeat="tournaments" as="game">
						<div class="pong-desc" hidden="{this.isGameHidden(game)}">
							<div class="pong-type">ID:{game.id}</div>
							<div class="pong-players" repeat="players" as="player">
								<div class="pong-player">{player}</div>
							</div>
							<div class="pong-player-count">{game.players.length}/{game.maxPlayer}</div>
							<a @click="this.navigateUpdate(game)" href="#" class="pong-player-join btn btn-primary btn-lg" title="Join">
								<img class="pong-player-img" src="/static/img/share.svg" alt="join"/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
`

	static css = css`
	@keyframes fadeIn {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}

	@media only screen and (max-width: 768px) {
		.pong {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 6px);
			background-color: rgba(255, 255, 255, 0.5);
		}
	}

	@media only screen and (max-height: 524px) {
		.pong {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 6px);
			background-color: rgba(255, 255, 255, 0.5);
		}
	}

	@media only screen and (min-width: 768px) and (min-height: 524px) {
		.pong {
			position: absolute;
			right: 0;
			bottom: 0;
			width: calc(75% - 10px);
			height: calc(90% - 10px);
			background-color: rgba(255, 255, 255, 0.5);
		}
	}

	.content {
		position: absolute;
		top: 0;
		height: 100%;
		width: 100%;
		animation: fadeIn 0.5s;
	}

	.pong-title {
		position: absolute;
		padding-top: 15px;
		color: white;
		font-size: 30px;
		word-wrap: break-word;
		width: 100%;
		text-align: center;
	}

	.pong-content {
		position: absolute;
		bottom: 0;
		left: 25%;
		width: 50%;
		height: calc(100% - 70px);
		background-color: rgb(112, 112, 112);
		overflow: hidden;
	}

	.pong-create {
		position: absolute;
		text-align: center;
		top: 25px;
		width: 100%;
	}

	.pong-list {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: calc(100% - 95px);
		background-color: rgb(86, 86, 86);
	}

	.pong-desc {
		margin-top: 8px;
		margin-left: 15px;
		height: 40px;
		overflow-x: hidden;
		overflow-y: hidden;
		display: flex;
		align-items: center;
	}

	.pong-type {
		position: relative;
		color: white;
	}

	.pong-players {
		display: flex;
		position: relative;
		left: 10px;
		font-size: 12px;
		color: rgb(192, 192, 192);
		overflow-x: auto;
		flex: 1;
	}

	.pong-players::-webkit-scrollbar {
		display: none;
	}

	.pong-player {
		position: relative;
		margin-left: 10px;
	}

	.pong-player-count {
		color: white;
		padding-left: 20px;
		right: 65px;
	}

	.pong-player-join {
		margin-right: 15px;
		width: 40px;
		margin-left: 5px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pong-player-img {
		width: 20px;
	}

	.disabled {
		cursor: not-allowed;
		pointer-events: all !important;
	}

	.pong {
		font-family: 'Press Start 2P', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
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
`
	observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this);
	}

	isGameHidden(game) {
		if (game.type != "tournament")
			return (true);
		if (game.status != "waiting")
			return (true);
		if (game.creator == "tournament")
			return (true);
		if (game.players.length >= game.maxPlayer)
			return (true);
		return (false);
	}

	navigateUpdate(game) {
		state.currentGame = game.id;
		console.log(state.currentGame + ' ' + game.id);
		navigateTo('/play/waiting-room');
		return (false);
	}
}

register(PongTournament);
