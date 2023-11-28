import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongProfile extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="profile">
		<div class="profile-topbar">
			<div class="profile-topbar-picture">
				<img src="{this.getProfilePicture(whoAmI)}" alt="profile"/>
			</div>
			<div class="profile-topbar-fullname">
				<span class="profile-topbar-name">{this.getFullName(profileLooking)}</span>
				<span class="profile-topbar-nickname">({this.getNickName(profileLooking)})</span>
			</div>
			<div class="profile-topbar-button">
				<button class="profile-topbar-button-message btn btn-primary btn-lg" title="Send message"><img class="profile-topbar-img" src="/static/img/message.svg" alt="send message"></img></button>
				<button class="profile-topbar-button-invite btn btn-success btn-lg" title="Invite"><img class="profile-topbar-img" src="/static/img/plus.svg" alt="invite"></img></button>
				<button class="profile-topbar-button-block btn btn-danger btn-lg" title="Block"><img class="profile-topbar-img" src="/static/img/block.svg" alt="block"></img></button>
			</div>
		</div>

		<div class="profile-content">
			<div class="profile-stats">
				<div class="profile-title">Stats</div>
				<div class="profile-stat">
					<span class="profile-stat-name">Win:</span>
					<span class="profile-stat-value">{this.getWin()}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">Lose:</span>
					<span class="profile-stat-value">{this.getLose()}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">Total game:</span>
					<span class="profile-stat-value">{this.getTotal()}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">Win rate:</span>
					<span class="profile-stat-value">{this.getWinRate()}%</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">Ball hit:</span>
					<span class="profile-stat-value">{this.getBallHit()}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">Goal:</span>
					<span class="profile-stat-value">{this.getGoal()}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">Tournament win:</span>
					<span class="profile-stat-value">{this.getTournamentWin()}</span>
				</div>

				<div class="profile-chart">
					<div class="profile-bar" style={this.getChartWin()}>
						{this.getWin()}
					</div>
					<div class="profile-bar" style={this.getChartLose()}>
						{this.getLose()}
					</div>
					<div class="profile-bar" style={this.getChartTotal()}>
						{this.getTotal()}
					</div>
				</div>
				<div class="profile-chart-desc">
					<div class="profile-bar-desc">WIN</div>
					<div class="profile-bar-desc">LOSE</div>
					<div class="profile-bar-desc">TOTAL</div>
				</div>
			</div>

			<div class="profile-game-history">
				<div class="profile-title">Game history</div>
				<div class="profile-games" repeat="games" as="game">
					<div class="profile-game" hidden={this.getHiddenStatus(game)}>
						<span class="profile-game-date">{game.date}</span>
						<div class="profile-game-score">
 							<span class="profile-game-score-name">{this.getPlayerName(game)}</span>
							<span class="profile-game-score">{this.getPlayerScore(game)}</span>
							<span class="profile-game-versus">VS</span>
							<span class="profile-game-score">{this.getOtherPlayerScore(game)}</span>
							<span class="profile-game-score-name">{this.getOtherPlayerName(game)}</span>
						</div>
						<span class="profile-game-status {this.getGameStatus(game)}">{this.getGameStatus(game)}</span>
					</div>
				</div>
			</div>

			<div class="profile-tournament-history">
				<div class="profile-title">Tournament history</div>
				<div class="profile-tournament" repeat="tournaments" as="tournament">
					<div class="profile-game" hidden={this.getHiddenStatusTournament(tournament)}>
						<span class="profile-game-date">{tournament.date} - </span><span class="profile-game-status {this.getTournamentStatus(tournament)}">{this.getTournamentStatus(tournament)}</span>
						<div class="profile-tournament-games" repeat="tournament.gamesId" as="gameId">
							<div class="profile-tournament-game">
								<div class="profile-game-score">
									<span class="profile-game-score-name">{this.getTournamentPlayerName(gameId)}</span>
									<span class="profile-game-score">{this.getTournamentPlayerScore(gameId)}</span>
									<span class="profile-game-versus">VS</span>
									<span class="profile-game-score">{this.getTournamentOtherPlayerScore(gameId)}</span>
									<span class="profile-game-score-name">{this.getTournamentOtherPlayerName(gameId)}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
