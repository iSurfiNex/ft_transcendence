import {setup, computedProperty, observe} from "./pouic/state.js"


/* Global function to start a WebSocket connection. If page protocol is https, start wss connection otherwise ws. Exemple if page is https://localhost:8000/start-game and you call ws('chat'), a connection will open at wss://localhost:8000/ws/chat */
window.ws = route => {
    const wsBase = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    const wsUrl = `${wsBase}${window.location.host}/ws/${route}`
    console.log("NEW WS AT URL:",wsUrl)
    const socket = new WebSocket(wsUrl);
    return socket;
}

var state_base = {
        game: computedProperty(['currentGame', 'games'], function (currentGameId) {
                const gameNotFound = {id: -1, status: 'no-game', players: [], p1: {}, p2: {}, score: []}
                const games = state.games
                if (!games && !Array.isArray(games) || !(currentGameId>=0))
                        return gameNotFound
                const my_game =  games.find(game => game.id === currentGameId)
                if (!my_game)
                        return gameNotFound
                my_game.creator_is_me = my_game.creator_id === state.profile.id
                return my_game
        }),
        lastGame: computedProperty(['currentGame', 'games'], function (currentGameId, games) {
                if (currentGameId > 0)
                        window.lastGameId = currentGameId
                return games.find(game => game.id === window.lastGameId) || {}
        }),
        tournament: computedProperty(['currentTournament', 'tournaments', 'profile.id'], function (currentTournamentId) {
                const tournaments = state.tournaments
                if (!tournaments && !Array.isArray(tournaments) || !(currentTournamentId>=0))
                        return {id: -1, status: 'no-tournament'}
                const my_tournament =  tournaments.find(tournament => tournament.id === currentTournamentId)
                if (!my_tournament)
                        return {id: -1, status: 'no-tournament'}
                my_tournament.creator_is_me = my_tournament.creator_id === state.profile.id
                my_tournament.expectedPlayers = my_tournament.status === "waiting" ? 4 : 2
                my_tournament.imReady = my_tournament.readyPlayersId.some(id => id == state.profile.id)
                my_tournament.playersCount = my_tournament.status === "waiting" ? my_tournament.players.length : my_tournament.players_r2.length
                return my_tournament
        }),
        waitingForTournament: computedProperty(['tournament'], function (currentTournament) {
                return state.tournament.status === 'waiting' || (state.tournament.status === 'round 1' && state.tournament.players_r2.some(nickname => nickname === state.profile.nickname))
        }),
        createGamePresets: {
                tournament: false,
                powerUps: false,
        },
        gameListFilter: 'pong',
	profile: window.profile,
        loginLoading: false,
        loginErrors : {
                username: '',
                password: '',
                __all__: '',
        },
        registerErrors : {
                username: '',
                password2: '',
                __all__: '',
        },
        profileErrors : {
                first_name: '',
                last_name: '',
                avatar: '',
                nickname: '',
                global: ''
        },
	profileLooking: profile.id,
	isMobile: (window.innerWidth < 769 || window.innerHeight < 525),
	isChatBubbleChecked: true,
	isPlayerListChecked: true,
	users: window.users,
	logginError: "",
	channels: [
		{ name: 'global', id: 1, notifications: 0, invite: false },
	],
	activeChannel: 'global',
	messages: [],
	tournaments: window.tournaments,
	games: window.games,
	runningGame: {
		startIn : null,
		p1Points: null,
		p2Points: null,
		startedAt: null,
		gameOverState: null,
	},
	currentTournament: window.profile.current_tournament_id,
	currentGame: window.profile.current_game_id,
	language: undefined,

	en: {
		// LOGIN
		email: 'Email',
		username: 'Username',
		password: 'Password',
		confirmPassword: 'Confirm password',
		login: 'Login',
		register: 'Register',
		connectionWith: 'Connection with 42',
		errUnknown: 'An error occured.',

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
		goal: 'Wall hit',
		tournamentWin: 'Tournaments win',
		win: 'WIN',
		lose: 'LOSE',
		total: 'TOTAL',
		gameHistory: 'Game history',
		tournamentHistory: 'Tournament history',
		link42: 'Link with 42',

		// UPDATE PROFILE
		save: 'Save',
		pseudo: 'Pseudo',
		avatar: 'Avatar',
		firstName: 'First name',
		lastName: 'Last name',
		success: 'Success',

		// CHAT
		writeHere: 'Type your message here',
		playerList: 'Player List',

		// 404
		pageNotFound: 'Page not found',
		returnToHome: 'Return to home',

		//waiting-room
		WaitingRoom: 'Waiting Room',
		GoButton: 'START',
		ReadyButton: 'READY',
		ByeButton: 'GIVE UP',
		waitingOther: 'Waiting for other players',

		//create-game
		GameEditor: 'Game Editor',
		PowerUp: 'Power-Ups',
		PrivateGame: 'Private game',
		Tournament: 'Tournament',
		Size: 'Size:',
		Create: 'Create',
		Cancel: 'Cancel',

		//GAME
		Start: 'STARTING IN',
		gameOver: 'GAME OVER',
		youWin: 'YOU WIN',
		youLose: 'YOU LOSE',
		leave: 'Leave',
	},
	fr: {
		// LOGIN
		email: 'Email',
		username: 'Nom d\'utilisateur',
		password: 'Mot de passe',
		confirmPassword: 'Confirmation de mot de passe',
		login: 'Se connecter',
		register: 'S\'inscrire',
		connectionWith: 'Connexion avec 42',
		errUnknown: "Une erreur s'est produite.",

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
		goal: 'Murs touchées',
		tournamentWin: 'Tournois gagnés',
		win: 'GAGNER',
		lose: 'PERDU',
		total: 'TOTAL',
		gameHistory: 'Historique des parties',
		tournamentHistory: 'Historique des tournois',
		link42: 'Lier avec 42',

		// UPDATE PROFILE
		save: 'Enregistrer',
		pseudo: 'Pseudo',
		avatar: 'Avatar',
		firstName: 'Prénom',
		lastName: 'Nom',
		success: 'Succès',

		// CHAT
		writeHere: 'Ecrivez votre message ici',
		playerList: 'Liste des joueurs',

		// 404
		pageNotFound: 'Page non trouvée',
		returnToHome: 'Revenir à l\'accueil',

		//Waiting-room
		WaitingRoom: 'Salle d\'attente',
		GoButton: 'DÉMARRER',
		ByeButton: 'ABANDON',
		ReadyButton: 'PRET',
		waitingOther: 'En attente des autres joueurs',

		//Create-game
		GameEditor: 'Editeur',
		PowerUp: 'Power-Ups',
		PrivateGame: 'Partie privée',
		Tournament: 'Tournoi',
		Size: 'Taille:',
		Create: 'Creer',
		Cancel: 'Annuler',

		//GAME
		Start: 'DEBUT DANS',
		gameOver: 'GAME OVER',
		youWin: 'VICTOIRE',
		youLose: 'DÉFAITE',
		leave: 'Partir',
	},
	de: {
		// LOGIN
		email: 'Email',
		username: 'Nutzername',
		password: 'Passwort',
		confirmPassword: 'Passwort Bestätigung',
		login: 'Anmeldung',
		register: 'Registrieren',
		connectionWith: 'Verbindung mit 42',
		errUnknown: 'Es ist ein Fehler aufgetreten.',

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
		goal: 'Wände betroffen',
		tournamentWin: 'Turniersieg',
		win: 'GEWINNEN',
		lose: 'VERLIEREN',
		total: 'GESAMT',
		gameHistory: 'Spielgeschichte',
		tournamentHistory: 'Turniergeschichte',
		link42: 'Link zu 42',

		// UPDATE PROFILE
		save: 'Speichern',
		pseudo: 'Pseudo',
		avatar: 'Benutzerbild',
		firstName: 'Vorname',
		lastName: 'Nachname',
		success: 'Erfolg',

		// CHAT
		writeHere: 'Schreiben Sie ihre Nachricht hier',
		playerList: 'Spielerliste',

		// 404
		pageNotFound: 'Seite nicht gefunden',
		returnToHome: 'Nach Hause zurückkehren',

		//Waiting-room
		WaitingRoom: 'Wartezimmer',
		GoButton: 'ZUM STARTEN',
		ByeButton: 'AUFGEBEN',
		ReadyButton: 'BEREIT',
		waitingOther: 'Warten auf andere Spieler',

		//Create-game
		GameEditor: 'Spiel-Editor',
		PowerUp: 'Power-Ups',
		PrivateGame: 'Privates Spiel',
		Tournament: 'Turnier',
		Size: 'Größe:',
		Create: 'anlegen',
		Cancel: 'abbrechen',

		//GAME
		Start: 'BEGINN IN',
		gameOver: 'GAME OVER',
		youWin: 'SIEG',
		youLose: 'VERLUST',
		leave: 'Verlassen',
	},

    lang(key) {
        if (key == undefined)
                return ''
        return state.language[key] || state.language.errUnknown
    }

}

