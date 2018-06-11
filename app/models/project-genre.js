import DS from 'ember-data';

const {
  Model,
  belongsTo
} = DS;

export default Model.extend({
  genre: belongsTo('genre'),
  project: belongsTo('project')
});
