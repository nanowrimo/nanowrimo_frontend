import Component from '@ember/component';
import { computed }  from '@ember/object';
import { sort }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({

  currentUser: service(),
  pingService: service(),
  
  user: null,
  showRequests: false,
  searchString: '',
  tempSearchString: '',
  selectedSortOption: 'Overall Progress',
  showTools: false,
  
  isLoading: computed('currentUser.isLoading', function() {
    return this.get('currentUser.isLoading');
  }),
  
  // Determines the number of active buddies
  buddyCount: computed('user.buddiesActive.[]', function() {
    const buddies = this.get('user.buddiesActive');
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
  
  searchedBuddies: computed('user.buddiesActive.[]','searchString', 'pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const unsearchedBuddies = this.get('user.buddiesActive');
    const searchString = this.get('searchString').toLowerCase();
    let searchedBuddies = [];
    if (searchString == '' && updateCount) {
      searchedBuddies = unsearchedBuddies;
    } else {
      for (let i=0; i<unsearchedBuddies.length; i++) {
        if (unsearchedBuddies[i].name.toLowerCase().search(searchString)>=0) {
          searchedBuddies.push(unsearchedBuddies[i]);
        }
      }
    }
    return searchedBuddies;
  }),
  
  presortedBuddies: computed('user.buddiesActive.[]','searchedBuddies','selectedSortOption', function() {
    let unsortedBuddies = this.get('searchedBuddies');
    let sortedBuddies = [];
    let pps = null;
    const selectedSortOption = this.get('selectedSortOption');
    for (let i=0; i<unsortedBuddies.length; i++) {
      pps = this.get('pingService').primaryProjectState(unsortedBuddies[i].id);
      let sortNum = 0;
      if (pps) {
        switch (selectedSortOption) {
          case 'Overall Progress':
            sortNum = Math.min(Math.round((pps.current_word_count/pps.goal_total)*100),100);
            break;
          case 'Daily Progress':
            sortNum = Math.min(Math.round((pps.daily_total/(pps.goal_total/pps.challenge_days))*100),100);
            break;
          case 'Writing Streak':
            sortNum = pps.streak_days.toLocaleString();
            break;
          default:
            sortNum = 0;
        }
      }
      unsortedBuddies[i].sortNum = sortNum;
    }
    
    sortedBuddies = unsortedBuddies;
    return sortedBuddies;
  }),
  
  buddiesSortingDesc: Object.freeze(['sortNum:desc']),
  
  sortedBuddies: sort('presortedBuddies','buddiesSortingDesc'),
  
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
