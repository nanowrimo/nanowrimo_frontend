import DS from 'ember-data';

const {
  Model,
  attr
} = DS;

export default Model.extend({
  password: attr('string', { defaultValue: '' }),
  token: attr('string', { defaultValue: '' })
});
