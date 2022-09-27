import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  store: service(),
  router: service(),
  group: null,
  buttonType: null,
  canEditGroup: false,

  _needsURLUpdate() {
    return this.get('group.slug') !== this.get('groupParam');
  },
  
  init() {
    this._super(...arguments);
  },
  
  actions: {
    afterEditModalClose() {
      this.set('edit', null);
      this.set('editTab', null);

      if (this._needsURLUpdate()) {
        let groupSlug = this.get('group.slug');
        let newURL = this.get('router.currentURL').replace(this.get('groupParam'), groupSlug);
        this.set('groupParam', groupSlug);
        this.get('router').replaceWith(newURL);
      }
    },

    afterImagesModalClose() {
      this.set('editImages', null);
      this.set('editImagesTab', null);
    },

    openEditModal(tab) {
      if (this.get('canEditGroup')) {
        this.set('edit', true);
        if (tab) { this.set('editTab', tab); }
      }
    },

    openImagesModal(tab) {
      if (this.get('canEditGroup')) {
        this.set('editImages', true);
        if (tab) { this.set('editImagesTab', tab); }
      }
    },
  }
  
});
