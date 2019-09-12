import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  store: service(),
  group: null,
  groupUsers: null,
  listType: null,
  init() {
    this._super(...arguments);
    this.checkForUpdates();
  },
  
  // Loads any necessary user data from the API
  checkForUpdates() {
    let g = this.get('group');
    let lt = this.get('listType');
    if (lt == 'eventAll') {
      this.get('store').query('groupUser', {
        filter: { group_id: g.id },
        include: 'users'
      });
    }
    if (lt == 'MLs') {
      this.get('store').query('groupUser', {
        filter: { group_id: g.id, isAdmin: true },
        include: 'users'
      });
    }
  },
  
  // Returns the title label for the card
  cardLabel: computed('listType',function() {
    let lt = this.get('listType');
    if (lt == 'eventAll') {
      return 'Attending';
    }
    if (lt == 'MLs') {
      return 'Your MLs';
    }
    return "Members";
  }),
  
  // Returns the size of the user avatars
  itemSize: computed('listType',function() {
    let lt = this.get('listType');
    if (lt == 'eventAll') {
      return 'small';
    }
    if (lt == 'MLs') {
      return 'medium';
    }
    return "small";
  }),
  
  // Returns a list of all groupUsers in the store
  allGroupUsers: computed(function() {
    return this.get('store').peekAll('groupUser');
  }),
  
  // Figures out which users are attending
  groupUsersAttending: computed('allGroupUsers.[]',function() {
    let g = this.get('group');
    let lt = this.get('listType');
    let newgus = [];
    let gus = this.get('allGroupUsers');
    gus.forEach((gu) => {
      if (lt == 'MLs') {
        if ((gu.group_id==g.id)&&(gu.isAdmin)) {
          newgus.push(gu);
        }
      } else {
        if (gu.group_id==g.id) {
          newgus.push(gu);
        }
      }
    });
    return newgus;
  }),
  
});
