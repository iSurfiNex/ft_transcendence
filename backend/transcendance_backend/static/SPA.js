document.addEventListener("DOMContentLoaded", function () {
	window.addEventListener("popstate", function (event) {
		const path = event.state?.path || window.location.pathname;
		displayContent(path);
	});

	const initialPath = window.location.pathname;
	displayContent(initialPath);
});

const body = document.body;
let topbar, chat, contentSeparator;

function navigateTo(path) {
	history.pushState({ path: path }, "", path);

	displayContent(path);
}

function isUserAuthenticated() {
    return document.cookie.split(';').some((item) => item.trim().startsWith('loggedin'));
}

function unsetCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;`;
}

function displayContent(path) {
    const loggedIn = isUserAuthenticated()
    if (path === "/logout/") {
        // This request unsets the 'sessionid' cookie
        fetch('/api/logout/').then(()=>{
            unsetCookie('loggedin')
            state.whoAmI = null
		    navigateTo("/");
        }, ()=> {
            console.error('Losetgout request failed :(')
        })
    }
	else if (loggedIn && path === "/login/") {
		navigateTo("/");
	}
	else if (path === "/login/") {
        // TODO ça marche mais c'est dégeulasse

        // Remove every pong-something nodes
        const pongNodes = Array.from(document.body.children).filter(node => node.tagName.toLowerCase().startsWith('pong-'));
        pongNodes.forEach(node => node.remove());
        // notify the Layout function it will have to recreate the missing elements when players reconnect
        topbar = chat = contentSeparator = undefined
        // readd the pong login
		displayElement("pong-login");
	}
	else if (!loggedIn) {
		navigateTo("/login/");
	}
	else {
		Layout();

		if (path === "/") {
			displayElement("pong-home");
		}
		else if (path === "/profile") {
			displayElement("pong-profile");
		}
		else if (path === "/play/waiting-room") {
			displayElement("waiting-room");
		}
		else if (path === "/play/pong") {
			displayElement("pong-classic");
		}
		else if (path === "/play/pong-powerup") {
			displayElement("pong-power-up");
		}
		else if (path === "/play/tournament") {
			displayElement("pong-tournament");
		}
		else if (path === "/play/create-game") {
			displayElement("pong-create-game");
		}
		else {
			displayElement("pong-not-found");
		}
	}
}

function Layout() {
	if (!topbar) {
		topbar = document.createElement("pong-top-bar");
		body.append(topbar);
	}
	if (!chat) {
		chat = document.createElement("pong-chat");
		body.append(chat);
	}
	if (!contentSeparator) {
		contentSeparator = document.createElement("pong-content-separator");
		body.append(contentSeparator);
	}
}

function displayElement(element) {
	let tmp = document.getElementById('pong-content');
	if (tmp)
		tmp.parentNode.removeChild(tmp);

	let content = document.createElement(element);

	content.id = 'pong-content'
	content.classList.add("pong-content");
	body.append(content);
}

//function stateUpdate(event)
//{
//	newData = JSON.parse(event.data);
//	
//	if (newData['data-type'] == 'tournament')
//	{
//		var newTournament = {
//			type: 'tournament',
//			id: newData.data.id,
//			status: newData.data.state,
//			creator: newData.data.created_by.username,
//			players: newData.data.players.map(player => player.username),
//			gamesId: newData.data.games.map(game => game.id),
//			date: newData.data.created_at,
//		};
//
//		var newGame1 = {
//			type: (newData.data.power_ups == true) ? "powerup" : "normal",
//			id: newData.data.games[0].id,
//			status: newData.data.state,
//			creator: newData.data.created_by.username,
//			players: [],
//			score: [],
//			date: newData.data.created_at,
//		};
//
//		var newGame2 = {
//			type: (newData.data.power_ups == true) ? "powerup" : "normal",
//			id: newData.data.games[1].id,
//			status: newData.data.state,
//			creator: newData.data.created_by.username,
//			players: [],
//			score: [],
//			date: newData.data.created_at,
//		};
//
//		if (newData['action'] == 'create')
//		{
//			state.tournaments.push(newTournament);
//			state.games.push(newGame1);
//			state.games.push(newGame2);
//		}
//		else if (newData['action'] == 'update')
//		{
//			state.tournaments = state.tournaments.map(tournament => {return (tournament.id == newTournament.id) ? newTournament : tournament;});
//			state.games = state.games.map(game => {return (game.id == newGame1.id) ? newGame1 : game;});
//			state.games = state.games.map(game => {return (game.id == newGame2.id) ? newGame2 : game;});
//		}
//	}
//
//	else if (newData['data-type'] == 'game')
//	{
//		var newGame = {
//			type: (newData.data.power_ups == true) ? "powerup" : "normal",
//			id: newData.data.id,
//			status: newData.data.state,
//			creator: newData.data.created_by.username,
//			players: newData.data.players.map(player => player.username),
//			score: [],
//			date: newData.data.created_at,
//		};
//
//		if (newData['action'] == 'create')
//			state.games.push(newGame);
//		else if (newData['action'] == 'update')
//			state.games = state.games.map(game => {return (game.id == newGame.id) ? newGame : game;});
//	}

	//else if (newData['data-type'] == 'user')									 
	//{
	//	var newUser = {
	//		nickname: newData.username,
	//		//fullname: newData.name,
	//		//picture:,  A VOIR
	//	};
//
	//	if (newData['action'] == 'create')
	//		state.users.push(newUser);
	//	else if (newData['action'] == 'update')
	//		state.users.map(user => {(u)})
	//}


	//currentGame faire une fonction voir si le user n'est pas dans l une des game creer
	//currentTournament  pareil
}

//function stateBuild() {
//	fetch("https://localhost:8000/api/build-state", {
//		method: 'GET',
//		headers: {
//			'Content-Type': 'application/json',
//		},
//	})
//	.then (response => {
//		if (!response.ok)
//		{
//			console.error("Failed to build state");
//			return ;
//		}
//		return (response.json());
//	})
//	.then (data => {
//		var users_list;
//		var games_list;
//		var	tournaments_list;
//		var current_tournament = -1;
//		var current_game = -1;
//		var user = window.username;
//
//		for (let user of data.users) { //RECUP LES DONNEES DE CHAQUE JOUEUR
//			let user_data = {
//				nickname: user.username,
//				fullname: user.name,
//				picture: 'img/list.svg',//A REVOIR //////////////////////////////////////////
//			};
//			users_list.push(user_data);
//		}
//
//		for (let game of data.games) { //RECUP LES DONNEES DE CHAQUE GAME
//			
//			let game_type = (game.power_ups === true) ? "powerup" : "normal";
//			let game_players;
//
//			for (let player of data.players) {
//				let username = player.username;
//				game_players.push(username);
//			}
//
//			let game_data = {
//				type: game_type,
//				id: game.id,
//				status: game.state,
//				creator: game.created_by.username,
//				players: game_players,
//				//score:,
//				//date:,
//			}
//			games_list.push(game_data);
//		}
//
//		for (let tournament of data.tournament){ //RECUP LES DONNEES DE CHAQUE TOURNOI
//			let tournament_players;
//			let tournament_gamesId;
//
//			for (let player of tournament.players){ //creer la list des blazes D joueur
//				tournament_players.push(player.username);
//			}
//
//			for (let game of tournament.games){
//				tournament_gamesId.push(game.id);
//			}
//
//			let tournament_data = {
//				type: 'tournament',
//				id: tournament.id,
//				status: tournament.state,
//				creator: tournament.created_by.username,
//				players: tournament_players,
//				gamesId: tournament_gamesId,
//				//date:,
//			}
//			tournaments_list.push(tournament_data);
//		}
//
//
//
//		let curr_game = games_list.find(game => game.players.includes(user));
//		if (curr_game){
//			current_game = curr_game.id;
//		}
//
//		let curr_tournament = tournaments_list.find(tournament => tournament.players.includes(user));
//		if (curr_tournament){
//			current_tournament = curr_tournament.id;
//		}
//
//		var newState = {
//			username: window.username,
//			isMobile: (window.innerWidth < 768 || window.innerHeight < 524),
//			isChatBubbleChecked: true,
//			isPlayerListChecked: true,
//			logginError: "",
//			currentGame: current_game,
//			currentTournament: current_tournament,
//
//			users: users_list,
//			games: games_list,
//			tournaments: tournaments_list,
//			//profiles
//			//channels
//			//messages , ca degage?
//			
//			en: englishDictionnary,
//			fr: frenchDictionnary,
//			de: germanDictionnary,
//		
//			lang(key) {
//				return state.language[key] || state.language.errUnknown
//			}
//		}
//
//		state = newState;
//	})
//}



////////////////////////////////////////////////////////////////
///////////////        GLOBAL VARIABLES        /////////////////
////////////////////////////////////////////////////////////////
                            ////
							////
						  ////////
						   //////
						    ////
							 //



//const englishDictionnary = {
//	// LOGIN
//	email: 'Email',
//	username: 'Username',
//	password: 'Password',
//	confirmPassword: 'Confirm password', // TODO mutliling
//	login: 'Login',
//	register: 'Register',
//	connectionWith: 'Connection with 42',
//			invalidLoginCredentials: 'Invalid login credentials.',// TODO mutlilang
//			usernameAlreadyExist: 'This username already exist.',
//			errUnknown: 'An unexpected error occured.', // TODO mutlilang
//			'A user with that username already exists.': "A user with that username already exists.", // TODO multilang
//
//	// HOME
//	play: 'PLAY',
//	tournament: 'TOURNAMENT',
//	playerInQueue: 'player(s) currently in game and/or in waiting-room.',
//
//	// GAME LIST
//	createGame: 'CREATE GAME',
//	createTournament: 'CREATE TOURNAMENT',
//
//	// PROFILE
//	winLow: 'Win',
//	loseLow: 'Lose',
//	totalLow: 'Total',
//	winRate: 'Win rate',
//	ballHit: 'Ball hit',
//	goal: 'Goal',
//	tournamentWin: 'Tournaments win',
//	win: 'WIN',
//	lose: 'LOSE',
//	total: 'TOTAL',
//	gameHistory: 'Game history',
//	tournamentHistory: 'Tournament history',
//
//	// CHAT
//	writeHere: 'Type your message here',
//	playerList: 'Player List',
//
//	// 404
//	pageNotFound: 'Page not found',
//	returnToHome: 'Return to home',
//	
//	//waiting-room
//	WaitingRoom: 'Waiting Room',
//	GoButton: 'START',
//	ByeButton: 'GIVE UP',
//	Start: 'STARTING IN',
//
//	//create-game
//	GameEditor: 'Game Editor',
//	PowerUp: 'Power-Ups',
//	PrivateGame: 'Private game',
//	Tournament: 'Tournament',
//	Size: 'Size:',
//	Create: 'Create',
//	Cancel: 'Cancel',
//};
//
//const frenchDictionnary =  {
//	// LOGIN
//	email: 'Email',
//	username: 'Nom d\'utilisateur',
//	password: 'Mot de passe',
//	login: 'Se connecter',
//	register: 'S\'inscrire',
//	connectionWith: 'Connexion avec 42',
//
//	// HOME
//	play: 'JOUER',
//	tournament: 'TOURNOI',
//	playerInQueue: 'joueur(s) dans une partie et/ou dans une salle d\'attente.',
//
//	// GAME LIST
//	createGame: 'CREER UNE PARTIE',
//	createTournament: 'CREER UN TOURNOI',
//
//	// PROFILE
//	winLow: 'Gagner',
//	loseLow: 'Perdu',
//	totalLow: 'Total',
//	winRate: 'Ratio gagner/perdu',
//	ballHit: 'Balles touchées',
//	goal: 'But',
//	tournamentWin: 'Tournois gagnés',
//	win: 'GAGNER',
//	lose: 'PERDU',
//	total: 'TOTAL',
//	gameHistory: 'Historique des parties',
//	tournamentHistory: 'Historique des tournois',
//
//	// CHAT
//	writeHere: 'Ecrivez votre message ici',
//	playerList: 'Liste des joueurs',
//
//	// 404
//	pageNotFound: 'Page non trouvée',
//	returnToHome: 'Revenir à l\'accueil',
//
//	//Waiting-room
//	WaitingRoom: 'Salle d\'attente',
//	GoButton: 'GO',
//	ByeButton: 'ABANDON',
//	Start: 'DEBUT DANS',
//
//	//Create-game
//	GameEditor: 'Editeur',
//	PowerUp: 'Power-Ups',
//	PrivateGame: 'Partie privée',
//	Tournament: 'Tournoi',
//	Size: 'Taille:',
//	Create: 'Creer',
//	Cancel: 'Annuler'
//};
//
//const germanDictionnary = {
//	// LOGIN
//	email: 'Email',
//	username: 'Nutzername',
//	password: 'Passwort',
//	login: 'Anmeldung',
//	register: 'Registrieren',
//	connectionWith: 'Verbindung mit 42',
//
//	// HOME
//	play: 'SPIELEN',
//	tournament: 'TURNIER',
//	playerInQueue: 'Spieler sind derzeit im Spiel und/oder im Wartezimmer.',
//
//	// GAME LIST
//	createGame: 'SPIEL ERSTELLEN',
//	createTournament: 'TURNIER ERSTELLEN',
//
//	// PROFILE
//	winLow: 'Gewinnen',
//	loseLow: 'Verlieren',
//	totalLow: 'Gesamt',
//	winRate: 'Gewinnrate',
//	ballHit: 'Balltreffer',
//	goal: 'Ziel',
//	tournamentWin: 'Turniersieg',
//	win: 'GEWINNEN',
//	lose: 'VERLIEREN',
//	total: 'GESAMT',
//	gameHistory: 'Spielgeschichte',
//	tournamentHistory: 'Turniergeschichte',
//
//	// CHAT
//	writeHere: 'Schreiben Sie ihre Nachricht hier',
//	playerList: 'Spielerliste',
//
//	// 404
//	pageNotFound: 'Seite nicht gefunden',
//	returnToHome: 'Nach Hause zurückkehren',
//
//	//Waiting-room
//	WaitingRoom: 'Wartezimmer',
//	GoButton: 'GO',
//	ByeButton: 'AUFGEBEN',
//	Start: 'BEGINN IN',
//
//	//Create-game
//	GameEditor: 'Spiel-Editor',
//	PowerUp: 'Power-Ups',
//	PrivateGame: 'Privates Spiel',
//	Tournament: 'Turnier',
//	Size: 'Größe:',
//	Create: 'anlegen',
//	Cancel: 'abbrechen'
//};