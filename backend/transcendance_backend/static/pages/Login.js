import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongLogin extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div>
		<button @click="this.handleClick()">Connect</button>
		<button @click="this.handlePostRequest()">PostRequest</button>
		<p>{type}</p>
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

	handleClick() {
		const apiUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080&redirect_uri=https%3A%2F%2Flocalhost%3A8000%2Flogin%2F&response_type=code&state=trucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbidule';

		window.location.href = apiUrl;
	}

	handlePostRequest = async () => {
		const type = new URLSearchParams(window.location.search).get("code");

		const postData = {
			grant_type: 'authorization_code',
			client_id: 'u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080',
			client_secret: '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',
			code: type, // Replace {type} with the actual value
			state: 'trucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbidule',
			redirect_uri: 'https://localhost:8000/login/',
		};
		const formData = new FormData();
		formData.append("grant_type", "authorization_code");
		formData.append("client_id", "u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080");
		formData.append("client_secret", "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");
		formData.append("code", type);
		formData.append("state", "trucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbiduletrucbidule");
		formData.append("redirect_uri", "https://localhost:8000/login/");
		try {
				const response = await fetch('https://api.intra.42.fr/oauth/token', {
				method: 'POST',
				headers: {
					//'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
					'Access-Control-Allow-Origin': 'https://api.intra.42.fr',
				},
				mode: 'no-cors',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			console.log(data);
		} catch (error) {
				console.error('There was a problem with the fetch operation:', error);
			}
		};
}

register(PongLogin)
