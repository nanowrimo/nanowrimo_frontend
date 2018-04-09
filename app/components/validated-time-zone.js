import Component from '@ember/component';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import TimeZones from 'nanowrimo/lib/time-zones';
import moment from 'moment';

export default Component.extend({
  errors: null,
  hasAttemptedSubmit: false,
  hasBlurred: false,
  name: 'timeZone',
  value: moment.tz.guess(),

  errorMessage: computed('errors.@each.validation', 'name', function() {
    let errors = this.get('errors');
    let name = this.get('name');
    let inputErrors = errors.findBy('key', name);
    return inputErrors ? inputErrors.validation[0] : null;
  }),

  selectClasses: computed('showErrorMessage', function() {
    let classes = ['form-control'];
    if (this.get('showErrorMessage')) {
      classes.push('is-invalid');
    }
    return classes.join(' ');
  }),

  showErrorMessage: computed('errorMessage', 'hasAttemptedSubmit', function() {
    return this.get('hasAttemptedSubmit') && isPresent(this.get('errorMessage'));
  }),

  timeZoneOptions: computed(() => {
    return TimeZones;
  }),

  actions: {
    markBlurred() {
      alert('blur');
      this.set('hasBlurred', true);
    }
  }
});
