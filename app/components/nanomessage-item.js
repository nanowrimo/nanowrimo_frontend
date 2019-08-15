import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),
  store: service(),
  nanomessage: null,
  newMessage: 'message-new',
  
  leftAlign: computed('nanomessage',function() {
    let n = this.get('nanomessage');
    let u = this.get('currentUser.user');
    if (n.user_id==u.id) {
      return false;
    } else {
      return true;
    }
  }),
  sender: computed('nanomessage',function() {
    let n = this.get('nanomessage');
    let uid = n.user_id;
    let s = this.get('store');
    let u = s.findRecord('user',uid);
    return u;
  }),
  updateHeight() {
    this.set('newMessage','');
  },
  init() {
    this._super(...arguments);
    debounce(this, this.updateHeight, 100, false);
  },
  
});
