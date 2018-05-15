import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  type:'event',
  name: 'NaNoWriMo',
  requiredGoal: 50000,
  flexibleGoal: false
});
