import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe }  from '@ember/string';

export default Controller.extend({
  store: service(),
  currentUser: service(),
  router: service(),
  group: alias('model'),
  dataLoaded: false,
  
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.{isLoaded,groupUsersLoaded}','group', function() {
    let allowed = this.get('currentUser.isLoaded') && this.get('currentUser.groupUsersLoaded');
    if (allowed) {
      if (this.get('currentUser.user.adminLevel')) {
        return true;
      } else {
        // is the viewer's id in the group's adminids array?
        let adminIds = this.get('group.adminIds');
        let uid = this.get('currentUser.user.id');
        return adminIds.includes(uid);
      }
    }
    return false;
  }),
  
  // Returns true if the chat space is enabled
  chatEnabled: computed('group.groupType', function() {
    let gt = this.get('group.groupType');
    return (gt != 'everyone');
  }),
  
  plateStyle: computed('group.plateUrl', 'canEditGroup', function() {
    let styles = [];
    let plateUrl = this.get('group.plateUrl');
    if (plateUrl) {
      styles.push(`background-image:url(${plateUrl})`);
    }
    if (this.get('canEditGroup')) {
      styles.push('cursor:pointer');
    }
    return htmlSafe(styles.join(';'));
  }),
  
  _needsURLUpdate() {
    return this.get('group.slug') !== this.get('groupParam');
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
