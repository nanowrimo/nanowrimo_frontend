import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  currentUser: service(),
  session: service(),
	termsText: null,
  init(){
    this._super(...arguments);
  },
  displayBanner: computed('currentUser.user.birthday', function(){
		// do we know the user's age?
		let bday = this.get('currentUser.user.birthday');
		return  bday == null;
	}),
	

  
  actions: {
		onModalShow(){
			this.getTerms();
		},
		over18clicked() {
			this.set('displayBirthdayInput', false);
			return true;
		},
		under18clicked() {
			this.set('displayBirthdayInput', true);
			return true;
		},
		
    confirmTermsSubmit() {
			// start building a payload
			let payload = {};
			// get the form
			var formData = new FormData(event.target);
			payload.over18 = formData.get('over18');
			if (payload.over18==0) {
				//get the birthday
				payload.birthdate = formData.birthdate;
			}
			return;
			let { auth_token }  = this.get('session.data.authenticated');
			let url = `${ENV.APP.API_HOST}/users/confirm_terms`;
			// send the data as a POST so that the email doesn't end up in the server logs
			return fetch(url, {
				body: JSON.stringify(payload),
				method: 'POST',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
					'Authorization': auth_token
				}
			}).then((response) => {       
				if (!response.ok) {
					// what should happen here?
				}
				return response.json().then((json) => {
					if (json.error) {
						this.set('errorMessage', json.error);
					}else if (json.message) {
						this.set('successMessage', json.message);
						// hide the modal
						modal.close();
						// show the success alert
						this.set('displaySuccessAlert', true);
						this.set('emailSent', true);
					}
				});
      });
    }
  },
  getTerms(){
		//get the html from /pages/terms-and-conditions
		let url = `${ENV.APP.API_HOST}/pages/terms-and-conditions`;
		// send the data as a POST so that the email doesn't end up in the server logs
		return fetch(url, {

			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		}).then((response) => {       
			if (!response.ok) {
				// what should happen here?
			}
			return response.json().then((json) => {
				if (json.error) {
					this.set('errorMessage', json.error);
				}else {
					this.set("termsText", json.data.attributes.body);
				}
			});
		});
	}
	

});
