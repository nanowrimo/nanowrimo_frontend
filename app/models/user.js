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
