import DS from 'ember-data';
import AdapterFetchMixin from 'ember-fetch/mixins/adapter-fetch';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'nanowrimo/config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.JSONAPIAdapter.extend(AdapterFetchMixin, {
  //authorizer: 'authorizer:nanowrimo',
  session: service(),
  
  // the authorizer is failing to load - Why?
  // add the headers here as a computed property based on session.data
  
  headers: computed('session.data.[]', function() {
    let session = this.get('session');
    if (session.isAuthenticated ) {
      let data = session.get('data.authenticated');
      const authToken = data.auth_token;
     
      return  {
        'Authorization': authToken
      };
    }
  }),
  
  host: ENV.APP.API_HOST
   
});
