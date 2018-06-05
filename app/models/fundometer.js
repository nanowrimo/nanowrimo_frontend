import DS from 'ember-data';

export default DS.Model.extend({
  goalNumber: DS.attr('number'),
  raisedNumber: DS.attr('number'),
  donorNumber: DS.attr('number')
});
