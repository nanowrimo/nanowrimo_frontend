import Service from '@ember/service';
import { computed }  from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import moment from "moment"

export default Service.extend({
  session: service(),
  currentUser: service(),
  store: service(),
  badgesService: service(),
  recomputeNotifications: 0,
  lastCheck: null,

  init() {
    this._super(...arguments);
    // Setting the router so transitionTo is available to service
    this.set('router', getOwner(this).lookup('router:main'));
  },
  
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
  
  notificationClicked(notification){
    // Set a variable to be returned
    let r = [];
    if(notification.actionType=='BADGE_AWARDED') {
      //get the badge
      let id = notification.actionId;
      // get some badge data from the store
      let badge = this.get('store').peekRecord('badge', id);
      r.push(badge);
      //this.set("badgeForSplash", badge);
      //is this a winner badge?
      if (badge.title =="Wrote 50,000 Words During NaNoWriMo" ){
        //NaNo Winner!
        r.push('showWinnerSplash');
        //this.set('showWinnerSplash', true);
      } else {
        //display the splash
        r.push('showBadgeSplash');
        //this.set('showBadgeSplash', true);
      }
    }
    if(notification.actionType=='BUDDIES_PAGE') {
      this.get('router').transitionTo('authenticated.users.show.buddies', this.get('currentUser.user.slug'));
    }
    if(notification.actionType=='NANOMESSAGES') {
      this.get('router').transitionTo('authenticated.nanomessages');
    }
    if(notification.actionType=='PROJECTS_PAGE') {
      this.get('router').transitionTo('authenticated.users.show.projects', this.get('currentUser.user.slug'));
    }
    if(notification.actionType=='EVENT_PAGE') {
      let url = notification.redirectUrl;
      window.location.replace(url);
    }
    return r;
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
