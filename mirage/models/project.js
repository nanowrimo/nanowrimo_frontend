import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  genres: hasMany('project-genre'),
  challenges: hasMany('project-challenge'),
  user: belongsTo('user'),
  projectSessions: hasMany('project-session')
});
