import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  
  store: service(),
  currentUser: service(),
  
  group: null,
  overallProgress: 80,
  dailyProgress: 50,
  streak: 13,
  eventType: 2,
  classNames: ['nw-flex-center','nw-user-card','nw-drop-shadow'],
  
  buddy: computed('group.groupUsers','currentUser', function() {
    const gus = this.get('group.groupUsers');
    const cu = this.get('currentUser.user');
    const store = this.get('store');
    let b = null;
    gus.forEach(function(gu) {
      if (gu.user_id) {
        let u = store.peekRecord('user', gu.user_id);
        if ((u) && (u.id!=cu.id) && (gu.exitAt==null)) {
          b = u;
        }
      }
    });
    return b;
  }),
  
  isActive: computed('group.groupUsers', function() {
    const gus = this.get('group.groupUsers');
    let active = true;
    gus.forEach(function(gu) {
      if (gu.user_id) {
        if (gu.invitationAccepted=='0') {
          active = false;
        }
      }
    });
    return active;
  }),

  conversationSlug: computed('group', function() {
    let g = this.get('group');
    return g.get('slug');
  }),
  
});
