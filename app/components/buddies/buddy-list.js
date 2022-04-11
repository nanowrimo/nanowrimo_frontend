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
  
  init() {
    this._super(...arguments);
    // load the buddies
    this.get('currentUser.user').loadBuddies();
    
  },
  
  isCurrentUser: computed('currentUser.user.id', 'user.id', function() {
    return (this.get('currentUser.user.id')==this.get('user.id'))
  }),
  
  isLoading: computed('currentUser.user.buddiesLoaded', function() {
    return !this.get('currentUser.user.buddiesLoaded');
  }),
  
  // Determines the number of active buddies
  buddyCount: computed('user.buddiesActive.[]','isLoading', function() {
    const buddies = this.get('user.buddiesActive');
    const isLoading = this.get('isLoading');
    if (!isLoading && buddies) {
      return buddies.length;
    } else {
      return 0;
    }
  }),
  
  doShowRequests: computed('showRequests', function() {
    const sr = this.get('showRequests');
    if ((sr === 'true') || (sr === true)) {
      return true;
    } else {
      return false;
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
    if (buddiesInvited && buddiesPending) {
      return (buddiesInvited.length + buddiesPending.length);
    } else {
      return 0;
    }
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
      let sortNum = -1;
      if (pps) {
        switch (selectedSortOption) {
          case 'Overall Progress':
            sortNum = Math.min(Math.round((pps.current_word_count/pps.goal_total)*100),100);
            break;
          case 'Daily Progress':
            sortNum = Math.min(Math.round((pps.daily_total/(pps.goal_total/pps.challenge_days))*100),100);
            break;
          case 'Writing Streak':
            if (pps.streak_days) {
              sortNum = pps.streak_days;
            } else {
              sortNum = 0;
            }
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
      const sr = this.get('showRequests');
      if ((sr === 'true') || (sr === true)) {
        this.set('showRequests', false);
      } else {
        this.set('showRequests', true);
      }
    },
    
  }
  

});
