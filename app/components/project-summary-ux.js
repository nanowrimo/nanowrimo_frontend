import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  router: service(),
  progressUpdaterService: service(),
  
  queryParams: ['editCover', 'editCoverTab'],
  addGoal: false,
  
  editProject: false,
  editCover: null,
  editCoverTab: null,
  showConfirmDelete: false,
  deleteConfirmationTitleText: null,
  deleteConfirmationYesText:null,
  deleteConfirmationNoText:null,
  deleteConfirmationQuestion: null,
  deleteConfirmationQuestionAddendum: null,
  
  canEdit: computed('project.computedAuthor', function(){
    return this.get('currentUser.user') === this.get('project.computedAuthor');
  }),
  
  canAddProjectChallenge: computed('project.computedAuthor','currentUser.user', function(){
    //get the project and the user
    let a = this.get('project.computedAuthor');
    let u = this.get('currentUser.user');
    return (a == u);
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
    },
    
    newProjectChallenge(){
      this.set('addGoal', true);
    },
    
    toggleProgressUpdater() {
      let pus = this.get('progressUpdaterService');
      let p = this.get('project');
      pus.toggleSessionForm(p.id);
    },
    
    
  }
  
});
