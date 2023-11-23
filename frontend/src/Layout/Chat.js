import { Component, register } from 'pouic'
import { initPopover } from '/src/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/src/bootstrap/bootstrap_css.js'

//  <div @click="this.fn(o, f)" class="{this.playr.active?hey}" a="{this.player.active?yop}">Player</div>
//<div class="toast">dsfsfd<div/>
//		<div repeat="players" as="player">
//			<span>THIS {player.name}!<span>
//		</div>`

class PongChat extends Component {
	static sheets = [bootstrapSheet]
	static template = `
	<div class="chat">
		<div class="chat-mobile">
			<div class="chat-bubble">
				<label class="btn btn-primary chat-bubble-label" for="btn-check">
					<input @click="this.chatCheckHandler()" checked={isChatBubbleChecked} type="checkbox" class="btn-check chat-bubble-check" id="btn-check" autoComplete="off"/>
					<img class="chat-bubble-unchecked" src="/src/img/bubble.svg" alt="bubble"/>
					<img class="chat-bubble-checked" src='/src/img/close.svg' alt="close"/>
				</label>
			</div>
		</div>

		<div class="chat-desktop" hidden="{this.getHiddenStatus()}">
			<div class="channels" repeat="channels" as="channel">
				<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
					<input type="radio" class="btn-check" name="btnradio" id="{channel.id}" autoComplete="off" checked="{this.isActiveChannel(channel.name)}"/>
					<label class="btn btn-secondary channels-bubble" for="{channel.id}">{this.getFirstLetter(channel.name)}
						<div class ="channels-bubble-notif"></div>
					</label>
				</div>
			</div>
			<messages></messages>

			<div class="bottom-bar">
				<input placeholder="Ecrivez votre message ici" class="chat-input"/>
				<label class="btn btn-primary chat-send" for="btn-check">
					<div class="chat-send-button">
						<input class="chat-send-img" alt="send" type="image" src="/src/img/send.svg" name="submit"/>
					</div>
				</label>
				<div class="player-list">
					<label class="btn btn-primary player-list-label" for="btn-check-list">
						<input class="btn-check player-list-input" @click="this.playerListCheckHandler()" checked={isPlayerListChecked} type="checkbox" id="btn-check-list" autoComplete="off"/>
						<img class="player-list-unchecked" src="/src/img/list.svg" alt="list"/>
						<img class="player-list-checked" src="/src/img/close.svg" alt="close"/>
					</label>
				</div>
			</div>

			<div class="chat-player-list" hidden="{isPlayerListChecked}">
				<span class="chat-player-list-header-text">Player list</span>
				<PlayerList />
			</div>
		</div>
	</div>
`

