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
    return true;
  }),
  
  // Returns true if the user can edit the region
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.user.groupUsersLoaded',function() {
    if (this.get('currentUser.user.groupUsersLoaded')) {
      if (this.get('currentUser.user.adminLevel')) {
        return true;
      } else {
        let uid = this.get('currentUser.user.id');
        let gid = this.get('group.id');
        let gus = this.get('store').peekAll('group-user');
        let found = false;
        gus.forEach((gu)=>{
          if ((gu.user_id==uid)&&(gu.group_id==gid)&&(gu.isAdmin)) {
            found = true;
          }
        });
        return found;
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
