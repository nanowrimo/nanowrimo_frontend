import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias, sort }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Controller.extend({
  store: service(),
  groups: alias('model'),
  group: null,
  
  eventSortingDesc: Object.freeze(['startDt:desc']),
  
  allEvents: computed('groups.[]',function() {
    let store = this.get('store');
    let gs = store.peekAll('group');
    return gs;
  }),
  
  // Returns an array of future approved events
  pastEvents: computed('allEvents.{[],@each.approvedById}', function() {
    let gs = this.get('allEvents');
    let gid = this.get('group.id');
    let pe = [];
    let now = moment();
    gs.forEach(function(g) {
      if ((g.groupId==gid) && (g.endDt<now) && (g.approvedById>0)) {
        pe.push(g);
      }
    });
    return pe;
  }),
  
  sortedPastEvents: sort('pastEvents','eventSortingDesc'),
  
});
