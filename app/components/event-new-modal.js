import Component from '@ember/component';
//import { assert } from '@ember/debug';
import { filterBy, sort } from '@ember/object/computed';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Group from 'nanowrimo/models/group';
import Changeset from 'ember-changeset';
import moment from 'moment';
import { run } from "@ember/runloop"
import $ from 'jquery';

export default Component.extend({
  store: service(),

  tagName: 'span',

  tab: null,
  open: null,
  group: null,
  user: null,
  startDate: null,
  startTime: null,
  durationHours: 1,
  durationMinutes: null,
  formStepOverride: 0,
  recalculateEvents: 0,
  
  baseChallenges:  computed(function() {
    return this.get('store').findAll('challenge');
  }),
  optionsForHours: computed(function() {
    return Group.optionsForHours;
  }),
  optionsForMinutes: computed(function() {
    return Group.optionsForMinutes;
  }),
  steps: computed(function() {
    return [
      ['name', 'date', 'time'],
      []
    ]
  }),
  init() {
    this._super(...arguments);
    //let user = this.get('user');
    //assert('Must pass a user into {{event-new-modal}}', user);
    let now = moment();
    let newGroup = this.get('store').createRecord('group');
    newGroup.set('startDt',now);
    this.set('startDate', now.format("YYYY-MM-DD"));
    this.set('startTime', "19:00");
    this.set('durationHours', "1");
    this.set('group', newGroup);
    this.setProperties({ googleAuto: null });
  },

  actions: {
    placeChangedSecondInput(place){
      this.set('placeJSONSecondInput', JSON.stringify(place, undefined, 2));
    },
    setStep(stepNum) {
      this.set("formStepOverride", stepNum);
    },
    onShow() {
      //assign the user to the project
      this.set('group.user', this.get('user'));
      
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
