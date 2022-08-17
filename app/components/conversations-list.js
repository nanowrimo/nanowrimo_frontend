import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import { sort }  from '@ember/object/computed';
import { debounce } from '@ember/runloop';

export default Component.extend({
  store: service(),
  currentUser: service(),
  officialOnly: null,
  tempSearchString: '',
  newMessage: null,
  
  init(){
    this._super(...arguments);
    // load the current users nanomessagesGroups
    this.get('currentUser').user.loadNanomessagesGroups();
  },
  conversations: computed('currentUser.user.nanomessagesGroups.[]','tempSearchString','newMessage',function() {
    const es =  this.get('currentUser.user.nanomessagesGroups');
    const ss =  this.get('tempSearchString').toLowerCase();
    let newes = [];
    // If the user has one or more groups
    if (es) {
      let store = this.get('store');
      let id = this.get('currentUser.user.id');
      // If there's an active search string
      if (ss) {
        for (let i=0; i<es.length; i++) {
          let g = es[i];
          let name = g.get('name').toLowerCase();
          if (g.get('groupType')=='buddies') {
            let gus = g.get('groupUsers');
            gus.forEach(function(gu) {
              if (gu.user_id) {
                let u = store.peekRecord('user', gu.user_id);
                if ((u) && (u.id!=id) && (gu.invitationAccepted=='1')) {
                  name = u.name.toLowerCase();
                }
              }
            });
          }
          if (name.indexOf(ss) !== -1) {
            newes.push(es[i]);
          }
        }
      } else { // If there isn't an active search string
        // If it's the new message state
        if (this.get('newMessage')) {
          for (let i=0; i<es.length; i++) {
            if (es[i].latestMessageDt==null) {
              let g = es[i];
              if (g.get('groupType')=='buddies') {
                let gus = g.get('groupUsers');
                gus.forEach(function(gu) {
                  if (gu.user_id) {
                    let u = store.peekRecord('user', gu.user_id);
                    if ((u) && (u.id!=id) && (gu.invitationAccepted=='1')) {
                      newes.push(es[i]);
                    }
                  }
                });
              } else {
                newes.push(es[i]);
              }
            }
          }
        } else { // Just the regular list
          for (let i=0; i<es.length; i++) {
            if (es[i].denormedLastOfficialMessageAt!=null) {
              newes.push(es[i]);
            }
          }
        }
      }
    }
    return newes;
  }),
  
  conversationSortingDesc: Object.freeze(['denormedLastOfficialMessageAt:desc']),
  
  updateSearch() {
    this.set('searchString',this.get('tempSearchString'));
  },
  
  // Sorts the conversations by date, with the most immediate first
  sortedConversations: sort('conversations','conversationSortingDesc'),
  
  actions: {
    searchStringChange: function() {
      debounce(this, this.updateSearch, 250, false);
    },
    initiateNewMessage: function() {
      this.set('newMessage', true);
      const pinm = this.get('parentInitiateNewMessage');
      pinm();
    },
    cancelNewMessage: function() {
      this.set('newMessage', false);
      const pcnm = this.get('parentCancelNewMessage');
      pcnm();
    },
  }
});
