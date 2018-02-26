import Controller from '@ember/controller';
import { get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import SignInAttemptValidations from 'nanowrimo/validations/signinattempt';

export default Controller.extend({
  SignInAttemptValidations,

  router: service(),
  session: service(),

  error: null,

  signInAttempt: alias('model'),

  actions: {
    afterSubmit() {
      let { email, password } = this.get('signInAttempt');
      this.get('session').authenticate('authenticator:nanowrimo', email, password)
        .catch((json) => {
          this.set('error', get(json, 'error.user_authentication.firstObject'));
        });
    },

    authenticateFacebook() {
      this.get('session').authenticate('authenticator:torii', 'facebook-connect', {})
        .catch((error) => {
          alert(error);
        });
    },

    authenticateGoogle() {
      this.get('session').authenticate('authenticator:torii', 'custom-google', {})
        .catch((error) => {
          alert(error);
        });
    }
  }
});
