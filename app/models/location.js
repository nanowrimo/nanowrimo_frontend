import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';

const Location = Model.extend({
  name: attr('string'),
  longitude: attr('number'),
  latitude: attr('number'),
  street1: attr('string'),
  street2: attr('string'),
  neighborhood: attr('string'),
  municipality: attr('string'),
  city: attr('string'),
  county: attr('string'),
  state: attr('string'),
  postal_code: attr('string'),
  country: attr('string'),
  formatted_address: attr('string'),
  utc_offset: attr('number'),
  approved_by_id: attr('number'),
  user_id: attr('number'),
  groups: hasMany('group'),
  locationGroups: hasMany('locationGroup'),
  relationshipErrors: computed('locations.[]', function() {
    // if (isEmpty(this.get('genres'))) {
    //   return { genres: 'Must select at least one genre' };
    // }
    return null;
  })
});


export default Location;
