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
  
  timeSince: computed('notification',function() {
    let n = this.get('notification');
    let t = moment(n.displayAt).fromNow();
    return t;
  }),
  renderButton: computed('notification',function() {
    return false;
  }),
  renderImage: computed('notification',function() {
    let url = this.get('notification.imageUrl');
    if (url) {
      return url;
    } else {
      return "/images/other/helmet_image.svg";
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
