import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  group: alias('model'),
  currentUser: service(),
  
  currentUrl: computed(function() {
    return window.location.href;
  }),
  
  // Returns the username of the current user
  currentUserName: computed('currentUser.user.name',function() {
    let n = this.get('currentUser.user.name');
    return n;
  }),
  
  // Returns a list of all groupUsers in the store
  groupUsers: computed(function() {
    return this.get('store').peekAll('groupUser');
  }),
  
  
  // Returns the group user record for this group and the current user
  groupUser: computed('currentUser.user.id','group.id','groupUsers.[]', function() {
    let gus = this.get('groupUsers');
    let gid = this.get('group.id');
    let tgu = false;
    let uid = this.get('currentUser.user.id');
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
  
  isAdmin: computed('groupUsers.[]','currentUser.user.id','group.id',function() {
    let gus = this.get('groupUsers');
    let cuAdminLevel = this.get('currentUser.user.adminLevel');
    let cuid = this.get('currentUser.user.id');
    let gid = this.get('group.id');
    let found = false;
    if (cuAdminLevel>0) {
      found = true;
    } else {
      found = this.get('isGroupAdmin');
      //gus.forEach((gu) => {
        //if ((gu.group_id==gid)&&(gu.user_id==cuid)&&(gu.isAdmin)) {
          //found = true;
        //}
      //});
    }
    return found;
  }),
  
  isGroupAdmin: computed('groupUsers.[]','currentUser.user.id','group.id',function() {
    let gus = this.get('groupUsers');
    let cuid = this.get('currentUser.user.id');
    let gid = this.get('group.id');
    let found = false;
    gus.forEach((gu) => {
      if ((gu.group_id==gid)&&(gu.user_id==cuid)&&(gu.isAdmin)) {
        found = true;
      }
    });
    return found;
  }),
  
  actions: {
    removeUser() {
      let gu = this.get('groupUser');
      let r = this.get('router');
      let cu = this.get('currentUser.user');
      gu.deleteRecord();
      gu.save().then(function() {
        r.transitionTo('authenticated.users.show.groups',cu);
      });
    },
  },
  
});
