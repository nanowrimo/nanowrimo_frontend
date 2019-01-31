import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  notificationsService: service(),
  allNotifications: null,
  newNotificationsCount: null,
  
  actions: {
  }
});
