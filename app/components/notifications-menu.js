import Component from '@ember/component';
import { computed, observer }  from '@ember/object';
import { inject as service } from '@ember/service';
import { sort }  from '@ember/object/computed';
import moment from 'moment';

export default Component.extend({
  store: service(),
  router: service(),
  notificationsService: service(),
  pingService: service(),
  media: service(),
  currentUser: service(),
  initialWinnerDisplayed: false,
  showBadgeSplash: false,
  showWinnerSplash: false,
  badgeForSplash: null,
  displayNotifications: false,
  badgeExtraData: null,
  
  init(){
    this._super(...arguments);
    //access the 'currentUser.user.primaryProject.currentProjectChallenge.wonAt' for observing reasons
    let wonAt =this.get('currentUser.user.primaryProject.currentProjectChallenge.wonAt');
    this.set('oldWonAt', wonAt);
  },
  allNotifications: computed('notificationsService.recomputeNotifications', function() {
    let ns = this.get('store').peekAll('notification');
    let newns = [];
    ns.forEach(function(n) {
      if (n.displayStatus==1) {
        newns.push(n);
      }
    });
    return newns;
  }),
  notificationSortingDesc: Object.freeze(['displayAt:desc']),
  sortedNotifications: sort('allNotifications','notificationSortingDesc'),
  
  newNotificationsCount: computed('pingService.newNotifications', function() {
    return this.get('pingService.newNotifications');
  }),
  newNanomessagesCount: computed('notificationsService.newNanomessagesCount', function() {
    return this.get('notificationsService.newNanomessagesCount');
  }),
  displayStyle: computed('newNotificationsCount', function() {
    var c = this.get('newNotificationsCount');
    if (c==0) return "nw-hidden";
    else return "";
  }),
  nanomessagesDisplayStyle: computed('newNanomessagesCount', function() {
    var c = this.get('newNanomessagesCount');
    if (c==0) return "nw-hidden";
    else return "";
  }),
  
  observePotentialWin: observer('currentUser.user.primaryProject.currentProjectChallenge.{winnerBadge,wonAt}', function() {
    // get the winner badge
    let winnerBadge = this.get('currentUser.user.primaryProject.currentProjectChallenge.winnerBadge');
    let wonAt = this.get('currentUser.user.primaryProject.currentProjectChallenge.wonAt');
    //get the eventType 
    let eventType = this.get('currentUser.user.primaryProject.currentProjectChallenge.eventType');
    
    
    // is this nano or camp?
    if (eventType<2 && wonAt && winnerBadge) {
      // get the current time in the user's timezone
      let tz = this.get('currentUser.user.timeZone');
      // get the wonAt
      let wonMoment = moment(wonAt);
      
      let curTime = moment().tz(tz).local();
      // is the curTime < 2 minutes from the wonAt?
      
      let diff = curTime.diff(wonMoment,"seconds");
      if (diff <=120 && !this.get('initialWinnerDisplayed')) {
        this.set('initialWinnerDisplayed', true);
        this.set('badgeForSplash',winnerBadge);
        this.set('showWinnerSplash', true);
      }
    }
  }),
  actions: {
    
    linkToNanomessages() {
      this.get('router').transitionTo('authenticated.nanomessages');
    },
    toggleNotifications() {
      const dn = this.get('displayNotifications');
      if (dn==false) {
        this.get('notificationsService').checkForUpdates();
      }
      this.set('displayNotifications', !dn);
    },
    
    // Called when the notifications menu is opened
    notificationsViewed() {
      this.get('notificationsService').notificationsViewed();
    },
    
    notificationClicked(notification){
      let r = this.get('notificationsService').notificationClicked(notification);
      // If this is a new badge
      if (r.length>0) {
        this.set("badgeForSplash", r[0]);
        this.set(r[1], true);
        this.set('badgeExtraData', r[2]);
      }
      const dn = this.get('displayNotifications');
      this.set('displayNotifications', !dn);
    },
    
    hideBadgeSplash(){
      this.set('showBadgeSplash', false);
    },
    hideWinnerSplash(){
      this.set('showWinnerSplash', false);
    }
  }
});
