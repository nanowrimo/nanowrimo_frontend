import Component from '@ember/component';
//import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  notificationsService: service(),
  allNotifications: null,
  newNotificationsCount: null,
  classNames: ['nw-noti-modal-container'],
  closeFormAction: null,
  
  open: false,
  actions: {
    onShow() {
      this.set('open',true);
    },
    onHidden() {
      this.set('open',false);
    },
    cancel(){
      let cfa = this.get('closeFormAction');
      cfa();
    },
  }
});
