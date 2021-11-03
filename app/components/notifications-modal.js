import Component from '@ember/component';
//import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  notificationsService: service(),
  router: service(),
  
  allNotifications: null,
  newNotificationsCount: null,
  classNames: ['nw-noti-modal-container'],
  closeFormAction: null,
  
  open: false,
  actions: {
    onShow() {
      this.set('open',true);
      this.get('notificationsService').notificationsViewed();
      var t = document.getElementById("ember-bootstrap-wormhole");
      t.firstElementChild.setAttribute("aria-modal", "true");
      t.firstElementChild.setAttribute("aria-label", "Notifications");
    },
    onHidden() {
      this.set('open',false);
    },
    cancel(){
      let cfa = this.get('closeFormAction');
      cfa();
    },
    openPreferences() {
      let r = this.get('router');
      r.transitionTo('authenticated.settings.preferences');
      let cfa = this.get('closeFormAction');
      cfa();
    },
    openNotifications() {
      let r = this.get('router');
      r.transitionTo('authenticated.notifications');
      let cfa = this.get('closeFormAction');
      cfa();
    },
  }
});
