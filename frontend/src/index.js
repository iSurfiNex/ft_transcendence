document.addEventListener("DOMContentLoaded", function () {
	const body = document.body;

	function displayContent(path) {
		if (!window.state.isLoggedIn) {
			displayElement("login");
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
				displayElement("pong-waiting-room");
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
			else if (path === "/play/tournament-waiting-room") {
				displayElement("tournament-waiting-room");
			}
			else {
				displayNotFound();
			}
		}
	}

	function Layout() {
		let topbar = document.createElement("pong-top-bar");
		let chat = document.createElement("pong-chat");
		let content = document.createElement("pong-content-separator");

		body.append(topbar);
		body.append(chat);
		body.append(content);
	}

	function displayElement(element) {
		let tmp = document.createElement(element);

		tmp.classList.add("pong-content");
		body.append(tmp);
	}

	function displayNotFound() {
		history.pushState({}, "", '/')
	}

	function updateContent(path) {
		displayContent(path);

		history.pushState({ path: path }, "", path);
	}

	window.addEventListener("popstate", function (event) {
		const path = event.state.path;
		updateContent(path);
	});

	const initialPath = window.location.pathname;
	updateContent(initialPath);
});
