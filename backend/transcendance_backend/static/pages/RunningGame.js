import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongRunningGame extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<h1>RUNNING GAME PAGE</h1>
`

	static css = css`
h1 {
position: absolute;
right:30px;
top: 100px;
color: white;
}
`
}

register(PongRunningGame);
