import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

export default DS.Model.extend({
  avatar: attr('string'),
  bio: attr('string'),
  createdAt: attr('date'),
  email: attr('string'),
  name: attr('string'),
  postalCode: attr('string'),
  statsLifetimeWordCount: attr('boolean'), 
  statsNumberOfProjects: attr('boolean'), 
  statsYearsDoneWon: attr('boolean'), 
  statsWordiestNovel: attr('boolean'), 
  statsAverageWritingPace: attr('boolean'), 
  statsLongestNanoStreak: attr('boolean'),
  
  externalLinks: hasMany('externalLink'),
  favoriteAuthors: hasMany('favoriteAuthor'),
  favoriteBooks: hasMany('favoriteBook')
});

