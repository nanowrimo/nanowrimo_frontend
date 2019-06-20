import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  router: service(),
  notificationsService: service(),
  media: service(),
  currentUser: service(),
  
  showBadgeSplash: false,
  badgeForSplash: null,
  
  allNotifications: computed('notificationsService.recomputeNotifications', function() {
    return this.get('store').findAll('notification');
  }),
  newNotificationsCount: computed('notificationsService.newNotificationsCount', function() {
    var c = this.get('notificationsService.newNotificationsCount');
    return c;
  }),
  displayStyle: computed('newNotificationsCount', function() {
    var c = this.get('newNotificationsCount');
    if (c==0) return "nw-hidden";
    else return "";
  }),
  
  actions: {
    notificationClicked(notification){
      if(notification.actionType=='BADGE_AWARDED') {
        //get the badge
        let id = notification.actionId;
        let badge = this.get('store').peekRecord('badge', id);
        this.set("badgeForSplash", badge);
        //display the splash
        this.set('showBadgeSplash', true);
      }
      if(notification.actionType=='BUDDIES_PAGE') {
        this.get('router').transitionTo('authenticated.users.show.buddies', this.get('currentUser.user.slug'));
      }
      if(notification.actionType=='PROJECTS_PAGE') {
        this.get('router').transitionTo('authenticated.users.show.projects', this.get('currentUser.user.slug'));
      }
    },
    hideBadgeSplash(){
      this.set('showBadgeSplash', false);
    }
  }
});