`

	static css = css`
	@media only screen and (max-width: 768px) {
		.profile {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 6px);
			background-color: rgba(255, 255, 255, 0.5);
			overflow: hidden;
		}

		.profile-topbar-fullname {
			position: absolute	;
			color: #9F9F9F;
			width: 40%;
			height: 100%;
			right: 25%;
			top: 0;
			font-size: 30px;
			display: flex;
			justify-content: center;
			flex-direction: column;
		}

		.profile-topbar-picture img {
			margin-left: 10px;
			max-height: 100%;
			height: auto;
			overflow: hidden;
			background-color: white;
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
		}

		.profile-topbar-button {
			position: absolute;
			width: 20%;
			height: 100%;
			right: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}

		.profile-topbar-button-message {
			height: 25%;
		}

		.profile-topbar-button-invite {
			height: 25%;
			margin-top: 5px;
		}

		.profile-topbar-button-block {
			height: 25%;
			margin-top: 5px;
		}

		.profile-topbar-img {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			height: auto;
			overflow: hidden;
			max-height: 100%;
		}

		.profile {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 6px);
			background-color: rgba(255, 255, 255, 0.5);
		}

		.profile-topbar-picture img {
			margin-left: 10px;
			max-height: 100%;
			height: auto;
			overflow: hidden;
			background-color: white;
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
		}
	}

	@media only screen and (max-height: 524px) {
		.profile {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 6px);
			background-color: rgba(255, 255, 255, 0.5);
			overflow: hidden;
		}

		.profile-topbar-fullname {
			position: absolute	;
			color: #9F9F9F;
			width: 40%;
			height: 100%;
			right: 25%;
			top: 0;
			font-size: 17px;
			display: flex;
			justify-content: center;
			flex-direction: column;
		}

		.profile-topbar-picture img {
			margin-left: 10px;
			max-height: 100%;
			height: auto;
			overflow: hidden;
			background-color: white;
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
		}

		.profile-topbar-button {
			position: absolute;
			width: 30%;
			height: 100%;
			right: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: row;
			overflow: hidden;
		}

		.profile-topbar-button-message {
			width: 25%;
		}

		.profile-topbar-button-invite {
			width: 25%;
			margin-left: 5px;
		}

		.profile-topbar-button-block {
			width: 25%;
			margin-left: 5px;
		}

		.profile-topbar-img {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			width: auto;
			overflow: hidden;
			max-width: 100%;
		}
	}

	@media only screen and (min-width: 768px) and (min-height: 524px) {
		.profile {
			position: absolute;
			right: 0;
			bottom: 0;
			width: calc(75% - 10px);
			height: calc(90% - 10px);
			background-color: rgba(255, 255, 255, 0.5);
			overflow: hidden;
		}

		.profile-topbar-fullname {
			position: absolute;
			color: #9F9F9F;
			width: 50%;
			height: 100%;
			right: 20%;
			top: 0;
			font-size: 25px;
			display: flex;
			justify-content: center;
			flex-direction: column;
		}

		.profile-topbar-picture img {
			max-height: 100%;
			height: auto;
			overflow: hidden;
			background-color: white;
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
		}

		.profile-topbar-button {
			position: absolute;
			width: 20%;
			height: 100%;
			right: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}

		.profile-topbar-button-message {
			height: 25%;
		}

		.profile-topbar-button-invite {
			height: 25%;
			margin-top: 5px;
		}

		.profile-topbar-button-block {
			height: 25%;
			margin-top: 5px;
		}

		.profile-topbar-img {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			height: auto;
			overflow: hidden;
			max-height: 100%;
		}
	}

	.profile-topbar {
		position: relative;
		top: 0;
		width: 100%;
		height: 30%;
		background-color: rgb(54, 54, 54);
		border-bottom: 10px solid #424242;
	}

	.profile-topbar-picture {
		position: relative;
		top: 5%;
		height: 90%;
		width: 30%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.profile-topbar-name {
		position: relative;
	}

	.profile-topbar-nickname {
		position: relative;
		font-style: italic;
	}

	.profile-title {
		font-size: 20px;
		display: flex;
		justify-content: center;
	}

	.profile-stats {
		position: absolute;
		width: 32%;
		height: calc(100% - 30%);
		overflow-y: auto;
	}

	.profile-game-history {
		position: absolute;
		width: 34%;
		left: 32%;
		height: calc(100% - 30%);
		border-left: 10px solid #424242;
		overflow-y: auto;
		text-align: center;
	}

	.profile-tournament-history {
		position: absolute;
		width: 34%;
		left: 66%;
		height: calc(100% - 30%);
		border-left: 10px solid #424242;
		overflow-y: auto;
		text-align: center;
	}

	.profile-stat {
		top: 10px;
		position: relative;
		font-size: 13px;
		margin-left: 15px;
	}

	.profile-stat-value {
		margin-left: 5px;
	}

	.profile-game {
		position: relative;
		top: 10px;
		font-size: 13px;
		display: flex;
		flex-direction: column;
		margin-bottom: 15px;
	}

	.profile-tournament-game {
		font-size: 11px;
		margin-top: 3px;
		margin-bottom: 3px;
	}

	.profile-tournament-games {
		position: relative;
		left: 5%;
		width: 90%;
		height: 80%;
		background-color: rgb(97, 97, 97);
	}

	.profile-game-date {
		font-style: italic;
	}

	.win {
		color: green;
		text-transform: uppercase;
	}

	.lose {
		color: rgb(178, 0, 0);
		text-transform: uppercase;
	}

	.tie {
		color: rgb(208, 102, 0);
		text-transform: uppercase;
	}

	.profile-game-score {
		margin-left: 3px;
		margin-right: 3px;
	}

	.profile-chart {
		position: relative;
		top: 20px;
		left: 10px;
		width: calc(100% - 20px);
		height: calc(100% - 235px);
		min-height: 100px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		text-align: center;
		align-items: flex-end;
	}

	.profile-bar {
		overflow-y: hidden;
		overflow-x: auto;
		margin-left: 5px;
		width: 28%;
		background-color: rgb(97, 97, 97);
	}

	.profile-chart-desc {
		position: relative;
		top: 20px;
		left: 10px;
		width: calc(100% - 20px);
		display: flex;
		flex-direction: row;
		justify-content: center;
		text-align: center;
		align-items: flex-end;
	}

	.profile-bar-desc {
		overflow-x: auto;
		margin-left: 5px;
		font-size: 15px;
		width: 28%;
	}

	.profile-bar-desc::-webkit-scrollbar {
		display: none;
	}

	.profile {
		font-family: 'Press Start 2P', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	::-webkit-scrollbar {
		height: 10px;
		width: 10px;
		background-color: #424242;
	}

	::-webkit-scrollbar-thumb {
		background: #666666;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`
	observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this);
	}

	getProfilePicture(whoAmI) {
		const user = state.users.find(user => user.nickname === whoAmI);

		if (user) {
			return '/static/' + user.picture;
		}
		else {
			return '/static/img/list.svg';
		}
	}

	getFullName(whoAmI) {
		const user = state.users.find(user => user.nickname === whoAmI);

		if (user) {
			return user.fullname;
		}
		else {
			return '';
		}
	}

	getNickName(whoAmI) {
		const user = state.users.find(user => user.nickname === whoAmI);

		if (user) {
			return user.nickname;
		}
		else {
			return '';
		}
	}

	getWin() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';
		return profile.win;
	}

	getLose() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';
		return profile.lose;
	}

	getTotal() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';
		return profile.win + profile.lose;
	}

	getWinRate() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';
		return profile.win / profile.lose * 100;
	}

	getBallHit() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';
		return profile.ballHit;
	}

	getGoal() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';
		return profile.goal;
	}

	getTournamentWin() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';
		return profile.tournamentWin;
	}

	getChartWin() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';

		let ratio = (profile.win / (profile.win + profile.lose)) * 90;
		let finalValue = Math.max(ratio, 8);

		return 'height: ' + finalValue + '%';
	}

	getChartLose() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';

		let ratio = (profile.lose / (profile.win + profile.lose)) * 90;
		let finalValue = Math.max(ratio, 8);

		return 'height: ' + finalValue + '%';
	}

	getChartTotal() {
		const profile = state.profiles.find(profile => profile.name === state.profileLooking);

		if (!profile)
			return '';

		let finalValue = 90;

		return 'height: ' + finalValue + '%';
	}

	getHiddenStatus(game) {
		const player = game.players.find(player => player === state.whoAmI);

		if (!player)
			return (true);
		if (game.type == "tournament")
			return (true);
		if (game.status != "done")
			return (true);
		if (game.creator == "tournament")
			return (true);
		return (false);
	}

	getPlayerName(game) {
		const player1 = game.players.find(player => player === state.whoAmI);

		return player1;
	}

	getOtherPlayerName(game) {
		const player2 = game.players.find(player => player !== state.whoAmI);

		return player2;
	}

	getPlayerScore(game) {
		const player = game.players.find(player => player === state.whoAmI);

		if (!player)
			return ;
		if (game.type == "tournament")
			return ;
		if (game.status != "done")
			return ;
		if (game.creator == "tournament")
			return ;
		const score = game.score.find(score => score.name === player);
		return '(' + score.points + ')';
	}

	getOtherPlayerScore(game) {
		const player = game.players.find(player => player !== state.whoAmI);

		if (!player)
			return ;
		if (game.type == "tournament")
			return ;
		if (game.status != "done")
			return ;
		if (game.creator == "tournament")
			return ;
		const score = game.score.find(score => score.name === player);
		return '(' + score.points + ')';
	}

	getGameStatus(game) {
		const player1 = game.players.find(player => player === state.whoAmI);
		const player2 = game.players.find(player => player !== state.whoAmI);

		if (!player1)
			return ;
		if (game.type == "tournament")
			return ;
		if (game.status != "done")
			return ;
		if (game.creator == "tournament")
			return ;
		const score1 = game.score.find(score => score.name === player1);
		const score2 = game.score.find(score => score.name === player2);
		if (score1.points == score2.points)
			return 'tie';
		else
			return score1.points > score2.points ? 'win' : 'lose'
	}

	getHiddenStatusTournament(game) {
		const player = game.players.find(player => player === state.whoAmI);

		if (!player)
			return (true);
		if (game.type != "tournament")
			return (true);
		if (game.status != "done")
			return (true);
		return (false);
	}

	getTournamentStatus(game) {
		if (game.type != "tournament")
			return ;
		if (game.status != "done")
			return ;

		const gameId = Math.max(...game.gamesId);
		if (!gameId)
			return ;

		const finalGame = state.games.find(game => game.id === gameId);
		if (!finalGame)
			return ;

		const player1 = finalGame.players.find(player => player == state.whoAmI);
		const player2 = finalGame.players.find(player => player !== state.whoAmI);
		if (!player1)
			return 'lose';
		if (!player2)
			return ;

		const score1 = finalGame.score.find(score => score.name === player1);
		const score2 = finalGame.score.find(score => score.name === player2);
		if (score1.points == score2.points)
			return 'tie';
		else
			return score1.points > score2.points ? 'win' : 'lose'

	}

	getTournamentPlayerName(gameId) {
		const game = state.games.find(game => game.id === gameId);
		if (!game)
			return ;
		let player1 = game.players.find(player => player === state.whoAmI);
		if (!player1)
			player1 = game.players[0];

		return player1;
	}

	getTournamentOtherPlayerName(gameId) {
		const game = state.games.find(game => game.id === gameId);
		if (!game)
			return ;
		let player2 = game.players.find(player => player !== state.whoAmI);
		const player1 = game.players.find(player => player === state.whoAmI);
		if (!player1)
			player2 = game.players[1];

		return player2;
	}

	getTournamentPlayerScore(gameId) {
		const game = state.games.find(game => game.id === gameId);
		if (!game)
			return ;
		let player = game.players.find(player => player === state.whoAmI);

		if (!player)
			player = game.players[0];
		if (game.type == "tournament")
			return ;
		if (game.status != "done")
			return ;
		if (game.creator != "tournament")
			return ;
		const score = game.score.find(score => score.name === player);
		return '(' + score.points + ')';
	}

	getTournamentOtherPlayerScore(gameId) {
		const game = state.games.find(game => game.id === gameId);
		if (!game)
			return ;
		let player1 = game.players.find(player => player === state.whoAmI);
		let player2 = game.players.find(player => player !== state.whoAmI);

		if (!player1)
			player2 = game.players[1];
		if (!player2)
			return ;
		if (game.type == "tournament")
			return ;
		if (game.status != "done")
			return ;
		if (game.creator != "tournament")
			return ;
		const score = game.score.find(score => score.name === player2);
		return '(' + score.points + ')';
	}
}

register(PongProfile);
