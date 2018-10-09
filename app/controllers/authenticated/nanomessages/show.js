import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe }  from '@ember/string';

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
