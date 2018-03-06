import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { isPresent } from '@ember/utils';

export default Component.extend({
  autocomplete: null,
  autofocus: false,
  changeset: null,
  hasAttemptedSubmit: false,
  hasBlurred: false,
  label: '',
  placeholder: null,
  property: '',
  type: 'text',

  name: reads('property'),

  errorMessage: computed('changeset.error', 'property', function() {
    let inputErrors = this.get(`changeset.error.${this.get('property')}`);
    return inputErrors ? inputErrors.validation[0] : null;
  }),

  inputClasses: computed('showErrorMessage', function() {
    let classes = ['form-control'];
    if (this.get('showErrorMessage')) {
      classes.push('is-invalid');
    }
    return classes.join(' ');
  }),

  showErrorMessage: computed('errorMessage', 'hasAttemptedSubmit', 'hasBlurred', function() {
    return (this.get('hasAttemptedSubmit') || this.get('hasBlurred')) && isPresent(this.get('errorMessage'));
  })
});
