import Component from '@ember/component';
import { assert } from '@ember/debug';
import { filterBy } from '@ember/object/computed';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Project from 'nanowrimo/models/project';
import Changeset from 'ember-changeset';

export default Component.extend({
  store: service(),

  tagName: '',

  associateWithChallenge: false,
  associatedChallenge: null,
  challenge: null,
  projectChallenge: null,
  checkRelationships: null,
  tab: null,
  open: null,
  project: null,
  user: null,
  formStepOverride: 0,
  projectChallengeChangeset: null,

  optionsForChallenges: filterBy('baseChallenges', "isNaNoEvent", true),
  
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

  steps: computed(function() {
    return [
      ['title', 'status', 'privacy', 'writingType'],
      ['writingType', 'defaultGoal', 'unitType', 'startsAt', 'endsAt'],
      ['wordCount', 'summary', 'excerpt', 'pinterest', 'playlist']
    ]
  }),

  init() {
    this._super(...arguments);
    let user = this.get('user');
    assert('Must pass a user into {{project-new-modal}}', user);
    let newProject = this.get('store').createRecord('project', { user });
    this.set('project', newProject);
    //create the newProjectChallenge for the newProject
    let newProjectChallenge = this.get('store').createRecord('projectChallenge');
    //push the projectChallenge onto the project
    newProject.projectChallenges.pushObject(newProjectChallenge);
    
    this.set('projectChallenge', newProject);
    this.set('checkRelationships', ['genres'] );
    this.set('projectChallengeChangeset', new Changeset(newProjectChallenge) );
  },

  actions: {
    associateChallengeSelect(challengeID) {
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
    
    onHidden() {
      let callback = this.get('onHidden');
      this.set('formStepOverride',0);
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    }
  }
});
