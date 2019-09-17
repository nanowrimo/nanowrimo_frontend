import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';

export default Component.extend({
  currentUser: service(),
  officialOnly: null,
  conversations: computed('currentUser.user.{everythingGroupsActive.[],buddyGroupsActive.[]}',function() {
    let oo = this.get('officialOnly');
    let es = null;
    if (oo) {
      es =  this.get('currentUser.user.everythingGroupsActive');
    } else {
      es = this.get('currentUser.user.buddyGroupsActive');
    }
    return es;
  }),
  actions: {
  }
});
