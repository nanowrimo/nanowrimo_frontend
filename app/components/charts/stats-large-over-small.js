import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal }  from '@ember/object/computed';
import { htmlSafe }  from '@ember/string';
import moment from 'moment';
import { inject as service } from '@ember/service';

export default Component.extend({
  pingService: service(),

  classNames: [''],
  
  user: null,
  showData: null,
  updatedAt: null,
  updateCount: 0,
  overallProgress: 0,
  dailyProgress: 0,
  overallGoal: 0,
  dailyGoal: 0,
  overallCount: 0,
  dailyCount: 0,
  
  init() {
    this._super(...arguments);
    setInterval(this.incrementUpdateCount, 60000, this);
  },
  
  incrementUpdateCount: function(_this){
    let updateCount = _this.get('updateCount');
    _this.set('updateCount', updateCount+1);
  },
  
  timeSince: computed('pingService.buddiesData.{[],@each.updated_at}', 'user', function() {
    alert('timeSince');
    let t = '';
    const buddiesData = this.get('pingService.buddiesData');
    const buddyId = this.get('user.id');
    let pps = null;
    for (let i = 0; i<buddiesData.length; i++) {
      if (buddiesData[i].user_id == buddyId) {
        pps = JSON.parse(buddiesData[i].primary_project_state);
      }
    }
    if (pps) {
      let updatedAt = pps.updated_at;
      if (updatedAt) {
        t = moment.utc(updatedAt, 'YYYY-MM-DD HH:mm:ss').local().fromNow();
      }
    }
    return t;
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
