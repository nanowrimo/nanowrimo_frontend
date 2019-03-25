import Component from '@ember/component';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

const MAX_STATS = 3;

export default Component.extend({
  tagName: '',
  currentUser: service(),

  user: alias('currentUser.user'),
  
  yearsWon: computed('user.yearsWon.[]', function(){
    return this.get('user.yearsWon');
  }),
  
  yearsDoneCount: computed('user.yearsDone.[]', function() {
    return this.get('user.yearsDone').length;
  }),
  
  init(){
    //get this user's challenges
    let c = this.get('user').challenges;
    
  }
});
