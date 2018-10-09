import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';

export default Component.extend({
  store: service(),
  currentUser: service(),
  group: null,
  conversationLabel: computed('group',function() {
    let g = this.get('group');
    let store = this.get('store');
    let email = this.get('currentUser.user.email');
    let name = g.get('name');
    if (g.get('groupType')=='buddies') {
      let gus = g.get('groupUsers');
      gus.forEach(function(gu) {
        if (gu.user_id) {
          let u = store.peekRecord('user', gu.user_id);
          if ((u) && (u.email!=email) && (gu.invitationAccepted=='1')) {
            name = u.name;
          }
        }
      });
    }
    return name;
  }),
  conversationAvatar: computed('group',function() {
    let g = this.get('group');
    let store = this.get('store');
    let email = this.get('currentUser.user.email');
    let avatarUrl = '';
    if (g.get('groupType')=='buddies') {
      let gus = g.get('groupUsers');
      gus.forEach(function(gu) {
        if (gu.user_id) {
          let u = store.peekRecord('user', gu.user_id);
          if ((u) && (u.email!=email) && (gu.invitationAccepted=='1')) {
            avatarUrl = u.avatarUrl;
          }
        }
      });
    }
    return avatarUrl;
  }),
  
  conversationSlug: computed('group', function() {
    let g = this.get('group');
    return g.get('slug');
  }),
  
  actions: {
    searchStringChange: function() {
      console.log('changed search');
      //debounce(this, this.updateSearch, 1000, false);
    }
    
  }
});
