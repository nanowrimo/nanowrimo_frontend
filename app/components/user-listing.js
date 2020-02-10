import Component from '@ember/component';
import { computed } from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  store: service(),
  currentUser: service(),
  userId: null,
  organizer: false,
  itemSize: null,
  isEditable: false,
  group: null,
  
  isNotCurrentUser: computed('currentUser.user.id','userId',function() {
    let cuid = this.get('currentUser.user.id');
    let uid = this.get('userId');
    return (cuid!=uid);
  }),
  
  user: computed('user_id',function() {
    let uid = this.get('userId');
    let store = this.get('store');
    let u = store.findRecord('user',uid);
    return u;
  }),
  
  // Returns the group users in the store
  userIsAdmin: computed('groupUser.isAdmin',function() {
    let guad = this.get('groupUser.isAdmin');
    return guad;
  }),
  
  // Returns the group users in the store
  userIsApproved: computed('groupUser.invitationAccepted',function() {
    let guia = this.get('groupUser.invitationAccepted');
    return guia;
  }),
  
  
  // Returns the group users in the store
  groupUsers: computed(function() {
    // Peek all group-user records in the store
    return this.get('store').peekAll('group-user');
  }),
  
  // Returns the group user record for this group and the current user
  groupUser: computed('group.id','groupUsers.[]', function() {
    let gus = this.get('groupUsers');
    let gid = this.get('group.id');
    let tgu = false;
    let uid = this.get('userId');
    if (gid) {
      // For each group user, check if it's the correct one for this group and current user
      gus.forEach(function(gu) {
        if ((gid==gu.group_id) && (uid==gu.user_id)) {
          tgu = gu;
        }
      });
    }
    // Return the correct group-user, or false if not found
    return tgu;
  }),
  
  actions: {
    removeUser() {
      let gu = this.get('groupUser');
      gu.deleteRecord();
      gu.save();
    },
    userToAdmin() {
      let gu = this.get('groupUser');
      gu.set('isAdmin',true);
      gu.save();
    },
    userRemoveAdmin() {
      let gu = this.get('groupUser');
      gu.set('isAdmin',false);
      gu.save();
    },
    
  },
  
});
