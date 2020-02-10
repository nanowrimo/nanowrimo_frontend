import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  group: alias('model'),
  currentUser: service(),
  store: service(),
  
  // Returns the group users in the store
  groupUsers: computed(function() {
    // Peek all group-user records in the store
    return this.get('store').peekAll('group-user');
  }),
  
  // Returns the group users in the store
  myGroupUsers: computed('groupUsers',function() {
    // Peek all group-user records in the store
    let allgus = this.get('groupUsers');
    let gid = this.get('group.id');
    let gus = [];
    allgus.forEach(function(gu) {
      if (gid==gu.group_id) {
        gus.push(gu);
      }
    });
    // Return the correct group-user, or false if not found
    return gus;
  }),
  
  numMembers: computed('myGroupUsers.[]',function() {
    let gus = this.get('myGroupUsers');
    return gus.length;
  }),
  
  isAdmin: computed('currentUser.user.name', function() {
    return true;
  }),
  canDelete: computed('myGroupUsers.[]','numMembers', function() {
    let n = this.get('numMembers');
    return (n<2);
  }),
  
  actions: {
    deleteGroup() {
      let gus = this.get('myGroupUsers');
      let g = this.get('group');
      gus.forEach(function(gu) {
        gu.deleteRecord();
        gu.save();
      });
      g.deleteRecord();
      g.save();
      let r = this.get('router');
      let cu = this.get('currentUser.user');
      r.transitionTo('authenticated.users.show.groups',cu);
    },    
  },
  
});
