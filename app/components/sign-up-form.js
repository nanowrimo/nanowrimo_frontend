import Component from '@ember/component';
import SignUpAttemptPartOneValidations from 'nanowrimo/validations/signupattempt-stepone';
import SignUpAttemptPartTwoValidations from 'nanowrimo/validations/signupattempt-steptwo';

export default Component.extend({
  SignUpAttemptPartOneValidations,
  SignUpAttemptPartTwoValidations,

  isStepOne: true,
  signUpAttempt: null,

  actions: {
    step() {
      this.set('isStepOne', false);
    },

    submit() {
      this.get('submit')();
    }
  }
});
