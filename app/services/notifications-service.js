import Service from '@ember/service';
import { computed }  from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import moment from "moment"

export default Service.extend({
  currentUser: service(),
  store: service(),
  recomputeNotifications: 0,
  lastCheck: null,

  load() {
    this.set('lastCheck',moment());
    debounce(this, this.checkForUpdates, 5000, false);
    return this.get('store').query('notification',{});
  },
  
  checkForUpdates() {
    let t = this;
    //let u = this.get('currentUser.user');
    this.store.findAll('notification').then(function() {
      t.incrementRecomputeNotifications();
    });
    //debounce(this, this.checkForUpdates, 15000, false);
  },
  
  incrementRecomputeNotifications() {
    let rb  = this.get('recomputeNotifications')+1;
    this.set('recomputeNotifications',rb);
  },
  
  newNotificationsCount: computed('recomputeNotifications', function() {
    var ns = this.store.peekAll('notification')
    var count = 0;
    var lc = this.get('lastCheck');
    ns.forEach(function(obj) {
      if (obj.displayAt>lc) {
        count += 1;
      }
    });
    return count;
  }),
  
});
