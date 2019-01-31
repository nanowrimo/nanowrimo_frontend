import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';


export default Component.extend({
  currentUser: service(),
  store: service(),
  notificationsService: service(),
  notification: null,
  timeSince: computed('notification',function() {
    let n = this.get('notification');
    let t = moment(n.displayAt).fromNow();
    return t;
  }),
});
