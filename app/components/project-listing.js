import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  router: service(),
  
  queryParams: ['editCover', 'editCoverTab'],
  
  editProject: false,
  editCover: null,
  editCoverTab: null,
  showConfirmDelete: false,
  deleteConfirmationTitleText: null,
  deleteConfirmationYesText:null,
  deleteConfirmationNoText:null,
  deleteConfirmationBodyText: null,
  
  canEdit: computed('project', function(){
    return this.get('currentUser.user') === this.get('author');
  }),

  init(){
    this._super(...arguments);
    this.set('confirmationDeleteTitleText', "Confirm Delete");
    this.set('deleteConfirmationBodyText', "Deleting your project will also delete all associated goals and writing progress. Are you sure you want to wield that white-out?");
    this.set('deleteConfirmationYesText','Yes, delete my project and its goals'); 
    this.set('deleteConfirmationNoText','No, nevermind.'); 
  },
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
    
    editProject() {
      this.set('editProject', true);
    },
    
    updateCover() {
      this.set('editCover', true);
      this.set('editCoverTab', null);
    },
   
    confirmDelete() {
      this.set('showConfirmDelete', true);
    },
    
    deleteConfirmationYes() {
      //hide the dialog
      this.set('showConfirmDelete', false);
      //delete!
      this.get('project').destroyRecord();
    },
    
    deleteConfirmationNo() {
       this.set('showConfirmDelete', false);
    },
    
    viewGoals() {
      this.get('router').transitionTo('authenticated.users.show.projects.show.goals', this.get('currentUser.user.slug'), this.get('project.slug') );
    }
  }
  
});
