import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongCreateGame extends Component {
	//onSwitchChange(event) {this.shadowRoot.getElementById("input-players").hidden = false;}
	static sheets = [bootstrapSheet]
	static template = html`
	<meta name="csrf-token" content="{% csrf_token %}">
	<div class="available-space">
		<div class="create-game">
			<div class="top-bar"><span class="title">{language.GameEditor}</span></div>
			<div class="options-list"> 
				
				<div class="option">
					<input class="input-score" id="max-score" type="number" min="1" max="100" step="1" value="10">
					<span class="mode">Max Score</span>
				</div>

				<div class="option">   
			    	<span class="switch">
        				<label class="slider">
        				    <input type="checkbox" id="toggle-Powerups">
        				    <span class="slider"></span>
        				</label>
					</span>	
					<span class="mode">{language.PowerUp}</span>
				</div> 
				

				<div class="option"> 
					<span class="switch">
        				<label class="slider">
        				    <input type="checkbox" id="toggle-IA">
        				    <span class="slider"></span>
        				</label>
					</span>
					<span class="mode">IA</span>
				</div>
				
				<div class="option">   
			    	<span class="switch">
        				<label class="slider">
        				    <input type="checkbox" id="toggle-Tournament">
        				    <span class="slider"></span>
        				</label>
					</span>	
					<span class="mode">{language.Tournament}</span>
				</div>
			</div>
			
			<div class="bottom-bar">
				<div class="button-space"> 
					<button class="btn create-button" @click="this.createGame()">{language.Create}</button>
					<button class="btn cancel-button" @click="this.cancelGame()">{language.Cancel}</button>
				</div>
			</div>
			
		</div>
</div>
`

	static css = css`
	@keyframes fadeIn {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}

	@media only screen and (max-width: 370px) {
		.available-space {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 6px);
			background-color: rgba(255, 255, 255, 0.5);
		}
		.create-game {
			position: absolute;
			bottom: 0;
			left: 10%;
			width: 80%;
			height: calc(100% - 70px);
			background-color: rgb(112, 112, 112);
			overflow: hidden;
			display: flex;
			align-items: center;
		}
		.top-bar {
			position: absolute;
			top: 0%;
			width: 100%;
			height: 15%;
			text-align: center;
			justify-content: center;

			font-family: 'Courier New', monospace;
        	font-size: 6vh;
        	color: white;
        	text-shadow: 
        	    2px 2px 3px #ff6600,
        	    4px 4px 6px #cc3300,
        	    6px 6px 9px #993300;
        	text-align: center;
		}

		.title {
			position: absolute;
			top: 0%;
			left: 0%;
			width: 100%;
			height: 100%;
			vertical-align: text-bottom;
			font-family: 'Press Start 2P', sans-serif;
			font-size: 7vw;
			white-space: nowrap;
		}

		.options-list {
			position: absolute;
			top: 15%;
			width: 100%;
			height: 85%;
		}

		.option {
			position: relative;
			display: flex;
			align-items: center;
			top: 8%;
			left: 0;
			width: 100%;
			height: 10%;
			margin-bottom: 6.5%;
			white-space: nowrap;
		}
	
		.mode {
			position: absolute;
			left: calc(5% + 90px);
			font-family: 'Press Start 2P', sans-serif;
			font-size: 3vw;
			overflow: hidden; 
			color: white;
		}

		.switch {
    		position: absolute;
    		left: 15%;
    		top: 50%;
    		transform: translate(0%, -50%);
    		display: inline-block;
    		width: 45px;
    		height: 25px;
			margin-right: 10px;
		}

		.switch input {
		    opacity: 0;
		    width: 0;
		    height: 0;
		}

		.slider {
		    position: absolute;
		    cursor: pointer;
		    top: 0;
		    left: 0;
		    right: 0;
		    bottom: 0;
		    background-color: #ccc;
		    -webkit-transition: .4s;
		    transition: .4s;
			border-radius: 34px;
		}

		.slider:before {
		    position: absolute;
		    content: "";
		    height: 18px;
		    width: 18px;
		    left: 4px;
		    bottom: 4px;
		    background-color: white;
		    -webkit-transition: .4s;
		    transition: .4s;
			border-radius: 50%;
		}

		input:checked + .slider {
		    background-color: #07bb16;
		}

		input:focus + .slider {
		    box-shadow: 0 0 1px #2196F3;
		}

		.switch input:checked + .slider:before {
		    -webkit-transform: translateX(20px);
		    -ms-transform: translateX(20px);
		    transform: translateX(20px);
		}

		.create-button {
    	    position: absolute;
    	    width: 70%;
			height: 10%;
    	    left: 15%;
			bottom: 25%;
    	    align-items: center;
			white-space: nowrap;
			overflow: hidden;

			font-family: 'Press Start 2P', sans-serif;
			font-size: 4vw;
    	    background-color: transparent;
    	    color: #00ff00;
    	    border: 1px solid #00ff00;
    	    transition: background-color 0.3s, color 0.3s;
    	    opacity: 0.6;
    	}

    	.create-button:hover {
    	    background-color: #00ff00;
    	    color: #2a2a2a;
    	    opacity: 1;
    	}

		.cancel-button {
        	position: absolute;
        	width: 70%;
			height: 10%;
        	right: 15%;
			bottom: 10%;
        	align-items: center;
			white-space: nowrap;
			overflow: hidden;

			font-size: 4vw;
			font-family: 'Press Start 2P', sans-serif;
        	background-color: transparent;
        	color: #ff0019;
        	border: 1px solid #ff0019;
        	transition: background-color 0.3s, color 0.3s;
        	opacity: 0.6;
    	}

    	.cancel-button:hover {
    	    background-color: #ff0019;
    	    color: #2a2a2a;
    	    opacity: 1;
    	}	
	
	}












	@media only screen and (min-width: 370px){
		.available-space {
			position: absolute;
			right: 0;
			bottom: 0;
			width: calc(75% - 10px);
			height: calc(90% - 10px);
			background-color: rgba(255, 255, 255, 0.5);
			
		}

		.create-game {
			position: absolute;
			bottom: 0;
			left: 25%;
			width: 50%;
			height: calc(100% - 70px);
			background-color: rgb(112, 112, 112);
			overflow: hidden;
			display: flex;
			align-items: center;
		}

		.top-bar {
			position: absolute;
			top: 0%;
			width: 100%;
			height: 15%;
			text-align: center;
			justify-content: center;

			font-family: 'Courier New', monospace;
        	font-size: 6vh;
        	color: white;
        	text-shadow: 
        	    2px 2px 3px #ff6600,
        	    4px 4px 6px #cc3300,
        	    6px 6px 9px #993300;
        	text-align: center;
		}

		.title {
			position: absolute;
			top: 0%;
			left: 0%;
			width: 100%;
			height: 100%;
			vertical-align: text-bottom;
			font-family: 'Press Start 2P', sans-serif;
			font-size: 3vw;
			white-space: nowrap;
		}

		.bottom-bar {
			position: absolute;
			bottom: 0;
			height: 10%;
			width: 100%;
		}

		.options-list {
			position: absolute;
			top: 15%;
			width: 100%;
			height: 75%;
			background-color: rgb(86, 86, 86);
			overflow: auto;
		}

		.option {
			position: relative;
			display: flex;
			align-items: center;
			top: 8%;
			left: 0%;
			width: 100%;
			height: 10%;
			margin-bottom: 4%;
			white-space: nowrap;
		}
	
		.mode {
			position: absolute;
			left: calc(40% + 10px);
			font-family: 'Press Start 2P', sans-serif;
			font-size: 1vw;
			overflow: hidden; 
			color: white;
		}

		.switch {
    		position: absolute;
    		left: 30%;
    		top: 50%;
    		transform: translate(0%, -50%);
    		display: inline-block;
    		width: 7%;
    		height: 45%;
			margin-right: 10px;
		}

		.switch input {
		    opacity: 0;
		    width: 0;
		    height: 0;
		}

		.slider {
		    position: absolute;
		    cursor: pointer;
		    top: 0;
		    left: 0;
		    right: 0;
		    bottom: 0;
		    background-color: #ccc;
		    -webkit-transition: .4s;
		    transition: .4s;
			border-radius: 34px;
		}

		.slider:before {
		    position: absolute;
		    content: "";
		    height: 80%;
		    width: 45%;
		    left: 4px;
		    bottom: 2.5px;
		    background-color: white;
		    -webkit-transition: .4s;
		    transition: .4s;
			border-radius: 50%;
		}

		input:checked + .slider {
		    background-color: #07bb16;
		}

		input:focus + .slider {
		    box-shadow: 0 0 1px #2196F3;
		}

		.switch input:checked + .slider:before {
		    -webkit-transform: translateX(15px);
		    -ms-transform: translateX(15px);
		    transform: translateX(15px);
		}

		.create-button {
    	    position: absolute;
    	    width: 20%;
			height: 60%;
    	    left: 3%;
			top: 27%;
    	    align-items: center;
			white-space: nowrap;
			overflow: hidden;

			font-family: 'Press Start 2P', sans-serif;
			font-size: 0.9vw;
    	    background-color: transparent;
    	    color: #00ff00;
    	    border: 1px solid #00ff00;
    	    transition: background-color 0.3s, color 0.3s;
    	    opacity: 0.6;
    	}

    	.create-button:hover {
    	    background-color: #00ff00;
    	    color: #2a2a2a;
    	    opacity: 1;
    	}

		.cancel-button {
        	position: absolute;
        	width: 20%;
			height: 60%;
        	right: 3%;
			top: 27%;
        	align-items: center;
			white-space: nowrap;
			overflow: hidden;

			font-size: 0.9vw;
			font-family: 'Press Start 2P', sans-serif;
        	background-color: transparent;
        	color: #ff0019;
        	border: 1px solid #ff0019;
        	transition: background-color 0.3s, color 0.3s;
        	opacity: 0.6;
    	}

    	.cancel-button:hover {
    	    background-color: #ff0019;
    	    color: #2a2a2a;
    	    opacity: 1;
    	}

		.nb-players {
			position: absolute;
			bottom: 26%;
			left: 29%;
			width: 35%;
			height: 10%;
			margin-top: 10px;
			white-space: nowrap;

			font-family: 'Press Start 2P', sans-serif;
			font-size: 1vw;
			color: white;

		}

		.input-players {
			position: absolute;
			top: 27%;
			left: 33%;
			width: 35%;
			height: 60%;
			white-space: nowrap;

			font-family: 'Press Start 2P', sans-serif;
			font-size: 0.7vw;
			color: gray;
		}

		.input-score {
			position: absolute;
			left: 30%;
			width: 7%;
			height: 55%;
		}
	}

	::-webkit-scrollbar {
		width: 0;
		background: transparent;
	}


`

	observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		//const socket = ws('state-update');
		//
		//socket.addEventListener("open", (event) => {
		//	console.log("Websocket Connected");
		//})
		//
		//socket.addEventListener("error", (event) => {
		//	console.error("Websocket Error: ", event);
		//})
//
		//socket.addEventListener("close", (event) => {
		//	console.log("WebSocket connection closed: ", event);
		//	console.log("Close code: ", event.code);
		//	console.log("Error type: ", event.type);
		//  });
//
		//socket.addEventListener("message", (event) => {
		//	let data = JSON.parse(event.data);
		//	console.log('Received message:', data);
		//	console.log('action: ', data.action);
		//	console.log('data_type: ', data.data_type);
		//	stateUpdate(event);
		//});
	}
	
	$id(str) {
		return this.shadowRoot.getElementById(str);
	}

	getCSRF() {
		const token = document.cookie
			.split('; ')
			.find(row => row.startsWith('csrftoken='))
			.split('=')[1];
		return (token);
	}

	createGame() {
		if (this.shadowRoot.getElementById("toggle-Tournament").checked == true)
			this.newTournament();
		else
			this.newGame();
		return (false);
	}


	newGame() {
		const dataToSend = {
			goal_objective: this.$id("max-score").value,
			ia: this.$id("toggle-IA").checked,
			power_ups: this.$id("toggle-Powerups").checked,
			created_by: state.whoAmI,
		}

		post2("/api/manage-game/", dataToSend)
		.then(data => {
			navigateTo('/play/waiting-room');
		})
	}


	newTournament() {
		const dataToSend = {
			state: "waiting",
			goal_objective: this.$id("max-score").value,
			created_by: state.whoAmI,
			power_ups: this.$id("toggle-Powerups").checked, 
		}	

		post2("/api/manage-tournament/", dataToSend)
		.then(data => {
			navigateTo('/play/tournament-wr');
		})
	}	

	cancelGame() {
		navigateTo('/play/pong'); 
		return false;
	}

}

register(PongCreateGame)
