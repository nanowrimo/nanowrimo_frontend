import ApplicationAdapter from './application';
import { get } from '@ember/object';

export default ApplicationAdapter.extend({
  urlForFindRecord(id, modelName, snapshot) {
    // is there a need to have the API recompute the project-challenge?
    let doRecompute = get(snapshot, 'adapterOptions.query.recompute');
    if (doRecompute) {
       return this._super(...arguments)+"?recompute=true";
    }
    return this._super(...arguments);
  }
});
