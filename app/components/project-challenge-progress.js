import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  goalMet: false,
  
  percentCompleted: computed('projectChallenge.projectSessions.[]', function(){
    let pc = this.get('projectChallenge');
    let g = pc.goal;
    let c = pc.count;
    
    //if c>=g then goal met!
    this._updateGoalMet(c,g);
    let percent = c*100/g; 
    return percent;
  }),
  
  formattedStart: computed('projectChallenge', function() {
    let proj = this.get('projectChallenge');
  
    if (proj) {
      let start = proj.startsAt;
      let time = moment.utc(start);
      if (time.month()===4) {
        //may does not need to be formatted with a period
        return time.format("MMM YYYY");
      } else {
        return time.format("MMM. YYYY");
      }
    }
    
  }),
  
  _updateGoalMet: function(c,g){
    this.set('goalMet', c>=g);
  }
  
});
