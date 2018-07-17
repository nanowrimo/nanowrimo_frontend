import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  region: belongsTo(),
  user: belongsTo()
});
