import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';

export default Component.extend({
  currentUser: service(),
  conversations: computed('currentUser.user.convoGroups',function() {
    return this.get('currentUser.user.convoGroups');
  }),
  actions: {
  }
});
