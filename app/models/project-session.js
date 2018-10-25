import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  count: attr('number'),
  start: attr('date'),
  end: attr('date'),
  where: attr('number'),
  how: attr('number'),
  feeling: attr('number'),
  createdAt: attr('date'),
  unitType: attr('number'),
  
  project: belongsTo('project'),
  projectChallenge: belongsTo('projectChallenge')

});
