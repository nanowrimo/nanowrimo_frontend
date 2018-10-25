import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
export default Controller.extend({

  project: alias('model'),
  _projectChallenge: null,
  projectChallenge: computed('_projectChallenge','project.projectChallenges',function() {
    let pc = this.get('_projectChallenge');
    if (pc) {
      return pc;
    } else {
      return this.get('project.projectChallenges').firstObject; 
    }
  }),
  projectChallenges: null,
  
  
  actions: {
    challengeSelectChanged: function(v) {
      let pcs = this.get('project.projectChallenges'); 
      let len = pcs.length;
      //loop through the current user's projects and find the matching ID
      for(var i=0; i<len; i++){
        let pc = pcs.objectAt(i);
        if (pc.id == v) {
          this.set('projectChallenge', pc);
          break;
        }
      }
    }
  },
});