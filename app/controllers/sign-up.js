import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  isStepOne: true,

  signUpAttempt: alias('model'),

  buttonLabel: computed('isStepOne', function() {
    let isStepOne = this.get('isStepOne');
    return isStepOne ? "Continue" : "Sign Up";
  }),

  actions: {
    signUp() {
      let isStepOne = this.get('isStepOne');

      if (isStepOne) {
        this.set('isStepOne', false);
      } else {
        // TODO: Submit signup attempt to API and authenticate user
        this.get('router').transitionTo('index');
      }
    }
  }
});
