import Component from '@ember/component';
import {  computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort }  from '@ember/object/computed';
import moment from 'moment';

export default Component.extend({
  
  currentUser: service(),
  store: service(),
  eventsLoaded: false,
  eventSortingDesc: Object.freeze(['startDt:asc']),
  hqEvents: null,
  group: null,
  init(){
    this._super(...arguments);
    // set the hqEvents to an array
    this.set('hqEvents', []);
    let store = this.get("store");
    // load the hq events
    store.query('group', { filter: {group_name: "nanowrimo hq", group_type: "event", event_type: "upcoming"}}).then((resp) => {
      this.set('hqEvents', resp);
      this.set("eventsLoaded", true);
    });
  },
  
  // Returns an array of future approved events
  activeEvents: computed('hqEvents.{[],@each.approvedById}', function() {
    let hqEvents = this.get('hqEvents');
    let activeEvents = [];
    let now = moment();
    hqEvents.forEach(function(event) {
      if ((event.endDt>now) && (event.approvedById>0)) {
        activeEvents.push(event);
      }
    });
    return activeEvents;
  }),
  
  // Sorts the events by date, with the most immediate first
  sortedActiveEvents: sort('activeEvents','eventSortingDesc'),
  
  // Returns the four most immediate upcoming events
  topFourEvents: computed('sortedActiveEvents', function() {
    let saes = this.get('sortedActiveEvents');
    let a = [];
    let count = 0;
    saes.forEach(function(sae) {
      if (count<4) {
        a.push(sae);
      }
      count++;
    });
    return a;
  }),
  
  // Returns true if there are future events, false if not
  hasEvents: computed('topFourEvents', function() {
    let t4e = this.get('topFourEvents');
    return (t4e.length>0);
  }),
  
});
