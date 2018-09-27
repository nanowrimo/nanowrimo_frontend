import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import { Promise } from 'rsvp';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  store: service(),
  currentUser: service(),
  session: service(),
  user: null,
  newBuddyEndpoint: `${ENV.APP.API_HOST}/groups/invite_buddy/`,
  approveBuddyEndpoint: `${ENV.APP.API_HOST}/groups/approve_buddy/`,
  rejectBuddyEndpoint: `${ENV.APP.API_HOST}/groups/reject_buddy/`,
  removeBuddyEndpoint: `${ENV.APP.API_HOST}/groups/remove_buddy/`,
  cancelInvitationEndpoint: `${ENV.APP.API_HOST}/groups/invite_buddy_cancel/`,
  blockUserEndpoint: `${ENV.APP.API_HOST}/groups/block_user/`,
  unblockUserEndpoint: `${ENV.APP.API_HOST}/groups/unblock_user/`,
  
  notCurrentUser: computed('currentUser.user','user',function() {
    if (this.get('currentUser.user') != this.get('user')) {
      return true;
    }
    return false;
  }),
  buddyActive: computed('currentUser.user.buddiesActive',function() {
    let buddiesActive = this.get('currentUser.user.buddiesActive');
    if (buddiesActive.includes(this.get('user'))) {
      return true;
    }
    return false;
  }),
  buddyInvited: computed('currentUser.user.buddiesInvited',function() {
    let buddiesInvited = this.get('currentUser.user.buddiesInvited');
    if (buddiesInvited.includes(this.get('user'))) {
      return true;
    }
    return false;
  }),
  buddyInvitedBy: computed('currentUser.user.buddiesInvitedBy',function() {
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
  
  actions: {
    sendInvitation() {
      let user = this.get('user');
      return new Promise((resolve, reject) => {
        let newBuddyEndpoint = this.get('newBuddyEndpoint')+user.id;
        let { auth_token }  = this.get('session.data.authenticated');
        
        let body = {};
        console.log(newBuddyEndpoint);
        return fetch((newBuddyEndpoint), { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
          body: JSON.stringify(body)
        }) 
        .then((response) => {
          if (response.ok) {
            user.loadGroupUsers('buddies');
          } else {
          }
        })
        .catch((error) => {
          reject(error);
        });
      });
    },
    
    approveInvitation() {
      let user = this.get('user');
      return new Promise((resolve, reject) => {
        let approveBuddyEndpoint = this.get('approveBuddyEndpoint')+user.id;
        let { auth_token }  = this.get('session.data.authenticated');
        let body = {};
        console.log(approveBuddyEndpoint);
        return fetch((approveBuddyEndpoint), { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth_token},
          body: JSON.stringify(body)
        }) 
        .then((response) => {
          if (response.ok) {
            user.loadGroupUsers('buddies');
          } else {
          }
        })
        .catch((error) => {
          reject(error);
        });
      });
    },
    
    rejectInvitation() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      return new Promise((resolve, reject) => {
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
            cu.loadGroupUsers('buddies');
          } else {
          }
        })
        .catch((error) => {
          reject(error);
        });
      });
    },
    
    removeBuddy() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      return new Promise((resolve, reject) => {
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
            cu.loadGroupUsers('buddies');
          } else {
          }
        })
        .catch((error) => {
          reject(error);
        });
      });
    },
    
    cancelInvitation() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
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
          }
        }).catch((error) => {
          //reject(error);
        });
      }
    },
    
    blockUser() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      return new Promise((resolve, reject) => {
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
          }
        })
        .catch((error) => {
          reject(error);
        });
      });
    },
    
    unblockUser() {
      let user = this.get('user');
      let cu = this.get('currentUser.user');
      return new Promise((resolve, reject) => {
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
          }
        })
        .catch((error) => {
          reject(error);
        });
      });
    },
    
  }
  
});
