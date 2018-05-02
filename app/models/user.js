import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  bio: DS.attr('string'),
  externalLinks: DS.hasMany('externalLink'),
  favoriteAuthors: DS.hasMany('favoriteAuthor'),
  favoriteBooks: DS.hasMany('favoriteBook')
});

