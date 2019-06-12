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
  deleteConfirmationQuestion: null,
  deleteConfirmationQuestionAddendum: null,
  
  canEdit: computed('project', function(){
    return this.get('currentUser.user') === this.get('author');
  }),

  init(){
    this._super(...arguments);
    this.set('deleteConfirmationTitleText', "Confirm Delete");
    let title = this.get('project.title');
    this.set('deleteConfirmationQuestion', `Delete "${title}"?`);
    this.set('deleteConfirmationQuestionAddendum', "Deleting your project will also delete all associated goals and writing progress.");
    this.set('deleteConfirmationYesText','Delete'); 
    this.set('deleteConfirmationNoText','Cancel'); 
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
