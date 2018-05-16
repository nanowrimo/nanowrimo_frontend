import DS from 'ember-data';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default DS.Model.extend({
  name: DS.attr('string'),
  type: DS.attr('string'),
  startsOn: DS.attr('date'),
  requiredGoal: DS.attr('number'),
  projects: DS.hasMany('project'),
  flexibleGoal: DS.attr('boolean')
});
