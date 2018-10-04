import Controller from '@ember/controller';

import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  project: alias('model'),
  displayEditModal: false,
  author: null,
  
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
        console.log('editproject');
        this.set('displayEditModal', true);
      }
    },

    afterEditProjectModalClose(){
      console.log('after edit project modal close');
      this.set('displayEditModal', false);
    }
  }

  /* TODO: remove canUpdateCount
  canUpdateCount: computed("currentUser.user.id", "project.user.id", function(){
    let cuid = this.get("currentUser.user.id");
    let puid = this.get("project.user.id");
    return cuid == puid;
  })
  */
});
