import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort }  from '@ember/object/computed';

export default Component.extend({
  store: service(),
  recalculate: 0,
  // Get the project challenge as a variable
  projectChallenge: null,
  sessions: null,
  
  progressUpdates: computed('sessions', function() {
    //let r = this.get('recalculate');
    //let pcid = this.get('projectChallenge.id');
    //let store = this.get('store');
    //let pss = store.peekAll('projectSession');
    let pss = this.get('sessions');
    //let newpss = [];
    //if (r==r) {
      //if (pss) {
        //pss.forEach((ps)=>{
          //if (ps.project_challenge_id==pcid) {
            //newpss.pushObject(ps);
          //}
        //});
      //}
    //}
    //return newpss;
    return pss;
  }),
  
  updateSortingAsc: Object.freeze(['end:asc']),
  sortedUpdates: sort('progressUpdates','updateSortingAsc'),
  
  doRecalculate() {
    let r = this.get('recalculate');
    let newr = r + 1;
    this.set('recalculate',newr);
  },
  
  actions: {
    userDidChangeProjectSession() {
      this.doRecalculate();
    }
  }
  
});
