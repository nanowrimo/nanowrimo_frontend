import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';

export default Controller.extend({
  group: alias('model'),
  hasGroup: computed('group', function() {
    let g = this.get('group');
    if (g) {
      return true;
    } else {
      return false;
    }
  }),
  
  
});
