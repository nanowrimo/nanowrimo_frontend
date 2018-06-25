import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

import Challenge from 'nanowrimo/models/challenge';

export default Component.extend({
  store: service(),

  tagName: '',
  challenge: null,
  projectChallenge: null,
  changeset: null,
  project: null,
  saveAfterSave: null,
  
  optionsForWritingType: computed(function() {
    return Challenge.optionsForWritingType;
  }),
  optionsForUnitType: computed(function() {
    return Challenge.optionsForUnitType;
  }),
  
  disableWritingType: computed(function() {
    return this.get('challenge.eventType') === 0;
  }),
  disableDefaultGoal: computed(function() {
    return this.get('challenge.eventType') === 0;
  }),
  disableUnitType: computed(function() {
    return this.get('challenge.eventType') === 0;
  }),
  disableStartEnd: computed(function() {
    let et = this.get('challenge.eventType')
    return  (et === 0 || et === 1);
  }),
  

  steps: computed(function() {
    return [
      ['writingType', 'defaultGoal', 'unitType', 'startsat', 'endsat'],
    ]
  }),

  
  init() {
    this._super(...arguments);
    let projectChallenge = this.get('projectChallenge');
    let project = this.get('project');
    if (!projectChallenge) {
      projectChallenge = this.get('store').createRecord('projectChallenge');
      this.set('projectChallenge', projectChallenge);
      projectChallenge.set('project', project);
    }
    
    //check for the challenge
    let challenge = this.get('challenge');
    if (challenge) {
      let cs = this.get('changeset')
      //clone the challenge data into the project challenge changeset
      cs.set('goal', challenge.defaultGoal);
      cs.set('startsAt', challenge.startsAt);
      cs.set('endsAt', challenge.endsAt);
      cs.set('writingType', challenge.writingType);
      cs.set('unitType', challenge.unitType);
      cs.set('challenge', challenge);
    }
  }
});
