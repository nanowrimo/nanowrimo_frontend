import Component from '@ember/component';
import { computed } from '@ember/object';
import TimeZones from 'nanowrimo/lib/time-zones';
import moment from 'moment';

export default Component.extend({
  tagName: '',

  value: moment.tz.guess(),

  selectedOption: computed('value', 'timeZoneOptions', function() {
    return this.get('timeZoneOptions').findBy('value', this.get('value'));
  }),

  timeZoneOptions: computed(() => {
    return TimeZones;
  })
});
