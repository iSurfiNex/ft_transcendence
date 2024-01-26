import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongTopBar extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="topbar">
		<a href="/" onclick="navigateTo('/'); return false;" class="logo">
			<div class="logo-text">PONG</div>
		</a>

		<div class="language">
			<div class="btn-group language-button" role="group" aria-label="Basic radio toggle button group">
				<input @click="this.updateActiveLanguage(en)" type="radio" class="btn-check" id="en" name="btnradio" autoComplete="off" checked="{this.selectedLanguage(en)}"/>
				<label class="btn btn-secondary channels-bubble"for="en">
					EN
				</label>
			</div>
			<div class="btn-group language-button" role="group" aria-label="Basic radio toggle button group">
				<input @click="this.updateActiveLanguage(fr)" type="radio" class="btn-check" id="fr" name="btnradio" autoComplete="off" checked="{this.selectedLanguage(fr)}"/>
				<label class="btn btn-secondary channels-bubble" for="fr">
					FR
				</label>
			</div>
			<div class="btn-group language-button" role="group" aria-label="Basic radio toggle button group">
				<input @click="this.updateActiveLanguage(de)" type="radio" class="btn-check" id="de" name="btnradio" autoComplete="off" checked="{this.selectedLanguage(de)}"/>
				<label class="btn btn-secondary channels-bubble"for="de">
					DE
				</label>
			</div>
		</div>
		<div class="profile-picture">
			<a class="profile-picture-div" href="/profile" onclick="navigateTo('/profile'); return false;">
				<img src="{this.getProfilePicture(whoAmI)}" alt="profile"/>
			</a>
		</div>

		<div class="logout-div">
			<a class="logout-button" id="logout-button" href="/logout/" onclick="navigateTo('/logout/'); return false;">
				<img src="/static/img/logout.svg" alt="logout"/>
			</a>
		</div>
	</div>
`

	static css = css`
	@media only screen and (max-width: 768px) {
		.topbar {
			display: block;
			position: fixed;
			width: 100%;
			height: 10%;
			left: 0;
			top: 0;
			background-color: rgb(54, 54, 54);
			z-index: 11;
		}

		.logo {
			display: none;
		}

		.logo-text {
			display: none;
			font-size: 2.5vh;
			color: white;
		}

		.separator {
			position: absolute;
			top: 0;
			right: 0;
			width: 8px;
			height: 100%;
			background-color: #424242;
		}

		.language {
			position: fixed;
			width: 50%;
			height: 10%;
			top: 0;
			right: 25%;
			border-right: 8px solid #424242;
			border-left: 8px solid #424242;
			display: flex;
			align-items: center;
			justify-content: space-between;
			overflow: hidden;
		}

		.language-button {
			margin: auto;
		}

		.profile-picture {
			position: fixed;
			width: 25%;
			height: 10%;
			top: 0;
			left: 0;
		}

		.profile-picture-div {
			position: absolute;
			width: 100%;
			height: 90%;
			top: 5%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.profile-picture-div img {
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
			max-height: 100%;
			height: auto;
			overflow: hidden;
			margin: 10%;
		}

		.logout-div {
			position: fixed;
			width: 25%;
			height: 10%;
			top: 0;
			right: 0;
		}

		.logout-button {
			position: absolute;
			width: 100%;
			height: 90%;
			top: 5%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.logout-button img {
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
			max-height: 100%;
			height: auto;
			overflow: hidden;
			margin: 10%;
		}
	}

	@media only screen and (max-height: 524px) {
		.topbar {
			display: block;
			position: fixed;
			width: 100%;
			height: 10%;
			left: 0;
			top: 0;
			background-color: rgb(54, 54, 54);
			z-index: 11;
		}

		.logo {
			display: none;
		}

		.logo-text {
			display: none;
			font-size: 2.5vh;
			color: white;
		}

		.separator {
			position: absolute;
			top: 0;
			right: 0;
			width: 8px;
			height: 100%;
			background-color: #424242;
		}

		.language {
			position: fixed;
			width: 50%;
			height: 10%;
			top: 0;
			right: 25%;
			border-right: 8px solid #424242;
			border-left: 8px solid #424242;
			display: flex;
			align-items: center;
			justify-content: space-between;
			overflow: hidden;
		}

		.language-button {
			margin: auto;
		}

		.profile-picture {
			position: fixed;
			width: 25%;
			height: 10%;
			top: 0;
			left: 0;
		}

		.profile-picture-div {
			position: absolute;
			width: 100%;
			height: 90%;
			top: 5%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.profile-picture-div img {
			top: 5%;
			left: 5%;
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
			max-height: 100%;
			height: auto;
			overflow: hidden;
		}

		.logout-div {
			position: fixed;
			width: 25%;
			height: 10%;
			top: 0;
			right: 0;
		}

		.logout-button {
			position: absolute;
			width: 100%;
			height: 90%;
			top: 5%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.logout-button img {
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
			max-height: 100%;
			height: auto;
			overflow: hidden;
			margin: 10%;
		}
	}

	@media only screen and (min-width: 768px) and (min-height: 524px) {
		.topbar {
			display: block;
			position: fixed;
			width: 100%;
			height: 10%;
			top: 0;
			background-color: rgb(54, 54, 54);
			z-index: 11;
		}

		.logo {
			display: block;
			position: absolute;
			height: calc(100%);
			top: 0;
			width: 25%;
			max-width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
		}

		.logo-text {
			display: block;
			font-size: 6vh;
			color: white;
		}

		.language {
			position: fixed;
			width: 250px;
			height: 10%;
			top: 0;
			right: calc(20% + 10px);
			border-right: 10px solid #424242;
			border-left: 10px solid #424242;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.language-button {
			margin: auto;
		}

		.profile-picture {
			position: fixed;
			width: 10%;
			height: 10%;
			top: 0;
			right: calc(10% + 10px);
		}

		.profile-picture-div {
			position: absolute;
			width: 100%;
			height: 90%;
			top: 5%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.profile-picture-div img {
			max-height: 100%;
			height: auto;
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
			overflow: hidden;
			margin: 10%;
		}

		.logout-div {
			position: fixed;
			width: calc(10% + 10px);
			height: 10%;
			top: 0;
			right: 0;
			border-left: 10px solid #424242;
		}

		.logout-button {
			position: absolute;
			width: 100%;
			height: 90%;
			top: 5%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.logout-button img {
			border-radius: 50%;
			border: 3px solid #9f9f9f;
			box-shadow: 0px 0px 15px -3px #9F9F9F;
			background-color: #9F9F9F;
			max-height: 100%;
			height: auto;
			overflow: hidden;
			margin: 10%;
}
	}

	::-webkit-scrollbar {
		height: 10px;
		width: 0;
		background-color: #424242;
	}

	::-webkit-scrollbar-thumb {
		background: #666666;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	.topbar {
		font-family: 'Press Start 2P', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background-color: rgb(54, 54, 54);
	}

	.logo {
		text-decoration: none;
	}

	#logout-button {
		position: relative;
		z-index: 1;
	}
`
	observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this);
	}

	getProfilePicture(whoAmI) {
		const user = state.users.find(user => user.nickname === whoAmI);

		if (user) {
			return ("/static/" + user.picture);
		}
		else {
			return '/static/img/list.svg';
		}
	}

	selectedLanguage(language) {
		if (state.language.username == language.username)
			return true;
		return false;
	}

	updateActiveLanguage(language) {
		state.language = language;
	}
}

register(PongTopBar);
