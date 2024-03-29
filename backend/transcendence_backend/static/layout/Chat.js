import { Component, register, html, css } from 'pouic'
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
				<div selected={this.equals(channel.name,activeChannel)} class="btn-group" role="group" aria-label="Basic radio toggle button group">
					<input @click="this.updateActiveChannel(channel,channel.notifications)" type="radio" class="btn-check" name="btnradio" id="{channel.id}" autoComplete="off" checked="{this.isActiveChannel(channel.name)}"/>
					<label class="btn btn-secondary channels-bubble" style="{this.getUserPictureFromString(channel.name)}" for="{channel.id}">{this.getFirstLetter(channel.name)}
						<div hidden="{!channel.notifications}" class ="channels-bubble-notif {channel.notifications?active}">{this.getChannelNotifications(channel.notifications)}</div>
					</label>
				</div>
			</div>

			<div class="messages" id="messages" repeat="messages" as="message">
				<div class="message" is-my-msg="{this.equals(message.nickname,profile.nickname)}" hidden="{this.isMessageInChannel(message.channel,message.nickname,activeChannel)}">
					<div class="msg-heading">
						<a href="javascript:void(0)" @click="this.navigate(message.nickname)">
							<img class="message-player-img" src="{this.getProfilePicture(message.nickname)}" alt="profile"/>
						</a>
						<div class="message-player-name">{this.getUserFullNameFromString(message.nickname)}</div>
						<div class="message-player-date">{this.formatDatetime(message.date)}</div>
					</div>
					<div class="message-player-content">{message.text}</div>
				</div>
			</div>

			<div class="chat-player-list-header-text" hidden="{isPlayerListChecked}">{language.playerList}</div>
			<div class="chat-player-list" hidden="{isPlayerListChecked}">
				<div class="chat-list-player" repeat="users" as="user">
					<div class="chat-player" hidden="{this.equals(user.id, profile.id)}">
						<a class="chat-player-link" href="javascript:void(0)" @click="this.navigate(user.nickname)">
							<img class="chat-player-img" src="{user.picture}" alt="profile"/>
							<div class="chat-player-name">{user.nickname}</div>
						</a>

						<div class="btn-group user-btn" role="group" aria-label="Basic example">
							<span hidden="{this.isMyFriend(profile.friends.length,user)}" class="offline">{this.getUserStatus(user,user.current_game_id,user.current_tournament_id)}</span>
                        	<button is-my-friend="{this.isMyFriend(profile.friends.length,user)}" type="button" class="first-button btn btn-sm btn-primary" @click="this.sendMessageToUser(user)" title="Send message"><img class="chat-player-button-img" src="/static/img/message.svg" alt="send message"/></button>
                        	<button type="button" class="btn btn-sm btn-success" @click="this.addFriend(user)" title="Add friend"><img class="chat-player-button-img" src="/static/img/plus.svg" alt="Add friend"/></button>
                        	<button type="button" class="btn btn-sm btn-danger" @click="this.blockUser(user)" title="Block user"><img class="chat-player-button-img" src="/static/img/block.svg" alt="block"/></button>
						</div>
						<div class="chat-player-seperator"></div>
					</div>
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

		</div>
	</div>
