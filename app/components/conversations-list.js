import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';

export default Component.extend({
  currentUser: service(),
  conversations: computed('currentUser.user.buddyGroupsActive',function() {
    console.log(this.get('currentUser.user.buddyGroupsActive'));
    return this.get('currentUser.user.buddyGroupsActive');
  }),
  actions: {
    searchStringChange: function() {
      console.log('changed search');
      //debounce(this, this.updateSearch, 1000, false);
    }
    
  }
});
