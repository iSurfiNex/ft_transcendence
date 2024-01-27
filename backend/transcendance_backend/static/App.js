import {setup} from "./pouic/state.js"

/* Global function to start a WebSocket connection. If page protocol is https, start wss connection otherwise ws. Exemple if page is https://localhost:8000/start-game and you call ws('chat'), a connection will open at wss://localhost:8000/ws/chat */
window.ws = route => {
    const wsBase = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    const wsUrl = `${wsBase}${window.location.host}/ws/${route}`
    console.log("NEW WS AT URL:",wsUrl)
    const socket = new WebSocket(wsUrl);
    return socket;
}

var state_base = {
	username: window.username,
	whoAmI: 'jtoulous',
	isMobile: (window.innerWidth < 768 || window.innerHeight < 524),
	isChatBubbleChecked: true,
	isPlayerListChecked: true,
	logginError: "",
	currentTournament: -1,
	currentGame: 3,
	language: undefined,
	profileLooking: 'rsterin',
	activeChannel: 'Global',


	users: [
		{ nickname: 'rsterin' , fullname: 'Remi Sterin', picture: 'img/list.svg' },
		{ nickname: 'fjullien' , fullname: 'Felix Jullien', picture: 'img/list.svg' },
		{ nickname: 'jtoulous' , fullname: 'Joshua Toulouse', picture: 'img/list.svg' },
		{ nickname: 'tlarraze' , fullname: 'Theo Larraze', picture: 'img/list.svg' },
	],
	profiles: [
		{ name: 'rsterin', win: 8, lose: 64, ballHit: 32, goal: 8, tournamentWin: 2 },
		{ name: 'fjullien', win: 16, lose: 32, ballHit: 64, goal: 16, tournamentWin: 20 },
		{ name: 'jtoulous', win: 32, lose: 16, ballHit: 128, goal: 32, tournamentWin: 200 },
		{ name: 'tlarraze', win: 64, lose: 8, ballHit: 512, goal: 64, tournamentWin: 2000 },
	],
	channels: [
		{ name: 'Global', id: 1, notifications: 0 },
		{ name: 'rsterin', id: 2, notifications: 0 },
		{ name: 'fjullien', id: 3, notifications: 1 },
		{ name: 'jtoulous', id: 4, notifications: 0 },
		{ name: 'tlarraze', id: 5, notifications: 0 },
	],
	messages: [
		{ text: 'Greetings', sender: 'tlarraze', date: 1706191171037, channel: 'Global' },
		{ text: 'Greetings', sender: 'jtoulous', date: 1706191071037, channel: 'Global' },
		{ text: 'Hi there', sender: 'fjullien', date: 1706191078037, channel: 'Global' },
		{ text: 'Hello', sender: 'rsterin', date: 1706190091037, channel: 'fjullien' },
	],
	tournaments: [
		{ type: 'tournament', id: 1, status: 'running', creator: 'rsterin', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '4', gamesId: [10, 11], date: '11/11/2023 04:38', countdown: 5 },
		{ type: 'tournament', id: 2, status: 'running', creator: 'jtoulous', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '8', gamesId: [14, 15], date: '11/11/2023 04:38', countdown: 5},

		{ type: 'tournament', id: 3, status: 'waiting', creator: 'jtoulous', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '4', gamesId: [], date: '' , countdown: -1},
		{ type: 'tournament', id: 4, status: 'waiting', creator: 'tlarraze', players: ['rsterin', 'jtoulous', 'fjullien', 'tlarraze'], maxPlayer: '6', gamesId: [], date: '', countdown: -1},
	],
	games: [
		{ type: 'normal', id: 1, status: 'done', creator: 'rsterin', players: ['rsterin', 'tlarraze'], maxPlayer: '2', score: [{ name: 'rsterin', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 2, status: 'waiting', creator: 'fjullien', players: ['fjullien'], maxPlayer: '2', score: [], date: '' },
		{ type: 'normal', id: 3, status: 'waiting', creator: 'jtoulous', players: ['jtoulous', 'fjullien'], maxPlayer: '2', score: [], date: '' },
		{ type: 'normal', id: 4, status: 'running', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },

		{ type: 'powerup', id: 5, status: 'done', creator: 'fjullien', players: ['fjullien', 'rsterin'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'rsterin', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'powerup', id: 6, status: 'waiting', creator: 'jtoulous', players: ['jtoulous'], maxPlayer: '2', score: [], date: '' },
		{ type: 'powerup', id: 7, status: 'waiting', creator: 'fjullien', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [], date: '' },
		{ type: 'powerup', id: 8, status: 'running', creator: 'fjullien', players: ['fjullien', 'rsterin'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'rsterin', points: 3 }], date: '11/11/2023 04:38' },
		
		{ type: 'normal', id: 9, status: 'done', creator: 'tournament', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },

		{ type: 'normal', id: 10, status: 'done', creator: 'tournament', players: ['rsterin', 'jtoulous'], maxPlayer: '2', score: [{ name: 'rsterin', points: 2 }, { name: 'jtoulous', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 11, status: 'done', creator: 'tournament', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 12, status: 'done', creator: 'tournament', players: ['jtoulous', 'tlarraze'], maxPlayer: '2', score: [{ name: 'jtoulous', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },

		{ type: 'normal', id: 13, status: 'done', creator: 'tournament', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },

		{ type: 'normal', id: 14, status: 'done', creator: 'tournament', players: ['rsterin', 'jtoulous'], maxPlayer: '2', score: [{ name: 'rsterin', points: 2 }, { name: 'jtoulous', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 15, status: 'done', creator: 'tournament', players: ['fjullien', 'tlarraze'], maxPlayer: '2', score: [{ name: 'fjullien', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },
		{ type: 'normal', id: 16, status: 'running', creator: 'tournament', players: ['jtoulous', 'tlarraze'], maxPlayer: '2', score: [{ name: 'jtoulous', points: 2 }, { name: 'tlarraze', points: 3 }], date: '11/11/2023 04:38' },

	],


	en: {
		// LOGIN
		email: 'Email',
		username: 'Username',
		password: 'Password',
		confirmPassword: 'Confirm password', // TODO mutliling
		login: 'Login',
		register: 'Register',
		connectionWith: 'Connection with 42',
                invalidLoginCredentials: 'Invalid login credentials.',// TODO mutlilang
                usernameAlreadyExist: 'This username already exist.',
                errUnknown: 'An unexpected error occured.', // TODO mutlilang
                'A user with that username already exists.': "A user with that username already exists.", // TODO multilang
                'Please enter a correct username and password. Note that both fields may be case-sensitive.': "Incorrect password or username.", // TODO mutlilang
                'This field is required.': 'Missing field', // TODO mutlilang

		// HOME
		play: 'PLAY',
		tournament: 'TOURNAMENT',
		playerInQueue: 'player(s) currently in game and/or in waiting-room.',

		// GAME LIST
		createGame: 'CREATE GAME',
		createTournament: 'CREATE TOURNAMENT',

		// PROFILE
		winLow: 'Win',
		loseLow: 'Lose',
		totalLow: 'Total',
		winRate: 'Win rate',
		ballHit: 'Ball hit',
		goal: 'Goal',
		tournamentWin: 'Tournaments win',
		win: 'WIN',
		lose: 'LOSE',
		total: 'TOTAL',
		gameHistory: 'Game history',
		tournamentHistory: 'Tournament history',

		// CHAT
		writeHere: 'Type your message here',
		playerList: 'Player List',

		// 404
		pageNotFound: 'Page not found',
		returnToHome: 'Return to home',
		
		//waiting-room
		WaitingRoom: 'Waiting Room',
		GoButton: 'START',
		ByeButton: 'GIVE UP',
		Start: 'STARTING IN',

		//create-game
		GameEditor: 'Game Editor',
		PowerUp: 'Power-Ups',
		PrivateGame: 'Private game',
		Tournament: 'Tournament',
		Size: 'Size:',
		Create: 'Create',
		Cancel: 'Cancel'
	},
	fr: {
		// LOGIN
		email: 'Email',
		username: 'Nom d\'utilisateur',
		password: 'Mot de passe',
		login: 'Se connecter',
		register: 'S\'inscrire',
		connectionWith: 'Connexion avec 42',

		// HOME
		play: 'JOUER',
		tournament: 'TOURNOI',
		playerInQueue: 'joueur(s) dans une partie et/ou dans une salle d\'attente.',

		// GAME LIST
		createGame: 'CREER UNE PARTIE',
		createTournament: 'CREER UN TOURNOI',

		// PROFILE
		winLow: 'Gagner',
		loseLow: 'Perdu',
		totalLow: 'Total',
		winRate: 'Ratio gagner/perdu',
		ballHit: 'Balles touchées',
		goal: 'But',
		tournamentWin: 'Tournois gagnés',
		win: 'GAGNER',
		lose: 'PERDU',
		total: 'TOTAL',
		gameHistory: 'Historique des parties',
		tournamentHistory: 'Historique des tournois',

		// CHAT
		writeHere: 'Ecrivez votre message ici',
		playerList: 'Liste des joueurs',

		// 404
		pageNotFound: 'Page non trouvée',
		returnToHome: 'Revenir à l\'accueil',

		//Waiting-room
		WaitingRoom: 'Salle d\'attente',
		GoButton: 'GO',
		ByeButton: 'ABANDON',
		Start: 'DEBUT DANS',

		//Create-game
		GameEditor: 'Editeur',
		PowerUp: 'Power-Ups',
		PrivateGame: 'Partie privée',
		Tournament: 'Tournoi',
		Size: 'Taille:',
		Create: 'Creer',
		Cancel: 'Annuler'
	},
	de: {
		// LOGIN
		email: 'Email',
		username: 'Nutzername',
		password: 'Passwort',
		login: 'Anmeldung',
		register: 'Registrieren',
		connectionWith: 'Verbindung mit 42',

		// HOME
		play: 'SPIELEN',
		tournament: 'TURNIER',
		playerInQueue: 'Spieler sind derzeit im Spiel und/oder im Wartezimmer.',

		// GAME LIST
		createGame: 'SPIEL ERSTELLEN',
		createTournament: 'TURNIER ERSTELLEN',

		// PROFILE
		winLow: 'Gewinnen',
		loseLow: 'Verlieren',
		totalLow: 'Gesamt',
		winRate: 'Gewinnrate',
		ballHit: 'Balltreffer',
		goal: 'Ziel',
		tournamentWin: 'Turniersieg',
		win: 'GEWINNEN',
		lose: 'VERLIEREN',
		total: 'GESAMT',
		gameHistory: 'Spielgeschichte',
		tournamentHistory: 'Turniergeschichte',

		// CHAT
		writeHere: 'Schreiben Sie ihre Nachricht hier',
		playerList: 'Spielerliste',

		// 404
		pageNotFound: 'Seite nicht gefunden',
		returnToHome: 'Nach Hause zurückkehren',

		//Waiting-room
		WaitingRoom: 'Wartezimmer',
		GoButton: 'GO',
		ByeButton: 'AUFGEBEN',
		Start: 'BEGINN IN',

		//Create-game
		GameEditor: 'Spiel-Editor',
		PowerUp: 'Power-Ups',
		PrivateGame: 'Privates Spiel',
		Tournament: 'Turnier',
		Size: 'Größe:',
		Create: 'anlegen',
		Cancel: 'abbrechen'
	},

    lang(key) {
        return state.language[key] || state.language.errUnknown
    }

}

state_base.language = {...state_base.en}
const state = setup(state_base)

function checkScreenWidth() {
	state.isMobile = (window.innerWidth < 768 || window.innerHeight < 524);
}

window.addEventListener('resize', checkScreenWidth);

state || [];