import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default Component.extend({
  pingService: service(),

  classNames: [''],
  
  user: null,
  showData: null,
  updatedAt: null,
  updateCount: 1,
  
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
  timeSince: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    let t = '';
    const pps = this.pps();
    if (pps && updateCount) {
      let updated_at = pps.updated_at;
      if (updated_at) {
        t = moment.utc(updated_at, 'YYYY-MM-DD HH:mm:ss').local().fromNow();
      }
    }
    return t;
  }),
  
  overallCount: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return pps.current_word_count.toLocaleString();
    } else {
      return 0;
    }
  }),
  
  overallGoal: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return pps.goal_total.toLocaleString();
    } else {
      return 50000;
    }
  }),
  
  overallProgress: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return Math.min(Math.round((pps.current_word_count/pps.goal_total)*100),100);
    } else {
      return 100;
    }
    
  }),
  
  dailyCount: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return pps.daily_total.toLocaleString();
    } else {
      return 0;
    }
  }),
  
  dailyGoal: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return Math.round(pps.goal_total/pps.challenge_days).toLocaleString();
    } else {
      return 1667;
    }
  }),
  
  dailyProgress: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return Math.min(Math.round((pps.daily_total/(pps.goal_total/pps.challenge_days))*100),100);
    } else {
      return 0;
    }
  }),
  
  streak: computed('updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return pps.streak_days.toLocaleString();
    } else {
      return 0;
    }
  }),
  
  isStreak: computed('showData', function() {
    const showData = this.get('showData');
    if (showData == 'Writing Streak') {
      return true;
    } else {
      return false;
    }
  }),
  
  isDaily: computed('showData', function() {
    const showData = this.get('showData');
    if (showData == 'Daily Progress') {
      return true;
    } else {
      return false;
    }
  }),
  
});
