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

function getCookie(key)
{
		const token = document.cookie
			.split('; ')
			.find(row => row.startsWith(`${key}=`))
			.split('=')[1];
		return (token);
}

if (!getCookie("lang"))
    document.cookie = `lang=en`;

function csrfToken()
{
    return getCookie('csrftoken')
}

function get(url, body) {
        return fetch(url, {
        body ,
        method: 'GET',
        credentials: 'include',
        headers: {
            "X-CSRFToken": csrfToken()
        }
        })
    .then(response => response.json())
}

function post(url, body) {
        return fetch(url, {
        body ,
        method: 'POST',
        credentials: 'include',
        headers: {
            "X-CSRFToken": csrfToken()
        }
        })
    .then(response => response.json())
}

function post2(url, body) {
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": csrfToken()
		},
		body: JSON.stringify(body)
	})
	.then(response => response.json())
}


function put(url, body) {
	return fetch(url, {
	body ,
	method: 'PUT',
	credentials: 'include',
	headers: {
		"X-CSRFToken": csrfToken()
	}
	})
.then(response => response.json())
}

function get(url) {
	return fetch(url, {
	method: 'GET',
	credentials: 'include',
	headers: {
		"X-CSRFToken": csrfToken()
	}
	})
.then(response => response.json())
}

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

function link42Account() {
	const token = new URLSearchParams(window.location.search).get("code");
	if (!token)
        navigateTo('/profile')
	const hostname = window.location.origin + '/api/request_42_login/?type=profile&code=' + token
	const response = get(hostname).then(data => {
		sessionStorage.setItem("access_token", data.access_token);
        const errors = data['errors']
        if (errors !== undefined) {
            for (const [key, errMsg] of Object.entries(errors)) {
                state.profileErrors.global = errMsg
                return
            }
        }
        state.whoAmI = data['username']
        state.profile = data['profile']
        state.profileErrors.global = ''
	}, err => {
        state.profileErrors.global = '42 link error'
    })

    navigateTo('/profile')
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
            console.error('Logout request failed :(')
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
        else if (path === "/profile/") {
            link42Account()
        }
		else if (path === "/profile") {
			displayElement("pong-profile");
		}
		else if (path === "/play/waiting-room") {
			displayElement("waiting-room");
		}
		else if (path === "/play/tournament-wr") {
			displayElement("tournament-wr")
		}
		else if (path === "/play/tournament-running-wr") {
			displayElement("tournament-running-wr");
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

function stateUpdate(event)
{
	data = JSON.parse(event.data);
	console.log(data)
	if (data.data_type == 'tournament')//tournament update
	{
		var newTournament = {
			type: 'tournament',
			id: data.id,
			status: data.state,
			creator: data.created_by.name,
			players: data.players.map(player => player.name),
			gamesId: data.games.map(game => game.id),
			date: data.created_at,
		};

		var newGame1 = {
			type: (data.power_ups == true) ? "powerup" : "normal",
			id: data.games[0].id,
			status: data.state,
			creator: data.created_by.name,
			players: (data.games[0].player) ? data.games.players.map(player => player.name) : [],
			score: [],
			date: data.created_at,
		};

		var newGame2 = {
			type: (data.power_ups == true) ? "powerup" : "normal",
			id: data.games[1].id,
			status: data.state,
			creator: data.created_by.name,
			players: (data.games[1].player) ? data.games.players.map(player => player.name) : [],
			score: [],
			date: data.created_at,
		};

		if (data.action == 'create')
		{
			state.tournaments.push(newTournament);
			state.games.push(newGame1);
			state.games.push(newGame2);
		}
		else if (data.action == 'update')
		{
			state.tournaments = state.tournaments.map(tournament => {return (tournament.id == newTournament.id) ? newTournament : tournament;});
			state.games = state.games.map(game => {return (game.id == newGame1.id) ? newGame1 : game;});
			state.games = state.games.map(game => {return (game.id == newGame2.id) ? newGame2 : game;});
		}
	}

	else if (data.data_type == 'game')//game update
	{
		var newGame = {
			type: (data.power_ups == true) ? "powerup" : "normal",
			id: data.id,
			status: data.state,
			creator: data.created_by.name,
			players: data.players.map(player => player.name),
			score: [],
			date: data.created_at,
		};

		if (data.action == 'create')
			state.games.push(newGame);
		else if (data.action == 'update')
			state.games = state.games.map(game => {return game.id == newGame.id ? newGame : game;});
	}

	//else if (data.data_type == 'user') //user update									 
	//{
	//	var newUser = {
	//		nickname: data.username,
	//		//fullname: data.name,
	//		//picture:,  A VOIR
	//	};
//
	//	if (data.action == 'create')
	//		state.users.push(newUser);
	//	else if (data.action == 'update')
	//		state.users.map(user => {(u)})
	//}

	state.currentGame = -1;
	state.currentTournament = -1;

	currentGame = state.games.find(game => game.players.find(player => player == state.whoAmI));
	currentTournament = state.tournaments.find(tournament => tournament.players.find(player => player == state.whoAmI));
	
	if (currentGame)
		state.currentGame = currentGame.id;
	if (currentTournament)
		state.currentTournament = currentTournament.id;
}

function stateBuild() {
	get("https://localhost:8000/api/build-state/")
	.then (data => {
		console.log("========   ALL GOOD");
		console.log(data);
		var users_list = [];
		var games_list = [];
//		var	tournaments_list = [];
//		var current_tournament = -1;
//		var current_game = -1;
//		//var user = window.username;
//
		for (let user of data.users) { //RECUP LES DONNEES DE CHAQUE JOUEUR
			let user_data = {
				nickname: user.name,
				fullname: user.first_name + " " + user.last_name,
				//picture: user.avatar_url,
			};
			users_list.push(user_data);
		}
//
		for (let game of data.games) { //RECUP LES DONNEES DE CHAQUE GAME
			
			let game_type = (game.power_ups === true) ? "powerup" : "normal";
			let game_players;

			for (let player of game.players) {
				let username = player.name;
				game_players.push(username);
			}

			let game_data = {
				type: game_type,
				id: game.id,
				status: game.state,
				creator: game.created_by.name,
				players: game_players,
				//score:,
				date: game.created_at,
			}
			games_list.push(game_data);
		}
//
//		for (let tournament of data.tournaments){ //RECUP LES DONNEES DE CHAQUE TOURNOI
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
//				creator: tournament.created_by.name,
//				players: tournament_players,
//				gamesId: tournament_gamesId,
//				date: tournament.created_at,
//			}
//			tournaments_list.push(tournament_data);
//		}
//
//		//console.log(games_list);
//		let curr_game = games_list.find(game => game.players.find(player => player == state.whoAmI));
//		let curr_tournament = tournaments_list.find(tournament => tournament.players.find(player => player == state.whoAmI));
//
//		//let curr_game = games_list.find(game => game.players.includes(user));
//		if (curr_game){
//			current_game = curr_game.id;
//		}
//
//		//let curr_tournament = tournaments_list.find(tournament => tournament.players.includes(user));
//		if (curr_tournament){
//			current_tournament = curr_tournament.id;
//		}
//
//		//state.profileLooking = state.whoAmI;
		state.games = games_list;
//		state.tournaments = tournaments_list;
		state.users = users_list;
//		state.currentTournament = current_tournament;
//		state.currentGame = current_game;
	})
}