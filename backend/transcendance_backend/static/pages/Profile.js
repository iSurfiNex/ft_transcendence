import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'
import './UpdateProfile.js'

class PongProfile extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="profile">
		<div class="profile-topbar">
			<div id="user-card">
				<img id="avatar-img" src="{this.getAvatarUrl(profileLooking, profile.picture)}" alt="profile"/>
			</div>

			<pong-update-profile></pong-update-profile>
		</div>

		<div class="profile-content">
			<div class="profile-stats">
				<div class="profile-title">Stats</div>
				<div class="profile-stat">
					<span class="profile-stat-name">{language.winLow}:</span>
					<span class="profile-stat-value">{this.getWin(profileLooking)}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">{language.loseLow}:</span>
					<span class="profile-stat-value">{this.getLose(profileLooking)}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">{language.totalLow}:</span>
					<span class="profile-stat-value">{this.getTotal(profileLooking)}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">{language.winRate}:</span>
					<span class="profile-stat-value">{this.getWinRate(profileLooking)}%</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">{language.ballHit}:</span>
					<span class="profile-stat-value">{this.getBallHit(profileLooking)}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">{language.goal}:</span>
					<span class="profile-stat-value">{this.getWallHit(profileLooking)}</span>
				</div>
				<div class="profile-stat">
					<span class="profile-stat-name">{language.tournamentWin}:</span>
					<span class="profile-stat-value">{this.getTournamentWin(profileLooking)}</span>
				</div>

				<div class="profile-chart">
					<div class="profile-bar" style={this.getChartWin(profileLooking)}>
						{this.getWin(profileLooking)}
					</div>
					<div class="profile-bar" style={this.getChartLose(profileLooking)}>
						{this.getLose(profileLooking)}
					</div>
					<div class="profile-bar" style={this.getChartTotal(profileLooking)}>
						{this.getTotal(profileLooking)}
					</div>
				</div>
				<div class="profile-chart-desc">
					<div class="profile-bar-desc">{language.win}</div>
					<div class="profile-bar-desc">{language.lose}</div>
					<div class="profile-bar-desc">{language.total}</div>
				</div>
			</div>

			<div class="profile-game-history">
				<div class="profile-title">{language.gameHistory}</div>
				<div class="profile-games" repeat="games" as="item">
					<div class="profile-game" hidden={this.getHiddenStatus(item,profileLooking)}>
						<span class="profile-game-date">{this.getFormatedDate(item.date)}</span>
						<div class="profile-game-score">
 							<span class="profile-game-score-name">{this.getPlayerName(item,profileLooking)}</span>
							<span class="profile-game-score">{this.getPlayerScore(item,profileLooking)}</span>
							<span class="profile-game-versus">VS</span>
							<span class="profile-game-score">{this.getOtherPlayerScore(item,profileLooking)}</span>
							<span class="profile-game-score-name">{this.getOtherPlayerName(item,profileLooking)}</span>
						</div>
						<span class="profile-game-status {this.getGameStatus(item,profileLooking)}">{this.getGameStatus(item,profileLooking)}</span>
					</div>
				</div>
			</div>

			<div class="profile-tournament-history">
				<div class="profile-title">{language.tournamentHistory}</div>
				<div class="profile-tournament" repeat="tournaments" as="tournament">
					<div class="profile-game" hidden={this.getHiddenStatusTournament(tournament,profileLooking)}>
						<span class="profile-game-date">{this.getFormatedDate(tournament.date)} - </span><span class="profile-game-status {this.getTournamentStatus(tournament,profileLooking)}">{this.getTournamentStatus(tournament,profileLooking)}</span>
						<div class="profile-tournament-games" repeat="tournament.gamesId" as="gameId">
							<div class="profile-tournament-game">
								<div class="profile-game-score" hidden={this.getHiddenTourGames(gameId,profileLooking)}>
									<span class="profile-game-score-name">{this.getTournamentPlayerName(gameId,profileLooking)}</span>
									<span class="profile-game-score">{this.getTournamentPlayerScore(gameId,profileLooking)}</span>
									<span class="profile-game-versus">VS</span>
									<span class="profile-game-score">{this.getTournamentOtherPlayerScore(gameId,profileLooking)}</span>
									<span class="profile-game-score-name">{this.getTournamentOtherPlayerName(gameId,profileLooking)}</span>
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

	.profile-topbar-button {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.profile-topbar-img {
		width: 36px;
	}

	#user-card {
		min-width: 180px;
	}

	#avatar-img {
		width: 180px;
		height: 180px;
		object-fit: contain;
	}

	pong-update-profile {
		min-width: 250px;
		flex: 1;
		max-width: 500px;
        --bs-body-font-family: "Press Start 2P", sans-serif;
	}

	.profile-topbar {
		background-color: rgb(54, 54, 54);
		border-bottom: 10px solid #424242;
		padding: 20px;
		gap: 20px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.profile {
		position: absolute;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.5);
		display: flex;
		flex-direction: column;
		height: calc(90% - 6px);
		width: 100%;
	}

	@media only screen and (max-width: 768px) {
		.profile-topbar {
			justify-content: center;
		}
	}

	@media only screen and (min-width: 769px) and (min-height: 525px) {
		.profile {
			width: calc(75% - 10px);
			height: calc(90% - 10px);
		}
	}

	.profile-content {
		display: flex;
		flex-wrap: wrap;
		background: rgb(66, 66, 66);
		gap: 10px;
		flex: 1;
	}

	.profile-content > * {
		box-sizing: border-box;
		background: #8e8e8e;
		flex: 1;
		min-width: 250px;
	}

	.profile-title {
		font-size: 20px;
		display: flex;
		justify-content: center;
	}

	.profile-stats {
		overflow-y: auto;
	}

	.profile-game-history {
		overflow-y: auto;
		text-align: center;
	}

	.profile-tournament-history {
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
		margin-top: 20px;
		width: 100%;
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
		width: 100%;
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


// "tournament_win": self.tournaments.filter(state="done", winner=self).count() or 0,

	getAvatarUrl(profileLooking, picture) {
        if (profileLooking === state.profile.id)
            return picture
		const user = state.users.find(user => user.id === profileLooking);
		return user.picture
	}

	getWin(profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);

		if (!lookingUser)
			return 0;

		const winCount = state.games.filter(game => game.status === "done" && game.winner?.id === lookingUser.id).length;

		return winCount ? winCount : 0;
	}

	getLose(profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);

		if (!lookingUser)
			return 0;

		const loseCount = state.games.filter(game => game.status === "done" && game.players == lookingUser.nickname && game.winner?.id !== lookingUser.id).length;

		return loseCount ? loseCount : 0;
	}

	getTotal(profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);

		if (!lookingUser)
			return 0;

		const totalCount = state.games.filter(game => game.status === "done" && game.players == lookingUser.nickname).length;

		return totalCount ? totalCount : 0;
	}

	getWinRate(profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);

		if (!lookingUser)
			return 0;

		const totalCount = state.games.filter(game => game.status === "done" && game.players == lookingUser.nickname).length;
		const winCount = state.games.filter(game => game.status === "done" && game.winner?.id === lookingUser.id).length;

		const winRate = (winCount ? winCount : 0) / (totalCount ? totalCount : 1) * 100;
		return winRate.toFixed(2);
	}

	getBallHit(profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);

		if (!lookingUser)
			return 0;

		const ballHits = state.games.filter(game => game.status === "done" && game.players == lookingUser.nickname).reduce((sum, game) => sum + game.paddle_hits, 0);

		return ballHits ? ballHits : 0;
	}

	getWallHit(profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);

		if (!lookingUser)
			return 0;

		const wallHits = state.games.filter(game => game.status === "done" && game.players == lookingUser.nickname).reduce((sum, game) => sum + game.wall_hits, 0);

		return wallHits ? wallHits : 0;
	}

	getTournamentWin(profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);

		if (!lookingUser)
			return 0;

		const winCount = state.tournaments.filter(tournament => tournament.status === "done" && tournament.winner.id === lookingUser.id).length;

		return winCount ? winCount : 0;
	}

	getChartWin(profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);

		if (!lookingUser)
			return 0;

		const totalCount = state.games.filter(game => game.status === "done" && game.players == lookingUser.nickname).length;
		const winCount = state.games.filter(game => game.status === "done" && game.winner?.id === lookingUser.id).length;

		if (winCount == totalCount)
			return 'height: ' + 90 + '%';

		const ratio = (winCount / totalCount) * 90;
		const finalValue = Math.max(ratio, 8);

		return 'height: ' + finalValue + '%';
	}

	getChartLose(profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);

		if (!lookingUser)
			return 0;

		const totalCount = state.games.filter(game => game.status === "done" && game.players == lookingUser.nickname).length;
		const loseCount = state.games.filter(game => game.status === "done" && game.players == lookingUser.nickname && game.winner?.id !== lookingUser.id).length;

		if (loseCount == totalCount)
			return 'height: ' + 90 + '%';

		const ratio = (loseCount / totalCount) * 90;
		const finalValue = Math.max(ratio, 8);

		return 'height: ' + finalValue + '%';
	}

	getChartTotal(profileLooking) {
		const finalValue = 90;

		return 'height: ' + finalValue + '%';
	}

	getHiddenStatus(game, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const player = game.players.find(player => player === lookingUser.nickname);

		if (!player)
			return (true);
		if (game.status != "done")
			return (true);
		return (false);
	}

	getPlayerName(game, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const player1 = game.players.find(player => player === lookingUser.nickname);

		return player1;
	}

	getOtherPlayerName(game, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const player2 = game.players.find(player => player !== lookingUser.nickname);

		if (!player2)
			return "AI";
		return player2;
	}

	getPlayerScore(game, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const player = game.players.find(player => player === lookingUser.nickname);

		if (!player)
			return ;
		if (game.status != "done")
			return ;

		let score = 0;

		if (player == game.p1.nickname)
			score = game.p1_score;
		else
			score = game.p2_score;

		if (!score)
			score = 0;

		return '(' + score + ')';
	}

	getOtherPlayerScore(game, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const player = game.players.find(player => player !== lookingUser.nickname);

		if (!player) {
			const player1 = game.players.find(player => player === lookingUser.nickname);

			let score = 0;

			if (player1 == game.p2.nickname)
				score = game.p1_score;
			else
				score = game.p2_score;

			if (!score)
				score = 0;

			return '(' + score + ')';
		}
		if (game.status != "done")
			return ;

		let score = 0;

		if (player == game.p2.nickname)
			score = game.p2_score;
		else
			score = game.p1_score;

		if (!score)
			score = 0;

		return '(' + score + ')';
	}

	getGameStatus(game, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const player1 = game.players.find(player => player === lookingUser.nickname);
		const player2 = game.players.find(player => player !== lookingUser.nickname);

		if (!player1)
			return ;
		if (game.status != "done")
			return ;

		let score1 = 0;
		let score2 = 0;

		if (player1 == game.p1.nickname) {
			score1 = game.p1_score;
			score2 = game.p2_score;
		}
		else {
			score1 = game.p2_score;
			score2 = game.p1_score;
		}

		if (score1 == score2)
			return 'tie';
		else
			return score1 > score2 ? 'win' : 'lose'
	}

	getHiddenStatusTournament(game, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const player = game.players.find(player => player === lookingUser.nickname);

		if (!player)
			return (true);
		if (game.status != "done")
			return (true);
		return (false);
	}

	getTournamentStatus(game, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		if (game.status != "done")
			return ;

		const gameId = Math.max(...game.gamesId);
		if (!gameId)
			return ;

		const finalGame = state.games.find(game => game.id === gameId);
		if (!finalGame)
			return ;

		const player1 = finalGame.players.find(player => player == lookingUser.nickname);
		const player2 = finalGame.players.find(player => player !== lookingUser.nickname);
		if (!player1)
			return 'lose';
		if (!player2)
			return 'win';

		let score1 = 0;
		let score2 = 0;

		if (player1 == game.p1.nickname) {
			score1 = game.p1_score;
			score2 = game.p2_score;
		}
		else {
			score1 = game.p2_score;
			score2 = game.p1_score;
		}

		if (score1 == score2)
			return 'tie';
		else
			return score1 > score2 ? 'win' : 'lose'

	}

	getTournamentPlayerName(gameId, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const game = state.games.find(game => game.id === gameId);
		if (!game)
			return ;
		let player1 = game.players.find(player => player === lookingUser.nickname);
		if (!player1)
			player1 = game.players[0];

		return player1;
	}

	getTournamentOtherPlayerName(gameId, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const game = state.games.find(game => game.id === gameId);
		if (!game)
			return ;
		let player2 = game.players.find(player => player !== lookingUser.nickname);
		const player1 = game.players.find(player => player === lookingUser.nickname);
		if (!player1)
			player2 = game.players[1];

		return player2;
	}

	getTournamentPlayerScore(gameId, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const game = state.games.find(game => game.id === gameId);
		if (!game)
			return ;
		let player = game.players.find(player => player === lookingUser.nickname);

		if (!player)
			player = game.players[0];
		if (game.status != "done")
			return ;

		let score = 0;

		if (player == game.p1.nickname)
			score = game.p1_score;
		else
			score = game.p2_score;

		if (!score)
			score = 0;

		return '(' + score + ')';
	}

	getTournamentOtherPlayerScore(gameId, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const game = state.games.find(game => game.id === gameId);
		if (!game)
			return ;
		let player1 = game.players.find(player => player === lookingUser.nickname);
		let player2 = game.players.find(player => player !== lookingUser.nickname);

		if (!player1)
			player2 = game.players[1];
		if (!player2)
			return ;
		if (game.status != "done")
			return ;

		let score = 0;

		if (player2 == game.p2.nickname)
			score = game.p2_score;
		else
			score = game.p1_score;

		if (!score)
			score = 0;

		return '(' + score + ')';
	}

	getHiddenTourGames(gameId, profileLooking) {
		const lookingUser = state.users.find(user => user.id === profileLooking);
		const game = state.games.find(game => game.id === gameId);

		const player = game.players.find(player => player === lookingUser.nickname);
		if (!player)
			return true;
		return false;
	}

	getFormatedDate(timestamp) {
		const date = new Date(timestamp);

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');

		return `${day}/${month}/${year} ${hours}:${minutes}`;
	}
}

register(PongProfile);
