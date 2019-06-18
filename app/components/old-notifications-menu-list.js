import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  notificationsService: service(),
  
  media: service(),
  allNotifications: computed('notificationsService.recomputeNotifications', function() {
    return this.get('store').findAll('notification');
  }),
  newNotificationsCount: computed('notificationsService.newNotificationsCount', function() {
    var c = this.get('notificationsService.newNotificationsCount');
    return c;
  }),
  
  actions: {
  }
});
