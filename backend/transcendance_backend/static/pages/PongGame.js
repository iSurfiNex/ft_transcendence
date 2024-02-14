import { Component, register, html, css } from "pouic";
import { observe } from "pouic";
import { PongGameCanvas } from "pong_game";

class PongGame extends Component {
	static template = html`

		<div id="gameContainer"></div>
		<div class="center">
			<div id="gameOverlay">
				<button class="btn-mobileButtonUp" @touchstart="this.upButtonStart()" @touchend="this.upButtonEnd()" hidden="{!isMobile}"></button>
				<button class="btn-mobileButtonDown" @touchstart="this.downButtonStart()" @touchend="this.downButtonEnd()" hidden="{!isMobile}"></button>
				<button class="btn-mobileButtonLeft" @touchstart="this.leftButtonStart()" @touchend="this.leftButtonEnd()" hidden="{!isMobile}"></button>
				<button class="btn-mobileButtonRight" @touchstart="this.rightButtonStart()" @touchend="this.rightButtonEnd()" hidden="{!isMobile}"></button>
				<div id="startIn" hidden="{!runningGame.startIn}">
					<div class="bg"></div>
					<h2>{language.Start} {runningGame.startIn}</h2>
				</div>
				<div id="points" hidden="{runningGame.startIn}">
					<span id="pLPoints" class="points">{runningGame.pLPoints}</span>
					<span id="pRPoints" class="points">{runningGame.pRPoints}</span>
					<div class="max-points">
						<span id="maxPoints">Objective: {game.goal_objective}</span>
					</div>
				</div>
				<div id="gameOverLayer" hidden="{!runningGame.gameOverState}">
					<div class="bg"></div>
					<span id="gameOverTxt">{language.gameOver}</span>
					<span id="gameOverState" class="blinking"
						>{lang(runningGame.gameOverState)}</span>
					<ul class="stat-list">
						<li>Ball hit: {lastGame.paddle_hits} times</li>
						<li>Wall hit: {lastGame.wall_hits} times</li>
						<li>\n</li>
						<li>{this.getEndMsg()}</li>
					</ul>
					<button hidden="{!runningGame.gameOverState}" id="pong-button" class="leave" @click="this.leave()">
						<span class="front-leave">{language.leave}</span>
					</button>
				</div>
			</div>
		</div>
	`;

	static css = css`
		#info {
			position: absolute;
			bottom: 65px;
		}

		.leave {
			background: hsl(130, 100%, 32%);
			border-radius: 12px;
			border: none;
			padding: 0;
			cursor: pointer;
			outline-offset: 4px;
			margin: 10px 30px;
		}

		.front-leave {
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

		.btn-mobileButtonUp {
			cursor: pointer;
			position: absolute;
			width: 50%;
			height: 50%;
			left: 0;
			top: 0;
			opacity: 0;
		}

		.btn-mobileButtonDown {
			cursor: pointer;
			position: absolute;
			width: 50%;
			height: 50%;
			right: 0;
			top: 0;
			opacity: 0;
		}

		.btn-mobileButtonLeft {
			cursor: pointer;
			position: absolute;
			width: 50%;
			height: 50%;
			left: 0;
			bottom: 0;
			opacity: 0;
		}

		.btn-mobileButtonRight {
			cursor: pointer;
			position: absolute;
			width: 50%;
			height: 50%;
			right: 0;
			bottom: 0;
			opacity: 0;
		}

		.btn-giveUp:hover {
			background-color: #ff0000;
			color: #2a2a2a;
			opacity: 1;
		}

		.btn-leave:hover {
			background-color: #00ff00;
			color: #2a2a2a;
			opacity: 1;
		}

		:host {
			position: absolute;
			right: 0;
			bottom: 0;
			height: calc(90% - 6px);
			width: 100%;
			font-family: "Press Start 2P", sans-serif;
			font-weight: bold;
		}

		@media only screen and (min-width: 769px) and (min-height: 525px) {
			:host {
				width: calc(75% - 10px);
				height: calc(90% - 10px);
			}
		}

		#gameContainer {
			width: 100%;
			height: 100%;
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
		}

		canvas {
			width: calc(100% - 10px);
			overflow: hidden;
		}

		#gameOverlay,
		#startIn,
		.bg,
		#gameOverLayer {
			position: absolute;
			width: 100%;
			height: 100%;
			overflow: hidden;
		}

		#gameOverlay {
			border: 5px solid white;
		}

		.center {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
		}

		.bg {
			background: black;
			opacity: 0.8;
		}

		#startIn {
			display: flex;
			justify-content: center;
		}

		#startIn > h2 {
			position: relative;
			margin-top: 80px;
			color: white;
		}

		[hidden] {
			display: none !important;
		}

		.points {
			position: absolute;
			font-size: 44px;
			color: white;
			opacity: 0.6;
		}

		#pLPoints {
			top: 40px;
			right: 50%;
			padding-right: 40px;
		}

		#pRPoints {
			top: 40px;
			left: 50%;
			padding-left: 40px;
		}

		#maxPoints {
			font-size: 16px;
			color: white;
		}

		.max-points {
			text-align:center;
			top: 0;
			width: 100%;
			color: white;
		}

		#gameOverLayer {
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: white;
			text-align: center;
		}

		#gameOverTxt {
			font-size: 40px;
		}

		#gameOverState {
			font-size: 60px;
			margin-top: 20px;
		}

		.stat-list {
			position: relative;
			list-style-type: none;
		}

		@keyframes blink {
			0% {
				opacity: 1;
			}
			80% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}

		.blinking {
			animation: blink 1.5s infinite;
		}

		@media (max-width: 500px) {
			#gameOverTxt {
				font-size: 20px;
			}

			#gameOverState {
				font-size: 30px;
			}
		}
	`;

