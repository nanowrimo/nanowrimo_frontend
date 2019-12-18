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
  
  yearsDoneCount: computed('user.stats.yearsDone.[]', function() {
    return this.get('user.yearsDone').length;
  })
});
