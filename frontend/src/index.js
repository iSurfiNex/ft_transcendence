document.addEventListener("DOMContentLoaded", function () {
	const body = document.body;

	function displayContent(path) {
		if (!window.state.isLoggedIn) {
			displayElement("login");
		}
		else {
			Layout();

			if (path === "/") {
				displayElement("home");
			}
			else if (path === "/profile/") {
				displayElement("profile");
			}
			else if (path === "/play/waiting-room/") {
				displayElement("waiting-room");
			}
			else if (path === "/play/pong/") {
				displayElement("pong");
			}
			else if (path === "/play/pong-powerup/") {
				displayElement("pong-power-up");
			}
			else if (path === "/play/tournament/") {
				displayElement("tournament");
			}
			else {
				displayNotFound();
			}
		}
	}

	function Layout() {
		let topbar = document.createElement("top-bar");
		let chat = document.createElement("chat");
		let content = document.createElement("content-separator");

		body.appendChild(topbar);
		body.appendChild(chat);
		body.appendChild(content);
	}

	function displayElement(element) {
		let tmp = document.createElement(element);

		body.appendChild(tmp);
	}

	function displayNotFound() {
		appContainer.innerHTML = "<h2>Page not found!</h2>";
		updateContent("/");
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
