import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort }  from '@ember/object/computed';

export default Component.extend({
  store: service(),
  recalculate: 0,
  // Get the project challenge as a variable
  projectChallenge: null,
  newProjectSession: false,
  
  sessions: null,
  
  progressUpdates: computed('sessions', function() {
    let pss = this.get('sessions');
    return pss;
  }),
  
  updateSortingAsc: Object.freeze(['end:desc']),
  sortedUpdates: sort('progressUpdates','updateSortingAsc'),
  
  doRecalculate() {
    let r = this.get('recalculate');
    let newr = r + 1;
    this.set('recalculate',newr);
  },
  
  actions: {
    userDidChangeProjectSession() {
      this.doRecalculate();
    },
    newProjectSession(){
      this.set('newProjectSession', true);
    }
    
  }
  
});
