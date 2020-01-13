import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  currentUser: service(),
  selectedSortOption: null,
  sortOptions: null,
  user: null,
  
  init() {
    this._super(...arguments);
  },

  hasRegions: computed('user.myGroups', function() {
    let gs = this.get('user.myGroups');
    if (gs.length>0) {
      return true;
    } else {
      return false;
    }
  }),
  
});
