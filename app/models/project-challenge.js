import DS from 'ember-data';

const {
  Model,
  belongsTo
} = DS;

export default Model.extend({
  challenge: belongsTo('challenge'),
  project: belongsTo('project')
});
