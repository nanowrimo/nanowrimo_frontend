import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import SignUpAttemptOneValidations from 'nanowrimo/validations/signupattempt-stepone';
import SignUpAttemptTwoValidations from 'nanowrimo/validations/signupattempt-steptwo';

export default Controller.extend({
  SignUpAttemptOneValidations,
  SignUpAttemptTwoValidations,

  router: service(),

  isStepOne: true,

  signUpAttempt: alias('model'),

  validationsForCurrentStep: computed('isStepOne', function() {
    return this.get('isStepOne') ? SignUpAttemptOneValidations : SignUpAttemptTwoValidations;
  }),

  actions: {
    switchStep() {
      this.set('isStepOne', false);
    },

    signUp() {
      // TODO: Submit signup attempt to API and authenticate user
      this.get('router').transitionTo('index');
    }
  }
});
