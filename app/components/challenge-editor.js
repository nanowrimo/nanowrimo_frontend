import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import Challenge from 'nanowrimo/models/challenge';
import ProjectChallenge from 'nanowrimo/models/project-challenge';

export default Component.extend({
  store: service(),

  tagName: '',

  challenge: null,
  projectChallenge: null,
  
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
      ['eventType', 'defaultGoal', 'unitType', 'startsOn', 'endsOn'],
    ]
  }),

  
  init() {
    this._super(...arguments);
    let challenge = this.get('challenge');
    if (!challenge) {
      challenge = this.get('store').createRecord('challenge');
      this.set('challenge', challenge);
    }
    this.set('changeset', new Changeset(challenge));
  }
});
