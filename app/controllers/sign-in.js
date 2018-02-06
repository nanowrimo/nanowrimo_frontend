import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  user: alias('model'),

  actions: {
    authenticateUser() {
      let username = this.get('user.username');
      let password = 'password';
      this.get('session').authenticate('authenticator:devise', username, password).catch((reason) => {
        alert(reason.error || reason);
      });
    }
  }
});
