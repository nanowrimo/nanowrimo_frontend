import DS from 'ember-data';

const {
  Model,
  attr
} = DS;

export default Model.extend({
  donorNumber: attr('number'),
  goalNumber: attr('number'),
  raisedNumber: attr('number')
});
