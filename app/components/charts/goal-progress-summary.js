import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  overallProgress: 80,
  dailyProgress: 60,
  streak: 13,
  eventType: 0,
  
  classNames: ['nw-flex-center'],
  
  init(){
    this._super(...arguments);
  },
  
});