`

	static css = css`
	.first-button[is-my-friend] {
		border-top-left-radius: 0.25rem !important;
		border-bottom-left-radius: 0.25rem !important;
	}

	.bottom-bar {
 		background: #363636;
	}

	.offline {
		border-top-left-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
		line-height: 32px;
		padding: 3px 9px;
		line-height: 32px;
		background-color: #ffc107;
	}

	.channels label::hover {
		box-shadow: 0 0 4px white;
	}

	.channels [selected] label {
		box-shadow: 0 0 10px white;
	}

	.user-btn {
		align-self: end;
		position: relative;
		top: -6px;
	}

	.chat-player-list-header-text {
		font-size: 18px !important;
		position: absolute !important;
		width: 100% !important;
		padding: 8px 0;
	}

	@media only screen and (max-width: 768px) {
		.chat-bubble {
			display: block;
			position: fixed;
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

		.chat-player-list {
			margin-top: 0;
			height: 100%;
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
			position: fixed;
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

		.chat-player-list {
			margin-top: 0;
			height: 100%;
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
			margin-top: 10px;
			position: fixed;
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

		.chat-player-list {
			margin-top: 10px;
			height: calc(100% + 10px);
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
		text-shadow: 0px 0px 8px #454545;
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
		background-color: #5e5e5e;
		overflow: auto;
		position: relative;
		padding-bottom: 80px;
	}

	.chat-list-player {
		overflow-y: auto;
		padding-top: 60px;
	}

	.chat-list-player::-webkit-scrollbar {
		width: 10px;
		background-color: #4e4e4e;
	}

	.chat-player-list::-webkit-scrollbar {
		display: none;
	}

	.chat-player {
		width: calc(100% - 15px);
		margin-bottom: 7px;
		scrollbar-width: 2px;
		display: flex;
  		flex-direction: column;
	}

	.chat-player-link {
		display: flex;
	}

	.chat-player-img {
		object-fit: cover;
		object-position: center;
		background-color: white;
		border-radius: 25px;
		margin-left: 5px;
		width: 40px;
		height: 40px;
		border: 3px solid white;
		box-shadow: 0px 0px 15px -3px white;
	}

	.chat-player-name {
		white-space: nowrap;
		font-size: 13px;
		overflow-x: auto;
		color: rgb(233, 233, 233);
		flex: 1;
		display: flex;
		align-items: center;
		margin-left: 4px;
	}

	.chat-player-name::-webkit-scrollbar {
		display: none;
	}

	.chat-player-invite {
		margin-left: 5px;
		--bs-btn-padding-y: 0.25rem;
		--bs-btn-padding-x: 0.5rem;
		--bs-btn-font-size: 0.75rem;
	}

	.chat-player-block {
		margin-left: 5px;
		--bs-btn-padding-y: 0.25rem;
		--bs-btn-padding-x: 0.5rem;
		--bs-btn-font-size: 0.75rem;
	}

	.chat-player-message {
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
		object-fit: cover;
		object-position: center;
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

    connectWsChat() {
        this.socket = ws('chat')
		this.socket.addEventListener('message', (event) => {
			// TODO try catch
			const data = JSON.parse(event.data)
			const {channel, sender, nickname, text, datetime} = data

			if (text === '/invite')
				state.messages.push({text: nickname + ' invite you in a game, type /join to join him/her.', sender: 'Pong', nickname: 'Pong', date: datetime, channel});
			else if (text === '/join')
				state.messages.push({text: nickname + ' is joining your game.', sender: 'Pong', nickname: 'Pong', date: datetime, channel});
			else
				state.messages.push({text, sender, nickname, date: datetime, channel});

			const tmp = channel;
			const tmpChan = state.channels.find(channel => channel.name === tmp);

			if (state.activeChannel == channel) {
				var message = this.shadowRoot.getElementById("messages");
				message.scrollTop = message.scrollHeight;

				state.channels[tmpChan.id - 1].invite = text === '/invite' ? true : false;
			}
			else {
				const maxId = Math.max(...state.channels.map(channel => channel.id), 0);

				if (state.profile.blocked.some(user => user.nickname === nickname))
					return ;
				else if (tmpChan) {
					state.channels[tmpChan.id - 1].notifications++;
					state.channels[tmpChan.id - 1].invite = text === '/invite' ? true : false;
				}
				else
					state.channels.push({name: channel, id: maxId + 1, notifications: 1, invite: text === '/invite' ? true : false});
			}
		});

        this.socket.onerror = (event) => {
            console.log('Chat webSocket connection closed, autoreconnect in 2 sec.');
            setTimeout(() => this.connectWsChat(), 2000);
        };
    }

	connectWsStateUpdate() {
		const socket = ws('state-update');

		socket.addEventListener("open", (event) => {
			console.log("state-update Websocket Connected");
			get("/api/reconnect-update/", {}).catch(error => console.error(error))
		})

		socket.addEventListener("error", (event) => {
			console.error("state-update Websocket Error: ", event);
		})

		socket.addEventListener("close", (event) => {
			console.log("state-update WebSocket connection closed: ", event);
			console.log("Close code: ", event.code);
			console.log("Error type: ", event.type);
		  });

		socket.addEventListener("message", (event) => {
			let data = JSON.parse(event.data);
			stateUpdate(data);
		});
	}

	connectedCallback() {
        this.chatInput = this.shadowRoot.getElementById('chat-input')
        this.chatInput?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter')
                this.sendMessage()
        });
        this.connectWsChat();
		this.connectWsStateUpdate();
	}

    sendMessageToUser = (user) => {
		const maxId = Math.max(...state.channels.map(channel => channel.id), 0);
		const channel = state.channels.find(channel => channel.name === 'user_'+user.id);
		const channelName = "user_"+user.id


		if (user.nickname === state.profile.nickname)
			return ;
		else if (!channel)
			state.channels.push({name: channelName, id: maxId + 1, notifications: 0, invite: false});

		state.isPlayerListChecked = true;
		state.activeChannel = channelName
		this.chatInput?.focus()
	}

	chatCheckHandler() {
		state.isChatBubbleChecked = !state.isChatBubbleChecked;
	}

	playerListCheckHandler() {
		state.isPlayerListChecked = !state.isPlayerListChecked;
	}

	getFirstLetter(word) {
        if (word.startsWith('user')) {
			const user = state.users.find(user => 'user_'+user.id === word);
        	return user.username[0]
        }
		return (word[0]);
	}

	getHiddenStatus(isMobile, isChatBubbleChecked) {
		return !(!isMobile || (isMobile && !isChatBubbleChecked));
	}

	isActiveChannel(channelName) {
		return (channelName == state.activeChannel);
	}

	blockUser(tmpUser) {
		if (tmpUser.nickname === state.profile.nickname)
			return ;
		else if (state.profile.blocked.some(user => user.nickname === tmpUser.nickname)) {
			var indexToRemove = state.profile.blocked.findIndex(user => user.id === tmpUser.id);

			state.profile.blocked.splice(indexToRemove, 1);
			state.messages.push({text: 'You have unblock ' + tmpUser.nickname + '.', sender: 'Pong', nickname: 'Pong', date: Date.now(), channel: 'global'});
		}
		else {
			state.profile.blocked.push({id: tmpUser.id, nickname: tmpUser.nickname});
			state.messages.push({text: 'You have block ' + tmpUser.nickname + '.', sender: 'Pong', nickname: 'Pong', date: Date.now(), channel: 'global'});
		}
		if (state.activeChannel == 'global') {
			var message = this.shadowRoot.getElementById("messages");
			message.scrollTop = message.scrollHeight;
		}
		state.isPlayerListChecked = true;
	}

	addFriend(tmpUser) {
		if (tmpUser.nickname === state.profile.nickname)
			return ;
		else if (state.profile.friends.some(user => user.nickname === tmpUser.nickname)) {
			var indexToRemove = state.profile.friends.findIndex(user => user.id === tmpUser.id);

			state.profile.friends.splice(indexToRemove, 1);
			state.messages.push({text: 'You have remove ' + tmpUser.nickname + ' from your friends list.', sender: 'Pong', nickname: 'Pong', date: Date.now(), channel: 'global'});
		}
		else {
			state.profile.friends.push({id: tmpUser.id, nickname: tmpUser.nickname});
			state.messages.push({text: 'You have added ' + tmpUser.nickname + ' to your friends list.', sender: 'Pong', nickname: 'Pong', date: Date.now(), channel: 'global'});
		}
		if (state.activeChannel == 'global') {
			var message = this.shadowRoot.getElementById("messages");
			message.scrollTop = message.scrollHeight;
		}
		state.isPlayerListChecked = true;
	}

	getUserPictureFromString(string) {
		const user = state.users.find(user => 'user_'+user.id === string);
		const backgroundSize = 'cover';
		const backgroundPos = 'center';
		let backgroundImage = undefined;

		if (user) {
			backgroundImage = 'url(' + user.picture + ')';
		}
		else {
			backgroundImage = 'url(/media/avatars/default.jpg';
		}
		return ('background-image: ' + backgroundImage + '; background-size: ' + backgroundSize + '; background-position: ' + backgroundPos + ';');
	}

	getProfilePicture(tmpUser) {
		const user = state.users.find(user => user.nickname === tmpUser);

		if (user) {
			return user.picture;
		}
		else {
			return '/media/avatars/default.jpg';
		}
	}

	getUserFullNameFromString(string) {
		const user = state.users.find(user => user.nickname === string);

		if (user && user.fullname != 'Jean Michel')
			return (user.fullname)
		else
			return (string);
	}

	isMessageInChannel(messageChannel, sender, activeChannel) {
		if (state.profile.blocked.some(user => user.nickname === sender))
			return true;
		return !(messageChannel == activeChannel);
	}

	isMyFriend(friendsList, sender) {
		if (state.profile.friends?.some(user => user.nickname === sender.nickname))
			return false;
		return true;
	}

	getUserStatus(user, game_id, tournament_id) {
		if (tournament_id > 0)
			return 'IT';
		else if (game_id > 0)
			return 'IG';
		return (user?.is_connected ? 'ON' : 'OFF');
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
		const user = state.users.find(user => user.nickname === nickname);

		state.profileLooking = user.id
		navigateTo('/profile');
		return false;
	}

	sendMessage() {
		const inputNode = this.shadowRoot.getElementById("chat-input");
		const text = inputNode.value
		const tmp = state.users.find(user => 'user_'+user.id === state.activeChannel);
		let send = true;

		if (!text)
			return ;

		if (text === '/invite') {
			if (state.activeChannel != "global")
				state.messages.push({text: 'You have invite ' + tmp.nickname + ' to join your current room.', sender: 'Pong', nickname: 'Pong', date:Date.now(), channel: state.activeChannel});
			else {
				state.messages.push({text: 'You need to be in a private channel to invite.', sender: 'Pong', nickname: 'Pong', date:Date.now(), channel: state.activeChannel});
				send = false;
			}
		}
		else if (text === '/join') {
			if (state.activeChannel != "global") {
				const isInvite = state.channels.find(channel => channel.name === state.activeChannel);

				if (isInvite.invite) {
					state.messages.push({text: 'Joining ' + state.activeChannel + '.', sender: 'Pong', nickname: 'Pong', date:Date.now(), channel: state.activeChannel});

					let url;
					const user = state.users.find(user => 'user_'+user.id === state.activeChannel);
					var dataToSend = {
						action: "join"
					};

					if (user.current_tournament_id !== -1)
						url = "/api/manage-tournament/" + user.current_tournament_id + "/";
					else
						url = "/api/manage-game/" + user.current_game_id + "/";

					put2(url, dataToSend)
						.catch ( err => console.log('ERROR', err))

					isInvite.invite = false;
				}
				else {
					state.messages.push({text: state.activeChannel + ' didn\'t invite you.', sender: 'Pong', nickname: 'Pong', date:Date.now(), channel: state.activeChannel});
					send = false;
				}
			}
			else {
				state.messages.push({text: 'You need to be in a private channel to join.', sender: 'Pong', nickname: 'Pong', date:Date.now(), channel: state.activeChannel});
				send = false;
			}
		}
		else if (state.activeChannel != "global")
			state.messages.push({text, sender:state.profile.id, nickname: state.profile.nickname, date:Date.now(), channel: state.activeChannel})

		if (send == true)
			this._sendWsMessage(tmp ? tmp.id : state.activeChannel, text)

		var message = this.shadowRoot.getElementById("messages");
		message.scrollTop = message.scrollHeight;
        this.chatInput.value = ""
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
