import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import Challenge from 'nanowrimo/models/challenge';

export default Component.extend({
  store: service(),

  tagName: '',

  challenge: null,

  optionsForEventType: computed(function() {
    return Challenge.optionsForEventType;
  }),
  optionsForUnitType: computed(function() {
    return Challenge.optionsForUnitType;
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
