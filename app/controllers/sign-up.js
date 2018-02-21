import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  signUpAttempt: alias('model'),

  actions: {
    signUp() {
      // TODO: Submit signup attempt to API and authenticate user
      this.get('router').transitionTo('index');
    }
  }
});
