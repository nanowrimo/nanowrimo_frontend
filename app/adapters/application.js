import JSONAPIAdapter from 'ember-data/adapters/json-api';
import ENV from 'nanowrimo/config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
/*
export default JSONAPIAdapter.extend({
  session: service(),

  host: ENV.APP.API_HOST,

  headers: computed('session.data.authenticated.auth_token', function() {
    let { auth_token } = this.get('session.data.authenticated');
    return auth_token ? { 'Authorization': auth_token } : {};
  })
});
*/
export default class ApplicationAdapter extends JSONAPIAdapter {
  // Application specific overrides go here

  @service session;
  host= ENV.APP.API_HOST;

  get headers() {
    let { auth_token } = this.session.data.authenticated;
    return auth_token ? { 'Authorization': auth_token } : {};
  }
}