	static css = `
	@media only screen and (max-width: 768px) {
		.chat-bubble {
			display: block;
			position: absolute;
			right: 10px;
			bottom: 10px;
			height: 60px;
			width: 60px;
			z-index: 70;
		}

		.chat-bubble-label {
			width: 60px;
			height: 60px;
		}

		.chat-bubble-check {
			display: none;
		}

		.chat-bubble-unchecked {
			width: 50px;
			height: 50px;
			left: 5px;
			position: absolute;
		}

		.chat-bubble-checked {
			width: 35px;
			height: 35px;
			margin-top: 6px;
		}

		.chat-bubble-check:checked ~ .chat-bubble-checked {
			display: none;
		}

		.chat-bubble-check:not(:checked) ~ .chat-bubble-unchecked {
			display: none;
		}

		.chat-desktop {
			position: fixed;
			width: calc(100% - 20px);
			height: calc(100% - 10% - 95px);
			top: calc(10% + 18px);
			left: 10px;
			background-color: rgb(54, 54, 54);
			z-index: 50;
		}

		.chat-player-list-header-text {
			position: fixed;
			width: calc(100% - 40px);
			text-align: center;
			color: white;
			font-size: 27px;
			background-color: #5e5e5e;
			box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
			z-index: 10;
		}

		.bottom-bar {
			position: fixed;
			left: 10px;
			bottom: 80px;
			width: calc(100% - 20px);
			height: 80px;
			box-shadow: 0px -8px 11px -6px rgba(0,0,0,0.36);
		}

		.messages {
			position: absolute;
			width: 100%;
			height: calc(100% - 165px);
			top: 81px;
			display: flex;
			flex-direction: column-reverse;
			overflow-y: auto;
		}
	}

	@media only screen and (max-height: 524px) {
		.chat-desktop {
			position: fixed;
			width: calc(100% - 20px);
			height: calc(100% - 10% - 30px);
			top: calc(10% + 18px);
			left: 10px;
			background-color: rgb(54, 54, 54);
			z-index: 50;
		}

		.chat-bubble-unchecked {
			width: 50px;
			height: 50px;
			left: 8px;
			position: absolute;
		}

		.chat-bubble-checked {
			width: 35px;
			height: 35px;
			margin-top: 8px;
		}

		.chat-bubble-label {
			width: 64px;
			height: 64px;
		}

		.bottom-bar {
			position: fixed;
			left: 10px;
			bottom: 15px;
			width: calc(100% - 20px);
			height: 80px;
			box-shadow: 0px -8px 11px -6px rgba(0,0,0,0.36);
		}

		.chat-input {
			width: calc(100% - 226px) !important;
		}

		.chat-send {
			right: 148px !important;
		}

		.player-list {
			right: 76px !important;
		}

		.chat-bubble {
			display: block;
			position: absolute;
			right: 20px;
			bottom: 25px;
			height: 60px;
			width: 60px;
			z-index: 70;
		}

		.chat-bubble-check {
			display: none;
		}

		.chat-bubble-check:checked ~ .chat-bubble-checked {
			display: none;
		}

		.chat-bubble-check:not(:checked) ~ .chat-bubble-unchecked {
			display: none;
		}

		.chat-player-list-header-text {
			position: fixed;
			width: calc(100% - 40px);
			text-align: center;
			color: white;
			font-size: 27px;
			background-color: #5e5e5e;
			box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
			z-index: 10;
		}

		.messages {
			position: absolute;
			width: 100%;
			height: calc(100% - 165px);
			top: 81px;
			display: flex;
			flex-direction: column-reverse;
			overflow-y: auto;
		}
	}

	@media only screen and (min-width: 768px) and (min-height: 524px) {
		.chat-bubble {
			display: none;
		}

		.chat-bubble-box {
			display: none;
		}

		.chat-desktop {
			display: block;
			position: fixed;
			width: 25%;
			height: 90%;
			bottom: 0;
			background-color: rgb(54, 54, 54);
		}

		.chat-player-list-header-text {
			position: fixed;
			width: calc(25% - 20px);
			text-align: center;
			color: white;
			font-size: 27px;
			background-color: #5e5e5e;
			box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
			z-index: 10;
		}

		.bottom-bar {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 25%;
			height: 80px;
			box-shadow: 0 19px 38px rgba(0,0,0,1.00), 0 15px 12px rgba(0,0,0,0.22);
		}

		.messages {
			position: absolute;
			width: 100%;
			height: calc(100% - 160px);
			top: 81px;
			display: flex;
			flex-direction: column-reverse;
			overflow-y: auto;
		}
	}

	.channels {
		position: absolute;
		width: 100%;
		height: 80px;
		top: 0px;
		display: flex;
		overflow: scroll;
		scrollbar-width: 2px;
		box-shadow: 0px -4px 11px -3px rgba(0,0,0,0.33);
	}

	.channels, .channels .channels-bubble {
		transform:rotateX(180deg);
	}

	.channels-bubble-img {
		width: 100%;
	}

	.channels-bubble {
		left: 10px;
		bottom: -10px;
		border-radius: 25px !important;
		width: 50px;
		height: 50px;
		margin-right: 10px;
		padding-top: 6px;
		font-size: 25px;
		text-transform: uppercase;
	}

	.channels-bubble-notif.active {
		position: absolute;
		top: -4px;
		right: -4px;
		background-color: rgb(218, 0, 0);
		width: 20px;
		height: 20px;
		border-radius: 10px;
		font-size: 9px;
		padding-top: 3px;
	}

	.chat-input {
		position: absolute;
		width: calc(100% - 156px);
		height: 64px;
		bottom: 0;
		left: 0;
		border: none;
		left: 6px;
		bottom: 6px;
		font-size: 11px;
	}

	.chat-send {
		position: absolute;
		width: 64px;
		height: 64px;
		bottom: -4px;
		right: 78px;
		margin-bottom: 10px;
	}

	.chat-send-button {
		width: 50px;
		height: 50px;
	}

	.chat-send-img {
		width: 45px;
		height: 45px;
		margin-left: -7px;
		margin-top: 3px;
	}

	.player-list {
		position: absolute;
		width: 64px;
		height: 64px;
		bottom: 0;
		margin-bottom: 6px;
		right: 6px;
	}

	.player-list-label {
		width: 64px;
		height: 64px;
	}

	.player-list-input {
		width: 64px;
		height: 64px;
	}

	.player-list-unchecked {
		width: 50px;
		height: 50px;
		margin-left: -5px;
	}

	.player-list-checked {
		width: 35px;
		height: 35px;
		margin-top: 8px;
	}

	.player-list-label input:checked ~ .player-list-checked {
		display: none;
	}

	.player-list-label input:not(:checked) ~ .player-list-unchecked {
		display: none;
	}

	.player-list-input {
		display: none;
	}

	.chat-player-list {
		position: absolute;
		left: 10px;
		top: 20px;
		background-color: #5e5e5e;
		width: calc(100% - 20px);
		height: calc(100% - 110px);
		box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
	}

	.chat-list-player {
		position: absolute;
		width: 100%;
		height: calc(100% - 45px);
		bottom: 0;
		overflow-y: auto;
	}

	.chat-list-player::-webkit-scrollbar {
		width: 10px;
		background-color: #4e4e4e;
	}

	.chat-player {
		position: relative;
		width: calc(100% - 15px);
		height: 50px;
		left: 5px;
		top: 5px;
		margin-bottom: 7px;
		scrollbar-width: 2px;
	}

	.chat-player-img {
		position: relative;
		background-color: white;
		border-radius: 25px;
		left: 5px;
		top: 5px;
		width: 40px;
		border: 3px solid white;
		box-shadow: 0px 0px 15px -3px white;
	}

	.chat-player-name {
		position: absolute;
		top: 16px;
		left: 50px;
		font-size: 13px;
		width: calc(100% - 180px);
		overflow-x: auto;
		color: rgb(233, 233, 233);
	}

	.chat-player-name::-webkit-scrollbar {
		display: none;
	}

	.chat-player-invite {
		position: absolute;
		right: 43px;
		top: 10px;
		margin-left: 5px;
		--bs-btn-padding-y: 0.25rem;
		--bs-btn-padding-x: 0.5rem;
		--bs-btn-font-size: 0.75rem;
	}

	.chat-player-block {
		position: absolute;
		right: 0;
		top: 10px;
		margin-left: 5px;
		--bs-btn-padding-y: 0.25rem;
		--bs-btn-padding-x: 0.5rem;
		--bs-btn-font-size: 0.75rem;
	}

	.chat-player-message {
		position: absolute;
		right: 85px;
		top: 10px;
		margin-left: 5px;
		--bs-btn-padding-y: 0.25rem;
		--bs-btn-padding-x: 0.5rem;
		--bs-btn-font-size: 0.75rem;
	}

	.chat-player-button-img {
		width: 20px;
	}

	.messages::-webkit-scrollbar {
		width: 10px;
	}

	.message {
		position: relative;
		width: calc(100% - 15px);
		left: 10px;
		margin-top: 25px;
		bottom: 10px;
	}

	.message-player-img {
		width: 40px;
		height: 40px;
		position: relative;
		border-radius: 20px;
		border: 3px solid #9f9f9f;
		box-shadow: 0px 0px 15px -3px #9F9F9F;
		background-color: #9F9F9F;
	}

	.message-player-name {
		position: absolute;
		top: 10px;
		font-size: 12px;
		width: calc(100% - 120px);
		left: 45px;
		overflow-x: auto;
		color: rgb(177, 177, 177);
		white-space: nowrap
	}

	.message-player-name:hover {
		text-decoration: none;
		color: rgb(177, 177, 177);
	}

	.message-player-name::-webkit-scrollbar {
		display: none;
	}

	.message-player-date {
		position: absolute;
		top: 10px;
		font-size: 11px;
		right: 10px;
		color: rgb(177, 177, 177);
	}

	.message-player-content {
		position: relative;
		color: rgb(177, 177, 177);
		width: calc(100% - 10px);
		word-wrap: break-word;
		margin-top: 5px;
		font-size: 12px;
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

	.chat {
		margin: 0;

		font-family: 'Press Start 2P', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background-color: black;
	}
`
	observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this);
	}

	chatCheckHandler() {
		state.isChatBubbleChecked = !state.isChatBubbleChecked;
	}

	playerListCheckHandler() {
		state.isPlayerListChecked = !state.isPlayerListChecked;
	}

	getFirstLetter(word) {
		return (word[0]);
	}

	getHiddenStatus() {
		return (isMobile || isChatBubbleChecked);
	}

	isActiveChannel(channelName) {
		return ({channelName} == {activeChannel});
	}
}

register(PongChat);
