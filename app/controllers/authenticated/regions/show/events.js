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
  
  pageTitle: computed('group.name', function() {
    return "Events | " + this.get('group.name');
  }),
  
  canAddEvent: computed('group.groupType','canEditGroup', function() {
    let gt = this.get('group.groupType');
    return ((gt!='everyone')||(this.get('canEditGroup')));
  }),
  
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.{isLoaded}','group',function() {
    if (this.get('currentUser.isLoaded')) {
      if (this.get('currentUser.user.adminLevel')) {
        return true;
      } else {
        // is the user an admin?
        let uid = this.get('currentUser.user.id');
        let adminIds = this.get('group.adminIds');
        return adminIds.includes(uid);
      }
    }
  }),
  
  hasEventsFrame: computed('router.currentRouteName',function() {
    let r = this.get('router').get('currentRouteName');
    return (r!='authenticated.regions.show.events.show');
  }),
  
  actions: {
    afterEventModalClose() {
      this.set('addEvent', null);
    },
    openEventModal() {
      if (this.get('canAddEvent')) {
        this.set('addEvent', true);
      }
    },
  }
  
});
