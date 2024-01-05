import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongCreateGame extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="available-space">
		<div class="create-game">
			<div class="top-bar"><span class="title">1 VS 1</span></div>
			<div class="options-list"> 
				<div class="option">   
			    	<span class="switch">
        				<label class="slider">
        				    <input type="checkbox">
        				    <span class="slider"></span>
        				</label>
					</span>	
					<span class="mode">Power-up</span>
				</div> 
				
				<div class="option"> 
					<span class="switch">
        				<label class="slider">
        				    <input type="checkbox">
        				    <span class="slider"></span>
        				</label>
					</span>
					<span class="mode">Private game</span>
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

	@media only screen and (max-width: 768px) {
		.available-space {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 6px);
			background-color: rgba(255, 255, 255, 0.5);
		}
	}


	@media only screen and (max-height: 524px) {
		.available-space {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: calc(90% - 6px);
			background-color: rgba(255, 255, 255, 0.5);
		}
	}


	@media only screen and (min-width: 768px) and (min-height: 524px) {
		.available-space {
			position: absolute;
			right: 0;
			bottom: 0;
			width: calc(75% - 10px);
			height: calc(90% - 10px);
			background-color: rgba(255, 255, 255, 0.5);
		}
	}

	.create-game {
		position: absolute;
		bottom: 0;
		left: 25%;
		width: 50%;
		height: calc(100% - 70px);
		//width: 715px;
		//height: 685px;
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
		font-size: 7vh;
		white-space: nowrap;
	}

	.options-list {
		position: absolute;
		top: 25%;
		width: 100%;
		height: 75%;
	}

	.option {
		position: relative;
		display: flex;
		align-items: center;
		top: 8%;
		left: 20%;
		width: 60%;
		height: 10%;
		margin-bottom: 6.5%;
		white-space: nowrap;
	}
	
	.mode {
		position: absolute;
		left: calc(5% + 90px);
		font-family: 'Press Start 2P', sans-serif;
		font-size: 2.5vh;
		overflow: hidden; 
		color: white;
	}

	.switch {
    	position: absolute;
    	left: 5%;
    	top: 50%;
    	transform: translate(0%, -50%);
    	display: inline-block;
    	width: 60px;
    	height: 34px;
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
	    height: 26px;
	    width: 26px;
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
	    -webkit-transform: translateX(26px);
	    -ms-transform: translateX(26px);
	    transform: translateX(26px);
	}

`

	observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this)
	}
}

register(PongCreateGame)
