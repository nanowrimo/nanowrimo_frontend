import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  router: service(),

  queryParams: ['edit'],

  edit: null,
  userParam: null,

  user: alias('model'),

  canEditUser: computed('currentUser.user.id', 'user.id', function() {
    return this.get('currentUser.user.id') === this.get('user.id');
  }),

  _needsURLUpdate() {
    return this.get('user.name') !== this.get('userParam');
  },

  actions: {
    afterModalClose() {
      this.set('edit', null);
      if (this._needsURLUpdate()) {
        let userName = this.get('user.name');
        let newURL = this.get('router.currentURL').replace(this.get('userParam'), userName);
        this.set('userParam', userName);
        this.get('router').replaceWith(newURL);
      }
    }
  }
});
