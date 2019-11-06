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
  senderAvatarUrl: computed('nanomessage',function() {
    let n = this.get('nanomessage');
    if (n.sender_avatar_url) {
      return n.sender_avatar_url;
    } else {
      return "/images/users/unknown-avatar.png";
    }
  }),
  
  updateHeight() {
    this.set('newMessage','');
  },
  init() {
    this._super(...arguments);
    debounce(this, this.updateHeight, 100, false);
  },
  
  actions: {
    // For deleting nanomessages
    deleteMessage() {
      // Get userIsAdmin of group
      let userIsAdmin = this.get('userIsAdmin');
      // If user is admin
      if (userIsAdmin) {
        // get the message
        let n = this.get('nanomessage');
        // Delete it
        n.deleteRecord();
        n.save();
      }
    },
  }
  
});
