import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';
import attr from 'ember-data/attr';


const LocationGroup = Model.extend({
  location_id: attr('number'),
  group_id: attr('number'),
  location: belongsTo('location'),
  group: belongsTo('group'),
  primary: attr('number'),
  
});

export default LocationGroup;
