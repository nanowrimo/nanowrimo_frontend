import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  session: service(),

  signInAttempt: alias('model'),

  actions: {
    authenticateSignIn() {
      let { email, password } = this.get('signInAttempt');
      this.get('session').authenticate('authenticator:devise', email, password)
        .catch((reason) => {
          alert(reason.error || reason);
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
