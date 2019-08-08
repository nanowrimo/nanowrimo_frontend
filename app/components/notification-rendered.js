import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';


export default Component.extend({
  currentUser: service(),
  store: service(),
  notificationsService: service(),
  notification: null,
  clickAction:null,
  isNew: computed('notificationsService.lastCheck',function() {
    let nva = this.get('notificationsService.lastCheck');
    let n = this.get('notification.displayAt');
    return (n>nva);
  }),
  
  // Displays the class "nw-noti-new" if this notification is new
  newNotiClass: computed('isNew',function() {
    let n = this.get('isNew');
    if (n) {
      return "nw-noti-new";
    } else {
      return '';
    }
  }),
  timeSince: computed('notification',function() {
    let n = this.get('notification');
    let t = moment(n.displayAt).fromNow();
    return t;
  }),
  renderButton: computed('notification',function() {
    return false;
  }),
  imageStyle: computed('notification', function() {
    let at = this.get('notification.actionType');
    if (at=='BUDDIES_PAGE') {
      return 'nw-avatar nw-avatar-medium';
    } else {
      return "";
    }
  }),
  renderImage: computed('notification',function() {
    let url = this.get('notification.imageUrl');
    let at = this.get('notification.actionType');
    let isNew = this.get('isNew');
    if (url) {
      if ((at=='BADGE_AWARDED')&&(isNew)) {
        return "/images/badges/riddler.svg";
      } else {
        return url;
      }
    } else {
      if (at=='BADGE_AWARDED') {
        return "/images/badges/riddler.svg";
      } else {
        return "/images/other/helmet_image.svg";
      }
    }
  }),
  
  
  actions: {
    clicked() {
      let ca = this.get('clickAction');
      if (ca) {
        let n = this.get('notification');
        ca(n);
      }
    }
  }
});
