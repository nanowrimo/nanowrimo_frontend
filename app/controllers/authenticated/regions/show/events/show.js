import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  currentUser: service(),
  event: alias('model'),
  dataLoaded: false,
  
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
