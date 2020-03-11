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
  
  // Returns true is it's an event and the user hasn't created a project
  /*checkEventBox() {
    // Set a variable for whether the challenge exists
    let d = false;
    // Set a local variable for the store
    let store = this.get('store');
    // Set a local variable for all challenges in the store
    let cs = store.peekAll('challenge');
    // Set a local variable for the correct challenge
    let newc = null;
    // Loop through the challenges to find the latest event
    cs.forEach(function(c) {
      // If this is an event
      if ((c.eventType==0)||(c.eventType==1)) {
        // If the challenge is newer than ones already found
        if ((newc===null)||(newc.endsAt<c.endsAt)) {
          // Set the challenge variable to this challenge
          newc = c;
        }
      }
    });
    // If the challenge has been found...
    if (newc) {
      // Get the current user
      let cu = this.get('currentUser.user');
      if (cu) {
        if (cu.currentDateInDateRange(newc.prepStartsAt,newc.endsAt)) {
          if ((newc.eventType==0)||(newc.eventType==1)) {
            d = true;
            // Get all project_challenges
            let pcs = store.peekAll('project-challenge');
            // Loop through them
            pcs.forEach(function(pc) {
              // If this project challenge is for the latest event...
              if (newc.id==pc.challenge_id) {
                // Find the associated project
                let p = store.peekRecord('project',pc.project_id);
                // If the project is found
                if (p) {
                  // If the current user is the author
                  if (p.user_id==cu.id) {
                    d = false;
                  }
                }
              }
            });
          }
        }
      }
    }
    //alert(d);
    //this.set('associateWithChallenge',d);
    if (d) {
      this.set('associateWithChallenge',d);
      //get the challenge
      alert(this.get('optionsForChallenges.firstObject'));
      if (this.get("associatedChallenge") === null) {
        //set the challenge id to the id of the first object in options for Challenges
        this.set('associatedChallenge', this.get('optionsForChallenges.firstObject'));
      }
      this.set('challenge', this.get("associatedChallenge"));
    }
  },*/
  

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
