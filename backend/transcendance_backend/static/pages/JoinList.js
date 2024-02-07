import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongJoinList extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="pong">
		<div class="content">
			<div class="pong-title">
				<a selected="{this.equals(gameListFilter,'pong')}" onclick="navigateTo('/play/pong')">CLASSIC</a>
				<a selected="{this.equals(gameListFilter,'pong-up')}"  onclick="navigateTo('/play/pong-up')">POWER-UPS</a>
				<a selected="{this.equals(gameListFilter,'tournament')}"  onclick="navigateTo('/play/tournament')">{language.tournament}</a>
			</div>
			<div class="pong-content">
				<div class="pong-create">
					<button id="pong-button" class="pushable" onclick="navigateTo('/play/create-game'); return false;">
						<span class="front">{language.createGame}</span>
					</button>
				</div>

				<div class="pong-list">
					<div repeat="games" as="game" hidden="{this.equals(gameListFilter,'tournament')}">
						<div class="pong-desc" hidden="{this.isGameHidden(game, gameListFilter)}">
							<div class="pong-type">ID:{game.id}</div>
							<div class="pong-players" repeat="players" as="player">
								<div class="pong-player">{player}</div>
							</div>
							<div class="pong-player-count">{game.players.length}/2</div>
							<a @click="this.navigateUpdate(game)" href="#" class="pong-player-join btn btn-primary btn-lg" title="Join">
								<img class="pong-player-img" src="/static/img/share.svg" alt="join"/>
							</a>
						</div>
					</div>

					<div repeat="tournaments" as="game" hidden="{!this.equals(gameListFilter,'tournament')}">
						<div class="pong-desc" hidden="{this.isGameHidden(game)}">
							<div class="pong-type">ID:{game.id}</div>
							<div class="pong-players" repeat="players" as="player">
								<div class="pong-player">{player}</div>
							</div>
							<div class="pong-player-count">{game.players.length}/4</div>
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

	@media only screen and (min-width: 769px) and (min-height: 525px) {
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
		display: flex;
		justify-item: center;
		flex-direction: column;
		animation: fadeIn 0.5s;
	}

	.pong-title {
		color: white;
		font-size: 20px;
		justify-content: center;
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
		margin-top: 20px;
	}

	.pong-title > a {
		color: white;
		text-decoration: none;
		cursor: pointer;
	}

	.pong-title > a[selected] {
		color: white;
		text-decoration: underline !important;
		text-decoration-thickness: 3px;
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

	isGameHidden(game, filter) {
        if (game.players.length >= 2 || game.ia || game.status !== "waiting")
            return false
        const isTournament = game.tournament_id >= 0
        const isPowerUps = game.type != 'normal'
        if (filter === 'pong')
            return isTournament || isPowerUps
        if (filter === 'pong-up')
            return isTournament || !isPowerUps
        if (filter === 'tournament')
            return !isTournament
		return (false);
	}

	navigateUpdate(game) {
		var url = "/api/manage-game/" + game.id + "/";

		var dataToSend = {
			action: "join"
		};

		put2(url, dataToSend)
		.then ( data => {
            state.currentGame = data.id
            state.profile.current_game_id = data.id
			navigateTo('/play/waiting-room');
		});
		return (false);
	}

    equals(a, b) {
        return a === b
    }
}

register(PongJoinList);
