import DS from 'ember-data';
import AdapterFetchMixin from 'ember-fetch/mixins/adapter-fetch';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'nanowrimo/config/environment';

export default DS.JSONAPIAdapter.extend(AdapterFetchMixin, DataAdapterMixin, {
  authorizer: 'authorizer:nanowrimo',

  host: ENV.APP.API_HOST
});
