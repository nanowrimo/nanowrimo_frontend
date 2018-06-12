import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

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
