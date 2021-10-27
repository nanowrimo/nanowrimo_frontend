import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  
  eventType: null,
  showData: null,
  
  classNames: ['nw-flex-center'],
  
  // Returns true if the donut chart should be displayed
  needsDonut: computed('showData', function() {
    const showData = this.get('showData');
    return (showData!='Writing Streak');
  }),
  
});
