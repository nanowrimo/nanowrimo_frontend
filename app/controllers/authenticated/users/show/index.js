import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias, not }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),

  queryParams: ['editBio', 'editBioTab'],

  editBio: null,
  editBioTab: null,

  user: alias('model'),

  bioExpanded: false,

  showBioReadMore: not('bioExpanded'),

  canEditUser: computed('currentUser.user.id', 'user.id', function() {
    return this.get('currentUser.user.id') === this.get('user.id');
  }),

  actions: {
    afterModalClose() {
      this.set('editBio', null);
    },

    showEditBio(tab) {
      if (this.get('canEditUser')) {
        this.set('editBio', true);
        if (tab) { this.set('editBioTab', tab); }
      }
    }
  }
});
