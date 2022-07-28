import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  selectedSortOption: null,
  sortOptions: null,
  user: null,
  addWritingGroup: false,
  
  init() {
    this._super(...arguments);
  },

  groupsLoaded: computed("currentUser.user.{writingGroupsLoaded,regionsLoaded}", function(){
    let wgl = this.get('currentUser.user.writingGroupsLoaded');
    let rl = this.get('currentUser.user.regionsLoaded');
    return wgl && rl;
  }),
  
  hasRegions: computed('user.myGroups.[]', function() {
    let gs = this.get('user.myGroups');
    if (gs.length>0) {
      return true;
    } else {
      return false;
    }
  }),
  
  isCurrentUser: computed('currentUser.user','user',function() {
    if (this.get('currentUser.user') == this.get('user')) {
      return true;
    }
    return false;
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
