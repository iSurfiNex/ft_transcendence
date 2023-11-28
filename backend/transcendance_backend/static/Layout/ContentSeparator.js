import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongContentSeparator extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="layout">
		<div class="vertical-separator"></div>
		<div class="horizontal-separator"></div>
	</div>
`

	static css = css`
	@media only screen and (max-width: 768px) {
		.horizontal-separator {
			position: fixed;
			right: 0;
			top: calc(10% - 1px);
			width: 100%;
			height: 7px;
			background-color: #424242;
			z-index: 12;
		}

		.vertical-separator {
			position: fixed;
			left: 25%;
			top: 0;
			width: 8px;
			height: 10%;
			background-color: #424242;
			z-index: 12;
		}
	}

	@media only screen and (max-height: 524px) {
		.horizontal-separator {
			position: fixed;
			right: 0;
			top: calc(10% - 1px);
			width: 100%;
			height: 7px;
			background-color: #424242;
			z-index: 12;
		}

		.vertical-separator {
			position: fixed;
			left: 25%;
			top: 0;
			width: 8px;
			height: 10%;
			background-color: #424242;
			z-index: 12;
		}
	}

	@media only screen and (min-width: 768px) and (min-height: 524px) {
		.vertical-separator {
			position: fixed;
			left: 25%;
			top: 0;
			width: 10px;
			height: 100%;
			background-color: #424242;
			z-index: 12;
		}

		.horizontal-separator {
			position: fixed;
			right: 0;
			top: 10%;
			width: 75%;
			height: 10px;
			background-color: #424242;
			z-index: 12;
		}
	}
`
	observers = {
		'player.active': active => console.log("active?: ", active)
	}

	connectedCallback() {
		initPopover(this);
	}
}

register(PongContentSeparator);
