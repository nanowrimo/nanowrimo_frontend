import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  type:'event',
  name: 'NaNoWriMo',
  requiredGoal: 50000,
  flexibleGoal: false,
  startsOn: "2016-11-01T00:00:00.000"
});
