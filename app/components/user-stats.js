import Component from '@ember/component';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
export default Component.extend({
  tagName: '',
  media: service(),
  user: alias('author'),
  
  didReceiveAttrs() {
    //refresh the user stats
    let u = this.get('user');
    u.refreshStats();
  },
  
  hasStats: computed('user.stats', function(){
    return (this.get('user.stats')) ? true : false; 
  }),
  
  yearsDoneCount: computed('user.stats.yearsDone.[]', function() {
    let stats = this.get('user.stats');
    if (stats) {
      return this.get('user.stats.yearsDone').length;
    } else {
      return 0;
    }
  }), 
  
  firstEnabled: computed('user.[statsWordCountEnabled,statsProjectsEnabled,statsYearsEnabled,statsWordiestEnabled,statsStreakEnabled', function(){
    let props = [
      "statsWordCountEnabled",
      "statsProjectsEnabled",
      "statsYearsEnabled",
      "statsWordiestEnabled",
      "statsWritingPaceEnabled",
      "statsStreakEnabled"
    ];
    
    //loop through the stats
    for( var i = 0; i< props.length; i++) {
      let prop = props[i];
      //is this prop selected by the user?
      if (this.get(`user.${prop}`) ) {
        return prop;
      }
    }
    return null;
  })
});
