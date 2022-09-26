import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  currentUser: service(),
  store: service(),
  group: null,
  
  init() {
    this._super(...arguments);
  },
  
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.{isLoaded}','group', function() {
    let allowed = this.get('currentUser.isLoaded');
    if (allowed) {
      if (this.get('currentUser.user.adminLevel')) {
        return true;
      } else {
        // is the viewer's id in the group's adminids array?
        let adminIds = this.get('group.adminIds');
        let uid = this.get('currentUser.user.id');
        if (!adminIds) {
          return false;
        } else {
          return adminIds.includes(uid);
        }
      }
    }
    return false;
  }),
  
});
