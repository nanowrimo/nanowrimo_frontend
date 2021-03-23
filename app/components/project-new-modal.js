import Component from '@ember/component';
import { assert } from '@ember/debug';
import { sort } from '@ember/object/computed';
import { computed, observer }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Project from 'nanowrimo/models/project';
import Changeset from 'ember-changeset';

export default Component.extend({
  store: service(),
  currentUser: service(),

  tagName: 'span',
  getChallengeOptions: false,
  associatedChallenge: null,
  associatedChallengeId: 0,
  associateWithChallenge: false,
  defaultAssociationTested: false,
  challenge: null,
  projectChallenge: null,
  tab: null,
  open: null,
  project: null,
  user: null,
  formStepOverride: 0,
  projectChallengeChangeset: null,
  validChallengeDates: true,
  
  challengeSortingDesc: Object.freeze(['startsAt:desc']),
  
  // Gets all challenges from the store
  unassignedOptionsForChallenges:  computed('getChallengeOptions', function() {
    return this.get('store').query('challenge',{ available: true});
  }),
 
  optionsForChallenges: sort('unassignedOptionsForChallenges','challengeSortingDesc'),
  
  // auto associate with the latest challenge if the latest challenge hasn't ended
  challengeCheck: observer('optionsForChallenges.[]',function() {
    let challenges = this.get('optionsForChallenges');
    if (challenges.length > 0) {
      let latest = challenges[0];
      //let d = new Date();
      //if (latest.endsAt > d) {
      let now = moment();
      if (latest.endsAt >= now.format("YYYY-MM-DD")) {

        this.set('associateWithChallenge',false);
        this.send('clickedAssociateCheckbox');
        
      } else {

        this.set('associateWithChallenge',false);
        this.set('Challenge',null);
      }
    }
  }),
  
  hideClass: computed('associateWithChallenge',function() {
    let s = this.get('associateWithChallenge');
    if (s) {
      return '';
    }
    return 'nano-hide';
  }),
  
  filteredOptionsForGenres: computed("optionsForGenres.[]", function(){
    let userId = this.get('currentUser.user.id');
    return this.get('optionsForGenres').reject((option)=>{
      return (option.userId!=0 && option.userId!=userId);
    });
  }),
  
  optionsForGenres: computed(function() {
    return this.get('store').findAll('genre');
  }),
  optionsForPrivacy: computed(function() {
    return Project.optionsForPrivacy;
  }),
  optionsForStatus: computed(function() {
    return Project.optionsForStatus;
  }),
  optionsForWritingType: computed(function() {
    return Project.optionsForWritingType;
  }),
  invalidChallengeDates: computed('validChallengeDates', function(){
    return !this.get('validChallengeDates');
  }),

  steps: computed(function() {
    return [
      ['title', 'status', 'privacy', 'writingType'],
      ['name','writingType', 'defaultGoal', 'unitType', 'startsAt', 'endsAt'],
      ['wordCount', 'summary', 'excerpt', 'pinterest', 'playlist']
    ]
  }),
  init() {
    this._super(...arguments);
    let user = this.get('user');
    assert('Must pass a user into {{project-new-modal}}', user);
  },
  
  didReceiveAttrs(){
    if (this.get('open')){
      //create a new project
      let newProject = this.get('store').createRecord('project');
      this.set('project', newProject);
      //by default, we want this new project to be 'primary'
      newProject.set('primary', true);
      newProject.set('wordCount', 0);
      //create the newProjectChallenge for the newProject
      let newProjectChallenge = this.get('store').createRecord('projectChallenge');
      //push the projectChallenge onto the project
      newProject.projectChallenges.pushObject(newProjectChallenge);
    
      this.set('projectChallenge', newProjectChallenge);
      this.set('projectChallengeChangeset', new Changeset(newProjectChallenge) );
    }
  },
  formCurrentStep: computed("formStepOverride", function(){ 
    return this.get('formStepOverride')+1;
  }),
  
  formProgressText: computed("formStepOverride", function(){
    let step = this.get("formStepOverride");
    let texts = ["Step 1: Overview", "Step 2: Goal", "Step 3: Details"];
    return texts[step];
  }),
  progressStepText: computed("formStepOverride", function(){
    let step = this.get("formStepOverride");
    let texts = ["Step 1 of 3: Project Overview", 
      "Step 2 of 3: Project Goal", "Step 3 of 3: Project Details"];
    return texts[step];
  }),
  
  actions: {
    associateChallengeSelect(challengeID) {
      this.set('associatedChallengeId', challengeID);
      this.set('associatedChallenge', this.get('optionsForChallenges').findBy("id", challengeID));
      if (this.get("associateWithChallenge") ) {
        this.set('challenge', this.get("associatedChallenge"));
      }
    },
    clickedAssociateCheckbox() {
      this.toggleProperty("associateWithChallenge");
      if (this.get('associateWithChallenge')) {
        //get the challenge
        if (this.get("associatedChallenge") === null) {
          //set the challenge id to the id of the first object in options for Challenges
          this.set('associatedChallenge', this.get('optionsForChallenges.firstObject'));
        }
        this.set('challenge', this.get("associatedChallenge"));
      } else {
        this.set('challenge', null);
        this.set('projectChallengeChangeset.challenge',null);
      }
    },
    setStep(stepNum) {
      this.set("formStepOverride", stepNum);
    },
    onShow() {
      this.toggleProperty('getChallengeOptions');
      //show the form (this should init the form-for)
      this.set('showForm', true);
      //assign the user to the project
      this.get('user').projects.pushObject(this.get('project'))
      
    },
    onHidden() {
      let callback = this.get('onHidden');
      this.set('formStepOverride',0);
      this.set('showForm', false);
      this.set('challenge', null);
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    },
    afterSubmit() {
      //hide the modal
      this.set('open', null);
      let as = this.get('afterSubmit');
      if (as) { as() }
      
      //refresh the user stats
      this.get('user').refreshStats();
    }
  }
});
