import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  email: DS.attr('string'),
  password: DS.attr('string'),
  username: DS.attr('string'),
  timeZone: DS.attr('string', {
    defaultValue() { return moment.tz.guess(); }
  })
});
