import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  store: service(),
  router: service(),
  group: null,
  buttonType: null,
  
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.isLoaded',function() {
    let found = false;
    if (this.get('currentUser.issLoaded')) {
      if (this.get('currentUser.user.adminLevel')) {
        found = true;
      } else {
        let uid = this.get('currentUser.user.id');
        let gid = this.get('group.id');
        let gus = this.get('store').peekAll('group-user');
        gus.forEach((gu)=>{
          if ((gu.user_id==uid)&&(gu.group_id==gid)&&(gu.isAdmin)) {
            found = true;
          }
        });
      }
    }
    return found;
  }),
  
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
