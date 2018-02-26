import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  hasAttemptedSubmit: false,
  isStepOne: true,

  buttonValue: computed('isStepOne', function() {
    return this.get('isStepOne') ? 'Continue' : 'Sign Up';
  }),

  _stepOneIsValid: computed('changeset.error', function() {
    return ['email', 'password'].every((property) => {
      return this.get(`changeset.error.${property}`) === undefined;
    });
  }),

  _callAfterSubmit() {
    let callback = this.get('afterSubmit');
    if (callback) { callback(); }
  },

  init() {
    this._super(...arguments);
    this.get('changeset').validate();
  },

  actions: {
    stepOrSubmit() {
      if (this.get('isStepOne')) {
        if (this.get('_stepOneIsValid')) {
          this.set('hasAttemptedSubmit', false);
          return this.set('isStepOne', false);
        } else {
          return this.set('hasAttemptedSubmit', true);
        }
      } else {
        let changeset = this.get('changeset');
        if (changeset.get('isValid')) {
          return changeset.save()
            .then(() => {
              this._callAfterSubmit();
            });
        } else {
          return this.set('hasAttemptedSubmit', true);
        }
      }
    }
  }
});
