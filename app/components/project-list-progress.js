import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  project: null,
  
  goal: computed('project.challenges.[]', function(){
      let proj = this.get('project');
      if (proj) {
        return proj.challenges.firstObject.requiredGoal;
      }
    }),
  formattedGoal: computed("goal", function(){
    return this.get('goal').toLocaleString();
  }),
  formattedWordcount: computed("project.wordcount", function(){
    return this.get('project').wordcount.toLocaleString();
  }),
  progressPercent: computed("goal","project.wordcount",function(){
    let wc = this.get('project').wordcount;
    let g = this.get('goal');
    let percent = wc*100/g;
    if (percent > 100) {
      percent = 100;
    }
    return percent;
  })
});
