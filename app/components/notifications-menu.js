import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  notificationsService: service(),
  media: service(),
  
  showBadgeSplash: false,
  badgeForSplash: null,
  
  allNotifications: computed('notificationsService.recomputeNotifications', function() {
    return this.get('store').findAll('notification');
  }),
  newNotificationsCount: computed('notificationsService.newNotificationsCount', function() {
    var c = this.get('notificationsService.newNotificationsCount');
    return c;
  }),
  
  actions: {
    notificationClicked(notification){
      if(notification.actionType=='badge') {
        //get the badge
        let id = notification.actionId;
        let badge = this.get('store').peekRecord('badge', id);
        console.log(badge);
        this.set("badgeForSplash", badge);
        //display the splash
        this.set('showBadgeSplash', true);
      }
    },
    hideBadgeSplash(){
      this.set('showBadgeSplash', false);
    }
  }
});
