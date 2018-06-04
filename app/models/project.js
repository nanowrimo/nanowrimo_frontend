import DS from 'ember-data';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default DS.Model.extend({
  challenges: DS.hasMany('challenge'),
  cover: DS.attr('string'),
  genres: DS.hasMany('genre'),
  title: DS.attr('string'),
  slug: DS.attr('string'),
  status: DS.attr('string'),
  unitCount: DS.attr('number'),
  unitType: DS.attr('string'),
  createdAt: DS.attr('date'),
  user: DS.belongsTo('user'),
  
  displayChallenge: computed("user", "challenges.[]", function(){
    //let tz = this.get('user').get('timeZone');
    //console.log(tz);
  }),
  
  completed: computed('status', function() {
    return this.get('status') === "Completed";
  }),
  concatGenres: computed('genres.[]', function() {
    let genreNames = this.get('genres').mapBy('name');
    return genreNames.join(", ");
  }),
  relationshipErrors: computed('genres.[]', function() {
    if (isEmpty(this.get('genres'))) {
      return { genres: 'Must select at least one genre' };
    }
    return null;
  })
});
