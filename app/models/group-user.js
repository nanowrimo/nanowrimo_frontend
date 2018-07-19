import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';


export default  Model.extend({
  is_admin: attr('boolean'),
  
  
  group: belongsTo('group', {async: false}),
  user: belongsTo('user', {async: false}),
  
});
