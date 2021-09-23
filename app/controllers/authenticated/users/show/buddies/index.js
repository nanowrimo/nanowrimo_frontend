import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  currentUser: service(),
  selectedSortOption: null,
  sortOptions: null,
  user: null,
  buddiesActive: computed('user.buddiesActive.[]',function() {
    let u = this.get('user');
    return u.buddiesActive;
  }),
  sortedBuddies: sort('user.activeBuddies', 'selectedSortOption'),
  
  init() {
    this._super(...arguments);
    let options = ['name'];
    this.set('sortOptions', options);
    this.set('selectedSortOption', [options[0]]);
  },

  actions: {
    setSortSelection() {
    },
  }
  
});
