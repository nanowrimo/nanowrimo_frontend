import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe }  from '@ember/string';

export default Controller.extend({
  currentUser: service(),
  router: service(),
  session: service(),
  queryParams: ['edit', 'editImages', 'editImagesTab', 'editTab'],
  edit: null,
  editTab: null,
  userParam: null,

  user: alias('model'),
  /*showUserContent: computed('router.currentURL',function() {
    let r = this.get('router.currentURL');
    if (r.indexOf('/projects/')>0) {
      return true;
    } else {
      return true;
    }
  }),*/
    
  canEditUser: computed('currentUser.user.id', 'user.id', function() {
    return this.get('currentUser.user.id') === this.get('user.id');
  }),

  canSpoofUser: computed('currentUser.user.id', 'user.id', function() {
    // If the user is admin and not the current user
    return ((this.get('currentUser.user.adminLevel')>0) && (this.get('currentUser.user.id') !== this.get('user.id')));
  }),

  plateStyle: computed('user.plateUrl', 'canEditUser', function() {
    let styles = [];
    let plateUrl = this.get('user.plateUrl');
    if (plateUrl) {
      styles.push(`background-image:url(${plateUrl})`);
    }
    if (this.get('canEditUser')) {
      styles.push('cursor:pointer');
    }
    return htmlSafe(styles.join(';'));
  }),

  _needsURLUpdate() {
    return this.get('user.slug') !== this.get('userParam');
  },

  spoofUser(uid) {
    //alert('spoofing1');
    let _self = this;
    
    return _self.get('session').authenticate('authenticator:spoof', uid);
  },

  actions: {
    afterEditModalClose() {
      this.set('edit', null);
      this.set('editTab', null);

      if (this._needsURLUpdate()) {
        let userSlug = this.get('user.slug');
        let newURL = this.get('router.currentURL').replace(this.get('userParam'), userSlug);
        this.set('userParam', userSlug);
        this.get('router').replaceWith(newURL);
      }
    },

    openEditModal(tab) {
      if (this.get('canEditUser')) {
        this.set('edit', true);
        if (tab) { this.set('editTab', tab); }
      }
    },
    
    // Logs the current user in as the selected user
    doSpoofUser() {
      this.spoofUser(this.get('user.id'));
    }
    
  }
});