state_base.language = {...state_base.en}
const state = setup(state_base)

observe('game.status', (newStatus, oldStatus) => {
        const gameStarts = (newStatus === "running" && oldStatus !== "running")
        const gameOver = (newStatus !== "running" && oldStatus === "running")
        const leaveWaitingRoom = (newStatus !== "running" && newStatus !== "waiting" && oldStatus === "waiting")
        const enterWaitingRoom = (newStatus === "waiting" && oldStatus !== "waiting")
        if (gameStarts) {
                console.log("GAME STARTING")
                state.runningGame.gameOverState = null
                navigateTo('/play/game')
        } else if(gameOver) {
                console.log("GAME OVER")
        } else if (enterWaitingRoom) {
                console.log("ENTER WAITING ROOM")
                navigateTo('/play/waiting-room');
        } else if (leaveWaitingRoom) {
                console.log("LEAVE WAITING ROOM")
                navigateTo('/play/'+state.gameListFilter)
        }
})

observe('tournament.status', (newStatus, oldStatus) => {
        const leaveWaitingRoom = (newStatus !== "waiting" && oldStatus === "waiting")
        const enterWaitingRoom = (newStatus == "waiting" && oldStatus !== "waiting")
        if (enterWaitingRoom) {
                console.log("ENTER TOURNAMENT WAITING ROOM")
                navigateTo('/play/tournament-wr');
        } else if (leaveWaitingRoom && newStatus !== 'round 1' && newStatus !== 'round 2') {
                console.log("LEAVE TOURNAMENT WAITING ROOM")
                navigateTo('/play/tournament')
        }
})

state.game.status
state.tournament.status

function checkScreenWidth() {
	state.isMobile = (window.innerWidth < 769 || window.innerHeight < 525);
}

window.addEventListener('resize', checkScreenWidth);

