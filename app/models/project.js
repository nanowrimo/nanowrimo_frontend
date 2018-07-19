import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
import moment from 'moment';
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
  //unitCount: attr('number'),
  unitType: attr('string'),
  wordCount: attr('number'),
  writingType: attr('number', { defaultValue: '0' }),

  challenges: hasMany('challenge'),
  projectChallenges: hasMany('projectChallenge'),
  projectSessions: hasMany('projectSession'),
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
  
  unitCount: computed('project-sessions.[]', function() {
    // sum of the project.sessions counts where unit-type === 0 (words)
    let count=0;
    this.get('projectSessions').forEach((ps)=>{
      if (ps.unitType === 0 ) {
        count+=ps.count;
      }
    });
    return count;
  }),
  
  completed: computed('status', function() {
    return this.get('status') === "Completed";
  }),

  concatGenres: computed('genres.[]', function() {
    let genreNames = this.get('genres').mapBy('name');
    return genreNames.join(", ");
  }),
  activeProjectChallenge: computed('user.timeZone', 'projectChallenges.[]', function(){
    let pcs = this.get('projectChallenges');
    let user = this.get('user');
    let now = moment();
    //loop through the pcs
    let active;
    pcs.forEach((pc)=>{
      let now = moment();
      let start = moment(pc.startsAt);
      let end = moment(pc.endsAt);
      //is now between pc start and pc end?
      if (now.isSameOrAfter(start) && now.isSameOrBefore(end) ) {
        //this is the active project challenge
        active = pc;
      }
    });
    return active;
  }),
  
  relationshipErrors: computed('genres.[]', function() {
    // if (isEmpty(this.get('genres'))) {
    //   return { genres: 'Must select at least one genre' };
    // }
    return null;
  }),
  
  save() {
    let promiseArray = [];
    //persist the genres 
    this.get('genres').forEach((genre) => {
      // if the genre doesn't have an id, it needs to be saved
      if (!genre.id) {
        promiseArray.push( genre.save() );
      }
    });
    let _super = this._super;
    //resolve all of the genre save promises before saving this project
    return Promise.all(promiseArray).then(() => {
      return _super.call(this).then(()=>{
      });
    });
    
    
  }
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
