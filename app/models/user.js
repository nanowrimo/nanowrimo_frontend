import DS from 'ember-data';
import { alias }  from '@ember/object/computed';

const {
  attr,
  hasMany
} = DS;

export default DS.Model.extend({
  avatar: attr('string'),
  bio: attr('string'),
  createdAt: attr('date'),
  email: attr('string'),
  location: attr('string'),
  name: attr('string'),
  postalCode: attr('string'),
  statsLifetimeWordCount: attr('boolean'),
  statsNumberOfProjects: attr('boolean'),
  statsYearsDoneWon: attr('boolean'),
  statsWordiestNovel: attr('boolean'),
  statsAverageWritingPace: attr('boolean'),
  statsLongestNanoStreak: attr('boolean'),

  externalLinks: hasMany('externalLink', { async: false }),
  favoriteAuthors: hasMany('favoriteAuthor'),
  favoriteBooks: hasMany('favoriteBook'),

  slug: alias('name'),

  rollbackExternalLinks() {
    this.get('externalLinks').forEach((link) => {
      if (link) { link.rollback(); }
    });
  },

  save() {
    return this._super().then(() => {
      this.get('externalLinks').forEach(link => link.persistChanges());
    });
  }
});
