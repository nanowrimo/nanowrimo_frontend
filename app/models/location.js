import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';

const Location = Model.extend({
  name: attr('string'),
  longitude: attr('number'),
  latitude: attr('number'),

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
