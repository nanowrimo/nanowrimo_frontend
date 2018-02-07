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
      console.log("Facebook?");
      this.get('session').authenticate('authenticator:torii', 'facebook-connect', {})
        .then(() => {
          alert("FB Authed!");
        })
        .catch((reason) => {
          alert(reason.error || reason);
        });
    },

    authenticateGoogle() {
      console.log("Google?")
    }
  }
});
