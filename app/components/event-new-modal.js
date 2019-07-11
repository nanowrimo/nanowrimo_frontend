import Component from '@ember/component';
//import { assert } from '@ember/debug';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import Group from 'nanowrimo/models/group';
import moment from 'moment';
import { later, next } from "@ember/runloop";

export default Component.extend({
  store: service(),
  changeset: null,
  
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
  
  city: null,
  
  baseLocations:  computed(function() {
    return this.get('store').findAll('location');
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

  _refreshPrettyResponse(blockProperty, placeDetails) {
    this.set(blockProperty, null);
    next(() => {
      this.set(blockProperty, JSON.stringify(placeDetails, undefined, 2));
    });
  },
  
  actions: {
    done() {
      let messageElement = document.getElementById('message');
      messageElement.classList.add('fade-in-element');
      later(() => messageElement.classList.remove('fade-in-element'), 2000);
      this.set('message', 'blur blur blur');
    },

    placeChanged(place) {
      this._refreshPrettyResponse('placeJSON', place);
      this.set('googleAuto', 'done');
      this.set('model.address', place.formatted_address);
    },

    placeChangedSecondInput(place) {
      let p = place;
      let t = this;
      p.address_components.forEach(function(ac) {
        console.log(ac.types[0]);
        if (ac.types[0]=="locality") {
          t.set("city",ac.long_name);
          console.log(ac.long_name);
        }
      });
      this._refreshPrettyResponse('placeJSONSecondInput', place);
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
