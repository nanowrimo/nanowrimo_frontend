import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  groupType: attr('string'),
  slug: attr('string'),
  longitude: attr('number'),
  latitude: attr('number'),
  numberOfUsers: attr('number'),
  description: attr('string'),
  
  // Members
  users: hasMany('user'),
  groupUsers: hasMany('group-user')
});
