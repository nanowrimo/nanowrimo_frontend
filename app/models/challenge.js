import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  type: DS.attr('string'),
  startsOn: DS.attr('date'),
  requiredGoal: DS.attr('number'),
  projects: DS.hasMany('project'),
  primaryChallengeProjects: DS.hasMany('project', { inverse: 'primaryChallenge' }),
  flexibleGoal: DS.attr('boolean')
});
