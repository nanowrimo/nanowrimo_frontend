import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed }  from '@ember/object';
import { sort, filter, filterBy }  from '@ember/object/computed';
import moment from 'moment';

const User = Model.extend({
  avatar: attr('string'),
  bio: attr('string'),
  createdAt: attr('date'),
  confirmedAt: attr('date'),
  notificationsViewedAt: attr('date'),
  email: attr('string'),
  location: attr('string'),
  name: attr('string'),
  slug: attr('string'),
  timeZone: attr('string'),
  plate: attr('string'),
  postalCode: attr('string'),
  registrationPath: attr('string'),
  currentPassword: attr('string'),
  newPassword: attr('string'),

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

  privacyViewBuddies: attr('number'),
  privacyViewProjects: attr('number'),
  privacyViewProfile: attr('number'),
  privacySendNanomessages: attr('number'),
  privacyViewSearch: attr('number'),

  privacyVisibilityRegions: attr('boolean'),
  privacyVisibilityBuddyLists: attr('boolean'),
  privacyVisibilityActivityLogs: attr('boolean'),

  externalLinks: hasMany('externalLink'),
  favoriteAuthors: hasMany('favoriteAuthor'),
  favoriteBooks: hasMany('favoriteBook'),

  //notification and emails
  notificationBuddyRequests: attr('boolean'),
  notificationNanomessagesMls: attr('boolean'),
  notificationWritingReminders: attr('boolean'),
  notificationBuddyActivities: attr('boolean'),
  notificationNanomessagesHq: attr('boolean'),
  notificationGoalMilestones: attr('boolean'),
  notificationEventsInHomeRegion: attr('boolean'),
  notificationSprintInvitation: attr('boolean'),
  notificationNewBadges: attr('boolean'),
  notificationNanomessagesBuddies: attr('boolean'),
  notificationSprintStart: attr('boolean'),
  emailNewsletter: attr('boolean'),
  emailEventsInHomeRegion: attr('boolean'),
  emailNanomessagesMls: attr('boolean'),
  emailBlogPosts: attr('boolean'),
  emailBuddyRequests: attr('boolean'),
  emailNanomessagesBuddies: attr('boolean'),
  emailNanomessagesHq: attr('boolean'),
  emailWritingReminders: attr('boolean'),
  
  settingSessionMoreInfo: attr('boolean'),
  notifications: hasMany('notification'),
  settingSessionCountBySession: attr('number'),
  projects: hasMany('project'),
  projectChallenges: hasMany('projectChallenge'),
  // Awarded badges
  userBadges: hasMany('user-badge'),
  
  //a user has many timers
  timers: hasMany('timer'),
  //a user has many stopwatches
  stopwatches: hasMany('stopwatch'),

  // Group membership
  groups: hasMany('group'),
  groupUsers: hasMany('group-user'),
  regions: filterBy('groups', 'groupType', 'region'),
  
  //groupUsersLoaded is false by default, is updated when groupUsers are loaded 
  groupUsersLoaded: false,
  
  avatarUnknownUrl: "/images/users/unknown-avatar.png",
  plateUnknownUrl: null,
  
  recalculateHome: 0,
  homeRegion: computed('regions.[]','groupUsers.[]','recalculateHome', function(){
    let r = this.get('regions');
    let gu = this.get('groupUsers');
    let maxPrimary = -1;
    let maxRegion = null;
    r.forEach(function(tgroup) {
      gu.forEach(function(tgu) {
        if (tgu.group_id==tgroup.id && tgu.primary>maxPrimary) {
          maxPrimary = tgu.primary;
          maxRegion = tgroup;
        }
      });
    });
    return maxRegion;
  }),

  //buddyGroupUsers: filterBy('groupUsers', 'groupType', 'buddies'),
  convoGroups: computed('groupUsers','groupUsers.@each.{invitationAccepted,exitAt}',function() {
    let gus = this.get('groupUsers');
    let bgus = [];
    gus.forEach(function(gu) {
      if ((gu.groupType=='buddies')&&(gu.exitAt==null)) {
        bgus.push(gu.group);
      }
    });
    return bgus;
  }),
  
  //buddyGroupUsers: filterBy('groupUsers', 'groupType', 'buddies'),
  buddyGroupUsers: computed('groupUsers.[]','groupUsers.@each.{invitationAccepted,exitAt}',function() {
    let gus = this.get('groupUsers');
    let bgus = [];
    gus.forEach(function(gu) {
      if ((gu.groupType=='buddies')&&(gu.exitAt==null)) {
        bgus.push(gu);
      }
    });
    return bgus;
  }),
  buddyGroupUsersAccepted: computed('buddyGroupUsers.[]','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    let accepted = [];
    bgus.forEach(function(bgu) {
      if (bgu.invitationAccepted=='1') {
        accepted.push(bgu);
      }
    });
    return accepted;
  }),
  buddyGroupUsersPending: computed('buddyGroupUsers','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    let pending = [];
    bgus.forEach(function(bgu) {
      if (bgu.invitationAccepted=='0') {
        pending.push(bgu);
      }
    });
    return pending;
  }),
  buddyGroupUsersBlocked: computed('buddyGroupUsers','buddyGroupUsers.@each.{invitationAccepted,entryAt}',function() {
    let bgus = this.get('buddyGroupUsers');
    let blocked = [];
    bgus.forEach(function(bgu) {
      if (bgu.invitationAccepted=='-2') {
        blocked.push(bgu);
      }
    });
    return blocked;
  }),
  buddyGroupsActive: computed('groupUsersLoaded','buddyGroupUsersAccepted.[]','buddyGroupUsersAccepted.@each.{invitationAccepted,entryAt}', function(){

    if (this.get('groupUsersLoaded')) {
      let bgus = this.get('buddyGroupUsersAccepted');
      let buddyGroups = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='1') && (gu.exitAt==null)) {
              buddyGroups.push(bgu.group);
            }
          }
        });
      });
      return buddyGroups;
    }
  }),
  
  buddiesActive: computed('buddyGroupUsersAccepted','buddyGroupUsersAccepted.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersAccepted');
      let buddies = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='1') && (gu.exitAt==null)) {
              buddies.push(u);
            }
          }
        });
      });
      return buddies;
    }
  }),
  buddiesInvited: computed('buddyGroupUsersAccepted','buddyGroupUsersAccepted.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersAccepted');
      let buddies = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='0')) {
              buddies.push(u);
            }
          }
        });
      });
      return buddies;
    }
  }),
  buddiesInvitedBy: computed('buddyGroupUsersPending','buddyGroupUsersPending.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersPending');
      let buddies = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='1')) {
              buddies.push(u);
            }
          }
        });
      });
      return buddies;
    }
  }),

  usersBlocked: computed('buddyGroupUsersBlocked','buddyGroupUsersBlocked.@each.{invitationAccepted,entryAt}', {
    get() {
      let bgus = this.get('buddyGroupUsersBlocked');
      let blocked = [];
      let store = this.get('store');
      let email = this.get('email');
      bgus.forEach(function(bgu) {
        let gus = bgu.group.get('groupUsers');
        gus.forEach(function(gu) {
          if (gu.user_id) {
            let u = store.peekRecord('user', gu.user_id);
            if ((u) && (u.email!=email) && (gu.invitationAccepted=='1')) {
              blocked.push(u);
            }
          }
        });
      });
      return blocked;
    }
  }),

  avatarUrl: computed('avatar', function() {
    let avatar = this.get('avatar');
    if (avatar && avatar.includes(':')) {
      return avatar; 
    } else {
      return this.get('avatarUnknownUrl');
    }
  }),

  plateUrl: computed('plate', function() {
    let plate = this.get('plate');
    if (plate && plate.includes(':')) {
      return plate; 
    } else {
      return this.get('plateUnknownUrl');
    }
  }),

  isNotConfirmed: computed('confirmedAt', {
    get() {
      return this.get('confirmedAt')==null;
    }
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

  loadGroupUsers(group_types) {
    let u = this;
    this.get('store').query('group-user',
    {
      filter: { user_id: u.id },
      group_types: group_types,
      include: 'user,group'

    }).then(()=>{
      this.set('groupUsersLoaded', true);
    });
  },

  projectsSortingCreatedDesc: Object.freeze(['createdAt:desc']),
  projectsSortedCreatedDesc: sort('projects','projectsSortingCreatedDesc'),
  
  primaryProject: computed('projects.{[],@each.primary}', function(){
    let ps = this.get('projects');
    let prime = ps.firstObject;

    //loop though the projects
    for(var i = 1; i < ps.length; i++ ) {
      var t_project = ps.objectAt(i);
      if (t_project.primary > prime.primary) {
        prime = t_project;
      }
    }
    return prime;
  }),

  //a user can only hae 1 timer active at a given time
  latestTimer: computed('timers.@each.{duration,start}', function() {
    //sort timers by start desc
    var sorted = this.get('timers').sortBy('start');
    if (sorted.length > 0) {
      let obj = sorted.lastObject;
      return obj;
    } else {
      return null;
    }
  }),

  //a user can only hae 1 stopwatch active at a given time
  latestStopwatch: computed('stopwatches.@each.{start,end}', function() {
    //sort stopwatchs by start desc
    var sorted = this.get('stopwatches').sortBy('start');
    if (sorted.length > 0) {
      let obj = sorted.lastObject;
      return obj;
    } else {
      return null;
    }
  }),

  persistedProjects: filter('projects.@each.id', function(project) {
    return project.id > 0;
  }),
  /* stats */
  //total word count
  totalWordCount: computed('projectChallenges.@each.count', function(){
    let sum = 0;
    this.get('projectChallenges').forEach( (pc)=>{
      if(pc.unitType===0) {//counting words
        sum+=pc.count;
      }
    });
    return sum;
  }),
  
  //get an array of nano years done
  yearsDone: computed('projects.@each.projectChallenges', function(){
    let ids = [];
    let years = [];
    this.get('projects').forEach((p)=>{
      p.challenges.forEach((c)=>{
        if(c.eventType===0 && !ids.includes(c.id)) { // counting words
          ids.push(c.id);
          years.push(c.startsAt.getYear());
        }
      });
    });
    return years;
  }),
  
  //how many times has the user won nano?
  nanoWinCount: computed('yearsWon', function(){
    let yw = this.get('yearsWon');
    return yw.length;
  }),
  
  //get an array of nano years won
   yearsWon: computed('projectChallenge.@each.metGoal', function(){
    let ids = [];
    let years = [];
    //loop the user's projects
    this.get('projectChallenges').forEach((pc)=>{
      //is the projectChallenge a nanowrimo?
      if(pc.nanoEvent && !ids.includes(pc.id)) { // counting words
        ids.push(pc.id);
        
        //did the project challenge win?
        if (pc.metGoal) {
          years.push(pc.startsAt.getFullYear());
        }
      }
    });
    return years;
  }),
  
  //most nanowrimo years in a row
  longestNanoStreak: computed('projects.@each.projectChallenges', function(){
    let ids = []; //track the ids of the challenges
    let years = []; //track the years participated
    this.get('projects').forEach((p)=>{
      p.challenges.forEach((c)=>{
        if(c.eventType===0 && !ids.includes(c.id)) { // nano event
          ids.push(c.id);
          years.push( c.startsAt.getYear() );
        }
      });
    });
    // sort the years array
    years.sort;
    let longest = 0;
    let count = 0;
    for(var i=0; i<years.length; i++) {
      let y1 = years[i];
      if (y1==years[0]) {
        count = 1;
      } else if (years[i]-1 == years[i-1]) {
        count+=1;
      } else {
        count = 1;
      }
      if (count > longest) {
        longest = count;
      }
    }
    
    return longest;
  }),
  
  highestWordCountProject: computed('projects.[]', function(){
    let highest;
    let highestCount=0;
    this.get('projects').forEach( (p)=>{
      
      if (p.totalWordCount > highestCount ){
        highest = p;
        highestCount = p.totalWordcount;
      }

    });
    return highest;
  }),
  
  highestWordCountProjectCount: computed('highestWordCountProject', function(){
    let c = this.get("highestWordCountProject.totalCount");
    if (!c>0) {
      return 0;
    } else {
      return c;
    }
  }),
  
  writingPace: computed('projectChallenge.@each.count', function(){
    let minutes = 0;
    let count = 0;
    //loop the project challenges
    this.get('projectChallenges').forEach((pc)=>{
      //is this a word based challenge?
      if(pc.unitType===0) {
        //loop the projectChallenge's projectSessions 
        pc.projectSessions.forEach( (ps)=>{
          //is there a start and end?
          if(ps.start && ps.end) {
            let start = moment(ps.start);
            let end = moment(ps.end);
            //get the difference in minutes
            minutes += end.diff(start,'minutes');
            count+= ps.count;
          }
        });
      }
    }); 
    if (minutes>0 && count) {
      return parseInt(count/minutes);
    } else {
      return 0;
    }
  }),
  
  save() {
    return this._super().then(() => {
      this.get('externalLinks').forEach(link => link.persistChanges());
      this.get('favoriteAuthors').forEach(author => author.persistChanges());
      this.get('favoriteBooks').forEach(book => book.persistChanges());
    });
  },
});

User.reopenClass({
  /* Some options are enumerated in the Rails API
   *  before editing these options, check that they match the API
   *  */

  optionsForPrivacyAccount:
  [
    {value:'1', name:'public', description:"Anyone with an account will be able to search for and view my profile"},
    {value:'0', name:'private', description:"Only my buddies can view my profile"},
  ],

  optionsForPrivacyProjects:
  [
    {value:'2', name:'Anyone with an account'},
    {value:'1', name:'Only my buddies'},
    {value:'0', name:'Only me'},
  ],
  optionsForPrivacyBuddies:
  [
    {value:'2', name:'Anyone with an account'},
    {value:'1', name:'Only my buddies'},
    {value:'0', name:'Only me'},
  ]
  
});

export default User;
