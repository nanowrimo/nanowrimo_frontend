import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';


const RegionUser = Model.extend({
  is_admin: attr('boolean'),
  
  
  region: belongsTo('region'),
  user: belongsTo('user'),
  
});

export default RegionUser;
