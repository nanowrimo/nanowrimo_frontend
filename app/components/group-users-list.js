import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  store: service(),
  group: null,
  groupUsers: null,
  
  init() {
    this._super(...arguments);
    this.checkForUpdates();
  },
  
  // Loads any necessary user data from the API
  checkForUpdates() {
    let g = this.get('group');
    this.get('store').query('groupUser', {
      filter: { group_id: g.id },
      include: 'users'
    });
  },
  
  // Returns a list of all groupUsers in the store
  allGroupUsers: computed(function() {
    return this.get('store').peekAll('groupUser');
  }),
  
  // Figures out which users are attending
  groupUsersAttending: computed('allGroupUsers.[]',function() {
    let g = this.get('group');
    let newgus = [];
    let gus = this.get('allGroupUsers');
    gus.forEach((gu) => {
      if (gu.group_id==g.id) {
        newgus.push(gu);
      }
    });
    return newgus;
  }),
  
});
