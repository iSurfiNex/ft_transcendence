
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
 	placeholder="name@example.com">
   <label for="firstNameInput">{language.firstName}</label>
 </div>

 <div class="form-floating">
   <input
 	type="text"
 	class="form-control"
 	id="lastNameInput"
 	placeholder="name@example.com">
   <label for="lastNameInput">{language.lastName}</label>
 </div>

</div>

<div class="form-floating mb-3">
  <input
	type="text"
	class="form-control"
	id="pseudoInput"
 	placeholder="name@example.com">
   <label for="pseudoInput">{language.pseudo}</label>
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
<button class="btn btn-primary" @click="this.submitProfileUpdate()">{language.save}</button>
`

	static css = css`
`
	observers = {
		'player.active': active => console.log("active?: ", active)
	}

    submitProfileUpdate() {
        const avatarInput = this.shadowRoot.getElementById('avatarInput');
        const pseudoInput = this.shadowRoot.getElementById('pseudoInput');
        const avatar = avatarInput.files && avatarInput.files[0]
        const pseudo = pseudoInput.value

        const formData = new FormData();

        if (avatar)
            formData.append('avatar', avatar);

        if (pseudo)
            formData.append('name', pseudo);

        const onSuccess = (resp) => {
            if (resp.status !== "success"){
                console.error('update profile request failed :(')
                return
             }
            console.log('update profile success!')
        }
        const onFailure = () => {
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
}

register(PongUpdateProfile);
