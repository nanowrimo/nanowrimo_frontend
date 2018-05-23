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

  statsStreakEnabled: attr('boolean'),
  statsStreak: attr('number'),
  statsProjectsEnabled: attr('boolean'),
  statsProjects: attr('number'),
  statsWordCountEnabled: attr('boolean'),
  statsWordCount: attr('number'),
  statsWritingPaceEnabled: attr('boolean'),
  statsWritingPace: attr('number'),
  statsWordiestEnabled: attr('boolean'),
  statsWordiest: attr('number'),
  statsYearsEnabled: attr('boolean'),
  statsYearsDone: attr('string'),
  statsYearsWon: attr('string'),

  externalLinks: hasMany('externalLink', { async: false }),
  favoriteAuthors: hasMany('favoriteAuthor', { async: false }),
  favoriteBooks: hasMany('favoriteBook', { async: false }),

  slug: alias('name'),

  rollbackExternalLinks() {
    this.get('externalLinks').forEach(link => {
      if (link) { link.rollback(); }
    });
  },

  rollbackFavorites() {
    this.get('favoriteAuthors').forEach(author => {
      if (author) { author.rollback(); }
    });
    this.get('favoriteBooks').forEach(book => {
      if (book) { book.rollback(); }
    });
  },

  save() {
    return this._super().then(() => {
      this.get('externalLinks').forEach(link => link.persistChanges());
      this.get('favoriteAuthors').forEach(author => author.persistChanges());
      this.get('favoriteBooks').forEach(book => book.persistChanges());
    });
  }
});
