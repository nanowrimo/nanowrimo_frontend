import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindRecord(id, modelName, snapshot) {
    // is there a need to have the API recompute the project-challenge?
    let doRecompute = Ember.get(snapshot, 'adapterOptions.query.recompute');
    if (doRecompute) {
       return this._super(...arguments)+"?recompute=true";
    }
    return this._super(...arguments);
  }
});
