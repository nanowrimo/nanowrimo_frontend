import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import DS from 'ember-data';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
import moment from 'moment';
// import { isEmpty } from '@ember/utils';

const Project = Model.extend({
  user_id: attr('number'),
  cover: attr('string'),
  createdAt: attr('date'),
  excerpt: attr('string'),
  pinterestUrl: attr('string'),
  playlistUrl: attr('string'),
  primary: attr('number'),
  unitCount: attr('number'),
  privacy: attr('number', { defaultValue: '2' }),
  slug: attr('string'),
  summary: attr('string'),
  status: attr('string', { defaultValue: 'Prepping' }),
  title: attr('string'),
  writingType: attr('number', { defaultValue: '0' }),
  challenges: hasMany('challenge'),
  projectChallenges: hasMany('projectChallenge'),
  projectSessions: hasMany('projectSession'),
  genres: hasMany('genre'),

  user: belongsTo('user'),

  // Awarded badges
  userBadges: hasMany('user-badge'),
  
  // Returns all users in store
  allUsers: computed(function() {
    return this.get('store').peekAll('user');
  }),
  
  
  // Finds the author without established relationship
  computedAuthor: computed('allUsers.@each.id', function() {
    let uid = this.get('user_id');
    let us = this.get('allUsers');
    let author = null;
    us.forEach((u)=> {
      if (u.id==uid) {
        author = u;
      }
    });
    return author;
  }),
  
  // Returns all projectChallenges in store
  allProjectChallenges: computed(function() {
    return this.get('store').peekAll('projectChallenge');
  }),
  
  // Finding projectChallenges without needing relationships
  computedProjectChallenges: computed('allProjectChallenges.@each.id',function() {
    let pid = this.get('id');
    let pcs = this.get('allProjectChallenges');
    let newpcs = [];
    pcs.forEach((pc)=> {
      if (pc.project_id==pid) {
        newpcs.push(pc);
      }
    });
    return newpcs;
  }),
  
  // Returns all projectChallenges in store
  allDailyAggregates: computed(function() {
    return this.get('store').peekAll('dailyAggregate');
  }),
  
  // Finding projectChallenges without needing relationships
  computedDailyAggregates: computed('allDailyAggregates.@each.id',function() {
    let pid = this.get('id');
    let das = this.get('allDailyAggregates');
    let newdas = [];
    das.forEach((da)=> {
      if (da.project_id==pid) {
        newdas.push(da);
      }
    });
    return newdas;
  }),
  
  // get the user from the store based on this.user_id
  computedUser: computed('user_id', function(){
    // make sure the user_id exists
    let uid = this.get('user_id');
    if (uid==null) {
      return null;
    }
    // get the user from the store with the given id
    let user = this.get('store').peekRecord('user', uid);
    return user;
  }),
  
  defaultCoverUrl: computed('genres.[]', function(){
    let cover = "/images/projects/default-cover.svg";
    this.get('genres').forEach((g)=>{
      if (g.name.toLowerCase() == "science fiction") {
        cover = "/images/projects/default-science-fiction-cover.svg";
      } else if (g.name.toLowerCase() == "romance") {
        cover = "/images/projects/default-romance-cover.svg";
      } else if (g.name.toLowerCase() == "fantasy") {
        cover = "/images/projects/default-fantasy-cover.svg";
      }
    });
    return cover;
  }),
  coverUrl: computed('cover', 'defaultCoverUrl', function(){

    let cover = this.get('cover');
    if (cover && cover.includes(':')) {
      return cover;
    } else {
      return this.get('defaultCoverUrl');
    }
  }),

  isPrimary: computed('user.projects.@each.primary', function(){
    return this === this.get('user.primaryProject');
  }),
  isNotPrimary: computed('isPrimary',function(){
    return !this.get('isPrimary');
  }),
  /*unitCount: computed('projectSessions.[]',{
    get() {
      // sum of the project.sessions counts where unit-type === 0 (words)
      let count=0;
      this.get('projectSessions').forEach((ps)=>{
        if (ps.unitType === 0 ) {
          count+=ps.count;
        }
      });
      return count;
    }
  }),*/
  
  completed: computed('status', function() {
    return this.get('status') === "Completed";
  }),

  concatGenres: computed('genres.[]', function() {
    let genreNames = this.get('genres').mapBy('name');
    return genreNames.join(", ");
  }),

  // Truncates the project title to 25 characters
  truncatedTitle: computed('title', function() {
    let str = this.get('title');
    if (str.length <= 35) {
      return str;
    }
    return str.slice(0, 35) + '...'
  }),
  
  hasProjectChallenges: computed('computedProjectChallenges.[]', function(){
    let pc = this.get('computedProjectChallenges');
    if (pc) {
      return (pc.length>0) ? true : false; 
    } else {
      return false;
    }

  }),

  activeProjectChallenge: computed('projectChallenges.{[],@each.startsAt,@each.endsAt}', function() {
    let active = null;
    // get the user from the store using user_id
    let user = this.get('computedUser');    
    //get the time now in user's timezone 
    let tz = user.timeZone;
    
    let now = moment().tz(tz);
    
    //loop through this project's projectChallenges
    this.get('projectChallenges').forEach((pc)=>{
      //get the start and end as moments
      let startsAt = moment(pc.startsAt).tz(tz);
      //let isEvent = pc.nanoEvent;
      if ((pc.eventType===0)) {
        let cStart = moment(pc.startsAt);
        let newStart = cStart.utc().format("YYYY-MM-DD");
        var m = moment.tz(newStart, "YYYY-MM-DD", tz);
        startsAt = m.clone().startOf('day').utc();
      }
      //is this pc active?
      if (now.isSameOrAfter(startsAt,'d') && !pc.hasEnded ) {
        active = pc;
      }
    });
    //alert(active);
    return active;
  }),

  futureProjectChallenge: computed('projectChallenges.{[],@each.startsAt,@each.endsAt}', function() {
    let active = null;
    //loop through this project's projectChallenges
    this.get('projectChallenges').forEach((pc)=>{
      if (!pc.hasEnded ) {
        active = pc;
      }
    });
    //alert(active);
    return active;
  }),

  latestProjectChallenge: computed('projectChallenges.[]', function(){
    const promise = this.get('projectChallenges').then((pcs)=>{
      //loop through the pcs
      let latest = null;
      pcs.forEach((pc)=>{
        if (latest==null) {
          latest = pc;
        } else {
          let lend = moment(latest.endsAt);
          let end = moment(pc.endsAt);
          if (end.isSameOrAfter(lend) ) {
            //this is the latest project challenge
            latest = pc;
          }
        }
      });
      return latest;
    });
    return  DS.PromiseObject.create({promise});
  }),
  // compute total word count for this a project
  /*totalWordCount: computed('projectSessions.[]', function(){
    let count=0;
    //get the project challenges 
    this.get('projectChallenges').forEach((pc)=>{
      if(pc.unitType===0) { //counting words
        count+=pc.count;
      }
    });
    return count;
  }),*/
  
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
  },
  //define the path to the flippyDoodle graphical asset  
  flippyDoodlePath: computed('status', function(){
    let status = this.get('status');
    switch(status){
      case "In Progress":
        return `/images/users/projects/flippy-doodle-in-progress.png`;
      case "Prepping":
      case "Ready for Progress":
        return `/images/users/projects/flippy-doodle-prepping.png`;
      case "Drafted":
        return `/images/users/projects/flippy-doodle-drafted.png`;
      case "Completed":
        return `/images/users/projects/flippy-doodle-completed.png`;
      case "Published":
        return `/images/users/projects/flippy-doodle-published.png`;
    }
    return null;
  }),
  
  currentProjectChallenge: computed('projectChallenge.{[],@each.startsAt,@each.endsAt}','computedProjectChallenges.[]','allProjectChallenges.[]', function() {
    let active = null;
    let latest = null;
    let pending = null;
    //get the time now in user's timezone 
    let tz = this.get('computedUser.timeZone')
    if (tz==null) {
      return null;
    }
    let now = moment().tz(tz);
    //loop through this project's projectChallenges
    this.get('computedProjectChallenges').forEach((pc)=>{
      //get the start and end as moments
      let endsAt = moment(pc.endsAt);
      let startsAt = moment(pc.startsAt);
      //is this pc active?
      if (now.isAfter(startsAt) && now.isBefore(endsAt)) {
        active = pc;
      }
      // determine the lastest projectChallenge
      if (latest==null) {
        latest = pc;
      }else{
        let lend = moment(latest.endsAt);
        if (endsAt.isSameOrAfter(lend) ) {
          //this is the latest project challenge
          latest = pc;
        }
      }
      //determine the pending?
      
      if (startsAt.isAfter(now) ) {
        if (pending==null) {
          pending = pc;
        } else {
          if (startsAt.isBefore( moment(pending.startsAt) )){
            pending = pc;
          }
        }
      }
    });
    if (active) {
      return active;
    } else if (pending){ 
      return pending;
    } else {
      return latest;
    }
  })
});

Project.reopenClass({
  /* Some options are enumerated in the Rails API
   *  before editing these options, check that they match the API
   *  */
  optionsForStatus: [
    'Prepping', 'In Progress', 'Drafted', 'Completed', 'Published'
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
    {value:'0', name:'Only Me'},
    {value:'1', name:'Buddies'},
    {value:'2', name:'Public'}
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
