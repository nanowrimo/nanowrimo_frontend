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
  privacy: attr('number', { defaultValue: '0' }),
  slug: attr('string'),
  summary: attr('string'),
  status: attr('string', { defaultValue: 'In Progress' }),
  title: attr('string'),
  unitCount: attr('number'),
  unitType: attr('string'),
  wordCount: attr('number'),
  writingType: attr('number', { defaultValue: '0' }),

  challenges: hasMany('challenge'),
  projectChallenges: hasMany('projectChallenge'),
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
  /* Some options are enumerated in the Rails API
   *  before editing these options, check that they match the API
   *  */ 
  optionsForStatus: [
    'In Progress',
    'Completed'
  ],
  /* from the API: 
    ## PRIVACY ## 
  # Privacy is an integer value representing which group of users
  # an author has allowed to view a project.
  # 0 = self
  # 1 = buddies and MLs
  # 2 = buddies of buddies, and MLs
  # 3 = any signed in user
  */
  optionsForPrivacy: 
  [
    {value:'0', name:'Only I Can See'},
    {value:'1', name:'Only My Buddies And MLs Can See'},
    {value:'2', name:'Only MLs, And Buddies Of My Buddies Can See'},
    {value:'3', name:'Anyone Can See'},
    
  ], 
  
  // writing_type is an integer value representing the type of project 
  // the author is working on
  //  0 = Novel
  //  1 = Short Stories
  //  2 = Memoir
  //  3 = Script
  //  4 = Nonfiction
  //  5 = Poetry
  //  6 = Other
  optionsForWritingType: [
    {value:'0', name:'Novel'},
    {value:'1', name:'Short Stories'},
    {value:'2', name:'Memoir'},
    {value:'3', name:'Script'},
    {value:'4', name:'Nonfiction'},
    {value:'5', name:'Poetry'},
    {value:'6', name:'Other'}
  ]
});

export default Project;
