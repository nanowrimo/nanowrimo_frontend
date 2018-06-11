import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Model.extend({
  cover: attr('string'),
  createdAt: attr('date'),
  slug: attr('string'),
  status: attr('string'),
  title: attr('string'),
  unitCount: attr('number'),
  unitType: attr('string'),
  writingType: attr('string'),

  challenges: hasMany('challenge'),
  genres: hasMany('genre'),
  user: belongsTo('user'),

  completed: computed('status', function() {
    return this.get('status') === "Completed";
  }),
  concatGenres: computed('genres.[]', function() {
    let genreNames = this.get('genres').mapBy('name');
    return genreNames.join(", ");
  }),
  displayChallenge: computed('user', 'challenges.[]', function(){
    //let tz = this.get('user').get('timeZone');
    //console.log(tz);
  }),
  relationshipErrors: computed('genres.[]', function() {
    if (isEmpty(this.get('genres'))) {
      return { genres: 'Must select at least one genre' };
    }
    return null;
  })
});
