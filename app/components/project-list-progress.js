import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  project: null,
  
  goal: computed("project", function() {
    return this.get('project').currentProjectChallenge.goal;
  }),
  count: computed('project.unitCount', function(){
    return this.get('project').unitCount;
  }),
  
  formattedStart: computed("project.challenges.[]", function(){
    let pc = this.get('project.currentProjectChallenge');
    if (pc) {
      let time = moment(pc.startsAt);
      if (time.month()===4) {
        //may does not need to be formatted with a period
        return time.format("MMM YYYY");
      } else {
        return time.format("MMM. YYYY");
      }
    }
  }),
  
  goalMet: computed("percentCompleted", function(){
    return this.get('percentCompleted') === 100;
  }),

  percentCompleted: computed("goal","project.unitCount",function(){
    let proj = this.get('project');
    if (proj) {
      let wc = proj.unitCount;
      let g = this.get('goal');
      let percent = wc*100/g;
      if (percent > 100) {
        percent = 100;
      }
      return percent;
    } else {
      return 0;
    }
  })
});
