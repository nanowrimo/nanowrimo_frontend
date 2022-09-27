import Controller from '@ember/controller';
import { computed, observer }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe }  from '@ember/string';

export default Controller.extend({
  store: service(),
  currentUser: service(),
  router: service(),
  group: alias('model'),
  dataLoaded: false,
  user: null,
  
  init(){
    this._super(...arguments);
    this.set("user", this.get('currentUser.user'));
  },
  
  // watch the current user, are their writingGroupsLoaded?
  observeUserWritingGroups: observer('currentUser.isLoaded', function(){
    let user = this.get('currentUser.user');
    if (!user.writingGroupsLoaded) {
      user.loadWritingGroups();
    }
  }),
  
  // Returns true if the user can view the group
  canViewGroup: computed('currentUser.user.writingGroupsLoaded','group.id',function() {
    let found = false;
    if (this.get('currentUser.isLoaded')) {
      if (this.get('currentUser.user.adminLevel')) {
        found = true;
      } else {
        let uid = this.get('currentUser.user.id');
        let gid = this.get('group.id');
        let gus = this.get('store').peekAll('group-user');
        gus.forEach((gu)=>{
          // if there is an accepted groupUser for currentUser.user and group
          if ((gu.user_id==uid)&&(gu.group_id==gid)&&(gu.invitationAccepted==1)) {
            found = true;
          }
        });
      }
    }
    return found;
  }),
  // Returns true if the user can edit the group
  canEditGroup: computed('currentUser.isLoaded',function() {
    let found = false;
    if (this.get('currentUser.isLoaded')) {
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
