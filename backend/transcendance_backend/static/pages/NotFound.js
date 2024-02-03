import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongNotFound extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="not-found">
		<div class="text">
			<span class="error-number">404</span>
			<span class="error-text">{language.pageNotFound}</span>
		</div>
		<button id="pong-button" onclick="navigateTo('/'); return false;" class="pushable">
			<span class="front">{language.returnToHome}</span>
		</button>
	</div>
`

	static css = css`
	@media only screen and (max-width: 768px) {
		.not-found {
			position: absolute;
			width: 100%;
			height: calc(90% - 8px);
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-family: 'Press Start 2P', sans-serif;
		}
	}

	@media only screen and (max-height: 524px) {
		.not-found {
			position: absolute;
			width: 100%;
			height: calc(90% - 8px);
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-family: 'Press Start 2P', sans-serif;
		}
	}

	@media only screen and (min-width: 769px) and (min-height: 525px) {
		.not-found {
			position: absolute;
			width: calc(75% - 10px);
			height: calc(90% - 10px);
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-family: 'Press Start 2P', sans-serif;
		}
	}

	.text {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: column;
		color: white;
	}

	.error-number {
		font-size: 60px;
	}

	.error-text {
		font-size: 25px;
		margin-bottom: 50px;
	}

	.pushable {
		background: hsl(130, 100%, 32%);
		border-radius: 12px;
		border: none;
		padding: 0;
		cursor: pointer;
		outline-offset: 4px;
	}

	.front {
		display: block;
		padding: 12px 42px;
		border-radius: 12px;
		font-size: 1.25rem;
		background: hsl(123, 100%, 39%);
		color: white;
		transform: translateY(-6px);
		font-family: 'Press Start 2P', sans-serif;
	}

	.pushable:active .front {
		transform: translateY(-2px);
	}
`

	observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this)
	}
}

register(PongNotFound)
