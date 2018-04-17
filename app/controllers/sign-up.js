import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import TimeZones from 'nanowrimo/lib/time-zones';

export default Controller.extend({

  error: null, // String OR object

  signUpAttempt: alias('model'),

  errorString: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'string') ? error : null;
  }),

  errorObject: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'object') ? error : null;
  }),

  steps: computed(function() {
    return [['email', 'password', 'username', 'timeZone', 'thirteen' ]];
  }),

  timeZoneOptions: computed(function() {
    return TimeZones;
  })
});
