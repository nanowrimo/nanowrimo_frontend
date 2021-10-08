import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default Component.extend({
  pingService: service(),

  classNames: ['nw-square-80','chart-fireball'],
  updateCount: 1,
  user: null,
  
  init() {
    this._super(...arguments);
    this.incrementUpdateCount();
  },
  
  incrementUpdateCount: function(){
    if (this.isDestroyed) {
        return;
    }
    let updateCount = this.get('updateCount');
    this.set('updateCount', updateCount+1);
    debounce(this, this.incrementUpdateCount, 2000, false);
  },
    
  pps: function() {
    const buddiesData = this.get('pingService.buddiesData');
    const buddyId = this.get('user.id');
    let pps = null;
    for (let i = 0; i<buddiesData.length; i++) {
      if (buddiesData[i].user_id == buddyId) {
        pps = JSON.parse(buddiesData[i].primary_project_state);
      }
    }
    return pps;
  },
  
  streak: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return pps.streak_days.toLocaleString();
    } else {
      return 0;
    }
  }),
  
  // Hides the donut chart if no data
  noData: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return false;
    } else {
      return true;
    }
  }),
  
});
