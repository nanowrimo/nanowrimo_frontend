import Component from '@ember/component';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  user: alias('author'),
  
  didReceiveAttrs() {
    //refresh the user stats
    let u = this.get('user');
    u.refreshStats();
  },
  
  hasStats: computed('user.stats', function(){
    return (this.get('user.stats')) ? true : false; 
  }),
  
  yearsDoneCount: computed('user.stats.yearsDone.[]', function() {
    let stats = this.get('user.stats');
    if (stats) {
      return this.get('user.stats.yearsDone').length;
    }
  })
});
