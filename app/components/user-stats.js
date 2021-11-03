import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
export default Component.extend({
  tagName: '',
  media: service(),
  //user: alias('author'),
  
  didReceiveAttrs() {
    //refresh the user stats
    let u = this.get('user');
    u.refreshStats();
  },
  
  hasStats: computed('user.stats', function(){
    return (this.get('user.stats')) ? true : false; 
  }),
  
  yearsDoneCount: computed('user.stats.yearsDone.[]', function() {
    let statsYearsDone = this.get('user.stats.yearsDone');
    if (statsYearsDone) {  
      return statsYearsDone.length;
    } else {
      return 0;
    }
  }), 
  
  totalWordCount: computed('user.stats.totalWordCount', function(){
    let twc = this.get('user.stats.totalWordCount');
    return (twc) ? twc : 0;
  }),
  
  wordiest: computed('user.stats.wordiest', function(){
    let wordy = this.get('user.stats.wordiest');
    return (wordy) ? wordy : 0;
  })
});
