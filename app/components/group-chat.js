import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import { debounce, cancel } from '@ember/runloop';

export default Component.extend({
  router: service(),
  store: service(),
  currentUser: service(),
  classNames: ['nw-card nanomessages-card'],
  group: null,
  context: null,
  sortOptions: null,
  //sortedMessages: sort('nanomessages', 'selectedSortOption'),
  nanomessage: null,
  selectedSortOption: null,
  showForm: true,
  recompute: 0,
  messages: null,
  tempDebounce: null,
  adminIsChecked: computed('context',function() {
    let c = this.get("context");
    return (c=='nanomessages');
  }),
  
  init() {
    this._super(...arguments);
    let options = ['createdAt:asc'];
    this.set('sortOptions', options);
    this.set('selectedSortOption', [options[0]]);
    debounce(this, this.gotoBottom, 1000, false);
    this.set('tempDebounce',debounce(this, this.checkForMessages, 1000, false));
  },

  willDestroyElement() {
    let td = this.get('tempDebounce');
    cancel(td);
  },
  
  sortedMessages: computed('messages.[]','group.id','context',function() {
    let ms = this.get("messages");
    let c = this.get("context");
    let t = this.get('group.groupType');
    let newms = [];
    if (ms) {
      if ((c=='nanomessages')&&((t=='everyone')||(t=='region'))) {
        ms.forEach(function(m) {
          if (m.official) {
            newms.push(m);
          }
        });
      } else {
        ms.forEach(function(m) {
          newms.push(m);
        });
      }
    }
    return newms;
  }),
  
  showToDiv: computed('group.groupType', function() {
    let g = this.get('group');
    let gt = g.get('groupType');
    if ((gt != 'region') && (gt != 'event')) {
      return true;
    } else {
      return false;
    }
  }),
  
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
  
  doShowForm() {
    this.set('showForm',true);
  },
  gotoBottom(){
    var objDiv = document.getElementById("convo-content");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  },
  checkForUpdates() {
    let g = this.get('group');
    let gid = g.id;
    let t = this;
    
    this.get('store').query('nanomessage', {
      group_id: gid
    }).then(function(ms) {
      t.set("messages",ms);
    });
  },
  
  checkForMessages() {
    this.checkForUpdates();
    this.set('tempDebounce',debounce(this, this.checkForMessages, 10000, false));
    //debounce(this, this.checkForMessages, 5000, false);
    //debounce(this, this.gotoBottom, 500, false);
  },
  actions: {
    afterNanomessageSubmit() {
      this.checkForUpdates();
      this.set('showForm',false);
      debounce(this, this.doShowForm, 0, false);
      debounce(this, this.gotoBottom, 500, false);
    },
  }
  
});
