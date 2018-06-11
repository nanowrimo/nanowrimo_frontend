import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  donorNumber: attr('number'),
  goalNumber: attr('number'),
  raisedNumber: attr('number')
});
