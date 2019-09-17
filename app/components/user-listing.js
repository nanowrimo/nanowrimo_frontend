import Component from '@ember/component';
import { computed } from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  store: service(),
  userId: null,
  organizer: false,
  itemSize: null,
  
  user: computed('user_id',function() {
    let uid = this.get('userId');
    let store = this.get('store');
    let u = store.findRecord('user',uid);
    return u;
  }),
  
});
