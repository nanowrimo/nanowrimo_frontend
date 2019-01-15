import Component from '@ember/component';
import { assert } from '@ember/debug';
import { filterBy, sort } from '@ember/object/computed';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Project from 'nanowrimo/models/project';
import Changeset from 'ember-changeset';

export default Component.extend({
  store: service(),

  tagName: '',

  associatedChallenge: null,
  associatedChallengeId: 0,
  challenge: null,
  projectChallenge: null,
  tab: null,
  open: null,
  project: null,
  user: null,
  formStepOverride: 0,
  projectChallengeChangeset: null,
  recalculateEvents: 0,
  validChallengeDates: true,
  
  challengeSortingDesc: Object.freeze(['startsAt:desc']),
  filteredOptionsForChallenges: filterBy('baseChallenges', "isNaNoEvent", true),
  unassignedOptionsForChallenges: computed('user.projects.[]','recalculateEvents',function() {
    let newArray = [];
    let acs = this.get('filteredOptionsForChallenges');
    let ucs = this.get('user.projects');
    acs.forEach(function(ac) {
      let found = false;
      ucs.forEach(function(uc) {
        let pcs = uc.challenges;
        pcs.forEach(function(pc) {
          if (ac.id == pc.id) {
            found = true;
          }
        });
      });
      if (!found) {
        newArray.push(ac);
      }
    });
    return newArray;
  }),
  optionsForChallenges: sort('unassignedOptionsForChallenges','challengeSortingDesc'),
  
  associateWithChallenge: computed(function() {
    let challenges = this.get('optionsForChallenges');
    if (challenges.length > 0) {
      let latest = challenges[0];
      let d = new Date();
      if (latest.endsAt > d) {
        return true;
      }
    }
    return false;
  }),
  
  hideClass: computed('associateWithChallenge',function() {
    let s = this.get('associateWithChallenge');
    if (s) {
      return '';
    }
    return 'nano-hide';
  }),
  
  baseChallenges:  computed(function() {
    return this.get('store').findAll('challenge');
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
    let newProject = this.get('store').createRecord('project');
    this.set('project', newProject);
    //by default, we want this new project to be 'primary'
    newProject.set('primary', true);
    //create the newProjectChallenge for the newProject
    let newProjectChallenge = this.get('store').createRecord('projectChallenge');
    //push the projectChallenge onto the project
    newProject.projectChallenges.pushObject(newProjectChallenge);
    
    this.set('projectChallenge', newProject);
    this.set('projectChallengeChangeset', new Changeset(newProjectChallenge) );
  },

  actions: {
    associateChallengeSelect(challengeID) {
      this.set('associatedChallengeId', challengeID);
      //console.log(this.get('associatedChallengeId'));
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
      //assign the user to the project
      this.set('project.user', this.get('user'));
      
    },
    onHidden() {
      let callback = this.get('onHidden');
      this.set('formStepOverride',0);
      let r = this.get('recalculateEvents')
      this.set('recalculateEvents', r+1);
      
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
    }
  }
});
