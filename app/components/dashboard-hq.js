import Component from '@ember/component';
import {  computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort }  from '@ember/object/computed';
import moment from 'moment';

export default Component.extend({
  
  currentUser: service(),
  store: service(),
  //eventsLoaded: false,
  eventSortingDesc: Object.freeze(['startDt:asc']),
  group: null,
  init(){
    this._super(...arguments);
    //setTimeout(() => { this.loadEvents() }, 1000);
  },
  
  /*loadEvents() {
    let t = this;
    let s = this.get('store');
    let gs = s.peekAll('group');
    gs.forEach(function(g) {
      if (g.groupType=='everyone') {
        t.set('group',g);
      }
    });
    if (this.get('group')) {
      s.query('group', { filter: {group_id: this.get('group').id, group_type: "event", event_type: "upcoming"}}).then(() => {
        t.set('eventsLoaded',true);
      });
    }
  },*/
  
  eventsLoaded: computed('currentUser.isLoaded', function() {
    if (this.get('currentUser.isLoaded')) {
      let t = this;
      let s = this.get('store');
      let gs = s.peekAll('group');
      gs.forEach(function(g) {
        if (g.groupType=='everyone') {
          t.set('group',g);
        }
      });
      if (this.get('group')) {
        return s.query('group', { filter: {group_id: this.get('group').id, group_type: "event", event_type: "upcoming"}}).then(() => {
          return true;
        });
      } else {
        return false;
      }
    } else {
      return false;
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
    let nanogroup = this.get('group');
    let gs = this.get('allEvents');
    let gid = nanogroup.id;
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