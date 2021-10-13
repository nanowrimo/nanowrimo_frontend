import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';
import { inject as service } from '@ember/service';

export default Component.extend({
  
  pingService: service(),

  user: null,
  showData: null,
  
  // Hides the donut chart if no data
  noData: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    return !(pps && updateCount);
  }), 
  
  // Returns the time since the last update
  timeSince: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    let t = '';
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    if (pps && updateCount) {
      let updated_at = pps.updated_at;
      if (updated_at) {
        t = moment.utc(updated_at, 'YYYY-MM-DD HH:mm:ss').local().fromNow();
      }
    }
    return t;
  }),
  
  // Returns the total words written for a challenge
  overallCount: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    return (pps && updateCount) ? pps.current_word_count.toLocaleString() : 0;
  }),
  
  // Returns the word-count goal for a challenge
  overallGoal: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    return (pps && updateCount) ? pps.goal_total.toLocaleString() : 50000;
  }),
  
  // Returns the percent achieved for a challenge
  overallProgress: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    return (pps && updateCount) ? Math.min(Math.round((pps.current_word_count/pps.goal_total)*100),100) : 100;
  }),
  
  // Returns the latest daily word count
  dailyCount: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    return (pps && updateCount) ? pps.daily_total.toLocaleString() : 0;
  }),
  
  // Returns the word-count goal per day
  dailyGoal: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    return (pps && updateCount) ? Math.round(pps.goal_total/pps.challenge_days).toLocaleString() : 1667;
  }),
  
  // Returns the percent achieved for the last daily update
  dailyProgress: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    return (pps && updateCount)? Math.min(Math.round((pps.daily_total/(pps.goal_total/pps.challenge_days))*100),100) : 0;
  }),
  
  // Returns the latest streak for a challenge
  streak: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('user.id'));
    return (pps && updateCount) ? pps.streak_days.toLocaleString() : 0;
  }),
  
  // Returns true if showing streak data
  isStreak: computed('showData', function() {
    const showData = this.get('showData');
    return (showData == 'Writing Streak');
  }),
  
  // Returns true if showing daily data
  isDaily: computed('showData', function() {
    const showData = this.get('showData');
    return (showData == 'Daily Progress');
  }),
  
});
