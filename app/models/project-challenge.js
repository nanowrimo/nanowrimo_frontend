import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  startCount: attr('number'),
  currentCount: attr('number'),
  targetCount: attr('number'),
  
  challenge: belongsTo('challenge'),
  project: belongsTo('project')
  
});
