import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  queryParams: ['addEvent'],
  router: service(),
  currentUser: service(),
  groups: alias('model'),
  dataLoaded: false,
  activeGroups: computed('groups.[]', function() {
    return this.get('groups');
  }),
  addEvent: false,
  canAddEvent: computed('currentUser.user.name', function() {
    return true;//(this.get('currentUser.user.name')=="Dave Beck");
  }),
  
  actions: {
    afterEventModalClose() {
      this.set('addEvent', null);
    },
    openNewEventModal() {
      if (this.get('canAddEvent')) {
        this.set('addEvent', true);
      }
    },
  }
  
});
