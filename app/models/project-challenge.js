import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  challenge: belongsTo('challenge'),
  project: belongsTo('project')
});
