import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  currentUser: service(),
  session: service(),
  emailSent: false,
  displayResendForm: false,
  displaySuccessAlert: false,
  emailError: false,
  successMessage: false,
  errorMessage: null,
  
  init(){
    this._super(...arguments);
  },
  displayUnverifiedAlert: computed('currentUser.user.isNotConfirmed','emailSent', function(){
    return this.get('currentUser.user.isNotConfirmed') && !this.get('emailSent');
  }),
  
  actions: {
    dismissSuccess(){
      this.set('displaySuccessAlert', false);
    },
    resendClicked(){
      //display the modal
      this.set('displayEmailModal', true);
    },
    onModalShow(){
    },
    onModalHidden(){
      this.set('displayEmailModal', false);
    },
    confirmEmailSubmit(modal) {
      let email = event.target.email.value;
      this.set('emailRecipient', email);
      if (this.validEmail(email) ){
        //get the user's auth token
        let { auth_token }  = this.get('session.data.authenticated');
        let url = `${ENV.APP.API_HOST}/users/resend_confirmation`;
        // send the data as a POST so that the email doesn't end up in the server logs
        return fetch(url, {
          body: JSON.stringify({email: email}),
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
    emailChange: function(val) {
      if (this.get('emailError') ){
        if (this.validEmail(val) ) {
          this.set('emailError', false);
        }
      }
    }
  },
  validEmail: function(value) {
    return (value.includes("@") && value.includes("."));
  }
});
