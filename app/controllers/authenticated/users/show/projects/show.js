import Controller from '@ember/controller';

import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  router: service(),
  project: alias('model'),
  displayEditModal: false,
  displayCoverEditModal: false,
  author: null,
  projectSlug: null,

  canEdit: computed('author','currentUser.user', function(){
    let a = this.get('author');
    let cu = this.get('currentUser.user');
    return a==cu;
  }),

  init(){
    this._super(...arguments);
  },

  actions: {
    editProject() {
      if(this.get('canEdit')){
        this.set('displayEditModal', true);
      }
    },
    afterCoverModalClose() {
      this.set('displayCoverEditModal', false);
    },
    afterEditProjectModalClose(){
      this.set('displayEditModal', false);
      if (this._needsURLUpdate()) {
        let projectSlug = this.get('project.slug');
        let newURL = this.get('router.currentURL').replace(this.get('projectSlug'), projectSlug);
        this.set('projectSlug', projectSlug);
        this.get('router').replaceWith(newURL);
      }
    },
    editCover() {
      if(this.get('canEdit')){
        this.set('displayCoverEditModal', true);
      }
    }
  },

   _needsURLUpdate() {
    return this.get('project.slug') !== this.get('projectSlug');
  },
});
