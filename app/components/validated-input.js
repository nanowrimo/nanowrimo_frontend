import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { notEmpty } from '@ember/object/computed';

export default Component.extend({
  autocomplete: null,
  errors: null,
  name: '',
  label: '',
  placeholder: null,
  required: false,
  type: 'text',
  value: '',

  hasErrorMessage: notEmpty('errorMessage'),

  inputClasses: computed('hasErrorMessage', function() {
    let hasErrorMessage = this.get('hasErrorMessage');
    let classes = "form-control";
    if (hasErrorMessage) {
      classes += " is-invalid";
    }
    return classes;
  }),

  errorMessage: computed('errors.@each.validation', 'name', function() {
    let errors = this.get('errors');
    let name = this.get('name');
    let inputErrors = errors.findBy('key', name);
    return inputErrors ? inputErrors.validation[0] : '';
  })
});
