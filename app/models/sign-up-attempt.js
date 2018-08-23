import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import moment from 'moment';

export default Model.extend({
  email: attr('string', { defaultValue: '' }),
  password: attr('string', { defaultValue: '' }),
  timeZone: attr('string', {
    defaultValue() { return moment.tz.guess(); }
  }),
  username: attr('string', { defaultValue: '' })
});
