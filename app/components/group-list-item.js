import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),
  store: service(),
  joinable: null,
  leavable: null,
  groupContainer: null,
  listOrder: null,
  limitList: null,
  sortBySearch: null,
  joinIsDisabled: false,
  isLoading: false,
  isProcessing: false,
  
  doJoinGroup() {
    let gu = this.get('store').createRecord('groupUser', {
      user: this.get('currentUser.user'),
      group: this.get('groupContainer.groupObject'),
      invitationAccepted: 1,
      isAdmin: 0
    });
    gu.save().then(function() {
      gu.normalize();
    });
  },
  
  doLeaveGroup() {
    const cu = this.get('currentUser.user');
    const g = this.get('groupContainer.groupObject');
    let gu = null;
    const _this = this;
    cu.groupUsers.forEach(function(obj) {
      if (obj.group_id==g.id) {
        gu = obj;
      }
    });
    if (gu) {
      gu.deleteRecord();
      gu.save().then(() => {
        _this.set('isProcessing', false);
        cu.get('groupUsers').removeObject(gu);
        g.get('groupUsers').removeObject(gu);
        cu.get('groups').removeObject(g);
        g.get('users').removeObject(cu);
        //this.get('currentUser').checkForRegionUpdates();
      });
    }
  },
  
  doHomeGroup() {
    //const _this = this;
    // Get the current user
    let cu = this.get('currentUser.user');
    // Get the group
    let g = this.get('groupContainer.groupObject');
    // Set the local group user to null
    let gu = null;
    cu.groupUsers.forEach(function(obj) {
      // If this is the correct group user
      if (obj.group_id==g.id) {
        gu = obj;
      }
    });
    gu.set('primary', 1);
    gu.save().then(() => {
      //_this.set('isProcessing', false);
      this.get('currentUser').checkForRegionUpdates();
    });
  },
  
  actions: {
    joinGroup() {
      this.set('isProcessing', true);
      debounce(this, this.doJoinGroup, 100, false);
    },
    makeHome() {
      this.set('isProcessing', true);
      debounce(this, this.doHomeGroup, 100, false);
    },
    leaveGroup() {
      this.set('isProcessing', true);
      debounce(this, this.doLeaveGroup, 100, false);
    }
    
  }
  
});
