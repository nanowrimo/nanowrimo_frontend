import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  count: attr('number'),
  project_id: attr('number'),
  day: attr('string'),
  num_updates: attr('number'),
});
