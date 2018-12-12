import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  identifier: attr('string', { defaultValue: '' }),
  password: attr('string', { defaultValue: '' })
});
