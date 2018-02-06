import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  user: alias('model'),

  actions: {
    createUser() {
      let user = this.get('user');
      user.save()
        .then(() => {
          this.get('router').transitionTo('index');
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
});
