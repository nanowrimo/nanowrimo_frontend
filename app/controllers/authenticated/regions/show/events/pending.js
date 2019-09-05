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
  
  // Returns an array of past approved events
  pendingEvents: computed('groups.[]', function() {
    return this.get('groups');
  }),
  
  hasEvents: computed('groups.[]', function() {
    return this.get('groups').length>0;
  }),
  
  addEvent: false,
  canAddEvent: computed('currentUser.user.name', function() {
    return true;
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
