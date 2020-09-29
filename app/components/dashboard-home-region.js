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
  
  init(){
    this._super(...arguments);
    setTimeout(() => { this.getEvents() }, 1000);
  },
  
  getEvents() {
    let region = this.get('currentUser.user.homeRegion');
    let t = this;
    if (region) {
      this.get('store').query('group', { filter: {group_id: region.id, group_type: "event", event_type: "upcoming"}}).then(() => {
        t.set('eventsLoaded',true);
      });
    }
  },
  
  homeRegion: computed('currentUser.user.homeRegion', function() {
    let region = this.get('currentUser.user.homeRegion');
    if (region) {
      return region;
    } else {
      return null;
    }
  }),
  
  allEvents: computed('eventsLoaded',function() {
    let el = this.get('eventsLoaded');
    if (el) {
      let store = this.get('store');
      let gs = store.peekAll('group');
      return gs;
    } else {
      return [];
    }
  }),
  
  // Returns an array of future approved events
  activeEvents: computed('allEvents.{[],@each.approvedById}', function() {
    let region = this.get('currentUser.user.homeRegion');
    let gs = this.get('allEvents');
    let gid = region.id;
    let ae = [];
    let now = moment();
    gs.forEach(function(g) {
      if ((g.groupId==gid) && (g.endDt>now) && (g.approvedById>0)) {
        ae.push(g);
      }
    });
    return ae;
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