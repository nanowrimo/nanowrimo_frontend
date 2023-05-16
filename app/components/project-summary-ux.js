import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),
  router: service(),
  progressUpdaterService: service(),
  badgesService: service(),
  
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
  showChart: false,
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
    this.set('showChart', true);
  },
  
  // observe the projectChallenge, when it changes, load its aggregates
  projectChallengeObserver: observer('project.currentProjectChallenge', function(){
    let pc = this.get('project.currentProjectChallenge');
    if (pc) {
      pc.loadAggregates();
      this._rerenderChart();
      // check badges
      ths.get('badgesService').checkForUpdates();
    }
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

  },
  
  //change the projectChallenge with a slight delay
  _rerenderChart: function() {
    this.set('showChart', false);
    //wait a bit and set the pc to the proper value
    next(()=>{
      this.set('showChart', true);
    });
  }
  
});
