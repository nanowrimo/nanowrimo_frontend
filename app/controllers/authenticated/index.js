import Controller from '@ember/controller';
import { reads }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
export default Controller.extend({
  currentUser: service(),
  router: service(),

  currentUserName: reads('currentUser.user.name'),
  currentUserEmail: reads('currentUser.user.email'),
  currentUserIsNotConfirmed: reads('currentUser.user.isNotConfirmed'),
  currentUserHasProject: computed('currentUser.user.projects.[]', function() {
    return this.get('currentUser.user').projects.length > 0;
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
    afterNewProjectSubmit() {
      this.get('router').transitionTo('authenticated.users.show.projects', this.get('currentUser.user.slug'));
    }
  }
});
