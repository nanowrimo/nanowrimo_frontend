import Component from '@ember/component';
import { computed } from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  currentUser: service(),
  

  writingGroups: computed('currentUser.user.myWritingGroups.[]', function() {
    let gs = this.get('currentUser.user.myWritingGroups');
    return gs;
  }),
  
  hasWritingGroup: computed('writingGroups.[]', function() {
    let gus = this.get('writingGroups');
    //let gus = cu.myWritingGroupUsers;
    if (gus) {
      if (gus.length>0) {
        return true;
      } else {
        return false;
      }
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
