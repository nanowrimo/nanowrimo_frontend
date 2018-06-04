import ActiveStorage from 'ember-active-storage/services/active-storage';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default ActiveStorage.extend({
  session: service(),

  headers: computed('session.data.authenticated.auth_token', function() {
    let { auth_token } = this.get('session.data.authenticated');
    return auth_token ? { 'Authorization': auth_token } : {};
  })
});
