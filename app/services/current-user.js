import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve }  from 'rsvp';

export default Service.extend({
  session: service(),
  store: service(),

  user: null,

  load() {
    if (this.get('session.isAuthenticated')) {
      return this.get('store').queryRecord('user', { current: true }).then((user) => {
        this.set('user', user);
      });
    } else {
      return resolve();
    }
  }
});
