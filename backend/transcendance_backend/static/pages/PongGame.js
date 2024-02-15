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
				<button class="btn-mobileButtonPowerUp" @touchstart="this.buttonPowerUpStart()" @touchend="this.buttonPowerUpEnd()" hidden="{!isMobile}"></button>
				<div id="startIn" hidden="{!runningGame.startIn}">
					<div class="bg"></div>
					<h2>{language.Start} {runningGame.startIn}</h2>
					<span class="player-name-starting" id="player-left">{lastGame.p1.nickname}</span>
					<span class="player-name-starting" id="player-right">{this.getP2Nickname(lastGame.p2)}</span>
                    <div class="VS-logo">VS</div>
				</div>
				<div id="points" hidden="{runningGame.startIn}">
					<span id="pLPoints" class="points">{runningGame.pLPoints}</span>
					<span id="pRPoints" class="points">{runningGame.pRPoints}</span>
					<span class="player-name" id="player-left">{lastGame.p1.nickname}</span>
					<span class="player-name" id="player-right">{this.getP2Nickname(lastGame.p2)}</span>
					<div class="max-points">
						<span id="maxPoints">Objective: {lastGame.goal_objective}</span>
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
						<li hidden="{this.isWinner(lastGame)}">{this.WinnerMsg()}</li>
						<li hidden="{this.isLoser(lastGame)}">{this.LoserMsg()}</li>
					</ul>
					<button hidden="{!runningGame.gameOverState}" id="pong-button" class="leave" @click="this.leave()">
						<span class="front-leave">{language.leave}</span>
					</button>
				</div>
			</div>
		</div>
	`;
//<li>{this.getEndMsg()}</li>

//<li hidden="{!(state.lastGame && state.lastGame.winner && state.lastGame.winner.id == state.profile.id)}">{this.WinnerMsg()}</li>
//<li hidden="{!(state.lastGame && state.lastGame.winner && state.lastGame.winner.id != state.profile.id)}">{this.LoserMsg()}</li>
	static css = css`

    .VS-logo {
		position: absolute;
		bottom: 50px;
        margin: 20px;
        line-height: 2;
        font-size: 2.5vw;
        color: #ff8000;
        text-shadow:
            2px 2px 3px #ff6600,
            4px 4px 6px #cc3300,
            6px 6px 9px #993300;
    }
		.player-name {
			position: absolute;
  			color: white;
  			bottom: 0;
		}

		.player-name-starting {
			position: absolute;
  			color: white;
  			bottom: 0;
			padding: 20px;
			font-size: 28px;
			bottom: 55px;
		}

		#player-left {
  			left: 0;
		}

		#player-right {
  			right: 0;
		}

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
			z-index: 500;
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
			z-index: 40;
		}

		.btn-mobileButtonDown {
			cursor: pointer;
			position: absolute;
			width: 50%;
			height: 50%;
			right: 0;
			top: 0;
			opacity: 0;
			z-index: 40;
		}

		.btn-mobileButtonLeft {
			cursor: pointer;
			position: absolute;
			width: 50%;
			height: 50%;
			left: 0;
			bottom: 0;
			opacity: 0;
			z-index: 40;
		}

		.btn-mobileButtonRight {
			cursor: pointer;
			position: absolute;
			width: 50%;
			height: 50%;
			right: 0;
			bottom: 0;
			opacity: 0;
			z-index: 40;
		}

		.btn-mobileButtonPowerUp {
			cursor: pointer;
			position: absolute;
			width: 30%;
			height: 30%;
			right: 35%;
			bottom: 35%;
			opacity: 0;
			z-index: 50;
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
			height: 100%;
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
			width: 100%;
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

		#points {
   			width: 100%;
			position: absolute;
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

	buttonPowerUpStart() {
		this.game?.updateInputs(" ", true);
	}

	buttonPowerUpEnd() {
		this.game?.updateInputs(" ", false);
	}

	leave() {
		//if (state.tournament.status == 'round 1')
		navigateTo('/')
	}

    getP2Nickname(p2) {
        if (!p2)
            return ''
        return p2.id == -1 ? "Bot" : p2.nickname
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
			return (!true);
		var game = state.games.find(game => game.id == state.currentGame);
		if (game)
		{
			if (game.status == "done")
				return (!true);
		}
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

	isWinner(lastGame) {
		if (lastGame)
		{
			if (lastGame.winner)
			{
				if (lastGame.winner.id == profile.id)
					return (!true)
			}
		}
		return (!false)
	}

	isLoser(lastGame) {
		if (lastGame)
		{
			if (lastGame.winner)
			{
				if (lastGame.winner.id != profile.id)
					return (!false)
			}
		}
		return (!true)
	}

	WinnerMsg() {
		let randomNb = this.getRandomInt();
		let language = "en"

		if (state.language.WaitingRoom == "Salle d\'attente")
			language = "fr"
		else if (state.language.WaitingRoom == "Wartezimmer")
			language = "de"

		switch (randomNb) {
			case 0:
				if (language == "en")
					return "Congratulations! You triumphed as smoothly as flipping a pancake.";
				else if (language == "fr")
					return "Félicitations ! Tu as triomphé aussi facilement que retourner une crêpe.";
				else
					return "Herzlichen Glückwunsch! Du hast genauso reibungslos triumphiert wie das Wenden eines Pfannkuchens.";
			case 1:
				if (language == "en")
					return "You navigated through defenses like a ninja in a silent library.";
				else if (language == "fr")
					return "Tu as navigué à travers les défenses comme un ninja dans une bibliothèque silencieuse.";
				else
					return "Du bist durch die Verteidigung wie ein Ninja in einer stillen Bibliothek navigiert.";
			case 2:
				if (language == "en")
					return "You crushed your opponent like a bug under a boot. Squishy!";
				else if (language == "fr")
					return "Tu as écrasé ton adversaire comme un insecte sous une botte. Écrasé !";
				else
					return "Du hast deinen Gegner wie ein Insekt unter einem Stiefel zermalmt. Zerquetscht!";
			case 3:
				if (language == "en")
					return "Your victory was as sweet as stealing candy from a baby. Easy peasy!";
				else if (language == "fr")
					return "Ta victoire était aussi douce que de voler des bonbons à un bébé. Un jeu d'enfant !";
				else
					return "Dein Sieg war so süß wie das Stehlen von Bonbons von einem Baby. Ein Kinderspiel!";
			case 4:
				if (language == "en")
					return "You're on fire! Your opponent got toasted like a marshmallow at a bonfire.";
				else if (language == "fr")
					return "Tu es en feu ! Ton adversaire a été grillé comme une guimauve au feu de camp.";
				else
					return "Du bist in Flammen! Dein Gegner wurde wie eine Marshmallow am Lagerfeuer geröstet.";
			case 5:
				if (language == "en")
					return "You played like a boss! Your opponent was shaking like a leaf in a hurricane.";
				else if (language == "fr")
					return "Tu as joué comme un patron ! Ton adversaire tremblait comme une feuille dans un ouragan.";
				else
					return "Du hast gespielt wie ein Boss! Dein Gegner zitterte wie ein Blatt im Sturm.";
			case 6:
				if (language == "en")
					return "Your moves were smoother than butter on a hot skillet. Melted the competition!";
				else if (language == "fr")
					return "Tes mouvements étaient plus lisses que du beurre sur une poêle chaude. Tu as fait fondre la compétition !";
				else
					return "Deine Bewegungen waren glatter als Butter auf einer heißen Pfanne. Die Konkurrenz geschmolzen!";
			case 7:
				if (language == "en")
					return "You demolished your opponent like a wrecking ball through a house of cards. Total destruction!";
				else if (language == "fr")
					return "Tu as démoli ton adversaire comme une boule de démolition à travers un château de cartes. Destruction totale !";
				else
					return "Du hast deinen Gegner wie eine Abrisskugel durch ein Kartenhaus demoliert. Totale Zerstörung!";
			case 8:
				if (language == "en")
					return "You played like a pro! Your opponent was floundering like a fish out of water.";
				else if (language == "fr")
					return "Tu as joué comme un pro ! Ton adversaire barbotait comme un poisson hors de l'eau.";
				else
					return "Du hast wie ein Profi gespielt! Dein Gegner taumelte wie ein Fisch auf dem Trockenen.";
			case 9:
				if (language == "en")
					return "Your game was hotter than a jalapeño pepper. Your opponent couldn't handle the heat!";
				else if (language == "fr")
					return "Ton jeu était plus chaud qu'un piment jalapeño. Ton adversaire ne pouvait pas supporter la chaleur !";
				else
					return "Dein Spiel war heißer als ein Jalapeño-Pfeffer. Dein Gegner konnte die Hitze nicht ertragen!";
			case 10:
				if (language == "en")
					return "You schooled your opponent like a teacher with a naughty student. Class dismissed!";
				else if (language == "fr")
					return "Tu as éduqué ton adversaire comme un enseignant avec un élève désobéissant. Cours terminé !";
				else
					return "Du hast deinen Gegner wie ein Lehrer mit einem ungezogenen Schüler unterrichtet. Unterricht beendet!";
			case 11:
				if (language == "en")
					return "You dominated like a lion in a field of sheep. King of the jungle!";
				else if (language == "fr")
					return "Tu as dominé comme un lion dans un champ de moutons. Roi de la jungle !";
				else
					return "Du hast dominiert wie ein Löwe auf einer Weide voller Schafe. König des Dschungels!";
			case 12:
				if (language == "en")
					return "Your victory was as smooth as silk. Your opponent didn't stand a chance!";
				else if (language == "fr")
					return "Ta victoire était aussi lisse que la soie. Ton adversaire n'avait aucune chance !";
				else
					return "Dein Sieg war so glatt wie Seide. Dein Gegner hatte keine Chance!";
			case 13:
				if (language == "en")
					return "You played like a legend! Your opponent was left in the dust like roadkill.";
				else if (language == "fr")
					return "Tu as joué comme une légende ! Ton adversaire a été laissé dans la poussière comme de la viande écrasée sur la route.";
				else
					return "Du hast wie eine Legende gespielt! Dein Gegner wurde wie Roadkill im Staub zurückgelassen.";
			case 14:
				if (language == "en")
					return "You sliced through the competition like a hot knife through butter. Smooth and unstoppable!";
				else if (language == "fr")
					return "Tu as tranché à travers la concurrence comme un couteau chaud dans du beurre. Lisse et imparable !";
				else
					return "Du hast die Konkurrenz wie ein heißes Messer durch Butter geschnitten. Glatt und unaufhaltsam!";
			case 15:
				if (language == "en")
					return "Your game was as electrifying as a lightning strike. Shocking victory!";
				else if (language == "fr")
					return "Ton jeu était aussi électrisant qu'un éclair. Victoire choquante !";
				else
					return "Dein Spiel war so elektrisierend wie ein Blitzschlag. Schockierender Sieg!";
			case 16:
				if (language == "en")
					return "You smoked your opponent like a brisket on a barbecue. Finger-lickin' good!";
				else if (language == "fr")
					return "Tu as fumé ton adversaire comme un morceau de poitrine au barbecue. Bon à lécher les doigts !";
				else
					return "Du hast deinen Gegner wie ein Brisket auf einem Grill geraucht. Fingerleckend gut!";
			case 17:
				if (language == "en")
					return "You're unstoppable! Your opponent was as weak as a kitten in a dog park.";
				else if (language == "fr")
					return "Tu es imbattable ! Ton adversaire était aussi faible qu'un chaton dans un parc pour chiens.";
				else
					return "Du bist unaufhaltsam! Dein Gegner war so schwach wie ein Kätzchen in einem Hundepark.";
			case 18:
				if (language == "en")
					return "You played with the finesse of a ninja and the strength of a sumo wrestler. Flawless victory!";
				else if (language == "fr")
					return "Tu as joué avec la finesse d'un ninja et la force d'un sumo. Victoire sans faille !";
				else
					return "Du hast mit der Raffinesse eines Ninjas und der Stärke eines Sumō-Ringers gespielt. Makelloser Sieg!";
			case 19:
				if (language == "en")
					return "Your victory was as inevitable as gravity pulling an apple to the ground. Down went your opponent!";
				else if (language == "fr")
					return "Ta victoire était aussi inévitable que la gravité attirant une pomme vers le sol. Ton adversaire est tombé !";
				else
					return "Dein Sieg war so unvermeidlich wie die Schwerkraft, die einen Apfel zum Boden zieht. Dein Gegner ist gefallen!";
			case 20:
				if (language == "en")
					return "You're a gaming god! Your opponent was like a sacrificial lamb to the slaughter.";
				else if (language == "fr")
					return "Tu es un dieu du jeu ! Ton adversaire était comme un agneau sacrificiel à l'abattoir.";
				else
					return "Du bist ein Spielgott! Dein Gegner war wie ein Opferlamm für das Schlachthaus.";
			case 21:
				if (language == "en")
					return "You swept through the competition like a tornado through a trailer park. Devastating!";
				else if (language == "fr")
					return "Tu as balayé la concurrence comme une tornade à travers un parc de caravanes. Dévastateur !";
				else
					return "Du hast die Konkurrenz wie einen Tornado durch einen Trailer-Park gefegt. Verheerend!";
			case 22:
				if (language == "en")
					return "You played with the precision of a surgeon and the ferocity of a wild beast. No mercy!";
				else if (language == "fr")
					return "Tu as joué avec la précision d'un chirurgien et la férocité d'une bête sauvage. Pas de quartier !";
				else
					return "Du hast mit der Präzision eines Chirurgen und der Wildheit eines wilden Tieres gespielt. Keine Gnade!";
			case 23:
				if (language == "en")
					return "Your game was as smooth as silk pajamas on a Saturday morning. Comfortable and victorious!";
				else if (language == "fr")
					return "Ton jeu était aussi lisse que des pyjamas en soie un samedi matin. Confortable et victorieux !";
				else
					return "Dein Spiel war so glatt wie Seidenpyjamas an einem Samstagmorgen. Bequem und siegreich!";
			case 24:
				if (language == "en")
					return "You hammered your opponent like a nail into a board. Nailed it!";
				else if (language == "fr")
					return "Tu as martelé ton adversaire comme un clou dans une planche. Cloué !";
				else
					return "Du hast deinen Gegner wie einen Nagel in ein Brett gehämmert. Getroffen!";
			case 25:
				if (language == "en")
					return "You're as unstoppable as a freight train on a downhill slope. Choo choo!";
				else if (language == "fr")
					return "Tu es aussi irrésistible qu'un train de marchandises sur une pente descendante. Choo choo !";
				else
					return "Du bist unaufhaltsam wie ein Güterzug auf einer Abwärtsstrecke. Tschu Tschu!";
			case 26:
				if (language == "en")
					return "Your victory was as sweet as candy on Halloween night. Trick or treat!";
				else if (language == "fr")
					return "Ta victoire était aussi douce que des bonbons le soir d'Halloween. Bonbons ou bâtons !";
				else
					return "Dein Sieg war so süß wie Süßigkeiten an Halloween. Trick oder Behandlung!";
			case 27:
				if (language == "en")
					return "You played like a warrior on a battlefield. Your opponent was defeated like the enemy!";
				else if (language == "fr")
					return "Tu as joué comme un guerrier sur un champ de bataille. Ton adversaire a été vaincu comme l'ennemi !";
				else
					return "Du hast wie ein Krieger auf dem Schlachtfeld gespielt. Dein Gegner wurde wie der Feind besiegt!";
			case 28:
				if (language == "en")
					return "You crushed your opponent's dreams like a sledgehammer on a sandcastle. Shattered!";
				else if (language == "fr")
					return "Tu as écrasé les rêves de ton adversaire comme un marteau-piqueur sur un château de sable. Brisé !";
				else
					return "Du hast die Träume deines Gegners wie ein Vorschlaghammer auf einem Sandkasten zerschmettert. Zerschmettert!";
			case 29:
				if (language == "en")
					return "You're the master of the game! Your opponent was like a pawn in your hands.";
				else if (language == "fr")
					return "Tu es le maître du jeu ! Ton adversaire était comme un pion entre tes mains.";
				else
					return "Du bist der Meister des Spiels! Dein Gegner war wie ein Bauer in deinen Händen.";
			case 30:
				if (language == "en")
					return "Your game was as smooth as silk and as sharp as a knife. Sliced through the competition!";
				else if (language == "fr")
					return "Ton jeu était aussi lisse que la soie et aussi tranchant qu'un couteau. Tranché à travers la concurrence !";
				else
					return "Dein Spiel war so glatt wie Seide und so scharf wie ein Messer. Schnitt durch die Konkurrenz!";
			case 31:
				if (language == "en")
					return "You played like a gladiator in the arena. Your opponent fell like a defeated foe!";
				else if (language == "fr")
					return "Tu as joué comme un gladiateur dans l'arène. Ton adversaire est tombé comme un ennemi vaincu !";
				else
					return "Du hast wie ein Gladiator in der Arena gespielt. Dein Gegner fiel wie ein besiegender Feind!";
			case 32:
				if (language == "en")
					return "You mowed down your opponent like a lawnmower through a field of daisies. Cut 'em down!";
				else if (language == "fr")
					return "Tu as fauché ton adversaire comme une tondeuse à gazon à travers un champ de marguerites. Fauche les !";
				else
					return "Du hast deinen Gegner wie einen Rasenmäher durch ein Feld von Gänseblümchen gemäht. Schneide sie ab!";
			case 33:
				if (language == "en")
					return "You're a gaming legend! Your opponent was like a ghost in your path.";
				else if (language == "fr")
					return "Tu es une légende du jeu ! Ton adversaire était comme un fantôme sur ton chemin.";
				else
					return "Du bist eine Gaming-Legende! Dein Gegner war wie ein Geist auf deinem Weg.";
			case 34:
				if (language == "en")
					return "You played like a hero on a quest. Your opponent was vanquished like a villain!";
				else if (language == "fr")
					return "Tu as joué comme un héros en quête. Ton adversaire a été vaincu comme un méchant !";
				else
					return "Du hast wie ein Held auf einer Quest gespielt. Dein Gegner wurde wie ein Schurke besiegt!";
			case 35:
				if (language == "en")
					return "You danced through the game like a ballerina on stage. Graceful and victorious!";
				else if (language == "fr")
					return "Tu as dansé à travers le jeu comme une ballerine sur scène. Gracieuse et victorieuse !";
				else
					return "Du hast durch das Spiel wie eine Ballerina auf der Bühne getanzt. Anmutig und siegreich!";
			case 36:
				if (language == "en")
					return "You're the alpha gamer! Your opponent was just a beta in comparison.";
				else if (language == "fr")
					return "Tu es le gamer alpha ! Ton adversaire n'était qu'un bêta en comparaison.";
				else
					return "Du bist der Alpha-Gamer! Dein Gegner war nur ein Beta im Vergleich.";
			case 37:
				if (language == "en")
					return "Your game was as smooth as jazz on a summer night. Cool and victorious!";
				else if (language == "fr")
					return "Ton jeu était aussi lisse que le jazz par une nuit d'été. Cool et victorieux !";
				else
					return "Dein Spiel war so glatt wie Jazz an einem Sommerabend. Cool und siegreich!";
			case 38:
				if (language == "en")
					return "You bulldozed your opponent like a bulldozer through a pile of rubble. No survivors!";
				else if (language == "fr")
					return "Tu as déblayé ton adversaire comme un bulldozer à travers un tas de décombres. Aucun survivant !";
				else
					return "Du hast deinen Gegner wie ein Bulldozer durch einen Haufen Trümmer geschoben. Keine Überlebenden!";
			case 39:
				if (language == "en")
					return "You're a gaming virtuoso! Your opponent was like a beginner stumbling through the tutorial.";
				else if (language == "fr")
					return "Tu es un virtuose du jeu ! Ton adversaire était comme un débutant qui trébuche à travers le tutoriel.";
				else
					return "Du bist ein Gaming-Virtuose! Dein Gegner war wie ein Anfänger, der sich durch das Tutorial kämpfte.";
			case 40:
				if (language == "en")
					return "You played like a general on the battlefield. Victory was inevitable!";
				else if (language == "fr")
					return "Tu as joué comme un général sur le champ de bataille. La victoire était inévitable !";
				else
					return "Du hast wie ein General auf dem Schlachtfeld gespielt. Der Sieg war unvermeidlich!";
			case 41:
				if (language == "en")
					return "You decimated your opponent like a hurricane through a coastal town. Destruction!";
				else if (language == "fr")
					return "Tu as décimé ton adversaire comme un ouragan à travers une ville côtière. Destruction !";
				else
					return "Du hast deinen Gegner wie einen Hurrikan durch eine Küstenstadt dezimiert. Zerstörung!";
			case 42:
				if (language == "en")
					return "You're the MVP of the game! Your opponent was just another player on the bench.";
				else if (language == "fr")
					return "Tu es le MVP du jeu ! Ton adversaire n'était qu'un autre joueur sur le banc.";
				else
					return "Du bist der MVP des Spiels! Dein Gegner war nur ein weiterer Spieler auf der Bank.";
			case 43:
				if (language == "en")
					return "Your victory was as certain as the sunrise. Your opponent faded like the night!";
				else if (language == "fr")
					return "Ta victoire était aussi certaine que le lever du soleil. Ton adversaire s'est estompé comme la nuit !";
				else
					return "Dein Sieg war so sicher wie der Sonnenaufgang. Dein Gegner verblasste wie die Nacht!";
			case 44:
				if (language == "en")
					return "You played like a legend reborn. Your opponent was just a footnote in history!";
				else if (language == "fr")
					return "Tu as joué comme une légende ressuscitée. Ton adversaire n'était qu'une note de bas de page dans l'histoire !";
				else
					return "Du hast gespielt wie eine wiedergeborene Legende. Dein Gegner war nur eine Fußnote in der Geschichte!";
			case 45:
				if (language == "en")
					return "You bulldozed through the competition like a wrecking ball through a building. Destruction!";
				else if (language == "fr")
					return "Tu as défoncé la concurrence comme une boule de démolition à travers un bâtiment. Destruction !";
				else
					return "Du hast dich wie eine Abrissbirne durch die Konkurrenz gebaggert, wie eine Abrissbirne durch ein Gebäude. Zerstörung!";
			case 46:
				if (language == "en")
					return "You're a gaming prodigy! Your opponent was like a child with a toy.";
				else if (language == "fr")
					return "Tu es un prodige du jeu ! Ton adversaire était comme un enfant avec un jouet.";
				else
					return "Du bist ein Gaming-Wunderkind! Dein Gegner war wie ein Kind mit einem Spielzeug.";
			case 47:
				if (language == "en")
					return "You played like a maestro conducting a symphony. Your opponent was just another note.";
				else if (language == "fr")
					return "Tu as joué comme un maestro dirigeant une symphonie. Ton adversaire n'était qu'une autre note.";
				else
					return "Du hast wie ein Maestro eine Symphonie dirigiert. Dein Gegner war nur eine weitere Note.";
			case 48:
				if (language == "en")
					return "You're a gaming phenomenon! Your opponent was like a glitch in the system.";
				else if (language == "fr")
					return "Tu es un phénomène du jeu ! Ton adversaire était comme un glitch dans le système.";
				else
					return "Du bist ein Gaming-Phänomen! Dein Gegner war wie ein Fehler im System.";
			case 49:
				if (language == "en")
					return "Your game was as smooth as silk and as fierce as a lion. Majestic victory!";
				else if (language == "fr")
					return "Ton jeu était aussi lisse que la soie et aussi féroce qu'un lion. Victoire majestueuse !";
				else
					return "Dein Spiel war so glatt wie Seide und so wild wie ein Löwe. Majestätischer Sieg!";
			default:
				return "Congratulations! You triumphed!";
		}
	}

	LoserMsg() {
		let randomNb = this.getRandomInt();
	
		let language = "en"

		if (state.language.WaitingRoom == "Salle d\'attente")
			language = "fr"
		else if (state.language.WaitingRoom == "Wartezimmer")
			language = "de"

		switch(randomNb) {
			case 0:
				if (language == "en")
					return "Ouch! You were squashed like a bug.";
				else if (language == "fr")
					return "Aïe ! Tu as été écrasé comme un insecte.";
				else
					return "Autsch! Du wurdest wie ein Käfer zerquetscht.";
			case 1:
				if (language == "en")
					return "Defeated like a ninja caught in daylight.";
				else if (language == "fr")
					return "Défait comme un ninja pris au piège en plein jour.";
				else
					return "Besiegt wie ein Ninja, der im Tageslicht gefangen wurde.";
			case 2:
				if (language == "en")
					return "You crumbled like a cookie under pressure.";
				else if (language == "fr")
					return "Tu as craqué comme un biscuit sous pression.";
				else
					return "Du bist unter Druck wie ein Keks zerbröckelt.";
			case 3:
				if (language == "en")
					return "Tough luck! Your game was as shaky as a Jenga tower.";
				else if (language == "fr")
					return "Pas de chance ! Ton jeu était aussi instable qu'une tour de Jenga.";
				else
					return "Pech gehabt! Dein Spiel war so wackelig wie ein Jenga-Turm.";
			case 4:
				if (language == "en")
					return "Burned out like a candle in a hurricane.";
				else if (language == "fr")
					return "Consumé comme une bougie dans un ouragan.";
				else
					return "Ausgebrannt wie eine Kerze in einem Hurrikan.";
			case 5:
				if (language == "en")
					return "Lost like a sailor without a compass.";
				else if (language == "fr")
					return "Perdu comme un marin sans boussole.";
				else
					return "Verloren wie ein Seemann ohne Kompass.";
			case 6:
				if (language == "en")
					return "Your game was as smooth as sandpaper.";
				else if (language == "fr")
					return "Ton jeu était aussi lisse que du papier de verre.";
				else
					return "Dein Spiel war so glatt wie Schmirgelpapier.";
			case 7:
				if (language == "en")
					return "Destroyed like a sandcastle at high tide.";
				else if (language == "fr")
					return "Détruit comme un château de sable à marée haute.";
				else
					return "Zerstört wie ein Sandburg bei Flut.";
			case 8:
				if (language == "en")
					return "Floundered like a fish out of water.";
				else if (language == "fr")
					return "Piétiné comme un poisson hors de l'eau.";
				else
					return "Gestolpert wie ein Fisch außerhalb des Wassers.";
			case 9:
				if (language == "en")
					return "Your game was colder than a polar bear's toe nails.";
				else if (language == "fr")
					return "Ton jeu était plus froid que les ongles de pied d'un ours polaire.";
				else
					return "Dein Spiel war kälter als die Zehennägel eines Eisbären.";
			case 10:
				if (language == "en")
					return "Failed like a student skipping class.";
				else if (language == "fr")
					return "Échoué comme un élève qui séchait les cours.";
				else
					return "Gescheitert wie ein Schüler, der den Unterricht schwänzt.";
			case 11:
				if (language == "en")
					return "Tamed like a lamb in a lion's den.";
				else if (language == "fr")
					return "Dompté comme un agneau dans la tanière d'un lion.";
				else
					return "Zähmte wie ein Lamm in der Höhle eines Löwen.";
			case 12:
				if (language == "en")
					return "Your defeat was as predictable as a sunrise.";
				else if (language == "fr")
					return "Ta défaite était aussi prévisible que le lever du soleil.";
				else
					return "Deine Niederlage war so vorhersehbar wie ein Sonnenaufgang.";
			case 13:
				if (language == "en")
					return "Outplayed like a broken record.";
				else if (language == "fr")
					return "Surpassé comme un disque rayé.";
				else
					return "Überspielt wie eine kaputte Schallplatte.";
			case 14:
				if (language == "en")
					return "Sliced and diced like a dull kitchen knife.";
				else if (language == "fr")
					return "Tranché et découpé comme un couteau de cuisine émoussé.";
				else
					return "Zerschnitten und gewürfelt wie ein stumpfes Küchenmesser.";
			case 15:
				if (language == "en")
					return "Shocking loss! Like getting struck by lightning.";
				else if (language == "fr")
					return "Défaite choquante ! Comme être frappé par la foudre.";
				else
					return "Schockierender Verlust! Wie vom Blitz getroffen werden.";
			case 16:
				if (language == "en")
					return "Smoked like a cheap cigar.";
				else if (language == "fr")
					return "Fumé comme un cigare bon marché.";
				else
					return "Geraucht wie eine billige Zigarre.";
			case 17:
				if (language == "en")
					return "Weak as a kitten in a dogfight.";
				else if (language == "fr")
					return "Faible comme un chaton dans une bagarre de chiens.";
				else
					return "Schwach wie ein Kätzchen in einem Hundekampf.";
			case 18:
				if (language == "en")
					return "Clumsy as a bull in a china shop.";
				else if (language == "fr")
					return "Maladroit comme un taureau dans un magasin de porcelaine.";
				else
					return "Tollpatschig wie ein Stier in einem Porzellanladen.";
			case 19:
				if (language == "en")
					return "Your defeat fell like an anvil from the sky.";
				else if (language == "fr")
					return "Ta défaite est tombée comme un enclume du ciel.";
				else
					return "Deine Niederlage fiel wie ein Amboss vom Himmel.";
			case 20:
				if (language == "en")
					return "Like a lamb to the slaughter.";
				else if (language == "fr")
					return "Comme un agneau à l'abattoir.";
				else
					return "Wie ein Lamm zum Schlachter.";
			case 21:
				if (language == "en")
					return "Blown away like a leaf in a hurricane.";
				else if (language == "fr")
					return "Emporté comme une feuille dans un ouragan.";
				else
					return "Weggeblasen wie ein Blatt in einem Hurrikan.";
			case 22:
				if (language == "en")
					return "Your game was as precise as a blindfolded archer.";
				else if (language == "fr")
					return "Ton jeu était aussi précis qu'un archer les yeux bandés.";
				else
					return "Dein Spiel war so präzise wie ein blindfoldeter Bogenschütze.";
			case 23:
				if (language == "en")
					return "Rough as sandpaper on a sunburn.";
				else if (language == "fr")
					return "Rugueux comme du papier de verre sur un coup de soleil.";
				else
					return "Rau wie Schmirgelpapier auf einem Sonnenbrand.";
			case 24:
				if (language == "en")
					return "Nailed to the wall like a picture frame.";
				else if (language == "fr")
					return "Cloué au mur comme un cadre.";
				else
					return "An die Wand genagelt wie ein Bilderrahmen.";
			case 25:
				if (language == "en")
					return "Like a speed bump on the road to victory.";
				else if (language == "fr")
					return "Comme un dos d'âne sur la route de la victoire.";
				else
					return "Wie eine Bodenschwelle auf dem Weg zum Sieg.";
			case 26:
				if (language == "en")
					return "Bitter loss, sour as unripe fruit.";
				else if (language == "fr")
					return "Défaite amère, acide comme un fruit pas mûr.";
				else
					return "Bittere Niederlage, sauer wie unreifes Obst.";
			case 27:
				if (language == "en")
					return "Defeated like a soldier without a sword.";
				else if (language == "fr")
					return "Défait comme un soldat sans épée.";
				else
					return "Besiegt wie ein Soldat ohne Schwert.";
			case 28:
				if (language == "en")
					return "Crushed dreams like stepping on a bubble wrap.";
				else if (language == "fr")
					return "Écrasé les rêves comme marcher sur du papier bulle.";
				else
					return "Zerquetschte Träume wie das Treten auf einer Luftpolsterfolie.";
			case 29:
				if (language == "en")
					return "Pawn in a game of chess.";
				else if (language == "fr")
					return "Pion dans un jeu d'échecs.";
				else
					return "Bauer in einem Schachspiel.";
			case 30:
				if (language == "en")
					return "Your defeat cut like a blunt knife.";
				else if (language == "fr")
					return "Ta défaite coupée comme un couteau émoussé.";
				else
					return "Deine Niederlage schnitt wie ein stumpfes Messer.";
			case 31:
				if (language == "en")
					return "Defeated like a gladiator with a paper sword.";
				else if (language == "fr")
					return "Défait comme un gladiateur avec une épée en papier.";
				else
					return "Besiegt wie ein Gladiator mit einem Papierschwert.";
			case 32:
				if (language == "en")
					return "Mowed down like grass in a lawnmower's path.";
				else if (language == "fr")
					return "Fauché comme de l'herbe dans le chemin d'une tondeuse.";
				else
					return "Gemäht wie Gras auf dem Weg eines Rasenmähers.";
			case 33:
				if (language == "en")
					return "Ghost of a chance, you vanished without a trace.";
				else if (language == "fr")
					return "Chance de fantôme, tu as disparu sans laisser de trace.";
				else
					return "Geist einer Chance, du bist spurlos verschwunden.";
			case 34:
				if (language == "en")
					return "Villain vanquished, hero stands tall.";
				else if (language == "fr")
					return "Méchant vaincu, le héros se dresse fièrement.";
				else
					return "Schurke besiegt, Held steht hoch.";
			case 35:
				if (language == "en")
					return "Tripped over your own shoelaces.";
				else if (language == "fr")
					return "Trébuché sur tes lacets.";
				else
					return "Über deine eigenen Schnürsenkel gestolpert.";
			case 36:
				if (language == "en")
					return "Beta in a world of alphas.";
				else if (language == "fr")
					return "Bêta dans un monde d'alpha.";
				else
					return "Beta in einer Welt der Alphas.";
			case 37:
				if (language == "en")
					return "Your defeat was as discordant as a broken record.";
				else if (language == "fr")
					return "Ta défaite était aussi discordante qu'un disque rayé.";
				else
					return "Deine Niederlage war so dissonant wie eine kaputte Schallplatte.";
			case 38:
				if (language == "en")
					return "Bulldozed like a house in the path of progress.";
				else if (language == "fr")
					return "Détruit comme une maison sur le chemin du progrès.";
				else
					return "Wie ein Haus im Weg des Fortschritts plattgemacht.";
			case 39:
				if (language == "en")
					return "Beginner's mistake, you played like a novice.";
				else if (language == "fr")
					return "Erreur de débutant, tu as joué comme un novice.";
				else
					return "Anfängerfehler, du hast wie ein Anfänger gespielt.";
			case 40:
				if (language == "en")
					return "Defeated like a general without a strategy.";
				else if (language == "fr")
					return "Défait comme un général sans stratégie.";
				else
					return "Besiegt wie ein General ohne Strategie.";
			case 41:
				if (language == "en")
					return "Torn apart like a house in a tornado's path.";
				else if (language == "fr")
					return "Déchiré comme une maison sur le chemin d'une tornade.";
				else
					return "Zerrissen wie ein Haus auf dem Weg eines Tornados.";
			case 42:
				if (language == "en")
					return "Benchwarmer in the game of champions.";
				else if (language == "fr")
					return "Joueur remplaçant dans le jeu des champions.";
				else
					return "Ersatzspieler im Spiel der Champions.";
			case 43:
				if (language == "en")
					return "Your defeat was as inevitable as the tides.";
				else if (language == "fr")
					return "Ta défaite était aussi inévitable que les marées.";
				else
					return "Deine Niederlage war so unausweichlich wie die Gezeiten.";
			case 44:
				if (language == "en")
					return "Forgotten like yesterday's news.";
				else if (language == "fr")
					return "Oublié comme les nouvelles d'hier.";
				else
					return "Vergessen wie die Nachrichten von gestern.";
			case 45:
				if (language == "en")
					return "Crushed like an aluminum can in a recycling plant.";
				else if (language == "fr")
					return "Écrasé comme une canette en aluminium dans une usine de recyclage.";
				else
					return "Zerquetscht wie eine Aluminiumdose in einer Recyclinganlage.";
			case 46:
				if (language == "en")
					return "Child's play for your opponent.";
				else if (language == "fr")
					return "Un jeu d'enfant pour ton adversaire.";
				else
					return "Kinderspiel für deinen Gegner.";
			case 47:
				if (language == "en")
					return "Your defeat was as blunt as a butter knife.";
				else if (language == "fr")
					return "Ta défaite était aussi brutale qu'un couteau à beurre.";
				else
					return "Deine Niederlage war so stumpf wie ein Buttermesser.";
			case 48:
				if (language == "en")
					return "Spectator in the game of champions.";
				else if (language == "fr")
					return "Spectateur dans le jeu des champions.";
				else
					return "Zuschauer im Spiel der Champions.";
			case 49:
				if (language == "en")
					return "Lost like a mouse in a maze.";
				else if (language == "fr")
					return "Perdu comme une souris dans un labyrinthe.";
				else
					return "Verloren wie eine Maus in einem Labyrinth.";
			default:
				if (language == "en")
					return "Better luck next time! Learn from your mistakes.";
				else if (language == "fr")
					return "Meilleure chance la prochaine fois ! Apprends de tes erreurs.";
				else
					return "Viel Glück beim nächsten Mal! Lerne aus deinen Fehlern.";
		}
	}
	
}

register(PongGame);
