import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';
import { sort }  from '@ember/object/computed';

export default Component.extend({
  currentUser: service(),
  officialOnly: null,
  
  conversations: computed('currentUser.user.nanomessagesGroups.[]',function() {
    let es = null;
    es =  this.get('currentUser.user.nanomessagesGroups');
    return es;
  }),
  
  conversationSortingDesc: Object.freeze(['latestMessageDt:desc']),
  
  // Sorts the conversations by date, with the most immediate first
  sortedConversations: sort('conversations','conversationSortingDesc'),
  
  actions: {
  }
});
