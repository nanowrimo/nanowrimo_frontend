import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  eventType:0,
  defaultGoal: 50000,
  flexibleGoal: false,
  startsAt: "2016-11-01T00:00:00.000",
  endsAt: "2016-12-01T00:00:00.000"
});
