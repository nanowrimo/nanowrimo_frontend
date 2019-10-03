import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery(query) {
    if (query.available) {
      delete query.available;
      return `${this._super(...arguments)}/available`;
    }

    return this._super(...arguments);
  }
});
