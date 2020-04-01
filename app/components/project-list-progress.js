import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  project: null,
  
  writingTypeString: computed('project.currentProjectChallenge.writingType',function() {
    let t = this.get('project.currentProjectChallenge.writingType');
    if (t==1) {
      return "Edit";
    } else {
      return "Write";
    }
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
    return '';
  }),
  
  goalMet: computed("percentCompleted", function(){
    return this.get('percentCompleted') === 100;
  }),

  percentCompleted: computed("project.currentProjectChallenge.{goal,count}",'project.computedProjectChallenges.[]',function(){
    let proj = this.get('project');
    if (proj) {
      let pc = proj.currentProjectChallenge;
      if (pc) {
        let wc = proj.currentProjectChallenge.count;
        let g = proj.currentProjectChallenge.goal;
        let percent = wc*100/g;
        if (percent > 100) {
          percent = 100;
        }
        return percent;
      }
    }
    return 0;
  }),
  
  goalIcon: computed("project.currentProjectChallenge.computedChallenge",function(){
    let str = '';
    let proj = this.get('project');
    if (proj) {
      let pc = proj.currentProjectChallenge;
      if (pc) {
        let c = proj.currentProjectChallenge.computedChallenge;
        // check if there is a computedChallenge
        if(c) {
          if (c.eventType==0) {
            str = "<img src='/images/global/helmet.svg' style='' />";
          }
          if (c.eventType==1) {
            str = "<img src='/images/global/tent.svg' style='' />";
          }
        }
      }
    }
    return str;
  }),
  
});
