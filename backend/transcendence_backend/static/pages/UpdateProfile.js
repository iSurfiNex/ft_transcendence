
import { Component, register, html, css } from 'pouic'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongUpdateProfile extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
	<div class="input-group mb-3">
		<div class="form-floating">
			<input
				readonly="{this.notEquals(profileLooking,profile.id)}"
				type="text"
				class="form-control"
				id="firstNameInput"
				placeholder="John"
				value="{this.getFirstName(profileLooking)}"/>
			<label for="firstNameInput">{language.firstName}</label>
			<div class="invalid-feedback">{profileErrors.first_name}</div>
		</div>

		<div class="form-floating">
			<input
				readonly="{this.notEquals(profileLooking,profile.id)}"
				type="text"
				class="form-control"
				id="lastNameInput"
				placeholder="Doe"
				value="{this.getLastName(profileLooking)}"/>
			<label for="lastNameInput">{language.lastName}</label>
			<div class="invalid-feedback">{profileErrors.last_name}</div>
		</div>
	</div>

	<div class="form-floating mb-3">
		<input
			readonly="{this.notEquals(profileLooking,profile.id)}"
			type="text"
			class="form-control"
			id="pseudoInput"
			placeholder="Toto"
			value="{this.getNickname(profileLooking)}"/>
		<label for="pseudoInput">{language.pseudo}</label>
		<div class="invalid-feedback">{profileErrors.nickname}</div>
	</div>

	<button id="avatarBtn" hidden="{this.notEquals(profileLooking,profile.id)}" class="btn btn-success">
		<label for="avatarInput" class="custom-file-input">{language.avatar}</label>
	</button>
	<input
		hidden
		id="avatarInput"
		type="file"
		accept="image/png, image/jpeg"
		@change="this.updatePictureFromInput()"
		style="display:none;"/>

	<div class="invalid-feedback">{profileErrors.avatar}</div>
	<a
		hidden="{this.hide42Profile(profileLooking)}"
		class="btn btn-primary"
		href="{profile.url_profile_42}"
		target="_blank"
	>42</a>
	<button hidden="{this.hide42Link(profileLooking)}" class="btn btn-primary" @click="this.link42Account()">{language.link42}</button>
	<button hidden="{this.notEquals(profileLooking,profile.id)}" class="btn btn-primary" @click="this.submitProfileUpdate()">{language.save}</button>
	<span hidden="{this.notEquals(profileLooking,profile.id)}" class="text-light ps-3">{profileErrors.global}</span>
`

	static css = css`
#avatarBtn {
    padding: 0;
}
#avatarBtn > label {
    padding: 8px 12px;
}
label {
	font-size: 12px;
}
button label {
	cursor: inherit;
}
`
	getFirstName(profileLooking) {
		const user = state.users.find(user => user.id === profileLooking);

		return (user.first_name ? user.first_name : 'Jean');
	}

	getLastName(profileLooking) {
		const user = state.users.find(user => user.id === profileLooking);

		return (user.last_name ? user.last_name : 'Michel');
	}

	getNickname(profileLooking) {
		const user = state.users.find(user => user.id === profileLooking);

		return (user.nickname ? user.nickname : 'unknown');
	}

	hide42Profile(profileLooking) {
		if (profileLooking !== state.profile.id)
			return true;
		else if (state.profile.id_42)
			return false;
		return true
	}

	hide42Link(profileLooking) {
		if (profileLooking !== state.profile.id)
			return true;
		else if (state.profile.id_42)
			return true;
		return false
	}

    submitProfileUpdate() {
        const inputs = {
            avatar: this.shadowRoot.getElementById('avatarInput'),
            nickname: this.shadowRoot.getElementById('pseudoInput'),
            first_name: this.shadowRoot.getElementById('firstNameInput'),
            last_name: this.shadowRoot.getElementById('lastNameInput'),
        }
        const fields = {
            avatar: inputs.avatar.files && inputs.avatar.files[0],
            nickname: inputs.nickname.value,
            first_name: inputs.first_name.value,
            last_name: inputs.last_name.value
        }

        const formData = new FormData();

        for (const [key, value] of Object.entries(fields)){
        if (value)
            formData.append(key, value);
        }

        const resetFormErrors = () => {
                for (const [key, input] of Object.entries(inputs)) {
                    input.classList.toggle('is-invalid', false)
                }
            state.profileErrors.global = ''
        }

        const onSuccess = (resp) => {
            state.profile.errors = {}
            resetFormErrors()
            if (resp.status === "success"){
                state.profileErrors.global = state.language.success
                state.profile = resp.profile
            } else {
            for (const [key, err] of Object.entries(resp.errors)) {
                state.profileErrors[key] = err
                inputs[key].classList.toggle('is-invalid', true)
            }
            }
        }

        const onFailure = (err) => {
            state.profileErrors.global = state.language.errUnknown
            console.error('update profile request failed :(')
        }
        post('/api/update_profile/', formData)
            .then(onSuccess, onFailure);
    }

    /* Update the displayed avatar with the uploaded picture */
    updatePictureFromInput() {
        console.log("update")
        const input = this.shadowRoot.getElementById('avatarInput');

        if (!input.files || !input.files[0])
            return
        const reader = new FileReader();

        reader.onload = function (e) {
            state.profile.picture = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }

    link42Account() {
		const hostname = encodeURIComponent(window.location.origin + '/profile/')
		const client_id = "hehe"
		const apiUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=' + client_id +'&redirect_uri=' + hostname + '&response_type=code';

		window.location.href = apiUrl;
	}

	notEquals(a, b) {
		return a !== b
   }
}

register(PongUpdateProfile);
