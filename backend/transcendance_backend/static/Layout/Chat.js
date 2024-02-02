import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongChat extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="chat">
		<div class="chat-mobile">
			<div class="chat-bubble">
				<label class="btn btn-primary chat-bubble-label" for="btn-check">
					<input @click="this.chatCheckHandler()" checked="{isChatBubbleChecked}" type="checkbox" class="btn-check chat-bubble-check" id="btn-check" autoComplete="off"/>
					<img class="chat-bubble-unchecked" src="/static/img/bubble.svg" alt="bubble"/>
					<img class="chat-bubble-checked" src='/static/img/close.svg' alt="close"/>
				</label>
			</div>
		</div>

		<div class="chat-desktop" hidden="{this.getHiddenStatus(isMobile, isChatBubbleChecked)}">
			<div class="channels" repeat="channels" as="channel">
				<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
					<input @click="this.updateActiveChannel(channel,channel.notifications)" type="radio" class="btn-check" name="btnradio" id="{channel.id}" autoComplete="off" checked="{this.isActiveChannel(channel.name)}"/>
					<label class="btn btn-secondary channels-bubble" style="{this.getUserPictureFromString(channel.name)}" for="{channel.id}">{this.getFirstLetter(channel.name)}
						<div hidden="{!channel.notifications}" class ="channels-bubble-notif {channel.notifications?active}">{this.getChannelNotifications(channel.notifications)}</div>
					</label>
				</div>
			</div>

			<div class="messages" id="messages" repeat="messages" as="message">
				<div class="message" is-my-msg="{this.equals(message.sender,whoAmI)}" hidden="{this.isMessageInChannel(message.channel,message.sender,activeChannel)}">
					<div class="msg-heading">
						<a href="javascript:void(0)" @click="this.navigate(message.sender)">
							<img class="message-player-img" src="{this.getProfilePicture(message.sender)}" alt="profile"/>
						</a>
						<div class="message-player-name">{this.getUserFullNameFromString(message.sender)}</div>
						<div class="message-player-date">{this.formatDatetime(message.date)}</div>
					</div>
					<div class="message-player-content">{message.text}</div>
				</div>
			</div>

			<div class="bottom-bar">
				<input id="chat-input" placeholder="{language.writeHere}"/>
				<label class="btn btn-primary chat-send" for="btn-check-send">
					<div class="chat-send-button">
						<input class="chat-send-img" alt="send" type="image" src="/static/img/send.svg" name="submit" @click="this.sendMessage()" id="btn-check-send"/>
					</div>
				</label>
				<div class="player-list">
					<label class="btn btn-primary player-list-label" for="btn-check-list">
						<input class="btn-check player-list-input" @click="this.playerListCheckHandler()" checked={isPlayerListChecked} type="checkbox" id="btn-check-list" autoComplete="off"/>
						<img class="player-list-unchecked" src="/static/img/list.svg" alt="list"/>
					</label>
				</div>
			</div>

			<div class="chat-player-list" hidden="{isPlayerListChecked}">
				<span class="chat-player-list-header-text">{language.playerList}</span>
				<div class="chat-list-player" repeat="users" as="user">
					<div class="chat-player">
						<a class="chat-player-link" href="javascript:void(0)" @click="this.navigate(user.nickname)">
							<img class="chat-player-img" src="{this.getProfilePicture(user.nickname)}" alt="profile"/>
							<div class="chat-player-name">{this.getUserFullNameFromString(user.nickname)}</div>
						</a>
						<button @click="this.sendMessageToUser(user)" class="chat-player-message btn btn-primary" title="Send message"><img class="chat-player-button-img" src="/static/img/message.svg" alt="send message"/></button>
						<button class="chat-player-invite btn btn-success" title="Add friend"><img class="chat-player-button-img" src="/static/img/plus.svg" alt="Add friend"/></button>
						<button @click="this.blockUser(user)" class="chat-player-block btn btn-danger" title="Block"><img class="chat-player-button-img" src="/static/img/block.svg" alt="block"/></button>
						<div class="chat-player-seperator"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
