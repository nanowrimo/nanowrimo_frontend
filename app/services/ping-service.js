import Service from '@ember/service';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Service.extend({
  session: service(),
  currentUser: service(),
  lastCheck: null,

  init() {
    this._super(...arguments);
  },
  
  load() {
    if (this.get('session.isAuthenticated')) {
      debounce(this, this.checkForUpdates, 3000, false);
    }
  },
  
  checkForUpdates() {
    debounce(this, this.checkForUpdates, 10000, false);
  },
  
});