	constructor() {
		super();
		this.updatedStartIn(state.game.started_at);
	}

	giveUp() {
		get("/api/giveup/");
	}

	upButtonStart() {
		this.game?.updateInputs("w", true);
	}

	upButtonEnd() {
		this.game?.updateInputs("w", false);
	}

	downButtonStart() {
		this.game?.updateInputs("s", true);
	}

	downButtonEnd() {
		this.game?.updateInputs("s", false);
	}

	leftButtonStart() {
		this.game?.updateInputs("a", true);
	}

	leftButtonEnd() {
		this.game?.updateInputs("a", false);
	}

	rightButtonStart() {
		this.game?.updateInputs("d", true);
	}

	rightButtonEnd() {
		this.game?.updateInputs("d", false);
	}

	leave() {
		//if (state.tournament.status == 'round 1')
		navigateTo('/')
	}

	updatedStartIn(startedAt) {
		if (this.timeoutId) clearTimeout(this.timeoutId);
		const remainingTime = startedAt - Date.now();
		if (remainingTime < 0) state.runningGame.startIn = null;
		else {
			state.runningGame.startIn = Math.round(remainingTime / 1000);
			const nextSecDelay = Math.round(remainingTime % 1000);
			this.timeoutId = setTimeout(
				this.updatedStartIn.bind(this, startedAt),
				nextSecDelay,
			);
		}
	}

	connectedCallback() {
		Promise.all(PongGame.sheets).then(() => this.initGame());
		window.addEventListener("resize", this.setCanvasSize.bind(this));
	}

	initGame() {
		this.gameContainer = this.shadowRoot.getElementById("gameContainer");
		this.canvasRatio = 600 / 800;
		this.game = new PongGameCanvas(this.gameContainer);
		this.setCanvasSize();
	}

	setCanvasSize() {
		let w = this.gameContainer.clientWidth;
		let h = this.gameContainer.clientWidth * this.canvasRatio;

		if (h > this.gameContainer.clientHeight) {
			h = this.gameContainer.clientHeight;
			w = h / this.canvasRatio;
		}

		this.game?.renderer?.setSize(w, h);
		const overlayNode = this.shadowRoot.getElementById("gameOverlay");
		overlayNode.style.width = "calc(" + w + "px" + " - 10px)";
		overlayNode.style.height = "calc(" + h + "px" + " - 10px)";
	}

	isGameFinished() {
		if (state.currentGame == -1)
		{
			console.log("======================================   BP 1    ============================");
			return (!true);
		}
		var game = state.games.find(game => game.id == state.currentGame);
		if (game)
		{
			console.log("======================================   BP 2    ============================");
			if (game.status == "done")
				return (!true);
		}
		console.log("======================================   BP 3    ============================");
		return (!false);
	}

	isGameRunning() {
		if (state.currentGame == -1)
			return (!false);

		var game = state.games.find(game => game.id == state.currentGame);
		if (game)
		{
			if (game.status == "running")
				return (true);
		}
		return (!false);
	}

