import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  session: service(),

  user: alias('model'),

  actions: {
    authenticateUser() {
      let username = this.get('user.username');
      let password = 'password';
      this.get('session').authenticate('authenticator:devise', username, password)
      .then(() => {
        this.get('router').transitionTo('index');
      })
      .catch((reason) => {
        alert(reason.error || reason);
      });
    }
  }
});
