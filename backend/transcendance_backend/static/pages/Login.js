import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongLogin extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="login" loading="{loginLoading}">
		<div class="input">
			<div class="login-register">
				<form id="form-login" @submit="this.onLoginFormSubmit(event)">
					<input name="username" type="text" placeholder="{language.username}" class="input-field">
                    <div class="field-error">{loginErrors.username}</div>
					<input name="password" type="password" placeholder="{language.password}" class="input-field">
                    <div class="field-error">{loginErrors.password}</div>
					<button id="login-button" class="input-button pushable" type="submit">
						<span class="front">{language.login}</span>
					</button>
				</form>
				<form id="form-register" @submit="this.onRegisterFormSubmit(event)">
					<input name="username" type="text" placeholder="{language.username}" class="input-field">
                    <div class="field-error">{registerErrors.username}</div>
					<input name="password2" type="password" placeholder="{language.password}" class="input-field">
                    <div class="field-error">{registerErrors.password2}</div>
<!--					<input name="password1" type="password" placeholder="{language.confirmPassword}" class="input-field"> -->
					<button id="register-button" class="input-button pushable" type="submit">
						<span class="front">{language.register}</span>
					</button>
				</form>
			</div>

            <div class="field-error">{registerErrors.__all__}</div>
            <div class="field-error">{loginErrors.__all__}</div>
			<span class="separator">―――――――――――――――――</span>
			<button id="pong-button" @click="this.connectionWith42()" class="pushable">
				<span class="front">{language.connectionWith}</span>
			</button>
		</div>
	</div>
`

	static css = css`
	.login::after {
		content: '';
		position: absolute;
		top: 0;
		height: 0;
		width: 100vw;
		height: 100vh;
		background: white;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.4s;
	}

	.login[loading]::after {
		opacity: 0.4;
		pointer-events: auto;
	}

	@media only screen and (max-width: 768px) {
		.login-register {
			display: flex;
			flex-direction: column;
		}

		#form-register {
			display: flex;
			flex-direction: column;
		}
	}

	@media only screen and (max-height: 524px) {
		.login-register {
			display: flex;
			flex-direction: row;
		}

		#form-register {
			display: flex;
			flex-direction: column;
			margin-left: 25px;
		}
	}

	@media only screen and (min-width: 769px) and (min-height: 525px) {
		.login-register {
			display: flex;
			flex-direction: row;
		}

		#form-register {
			display: flex;
			flex-direction: column;
			margin-left: 25px;
		}
	}

	.field-error {
		color: red;
		white-space: pre-line;
		position: relative;
		top: -10px;
		font-size: 14px;
		left: 8px;
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

	#form-login {
		display: flex;
		flex-direction: column;
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
            state.loginLoading = true;
			const hostname = window.location.origin + '/api/request_42_login/?type=login&code=' + type
			const response = fetch(hostname, {
				method: 'GET',
			}).then(async (response)=>{
                if (!response.ok)
                    throw(new Error('Error 42'))
				const resp = await response.json()
				sessionStorage.setItem("access_token", resp.access_token);
                this.handleLogin(resp)
			}).catch(err => {
                state.loginErrors.__all__ = "Error 42"
                state.loginLoading = false;
            })
		}
	}

    resetFormErrors() {
        state.loginErrors = {
                username: '',
                password: '',
                __all__: '',
        }
        state.registerErrors = {
                username: '',
                password2: '',
                __all__: '',
        }
    }

    setCookie(name, value, days) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + days);

        const cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;

        document.cookie = cookieValue;
    }

    handleLogin(data) {
        const errors = data['errors']
        console.log(errors)
        if (errors !== undefined) {
            for (const [key, errMsg] of Object.entries(errors)) {
                if (!Array.isArray(errMsg))
                    continue
                state.loginErrors[key] = errMsg.join('\n')
            }
            return
        }
	    setCookie('loggedin', true, 7);
        state.whoAmI = data['username']
        state.profile = data['profile']
        navigateTo('/')
        state.loginLoading = false;
    }

    onLoginFormSubmit(event) {
        this.resetFormErrors()
        event.preventDefault();
        state.loginLoading = true;
        const formData = new FormData(event.target);
        post('/api/login/',formData)
            .then(data => this.handleLogin(data))
    .catch(error => {
        console.log(error)
        // Handle errors
        console.error('Error:', error);
        state.loginErrors.__all__ = state.language.errUnknown
        state.loginLoading = false;
    })
    }

    onRegisterFormSubmit(event) {
        this.resetFormErrors()
        event.preventDefault();
        state.loginLoading = true;
        const formData = new FormData(event.target);
        formData.append('password1', formData.get('password2'))
        post('/api/register/',formData)
        .then(data => {
            const errors = data['errors']
            if (errors !== undefined) {
                for (const [key, errMsg] of Object.entries(errors)) {
                    if (!Array.isArray(errMsg))
                        continue
                    state.registerErrors[key] = errMsg.join('\n')
                }
            return
        }
		const formRegisterNode = this.shadowRoot.getElementById("form-register");
        formRegisterNode.reset()
	    setCookie('loggedin', true, 7);
        state.whoAmI = data['username']
        state.profile = data['profile']
        navigateTo('/')
        state.loginLoading = false;
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        state.registerErrors.__all__ = state.language.errUnknown
        state.loginLoading = false;
    })
    }

	connectionWith42() {
		const hostname = encodeURIComponent(window.location.origin + '/login/')
		const apiUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080&redirect_uri=' + hostname + '&response_type=code';

		window.location.href = apiUrl;
	}
}

register(PongLogin)
