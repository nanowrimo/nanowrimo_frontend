import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    if (query.slug) {
      let slug = query.slug;
      delete query.slug;
      return `${this._super(...arguments)}/${slug}`;
    }
    if(query.homeRegion) {
      let endpoint = this._super(...arguments);
      endpoint = endpoint.replace("groups", "users/current/home-region");
      return endpoint;
    }
    return this._super(...arguments);
  }
});
