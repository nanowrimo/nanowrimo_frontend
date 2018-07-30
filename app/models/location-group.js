import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';


const LocationGroup = Model.extend({
  
  location: belongsTo('location'),
  group: belongsTo('group'),
  
});

export default LocationGroup;
