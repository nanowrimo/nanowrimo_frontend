import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import { Promise } from 'rsvp';
//import fetch from 'fetch';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  store: service(),
  currentUser: service(),
  session: service(),
  
  classNames: ['buddy-buttons'],
  
  user: null,
  displayTiny: false,
  isRemoving: false,
  newBuddyEndpoint: `${ENV.APP.API_HOST}/groups/invite_buddy/`,
  approveBuddyEndpoint: `${ENV.APP.API_HOST}/groups/approve_buddy/`,
  rejectBuddyEndpoint: `${ENV.APP.API_HOST}/groups/reject_buddy/`,
  removeBuddyEndpoint: `${ENV.APP.API_HOST}/groups/remove_buddy/`,
  cancelInvitationEndpoint: `${ENV.APP.API_HOST}/groups/invite_buddy_cancel/`,
  blockUserEndpoint: `${ENV.APP.API_HOST}/groups/block_user/`,
  unblockUserEndpoint: `${ENV.APP.API_HOST}/groups/unblock_user/`,
  
  init() {
    this._super(...arguments);
    let name = this.get('user.name');
    this.set('removeBuddyYesText', 'Yes, remove as buddy');
    this.set('removeBuddyNoText', 'No, thanks'); 
    this.set('removeBuddyTitleText', 'Confirm Buddy Removal');
    this.set('removeBuddyQuestion', `Do you really want to remove "${name}" as a buddy?`);
  },
  
  notCurrentUser: computed('currentUser.user','user',function() {
    if (this.get('currentUser.user') != this.get('user')) {
      return true;
    }
    return false;
  }),
  
  buddyActive: computed('currentUser.user.buddiesActive.[]',function() {
    let buddiesActive = this.get('currentUser.user.buddiesActive');
    if (buddiesActive.includes(this.get('user'))) {
      return true;
    }
    return false;
  }),
  
  buddyInvited: computed('currentUser.user.buddiesInvited.[]',function() {
    let buddiesInvited = this.get('currentUser.user.buddiesInvited');
    if (buddiesInvited.includes(this.get('user'))) {
      return true;
    }
    return false;
  }),
  
  buddyInvitedBy: computed('currentUser.user.buddiesInvitedBy.[]',function() {
    let buddiesInvitedBy = this.get('currentUser.user.buddiesInvitedBy');
    if (buddiesInvitedBy.includes(this.get('user'))) {
      return true;
    }
    return false;
  }),
  
  userBlocked: computed('currentUser.user.usersBlocked',function() {
    let usersBlocked = this.get('currentUser.user.usersBlocked');
    if (usersBlocked.includes(this.get('user'))) {
      return true;
    }
    return false;
  }),
  
  notBuddy: computed('currentUser.user.{buddiesActive,buddiesInvited,buddiesInvitedBy,usersBlocked}',function() {
    let buddyActive = this.get('buddyActive');
    let buddyInvited = this.get('buddyInvited');
    let buddyInvitedBy = this.get('buddyInvitedBy');
    let userBlocked = this.get('userBlocked');
    if (!buddyActive && !buddyInvited && !buddyInvitedBy && !userBlocked) {
      return true;
    }
    return false;
  }),
  
  conversationSlug: computed('user', function() {
    const store = this.get('store');
    const user = this.get('user');
    const gus = store.peekAll('group-user');
    let slug = null;
    gus.forEach(function(gu) {
      let g = store.peekRecord('group', gu.group_id);
      if (g.groupType=='buddies') {
        gus.forEach(function(gu2) {
          if ((gu2.group_id==g.id) && (gu2.user_id!=user.id) && (gu2.invitationAccepted=='1')) {
            slug = g.slug;
          }
        });
      }
    });
    return slug;
  }),
  
  
  actions: {
    sendInvitation() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      return new Promise(() => {
        let newBuddyEndpoint = this.get('newBuddyEndpoint')+user.id;
        let { auth_token }  = this.get('session.data.authenticated');
        
        let body = {};
        return fetch((newBuddyEndpoint), { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
          body: JSON.stringify(body)
        }) 
        .then((response) => {
          if (response.ok) {
            cu.loadGroupUsers('buddies');
          } else {
            alert('There was a problem sending this invitation. Please reload the page and try again.');
          }
        })
        .catch(() => {
          alert('There was a problem sending this invitation. Please check your internet connection and try again.');
        });
      });
    },
    
    approveInvitation() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      return new Promise(() => {
        let approveBuddyEndpoint = this.get('approveBuddyEndpoint')+user.id;
        let { auth_token }  = this.get('session.data.authenticated');
        let body = {};
        return fetch((approveBuddyEndpoint), { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
          body: JSON.stringify(body)
        }) 
        .then((response) => {
          if (response.ok) {
            cu.loadGroupUsers('buddies');
          } else {
            alert('There was a problem approving this invitation. Please reload the page and try again.');
          }
        })
        .catch(() => {
          alert('There was a problem approving this invitation. Please check your internet connection and try again.');
        });
      });
    },
    
    rejectInvitation() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      let store = this.get('store');
      return new Promise(() => {
        let rejectBuddyEndpoint = this.get('rejectBuddyEndpoint')+user.id;
        let { auth_token }  = this.get('session.data.authenticated');
        let body = {};
        return fetch((rejectBuddyEndpoint), { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
          body: JSON.stringify(body)
        }) 
        .then((response) => {
          if (response.ok) {
            let found = false;
            let gus = store.peekAll('group-user');
            gus.forEach(function(gu) {
              // If this group_user belongs to the buddy group
              if (gu.user_id==user.id) {
                // Check for a buddyship
                let g = store.peekRecord('group',gu.group_id);
                if (g && g.groupType=='buddies') {
                  // Check that this is a buddyship for the current user
                  let gu2s = store.peekAll('group-user');
                  gu2s.forEach(function(gu2) {
                    if ((gu2.group_id==g.id)&&(gu2.user_id==cu.id)) {
                      found = true;
                      gu2.unloadRecord();
                    }
                  });
                  if (found) {
                    g.unloadRecord();
                  }
                }
                if (found) {
                  gu.unloadRecord();
                }
              }
            });
            cu.loadGroupUsers('buddies');
          } else {
            alert('There was a problem rejecting this invitation. Please reload the page and try again.');
          }
        })
        .catch(() => {
          alert('There was a problem rejecting this invitation. Please check your internet connection and try again.');
        });
      });
    },
    
    startRemovingBuddy() {
      this.set('isRemoving', true);
    },
    
    removeBuddy() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      let store = this.get('store');
      return new Promise(() => {
        let removeBuddyEndpoint = this.get('removeBuddyEndpoint')+user.id;
        let { auth_token }  = this.get('session.data.authenticated');
        let body = {};
        return fetch((removeBuddyEndpoint), { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
          body: JSON.stringify(body)
        }) 
        .then((response) => {
          if (response.ok) {
            let found = false;
            let gus = store.peekAll('group-user');
            gus.forEach(function(gu) {
              // If this group_user belongs to the buddy group
              if (gu.user_id==user.id) {
                // Check for a buddyship
                let g = store.peekRecord('group',gu.group_id);
                if (g && g.groupType=='buddies') {
                  // Check that this is a buddyship for the current user
                  let gu2s = store.peekAll('group-user');
                  gu2s.forEach(function(gu2) {
                    if ((gu2.group_id==g.id)&&(gu2.user_id==cu.id)) {
                      found = true;
                      gu2.unloadRecord();
                    }
                  });
                  if (found) {
                    g.unloadRecord();
                  }
                }
                if (found) {
                  gu.unloadRecord();
                }
              }
            });
            cu.loadGroupUsers('buddies');
          } else {
            alert('There was a problem removing this buddy. Please reload the page and try again.');
          }
        })
        .catch(() => {
          alert('There was a problem removing this buddy. Please check your internet connection and try again.');
        });
      });
    },
    
    cancelInvitation() {
      let user = this.get('user');
      let store = this.get('store');
      let bgus = this.get('currentUser.user.buddyGroupUsersAccepted');
      let group = null;
      bgus.forEach(function(bgu) {
        let bgups = user.buddyGroupUsersPending;
        bgups.forEach(function(bgup) {
          if (bgup.group_id==bgu.group_id) {
            let g = store.peekRecord('group', bgu.group_id);
            if (g) {
              group = g;
            }
          }
        });
      });
      if (group) {
        let cancelInvitationEndpoint = this.get('cancelInvitationEndpoint')+user.id;
        let { auth_token }  = this.get('session.data.authenticated');
        let body = {};
        return fetch((cancelInvitationEndpoint), { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
          body: JSON.stringify(body)
        }).then((response) => {
          if (response.ok) {
            let gus = this.store.peekAll('group-user');
            gus.forEach(function(gu) {
              if (gu.group_id==group.id) {
                gu.set('group',null);
                gu.set('user',null);
                store.unloadRecord(gu);
              }
            });
            store.unloadRecord(group);
          } else {
            alert('There was a problem cancelling this invitation. Please reload the page and try again.');
          }
        }).catch(() => {
          alert('There was a problem cancelling this invitation. Please check your internet connection and try again.');
        });
      }
    },
    
    blockUser() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      return new Promise(() => {
        let blockUserEndpoint = this.get('blockUserEndpoint')+user.id;
        let { auth_token }  = this.get('session.data.authenticated');
        let body = {};
        return fetch((blockUserEndpoint), { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
          body: JSON.stringify(body)
        }) 
        .then((response) => {
          if (response.ok) {
            cu.loadGroupUsers('buddies');
          } else {
            alert('There was a problem blocking this user. Please reload the page and try again.');
          }
        })
        .catch(() => {
          alert('There was a problem blocking this user. Please check your internet connection and try again.');
        });
      });
    },
    
    unblockUser() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      return new Promise(() => {
        let unblockUserEndpoint = this.get('unblockUserEndpoint')+user.id;
        let { auth_token }  = this.get('session.data.authenticated');
        let body = {};
        return fetch((unblockUserEndpoint), { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
          body: JSON.stringify(body)
        }) 
        .then((response) => {
          if (response.ok) {
            cu.loadGroupUsers('buddies');
          } else {
            alert('There was a problem unblocking this user. Please reload the page and try again.');
          }
        })
        .catch(() => {
          alert('There was a problem unblocking this user. Please check your internet connection and try again.');
        });
      });
    },
    
    removeBuddyNo(){
      //close the modal
      this.set('isRemoving', false);
    },
    
  }
  
});
