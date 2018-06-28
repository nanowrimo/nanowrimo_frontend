import Component from '@ember/component';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  autocomplete: null,
  autofocus: false,
  errors: null,
  hasAttemptedSubmit: false,
  hasBlurred: false,
  name: '',
  label: '',
  placeholder: null,
  type: 'text',
  value: '',

  errorMessage: computed('errors.@each.validation', 'name', function() {
    let errors = this.get('errors');
    let name = this.get('name');
    let inputErrors = errors.findBy('key', name);
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
  }),

  actions: {
    markBlurred(event) {
      this.set('hasBlurred', true);
    }
  }
});
