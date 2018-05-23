import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  project: null,
  
  formattedGoal: computed("goal", function(){
    return this.get('goal').toLocaleString();
  }),
  formattedStart: computed("project.challenges.[]", function(){
    let proj = this.get('project');
    if (proj) {
      let start = proj.challenges.firstObject.startsOn;
      let time = moment(start);
      if (time.month()===4) {
        //may does not need to be formatted with a period
        return moment(start).format("MMM YYYY");
      } else {
        return moment(start).format("MMM. YYYY");
      }
    }
  }),
  formattedWordcount: computed("project.count", function(){
    let project = this.get('project');
    if (project) {
      return project.count.toLocaleString();
    } else {
      return 0;
    }
  }),
  goal: computed('project.challenges.[]', function(){
    let proj = this.get('project');
    if (proj) {
      let dc = proj.displayChallenge;
      
      return proj.challenges.firstObject.requiredGoal;
    } else {
      return 0;
    }
  }),
  goalMet: computed("percentCompleted", function(){
    return this.get('percentCompleted') === 100;
  }),
  
  
  percentCompleted: computed("goal","project.count",function(){
    let proj = this.get('project');
    if (proj) {
      let wc = proj.count;
      let g = this.get('goal');
      let percent = wc*100/g;
      if (percent > 100) {
        percent = 100;
      }
      return percent;
    } else {
      0;
    }
  })
});
