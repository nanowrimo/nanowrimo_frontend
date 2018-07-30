import Model from 'ember-data/model';
import attr from 'ember-data/attr';
//import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
// import { isEmpty } from '@ember/utils';

const Region = Model.extend({
  name: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  groupType: attr('string'),
  slug: attr('string'),
  longitude: attr('number'),
  latitude: attr('number'),
  numberOfUsers: attr('number'),
  relationshipErrors: computed('locations.[]', function() {
    return null;
  })
});


export default Region;
