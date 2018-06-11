import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  event_type: DS.attr('string'),
  unit_type: DS.attr('string'),
  startsOn: DS.attr('date'),
  defaultGoal: DS.attr('number'),
  projects: DS.hasMany('project'),
  primaryChallengeProjects: DS.hasMany('project', { inverse: 'primaryChallenge' }),
  flexibleGoal: DS.attr('boolean')
});
