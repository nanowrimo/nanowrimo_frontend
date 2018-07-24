import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed }  from '@ember/object';
import { alias, sort, filterBy }  from '@ember/object/computed';

export default Model.extend({
  avatar: attr('string'),
  bio: attr('string'),
  createdAt: attr('date'),
  confirmedAt: attr('date'),
  email: attr('string'),
  location: attr('string'),
  name: attr('string'),
  slug: attr('string'),
  timeZone: attr('string'),
  plate: attr('string'),
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

  externalLinks: hasMany('externalLink'),
  favoriteAuthors: hasMany('favoriteAuthor'),
  favoriteBooks: hasMany('favoriteBook'),
  projectSessions: hasMany('projectSession'),
  
  // Group membership
  groups: hasMany('group'),
  groupUsers: hasMany('groupUser'),
  regions: filterBy('groups', 'groupType', 'region'),
  
  projects: hasMany('project'),
  _avatarUrl: "/images/users/unknown-avatar.png",
  avatarUrl: computed('avatar', {
    get() {
      let avatar = this.get('avatar');
      if (avatar && avatar.includes(':')) {
        this.set('_avatarUrl', avatar);
      }
      return this.get('_avatarUrl');
    }
  }),

  _plateUrl: null,
  plateUrl: computed('plate', {
    get() {
      let plate = this.get('plate');
      if (plate && plate.includes(':')) {
        this.set('_plateUrl', plate);
      }
      return this.get('_plateUrl');
    }
  }),

  isNotConfirmed: computed('confirmedAt', {
    get() {
      return this.get('confirmedAt')==null;
    }
  }),
  
  primarySortedProjects: sort('projects', function(a,b){return b.primary - a.primary;}),
  primaryProject: computed('primarySortedProjects', function(){
    let psp = this.get('primarySortedProjects');
    return psp.firstObject;
  }),
  
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
  },
});
