import Component from '@ember/component';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  errors: null,
  errorMessage: null,
  name: '',
  label: '',
  placeholder: null,
  type: 'text',
  value: '',

  inputClasses: computed('showErrorMessage', function() {
    let classes = ['form-control'];
    if (this.get('showErrorMessage')) {
      classes.push('is-invalid');
    }
    return classes.join(' ');
  }),

  showErrorMessage: computed('errorMessage', function() {
    return (isPresent(this.get('errorMessage')));
  }),

  actions: {
    hasChanged() {
      this.submit();
      //this.sendAction('valueChanged');
    }
  }
});
