import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  email: DS.attr('string', { defaultValue: '' }),
  password: DS.attr('string', { defaultValue: '' }),
  username: DS.attr('string', { defaultValue: '' }),
  thirteen: DS.attr('boolean',{ defaultValue: false } ),
  terms: DS.attr('boolean',{ defaultValue: false } ),
  timeZone: DS.attr('string', {
    defaultValue() { return moment.tz.guess(); }
  })
});
