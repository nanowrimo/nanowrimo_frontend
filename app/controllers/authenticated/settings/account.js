import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import TimeZones from 'nanowrimo/lib/time-zones';

export default Controller.extend({
  error: null, // String OR object
  currentUser: service(),
  errorString: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'string') ? error : null;
  }),

  errorObject: computed('error', function() {
    let error = this.get('error');
    return (typeof error === 'object') ? error : null;
  }),

  
  timeZoneOptions: computed(function() {
    return TimeZones;
  })
  
});
