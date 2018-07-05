import Controller from '@ember/controller';
import { reads }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  currentUser: service(),
  currentUserName: reads('currentUser.user.name'),
  currentUserEmail: reads('currentUser.user.email'),
  currentUserIsNotConfirmed: reads('currentUser.user.isNotConfirmed'),
  currentUserResolved: computed("currentUser.user", function(){
    return this.get("currentUser.user");
  }),
  queryParams: ['addProject'],
  
  addProject: false,
  
  actions: {
    afterProjectModalClose() {
      this.set('addProject', null);
    },
    openNewProjectModal() {
      this.set('addProject', true);
    },
  }
});
