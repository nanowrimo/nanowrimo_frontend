import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    alert(query);
    if (query.slug) {
      let slug = query.slug;
      delete query.slug;
      return `${this._super(...arguments)}/${slug}`;
    }
    return this._super(...arguments);
  }
});
