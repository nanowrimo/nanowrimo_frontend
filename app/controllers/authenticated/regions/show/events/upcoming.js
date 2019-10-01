import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias, sort }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Controller.extend({
  store: service(),
  groups: alias('model'),
  group: null,
  
  eventSortingDesc: Object.freeze(['startDt:asc']),
  
  allEvents: computed('groups.[]',function() {
    let store = this.get('store');
    let gs = store.peekAll('group');
    return gs;
  }),
  
  // Returns an array of future approved events
  activeEvents: computed('allEvents.{[],@each.approvedById}', function() {
    let gs = this.get('allEvents');
    let gid = this.get('group.id');
    let ae = [];
    let now = moment();
    gs.forEach(function(g) {
      if ((g.groupId==gid) && (g.endDt>now) && (g.approvedById>0)) {
        ae.push(g);
      }
    });
    return ae;
  }),
  
  sortedActiveEvents: sort('activeEvents','eventSortingDesc'),
  
});
