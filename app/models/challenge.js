import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

const Challenge = Model.extend({
  defaultGoal: attr('number'),
  endsOn: attr('date'),
  eventType: attr('string'),
  flexibleGoal: attr('boolean'),
  name: attr('string'),
  startsOn: attr('date'),
  unitType: attr('string'),

  //primaryChallengeProjects: hasMany('project', { inverse: 'primaryChallenge' }),
  projects: hasMany('project')
});

Challenge.reopenClass({
  optionsForEventType: [
    'Writing',
    'Editing'
  ],
  optionsForUnitType: [
    'words',
    'hours'
  ]
});

export default Challenge;
