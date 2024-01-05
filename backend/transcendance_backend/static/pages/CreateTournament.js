import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongCreateGame extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="create-tournament">
	
	
	</div>
`

	static css = css`
	@media only screen and (max-width: 768px) {

	}

	@media only screen and (max-height: 524px) {

	}

	@media only screen and (min-width: 768px) and (min-height: 524px) {

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
