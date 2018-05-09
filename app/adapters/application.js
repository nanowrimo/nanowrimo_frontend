import DS from 'ember-data';
import AdapterFetchMixin from 'ember-fetch/mixins/adapter-fetch';
import ENV from 'nanowrimo/config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.JSONAPIAdapter.extend(AdapterFetchMixin, {
  session: service(),

  host: ENV.APP.API_HOST,

  headers: computed('session.data.authenticated.auth_token', function() {
    let { auth_token } = this.get('session.data.authenticated');
    return auth_token ? { 'Authorization': auth_token } : {};
  }),


});
