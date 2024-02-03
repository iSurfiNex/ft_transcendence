
import { Component, register, html, css } from 'pouic'
import { initPopover } from '/static/bootstrap/init_bootstrap_plugins.js'
import { bootstrapSheet } from '/static/bootstrap/bootstrap_css.js'

class PongUpdateProfile extends Component {
	static sheets = [bootstrapSheet]
	static template = html`
<div class="input-group mb-3">
 <div class="form-floating">
   <input
 	type="text"
 	class="form-control"
 	id="firstNameInput"
 	placeholder="name@example.com"
	value="{profile.first_name}"/>
   <label for="firstNameInput">{language.firstName}</label>
    <div class="invalid-feedback">{profileErrors.first_name}</div>
 </div>

 <div class="form-floating">
   <input
 	type="text"
 	class="form-control"
 	id="lastNameInput"
 	placeholder="name@example.com"
	value="{profile.last_name}">
   <label for="lastNameInput">{language.lastName}</label>
    <div class="invalid-feedback">{profileErrors.last_name}</div>
 </div>

</div>

<div class="form-floating mb-3">
  <input
	type="text"
	class="form-control"
	id="pseudoInput"
 	placeholder="name@example.com"
	value="{profile.name}">
   <label for="pseudoInput">{language.pseudo}</label>
    <div class="invalid-feedback">{profileErrors.name}</div>
</div>

<button class="btn btn-success">
	<label for="avatarInput" class="custom-file-input">
		{language.avatar}
	</label>
</button>
<input
	id="avatarInput"
	type="file"
	accept="image/png, image/jpeg"
	@change="this.updatePictureFromInput()"
	style="display:none;"/>

    <div class="invalid-feedback">{profileErrors.avatar}</div>
<a
    hidden="{!profile.id_42}"
    class="btn btn-primary"
    href="{profile.url_profile_42}"
    target="_blank"
>42</a>
<button hidden="{profile.id_42}" class="btn btn-primary" @click="this.link42Account()">{language.link42}</button>
<button class="btn btn-primary" @click="this.submitProfileUpdate()">{language.save}</button>
<span class="text-light ps-3">{profileErrors.global}</span>

`

	static css = css`
label {
    font-size: 12px;
}
button label {
    cursor: inherit;
}
`

	observers = {
		'player.active': active => console.log("active?: ", active)
	}

    submitProfileUpdate() {
        const inputs = {
            avatar: this.shadowRoot.getElementById('avatarInput'),
            name: this.shadowRoot.getElementById('pseudoInput'),
            first_name: this.shadowRoot.getElementById('firstNameInput'),
            last_name: this.shadowRoot.getElementById('lastNameInput'),
        }
        const fields = {
            avatar: inputs.avatar.files && inputs.avatar.files[0],
            name: inputs.name.value,
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
        const input = this.shadowRoot.getElementById('avatarInput');

        if (!input.files || !input.files[0])
            return
        const reader = new FileReader();

        reader.onload = function (e) {
            state.profile.avatar_url = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }

    link42Account() {
		const hostname = encodeURIComponent(window.location.origin + '/profile/')
		const apiUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-fe7d42984dd6575235bba558210f67f242c7853d17282449450969f21d6f9080&redirect_uri=' + hostname + '&response_type=code';

		window.location.href = apiUrl;
    }
}

register(PongUpdateProfile);
