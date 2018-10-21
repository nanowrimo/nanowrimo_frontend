import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  editProject: false,
  
  queryParams: ['editCover', 'editCoverTab'],
  
  editCover: null,
  editCoverTab: null,
  
  canEdit: computed('project', function(){
    return this.get('currentUser.user') === this.get('author');
  }),
  
  actions: {
    doNothing() {
      //no really, do nothing 
    },
    
    afterCoverModalClose() {
      this.set('editCover', null);
      this.set('editCoverTab', null);
    },

    openCoverModal() {
      this.set('editCover', true);
      this.set('editCoverTab', null);
    },
    
    editOverview() {
      this.set('editProject', true);
    },
    editDetails() {
      this.set('editProject', true);
    },
    updateCover() {
      this.set('editCover', true);
      this.set('editCoverTab', null);
    },
  }
  
});
