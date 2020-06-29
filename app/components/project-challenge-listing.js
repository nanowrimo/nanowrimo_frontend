import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  statsParams: service(),
  router: service(),
  editProjectChallenge: false,
  
  canEdit: computed('project', function(){
    let currentUser = this.get('currentUser.user');
    let author = this.get('author');
    return currentUser === author;
  }),
  
  svg: computed('projectChallenge', function() {
    let str = (this.get('projectChallenge.unitType') === 0) ? 'writing' : 'editing';
    return `/images/goals/${str}.svg`
  }),
  
  actions: {
    editProjectChallenge(){
       this.set('editProjectChallenge', true);
    },

    redirectToStats(){
      //get the statsParams service
      let sp = this.get('statsParams');
      //set project and projectChallenge
      sp.setProject(this.get('project'));
      sp.setProjectChallenge(this.get('projectChallenge'));
      //do the redirect
      this.get('router').transitionTo('/stats');
    }
  }
});
