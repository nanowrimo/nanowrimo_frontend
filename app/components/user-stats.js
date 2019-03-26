import Component from '@ember/component';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  user: alias('author'),
  
  yearsWon: computed('user.yearsWon.[]', function(){
    return this.get('user.yearsWon');
  }),
  
  yearsDoneCount: computed('user.yearsDone.[]', function() {
    return this.get('user.yearsDone').length;
  })
});
