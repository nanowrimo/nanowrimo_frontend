import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
// import { isEmpty } from '@ember/utils';

const Project = Model.extend({
  cover: attr('string'),
  createdAt: attr('date'),
  excerpt: attr('string'),
  pinterestUrl: attr('string'),
  playlistUrl: attr('string'),
  primary: attr('boolean'),
  privacy: attr('string', { defaultValue: 'Only I Can See' }),
  slug: attr('string'),
  summary: attr('string'),
  status: attr('string', { defaultValue: 'In Progress' }),
  title: attr('string'),
  unitCount: attr('number'),
  unitType: attr('string'),
  wordCount: attr('number'),
  writingType: attr('string', { defaultValue: 'Novel' }),

  challenges: hasMany('challenge'),
  genres: hasMany('genre'),
  user: belongsTo('user'),


  _coverUrl: "/images/projects/unknown-cover.png",
  coverUrl: computed('cover', {
    get() {
      let cover = this.get('cover');
      if (cover && cover.includes(':')) {
        this.set('_coverUrl', cover);
      }
      return this.get('_coverUrl');
    }
  }),
  
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
    // if (isEmpty(this.get('genres'))) {
    //   return { genres: 'Must select at least one genre' };
    // }
    return null;
  })
});

Project.reopenClass({
  optionsForStatus: [
    'In Progress',
    'Completed'
  ],
  optionsForPrivacy: [
    'Only I Can See'
  ],
  optionsForWritingType: [
    'Novel'
  ]
});

export default Project;
