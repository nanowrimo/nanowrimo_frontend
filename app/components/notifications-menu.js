import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import { sort }  from '@ember/object/computed';

export default Component.extend({
  store: service(),
  router: service(),
  notificationsService: service(),
  media: service(),
  currentUser: service(),
  
  showBadgeSplash: false,
  showWinnerSplash: false,
  badgeForSplash: null,
  displayNotifications: false,
  
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
  
  newNotificationsCount: computed('notificationsService.newNotificationsCount', function() {
    return this.get('notificationsService.newNotificationsCount');
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
  
  actions: {
    
    toggleNotifications() {
      const dn = this.get('displayNotifications');
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
      }
    },
    
    hideBadgeSplash(){
      this.set('showBadgeSplash', false);
    },
    hideWinnerSplash(){
      this.set('showWinnerSplash', false);
    }
  }
});
