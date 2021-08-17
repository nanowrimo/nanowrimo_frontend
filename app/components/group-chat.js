import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import { debounce, cancel } from '@ember/runloop';
import { sort }  from '@ember/object/computed';

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
  messagesLoaded: false,
  adminIsChecked: computed('context',function() {
    let c = this.get("context");
    return (c=='nanomessages');
  }),
  
  init() {
    this._super(...arguments);
    let g = this.get('group');
    if (g) {
      let options = ['createdAt:asc'];
      this.set('sortOptions', options);
      this.set('selectedSortOption', [options[0]]);
      this.set('tempDebounce',debounce(this, this.checkForMessages, 1000, false));
    } else {
      this.set('classNames', ['nw-card nanomessages-card hide-mobile']);
    }
  },

  userIsAdmin: computed('currentUser.user.isLoaded',function() {
    let found = false;
    if (this.get('currentUser.user.isLoaded')) {
      let gus = this.get('store').peekAll('groupUser');
      let g = this.get('group');
      let cu = this.get('currentUser.user');
      gus.forEach(function(gu) {
        if ((gu.group_id==g.id)&&(gu.user_id==cu.id)&&(gu.isAdmin)) {
          found = true;
        }
      });
    }
    return found;
  }),
  
  willDestroyElement() {
    let td = this.get('tempDebounce');
    cancel(td);
  },
  
  filteredMessages: computed('messages.[]','group.groupType','context',function() {
    let ms = this.get("messages");
    let c = this.get("context");
    let t = this.get('group.groupType');
    let newms = [];
    if (ms) {
      if ((c=='nanomessages')&&((t=='everyone')||(t=='region'))) {
        ms.forEach(function(m) {
          if ((m.official)&&(m.id>0)) {
            newms.push(m);
          }
        });
      } else {
        ms.forEach(function(m) {
          if (m.id>0) {
            newms.push(m);
          }
        });
      }
    }
    return newms;
  }),
  messageSortingDesc: Object.freeze(['createdAt:asc']),
  sortedMessages: sort('filteredMessages','messageSortingDesc'),
  
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
    let gn = null;
    if (g) {
      let gt = g.get('groupType');
      gn = g.get('name');
      if (gt=='buddies') {
        let store = this.get('store');
        let id = this.get('currentUser.user.id');
        let gus = g.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.id!=id) && (gu.invitationAccepted=='1')) {
              gn = "@" + u.name;
            }
          }
        });
      }
      this.checkForMessages();
    }
    return gn;
  }),
  
  doShowForm() {
    this.set('showForm',true);
  },
  checkForUpdates() {
    let g = this.get('group');
    if (g) {
      let gid = g.id;
      let t = this;
      this.set('messagesLoaded',true);
      this.get('store').query('nanomessage', {
        group_id: gid
      }).then(function(ms) {
        t.set("messages",ms);
      });
    }
  },
  
  checkForMessages() {
    this.checkForUpdates();
    this.set('tempDebounce',debounce(this, this.checkForMessages, 10000, false));
  },
  actions: {
    afterNanomessageSubmit() {
      this.checkForUpdates();
      this.set('showForm',false);
      debounce(this, this.doShowForm, 100, false);
    },
    
    doClearGroup() {
      this.clearGroup();
    },
    
  }
  
});