	getRandomInt() {
		return Math.floor(Math.random() * 100);
	}

	getEndMsg() {
		let randomNb = this.getRandomInt();
		//let my_user = state.users.find(user => user.nickname == state.profile.nickname);
		//let game = state.games.find(game => game.id == my_user.lastGameId);

		//if (game.winner == state.profile.nickname)
			return(this.getWinnerMsg(randomNb));

		//else
		//  return(this.getLoserMsg(randomNb));
	}

	getWinnerMsg(randomNb) {
		switch(randomNb) {
				case 0:
						return "Congratulations! You triumphed as smoothly as flipping a pancake.";
				case 1:
						return "You navigated through defenses like a ninja in a silent library.";
				case 2:
						return "You crushed your opponent like a bug under a boot. Squishy!";
				case 3:
						return "Your victory was as sweet as stealing candy from a baby. Easy peasy!";
				case 4:
						return "You're on fire! Your opponent got toasted like a marshmallow at a bonfire.";
				case 5:
						return "You played like a boss! Your opponent was shaking like a leaf in a hurricane.";
				case 6:
						return "Your moves were smoother than butter on a hot skillet. Melted the competition!";
				case 7:
						return "You demolished your opponent like a wrecking ball through a house of cards. Total destruction!";
				case 8:
						return "You played like a pro! Your opponent was floundering like a fish out of water.";
				case 9:
						return "Your game was hotter than a jalapeño pepper. Your opponent couldn't handle the heat!";
				case 10:
						return "You schooled your opponent like a teacher with a naughty student. Class dismissed!";
				case 11:
						return "You dominated like a lion in a field of sheep. King of the jungle!";
				case 12:
						return "Your victory was as smooth as silk. Your opponent didn't stand a chance!";
				case 13:
						return "You played like a legend! Your opponent was left in the dust like roadkill.";
				case 14:
						return "You sliced through the competition like a hot knife through butter. Smooth and unstoppable!";
				case 15:
						return "Your game was as electrifying as a lightning strike. Shocking victory!";
				case 16:
						return "You smoked your opponent like a brisket on a barbecue. Finger-lickin' good!";
				case 17:
						return "You're unstoppable! Your opponent was as weak as a kitten in a dog park.";
				case 18:
						return "You played with the finesse of a ninja and the strength of a sumo wrestler. Flawless victory!";
				case 19:
						return "Your victory was as inevitable as gravity pulling an apple to the ground. Down went your opponent!";
				case 20:
						return "You're a gaming god! Your opponent was like a sacrificial lamb to the slaughter.";
				case 21:
						return "You swept through the competition like a tornado through a trailer park. Devastating!";
				case 22:
						return "You played with the precision of a surgeon and the ferocity of a wild beast. No mercy!";
				case 23:
						return "Your game was as smooth as silk pajamas on a Saturday morning. Comfortable and victorious!";
				case 24:
						return "You hammered your opponent like a nail into a board. Nailed it!";
				case 25:
						return "You're as unstoppable as a freight train on a downhill slope. Choo choo!";
				case 26:
						return "Your victory was as sweet as candy on Halloween night. Trick or treat!";
				case 27:
						return "You played like a warrior on a battlefield. Your opponent was defeated like the enemy!";
				case 28:
						return "You crushed your opponent's dreams like a sledgehammer on a sandcastle. Shattered!";
				case 29:
						return "You're the master of the game! Your opponent was like a pawn in your hands.";
				case 30:
						return "Your game was as smooth as silk and as sharp as a knife. Sliced through the competition!";
				case 31:
						return "You played like a gladiator in the arena. Your opponent fell like a defeated foe!";
				case 32:
						return "You mowed down your opponent like a lawnmower through a field of daisies. Cut 'em down!";
				case 33:
						return "You're a gaming legend! Your opponent was like a ghost in your path.";
				case 34:
						return "You played like a hero on a quest. Your opponent was vanquished like a villain!";
				case 35:
						return "You danced through the game like a ballerina on stage. Graceful and victorious!";
				case 36:
						return "You're the alpha gamer! Your opponent was just a beta in comparison.";
				case 37:
						return "Your game was as smooth as jazz on a summer night. Cool and victorious!";
				case 38:
						return "You bulldozed your opponent like a bulldozer through a pile of rubble. No survivors!";
				case 39:
						return "You're a gaming virtuoso! Your opponent was like a beginner stumbling through the tutorial.";
				case 40:
						return "You played like a general on the battlefield. Victory was inevitable!";
				case 41:
						return "You decimated your opponent like a hurricane through a coastal town. Destruction!";
				case 42:
						return "You're the MVP of the game! Your opponent was just another player on the bench.";
				case 43:
						return "Your victory was as certain as the sunrise. Your opponent faded like the night!";
				case 44:
						return "You played like a legend reborn. Your opponent was just a footnote in history!";
				case 45:
						return "You bulldozed through the competition like a wrecking ball through a building. Destruction!";
				case 46:
						return "You're a gaming prodigy! Your opponent was like a child with a toy.";
				case 47:
						return "Your game was as smooth as silk and as sharp as a razor. Cut through the competition!";
				case 48:
						return "You played like a champion on the field. Your opponent was left in the dust!";
				case 49:
						return "You're a gaming genius! Your opponent was like a mouse in a maze.";
				default:
						return "You're the ultimate winner! Your opponent was left in awe.";
			}
	}

