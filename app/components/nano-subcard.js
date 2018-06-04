import Component from '@ember/component';
import { get,set,computed } from '@ember/object';

export default Component.extend({
  flipped: false,
  classNames: ["nano-subcard"],
  classNameBindings: ['flipped'],
  
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
      this.toggleProperty('flipped');
      set(this,"primaryDisplay",!get(this,"primaryDisplay"));
    }
  }
});