`

	static css = css`
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
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
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
			flex-direction: column;
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

		#chat-input {
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
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.messages {
			position: absolute;
			width: 100%;
			height: calc(100% - 165px);
			top: 81px;
			display: flex;
			flex-direction: column;
			overflow-y: auto;
		}
	}

	@media only screen and (min-width: 769px) and (min-height: 525px) {
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
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
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
			flex-direction: column;
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

	#chat-input {
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
		margin-top: 16px;
		bottom: 10px;
	}

	.msg-heading {
		display: flex;
		align-items: center;
	}

	.message[is-my-msg] .msg-heading {
		flex-direction: row-reverse
	}

	.message[is-my-msg] .message-player-content {
		margin-left: auto;
	}

	.message[is-my-msg] .message-player-name {
		text-align: right;
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
		font-size: 12px;
		overflow-x: scroll;
		color: rgb(177, 177, 177);
		white-space: nowrap;
		margin: 0 12px;
		flex:1;
	}

	.message-player-name:hover {
		text-decoration: none;
		color: rgb(177, 177, 177);
	}

	.message-player-name::-webkit-scrollbar {
		display: none;
	}

	.message-player-date {
		font-size: 11px;
		color: rgb(177, 177, 177);
		min-width: fit-content;
	}

	.message-player-content {
		color: rgb(177, 177, 177);
		word-wrap: break-word;
		margin-top: 10px;
		font-size: 12px;
		background: #444;
		border-radius: 11px;
		padding: 6px 12px;
		max-width: fit-content;
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

    connectWsChat() {
        this.socket = ws('chat')
		this.socket.addEventListener('message', (event) => {
			console.log('Received message:', event.data);
			// TODO try catch
			const data = JSON.parse(event.data)
			const {channel, sender, text, datetime} = data
			if (text === '/invite')
				state.messages.push({text: sender + ' invite you in a game, type /join ' + sender + ' to join him/her.', sender: 'Pong', date: datetime, channel});
			else if (text === '/join')
				state.messages.push({text: sender + ' is joining your game.', sender: 'Pong', date: datetime, channel});
			else
				state.messages.push({text, sender, date: datetime, channel});

			if (state.activeChannel == channel) {
				var message = this.shadowRoot.getElementById("messages");
				message.scrollTop = message.scrollHeight;
			}
			else {
				const tmp = channel;
				const maxId = Math.max(...state.channels.map(channel => channel.id), 0);
				const tmpChan = state.channels.find(channel => channel.name === tmp);

				if (state.profile.blocked_users.some(user => user.name === sender))
					return ;
				else if (tmpChan)
					state.channels[tmpChan.id - 1].notifications++;
				else
					state.channels.push({name: sender, id: maxId + 1, notifications: 1});
			}
		});

        this.socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event, '\nAutoreconnect in 2 sec.');
            setTimeout(() => this.connectWs(), 2000);
        };
    }

	connectWsStateUpdate() {
		const socket = ws('state-update');

		socket.addEventListener("open", (event) => {
			console.log("Websocket Connected");
		})

		socket.addEventListener("error", (event) => {
			console.error("Websocket Error: ", event);
		})

		socket.addEventListener("close", (event) => {
			console.log("WebSocket connection closed: ", event);
			console.log("Close code: ", event.code);
			console.log("Error type: ", event.type);
		  });

		socket.addEventListener("message", (event) => {
			let data = JSON.parse(event.data);
			console.log('Received message:', data);
			console.log('action: ', data.action);
			console.log('data_type: ', data.data_type);
			stateUpdate(event);
		});
	}

	connectedCallback() {
		initPopover(this);
        this.connectWsChat();
		this.connectWsStateUpdate();
		stateBuild();
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

	getHiddenStatus(isMobile, isChatBubbleChecked) {
		return !(!isMobile || (isMobile && !isChatBubbleChecked));
	}

	isActiveChannel(channelName) {
		return (channelName == state.activeChannel);
	}

	blockUser(tmpUser) {
		if (tmpUser.nickname === state.whoAmI)
			return ;
		else if (state.profile.blocked_users.some(user => user.name === tmpUser.nickname)) {
			var indexToRemove = state.profile.blocked_users.findIndex(user => user.id === tmpUser.id);

			state.profile.blocked_users.splice(indexToRemove, 1);
			state.messages.push({text: 'You have unblock ' + tmpUser.nickname + '.', sender: 'Pong', date: Date.now(), channel: 'global'});
		}
		else {
			state.profile.blocked_users.push({id: tmpUser.id, name: tmpUser.nickname});
			state.messages.push({text: 'You have block ' + tmpUser.nickname + '.', sender: 'Pong', date: Date.now(), channel: 'global'});
		}
		if (state.activeChannel == 'global') {
			var message = this.shadowRoot.getElementById("messages");
			message.scrollTop = message.scrollHeight;
		}
		state.isPlayerListChecked = true;
	}

	getUserPictureFromString(string) {
		const user = state.users.find(user => user.nickname === string);

		if (user) {
			const backgroundImage = 'url(/static/' + user.picture + ')';
			const backgroundSize = 'cover';

			return ('background-image: ' + backgroundImage + '; background-size: ' + backgroundSize + ';');
		}
		else {
			return ('');
		}
	}

	getProfilePicture(whoAmI) {
		const user = state.users.find(user => user.nickname === whoAmI);

		if (user) {
			return '/static/' + user.picture;
		}
		else {
			return '/static/img/list.svg';
		}
	}

	getUserFullNameFromString(string) {
		const user = state.users.find(user => user.nickname === string);

		if (user) {
			return (user.fullname)
		}
		else {
			return (string);
		}
	}

	isMessageInChannel(message, sender, channelName) {
		if (state.profile.blocked_users.some(user => user.name === sender))
			return true;
		return !(message == channelName);
	}

	getChannelNotifications(notifications) {
		if (notifications > 9)
			return ('9+');
		return (notifications);
	}

	updateActiveChannel(channel, notifications) {
		state.activeChannel = channel.name;
		channel.notifications = 0;

		var message = this.shadowRoot.getElementById("messages");
		message.scrollTop = message.scrollHeight;
	}

	navigate(nickname) {
		state.profileLooking = nickname
		navigateTo('/profile');
		return false;
	}

	sendMessageToUser(user) {
		const maxId = Math.max(...state.channels.map(channel => channel.id), 0);
		const channel = state.channels.find(channel => channel.name === user.nickname);

		state.isPlayerListChecked = true;

		if (channel)
			return ;
		else if (user.nickname === state.whoAmI)
			return ;

		state.channels.push({name: user.nickname, id: maxId + 1, notifications: 0});
	}

	sendMessage() {
		const inputNode = this.shadowRoot.getElementById("chat-input");
		const text = inputNode.value
		const tmp = state.users.find(user => user.nickname === state.activeChannel);

		if (!text)
			return ;

		console.log("SENDING: ", text, " TO: ", state.activeChannel)

		if (text === '/invite') {
			if (state.activeChannel != "global") {
				state.messages.push({text: 'You have invite ' + tmp.nickname + ' to join you.', sender: 'Pong', date:Date.now(), channel: state.activeChannel});
				this._sendWsMessage(state.activeChannel, text)
			}
			else
				state.messages.push({text: 'You need to be in a private channel to invite.', sender: 'Pong', date:Date.now(), channel: state.activeChannel});
		}
		else if (text === '/join') {
			if (state.activeChannel != "global")
				this._sendWsMessage(state.activeChannel, text)
			else
				state.messages.push({text: 'You need to be in a private channel to join.', sender: 'Pong', date:Date.now(), channel: state.activeChannel});
		}
		else
			this._sendWsMessage(state.activeChannel, text)

		if (state.activeChannel != "global")
			state.messages.push({text, sender:state.whoAmI, date:Date.now(), channel: state.activeChannel})

		var message = this.shadowRoot.getElementById("messages");
		message.scrollTop = message.scrollHeight;
}

	_sendWsMessage(to, text) {
		if (this.socket.readyState === WebSocket.OPEN) {
			const jsonString = JSON.stringify({to,text});
			this.socket.send(jsonString);
		} else {
			console.error('WebSocket not open. Unable to send message.');
		}
	}
	formatDatetime(date) {
		date = new Date(date)
		const minutes = date.getHours().toString().padStart(2, '0');
		const seconds = date.getMinutes().toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
	equals(a, b) {
		 return a === b
	}
}

register(PongChat);
