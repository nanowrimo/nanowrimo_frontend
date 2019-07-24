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
  
  street1: null,
  street2: null,
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
        if (ac.types[0]=="street_number") {
          t.set("street1",ac.long_name);
        }
        if (ac.types[0]=="route") {
          t.set("street2",ac.long_name);
        }
        if (ac.types[0]=="neighborhood") {
          t.set("neighborhood",ac.long_name);
        }
        if (ac.types[0]=="sublocality") {
          t.set("municipality",ac.long_name);
        }
        if (ac.types[0]=="locality") {
          t.set("city",ac.long_name);
        }
        if (ac.types[0]=="administrative_area_level_2") {
          t.set("county",ac.long_name);
        }
        if (ac.types[0]=="administrative_area_level_1") {
          t.set("state",ac.long_name);
        }
        if (ac.types[0]=="postal_code") {
          t.set("postal_code",ac.long_name);
        }
        if (ac.types[0]=="country") {
          t.set("country",ac.long_name);
        }
      });
      t.set("formatted_address",p.formatted_address);
      t.set("longitude",p.geometry.location.lng());
      t.set("latitude",p.geometry.location.lat());
      t.set("utc_offset",p.utc_offset);
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
