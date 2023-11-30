import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongLogin extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="login">
		<div class="input">
			<div class="login-register">
				<form class="form-login">
					<input type="text" placeholder="{language.username}" class="input-field">
					<input type="password" placeholder="{language.password}" class="input-field">
					<button id="login-button" class="input-button pushable">
						<span class="front">{language.login}</span>
					</button>
				</form>
				<form class="form-register">
					<input type="text" placeholder="{language.username}" class="input-field">
					<input type="password" placeholder="{language.password}" class="input-field">
					<button id="register-button" class="input-button pushable">
						<span class="front">{language.register}</span>
					</button>
				</form>
			</div>
			<span class="separator">―――――――――――――――――</span>
			<button id="pong-button" @click="this.handleClick()" class="pushable">
				<span class="front">{language.connectionWith}</span>
			</button>
		</div>
	</div>
`

	static css = css`
	@media only screen and (max-width: 768px) {

	}

	@media only screen and (max-height: 524px) {

	}

	@media only screen and (min-width: 768px) and (min-height: 524px) {

	}

	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100vh;
	}

	.input {
		display: flex;
		flex-direction: column;
		padding: 20px;
		background-color: gray;
		border-radius: 20px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	}

	.login-register {
		display: flex;
		flex-direction: row;
	}

	.form-login {
		display: flex;
		flex-direction: column;
	}

	.form-register {
		display: flex;
		flex-direction: column;
		margin-left: 25px;
	}

	.input-field {
		padding: 10px;
		margin-bottom: 15px;
		border: none;
		border-radius: 8px;
	}

	.input-button {
		margin-top: 5px;
		margin-bottom: 15px;
	}

	.separator {
		color: #6e6e6e;
		text-align: center;
		margin-bottom: 15px;
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

		const type = new URLSearchParams(window.location.search).get("code");
		if (type) {
			const hostname = window.location.origin + '/api/requestlogin/?code=' + type
			const response = fetch(hostname, {
				method: 'GET',
			}).then(async (response)=>{
				const resp = await response.json()
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
