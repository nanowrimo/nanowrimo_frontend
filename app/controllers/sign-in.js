import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  session: service(),

  user: alias('model'),

  actions: {
    authenticateUser() {
      let { email, password } = this.get('user');
      this.get('session').authenticate('authenticator:devise', email, password)
        .then(() => {
          this.get('router').transitionTo('index');
        })
        .catch((reason) => {
          alert(reason.error || reason);
        });
    },

    authenticateFacebook() {
      this.get('session').authenticate('authenticator:torii', 'facebook-connect', {})
        .then((response) => {
          alert(`FB Authed! ${response}`);
        })
        .catch((error) => {
          alert(`Error: ${error}`);
        });
    },

    authenticateGoogle() {
      // console.log("Google?")
    }
  }
});
