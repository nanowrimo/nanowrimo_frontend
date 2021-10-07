import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Component.extend({
  currentUser: service(),
  store: service(),
  user: null,
  showRequests: false,
  searchString: '',
  tempSearchString: '',
  selectedSortOption: 'Overall Progress',
  showTools: false,
  
  // Determines the number of active buddies
  buddyCount: computed('user.buddyGroupsActive', function() {
    const buddies = this.get('user.buddyGroupsActive');
    if (buddies) {
      return buddies.length;
    } else {
      return 0;
    }
  }),
  
  // Determines whether to display the search box
  searchNeeded: computed('buddyCount', function() {
    const buddyCount = this.get('buddyCount');
    return (buddyCount>1);
  }),
  
  // Determines the number of pending buddies
  buddyRequestCount: computed('user.{buddyGroupUsersInvited,buddyGroupUsersPending}', function() {
    const buddiesInvited = this.get('user.buddyGroupUsersInvited');
    const buddiesPending = this.get('user.buddyGroupUsersPending');
    return (buddiesInvited.length + buddiesPending.length);
  }),
  
  searchedBuddies: computed('user.buddyGroupsActive.[]','searchString', function() {
    const cu = this.get('user');
    const store = this.get('store');
    const unsearchedBuddies = this.get('user.buddyGroupsActive');
    const searchString = this.get('searchString').toLowerCase();
    let searchedBuddies = [];
    if (searchString == '') {
      searchedBuddies = unsearchedBuddies;
    } else {
      for (let i=0; i<unsearchedBuddies.length; i++) {
        const gus = unsearchedBuddies[i].get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.id!=cu.id) && (gu.exitAt==null)) {
              if (u.name.toLowerCase().search(searchString)>=0) {
                searchedBuddies.push(unsearchedBuddies[i]);
              }
            }
          }
        });
      }
    }
    return searchedBuddies;
  }),
  
  sortedBuddies: computed('user.buddyGroupsActive.[]','searchedBuddies', function() {
    const cu = this.get('user');
    const store = this.get('store');
    const unsortedBuddies = this.get('searchedBuddies');
    let sortedBuddies = [];
    sortedBuddies = unsortedBuddies;
    return sortedBuddies;
  }),
  
  searchStringComputed: computed('searchString', function() {
    return this.get('searchString');
  }),
  
  actions: {

    setSortSelection(val) {
      this.set('selectedSortOption', val);
    },
    
    searchStringChange() {
      this.set('searchString',this.get('tempSearchString'));
    },
    
    toggleRequestsView() {
      this.set('showRequests',!this.get('showRequests'));
    },
    
  }
  

});