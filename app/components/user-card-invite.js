import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  store: service(),
  
  user: null,
  uid: null,
  group: null,
  status: 0,
  
  inGroup: computed('group.id','user','status',function() {
    let status = this.get('status');
    let store = this.get('store');
    let gus = store.peekAll('group-user');
    let gid = this.get('group.id');
    let uid = this.get('uid');
    let t = this;
    let found = false;
    gus.forEach(function(gu) {
      if ((gu.group_id==gid)&&(gu.user_id==uid)) {
        found = true;
        if (status<1) {
          t.set('status',1);
        }
      }
    });
    return found;
  }),
  
  avatarUrl: computed("user", function() {
    let url = this.user.avatar;
    if (!url) {
      url = "/images/users/unknown-avatar.png";
    }
    return url;
  }),
  
  actions: {
    inviteUser() {
      let t = this;
      let s = this.get('store');
      let gid = this.get('group.id');
      let uid = this.get('uid');
      let cuid = this.get('currentUser.user.id');
      let newGroupUser = s.createRecord('groupUser');
      newGroupUser.set('isAdmin',false);
      newGroupUser.set('group_id',gid);
      newGroupUser.set('user_id',uid);
      newGroupUser.set('invited_by_id',cuid);
      newGroupUser.set('invitationAccepted',0);
      newGroupUser.set('entryMethod','invited');
      newGroupUser.save().then(function() {
        t.set('status',1);
        //alert('done');
      });
      
    },
  },
  
    
});