	getLoserMsg(randomNb) {
		switch(randomNb) {
				case 0:
						return "Ouch! You were squashed like a bug.";
				case 1:
						return "Defeated like a ninja caught in daylight.";
				case 2:
						return "You crumbled like a cookie under pressure.";
				case 3:
						return "Tough luck! Your game was as shaky as a Jenga tower.";
				case 4:
						return "Burned out like a candle in a hurricane.";
				case 5:
						return "Lost like a sailor without a compass.";
				case 6:
						return "Your game was as smooth as sandpaper.";
				case 7:
						return "Destroyed like a sandcastle at high tide.";
				case 8:
						return "Floundered like a fish out of water.";
				case 9:
						return "Your game was colder than a polar bear's toe nails.";
				case 10:
						return "Failed like a student skipping class.";
				case 11:
						return "Tamed like a lamb in a lion's den.";
				case 12:
						return "Your defeat was as predictable as a sunrise.";
				case 13:
						return "Outplayed like a broken record.";
				case 14:
						return "Sliced and diced like a dull kitchen knife.";
				case 15:
						return "Shocking loss! Like getting struck by lightning.";
				case 16:
						return "Smoked like a cheap cigar.";
				case 17:
						return "Weak as a kitten in a dogfight.";
				case 18:
						return "Clumsy as a bull in a china shop.";
				case 19:
						return "Your defeat fell like an anvil from the sky.";
				case 20:
						return "Like a lamb to the slaughter.";
				case 21:
						return "Blown away like a leaf in a hurricane.";
				case 22:
						return "Your game was as precise as a blindfolded archer.";
				case 23:
						return "Rough as sandpaper on a sunburn.";
				case 24:
						return "Nailed to the wall like a picture frame.";
				case 25:
						return "Like a speed bump on the road to victory.";
				case 26:
						return "Bitter loss, sour as unripe fruit.";
				case 27:
						return "Defeated like a soldier without a sword.";
				case 28:
						return "Crushed dreams like stepping on a bubble wrap.";
				case 29:
						return "Pawn in a game of chess.";
				case 30:
						return "Your defeat cut like a blunt knife.";
				case 31:
						return "Defeated like a gladiator with a paper sword.";
				case 32:
						return "Mowed down like grass in a lawnmower's path.";
				case 33:
						return "Ghost of a chance, you vanished without a trace.";
				case 34:
						return "Villain vanquished, hero stands tall.";
				case 35:
						return "Tripped over your own shoelaces.";
				case 36:
						return "Beta in a world of alphas.";
				case 37:
						return "Your defeat was as discordant as a broken record.";
				case 38:
						return "Bulldozed like a house in the path of progress.";
				case 39:
						return "Beginner's mistake, you played like a novice.";
				case 40:
						return "Defeated like a general without a strategy.";
				case 41:
						return "Torn apart like a house in a tornado's path.";
				case 42:
						return "Benchwarmer in the game of champions.";
				case 43:
						return "Your defeat was as inevitable as the tides.";
				case 44:
						return "Forgotten like yesterday's news.";
				case 45:
						return "Crushed like an aluminum can in a recycling plant.";
				case 46:
						return "Child's play for your opponent.";
				case 47:
						return "Your defeat was as blunt as a butter knife.";
				case 48:
						return "Spectator in the game of champions.";
				case 49:
						return "Lost like a mouse in a maze.";
				default:
						return "Better luck next time! Learn from your mistakes.";
			}
	}


}

register(PongGame);
