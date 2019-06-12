import Component from '@ember/component';
import { get,set,computed } from '@ember/object';

export default Component.extend({
  
  _shortTimeString(i) {
    var tHour = i;
    if (tHour>12) {
      return (tHour - 12) + 'PM';
    } else if (tHour==12) {
      return "Noon";
    } else if (tHour == 0){
      return '12AM';
    } else {
      return tHour + 'AM';
    }
  },
  
  _timeHourString(i,connector) {
    var ampm1 = 'AM';
    var ampm2 = 'AM';
    var endHour = i + 1;
    if (endHour>23) endHour = 0;
    if (i>11) ampm1 = 'PM';
    if (endHour>11) ampm2 = 'PM';
    return (i % 12 || 12) + ':00' + ampm1 + connector + (endHour % 12 || 12) + ':00' + ampm2;
  },
  
  primaryDisplay: true,
  cardPrimaryStyle: computed('primaryDisplay',function() {
    if (get(this,'primaryDisplay')) {
      return "display: block".htmlSafe();
    } else {
      return "display: none".htmlSafe();
    }
  }),
  cardSecondaryStyle: computed('primaryDisplay',function() {
    if (get(this,'primaryDisplay')) {
      return "display: none".htmlSafe();
    } else {
      return "display: block".htmlSafe();
    }
  }),
  actions: {
    toggleSubcard() {
      set(this,"primaryDisplay",!get(this,"primaryDisplay"));
    }
  }
  
});