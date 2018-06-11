import DS from 'ember-data';

const {
  Model,
  attr,
  hasMany
} = DS;

export default Model.extend({
  defaultGoal: attr('number'),
  eventType: attr('string'),
  flexibleGoal: attr('boolean'),
  name: attr('string'),
  startsOn: attr('date'),
  unitType: attr('string'),

  primaryChallengeProjects: hasMany('project', { inverse: 'primaryChallenge' }),
  projects: hasMany('project')
});
