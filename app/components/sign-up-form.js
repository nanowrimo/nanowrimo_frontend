import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  hasAttemptedSubmit: false,
  isStepOne: true,

  buttonLabel: computed('isStepOne', function() {
    let isStepOne = this.get('isStepOne');
    return isStepOne ? "Continue" : "Sign Up";
  }),

  actions: {
    stepOrSubmit() {
      this.get('changeset').validate()
        .then(() => {
          if (this.get('changeset.isValid')) {
            if (this.get('isStepOne')) {
              this.get('switchStep')();
              this.set('hasAttemptedSubmit', false);
            } else {
              this.get('submit')();
            }
          } else {
            this.set('hasAttemptedSubmit', true);
          }
        });
    }
  }
});
