import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  overallProgress: 80,
  dailyProgress: 60,
  streak: null,
  eventType: null,
  showData: null,
  updatedAt: null,
  userId: null,
  
  classNames: ['nw-flex-center'],
  
  init(){
    this._super(...arguments);
  },
  
  needsDonut: computed('showData', function() {
    const showData = this.get('showData');
    if (showData=='Writing Streak') {
      return false;
    } else {
      return true;
    }
  }),
  
  
});
