import Service from '@ember/service';
import { computed }  from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Service.extend({
  currentUser: service(),
  store: service(),
  recomputeNotifications: 0,

  load() {
    debounce(this, this.checkForUpdates, 5000, false);
    return this.get('store').query('notification',{});
  },
  
  checkForUpdates() {
    let t = this;
    let u = this.get('currentUser.user');
    this.store.findAll('notification').then(function() {
      t.incrementRecomputeNotifications();
    });
    debounce(this, this.checkForUpdates, 15000, false);
  },
  
  incrementRecomputeNotifications() {
    let rb  = this.get('recomputeNotifications')+1;
    this.set('recomputeNotifications',rb);
  },
  
  newNotificationsCount: computed('recomputeNotifications', function() {
    var l = this.store.peekAll('notification').get('length');
    return l;
  }),
  
});
