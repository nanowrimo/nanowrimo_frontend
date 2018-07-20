import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';


export default  Model.extend({
  is_admin: attr('boolean', { defaultValue: '0' }),
  invitation_accepted: attr('number', { defaultValue: '1' }),
  
  
  group: belongsTo('group'),
  user: belongsTo('user'),
  
});
