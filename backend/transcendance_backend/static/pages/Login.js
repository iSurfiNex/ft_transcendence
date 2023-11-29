import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongLogin extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div>
		<button @click="this.handleClick()">Connect</button>
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

		const type = new URLSearchParams(window.location.search).get("code");
		console.log(type);
		if (type) {
			const hostname = window.location.origin + '/api/requestlogin/?code=' + type
			const response = fetch(hostname, {
				method: 'GET',
			}).then(async (response)=>{
				const resp = await response.json()
				console.log(resp)
				sessionStorage.setItem("access_token", resp.access_token);
			})
		}
	}

	handleClick() {
		const hostname = encodeURIComponent(window.location.origin + '/login/')
		const apiUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080&redirect_uri=' + hostname + '&response_type=code';

		window.location.href = apiUrl;
	}
}

register(PongLogin)
