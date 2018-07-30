import Model from 'ember-data/model';
import attr from 'ember-data/attr';
//import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
// import { isEmpty } from '@ember/utils';

const Group = Model.extend({
  name: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  groupType: attr('string'),
  longitude: attr('number'),
  latitude: attr('number'),

  /*locations: hasMany('location'),
  locationGroups: hasMany('locationGroup'),
  location: computed('locations', {
    get() {
      return this.get('locations').get('firstObject');
    }
  }),
  longitude: computed('location', {
    get() {
      if (location === null) {
        return -122.4167;
      } else {
        return this.get('location').longitude;
      }
    }
  }),
  latitude: computed('location', {
    get() {
      if (location === null) {
        return 37.7833;
      } else {
        return this.get('location').latitude;
      }
    }
  }),*/
  relationshipErrors: computed('locations.[]', function() {
    return null;
  })
});


export default Group;
