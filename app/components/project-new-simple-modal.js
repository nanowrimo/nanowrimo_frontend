import Component from '@ember/component';
import { assert } from '@ember/debug';
import { sort } from '@ember/object/computed';
import { computed, observer }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),

  tagName: 'span',
  tab: null,
  open: null,
  project: null,
  challenge: null,
  challengeId: null,
  newProject: null,
  user: null,
  displayStartsAt: null,
  displayEndsAt: null,
  
  optionsForProjects: [{id: 1, title: 'Hello there'},{id: 2, title: 'Round Midnight'},{id: 3, title: 'Clams for a Pauper'}],
  challengeSortingDesc: Object.freeze(['startsAt:desc']),
  
  init() {
    this._super(...arguments);
    let user = this.get('user');
    assert('Must pass a user into {{project-new-modal}}', user);
  },
  
  headerText: computed("challenge", function(){
    let challenge = this.get("challenge");
    if (challenge) {
      switch (challenge.eventType) {
        case 0:
          return "Join the November Challenge";
        case 1:
          let d = moment(challenge.startsAt);
          let month = d.format('MMMM');
          return "Join the " + month +" Camp Challenge";
        default:
          return "Join the challenge";
      }
    } else {
      return "none";
    }
  }),
  
  isEvent: computed("challenge", function(){
    let challenge = this.get("challenge");
    if (challenge) {
      if ((challenge.eventType === 0)||(challenge.eventType === 1)) {
        return true;
      }
    }
    return false;
  }),
  
  isPersonal: computed("challenge", function(){
    let challenge = this.get("challenge");
    if (challenge) {
      if (challenge.eventType === null) {
        return true;
      }
    }
    return false;
  }),
  
  isFlexible: computed("challenge", function(){
    let challenge = this.get("challenge");
    if (challenge) {
      if (challenge.eventType != 0) {
        return true;
      }
    }
    return false;
  }),
  
  startLabel: computed('pastTense', function() {
    if (this.get('pastTense')) {
      return "What was your start date?"
    } else {
      return "What's your start date?"
    }
  }),
  
  durationLabel: computed('pastTense', function() {
    if (this.get('pastTense')) {
      return "When was the last day of writing?"
    } else {
      return "When is the last day of writing?"
    }
  }),
  
  actions: {
    durationChanged(val) {
      this.set('newDuration', val);
      this.recomputeEndsAt();
    },
    endsAtChanged(val) {
      //let m = moment.utc(val);
      //this.set('newEndsAt', m);
      //this.set('changeset.endsAt', m.toDate());
      this.set('newEndsAt', val);
      //this.set('changeset.endsAt', val);
      this.recomputeValidChallenge();

    },
    startsAtChanged(val) {
      //set the new StartsAt
      //let m = moment.utc(val);
      //this.set('newStartsAt', m);
      this.set('newStartsAt', val);
      //set the project-challenge starts at
      //this.set('changeset.startsAt', m.toDate());
      //this.set('changeset.startsAt', val);
      this.recomputeValidChallenge();
    },
    
    writingTypeChanged(val) {
      this.set('changeset.writingType', val);
      //this.set('projectChallenge.writingType', val);
    },
    
    unitTypeChanged(val) {
      this.set('projectChallenge.unitType', val);
    },
    
    goalChanged(val) {
      this.set('changeset.goal',val);
      this.recomputeValidChallenge();
    },
    
    goalNameChanged(val) {
      this.set('changeset.name',val);
      this.recomputeValidChallenge();
    },
    
    associateChallengeSelect(challengeID) {
      this.set('associatedChallengeId', challengeID);
      this.set('associatedChallenge', this.get('optionsForChallenges').findBy("id", challengeID));
      if (this.get("associateWithChallenge") ) {
        this.set('challenge', this.get("associatedChallenge"));
      }
    },
    setStep(stepNum) {
      this.set("formStepOverride", stepNum);
    },
    onShow() {
      //this.toggleProperty('getChallengeOptions');
      //show the form (this should init the form-for)
      //this.set('showForm', true);
      //assign the user to the project
      //this.get('user').projects.pushObject(this.get('project'))
      var t = document.getElementById("ember-bootstrap-wormhole");
      t.firstElementChild.setAttribute("aria-modal", "true");
      t.firstElementChild.setAttribute("aria-label", "Create a project");
    },
    onHidden() {
      alert('hiding');
      //let callback = this.get('onHidden');
      //this.set('showForm', false);
      this.set('challenge', null);
      this.set('open', null);
      //if (callback) {
        //callback();
        //} else {
        //this.set('open', null);
        //}
    },
    afterSubmit() {
      //hide the modal
      this.set('open', null);
      let as = this.get('afterSubmit');
      if (as) { as() }
      
      //refresh the user stats
      //this.get('user').refreshStats();
    },
    setValidChallenge(value) {
      this.set('validChallenge', value);
    }
  }
});
