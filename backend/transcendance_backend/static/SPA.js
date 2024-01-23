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

function initializeWS() {
    //const roomName = 'TOTO'
    // Replace 'ws://your-socket-url' with the actual WebSocket URL
const socket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/chat/'
            //+ roomName
            //+ '/'
        );
    console.log(socket)

// Event handler for when the connection is opened
socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened:', event);
});

// Event handler for receiving messages
socket.addEventListener('message', (event) => {
    console.log('Received message:', event.data);
});

// Event handler for when the connection is closed
socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event);
});

// Event handler for errors
socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

// Send a message to the server
function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.error('WebSocket not open. Unable to send message.');
    }
}

// Example: Send a message after a delay
setTimeout(() => {
    sendMessage(JSON.stringify({message:'Hello, WebSocket yooooooo!'}));
}, 2000);
}

function displayContent(path) {
	if (window.state.isLoggedIn && path === "/login/") {
		navigateTo("/");
	}
	else if (path === "/login/") {
		displayElement("pong-login");
	}
	else if (!window.state.isLoggedIn) {
		navigateTo("/login/");
	}
	else {
		Layout();

            console.log("YO")
		if (path === "/") {
			displayElement("pong-home");
		}
		else if (path === "/start-game") {
            console.log("START-GAME !")
            initializeWS()
            //fetch("https://localhost:3000").then(res => console.log("RES", res)).catch(err => console.log("ERR", err))
			//displayElement("start-game");
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
