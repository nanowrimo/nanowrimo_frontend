import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  currentUser: service(),
  group: alias('model'),
  dataLoaded: false,
  
  addEvent: false,
  canAddEvent: computed('currentUser.user.name', function() {
    return true;//(this.get('currentUser.user.name')=="Dave Beck");
  }),
  
  // Returns true if the user can edit the region
  canEditGroup: computed(function() {
    let g = this.get('group');
    return g.userCanEditGroup(this.get('currentUser.user'));
  }),
  
  hasEventsFrame: computed('router.currentRouteName',function() {
    let r = this.get('router').get('currentRouteName');
    return (r!='authenticated.regions.show.events.show');
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
