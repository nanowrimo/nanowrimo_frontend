import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  genres: hasMany('project-genre'),
  challenges: hasMany('project-challenge')
});
