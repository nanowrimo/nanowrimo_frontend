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
  
  checkForUpdates() {
    let g = this.get('group');
    this.get('store').query('groupUser', {
      filter: { group_id: g.id },
      include: 'users'
    });
  },
  
  allGroupUsers: computed(function() {
    let gus = this.get('store').peekAll('groupUser');
    return gus;
  }),
  
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
