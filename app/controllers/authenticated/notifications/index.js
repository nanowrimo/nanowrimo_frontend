import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import { sort }  from '@ember/object/computed';

export default Controller.extend({
  store: service(),
  router: service(),
  notificationsService: service(),
  media: service(),
  currentUser: service(),
  
  showBadgeSplash: false,
  showWinnerSplash: false,
  badgeForSplash: null,
  
  allNotifications: computed('notificationsService.recomputeNotifications', function() {
    return this.get('store').peekAll('notification');
  }),
  
  notificationsLoaded: computed('allNotifications.[]',function() {
    let an = this.get('allNotifications');
    if (an.length>0) {
      return true;
    } else {
      return false;
    }
  }),
  
  notificationSortingDesc: Object.freeze(['displayAt:desc']),
  
  sortedNotifications: sort('allNotifications','notificationSortingDesc'),
  
  newNotificationsCount: computed('notificationsService.newNotificationsCount', function() {
    return this.get('notificationsService.newNotificationsCount');
  }),
  
  displayStyle: computed('newNotificationsCount', function() {
    var c = this.get('newNotificationsCount');
    if (c==0) return "nw-hidden";
    else return "";
  }),
  
  actions: {
    
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
