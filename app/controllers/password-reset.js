import Controller from '@ember/controller';
import ENV from 'nanowrimo/config/environment';
//import fetch from 'fetch';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import passwordResetValidation from 'nanowrimo/validations/password-reset-attempt';

export default Controller.extend({
  //what queryParams do we care about?
  queryParams: ['token'],
  token: '',
  changeset: null,
  errorMessage: null,
  successMessage: null,
  init() {
    this._super(...arguments);
    let pra =  this.store.createRecord('password-reset-attempt');
    this.set("changeset", new Changeset(pra, lookupValidator(passwordResetValidation), passwordResetValidation));
  },
  
  actions: {
    submit(formObj) {
      //get the changeset from the form object
      let changeset = formObj.changeset;
      //validate the changeset
      changeset.validate();
      //if the changeset is valid...
      if (changeset.get('isValid')) {
        //get the token and password 
        let token = changeset.get('token');
        let password = changeset.get('password');
        let url = `${ENV.APP.API_HOST}/users/password_reset`;
        // send the data as a POST so that the password doesn't end up in the server logs
        return fetch(url, {
          body: JSON.stringify({token:token, password:password}),
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }).then((response) => {       
          if (!response.ok) {
            this.set('errorMessage', 'failed to update password');
          } else {
            return response.json().then((json) => {
              if (json.error) {
                this.set('errorMessage', json.error);
              }else if (json.message) {
                this.set('successMessage', json.message);
              }
            });
          }
        });
      }
    }
  }

});
