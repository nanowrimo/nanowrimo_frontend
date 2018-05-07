import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  bio: DS.attr('string'),
  
  statsLifetimeWordCount: DS.attr('boolean'), 
  statsNumberOfProjects: DS.attr('boolean'), 
  statsYearsDoneWon: DS.attr('boolean'), 
  statsWordiestNovel: DS.attr('boolean'), 
  statsAverageWritingPace: DS.attr('boolean'), 
  statsLongestNanoStreak: DS.attr('boolean'),
  
  externalLinks: DS.hasMany('externalLink'),
  favoriteAuthors: DS.hasMany('favoriteAuthor'),
  favoriteBooks: DS.hasMany('favoriteBook')
});

