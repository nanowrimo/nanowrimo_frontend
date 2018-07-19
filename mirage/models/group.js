import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  groupUsers: hasMany('group-user')
  //locations: hasMany('location-group')
});
