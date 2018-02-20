import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  autocomplete: null,
  errors: null,
  name: '',
  label: '',
  placeholder: null,
  required: false,
  type: 'text',
  value: '',

  errorMessages: computed('errors.@each.validation', 'name', function() {
    let errors = this.get('errors');
    let name = this.get('name');
    let inputErrors = errors.findBy('key', name);
    return inputErrors ? inputErrors.validation : [];
  })
});
