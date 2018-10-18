import Controller from '@ember/controller';
import { alias, sort }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import { debounce } from '@ember/runloop';

export default Controller.extend({
  router: service(),
  store: service(),
  currentUser: service(),
  group: null,
  nanomessages: alias('model'),
  sortOptions: null,
  sortedMessages: sort('nanomessages', 'selectedSortOption'),
  nanomessage: null,
  selectedSortOption: null,
  showForm: true,
  groupName: computed('group', function() {
    let g = this.get('group');
    let gt = g.get('groupType');
    let gn = g.get('name');
    if (gt=='buddies') {
      let store = this.get('store');
      let email = this.get('currentUser.user.email');
      let gus = g.get('groupUsers');
      gus.forEach(function(gu) {
        if (gu.user_id) {
          let u = store.peekRecord('user', gu.user_id);
          if ((u) && (u.email!=email) && (gu.invitationAccepted=='1')) {
            gn = u.name;
          }
        }
      });
    }
    //this.set('showForm',false);
    //debounce(this, this.doShowForm, 500, false);
    return gn;
  }),
  init() {
    this._super(...arguments);
    let options = ['createdAt:asc'];
    this.set('sortOptions', options);
    this.set('selectedSortOption', [options[0]]);
    debounce(this, this.gotoBottom, 1000, false);
    debounce(this, this.checkForMessages, 5000, false);
  },

  doShowForm() {
    this.set('showForm',true);
  },
  gotoBottom(){
    var objDiv = document.getElementById("convo-content");
    objDiv.scrollTop = objDiv.scrollHeight;
  },
  checkForMessages() {
    this.send('refreshModel');
    debounce(this, this.checkForMessages, 5000, false);
    //debounce(this, this.gotoBottom, 500, false);
  },
  actions: {
    afterNanomessageSubmit() {
      this.send('refreshModel');
      this.set('showForm',false);
      debounce(this, this.doShowForm, 0, false);
      debounce(this, this.gotoBottom, 500, false);
    },
  }
  
});
