import DS from 'ember-data';

export default DS.Model.extend({
  token: DS.attr('string', { defaultValue: '' }),
  password: DS.attr('string', { defaultValue: '' })
});
