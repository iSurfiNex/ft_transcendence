import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongCreateGame extends Component {
	//onSwitchChange(event) {this.shadowRoot.getElementById("input-players").hidden = false;}
	static sheets = [bootstrapSheet]
	static template = html`
	<meta name="csrf-token" content="{% csrf_token %}">
	<div class="available-space">
		<div class="create-game">
			<div class="top-bar"><span class="title">{language.GameEditor}</span></div>
			<div class="options-list-div">
				<div class="options-list">

					<div class="option">
						<input class="input-score" id="max-score" type="number" min="1" max="100" step="1" value="3">
						<span class="mode">Max Score</span>
					</div>

					<div class="option">
						<span class="switch">
							<label class="slider">
								<input type="checkbox" id="toggle-Powerups" checked="{createGamePresets.powerUps}">
								<span class="slider"></span>
							</label>
						</span>
						<span class="mode">{language.PowerUp}</span>
					</div>


					<div class="option">
						<span class="switch">
							<label class="slider">
								<input type="checkbox" id="toggle-IA" disabled="{createGamePresets.tournament}">
								<span class="slider"></span>
							</label>
						</span>
						<span class="mode {createGamePresets.tournament?disabled}">IA</span>
					</div>

					<div class="option">
						<span class="switch">
							<label class="slider">
								<input type="checkbox" id="toggle-Tournament" checked="{createGamePresets.tournament}" @change="this.onTournamentCheckedChange(node)">
								<span class="slider"></span>
							</label>
						</span>
						<span class="mode">{language.Tournament}</span>
					</div>
				</div>
			</div>

			<div class="bottom-bar">
				<div class="button-space">
					<button id="pong-button" class="cancel" @click="this.cancelGame()">
						<span class="front-cancel">{language.Cancel}</span>
					</button>
					<button id="pong-button" class="create" @click="this.createGame()">
						<span class="front-create">{language.Create}</span>
					</button>
				</div>
			</div>

		</div>
</div>
`

	static css = css`
	#max-score {
		min-width: 50px;
	}

	.disabled {
		color: red !important;
	}

	@keyframes fadeIn {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}

	@media only screen and (max-width: 768px) {
		.available-space {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 6px);
			background-color: rgba(255, 255, 255, 0.5);
			display: flex;
			justify-content: center;
			align-items: flex-end;
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
			display: flex;
			justify-content: center;
			align-items: flex-end;
		}
	}

	@media only screen and (min-width: 769px) and (min-height: 525px) {
		.available-space {
			width: calc(75% - 10px);
			height: calc(90% - 10px);
			background-color: rgba(255, 255, 255, 0.5);
			display: flex;
			justify-content: center;
			align-items: flex-end;
			position: absolute;
			bottom: 0;
			right: 0;
		}
	}

	.create-game {
		width: 50%;
		height: calc(100% - 70px);
		background-color: rgb(112, 112, 112);
		overflow-y: auto;
		display: flex;
		align-content: flex-end;
		flex-direction: column;
	}

	.top-bar {
		display: flex;
		width: 100%;
		padding: 35px;
		justify-content: center;
		font-size: 6vh;
		color: white;
		text-shadow:
			2px 2px 3px #595959,
			4px 4px 6px #595959,
			6px 6px 9px #595959;
		text-align: center;
	}

	.title {
		font-family: 'Press Start 2P', sans-serif;
		font-size: 3vw;
		white-space: nowrap;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.bottom-bar {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 35px;
		width: 100%;
		overflow: hidden;
	}

	.options-list-div {
		display: flex;
		width: 100%;
		height: 100%;
		background-color: rgb(86, 86, 86);
	}

	.options-list {
		height: 100%;
		background-color: rgb(86, 86, 86);
		overflow: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 50px;
		align-items: flex-start;
		margin: auto;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 10px;
		white-space: nowrap;
		flex-direction: row;
		justify-content: center;
	}

	.mode {
		font-family: 'Press Start 2P', sans-serif;
		font-size: 12px;
		overflow: hidden;
		color: white;
	}

	.switch {
		transform: translate(0%, 0%);
		display: inline-block;
		width: 45px;
		height: 25px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: .4s;
		transition: .4s;
		border-radius: 34px;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 80%;
		width: 45%;
		left: 5px;
		bottom: 2.8px;
		background-color: white;
		-webkit-transition: .4s;
		transition: .4s;
		border-radius: 50%;
	}

	input:checked + .slider {
		background-color: #07bb16;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #2196F3;
	}

	.switch input:checked + .slider:before {
		-webkit-transform: translateX(15px);
		-ms-transform: translateX(15px);
		transform: translateX(15px);
	}

	.button-space {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
	}

	.input-score {
		width: 45px;
		height: 25px;
	}

	.create {
		background: hsl(130, 100%, 32%);
		border-radius: 12px;
		border: none;
		padding: 0;
		cursor: pointer;
		outline-offset: 4px;
		margin: 10px;
	}

	.cancel {
		background: rgb(163, 0, 0);
		border-radius: 12px;
		border: none;
		padding: 0;
		cursor: pointer;
		outline-offset: 4px;
		margin: 10px;
	}

	.front-create {
		display: block;
		padding: 12px 42px;
		border-radius: 12px;
		font-size: 1.25rem;
		background: hsl(123, 100%, 39%);
		color: white;
		text-wrap: nowrap;
		transform: translateY(-6px);
		font-family: 'Press Start 2P', sans-serif;
	}

	.front-cancel {
		display: block;
		padding: 12px 42px;
		border-radius: 12px;
		font-size: 1.25rem;
		background: rgb(210, 0, 0);
		color: white;
		text-wrap: nowrap;
		transform: translateY(-6px);
		font-family: 'Press Start 2P', sans-serif;
	}

	.pushable:active .front {
		transform: translateY(-2px);
	}

	::-webkit-scrollbar {
		width: 0;
		background: transparent;
	}


`

	$id(str) {
		return this.shadowRoot.getElementById(str);
	}

	createGame() {
		if (this.shadowRoot.getElementById("toggle-Tournament").checked == true)
			this.newTournament();
		else
			this.newGame();
		return (false);
	}


	newGame() {
		const dataToSend = {
			goal_objective: this.$id("max-score").value,
			ia: this.$id("toggle-IA").checked,
			power_ups: this.$id("toggle-Powerups").checked,
		}

		post2("/api/manage-game/", dataToSend)
		.catch(error => console.error(error))
		//NOTE after the request, state.currentGame will be updated by websocket and an observer on state.currentGame will redirect to the correct page
	}


	newTournament() {
		const dataToSend = {
			state: "waiting",
			goal_objective: this.$id("max-score").value,
			power_ups: this.$id("toggle-Powerups").checked,
		}

		post2("/api/manage-tournament/", dataToSend)
		.catch(error => console.error(error))
	}

	cancelGame() {
		navigateTo('/play/' + state.gameListFilter);
		return false;
	}

	onTournamentCheckedChange(node) {
		const tournamentChecked = node.checked
		state.createGamePresets.tournament = tournamentChecked
		if (tournamentChecked)
			this.shadowRoot.getElementById('toggle-IA').checked = false
	}

}

register(PongCreateGame)
