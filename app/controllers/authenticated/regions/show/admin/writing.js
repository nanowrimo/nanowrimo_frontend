import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  session: service(),
  currentUser: service(),
  router: service(),
  group: alias('model'),
  activeTab: 'members',
  
  challengeSortingDesc: Object.freeze(['startsAt:desc']),
  
  // Gets all challenges from the store
  availableOptionsForChallenges:  computed('getChallengeOptions', function() {
    return this.get('store').query('challenge',{ available: false});
  }),
 
  optionsForChallenges: sort('availableOptionsForChallenges','challengeSortingDesc'),
    
  actions: {
    associateChallengeSelect(challengeId) {
      this.get('router').transitionTo('authenticated.regions.show.admin.writing.show', this.get('group.slug'), challengeId );
    },
  }
  
});
