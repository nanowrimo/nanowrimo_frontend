import Component from '@ember/component';
import { computed, get } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  project: null,
  count: computed('project.unitCount', function(){
    return this.get('project').unitCount;
  }),
  formattedStart: computed("project.challenges.[]", function(){
    let proj = this.get('project');
    if (proj) {
      let start = get(proj, 'challenges.firstObject.startsOn');
      let time = moment(start);
      if (time.month()===4) {
        //may does not need to be formatted with a period
        return moment(start).format("MMM YYYY");
      } else {
        return moment(start).format("MMM. YYYY");
      }
    }
  }),

  goal: computed('project.projectChallenges.[]', function(){
    let proj = this.get('project');
    if (proj) {
      return get(proj, 'challenges.firstObject.defaultGoal');
    } else {
      return 0;
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
      0;
    }
  })
});
