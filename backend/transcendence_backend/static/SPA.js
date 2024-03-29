document.addEventListener("DOMContentLoaded", function () {
	window.addEventListener("popstate", function (event) {
		const path = event.state?.path || window.location.pathname;
		displayContent(path);
	});

	window.addEventListener('contextmenu', (event) => {
		event.preventDefault();
	});

	const initialPath = window.location.pathname;
	displayContent(initialPath);
});

const body = document.body;
let topbar, chat, contentSeparator;

function getCookie(key)
{
	const matchCookie = document.cookie
		.split('; ')
		.find(row => row.startsWith(`${key}=`))

    if (!matchCookie)
        return undefined

	const token = matchCookie.split('=')[1];
		return (token);
}

if (!getCookie("lang"))
    document.cookie = `lang=en; path=/; SameSite=Strict;`;

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

function put2(url, body) {
	return fetch(url, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": csrfToken()
		},
		body: JSON.stringify(body)
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
            state.profile = {}
            state.games = []
            state.tournaments = []
            state.users = []
            state.currentGame = -1
            state.currentTournament = -1
		    navigateTo("/");
        }, ()=> {
            console.error('Logout request failed :(')
        })
    }
	else if (loggedIn && path === "/login/") {
		navigateTo("/");
	}
	else if (path === "/login/") {
        state.loginLoading = false;

        // Remove every pong-something nodes
        const pongNodes = Array.from(document.body.children).filter(node => node.tagName.toLowerCase().startsWith('pong-'));
        pongNodes.forEach(node => node.remove());
        // notify the Layout function it will have to recreate the missing elements when players reconnect
        topbar = chat = contentSeparator = undefined
		displayElement("pong-login");
	}
	else if (!loggedIn) {
		navigateTo("/login/");
	}
	else {
		Layout();


		if (path !== "/play/game" && state.game.status === 'running') {
			navigateTo("/play/game")
			return;
		}
		else if (path !== "/play/tournament-wr" && state.waitingForTournament && state.tournament.status != 'no-tournament') {
			navigateTo("/play/tournament-wr")
			return;
		}
		else if (path !== "/play/waiting-room" && state.game.status === 'waiting') {
			navigateTo("/play/waiting-room")
			return;
		}
		else if (path === "/") {
			displayElement("pong-home");
		}
        else if (path === "/profile/") {
            link42Account()
        }
		else if (path === "/profile") {
			displayElement("pong-profile");
		}
		else if (path === "/play/waiting-room") {
            if (!(state.currentGame >= 0))
            {
                navigateTo('/')
                return
            }
			displayElement("pong-waiting-room");
		}
		else if (path === "/play/tournament-wr") {
            if (!(state.currentTournament >= 0))
            {
                navigateTo('/')
                return
            }
			displayElement("tournament-wr")
		}
		else if (path === "/play/tournament-running-wr") {
			displayElement("tournament-running-wr");
		}
		else if (path === "/play/pong") {
            state.createGamePresets.tournament = false
            state.createGamePresets.powerUps = false
            state.gameListFilter= 'pong'
			displayElement("pong-join-list");
        }
		else if (path === "/play/pong-up") {
            state.createGamePresets.tournament = false
            state.createGamePresets.powerUps = true
            state.gameListFilter= 'pong-up'
			displayElement("pong-join-list");
        }
		else if (path === "/play/tournament") {
            state.createGamePresets.tournament = true
            state.createGamePresets.powerUps = false
            state.gameListFilter= 'tournament'
			displayElement("pong-join-list");
        }
		else if (path === "/play") {
            navigateTo('/play/pong')
		}
		else if (path === "/play/create-game") {
			displayElement("pong-create-game");
		}
		else if (path === "/play/game") {
            if (!(state.currentGame >= 0))
            {
                navigateTo('/')
                return
            }
			displayElement("pong-game");
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
    if (tmp && tmp.localName === element)
        return
	if (tmp)
		tmp.parentNode.removeChild(tmp);

	let content = document.createElement(element);

	content.id = 'pong-content'
	content.classList.add("pong-content");
	body.append(content);
}




//////////////////////////////////////////////////////////////////////////////
//////////////////             STATE UPDATE                    //////////////
////////////////////////////////////////////////////////////////////////////

function stateUpdate(data)
{
	data_type = data.data_type;

	if (data_type == 'tournament') //tournament update
		tournamentUpdate(data, data.action);

	else if (data_type == 'game') //game update
		gameUpdate(data, data.action);

	else if (data_type == 'all tournaments')
		tournamentUpdateAll(data);

	else if (data_type == 'all games')
		gameUpdateAll(data);

	else if (data_type == 'user') //user update
		userUpdate(data, data.action);

	currentGameUpdate();
}


function tournamentUpdate(newTournament, action) {
	TournamentAlreadyExist = state.tournaments.find(tournament => tournament.id == newTournament.id);
	if (TournamentAlreadyExist && action == "create")
		return ;

	if (action == 'create')
		state.tournaments.push(newTournament);
	else if (action == 'update')
	{
		state.tournaments = state.tournaments.map(tournament => {return (tournament.id == newTournament.id) ? newTournament : tournament;});
	}
}


function gameUpdate(newGame, action) {
	GameAlreadyExist = state.games.find(game => game.id == newGame.id);
	if (GameAlreadyExist && action == "create")
		return ;

    newGame.score = []

	if (action == 'create')
		state.games.push(newGame);
	else if (action == 'update')
		state.games = state.games.map(game => {return game.id == newGame.id ? newGame : game;});
}


function userUpdate(newUser, action) {
	UserAlreadyExist = state.users.find(user => user.nickname == newUser.nickname);
	if (UserAlreadyExist && action == "create")
		return ;

	if (action == 'create')
		state.users.push(newUser);
	else if (action == 'update') {
		const i = state.users.findIndex(user => user.id === newUser.id);
		state.users[i] = newUser
        if (newUser.id === state.profile.id)
            state.currentGame = newUser.current_game_id
	}
}

function gameUpdateAll(data) {
	objects = data.objects;
	games_list = [];
	score = [];

	objects.forEach((obj) => {
		let gameInState = state.games.find(game => game.id == obj.id);
		if (gameInState && gameInState.score)
			score = gameInState.score;
        obj.score = score
		games_list.push(obj);
	});
	state.games = games_list;
}

function tournamentUpdateAll(data) {
	tournaments = data.objects;
	tournament_list = [];

	tournaments.forEach((tournament) => {
		tournament_list.push(tournament);
	});
	state.tournaments = tournament_list;
}

function currentGameUpdate() {
	let currentTournament = -1;
	var isMyTournament;

	if (state.tournaments && state.tournaments.length != 0)
	{
		isMyTournament = state.tournaments.find(tournament => tournament.players.includes(state.profile.nickname) && tournament.status !== 'done')
		if (isMyTournament)
		{
			iAmLoser = isMyTournament.losers.find(loser => loser == state.profile.nickname)
			if (!iAmLoser)
				currentTournament = isMyTournament.id
		}
	}

	state.currentTournament = currentTournament;
}
