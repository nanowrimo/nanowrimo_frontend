import DS from 'ember-data';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default DS.Model.extend({
  genres: DS.hasMany('genre'),

  name: DS.attr('string'),

  relationshipErrors: computed('genres.[]', function() {
    if (isEmpty(this.get('genres'))) {
      return { genres: 'Must select at least one genre' };
    }
    return null;
  })
});
