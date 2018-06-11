import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  password: attr('string', { defaultValue: '' }),
  token: attr('string', { defaultValue: '' })
});
