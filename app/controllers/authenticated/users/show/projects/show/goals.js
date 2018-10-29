import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  
  newProjectChallenge: false,
  
  projectChallenges: computed('project.projectChallenges.[]', function(){
    return this.get('project.projectChallenges');
  }),

  actions: {
    newProjectChallenge(){
      this.set('newProjectChallenge', true);
    },
  }
});
