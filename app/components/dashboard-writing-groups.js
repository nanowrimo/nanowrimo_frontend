import Component from '@ember/component';
import { computed } from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  currentUser: service(),
  
  writingGroups: computed('currentUser.user.myWritingGroups.[]', function() {
    let gs = this.get('currentUser.user.myWritingGroups');
    return gs;
  }),
  
  hasWritingGroup: computed('currentUser.user.myWritingGroupUsers.[]', function() {
    let gus = this.get('currentUser.user.myWritingGroupUsers');
    //let gus = cu.myWritingGroupUsers;
    if (gus.length>0) {
      return true;
    } else {
      return false;
    }
  }),
  
  actions: {
    afterWritingGroupModalClose() {
      this.set('addWritingGroup', null);
    },
    openNewWritingGroupModal() {
      this.set('addWritingGroup', true);
    },
  }
  
});