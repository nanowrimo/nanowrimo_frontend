import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Project from 'nanowrimo/models/project';

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

  optionsForChallenges: computed(function() {
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
      ['eventType', 'defaultGoal', 'unitType', 'startsOn', 'endsOn'],
      ['wordCount', 'summary', 'excerpt', 'pinterest', 'playlist']
    ]
  }),

  init() {
    this._super(...arguments);
    let user = this.get('user');
    assert('Must pass a user into {{project-new-modal}}', user);
    let newProject = this.get('store').createRecord('project', { user });
    this.set('project', newProject);
    this.set('checkRelationships', ['genres'] );
  },

  actions: {
    associateChallengeSelect(challengeID) {
      this.set('associatedChallenge', this.get('optionsForChallenges').findBy("id", challengeID));
      if (this.get("associateWithChallenge") ) {
        this.set('challenge', this.get("associatedChallenge"));
      }
    },
    clickedAssociateCheckbox(v) {
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
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    }
  }
});
