import NwPanel from 'nanowrimo/components/nw-panel';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default NwPanel.extend({
  currentUser: service(),
  router: service(),
  searchService: service(),
  
  queryParams: ['q'],
  q: Ember.computed.alias('searchService.q'),
  currentPanel: 'writers',

  actions: {
  }
});
