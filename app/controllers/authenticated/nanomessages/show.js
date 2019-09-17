import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { debounce } from '@ember/runloop';

export default Controller.extend({
  group: alias('model'),
  oldgroupid: null,
  hasGroup: computed('group','oldgroupid', function() {
    let g = this.get('group');
    let ogid = this.get('oldgroupid');
    if (g) {
      if (ogid!=g.id) {
        debounce(this, this.setOldGroup, 200, false);
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }),
  setOldGroup() {
    let g = this.get('group');
    this.set('oldgroupid',g.id);
  },
  
});
