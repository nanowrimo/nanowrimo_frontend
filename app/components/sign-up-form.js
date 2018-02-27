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

  init() {
    this._super(...arguments);
    this.get('changeset').validate();
  },

  _callAfterError(error) {
    let callback = this.get('afterError');
    if (callback) { callback(error); }
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
          .catch((error) => {
            this._callAfterError(error);
          });
        } else {
          return this.set('hasAttemptedSubmit', true);
        }
      }
    }
  }
});
