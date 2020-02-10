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
  // Returns a list of all groupUsers in the store
  groupUsers: computed(function() {
    return this.get('store').peekAll('groupUser');
  }),
  
  isAdmin: computed('currentUser.user.id','group.id',function() {
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
});
