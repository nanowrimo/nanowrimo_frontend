import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';

export default Component.extend({
  currentUser: service(),
  store: service(),
  groupContainer: null,
  listOrder: null,
  limitList: null,
  sortBySearch: null,
  thisGroup: computed('groupContainer', function() {
    let groupContainer = this.get('groupContainer');
    return groupContainer.groupObject;
  }),
  init() {
    this._super(...arguments);
  },
  
  actions: {
    joinGroup() {
      let gu = this.get('store').createRecord('groupUser');
      gu.set('user', this.get('currentUser.user'));
      gu.set('group', this.get('thisGroup'));
      gu.save();
      this.get('statusChanged')();
    }
  }
  
});
