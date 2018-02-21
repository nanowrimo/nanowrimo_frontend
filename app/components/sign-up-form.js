import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  isStepOne: true,

  buttonLabel: computed('isStepOne', function() {
    let isStepOne = this.get('isStepOne');
    return isStepOne ? "Continue" : "Sign Up";
  }),

  actions: {
    stepOrSubmit() {
      let isStepOne = this.get('isStepOne');

      if (isStepOne) {
        this.set('isStepOne', false);
      } else {
        this.get('submit')();
      }
    }
  }
});
