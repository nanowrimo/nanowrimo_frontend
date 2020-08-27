import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    if (query.current) {
      delete query.current;
      return `${this._super(...arguments)}/current`;
    }
    if (query.name) {
      let name = query.name;
      delete query.name;
      return `${this._super(...arguments)}/${name}`;
    }
    return this._super(...arguments);
  }
});

