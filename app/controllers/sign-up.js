import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import SignUpAttemptValidations from 'nanowrimo/validations/signupattempt';

export default Controller.extend({
  SignUpAttemptValidations,

  router: service(),

  signUpAttempt: alias('model'),

  actions: {
    afterSubmit() {
      // TODO: Submit signup attempt to API and authenticate user
      this.get('router').transitionTo('index');
    }
  }
});
