import DS from 'ember-data';
import moment from 'moment';

const {
  Model,
  attr
} = DS;

export default Model.extend({
  email: attr('string', { defaultValue: '' }),
  password: attr('string', { defaultValue: '' }),
  terms: attr('boolean',{ defaultValue: false } ),
  thirteen: attr('boolean',{ defaultValue: false } ),
  timeZone: attr('string', {
    defaultValue() { return moment.tz.guess(); }
  }),
  username: attr('string', { defaultValue: '' })
});
