import Component from '@ember/component';
import { computed } from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  store: service(),
  currentUser: service(),
  group: null,

  // Returns the group users in the store
  invitationAccepted: computed('groupUser',function() {
    let gu = this.get('groupUser');
    return gu.invitationAccepted;
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
    let cid = this.get('currentUser.user.id');
    if (gid) {
      // For each group user, check if it's the correct one for this group and current user
      gus.forEach(function(gu) {
        if ((gid==gu.group_id) && (cid==gu.user_id)) {
          tgu = gu;
        }
      });
    }
    // Return the correct group-user, or false if not found
    return tgu;
  }),
  
  // Returns the number of unread messages in this group for this user
  numUnreadMessages: computed('groupUser', function() {
    // Get the group user
    let gu = this.get('groupUser');
    // if found, return the number of unread messages; otherwise return zero
    if (gu) {
      return gu.numUnreadMessages;
    } else {
      return 0;
    }
  }),
  
  // Returns the latestMessage for this group
  latestMessage: computed('groupUser', 'groupUser.latestMessage', function() {
    // Get the group user
    let gu = this.get('groupUser');
    if (gu) {
      let lm = this.get('groupUser.latestMessage');
      // if found, return the number of unread messages; otherwise return zero
      if (lm!=null) {
        return lm;
      } else {
        return "<p>There are no messages yet. Why not start the discussion?</p>";
      }
    } else {
      return "<p>There are no messages yet. Why not start the discussion?</p>";
    }
  }),
  
  actions: {
    
    approveInvitation() {
      let gu = this.get('groupUser');
      gu.set('invitationAccepted',1);
      gu.save();
    },
    
    rejectInvitation() {
      let gu = this.get('groupUser');
      gu.deleteRecord();
      gu.save();
    },
    
  }
  
});
