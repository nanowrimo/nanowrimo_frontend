import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  
  pingService: service(),

  classNames: ['nw-square-80','chart-fireball'],
  user: null,
  
  // Returns the streak number
  streak: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    if (pps) {
      return (pps.streak_days && updateCount) ? pps.streak_days.toLocaleString() : 0;
    } else {
      return 0;
    }
  }),
  
  // Hides the donut chart if no data
  noData: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    return !(pps && updateCount);
  }),
  
});
