import NwPanel from 'nanowrimo/components/nw-panel';
//import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default NwPanel.extend({
  currentUser: service(),
  router: service(),
  searchService: service(),
  
  queryParams: ['q'],
  q: alias('searchService.q'),
  currentPanel: 'writers',

  actions: {
  }
});
