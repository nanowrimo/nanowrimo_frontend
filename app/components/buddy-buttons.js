import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';

export default Component.extend({
  store: service(),
  currentUser: service(),
  user: null,
  notCurrentUser: computed('currentUser.user','user',function() {
    if (this.get('currentUser.user') != this.get('user')) {
      return true;
    }
    return false;
  }),
  notBuddy: computed('currentUser.user.{groupUsers,groups}',function() {
    let buddiesActive = this.get('currentUser.user.buddiesActive');
    if (buddiesActive.includes(this.get('user'))) {
      return false;
    }
    return true;
  }),
  buddyActive: computed('currentUser.user.{groupUsers,groups}',function() {
    let buddiesActive = this.get('currentUser.user.buddiesActive');
    if (buddiesActive.includes(this.get('user'))) {
      return true;
    }
    return false;
  }),
  userBlocked: computed('currentUser.user.{groupUsers,groups}',function() {
    return false;
  }),
  buddyInvited: computed('currentUser.user.{groupUsers,groups}',function() {
    return false;
  }),
  selfInvited: computed('currentUser.user.{groupUsers,groups}',function() {
    return false;
  }),
  actions: {
    sendInvitation() {
      let g = this.get('store').createRecord('group', {
        userId: this.get('currentUser.user.id'),
        name: 'buddies',
        groupType: 'buddies'
      });
      g.save().then(() => {
        let gu1 = this.get('store').createRecord('groupUser', {
          user: this.get('currentUser.user'),
          group: g,
          is_admin: 1,
          invitation_accepted: 1,
          entry_method: 'creator'
        });
        gu1.save().then(() => {
          let gu2 = this.get('store').createRecord('groupUser', {
            user: this.get('user'),
            group: g,
            is_admin: 1,
            invitation_accepted: 0,
            entry_method: 'invited'
          });
          gu2.save().then(() => {
            let cu = this.get('currentUser.user');
            cu.get('groups').pushObject(g);
          });
        });
      });
    }
  }
  
});
