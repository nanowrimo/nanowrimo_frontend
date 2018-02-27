import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import SignUpAttemptValidations from 'nanowrimo/validations/signupattempt';

export default Controller.extend({
  SignUpAttemptValidations,

  error: null, // String OR object

  errorString: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'string') ? error : null;
  }),

  errorObject: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'object') ? error : null;
  }),

  signUpAttempt: alias('model')
});
