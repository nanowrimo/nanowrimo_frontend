import Service from '@ember/service';
import { computed }  from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import moment from "moment"

export default Service.extend({
  session: service(),
  currentUser: service(),
  store: service(),
  badgesService: service(),
  recomputeNotifications: 0,
  lastCheck: null,

  load() {
    if (this.get('session.isAuthenticated')) {
      debounce(this, this.checkForUpdates, 3000, false);
    }
  },
  
  checkForUpdates() {
    let t = this;
    let nva = this.get('currentUser.user.notificationsViewedAt');
    this.set('lastCheck',nva);
    this.store.findAll('notification').then(function() {
      t.incrementRecomputeNotifications();
    });
    debounce(this, this.checkForUpdates, 10000, false);
  },
  
  incrementRecomputeNotifications() {
    let rb  = this.get('recomputeNotifications')+1;
    this.set('recomputeNotifications',rb);
  },
  
  newNotificationsCount: computed('recomputeNotifications', function() {
    var ns = this.store.peekAll('notification')
    var count = 0;
    var new_badge = false;
    var lc = this.get('lastCheck');
    ns.forEach(function(obj) {
      if (obj.displayAt>lc) {
        count += 1;
        if (obj.actionType=="BADGE_AWARDED") {
          new_badge = true;
        }
      }
    });
    if (new_badge) {
      this.get('badgesService').checkForUpdates();
    }
    return count;
  }),
  
  notificationsViewed() {
    let u = this.get('currentUser.user');
    let nva = this.get('currentUser.user.notificationsViewedAt');
    let now = moment();
    //let dt = now.format("YYYY-MM-DD hh:mm:ss");
    this.set('lastCheck',nva);
    u.set('notificationsViewedAt',now.toDate());
    u.save().then(function() {
    });
  },
  
});
