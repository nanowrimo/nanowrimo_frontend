import ApplicationAdapter from './application';
import fetch from 'fetch';

export default ApplicationAdapter.extend({
  queryRecord(store, type, query) {
    this._super(...arguments);
    if (query.current) {
      return fetch(`${this.urlPrefix()}/users/current`).then(response =>  response.json());
    }
  }
});
