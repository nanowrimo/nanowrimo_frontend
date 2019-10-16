import Controller from '@ember/controller';
import { reads }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
export default Controller.extend({
  currentUser: service(),
  router: service(),
  badgesService: service(),
  notificationsService: service(),
  
  currentUserName: reads('currentUser.user.name'),
  currentUserEmail: reads('currentUser.user.email'),
  currentUserIsNotConfirmed: reads('currentUser.user.isNotConfirmed'),
  currentUserHasProject: computed('currentUser.user.projects.{[],@each.primary}', function() {
    let cu = this.get('currentUser.user');
    if (cu) {
      return cu.persistedProjects.length > 0;
    }
  }),
  primaryProject: computed("currentUser.user.primaryProject", function(){
    let p = this.get('currentUser.user.primaryProject');
    return p;
  }),
  
  queryParams: ['addProject'],
  
  addProject: false,
  
  init() {
    this._super(...arguments);
    this._loadBadgesService();
    this._loadNotificationsService();
  },

  _loadBadgesService() {
    return this.get('badgesService').load();
  },
  _loadNotificationsService() {
    return this.get('notificationsService').load();
  },

  
  
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
